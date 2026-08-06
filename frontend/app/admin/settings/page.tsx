"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { useState, useEffect } from "react";
import { Sun, Moon, Mail, Bell, AlertTriangle, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
    const [fullName, setFullName] = useState("Administrator");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined") {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user.email) setEmail(user.email);
        }
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
        import('@/services/auth.service').then(({ authService }) => {
            authService.logout();
            router.push("/");
        });
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Profile updated", {
            description: "Your administrator profile has been saved.",
        });
    };

    return (
        <AdminAppShell>
            <div className="w-full max-w-7xl mx-auto flex flex-col h-full font-sans p-2 transition-colors">
                <div className="mb-8">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <span className="text-red-500">ADMIN</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
                    <p className="text-muted-foreground">Manage your administrator profile and preferences</p>
                </div>

                <div className="flex-1 max-w-3xl space-y-6">
                    {/* Profile Form */}
                    <div className="bg-card rounded-2xl border border-border shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                            <p className="text-sm text-muted-foreground">Update your personal details.</p>
                        </div>
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                    New password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Leave blank to keep current"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Appearance Card */}
                    <div className="bg-card rounded-2xl border border-border shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                            <p className="text-sm text-muted-foreground">Choose how the portal looks on your devices.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleThemeChange("light")}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTheme === "light" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 shadow-sm" : "bg-background text-foreground border border-border hover:bg-muted"}`}
                            >
                                <Sun className="h-4 w-4" />
                                Light
                            </button>
                            <button
                                onClick={() => handleThemeChange("dark")}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${currentTheme === "dark" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 shadow-sm" : "bg-background text-foreground border border-border hover:bg-muted"}`}
                            >
                                <Moon className="h-4 w-4" />
                                Dark
                            </button>
                        </div>
                    </div>

                    {/* Notifications Card */}
                    <div className="bg-card rounded-2xl border border-border shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                            <p className="text-sm text-muted-foreground">Get alerts by email and in-app.</p>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Email notifications */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-muted-foreground/30 transition-colors">
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
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications.email ? "bg-blue-600" : "bg-muted-foreground/50"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>

                            {/* Daily reminders */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-muted-foreground/30 transition-colors">
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
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications.daily ? "bg-blue-600" : "bg-muted-foreground/50"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.daily ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>

                            {/* Escalation alerts */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-muted-foreground/30 transition-colors">
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
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications.escalation ? "bg-blue-600" : "bg-muted-foreground/50"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.escalation ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-card rounded-2xl border border-border shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-foreground">Security</h2>
                            <p className="text-sm text-muted-foreground">Manage account access.</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground bg-background border border-border hover:bg-muted transition-colors shadow-sm"
                        >
                            <LogOut className="h-4 w-4 text-red-500" />
                            Sign out of this device
                        </button>
                    </div>
                </div>
            </div>
        </AdminAppShell>
    );
}