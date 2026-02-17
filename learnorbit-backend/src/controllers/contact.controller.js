// src/controllers/contact.controller.js
const pool = require('../config/database');
const { addContactEmailJob } = require('../queues/email.queue');
const logger = require('../utils/logger');

// POST /api/contact controller
module.exports = async function createContact(req, res) {
  const { name, email, message } = req.body;

  try {
    // 1. Save contact lead to database
    const sql = `INSERT INTO contact_leads (name, email, message, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id`;
    const { rows } = await pool.query(sql, [name, email, message || null]);
    const leadId = rows[0].id;

    // 2. Add email job to queue (non-blocking)
    // This happens asynchronously and won't delay the API response
    addContactEmailJob({
      name,
      email,
      message: message || '',
      leadId,
    }).catch((error) => {
      // Log error but don't fail the request
      // The contact is already saved, email is secondary
      logger.error(`Failed to queue contact email for lead ${leadId}`, {
        error: error.message,
        leadId,
        email,
      });
    });

    // 3. Respond immediately (don't wait for email)
    res.status(201).json({
      success: true,
      message: 'Contact lead saved successfully. We will get back to you soon!',
      data: {
        id: leadId,
        emailQueued: true, // Indicates email will be sent in background
      },
    });

  } catch (err) {
    // Log error with request context
    logger.error(`Failed to save contact lead: ${err.message}`, {
      error: err.stack,
      requestId: req.id,
      body: { name, email, messageLength: message?.length },
    });

    // Respond with generic message to avoid leaking DB details
    res.status(500).json({
      success: false,
      error: 'Failed to save contact information. Please try again later.',
    });
  }
};
