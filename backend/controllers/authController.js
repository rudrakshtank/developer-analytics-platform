const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const trimmedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ $or: [{ email: trimmedEmail }, { username: username.trim() }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
        }

        const emailHash = crypto.createHash('md5').update(trimmedEmail).digest('hex');
        
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;
        const profilePicture = `https://www.gravatar.com/avatar/${emailHash}?s=200&d=${encodeURIComponent(fallbackAvatar)}`;

        const user = await User.create({
            name,
            username: username.trim(),
            email: trimmedEmail,
            password,
            profilePicture,
            isVerified: false 
        });

        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.emailVerificationOTP = otp;
            user.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; 
            await user.save();

            await sendEmail({
                email: user.email,
                subject: 'Welcome to DevVerse - Verify Your Email',
                message: `Hi ${user.name},\n\nWelcome to DevVerse! Your email verification OTP is: ${otp}\n\nIt is valid for 10 minutes. Please enter this code to complete your registration.`
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful! Please check your email for the verification code.',
                email: user.email 
            });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        const user = await User.findOne({
            $or: [
                { email: emailOrUsername?.toLowerCase().trim() },
                { username: emailOrUsername?.trim() }
            ]
        });

        if (user && (await user.matchPassword(password))) {
            
            if (!user.isVerified) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Please verify your email before logging in. You can request a new OTP if needed.',
                    isVerified: false 
                });
            }

            res.status(200).json({
                success: true,
                message: 'Logged in successfully!',
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    isOnboardingComplete: user.isOnboardingComplete
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email/username or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login Error: ' + error.message });
    }

    
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTestContests = async (req, res) => {
    const axios = require('axios');
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    let contests = [];

    const lcWeeklyAnchor = new Date('2026-07-26T02:30:00Z');
    let nextLcWeekly = new Date(lcWeeklyAnchor);
    while (nextLcWeekly < now) nextLcWeekly.setDate(nextLcWeekly.getDate() + 7);
    if (nextLcWeekly <= oneWeekFromNow) {
        const diff = Math.round((nextLcWeekly - lcWeeklyAnchor) / (1000 * 60 * 60 * 24 * 7));
        contests.push({ id: `lc-w-${512 + diff}`, platform: 'LeetCode', title: `Weekly Contest ${512 + diff}`, url: `https://leetcode.com/contest/weekly-contest-${512 + diff}/`, startTime: nextLcWeekly.toISOString() });
    }

    const ccAnchor = new Date('2026-07-22T14:30:00Z');
    let nextCc = new Date(ccAnchor);
    while (nextCc < now) nextCc.setDate(nextCc.getDate() + 7);
    if (nextCc <= oneWeekFromNow) {
        const diff = Math.round((nextCc - ccAnchor) / (1000 * 60 * 60 * 24 * 7));
        contests.push({ id: `cc-s-${248 + diff}`, platform: 'CodeChef', title: `Starters ${248 + diff}`, url: `https://www.codechef.com/START${248 + diff}A`, startTime: nextCc.toISOString() });
    }

    try {
        const cfRes = await axios.get('https://codeforces.com/api/contest.list?gym=false');
        if (cfRes.data.status === 'OK') {
            const cfContests = cfRes.data.result
                .filter(c => c.phase === 'BEFORE' && (c.startTimeSeconds * 1000) <= oneWeekFromNow.getTime())
                .map(c => ({ id: `cf-${c.id}`, platform: 'Codeforces', title: c.name, url: `https://codeforces.com/contests/${c.id}`, startTime: new Date(c.startTimeSeconds * 1000).toISOString() }));
            contests = [...contests, ...cfContests];
        }
    } catch (e) {
        console.warn("Codeforces API failed:", e.message);
    }

    res.status(200).json({ 
        success: true, 
        count: contests.length, 
        filter: "Strictly Next 7 Days Only", 
        contests: contests.sort((a,b) => new Date(a.startTime) - new Date(b.startTime)) 
    });
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }

        user.password = newPassword; 
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const requestOTP = async (req, res) => {
    try {
        const { email, type } = req.body; 
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; 

        let subject, message;

        if (type === 'reset') {
            user.resetPasswordOTP = otp;
            user.resetPasswordOTPExpires = otpExpires;
            subject = 'DevVerse - Password Reset OTP';
            message = `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`;
        } else if (type === 'verify') {
            user.emailVerificationOTP = otp;
            user.emailVerificationOTPExpires = otpExpires;
            subject = 'DevVerse - Verify Your Email';
            message = `Your email verification OTP is: ${otp}. It is valid for 10 minutes.`;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP type requested' });
        }

        await user.save();

        await sendEmail({ email: user.email, subject, message });

        res.status(200).json({ success: true, message: `OTP sent successfully to ${user.email}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not send email: ' + error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp, type, newPassword } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (type === 'reset') {
            if (user.resetPasswordOTP !== otp || user.resetPasswordOTPExpires < Date.now()) {
                return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
            }
            if (!newPassword) {
                return res.status(400).json({ success: false, message: 'Validation Error: Please provide a "newPassword".' });
            }

            user.password = newPassword; 
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpires = undefined;
            await user.save();
            return res.status(200).json({ success: true, message: 'Password reset successfully!' });
            
        } else if (type === 'verify') {
            if (user.emailVerificationOTP !== otp || user.emailVerificationOTPExpires < Date.now()) {
                return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
            }
            
            user.isVerified = true;
            user.emailVerificationOTP = undefined;
            user.emailVerificationOTPExpires = undefined;
            await user.save();

            const token = generateToken(user._id);

            return res.status(200).json({ 
                success: true, 
                message: 'Email verified successfully! Welcome to DevVerse.',
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    isOnboardingComplete: user.isOnboardingComplete
                }
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, location, college, status, gradYear } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, location, college, status, gradYear },
            { new: true, runValidators: true } 
        ).select('-password -otp -otpExpires'); 

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { 
    registerUser, loginUser, getCurrentUser, getTestContests, 
    changePassword, requestOTP, verifyOTP , updateProfile
};
