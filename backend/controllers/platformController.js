const { calculateLumaScore } = require('../utils/scoreCalculator');
const User = require('../models/User');
const axios = require('axios');

const cLuma = async (uId) => {
    const usr = await User.findById(uId);
    if (usr) {
        const sc = calculateLumaScore(usr.connectedAccounts);
        usr.lumaScore = sc.totalScore;
        await usr.save();
    }
};

const syncAllData = async (req, res) => {
    try {
        const dummyRes = {
            status: function() { return this; },
            json: function() { return this; }
        };

        await Promise.allSettled([
            syncLeetCode(req, dummyRes),
            syncCodeforces(req, dummyRes),
            syncCodeChef(req, dummyRes),
            syncGeeksForGeeks(req, dummyRes),
            syncGitHub(req, dummyRes)
        ]);

        await cLuma(req.user._id);

        res.status(200).json({ success: true, message: 'All platforms synced successfully!' });
        
    } catch (err) {
        console.error("Sync All Error:", err);
        res.status(500).json({ success: false, message: 'Failed to sync all platforms' });
    }
};

const getCFRank = (rating) => {
    if (rating >= 3000) return "Legendary Grandmaster";
    if (rating >= 2600) return "International Grandmaster";
    if (rating >= 2400) return "Grandmaster";
    if (rating >= 2300) return "International Master";
    if (rating >= 2100) return "Master";
    if (rating >= 1900) return "Candidate Master";
    if (rating >= 1600) return "Expert";
    if (rating >= 1400) return "Specialist";
    if (rating >= 1200) return "Pupil";
    return "Newbie";
};

const getCCRank = (rating) => {
    if (rating >= 2500) return "7★";
    if (rating >= 2200) return "6★";
    if (rating >= 2000) return "5★";
    if (rating >= 1800) return "4★";
    if (rating >= 1600) return "3★";
    if (rating >= 1400) return "2★";
    return "1★";
};

const getLCRank = (rating) => {
    if (rating >= 2200) return "Guardian";
    if (rating >= 1850) return "Knight";
    return "Unrated";
};

const connectPlatform = async (req, res) => {
    try {
        const { platform, username } = req.body; 

        if (!platform || !username) {
            return res.status(400).json({ success: false, message: 'Platform and username are required' });
        }

        const platformKey = platform.toLowerCase();
        
        const alreadyClaimed = await User.findOne({
            [`connectedAccounts.${platformKey}.username`]: new RegExp(`^${username}$`, 'i'),
            [`connectedAccounts.${platformKey}.verified`]: true
        });

        if (alreadyClaimed && alreadyClaimed._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ success: false, message: `This username is already linked to another Codolio account.` });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!user.connectedAccounts || Array.isArray(user.connectedAccounts)) {
            user.connectedAccounts = {};
        }

        user.connectedAccounts[platformKey] = {
            username: username,
            verified: false
        };

        user.markModified('connectedAccounts');

        await user.save();

        res.status(200).json({ success: true, message: `Successfully registered ${platform}. Please verify.` });
    } catch (error) {
        console.error("Connect Platform Error:", error);
        res.status(500).json({ success: false, message: 'Server Error while connecting platform' });
    }
};

const generateVerificationCode = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = Math.floor(10000000 + Math.random() * 90000000).toString();
        
        user.platformVerificationCode = otp;
        await user.save();

        res.status(200).json({ success: true, code: otp, message: '8-Digit OTP generated.' });
    } catch (error) {
        console.error("OTP Generation Error:", error);
        res.status(500).json({ success: false, message: 'Error generating code' });
    }
};

