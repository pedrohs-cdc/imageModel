const Database = require('better-sqlite3');
const path = require('path');
const migrations = require('./migrations');

let db;

// Singleton: retorna a mesma conexao em toda a aplicacao
function getDb() {
  if (!db) {
    db = new Database(path.join(__dirname, '../../taskflow.db'));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.exec(migrations);
    console.log('[DB] Conectado ao SQLite e migrations executadas.');
  }
  return db;
}

module.exports = { getDb };
