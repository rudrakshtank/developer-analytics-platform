import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function Onboarding() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        professionalStatus: 'Student',
        bio: '',
        graduationYear: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.put('/users/onboarding', formData);
            navigate('/dashboard');
        } catch (error) {
            console.error("Onboarding failed", error);
            alert("Failed to save onboarding details.");
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        try {
            await axiosInstance.put('/users/onboarding', { professionalStatus: 'Student' });
            navigate('/dashboard');
        } catch (error) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Complete Your Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">I am currently a...</label>
                        <select 
                            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            value={formData.professionalStatus}
                            onChange={(e) => setFormData({...formData, professionalStatus: e.target.value})}
                        >
                            <option value="Student">Student</option>
                            <option value="Working Professional">Working Professional</option>
                        </select>
                    </div>
                    
                    {formData.professionalStatus === 'Student' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Graduation Year</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                value={formData.graduationYear}
                                onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                                placeholder="e.g. 2026"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Short Bio</label>
                        <textarea
                            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                            rows="3"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            placeholder="Full-stack developer building cool things..."
                        ></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save & Continue'}
                    </button>
                    
                    <button type="button" onClick={handleSkip} className="w-full text-sm font-bold text-gray-500 hover:text-gray-800 transition py-2">
                        Skip for now
                    </button>
                </form>
            </div>
        </div>
    );
}