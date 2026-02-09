// src/services/audit.service.js
const pool = require('../config/db');

class AuditService {
  static async log({ userId = null, action, method, endpoint, ip, userAgent }) {
    await pool.execute(
      `INSERT INTO audit_logs (user_id, action, method, endpoint, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, action, method, endpoint, ip, userAgent]
    );
  }
}

module.exports = AuditService;
