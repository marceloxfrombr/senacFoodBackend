// database/db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Cria a instância do banco de dados
const db = new sqlite3.Database(path.resolve(__dirname, 'database.db'), (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  else console.log('Conectado ao banco SQLite');
});

// Função utilitária para usar Promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Criação das tabelas, caso não existam
async function createTables() {
  try {
    await runQuery(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        ingredients TEXT,
        steps TEXT,
        category TEXT,
        difficulty TEXT
      );
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0
      );
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Tabelas criadas ou já existentes.');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

// Chama a criação das tabelas na inicialização
createTables();

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery
};
