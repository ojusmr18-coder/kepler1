import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#F4F7FC] flex flex-col items-center justify-center p-6 text-center antialiased">
      <div className="max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl mx-auto mb-4">
          🔍
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          The requested study module or revision resource could not be found.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all active:scale-95"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
