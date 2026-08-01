import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function Auth() {
    const nav = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        otp: '' 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (step === 1) {
                if (isLogin) {
                    const res = await axiosInstance.post('/auth/login', { 
                        emailOrUsername: formData.email, 
                        password: formData.password 
                    });
                    
                    localStorage.setItem('token', res.data.token);
                    
                    if (res.data.user.isOnboardingComplete) {
                        nav('/dashboard');
                    } else {
                        nav('/onboarding');
                    }
                } else {
                    const res = await axiosInstance.post('/auth/register', {
                        name: formData.name,
                        username: formData.username,
                        email: formData.email,
                        password: formData.password
                    });
                    
                    setSuccessMsg(res.data.message || 'Please check your email for the OTP.');
                    setStep(2);
                }
            } else if (step === 2) {
                const res = await axiosInstance.post('/auth/verify-otp', {
                    email: formData.email,
                    otp: formData.otp,
                    type: 'verify'
                });

                localStorage.setItem('token', res.data.token);
                nav('/onboarding'); // Brand new users go to onboarding
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setStep(1);
        setError('');
        setSuccessMsg('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {step === 2 ? 'Verify Email' : (isLogin ? 'Welcome Back' : 'Create Account')}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {step === 2 
                            ? 'Enter the 6-digit code sent to your email.' 
                            : (isLogin ? 'Enter your details to access your dashboard.' : 'Start tracking your coding journey today.')}
                    </p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center">{error}</div>}
                {successMsg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium text-center">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {step === 1 && (
                        <>
                            {!isLogin && (
                                <>
                                    <div className="relative">
                                        <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </>
                            )}
                            
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" name="email" placeholder={isLogin ? "Email or Username" : "Email Address"} value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required minLength="6" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="relative">
                            <KeyRound className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                name="otp" 
                                placeholder="Enter 6-digit OTP" 
                                value={formData.otp} 
                                onChange={handleChange} 
                                required 
                                maxLength="6"
                                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            />
                        </div>
                    )}

                    <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 mt-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === 2 ? 'Verify & Continue' : (isLogin ? 'Sign In' : 'Sign Up'))}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    {step === 2 ? "Entered the wrong email? " : (isLogin ? "Don't have an account? " : "Already have an account? ")}
                    <button onClick={toggleMode} className="text-indigo-600 font-bold hover:underline">
                        {step === 2 ? 'Start Over' : (isLogin ? 'Sign Up' : 'Sign In')}
                    </button>
                </p>
            </div>
        </div>
    );
}
