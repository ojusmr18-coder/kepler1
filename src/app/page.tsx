"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SignInPage } from "@/components/SignInPage";
import { IntroTransition } from "@/components/IntroTransition";
import { ClassroomDashboard } from "@/components/ClassroomDashboard";
import { StudentProfile } from "@/types/api";

export default function Home() {
  const router = useRouter();
  const [currentView, setCurrentView] = React.useState<"signin" | "intro" | "dashboard">("signin");
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const [isCrossfadingIntro, setIsCrossfadingIntro] = React.useState(false);
  const [currentStudent, setCurrentStudent] = React.useState<StudentProfile | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("current_student");
      if (stored) {
        try {
          setCurrentStudent(JSON.parse(stored));
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  const handleSignIn = (role?: "student" | "instructor" | "admin", student?: StudentProfile) => {
    if (student) {
      setCurrentStudent(student);
      if (typeof window !== "undefined") {
        localStorage.setItem("current_student", JSON.stringify(student));
      }
    }
    if (role === "instructor" || role === "admin") {
      // Direct redirect to Teacher Admin Portal - bypass student video intro and student dashboard
      router.push("/teacher");
      return;
    }
    // Student: proceed with cinematic intro transition
    handleStartTransition();
  };

  const handleStartTransition = () => {
    // 1. Immediately mount intro video behind login form for a seamless crossfade
    setIsCrossfadingIntro(true);
    // 2. Trigger smooth 0.75s opacity fade-out on the login form
    setIsFadingOut(true);

    // 3. Cleanly transition after 750ms: unmount sign-in and preserve intro
    setTimeout(() => {
      setCurrentView("intro");
      setIsFadingOut(false);
      setIsCrossfadingIntro(false);
    }, 750);
  };

  const handleTransitionComplete = () => {
    setCurrentView("dashboard");
    router.push("/dashboard");
  };

  const handleSignOut = () => {
    setCurrentView("signin");
  };

  return (
    <main className={`min-h-screen w-full relative bg-[#0F172A] ${currentView === "dashboard" ? "overflow-x-hidden overflow-y-auto" : "overflow-hidden"}`}>
      {/* 1. Cinematic Intro Transition Overlay (Mounted during active intro or during login crossfade) */}
      {(currentView === "intro" || isCrossfadingIntro) && (
        <div className={`fixed inset-0 z-10 transition-opacity duration-700 ease-out ${isCrossfadingIntro ? "animate-in fade-in duration-700" : ""}`}>
          <IntroTransition
            onComplete={handleTransitionComplete}
            redirectTo="/dashboard"
          />
        </div>
      )}

      {/* 2. Sign In Page View with Crossfade transition support (0.7s smooth fade out) */}
      {currentView === "signin" && (
        <div className={`relative z-20 w-full min-h-screen transition-opacity duration-700 ease-in-out ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <SignInPage
            onSignIn={handleSignIn}
            isFadingOut={isFadingOut}
          />
        </div>
      )}

      {/* 3. Main Classroom Dashboard View (After Login) */}
      {currentView === "dashboard" && (
        <ClassroomDashboard
          studentName={currentStudent?.name || "Ojus"}
          studentId={currentStudent?.id || "1"}
          onSignOut={handleSignOut}
          onOpenDoubtSolver={() => router.push("/ask")}
        />
      )}
    </main>
  );
}
