const User = require('../models/User');
const { calculateLumaScore } = require('../utils/scoreCalculator');

const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: new RegExp(`^${req.params.username.trim()}$`, 'i') });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        const scoreData = calculateLumaScore(user.connectedAccounts);
        if (user.lumaScore !== scoreData.totalScore) {
            user.lumaScore = scoreData.totalScore;
            await user.save();
        }

        const totalUsers = await User.countDocuments({ lumaScore: { $gt: 0 } });
        const higherScoring = await User.countDocuments({ lumaScore: { $gt: user.lumaScore } });
        const globalRank = user.lumaScore > 0 ? higherScoring + 1 : totalUsers || 1;
        const percentile = (user.lumaScore > 0 && totalUsers > 0) 
            ? Math.max(1, Math.round((globalRank / totalUsers) * 100)) 
            : 100;

        res.status(200).json({ 
            success: true, 
            user, 
            scoreBreakdown: scoreData.breakdown, 
            globalRank,
            percentile 
        });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const params = { ...req.query, ...req.body };
        const { status, search, page = 1, limit = 50, minScore, maxScore, graduationYear } = params;

        let query = {}; 

        if (status && status.trim() !== "") {
            query.professionalStatus = { $regex: status.trim(), $options: 'i' };
        }

        if (search && search.trim() !== "") {
            query.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { username: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        if (minScore !== undefined || maxScore !== undefined) {
            query.lumaScore = {};
            if (minScore !== undefined) query.lumaScore.$gte = Number(minScore);
            if (maxScore !== undefined) query.lumaScore.$lte = Number(maxScore);
        }

        if (graduationYear) {
            query.graduationYear = Number(graduationYear);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const users = await User.find(query)
            .sort({ lumaScore: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select('-password -emailVerificationOTP -resetPasswordOTP -emailVerificationOTPExpires');

        const maskedLeaderboard = users.map(user => {
            if (user.visibility === 'Private') {
                const userObj = user.toObject ? user.toObject() : user;
                return {
                    ...userObj,
                    name: 'Anonymous User',
                    username: 'anonymous', 
                    profilePicture: 'https://ui-avatars.com/api/?name=Anonymous&background=0D1117&color=fff',
                    isPrivate: true 
                };
            }
            return user;
        });

        const totalUsers = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            leaderboard: maskedLeaderboard,
            currentPage: Number(page),
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const completeOnboarding = async (req, res) => {
    try {
        const { professionalStatus, college, position, graduationYear, experienceYears, location, bio, skipped } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!skipped) {
            if (professionalStatus) user.professionalStatus = professionalStatus.trim();
            if (college) user.college = college.trim();
            if (position) user.position = position.trim();
            if (graduationYear) user.graduationYear = parseInt(graduationYear);
            if (experienceYears) user.experienceYears = parseInt(experienceYears);
            if (location) user.location = location.trim();
            if (bio) user.bio = bio.trim();
        }

        user.isOnboardingComplete = true;
        await user.save();

        res.status(200).json({ success: true, message: skipped ? 'Onboarding skipped.' : 'Profile onboarding completed successfully!', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Onboarding Error: ' + error.message });
    }
};

const normalizeTopic = (rawTag) => {
    if (!rawTag || typeof rawTag !== 'string') return "other / misc";
    const clean = rawTag.toLowerCase().trim().replace(/[_-]/g, ' ');

    const SYNONYMS = {
        "array": "arrays & matrix", "arrays": "arrays & matrix", "matrix": "arrays & matrix", "matrices": "arrays & matrix", "2d array": "arrays & matrix", "grid": "arrays & matrix",
        "string": "strings", "strings": "strings", "string matching": "strings", "string suffix structures": "strings", "suffix array": "strings", "rolling hash": "strings",
        "dp": "dynamic programming", "dynamic programming": "dynamic programming", "1d dp": "dynamic programming", "2d dp": "dynamic programming", "bitmasks": "dynamic programming", "bitmask": "dynamic programming",
        "math": "math & number theory", "mathematics": "math & number theory", "mathematical": "math & number theory", "number theory": "math & number theory", "geometry": "math & number theory", "combinatorics": "math & number theory", "combinatorial": "math & number theory", "modular arithmetic": "math & number theory", "probabilities": "math & number theory", "fft": "math & number theory", "series": "math & number theory", "fibonacci": "math & number theory",
        "hash table": "hashing & maps", "hash": "hashing & maps", "hashing": "hashing & maps", "map": "hashing & maps", "ordered set": "hashing & maps",
        "tree": "trees & graphs", "trees": "trees & graphs", "binary tree": "trees & graphs", "binary search tree": "trees & graphs", "segment tree": "trees & graphs", "binary indexed tree": "trees & graphs", "trie": "trees & graphs", "graph": "trees & graphs", "graphs": "trees & graphs", "graph theory": "trees & graphs", "graph matchings": "trees & graphs", "topological sort": "trees & graphs", "shortest path": "trees & graphs", "shortest paths": "trees & graphs", "flows": "trees & graphs", "union find": "trees & graphs", "dsu": "trees & graphs",
        "dfs": "dfs & bfs", "bfs": "dfs & bfs", "depth first search": "dfs & bfs", "breadth first search": "dfs & bfs", "dfs and similar": "dfs & bfs", "traversals": "dfs & bfs",
        "binary search": "binary search", "searching": "binary search", "ternary search": "binary search", "sorting": "sorting", "sortings": "sorting", "quickselect": "sorting",
        "two pointers": "two pointers & sliding window", "two pointer algorithm": "two pointers & sliding window", "sliding window": "two pointers & sliding window",
        "stack": "stack, queue & heap", "queue": "stack, queue & heap", "monotonic stack": "stack, queue & heap", "monotonic queue": "stack, queue & heap", "heap": "stack, queue & heap", "priority queue": "stack, queue & heap",
        "backtracking": "recursion & backtracking", "recursion": "recursion & backtracking", "divide and conquer": "recursion & backtracking",
        "greedy": "greedy", "constructive algorithms": "constructive algorithms", "constructive algo": "constructive algorithms",
        "linked list": "linked list", "bit manipulation": "bit manipulation", "bit magic": "bit manipulation",
        "brute force": "brute force & simulation", "simulation": "brute force & simulation", "implementation": "implementation & design", "design": "implementation & design", "design pattern": "implementation & design", "data stream": "implementation & design", "data structures": "data structures & stl", "stl": "data structures & stl", "database": "database",
        "enumeration": "other / misc", "interactive": "other / misc", "games": "game theory", "game theory": "game theory", "brainteaser": "other / misc", "randomized": "other / misc", "sweep line": "other / misc", "expression parsing": "other / misc", "schedules": "other / misc", "iterator": "other / misc", "subset": "other / misc", "misc": "other / misc", "*special": "other / misc"
    };

    if (SYNONYMS[clean]) return SYNONYMS[clean];
    for (const [key, canonical] of Object.entries(SYNONYMS)) {
        if (clean.includes(key)) return canonical;
    }
    return clean;
};

const getGlobalAnalytics = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username: username });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const scoreData = calculateLumaScore(user.connectedAccounts);
        if (user.lumaScore !== scoreData.totalScore) {
            user.lumaScore = scoreData.totalScore;
            await user.save();
        }

        const totalUsers = await User.countDocuments({ lumaScore: { $gt: 0 } });
        const higherScoring = await User.countDocuments({ lumaScore: { $gt: scoreData.totalScore } });
        const globalRank = scoreData.totalScore > 0 ? higherScoring + 1 : totalUsers || 1;
        const percentile = (scoreData.totalScore > 0 && totalUsers > 0) 
            ? Math.max(1, Math.round((globalRank / totalUsers) * 100)) 
            : 100;

        const platformsToAggregate = ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks', 'github'];
        const codingPlatforms = ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks'];
        
        let globalHeatmap = {};
        let globalMonthly = {};
        let totalDsaSolved = 0;
        let githubContributions = 0; 
        let dsaTopics = {};
        let languageStats = {};

        let platformActivity = {
            leetcode: { dailySubmissions: {}, monthlySubmissions: {} },
            codeforces: { dailySubmissions: {}, monthlySubmissions: {} },
            codechef: { dailySubmissions: {}, monthlySubmissions: {} },
            geeksforgeeks: { dailySubmissions: {}, monthlySubmissions: {} },
            github: { dailyContributions: {}, monthlyContributions: {} } 
        };

        codingPlatforms.forEach(plat => {
            if (user.connectedAccounts[plat]?.verified && user.connectedAccounts[plat]?.stats) {
                totalDsaSolved += (Number(user.connectedAccounts[plat].stats.totalSolved) || 0);
            }
        });

        if (user.connectedAccounts.github?.verified && user.connectedAccounts.github?.stats) {
            githubContributions = Number(user.connectedAccounts.github.stats.totalSolved) || Number(user.connectedAccounts.github.stats.totalSubmissions) || 0;
        }

        platformsToAggregate.forEach(platformKey => {
            const platform = user.connectedAccounts[platformKey];
            
            if (platform && platform.verified && platform.stats) {
                if (platform.stats.submissionCalendar && platform.stats.submissionCalendar !== "{}") {
                    try {
                        const dailyData = JSON.parse(platform.stats.submissionCalendar);
                        
                        if (platformKey === 'github') {
                            platformActivity.github.dailyContributions = dailyData;
                        } else if (platformActivity[platformKey]) {
                            platformActivity[platformKey].dailySubmissions = dailyData;
                        }

                        for (const [dateStr, count] of Object.entries(dailyData)) {
                            if (!globalHeatmap[dateStr]) {
                                globalHeatmap[dateStr] = {
                                    total: 0, leetcode: 0, codeforces: 0, codechef: 0, geeksforgeeks: 0, github: 0
                                };
                            }
                            globalHeatmap[dateStr][platformKey] = count;
                            globalHeatmap[dateStr].total += count;
                        }
                    } catch (e) { }
                }

                if (platform.stats.monthlySubmissions && platform.stats.monthlySubmissions !== "{}") {
                    try {
                        const monthlyData = JSON.parse(platform.stats.monthlySubmissions);
                        
                        if (platformKey === 'github') {
                            platformActivity.github.monthlyContributions = monthlyData;
                        } else if (platformActivity[platformKey]) {
                            platformActivity[platformKey].monthlySubmissions = monthlyData;
                        }

                        for (const [monthKey, stats] of Object.entries(monthlyData)) {
                            if (!globalMonthly[monthKey]) {
                                globalMonthly[monthKey] = {
                                    total: 0, leetcode: 0, codeforces: 0, codechef: 0, geeksforgeeks: 0, github: 0
                                };
                            }
                            globalMonthly[monthKey][platformKey] += (stats.submitted || 0);
                            globalMonthly[monthKey].total += (stats.submitted || 0);
                        }
                    } catch (e) { }
                }

                if (platform.stats.problemTags && platformKey !== 'codechef' && platformKey !== 'github') { 
                    for (const [rawTag, count] of Object.entries(platform.stats.problemTags)) {
                        const cleanTopic = normalizeTopic(rawTag);
                        dsaTopics[cleanTopic] = (dsaTopics[cleanTopic] || 0) + count;
                    }
                }

                if (platform.stats.languageStats) {
                    for (const [lang, count] of Object.entries(platform.stats.languageStats)) {
                        const cleanLang = lang.trim();
                        languageStats[cleanLang] = (languageStats[cleanLang] || 0) + count;
                    }
                }
            }
        });

        let totalActiveDays = 0, currentStreak = 0, maxStreak = 0, platformsActiveToday = 0;
        const activeDates = Object.keys(globalHeatmap).filter(dateStr => globalHeatmap[dateStr].total > 0).sort(); 
        
        const todayDate = new Date();
        const todayStr = todayDate.toISOString().split('T')[0];
        const yesterdayDate = new Date(todayDate);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

        if (activeDates.length > 0) {
            totalActiveDays = activeDates.length;
            let tempStreak = 1; maxStreak = 1;
            for (let i = 1; i < activeDates.length; i++) {
                const d1 = new Date(activeDates[i - 1]), d2 = new Date(activeDates[i]);
                const diffDays = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)); 
                if (diffDays === 1) { tempStreak++; maxStreak = Math.max(maxStreak, tempStreak); } 
                else { tempStreak = 1; }
            }
            const lastActiveDate = activeDates[activeDates.length - 1];
            if (lastActiveDate === todayStr || lastActiveDate === yesterdayStr) currentStreak = tempStreak;
        }

        if (globalHeatmap[todayStr]) {
            const todayStats = globalHeatmap[todayStr];
            platformsToAggregate.forEach(plat => { if (todayStats[plat] > 0) platformsActiveToday++; });
        }

        let dsaAnalysisArray = Object.entries(dsaTopics).map(([topic, solved]) => ({
            topic, solved, percentage: totalDsaSolved > 0 ? parseFloat(((solved / totalDsaSolved) * 100).toFixed(1)) : 0
        })).sort((a, b) => b.solved - a.solved);

        let languagePieChart = Object.entries(languageStats).map(([lang, count]) => ({
            language: lang, count: count
        })).sort((a, b) => b.count - a.count);

        res.status(200).json({
            success: true,
            data: {
                lumaScore: scoreData.totalScore,
                scoreBreakdown: scoreData.breakdown,
                globalRank,
                percentile,
                globalHeatmap, 
                globalMonthly,
                activity: { totalActiveDays, currentStreak, maxStreak, platformsActiveToday },
                dsaAnalysis: { 
                    totalDsaProblems: totalDsaSolved,
                    topics: dsaAnalysisArray 
                },
                githubContributions, 
                platformActivity,
                topLanguages: languagePieChart
            }
        });
    } catch (error) { 
        res.status(500).json({ success: false, message: 'Aggregator Error: ' + error.message }); 
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { name, username, bio, professionalStatus, graduationYear, experienceYears, location, visibility, college } = req.body;

        if (username && username.trim() !== user.username) {
            const formattedUsername = username.toLowerCase().trim();
            const usernameTaken = await User.findOne({ username: formattedUsername });
            if (usernameTaken) {
                return res.status(400).json({ success: false, message: 'This username is already taken!' });
            }
            user.username = formattedUsername;
        }

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio; 
        if (professionalStatus) user.professionalStatus = professionalStatus;
        if (graduationYear !== undefined) user.graduationYear = graduationYear;
        if (experienceYears !== undefined) user.experienceYears = experienceYears;
        if (location !== undefined) user.location = location;
        if (visibility) user.visibility = visibility;
        if (college !== undefined) user.college = college;

        await user.save();

        user.password = undefined;
        user.emailVerificationOTP = undefined;
        user.resetPasswordOTP = undefined;

        res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: 'Server Error while updating profile' });
    }
};

