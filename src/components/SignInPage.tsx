"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


function SparkleStar({
  className,
  glowColor = "rgba(254, 240, 138, 0.8)",
}: {
  className?: string;
  glowColor?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none animate-sparkle ${className}`}
      style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
      </svg>
    </div>
  );
}

function PastelClouds() {
  return (
    <div className="absolute -bottom-1 inset-x-0 w-full h-[180px] lg:h-[220px] pointer-events-none overflow-hidden z-0">
      <svg
        viewBox="0 0 1200 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cloudWarm1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1E2" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FED7AA" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="cloudWarm2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FFF3E6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FED7AA" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="cloudLavender" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFF5EB" stopOpacity="0.85" />
          </linearGradient>
          <filter id="softGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="150" cy="280" r="190" fill="url(#cloudLavender)" filter="url(#softGlow)" />
        <circle cx="520" cy="270" r="210" fill="url(#cloudWarm1)" filter="url(#softGlow)" />
        <circle cx="950" cy="260" r="230" fill="url(#cloudWarm1)" filter="url(#softGlow)" />

        <circle cx="340" cy="290" r="180" fill="url(#cloudWarm2)" />
        <circle cx="750" cy="300" r="190" fill="url(#cloudWarm2)" />
        <circle cx="1120" cy="290" r="170" fill="url(#cloudWarm2)" />
        <circle cx="0" cy="320" r="160" fill="url(#cloudWarm2)" />

        <path
          d="M0 360L0 290C50 250 140 250 200 280C270 230 400 230 470 270C550 220 700 220 780 260C860 210 1020 210 1100 260C1150 240 1190 260 1200 280V360H0Z"
          fill="url(#cloudWarm2)"
        />
      </svg>
    </div>
  );
}

import { apiClient } from "@/services/apiClient";
import { StudentProfile } from "@/types/api";

interface SignInPageProps {
  onSignIn: (role?: "student" | "instructor" | "admin", student?: StudentProfile) => void;
  isFadingOut?: boolean;
}

export function SignInPage({ onSignIn, isFadingOut = false }: SignInPageProps) {
  const [loginRole, setLoginRole] = React.useState<"student" | "teacher">("student");
  const [studentId, setStudentId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFadingOut || isLoading) return;
    setErrorMessage(null);
    setIsLoading(true);

    const credentialVal = studentId.trim();
    // Default password to user ID (credentialVal) if omitted
    const effectivePassword = password.trim() || credentialVal;
    const isTeacherCred =
      loginRole === "teacher" ||
      credentialVal.toUpperCase().startsWith("TEACH") ||
      credentialVal.toUpperCase().startsWith("T-") ||
      credentialVal.toLowerCase().includes("teacher");

    try {
      const response = await apiClient.auth.login({
        email: credentialVal,
        password: effectivePassword,
      });

      if (response.success) {
        const detectedRole =
          response.student?.role === "instructor" ||
          response.student?.role === "admin" ||
          isTeacherCred
            ? "instructor"
            : "student";
        onSignIn(detectedRole, response.student);
      } else {
        setErrorMessage(response.error || "Invalid credentials");
      }
    } catch (err: unknown) {
      console.warn("Auth API warning:", err);
      // Offline fallback: differentiate 1 -> Ojus, sneha reddy -> Sneha Reddy
      let fallbackStudent: StudentProfile = {
        id: "1",
        name: "Ojus",
        email: "ojus@kepler.edu",
        role: "student",
        grade: "Grade 10",
        school: "Kepler International Academy",
        targetExam: "CBSE Class 10 Board Exam",
      };
      if (
        credentialVal.toLowerCase().includes("sneha") ||
        credentialVal === "2" ||
        credentialVal.toLowerCase().includes("reddy")
      ) {
        fallbackStudent = {
          id: "2",
          name: "Sneha Reddy",
          email: "sneha.reddy@kepler.edu",
          role: "student",
          grade: "Grade 10",
          school: "Kepler International Academy",
          targetExam: "CBSE Class 10 Board Exam",
        };
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("current_student", JSON.stringify(fallbackStudent));
      }
      onSignIn(isTeacherCred ? "instructor" : "student", fallbackStudent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full lg:h-screen relative overflow-x-hidden bg-white select-none transition-opacity duration-700 ease-in-out grid grid-cols-1 lg:grid-cols-2 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* =========================================================================
          LEFT COLUMN: The Centered, Beautiful Login Form (50% on Desktop)
          ========================================================================= */}
      <section className="relative flex flex-col justify-center px-8 sm:px-14 md:px-16 lg:px-20 xl:px-24 py-10 sm:py-14 bg-white z-10 min-h-screen lg:min-h-full lg:h-full overflow-y-auto">
        <div className="w-full max-w-[460px] sm:max-w-[490px] lg:max-w-[520px] mx-auto my-auto py-8">
            
          {/* Kepler Platform Logo Badge */}
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base shadow-xs">
              K
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-slate-800">
              Kepler Learning
            </span>
          </div>

          {/* Portal Role Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => setLoginRole("student")}
              className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                loginRole === "student"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>🎓</span>
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginRole("teacher")}
              className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                loginRole === "teacher"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>👩‍🏫</span>
              <span>Teacher Admin Portal</span>
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-slate-900 leading-tight">
                {loginRole === "teacher" ? "Teacher Portal" : "Student Sign In"}
              </h1>
              {loginRole === "teacher" && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
              {loginRole === "teacher"
                ? "Enter your educator credentials to access student tracking, analytics, PDF database, and rankings."
                : "Enter your student credentials to access your classroom dashboard and study modules."}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Student ID / Teacher ID */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="studentId"
                  className="block text-sm sm:text-[15px] font-semibold text-slate-700"
                >
                  {loginRole === "teacher" ? "Teacher ID / Email" : "Student ID / Name"}
                </label>
                {loginRole === "student" && (
                  <span className="text-[11px] font-medium text-slate-500">
                    Use <strong className="text-slate-800">1</strong> or <strong className="text-slate-800">sneha reddy</strong>
                  </span>
                )}
              </div>
              <Input
                id="studentId"
                name="studentId"
                type="text"
                placeholder={
                  loginRole === "teacher"
                    ? "TEACH-101"
                    : 'Type "1" for Ojus or "sneha reddy"'
                }
                value={studentId}
                onChange={(e) => {
                  const val = e.target.value;
                  setStudentId(val);
                  if (val.toUpperCase().startsWith("TEACH") || val.toUpperCase().startsWith("T-")) {
                    setLoginRole("teacher");
                  }
                }}
                autoComplete="username"
                required
                className="h-12 sm:h-14 text-base px-4 sm:px-5 rounded-2xl bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-slate-100 focus-visible:border-slate-400 transition-all shadow-2xs"
              />

              {/* Quick Login Chips for Ojus and Sneha Reddy */}
              {loginRole === "student" && (
                <div className="flex items-center flex-wrap gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    Quick Select:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentId("1");
                      setPassword("1");
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      studentId.trim() === "1" || studentId.toLowerCase().includes("ojus")
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>🎓</span>
                    <span>1: Ojus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentId("sneha reddy");
                      setPassword("2");
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      studentId.trim().toLowerCase() === "sneha reddy" || studentId.toLowerCase().includes("sneha")
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>👩‍🎓</span>
                    <span>Sneha Reddy</span>
                  </button>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm sm:text-[15px] font-semibold text-slate-700"
                >
                  Password {loginRole === "student" && <span className="text-xs font-normal text-slate-400">(same as User ID)</span>}
                </label>
                <a
                  href="#forgot-password"
                  className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={loginRole === "teacher" ? "••••••••" : "•••••••• (same as User ID, e.g. 1)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-12 sm:h-14 text-base px-4 sm:px-5 pr-13 rounded-2xl bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-slate-100 focus-visible:border-slate-400 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1.5 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.99] cursor-pointer"
              >
                {isLoading
                  ? "Signing In..."
                  : loginRole === "teacher"
                  ? "Sign In to Teacher Portal"
                  : "Sign In as Student"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* =========================================================================
          RIGHT COLUMN: The Astronaut Illustration Stage (50% on Desktop)
          ========================================================================= */}
      <section className="relative flex flex-col items-center justify-between p-8 sm:p-12 lg:p-16 xl:p-20 bg-gradient-to-b from-[#EBF2FC] via-[#F4F7FD] to-[#FEF5E7] overflow-hidden min-h-[460px] lg:h-full">
        
        {/* Seamless Soft Edge Blending Gradient between form and illustration */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 sm:w-44 lg:w-56 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-10" />
        <div className="lg:hidden absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/50 to-transparent pointer-events-none z-10" />

        {/* Decorative Sparkle Stars */}
        <SparkleStar
          className="top-12 left-20 w-4 h-4 text-[#FDE047]"
          glowColor="rgba(253, 224, 71, 0.9)"
        />
        <SparkleStar
          className="top-20 right-16 w-3.5 h-3.5 text-white"
          glowColor="rgba(255, 255, 255, 0.9)"
        />
        <SparkleStar
          className="bottom-36 left-16 w-3 h-3 text-[#FED7AA]"
          glowColor="rgba(254, 215, 170, 0.8)"
        />
        <SparkleStar
          className="bottom-44 right-16 w-3 h-3 text-[#E9D5FF]"
          glowColor="rgba(233, 213, 255, 0.8)"
        />

        {/* Centered Floating Astronaut Illustration (Fully Contained & Not Cut Off) */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6 w-full">
          {/* Ambient soft glow ring behind astronaut */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 lg:w-[440px] lg:h-[440px] rounded-full bg-blue-200/50 blur-3xl pointer-events-none" />

          <img
            src="/astronaut.png"
            alt="Floating 3D Astronaut"
            className="relative z-10 w-auto h-[280px] sm:h-[350px] lg:h-[420px] xl:h-[480px] max-w-[90%] object-contain select-none animate-float drop-shadow-[0_24px_48px_rgba(30,58,138,0.20)] pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Bottom Pastel Clouds Decoration */}
        <PastelClouds />

        {/* Kepler Welcoming Quote */}
        <div className="relative z-10 text-center max-w-md mx-auto pt-6 pb-2">
          <blockquote className="text-base sm:text-lg font-medium text-slate-800 tracking-tight leading-snug">
            &ldquo;Welcome back. A new chapter awaits.&rdquo;
          </blockquote>
          <p className="mt-1.5 text-xs text-slate-500 font-semibold tracking-wide uppercase">
            &mdash; Kepler Learning
          </p>
        </div>
      </section>
    </div>
  );
}
