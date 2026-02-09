// src/routes/contact.routes.js
const express = require('express');
const router = express.Router();

const validateContact = require('../middleware/validation');
const createContact = require('../controllers/contact.controller');

// Optional placeholder GET for quick health check of the module
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Contact module reachable' });
});

// POST /api/contact – create a new contact lead
router.post('/', validateContact, createContact);

module.exports = router;
