"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, Lock, User, TrendingUp } from "lucide-react";
import Link from "next/link";

const PERSONAS = [
  { id: "investor", label: "Mutual Fund Investor", desc: "Stocks, SIPs, ETFs" },
  { id: "founder", label: "Startup Founder", desc: "Funding, competition, growth" },
  { id: "student", label: "Business Student", desc: "Explainers, fundamentals" },
  { id: "analyst", label: "Market Analyst", desc: "Earnings, technicals, data" },
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"account" | "persona">("account");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState("investor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleAccountStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setStep("persona");
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, persona },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-14">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm">
          <div className="text-5xl mb-6">📬</div>
          <h2 className="font-display text-2xl font-bold text-pearl mb-3">Check your email</h2>
          <p className="text-pearl/50 text-sm leading-relaxed">
            We sent a confirmation link to <span className="text-gold">{email}</span>.
            Click it to activate your account, then come back to log in.
          </p>
          <Link href="/login" className="mt-6 inline-block text-gold text-sm hover:underline">
            Back to login →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14">
      <div className="absolute inset-0 bg-gradient-radial from-jade/5 via-transparent to-transparent" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={22} className="text-ink-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-pearl">
            {step === "account" ? "Create account" : "Pick your persona"}
          </h1>
          <p className="text-pearl/40 text-sm mt-1">
            {step === "account" ? "Free forever — no credit card" : "We'll personalize your news feed"}
          </p>
        </div>

        {step === "account" && (
          <>
            <form onSubmit={handleAccountStep} className="space-y-3">
              {error && <div className="glass bg-scarlet/10 border border-scarlet/20 rounded-xl px-4 py-3 text-scarlet text-sm">{error}</div>}
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pearl/30" />
                <input type="text" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required
                  className="w-full glass rounded-xl pl-9 pr-4 py-3 text-sm text-pearl/80 placeholder-pearl/30 focus:outline-none focus:ring-1 focus:ring-gold/40" />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pearl/30" />
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full glass rounded-xl pl-9 pr-4 py-3 text-sm text-pearl/80 placeholder-pearl/30 focus:outline-none focus:ring-1 focus:ring-gold/40" />
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pearl/30" />
                <input type="password" placeholder="Password (6+ characters)" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full glass rounded-xl pl-9 pr-4 py-3 text-sm text-pearl/80 placeholder-pearl/30 focus:outline-none focus:ring-1 focus:ring-gold/40" />
              </div>
              <button type="submit" className="w-full bg-gold text-ink-950 py-3 rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors">
                Continue →
              </button>
            </form>
          </>
        )}

        {step === "persona" && (
          <div className="space-y-3">
            {PERSONAS.map(({ id, label, desc }) => (
              <button key={id} onClick={() => setPersona(id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  persona === id ? "border-gold/40 bg-gold/5" : "glass border-transparent"
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-pearl/90 text-sm font-medium">{label}</div>
                    <div className="text-pearl/40 text-xs mt-0.5">{desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    persona === id ? "border-gold bg-gold" : "border-pearl/20"
                  }`}>
                    {persona === id && <div className="w-1.5 h-1.5 rounded-full bg-ink-950" />}
                  </div>
                </div>
              </button>
            ))}
            {error && <div className="glass bg-scarlet/10 border border-scarlet/20 rounded-xl px-4 py-3 text-scarlet text-sm">{error}</div>}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep("account")} className="flex-1 glass py-3 rounded-xl text-pearl/50 text-sm">
                ← Back
              </button>
              <button onClick={handleSignup} disabled={loading}
                className="flex-1 bg-gold text-ink-950 py-3 rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                Create Account
              </button>
            </div>
          </div>
        )}

        {step === "account" && (
          <p className="text-center text-pearl/40 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:underline">Sign in</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
