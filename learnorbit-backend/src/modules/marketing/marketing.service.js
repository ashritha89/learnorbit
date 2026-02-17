const path = require('path');
const pool = require('../../config/database');

// const { addWaitlistEmailJob } = require('../../queues/email.queue');

class MarketingService {
    async addToWaitlist(data) {
        const {
            fullName,
            email,
            role,
            currentPlatform,
            frustrations,
            desiredFeatures,
            pricingExpectation,
            earlyAccessInterest,
            betaTester,
            source
        } = data;

        const sql = `
            INSERT INTO marketing_waitlist_users 
            (full_name, email, role, current_lms, frustrations, desired_features, pricing_range, early_access, beta_tester, source, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'new')
            RETURNING id
        `;

        const values = [
            fullName,
            email,
            role,
            currentPlatform || null,
            JSON.stringify(frustrations || []),
            JSON.stringify(desiredFeatures || []),
            pricingExpectation || null,
            !!earlyAccessInterest, // Ensure boolean
            !!betaTester,          // Ensure boolean
            source || 'direct'
        ];

        console.log('Inserting into waitlist with values:', values); // Debug log

        try {
            const result = await pool.query(sql, values);
            console.log('Waitlist insert result:', result.rows[0]);
            var id = result.rows[0].id;
        } catch (dbError) {
            console.error('Database insert error:', dbError);
            throw dbError;
        }

        try {
            // Send waitlist email directly (async, non-blocking if possible, but cleaner for now to just await or not await)
            const emailService = require('../../utils/email.service');
            // We can await it or let it run in background. Since user wants to remove Redis, we process it now.
            // To prevent blocking response too long, maybe don't await? But for reliability without queue, awaiting is safer.
            // Or use setImmediate.
            emailService.sendWaitlistEmail({
                fullName,
                email,
                role,
                currentPlatform,
                frustrations,
                desiredFeatures,
                pricingExpectation,
                earlyAccessInterest,
                betaTester,
                source
            }).catch(err => console.error('Background email send failed:', err));

        } catch (emailError) {
            console.error('Failed to initiate waitlist email:', emailError);
        }

        return { id, email, status: 'new' };
    }

    async submitContactForm(data) {
        const { fullName, email, subject, message } = data;
        // Check dups within last hour to prevent spam? (Simplified for now)

        const sql = `
      INSERT INTO marketing_contact_messages (full_name, email, subject, message, status)
      VALUES ($1, $2, $3, $4, 'new')
      RETURNING id
    `;

        const result = await pool.query(sql, [fullName, email, subject, message]);
        return { id: result.rows[0].id, status: 'sent' };
    }

    async submitFeedback(data) {
        const { userType, biggestProblem, missingFeature, improvementSuggestion } = data;
        const sql = `
      INSERT INTO marketing_feedback_submissions (user_type, biggest_problem, missing_feature, improvement_suggestion)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

        const result = await pool.query(sql, [userType, biggestProblem || null, missingFeature || null, improvementSuggestion || null]);
        return { id: result.rows[0].id, status: 'received' };
    }
}

module.exports = new MarketingService();
