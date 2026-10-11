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

export interface StudyTopic {
  id: string;
  topicId: string;
  title: string;
  chapter: string;
  subject: string;
  quizQuestionCount: number;
  quizDurationMinutes: number;
  quizRoute: string;
  flashcards: FlashcardItem[];
  revisionNotes: RevisionNotesData;
}

export const STUDY_TOPICS: Record<string, StudyTopic> = {
  "kepler-laws": {
    id: "1",
    topicId: "kepler-laws",
    title: "Kepler's 3 Laws of Planetary Motion",
    chapter: "Gravitation & Celestial Mechanics",
    subject: "Physics",
    quizQuestionCount: 3,
    quizDurationMinutes: 5,
    quizRoute: "/test?topic=kepler-laws",
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
        answer: "Conservation of Angular Momentum ($L = r \\times p = \\text{constant}$) under a central gravitational force.",
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
      summary: "Johannes Kepler established three empirical laws governing orbital motion, later derived rigorously by Isaac Newton using universal gravitation and calculus.",
      keyPoints: [
        "Law of Orbits: Orbit of a planet is an ellipse with the Sun at one focus (eccentricity $0 \\le e < 1$).",
        "Law of Areas: The line joining a planet to the Sun sweeps out equal areas in equal intervals of time ($\\frac{dA}{dt} = \\text{constant}$).",
        "Areal Velocity: $\\frac{dA}{dt} = \\frac{L}{2m}$. Since gravitational force is central (torque $\\tau = 0$), angular momentum $L$ is conserved.",
        "Law of Periods: The square of orbital period $T$ is directly proportional to the cube of the semi-major axis $a$ ($T^2 \\propto a^3$).",
        "Planetary orbital speed is maximum at Perihelion (closest) and minimum at Aphelion (farthest): $v_{\\text{peri}} \\cdot r_{\\text{peri}} = v_{\\text{ap}} \\cdot r_{\\text{ap}}$."
      ],
      formulas: [
        "T^2 = \\frac{4\\pi^2}{GM} a^3",
        "\\frac{dA}{dt} = \\frac{L}{2m} = \\text{constant}",
        "v_{\\text{peri}} \\cdot r_{\\text{peri}} = v_{\\text{ap}} \\cdot r_{\\text{ap}}"
      ]
    }
  },
  "orbital-velocity": {
    id: "2",
    topicId: "orbital-velocity",
    title: "Orbital Velocity & Satellite Dynamics",
    chapter: "Gravitation & Satellites",
    subject: "Physics",
    quizQuestionCount: 3,
    quizDurationMinutes: 6,
    quizRoute: "/test?topic=orbital-velocity",
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
      summary: "Satellites stay in orbit through perpetual free fall where the inward gravitational acceleration exactly supplies the centripetal acceleration needed for a curved trajectory.",
      keyPoints: [
        "Centripetal balance: $\\frac{GMm}{r^2} = \\frac{m v_o^2}{r} \\implies v_o = \\sqrt{\\frac{GM}{r}}$.",
        "Orbital time period: $T = \\frac{2\\pi r}{v_o} = 2\\pi \\sqrt{\\frac{r^3}{GM}}$.",
        "Binding Energy: Kinetic energy $K = \\frac{GMm}{2r}$; Potential energy $U = -\\frac{GMm}{r}$; Total mechanical energy $E = -\\frac{GMm}{2r} = -K$.",
        "Geostationary Orbits: Period is 24 hours (synchronous with Earth's rotation), circular orbit in equatorial plane at altitude $\\sim 35,786\\text{ km}$."
      ],
      formulas: [
        "v_o = \\sqrt{\\frac{GM}{r}}",
        "T = 2\\pi \\sqrt{\\frac{r^3}{GM}}",
        "E_{\\text{total}} = -\\frac{GMm}{2r} = -K = \\frac{U}{2}",
        "v_e = \\sqrt{2}\\,v_o"
      ]
    }
  },
  "gravitational-practice": {
    id: "3",
    topicId: "gravitational-practice",
    title: "Universal Gravitation & Field Theory",
    chapter: "Gravitation & Field Theory",
    subject: "Physics",
    quizQuestionCount: 3,
    quizDurationMinutes: 6,
    quizRoute: "/test?topic=gravitational-practice",
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
};

export function getStudyTopic(topicId?: string, fallbackTitle?: string): StudyTopic {
  if (topicId && STUDY_TOPICS[topicId]) {
    return STUDY_TOPICS[topicId];
  }
  if (topicId) {
    const byId = Object.values(STUDY_TOPICS).find((t) => t.id === topicId);
    if (byId) return byId;
  }
  if (fallbackTitle) {
    const byTitle = Object.values(STUDY_TOPICS).find((t) =>
      t.title.toLowerCase().includes(fallbackTitle.toLowerCase()) ||
      fallbackTitle.toLowerCase().includes(t.title.toLowerCase())
    );
    if (byTitle) return byTitle;
  }
  return STUDY_TOPICS["kepler-laws"];
}
