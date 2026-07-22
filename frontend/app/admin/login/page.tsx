"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, Mail, Lock, Eye, ArrowRight, Key, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        try {
            // Temporarily bypassing auth
            toast.success("Logged in as Admin (Bypassed)");
            router.replace("/admin/dashboard");
        } catch (error) {
            const err = error as Error;
            toast.error(err.message ?? "Something went wrong");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full font-sans bg-[#0B1021] relative overflow-hidden">
            {/* Soft glowing gradients */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />

            <div className="w-full flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md">
                    <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-200 transition-all text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#E12B2B] rounded-xl p-2.5 flex items-center justify-center shadow-sm">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-[#E12B2B] tracking-wider uppercase mb-0.5">Admin Access</h3>
                                <h2 className="text-xl font-bold text-slate-900 leading-none">Razorpay Dispute Portal</h2>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to control center</h1>
                            <p className="text-slate-500 text-sm">Restricted to authorized administrators.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="admin-email" className="text-sm font-semibold text-slate-900">Admin Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="admin-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@razorpay.com"
                                        required
                                        className="w-full h-11 pl-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="admin-password" className="text-sm font-semibold text-slate-900">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="admin-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full h-11 pl-10 pr-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
                                    Remember me on this device
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-[#E12B2B] hover:bg-red-600 text-white shadow-sm transition-colors text-base font-medium rounded-xl flex items-center justify-center gap-2"
                                disabled={busy}
                            >
                                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
                                {!busy && <ArrowRight className="h-4 w-4" />}
                            </Button>
                        </form>

                        <div className="mt-6 border border-dashed border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                            <div className="flex gap-3">
                                <Key className="h-4 w-4 text-slate-700 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 leading-none mb-1">First-time setup</h4>
                                    <p className="text-sm text-slate-500 leading-snug">
                                        No administrators exist yet? Sign in with any account first, then{" "}
                                        <a href="#" className="text-blue-600 font-medium hover:underline">claim first-admin</a>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-sm text-slate-500">
                            Not an admin?{" "}
                            <button type="button" onClick={() => router.push("/")} className="text-blue-600 font-medium hover:underline transition-colors focus:outline-none">
                                Merchant sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}