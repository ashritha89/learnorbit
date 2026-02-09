// src/middlewares/requestId.middleware.js
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const requestId = uuidv4();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  // Attach requestId to logger for this request via a child logger
  req.logger = logger.child({ requestId });
  next();
};
