"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isGuest: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  guestUploadCount: number;
  showGuestLimitModal: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  canUploadCropImage: () => boolean;
  incrementGuestUpload: () => boolean;
  openGuestLimitModal: () => void;
  closeGuestLimitModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [guestUploadCount, setGuestUploadCount] = useState<number>(0);
  const [showGuestLimitModal, setShowGuestLimitModal] = useState<boolean>(false);

  // Load guest count on client mount from session storage
  useEffect(() => {
    try {
      const savedCount = sessionStorage.getItem("khetsaathi_guest_uploads");
      if (savedCount) {
        setGuestUploadCount(parseInt(savedCount, 10) || 0);
      }
    } catch (e) {}
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Farmer",
          photoURL: firebaseUser.photoURL,
          isGuest: false,
        });
      } else {
        // Check if session has active guest mode
        let isGuestSession = false;
        try {
          isGuestSession = sessionStorage.getItem("khetsaathi_guest_mode") === "true";
        } catch (e) {}

        if (isGuestSession) {
          setUser({
            uid: "guest_user_123",
            email: "guest@khetsaathi.ai",
            displayName: "Guest Farmer",
            isGuest: true,
          });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      sessionStorage.removeItem("khetsaathi_guest_mode");
    } catch (e) {}
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    try {
      sessionStorage.removeItem("khetsaathi_guest_mode");
    } catch (e) {}
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      setUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
        photoURL: res.user.photoURL,
        isGuest: false,
      });
    }
  };

  const loginWithGoogle = async () => {
    try {
      sessionStorage.removeItem("khetsaathi_guest_mode");
    } catch (e) {}
    await signInWithPopup(auth, googleProvider);
  };

  const loginAsGuest = () => {
    try {
      sessionStorage.setItem("khetsaathi_guest_mode", "true");
    } catch (e) {}
    setUser({
      uid: "guest_user_123",
      email: "guest@khetsaathi.ai",
      displayName: "Guest Farmer",
      isGuest: true,
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Signout error", e);
    }
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn("Storage clear error", e);
    }
    setUser(null);
    setGuestUploadCount(0);
    window.location.href = "/";
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Upload Logic: Guests allowed max 1 upload. Registered users get unlimited.
  const canUploadCropImage = (): boolean => {
    if (!user || user.isGuest) {
      return guestUploadCount < 1;
    }
    return true;
  };

  const incrementGuestUpload = (): boolean => {
    if (!user || user.isGuest) {
      if (guestUploadCount >= 1) {
        setShowGuestLimitModal(true);
        return false;
      }
      const newCount = guestUploadCount + 1;
      setGuestUploadCount(newCount);
      try {
        sessionStorage.setItem("khetsaathi_guest_uploads", newCount.toString());
      } catch (e) {}
      if (newCount >= 1) {
        setShowGuestLimitModal(true);
      }
      return true;
    }
    return true; // Registered users unlimited
  };

  const openGuestLimitModal = () => setShowGuestLimitModal(true);
  const closeGuestLimitModal = () => setShowGuestLimitModal(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest: user?.isGuest ?? true,
        guestUploadCount,
        showGuestLimitModal,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
        resetPassword,
        canUploadCropImage,
        incrementGuestUpload,
        openGuestLimitModal,
        closeGuestLimitModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
