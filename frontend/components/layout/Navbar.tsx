"use client";

import { Search, Moon, Bell, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Navbar() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDarkMode = currentTheme === 'dark';

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/disputes`);
        }
    };

    if (!mounted) {
        return <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors"></nav>;
    }

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
            <div className="flex-1 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search disputes, transactions, evidence..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 ml-4">
                <button 
                    onClick={toggleTheme}
                    className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <Bell className="h-5 w-5" />
                    </button>
                    
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-20">
                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h3>
                            </div>
                            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                No new notifications
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}