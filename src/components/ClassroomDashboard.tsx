"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  KeyRound,
  LogOut,
  ChevronDown
} from "lucide-react";
import { ScoreBoosterPreview } from "@/components/ScoreBoosterPreview";
import { YourTestsSection } from "@/components/YourTestsSection";
import { ScheduleSection } from "@/components/ScheduleSection";
import { apiClient } from "@/services/apiClient";

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  hint?: string;
}

export interface RevisionNotesData {
  summary: string;
  keyPoints: string[];
  formulas?: string[];
}

export interface WhiteboardTodo {
  id: string;
  text: string;
  completed: boolean;
  topicId?: string;
  topicTitle?: string;
  quizId?: string;
  flashcards?: FlashcardItem[];
  revisionNotes?: RevisionNotesData;
}

export interface WhiteboardReminder {
  id: string;
  text: string;
}

export interface WhiteboardExam {
  title: string;
  daysLeft: number;
}

export interface WhiteboardData {
  nextExam: WhiteboardExam;
  todos: WhiteboardTodo[];
  reminders: WhiteboardReminder[];
  scoreBoosterTag?: string;
}

// ============================================================================
// FAKE / INITIAL WHITEBOARD DATA
// (Structured cleanly to easily replace once dynamic AI data is connected)
// ============================================================================
export const INITIAL_WHITEBOARD_DATA: WhiteboardData = {
  nextExam: {
    title: "Physics Midterm",
    daysLeft: 4,
  },
  todos: [
    {
      id: "1",
      text: "Review Kepler's 3 Laws of Planetary Motion",
      completed: false,
      topicId: "kepler-laws",
      topicTitle: "Kepler's 3 Laws of Planetary Motion",
      quizId: "quiz-kepler-laws",
      flashcards: [
        {
          id: "fc_1",
          question: "What does Kepler's 1st Law (Law of Ellipses) state?",
          answer: "All planets move in elliptical orbits with the Sun located at one of the two foci.",
          hint: "Think about planetary orbits around the Sun."
        },
        {
          id: "fc_2",
          question: "What physical conservation law underpins Kepler's 2nd Law (Equal Areas)?",
          answer: "Conservation of Angular Momentum ($L = r \\times p = \\text{constant}$) under central gravitational force.",
          hint: "Areal velocity $\\frac{dA}{dt}$ is proportional to $\\frac{L}{2m}$."
        },
        {
          id: "fc_3",
          question: "What is Kepler's 3rd Law harmonic relation between orbital period $T$ and semi-major axis $a$?",
          answer: "$T^2 \\propto a^3$, or $T^2 = \\frac{4\\pi^2}{GM} a^3$. The square of the orbital period is proportional to the cube of the semi-major axis.",
          hint: "Compare time period with distance from the Sun: $T^2 / a^3 = \\text{constant}$."
        }
      ],
      revisionNotes: {
        summary: "Johannes Kepler established three empirical laws governing orbital motion, later derived rigorously by Newton using universal gravitation and calculus.",
        keyPoints: [
          "Law of Orbits: Orbit of a planet is an ellipse with the Sun at one focus (eccentricity $0 \\le e < 1$).",
          "Law of Areas: The line joining a planet to the Sun sweeps out equal areas in equal intervals of time ($\\frac{dA}{dt} = \\text{constant}$).",
          "Areal Velocity: $\\frac{dA}{dt} = \\frac{L}{2m}$. Since gravitational force is central (torque $\\tau = 0$), angular momentum $L$ is conserved.",
          "Law of Periods: The square of orbital period $T$ is directly proportional to the cube of the semi-major axis $a$ ($T^2 \\propto a^3$).",
          "Planetary speed is maximum at Perihelion (closest) and minimum at Aphelion (farthest): $v_{\\text{peri}} \\cdot r_{\\text{peri}} = v_{\\text{ap}} \\cdot r_{\\text{ap}}$."
        ],
        formulas: [
          "T^2 = \\frac{4\\pi^2}{GM} a^3",
          "\\frac{dA}{dt} = \\frac{L}{2m} = \\text{constant}",
          "v_{\\text{peri}} \\cdot r_{\\text{peri}} = v_{\\text{ap}} \\cdot r_{\\text{ap}}"
        ]
      }
    },
    {
      id: "2",
      text: "Complete Orbital Velocity Lab Simulation",
      completed: false,
      topicId: "orbital-velocity",
      topicTitle: "Orbital Velocity & Satellite Dynamics",
      quizId: "quiz-orbital-velocity",
      flashcards: [
        {
          id: "fc_4",
          question: "What is circular orbital velocity $v_o$ for a satellite orbiting mass $M$ at radius $r$?",
          answer: "$v_o = \\sqrt{\\frac{GM}{r}}$. Near Earth's surface ($r \\approx R$), $v_o \\approx 7.92\\text{ km/s}$.",
          hint: "Balance gravitational pull $\\frac{GMm}{r^2}$ with centripetal force $\\frac{mv^2}{r}$."
        },
        {
          id: "fc_5",
          question: "Does the orbital velocity of a satellite depend on its own mass $m$?",
          answer: "No. Orbital velocity depends solely on central mass $M$ and orbital radius $r$, completely independent of the satellite's mass $m$.",
          hint: "The satellite's mass $m$ cancels out in the balance of forces."
        },
        {
          id: "fc_6",
          question: "What is the relationship between orbital speed $v_o$ and escape velocity $v_e$ at the same radius?",
          answer: "$v_e = \\sqrt{2} \\cdot v_o \\approx 1.414 \\cdot v_o$. Escape velocity is 41.4% greater than circular orbital velocity.",
          hint: "Consider the kinetic energy needed to escape to infinity: $\\frac{1}{2}mv_e^2 = \\frac{GMm}{r}$."
        }
      ],
      revisionNotes: {
        summary: "Satellites stay in orbit through perpetual free fall where the inward gravitational acceleration exactly supplies the centripetal acceleration needed for curved trajectory.",
        keyPoints: [
          "Centripetal balance: $\\frac{GMm}{r^2} = \\frac{m v_o^2}{r} \\implies v_o = \\sqrt{\\frac{GM}{r}}$.",
          "Orbital time period: $T = \\frac{2\\pi r}{v_o} = 2\\pi \\sqrt{\\frac{r^3}{GM}}$.",
          "Binding Energy: Kinetic energy $K = \\frac{GMm}{2r}$; Potential energy $U = -\\frac{GMm}{r}$; Total mechanical energy $E = -\\frac{GMm}{2r} = -K$.",
          "Geostationary Orbits: Period is 24 hours (synchronous with Earth's rotation), circular orbit in equatorial plane at height $\\sim 35,786\\text{ km}$."
        ],
        formulas: [
          "v_o = \\sqrt{\\frac{GM}{r}}",
          "T = 2\\pi \\sqrt{\\frac{r^3}{GM}}",
          "E_{\\text{total}} = -\\frac{GMm}{2r} = -K = \\frac{U}{2}",
          "v_e = \\sqrt{2}\\,v_o"
        ]
      }
    },
    {
      id: "3",
      text: "Solve 10 Practice Questions on Gravity",
      completed: false,
      topicId: "gravitational-practice",
      topicTitle: "Universal Gravitation & Field Theory",
      quizId: "quiz-gravitational-practice",
      flashcards: [
        {
          id: "fc_7",
          question: "How does acceleration due to gravity vary at altitude $h$ above Earth's surface ($h \\ll R$)?",
          answer: "$g_h \\approx g\\left(1 - \\frac{2h}{R}\\right)$. Acceleration due to gravity decreases linearly for small altitudes.",
          hint: "Use binomial expansion of $g / (1 + h/R)^2$."
        },
        {
          id: "fc_8",
          question: "How does acceleration due to gravity vary at depth $d$ inside Earth?",
          answer: "$g_d = g\\left(1 - \\frac{d}{R}\\right)$. Gravity decreases linearly from surface value $g$ to zero at Earth's center.",
          hint: "Only the inner spherical shell of radius $(R - d)$ exerts gravitational force."
        },
        {
          id: "fc_9",
          question: "What is the gravitational field inside a uniform hollow spherical shell?",
          answer: "The gravitational field is zero everywhere inside the cavity ($E = 0$), and gravitational potential is constant: $V = -\\frac{GM}{R}$.",
          hint: "Recall Newton's Shell Theorem."
        }
      ],
      revisionNotes: {
        summary: "Newton's universal law of gravitation establishes the inverse-square force law between point masses, providing the foundation for planetary dynamics and celestial mechanics.",
        keyPoints: [
          "Newton's Gravitational Law: $F = G \\frac{m_1 m_2}{r^2}$, where $G = 6.674 \\times 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$.",
          "Gravitational Potential Energy: $U(r) = -\\frac{GMm}{r}$ (reference zero taken at $r \\to \\infty$).",
          "Escape Velocity: Minimum speed to escape gravitational bound well: $v_e = \\sqrt{\\frac{2GM}{R}} \\approx 11.2\\text{ km/s}$ for Earth.",
          "Weightlessness in Orbit: Astronauts feel weightless not because gravity is zero, but because both spacecraft and astronauts are in simultaneous free fall."
        ],
        formulas: [
          "F = G \\frac{m_1 m_2}{r^2}",
          "g' = g\\left(1 - \\frac{2h}{R}\\right) \\quad (h \\ll R)",
          "g_d = g\\left(1 - \\frac{d}{R}\\right)",
          "v_e = \\sqrt{\\frac{2GM}{R}} \\approx 11.2\\text{ km/s}"
        ]
      }
    }
  ],
  reminders: [
    { id: "r1", text: "Review session: Friday 2:00 PM in Room 304" },
    { id: "r2", text: "Allie AI Tutor available 24/7 for doubt clearance" },
  ],
  scoreBoosterTag: "Target: 95% Score Boost",
};

