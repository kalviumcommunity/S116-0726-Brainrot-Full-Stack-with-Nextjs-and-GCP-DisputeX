"use client";

import { Moon, Sun, Bell, PanelLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminGlobalSearch from "@/components/admin/AdminGlobalSearch";

interface AdminNavbarProps {
    onToggleSidebar: () => void;
    sidebarOpen: boolean;
}

export default function AdminNavbar({ onToggleSidebar, sidebarOpen }: AdminNavbarProps) {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDarkMode = currentTheme === "dark";

    const toggleTheme = () => {
        setTheme(isDarkMode ? "light" : "dark");
    };

    if (!mounted) {
        return (
            <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8 z-10 sticky top-0 transition-colors" />
        );
    }

    return (
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8 z-10 sticky top-0 transition-colors">
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
                {/* Sidebar toggle button */}
                <button
                    onClick={onToggleSidebar}
                    title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                    <PanelLeft className={`h-5 w-5 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} />
                </button>

                <AdminGlobalSearch />
            </div>

            <div className="flex items-center gap-6">
                <span className="px-3 py-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-full text-xs font-bold tracking-wider uppercase">
                    Admin Mode
                </span>
                <div className="flex items-center gap-2 border-l border-border pl-6">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    {/* Notifications */}
                    <button
                        onClick={() => router.push("/admin/notifications")}
                        className="text-muted-foreground hover:text-foreground transition-colors relative p-2 rounded-full hover:bg-muted"
                        title="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
