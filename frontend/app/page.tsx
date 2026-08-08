"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Store, ShieldCheck } from "lucide-react";
import TextType from "@/components/TextType";
import Prism from "@/components/Prism";

type Mode = "signin" | "signup";
type Role = "merchant" | "admin";

const Logo = () => (
  <div className="flex justify-center mb-6">
    <div className="bg-white p-2.5 rounded-2xl shadow-md border border-slate-100 hover:scale-105 transition-transform duration-300">
      <img 
        src="/logo.png" 
        alt="Dispute-X Logo" 
        className="h-28 w-28 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML = '<div class="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shadow-sm border border-blue-200">DX</div>';
        }}
      />
    </div>
  </div>
);

import { authService } from "@/services/auth.service";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<Role>("merchant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Check if already authenticated via our own service
    if (authService.isAuthenticated()) {
      const user = authService.getUser();
      if (user?.role === 'ADMIN') {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      let userData;
      if (mode === "signin") {
        const response = await authService.login(email, password, role.toUpperCase());
        userData = response.data.user;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(`Welcome back, ${role === 'admin' ? 'Admin' : 'Merchant'}!`);
      } else {
        // Merchant registration
        const response = await authService.register(email, password, 'MERCHANT');
        userData = response.data.user;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success("Merchant account created successfully!");
      }
      
      if (userData.role === 'ADMIN') {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMsg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* Left Panel - Dark Gradient Background */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#0B1021] p-12 relative overflow-hidden">
        {/* Soft glowing gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
        
        {/* 3D Prism Background */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0.5}
            glow={1}
          />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-center pointer-events-none">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight mb-4 text-white h-[80px]">
              Resolve chargebacks <br/>
              <TextType
                text={[
                  "before the clock runs out.",
                  "with undeniable evidence.",
                  "faster than ever."
                ]}
                typingSpeed={75}
                pauseDuration={2500}
                showCursor={true}
                cursorCharacter="|"
                className="text-blue-500"
              />
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A single workspace to track disputes, upload evidence, and keep an immutable trail.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50 relative overflow-hidden">
        {/* Ambient background glows for the right panel */}
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
            <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
              <Logo />

              {/* Role Selection Tabs */}
              <div className="flex p-1 mb-8 bg-slate-100/80 rounded-xl border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setRole("merchant")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    role === "merchant" 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/25" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/30"
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Merchant
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    role === "admin" 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/25" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/30"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {role === "admin" ? "Admin Login" : (mode === "signin" ? "Merchant Login" : "Create Merchant Account")}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {role === "admin" 
                    ? "Enter your credentials to access the admin portal." 
                    : "Enter your credentials to access the merchant portal."}
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === "admin" ? "admin@disputex.com" : "name@example.com"}
                    required
                    className="w-full h-11 bg-white text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 bg-white text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>

                <Button 
                  type="submit" 
                  className={`w-full h-11 mt-6 text-white shadow-sm transition-all duration-200 rounded-xl hover:scale-[1.01] active:scale-[0.99] ${role === 'admin' ? 'bg-[#E12B2B] hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`} 
                  disabled={busy}
                >
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {role === "admin" ? "Sign In as Admin" : (mode === "signin" ? "Sign In" : "Create Account")}
                </Button>
              </form>

              {role === "merchant" && (
                <div className="mt-8 text-center text-sm">
                  {mode === "signin" ? (
                    <span className="text-slate-500">
                      Don&apos;t have an account?{" "}
                      <button type="button" onClick={() => setMode("signup")} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors focus:outline-none">
                        Sign up
                      </button>
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Already have an account?{" "}
                      <button type="button" onClick={() => setMode("signin")} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors focus:outline-none">
                        Sign in
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
