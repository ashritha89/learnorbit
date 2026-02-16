const marketingService = require('./marketing.service');

// Add Waitlist User
exports.addToWaitlist = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        // Add simple duplicate check (or handle constraint error)
        // Here we let service throw and catch it
        const result = await marketingService.addToWaitlist(req.body);

        res.status(201).json({
            success: true,
            message: 'You have been added to the waitlist!',
            data: result
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.message.includes('already registered')) {
            return res.status(409).json({ success: false, error: 'This email is already on the waitlist.' });
        }
        console.error('Waitlist Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Contact Form
exports.submitContact = async (req, res) => {
    try {
        const { email, message } = req.body;
        if (!email || !message) {
            return res.status(400).json({ success: false, error: 'Email and message are required' });
        }

        const result = await marketingService.submitContactForm(req.body);
        res.status(201).json({ success: true, message: 'Message sent successfully!', data: result });
    } catch (error) {
        console.error('Contact Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Feedback Submission
exports.submitFeedback = async (req, res) => {
    try {
        // Basic validtion
        if (!req.body.userType) {
            return res.status(400).json({ success: false, error: 'User type is required' });
        }

        const result = await marketingService.submitFeedback(req.body);
        res.status(201).json({ success: true, message: 'Feedback received, thank you!', data: result });
    } catch (error) {
        console.error('Feedback Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
