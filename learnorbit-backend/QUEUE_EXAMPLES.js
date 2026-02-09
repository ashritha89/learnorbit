// Example: How to use the email queue in other controllers

const {
    addContactEmailJob,
    addWelcomeEmailJob,
    addPasswordResetEmailJob
} = require('../queues/email.queue');

// ============================================
// Example 1: Contact Form (Already Implemented)
// ============================================

async function createContact(req, res) {
    const { name, email, message } = req.body;

    // Save to database
    const [result] = await pool.execute(
        'INSERT INTO contact_leads (name, email, message, created_at) VALUES (?, ?, ?, NOW())',
        [name, email, message]
    );

    // Queue email (non-blocking)
    addContactEmailJob({
        name,
        email,
        message,
        leadId: result.insertId,
    }).catch(err => logger.error('Failed to queue email', err));

    // Return immediately
    res.json({ success: true, id: result.insertId });
}

// ============================================
// Example 2: User Registration
// ============================================

async function registerUser(req, res) {
    const { name, email, password } = req.body;

    try {
        // 1. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Save user to database
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
            [name, email, hashedPassword]
        );

        const userId = result.insertId;

        // 3. Queue welcome email (non-blocking)
        addWelcomeEmailJob({
            name,
            email,
            userId,
        }).catch(err => logger.error('Failed to queue welcome email', err));

        // 4. Generate JWT token
        const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);

        // 5. Return response immediately
        res.status(201).json({
            success: true,
            message: 'Registration successful! Check your email.',
            data: { userId, token },
        });

    } catch (error) {
        logger.error('Registration failed', error);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
}

// ============================================
// Example 3: Password Reset Request
// ============================================

async function requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
        // 1. Find user
        const [users] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            // Don't reveal if email exists (security)
            return res.json({
                success: true,
                message: 'If the email exists, a reset link will be sent.'
            });
        }

        const userId = users[0].id;

        // 2. Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        // 3. Save token to database
        await pool.execute(
            'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, tokenHash, expiresAt]
        );

        // 4. Queue password reset email (non-blocking)
        addPasswordResetEmailJob({
            email,
            resetToken,
            userId,
        }).catch(err => logger.error('Failed to queue password reset email', err));

        // 5. Return response immediately
        res.json({
            success: true,
            message: 'If the email exists, a reset link will be sent.',
        });

    } catch (error) {
        logger.error('Password reset request failed', error);
        res.status(500).json({ success: false, error: 'Request failed' });
    }
}

// ============================================
// Example 4: Custom Job Type
// ============================================

// First, add to email.queue.js:
async function addCustomEmailJob(data) {
    const job = await emailQueue.add('custom-notification', data, {
        priority: 3,
        delay: 0,
    });
    logger.info('Custom email job added', { jobId: job.id });
    return job;
}

// Then, add handler to email.worker.js:
async function processCustomNotification(data) {
    const { userId, notificationType, metadata } = data;

    // Fetch user details
    const [users] = await pool.execute(
        'SELECT name, email FROM users WHERE id = ?',
        [userId]
    );

    const user = users[0];

    const subject = `Notification: ${notificationType}`;
    const body = `
    <h2>Hello ${user.name}!</h2>
    <p>You have a new notification: ${notificationType}</p>
    <pre>${JSON.stringify(metadata, null, 2)}</pre>
  `;

    await sendEmail(user.email, subject, body);

    return { emailSent: true, userId };
}

// Usage in controller:
async function sendCustomNotification(req, res) {
    const { userId, type, metadata } = req.body;

    addCustomEmailJob({
        userId,
        notificationType: type,
        metadata,
    }).catch(err => logger.error('Failed to queue notification', err));

    res.json({ success: true, message: 'Notification queued' });
}

// ============================================
// Example 5: Bulk Email Campaign
// ============================================