const verifyPlatform = async (req, res) => {
    try {
        const { platform } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const platformKey = platform.toLowerCase();
        const account = user.connectedAccounts[platformKey];
        const verificationCode = user.platformVerificationCode;

        if (!account || !account.username) return res.status(400).json({ success: false, message: 'Platform not connected' });
        if (!verificationCode) return res.status(400).json({ success: false, message: 'Please generate a verification code first' });

        const alreadyClaimed = await User.findOne({
            [`connectedAccounts.${platformKey}.username`]: new RegExp(`^${account.username}$`, 'i'),
            [`connectedAccounts.${platformKey}.verified`]: true
        });

        if (alreadyClaimed && alreadyClaimed._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ success: false, message: `The ${platform} account '${account.username}' is already verified and linked to another user!` });
        }

        const username = account.username;
        let isVerified = false;

        try {
            let profileDataString = '';

            if (platformKey === 'geeksforgeeks') {
                const gfgUrl = `https://www.geeksforgeeks.org/user/${username}/`;
                
                const response = await axios.get(gfgUrl, { 
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });
                
                profileDataString = response.data;

            } else {
                let apiUrl = '';
                if (platformKey === 'github') {
                    apiUrl = `https://api.github.com/users/${username}`;
                } else {
                    apiUrl = `https://${platformKey}-stats.tashif.codes/${username}/profile`;
                }

                const response = await axios.get(apiUrl, { timeout: 10000 });
                profileDataString = JSON.stringify(response.data);
            }

            if (profileDataString.includes(verificationCode)) {
                isVerified = true;
            }
            
        } catch (apiError) {
            console.error(`Verification API Error for ${platformKey}:`, apiError.message);
            return res.status(400).json({ 
                success: false, 
                message: `Verification failed: Could not fetch profile data for ${platform}. Ensure the username is correct and public.` 
            });
        }
        if (isVerified) {
            user.connectedAccounts[platformKey].verified = true;
            user.markModified('connectedAccounts');
            await user.save();
            
            return res.status(200).json({ 
                success: true, 
                message: `${platform} verified successfully!`, 
                connectedAccounts: user.connectedAccounts 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: `Verification failed. Could not find your code ${verificationCode} on your ${platform} profile. Please paste it and try again.` 
            });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: 'Server Error during verification' });
    }
};

