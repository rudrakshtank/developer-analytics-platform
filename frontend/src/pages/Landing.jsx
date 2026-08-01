import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Code2, GitMerge, LineChart, ArrowRight, Sparkles, LayoutDashboard, Globe } from 'lucide-react';

const GitIco = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
);

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
            
            {/* 🌟 NAVBAR 🌟 */}
            <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 max-w-[1600px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-2xl tracking-tight">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="text-white text-xl">C</span>
                    </div>
                    Codolio
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/auth')} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition">
                        Log in
                    </button>
                    <button onClick={() => navigate('/auth')} className="bg-gray-900 hover:bg-black text-white text-sm font-bold px-6 py-2.5 rounded-full transition shadow-md">
                        Sign up free
                    </button>
                </div>
            </nav>

            <main className="pt-40 pb-20 px-6 lg:pt-48 lg:pb-32 max-w-[1200px] mx-auto text-center relative">
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/20 to-cyan-400/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-8">
                    <Sparkles className="w-4 h-4" /> The Ultimate Developer Portfolio
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-8">
                    Unify your coding <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                        journey in one place.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Automatically sync your LeetCode, Codeforces, and GitHub stats. Generate your global CodolioScore and instantly stand out to top tech recruiters.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={() => navigate('/auth')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-base font-bold transition shadow-lg shadow-indigo-200">
                        Start tracking now <ArrowRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => navigate('/leaderboard')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-8 py-4 rounded-full text-base font-bold transition shadow-sm">
                        <Trophy className="w-5 h-5 text-gray-400" /> View Leaderboard
                    </button>
                </div>

                <div className="mt-16 pt-10 border-t border-gray-200 max-w-3xl mx-auto">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Integrates seamlessly with</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-bold text-xl"><Code2 className="w-6 h-6" /> LeetCode</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6" /> Codeforces</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><GitIco className="w-6 h-6" /> GitHub</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-[#2F8D46]">GfG</div>
                    </div>
                </div>
            </main>

            <section className="bg-white py-24 px-6 border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Everything a top developer needs.</h2>
                        <p className="text-gray-500 mt-4 text-lg">Stop managing multiple tabs. We bring your data to you.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                                <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Unified Dashboard</h3>
                            <p className="text-gray-500 leading-relaxed">View your total problems solved, contest ratings, and an aggregated 1-year activity heatmap across all platforms.</p>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                                <LineChart className="w-6 h-6 text-cyan-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">The CodolioScore</h3>
                            <p className="text-gray-500 leading-relaxed">Our custom algorithm balances your competitive programming rating, DSA volume, and open-source commits into one powerful metric.</p>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Leaderboards</h3>
                            <p className="text-gray-500 leading-relaxed">Compete with your peers. Filter by graduation year, university, or profession to see exactly where you stand globally.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm">
                <p>© 2026 Codolio Inc. All rights reserved.</p>
                <p className="mt-2">Built for developers, by developers.</p>
            </footer>

        </div>
    );
}