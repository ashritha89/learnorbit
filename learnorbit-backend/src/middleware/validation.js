// src/middleware/validation.js
module.exports = function validateContact(req, res, next) {
  const { name, email } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  // Simple email format check (optional but helpful)
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }
  next();
};