const connectPlatform = async (req, res) => {
    try {
        const { platform, username } = req.body; 
        
        if (!platform || !username) {
            return res.status(400).json({ success: false, message: 'Platform and username are required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const platformKey = platform.toLowerCase();
        
        const alreadyClaimed = await User.findOne({
            [`connectedAccounts.${platformKey}.username`]: { $regex: new RegExp(`^${username}$`, 'i') },
            [`connectedAccounts.${platformKey}.verified`]: true
        });

        if (alreadyClaimed && alreadyClaimed._id.toString() !== user._id.toString()) {
            return res.status(400).json({ success: false, message: `This ${platform} username is already connected to another account.` });
        }

        if (!user.connectedAccounts) user.connectedAccounts = {};
        if (!user.connectedAccounts[platformKey]) user.connectedAccounts[platformKey] = {};
        
        user.connectedAccounts[platformKey].username = username;
        user.connectedAccounts[platformKey].verified = false;

        await user.save();

        res.status(200).json({ success: true, message: `Successfully linked ${platform}. Please verify.` });
    } catch (error) {
        console.error("Connect Platform Error:", error);
        res.status(500).json({ success: false, message: 'Server Error while connecting platform' });
    }
};

const toggleUserInPlaylist = async (req, res) => {
    try {
        const { playlistName, targetUsername } = req.body;
        const user = await User.findById(req.user._id);

        if (!playlistName || !targetUsername) {
            return res.status(400).json({ success: false, message: 'Please provide playlistName and targetUsername' });
        }

        const targetUser = await User.findOne({ username: targetUsername });
        if (!targetUser) return res.status(404).json({ success: false, message: 'Target developer not found' });

        const targetUserId = targetUser._id;

        let playlist = user.playlists.find(p => p.name.toLowerCase() === playlistName.toLowerCase());

        if (!playlist) {
            user.playlists.push({ name: playlistName, savedUsers: [targetUserId] });
            await user.save();
            return res.status(200).json({ success: true, message: `Created playlist '${playlistName}' and saved ${targetUsername}!`, playlists: user.playlists });
        }

        const userIndex = playlist.savedUsers.indexOf(targetUserId);
        if (userIndex > -1) {
            playlist.savedUsers.splice(userIndex, 1);
            await user.save();
            return res.status(200).json({ success: true, message: `Removed ${targetUsername} from '${playlist.name}'`, playlists: user.playlists });
        } else {
            playlist.savedUsers.push(targetUserId);
            await user.save();
            return res.status(200).json({ success: true, message: `Added ${targetUsername} to '${playlist.name}'`, playlists: user.playlists });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Playlist Error: ' + error.message });
    }
};

const getUserPlaylists = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('playlists.savedUsers', 'name username profilePicture professionalStatus lumaScore');
        res.status(200).json({ success: true, playlists: user.playlists });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const compareProfiles = async (req, res) => {
    try {
        const { username1, username2 } = req.params;

        const user1 = await User.findOne({ username: new RegExp(`^${username1.trim()}$`, 'i') });
        const user2 = await User.findOne({ username: new RegExp(`^${username2.trim()}$`, 'i') });

        if (!user1 || !user2) {
            const missing = !user1 && !user2 ? `${username1} & ${username2}` : (!user1 ? username1 : username2);
            return res.status(404).json({ success: false, message: `Developer '${missing}' not found.` });
        }

        const extractStats = (user) => {
            const lc = user.connectedAccounts?.leetcode?.stats || {};
            const cf = user.connectedAccounts?.codeforces?.stats || {};
            const cc = user.connectedAccounts?.codechef?.stats || {};
            const gfg = user.connectedAccounts?.geeksforgeeks?.stats || {};
            const gh = user.connectedAccounts?.github?.stats || {};

            const totalSolved = (Number(lc.totalSolved) || 0) +
                                (Number(cf.totalSolved) || 0) +
                                (Number(cc.totalSolved) || 0) +
                                (Number(gfg.totalSolved) || 0);

            const totalBadges = (Number(lc.totalBadges) || 0) + (Number(gh.totalBadges) || 0);

            const verifiedPlatforms = Object.values(user.connectedAccounts || {})
                .filter(acc => acc && acc.verified).length;

            return {
                name: user.name,
                username: user.username,
                profilePicture: user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=4F46E5&color=fff`,
                lumaScore: user.lumaScore || 0,
                totalSolved,
                leetcodeRating: Math.round(lc.contestRating || 0),
                codeforcesRating: Number(cf.currentRating) || 0,
                codechefRating: Number(cc.currentRating) || 0,
                githubCommits: Number(gh.totalSubmissions) || Number(gh.totalSolved) || 0,
                githubStars: Number(gh.totalStars) || 0,
                totalBadges,
                verifiedPlatforms
            };
        };

        res.status(200).json({
            success: true,
            data: {
                user1: extractStats(user1),
                user2: extractStats(user2)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Comparison Error: ' + error.message });
    }
};

const getSdeSheets = async (req, res) => {
    try {
        const sheets = [
            {
                id: "striver-a2z",
                title: "Striver's A2Z DSA Sheet",
                description: "Complete roadmap to learn DSA from scratch to advanced concepts.",
                url: "https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z",
                icon: "StriverIcon"
            },
            {
                id: "love-babbar",
                title: "Love Babbar 450 Sheet",
                description: "The classic 450 questions SDE sheet for interview preparation.",
                url: "https://www.geeksforgeeks.org/explore?page=2&sprint=94ade6723438d94ecf0c00c3937dad55&sortBy=submissions&sprint_name=Love%20Babbar%20Sheet",
                icon: "BabbarIcon"
            },
            {
                id: "cses",
                title: "CSES Problem Set",
                description: "Essential collection of algorithmic problem practice for competitive programmers.",
                url: "https://cses.fi/problemset/",
                icon: "CsesIcon"
            },
            {
                id: "blind-75",
                title: "Blind 75 LeetCode Problems",
                description: "The most famous curated list of 75 essential LeetCode questions.",
                url: "https://takeuforward.org/dsa/blind-75-leetcode-problems-detailed-video-solutions",
                icon: "Blind75Icon"
            },
            {
                id: "strivers-79",
                title: "Striver's S79 Last Moment Sheet",
                description: "Quick revision sheet for the last moments before an interview.",
                url: "https://takeuforward.org/dsa/strivers-79-last-moment-dsa-sheet-ace-interviews",
                icon: "StriverIcon"
            },
            {
                id: "strivers-sde",
                title: "Striver's SDE Sheet",
                description: "Top coding interview problems handpicked by Striver.",
                url: "https://takeuforward.org/dsa/strivers-sde-sheet-top-coding-interview-problems",
                icon: "StriverIcon"
            },
            {
                id: "strivers-cp",
                title: "Striver's CP Sheet",
                description: "Structured competitive programming sheet to level up your rating.",
                url: "https://takeuforward.org/competitive-programming/strivers-cp-sheet",
                icon: "CpIcon"
            },
            {
                id: "tle-eliminators",
                title: "TLE Eliminators CP Sheet",
                description: "Rating-wise curated competitive programming problems.",
                url: "https://www.tle-eliminators.com/cp-sheet",
                icon: "TleIcon"
            }
        ];

        res.status(200).json({ success: true, sheets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
    getPublicProfile, getLeaderboard, getGlobalAnalytics, completeOnboarding, 
    updateUserProfile, toggleUserInPlaylist, getUserPlaylists,
    compareProfiles, connectPlatform, getSdeSheets 
};
