"use client";

import AppShell from "@/components/common/AppShell";
import { Sun, Moon, Mail, Bell, AlertTriangle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const [notifications, setNotifications] = useState({
        email: true,
        daily: true,
        escalation: true,
    });

    if (!mounted) return null;

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            toast.success("Preferences updated", {
                description: "Your notification preferences have been saved.",
            });
            return newState;
        });
    };

    const handleThemeChange = (newTheme: "light" | "dark") => {
        setTheme(newTheme);
        toast.success("Appearance updated", {
            description: `Theme has been set to ${newTheme} mode.`,
        });
    };

    const handleSignOut = () => {
        toast.success("Signed out", {
            description: "You have been successfully signed out of this device.",
        });
        setTimeout(() => {
            router.push("/");
        }, 1000);
    };

    return (
        <AppShell>
            <div className="w-full max-w-7xl mx-auto flex flex-col h-full font-sans p-2 transition-colors">
                {/* Header Section */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-1 uppercase">Settings</p>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Preferences & security</h1>
                </div>

                <div className="flex-1 max-w-3xl space-y-6">
                    {/* Appearance Card */}
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden p-8 transition-colors">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                            <p className="text-sm text-muted-foreground">Choose how the portal looks on your devices.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleThemeChange("light")}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTheme === "light" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 shadow-sm" : "bg-card text-muted-foreground border border-border hover:bg-muted/50"}`}
                            >
                                <Sun className="h-4 w-4" />
                                Light
                            </button>
                            <button
                                onClick={() => handleThemeChange("dark")}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTheme === "dark" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 shadow-sm" : "bg-card text-muted-foreground border border-border hover:bg-muted/50"}`}
                            >
                                <Moon className="h-4 w-4" />
                                Dark
                            </button>
                        </div>
                    </div>

                    {/* Notifications Card */}
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden p-8 transition-colors">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                            <p className="text-sm text-muted-foreground">Get alerts by email and in-app.</p>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Email notifications */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Email notifications</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Deadline reminders and case updates</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification("email")}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${notifications.email ? "bg-indigo-600" : "bg-muted"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>

                            {/* Daily reminders */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                        <Bell className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Daily reminders</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Nudge you when disputes are approaching deadline</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification("daily")}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${notifications.daily ? "bg-indigo-600" : "bg-muted"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.daily ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>

                            {/* Escalation alerts */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                        <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Escalation alerts</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Alert when a dispute is escalated to the bank</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification("escalation")}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${notifications.escalation ? "bg-indigo-600" : "bg-muted"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.escalation ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden p-8 transition-colors">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-foreground">Security</h2>
                            <p className="text-sm text-muted-foreground">Manage account access.</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground bg-card border border-border hover:bg-muted/50 transition-colors shadow-sm"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out of this device
                        </button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
