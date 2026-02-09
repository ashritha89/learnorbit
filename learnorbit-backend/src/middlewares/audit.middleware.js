// src/middlewares/audit.middleware.js
const AuditService = require('../services/audit.service');

module.exports = (req, res, next) => {
  // Let the request proceed; after response is finished we log
  res.on('finish', () => {
    const userId = req.user ? req.user.id : null;
    const action = `${req.method} ${req.originalUrl}`;
    const method = req.method;
    const endpoint = req.originalUrl;
    const ip = req.ip;
    const userAgent = req.get('User-Agent') || '';
    AuditService.log({
      userId,
      action,
      method,
      endpoint,
      ip,
      userAgent,
    }).catch(err => {
      // If audit logging fails, we don't want to break the request flow
      if (req.logger) {
        req.logger.error(`Audit logging failed: ${err.message}`);
      }
    });
  });
  next();
};
