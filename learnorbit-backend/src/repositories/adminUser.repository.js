// src/repositories/adminUser.repository.js
const pool = require('../config/database');

class AdminUserRepo {
  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE id = $1', [id]);
    return rows[0];
  }

  static async create({ name, email, passwordHash, role }) {
    const { rows } = await pool.query(
      'INSERT INTO admin_users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, passwordHash, role]
    );
    return rows[0].id;
  }

  static async incrementFailedAttempts(id) {
    await pool.query('UPDATE admin_users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1', [id]);
  }

  static async resetFailedAttempts(id) {
    await pool.query('UPDATE admin_users SET failed_login_attempts = 0, lock_until = NULL WHERE id = $1', [id]);
  }

  static async lockAccount(id, lockUntil) {
    await pool.query('UPDATE admin_users SET lock_until = $1, failed_login_attempts = 0 WHERE id = $2', [lockUntil, id]);
  }

  static isLocked(user) {
    if (!user.lock_until) return false;
    return new Date(user.lock_until) > new Date();
  }
}

module.exports = AdminUserRepo;
