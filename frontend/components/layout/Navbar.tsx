"use client";

import { Search, Moon, Bell, Sun, PanelLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface NavbarProps {
    onToggleSidebar: () => void;
    sidebarOpen: boolean;
}

export default function Navbar({ onToggleSidebar, sidebarOpen }: NavbarProps) {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line
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
        return <nav className="bg-background border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors"></nav>;
    }

    return (
        <nav className="bg-background border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
                {/* Sidebar toggle button */}
                <button
                    onClick={onToggleSidebar}
                    title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                    <PanelLeft className={`h-5 w-5 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} />
                </button>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search disputes, transactions, evidence..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full h-10 pl-10 pr-4 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground ml-4">
                <button
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    className="hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
                >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
                    >
                        <Bell className="h-5 w-5" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-20">
                            <div className="px-4 py-2 border-b border-border">
                                <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                            </div>
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No new notifications
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}