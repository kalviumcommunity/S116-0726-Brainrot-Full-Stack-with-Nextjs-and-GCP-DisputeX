"use client";

import { Search, Moon, Bell } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex-1 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search disputes, transactions, evidence..."
                        className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 text-slate-500 ml-4">
                <button className="hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100">
                    <Moon className="h-5 w-5" />
                </button>
                <button className="hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                </button>
            </div>
        </nav>
    );
}