require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { getDb } = require('./db/database');
const { startJobs } = require('./services/notificationService');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const subtaskRoutes = require('./routes/subtasks');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const dashboardRoutes = require('./routes/dashboard');
const exportRoutes = require('./routes/export');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Inicializa o banco e os Cron Jobs ao subir o servidor
getDb();
startJobs();

app.use(helmet());

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json());

// Rate limit apenas no login (5 tentativas por minuto por IP)
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas. Tente novamente em 1 minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/auth/login', loginLimiter);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/:taskId/subtasks', subtaskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Erro 404
app.use((req, res) => res.status(404).json({ error: 'Rota nao encontrada.' }));

// Erro global
app.use((err, req, res, _next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`[TaskFlow API] Rodando em http://localhost:${PORT}`);
});
