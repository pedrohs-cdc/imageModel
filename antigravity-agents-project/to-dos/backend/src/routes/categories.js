const express = require('express');
const { getDb } = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/categories
router.get('/', (req, res) => {
  const db = getDb();
  const categories = db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC').all(req.userId);
  res.json(categories);
});

// POST /api/categories
router.post('/', (req, res) => {
  const { name, color, icon } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Nome obrigatorio.' });

  const db = getDb();
  const result = db.prepare('INSERT INTO categories (user_id, name, color, icon) VALUES (?, ?, ?, ?)')
    .run(req.userId, name.trim(), color || '#7C6FFF', icon || 'folder');

  res.status(201).json(db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/categories/:id
router.put('/:id', (req, res) => {
  const { name, color, icon } = req.body;
  const db = getDb();
  const cat = db.prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!cat) return res.status(404).json({ error: 'Categoria nao encontrada.' });

  const updates = [];
  const values = [];
  if (name) { updates.push('name = ?'); values.push(name.trim()); }
  if (color) { updates.push('color = ?'); values.push(color); }
  if (icon) { updates.push('icon = ?'); values.push(icon); }

  if (updates.length > 0) {
    values.push(req.params.id, req.userId);
    db.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
  }

  res.json(db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id));
});

// DELETE /api/categories/:id
router.delete('/:id', (req, res) => {
  const db = getDb();
  const cat = db.prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!cat) return res.status(404).json({ error: 'Categoria nao encontrada.' });

  db.prepare('UPDATE tasks SET category_id = NULL WHERE category_id = ? AND user_id = ?').run(req.params.id, req.userId);
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
