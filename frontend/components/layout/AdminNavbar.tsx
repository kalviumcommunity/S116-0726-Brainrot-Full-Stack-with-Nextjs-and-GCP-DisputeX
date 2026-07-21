"use client";

import { Search, Moon, Bell } from "lucide-react";

export default function AdminNavbar() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
            <div className="flex-1 max-w-2xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search disputes, merchants, transactions..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
            <div className="flex items-center gap-6">
                <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-bold tracking-wider uppercase">
                    Admin Mode
                </span>
                <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                    <button className="text-slate-500 hover:text-slate-700 transition-colors">
                        <Moon className="h-5 w-5" />
                    </button>
                    <button className="text-slate-500 hover:text-slate-700 transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
