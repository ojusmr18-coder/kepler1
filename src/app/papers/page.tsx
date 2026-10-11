import { Metadata } from "next";
import { Suspense } from "react";
import { PapersClientView } from "./PapersClientView";

export const metadata: Metadata = {
  title: "Previous Papers & Sample Papers | Kepler Learning Platform",
  description: "Repository of official sample question papers, marking rubrics, and previous year board exam archives.",
};

export default function PapersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F4F7FC] flex items-center justify-center text-slate-500 text-sm">
          Loading papers repository...
        </div>
      }
    >
      <PapersClientView />
    </Suspense>
  );
}
