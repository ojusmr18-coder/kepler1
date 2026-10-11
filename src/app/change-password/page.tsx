"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { FloatingTaskbar } from "@/components/FloatingTaskbar";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Live validation helpers
  const isLengthValid = newPassword.length >= 6;
  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.auth.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response?.success) {
        setSuccessMessage("Password changed successfully! Your account credentials have been updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(response?.message || "Failed to update password. Please check your credentials.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-900/85 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Profile</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors"
            >
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 pt-10 flex-1">
        {/* Title */}
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 mb-3 text-[#2DD4BF]">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Change Password</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ensure your account is protected by using a secure password of at least 6 characters.
          </p>
        </div>

        {/* Feedback Banners */}
        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-xs sm:text-sm text-emerald-300 flex items-start gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{successMessage}</p>
              <p className="text-[11px] text-emerald-400/80 mt-1">
                You can continue using your updated password for all future sessions.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-xs sm:text-sm text-rose-300 flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Password Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 backdrop-blur-md space-y-5"
        >
          {/* Current Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="currentPassword"
              className="text-xs font-medium text-slate-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Current Password
              </span>
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter your current password"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2.5 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2.5 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2.5 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Validation Checklist */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px]">
              <span
                className={`h-2 w-2 rounded-full ${
                  isLengthValid ? "bg-[#2DD4BF] shadow-[0_0_6px_#2DD4BF]" : "bg-slate-600"
                }`}
              />
              <span className={isLengthValid ? "text-slate-200 font-medium" : "text-slate-400"}>
                At least 6 characters in length
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span
                className={`h-2 w-2 rounded-full ${
                  isMatchValid ? "bg-[#2DD4BF] shadow-[0_0_6px_#2DD4BF]" : "bg-slate-600"
                }`}
              />
              <span className={isMatchValid ? "text-slate-200 font-medium" : "text-slate-400"}>
                New password and confirm password match
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
            <Link
              href="/profile"
              className="w-full sm:w-auto text-center rounded-xl border border-slate-700/80 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !currentPassword || !isLengthValid || !isMatchValid}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/50 bg-[#0D9488] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#14B8A6] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Updating Password..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </main>

      {/* Floating Bottom Taskbar */}
      <FloatingTaskbar />
    </div>
  );
}
