import React, { useState } from 'react';
import { Search, Loader2, Trophy, Swords } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Compare() {
    const nav = useNavigate();
    const [user1, setUser1] = useState('');
    const [user2, setUser2] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [compareData, setCompareData] = useState(null);

    const handleCompare = async (e) => {
        e.preventDefault();
        if (!user1 || !user2) return;
        
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.get(`/users/compare/${user1}/${user2}`);
            setCompareData(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to compare profiles. Ensure both usernames exist and are public.');
        }
        setLoading(false);
    };

    // Safely format data for Radar Chart
    const chartData = compareData ? [
        { subject: 'LumaScore', A: compareData.user1.score, B: compareData.user2.score, fullMark: Math.max(compareData.user1.score, compareData.user2.score) + 100 },
        { subject: 'Total Solved', A: compareData.user1.totalSolved, B: compareData.user2.totalSolved, fullMark: Math.max(compareData.user1.totalSolved, compareData.user2.totalSolved) + 100 },
        { subject: 'Platforms Linked', A: compareData.user1.platformsLinked, B: compareData.user2.platformsLinked, fullMark: 5 }
    ] : [];

    return (
        <div className="max-w-5xl mx-auto p-4 pb-12">
            
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl mb-8 relative overflow-hidden">
                <Swords className="w-24 h-24 absolute -right-4 -bottom-4 text-white opacity-10" />
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Head-to-Head Compare</h1>
                <p className="text-indigo-200 text-sm md:text-base max-w-xl mx-auto mb-8">Enter two developer usernames to compare their problem-solving metrics, contest ratings, and overall CodolioScore instantly.</p>
                
                <form onSubmit={handleCompare} className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                    <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                        <input type="text" placeholder="Username 1" value={user1} onChange={e => setUser1(e.target.value)} required className="w-full pl-10 pr-4 py-3.5 bg-white border-0 rounded-xl text-gray-900 text-sm font-bold focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm" />
                    </div>
                    <div className="bg-indigo-500/30 text-indigo-100 font-bold px-4 py-2 rounded-lg shrink-0">VS</div>
                    <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                        <input type="text" placeholder="Username 2" value={user2} onChange={e => setUser2(e.target.value)} required className="w-full pl-10 pr-4 py-3.5 bg-white border-0 rounded-xl text-gray-900 text-sm font-bold focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full md:w-auto bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-extrabold hover:bg-gray-50 transition shadow-sm shrink-0">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Compare'}
                    </button>
                </form>
                {error && <p className="text-red-300 font-bold mt-4 bg-red-900/30 inline-block px-4 py-2 rounded-lg text-sm">{error}</p>}
            </div>

            {compareData && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Head to Head Table */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-4">
                            <div className="text-center cursor-pointer hover:opacity-80" onClick={() => nav(`/profile/${user1}`)}>
                                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2">{user1.charAt(0).toUpperCase()}</div>
                                <p className="font-bold text-gray-900">@{user1}</p>
                            </div>
                            <Trophy className="w-8 h-8 text-yellow-500 mb-6" />
                            <div className="text-center cursor-pointer hover:opacity-80" onClick={() => nav(`/profile/${user2}`)}>
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2">{user2.charAt(0).toUpperCase()}</div>
                                <p className="font-bold text-gray-900">@{user2}</p>
                            </div>
                        </div>

                        {[
                            { label: "CodolioScore", key: "score" },
                            { label: "Total Problems Solved", key: "totalSolved" },
                            { label: "Platforms Linked", key: "platformsLinked" }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                                <div className="w-1/3 text-center font-bold text-xl text-indigo-600">{compareData.user1[stat.key] || 0}</div>
                                <div className="w-1/3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                                <div className="w-1/3 text-center font-bold text-xl text-emerald-600">{compareData.user2[stat.key] || 0}</div>
                            </div>
                        ))}
                    </div>

                    {/* Radar Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-gray-900 text-center mb-4 w-full">Performance Radar</h3>
                        <div className="w-full flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                    <PolarGrid stroke="#f3f4f6" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                                    <Radar name={user1} dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.4} />
                                    <Radar name={user2} dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}