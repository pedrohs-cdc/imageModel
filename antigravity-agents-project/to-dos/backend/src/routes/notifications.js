const express = require('express');
const { getDb } = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/notifications
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const notifications = db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all(req.userId);
    
    const unreadCount = db.prepare(`
      SELECT COUNT(*) as count FROM notifications 
      WHERE user_id = ? AND is_read = 0
    `).get(req.userId).count;

    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('[Notifications GET]', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  try {
    const db = getDb();
    db.prepare(`
      UPDATE notifications SET is_read = 1 
      WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.userId);
    res.json({ success: true });
  } catch (err) {
    console.error('[Notifications Read]', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', (req, res) => {
  try {
    const db = getDb();
    db.prepare(`
      UPDATE notifications SET is_read = 1 
      WHERE user_id = ?
    `).run(req.userId);
    res.json({ success: true });
  } catch (err) {
    console.error('[Notifications ReadAll]', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
