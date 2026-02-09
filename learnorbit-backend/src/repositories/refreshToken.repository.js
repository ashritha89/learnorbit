// src/repositories/refreshToken.repository.js
const pool = require('../config/db');
const logger = require('../utils/logger');

/**
 * Refresh Token Repository
 * Manages refresh tokens for JWT authentication
 */
class RefreshTokenRepository {
  /**
   * Create a new refresh token
   * @param {Object} data - Token data
   * @param {number} data.userId - User ID
   * @param {string} data.token - Refresh token
   * @param {Date} data.expiresAt - Expiration date
   * @param {string} data.ip - IP address
   * @param {string} data.userAgent - User agent
   * @returns {Promise<number>} Token ID
   */
  static async create({ userId, token, expiresAt, ip, userAgent = null }) {
    try {
      const sql = `
        INSERT INTO refresh_tokens (user_id, token, expires_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(sql, [
        userId,
        token,
        expiresAt,
        ip,
        userAgent,
      ]);

      logger.info(`Refresh token created`, {
        userId,
        tokenId: result.insertId,
        ip,
      });

      return result.insertId;
    } catch (error) {
      logger.error(`Failed to create refresh token: ${error.message}`, {
        userId,
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Find refresh token by token string
   * @param {string} token - Refresh token
   * @returns {Promise<Object|null>} Token object or null
   */
  static async findByToken(token) {
    try {
      const sql = `
        SELECT 
          id, user_id, token, expires_at, created_at,
          revoked, revoked_at, replaced_by_token,
          ip_address, user_agent
        FROM refresh_tokens
        WHERE token = ? AND revoked = FALSE AND expires_at > NOW()
      `;

      const [rows] = await pool.execute(sql, [token]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      logger.error(`Failed to find refresh token: ${error.message}`, {
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Revoke a refresh token
   * @param {string} token - Token to revoke
   * @param {string} ip - IP address
   * @param {string} replacedByToken - New token (for rotation)
   * @returns {Promise<void>}
   */
  static async revoke(token, ip, replacedByToken = null) {
    try {
      const sql = `
        UPDATE refresh_tokens
        SET revoked = TRUE, 
            revoked_at = NOW(),
            replaced_by_token = ?
        WHERE token = ?
      `;

      await pool.execute(sql, [replacedByToken, token]);

      logger.info(`Refresh token revoked`, {
        ip,
        replaced: !!replacedByToken,
      });
    } catch (error) {
      logger.error(`Failed to revoke refresh token: ${error.message}`, {
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Revoke all tokens for a user
   * @param {number} userId - User ID
   * @returns {Promise<void>}
   */
  static async revokeAllForUser(userId) {
    try {
      const sql = `
        UPDATE refresh_tokens
        SET revoked = TRUE, revoked_at = NOW()
        WHERE user_id = ? AND revoked = FALSE
      `;

      const [result] = await pool.execute(sql, [userId]);

      logger.info(`All refresh tokens revoked for user`, {
        userId,
        count: result.affectedRows,
      });
    } catch (error) {
      logger.error(`Failed to revoke all tokens: ${error.message}`, {
        userId,
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Clean up expired tokens
   * @returns {Promise<number>} Number of deleted tokens
   */
  static async cleanupExpired() {
    try {
      const sql = `
        DELETE FROM refresh_tokens
        WHERE expires_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
      `;

      const [result] = await pool.execute(sql);

      logger.info(`Expired refresh tokens cleaned up`, {
        count: result.affectedRows,
      });

      return result.affectedRows;
    } catch (error) {
      logger.error(`Failed to cleanup expired tokens: ${error.message}`, {
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Get active sessions for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of active sessions
   */
  static async getActiveSessions(userId) {
    try {
      const sql = `
        SELECT 
          id, created_at, expires_at, ip_address, user_agent
        FROM refresh_tokens
        WHERE user_id = ? AND revoked = FALSE AND expires_at > NOW()
        ORDER BY created_at DESC
      `;

      const [rows] = await pool.execute(sql, [userId]);
      return rows;
    } catch (error) {
      logger.error(`Failed to get active sessions: ${error.message}`, {
        userId,
        error: error.stack,
      });
      throw error;
    }
  }
}

module.exports = RefreshTokenRepository;
