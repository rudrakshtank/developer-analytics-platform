const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
    connectPlatform, generateVerificationCode, verifyPlatform, syncGeeksForGeeks, syncCodeChef, syncLeetCode, syncCodeforces, syncGitHub, cLuma, syncAllData, unlinkPlatform
} = require('../controllers/platformController');

router.post('/connect', protect, connectPlatform);
router.get('/verify/code', protect, generateVerificationCode);
router.post('/verify/:platform', protect, verifyPlatform);

router.post('/sync/leetcode', protect, syncLeetCode);
router.post('/sync/codeforces', protect, syncCodeforces);
router.post('/sync/codechef', protect, syncCodeChef);
router.post('/sync/geeksforgeeks', protect, syncGeeksForGeeks);
router.post('/sync/github', protect, syncGitHub);

router.post('/sync-all', protect, syncAllData);
router.delete('/unlink/:platform', protect, unlinkPlatform);

module.exports = router;
