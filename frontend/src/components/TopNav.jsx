import React, { useState } from 'react';
import { Search, Bell, Plus, X, Menu, RefreshCw, AlertCircle, CheckCircle2, Copy, Loader2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const PLATFORMS = [
    { id: 'leetcode', name: 'LeetCode', icon: 'LC', bg: 'bg-yellow-100 text-yellow-700', border: 'hover:border-yellow-400' },
    { id: 'codeforces', name: 'Codeforces', icon: 'CF', bg: 'bg-blue-100 text-blue-700', border: 'hover:border-blue-400' },
    { id: 'codechef', name: 'CodeChef', icon: 'CC', bg: 'bg-amber-100 text-amber-800', border: 'hover:border-amber-400' },
    { id: 'geeksforgeeks', name: 'GeeksForGeeks', icon: 'GFG', bg: 'bg-green-100 text-green-700', border: 'hover:border-green-400' },
    { id: 'github', name: 'GitHub', icon: 'GH', bg: 'bg-gray-200 text-gray-800', border: 'hover:border-gray-400' }
];

export default function TopNav({ isLoggedIn, tglSb }) {
    const nav = useNavigate();
    const [sQry, setSQry] = useState('');
    const [sync, setSync] = useState(false);
    
    const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
    const [platStep, setPlatStep] = useState(0); 
    const [platForm, setPlatForm] = useState(null); 
    const [platUser, setPlatUser] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [platLoading, setPlatLoading] = useState(false);
    const [platError, setPlatError] = useState('');

    const hSearch = (e) => {
        if (e.key === 'Enter' && sQry !== '') {
            nav(`/u/${sQry.trim()}`);
        }
    };

    const hSync = async () => {
        setSync(true);
        try {
            await axiosInstance.post('/platforms/sync-all');
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
        setSync(false);
    };

    const handleConnect = async (e) => {
        e.preventDefault();
        setPlatLoading(true);
        setPlatError('');
        try {
            await axiosInstance.post('/platforms/connect', { 
                platform: platForm.id, 
                username: platUser 
            });

            const codeRes = await axiosInstance.get('/platforms/verify/code');
            setVerifyCode(codeRes.data.code || codeRes.data.verificationCode);
            setPlatStep(2);
        } catch (err) {
            setPlatError(err.response?.data?.message || 'Failed to connect platform. Ensure username is correct.');
        }
        setPlatLoading(false);
    };

    const handleVerify = async () => {
        setPlatLoading(true);
        setPlatError('');
        try {
            await axiosInstance.post(`/platforms/verify/${platForm.id}`);
            
            await axiosInstance.post(`/platforms/sync/${platForm.id}`);
            
            setPlatStep(3);
            
            setTimeout(() => {
                setIsPlatformModalOpen(false);
                window.location.reload(); 
            }, 2000);
        } catch (err) {
            setPlatError(err.response?.data?.message || `Failed to verify. Did you paste the code into your ${platForm.name} profile?`);
        }
        setPlatLoading(false);
    };

    const resetModal = () => {
        setIsPlatformModalOpen(false);
        setTimeout(() => {
            setPlatStep(0);
            setPlatForm(null);
            setPlatUser('');
            setPlatError('');
        }, 300);
    };

    return (
        <>
            <div className="flex items-center justify-between w-full p-6 bg-white border-b border-gray-100 z-10 relative">
                <div className="flex items-center gap-4">
                    <button onClick={tglSb} className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                    {isLoggedIn ? (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Welcome back! 👋</h1>
                            <p className="text-sm text-gray-500 mt-1">Track your progress and analyze your coding journey.</p>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Explore Codolio</h1>
                            <p className="text-sm text-gray-500 mt-1">Discover top developers and their coding analytics.</p>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-5">
                    <div className="relative hidden md:block">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-80 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Search usernames (Press Enter)..." 
                                className="bg-transparent outline-none text-sm w-full text-gray-700"
                                value={sQry} 
                                onChange={(e) => setSQry(e.target.value)}
                                onKeyDown={hSearch}
                            />
                            {sQry && <X className="w-4 h-4 text-gray-400 cursor-pointer" onClick={() => setSQry('')} />}
                        </div>
                    </div>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <button onClick={hSync} disabled={sync} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold px-4 py-2.5 rounded-lg transition shadow-sm disabled:opacity-50">
                                {sync ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 
                                Sync Data
                            </button>
                            
                            <button className="relative p-2.5 bg-gray-50 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-100 transition">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            
                            <button 
                                onClick={() => setIsPlatformModalOpen(true)} 
                                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Platform
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button onClick={() => nav('/auth')} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition">Log in</button>
                            <button onClick={() => nav('/auth')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition shadow-sm">Sign up free</button>
                        </div>
                    )}
                </div>
            </div>

            {isPlatformModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                {platStep > 0 && platStep < 3 && (
                                    <button onClick={() => setPlatStep(platStep - 1)} className="text-gray-400 hover:text-gray-800 transition">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <h3 className="text-xl font-bold text-gray-800">
                                    {platStep === 0 ? 'Select Platform' : platForm?.name}
                                </h3>
                            </div>
                            <button onClick={resetModal} className="text-gray-400 hover:text-gray-600 transition p-1"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6">
                            {platError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 font-medium">
                                    <AlertCircle className="w-5 h-5 shrink-0"/> {platError}
                                </div>
                            )}

                            {platStep === 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {PLATFORMS.map(p => (
                                        <button 
                                            key={p.id}
                                            onClick={() => { setPlatForm(p); setPlatStep(1); }}
                                            className={`flex flex-col items-center justify-center gap-3 p-4 border border-gray-200 rounded-xl transition bg-white ${p.border} hover:shadow-sm`}
                                        >
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${p.bg}`}>
                                                {p.icon}
                                            </div>
                                            <span className="font-bold text-gray-700 text-sm">{p.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {platStep === 1 && (
                                <form onSubmit={handleConnect} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{platForm.name} Username</label>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="Enter your exact username"
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={platUser}
                                            onChange={(e) => setPlatUser(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={platLoading}
                                        className="w-full p-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-70"
                                    >
                                        {platLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Verification Code'}
                                    </button>
                                </form>
                            )}

                            {platStep === 2 && (
                                <div className="space-y-5">
                                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                                        <p className="text-sm font-semibold text-indigo-900 mb-2">Your Verification Code</p>
                                        <div className="flex items-center justify-center gap-2 text-2xl font-black text-indigo-600 tracking-wider">
                                            {verifyCode}
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(verifyCode)}
                                                className="p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-md transition"
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p><strong>Instructions:</strong></p>
                                        <ol className="list-decimal pl-4 space-y-1">
                                            <li>Go to your {platForm.name} profile settings.</li>
                                            <li>Paste the code above anywhere in your <strong>Bio, About, or Location</strong> section.</li>
                                            <li>Save your {platForm.name} profile.</li>
                                            <li>Click "Verify" below.</li>
                                        </ol>
                                    </div>

                                    <button 
                                        onClick={handleVerify} 
                                        disabled={platLoading}
                                        className="w-full p-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-70"
                                    >
                                        {platLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Verify ${platForm.name}`}
                                    </button>
                                </div>
                            )}

                            {platStep === 3 && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Account Verified!</h3>
                                    <p className="text-gray-500">Your {platForm.name} data is now syncing to your dashboard.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
