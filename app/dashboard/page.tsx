"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/Navbar";
import { ConversationalDashboard } from "../../components/dashboard/ConversationalDashboard";
import { Footer } from "../../components/Footer";
import { GuestLimitModal } from "../../components/auth/GuestLimitModal";
import { LocationPermissionModal } from "../../components/LocationPermissionModal";
import { useLocationWeather } from "../../hooks/useLocationWeather";

export default function DashboardPage() {
  const [guestModalOpen, setGuestModalOpen] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  const {
    permissionState,
    loading,
    requestLocation,
    updateLocationManually,
  } = useLocationWeather();

  // Prompt location access on first visit to dashboard if idle
  useEffect(() => {
    const hasPrompted = sessionStorage.getItem("khetsaathi_location_prompted");
    if (!hasPrompted) {
      setShowLocationModal(true);
      sessionStorage.setItem("khetsaathi_location_prompted", "true");
    }
  }, []);

  return (
    <ProtectedRoute allowGuest={true}>
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-amber-400 selection:text-slate-950 animate-fadeIn">
        {/* 1. Translucent Sticky Navbar */}
        <Navbar onOpenGuestModal={() => setGuestModalOpen(true)} />

        {/* 2. Conversational Post-Login Dashboard inside Suspense */}
        <div className="flex-grow pt-4">
          <Suspense fallback={
            <div className="py-20 text-center text-xs text-amber-300 font-bold">
              Loading KhetSaathi AI Dashboard...
            </div>
          }>
            <ConversationalDashboard />
          </Suspense>
        </div>

        {/* 3. Footer */}
        <Footer />

        {/* Modals */}
        <GuestLimitModal />

        <LocationPermissionModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onDetectLocation={requestLocation}
          onManualSelect={updateLocationManually}
          permissionState={permissionState}
          loading={loading}
        />
      </main>
    </ProtectedRoute>
  );
}
