"use client";

import AdminAppShell from "@/components/common/AdminAppShell";
import { ShieldAlert, Clock, Mail, AlertTriangle, Trophy, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
    const stats = [
        { label: "TOTAL", value: "60", icon: ShieldAlert, color: "text-indigo-500", bg: "bg-indigo-50" },
        { label: "OPEN", value: "27", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "SUBMITTED", value: "10", icon: Mail, color: "text-sky-500", bg: "bg-sky-50" },
        { label: "ESCALATED", value: "7", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
        { label: "RESOLVED", value: "16", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "TODAY", value: "0", icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    const latestDisputes = [
        { id: "DSP_CC96E8D0A417", name: "Aditya Patel", amount: "₹36,229.20", date: "09 Jul 2026", status: "Pending", statusColor: "bg-amber-50 text-amber-700", expired: true },
        { id: "DSP_7141990BC6A7", name: "Aditya Patel", amount: "₹28,204.71", date: "09 Jul 2026", status: "Escalated", statusColor: "bg-red-50 text-red-700", expired: true },
        { id: "DSP_4FB14A1BF136", name: "Kabir Mehta", amount: "₹27,163.35", date: "09 Jul 2026", status: "Lost", statusColor: "bg-slate-100 text-slate-700", expired: true },
        { id: "DSP_BB22DF6410E5", name: "Rohan Verma", amount: "₹8,794.68", date: "08 Jul 2026", status: "Pending", statusColor: "bg-amber-50 text-amber-700", expired: true },
        { id: "DSP_B3DAC27C2E2F", name: "Neha Gupta", amount: "₹13,178.52", date: "08 Jul 2026", status: "Responded", statusColor: "bg-sky-50 text-sky-700", expired: true },
        { id: "DSP_11270BDCE521", name: "Meera Nair", amount: "₹38,860.17", date: "08 Jul 2026", status: "Pending", statusColor: "bg-amber-50 text-amber-700", expired: true },
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

    return (
        <AdminAppShell>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-red-500 tracking-[0.15em] mb-1 uppercase">Admin</p>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Control center</h1>
                        <p className="text-slate-500 mt-1">Overseeing <span className="font-semibold text-slate-700">21</span> merchants and <span className="font-semibold text-slate-700">60</span> disputes.</p>
                    </div>
                    <Button className="bg-[#5B5CE6] hover:bg-indigo-600 text-white gap-2 rounded-xl px-5 h-11 font-medium shadow-sm transition-colors">
                        View all disputes
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] font-bold text-slate-500 tracking-wider">{stat.label}</p>
                                <div className={`${stat.bg} p-2 rounded-full`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts placeholders */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[320px]">
                        <div>
                            <h3 className="font-bold text-slate-900">Cases by day (last 7)</h3>
                            <p className="text-sm text-slate-500">New disputes per day</p>
                        </div>
                        <div className="flex-1 flex items-end justify-between px-4 pb-2 mt-4 text-xs text-slate-400">
                            {/* Dummy Y axis */}
                            <div className="flex flex-col justify-between h-full py-2">
                                <span>4</span>
                                <span>3</span>
                                <span>2</span>
                                <span>1</span>
                                <span>0</span>
                            </div>
                            {/* Dummy X axis */}
                            <div className="flex-1 flex items-end justify-around border-b border-l border-slate-100 ml-4 pb-2">
                                <span className="pt-2">Wed</span>
                                <span className="pt-2">Thu</span>
                                <span className="pt-2">Fri</span>
                                <span className="pt-2">Sat</span>
                                <span className="pt-2">Sun</span>
                                <span className="pt-2">Mon</span>
                                <span className="pt-2">Tue</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[320px] flex flex-col">
                        <div>
                            <h3 className="font-bold text-slate-900">Status distribution</h3>
                            <p className="text-sm text-slate-500">Open • escalated • resolved</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center mt-4">
                            {/* Fake Pie Chart */}
                            <div className="relative w-40 h-40 rounded-full border-[24px] border-indigo-500 mb-6">
                                {/* Simulated segments using border colors/clipping on a real chart, but simple CSS fake here */}
                                <div className="absolute top-[-24px] right-[-24px] w-40 h-40 rounded-full border-[24px] border-emerald-500 clip-half" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)' }}></div>
                                <div className="absolute top-[-24px] right-[-24px] w-40 h-40 rounded-full border-[24px] border-red-500 clip-quarter" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 50%)' }}></div>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs font-medium">
                                <span className="flex items-center gap-1.5 text-indigo-600"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Open</span>
                                <span className="flex items-center gap-1.5 text-red-600"><span className="w-2 h-2 rounded-full bg-red-500"></span>Escalated</span>
                                <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Resolved</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900">Latest disputes</h3>
                                <p className="text-sm text-slate-500">Most recent filings</p>
                            </div>
                            <button className="text-sm font-semibold text-slate-900">All</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {latestDisputes.map((item, i) => (
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
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${item.statusColor.replace('bg-', 'border-').replace('50', '200')}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.statusColor.split(' ')[1].replace('text-', 'bg-').replace('700', '500')}`}></span>
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
                            <p className="text-sm text-slate-500">Timeline events</p>
                        </div>
                        <div className="p-0">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="p-4 px-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">{activity.title}</h4>
                                    <p className="text-[10px] font-semibold text-slate-400 tracking-wider mt-2 uppercase">
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
