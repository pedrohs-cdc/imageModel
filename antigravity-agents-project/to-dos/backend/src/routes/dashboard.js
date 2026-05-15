const express = require('express');
const { getDb } = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/dashboard
router.get('/', (req, res) => {
  const db = getDb();
  const uid = req.userId;

  const total = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id = ? AND archived_at IS NULL").get(uid).c;
  const doneToday = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id = ? AND status = 'done' AND archived_at IS NULL AND date(updated_at) = date('now')").get(uid).c;
  const overdue = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id = ? AND archived_at IS NULL AND status != 'done' AND due_date IS NOT NULL AND date(due_date) < date('now')").get(uid).c;
  const inProgress = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id = ? AND status = 'in_progress' AND archived_at IS NULL").get(uid).c;
  const totalDone = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id = ? AND status = 'done' AND archived_at IS NULL").get(uid).c;
  const completionRate = total > 0 ? Math.round((totalDone / total) * 100) : 0;

  const byPriority = db.prepare("SELECT priority, COUNT(*) as count FROM tasks WHERE user_id = ? AND archived_at IS NULL AND status != 'done' GROUP BY priority").all(uid);
  const byStatus = db.prepare("SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? AND archived_at IS NULL GROUP BY status").all(uid);
  const byCategory = db.prepare("SELECT c.name, c.color, COUNT(t.id) as count FROM tasks t JOIN categories c ON t.category_id = c.id WHERE t.user_id = ? AND t.archived_at IS NULL GROUP BY c.id ORDER BY count DESC LIMIT 5").all(uid);

  // Produtividade — ultimos 7 dias
  const rawDays = db.prepare("SELECT date(updated_at) as day, COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'done' AND archived_at IS NULL AND date(updated_at) >= date('now', '-6 days') GROUP BY day").all(uid);
  const productivity = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const found = rawDays.find(r => r.day === dateStr);
    productivity.push({ date: dateStr, count: found ? found.count : 0 });
  }

  // Streak — dias consecutivos com ao menos 1 tarefa concluida
  let streak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDone = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id = ? AND status = 'done' AND date(updated_at) = ?").get(uid, todayStr).c;
  if (todayDone > 0) {
    streak = 1;
    const d = new Date();
    d.setDate(d.getDate() - 1);
    while (true) {
      const ds = d.toISOString().split('T')[0];
      const cnt = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id = ? AND status = 'done' AND date(updated_at) = ?").get(uid, ds).c;
      if (cnt === 0) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
  }

  // Proximas tarefas (7 dias)
  const upcoming = db.prepare(`
    SELECT t.*, c.name as category_name, c.color as category_color
    FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.archived_at IS NULL AND t.status != 'done'
    AND t.due_date IS NOT NULL
    AND date(t.due_date) >= date('now')
    AND date(t.due_date) <= date('now', '+7 days')
    ORDER BY t.due_date ASC LIMIT 8
  `).all(uid);

  res.json({ total, doneToday, overdue, inProgress, totalDone, completionRate, streak, byPriority, byStatus, byCategory, productivity, upcoming });
});

module.exports = router;
