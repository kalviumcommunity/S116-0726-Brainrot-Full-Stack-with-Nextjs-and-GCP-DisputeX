"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShieldAlert, Bell, User, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadUser();
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Disputes", href: "/disputes", icon: ShieldAlert },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 min-w-[256px] shrink-0 bg-[#0B1021] text-slate-300 flex flex-col h-screen overflow-y-auto font-sans shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-20 sticky top-0 border-r border-slate-700/60">
            {/* Logo area */}
            <div className="p-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 border border-slate-700/80 shadow-md flex items-center justify-center bg-white p-0.5">
                    <img src="/logo.png" alt="Dispute X Logo" className="h-full w-full object-cover rounded-full" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg leading-tight">Dispute X</h1>
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
                <div 
                    onClick={() => router.push('/profile')}
                    className="bg-[#111827] rounded-xl p-3 flex items-center gap-3 border border-slate-800/50 hover:border-slate-700 transition-colors cursor-pointer group"
                >
                    <div className="bg-indigo-900 text-indigo-200 rounded-full h-8 w-8 flex items-center justify-center text-sm font-semibold">
                        {user?.email?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">
                            {user?.email?.split('@')[0] || 'Merchant'}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">MERCHANT_ACCOUNT</p>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            import('@/services/auth.service').then(({ authService }) => {
                                authService.logout();
                                window.location.href = '/';
                            });
                        }}
                        className="p-1.5 -mr-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Sign out"
                    >
                        <LogOut className="h-4 w-4 text-slate-500 hover:text-slate-300 transition-colors" />
                    </button>
                </div>
            </div>
        </aside>
    );
}