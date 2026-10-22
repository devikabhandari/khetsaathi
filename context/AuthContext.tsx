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
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, assertFirebaseConfigured } from "../lib/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isGuest: boolean;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  guestUploadCount: number;
  showGuestLimitModal: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<User | null>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
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

  // Listen to Firebase auth state as single source of truth
  useEffect(() => {
    if (!auth) {
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
          emailVerified: true,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Farmer",
          photoURL: firebaseUser.photoURL,
          isGuest: false,
          emailVerified: firebaseUser.emailVerified,
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
            emailVerified: true,
          });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<User | null> => {
    assertFirebaseConfigured();
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    try {
      sessionStorage.removeItem("khetsaathi_guest_mode");
    } catch (e) {}
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  };

  const signUpWithEmail = async (name: string, email: string, pass: string): Promise<User | null> => {
    assertFirebaseConfigured();
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    try {
      sessionStorage.removeItem("khetsaathi_guest_mode");
    } catch (e) {}
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      // Send verification email upon registration
      await sendEmailVerification(res.user);
      setUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
        photoURL: res.user.photoURL,
        isGuest: false,
        emailVerified: false,
      });
    }
    return res.user;
  };

  const loginWithGoogle = async () => {
    assertFirebaseConfigured();
    if (!auth || !googleProvider) {
      throw new Error("Firebase Auth or Google Provider is not initialized.");
    }
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
      emailVerified: true,
    });
  };

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn("Signout error", e);
    }
    try {
      sessionStorage.removeItem("khetsaathi_guest_mode");
      sessionStorage.removeItem("khetsaathi_guest_uploads");
      sessionStorage.removeItem("khetsaathi_user_location");
      sessionStorage.removeItem("khetsaathi_location_prompted");
      sessionStorage.clear();
      localStorage.clear();
    } catch (e) {
      console.warn("Storage clear error", e);
    }
    setUser(null);
    setGuestUploadCount(0);
    window.location.href = "/";
  };

  const resetPassword = async (email: string) => {
    assertFirebaseConfigured();
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerificationEmail = async () => {
    assertFirebaseConfigured();
    if (!auth || !auth.currentUser) {
      throw new Error("No authenticated user found. Please log in first.");
    }
    await sendEmailVerification(auth.currentUser);
  };

  const refreshUser = async (): Promise<boolean> => {
    if (!auth || !auth.currentUser) return false;
    await auth.currentUser.reload();
    const updated = auth.currentUser;
    setUser({
      uid: updated.uid,
      email: updated.email,
      displayName: updated.displayName || updated.email?.split("@")[0] || "Farmer",
      photoURL: updated.photoURL,
      isGuest: false,
      emailVerified: updated.emailVerified,
    });
    return updated.emailVerified;
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
        resendVerificationEmail,
        refreshUser,
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