interface ClassroomDashboardProps {
  studentName?: string;
  studentId?: string;
  whiteboardData?: Partial<WhiteboardData>;
  onSignOut?: () => void;
  onOpenDoubtSolver?: () => void;
}

export function ClassroomDashboard({
  studentName = "Ojus",
  studentId = "1",
  whiteboardData,
  onSignOut,
  onOpenDoubtSolver,
}: ClassroomDashboardProps) {
  const router = useRouter();
  const [effectiveName, setEffectiveName] = React.useState(studentName);
  const [effectiveId, setEffectiveId] = React.useState(studentId);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  // Sync state with incoming props
  React.useEffect(() => {
    setEffectiveName(studentName);
    setEffectiveId(studentId);
  }, [studentName, studentId]);

  // Read cached student if props were omitted or default
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("current_student");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setEffectiveName(parsed.name);
          if (parsed.id) setEffectiveId(parsed.id);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Close dropdown on outside click or escape key
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("current_student");
    }
    try {
      await apiClient.auth.logout();
    } catch {
      // Continue logout even if network error
    }
    if (onSignOut) {
      onSignOut();
    } else {
      router.push("/");
    }
  };

  // Whiteboard data state (initialized with prop or fallback to initial data)
  const [boardData, setBoardData] = React.useState<WhiteboardData>(() => ({
    nextExam: {
      ...INITIAL_WHITEBOARD_DATA.nextExam,
      ...(whiteboardData?.nextExam || {}),
    },
    todos: whiteboardData?.todos ?? INITIAL_WHITEBOARD_DATA.todos,
    reminders: whiteboardData?.reminders ?? INITIAL_WHITEBOARD_DATA.reminders,
    scoreBoosterTag: whiteboardData?.scoreBoosterTag ?? INITIAL_WHITEBOARD_DATA.scoreBoosterTag,
  }));

  // Fetch todos from backend API and sync with local completions on mount
  React.useEffect(() => {
    let isMounted = true;
    async function fetchTodos() {
      try {
        const response = await apiClient.classroom.getTodos();
        if (isMounted && response?.todos) {
          const merged = response.todos.map((todo) => {
            const isDoneLocally =
              typeof window !== "undefined" &&
              (localStorage.getItem(`whiteboard_todo_completed_${todo.id}`) === "true" ||
                localStorage.getItem(`whiteboard_todo_completed_topic_${todo.topicId}`) === "true");
            return {
              ...todo,
              completed: todo.completed || isDoneLocally,
            };
          });
          setBoardData((prev) => ({
            ...prev,
            todos: merged,
          }));
        }
      } catch (err) {
        console.info("Using local blackboard tasks fallback:", err);
      }
    }
    fetchTodos();

    // Listen for live todo completion events dispatched when a quiz is submitted with >= 66%
    const handleTodoCompleted = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { todoId, topicId, passed } = customEvent.detail || {};
      if (passed) {
        setBoardData((prev) => ({
          ...prev,
          todos: (prev.todos || []).map((t) =>
            t.id === todoId || t.topicId === topicId ? { ...t, completed: true } : t
          ),
        }));
      }
    };

    window.addEventListener("whiteboard:todo-completed", handleTodoCompleted);

    return () => {
      isMounted = false;
      window.removeEventListener("whiteboard:todo-completed", handleTodoCompleted);
    };
  }, []);

  // Auto-scroll to Score Booster section if navigated with hash
  React.useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash === "#score-booster-home-section") {
        setTimeout(() => {
          const el = document.getElementById("score-booster-home-section");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 120);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleOpenScoreBooster = () => {
    const el = document.getElementById("dashboard-scroll-content") || document.getElementById("schedule-home-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Open dedicated Quiz for the clicked To-Do task
  // Requirement: Task only gets ticked/cut when user completes related quiz and scores >= 66%
  const handleOpenQuiz = (todo: WhiteboardTodo) => {
    const topicParam = encodeURIComponent(todo.topicId || "kepler-laws");
    const titleParam = encodeURIComponent(todo.topicTitle || todo.text);
    const idParam = encodeURIComponent(todo.id);
    router.push(`/test?topic=${topicParam}&todoId=${idParam}&title=${titleParam}&source=whiteboard_todo`);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0F172A] overflow-x-hidden select-none flex flex-col">
      {/* 1. Hero Classroom Screen View (First Viewport) */}
      <div className="relative min-h-screen w-full select-none flex flex-col overflow-hidden">
      {/* Invisible SVG definition for real matte chalkboard texture filter (rough edges, micro-breaks, zero glow) */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="chalk-roughness" x="-10%" y="-10%" width="120%" height="120%">
            {/* High frequency grain for rough imperfect chalk strokes */}
            <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            {/* Subtle micro-texture breaks inside the stroke */}
            <feColorMatrix in="noise" type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 1.6 -0.15" result="grain_mask" />
            <feComposite in="displaced" in2="grain_mask" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* 1. Full Classroom Background Image */}
      <img
        src="/classroom_dashboard.jpg"
        alt="Classroom Main Dashboard"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
      />

      {/* Subtle atmospheric vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/40 pointer-events-none z-0" />

      {/* 2. Top Header Navigation (Clean: No "KEPLER ENGINE" text) */}
      <header className="relative z-30 w-full px-6 sm:px-10 py-5 flex items-center justify-between pointer-events-none fade-in-smooth">
        {/* Top-Left: Clean / Empty (Removed "KEPLER ENGINE") */}
        <div className="pointer-events-auto" />

        {/* Top-Right: Unified Student Profile Section with Dropdown Menu */}
        <div className="pointer-events-auto relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
            className={`flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-xs text-slate-200 shadow-lg backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer ${
              isProfileMenuOpen
                ? "border-slate-500 bg-slate-800/95 ring-2 ring-slate-600/40"
                : "border-slate-700/80 bg-slate-900/90 hover:bg-slate-800/80 hover:border-slate-600"
            }`}
          >
            {/* Profile Picture Avatar Icon */}
            <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <User className="h-3.5 w-3.5 text-slate-300" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#2DD4BF] ring-1 ring-slate-900 shadow-[0_0_6px_#2DD4BF]" />
            </div>

            {/* Student Name & ID */}
            <span className="font-medium text-slate-100">{effectiveName}</span>
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">({effectiveId})</span>

            {/* Dropdown Indicator */}
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                isProfileMenuOpen ? "rotate-180 text-slate-200" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-700/80 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50"
              role="menu"
            >
              {/* Identity Header */}
              <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
                <p className="text-xs font-semibold text-slate-200 truncate">{effectiveName}</p>
                <p className="text-[11px] font-mono text-slate-400 truncate">ID: {effectiveId}</p>
              </div>

              {/* 1. Profile Option */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  router.push("/profile");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer text-left"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>Profile</span>
              </button>

              {/* 2. Change Password Option */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  router.push("/change-password");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer text-left"
              >
                <KeyRound className="h-4 w-4 text-slate-400" />
                <span>Change Password</span>
              </button>

              {/* Divider */}
              <div className="my-1 border-t border-slate-800/80" />

              {/* 3. Log Out Option */}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4 text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 3. DESKTOP / TABLET BOARD OVERLAYS (Positioned over the physical classroom boards) */}
      <main className="relative z-20 flex-1 w-full flex items-center justify-center p-2 sm:p-4">
        {/* 16:9 Aspect ratio container mapped precisely to the classroom boards */}
        <div className="relative w-full max-w-[1720px] aspect-video max-h-[88vh] hidden md:block">
          {/* ========================================================================= */}
          {/* GREEN CHALKBOARD (Left Board: 11.5% to 49% X, 18.5% to 52.5% Y)            */}
          {/* Positioned in the vertical middle of the board, dry matte chalk, zero glow */}
          {/* ========================================================================= */}
          <section
            aria-label="Green Chalkboard Welcome Area"
            className="absolute left-[11.5%] top-[18.5%] w-[37.5%] h-[34%] flex flex-col justify-center items-center text-center p-3 sm:p-4 overflow-hidden fade-in-smooth"
          >
            <div className="chalk-matte-filter flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto select-none">
              {/* "Welcome back," in rough, matte chalk */}
              <h1 className="chalk-welcome text-2xl lg:text-[2.2rem] font-medium leading-none">
                Welcome back,
              </h1>

              {/* Student Name in pure milky white rough cursive chalk */}
              <p className="chalk-name text-3xl lg:text-[2.9rem] font-bold leading-tight my-1 sm:my-1.5">
                {effectiveName}
              </p>

              {/* The short line below */}
              <p className="chalk-sub text-sm lg:text-[1.1rem] font-normal leading-snug">
                Let&apos;s get started with today&apos;s orbital exploration.
              </p>

              {/* Student ID and attendance line */}
              <p className="chalk-meta text-xs lg:text-[0.85rem] font-normal tracking-wide mt-1.5 sm:mt-2">
                Student ID: {effectiveId} &bull; Attendance Verified
              </p>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* WHITE BOARD (Right Board: 52% to 84% X, 20% to 52% Y)                     */}
          {/* Natural Samsung Jazz marker writing directly on the whiteboard surface     */}
          {/* Only black/white marker ink, zero card lines, zero borders, zero boxy UI  */}
          {/* ========================================================================= */}
          <section
            aria-label="Whiteboard Student Tasks and Reminders"
            className="absolute left-[52.5%] top-[19%] w-[31.8%] h-[30.5%] flex flex-col justify-between px-3 lg:px-5 pt-1.5 pb-2 overflow-hidden fade-in-smooth-delay font-whiteboard-marker text-slate-900 select-none pointer-events-auto"
          >
            {/* Top: Next Exam Marker Line */}
            <div className="flex items-center justify-between text-base lg:text-[1.15rem] marker-header tracking-wide pb-0.5">
              <span className="font-bold">Next Exam: {boardData.nextExam.title}</span>
              <span className="font-extrabold underline decoration-slate-900/40 decoration-2 underline-offset-4">
                {boardData.nextExam.daysLeft} Days Left
              </span>
            </div>

            {/* Two Column Layout: To-do List (Left) & Reminders (Right) — Zero boxy borders or card backgrounds */}
            <div className="grid grid-cols-2 gap-4 py-0.5 flex-1 overflow-y-auto overflow-x-hidden">
              {/* • To-Do List */}
              <div className="space-y-1">
                <h2 className="text-sm lg:text-[15px] font-bold marker-header tracking-wide underline decoration-slate-900/35 decoration-2 underline-offset-2 pb-0.5">
                  To-Do List:
                </h2>
                <ul className="space-y-1 lg:space-y-1.5">
                  {(boardData.todos || []).map((todo) => (
                    <li
                      key={todo.id}
                      className="flex items-start gap-1.5 text-xs lg:text-[13px] leading-snug marker-black"
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenQuiz(todo)}
                        title={
                          todo.completed
                            ? `Quiz Completed (≥ 66%) • Click to review or retake quiz for "${todo.text}"`
                            : `Launch Quiz for "${todo.text}" (Score ≥ 66% required to tick off)`
                        }
                        className="flex items-start gap-1.5 text-left cursor-pointer bg-transparent border-0 p-0 marker-black group transition-opacity hover:opacity-80"
                      >
                        <span
                          className={`font-bold text-xs lg:text-sm leading-none shrink-0 mt-0.5 select-none font-mono ${
                            todo.completed ? "text-slate-900" : "text-slate-700"
                          }`}
                        >
                          {todo.completed ? "[✓]" : "[  ]"}
                        </span>
                        <span
                          className={`underline-offset-2 decoration-1 transition-all ${
                            todo.completed
                              ? "line-through opacity-55 decoration-slate-900/60"
                              : "font-medium group-hover:underline decoration-slate-900/60"
                          }`}
                        >
                          {todo.text}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* • Reminders */}
              <div className="space-y-1 pl-1">
                <h2 className="text-sm lg:text-[15px] font-bold marker-header tracking-wide underline decoration-slate-900/35 decoration-2 underline-offset-2 pb-0.5">
                  Reminders:
                </h2>
                <ul className="space-y-1 text-xs lg:text-[13px] leading-snug marker-black">
                  {(boardData.reminders || []).map((reminder) => (
                    <li key={reminder.id} className="flex items-start gap-1.5">
                      <span className="font-bold select-none">•</span>
                      <span>{reminder.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom: Visit Score Booster Link written in marker — Cleanly positioned inside the whiteboard surface */}
            <div className="pt-1 pb-1 flex items-center justify-between text-xs lg:text-[13px] marker-black">
              <span className="opacity-75 font-normal">
                {boardData.scoreBoosterTag}
              </span>
              <button
                type="button"
                onClick={handleOpenScoreBooster}
                className="font-bold tracking-wide hover:opacity-70 transition-opacity underline decoration-slate-900 decoration-2 underline-offset-4 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 text-slate-950 ml-auto"
              >
                <span>★ Visit Score Booster</span>
                <span className="text-sm font-bold">&rarr;</span>
              </button>
            </div>
          </section>
        </div>

        {/* 4. MOBILE / COMPACT FALLBACK (Rendered in clean whiteboard marker aesthetic) */}
        <div className="w-full max-w-lg mx-auto md:hidden space-y-4 my-auto fade-in-smooth">
          {/* Green Chalkboard Card on Mobile */}
          <div className="rounded-2xl border border-emerald-950/80 bg-[#1c2925]/95 p-6 shadow-2xl backdrop-blur-md text-white flex flex-col items-center justify-center text-center">
            <div className="chalk-matte-filter flex flex-col items-center justify-center text-center w-full space-y-1">
              <h1 className="chalk-welcome text-2xl font-medium leading-none">
                Welcome back,
              </h1>
              <p className="chalk-name text-3xl font-bold leading-tight my-1">
                {effectiveName}
              </p>
              <p className="chalk-sub text-sm font-normal leading-snug">
                Let&apos;s get started with today&apos;s orbital exploration.
              </p>
              <p className="chalk-meta text-xs font-normal tracking-wide mt-1.5">
                Student ID: {effectiveId} &bull; Attendance Verified
              </p>
            </div>
          </div>

          {/* Whiteboard Marker Card on Mobile (Samsung Jazz marker style, black & white, no cards/boxes inside) */}
          <div className="rounded-2xl border border-slate-300 bg-white/95 p-5 shadow-2xl backdrop-blur-md text-slate-900 font-whiteboard-marker space-y-3">
            <div className="flex items-center justify-between text-sm marker-header border-b border-slate-200 pb-1.5">
              <span className="font-bold">Next Exam: {boardData.nextExam.title}</span>
              <span className="font-extrabold underline decoration-slate-900/40">{boardData.nextExam.daysLeft} Days Left</span>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider marker-header mb-1.5 underline decoration-slate-900/30">
                To-Do List:
              </h2>
              <ul className="space-y-2">
                {(boardData.todos || []).map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-start gap-2 text-xs marker-black"
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenQuiz(todo)}
                      title={
                        todo.completed
                          ? `Quiz Completed (≥ 66%) • Click to review or retake quiz for "${todo.text}"`
                          : `Launch Quiz for "${todo.text}" (Score ≥ 66% required to tick off)`
                      }
                      className="flex items-start gap-2 text-left cursor-pointer bg-transparent border-0 p-0 marker-black w-full group"
                    >
                      <span
                        className={`font-bold text-xs leading-none shrink-0 mt-0.5 font-mono ${
                          todo.completed ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {todo.completed ? "[✓]" : "[  ]"}
                      </span>
                      <span
                        className={`${
                          todo.completed
                            ? "line-through opacity-55 decoration-slate-900/60"
                            : "font-medium group-hover:underline decoration-slate-900/60"
                        }`}
                      >
                        {todo.text}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider marker-header mb-1 underline decoration-slate-900/30">
                Reminders:
              </h2>
              {(boardData.reminders || []).map((r) => (
                <p key={r.id} className="text-xs marker-black">• {r.text}</p>
              ))}
            </div>

            <button
              type="button"
              onClick={handleOpenScoreBooster}
              className="w-full text-center font-bold tracking-wide pt-1 text-xs marker-black underline decoration-slate-900 decoration-2 underline-offset-4 cursor-pointer"
            >
              ★ Visit Score Booster &rarr;
            </button>
          </div>
        </div>
      </main>
      </div>

      {/* 6. SCROLLABLE HOME CONTENT BELOW CLASSROOM STAGE */}
      <div
        id="dashboard-scroll-content"
        className="relative z-20 w-full bg-[#F4F7FC] border-t border-slate-200/90 py-12 sm:py-16 pl-16 sm:pl-20 lg:pl-24 pr-4 sm:pr-8 space-y-12"
      >
        {/* 1. SCHEDULE SECTION (“You’re All Set!” empty state) */}
        <ScheduleSection id="schedule-home-section" />

        {/* 2. YOUR TESTS SECTION (Upcoming, Past Tests, Missed Tests) */}
        <YourTestsSection id="your-tests-home-section" />

        {/* 3. SCORE BOOSTER PREVIEW SECTION */}
        <ScoreBoosterPreview
          id="score-booster-home-section"
          tasks={boardData.todos}
          targetScore={300}
          examName="JEE MAINS"
        />
      </div>
    </div>
  );
}
