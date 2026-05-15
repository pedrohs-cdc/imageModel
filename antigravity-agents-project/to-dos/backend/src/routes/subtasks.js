const express = require('express');
const { getDb } = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });
router.use(auth);

// POST /api/tasks/:taskId/subtasks
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Titulo obrigatorio.' });

  const db = getDb();
  const task = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(req.params.taskId, req.userId);
  if (!task) return res.status(404).json({ error: 'Tarefa nao encontrada.' });

  const pos = db.prepare('SELECT COALESCE(MAX(position), -1) + 1 as next FROM subtasks WHERE task_id = ?').get(req.params.taskId).next;
  const result = db.prepare('INSERT INTO subtasks (task_id, title, position) VALUES (?, ?, ?)').run(req.params.taskId, title.trim(), pos);

  res.status(201).json(db.prepare('SELECT * FROM subtasks WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/tasks/:taskId/subtasks/:id
router.put('/:id', (req, res) => {
  const { title, done } = req.body;
  const db = getDb();

  const sub = db.prepare('SELECT s.* FROM subtasks s JOIN tasks t ON s.task_id = t.id WHERE s.id = ? AND t.user_id = ?').get(req.params.id, req.userId);
  if (!sub) return res.status(404).json({ error: 'Subtarefa nao encontrada.' });

  const newTitle = title !== undefined ? title.trim() : sub.title;
  const newDone = done !== undefined ? (done ? 1 : 0) : sub.done;

  db.prepare('UPDATE subtasks SET title = ?, done = ? WHERE id = ?').run(newTitle, newDone, req.params.id);
  res.json(db.prepare('SELECT * FROM subtasks WHERE id = ?').get(req.params.id));
});

// DELETE /api/tasks/:taskId/subtasks/:id
router.delete('/:id', (req, res) => {
  const db = getDb();
  const sub = db.prepare('SELECT s.id FROM subtasks s JOIN tasks t ON s.task_id = t.id WHERE s.id = ? AND t.user_id = ?').get(req.params.id, req.userId);
  if (!sub) return res.status(404).json({ error: 'Subtarefa nao encontrada.' });

  db.prepare('DELETE FROM subtasks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
