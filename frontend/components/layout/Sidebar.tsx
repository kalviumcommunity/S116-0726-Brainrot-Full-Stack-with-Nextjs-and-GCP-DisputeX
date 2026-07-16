"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldAlert, Bell, User, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Disputes", href: "/disputes", icon: ShieldAlert },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#0B1021] text-slate-300 flex flex-col h-screen overflow-y-auto font-sans shadow-xl z-20 sticky top-0">
            {/* Logo area */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-blue-600 rounded-md p-1.5 flex items-center justify-center">
                    <ShieldAlert className="text-white h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg leading-tight">Razorpay</h1>
                    <p className="text-[10px] text-slate-400 font-semibold tracking-wider">DISPUTE PORTAL</p>
                </div>
            </div>

            <div className="px-6 py-2">
                <p className="text-xs text-slate-500 font-semibold mb-4 tracking-wider">WORKSPACE</p>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-slate-800/50 hover:text-slate-200'}`}
                            >
                                <item.icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4 mb-2">
                <div className="bg-[#111827] rounded-xl p-3 flex items-center gap-3 border border-slate-800/50 hover:border-slate-700 transition-colors cursor-pointer group">
                    <div className="bg-indigo-900 text-indigo-200 rounded-full h-8 w-8 flex items-center justify-center text-sm font-semibold">
                        N
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">No One</p>
                        <p className="text-[10px] text-slate-500 truncate">MID_6F5B22BC16</p>
                    </div>
                    <LogOut className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
            </div>
        </aside>
    );
}