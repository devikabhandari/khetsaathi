"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Sprout } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowGuest?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowGuest = true,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.isGuest && !allowGuest) {
        router.push("/login?redirect=restricted");
      }
    }
  }, [user, loading, allowGuest, router]);

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

  if (!user || (user.isGuest && !allowGuest)) {
    return null;
  }

  return <>{children}</>;
};
