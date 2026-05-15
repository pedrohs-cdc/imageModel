const express = require('express');
const { z } = require('zod');
const { getDb } = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
  category_id: z.number().optional().nullable(),
  due_date: z.string().optional().nullable(),
  recurrence: z.string().optional().nullable(),
  tag_ids: z.array(z.number()).optional(),
});

// Busca tags de uma tarefa
function getTaskTags(db, taskId) {
  return db.prepare(`
    SELECT t.* FROM tags t
    JOIN task_tags tt ON t.id = tt.tag_id
    WHERE tt.task_id = ?
  `).all(taskId);
}

// Busca subtarefas de uma tarefa
function getSubtasks(db, taskId) {
  return db.prepare('SELECT * FROM subtasks WHERE task_id = ? ORDER BY position ASC').all(taskId);
}

// GET /api/tasks
router.get('/', (req, res) => {
  const db = getDb();
  const { status, priority, category_id, search, order_by, tag_id, archived } = req.query;

  let query = `
    SELECT t.*, c.name as category_name, c.color as category_color,
      (SELECT COUNT(*) FROM subtasks s WHERE s.task_id = t.id) as subtask_count,
      (SELECT COUNT(*) FROM subtasks s WHERE s.task_id = t.id AND s.done = 1) as subtask_done_count
    FROM tasks t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
  `;
  const params = [req.userId];

  if (archived === 'true') {
    query += ' AND t.archived_at IS NOT NULL';
  } else {
    query += ' AND t.archived_at IS NULL';
  }

  if (status) { query += ' AND t.status = ?'; params.push(status); }
  if (priority) { query += ' AND t.priority = ?'; params.push(priority); }
  if (category_id) { query += ' AND t.category_id = ?'; params.push(Number(category_id)); }
  if (search) { query += ' AND t.title LIKE ?'; params.push(`%${search}%`); }
  if (tag_id) {
    query += ' AND t.id IN (SELECT task_id FROM task_tags WHERE tag_id = ?)';
    params.push(Number(tag_id));
  }

  const orderMap = {
    due_date: 't.due_date ASC NULLS LAST',
    priority: "CASE t.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END",
    created_at: 't.created_at DESC',
  };
  query += ` ORDER BY ${orderMap[order_by] || 't.created_at DESC'}`;

  const tasks = db.prepare(query).all(...params);
  const result = tasks.map(task => ({
    ...task,
    tags: getTaskTags(db, task.id),
    subtasks: getSubtasks(db, task.id),
  }));

  res.json(result);
});

// POST /api/tasks
router.post('/', (req, res) => {
  try {
    const data = taskSchema.parse(req.body);
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO tasks (user_id, title, description, priority, status, category_id, due_date, recurrence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.userId,
      data.title,
      data.description || null,
      data.priority,
      data.status || 'pending',
      data.category_id || null,
      data.due_date || null,
      data.recurrence || null,
    );

    const taskId = result.lastInsertRowid;

    if (data.tag_ids && data.tag_ids.length > 0) {
      for (const tagId of data.tag_ids) {
        db.prepare('INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)').run(taskId, tagId);
      }
    }

    const task = db.prepare(`
      SELECT t.*, c.name as category_name, c.color as category_color
      FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(taskId);

    res.status(201).json({ ...task, tags: getTaskTags(db, taskId), subtasks: [] });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados invalidos.', details: err.errors });
    }
    console.error('[Tasks POST]', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  try {
    const data = taskSchema.partial().parse(req.body);
    const db = getDb();

    const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
    if (!existing) return res.status(404).json({ error: 'Tarefa nao encontrada.' });

    const fields = [];
    const values = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.priority !== undefined) { fields.push('priority = ?'); values.push(data.priority); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); values.push(data.category_id); }
    if (data.due_date !== undefined) { fields.push('due_date = ?'); values.push(data.due_date); }
    if (data.recurrence !== undefined) { fields.push('recurrence = ?'); values.push(data.recurrence); }

    if (fields.length > 0) {
      fields.push("updated_at = datetime('now')");
      values.push(req.params.id, req.userId);
      db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
    }

    if (data.tag_ids !== undefined) {
      db.prepare('DELETE FROM task_tags WHERE task_id = ?').run(req.params.id);
      for (const tagId of data.tag_ids) {
        db.prepare('INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)').run(req.params.id, tagId);
      }
    }

    const updated = db.prepare(`
      SELECT t.*, c.name as category_name, c.color as category_color
      FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ?
    `).get(req.params.id);

    res.json({ ...updated, tags: getTaskTags(db, req.params.id), subtasks: getSubtasks(db, req.params.id) });
  } catch (err) {
    console.error('[Tasks PUT]', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['pending', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Status invalido.' });
  }
  const db = getDb();
  const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: 'Tarefa nao encontrada.' });

  db.prepare("UPDATE tasks SET status = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?")
    .run(status, req.params.id, req.userId);

  res.json({ success: true });
});

// DELETE /api/tasks/:id — soft delete
router.delete('/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: 'Tarefa nao encontrada.' });

  db.prepare("UPDATE tasks SET archived_at = datetime('now') WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.userId);

  res.json({ success: true });
});

module.exports = router;
