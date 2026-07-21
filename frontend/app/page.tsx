"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Store } from "lucide-react";
import Link from "next/link";

// Mode defines whether the user is signing in or signing up
type Mode = "signin" | "signup";

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
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

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
      
      toast.success(mode === "signin" ? `Logged in as Merchant (Bypassed)` : "Account created! (Bypassed)");
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative">
        <div className="absolute top-8 right-8">
            <Link href="/admin/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Admin Login →
            </Link>
        </div>
        <div className="w-full max-w-md">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 transition-all">
              <Logo />

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {mode === "signin" ? `Merchant Login` : `Create Merchant Account`}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Enter your credentials to access the merchant portal.
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
            </div>
        </div>
      </div>
    </div>
  );
}
