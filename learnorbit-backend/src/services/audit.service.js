// src/services/audit.service.js
const pool = require('../config/database');

class AuditService {
  static async log({ userId = null, action, method, endpoint, ip, userAgent }) {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, method, endpoint, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, action, method, endpoint, ip, userAgent]
    );
  }
}

module.exports = AuditService;
