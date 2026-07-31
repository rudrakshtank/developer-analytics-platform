import axios from 'axios';

export const scheduleContestReminders = (contest) => {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop/in-app notifications.");
        return;
    }

    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            const contestTime = new Date(contest.startTime).getTime();
            const now = Date.now();

            const reminders = [
                { label: "6 Hours", time: 6 * 60 * 60 * 1000 },
                { label: "1 Hour", time: 60 * 60 * 1000 },
                { label: "5 Minutes", time: 5 * 60 * 1000 }
            ];

            let scheduledCount = 0;

            reminders.forEach((rem) => {
                const triggerTime = contestTime - rem.time;
                const delay = triggerTime - now;

                if (delay > 0) {
                    setTimeout(() => {
                        new Notification(`🚀 Contest Reminder: ${contest.title}`, {
                            body: `${contest.title} on ${contest.platform} starts in exactly ${rem.label}! Get your workspace ready!`,
                            icon: contest.logo
                        });
                    }, delay);
                    scheduledCount++;
                }
            });

            const existingReminders = JSON.parse(localStorage.getItem('savedReminders') || '[]');
            if (!existingReminders.includes(contest.id)) {
                existingReminders.push(contest.id);
                localStorage.setItem('savedReminders', JSON.stringify(existingReminders));
            }

            alert(`✅ Reminder Set! You will be notified 6h, 1h, and 5m before "${contest.title}" starts.`);
        } else {
            alert("Please allow browser notifications to receive contest alerts!");
        }
    });
};

export const getUpcomingContests = async () => {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    let contests = [];

    const lcWeeklyAnchor = new Date('2026-07-26T02:30:00Z'); 
    let nextLcWeekly = new Date(lcWeeklyAnchor);
    while (nextLcWeekly < now) {
        nextLcWeekly.setDate(nextLcWeekly.getDate() + 7);
    }
    const lcWeeklyDiff = Math.round((nextLcWeekly - lcWeeklyAnchor) / (1000 * 60 * 60 * 24 * 7));
    const lcWeeklyNum = 512 + lcWeeklyDiff;
    contests.push({
        id: `lc-w-${lcWeeklyNum}`,
        platform: 'LeetCode',
        title: `Weekly Contest ${lcWeeklyNum}`,
        startTime: nextLcWeekly.toISOString(),
        url: `https://leetcode.com/contest/weekly-contest-${lcWeeklyNum}/`,
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg',
        color: '#FFA116'
    });

    const lcBiweeklyAnchor = new Date('2026-07-18T14:30:00Z');
    let nextLcBiweekly = new Date(lcBiweeklyAnchor);
    while (nextLcBiweekly < now) {
        nextLcBiweekly.setDate(nextLcBiweekly.getDate() + 14);
    }
    const lcBiweeklyDiff = Math.round((nextLcBiweekly - lcBiweeklyAnchor) / (1000 * 60 * 60 * 24 * 14));
    const lcBiweeklyNum = 187 + lcBiweeklyDiff;
    contests.push({
        id: `lc-bw-${lcBiweeklyNum}`,
        platform: 'LeetCode',
        title: `Biweekly Contest ${lcBiweeklyNum}`,
        startTime: nextLcBiweekly.toISOString(),
        url: `https://leetcode.com/contest/biweekly-contest-${lcBiweeklyNum}/`,
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/leetcode.svg',
        color: '#FFA116'
    });

    const ccStartersAnchor = new Date('2026-07-22T14:30:00Z'); 
    let nextCcStarters = new Date(ccStartersAnchor);
    while (nextCcStarters < now) {
        nextCcStarters.setDate(nextCcStarters.getDate() + 7);
    }

    if (nextCcStarters <= oneWeekFromNow) {
        const ccStartersDiff = Math.round((nextCcStarters - ccStartersAnchor) / (1000 * 60 * 60 * 24 * 7));
        const ccStartersNum = 248 + ccStartersDiff;
        contests.push({
            id: `cc-s-${ccStartersNum}`,
            platform: 'CodeChef',
            title: `Starters ${ccStartersNum}`,
            startTime: nextCcStarters.toISOString(),
            url: `https://www.codechef.com/START${ccStartersNum}A`,
            logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codechef.svg',
            color: '#5B4638'
        });
    }

    const ccMunchAnchor = new Date('2026-07-27T13:30:00Z'); 
    let nextCcMunch = new Date(ccMunchAnchor);
    while (nextCcMunch < now) {
        nextCcMunch.setDate(nextCcMunch.getDate() + 7);
    }
    if (nextCcMunch <= oneWeekFromNow) {
        const ccMunchDiff = Math.round((nextCcMunch - ccMunchAnchor) / (1000 * 60 * 60 * 24 * 7));
        const ccMunchNum = String(13 + ccMunchDiff).padStart(3, '0');
        contests.push({
            id: `cc-m-${ccMunchNum}`,
            platform: 'CodeChef',
            title: `Monday Munch DSA ${ccMunchNum}`,
            startTime: nextCcMunch.toISOString(),
            url: `https://www.codechef.com/DSAMONDAY${ccMunchNum}`,
            logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codechef.svg',
            color: '#5B4638'
        });
    }

    try {
        const cfRes = await axios.get('https://codeforces.com/api/contest.list?gym=false');
        if (cfRes.data && cfRes.data.status === 'OK') {
            const cfContests = cfRes.data.result
                .filter(c => c.phase === 'BEFORE')
                .map(c => ({
                    id: `cf-${c.id}`,
                    platform: 'Codeforces',
                    title: c.name,
                    startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
                    url: `https://codeforces.com/contests/${c.id}`,
                    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/codeforces.svg',
                    color: '#1F8ACB'
                }));
            contests = [...contests, ...cfContests];
        }
    } catch (e) {
        console.warn("Could not fetch Codeforces contests:", e.message);
    }

    return contests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
};
