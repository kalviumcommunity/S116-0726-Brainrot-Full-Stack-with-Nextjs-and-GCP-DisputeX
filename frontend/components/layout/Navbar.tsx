"use client";

import { Moon, Bell, Sun, PanelLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import MerchantGlobalSearch from "@/components/merchant/MerchantGlobalSearch";

interface NavbarProps {
    onToggleSidebar: () => void;
    sidebarOpen: boolean;
}

export default function Navbar({ onToggleSidebar, sidebarOpen }: NavbarProps) {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDarkMode = currentTheme === 'dark';

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
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

                <MerchantGlobalSearch />
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