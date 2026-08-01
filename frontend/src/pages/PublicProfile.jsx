import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Briefcase, Calendar as CalIco, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function PublicProfile() {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [scoreData, setScoreData] = useState(null);

    useEffect(() => {
        const fetchPublicProfile = async () => {
            try {
                const res = await axiosInstance.get(`/users/profile/${username}`);
                setUser(res.data.user);
                setScoreData(res.data.scoreBreakdown);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicProfile();
    }, [username]);

    if (loading) return <div className="flex w-full h-[80vh] items-center justify-center"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>;
    
    if (!user) return (
        <div className="flex flex-col w-full h-[60vh] items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-500 max-w-sm">The username <strong>@{username}</strong> does not exist on Codolio or their profile is private.</p>
        </div>
    );

    const dispAv = user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=4F46E5&color=fff&size=200`;

    return (
        <div className="max-w-[1200px] mx-auto space-y-6 pb-12 relative p-4">
            
            {/* Header */}
            <div className="bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] rounded-3xl p-8 md:p-10 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
                    <img src={dispAv} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white/20 object-cover shadow-lg" />
                    <div className="flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <h2 className="text-3xl font-extrabold tracking-wide">{user.name}</h2>
                            <CheckCircle2 className="w-6 h-6 text-blue-200 fill-white" />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sm font-medium shadow-inner mb-4">
                            <span>@{user.username}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-sm text-blue-50 font-medium">
                            {user.location && <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-200" />{user.location}</div>}
                            <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-blue-200" />{user.professionalStatus || "Developer"}</div>
                            {user.graduationYear && <div className="flex items-center gap-1.5"><CalIco className="w-4 h-4 text-blue-200" />Class of {user.graduationYear}</div>}
                        </div>

                        {user.bio && <p className="mt-5 text-blue-100 max-w-2xl leading-relaxed text-sm">{user.bio}</p>}
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center min-w-[160px]">
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">CodolioScore</p>
                        <p className="text-4xl font-extrabold text-white">{user.lumaScore || 0}</p>
                    </div>
                </div>
            </div>

            {scoreData && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-gray-900 font-bold text-lg tracking-tight mb-4">Score Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">LeetCode</p>
                            <p className="text-2xl font-bold text-gray-900">{scoreData.leetcode || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Codeforces</p>
                            <p className="text-2xl font-bold text-gray-900">{scoreData.codeforces || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">CodeChef</p>
                            <p className="text-2xl font-bold text-gray-900">{scoreData.codechef || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">GeeksForGeeks</p>
                            <p className="text-2xl font-bold text-gray-900">{scoreData.geeksforgeeks || 0}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}