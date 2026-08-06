"use client";

import { ShieldAlert, Clock, Mail, AlertTriangle, Trophy, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { disputeService, Dispute } from "@/services/dispute.service";
import { authService } from "@/services/auth.service";
import { format } from "date-fns";

export default function DashboardPage() {
    const router = useRouter();
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const currentUser = authService.getUser();
                if (!currentUser) {
                    router.replace("/");
                    return;
                }
                setUser(currentUser);
                
                // Fetch merchant's disputes
                const response = await disputeService.getDisputes();
                setDisputes(response.data.disputes || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [router]);

    // Compute stats
    const total = disputes.length;
    const pending = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW').length;
    const won = disputes.filter(d => d.status === 'WON').length;
    const lost = disputes.filter(d => d.status === 'LOST').length;
    const escalated = disputes.filter(d => d.status === 'ESCALATED').length;

    const stats = [
        { label: "TOTAL", value: total.toString(), icon: ShieldAlert, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950" },
        { label: "PENDING", value: pending.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950" },
        { label: "ESCALATED", value: escalated.toString(), icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
        { label: "WON", value: won.toString(), icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" },
        { label: "LOST", value: lost.toString(), icon: XCircle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950" },
    ];

    // Get upcoming deadlines (just showing all pending ones for now)
    const upcomingDeadlines = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW').slice(0, 5);

    const recentActivity = [
        { title: "Dispute DSP_E2185643C3AC escalated", desc: "This dispute was escalated because no evidence was...", date: "08 JUL 2026" },
        { title: "Reminder: DSP_A8F36651354D", desc: "Upload supporting evidence before the 7-day deadli...", date: "08 JUL 2026" },
        { title: "Reminder: DSP_FA715D3BC86C", desc: "Upload supporting evidence before the 7-day deadli...", date: "08 JUL 2026" },
        { title: "Reminder: DSP_F7E9B1609C08", desc: "Upload supporting evidence before the 7-day deadli...", date: "08 JUL 2026" },
        { title: "Reminder: DSP_FBF53EF96745", desc: "Upload supporting evidence before the 7-day deadli...", date: "08 JUL 2026" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-1">DASHBOARD</p>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Good afternoon, {user ? user.email.split('@')[0] : 'Merchant'}</h1>
                    <p className="text-muted-foreground mt-1">You have <span className="font-semibold text-foreground">{pending}</span> disputes awaiting evidence.</p>
                </div>
                <Button onClick={() => router.push('/disputes')} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg px-5">
                    View all disputes
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                            <div className={`${stat.bg} p-2 rounded-full`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-foreground">Upcoming deadlines</h3>
                            <p className="text-sm text-muted-foreground">Prioritized by time remaining</p>
                        </div>
                        <button onClick={() => router.push('/disputes')} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">All</button>
                    </div>
                    <div className="divide-y divide-border">
                        {upcomingDeadlines.length === 0 && !loading && (
                            <div className="p-8 text-center text-muted-foreground">No pending disputes found.</div>
                        )}
                        {upcomingDeadlines.map((item, i) => (
                            <div key={item.id} className="p-4 px-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-950 p-2.5 rounded-xl">
                                        <ShieldAlert className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-sm uppercase tracking-wider">{item.id.substring(0, 12)}</p>
                                        <p className="text-sm text-muted-foreground">{new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency || 'USD' }).format(item.amount)} <span className="mx-1">•</span> {format(new Date(item.createdAt), 'dd MMM yyyy')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
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
                        <p className="text-sm text-muted-foreground">Latest notifications</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="relative pl-6">
                                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-muted-foreground/40"></div>
                                <h4 className="text-sm font-semibold text-foreground">{activity.title}</h4>
                                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{activity.desc}</p>
                                <p className="text-[10px] font-semibold text-muted-foreground/70 tracking-wider mt-2 uppercase">{activity.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
