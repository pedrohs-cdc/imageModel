const Database = require('better-sqlite3');
const path = require('path');
const { migrations, alterMigrations } = require('./migrations');

let db;

function getDb() {
  if (!db) {
    db = new Database(path.join(__dirname, '../../taskflow.db'));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.exec(migrations);

    // Aplicar ALTER TABLE de forma segura (ignora se coluna já existe)
    for (const alter of alterMigrations) {
      try { db.exec(alter); } catch (_) { /* coluna já existe */ }
    }

    console.log('[DB] Conectado ao SQLite e migrations executadas.');
  }
  return db;
}

module.exports = { getDb };
