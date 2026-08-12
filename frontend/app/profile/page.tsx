"use client";

import AppShell from "@/components/common/AppShell";
import { Shield, Copy, Check, Loader2, Pencil, User, Building, Mail, Phone, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [merchantId, setMerchantId] = useState("MCH-84920184");
    
    // Saved details state (displayed in View mode)
    const [profile, setProfile] = useState({
        fullName: "Shubh Patel",
        businessName: "Shubh Enterprise",
        email: "shubh19@gmail.com",
        phone: "+91 98765 43210"
    });

    // Form inputs state (editable in Edit mode)
    const [formData, setFormData] = useState(profile);

    useEffect(() => {
        try {
            const user = authService.getUser();
            if (user) {
                const username = user.email ? user.email.split('@')[0] : 'Merchant';
                const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
                
                const loadedProfile = {
                    fullName: user.fullName || formattedName,
                    businessName: user.businessName || `${formattedName} Enterprise`,
                    email: user.email || "",
                    phone: user.phone || "+91 98765 43210"
                };

                setProfile(loadedProfile);
                setFormData(loadedProfile);

                if (user.merchantId) {
                    setMerchantId(user.merchantId);
                } else if (user.id) {
                    setMerchantId(`MCH-${user.id.substring(0, 8).toUpperCase()}`);
                }
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    }, []);

    const handleCopy = () => {
        if (!merchantId) return;
        navigator.clipboard.writeText(merchantId);
        setCopied(true);
        toast.success("Merchant ID copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const existingUser = authService.getUser() || {};
            const updatedUser = {
                ...existingUser,
                fullName: formData.fullName,
                businessName: formData.businessName,
                email: formData.email,
                phone: formData.phone,
                merchantId: merchantId
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setProfile(formData);
            
            // Dispatch event for other components to react (e.g. sidebar)
            window.dispatchEvent(new Event('storage'));

            setTimeout(() => {
                setSaving(false);
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            }, 500);
        } catch (error) {
            console.error("Failed to save profile:", error);
            setSaving(false);
            toast.error("Failed to save account details.");
        }
    };

    return (
        <AppShell>
            <div className="w-full max-w-7xl mx-auto flex flex-col font-sans p-2">
                {/* Header Section */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-1 uppercase">Profile</p>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Account details</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your merchant profile and contact information.</p>
                    </div>

                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.98] w-fit"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit profile
                        </button>
                    )}
                </div>

                {/* Main Profile Card */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-6 flex-1 max-w-3xl transition-all duration-300 hover:shadow-md p-8">
                    
                    {/* User Header Profile Badge */}
                    <div className="flex items-center gap-5 pb-8 mb-8 border-b border-border">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-500/20 ring-4 ring-indigo-500/10">
                            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-foreground tracking-tight">{profile.fullName || 'Merchant'}</h2>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Verified
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">{profile.businessName}</p>
                        </div>
                    </div>

                    {/* Merchant ID Banner */}
                    <div className="flex items-center justify-between bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl p-4 mb-8 border border-indigo-100 dark:border-indigo-900/50">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-800">
                                <Shield className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Merchant ID</p>
                                <p className="text-sm font-mono font-semibold text-foreground">{merchantId}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>

                    {!isEditing ? (
                        /* VIEW MODE */
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-muted/30 border border-border/80">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        <User className="h-3.5 w-3.5 text-indigo-500" />
                                        Full name
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{profile.fullName || "—"}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-muted/30 border border-border/80">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        <Building className="h-3.5 w-3.5 text-indigo-500" />
                                        Business name
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{profile.businessName || "—"}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-muted/30 border border-border/80">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        <Mail className="h-3.5 w-3.5 text-indigo-500" />
                                        Email address
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{profile.email || "—"}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-muted/30 border border-border/80">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        <Phone className="h-3.5 w-3.5 text-indigo-500" />
                                        Phone number
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{profile.phone || "—"}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* EDIT MODE FORM */
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                                        Full name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-muted-foreground shadow-sm"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="businessName" className="block text-sm font-medium text-foreground">
                                        Business name
                                    </label>
                                    <input
                                        type="text"
                                        id="businessName"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-muted-foreground shadow-sm"
                                        placeholder="Enter business name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-muted-foreground shadow-sm"
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                                        Phone number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-muted-foreground shadow-sm"
                                        placeholder="+91"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end items-center gap-3 pt-6 border-t border-border">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-xl border border-border transition-all active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {saving ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AppShell>
    );
}