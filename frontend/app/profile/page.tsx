"use client";

import AppShell from "@/components/common/AppShell";
import { Shield, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        businessName: "",
        email: "",
        phone: "+91"
    });

    const merchantId = "";

    const handleCopy = () => {
        navigator.clipboard.writeText(merchantId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <AppShell>
            <div className="w-full max-w-7xl mx-auto flex flex-col h-full bg-slate-50 font-sans p-2">
                {/* Header Section */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-slate-500 tracking-wider mb-1 uppercase">Profile</p>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account details</h1>
                    <p className="text-sm text-slate-500 mt-2">Manage your merchant profile and contact information.</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden mb-6 flex-1 max-w-3xl transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="p-8">

                        {/* Merchant ID Banner */}
                        <div className="flex items-center justify-between bg-indigo-50/50 rounded-xl p-4 mb-8 border border-indigo-100/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-indigo-100">
                                    <Shield className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Merchant ID</p>
                                    <p className="text-sm font-mono font-medium text-slate-900">{merchantId}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="businessName" className="block text-sm font-medium text-slate-700">
                                    Business name
                                </label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                    placeholder="Enter business name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                                    placeholder="+91"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow shadow-indigo-600/20 transition-all active:scale-[0.98]">
                                Save changes
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </AppShell>
    );
}