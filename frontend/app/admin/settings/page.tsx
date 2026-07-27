"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { useState } from "react";

export default function AdminSettingsPage() {
    const [fullName, setFullName] = useState("yashu");
    const [email, setEmail] = useState("yash@gmail.com");
    const [password, setPassword] = useState("");

    return (
        <AdminAppShell>
            <div className="max-w-7xl mx-auto py-8">
                <div className="mb-8">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        <span className="text-red-500">ADMIN</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
                    <p className="text-muted-foreground">Manage your administrator profile</p>
                </div>

                <div className="bg-card rounded-xl shadow-sm border border-border p-8 max-w-2xl">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                                Full name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="block w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
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
                                className="block w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
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
                                className="block w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminAppShell>
    );
}