import { Metadata } from "next";
import { Suspense } from "react";
import { CustomPracticeSelection } from "@/components/CustomPracticeSelection";

export const metadata: Metadata = {
  title: "Custom Practice Test Selection | Kepler Learning",
  description: "Select up to 9 chapters for custom practice tests across Class 10 subjects.",
};

export default function CustomPracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#F5F8FA] flex items-center justify-center text-slate-500 text-sm">
          Loading test selection...
        </div>
      }
    >
      <CustomPracticeSelection />
    </Suspense>
  );
}
