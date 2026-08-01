import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({ name: '', username: '', bio: '', professionalStatus: 'Student', graduationYear: '', location: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    const [profileStatus, setProfileStatus] = useState({ loading: false, message: '', type: '' });
    const [passwordStatus, setPasswordStatus] = useState({ loading: false, message: '', type: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axiosInstance.get('/auth/me');
                const user = res.data.user;
                setProfileData({
                    name: user.name || '',
                    username: user.username || '',
                    bio: user.bio || '',
                    professionalStatus: user.professionalStatus || 'Student',
                    graduationYear: user.graduationYear || '',
                    location: user.location || ''
                });
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileStatus({ loading: true, message: '', type: '' });
        try {
            await axiosInstance.put('/users/profile', profileData);
            setProfileStatus({ loading: false, message: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            setProfileStatus({ loading: false, message: error.response?.data?.message || 'Update failed', type: 'error' });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setPasswordStatus({ loading: false, message: "Passwords don't match", type: 'error' });
        }
        setPasswordStatus({ loading: true, message: '', type: '' });
        try {
            await axiosInstance.put('/auth/change-password', { 
                currentPassword: passwordData.currentPassword, 
                newPassword: passwordData.newPassword 
            });
            setPasswordStatus({ loading: false, message: 'Password changed successfully!', type: 'success' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setPasswordStatus({ loading: false, message: error.response?.data?.message || 'Password update failed', type: 'error' });
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 p-4">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6"><User className="w-5 h-5 text-indigo-600"/> Profile Information</h3>
                
                {profileStatus.message && (
                    <div className={`p-3 mb-6 rounded-lg text-sm font-bold ${profileStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {profileStatus.message}
                    </div>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                            <input type="text" className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Username (Cannot be changed)</label>
                            <input type="text" disabled className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-xl p-3 text-sm cursor-not-allowed" value={profileData.username} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                            <input type="text" className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} placeholder="e.g. India" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Graduation Year</label>
                            <input type="number" className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={profileData.graduationYear} onChange={(e) => setProfileData({...profileData, graduationYear: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                        <textarea className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" rows="3" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})}></textarea>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={profileStatus.loading} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2">
                            {profileStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6"><Lock className="w-5 h-5 text-indigo-600"/> Change Password</h3>
                
                {passwordStatus.message && (
                    <div className={`p-3 mb-6 rounded-lg text-sm font-bold ${passwordStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {passwordStatus.message}
                    </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                            <input type="password" required className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                            <input type="password" required minLength="6" className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New</label>
                            <input type="password" required minLength="6" className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={passwordStatus.loading} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition flex items-center gap-2">
                            {passwordStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}