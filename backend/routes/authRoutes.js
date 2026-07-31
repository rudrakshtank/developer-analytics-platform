const express = require('express');
const rateLimit = require('express-rate-limit'); 
const { 
    registerUser, loginUser, getCurrentUser, getTestContests, 
    changePassword, requestOTP, verifyOTP , updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { success: false, message: 'Too many OTP requests. Please try again after 15 minutes.' }
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/test-contests', getTestContests);

router.post('/request-otp', otpLimiter, requestOTP);
router.post('/verify-otp', verifyOTP);

router.get('/me', protect, getCurrentUser);
router.put('/change-password', protect, changePassword);

router.put('/profile', protect, updateProfile);

module.exports = router;
