// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const loginRateLimiter = require('../middlewares/loginRateLimiter');
const { protect, authorizeRoles } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', loginRateLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', protect, authController.logout); // logout requires a valid access token (optional)

// Example protected admin route (uncomment to use)
// router.get('/superadmin-only', protect, authorizeRoles('superadmin'), (req, res) => {
//   res.json({ success: true, message: 'Superadmin data accessible' });
// });

module.exports = router;
