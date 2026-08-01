import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Loader2, Code2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function Sheets() {
    const [loading, setLoading] = useState(true);
    const [sheets, setSheets] = useState([]);

    useEffect(() => {
        const fetchSheets = async () => {
            try {
                const res = await axiosInstance.get('/users/sheets');
                setSheets(res.data.sheets || []);
            } catch (error) {
                console.error("Failed to load sheets", error);
            }
            setLoading(false);
        };
        fetchSheets();
    }, []);

    if (loading) return <div className="flex w-full h-[80vh] items-center justify-center"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>;

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 pb-12 relative p-4 lg:p-0 mt-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
                    <BookOpen className="w-7 h-7 text-indigo-600"/> Curated SDE Sheets
                </h1>
                <p className="text-sm text-gray-500 mt-2">Master Data Structures and Algorithms with industry-proven problem lists.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sheets.map(sheet => (
                    <div key={sheet.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                        <div>
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{sheet.title}</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{sheet.description}</p>
                        </div>
                        <a href={sheet.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl transition-colors text-sm">
                            Start Solving <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}