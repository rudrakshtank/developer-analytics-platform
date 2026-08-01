import React, { useState, useEffect } from 'react';
import { MapPin, GraduationCap, Briefcase, Calendar as CalIco, Globe, ArrowRight, CheckCircle2, ChevronDown, Flame, Trophy, LayoutDashboard, Loader2, X } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const GitIco = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>);
const LcIco = () => (<svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#B3B1B0" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"></path><path fill="#E7A41F" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"></path><path fill="#070706" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"></path></svg>);
const GfgIco = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#2F8D46"/><text x="12" y="17" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">G</text></svg>);
const CfIco = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="4" width="4.5" height="16" fill="#FFC107"/><rect x="9.5" y="9" width="4.5" height="11" fill="#2196F3"/><rect x="3" y="14" width="4.5" height="6" fill="#F44336"/></svg>);
const CcIco = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#5D4037"/><text x="12" y="16" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CC</text></svg>);

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899', '#F97316', '#14B8A6', '#06B6D4', '#6366F1'];
const BG_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-red-500'];

export default function Dashboard() {
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [platformFilter, setPlatformFilter] = useState('All');
    const [heatmapFilter, setHeatmapFilter] = useState('All');
    const [showDsaModal, setShowDsaModal] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userRes = await axiosInstance.get('/auth/me');
                setUserData(userRes.data.user);
                
                if (userRes.data.user?.username) {
                    const analyticsRes = await axiosInstance.get(`/users/analytics/${userRes.data.user.username}`);
                    const analyticsPayload = analyticsRes.data.data || analyticsRes.data.analytics || analyticsRes.data;
                    setAnalytics(analyticsPayload);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="flex w-full h-[80vh] items-center justify-center"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>;
    if (!userData) return <div className="p-8 text-center text-red-500">Failed to load data. Please refresh.</div>;

    const dispNme = userData.name || "Developer";
    const dispUnm = `@${userData.username}`;
    const dispAv = userData.profilePicture || `https://ui-avatars.com/api/?name=${dispNme}&background=4F46E5&color=fff&size=200`;
    const accounts = userData?.connectedAccounts || {};

    const curScr = analytics?.lumaScore || 0;
    const scrH = curScr > 0 ? [
        { score: curScr * 0.3 }, { score: curScr * 0.5 }, { score: curScr * 0.4 }, 
        { score: curScr * 0.7 }, { score: curScr * 0.9 }, { score: curScr }       
    ] : [ { score: 0 }, { score: 20 }, { score: 10 }, { score: 40 }, { score: 0 } ];

    let parsedHeatmap = {};
    const rawHeatmapData = analytics?.globalHeatmap || analytics?.heatmap || {};
    if (typeof rawHeatmapData === 'string') {
        try { parsedHeatmap = JSON.parse(rawHeatmapData); } catch(e) { parsedHeatmap = {}; }
    } else {
        parsedHeatmap = rawHeatmapData;
    }

    let weeklySolved = 0;
    let weeklyContests = 0; 
    const actD = [];
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        const dayData = parsedHeatmap[dateKey];
        let solCount = 0;
        
        if (typeof dayData === 'number') {
            solCount = dayData;
        } else if (typeof dayData === 'string') {
            solCount = Number(dayData) || 0;
        } else if (typeof dayData === 'object' && dayData !== null) {
            
            solCount = (Number(dayData.leetcode) || 0) +
                       (Number(dayData.codeforces) || 0) +
                       (Number(dayData.codechef) || 0);
                       
            if (solCount === 0 && dayData.total !== undefined) solCount = Number(dayData.total);
            if (solCount === 0 && dayData.count !== undefined) solCount = Number(dayData.count);
        }

        weeklySolved += solCount;
        actD.push({ day: d.toLocaleString('default', { weekday: 'short' }), sol: solCount });
    }

    const allPlatforms = ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks'];
    allPlatforms.forEach(plat => {
        const history = accounts[plat]?.stats?.contestHistory || [];
        history.forEach(c => {
            let cDate = null;
            if (c.timestamp) cDate = new Date(c.timestamp.toString().length === 10 ? c.timestamp * 1000 : c.timestamp);
            else if (c.startTime) cDate = new Date(c.startTime.toString().length === 10 ? c.startTime * 1000 : c.startTime);
            else if (c.date) cDate = new Date(c.date);
            if (cDate && !isNaN(cDate.getTime()) && cDate >= sevenDaysAgo && cDate <= today) weeklyContests++;
        });
    });

    const isAll = platformFilter === 'All';
    const selPlat = !isAll ? platformFilter.toLowerCase() : null;
    const platStats = selPlat ? accounts[selPlat]?.stats : null;

    let rawLang = isAll ? (analytics?.topLanguages || []) : Object.entries(platStats?.languageStats || {}).map(([name, value]) => ({ name, value }));
    const totalLang = rawLang.reduce((acc, curr) => {
        const val = curr.count || curr.value || curr.percentage || curr.solved || (typeof curr === 'number' ? curr : 0);
        return acc + Number(val);
    }, 0);
    const lang = rawLang.slice(0, 10).map((l, i) => {
        const countValue = Number(l.count || l.value || l.percentage || l.solved || (typeof l === 'number' ? l : 0));
        const percent = totalLang > 0 ? Number(((countValue / totalLang) * 100).toFixed(1)) : 0;
        return { name: l.name || l.language || l.topic || 'Unknown', value: percent, color: COLORS[i % COLORS.length] };
    });
    if (lang.length === 0) lang.push({ name: 'No Data', value: 100, color: '#E5E7EB' });

    let rawDsa = isAll ? (analytics?.dsaAnalysis?.topics || []) : Object.entries(platStats?.problemTags || {}).map(([topic, count]) => ({ topic, count }));
    const totalDsa = rawDsa.reduce((acc, curr) => {
        const val = curr.solved || curr.count || curr.submissions || curr.value || (typeof curr === 'number' ? curr : 0);
        return acc + Number(val);
    }, 0);
    const dsa = rawDsa.sort((a, b) => {
        const valA = a.solved || a.count || a.submissions || a.value || (typeof a === 'number' ? a : 0);
        const valB = b.solved || b.count || b.submissions || b.value || (typeof b === 'number' ? b : 0);
        return Number(valB) - Number(valA);
    }).map((t, i) => {
        const countValue = Number(t.solved || t.count || t.submissions || t.value || (typeof t === 'number' ? t : 0));
        const percent = totalDsa > 0 ? Math.round((countValue / totalDsa) * 100) : 0;
        return { name: t.topic || t.name || 'Unknown', count: countValue, percent: percent, color: BG_COLORS[i % BG_COLORS.length] };
    });
    const displayedDsa = dsa.slice(0, 5);

    let hMap = [];
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    
    const startDayOfWeek = startDate.getDay();
    for(let i = 0; i < startDayOfWeek; i++) {
        hMap.push({ isPadding: true });
    }

    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        const dayData = parsedHeatmap[dateKey];
        let count = 0;

        if (heatmapFilter === 'All') {
            if (typeof dayData === 'number' || typeof dayData === 'string') {
                count = Number(dayData) || 0;
            } else if (typeof dayData === 'object' && dayData !== null) {
                if (dayData.total !== undefined) count = Number(dayData.total);
                else if (dayData.count !== undefined) count = Number(dayData.count);
                else {
                    let sum = 0;
                    for (let k in dayData) {
                        if (typeof dayData[k] === 'number') sum += dayData[k];
                    }
                    count = sum;
                }
            }
        } else {
            const platKey = heatmapFilter.toLowerCase();
            
            if (typeof dayData === 'object' && dayData !== null && dayData[platKey] !== undefined) {
                count = Number(dayData[platKey]);
            } 
            else {
                const platStats = accounts[platKey]?.stats || {};
                let platCalendar = {};
                try { 
                    platCalendar = typeof platStats.submissionCalendar === 'string' 
                        ? JSON.parse(platStats.submissionCalendar || "{}") 
                        : (platStats.submissionCalendar || {}); 
                } catch(e) {}
                count = Number(platCalendar[dateKey]) || 0;
            }
        }

        let level = 0;
        if (count > 0 && count <= 2) level = 1;
        else if (count > 2 && count <= 5) level = 2;
        else if (count > 5) level = 3;
        
        hMap.push({ level, dateKey, count, isPadding: false });
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-12 relative p-4 lg:p-0 mt-4">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] rounded-2xl p-6 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <img src={dispAv} alt="Profile" className="w-16 h-16 rounded-full border-[3px] border-white/20 object-cover shadow-sm" />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-xl font-bold tracking-wide leading-tight">{dispNme}</h2>
                                <CheckCircle2 className="w-4 h-4 text-blue-200 fill-white" />
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium mt-1.5 shadow-inner">
                                <span>{dispUnm}</span>
                                <span className="text-blue-100 ml-1 border-l border-white/30 pl-1.5">Verified</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-blue-50 mt-5 relative z-10 font-medium">
                        {userData.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-200" />{userData.location}</div>}
                        <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-blue-200" />{userData.professionalStatus || "Developer"}</div>
                        <div className="flex items-center gap-1.5"><CalIco className="w-3.5 h-3.5 text-blue-200" />{userData.graduationYear ? `Class of ${userData.graduationYear}` : "Active Coder"}</div>
                    </div>
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mt-6 relative z-10">
                        <div className="flex gap-2">
                            {accounts.github?.verified && <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><GitIco className="w-4 h-4 text-white" /></button>}
                        </div>
                        <button onClick={() => nav('/profile')} className="flex w-full xl:w-auto justify-center items-center gap-1.5 bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-md">
                            Manage Platforms <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <div className="col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-900 font-bold text-lg tracking-tight">CodolioScore</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">{curScr}</span>
                                {curScr > 0 && <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-md">Active</span>}
                            </div>
                        </div>
                        <div className="w-28 h-12 -mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={scrH}>
                                    <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3.5} dot={false} isAnimationActive={true} animationDuration={2000} style={{ filter: "drop-shadow(0px 4px 6px rgba(79, 70, 229, 0.4))" }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" style={{ width: curScr > 0 ? '75%' : '0%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 font-bold text-base tracking-tight">Activity (Last 7 Days)</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div><p className="text-[10px] text-gray-500 font-medium">Problems</p><span className="text-xl font-bold text-gray-900">{weeklySolved}</span></div>
                        <div><p className="text-[10px] text-gray-500 font-medium">Contests</p><span className="text-xl font-bold text-gray-900">{weeklyContests}</span></div>
                        <div><p className="text-[10px] text-gray-500 font-medium">Active</p><span className="text-xl font-bold text-gray-900">{actD.filter(d => d.sol > 0).length}/7</span></div>
                    </div>
                    <div className="w-full h-24 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={actD} barSize={10} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <Bar dataKey="sol" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mt-6">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-gray-900 font-bold text-sm tracking-tight">Connected Platforms</h3>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-6 overflow-x-auto pb-2 px-1">
                    <div className={`flex items-center gap-3 min-w-max ${accounts.leetcode?.verified ? '' : 'opacity-40 grayscale'}`}>
                        <LcIco />
                        <div className="flex gap-4 ml-1">
                            <div><p className="text-sm font-bold text-gray-900">{accounts.leetcode?.stats?.totalSolved || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Solved</p></div>
                            <div><p className="text-sm font-bold text-gray-900">{Math.round(accounts.leetcode?.stats?.contestRating || 0)}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Rating</p></div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100 hidden md:block"></div>
                    <div className={`flex items-center gap-3 min-w-max ${accounts.codeforces?.verified ? '' : 'opacity-40 grayscale'}`}>
                        <CfIco />
                        <div className="flex gap-4 ml-1">
                            <div><p className="text-sm font-bold text-gray-900">{accounts.codeforces?.stats?.totalSolved || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Solved</p></div>
                            <div><p className="text-sm font-bold text-gray-900">{accounts.codeforces?.stats?.currentRating || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Rating</p></div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100 hidden md:block"></div>
                    <div className={`flex items-center gap-3 min-w-max ${accounts.codechef?.verified ? '' : 'opacity-40 grayscale'}`}>
                        <CcIco />
                        <div className="flex gap-4 ml-1">
                            <div><p className="text-sm font-bold text-gray-900">{accounts.codechef?.stats?.totalSolved || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Solved</p></div>
                            <div><p className="text-sm font-bold text-gray-900">{accounts.codechef?.stats?.currentRating || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Rating</p></div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100 hidden md:block"></div>
                    <div className={`flex items-center gap-3 min-w-max ${accounts.geeksforgeeks?.verified ? '' : 'opacity-40 grayscale'}`}>
                        <GfgIco />
                        <div className="flex gap-4 ml-1">
                            <div><p className="text-sm font-bold text-gray-900">{accounts.geeksforgeeks?.stats?.totalSolved || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Solved</p></div>
                            <div><p className="text-sm font-bold text-gray-900">{accounts.geeksforgeeks?.stats?.score || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Score</p></div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100 hidden md:block"></div>
                    <div className={`flex items-center gap-3 min-w-max ${accounts.github?.verified ? '' : 'opacity-40 grayscale'}`}>
                        <GitIco className="w-7 h-7 text-gray-900" />
                        <div className="flex gap-4 ml-1">
                            <div><p className="text-sm font-bold text-gray-900">{accounts.github?.stats?.totalRepos || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Repos</p></div>
                            <div><p className="text-sm font-bold text-gray-900">{accounts.github?.stats?.totalSubmissions || 0}</p><p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Commits</p></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col min-h-[250px] overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-900 font-bold text-base tracking-tight">Heatmap (Last 1 Year)</h3>
                        <div className="relative">
                            <select 
                                className="flex items-center gap-1 text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 pr-6 rounded hover:bg-gray-50 outline-none bg-white cursor-pointer" 
                                value={heatmapFilter} 
                                onChange={(e) => setHeatmapFilter(e.target.value)}
                            >
                                <option value="All">All Platforms</option>
                                <option value="LeetCode">LeetCode</option>
                                <option value="Codeforces">Codeforces</option>
                                <option value="CodeChef">CodeChef</option>
                                <option value="GeeksForGeeks">GeeksForGeeks</option>
                                <option value="GitHub">GitHub</option>
                            </select>
                            <ChevronDown className="w-2.5 h-2.5 absolute right-1.5 top-1 pointer-events-none text-gray-500" />
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-start overflow-hidden">
                        <div className="flex gap-2 w-full max-w-full overflow-x-auto pb-2 custom-scrollbar">
                            
                            <div className="grid grid-rows-7 gap-[3px] text-[10px] text-gray-400 font-medium pr-1 text-right shrink-0">
                                <span style={{height: '12px'}}></span>
                                <span style={{height: '12px', lineHeight: '12px'}}>Mon</span>
                                <span style={{height: '12px'}}></span>
                                <span style={{height: '12px', lineHeight: '12px'}}>Wed</span>
                                <span style={{height: '12px'}}></span>
                                <span style={{height: '12px', lineHeight: '12px'}}>Fri</span>
                                <span style={{height: '12px'}}></span>
                            </div>

                            <div className="grid grid-rows-7 grid-flow-col gap-[3px] min-w-max pr-4">
                                {hMap.map((v, i) => {
                                    if (v.isPadding) return <div key={i} className="w-3 h-3 bg-transparent shrink-0"></div>;
                                    let c = 'w-3 h-3 rounded-[2px] shrink-0 transition-all hover:ring-2 hover:ring-indigo-300 cursor-pointer ';
                                    if (v.level === 0) c += 'bg-gray-100'; else if (v.level === 1) c += 'bg-green-200';
                                    else if (v.level === 2) c += 'bg-green-400'; else c += 'bg-green-600';
                                    return <div key={i} className={c} title={`${v.count} submissions on ${v.dateKey}`}></div>;
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end mt-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                            Less
                            <div className="flex gap-[3px] ml-1 mr-1">
                                <div className="w-3 h-3 rounded-[2px] bg-gray-100"></div>
                                <div className="w-3 h-3 rounded-[2px] bg-green-200"></div>
                                <div className="w-3 h-3 rounded-[2px] bg-green-400"></div>
                                <div className="w-3 h-3 rounded-[2px] bg-green-600"></div>
                            </div>
                            More
                        </div>
                    </div>
                </div>

                <div className="col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col min-h-[250px]">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-gray-900 font-bold text-base tracking-tight">Top Languages</h3>
                        <div className="relative">
                            <select className="flex items-center gap-1 text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 pr-6 rounded hover:bg-gray-50 outline-none bg-white cursor-pointer" value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                                <option value="All">All</option>
                                <option value="LeetCode">LeetCode</option>
                            </select>
                            <ChevronDown className="w-2.5 h-2.5 absolute right-1.5 top-1 pointer-events-none text-gray-500" />
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                        <div className="w-24 h-24 relative -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={lang} innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value" stroke="none">
                                        {lang.map((e, i) => <Cell key={`cell-${i}`} fill={e.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-3">
                            {lang.slice(0, 4).map((itm, i) => (
                                <div key={i} className="flex items-center justify-between text-sm font-medium text-gray-700 gap-4">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: itm.color }}></div>{itm.name}</div>
                                    <span className="text-gray-500 font-bold">{itm.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h3 className="text-gray-900 font-bold text-base tracking-tight">DSA Topic Analysis</h3>
                            <p className="text-xs text-gray-500 mt-1">Total Solved: {analytics?.dsaAnalysis?.totalDsaProblems || 0}</p>
                        </div>
                        {dsa.length > 5 && (
                            <button onClick={() => setShowDsaModal(true)} className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline bg-indigo-50 px-3 py-1.5 rounded-md">
                                View All ({dsa.length})
                            </button>
                        )}
                    </div>
                    <div className="space-y-4 mt-2">
                        {displayedDsa.length > 0 ? displayedDsa.map(t => (
                            <div key={t.name}>
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-gray-800">{t.name}</span>
                                    <span className="text-gray-500">{t.count} ({t.percent}%)</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.percent}%` }}></div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-sm text-gray-500 text-center py-4">No topic data available.</div>
                        )}
                    </div>
                </div>

                <div className="col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-start min-h-[300px]">
                    <h3 className="text-gray-900 font-bold text-base tracking-tight mb-6">Activity & Streaks</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-700"><CalIco className="w-5 h-5 text-gray-400" /><span className="text-sm font-medium">Total Active Days</span></div>
                            <span className="text-lg font-bold text-gray-900">{analytics?.activity?.totalActiveDays || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-700"><Flame className="w-5 h-5 text-orange-500" /><span className="text-sm font-medium">Current Streak</span></div>
                            <span className="text-lg font-bold text-gray-900 flex items-center gap-1">{analytics?.activity?.currentStreak || 0} <span>🔥</span></span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-700"><Trophy className="w-5 h-5 text-yellow-500" /><span className="text-sm font-medium">Max Streak</span></div>
                            <span className="text-lg font-bold text-gray-900">{analytics?.activity?.maxStreak || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-700"><LayoutDashboard className="w-5 h-5 text-gray-400" /><span className="text-sm font-medium">Platforms Active</span></div>
                            <span className="text-lg font-bold text-gray-900">{analytics?.activity?.platformsActiveToday || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showDsaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div><h3 className="text-lg font-bold text-gray-900">All DSA Topics</h3><p className="text-xs text-gray-500 mt-0.5">{dsa.length} Topics Solved</p></div>
                            <button onClick={() => setShowDsaModal(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
                            {dsa.map(t => (
                                <div key={t.name}>
                                    <div className="flex justify-between text-sm font-medium mb-1.5"><span className="text-gray-800">{t.name}</span><span className="text-gray-500">{t.count} ({t.percent}%)</span></div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.percent}%` }}></div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}