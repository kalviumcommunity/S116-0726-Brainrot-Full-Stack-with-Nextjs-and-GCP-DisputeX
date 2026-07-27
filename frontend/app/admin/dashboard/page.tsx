"use client";

import AdminAppShell from "@/components/common/AdminAppShell";
import { ShieldAlert, Clock, Mail, AlertTriangle, Trophy, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const router = useRouter();
    const stats = [
        { label: "TOTAL", value: "60", icon: ShieldAlert, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950" },
        { label: "OPEN", value: "27", icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950" },
        { label: "SUBMITTED", value: "10", icon: Mail, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950" },
        { label: "ESCALATED", value: "7", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
        { label: "RESOLVED", value: "16", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" },
        { label: "TODAY", value: "0", icon: Activity, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
    ];

    const latestDisputes = [
        { id: "DSP_CC96E8D0A417", name: "Aditya Patel", amount: "₹36,229.20", date: "09 Jul 2026", status: "Pending", expired: true },
        { id: "DSP_7141990BC6A7", name: "Aditya Patel", amount: "₹28,204.71", date: "09 Jul 2026", status: "Escalated", expired: true },
        { id: "DSP_4FB14A1BF136", name: "Kabir Mehta", amount: "₹27,163.35", date: "09 Jul 2026", status: "Lost", expired: true },
        { id: "DSP_BB22DF6410E5", name: "Rohan Verma", amount: "₹8,794.68", date: "08 Jul 2026", status: "Pending", expired: true },
        { id: "DSP_B3DAC27C2E2F", name: "Neha Gupta", amount: "₹13,178.52", date: "08 Jul 2026", status: "Responded", expired: true },
        { id: "DSP_11270BDCE521", name: "Meera Nair", amount: "₹38,860.17", date: "08 Jul 2026", status: "Pending", expired: true },
    ];

    const recentActivity = [
        { title: "Evidence uploaded: 2021-rolls-royce-ghost-vn-1920x1080.jpg", desc: "MERCHANT", date: "09 JUL 2026, 01:23 PM" },
        { title: "Dispute opened by Aditya Patel", desc: "SYSTEM", date: "09 JUL 2026, 01:14 PM" },
        { title: "Dispute opened by Sana Khan", desc: "SYSTEM", date: "09 JUL 2026, 01:14 PM" },
        { title: "Dispute opened by Neha Gupta", desc: "SYSTEM", date: "09 JUL 2026, 01:14 PM" },
        { title: "Dispute opened by Aditya Patel", desc: "SYSTEM", date: "09 JUL 2026, 01:14 PM" },
        { title: "Merchant notified via email", desc: "SYSTEM", date: "09 JUL 2026, 01:14 PM" },
        { title: "Dispute opened by Priya Iyer", desc: "SYSTEM", date: "09 JUL 2026, 01:14 PM" },
        { title: "Merchant notified via email", desc: "SYSTEM", date: "09 JUL 2026, 01:14 PM" },
    ];

    const getStatusClass = (status: string) => {
        if (status === "Pending") return "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900";
        if (status === "Escalated") return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900";
        if (status === "Responded") return "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900";
        return "bg-muted text-muted-foreground border-border";
    };

    return (
        <AdminAppShell>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-red-500 tracking-[0.15em] mb-1 uppercase">Admin</p>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Control center</h1>
                        <p className="text-muted-foreground mt-1">Overseeing <span className="font-semibold text-foreground">21</span> merchants and <span className="font-semibold text-foreground">60</span> disputes.</p>
                    </div>
                    <Button onClick={() => router.push('/admin/disputes')} className="bg-[#5B5CE6] hover:bg-indigo-600 text-white gap-2 rounded-xl px-5 h-11 font-medium shadow-sm transition-colors">
                        View all disputes
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                                <div className={`${stat.bg} p-2 rounded-full`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts */}
                    <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col h-[320px]">
                        <div>
                            <h3 className="font-bold text-foreground">Cases by day (last 7)</h3>
                            <p className="text-sm text-muted-foreground">New disputes per day</p>
                        </div>
                        <div className="flex-1 flex items-end justify-between px-4 pb-2 mt-4 text-xs text-muted-foreground">
                            <div className="flex flex-col justify-between h-full py-2">
                                <span>4</span><span>3</span><span>2</span><span>1</span><span>0</span>
                            </div>
                            <div className="flex-1 flex items-end justify-around border-b border-l border-border ml-4 pb-2">
                                <span className="pt-2">Wed</span><span className="pt-2">Thu</span>
                                <span className="pt-2">Fri</span><span className="pt-2">Sat</span>
                                <span className="pt-2">Sun</span><span className="pt-2">Mon</span>
                                <span className="pt-2">Tue</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 h-[320px] flex flex-col">
                        <div>
                            <h3 className="font-bold text-foreground">Status distribution</h3>
                            <p className="text-sm text-muted-foreground">Open • escalated • resolved</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center mt-4">
                            <div className="relative w-40 h-40 rounded-full border-[24px] border-indigo-500 mb-6">
                                <div className="absolute top-[-24px] right-[-24px] w-40 h-40 rounded-full border-[24px] border-emerald-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)' }}></div>
                                <div className="absolute top-[-24px] right-[-24px] w-40 h-40 rounded-full border-[24px] border-red-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 50%)' }}></div>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs font-medium">
                                <span className="flex items-center gap-1.5 text-indigo-500"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Open</span>
                                <span className="flex items-center gap-1.5 text-red-500"><span className="w-2 h-2 rounded-full bg-red-500"></span>Escalated</span>
                                <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Resolved</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-foreground">Latest disputes</h3>
                                <p className="text-sm text-muted-foreground">Most recent filings</p>
                            </div>
                            <button onClick={() => router.push('/admin/disputes')} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">All</button>
                        </div>
                        <div className="divide-y divide-border">
                            {latestDisputes.map((item, i) => (
                                <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-muted/40 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-50 dark:bg-indigo-950 p-2.5 rounded-xl">
                                            <ShieldAlert className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{item.id} <span className="text-muted-foreground font-normal mx-1">•</span> {item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.amount} <span className="mx-1">•</span> {item.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusClass(item.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                                            {item.status}
                                        </span>
                                        {item.expired && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-red-600 dark:text-red-400 bg-card border border-red-200 dark:border-red-900">
                                                <Clock className="h-3 w-3" />
                                                Expired
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border shadow-sm">
                        <div className="p-6 border-b border-border">
                            <h3 className="font-bold text-foreground">Recent activity</h3>
                            <p className="text-sm text-muted-foreground">Timeline events</p>
                        </div>
                        <div>
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="p-4 px-6 border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                                    <h4 className="text-sm font-semibold text-foreground leading-snug">{activity.title}</h4>
                                    <p className="text-[10px] font-semibold text-muted-foreground tracking-wider mt-2 uppercase">
                                        {activity.desc} <span className="mx-1">•</span> {activity.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminAppShell>
    );
}
