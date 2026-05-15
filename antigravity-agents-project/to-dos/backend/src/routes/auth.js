const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { getDb } = require('../db/database');

const router = express.Router();

const FIXED_CATEGORIES = [
  { name: 'Trabalho', color: '#7C6FFF', icon: 'briefcase' },
  { name: 'Pessoal', color: '#FF6B6B', icon: 'user' },
  { name: 'Estudos', color: '#43E97B', icon: 'book' },
  { name: 'Casa', color: '#FFA26B', icon: 'home' },
];

const registerSchema = z.object({
  name: z.string().min(2, 'Nome precisa ter ao menos 2 caracteres').max(100),
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha precisa ter ao menos 6 caracteres'),
  photo_url: z.string().url().optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, photo_url } = registerSchema.parse(req.body);
    const db = getDb();

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Este email ja esta cadastrado.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash, photo_url) VALUES (?, ?, ?, ?)'
    ).run(name, email, password_hash, photo_url || null);

    const userId = result.lastInsertRowid;

    // Categorias fixas para novo usuario
    for (const cat of FIXED_CATEGORIES) {
      db.prepare('INSERT INTO categories (user_id, name, color, icon) VALUES (?, ?, ?, ?)')
        .run(userId, cat.name, cat.color, cat.icon);
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, name, email, photo_url: photo_url || null } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados invalidos.', details: err.errors });
    }
    console.error('[Auth Register]', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const db = getDb();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Credenciais invalidas.' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Credenciais invalidas.' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, photo_url: user.photo_url } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados invalidos.' });
    }
    console.error('[Auth Login]', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Nao autenticado.' });
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDb();
    const user = db.prepare('SELECT id, name, email, photo_url, created_at FROM users WHERE id = ?').get(payload.userId);
    if (!user) return res.status(404).json({ error: 'Usuario nao encontrado.' });
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Token invalido.' });
  }
});

module.exports = router;