const processHeatmap = (heatmapData) => {
    let daily = {}, monthly = {}, totalSubs = 0;
    let contributions = heatmapData?.dailyContributions || heatmapData?.heatMap || [];
    
    if (contributions.length === 0 && heatmapData && typeof heatmapData === 'object' && !Array.isArray(heatmapData)) {
        for (const [key, val] of Object.entries(heatmapData)) {
            if (key.includes('-')) { contributions.push({ date: key, count: val }); } 
            else if (!isNaN(key)) {
                const dateObj = new Date(parseInt(key) * 1000);
                const yyyy = dateObj.getFullYear(), mm = String(dateObj.getMonth() + 1).padStart(2, '0'), dd = String(dateObj.getDate()).padStart(2, '0');
                contributions.push({ date: `${yyyy}-${mm}-${dd}`, count: val });
            }
        }
    }

    if (contributions.length === 0) return { daily, monthly, totalSubs };
    let earliestTimestamp = Infinity;
    contributions.forEach(item => {
        const dateStr = item.date || item.dateStr;
        if (dateStr) { const ts = new Date(dateStr).getTime(); if (ts < earliestTimestamp) earliestTimestamp = ts; }
    });

    if (earliestTimestamp !== Infinity) {
        let current = new Date(earliestTimestamp);
        current.setHours(0, 0, 0, 0);
        const end = new Date(); end.setHours(0, 0, 0, 0);
        while (current <= end) {
            const yyyy = current.getFullYear(), mm = String(current.getMonth() + 1).padStart(2, '0'), dd = String(current.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`, monthKey = `${yyyy}-${mm}`;
            daily[dateStr] = 0; if (!monthly[monthKey]) monthly[monthKey] = { submitted: 0 };
            current.setDate(current.getDate() + 1);
        }
    }

    contributions.forEach(item => {
        const dateStr = item.date || item.dateStr; 
        const count = item.count || item.value || item.submissions || 0;
        if (!dateStr || count === 0) return;
        const monthKey = dateStr.substring(0, 7); 
        if (daily[dateStr] === undefined) daily[dateStr] = 0;
        if (!monthly[monthKey]) monthly[monthKey] = { submitted: 0 };
        daily[dateStr] += count; totalSubs += count; monthly[monthKey].submitted += count; 
    });

    return { daily, monthly, totalSubs };
};

const parseLanguages = (langsRaw) => {
    let langMap = {};
    if (Array.isArray(langsRaw)) {
        langsRaw.forEach(l => {
            const name = l.language || l.languageName || l.name;
            const cnt = l.problemsSolved || l.count || l.solved || l.submissions || 0;
            if (name && cnt > 0) langMap[name] = (langMap[name] || 0) + cnt;
        });
    } else if (typeof langsRaw === 'object' && !Array.isArray(langsRaw)) {
        for (const [k, v] of Object.entries(langsRaw)) {
            if (typeof v === 'number' && v > 0) langMap[k] = v;
        }
    }
    return langMap;
};

const syncLeetCode = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.connectedAccounts.leetcode.verified) return res.status(400).json({ success: false });

        const username = user.connectedAccounts.leetcode.username;
        const BASE = `https://leetcode-stats.tashif.codes/${username}`;

        const [profileRes, statsRes, heatmapRes, contestsRes, badgesRes, ratingRes, langRes] = await Promise.allSettled([
            axios.get(`${BASE}/profile`), axios.get(`${BASE}/stats`), axios.get(`${BASE}/heatmap`), axios.get(`${BASE}/contests`), axios.get(`${BASE}/badges`), axios.get(`${BASE}/rating`), axios.get(`${BASE}/languages`)
        ]);

        const profileData = profileRes.status === 'fulfilled' && profileRes.value.data.data ? profileRes.value.data.data : {};
        const statsData = statsRes.status === 'fulfilled' && statsRes.value.data.data ? statsRes.value.data.data : {};
        const heatmapData = heatmapRes.status === 'fulfilled' && heatmapRes.value.data.data ? heatmapRes.value.data.data : {};
        const contestsData = contestsRes.status === 'fulfilled' && contestsRes.value.data.data ? contestsRes.value.data.data : {};
        const badgesDataRaw = badgesRes.status === 'fulfilled' && badgesRes.value.data.data ? badgesRes.value.data.data : {};
        const ratingData = ratingRes.status === 'fulfilled' && ratingRes.value.data.data ? ratingRes.value.data.data : {};
        const langData = langRes.status === 'fulfilled' && langRes.value.data.data ? langRes.value.data.data : (statsData.languages || profileData.languages || []);

        const totalSolved = statsData.totalSolved || profileData.totalSolved || 0;
        const diff = statsData.byDifficulty || {};
        const { daily, monthly, totalSubs } = processHeatmap(heatmapData);
        let acceptanceRate = heatmapData.totalSubmissions ? (totalSolved / heatmapData.totalSubmissions) * 100 : 100;

        const contestHistoryArray = contestsData.history || contestsData.contestHistory || ratingData.history || (Array.isArray(contestsData) ? contestsData : []);
        const contestHistory = contestHistoryArray.map(c => ({
            contestName: c.name || c.contest?.title || c.contestName || "LeetCode Contest",
            rating: Math.round(c.rating || 0),
            rank: c.ranking || c.rank || 0,
            startTime: c.startTime 
        })).reverse();

        let tagsMap = {};
        if (statsData.topicAnalysis) statsData.topicAnalysis.forEach(t => tagsMap[t.topic] = t.count);

        const badgesList = Array.isArray(badgesDataRaw) ? badgesDataRaw : (badgesDataRaw.list || badgesDataRaw.badges || []);
        
        const rawLcRating = ratingData.current || ratingData.rating || contestsData.current || profileData.contestRating || profileData.rating || 0;
        const rawLcMaxRating = ratingData.max || ratingData.maxRating || contestsData.max || rawLcRating;
        
        const lcRating = Math.round(rawLcRating);
        const lcMaxRating = Math.round(rawLcMaxRating);
        
        user.connectedAccounts.leetcode.stats = {
            totalSolved: totalSolved, easySolved: diff.Easy || diff.easy || 0, mediumSolved: diff.Medium || diff.medium || 0, hardSolved: diff.Hard || diff.hard || 0,
            totalSubmissions: totalSubs, acceptanceRate: acceptanceRate.toFixed(2), contestRating: lcRating, maxRating: lcMaxRating,
            rank: getLCRank(lcRating), maxRank: getLCRank(lcMaxRating), submissionCalendar: JSON.stringify(daily), monthlySubmissions: JSON.stringify(monthly),
            contestHistory: contestHistory, problemTags: tagsMap, languageStats: parseLanguages(langData), totalBadges: badgesList.length, badgesData: badgesList
        };

        user.lumaScore = (user.lumaScore || 0) + totalSolved;
        await user.save();
        res.status(200).json({ success: true, message: 'LeetCode Synced!', stats: user.connectedAccounts.leetcode.stats });
    } catch (err) { res.status(500).json({ success: false, message: 'LeetCode Error: ' + err.message }); }
};

const syncGitHub = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.connectedAccounts.github.verified) {
            return res.status(400).json({ success: false, message: 'GitHub not verified yet.' });
        }

        const username = user.connectedAccounts.github.username;
        const BASE = `https://github-stats.tashif.codes/${username}`;

        const [
            statsRes, 
            badgesRes, 
            langRes, 
            contribRes, 
            reposRes, 
            starsRes, 
            ownPullsRes, 
            extPullsRes
        ] = await Promise.allSettled([
            axios.get(`${BASE}/stats`),
            axios.get(`${BASE}/badges`),
            axios.get(`${BASE}/languages`),
            axios.get(`${BASE}/contributions`),
            axios.get(`${BASE}/repos`),
            axios.get(`${BASE}/stars`),
            axios.get(`${BASE}/me/pulls`),
            axios.get(`${BASE}/prs`)
        ]);

        const statsData = statsRes.status === 'fulfilled' ? (statsRes.value.data.data || statsRes.value.data) : {};
        const badgesDataRaw = badgesRes.status === 'fulfilled' && badgesRes.value.data.data ? badgesRes.value.data.data : {};
        const langList = langRes.status === 'fulfilled' && Array.isArray(langRes.value.data) ? langRes.value.data : (statsData.topLanguages || []);
        const contribData = contribRes.status === 'fulfilled' && contribRes.value.data.data ? contribRes.value.data.data : {};
        const reposList = reposRes.status === 'fulfilled' && Array.isArray(reposRes.value.data) ? reposRes.value.data : [];
        const starsData = starsRes.status === 'fulfilled' ? (starsRes.value.data.data || starsRes.value.data) : {};
        const ownPullsList = ownPullsRes.status === 'fulfilled' && Array.isArray(ownPullsRes.value.data) ? ownPullsRes.value.data : [];
        const extPullsList = extPullsRes.status === 'fulfilled' && Array.isArray(extPullsRes.value.data) ? extPullsRes.value.data : [];

        const totalCommits = contribData.totalSubmissions || statsData.totalCommits || statsData.totalSolved || 0;
        const currentStreak = contribData.currentStreak || statsData.currentStreak || 0;
        const longestStreak = contribData.longestStreak || statsData.longestStreak || 0;

        const { daily, monthly, totalSubs } = processHeatmap(contribData);

        const badgesList = Array.isArray(badgesDataRaw) ? badgesDataRaw : (badgesDataRaw.list || []);

        const totalStars = starsData.total_stars || 0;

        let languageMap = {};
        langList.forEach(item => {
            if (item.name && item.percentage !== undefined) {
                languageMap[item.name] = item.percentage;
            }
        });

        user.connectedAccounts.github.stats = {
            totalSolved: totalCommits, 
            totalSubmissions: totalSubs || totalCommits,
            totalRepos: reposList.length,
            totalStars: totalStars,
            currentStreak: currentStreak,
            maxStreak: longestStreak,
            submissionCalendar: JSON.stringify(daily),
            monthlySubmissions: JSON.stringify(monthly),
            topLanguages: langList,       
            languageStats: languageMap,   
            totalBadges: badgesList.length,
            badgesData: badgesList,       
            ownPRsCount: ownPullsList.length,
            externalPRsCount: extPullsList.length,
            totalPRsCount: ownPullsList.length + extPullsList.length,
            pullRequests: {
                own: ownPullsList,
                external: extPullsList
            },
            repositories: reposList
        };

        user.lumaScore = (user.lumaScore || 0) + totalCommits + (totalStars * 5) + ((ownPullsList.length + extPullsList.length) * 10);
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'GitHub synced flawlessly using exact Tashif JSON format!', 
            stats: user.connectedAccounts.github.stats 
        });

    } catch (err) { 
        res.status(500).json({ success: false, message: 'GitHub Sync Error: ' + err.message }); 
    }
};

