import { Metadata } from "next";
import { Suspense } from "react";
import { TeacherAdminPortal } from "./TeacherAdminPortal";

export const metadata: Metadata = {
  title: "Teacher Admin Portal | Kepler Learning Platform",
  description: "Educator tracking console, student progress monitoring, PDF materials database, ranking engine, and class analytics.",
};

export default function TeacherPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center text-slate-400 text-sm">
          Loading Teacher Admin Portal...
        </div>
      }
    >
      <TeacherAdminPortal />
    </Suspense>
  );
}
