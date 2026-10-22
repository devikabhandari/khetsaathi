"use client";

import React, { useState, Suspense } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/Navbar";
import { ConversationalDashboard } from "../../components/dashboard/ConversationalDashboard";
import { Footer } from "../../components/Footer";
import { GuestLimitModal } from "../../components/auth/GuestLimitModal";

export default function DashboardPage() {
  const [guestModalOpen, setGuestModalOpen] = useState<boolean>(false);

  return (
    <ProtectedRoute allowGuest={true}>
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-amber-400 selection:text-slate-950 animate-fadeIn">
        {/* 1. Translucent Sticky Navbar */}
        <Navbar onOpenGuestModal={() => setGuestModalOpen(true)} />

        {/* 2. Conversational Post-Login Dashboard inside Suspense */}
        <div className="flex-grow pt-4">
          <Suspense
            fallback={
              <div className="py-20 text-center text-xs text-amber-300 font-bold">
                Loading KhetSaathi AI Dashboard...
              </div>
            }
          >
            <ConversationalDashboard />
          </Suspense>
        </div>

        {/* 3. Footer */}
        <Footer />

        {/* Modals */}
        <GuestLimitModal />
      </main>
    </ProtectedRoute>
  );
}