const syncCodeforces = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.connectedAccounts.codeforces.verified) return res.status(400).json({ success: false });

        const username = user.connectedAccounts.codeforces.username;
        const BASE = `https://codeforces-stats.tashif.codes/${username}`;

        const [profileRes, statsRes, heatmapRes, contestsRes, topicsRes, ratingRes, langRes] = await Promise.allSettled([
            axios.get(`${BASE}/profile`), axios.get(`${BASE}/stats`), axios.get(`${BASE}/heatmap`), axios.get(`${BASE}/contests`), axios.get(`${BASE}/topics`), axios.get(`${BASE}/rating`), axios.get(`${BASE}/languages`)
        ]);

        const profileData = profileRes.status === 'fulfilled' && profileRes.value.data.data ? profileRes.value.data.data : {};
        const statsData = statsRes.status === 'fulfilled' && statsRes.value.data.data ? statsRes.value.data.data : {};
        const heatmapData = heatmapRes.status === 'fulfilled' && heatmapRes.value.data.data ? heatmapRes.value.data.data : {};
        const contestsData = contestsRes.status === 'fulfilled' && contestsRes.value.data.data ? contestsRes.value.data.data : {};
        const topicsData = topicsRes.status === 'fulfilled' && topicsRes.value.data.data ? topicsRes.value.data.data : [];
        const ratingData = ratingRes.status === 'fulfilled' && ratingRes.value.data.data ? ratingRes.value.data.data : {};
        const langData = langRes.status === 'fulfilled' && langRes.value.data.data ? langRes.value.data.data : (statsData.languages || profileData.languages || []);

        const totalSolved = statsData.totalSolved || profileData.totalSolved || 0;
        const { daily, monthly, totalSubs } = processHeatmap(heatmapData);
        let acceptanceRate = heatmapData.totalSubmissions ? (totalSolved / heatmapData.totalSubmissions) * 100 : 100;

        const contestHistoryRaw = contestsData.history || contestsData.contestHistory || ratingData.history || (Array.isArray(contestsData) ? contestsData : []);
        const contestHistory = contestHistoryRaw.map(c => ({
            contestName: c.contestName || c.name || "Codeforces Contest", rating: Math.round(c.newRating || c.rating || 0), rank: c.rank || c.ranking || 0
        })).reverse();

        let tagsMap = {};
        if (Array.isArray(topicsData)) topicsData.forEach(t => tagsMap[t.topic] = t.count);
        else if (statsData.topicAnalysis) statsData.topicAnalysis.forEach(t => tagsMap[t.topic] = t.count);

        const currentRating = ratingData.current || ratingData.rating || contestsData.current || profileData.rating || profileData.currentRating || 0;
        const maxRating = ratingData.max || ratingData.maxRating || contestsData.max || profileData.maxRating || currentRating;

        user.connectedAccounts.codeforces.stats = {
            totalSolved: totalSolved, totalSubmissions: totalSubs, acceptanceRate: acceptanceRate.toFixed(2), currentRating: currentRating, maxRating: maxRating,
            rank: getCFRank(currentRating), maxRank: getCFRank(maxRating), submissionCalendar: JSON.stringify(daily), monthlySubmissions: JSON.stringify(monthly),
            contestHistory: contestHistory, problemTags: tagsMap, languageStats: parseLanguages(langData)
        };

        user.lumaScore = (user.lumaScore || 0) + totalSolved;
        await user.save();
        res.status(200).json({ success: true, message: 'Codeforces Synced!', stats: user.connectedAccounts.codeforces.stats });
    } catch (err) { res.status(500).json({ success: false, message: 'Codeforces Error: ' + err.message }); }
};

