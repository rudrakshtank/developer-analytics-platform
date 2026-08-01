import React, { useState, useEffect } from 'react';
import { Search, Trophy, GraduationCap, Briefcase, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Leaderboard() {
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    
    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const params = {};
                if (search) params.search = search;
                if (statusFilter) params.status = statusFilter;
                if (yearFilter) params.graduationYear = yearFilter;

                const res = await axiosInstance.get('/users/leaderboard', { params });
                setUsers(res.data.users || []);
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            }
            setLoading(false);
        };
        
        // Debounce search slightly
        const timer = setTimeout(() => {
            fetchLeaderboard();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, statusFilter, yearFilter]);

    return (
        <div className="max-w-6xl mx-auto p-4 pb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2 tracking-tight">
                            <Trophy className="w-7 h-7 text-indigo-600" /> Global Leaderboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">See how you rank against top developers worldwide.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search user..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-bold outline-none cursor-pointer"
                        >
                            <option value="">All Roles</option>
                            <option value="Student">Student</option>
                            <option value="Working Professional">Professional</option>
                        </select>
                        <select 
                            value={yearFilter} 
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-bold outline-none cursor-pointer"
                        >
                            <option value="">All Years</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {users.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-medium">No developers found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                        <th className="p-4 pl-6 w-16">Rank</th>
                                        <th className="p-4">Developer</th>
                                        <th className="p-4">Role / Details</th>
                                        <th className="p-4 text-right pr-6">CodolioScore</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((u, index) => (
                                        <tr key={u._id} onClick={() => nav(`/profile/${u.username}`)} className="hover:bg-gray-50/50 cursor-pointer transition-colors group">
                                            <td className="p-4 pl-6">
                                                <span className={`font-extrabold text-sm ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                                                    #{index + 1}
                                                </span>
                                            </td>
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={u.profilePicture || `https://ui-avatars.com/api/?name=${u.name}&background=4F46E5&color=fff`} alt={u.name} className="w-10 h-10 rounded-full border border-gray-200" />
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{u.name}</p>
                                                    <p className="text-xs text-gray-500">@{u.username}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                                        <Briefcase className="w-3.5 h-3.5 text-gray-400"/> {u.professionalStatus || 'Developer'}
                                                    </div>
                                                    {u.graduationYear && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <GraduationCap className="w-3.5 h-3.5 text-gray-400"/> Class of {u.graduationYear}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right font-extrabold text-lg text-indigo-600">
                                                {u.lumaScore || 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}