"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Check,
  Send,
  Flame,
  FileQuestion,
  Search,
} from "lucide-react";
import { MathText } from "@/components/MathRenderer";
import { STUDY_TOPICS } from "@/data/studyTopics";
import type { TestResultData, SubjectBreakdown } from "@/types/api";
import {
  EasyLightningIcon,
  ModerateLightningIcon,
  HardLightningIcon,
} from "@/components/ui/LightningIcons";
import { apiClient } from "@/services/apiClient";
import {
  getQuizByTopicOrChapter,
  getAllAvailableQuizzes,
} from "@/data/quizCatalog";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicQuizData {
  topicTitle: string;
  chapter: string;
  questions: QuizQuestion[];
}

export const TOPIC_QUIZZES: Record<string, TopicQuizData> = {
  "kepler-laws": {
    topicTitle: "Kepler's 3 Laws of Planetary Motion",
    chapter: "Gravitation & Celestial Mechanics",
    questions: [
      {
        id: "q1",
        question:
          "According to Kepler's 1st Law (Law of Orbits), what is the shape of planetary orbits and where is the Sun located?",
        options: [
          "Circular orbit with the Sun located at the geometric center",
          "Elliptical orbit with the Sun at one of the two foci",
          "Parabolic orbit with the Sun at the vertex",
          "Hyperbolic orbit with the Sun at the directrix"
        ],
        correctIndex: 1,
        explanation:
          "Kepler's 1st Law states that every planet revolves around the Sun in an elliptical path, with the Sun situated at one of the two foci of the ellipse (eccentricity $0 \\le e < 1$)."
      },
      {
        id: "q2",
        question:
          "Kepler's 2nd Law (Law of Equal Areas) is a direct physical consequence of which fundamental conservation principle?",
        options: [
          "Conservation of Linear Momentum ($p = mv = \\text{const}$)",
          "Conservation of Angular Momentum ($L = r \\times p = \\text{const}$)",
          "Conservation of Mechanical Energy only",
          "Conservation of Electric Charge"
        ],
        correctIndex: 1,
        explanation:
          "Because the gravitational pull of the Sun is a central force, the net torque about the Sun is zero ($\\tau = r \\times F = 0$). Hence, orbital angular momentum $L$ is strictly conserved, guaranteeing a constant areal velocity: $\\frac{dA}{dt} = \\frac{L}{2m} = \\text{constant}$."
      },
      {
        id: "q3",
        question:
          "If a planet's semi-major axis distance from the Sun is doubled ($a' = 2a$), its orbital period $T$ increases by what factor?",
        options: [
          "Factor of $2$",
          "Factor of $4$",
          "Factor of $2\\sqrt{2} \\approx 2.83$",
          "Factor of $\\sqrt{2} \\approx 1.41$"
        ],
        correctIndex: 2,
        explanation:
          "By Kepler's 3rd Law, $T^2 \\propto a^3$, so $T \\propto a^{3/2}$. When $a$ is doubled ($a' = 2a$), the new period becomes $T' = (2)^{3/2} T = \\sqrt{2^3} T = \\sqrt{8} T = 2\\sqrt{2} T \\approx 2.83 T$."
      },
      {
        id: "q4",
        question:
          "What is the mathematical expression for the areal velocity $\\frac{dA}{dt}$ of an orbiting planet of mass $m$ and angular momentum $L$?",
        options: [
          "$\\frac{dA}{dt} = \\frac{L}{m}$",
          "$\\frac{dA}{dt} = \\frac{L}{2m}$",
          "$\\frac{dA}{dt} = \\frac{2L}{m}$",
          "$\\frac{dA}{dt} = \\frac{L^2}{2m}$"
        ],
        correctIndex: 1,
        explanation:
          "In polar coordinates, the area swept in infinitesimal time $dt$ is $dA = \\frac{1}{2} r (r \\, d\\theta)$. Dividing by $dt$: $\\frac{dA}{dt} = \\frac{1}{2} r^2 \\omega = \\frac{m r^2 \\omega}{2m} = \\frac{L}{2m}$."
      },
      {
        id: "q5",
        question:
          "A planet has speeds $v_{\\text{peri}}$ and $v_{\\text{ap}}$ at perihelion (distance $r_{\\text{peri}}$) and aphelion (distance $r_{\\text{ap}}$). Which relation holds true?",
        options: [
          "$v_{\\text{peri}} \\cdot r_{\\text{ap}} = v_{\\text{ap}} \\cdot r_{\\text{peri}}$",
          "$v_{\\text{peri}} \\cdot r_{\\text{peri}} = v_{\\text{ap}} \\cdot r_{\\text{ap}}$",
          "$\\frac{v_{\\text{peri}}}{r_{\\text{peri}}} = \\frac{v_{\\text{ap}}}{r_{\\text{ap}}}$",
          "$v_{\\text{peri}}^2 \\cdot r_{\\text{peri}} = v_{\\text{ap}}^2 \\cdot r_{\\text{ap}}$"
        ],
        correctIndex: 1,
        explanation:
          "At both perihelion and aphelion, the velocity vector is perpendicular to the radius vector. Conservation of angular momentum gives: $L = m v_{\\text{peri}} r_{\\text{peri}} = m v_{\\text{ap}} r_{\\text{ap}} \\implies v_{\\text{peri}} \\cdot r_{\\text{peri}} = v_{\\text{ap}} \\cdot r_{\\text{ap}}$."
      }
    ]
  },
  "orbital-velocity": {
    topicTitle: "Orbital Velocity & Satellite Dynamics",
    chapter: "Gravitation & Satellites",
    questions: [
      {
        id: "q1",
        question:
          "What is the circular orbital speed $v_o$ of a satellite moving in a stable orbit of radius $r$ around a central body of mass $M$?",
        options: [
          "$v_o = \\sqrt{\\frac{GM}{r}}$",
          "$v_o = \\sqrt{\\frac{2GM}{r}}$",
          "$v_o = \\frac{GM}{r^2}$",
          "$v_o = \\sqrt{GMr}$"
        ],
        correctIndex: 0,
        explanation:
          "Equating the inward gravitational pull with the required centripetal acceleration: $\\frac{GMm}{r^2} = \\frac{m v_o^2}{r} \\implies v_o = \\sqrt{\\frac{GM}{r}}$."
      },
      {
        id: "q2",
        question:
          "If the mass of an artificial satellite orbiting Earth is tripled ($m' = 3m$), what happens to its orbital velocity?",
        options: [
          "It triples ($3v_o$)",
          "It decreases by a factor of $\\sqrt{3}$",
          "It remains completely unchanged ($v_o$)",
          "It increases by a factor of $\\sqrt{3}$"
        ],
        correctIndex: 2,
        explanation:
          "Orbital velocity depends solely on the central mass $M$ and orbital radius $r$: $v_o = \\sqrt{\\frac{GM}{r}}$. It is completely independent of the satellite's own mass $m$."
      },
      {
        id: "q3",
        question:
          "What is the ratio of escape velocity $v_e$ to circular orbital velocity $v_o$ at the exact same orbital radius?",
        options: [
          "$1 : 1$",
          "$\\sqrt{2} : 1 \\approx 1.414$",
          "$2 : 1$",
          "$1 : \\sqrt{2}$"
        ],
        correctIndex: 1,
        explanation:
          "Escape velocity is $v_e = \\sqrt{\\frac{2GM}{r}}$, whereas orbital velocity is $v_o = \\sqrt{\\frac{GM}{r}}$. Therefore, the ratio is $\\frac{v_e}{v_o} = \\sqrt{2} \\approx 1.414$."
      },
      {
        id: "q4",
        question:
          "What is the orbital period $T$ of a satellite in a circular orbit of radius $r$ around mass $M$?",
        options: [
          "$T = 2\\pi \\sqrt{\\frac{r^3}{GM}}$",
          "$T = 2\\pi \\sqrt{\\frac{GM}{r^3}}$",
          "$T = \\frac{2\\pi r}{GM}$",
          "$T = \\pi \\sqrt{\\frac{r^2}{2GM}}$"
        ],
        correctIndex: 0,
        explanation:
          "The orbital period is the circumference divided by orbital speed: $T = \\frac{2\\pi r}{v_o} = \\frac{2\\pi r}{\\sqrt{GM/r}} = 2\\pi \\sqrt{\\frac{r^3}{GM}}$."
      },
      {
        id: "q5",
        question:
          "For a satellite in circular orbit, how does total mechanical energy $E$ relate to kinetic energy $K$ and potential energy $U$?",
        options: [
          "$E = K = \\frac{U}{2}$",
          "$E = -K = \\frac{U}{2}$",
          "$E = -2K = U$",
          "$E = 0$"
        ],
        correctIndex: 1,
        explanation:
          "Kinetic energy is $K = \\frac{GMm}{2r}$, potential energy is $U = -\\frac{GMm}{r}$, and total energy is $E = K + U = -\\frac{GMm}{2r} = -K = \\frac{U}{2}$."
      }
    ]
  },
  "gravitational-practice": {
    topicTitle: "Universal Gravitation & Field Theory",
    chapter: "Gravitation & Field Theory",
    questions: [
      {
        id: "q1",
        question:
          "At what altitude $h$ above the Earth's surface (radius $R$) does the acceleration due to gravity decrease to $\\frac{g}{4}$?",
        options: [
          "$h = R$",
          "$h = 2R$",
          "$h = \\frac{R}{2}$",
          "$h = 4R$"
        ],
        correctIndex: 0,
        explanation:
          "At altitude $h$, $g' = \\frac{g}{(1 + h/R)^2}$. Setting $g' = \\frac{g}{4}$ yields $(1 + h/R)^2 = 4 \\implies 1 + h/R = 2 \\implies h = R$."
      },
      {
        id: "q2",
        question:
          "What is the magnitude of the gravitational field intensity inside a uniform thin spherical shell of mass $M$?",
        options: [
          "$\\frac{GM}{r^2}$",
          "Zero everywhere inside the shell cavity ($E = 0$)",
          "Uniformly $-\\frac{GM}{R}$",
          "Infinite at the center of the shell"
        ],
        correctIndex: 1,
        explanation:
          "By Newton's Shell Theorem (and Gauss's Law for gravity), the gravitational field intensity inside a uniform hollow spherical shell is zero everywhere ($E = 0$)."
      },
      {
        id: "q3",
        question:
          "If Earth were to shrink to half its current radius ($R/2$) while keeping its mass $M$ constant, the escape velocity from its surface would:",
        options: [
          "Halve ($v_e / 2$)",
          "Double ($2v_e$)",
          "Increase by a factor of $\\sqrt{2}$",
          "Remain unchanged"
        ],
        correctIndex: 2,
        explanation:
          "Surface escape velocity is $v_e = \\sqrt{\\frac{2GM}{R}}$. If radius becomes $R' = R/2$, then $v_e' = \\sqrt{\\frac{2GM}{R/2}} = \\sqrt{2} \\cdot \\sqrt{\\frac{2GM}{R}} = \\sqrt{2} \\, v_e$."
      },
      {
        id: "q4",
        question:
          "How does acceleration due to gravity vary at depth $d$ inside the Earth (assuming uniform density)?",
        options: [
          "$g_d = g \\left(1 - \\frac{d}{R}\\right)$",
          "$g_d = g \\left(1 - \\frac{2d}{R}\\right)$",
          "$g_d = g \\left(1 + \\frac{d}{R}\\right)$",
          "$g_d = g \\left(\\frac{R}{R - d}\\right)^2$"
        ],
        correctIndex: 0,
        explanation:
          "At depth $d$, only the inner sphere of radius $(R - d)$ exerts gravitational pull. Hence, $g_d = g \\left(1 - \\frac{d}{R}\\right)$. At the center ($d = R$), $g = 0$."
      },
      {
        id: "q5",
        question:
          "What is the gravitational potential energy of two point masses $m_1$ and $m_2$ separated by distance $r$, taking zero reference at infinity?",
        options: [
          "$U = +\\frac{G m_1 m_2}{r}$",
          "$U = -\\frac{G m_1 m_2}{r}$",
          "$U = -\\frac{G m_1 m_2}{r^2}$",
          "$U = +\\frac{G m_1 m_2}{2r}$"
        ],
        correctIndex: 1,
        explanation:
          "Gravitational force is attractive. Bringing a mass from infinity requires negative work by external agent against the field, resulting in negative potential energy: $U(r) = -\\int_{\\infty}^r F \\, dr = -\\frac{G m_1 m_2}{r}$."
      }
    ]
  },
  "light-reflection": {
    topicTitle: "Master Mirror & Lens Formula Sign Conventions",
    chapter: "Light – Reflection and Refraction",
    questions: [
      {
        id: "q_lr_1",
        question:
          "An object is placed at the centre of curvature $C$ of a concave mirror. Where is the real image formed?",
        options: [
          "At the principal focus $F$",
          "Between $F$ and $C$",
          "At the centre of curvature $C$",
          "Behind the mirror"
        ],
        correctIndex: 2,
        explanation:
          "For a concave mirror, when the object is located at the centre of curvature $C$ ($u = -2f$), the image is also formed at $C$ ($v = -2f$), inverted and of equal size ($m = -1$)."
      },
      {
        id: "q_lr_2",
        question:
          "According to Cartesian sign convention, which formula correctly relates focal length $f$, image distance $v$, and object distance $u$ for a spherical lens?",
        options: [
          "$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$",
          "$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$",
          "$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u}$",
          "$m = -\\frac{v}{u}$"
        ],
        correctIndex: 1,
        explanation:
          "The lens formula is $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$, where $u$ is typically negative for real objects placed to the left."
      },
      {
        id: "q_lr_3",
        question:
          "A convex lens has a focal length of $+50\\text{ cm}$. What is the optical power $P$ of this lens?",
        options: [
          "$+2.0\\text{ D}$",
          "$-2.0\\text{ D}$",
          "$+0.5\\text{ D}$",
          "$+5.0\\text{ D}$"
        ],
        correctIndex: 0,
        explanation:
          "Power $P = \\frac{1}{f\\text{ (in metres)}} = \\frac{1}{+0.5\\text{ m}} = +2.0\\text{ Dioptres}$."
      }
    ]
  },
  "electricity": {
    topicTitle: "Solve Resistor Combination Word Problems",
    chapter: "Electricity & Circuit Theory",
    questions: [
      {
        id: "q_el_1",
        question:
          "Two resistors of resistance $6\\,\\Omega$ each are connected in parallel. What is their equivalent resistance $R_p$?",
        options: [
          "$12\\,\\Omega$",
          "$6\\,\\Omega$",
          "$3\\,\\Omega$",
          "$1.5\\,\\Omega$"
        ],
        correctIndex: 2,
        explanation:
          "For parallel resistors: $\\frac{1}{R_p} = \\frac{1}{6} + \\frac{1}{6} = \\frac{2}{6} = \\frac{1}{3} \\implies R_p = 3\\,\\Omega$."
      },
      {
        id: "q_el_2",
        question:
          "According to Joule's law of heating, the thermal energy $H$ produced in a conductor of resistance $R$ carrying current $I$ for time $t$ is:",
        options: [
          "$H = I R t$",
          "$H = I^2 R t$",
          "$H = \\frac{I R^2}{t}$",
          "$H = \\sqrt{I} R t$"
        ],
        correctIndex: 1,
        explanation:
          "Joule's law states $H = I^2 R t$. The heat dissipated is directly proportional to the square of the current, the resistance, and the time."
      },
      {
        id: "q_el_3",
        question:
          "A uniform wire of resistance $R$ is stretched to twice its initial length without loss of material. Its new resistance becomes:",
        options: [
          "$2R$",
          "$4R$",
          "$\\frac{R}{2}$",
          "$R$"
        ],
        correctIndex: 1,
        explanation:
          "When length doubles ($L' = 2L$), the cross-sectional area halves ($A' = A/2$) to conserve volume. Since $R = \\rho \\frac{L}{A}$, the new resistance is $R' = \\rho \\frac{2L}{A/2} = 4 \\rho \\frac{L}{A} = 4R$."
      }
    ]
  },
  "chem-reactions": {
    topicTitle: "Balancing Redox and Displacement Reactions",
    chapter: "Chemical Reactions and Equations",
    questions: [
      {
        id: "q_cr_1",
        question:
          "In the reaction: $\\text{CuO} + \\text{H}_2 \\xrightarrow{\\Delta} \\text{Cu} + \\text{H}_2\\text{O}$, which chemical species undergoes oxidation and acts as the reducing agent?",
        options: [
          "$\\text{CuO}$",
          "$\\text{H}_2$",
          "$\\text{Cu}$",
          "$\\text{H}_2\\text{O}$"
        ],
        correctIndex: 1,
        explanation:
          "$\\text{H}_2$ gains oxygen to become $\\text{H}_2\\text{O}$ (oxidation). The substance oxidized is the reducing agent."
      },
      {
        id: "q_cr_2",
        question:
          "When clean iron nails are immersed in aqueous copper(II) sulfate ($\\text{CuSO}_4$) solution for 30 minutes, what observations occur?",
        options: [
          "Blue solution turns pale green and a reddish-brown copper layer coats the iron",
          "Blue solution turns deep violet with effervescence",
          "Solution remains bright blue and no coating forms",
          "White precipitate forms instantly"
        ],
        correctIndex: 0,
        explanation:
          "Iron is more reactive than copper and displaces it: $\\text{Fe} + \\text{CuSO}_4 \\to \\text{FeSO}_4 + \\text{Cu}$. Pale green $\\text{FeSO}_4$ forms, and reddish-brown copper deposits on the nail."
      },
      {
        id: "q_cr_3",
        question:
          "Which stoichiometry coefficients balance the reaction of iron with steam: $x\\,\\text{Fe} + y\\,\\text{H}_2\\text{O} \\to z\\,\\text{Fe}_3\\text{O}_4 + w\\,\\text{H}_2$?",
        options: [
          "$x=2, y=3, z=1, w=3$",
          "$x=3, y=4, z=1, w=4$",
          "$x=1, y=2, z=1, w=2$",
          "$x=3, y=2, z=1, w=2$"
        ],
        correctIndex: 1,
        explanation:
          "Balancing iron gives $3\\,\\text{Fe}$, oxygen requires $4\\,\\text{H}_2\\text{O}$, which produces $\\text{Fe}_3\\text{O}_4$ and $4\\,\\text{H}_2$. So $x=3, y=4, z=1, w=4$."
      }
    ]
  },
  "real-numbers": {
    topicTitle: "Real Numbers: Prime Factorization & HCF-LCM Proofs",
    chapter: "Real Numbers & Arithmetic Theorems",
    questions: [
      {
        id: "q_rn_1",
        question:
          "Given that $\\text{HCF}(306, 657) = 9$, find $\\text{LCM}(306, 657)$ using the fundamental product relationship:",
        options: [
          "$22{,}338$",
          "$21{,}338$",
          "$22{,}448$",
          "$19{,}838$"
        ],
        correctIndex: 0,
        explanation:
          "$\\text{LCM}(a, b) = \\frac{a \\times b}{\\text{HCF}(a, b)} = \\frac{306 \\times 657}{9} = 34 \\times 657 = 22{,}338$."
      },
      {
        id: "q_rn_2",
        question:
          "According to the Fundamental Theorem of Arithmetic, every composite natural number can be expressed as a product of prime powers:",
        options: [
          "In multiple non-equivalent prime combinations",
          "Uniquely, except for the order in which the prime factors occur",
          "Only if the number is an even integer",
          "Only as fractions of co-prime numbers"
        ],
        correctIndex: 1,
        explanation:
          "The Fundamental Theorem of Arithmetic states that any composite number can be uniquely factored into prime factors, apart from the permutation of factors."
      },
      {
        id: "q_rn_3",
        question:
          "The rational number $\\frac{13}{3125}$ will have a decimal expansion that terminates after how many decimal places?",
        options: [
          "$5$ places",
          "$4$ places",
          "$3$ places",
          "Does not terminate"
        ],
        correctIndex: 0,
        explanation:
          "The denominator $3125 = 5^5 = 2^0 \\times 5^5$. Because the highest exponent of 2 or 5 is 5, the decimal expansion terminates after exactly 5 decimal places."
      }
    ]
  }
};