const syncCodeChef = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.connectedAccounts.codechef.verified) return res.status(400).json({ success: false });

        const username = user.connectedAccounts.codechef.username;
        const BASE = `https://codechef-stats.tashif.codes/${username}`;

        const [profileRes, contestsRes, heatmapRes, statsRes, ratingRes, langRes] = await Promise.allSettled([
            axios.get(`${BASE}/profile`), axios.get(`${BASE}/contests`), axios.get(`${BASE}/heatmap`), axios.get(`${BASE}/stats`), axios.get(`${BASE}/rating`), axios.get(`${BASE}/languages`)
        ]);

        const profileData = profileRes.status === 'fulfilled' && profileRes.value.data.data ? profileRes.value.data.data : {};
        const contestsData = contestsRes.status === 'fulfilled' && contestsRes.value.data.data ? contestsRes.value.data.data : {};
        const heatmapData = heatmapRes.status === 'fulfilled' && heatmapRes.value.data.data ? heatmapRes.value.data.data : {};
        const statsData = statsRes.status === 'fulfilled' && statsRes.value.data.data ? statsRes.value.data.data : {};
        const ratingData = ratingRes.status === 'fulfilled' && ratingRes.value.data.data ? ratingRes.value.data.data : {};
        const langData = langRes.status === 'fulfilled' && langRes.value.data.data ? langRes.value.data.data : (statsData.languages || profileData.languages || []);

        const totalSolved = statsData.totalSolved || profileData.totalSolved || 0;
        const contestHistoryRaw = contestsData.history || contestsData.contestHistory || ratingData.history || (Array.isArray(contestsData) ? contestsData : []);
        const contestHistory = contestHistoryRaw.map(c => ({
            contestName: c.contestName || c.name || "CodeChef Contest", rating: Math.round(c.rating || c.newRating || 0), rank: c.rank || c.ranking || 0
        })).reverse();

        let acceptanceRate = heatmapData.totalSubmissions ? (totalSolved / heatmapData.totalSubmissions) * 100 : 100;
        const { daily, monthly, totalSubs } = processHeatmap(heatmapData);

        const currentRating = ratingData.current || ratingData.rating || contestsData.current || profileData.currentRating || profileData.rating || 0;
        const maxRating = ratingData.max || ratingData.maxRating || contestsData.max || profileData.maxRating || currentRating;
        const starRank = getCCRank(currentRating);
        const ccBadge = { id: "codechef_star", displayName: starRank, name: starRank, icon: "" };

        user.connectedAccounts.codechef.stats = {
            totalSolved: 0, totalSubmissions: totalSubs, acceptanceRate: acceptanceRate.toFixed(2), currentRating: currentRating, maxRating: maxRating,
            rank: starRank, maxRank: getCCRank(maxRating), submissionCalendar: JSON.stringify(daily), monthlySubmissions: JSON.stringify(monthly),
            contestHistory: contestHistory, badgesData: [ccBadge], languageStats: parseLanguages(langData)
        };

        user.lumaScore = (user.lumaScore || 0) + totalSolved;
        await user.save();
        res.status(200).json({ success: true, message: 'CodeChef Synced!', stats: user.connectedAccounts.codechef.stats });
    } catch (err) { res.status(500).json({ success: false, message: 'CodeChef Error: ' + err.message }); }
};

