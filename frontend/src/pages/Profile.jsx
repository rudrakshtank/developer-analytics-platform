import React, { useState, useEffect } from 'react';
import { Loader2, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const GitIco = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>);
const LcIco = () => (<svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#B3B1B0" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"></path><path fill="#E7A41F" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"></path><path fill="#070706" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"></path></svg>);
const GfgIco = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#2F8D46"/><text x="12" y="17" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">G</text></svg>);
const CfIco = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="4" width="4.5" height="16" fill="#FFC107"/><rect x="9.5" y="9" width="4.5" height="11" fill="#2196F3"/><rect x="3" y="14" width="4.5" height="6" fill="#F44336"/></svg>);
const CcIco = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#5D4037"/><text x="12" y="16" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CC</text></svg>);

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [platformToConnect, setPlatformToConnect] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1); 
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { fetchMe(); }, []);

    const fetchMe = async () => {
        try {
            const res = await axiosInstance.get('/auth/me');
            setUser(res.data.user);
        } catch (error) {
            console.error("Failed to load profile", error);
        }
        setLoading(false);
    };

    const handleConnectRequest = async (e) => {
        e.preventDefault();
        setActionLoading(true); setMessage('');
        try {
            await axiosInstance.post('/platforms/connect', { platform: platformToConnect, username: usernameInput });
            const codeRes = await axiosInstance.get('/platforms/verify/code');
            setVerificationCode(codeRes.data.code);
            setStep(2);
        } catch (err) { setMessage(err.response?.data?.message || 'Error connecting platform'); }
        setActionLoading(false);
    };

    const handleVerify = async () => {
        setActionLoading(true); setMessage('');
        try {
            setMessage('Checking profile for code...');
            await axiosInstance.post(`/platforms/verify/${platformToConnect}`);
            setMessage('Code found! Syncing your platform stats...');
            await axiosInstance.post(`/platforms/sync/${platformToConnect}`);
            await fetchMe();
            setPlatformToConnect('');
            setStep(1); setUsernameInput('');
            setMessage('Verified and Synced successfully!');
        } catch (err) { setMessage(err.response?.data?.message || 'Verification failed. Did you paste the code correctly?'); }
        setActionLoading(false);
    };

    const handleUnlink = async (platformToUnlink) => {
        if (!window.confirm(`Are you sure you want to unlink your ${platformToUnlink} account? Your stats will be reset.`)) return;
        setActionLoading(true); setMessage('');
        try {
            await axiosInstance.delete(`/platforms/unlink/${platformToUnlink}`);
            await fetchMe();
            setMessage(`${platformToUnlink} disconnected successfully.`);
        } catch (err) { setMessage(err.response?.data?.message || `Failed to unlink ${platformToUnlink}.`); }
        setActionLoading(false);
    };

    const getPlatformIcon = (p) => {
        if (p === 'leetcode') return <LcIco />;
        if (p === 'codeforces') return <CfIco />;
        if (p === 'codechef') return <CcIco />;
        if (p === 'geeksforgeeks') return <GfgIco />;
        if (p === 'github') return <GitIco className="w-8 h-8 text-gray-900" />;
        return null;
    };

    if (loading) return <div className="flex w-full h-[80vh] items-center justify-center"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>;
    
    const accounts = user?.connectedAccounts || {};
    const platformsList = ['leetcode', 'codeforces', 'codechef', 'geeksforgeeks', 'github'];

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6 pb-12 mt-4">
            <h2 className="text-2xl font-bold text-gray-900">Manage Platforms</h2>
            
            {message && <div className="p-4 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">{message}</div>}

            {platformToConnect ? (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold capitalize mb-4">Connect {platformToConnect}</h3>
                    {step === 1 ? (
                        <form onSubmit={handleConnectRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                <input type="text" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 outline-none" placeholder={`Your ${platformToConnect} handle`} />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => {setPlatformToConnect(''); setMessage('');}} className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex gap-2">{actionLoading && <Loader2 className="w-4 h-4 animate-spin"/>} Get Code</button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">Paste this exact code anywhere in your <strong>{platformToConnect}</strong> profile bio, about me, or institution field.</p>
                            <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-xl font-bold tracking-widest text-indigo-600">{verificationCode}</div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">Back</button>
                                <button onClick={handleVerify} disabled={actionLoading} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex gap-2">{actionLoading && <Loader2 className="w-4 h-4 animate-spin"/>} I Pasted It, Verify</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {platformsList.map(p => (
                        <div key={p} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center ${accounts[p]?.verified ? '' : 'opacity-30 grayscale'}`}>
                                    {getPlatformIcon(p)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 capitalize">{p}</p>
                                    <p className="text-xs text-gray-500">{accounts[p]?.verified ? `@${accounts[p].username}` : 'Not Connected'}</p>
                                </div>
                            </div>
                            
                            {!accounts[p]?.verified ? (
                                <button onClick={() => setPlatformToConnect(p)} className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg"><Plus className="w-5 h-5" /></button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    <button onClick={() => handleUnlink(p)} disabled={actionLoading} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Unlink Platform"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}