export function TestClientView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams?.get("topic") || "";
  const titleParam = searchParams?.get("title") || "";
  const subjectParam = searchParams?.get("subject") || "";
  const reviewParam = searchParams?.get("review") === "true";
  const taskId = searchParams?.get("taskId") || "";
  const difficultyParam = searchParams?.get("difficulty") || "1";
  const pointsParam = searchParams?.get("points") || "4";
  const sourceParam = searchParams?.get("source") || "";
  const todoIdParam = searchParams?.get("todoId") || "";

  const difficulty = parseInt(difficultyParam, 10) || 1;
  // Award flashes based on difficulty: Easy (1) -> Bronze, Moderate (2) -> Silver, Hard (3) -> Gold
  const flashTier: "bronze" | "silver" | "gold" =
    difficulty === 3 ? "gold" : difficulty === 2 ? "silver" : "bronze";
  const flashTitle =
    flashTier === "gold"
      ? "Gold Flash"
      : flashTier === "silver"
      ? "Silver Flash"
      : "Bronze Flash";

  const [taskCompletedState, setTaskCompletedState] = React.useState<boolean | null>(null);
  const [whiteboardTodoPassed, setWhiteboardTodoPassed] = React.useState<boolean | null>(null);
  const [asyncCustomQuiz, setAsyncCustomQuiz] = React.useState<TopicQuizData | null>(null);
  const [selectedOverviewSubject, setSelectedOverviewSubject] = React.useState<string>("All");
  const [overviewSearchQuery, setOverviewSearchQuery] = React.useState<string>("");

  // Fetch dynamic custom practice test if topic starts with custom_
  React.useEffect(() => {
    if (topicId && topicId.startsWith("custom_")) {
      apiClient.test
        .startQuiz(topicId)
        .then((res) => {
          if (res && res.questions && res.questions.length > 0) {
            setAsyncCustomQuiz({
              topicTitle: res.topicTitle,
              chapter: res.chapter || res.topicTitle,
              questions: res.questions.map((q, idx) => ({
                id: q.id,
                question: q.question,
                options: q.options,
                correctIndex: 0,
                explanation: q.explanation || "Step-by-step conceptual derivation.",
              })),
            });
          }
        })
        .catch((err) => {
          console.warn("Could not fetch custom test from backend:", err);
        });
    }
  }, [topicId]);

  // Active quiz data (lookup from custom async, static topics, or master segregated catalog)
  const currentQuiz: TopicQuizData | null = React.useMemo(() => {
    if (!topicId) return null;

    if (asyncCustomQuiz) {
      return asyncCustomQuiz;
    }

    if (TOPIC_QUIZZES[topicId]) {
      return TOPIC_QUIZZES[topicId];
    }

    // Lookup in master segregated catalog across all 108 CBSE chapters
    const master = getQuizByTopicOrChapter(topicId);
    if (master) {
      return {
        topicTitle: titleParam || master.title,
        chapter: master.title,
        questions: master.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        })),
      };
    }

    return {
      topicTitle: titleParam || "Topic Practice Quiz",
      chapter: subjectParam ? `${subjectParam} Assessment` : "CBSE Board Practice",
      questions: TOPIC_QUIZZES["kepler-laws"].questions,
    };
  }, [topicId, titleParam, subjectParam, asyncCustomQuiz]);

  // Current single-question index (0-indexed)
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  // User selected option index per question ID
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({});
  // Submission state
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  // Track if this is a reattempt
  const [isRetakeAttempt, setIsRetakeAttempt] = React.useState<boolean>(false);

  // Restore quiz state or review mode
  React.useEffect(() => {
    if (reviewParam) {
      setIsSubmitted(true);
      try {
        const stored = localStorage.getItem(`kepler_test_answers_${topicId}`);
        if (stored) {
          setSelectedAnswers(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to restore answers for review:", e);
      }
    } else {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
    }
  }, [topicId, reviewParam]);

  // Keyboard navigation: Left/Right arrows to flip questions, 1-4 to select options
  React.useEffect(() => {
    if (!currentQuiz) return;
    const total = currentQuiz.questions.length;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentQuestionIndex((prev) => Math.min(total - 1, prev + 1));
      } else if (!isSubmitted && ["1", "2", "3", "4"].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        const currentQ = currentQuiz.questions[currentQuestionIndex];
        if (currentQ && optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuiz, currentQuestionIndex, isSubmitted]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (!currentQuiz) return;
    setCurrentQuestionIndex((prev) => Math.min(currentQuiz.questions.length - 1, prev + 1));
  };

  // Real-time dynamic calculation of actual test score & breakdown
  const calculatedResult: TestResultData | null = React.useMemo(() => {
    if (!currentQuiz) return null;

    const totalQuestions = currentQuiz.questions.length;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    currentQuiz.questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (userAns === undefined) {
        unattemptedCount += 1;
      } else if (userAns === q.correctIndex) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    });

    const totalScore = correctCount;
    const maxTotalMarks = totalQuestions;
    const accuracyPercentage =
      totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const resolvedSubject =
      subjectParam || (topicId && STUDY_TOPICS[topicId]?.subject) || "Physics";

    const subjectBreakdown: SubjectBreakdown = {
      id: resolvedSubject.toLowerCase(),
      name: resolvedSubject,
      partLabel: `Part-1 : ${resolvedSubject}`,
      maxMarks: maxTotalMarks,
      score: totalScore,
      correctCount,
      incorrectCount,
      unattemptedCount,
      positiveMarks: totalScore,
      negativeMarks: 0,
    };

    return {
      testId: topicId || "quiz_attempt",
      testTitle: currentQuiz.topicTitle,
      dateAttempted: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      attemptType: isRetakeAttempt ? "reattempt" : "first",
      roundLabel: "Quiz Attempt",
      totalScore,
      maxTotalMarks,
      accuracyPercentage,
      totalCorrect: correctCount,
      totalIncorrect: incorrectCount,
      totalUnattempted: unattemptedCount,
      totalPositiveMarks: totalScore,
      totalNegativeMarks: 0,
      subjects: [subjectBreakdown],
    };
  }, [currentQuiz, selectedAnswers, topicId, subjectParam, isRetakeAttempt]);

  const handleSubmitQuiz = async () => {
    setIsSubmitted(true);
    if (!currentQuiz) return;

    const totalQuestions = currentQuiz.questions.length;
    let correctCount = 0;
    currentQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassed = accuracy >= 66; // Score 66% or higher condition

    // If initiated from Score Booster, update task status ONLY after result is calculated and if score >= 66%
    if (taskId) {
      if (isPassed) {
        setTaskCompletedState(true);
        try {
          await apiClient.scoreBooster.completeTask(taskId);
        } catch (e) {
          console.warn("Could not complete task via API:", e);
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(`score_booster_completed_${taskId}`, "true");
          localStorage.setItem(`score_booster_flash_${taskId}`, flashTier);
          window.dispatchEvent(
            new CustomEvent("score-booster:task-completed", {
              detail: { taskId, difficulty, flashTier },
            })
          );
        }
      } else {
        setTaskCompletedState(false);
      }
    }

    // Whiteboard To-Do task completion logic (Requirement: score 66% or higher to tick off task)
    const resolvedTodoId =
      todoIdParam ||
      (topicId === "kepler-laws"
        ? "1"
        : topicId === "orbital-velocity"
        ? "2"
        : topicId === "gravitational-practice"
        ? "3"
        : "");

    if (resolvedTodoId || sourceParam === "whiteboard_todo") {
      if (isPassed) {
        setWhiteboardTodoPassed(true);
        if (resolvedTodoId) {
          try {
            await apiClient.classroom.updateTodo(resolvedTodoId, { completed: true });
          } catch (e) {
            console.warn("Could not sync todo status to backend:", e);
          }
          if (typeof window !== "undefined") {
            localStorage.setItem(`whiteboard_todo_completed_${resolvedTodoId}`, "true");
            if (topicId) {
              localStorage.setItem(`whiteboard_todo_completed_topic_${topicId}`, "true");
            }
            window.dispatchEvent(
              new CustomEvent("whiteboard:todo-completed", {
                detail: { todoId: resolvedTodoId, topicId, accuracy, passed: true },
              })
            );
          }
        }
      } else {
        setWhiteboardTodoPassed(false);
        if (resolvedTodoId && typeof window !== "undefined") {
          localStorage.removeItem(`whiteboard_todo_completed_${resolvedTodoId}`);
          if (topicId) {
            localStorage.removeItem(`whiteboard_todo_completed_topic_${topicId}`);
          }
          window.dispatchEvent(
            new CustomEvent("whiteboard:todo-completed", {
              detail: { todoId: resolvedTodoId, topicId, accuracy, passed: false },
            })
          );
        }
      }
    }

    if (calculatedResult) {
      try {
        localStorage.setItem("kepler_latest_test_result", JSON.stringify(calculatedResult));
        sessionStorage.setItem("kepler_latest_test_result", JSON.stringify(calculatedResult));
        if (topicId) {
          localStorage.setItem(`kepler_test_answers_${topicId}`, JSON.stringify(selectedAnswers));
        }
      } catch (e) {
        console.error("Failed to store test result:", e);
      }
    }

    // Sync submission to backend so mistakes and test history are recorded for this specific student
    try {
      let currentStudentId: string | undefined;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("current_student");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed?.id) currentStudentId = String(parsed.id);
          } catch {}
        }
      }
      await apiClient.test.submitQuiz({
        topicId: topicId || "kepler-laws",
        selectedAnswers,
        timeSpentSeconds: 60,
        studentId: currentStudentId,
      });
    } catch (e) {
      console.warn("Could not sync quiz submission to backend:", e);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setIsRetakeAttempt(true);
    setTaskCompletedState(null);
  };

  const handleViewReport = () => {
    if (calculatedResult) {
      try {
        localStorage.setItem("kepler_latest_test_result", JSON.stringify(calculatedResult));
        sessionStorage.setItem("kepler_latest_test_result", JSON.stringify(calculatedResult));
        if (topicId) {
          localStorage.setItem(`kepler_test_answers_${topicId}`, JSON.stringify(selectedAnswers));
        }
      } catch (e) {
        console.error("Failed to store test result:", e);
      }
      const params = new URLSearchParams({
        topic: topicId,
        title: currentQuiz?.topicTitle || "",
        subject: subjectParam || (topicId && STUDY_TOPICS[topicId]?.subject) || "Physics",
        score: String(calculatedResult.totalScore),
        total: String(calculatedResult.maxTotalMarks),
        correct: String(calculatedResult.totalCorrect),
        incorrect: String(calculatedResult.totalIncorrect),
        unattempted: String(calculatedResult.totalUnattempted),
        attempt: isRetakeAttempt ? "reattempt" : "first",
        taskId: taskId || "",
        difficulty: String(difficulty),
        points: pointsParam,
        source: sourceParam,
        flashAwarded: taskCompletedState === true ? flashTier : "",
      });
      router.push(`/test/result?${params.toString()}`);
    } else {
      router.push("/test/result");
    }
  };

  // =========================================================================
  // 1. ONE-QUESTION-AT-A-TIME ACTIVE QUIZ VIEW
  // =========================================================================
  if (currentQuiz) {
    const totalQuestions = currentQuiz.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;
    const currentQ = currentQuiz.questions[currentQuestionIndex] || currentQuiz.questions[0];
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const selectedOpt = selectedAnswers[currentQ.id];
    const isCurrentAnswered = selectedOpt !== undefined;

    // Score calculation
    let score = 0;
    if (isSubmitted) {
      currentQuiz.questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          score += 1;
        }
      });
    }

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isCurrentCorrect = isSubmitted && selectedOpt === currentQ.correctIndex;

    return (
      <div className="min-h-screen w-full bg-[#F4F7FC] text-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 pl-16 sm:pl-20 lg:pl-24 pr-4 sm:pr-8 lg:pr-12 antialiased select-none">
        
        {/* Top Breadcrumb & Chapter Bar */}
        <div className="w-full max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Classroom Dashboard</span>
            </Link>
            <span className="text-slate-300">&bull;</span>
            <span className="font-medium text-slate-700 hidden sm:inline">{currentQuiz.chapter}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-indigo-700 border border-indigo-100 shadow-2xs">
              {currentQuiz.chapter}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {answeredCount}/{totalQuestions} Answered
            </span>
          </div>
        </div>

        {/* Main Quiz Stage */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between">
          
          {/* Header Card: Quiz Title & Question Counter */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-lg shadow-2xs shrink-0">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {currentQuiz.topicTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Concept Mastery Assessment &bull; Single Question Focus
                  </p>
                </div>
              </div>

              {/* Prominent Question Counter Badge & Report Link */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                {isSubmitted && (
                  <button
                    type="button"
                    onClick={handleViewReport}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer mr-1"
                  >
                    <span>View Report ({score}/{totalQuestions})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Question Progress
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-indigo-600 font-mono tracking-tight">
                    Q{currentQuestionIndex + 1}/{totalQuestions}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full mt-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
                }}
              />
            </div>

            {/* Quick Question Jump Navigator Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Jump to:
              </span>
              {currentQuiz.questions.map((q, idx) => {
                const isSelected = idx === currentQuestionIndex;
                const isAns = selectedAnswers[q.id] !== undefined;
                const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctIndex;
                const isWrong = isSubmitted && isAns && !isCorrect;

                let pillColor = "bg-slate-100 text-slate-600 hover:bg-slate-200/80 border-slate-200";

                if (isSubmitted) {
                  if (isCorrect) {
                    pillColor = "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold";
                  } else if (isWrong) {
                    pillColor = "bg-rose-50 text-rose-700 border-rose-300 font-bold";
                  } else {
                    pillColor = "bg-slate-100 text-slate-400 border-slate-200";
                  }
                } else if (isAns) {
                  pillColor = "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold";
                }

                if (isSelected) {
                  pillColor = "bg-indigo-600 text-white border-indigo-600 font-extrabold shadow-xs ring-2 ring-indigo-200";
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    title={`Go to Question ${idx + 1}`}
                    className={`w-8 h-8 rounded-xl text-xs flex items-center justify-center border transition-all cursor-pointer font-mono active:scale-95 ${pillColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Score Banner when Submitted */}
          {isSubmitted && (
            taskId ? (
              percentage > 66 ? (
                /* ------------------------------------------------------------- */
                /* SCORE BOOSTER TASK PASSED: Flash Awarded & Task Marked Done   */
                /* ------------------------------------------------------------- */
                <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-emerald-50/90 border-2 border-emerald-300/80 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 flex items-center justify-center p-3 rounded-2xl bg-white shadow-xs border border-slate-200/80">
                      {flashTier === "gold" ? (
                        <HardLightningIcon size={42} />
                      ) : flashTier === "silver" ? (
                        <ModerateLightningIcon size={42} />
                      ) : (
                        <EasyLightningIcon size={42} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                          Task Completed
                        </span>
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{flashTitle} Earned</span>
                          <span>⚡</span>
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Quiz Score: {score} / {totalQuestions} ({percentage}%) &bull; Passed (&gt; 66% required)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        🌟 +{pointsParam} Marks added to your goal! The task has been marked as <strong className="text-emerald-700 font-bold">Done</strong> in your Score Booster list.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>Back to Score Booster</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* ------------------------------------------------------------- */
                /* SCORE BOOSTER TASK FAILED: <= 66%, Flash Locked               */
                /* ------------------------------------------------------------- */
                <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-rose-50/80 border-2 border-rose-200/90 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                      <XCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                          Task Incomplete
                        </span>
                        <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                          <span>{flashTitle} Locked</span>
                          <span>🔒</span>
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Quiz Score: {score} / {totalQuestions} ({percentage}%) &bull; &gt; 66% Required
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        A score of more than 66% is required to complete this task. Retake the quiz to earn your {flashTitle} and boost your score!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz Now</span>
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <span>Classroom</span>
                    </Link>
                  </div>
                </div>
              )
            ) : (todoIdParam || sourceParam === "whiteboard_todo" || whiteboardTodoPassed !== null) ? (
              percentage >= 66 ? (
                /* ------------------------------------------------------------- */
                /* WHITEBOARD TO-DO TASK PASSED: >= 66% Condition Met            */
                /* ------------------------------------------------------------- */
                <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-emerald-50/90 border-2 border-emerald-300 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-white border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 font-mono text-xl font-extrabold shadow-2xs">
                      [✓]
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-700 text-white shadow-2xs">
                          Task Completed
                        </span>
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <span>Requirement Met (≥ 66%)</span>
                          <span>✓</span>
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Quiz Score: {score} / {totalQuestions} ({percentage}%) &bull; Passed
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        Great job! The task has been ticked off and cut <strong className="font-mono text-slate-900 font-bold">[✓]</strong> on your classroom whiteboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>Return to Classroom</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* ------------------------------------------------------------- */
                /* WHITEBOARD TO-DO TASK FAILED: < 66%                           */
                /* ------------------------------------------------------------- */
                <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-amber-50/90 border-2 border-amber-300 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-white border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 font-mono text-xl font-extrabold shadow-2xs">
                      [  ]
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-600 text-white shadow-2xs">
                          Task Incomplete
                        </span>
                        <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                          <span>Score ≥ 66% Required</span>
                          <span>🔒</span>
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Quiz Score: {score} / {totalQuestions} ({percentage}%) &bull; Below 66%
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        A score of 66% or higher is required to complete this whiteboard task. It remains open <strong className="font-mono text-slate-900 font-bold">[  ]</strong>. Retake the quiz to pass!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz Now</span>
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <span>Classroom</span>
                    </Link>
                  </div>
                </div>
              )
            ) : (
              /* Regular Quiz Score Banner */
              <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs animate-in fade-in duration-300">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      Quiz Score: {score} / {totalQuestions} ({percentage}%)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      {score === totalQuestions
                        ? "🌟 Perfect score! You have completely mastered this concept."
                        : score >= Math.ceil(totalQuestions / 2)
                        ? "👍 Good attempt! Review the step-by-step explanations below."
                        : "💡 Keep revising! Walk through the solutions to solidify formulas."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <span>Classroom</span>
                  </Link>
                </div>
              </div>
            )
          )}

          {/* ================================================================= */}
          {/* THE SINGLE QUESTION CARD                                          */}
          {/* ================================================================= */}
          <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] mb-6 transition-all duration-300">
            
            {/* Question Top Meta Strip */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  &bull; 4 Marks Standard Rubric
                </span>
              </div>

              {/* Status Indicator */}
              <div>
                {isSubmitted ? (
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                      isCurrentCorrect
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {isCurrentCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct Answer</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Incorrect Choice</span>
                      </>
                    )}
                  </span>
                ) : isCurrentAnswered ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Answered</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400">
                    Not answered yet
                  </span>
                )}
              </div>
            </div>

            {/* Question Prompt */}
            <div className="mb-8">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 leading-relaxed tracking-tight">
                <MathText content={currentQ.question} />
              </h2>
            </div>

            {/* Interactive Options List (A, B, C, D) */}
            <div className="space-y-3.5">
              {currentQ.options.map((option, optIdx) => {
                const isOptionSelected = selectedOpt === optIdx;
                let optionStyle =
                  "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800 shadow-2xs";

                if (isSubmitted) {
                  if (optIdx === currentQ.correctIndex) {
                    optionStyle =
                      "border-2 border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs";
                  } else if (isOptionSelected && !isCurrentCorrect) {
                    optionStyle =
                      "border-2 border-rose-400 bg-rose-50/80 text-rose-950 line-through opacity-80";
                  } else {
                    optionStyle = "border-slate-100 bg-slate-50/40 text-slate-400";
                  }
                } else if (isOptionSelected) {
                  optionStyle =
                    "border-2 border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-100";
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border text-sm sm:text-base flex items-center justify-between gap-4 transition-all cursor-pointer group active:scale-[0.99] ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Letter badge (A, B, C, D) */}
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 font-mono transition-colors ${
                          isSubmitted && optIdx === currentQ.correctIndex
                            ? "bg-emerald-600 text-white"
                            : isSubmitted && isOptionSelected && !isCurrentCorrect
                            ? "bg-rose-500 text-white"
                            : isOptionSelected
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200/70"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>

                      {/* Option Text rendered with KaTeX MathText */}
                      <span className="leading-snug">
                        <MathText content={option} />
                      </span>
                    </div>

                    {/* Result Icon in Review Mode */}
                    {isSubmitted && optIdx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isSubmitted && isOptionSelected && !isCurrentCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step-by-Step Mathematical Explanation (Visible after submit) */}
            {isSubmitted && (
              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm leading-relaxed text-slate-700 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step-by-Step Mathematical Solution</span>
                </div>
                <div className="text-slate-800 text-sm sm:text-[15px] leading-relaxed">
                  <MathText content={currentQ.explanation} />
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* BOTTOM NAVIGATION ACTION BAR: PREVIOUS & NEXT BUTTONS             */}
          {/* ================================================================= */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            
            {/* Left: Previous Button */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
              <button
                type="button"
                disabled={isFirstQuestion}
                onClick={handlePrev}
                aria-label="Go to previous question (Left arrow)"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs sm:text-sm font-semibold shadow-2xs cursor-pointer group"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
                <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 group-hover:text-slate-800">
                  &larr;
                </kbd>
              </button>

              {/* Mobile Question Counter Display */}
              <span className="sm:hidden text-xs font-mono font-bold text-slate-500">
                Q{currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>

            {/* Center: Desktop Question Counter & Progress */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>&bull;</span>
              <span className="font-semibold text-slate-700">{answeredCount} of {totalQuestions} Answered</span>
            </div>

            {/* Right: Next or Submit Button */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
              {!isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Go to next question (Right arrow)"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all text-xs sm:text-sm font-bold shadow-2xs cursor-pointer group"
                >
                  <span>Next</span>
                  <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    &rarr;
                  </kbd>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : !isSubmitted ? (
                <button
                  type="button"
                  disabled={answeredCount === 0}
                  onClick={handleSubmitQuiz}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Quiz</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleViewReport}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <span>View Full Report</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. FALLBACK: GENERAL TEST CENTER OVERVIEW
  // =========================================================================
  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-slate-800 flex flex-col items-center justify-start p-6 pl-20 sm:pl-28 antialiased">
      <div className="w-full max-w-4xl">
        {/* Header Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <ClipboardList className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Test Center
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Practice chapter quizzes, topic assessments, and full timed mock examinations.
            </p>
          </div>
        </div>

        {/* Custom Practice Test Selection Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-50/80 via-teal-100/40 to-blue-50 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#186470] text-white mb-2">
              Custom Practice
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Create a Custom Practice Test (Class 10)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-0.5">
              Choose from Class 10 subjects and select up to 9 chapters to generate targeted practice sets.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/test/result"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <span>View Latest Result</span>
            </Link>
            <Link
              href="/test/custom"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#186470] text-white hover:bg-[#13535d] shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span>Select Chapters</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Section: CBSE Class 10 Chapter Quizzes */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                CBSE Class 10 Chapter Quizzes (108 Chapters)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Practice concept-tested 10-question master quizzes for any chapter or subtopic.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={overviewSearchQuery}
                onChange={(e) => setOverviewSearchQuery(e.target.value)}
                placeholder="Search chapters or topics..."
                className="w-full rounded-full border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {["All", "Maths", "Physics", "Chemistry", "Biology", "SST", "English", "Hindi"].map(
              (subj) => {
                const isSelected = selectedOverviewSubject.toLowerCase() === subj.toLowerCase();
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setSelectedOverviewSubject(subj)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {subj}
                  </button>
                );
              }
            )}
          </div>

          {/* Grid of Chapter Quizzes */}
          {(() => {
            const allQuizzes = getAllAvailableQuizzes(
              selectedOverviewSubject === "All" ? undefined : selectedOverviewSubject
            );
            const filtered = overviewSearchQuery.trim()
              ? allQuizzes.filter(
                  (q) =>
                    q.topicTitle.toLowerCase().includes(overviewSearchQuery.toLowerCase().trim()) ||
                    q.subject.toLowerCase().includes(overviewSearchQuery.toLowerCase().trim()) ||
                    q.subtopics.some((st) =>
                      st.toLowerCase().includes(overviewSearchQuery.toLowerCase().trim())
                    )
                )
              : allQuizzes;

            if (filtered.length === 0) {
              return (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
                  No chapter quizzes found matching &ldquo;{overviewSearchQuery}&rdquo; in {selectedOverviewSubject}.
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filtered.map((quiz) => {
                  const subjectColor =
                    quiz.subjectId === "physics"
                      ? "text-indigo-600 bg-indigo-50 border-indigo-100"
                      : quiz.subjectId === "chemistry"
                      ? "text-purple-600 bg-purple-50 border-purple-100"
                      : quiz.subjectId === "biology"
                      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                      : quiz.subjectId === "maths"
                      ? "text-teal-600 bg-teal-50 border-teal-100"
                      : quiz.subjectId === "sst"
                      ? "text-amber-600 bg-amber-50 border-amber-100"
                      : quiz.subjectId === "english"
                      ? "text-rose-600 bg-rose-50 border-rose-100"
                      : "text-orange-600 bg-orange-50 border-orange-100";

                  return (
                    <Link
                      key={quiz.id}
                      href={`/test?topic=${encodeURIComponent(quiz.id)}&title=${encodeURIComponent(
                        quiz.topicTitle
                      )}&subject=${encodeURIComponent(quiz.subject)}`}
                      className="group rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md p-4 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${subjectColor}`}
                          >
                            {quiz.subject}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {quiz.code}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {quiz.topicTitle}
                        </h3>

                        {/* Subtopics snippet */}
                        {quiz.subtopics && quiz.subtopics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {quiz.subtopics.slice(0, 2).map((st, i) => (
                              <span
                                key={i}
                                className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 truncate max-w-[150px]"
                              >
                                {st}
                              </span>
                            ))}
                            {quiz.subtopics.length > 2 && (
                              <span className="text-[9px] text-slate-400 self-center">
                                +{quiz.subtopics.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>{quiz.questionCount} Questions &bull; {quiz.durationMinutes}m</span>
                        <span className="font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Start Quiz <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
