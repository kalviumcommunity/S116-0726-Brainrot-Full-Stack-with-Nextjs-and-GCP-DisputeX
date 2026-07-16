"use client";

import { ShieldAlert, Clock, Mail, AlertTriangle, Trophy, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * DashboardPage Component
 * Renders the main dashboard view for the merchant, including summary statistics, 
 * upcoming deadlines, and recent activity feed.
 */
export default function DashboardPage() {
    // Array of key statistics metrics to display at the top of the dashboard

    const stats = [
        { label: "TOTAL", value: "10", icon: ShieldAlert, color: "text-indigo-500", bg: "bg-indigo-50" },
        { label: "PENDING", value: "6", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "RESPONDED", value: "0", icon: Mail, color: "text-sky-500", bg: "bg-sky-50" },
        { label: "ESCALATED", value: "1", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
        { label: "WON", value: "1", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "LOST", value: "2", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
    ];

    const upcomingDeadlines = [
        { id: "DSP_7ED0C9987DA9", name: "Kabir Mehta", amount: "₹16,636.30", date: "created 03 Jul 2026", status: "Pending", expired: true },
        { id: "DSP_FBF53EF96745", name: "Ananya Sharma", amount: "₹39,694.75", date: "created 04 Jul 2026", status: "Pending", expired: true },
        { id: "DSP_FA715D3BC86C", name: "Arjun Rao", amount: "₹33,043.38", date: "created 04 Jul 2026", status: "Pending", expired: true },
        { id: "DSP_9AF645D9AF94", name: "Aditya Patel", amount: "₹6,435.05", date: "created 05 Jul 2026", status: "Pending", expired: true },
        { id: "DSP_D61CF71E829D", name: "Aditya Patel", amount: "₹15,818.15", date: "created 05 Jul 2026", status: "Pending", expired: true },
    ];

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
                    <p className="text-xs font-semibold text-slate-500 tracking-wider mb-1">DASHBOARD</p>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Good afternoon, No</h1>
                    <p className="text-slate-500 mt-1">You have <span className="font-semibold text-slate-700">6</span> disputes awaiting evidence.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg px-5">
                    View all disputes
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 tracking-wider">{stat.label}</p>
                            <div className={`${stat.bg} p-2 rounded-full`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900">Upcoming deadlines</h3>
                            <p className="text-sm text-slate-500">Prioritized by time remaining</p>
                        </div>
                        <button className="text-sm font-semibold text-slate-700 hover:text-slate-900">All</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {upcomingDeadlines.map((item, i) => (
                            <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-50 p-2.5 rounded-xl">
                                        <ShieldAlert className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{item.id} <span className="text-slate-400 font-normal mx-1">•</span> {item.name}</p>
                                        <p className="text-sm text-slate-500">{item.amount} <span className="mx-1">•</span> {item.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                        {item.status}
                                    </span>
                                    {item.expired && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-red-600 bg-white border border-red-200">
                                            <Clock className="h-3 w-3" />
                                            Expired
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900">Recent activity</h3>
                        <p className="text-sm text-slate-500">Latest notifications</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="relative pl-6">
                                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-slate-300"></div>
                                <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
                                <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{activity.desc}</p>
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider mt-2 uppercase">{activity.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
