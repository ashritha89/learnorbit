// src/repositories/adminUser.repository.js
const pool = require('../config/db');

class AdminUserRepo {
  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ name, email, passwordHash, role }) {
    const [result] = await pool.execute(
      'INSERT INTO admin_users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return result.insertId;
  }

  static async incrementFailedAttempts(id) {
    await pool.execute('UPDATE admin_users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?', [id]);
  }

  static async resetFailedAttempts(id) {
    await pool.execute('UPDATE admin_users SET failed_login_attempts = 0, lock_until = NULL WHERE id = ?', [id]);
  }

  static async lockAccount(id, lockUntil) {
    await pool.execute('UPDATE admin_users SET lock_until = ?, failed_login_attempts = 0 WHERE id = ?', [lockUntil, id]);
  }

  static isLocked(user) {
    if (!user.lock_until) return false;
    return new Date(user.lock_until) > new Date();
  }
}

module.exports = AdminUserRepo;
