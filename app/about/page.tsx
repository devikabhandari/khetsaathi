"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { AboutPageContent } from "../../components/AboutPageContent";
import { Footer } from "../../components/Footer";
import { GuestModal } from "../../components/GuestModal";
import { GuestLimitModal } from "../../components/auth/GuestLimitModal";

export default function AboutPage() {
  const [guestModalOpen, setGuestModalOpen] = useState<boolean>(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-amber-400 selection:text-slate-950 animate-fadeIn">
      {/* 1. Translucent Sticky Navbar */}
      <Navbar onOpenGuestModal={() => setGuestModalOpen(true)} />

      {/* 2. Professional About Content */}
      <div className="flex-grow">
        <AboutPageContent />
      </div>

      {/* 3. Footer */}
      <Footer />

      {/* Modals */}
      <GuestModal isOpen={guestModalOpen} onClose={() => setGuestModalOpen(false)} />
      <GuestLimitModal />
    </main>
  );
}
