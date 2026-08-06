"use client";

import AdminAppShell from "@/components/common/AdminAppShell";
import { ShieldAlert, Clock, Mail, AlertTriangle, Trophy, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { Dispute, Activity as ActivityType } from "@/services/dispute.service";
import { format } from "date-fns";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    
    // State for dashboard data
    const [counts, setCounts] = useState({ total: 0, open: 0, escalated: 0, resolved: 0, merchants: 0 });
    const [latestDisputes, setLatestDisputes] = useState<Dispute[]>([]);
    const [recentActivity, setRecentActivity] = useState<ActivityType[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setCounts({
                    total: data.stats.disputes.total,
                    open: data.stats.disputes.open,
                    escalated: data.stats.disputes.escalated,
                    resolved: data.stats.disputes.won + data.stats.disputes.lost,
                    merchants: data.stats.merchants.total
                });
                setLatestDisputes(data.recentDisputes);
                setRecentActivity(data.recentActivities);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { label: "TOTAL", value: counts.total.toString(), icon: ShieldAlert, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950" },
        { label: "OPEN", value: counts.open.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950" },
        { label: "MERCHANTS", value: counts.merchants.toString(), icon: Mail, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950" },
        { label: "ESCALATED", value: counts.escalated.toString(), icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
        { label: "RESOLVED", value: counts.resolved.toString(), icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" },
        { label: "TODAY", value: "0", icon: Activity, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
    ];

    const getStatusClass = (status: string) => {
        if (status === "OPEN" || status === "UNDER_REVIEW") return "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900";
        if (status === "ESCALATED" || status === "LOST") return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900";
        if (status === "WON") return "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
        return "bg-muted text-muted-foreground border-border";
    };

    return (
        <AdminAppShell>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-red-500 tracking-[0.15em] mb-1 uppercase">Admin</p>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Control center</h1>
                        <p className="text-muted-foreground mt-1">Overseeing <span className="font-semibold text-foreground">{counts.merchants}</span> merchants and <span className="font-semibold text-foreground">{counts.total}</span> disputes.</p>
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
                            {latestDisputes.length === 0 && !loading && (
                                <div className="p-8 text-center text-muted-foreground">No recent disputes found.</div>
                            )}
                            {latestDisputes.map((item, i) => (
                                <div key={item.id} className="p-4 px-6 flex items-center justify-between hover:bg-muted/40 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-50 dark:bg-indigo-950 p-2.5 rounded-xl">
                                            <ShieldAlert className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm uppercase tracking-wider">{item.id.substring(0, 12)} <span className="text-muted-foreground font-normal mx-1">•</span> {item.merchant?.name}</p>
                                            <p className="text-sm text-muted-foreground">{new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency || 'USD' }).format(item.amount)} <span className="mx-1">•</span> {format(new Date(item.createdAt), 'dd MMM yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusClass(item.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                                            {item.status}
                                        </span>
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
                            {recentActivity.length === 0 && !loading && (
                                <div className="p-8 text-center text-muted-foreground">No recent activity found.</div>
                            )}
                            {recentActivity.map((activity, i) => (
                                <div key={activity.id} className="p-4 px-6 border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                                    <h4 className="text-sm font-semibold text-foreground leading-snug">{activity.description}</h4>
                                    <p className="text-[10px] font-semibold text-muted-foreground tracking-wider mt-2 uppercase">
                                        {activity.action} <span className="mx-1">•</span> {format(new Date(activity.createdAt), 'dd MMM yyyy, hh:mm a')}
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
