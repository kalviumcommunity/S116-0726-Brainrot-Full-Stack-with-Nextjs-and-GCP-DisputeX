"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldAlert, Bell, Users, Settings, LogOut } from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "All Disputes", href: "/admin/disputes", icon: ShieldAlert },
        { name: "Merchants", href: "/admin/merchants", icon: Users },
        { name: "Notifications", href: "/admin/notifications", icon: Bell, badge: 26 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <aside className="w-[260px] bg-[#0B1021] text-slate-300 flex flex-col h-screen overflow-y-auto font-sans shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-20 sticky top-0 border-r border-slate-800/50">
            {/* Logo area */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-[#E12B2B] rounded-xl p-2 flex items-center justify-center shadow-[0_0_15px_rgba(225,43,43,0.25)]">
                    <ShieldAlert className="text-white h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-base leading-tight tracking-tight">Razorpay Admin</h1>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.15em] mt-0.5 uppercase">Control Center</p>
                </div>
            </div>

            <div className="px-4 py-2 flex-1">
                <p className="text-[10px] text-slate-500 font-bold mb-3 tracking-[0.15em] uppercase px-2">Admin</p>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all group ${isActive ? 'bg-[#151D2E] text-slate-100 font-medium relative before:absolute before:-left-4 before:top-2 before:bottom-2 before:w-1 before:bg-[#E12B2B] before:rounded-r-md shadow-sm' : 'hover:bg-slate-800/40 hover:text-slate-200'}`}
                            >
                                <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'}`} />
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <span className="bg-[#E12B2B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4 mb-2">
                <div className="bg-[#111827] rounded-xl p-3 flex items-center gap-3 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group shadow-sm">
                    <div className="bg-[#E12B2B]/10 text-[#E12B2B] rounded-full h-9 w-9 flex items-center justify-center text-sm font-bold border border-[#E12B2B]/20">
                        S
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">Administrator</p>
                        <p className="text-[11px] text-slate-500 truncate">shubh@gmail.com</p>
                    </div>
                    <LogOut className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
            </div>
        </aside>
    );
}
