"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Sprout, Mail, RefreshCw, LogOut, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowGuest?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowGuest = true,
}) => {
  const { user, loading, logout, resendVerificationEmail, refreshUser } = useAuth();
  const router = useRouter();

  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.isGuest && !allowGuest) {
        router.replace("/login?redirect=restricted");
      }
    }
  }, [user, loading, allowGuest, router]);

  const handleResend = async () => {
    try {
      setResendStatus(null);
      await resendVerificationEmail();
      setResendStatus("Verification email sent! Please check your inbox or spam folder.");
    } catch (err: unknown) {
      setResendStatus(err instanceof Error ? err.message : "Failed to resend verification email.");
    }
  };

  const handleCheckVerification = async () => {
    setCheckingStatus(true);
    try {
      const isVerified = await refreshUser();
      if (!isVerified) {
        setResendStatus("Email is still not verified. Please click the link in your email first.");
      }
    } catch {
      setResendStatus("Error checking verification status.");
    } finally {
      setCheckingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-[1px] animate-spin">
          <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
            <Sprout className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
          Authenticating Farmer Account...
        </p>
      </div>
    );
  }

  // Not authenticated or guest not allowed
  if (!user || (user.isGuest && !allowGuest)) {
    return null;
  }

  // Prevent unverified email/password accounts from accessing the protected dashboard
  if (!user.isGuest && user.emailVerified === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-5 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-xl">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Email Verification Required</span>
            </div>
            <h2 className="text-xl font-black text-white">Verify Your Farmer Account</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              A verification link was sent to{" "}
              <strong className="text-emerald-400 font-bold">{user.email}</strong>. Please verify your email to unlock access to the KhetSaathi dashboard.
            </p>
          </div>

          {resendStatus && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{resendStatus}</span>
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleCheckVerification}
              disabled={checkingStatus}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${checkingStatus ? "animate-spin" : ""}`} />
              <span>{checkingStatus ? "Checking Status..." : "I've Verified My Email"}</span>
            </button>

            <button
              onClick={handleResend}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-slate-200 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Resend Verification Email</span>
            </button>

            <button
              onClick={() => logout()}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

