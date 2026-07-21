"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Store, Shield, ArrowLeft, ShieldCheck, Mail, Lock, Eye, ArrowRight, Key, EyeOff } from "lucide-react";

// Mode defines whether the user is signing in or signing up
type Mode = "signin" | "signup";
// Role determines the access level of the user
type Role = "merchant" | "admin" | null;

const Logo = () => (
  <div className="flex justify-center mb-6">
    <img 
      src="/logo.jpeg" 
      alt="Dispute Portal Logo" 
      className="h-20 w-20 object-contain drop-shadow-sm rounded-full bg-white p-1"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement!.innerHTML = '<div class="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shadow-sm border border-blue-200">DP</div>';
      }}
    />
  </div>
);

export default function AuthPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard"); // Redirecting to a dashboard instead of "/" since this is likely the root
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      // Temporarily bypassing Supabase auth so you can test the dashboard without .env keys
      /*
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(`Logged in as ${role}`);
        router.replace("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email.");
        router.replace("/dashboard");
      }
      */
      
      toast.success(mode === "signin" ? `Logged in as ${role} (Bypassed)` : "Account created! (Bypassed)");
      router.replace("/dashboard");
      
    } catch (error) {
      const err = error as Error;
      toast.error(err.message ?? "Something went wrong");
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
        
        <div className="relative z-10 flex flex-col h-full justify-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight mb-4 text-white">
              Resolve chargebacks <br/>
              <span className="text-blue-500">before the clock runs out.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A single workspace to track disputes, upload evidence, and keep an immutable trail.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Area */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 transition-colors duration-500 relative overflow-hidden ${role === 'admin' ? 'bg-[#0B1021]' : 'bg-slate-50'}`}>
        {role === 'admin' && (
           <>
             <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />
           </>
        )}
        <div className="w-full max-w-md relative z-10">
          
          {!role ? (
            /* Role Selector */
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 text-center transition-all">
              <Logo />
              <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Dispute Portal</h1>
              <p className="text-slate-500 mb-8 text-sm">Please select your portal to continue.</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setRole("merchant")}
                  className="group flex items-center p-4 border border-slate-200 bg-white rounded-xl hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 text-left"
                >
                  <div className="bg-blue-50 group-hover:bg-blue-100 p-3 rounded-full mr-4 transition-colors">
                    <Store className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">Merchant Portal</h3>
                    <p className="text-sm text-slate-500">Manage your business disputes</p>
                  </div>
                </button>

                <button 
                  onClick={() => setRole("admin")}
                  className="group flex items-center p-4 border border-slate-200 bg-white rounded-xl hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 text-left"
                >
                  <div className="bg-indigo-50 group-hover:bg-indigo-100 p-3 rounded-full mr-4 transition-colors">
                    <Shield className="text-indigo-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">Admin Portal</h3>
                    <p className="text-sm text-slate-500">Review and resolve cases</p>
                  </div>
                </button>
              </div>
            </div>
          ) : role === 'admin' ? (
            /* Admin Login Form */
            <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-200 transition-all text-left relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500 rounded-full p-2.5 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-red-500 tracking-wider uppercase mb-0.5">Admin Access</h3>
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
                      className="w-full h-11 pl-10 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                      className="w-full h-11 pl-10 pr-10 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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

              <div className="mt-6 border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50">
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
                <button onClick={() => { setRole("merchant"); setEmail(""); setPassword(""); }} className="text-blue-600 font-medium hover:underline transition-colors focus:outline-none">
                  Merchant sign in
                </button>
              </div>
            </div>
          ) : (
            /* Merchant Login Form */
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 transition-all">
              
              <button 
                onClick={() => {
                  setRole(null);
                  setEmail("");
                  setPassword("");
                }}
                className="flex items-center text-sm text-slate-400 hover:text-slate-700 transition-colors mb-6 focus:outline-none"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to roles
              </button>

              <Logo />

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {mode === "signin" ? `Merchant Login` : `Create Merchant Account`}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Enter your credentials to access the portal.
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
                    placeholder="name@example.com"
                    required
                    className="w-full h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                    className="w-full h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors" 
                  disabled={busy}
                >
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                {mode === "signin" ? (
                  <span className="text-slate-500">
                    Don&apos;t have an account?{" "}
                    <button onClick={() => setMode("signup")} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors focus:outline-none">
                      Sign up
                    </button>
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Already have an account?{" "}
                    <button onClick={() => setMode("signin")} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors focus:outline-none">
                      Sign in
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
