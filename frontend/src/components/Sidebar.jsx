import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Trophy, BookOpen, Swords, Settings as SettingsIcon, LogOut, X } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    };

    const navItems = [
        { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
        { path: '/contests', name: 'Contests', icon: <Trophy className="w-5 h-5" /> },
        { path: '/sheets', name: 'DSA Sheets', icon: <BookOpen className="w-5 h-5" /> },
        { path: '/compare', name: 'Compare Profiles', icon: <Swords className="w-5 h-5" /> },
        { path: '/settings', name: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
    ];

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white text-lg">C</span>
                        </div>
                        Codolio
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => {
                                if (window.innerWidth < 768) toggleSidebar();
                            }}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Log out
                    </button>
                </div>
            </div>
        </>
    );
}
