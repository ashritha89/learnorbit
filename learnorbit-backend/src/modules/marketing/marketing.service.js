const path = require('path');
const pool = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

class MarketingService {
    async addToWaitlist(data) {
        const { fullName, email, role, currentLms, frustrations, desiredFeatures, pricingRange, source } = data;

        // Check if email already exists
        const [existing] = await pool.execute('SELECT id FROM marketing_waitlist_users WHERE email = ?', [email]);
        if (existing.length > 0) {
            throw new Error('Email already registered for waitlist');
        }

        const id = uuidv4();
        const sql = `
      INSERT INTO marketing_waitlist_users 
      (id, full_name, email, role, current_lms, frustrations, desired_features, pricing_range, source, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `;

        // Ensure JSON fields are stringified if necessary, but MySQL driver handles objects for JSON columns usually.
        // However, explicit stringification is safer.
        await pool.execute(sql, [
            id,
            fullName,
            email,
            role,
            currentLms || null,
            JSON.stringify(frustrations || []),
            JSON.stringify(desiredFeatures || []),
            pricingRange || null,
            source || 'direct'
        ]);

        return { id, email, status: 'new' };
    }

    async submitContactForm(data) {
        const { fullName, email, subject, message } = data;
        const id = uuidv4();

        // Check dups within last hour to prevent spam? (Simplified for now)

        const sql = `
      INSERT INTO marketing_contact_messages (id, full_name, email, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `;

        await pool.execute(sql, [id, fullName, email, subject, message]);
        return { id, status: 'sent' };
    }

    async submitFeedback(data) {
        const { userType, biggestProblem, missingFeature, improvementSuggestion } = data;
        const id = uuidv4();

        const sql = `
      INSERT INTO marketing_feedback_submissions (id, user_type, biggest_problem, missing_feature, improvement_suggestion)
      VALUES (?, ?, ?, ?, ?)
    `;

        await pool.execute(sql, [id, userType, biggestProblem || null, missingFeature || null, improvementSuggestion || null]);
        return { id, status: 'received' };
    }
}

module.exports = new MarketingService();
