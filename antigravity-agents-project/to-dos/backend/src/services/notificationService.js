const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { getDb } = require('../db/database');

// Configuração do Nodemailer (Usando modo de desenvolvimento / console)
const transporter = nodemailer.createTransport({
  streamTransport: true,
  newline: 'windows'
});

async function sendDailyEmailReport() {
  const db = getDb();
  console.log('[NotificationService] Iniciando envio de relatórios diários por e-mail...');

  try {
    const users = db.prepare('SELECT id, name, email FROM users').all();
    const todayStr = new Date().toISOString().substring(0, 10);

    for (const user of users) {
      // Buscar tarefas do dia para o usuário
      const tasksToday = db.prepare(`
        SELECT title, priority, due_date 
        FROM tasks 
        WHERE user_id = ? AND date(due_date) = ? AND status != 'done' AND archived_at IS NULL
      `).all(user.id, todayStr);

      if (tasksToday.length > 0) {
        let taskListHtml = tasksToday.map(t => `<li><b>${t.title}</b> (Prioridade: ${t.priority})</li>`).join('');
        
        const mailOptions = {
          from: '"TaskFlow Premium" <noreply@taskflow.com>',
          to: user.email,
          subject: `Resumo do Dia: Você tem ${tasksToday.length} tarefa(s) para hoje!`,
          html: `
            <h2>Olá, ${user.name.split(' ')[0]}!</h2>
            <p>Aqui está o seu resumo de tarefas para hoje:</p>
            <ul>
              ${taskListHtml}
            </ul>
            <p>Acesse o TaskFlow para gerenciá-las.</p>
          `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Mock] Enviado para ${user.email}:\n${info.message.toString()}`);
      }
    }
  } catch (err) {
    console.error('[NotificationService] Erro ao enviar e-mails diários:', err);
  }
}

function checkDueTasks() {
  const db = getDb();
  console.log('[NotificationService] Verificando tarefas próximas do vencimento e atrasadas...');

  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().substring(0, 10);
    const tomorrowStr = tomorrow.toISOString().substring(0, 10);

    // 1. Tarefas que vencem amanhã
    const dueTomorrow = db.prepare(`
      SELECT id, user_id, title 
      FROM tasks 
      WHERE date(due_date) = ? AND status != 'done' AND archived_at IS NULL
    `).all(tomorrowStr);

    for (const task of dueTomorrow) {
      // Evitar notificação duplicada
      const exists = db.prepare(`
        SELECT id FROM notifications 
        WHERE user_id = ? AND title = 'Vence Amanhã' AND message LIKE ?
      `).get(task.user_id, `%${task.title}%`);

      if (!exists) {
        db.prepare(`
          INSERT INTO notifications (user_id, title, message)
          VALUES (?, 'Vence Amanhã', ?)
        `).run(task.user_id, `Ei, sua tarefa "${task.title}" vence amanhã!`);
      }
    }

    // 2. Tarefas atrasadas (vencidas antes de hoje)
    const overdueTasks = db.prepare(`
      SELECT id, user_id, title 
      FROM tasks 
      WHERE date(due_date) < ? AND status != 'done' AND archived_at IS NULL
    `).all(todayStr);

    for (const task of overdueTasks) {
      const exists = db.prepare(`
        SELECT id FROM notifications 
        WHERE user_id = ? AND title = 'Tarefa Atrasada' AND message LIKE ?
      `).get(task.user_id, `%${task.title}%`);

      if (!exists) {
        db.prepare(`
          INSERT INTO notifications (user_id, title, message)
          VALUES (?, 'Tarefa Atrasada', ?)
        `).run(task.user_id, `A tarefa "${task.title}" tá atrasada!`);
      }
    }

  } catch (err) {
    console.error('[NotificationService] Erro ao verificar tarefas:', err);
  }
}

function startJobs() {
  // Roda todo dia às 08:00 da manhã
  cron.schedule('0 8 * * *', () => {
    sendDailyEmailReport();
  });

  // Roda a cada hora para checar prazos
  cron.schedule('0 * * * *', () => {
    checkDueTasks();
  });

  // Roda imediatamente 10 segundos após o boot para fins de teste
  setTimeout(() => {
    checkDueTasks();
  }, 10000);
}

module.exports = { startJobs, checkDueTasks, sendDailyEmailReport };