async function sendBulkCampaign(req, res) {
    const { campaignId, subject, template } = req.body;

    try {
        // 1. Get all subscribers
        const [subscribers] = await pool.execute(
            'SELECT id, name, email FROM users WHERE subscribed = 1'
        );

        // 2. Queue individual emails for each subscriber
        const jobPromises = subscribers.map(subscriber =>
            emailQueue.add('campaign-email', {
                userId: subscriber.id,
                name: subscriber.name,
                email: subscriber.email,
                campaignId,
                subject,
                template,
            }, {
                priority: 5,  // Low priority
                delay: Math.random() * 60000,  // Random delay 0-60s to avoid spam
            })
        );

        await Promise.all(jobPromises);

        // 3. Return immediately
        res.json({
            success: true,
            message: `Campaign queued for ${subscribers.length} subscribers`,
            data: { campaignId, subscriberCount: subscribers.length },
        });

    } catch (error) {
        logger.error('Bulk campaign failed', error);
        res.status(500).json({ success: false, error: 'Campaign failed' });
    }
}

// ============================================
// Example 6: Scheduled Email (Delayed Job)
// ============================================

async function scheduleEmail(req, res) {
    const { email, subject, body, sendAt } = req.body;

    try {
        const sendTime = new Date(sendAt);
        const delay = sendTime.getTime() - Date.now();

        if (delay < 0) {
            return res.status(400).json({
                success: false,
                error: 'Send time must be in the future'
            });
        }

        // Queue with delay
        const job = await emailQueue.add('scheduled-email', {
            email,
            subject,
            body,
            scheduledFor: sendAt,
        }, {
            delay,  // Delay in milliseconds
            priority: 4,
        });

        res.json({
            success: true,
            message: 'Email scheduled successfully',
            data: {
                jobId: job.id,
                scheduledFor: sendAt,
                delayMs: delay,
            },
        });

    } catch (error) {
        logger.error('Failed to schedule email', error);
        res.status(500).json({ success: false, error: 'Scheduling failed' });
    }
}

// ============================================
// Example 7: Job with Progress Tracking
// ============================================

// In worker:
async function processLargeReport(job) {
    const { userId, reportType } = job.data;

    // Step 1: Fetch data (20%)
    await job.updateProgress(20);
    const data = await fetchReportData(reportType);

    // Step 2: Process data (50%)
    await job.updateProgress(50);
    const processed = await processData(data);

    // Step 3: Generate PDF (80%)
    await job.updateProgress(80);
    const pdf = await generatePDF(processed);

    // Step 4: Send email (100%)
    await job.updateProgress(100);
    await sendEmailWithAttachment(userId, pdf);

    return { success: true, reportType };
}

// ============================================
// Best Practices
// ============================================

/*
1. ALWAYS use .catch() when adding jobs (don't await)
   ✅ addEmailJob(data).catch(err => logger.error(err));
   ❌ await addEmailJob(data);  // Blocks response

2. Return API response BEFORE job completes
   ✅ Save to DB → Queue job → Return response
   ❌ Save to DB → Wait for email → Return response

3. Handle queue errors gracefully
   - Log the error
   - Don't fail the API request
   - The job will retry automatically

4. Use appropriate priorities
   1 = High (password reset, security)
   2 = Medium (welcome emails)
   3 = Normal (notifications)
   4-5 = Low (marketing, bulk)

5. Set reasonable delays
   - Immediate: delay: 0
   - After DB commit: delay: 5000 (5 seconds)
   - Scheduled: delay: calculated from sendAt

6. Monitor your queues
   - Check failed jobs regularly
   - Clean old jobs periodically
   - Monitor worker health

7. Scale appropriately
   - Start with 1 worker
   - Add more workers as load increases
   - Monitor Redis memory usage
*/

module.exports = {
    createContact,
    registerUser,
    requestPasswordReset,
    sendCustomNotification,
    sendBulkCampaign,
    scheduleEmail,
};