const syncGeeksForGeeks = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.connectedAccounts.geeksforgeeks.verified) return res.status(400).json({ success: false });

        const username = user.connectedAccounts.geeksforgeeks.username;
        const BASE = `https://gfg-stats.tashif.codes/${username}`;

        const [profileRes, statsRes, heatmapRes, topicsRes, langRes] = await Promise.allSettled([
            axios.get(`${BASE}/profile`), axios.get(`${BASE}/stats`), axios.get(`${BASE}/heatmap`), axios.get(`${BASE}/topics`), axios.get(`${BASE}/languages`)
        ]);

        const statsData = statsRes.status === 'fulfilled' && statsRes.value.data.data ? statsRes.value.data.data : {};
        const heatmapData = heatmapRes.status === 'fulfilled' && heatmapRes.value.data.data ? heatmapRes.value.data.data : {};
        const topicsData = topicsRes.status === 'fulfilled' && topicsRes.value.data.data ? topicsRes.value.data.data : [];
        const langData = langRes.status === 'fulfilled' && langRes.value.data.data ? langRes.value.data.data : (statsData.languages || []);

        const totalSolved = statsData.totalSolved || 0;
        const diff = statsData.byDifficulty || {};
        const { daily, monthly, totalSubs } = processHeatmap(heatmapData);

        let tagsMap = {};
        if (Array.isArray(topicsData)) topicsData.forEach(t => tagsMap[t.topic] = t.count);

        user.connectedAccounts.geeksforgeeks.stats = {
            totalSolved: totalSolved, easySolved: diff.easy || 0, mediumSolved: diff.medium || 0, hardSolved: diff.hard || 0,
            totalSubmissions: totalSubs, totalAccepted: totalSolved, acceptanceRate: 100, submissionCalendar: JSON.stringify(daily),
            monthlySubmissions: JSON.stringify(monthly), problemTags: tagsMap, languageStats: parseLanguages(langData)
        };

        user.lumaScore = (user.lumaScore || 0) + totalSolved;
        await user.save();
        res.status(200).json({ success: true, message: 'GFG Synced!', stats: user.connectedAccounts.geeksforgeeks.stats });
    } catch (err) { res.status(500).json({ success: false, message: 'GFG Error: ' + err.message }); }
};

const unlinkPlatform = async (req, res) => {
    try {
        const { platform } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const platformKey = platform.toLowerCase();
        
        user.connectedAccounts[platformKey] = {
            username: "",
            verified: false,
            stats: {}
        };
        
        user.markModified('connectedAccounts');
        
        // Recalculate lumaScore
        const { calculateLumaScore } = require('../utils/scoreCalculator');
        const sc = calculateLumaScore(user.connectedAccounts);
        user.lumaScore = sc.totalScore;

        await user.save();

        res.status(200).json({ success: true, message: `${platform} unlinked successfully!` });
    } catch (error) {
        console.error("Unlink Error:", error);
        res.status(500).json({ success: false, message: 'Server Error during unlink' });
    }
};


module.exports = { connectPlatform, generateVerificationCode, verifyPlatform, syncGeeksForGeeks, syncCodeChef, syncLeetCode, syncCodeforces, syncGitHub, cLuma, syncAllData, unlinkPlatform };
