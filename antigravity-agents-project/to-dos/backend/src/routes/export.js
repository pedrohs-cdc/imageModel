const express = require('express');
const { getDb } = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/export
router.get('/', (req, res) => {
  const { format } = req.query;
  const db = getDb();

  const tasks = db.prepare(`
    SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, t.created_at, t.updated_at, t.archived_at, c.name as category_name
    FROM tasks t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.archived_at IS NULL
  `).all(req.userId);

  if (format === 'csv') {
    if (tasks.length === 0) {
      res.header('Content-Type', 'text/csv');
      res.attachment('tasks.csv');
      return res.send('id,title,description,status,priority,due_date,created_at,updated_at,category_name\n');
    }

    const headers = Object.keys(tasks[0]).join(',');
    const rows = tasks.map(t => {
      return Object.values(t).map(v => {
        if (v === null) return '';
        const str = String(v);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',');
    });

    const csv = [headers, ...rows].join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('tasks.csv');
    return res.send(csv);
  }

  // Default JSON
  res.json(tasks);
});

module.exports = router;
