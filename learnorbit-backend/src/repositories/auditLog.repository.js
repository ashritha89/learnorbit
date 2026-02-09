// src/repositories/auditLog.repository.js
const pool = require('../config/db');
const logger = require('../utils/logger');

/**
 * Audit Log Repository
 * Tracks security and user activity events
 */
class AuditLogRepository {
  /**
   * Log an event
   * @param {Object} data - Event data
   * @param {number} data.userId - User ID (optional)
   * @param {string} data.eventType - Event type
   * @param {string} data.ip - IP address
   * @param {string} data.userAgent - User agent
   * @param {Object} data.details - Additional details
   * @returns {Promise<number>} Log ID
   */
  static async log({ userId = null, eventType, ip, userAgent = null, details = null }) {
    try {
      const sql = `
        INSERT INTO audit_logs (user_id, event_type, ip_address, user_agent, details)
        VALUES (?, ?, ?, ?, ?)
      `;

      const detailsJson = details ? JSON.stringify(details) : null;

      const [result] = await pool.execute(sql, [
        userId,
        eventType,
        ip,
        userAgent,
        detailsJson,
      ]);

      return result.insertId;
    } catch (error) {
      // Don't throw - audit logging shouldn't break the application
      logger.error(`Failed to create audit log: ${error.message}`, {
        userId,
        eventType,
        error: error.stack,
      });
      return null;
    }
  }

  /**
   * Get logs for a user
   * @param {number} userId - User ID
   * @param {number} limit - Result limit
   * @param {number} offset - Result offset
   * @returns {Promise<Array>} Array of log entries
   */
  static async getByUser(userId, limit = 50, offset = 0) {
    try {
      const sql = `
        SELECT id, event_type, ip_address, user_agent, details, created_at
        FROM audit_logs
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;

      const [rows] = await pool.execute(sql, [userId, limit, offset]);
      return rows.map(row => ({
        ...row,
        details: row.details ? JSON.parse(row.details) : null,
      }));
    } catch (error) {
      logger.error(`Failed to get audit logs: ${error.message}`, {
        userId,
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Get logs by event type
   * @param {string} eventType - Event type
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Array of log entries
   */
  static async getByEventType(eventType, limit = 100) {
    try {
      const sql = `
        SELECT id, user_id, ip_address, user_agent, details, created_at
        FROM audit_logs
        WHERE event_type = ?
        ORDER BY created_at DESC
        LIMIT ?
      `;

      const [rows] = await pool.execute(sql, [eventType, limit]);
      return rows.map(row => ({
        ...row,
        details: row.details ? JSON.parse(row.details) : null,
      }));
    } catch (error) {
      logger.error(`Failed to get audit logs by type: ${error.message}`, {
        eventType,
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Clean up old logs
   * @param {number} daysToKeep - Number of days to keep
   * @returns {Promise<number>} Number of deleted logs
   */
  static async cleanup(daysToKeep = 90) {
    try {
      const sql = `
        DELETE FROM audit_logs
        WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
      `;

      const [result] = await pool.execute(sql, [daysToKeep]);

      logger.info(`Audit logs cleaned up`, {
        daysToKeep,
        count: result.affectedRows,
      });

      return result.affectedRows;
    } catch (error) {
      logger.error(`Failed to cleanup audit logs: ${error.message}`, {
        error: error.stack,
      });
      throw error;
    }
  }
}

module.exports = AuditLogRepository;
