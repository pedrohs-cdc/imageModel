const express = require('express');
const { getDb } = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/tags
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM tags WHERE user_id = ? ORDER BY name ASC').all(req.userId));
});

// POST /api/tags
router.post('/', (req, res) => {
  const { name, color } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Nome obrigatorio.' });

  const db = getDb();
  const result = db.prepare('INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)')
    .run(req.userId, name.trim(), color || '#43E97B');

  res.status(201).json(db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/tags/:id
router.put('/:id', (req, res) => {
  const { name, color } = req.body;
  const db = getDb();
  const tag = db.prepare('SELECT id FROM tags WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!tag) return res.status(404).json({ error: 'Tag nao encontrada.' });

  const updates = [];
  const values = [];
  if (name) { updates.push('name = ?'); values.push(name.trim()); }
  if (color) { updates.push('color = ?'); values.push(color); }

  if (updates.length > 0) {
    values.push(req.params.id);
    db.prepare(`UPDATE tags SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }

  res.json(db.prepare('SELECT * FROM tags WHERE id = ?').get(req.params.id));
});

// DELETE /api/tags/:id
router.delete('/:id', (req, res) => {
  const db = getDb();
  const tag = db.prepare('SELECT id FROM tags WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!tag) return res.status(404).json({ error: 'Tag nao encontrada.' });

  db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
