const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
    getPublicProfile, getLeaderboard, getGlobalAnalytics, completeOnboarding, 
    updateUserProfile, toggleUserInPlaylist, getUserPlaylists,
    compareProfiles, connectPlatform,
    getSdeSheets
} = require('../controllers/userController');

router.put('/onboarding', protect, completeOnboarding);
router.put('/profile', protect, updateUserProfile);
router.post('/playlists', protect, toggleUserInPlaylist);
router.get('/playlists', protect, getUserPlaylists);

router.get('/leaderboard', getLeaderboard);
router.get('/profile/:username', getPublicProfile);
router.get('/analytics/:username', getGlobalAnalytics);

router.get('/compare/:username1/:username2', compareProfiles);
router.get('/sheets', getSdeSheets); 

module.exports = router;
