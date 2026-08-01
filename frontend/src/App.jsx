import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import PublicProfile from './pages/PublicProfile';
import Landing from './pages/Landing';

import Contests from './pages/Contests';
import Profile from './pages/Profile';
import Sheets from './pages/Sheets';
import Compare from './pages/Compare';

import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }
    
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNav isLoggedIn={true} tglSb={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

const PublicRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNav isLoggedIn={!!isAuthenticated} tglSb={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                
                <Route path="/leaderboard" element={<PublicRoute><Leaderboard /></PublicRoute>} />
                <Route path="/u/:username" element={<PublicRoute><PublicProfile /></PublicRoute>} />
                
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/contests" element={<ProtectedRoute><Contests /></ProtectedRoute>} /> 
                <Route path="/sheets" element={<ProtectedRoute><Sheets /></ProtectedRoute>} />
                <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}
