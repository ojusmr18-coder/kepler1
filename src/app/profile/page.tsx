"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  School,
  Target,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { FloatingTaskbar } from "@/components/FloatingTaskbar";

interface ProfileFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  school: string;
  targetExam: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<ProfileFormData>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("current_student");
      if (stored) {
        try {
          const p = JSON.parse(stored);
          return {
            id: p.id || "1",
            name: p.name || "Ojus",
            email: p.email || "ojus@kepler.edu",
            phone: p.phone || "+91 98765 43210",
            grade: p.grade || "Grade 10",
            school: p.school || "Kepler International Academy",
            targetExam: p.targetExam || "CBSE Class 10 Board Exam",
          };
        } catch {
          // ignore
        }
      }
    }
    return {
      id: "1",
      name: "Ojus",
      email: "ojus@kepler.edu",
      phone: "+91 98765 43210",
      grade: "Grade 10",
      school: "Kepler International Academy",
      targetExam: "CBSE Class 10 Board Exam",
    };
  });

  // Fetch initial profile data on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        setIsLoading(true);
        const profile = await apiClient.auth.getProfile();
        if (isMounted && profile) {
          setFormData({
            id: profile.id || "1",
            name: profile.name || "Ojus",
            email: profile.email || "ojus@kepler.edu",
            phone: profile.phone || "+91 98765 43210",
            grade: profile.grade || "Grade 10",
            school: profile.school || "Kepler International Academy",
            targetExam: profile.targetExam || "CBSE Class 10 Board Exam",
          });
        }
      } catch (err: unknown) {
        console.error("Failed to load profile:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await apiClient.auth.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        grade: formData.grade,
        school: formData.school,
        targetExam: formData.targetExam,
      });

      if (response?.success) {
        setSuccessMessage("Profile updated successfully!");
        if (response.student) {
          const updated = response.student;
          setFormData((prev) => ({
            ...prev,
            name: updated.name || prev.name,
            email: updated.email || prev.email,
            phone: updated.phone || prev.phone,
            grade: updated.grade || prev.grade,
            school: updated.school || prev.school,
            targetExam: updated.targetExam || prev.targetExam,
          }));
        }
      } else {
        setErrorMessage(response?.message || "Failed to update profile. Please try again.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-900/85 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/change-password"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors"
            >
              <KeyRound className="h-3.5 w-3.5 text-slate-400" />
              <span>Change Password</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-8 flex-1">
        {/* Page Title & Context */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <User className="h-6 w-6 text-[#2DD4BF]" />
            Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            View and manage your academic profile, contact details, and board examination target.
          </p>
        </div>

        {/* Feedback Banners */}
        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-xs sm:text-sm text-emerald-300 flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-xs sm:text-sm text-rose-300 flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-[#2DD4BF]" />
            <p className="mt-3 text-xs text-slate-400 font-medium">Loading profile details...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Profile Avatar with Status Dot */}
              <div className="relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 text-2xl font-bold text-slate-200 shadow-inner">
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "AC"}
                </div>
                <span
                  title="Active Session"
                  className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#2DD4BF] ring-2 ring-slate-900 shadow-[0_0_8px_#2DD4BF]"
                />
              </div>

              {/* Student Identity Highlights */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h2 className="text-xl font-semibold text-white">{formData.name}</h2>
                  <span className="inline-flex items-center justify-center rounded-full bg-slate-800 border border-slate-700/80 px-2.5 py-0.5 text-[11px] font-mono text-slate-300 self-center sm:self-auto">
                    ID: {formData.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  {formData.email}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 text-[11px] text-slate-300">
                    <GraduationCap className="h-3 w-3 text-[#2DD4BF]" />
                    {formData.grade}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 text-[11px] text-slate-300">
                    <Target className="h-3 w-3 text-amber-400" />
                    {formData.targetExam}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/60 border border-emerald-700/40 px-2 py-0.5 text-[11px] text-emerald-300">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    Role: Student
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Profile Form */}
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 backdrop-blur-md space-y-6">
              <div className="border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-semibold text-slate-200">Personal & Academic Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your contact information and enrolled school details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
                  />
                </div>

                {/* Grade / Class */}
                <div className="space-y-1.5">
                  <label htmlFor="grade" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                    Grade / Class
                  </label>
                  <input
                    id="grade"
                    name="grade"
                    type="text"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
                  />
                </div>

                {/* School Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="school" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <School className="h-3.5 w-3.5 text-slate-400" />
                    School / Institution
                  </label>
                  <input
                    id="school"
                    name="school"
                    type="text"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
                  />
                </div>

                {/* Target Exam */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="targetExam" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-slate-400" />
                    Target Examination
                  </label>
                  <input
                    id="targetExam"
                    name="targetExam"
                    type="text"
                    value={formData.targetExam}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="font-mono text-slate-500">Student ID is managed by institution.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/dashboard"
                    className="flex-1 sm:flex-none text-center rounded-xl border border-slate-700/80 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/50 bg-[#0D9488] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#14B8A6] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Persistent Bottom Floating Navigation */}
      <FloatingTaskbar />
    </div>
  );
}
