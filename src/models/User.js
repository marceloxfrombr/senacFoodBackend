// models/User.js

const db = require('../database/db');
const bcrypt = require('bcryptjs');

module.exports = {
  // Função para criar um usuário
  async create({ name, email, password, is_admin }) {
    const hashed = bcrypt.hashSync(password, 8);
    const query = `
      INSERT INTO users (name, email, password, is_admin) 
      VALUES (?, ?, ?, ?)
    `;
    await db.runQuery(query, [name, email, hashed, is_admin]);
  },

  // Função para buscar um usuário pelo email
  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    return await db.getQuery(query, [email]);
  },

  // Função para obter todos os usuários
  async getAll() {
    const query = `
      SELECT id, name, email, is_admin, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    return await db.allQuery(query);
  }
};
