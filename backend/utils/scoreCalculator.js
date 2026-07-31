const calculateLumaScore = (connectedAccounts = {}) => {
    let cpScore = 0;
    let dsaScore = 0;
    let openSourceScore = 0;
    let badgeScore = 0;

    const lc = connectedAccounts.leetcode?.stats || {};
    const cf = connectedAccounts.codeforces?.stats || {};
    const cc = connectedAccounts.codechef?.stats || {};
    const gfg = connectedAccounts.geeksforgeeks?.stats || {};
    const gh = connectedAccounts.github?.stats || {};

    const lcRating = Number(lc.contestRating) || Number(lc.currentRating) || 0;
    const cfRating = Number(cf.currentRating) || 0;
    const ccRating = Number(cc.currentRating) || 0;

    if (lcRating > 0) cpScore += lcRating * 2;
    if (ccRating > 0) cpScore += ccRating * 2.5;
    if (cfRating > 0) cpScore += cfRating * 3.0;

    const lcEasy = Number(lc.easySolved) || 0;
    const lcMed = Number(lc.mediumSolved) || 0;
    const lcHard = Number(lc.hardSolved) || 0;
    const lcSolved = Number(lc.totalSolved) || (lcEasy + lcMed + lcHard);
    
    if (lcEasy || lcMed || lcHard) {
        dsaScore += (lcEasy * 1) + (lcMed * 3) + (lcHard * 5);
    } 

    const gfgEasy = Number(gfg.easySolved) || 0;
    const gfgMed = Number(gfg.mediumSolved) || 0;
    const gfgHard = Number(gfg.hardSolved) || 0;
    const gfgSolved = Number(gfg.totalSolved) || (gfgEasy + gfgMed + gfgHard);
    
    if (gfgEasy || gfgMed || gfgHard) {
        dsaScore += (gfgEasy * 1) + (gfgMed * 2) + (gfgHard * 4);
    } 

    const cfSolved = Number(cf.totalSolved) || 0;
    const ccSolved = Number(cc.totalSolved) || 0;
    dsaScore += (cfSolved * 3) + (ccSolved * 2);

    const applyAcceptanceBonus = (solved, rate) => {
        const numRate = Number(rate) || 0;
        if (solved > 0 && numRate > 0) {
            return (numRate / 100) * solved * 2;
        }
        return 0;
    };

    dsaScore += applyAcceptanceBonus(lcSolved, lc.acceptanceRate);
    dsaScore += applyAcceptanceBonus(cfSolved, cf.acceptanceRate);
    dsaScore += applyAcceptanceBonus(ccSolved, cc.acceptanceRate);

    const externalPRs = Number(gh.externalPRsCount) || gh.pullRequests?.external?.length || 0;
    const ownPRs = Number(gh.ownPRsCount) || gh.pullRequests?.own?.length || 0;
    const commits = Number(gh.totalSolved) || Number(gh.totalSubmissions) || 0;
    const stars = Number(gh.totalStars) || 0;
    const repos = Number(gh.totalRepos) || 0;

    openSourceScore += (externalPRs * 3); 
    openSourceScore += (ownPRs * 1);       
    openSourceScore += (commits * 1);       
    openSourceScore += (stars * 3);        
    openSourceScore += (repos * 1);        

    const lcBadges = Number(lc.totalBadges) || lc.badgesData?.length || 0;
    const ghBadges = Number(gh.totalBadges) || gh.badgesData?.length || 0;
    const ccBadges = cc.badgesData?.length || 0;

    badgeScore += (lcBadges * 5); 
    badgeScore += (ghBadges * 3); 
    badgeScore += (ccBadges * 3); 

    const totalScore = Math.round(cpScore + dsaScore + openSourceScore + badgeScore);

    return {
        totalScore,
        breakdown: {
            competitiveProgramming: Math.round(cpScore),
            dsaVolumeAndAccuracy: Math.round(dsaScore),
            openSourceEngineering: Math.round(openSourceScore),
            badgesAndHonors: Math.round(badgeScore)
        }
    };
};

module.exports = { calculateLumaScore };
