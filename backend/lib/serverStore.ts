import {
  StudentProfile,
  ClassroomTodoItem,
  CalendarEvent,
  ScheduleItem,
  SubjectItem,
  SubjectChapter,
  ChapterMaterialResponse,
  FlashcardItem,
  RevisionNotesData,
  QuizDetail,
  QuizQuestionItem,
  TestResultData,
  ScoreBoosterTask,
  LoggedMistake,
  PastExamPaper,
  ResolvedDoubt,
  ChatMessage,
  DoubtSolverMode,
  SearchChipType,
  TeacherProfile,
  TeacherStudentSummary,
  TeacherStudentDetail,
  TeacherPdfUpload,
  CreatePdfUploadRequest,
  TeacherRankingItem,
  TeacherClassAnalytics,
  TeacherScheduleTestRequest,
} from "@/types/api";
import {
  getQuizByTopicOrChapter,
  getAllAvailableQuizzes,
  MasterChapterQuiz,
} from "@/data/quizCatalog";

/**
 * ============================================================================
 * KEPLER PLATFORM PERSISTENT BACKEND STORE & SERVICE LAYER
 * ============================================================================
 * Authoritative in-memory state repository for all platform modules.
 * Ensures consistent data flow, interactive mutations, and realistic CBSE Class 10
 * curriculum across all API routes.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. Current Student & Authentication
// ----------------------------------------------------------------------------
export const registeredStudents: Record<string, StudentProfile> = {
  ojus: {
    id: "1",
    name: "Ojus",
    email: "ojus@kepler.edu",
    targetExam: "CBSE Class 10 Board Exam",
    role: "student",
    phone: "+91 98765 43210",
    grade: "Grade 10",
    school: "Kepler International Academy",
  },
  sneha: {
    id: "2",
    name: "Sneha Reddy",
    email: "sneha.reddy@kepler.edu",
    targetExam: "CBSE Class 10 Board Exam",
    role: "student",
    phone: "+91 91234 56789",
    grade: "Grade 10",
    school: "Kepler International Academy",
  },
  alex: {
    id: "10034455542",
    name: "Alex Chen",
    email: "alex.chen@kepler.edu",
    targetExam: "CBSE Class 10 Board Exam",
    role: "student",
    phone: "+1 (555) 234-5678",
    grade: "Grade 10",
    school: "Kepler International Academy",
  },
  alex_10digit: {
    id: "1003445542",
    name: "Alex Chen",
    email: "alex.chen@kepler.edu",
    targetExam: "CBSE Class 10 Board Exam",
    role: "student",
    phone: "+1 (555) 234-5678",
    grade: "Grade 10",
    school: "Kepler International Academy",
  },
};

let studentProfileStore: StudentProfile = { ...registeredStudents.ojus };

let studentPasswordsStore: Record<string, string> = {
  "1": "1",
  "2": "2",
  "ojus": "1",
  "sneha": "2",
  "sneha reddy": "2",
  "10034455542": "10034455542",
  "1003445542": "1003445542",
};

let studentPasswordStore = "1";

export function isMatchingStudentId(mistakeStudentId?: string, targetStudentId?: string): boolean {
  if (!targetStudentId) return false;
  // If no studentId was stored on the legacy mistake, assign it to Alex Chen (10034455542 / 1003445542)
  const mId = (mistakeStudentId || "10034455542").trim();
  const tId = targetStudentId.trim();
  if (mId === tId) return true;

  // Handle Alex Chen ID variants: 1003445542 (10-digit) vs 10034455542 (11-digit) vs 'alex'
  const isAlexM = mId === "10034455542" || mId === "1003445542" || mId.toLowerCase() === "alex";
  const isAlexT =
    tId === "10034455542" ||
    tId === "1003445542" ||
    tId.toLowerCase() === "alex";
  if (isAlexM && isAlexT) return true;

  // Handle Ojus ID variants: '1' vs 'ojus'
  const isOjusM = mId === "1" || mId.toLowerCase() === "ojus";
  const isOjusT = tId === "1" || tId.toLowerCase() === "ojus";
  if (isOjusM && isOjusT) return true;

  // Handle Sneha ID variants: '2' vs 'sneha'
  const isSnehaM = mId === "2" || mId.toLowerCase().includes("sneha");
  const isSnehaT = tId === "2" || tId.toLowerCase().includes("sneha");
  if (isSnehaM && isSnehaT) return true;

  return false;
}

// ----------------------------------------------------------------------------
// 2. Classroom Blackboard To-Dos
// ----------------------------------------------------------------------------
let todosStore: ClassroomTodoItem[] = [
  {
    id: "1",
    text: "Review Kepler's 3 Laws of Planetary Motion",
    completed: false,
    dueDate: "2026-10-12",
    topicId: "kepler-laws",
    topicTitle: "Kepler's 3 Laws of Planetary Motion",
    quizId: "quiz-kepler-laws",
    flashcards: [
      {
        id: "fc_1",
        question: "What does Kepler's 1st Law (Law of Ellipses) state?",
        answer: "All planets move in elliptical orbits with the Sun located at one of the two foci.",
        hint: "Think about planetary orbits around the Sun.",
      },
      {
        id: "fc_2",
        question: "What physical conservation law underpins Kepler's 2nd Law (Equal Areas)?",
        answer: "Conservation of Angular Momentum (L = r × p = constant) under a central gravitational force.",
        hint: "Areal velocity dA/dt is proportional to L / (2m).",
      },
      {
        id: "fc_3",
        question: "What is Kepler's 3rd Law harmonic relation between orbital period T and semi-major axis a?",
        answer: "T² ∝ a³, or T² = (4π² / GM) a³. The square of the orbital period is proportional to the cube of the semi-major axis.",
        hint: "Compare time period with distance: T² / a³ = constant.",
      },
    ],
    revisionNotes: {
      summary: "Johannes Kepler established three empirical laws governing orbital motion, later derived rigorously by Isaac Newton using universal gravitation.",
      keyPoints: [
        "Law of Orbits: Orbit of a planet is an ellipse with the Sun at one focus (0 ≤ e < 1).",
        "Law of Areas: The line joining a planet to the Sun sweeps out equal areas in equal intervals of time (dA/dt = constant).",
        "Law of Periods: T² ∝ a³. The orbital period depends strictly on the semi-major axis.",
      ],
      formulas: [
        "T^2 = \\frac{4\\pi^2}{GM} a^3",
        "\\frac{dA}{dt} = \\frac{L}{2m} = \\text{constant}",
      ],
    },
  },
  {
    id: "2",
    text: "Complete Orbital Velocity Lab Simulation",
    completed: false,
    dueDate: "2026-10-14",
    topicId: "orbital-velocity",
    topicTitle: "Orbital Velocity & Satellite Dynamics",
    quizId: "quiz-orbital-velocity",
  },
  {
    id: "3",
    text: "Solve 10 Practice Questions on Gravity",
    completed: false,
    dueDate: "2026-10-15",
    topicId: "gravitational-practice",
    topicTitle: "Universal Gravitation & Field Theory",
    quizId: "quiz-gravitational-practice",
  },
];

// ----------------------------------------------------------------------------
// 3. Academic Calendar & Test Schedule
// ----------------------------------------------------------------------------
let calendarEventsStore: CalendarEvent[] = [
  {
    id: "evt-1",
    day: 8,
    dateStr: "Oct 8, 2026",
    title: "Science: Chemical Reactions & Equations Diagnostic",
    subject: "Science",
    durationMinutes: 30,
    questionsCount: 25,
    type: "quiz",
    timeStr: "10:00 AM",
    status: "completed",
    scheduledAt: "2026-10-08T10:00:00",
    quizTopicId: "chem-reactions",
  },
  {
    id: "evt-2",
    day: 12,
    dateStr: "Oct 12, 2026",
    title: "Kepler's 3 Laws & Gravitation Practice Test",
    subject: "Physics",
    durationMinutes: 45,
    questionsCount: 20,
    type: "quiz",
    timeStr: "11:30 AM",
    status: "scheduled",
    scheduledAt: "2026-10-12T11:30:00",
    quizTopicId: "kepler-laws",
  },
  {
    id: "evt-3",
    day: 15,
    dateStr: "Oct 15, 2026",
    title: "Light: Reflection & Refraction Chapter Exam",
    subject: "Physics",
    durationMinutes: 60,
    questionsCount: 30,
    type: "mock",
    timeStr: "02:00 PM",
    status: "scheduled",
    scheduledAt: "2026-10-15T14:00:00",
    quizTopicId: "light-reflection",
  },
  {
    id: "evt-4",
    day: 19,
    dateStr: "Oct 19, 2026",
    title: "Real Numbers & Polynomials Unit Test",
    subject: "Mathematics",
    durationMinutes: 60,
    questionsCount: 35,
    type: "mock",
    timeStr: "09:30 AM",
    status: "scheduled",
    scheduledAt: "2026-10-19T09:30:00",
    quizTopicId: "real-numbers",
  },
  {
    id: "evt-5",
    day: 22,
    dateStr: "Oct 22, 2026",
    title: "CBSE Class 10 Midterm Full Mock Test - Paper 1",
    subject: "Science & Math",
    durationMinutes: 180,
    questionsCount: 75,
    type: "mock",
    timeStr: "09:00 AM",
    status: "scheduled",
    scheduledAt: "2026-10-22T09:00:00",
    quizTopicId: "kepler-laws",
  },
  {
    id: "evt-6",
    day: 24,
    dateStr: "Oct 24, 2026",
    title: "Acids, Bases & Salts Mid-Chapter Evaluation",
    subject: "Chemistry",
    durationMinutes: 40,
    questionsCount: 20,
    type: "quiz",
    timeStr: "03:30 PM",
    status: "scheduled",
    scheduledAt: "2026-10-24T15:30:00",
    quizTopicId: "acids-bases",
  },
  {
    id: "evt-7",
    day: 29,
    dateStr: "Oct 29, 2026",
    title: "Class 10 CBSE Full Syllabus Pre-Board Mock #1",
    subject: "Combined Science",
    durationMinutes: 120,
    questionsCount: 60,
    type: "mock",
    timeStr: "10:00 AM",
    status: "scheduled",
    scheduledAt: "2026-10-29T10:00:00",
    quizTopicId: "kepler-laws",
  },
];

let scheduleItemsStore: ScheduleItem[] = [];

// ----------------------------------------------------------------------------
// 4. CBSE Class 10 Subjects & Curriculum
// ----------------------------------------------------------------------------
const SUBJECTS_DATA: SubjectItem[] = [
  {
    id: "physics",
    title: "Physics",
    displayTitle: "Physics",
    code: "PHYS-10",
    category: "Core Science",
    themeGradient: "from-slate-800 via-slate-900 to-slate-950",
    iconType: "physics",
    chaptersCount: 5,
    chapters: [
      { id: "phys-1", number: 1, title: "Light – Reflection and Refraction", description: "Spherical mirrors, mirror formula, refraction laws, lenses, and lens formula.", durationMinutes: 45, topicId: "light-reflection", hasQuiz: true },
      { id: "phys-2", number: 2, title: "The Human Eye and the Colourful World", description: "Structure of human eye, vision defects, prism refraction, dispersion, and atmospheric scattering.", durationMinutes: 40, topicId: "human-eye", hasQuiz: true },
      { id: "phys-3", number: 3, title: "Electricity", description: "Ohm's law, resistance, series and parallel circuits, electric power, and Joule heating.", durationMinutes: 50, topicId: "electricity", hasQuiz: true },
      { id: "phys-4", number: 4, title: "Magnetic Effects of Electric Current", description: "Magnetic field lines, right-hand thumb rule, solenoid, force on current-carrying conductor, and domestic circuits.", durationMinutes: 50, topicId: "magnetic-effects", hasQuiz: true },
      { id: "phys-5", number: 5, title: "Sources of Energy", description: "Conventional and non-conventional energy sources, solar energy, biogas, and nuclear hazards.", durationMinutes: 35, topicId: "sources-energy", hasQuiz: true },
    ],
  },
  {
    id: "chemistry",
    title: "Chemistry",
    displayTitle: "Chemistry",
    code: "CHEM-10",
    category: "Core Science",
    themeGradient: "from-slate-800 via-slate-900 to-slate-950",
    iconType: "flask",
    chaptersCount: 5,
    chapters: [
      { id: "chem-1", number: 1, title: "Chemical Reactions and Equations", description: "Balancing equations, combination, decomposition, displacement, double displacement, redox, corrosion.", durationMinutes: 45, topicId: "chem-reactions", hasQuiz: true },
      { id: "chem-2", number: 2, title: "Acids, Bases and Salts", description: "Properties of acids/bases, pH scale, preparation and uses of sodium compounds and bleaching powder.", durationMinutes: 50, topicId: "acids-bases", hasQuiz: true },
      { id: "chem-3", number: 3, title: "Metals and Non-metals", description: "Physical & chemical properties, reactivity series, ionic bond formation, and metallurgy.", durationMinutes: 45, topicId: "metals-nonmetals", hasQuiz: true },
      { id: "chem-4", number: 4, title: "Carbon and Its Compounds", description: "Covalent bonding, homologous series, functional groups, combustion, oxidation, and soaps.", durationMinutes: 55, topicId: "carbon-compounds", hasQuiz: true },
      { id: "chem-5", number: 5, title: "Periodic Classification of Elements", description: "Mendeleev's periodic table, modern periodic table trends (valency, atomic size, metallic character).", durationMinutes: 40, topicId: "periodic-table", hasQuiz: true },
    ],
  },
  {
    id: "biology",
    title: "Biology",
    displayTitle: "Biology",
    code: "BIO-10",
    category: "Core Science",
    themeGradient: "from-slate-800 via-slate-900 to-slate-950",
    iconType: "dna",
    chaptersCount: 4,
    chapters: [
      { id: "bio-1", number: 1, title: "Life Processes", description: "Nutrition (autotrophic & heterotrophic), respiration, transportation in humans and plants, and excretion.", durationMinutes: 55, topicId: "life-processes", hasQuiz: true },
      { id: "bio-2", number: 2, title: "Control and Coordination", description: "Nervous system, reflex arc, human brain structure, plant hormones, and animal hormones.", durationMinutes: 45, topicId: "control-coordination", hasQuiz: true },
      { id: "bio-3", number: 3, title: "How do Organisms Reproduce?", description: "Asexual vs sexual reproduction, floral reproductive parts, human reproductive health and puberty.", durationMinutes: 50, topicId: "reproduction", hasQuiz: true },
      { id: "bio-4", number: 4, title: "Heredity and Evolution", description: "Mendelian inheritance, monohybrid/dihybrid crosses, sex determination, and speciation basics.", durationMinutes: 40, topicId: "heredity", hasQuiz: true },
    ],
  },
  {
    id: "mathematics",
    title: "Mathematics",
    displayTitle: "Mathematics",
    code: "MATH-10",
    category: "Mathematics",
    themeGradient: "from-slate-800 via-slate-900 to-slate-950",
    iconType: "pi",
    chaptersCount: 14,
    chapters: [
      { id: "math-1", number: 1, title: "Real Numbers", description: "Fundamental Theorem of Arithmetic, proof of irrationality, decimal expansions.", durationMinutes: 40, topicId: "real-numbers", hasQuiz: true },
      { id: "math-2", number: 2, title: "Polynomials", description: "Zeros of polynomials, relationship between zeros and coefficients, division algorithm.", durationMinutes: 45, topicId: "polynomials", hasQuiz: true },
      { id: "math-3", number: 3, title: "Pair of Linear Equations in Two Variables", description: "Graphical method, substitution, elimination, and cross-multiplication solutions.", durationMinutes: 50, topicId: "linear-equations", hasQuiz: true },
      { id: "math-4", number: 4, title: "Quadratic Equations", description: "Standard form, factorization, quadratic formula (discriminant), nature of roots.", durationMinutes: 45, topicId: "quadratic-equations", hasQuiz: true },
      { id: "math-5", number: 5, title: "Arithmetic Progressions", description: "nth term formula, sum of first n terms, contextual word problems.", durationMinutes: 45, topicId: "arithmetic-progressions", hasQuiz: true },
      { id: "math-6", number: 6, title: "Triangles", description: "Similarity theorems, Basic Proportionality Theorem (Thales), Pythagoras theorem proofs.", durationMinutes: 55, topicId: "triangles", hasQuiz: true },
      { id: "math-7", number: 7, title: "Coordinate Geometry", description: "Distance formula, section formula, area of triangle using coordinate vertices.", durationMinutes: 40, topicId: "coordinate-geometry", hasQuiz: true },
      { id: "math-8", number: 8, title: "Introduction to Trigonometry", description: "Trigonometric ratios of acute angles, values at 0°, 30°, 45°, 60°, 90°, basic identities.", durationMinutes: 50, topicId: "intro-trigonometry", hasQuiz: true },
      { id: "math-9", number: 9, title: "Some Applications of Trigonometry", description: "Heights and distances, angles of elevation and depression, double observation problems.", durationMinutes: 45, topicId: "trig-applications", hasQuiz: true },
      { id: "math-10", number: 10, title: "Circles", description: "Tangent to a circle, theorems on tangent lengths from an external point.", durationMinutes: 40, topicId: "circles", hasQuiz: true },
      { id: "math-11", number: 11, title: "Areas Related to Circles", description: "Area of sectors, segments of circles, combination of plane figures.", durationMinutes: 40, topicId: "areas-circles", hasQuiz: true },
      { id: "math-12", number: 12, title: "Surface Areas and Volumes", description: "Combinations of solids (cubes, cuboids, spheres, cylinders, cones), conversion of solids.", durationMinutes: 50, topicId: "surface-areas-volumes", hasQuiz: true },
      { id: "math-13", number: 13, title: "Statistics", description: "Mean, median, and mode of grouped data, cumulative frequency graphs (ogives).", durationMinutes: 45, topicId: "statistics", hasQuiz: true },
      { id: "math-14", number: 14, title: "Probability", description: "Theoretical probability, mutually exclusive events, coins, dice, and deck cards.", durationMinutes: 35, topicId: "probability", hasQuiz: true },
    ],
  },
];

// ----------------------------------------------------------------------------
// 5. Revision Notes & Flashcard Topic Knowledgebase
// ----------------------------------------------------------------------------
const TOPIC_REVISION_DATA: Record<
  string,
  {
    topicTitle: string;
    flashcards: FlashcardItem[];
    revisionNotes: RevisionNotesData;
  }
> = {
  "kepler-laws": {
    topicTitle: "Kepler's 3 Laws of Planetary Motion",
    flashcards: [
      {
        id: "fc_1",
        question: "What does Kepler's 1st Law (Law of Ellipses) state?",
        answer: "All planets move in elliptical orbits with the Sun located at one of the two foci.",
        hint: "Recall: Not a circle, but an ellipse with eccentricity 0 ≤ e < 1.",
      },
      {
        id: "fc_2",
        question: "What conservation principle governs Kepler's 2nd Law (Equal Areas)?",
        answer: "Conservation of Angular Momentum (L = r × p = constant) under central gravitational force.",
        hint: "Areal velocity dA/dt = L / (2m).",
      },
      {
        id: "fc_3",
        question: "What is Kepler's 3rd Law harmonic formula?",
        answer: "T² ∝ a³, where T is orbital period and a is the semi-major axis.",
        hint: "T² = (4π² / GM) a³.",
      },
    ],
    revisionNotes: {
      summary: "Johannes Kepler formulated three empirical laws of celestial mechanics, foundational to Newton's universal gravitation.",
      keyPoints: [
        "1st Law: Planar elliptical orbits with Sun at one focus.",
        "2nd Law: A line joining a planet and the Sun sweeps equal areas in equal intervals of time.",
        "3rd Law: The square of orbital period T is directly proportional to the cube of semi-major axis a.",
      ],
      formulas: [
        "T^2 = \\frac{4\\pi^2}{GM} a^3",
        "\\frac{dA}{dt} = \\frac{L}{2m} = \\text{constant}",
      ],
    },
  },
  "light-reflection": {
    topicTitle: "Light – Reflection and Refraction",
    flashcards: [
      {
        id: "fc_lr_1",
        question: "What is the Mirror Formula relating focal length f, image distance v, and object distance u?",
        answer: "1/f = 1/v + 1/u (with Cartesian sign conventions).",
        hint: "Compare with lens formula which has a minus sign.",
      },
      {
        id: "fc_lr_2",
        question: "What does Snell's Law of Refraction state?",
        answer: "sin(i) / sin(r) = constant = n2 / n1 (the refractive index of the second medium relative to the first).",
        hint: "Ratio of sine of angle of incidence to sine of refraction.",
      },
      {
        id: "fc_lr_3",
        question: "What is the Lens Formula and power of a lens P?",
        answer: "1/f = 1/v - 1/u, and Power P = 1 / f(in metres) measured in Dioptres (D).",
        hint: "Convex lens has positive power; concave lens has negative power.",
      },
    ],
    revisionNotes: {
      summary: "Light travels along rectilinear paths in homogeneous media and undergoes reflection at smooth surfaces and refraction across optical boundaries.",
      keyPoints: [
        "Mirror formula: 1/f = 1/v + 1/u; Magnification m = -v/u = h'/h.",
        "Lens formula: 1/f = 1/v - 1/u; Magnification m = +v/u = h'/h.",
        "Refractive Index n = c / v (speed of light in vacuum over speed in medium).",
        "Power of lens P = 1 / f (in metres), SI unit: Dioptre (D).",
      ],
      formulas: [
        "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",
        "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}",
        "P = \\frac{1}{f \\text{ (m)}}",
      ],
    },
  },
  "electricity": {
    topicTitle: "Electricity & Circuit Laws",
    flashcards: [
      {
        id: "fc_el_1",
        question: "State Ohm's Law and its mathematical expression.",
        answer: "At constant temperature, electric current I is directly proportional to potential difference V: V = I × R.",
        hint: "V = IR.",
      },
      {
        id: "fc_el_2",
        question: "What is the equivalent resistance for two resistors R1 and R2 connected in parallel?",
        answer: "1/Rp = 1/R1 + 1/R2, or Rp = (R1 × R2) / (R1 + R2).",
        hint: "The total resistance is less than the smallest individual resistance.",
      },
      {
        id: "fc_el_3",
        question: "What is Joule's Law of Heating?",
        answer: "H = I² × R × t, where heat produced is proportional to square of current, resistance, and time.",
        hint: "H = I²Rt = VIt = (V²/R)t.",
      },
    ],
    revisionNotes: {
      summary: "Electricity examines charges in motion, electrical circuits, resistance, and energy dissipation.",
      keyPoints: [
        "Ohm's Law: V = IR at constant temperature.",
        "Resistivity formula: R = ρ × (l / A). Resistivity ρ depends strictly on material and temperature.",
        "Series: Rs = R1 + R2 + ... (current is constant).",
        "Parallel: 1/Rp = 1/R1 + 1/R2 + ... (voltage is constant).",
        "Electric Power: P = VI = I²R = V²/R (measured in Watts).",
      ],
      formulas: [
        "V = IR",
        "R = \\rho \\frac{l}{A}",
        "H = I^2 R t",
        "P = VI = \\frac{V^2}{R}",
      ],
    },
  },
  "real-numbers": {
    topicTitle: "Real Numbers",
    flashcards: [
      {
        id: "fc_rn_1",
        question: "State the Fundamental Theorem of Arithmetic.",
        answer: "Every composite number can be uniquely expressed as a product of prime factors, apart from the order in which prime factors occur.",
        hint: "n = p1^a1 * p2^a2 * ...",
      },
      {
        id: "fc_rn_2",
        question: "For two positive integers a and b, what is the relation between HCF and LCM?",
        answer: "HCF(a, b) × LCM(a, b) = a × b.",
        hint: "Product of HCF and LCM equals product of the numbers.",
      },
      {
        id: "fc_rn_3",
        question: "Why is √2 an irrational number?",
        answer: "Proof by contradiction: Assuming √2 = p/q (co-prime integers) forces 2 | p² and 2 | q², contradicting their co-prime nature.",
        hint: "Common factor of 2 emerges.",
      },
    ],
    revisionNotes: {
      summary: "Real numbers encompass rational and irrational values governed by prime factorization properties and decimal expansions.",
      keyPoints: [
        "Fundamental Theorem of Arithmetic guarantees unique prime factorization.",
        "For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b.",
        "A rational number p/q has a terminating decimal expansion iff q is of the form 2^m * 5^n (m, n non-negative integers).",
      ],
      formulas: [
        "\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b",
      ],
    },
  },
};

// ----------------------------------------------------------------------------
// 6. Quizzes & Tests Question Bank
// ----------------------------------------------------------------------------
const QUIZZES_DATA: Record<string, QuizDetail & { correctAnswers: Record<string, number> }> = {
  "kepler-laws": {
    id: "quiz-kepler-laws",
    topicTitle: "Kepler's 3 Laws of Planetary Motion",
    chapter: "Gravitation & Celestial Mechanics",
    subject: "Physics",
    durationMinutes: 5,
    questionCount: 3,
    questions: [
      {
        id: "q1",
        question: "According to Kepler's 1st Law, what shape do planetary orbits trace?",
        options: ["Perfect Circle", "Ellipse with the Sun at one focus", "Parabola", "Hyperbola"],
        explanation: "Kepler's First Law states all planets orbit the Sun in ellipses with the Sun located at one focus.",
      },
      {
        id: "q2",
        question: "Kepler's 2nd Law (Law of Equal Areas) is a direct consequence of which conservation law?",
        options: ["Conservation of Linear Momentum", "Conservation of Energy", "Conservation of Angular Momentum", "Conservation of Charge"],
        explanation: "Since gravity exerts a central force, the net torque is zero, which strictly conserves angular momentum (dA/dt = L / 2m).",
      },
      {
        id: "q3",
        question: "If a satellite's orbital radius is doubled (r' = 2r), by what factor does its orbital period T change according to Kepler's 3rd Law?",
        options: ["2 times", "2√2 (~2.83) times", "4 times", "8 times"],
        explanation: "Since T² ∝ r³, T' = (2)^(3/2) T = 2√2 T.",
      },
    ],
    correctAnswers: {
      q1: 1, // Ellipse with the Sun at one focus
      q2: 2, // Conservation of Angular Momentum
      q3: 1, // 2√2 (~2.83) times
    },
  },
  "light-reflection": {
    id: "quiz-light-reflection",
    topicTitle: "Light – Reflection and Refraction",
    chapter: "Light",
    subject: "Physics",
    durationMinutes: 10,
    questionCount: 4,
    questions: [
      {
        id: "q_lr_1",
        question: "An object is placed at the centre of curvature C of a concave mirror. Where is the image formed?",
        options: ["At the focus F", "Between F and C", "At the centre of curvature C", "Behind the mirror"],
        explanation: "When placed at C, the image is formed at C, real, inverted, and of the same size.",
      },
      {
        id: "q_lr_2",
        question: "Which of the following lens formulas is correct?",
        options: ["1/f = 1/v + 1/u", "1/f = 1/v - 1/u", "1/v = 1/f - 1/u", "m = -v/u"],
        explanation: "The lens formula is 1/f = 1/v - 1/u with standard Cartesian sign convention.",
      },
      {
        id: "q_lr_3",
        question: "What is the unit of power of a lens?",
        options: ["Watt", "Dioptre", "Lumen", "Metre"],
        explanation: "Power of a lens is expressed in Dioptres (D), where 1 D = 1 m⁻¹.",
      },
      {
        id: "q_lr_4",
        question: "A ray of light enters from air into glass. How do its speed and frequency change?",
        options: [
          "Speed decreases, frequency remains constant",
          "Speed increases, frequency decreases",
          "Both speed and frequency decrease",
          "Speed remains constant, wavelength decreases",
        ],
        explanation: "Frequency depends only on the source and remains constant; speed and wavelength decrease in a denser medium.",
      },
    ],
    correctAnswers: {
      q_lr_1: 2,
      q_lr_2: 1,
      q_lr_3: 1,
      q_lr_4: 0,
    },
  },
  "electricity": {
    id: "quiz-electricity",
    topicTitle: "Electricity",
    chapter: "Electricity",
    subject: "Physics",
    durationMinutes: 10,
    questionCount: 3,
    questions: [
      {
        id: "q_el_1",
        question: "What is the equivalent resistance when two 6 Ω resistors are connected in parallel?",
        options: ["12 Ω", "6 Ω", "3 Ω", "1.5 Ω"],
        explanation: "1/Rp = 1/6 + 1/6 = 2/6 = 1/3, so Rp = 3 Ω.",
      },
      {
        id: "q_el_2",
        question: "According to Joule's heating law, heat generated in a conductor is proportional to:",
        options: ["Current I", "Square of current I²", "Square root of current √I", "Inverse of current 1/I"],
        explanation: "H = I²Rt, meaning heat is proportional to the square of current.",
      },
      {
        id: "q_el_3",
        question: "If a wire is stretched to double its length keeping volume constant, its resistance becomes:",
        options: ["Double (2R)", "Quadruple (4R)", "Half (R/2)", "Same (R)"],
        explanation: "When length doubles, area halves (A' = A/2). Hence R' = ρ(2l)/(A/2) = 4ρl/A = 4R.",
      },
    ],
    correctAnswers: {
      q_el_1: 2,
      q_el_2: 1,
      q_el_3: 1,
    },
  },
  "chem-reactions": {
    id: "quiz-chem-reactions",
    topicTitle: "Balancing Redox and Displacement Reactions",
    chapter: "Chemical Reactions and Equations",
    subject: "Chemistry",
    durationMinutes: 10,
    questionCount: 3,
    questions: [
      {
        id: "q_cr_1",
        question: "In the reaction: CuO + H₂ → Cu + H₂O, which substance acts as the reducing agent?",
        options: ["CuO", "H₂", "Cu", "H₂O"],
        explanation: "H₂ gains oxygen to form H₂O and is oxidized, making it the reducing agent.",
      },
      {
        id: "q_cr_2",
        question: "When an iron nail is dipped in copper sulfate (CuSO₄) solution, what is the observed color change?",
        options: ["Blue to pale green with brown deposit", "Blue to colorless", "Green to blue", "No change occurs"],
        explanation: "Iron displaces copper (Fe + CuSO₄ → FeSO₄ + Cu). The blue solution turns pale green (FeSO₄) and reddish-brown copper deposits on the iron.",
      },
      {
        id: "q_cr_3",
        question: "Which of the following equations is correctly balanced?",
        options: [
          "2Fe + 3H₂O → Fe₂O₃ + 3H₂",
          "3Fe + 4H₂O → Fe₃O₄ + 4H₂",
          "Fe + H₂O → FeO + H₂",
          "4Fe + 3O₂ → 2Fe₂O₃ + H₂O",
        ],
        explanation: "3Fe + 4H₂O → Fe₃O₄ + 4H₂ is the correctly balanced equation for the reaction of iron with steam.",
      },
    ],
    correctAnswers: {
      q_cr_1: 1,
      q_cr_2: 0,
      q_cr_3: 1,
    },
  },
  "real-numbers": {
    id: "quiz-real-numbers",
    topicTitle: "Real Numbers: Prime Factorization & HCF-LCM Proofs",
    chapter: "Real Numbers",
    subject: "Mathematics",
    durationMinutes: 10,
    questionCount: 3,
    questions: [
      {
        id: "q_rn_1",
        question: "If HCF(306, 657) = 9, what is LCM(306, 657)?",
        options: ["22338", "21338", "22448", "19838"],
        explanation: "LCM(a, b) = (a × b) / HCF(a, b) = (306 × 657) / 9 = 22338.",
      },
      {
        id: "q_rn_2",
        question: "According to the Fundamental Theorem of Arithmetic, every composite number can be factored into:",
        options: [
          "Only even primes",
          "A unique product of prime numbers (apart from order)",
          "An arbitrary sum of integers",
          "Prime fractions",
        ],
        explanation: "The Fundamental Theorem of Arithmetic states every composite number can be uniquely expressed as a product of primes.",
      },
      {
        id: "q_rn_3",
        question: "The decimal expansion of 13 / 3125 will terminate after how many decimal places?",
        options: ["5 places", "4 places", "3 places", "Non-terminating"],
        explanation: "3125 = 5⁵. Since denominator is 2⁰ × 5⁵, the expansion terminates after 5 places.",
      },
    ],
    correctAnswers: {
      q_rn_1: 0,
      q_rn_2: 1,
      q_rn_3: 0,
    },
  },
  "orbital-velocity": {
    id: "quiz-orbital-velocity",
    topicTitle: "Orbital Velocity & Satellite Dynamics",
    chapter: "Gravitation & Satellites",
    subject: "Physics",
    durationMinutes: 10,
    questionCount: 5,
    questions: [
      {
        id: "q_ov_1",
        question: "What is the circular orbital speed formula for a satellite at radius r around a planet of mass M?",
        options: ["v = √(2GM/r)", "v = √(GM/r)", "v = GM/r²", "v = √(GM/2r)"],
        explanation: "Equating centripetal force mv²/r with gravitational force GMm/r² yields v = √(GM/r).",
      },
      {
        id: "q_ov_2",
        question: "If a satellite's mass is doubled, what happens to its orbital speed at the same radius?",
        options: ["It doubles", "It quadruples", "It remains unchanged", "It increases by √2"],
        explanation: "Orbital velocity v = √(GM/r) is independent of the mass of the satellite.",
      },
      {
        id: "q_ov_3",
        question: "What is the ratio of escape velocity v_e to circular orbital velocity v_o at the same radius?",
        options: ["1 : 1", "√2 : 1", "2 : 1", "1 : √2"],
        explanation: "v_e = √(2GM/r) while v_o = √(GM/r), giving v_e / v_o = √2.",
      },
      {
        id: "q_ov_4",
        question: "What is the orbital period T of a satellite in a circular orbit of radius r around mass M?",
        options: ["T = 2π√(r³/GM)", "T = 2π√(GM/r³)", "T = 2πr/GM", "T = π√(r²/2GM)"],
        explanation: "T = 2πr / v = 2πr / √(GM/r) = 2π√(r³/GM).",
      },
      {
        id: "q_ov_5",
        question: "How does total mechanical energy E relate to kinetic energy K for a bound circular orbit?",
        options: ["E = K", "E = -K", "E = -2K", "E = 0"],
        explanation: "K = GMm/(2r), U = -GMm/r, so E = K + U = -GMm/(2r) = -K.",
      },
    ],
    correctAnswers: {
      q_ov_1: 1,
      q_ov_2: 2,
      q_ov_3: 1,
      q_ov_4: 0,
      q_ov_5: 1,
    },
  },
  "gravitational-practice": {
    id: "quiz-gravitational-practice",
    topicTitle: "Universal Gravitation & Field Theory",
    chapter: "Gravitation & Field Theory",
    subject: "Physics",
    durationMinutes: 10,
    questionCount: 4,
    questions: [
      {
        id: "q_gp_1",
        question: "At what altitude h above Earth's surface (radius R) does gravity decrease to g/4?",
        options: ["h = R", "h = 2R", "h = R/2", "h = 4R"],
        explanation: "g' = g / (1 + h/R)² = g/4 => 1 + h/R = 2 => h = R.",
      },
      {
        id: "q_gp_2",
        question: "What is the gravitational field intensity inside a uniform thin spherical shell?",
        options: ["GM/r²", "Zero everywhere inside the cavity", "-GM/R", "Infinite"],
        explanation: "By Shell's theorem, gravitational field inside a uniform spherical shell is zero everywhere.",
      },
      {
        id: "q_gp_3",
        question: "If Earth were to shrink to half its current radius while keeping mass constant, escape velocity would:",
        options: ["Halve", "Double", "Increase by factor of √2", "Remain unchanged"],
        explanation: "v_e = √(2GM/R). With R' = R/2, v_e' = √2 * v_e.",
      },
      {
        id: "q_gp_4",
        question: "How does acceleration due to gravity vary at depth d inside Earth?",
        options: ["g' = g(1 - d/R)", "g' = g(1 - 2d/R)", "g' = g/(1 - d/R)", "Constant"],
        explanation: "Inside Earth at depth d, g' = g(1 - d/R).",
      },
    ],
    correctAnswers: {
      q_gp_1: 0,
      q_gp_2: 1,
      q_gp_3: 2,
      q_gp_4: 0,
    },
  },
};

const customQuizzesStore: Record<string, QuizDetail & { correctAnswers: Record<string, number> }> = {};

// ----------------------------------------------------------------------------
// 7. Test Results History
// ----------------------------------------------------------------------------
let testResultsHistoryStore: TestResultData[] = [];

// ----------------------------------------------------------------------------
// 8. Score Booster Engine Store
// ----------------------------------------------------------------------------
let scoreBoosterState = {
  examName: "JEE Mains",
  currentMarks: 142,
  nextGoalMarks: 180,
  tasksCompleted: 14,
  tasksBreakdown: { easy: 10, moderate: 3, hard: 1 },
  characterPlatform: "lower" as "lower" | "jumping" | "higher",
};

let scoreBoosterTasksStore: ScoreBoosterTask[] = [
  {
    id: "task_101",
    title: "Master Mirror & Lens Formula Sign Conventions",
    subject: "Physics",
    difficulty: 1,
    completed: true,
    pointsValue: 4,
    actionLabel: "Practice Quiz",
    quizTarget: "/test?topic=light-reflection",
  },
  {
    id: "task_102",
    title: "Solve Resistor Combination Word Problems",
    subject: "Physics",
    difficulty: 2,
    completed: false,
    pointsValue: 4,
    actionLabel: "Practice Quiz",
    quizTarget: "/test?topic=electricity",
  },
  {
    id: "task_103",
    title: "Balancing Redox and Displacement Reactions",
    subject: "Chemistry",
    difficulty: 3,
    completed: false,
    pointsValue: 6,
    actionLabel: "Practice Quiz",
    quizTarget: "/test?topic=chem-reactions",
  },
  {
    id: "task_104",
    title: "Real Numbers: Prime Factorization & HCF-LCM Proofs",
    subject: "Mathematics",
    difficulty: 1,
    completed: false,
    pointsValue: 4,
    actionLabel: "Take Quiz",
    quizTarget: "/test?topic=real-numbers",
  },
];

// ----------------------------------------------------------------------------
// 9. Improvement Book (Mistakes Tracker)
// ----------------------------------------------------------------------------
let mistakesStore: LoggedMistake[] = [
  // Alex Chen (1003445542 / 10034455542)
  {
    id: "err_01",
    studentId: "10034455542",
    questionSnippet: "Find the equivalent resistance of two 6 Ω resistors in parallel.",
    subject: "Physics",
    errorCategory: "Calculation Error",
    correctAnswer: "3 Ω",
    studentAnswer: "12 Ω",
    reviewed: false,
  },
  {
    id: "err_02",
    studentId: "10034455542",
    questionSnippet: "State why a concave mirror forms a virtual image when the object is within the focal length.",
    subject: "Physics",
    errorCategory: "Conceptual",
    correctAnswer: "Reflected rays diverge and appear to meet behind the mirror.",
    studentAnswer: "Reflected rays converge in front of the mirror.",
    reviewed: false,
  },
  {
    id: "err_03",
    studentId: "10034455542",
    questionSnippet: "Balance the combustion reaction of propane: C3H8 + O2 -> CO2 + H2O.",
    subject: "Chemistry",
    errorCategory: "Calculation Error",
    correctAnswer: "C3H8 + 5O2 -> 3CO2 + 4H2O",
    studentAnswer: "C3H8 + 3O2 -> 3CO2 + 4H2O",
    reviewed: true,
  },

  // Ojus (1 / ojus)
  {
    id: "err_ojus_01",
    studentId: "1",
    questionSnippet: "Calculate the focal length of a convex lens with optical power +2.5 D.",
    subject: "Physics",
    errorCategory: "Calculation Error",
    correctAnswer: "+40 cm (+0.4 m)",
    studentAnswer: "+25 cm",
    reviewed: false,
  },
  {
    id: "err_ojus_02",
    studentId: "1",
    questionSnippet: "What color precipitate is formed when aqueous barium chloride reacts with sodium sulphate?",
    subject: "Chemistry",
    errorCategory: "Conceptual",
    correctAnswer: "White precipitate of Barium Sulphate (BaSO4)",
    studentAnswer: "Yellow precipitate",
    reviewed: true,
  },
  {
    id: "err_ojus_03",
    studentId: "1",
    questionSnippet: "Find the 10th term of the arithmetic progression: 2, 7, 12, ...",
    subject: "Mathematics",
    errorCategory: "Calculation Error",
    correctAnswer: "47",
    studentAnswer: "45",
    reviewed: false,
  },

  // Sneha Reddy (2 / sneha)
  {
    id: "err_sneha_01",
    studentId: "2",
    questionSnippet: "Which enzyme is present in human saliva that breaks down starch into maltose?",
    subject: "Biology",
    errorCategory: "Conceptual",
    correctAnswer: "Salivary Amylase (Ptyalin)",
    studentAnswer: "Pepsin",
    reviewed: false,
  },
  {
    id: "err_sneha_02",
    studentId: "2",
    questionSnippet: "According to Snell's Law, what is the refractive index ratio when light travels from air to water?",
    subject: "Physics",
    errorCategory: "Time Pressure",
    correctAnswer: "n = sin(i) / sin(r)",
    studentAnswer: "n = sin(r) / sin(i)",
    reviewed: false,
  },
  {
    id: "err_sneha_03",
    studentId: "2",
    questionSnippet: "What is the nature of the roots for the quadratic equation 2x² - 4x + 3 = 0?",
    subject: "Mathematics",
    errorCategory: "Conceptual",
    correctAnswer: "No real roots (Discriminant D = -8 < 0)",
    studentAnswer: "Two equal real roots",
    reviewed: true,
  },
];

// ----------------------------------------------------------------------------
// 10. Sample Papers & PYQs
// ----------------------------------------------------------------------------
let PAPERS_STORE: PastExamPaper[] = [
  {
    id: "cbse_10_chem_2023_sqp",
    title: "CBSE Class 10 Chemistry Official Sample Paper 2023-24",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-SQP-2023-24",
    solutionUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-Marking-Scheme-2023-24",
    subject: "chemistry",
    type: "sample",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_chem_2024_sqp",
    title: "CBSE Class 10 Chemistry Official Sample Paper 2024-25",
    year: 2025,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-SQP-2024-25",
    solutionUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-Marking-Scheme-2024-25",
    subject: "chemistry",
    type: "sample",
    academicYear: "2024-25",
  },
  {
    id: "cbse_10_chem_2023_pyq",
    title: "CBSE Class 10 Chemistry Board Exam Paper 2023-24",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-PYQ-2023-24",
    solutionUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-PYQ-Solutions-2023-24",
    subject: "chemistry",
    type: "pyq",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_phys_2023_sqp",
    title: "CBSE Class 10 Physics Official Sample Paper 2023-24",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Physics&title=CBSE-Class-10-Physics-SQP-2023-24",
    solutionUrl: "/api/pdf?subject=Physics&title=CBSE-Class-10-Physics-Marking-Scheme-2023-24",
    subject: "physics",
    type: "sample",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_sci_2025_sqp",
    title: "CBSE Class 10 Science Official Sample Paper 2024-25",
    year: 2025,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-SQP-2025",
    solutionUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-Marking-Scheme",
    subject: "science",
    type: "sample",
    academicYear: "2024-25",
  },
  {
    id: "cbse_10_math_2025_sqp",
    title: "CBSE Class 10 Mathematics Standard Official SQP 2024-25",
    year: 2025,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-SQP-2025",
    solutionUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-Marking-Scheme",
    subject: "maths-standard",
    type: "sample",
    academicYear: "2024-25",
  },
  {
    id: "cbse_10_sci_2024_pyq",
    title: "CBSE Class 10 Science Board Exam 2024 (Set 1)",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-2024-Set-1",
    solutionUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-2024-Solutions",
    subject: "science",
    type: "pyq",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_sci_2023_pyq",
    title: "CBSE Class 10 Science Board Exam 2023 (Set 1)",
    year: 2023,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-2023-Set-1",
    solutionUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-2023-Solutions",
    subject: "science",
    type: "pyq",
    academicYear: "2022-23",
  },
  {
    id: "cbse_10_sci_2022_pyq",
    title: "CBSE Class 10 Science Term II Board Exam 2022",
    year: 2022,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-2022-Term-2",
    solutionUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-2022-Solutions",
    subject: "science",
    type: "pyq",
    academicYear: "2021-22",
  },
  {
    id: "cbse_10_chem_2022_pyq",
    title: "CBSE Class 10 Chemistry Board Exam Paper 2022-23",
    year: 2023,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-PYQ-2022-23",
    solutionUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-PYQ-Solutions-2022-23",
    subject: "chemistry",
    type: "pyq",
    academicYear: "2022-23",
  },
  {
    id: "cbse_10_chem_2021_pyq",
    title: "CBSE Class 10 Chemistry Term II Board Paper 2021-22",
    year: 2022,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-PYQ-2021-22",
    solutionUrl: "/api/pdf?subject=Chemistry&title=CBSE-Class-10-Chemistry-PYQ-Solutions-2021-22",
    subject: "chemistry",
    type: "pyq",
    academicYear: "2021-22",
  },
  {
    id: "cbse_10_phys_2023_pyq",
    title: "CBSE Class 10 Physics Board Exam Paper 2023-24",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Physics&title=CBSE-Class-10-Physics-PYQ-2023-24",
    solutionUrl: "/api/pdf?subject=Physics&title=CBSE-Class-10-Physics-PYQ-Solutions-2023-24",
    subject: "physics",
    type: "pyq",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_phys_2022_pyq",
    title: "CBSE Class 10 Physics Board Exam Paper 2022-23",
    year: 2023,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Physics&title=CBSE-Class-10-Physics-PYQ-2022-23",
    solutionUrl: "/api/pdf?subject=Physics&title=CBSE-Class-10-Physics-PYQ-Solutions-2022-23",
    subject: "physics",
    type: "pyq",
    academicYear: "2022-23",
  },
  {
    id: "cbse_10_bio_2023_pyq",
    title: "CBSE Class 10 Biology Board Exam Paper 2023-24",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Biology&title=CBSE-Class-10-Biology-PYQ-2023-24",
    solutionUrl: "/api/pdf?subject=Biology&title=CBSE-Class-10-Biology-PYQ-Solutions-2023-24",
    subject: "biology",
    type: "pyq",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_bio_2022_pyq",
    title: "CBSE Class 10 Biology Board Exam Paper 2022-23",
    year: 2023,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Biology&title=CBSE-Class-10-Biology-PYQ-2022-23",
    solutionUrl: "/api/pdf?subject=Biology&title=CBSE-Class-10-Biology-PYQ-Solutions-2022-23",
    subject: "biology",
    type: "pyq",
    academicYear: "2022-23",
  },
  {
    id: "cbse_10_math_std_2023_pyq",
    title: "CBSE Class 10 Mathematics Standard Board Exam 2023-24 (Set 1)",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-Std-PYQ-2023-24",
    solutionUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-Std-Solutions-2023-24",
    subject: "maths-standard",
    type: "pyq",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_math_std_2022_pyq",
    title: "CBSE Class 10 Mathematics Standard Board Exam 2022-23",
    year: 2023,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-Std-PYQ-2022-23",
    solutionUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-Std-Solutions-2022-23",
    subject: "maths-standard",
    type: "pyq",
    academicYear: "2022-23",
  },
  {
    id: "cbse_10_math_bsc_2023_pyq",
    title: "CBSE Class 10 Mathematics Basic Board Exam 2023-24 (Set 1)",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-Basic-PYQ-2023-24",
    solutionUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-Basic-Solutions-2023-24",
    subject: "maths-basic",
    type: "pyq",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_sst_2023_pyq",
    title: "CBSE Class 10 Social Science Board Exam 2023-24 (Set 1)",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=Social-Science&title=CBSE-Class-10-SST-PYQ-2023-24",
    solutionUrl: "/api/pdf?subject=Social-Science&title=CBSE-Class-10-SST-Solutions-2023-24",
    subject: "sst",
    type: "pyq",
    academicYear: "2023-24",
  },
  {
    id: "cbse_10_eng_2023_pyq",
    title: "CBSE Class 10 English Language & Literature Board Exam 2023-24",
    year: 2024,
    exam: "CBSE Class 10",
    pdfUrl: "/api/pdf?subject=English&title=CBSE-Class-10-English-PYQ-2023-24",
    solutionUrl: "/api/pdf?subject=English&title=CBSE-Class-10-English-Solutions-2023-24",
    subject: "english",
    type: "pyq",
    academicYear: "2023-24",
  },
];

// ----------------------------------------------------------------------------
// 11. AI Assistant & Doubt Solver Store
// ----------------------------------------------------------------------------
const chatSessionsStore: Record<string, ChatMessage[]> = {};
let resolvedDoubtsStore: ResolvedDoubt[] = [
  {
    id: "doubt_01",
    query: "Why do planets move in ellipses instead of perfect circles?",
    mode: "socratic",
    answerSnippet: "Under an inverse-square gravitational force, the general bound orbit solution of the two-body central force problem is an ellipse with eccentricity 0 ≤ e < 1.",
    timestamp: "10:15 AM",
    latexFormulas: ["\\frac{d^2 u}{d\\theta^2} + u = \\frac{GMm^2}{L^2}"],
    subject: "Physics",
  },
  {
    id: "doubt_02",
    query: "What is the difference between convex and concave lens focal points?",
    mode: "detailed",
    answerSnippet: "A convex lens is converging: parallel rays physically intersect at a real principal focus (f > 0). A concave lens is diverging: rays appear to diverge from a virtual focus (f < 0).",
    timestamp: "Yesterday",
    latexFormulas: ["\\frac{1}{f} = (n - 1) \\left( \\frac{1}{R_1} - \\frac{1}{R_2} \\right)"],
    subject: "Physics",
  },
];

// ----------------------------------------------------------------------------
// 12. Teachers, Student Tracking & Portal State
// ----------------------------------------------------------------------------
let teachersStore: TeacherProfile[] = [
  {
    id: "TEACH-101",
    name: "Prof. Sarah Jenkins",
    email: "sarah.jenkins@kepler.edu",
    role: "instructor",
    department: "Department of Natural Sciences",
    designation: "Head of Science & Physics Faculty",
    school: "Kepler International Academy",
    phone: "+1 (555) 789-0123",
  },
  {
    id: "TEACH-102",
    name: "Dr. Rajesh Verma",
    email: "rajesh.verma@kepler.edu",
    role: "instructor",
    department: "Mathematics & Computational Sciences",
    designation: "Head of Mathematics Faculty",
    school: "Kepler International Academy",
    phone: "+1 (555) 789-0124",
  },
];

let teacherStudentsStore: TeacherStudentDetail[] = [
  {
    id: "1",
    name: "Ojus",
    email: "ojus@kepler.edu",
    grade: "Grade 10",
    section: "10A",
    overallScorePercentage: 92,
    tasksCompleted: 14,
    totalAssignedTasks: 15,
    chaptersCompleted: 11,
    totalChapters: 12,
    scoreBoosterMarks: 168,
    scoreBoosterGoal: 180,
    attendancePercentage: 98,
    timeSpentHours: 48.0,
    lastActive: "Today at 10:15 AM",
    performanceBand: "high",
    teacherRankOutOf10: 9,
    teacherRemarks: "Exceptional conceptual clarity in Newtonian Mechanics and Kepler's Laws. Very consistent problem-solving approach.",
    subjects: [
      { subject: "Physics", scorePercentage: 94, quizzesTaken: 8, averageAccuracy: 94, status: "ahead" },
      { subject: "Chemistry", scorePercentage: 90, quizzesTaken: 7, averageAccuracy: 90, status: "ahead" },
      { subject: "Biology", scorePercentage: 91, quizzesTaken: 6, averageAccuracy: 91, status: "ahead" },
      { subject: "Mathematics", scorePercentage: 93, quizzesTaken: 8, averageAccuracy: 93, status: "ahead" },
    ],
    testHistory: [
      { testId: "test-o1", title: "Kepler's 3 Laws & Gravitation", date: "Oct 11, 2026", subject: "Physics", score: 29, maxMarks: 30, accuracyPercentage: 97 },
      { testId: "test-o2", title: "Light: Reflection & Refraction", date: "Oct 06, 2026", subject: "Physics", score: 25, maxMarks: 25, accuracyPercentage: 100 },
    ],
    recentActivities: [
      { id: "act-o1", timestamp: "Today 10:15 AM", action: "Submitted Practice Quiz", category: "quiz", detail: "Scored 29/30 on Kepler's 3 Laws & Gravitation" },
      { id: "act-o2", timestamp: "Yesterday 04:15 PM", action: "Completed Score Booster Task", category: "booster", detail: "Mastered Mirror & Lens Formula Conventions (+4 pts)" },
    ],
    completedChapterList: [
      "Light – Reflection and Refraction",
      "Electricity & Circuit Laws",
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Life Processes",
      "Control and Coordination",
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations",
      "Quadratic Equations",
    ],
    weakTopics: ["Parallel Resistor Calculations", "Redox Equations Balancing"],
    strongTopics: ["Planetary Mechanics & Kepler's Laws", "Spherical Mirror Formulas", "Life Processes Nutrition"],
    notesHistory: [
      { date: "Oct 05, 2026", author: "Prof. Sarah Jenkins", note: "Student demonstrates strong intuition for astronomical mechanics." },
    ],
  },
  {
    id: "2",
    name: "Sneha Reddy",
    email: "sneha.reddy@kepler.edu",
    grade: "Grade 10",
    section: "10A",
    overallScorePercentage: 96,
    tasksCompleted: 15,
    totalAssignedTasks: 15,
    chaptersCompleted: 12,
    totalChapters: 12,
    scoreBoosterMarks: 176,
    scoreBoosterGoal: 180,
    attendancePercentage: 99,
    timeSpentHours: 59.5,
    lastActive: "Today at 09:20 AM",
    performanceBand: "high",
    teacherRankOutOf10: 10,
    teacherRemarks: "Top ranker with exceptional precision in Ray diagrams, Chemical kinetics, and Trigonometry. Ready for CBSE Mock Series.",
    subjects: [
      { subject: "Physics", scorePercentage: 97, quizzesTaken: 9, averageAccuracy: 97, status: "ahead" },
      { subject: "Chemistry", scorePercentage: 95, quizzesTaken: 8, averageAccuracy: 95, status: "ahead" },
      { subject: "Biology", scorePercentage: 96, quizzesTaken: 7, averageAccuracy: 96, status: "ahead" },
      { subject: "Mathematics", scorePercentage: 96, quizzesTaken: 8, averageAccuracy: 96, status: "ahead" },
    ],
    testHistory: [
      { testId: "test-s1", title: "Class 10 Science Comprehensive Mock", date: "Oct 10, 2026", subject: "Science", score: 78, maxMarks: 80, accuracyPercentage: 98 },
      { testId: "test-s2", title: "Optics & Lens Derivations", date: "Oct 04, 2026", subject: "Physics", score: 25, maxMarks: 25, accuracyPercentage: 100 },
    ],
    recentActivities: [
      { id: "act-s1", timestamp: "Today 09:20 AM", action: "Flipped Flashcards Deck", category: "study", detail: "Reviewed all 20 flashcards for Metals & Non-Metals" },
      { id: "act-s2", timestamp: "Oct 10 03:00 PM", action: "Completed Mock Exam", category: "quiz", detail: "Scored 78/80 in Science Comprehensive Mock" },
    ],
    completedChapterList: [
      "Light – Reflection and Refraction",
      "Electricity & Circuit Laws",
      "Magnetic Effects of Electric Current",
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Life Processes",
      "Control and Coordination",
      "How do Organisms Reproduce?",
      "Real Numbers",
      "Polynomials",
      "Quadratic Equations",
    ],
    weakTopics: ["Magnetic flux density units"],
    strongTopics: ["Ray Tracing", "Electrolysis", "Stoichiometry", "Trigonometric Identities"],
    notesHistory: [
      { date: "Oct 06, 2026", author: "Dr. Rajesh Verma", note: "Consistently excels in analytical problem-solving and rapid concept synthesis." },
    ],
  },
  {
    id: "10034455542",
    name: "Alex Chen",
    email: "alex.chen@kepler.edu",
    grade: "Grade 10",
    section: "10A",
    overallScorePercentage: 88,
    tasksCompleted: 13,
    totalAssignedTasks: 15,
    chaptersCompleted: 10,
    totalChapters: 12,
    scoreBoosterMarks: 142,
    scoreBoosterGoal: 180,
    attendancePercentage: 96,
    timeSpentHours: 42.5,
    lastActive: "Today at 09:40 AM",
    performanceBand: "high",
    teacherRankOutOf10: 9,
    teacherRemarks: "High conceptual clarity in Newtonian Mechanics and Kepler's Laws. Needs minor refinement in calculation speed.",
    subjects: [
      { subject: "Physics", scorePercentage: 92, quizzesTaken: 8, averageAccuracy: 92, status: "ahead" },
      { subject: "Chemistry", scorePercentage: 84, quizzesTaken: 6, averageAccuracy: 84, status: "on-track" },
      { subject: "Biology", scorePercentage: 88, quizzesTaken: 5, averageAccuracy: 88, status: "ahead" },
      { subject: "Mathematics", scorePercentage: 88, quizzesTaken: 7, averageAccuracy: 88, status: "on-track" },
    ],
    testHistory: [
      { testId: "test-01", title: "Kepler's 3 Laws & Gravitation", date: "Oct 11, 2026", subject: "Physics", score: 28, maxMarks: 30, accuracyPercentage: 93 },
      { testId: "test-02", title: "Light: Reflection & Refraction", date: "Oct 06, 2026", subject: "Physics", score: 24, maxMarks: 25, accuracyPercentage: 96 },
      { testId: "test-03", title: "Chemical Reactions & Equations", date: "Sep 28, 2026", subject: "Chemistry", score: 21, maxMarks: 25, accuracyPercentage: 84 },
    ],
    recentActivities: [
      { id: "act-1", timestamp: "Today 09:30 AM", action: "Submitted Practice Quiz", category: "quiz", detail: "Scored 28/30 on Kepler's 3 Laws & Gravitation" },
      { id: "act-2", timestamp: "Yesterday 04:15 PM", action: "Completed Score Booster Task", category: "booster", detail: "Mastered Mirror & Lens Formula Conventions (+4 pts)" },
      { id: "act-3", timestamp: "Oct 09 11:20 AM", action: "Consulted Allie AI Tutor", category: "doubt", detail: "Socratic inquiry on orbital angular momentum conservation" },
    ],
    completedChapterList: [
      "Light – Reflection and Refraction",
      "Electricity & Circuit Laws",
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Life Processes",
      "Control and Coordination",
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations",
      "Quadratic Equations",
    ],
    weakTopics: ["Parallel Resistor Calculations", "Redox Equations Balancing"],
    strongTopics: ["Planetary Mechanics & Kepler's Laws", "Spherical Mirror Formulas", "Life Processes Nutrition"],
    notesHistory: [
      { date: "Oct 05, 2026", author: "Prof. Sarah Jenkins", note: "Student demonstrates strong intuition for astronomical mechanics." },
    ],
  },
  {
    id: "10034455543",
    name: "Priya Sharma",
    email: "priya.sharma@kepler.edu",
    grade: "Grade 10",
    section: "10A",
    overallScorePercentage: 95,
    tasksCompleted: 15,
    totalAssignedTasks: 15,
    chaptersCompleted: 12,
    totalChapters: 12,
    scoreBoosterMarks: 172,
    scoreBoosterGoal: 180,
    attendancePercentage: 99,
    timeSpentHours: 58.0,
    lastActive: "Today at 08:15 AM",
    performanceBand: "high",
    teacherRankOutOf10: 10,
    teacherRemarks: "Top of the class. Outstanding accuracy in Optics ray diagrams and Chemical equilibrium. Ready for board exam mock series.",
    subjects: [
      { subject: "Physics", scorePercentage: 96, quizzesTaken: 9, averageAccuracy: 96, status: "ahead" },
      { subject: "Chemistry", scorePercentage: 94, quizzesTaken: 7, averageAccuracy: 94, status: "ahead" },
      { subject: "Biology", scorePercentage: 95, quizzesTaken: 6, averageAccuracy: 95, status: "ahead" },
      { subject: "Mathematics", scorePercentage: 95, quizzesTaken: 8, averageAccuracy: 95, status: "ahead" },
    ],
    testHistory: [
      { testId: "test-p1", title: "Class 10 Science Comprehensive Mock", date: "Oct 10, 2026", subject: "Science", score: 76, maxMarks: 80, accuracyPercentage: 95 },
      { testId: "test-p2", title: "Optics & Lens Derivations", date: "Oct 04, 2026", subject: "Physics", score: 25, maxMarks: 25, accuracyPercentage: 100 },
    ],
    recentActivities: [
      { id: "act-p1", timestamp: "Today 08:15 AM", action: "Flipped Flashcards Deck", category: "study", detail: "Reviewed all 20 flashcards for Metals & Non-Metals" },
      { id: "act-p2", timestamp: "Oct 10 03:00 PM", action: "Completed Mock Exam", category: "quiz", detail: "Scored 76/80 in Science Comprehensive Mock" },
    ],
    completedChapterList: [
      "Light – Reflection and Refraction",
      "Electricity & Circuit Laws",
      "Magnetic Effects of Electric Current",
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Life Processes",
      "Control and Coordination",
      "How do Organisms Reproduce?",
      "Real Numbers",
      "Polynomials",
      "Quadratic Equations",
    ],
    weakTopics: ["Magnetic flux density units"],
    strongTopics: ["Ray Tracing", "Electrolysis", "Stoichiometry", "Trigonometric Identities"],
  },
  {
    id: "10034455544",
    name: "Rohan Gupta",
    email: "rohan.gupta@kepler.edu",
    grade: "Grade 10",
    section: "10A",
    overallScorePercentage: 62,
    tasksCompleted: 7,
    totalAssignedTasks: 15,
    chaptersCompleted: 6,
    totalChapters: 12,
    scoreBoosterMarks: 110,
    scoreBoosterGoal: 180,
    attendancePercentage: 82,
    timeSpentHours: 24.5,
    lastActive: "2 days ago",
    performanceBand: "lagging",
    teacherRankOutOf10: 6,
    teacherRemarks: "Struggling with lens formula sign conventions and Cartesian coordinates. Scheduled for remedial problem set.",
    subjects: [
      { subject: "Physics", scorePercentage: 54, quizzesTaken: 5, averageAccuracy: 54, status: "needs-attention" },
      { subject: "Chemistry", scorePercentage: 65, quizzesTaken: 4, averageAccuracy: 65, status: "on-track" },
      { subject: "Biology", scorePercentage: 70, quizzesTaken: 4, averageAccuracy: 70, status: "on-track" },
      { subject: "Mathematics", scorePercentage: 59, quizzesTaken: 5, averageAccuracy: 59, status: "needs-attention" },
    ],
    testHistory: [
      { testId: "test-r1", title: "Light: Mirrors & Lenses", date: "Oct 05, 2026", subject: "Physics", score: 13, maxMarks: 25, accuracyPercentage: 52 },
      { testId: "test-r2", title: "Real Numbers & Polynomials", date: "Sep 22, 2026", subject: "Mathematics", score: 15, maxMarks: 25, accuracyPercentage: 60 },
    ],
    recentActivities: [
      { id: "act-r1", timestamp: "Oct 09 02:10 PM", action: "Mistake Logged", category: "quiz", detail: "Fumbled focal length sign conventions for concave mirrors" },
    ],
    completedChapterList: ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Life Processes", "Real Numbers"],
    weakTopics: ["Mirror & Lens Sign Conventions", "Quadratic Formula Discriminant", "Ohm's Law Graph Interpretation"],
    strongTopics: ["Acid Base Neutralization", "Digestive System"],
  },
  {
    id: "10034455545",
    name: "Ananya Patel",
    email: "ananya.patel@kepler.edu",
    grade: "Grade 10",
    section: "10B",
    overallScorePercentage: 81,
    tasksCompleted: 11,
    totalAssignedTasks: 15,
    chaptersCompleted: 9,
    totalChapters: 12,
    scoreBoosterMarks: 145,
    scoreBoosterGoal: 180,
    attendancePercentage: 94,
    timeSpentHours: 39.0,
    lastActive: "Yesterday at 06:20 PM",
    performanceBand: "average",
    teacherRankOutOf10: 8,
    teacherRemarks: "Consistent worker. Strong in Biology and Chemistry; currently practicing Quadratic Equations and Word Problems.",
    subjects: [
      { subject: "Physics", scorePercentage: 78, quizzesTaken: 6, averageAccuracy: 78, status: "on-track" },
      { subject: "Chemistry", scorePercentage: 85, quizzesTaken: 6, averageAccuracy: 85, status: "ahead" },
      { subject: "Biology", scorePercentage: 89, quizzesTaken: 5, averageAccuracy: 89, status: "ahead" },
      { subject: "Mathematics", scorePercentage: 72, quizzesTaken: 6, averageAccuracy: 72, status: "on-track" },
    ],
    testHistory: [
      { testId: "test-a1", title: "Acids, Bases & Salts Review", date: "Oct 08, 2026", subject: "Chemistry", score: 22, maxMarks: 25, accuracyPercentage: 88 },
    ],
    recentActivities: [
      { id: "act-a1", timestamp: "Yesterday 06:20 PM", action: "Completed Revision Notes", category: "study", detail: "Reviewed Life Processes Derivations" },
    ],
    completedChapterList: ["Light – Reflection and Refraction", "Chemical Reactions and Equations", "Acids, Bases and Salts", "Life Processes", "Real Numbers", "Polynomials"],
    weakTopics: ["Quadratic Word Problems", "Electric Power Derivations"],
    strongTopics: ["pH Scale Applications", "Photosynthesis Stages"],
  },
  {
    id: "10034455546",
    name: "Aarav Singh",
    email: "aarav.singh@kepler.edu",
    grade: "Grade 10",
    section: "10B",
    overallScorePercentage: 58,
    tasksCompleted: 6,
    totalAssignedTasks: 15,
    chaptersCompleted: 5,
    totalChapters: 12,
    scoreBoosterMarks: 96,
    scoreBoosterGoal: 180,
    attendancePercentage: 78,
    timeSpentHours: 19.5,
    lastActive: "3 days ago",
    performanceBand: "lagging",
    teacherRankOutOf10: 5,
    teacherRemarks: "Lagging in Mathematics Trigonometry and Electric Circuits. Attendance slightly irregular. Scheduled doubt session with Allie AI.",
    subjects: [
      { subject: "Physics", scorePercentage: 52, quizzesTaken: 4, averageAccuracy: 52, status: "needs-attention" },
      { subject: "Chemistry", scorePercentage: 60, quizzesTaken: 4, averageAccuracy: 60, status: "needs-attention" },
      { subject: "Biology", scorePercentage: 68, quizzesTaken: 4, averageAccuracy: 68, status: "on-track" },
      { subject: "Mathematics", scorePercentage: 52, quizzesTaken: 5, averageAccuracy: 52, status: "needs-attention" },
    ],
    testHistory: [
      { testId: "test-as1", title: "Electricity & Circuit Laws Diagnostic", date: "Oct 02, 2026", subject: "Physics", score: 12, maxMarks: 25, accuracyPercentage: 48 },
    ],
    recentActivities: [
      { id: "act-as1", timestamp: "Oct 08 05:40 PM", action: "Attempted Quiz", category: "quiz", detail: "Score 12/25 on Electricity Diagnostic" },
    ],
    completedChapterList: ["Chemical Reactions and Equations", "Life Processes", "Real Numbers"],
    weakTopics: ["Ohm's Law & Circuit Resistances", "Trigonometric Ratios", "Balancing Redox Reactions"],
    strongTopics: ["Human Circulatory System"],
  },
  {
    id: "10034455547",
    name: "Meera Nair",
    email: "meera.nair@kepler.edu",
    grade: "Grade 10",
    section: "10A",
    overallScorePercentage: 91,
    tasksCompleted: 14,
    totalAssignedTasks: 15,
    chaptersCompleted: 11,
    totalChapters: 12,
    scoreBoosterMarks: 164,
    scoreBoosterGoal: 180,
    attendancePercentage: 98,
    timeSpentHours: 51.0,
    lastActive: "Today at 07:45 AM",
    performanceBand: "high",
    teacherRankOutOf10: 9,
    teacherRemarks: "Excellent analytical skills. Very active participant in blackboard laboratory questions and flashcard revisions.",
    subjects: [
      { subject: "Physics", scorePercentage: 93, quizzesTaken: 8, averageAccuracy: 93, status: "ahead" },
      { subject: "Chemistry", scorePercentage: 90, quizzesTaken: 7, averageAccuracy: 90, status: "ahead" },
      { subject: "Biology", scorePercentage: 92, quizzesTaken: 6, averageAccuracy: 92, status: "ahead" },
      { subject: "Mathematics", scorePercentage: 89, quizzesTaken: 7, averageAccuracy: 89, status: "ahead" },
    ],
    testHistory: [
      { testId: "test-m1", title: "Gravitation & Kepler Mechanics", date: "Oct 10, 2026", subject: "Physics", score: 29, maxMarks: 30, accuracyPercentage: 97 },
    ],
    recentActivities: [
      { id: "act-m1", timestamp: "Today 07:45 AM", action: "Flipped Flashcards", category: "study", detail: "Completed Kepler's 3 Laws deck" },
    ],
    completedChapterList: ["Light – Reflection and Refraction", "Electricity & Circuit Laws", "Chemical Reactions and Equations", "Acids, Bases and Salts", "Life Processes", "Control and Coordination", "Real Numbers", "Polynomials", "Quadratic Equations"],
    weakTopics: ["Combination of Resistors Word Problems"],
    strongTopics: ["Kepler's Law of Areas", "Endocrine Hormones", "Polynomial Division"],
  },
  {
    id: "10034455548",
    name: "Kabir Das",
    email: "kabir.das@kepler.edu",
    grade: "Grade 10",
    section: "10B",
    overallScorePercentage: 74,
    tasksCompleted: 9,
    totalAssignedTasks: 15,
    chaptersCompleted: 7,
    totalChapters: 12,
    scoreBoosterMarks: 128,
    scoreBoosterGoal: 180,
    attendancePercentage: 88,
    timeSpentHours: 31.0,
    lastActive: "Yesterday at 02:15 PM",
    performanceBand: "average",
    teacherRankOutOf10: 7,
    teacherRemarks: "Solid baseline performance across all subjects. Showing notable improvement in Electricity circuit calculations.",
    subjects: [
      { subject: "Physics", scorePercentage: 75, quizzesTaken: 6, averageAccuracy: 75, status: "on-track" },
      { subject: "Chemistry", scorePercentage: 72, quizzesTaken: 5, averageAccuracy: 72, status: "on-track" },
      { subject: "Biology", scorePercentage: 78, quizzesTaken: 5, averageAccuracy: 78, status: "on-track" },
      { subject: "Mathematics", scorePercentage: 71, quizzesTaken: 6, averageAccuracy: 71, status: "on-track" },
    ],
    testHistory: [
      { testId: "test-k1", title: "Electricity & Circuit Laws", date: "Oct 07, 2026", subject: "Physics", score: 19, maxMarks: 25, accuracyPercentage: 76 },
    ],
    recentActivities: [
      { id: "act-k1", timestamp: "Yesterday 02:15 PM", action: "Submitted Quiz", category: "quiz", detail: "Score 19/25 in Electricity" },
    ],
    completedChapterList: ["Light – Reflection and Refraction", "Chemical Reactions and Equations", "Acids, Bases and Salts", "Life Processes", "Real Numbers"],
    weakTopics: ["Joule's Law of Heating", "Exothermic vs Endothermic Calculations"],
    strongTopics: ["Cellular Respiration", "Linear Equations Graphical Method"],
  },
  {
    id: "10034455549",
    name: "Zara Khan",
    email: "zara.khan@kepler.edu",
    grade: "Grade 10",
    section: "10A",
    overallScorePercentage: 86,
    tasksCompleted: 12,
    totalAssignedTasks: 15,
    chaptersCompleted: 9,
    totalChapters: 12,
    scoreBoosterMarks: 150,
    scoreBoosterGoal: 180,
    attendancePercentage: 95,
    timeSpentHours: 44.0,
    lastActive: "Today at 09:10 AM",
    performanceBand: "high",
    teacherRankOutOf10: 8,
    teacherRemarks: "Very good grasp of Life Processes and Chemical Reactions. Actively working towards CBSE 90%+ target milestone.",
    subjects: [
      { subject: "Physics", scorePercentage: 84, quizzesTaken: 7, averageAccuracy: 84, status: "on-track" },
      { subject: "Chemistry", scorePercentage: 88, quizzesTaken: 6, averageAccuracy: 88, status: "ahead" },
      { subject: "Biology", scorePercentage: 91, quizzesTaken: 6, averageAccuracy: 91, status: "ahead" },
      { subject: "Mathematics", scorePercentage: 81, quizzesTaken: 6, averageAccuracy: 81, status: "on-track" },
    ],
    testHistory: [
      { testId: "test-z1", title: "Life Processes & Plant Physiology", date: "Oct 09, 2026", subject: "Biology", score: 23, maxMarks: 25, accuracyPercentage: 92 },
    ],
    recentActivities: [
      { id: "act-z1", timestamp: "Today 09:10 AM", action: "Completed Doubt Solve", category: "doubt", detail: "Consulted Allie on Guard cells stomatal mechanism" },
    ],
    completedChapterList: ["Light – Reflection and Refraction", "Chemical Reactions and Equations", "Acids, Bases and Salts", "Life Processes", "Control and Coordination", "Real Numbers", "Polynomials"],
    weakTopics: ["Convex Mirror Ray Tracing", "Arithmetic Progressions Sum Formula"],
    strongTopics: ["Stomatal Regulation", "Corrosion & Rancidity Prevention"],
  },
  {
    id: "10034455550",
    name: "Ishaan Joshi",
    email: "ishaan.joshi@kepler.edu",
    grade: "Grade 10",
    section: "10B",
    overallScorePercentage: 65,
    tasksCompleted: 8,
    totalAssignedTasks: 15,
    chaptersCompleted: 6,
    totalChapters: 12,
    scoreBoosterMarks: 115,
    scoreBoosterGoal: 180,
    attendancePercentage: 84,
    timeSpentHours: 26.0,
    lastActive: "Yesterday at 04:45 PM",
    performanceBand: "average",
    teacherRankOutOf10: 6,
    teacherRemarks: "Needs practice in balancing Redox reactions and applying Trigonometric identities. Regularly uses flashcard study cards.",
    subjects: [
      { subject: "Physics", scorePercentage: 66, quizzesTaken: 5, averageAccuracy: 66, status: "on-track" },
      { subject: "Chemistry", scorePercentage: 58, quizzesTaken: 5, averageAccuracy: 58, status: "needs-attention" },
      { subject: "Biology", scorePercentage: 72, quizzesTaken: 4, averageAccuracy: 72, status: "on-track" },
      { subject: "Mathematics", scorePercentage: 64, quizzesTaken: 6, averageAccuracy: 64, status: "on-track" },
    ],
    testHistory: [
      { testId: "test-ij1", title: "Chemical Reactions Diagnostic", date: "Oct 04, 2026", subject: "Chemistry", score: 14, maxMarks: 25, accuracyPercentage: 56 },
    ],
    recentActivities: [
      { id: "act-ij1", timestamp: "Yesterday 04:45 PM", action: "Reviewed Flashcards", category: "study", detail: "Revising Chemical Equations deck" },
    ],
    completedChapterList: ["Chemical Reactions and Equations", "Life Processes", "Real Numbers", "Polynomials"],
    weakTopics: ["Redox Oxidation States", "Refractive Index Snell's Law"],
    strongTopics: ["Human Digestive Enzymes", "Euclid's Division Lemma"],
  },
  {
    id: "10034455551",
    name: "Diya Reddy",
    email: "diya.reddy@kepler.edu",
    grade: "Grade 10",
    section: "10A",
    overallScorePercentage: 96,
    tasksCompleted: 15,
    totalAssignedTasks: 15,
    chaptersCompleted: 12,
    totalChapters: 12,
    scoreBoosterMarks: 176,
    scoreBoosterGoal: 180,
    attendancePercentage: 100,
    timeSpentHours: 62.0,
    lastActive: "Today at 09:55 AM",
    performanceBand: "high",
    teacherRankOutOf10: 10,
    teacherRemarks: "Exemplary performance. 100% quiz completion rate across all 4 subjects. Solved all previous year question sets with full credit.",
    subjects: [
      { subject: "Physics", scorePercentage: 97, quizzesTaken: 9, averageAccuracy: 97, status: "ahead" },
      { subject: "Chemistry", scorePercentage: 96, quizzesTaken: 8, averageAccuracy: 96, status: "ahead" },
      { subject: "Biology", scorePercentage: 95, quizzesTaken: 7, averageAccuracy: 95, status: "ahead" },
      { subject: "Mathematics", scorePercentage: 96, quizzesTaken: 8, averageAccuracy: 96, status: "ahead" },
    ],
    testHistory: [
      { testId: "test-dr1", title: "Mathematics Standard Mock Paper", date: "Oct 10, 2026", subject: "Mathematics", score: 78, maxMarks: 80, accuracyPercentage: 98 },
      { testId: "test-dr2", title: "Gravitation & Kepler Laws", date: "Oct 08, 2026", subject: "Physics", score: 30, maxMarks: 30, accuracyPercentage: 100 },
    ],
    recentActivities: [
      { id: "act-dr1", timestamp: "Today 09:55 AM", action: "Attempted Sample Paper", category: "quiz", detail: "Scored 78/80 in Standard Mathematics SQP" },
    ],
    completedChapterList: [
      "Light – Reflection and Refraction",
      "Electricity & Circuit Laws",
      "Magnetic Effects of Electric Current",
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Life Processes",
      "Control and Coordination",
      "How do Organisms Reproduce?",
      "Real Numbers",
      "Polynomials",
      "Quadratic Equations",
    ],
    weakTopics: [],
    strongTopics: ["Kepler's Laws", "Electromagnetic Induction", "Balancing Complex Redox", "Quadratic Applications"],
  },
];

let teacherUploadsStore: TeacherPdfUpload[] = [
  {
    id: "up_01",
    title: "CBSE Class 10 Science Official Sample Paper 2024-25",
    filename: "CBSE-Class-10-Science-SQP-2025.pdf",
    subject: "Science",
    chapterTitle: "Full Board Syllabus",
    type: "Sample Paper",
    academicYear: "2024-25",
    fileSizeBytes: 2457600,
    uploadedAt: "Oct 02, 2026",
    uploadedBy: "Prof. Sarah Jenkins",
    pdfUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-SQP-2025",
    description: "Official CBSE curriculum sample assessment with marking rubric and solution scheme.",
    downloadCount: 142,
    isStudentVisible: true,
  },
  {
    id: "up_02",
    title: "Kepler's 3 Laws & Planetary Mechanics Master Notes",
    filename: "Keplers-3-Laws-Planetary-Mechanics.pdf",
    subject: "Physics",
    chapterId: "kepler-laws",
    chapterTitle: "Gravitation & Planetary Motion",
    type: "Study Material",
    academicYear: "2024-25",
    fileSizeBytes: 1843200,
    uploadedAt: "Oct 05, 2026",
    uploadedBy: "Prof. Sarah Jenkins",
    pdfUrl: "/api/pdf?subject=Physics&chapter=kepler-laws&title=Kepler's%203%20Laws%20of%20Planetary%20Motion",
    description: "Rigorous derivations of Kepler's 1st, 2nd, and 3rd laws, Newtonian gravity derivation, and solved problems.",
    downloadCount: 98,
    isStudentVisible: true,
  },
  {
    id: "up_03",
    title: "CBSE Class 10 Mathematics Standard Official SQP 2024-25",
    filename: "CBSE-Class-10-Math-SQP-2025.pdf",
    subject: "Mathematics",
    chapterTitle: "Standard Mathematics Full Syllabus",
    type: "Sample Paper",
    academicYear: "2024-25",
    fileSizeBytes: 3145728,
    uploadedAt: "Sep 28, 2026",
    uploadedBy: "Dr. Rajesh Verma",
    pdfUrl: "/api/pdf?subject=Mathematics&title=CBSE-Class-10-Math-SQP-2025",
    description: "Standard Mathematics official blueprint paper including Section E case-based study problems.",
    downloadCount: 185,
    isStudentVisible: true,
  },
  {
    id: "up_04",
    title: "Chemical Reactions & Equations Chapter Notes & Balancing Guide",
    filename: "Chemical-Reactions-Equations-Master-Guide.pdf",
    subject: "Chemistry",
    chapterId: "chem-reactions",
    chapterTitle: "Chemical Reactions and Equations",
    type: "Study Material",
    academicYear: "2024-25",
    fileSizeBytes: 1572864,
    uploadedAt: "Sep 25, 2026",
    uploadedBy: "Prof. Sarah Jenkins",
    pdfUrl: "/api/pdf?subject=Chemistry&chapter=chem-reactions&title=Chemical%20Reactions%20and%20Equations",
    description: "Comprehensive study module on combination, decomposition, displacement, double displacement, and redox reactions.",
    downloadCount: 114,
    isStudentVisible: true,
  },
  {
    id: "up_05",
    title: "CBSE Class 10 Science Board Exam 2024 (Set 1)",
    filename: "CBSE-Class-10-Science-2024-Set-1.pdf",
    subject: "Science",
    chapterTitle: "Board Exam Archive",
    type: "PYQ",
    academicYear: "2023-24",
    fileSizeBytes: 2867200,
    uploadedAt: "Sep 15, 2026",
    uploadedBy: "Prof. Sarah Jenkins",
    pdfUrl: "/api/pdf?subject=Science&title=CBSE-Class-10-Science-2024-Set-1",
    description: "Official previous year question paper with detailed step-by-step solutions for CBSE 2024 board exam.",
    downloadCount: 220,
    isStudentVisible: true,
  },
  {
    id: "up_06",
    title: "Electricity & Circuit Diagrams Formula Sheet",
    filename: "Electricity-Circuit-Formula-Sheet.pdf",
    subject: "Physics",
    chapterId: "electricity",
    chapterTitle: "Electricity & Circuit Laws",
    type: "Revision Notes",
    academicYear: "2024-25",
    fileSizeBytes: 1153433,
    uploadedAt: "Oct 01, 2026",
    uploadedBy: "Prof. Sarah Jenkins",
    pdfUrl: "/api/pdf?subject=Physics&chapter=electricity&title=Electricity%20Formula%20Sheet",
    description: "Formula sheet containing Ohm's law, resistance factors, parallel/series laws, Joule's law of heating, and electric power.",
    downloadCount: 167,
    isStudentVisible: true,
  },
];

// ----------------------------------------------------------------------------
// STORE ACCESSORS & MUTATORS
// ----------------------------------------------------------------------------

export const serverStore = {
  // Auth & Profile
  getCurrentStudent: (): StudentProfile => ({ ...studentProfileStore }),

  getStudentFromToken: (token?: string | null): StudentProfile => {
    if (!token) return { ...studentProfileStore };
    try {
      const cleanToken = token.replace(/^Bearer\s+/i, "");
      const parts = cleanToken.split(".");
      if (parts.length >= 2) {
        const payloadStr = atob(parts[1]);
        try {
          const payloadObj = JSON.parse(payloadStr);
          if (payloadObj && payloadObj.id) {
            if (payloadObj.id === "1" || payloadObj.name?.toLowerCase().includes("ojus")) {
              return { ...registeredStudents.ojus };
            }
            if (payloadObj.id === "2" || payloadObj.name?.toLowerCase().includes("sneha")) {
              return { ...registeredStudents.sneha };
            }
            if (
              payloadObj.id === "10034455542" ||
              payloadObj.id === "1003445542" ||
              payloadObj.name?.toLowerCase().includes("alex")
            ) {
              return payloadObj.id === "1003445542"
                ? { ...registeredStudents.alex_10digit }
                : { ...registeredStudents.alex };
            }
            return payloadObj;
          }
        } catch {
          const norm = payloadStr.trim().toLowerCase();
          if (norm === "1" || norm === "ojus" || norm.includes("ojus")) {
            return { ...registeredStudents.ojus };
          }
          if (norm === "2" || norm === "sneha" || norm.includes("sneha") || norm.includes("reddy")) {
            return { ...registeredStudents.sneha };
          }
          if (norm === "10034455542" || norm === "1003445542" || norm.includes("alex")) {
            return norm === "1003445542"
              ? { ...registeredStudents.alex_10digit }
              : { ...registeredStudents.alex };
          }
        }
      }
    } catch {
      // fallback
    }
    return { ...studentProfileStore };
  },

  authenticateStudent: (
    credential: string,
    password?: string
  ): { success: boolean; student: StudentProfile; token: string; error?: string } => {
    const normalized = (credential || "").trim().toLowerCase();

    let matchedStudent: StudentProfile;

    if (normalized === "1" || normalized === "ojus" || normalized.includes("ojus")) {
      matchedStudent = { ...registeredStudents.ojus };
    } else if (
      normalized === "2" ||
      normalized === "sneha reddy" ||
      normalized === "sneha" ||
      normalized.includes("sneha") ||
      normalized.includes("reddy")
    ) {
      matchedStudent = { ...registeredStudents.sneha };
    } else if (
      normalized === "10034455542" ||
      normalized === "1003445542" ||
      normalized.includes("alex")
    ) {
      matchedStudent =
        normalized === "1003445542"
          ? { ...registeredStudents.alex_10digit }
          : { ...registeredStudents.alex };
    } else {
      const inTeacherStore = teacherStudentsStore.find(
        (s) =>
          s.id.toLowerCase() === normalized ||
          s.name.toLowerCase() === normalized ||
          s.email.toLowerCase() === normalized
      );
      if (inTeacherStore) {
        matchedStudent = {
          id: inTeacherStore.id,
          name: inTeacherStore.name,
          email: inTeacherStore.email,
          targetExam: "CBSE Class 10 Board Exam",
          role: "student",
          phone: "+1 (555) 234-5678",
          grade: inTeacherStore.grade,
          school: "Kepler International Academy",
        };
      } else {
        matchedStudent = {
          id: credential.trim(),
          name: credential.trim(),
          email: `${credential.trim().toLowerCase().replace(/\s+/g, ".")}@kepler.edu`,
          targetExam: "CBSE Class 10 Board Exam",
          role: "student",
          phone: "+1 (555) 234-5678",
          grade: "Grade 10",
          school: "Kepler International Academy",
        };
      }
    }

    // Password is set same as the user ID (also accepting credential or fallback)
    const expectedPassword = studentPasswordsStore[matchedStudent.id] || matchedStudent.id;

    if (password !== undefined && password !== null && String(password).trim() !== "") {
      const p = String(password).trim();
      const isValid =
        p === expectedPassword ||
        p === matchedStudent.id ||
        p === normalized ||
        p === credential.trim() ||
        p === "password123";

      if (!isValid) {
        return {
          success: false,
          student: matchedStudent,
          token: "",
          error: "Invalid password. Password is the same as your User ID.",
        };
      }
    }

    // Set active student and active password in memory
    studentProfileStore = { ...matchedStudent };
    studentPasswordStore = expectedPassword;

    const tokenPayload = btoa(
      JSON.stringify({
        id: matchedStudent.id,
        name: matchedStudent.name,
        email: matchedStudent.email,
        role: matchedStudent.role,
      })
    );

    return {
      success: true,
      student: { ...studentProfileStore },
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${tokenPayload}.signature`,
    };
  },

  updateStudentProfile: (updates: Partial<StudentProfile>): StudentProfile => {
    studentProfileStore = {
      ...studentProfileStore,
      ...updates,
      // preserve student ID and role for security
      id: studentProfileStore.id,
      role: studentProfileStore.role,
    };
    return { ...studentProfileStore };
  },

  changeStudentPassword: (
    currentPassword: string,
    newPassword: string
  ): { success: boolean; message: string; error?: string } => {
    const expected =
      studentPasswordsStore[studentProfileStore.id] ||
      studentPasswordStore ||
      studentProfileStore.id;
    if (
      currentPassword !== expected &&
      currentPassword !== studentProfileStore.id &&
      currentPassword !== studentPasswordStore
    ) {
      return {
        success: false,
        message: "Current password does not match records",
        error: "Incorrect current password",
      };
    }
    if (!newPassword || newPassword.length < 1) {
      return {
        success: false,
        message: "New password cannot be empty",
        error: "Password too short",
      };
    }
    studentPasswordsStore[studentProfileStore.id] = newPassword;
    studentPasswordStore = newPassword;
    return {
      success: true,
      message: "Password changed successfully",
    };
  },

  // Todos
  getTodos: (): ClassroomTodoItem[] => [...todosStore],

  updateTodo: (id: string, updates: { completed?: boolean; text?: string }): ClassroomTodoItem | null => {
    const todoIndex = todosStore.findIndex((t) => t.id === id);
    if (todoIndex === -1) return null;
    if (typeof updates.completed === "boolean") {
      todosStore[todoIndex].completed = updates.completed;
    }
    if (updates.text) {
      todosStore[todoIndex].text = updates.text;
    }
    return todosStore[todoIndex];
  },

  addTodo: (item: Omit<ClassroomTodoItem, "id">): ClassroomTodoItem => {
    const newTodo: ClassroomTodoItem = {
      ...item,
      id: "todo_" + Date.now(),
    };
    todosStore.push(newTodo);
    return newTodo;
  },

  deleteTodo: (id: string): boolean => {
    const prevLen = todosStore.length;
    todosStore = todosStore.filter((t) => t.id !== id);
    return todosStore.length < prevLen;
  },

  // Calendar & Schedule
  getCalendarEvents: (): CalendarEvent[] => [...calendarEventsStore],

  getSchedule: (): ScheduleItem[] => [...scheduleItemsStore],

  // Learn
  getSubjects: (): SubjectItem[] => [...SUBJECTS_DATA],

  getChaptersBySubject: (subjectId: string): SubjectChapter[] => {
    const sub = SUBJECTS_DATA.find((s) => s.id.toLowerCase() === subjectId.toLowerCase());
    return sub ? sub.chapters || [] : [];
  },

  getSubjectById: (subjectId: string): SubjectItem | undefined => {
    return SUBJECTS_DATA.find((s) => s.id.toLowerCase() === subjectId.toLowerCase());
  },

  getChapterMaterial: (chapterIdOrTopic: string): ChapterMaterialResponse => {
    let matchedTitle = "Chapter Study Material";
    let matchedSubject = "Physics";
    let matchedDuration = 45;

    for (const sub of SUBJECTS_DATA) {
      const chap = (sub.chapters || []).find(
        (c) => c.id === chapterIdOrTopic || c.topicId === chapterIdOrTopic
      );
      if (chap) {
        matchedTitle = chap.title;
        matchedSubject = sub.title;
        matchedDuration = chap.durationMinutes;
        break;
      }
    }

    const topicData = TOPIC_REVISION_DATA[chapterIdOrTopic];
    const summary = topicData
      ? topicData.revisionNotes.summary
      : `Comprehensive syllabus study module for ${matchedTitle}. Includes core concepts, visual demonstrations, and exam derivations.`;

    return {
      chapterId: chapterIdOrTopic,
      title: topicData?.topicTitle || matchedTitle,
      subject: matchedSubject,
      durationMinutes: matchedDuration,
      theorySummary: summary,
      pdfUrl: `/api/pdf?subject=${encodeURIComponent(matchedSubject)}&chapter=${encodeURIComponent(chapterIdOrTopic)}&title=${encodeURIComponent(matchedTitle)}`,
      resourceCount: 4,
    };
  },

  getFlashcards: (topicId: string): { topicId: string; chapterTitle: string; flashcards: FlashcardItem[] } => {
    const topicData = TOPIC_REVISION_DATA[topicId] || TOPIC_REVISION_DATA["kepler-laws"];
    return {
      topicId,
      chapterTitle: topicData.topicTitle,
      flashcards: topicData.flashcards,
    };
  },

  getRevisionNotes: (topicId: string): { topicId: string; chapterTitle: string; revisionNotes: RevisionNotesData } => {
    const topicData = TOPIC_REVISION_DATA[topicId] || TOPIC_REVISION_DATA["kepler-laws"];
    return {
      topicId,
      chapterTitle: topicData.topicTitle,
      revisionNotes: topicData.revisionNotes,
    };
  },

  // Quizzes & Tests
  getAvailableQuizzes: (subject?: string): Array<{
    id: string;
    topicTitle: string;
    chapter: string;
    subject: string;
    questionCount: number;
    durationMinutes: number;
  }> => {
    const staticList = Object.values(QUIZZES_DATA).map((q) => ({
      id: q.id,
      topicTitle: q.topicTitle,
      chapter: q.chapter,
      subject: q.subject,
      questionCount: q.questionCount,
      durationMinutes: q.durationMinutes,
    }));
    const masterList = getAllAvailableQuizzes(subject).map((q) => ({
      id: q.id,
      topicTitle: q.topicTitle,
      chapter: q.chapter,
      subject: q.subject,
      questionCount: q.questionCount,
      durationMinutes: q.durationMinutes,
    }));

    // Merge without duplicate IDs
    const seenIds = new Set<string>();
    const combined: Array<{
      id: string;
      topicTitle: string;
      chapter: string;
      subject: string;
      questionCount: number;
      durationMinutes: number;
    }> = [];

    [...staticList, ...masterList].forEach((q) => {
      if (!seenIds.has(q.id)) {
        seenIds.add(q.id);
        if (
          !subject ||
          subject.toLowerCase() === "all" ||
          q.subject.toLowerCase() === subject.toLowerCase()
        ) {
          combined.push(q);
        }
      }
    });

    return combined;
  },

  registerCustomQuiz: (quiz: QuizDetail & { correctAnswers: Record<string, number> }) => {
    customQuizzesStore[quiz.id] = quiz;
  },

  getQuizDetail: (quizIdOrTopic: string): QuizDetail | null => {
    // 1. Check custom quizzes created dynamically
    if (customQuizzesStore[quizIdOrTopic]) {
      const cq = customQuizzesStore[quizIdOrTopic];
      return {
        id: cq.id,
        topicTitle: cq.topicTitle,
        chapter: cq.chapter,
        subject: cq.subject,
        durationMinutes: cq.durationMinutes,
        questionCount: cq.questionCount,
        questions: cq.questions,
      };
    }

    // 2. Check static QUIZZES_DATA
    const staticQuiz =
      QUIZZES_DATA[quizIdOrTopic] ||
      Object.values(QUIZZES_DATA).find((q) => q.id === quizIdOrTopic);
    if (staticQuiz) {
      return {
        id: staticQuiz.id,
        topicTitle: staticQuiz.topicTitle,
        chapter: staticQuiz.chapter,
        subject: staticQuiz.subject,
        durationMinutes: staticQuiz.durationMinutes,
        questionCount: staticQuiz.questionCount,
        questions: staticQuiz.questions,
      };
    }

    // 3. Check master catalog with all 108 CBSE chapters
    const master = getQuizByTopicOrChapter(quizIdOrTopic);
    if (master) {
      return {
        id: master.code,
        topicTitle: master.title,
        chapter: master.title,
        subject: master.subject,
        durationMinutes: master.durationMinutes,
        questionCount: master.questionCount,
        questions: master.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          explanation: q.explanation,
        })),
      };
    }

    return null;
  },

  submitQuiz: (
    topicId: string,
    selectedAnswers: Record<string, number>,
    timeSpentSeconds = 120,
    studentId?: string
  ): TestResultData => {
    // 1. Check custom quiz
    let quizTitle = "Practice Quiz";
    let quizSubject = "Science";
    let quizId = topicId;
    let questions: QuizQuestionItem[] = [];
    let correctMap: Record<string, number> = {};

    if (customQuizzesStore[topicId]) {
      const cq = customQuizzesStore[topicId];
      quizTitle = cq.topicTitle;
      quizSubject = cq.subject;
      quizId = cq.id;
      questions = cq.questions;
      correctMap = cq.correctAnswers;
    } else {
      const staticQuiz =
        QUIZZES_DATA[topicId] ||
        Object.values(QUIZZES_DATA).find((q) => q.id === topicId);
      if (staticQuiz) {
        quizTitle = staticQuiz.topicTitle;
        quizSubject = staticQuiz.subject;
        quizId = staticQuiz.id;
        questions = staticQuiz.questions;
        correctMap = staticQuiz.correctAnswers;
      } else {
        const master = getQuizByTopicOrChapter(topicId);
        if (master) {
          quizTitle = master.title;
          quizSubject = master.subject;
          quizId = master.code;
          questions = master.questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            explanation: q.explanation,
          }));
          correctMap = master.correctAnswers;
        } else {
          // Fallback
          const fallback = QUIZZES_DATA["kepler-laws"];
          quizTitle = fallback.topicTitle;
          quizSubject = fallback.subject;
          quizId = fallback.id;
          questions = fallback.questions;
          correctMap = fallback.correctAnswers;
        }
      }
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const effectiveStudentId = studentId || studentProfileStore?.id || "10034455542";

    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correct = correctMap[q.id];
      if (selected === undefined || selected === null) {
        unattemptedCount += 1;
      } else if (selected === correct) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
        // Automatically log mistake into Improvement Book strictly for this student!
        const existing = mistakesStore.find(
          (m) =>
            m.questionSnippet === q.question &&
            isMatchingStudentId(m.studentId, effectiveStudentId)
        );
        if (!existing) {
          mistakesStore.unshift({
            id: "err_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            studentId: effectiveStudentId,
            questionSnippet: q.question,
            subject: quizSubject,
            errorCategory: "Conceptual",
            correctAnswer: q.options[correct] || "Correct Choice",
            studentAnswer: q.options[selected] || "Incorrect Choice",
            reviewed: false,
          });
        }
      }
    });

    const totalQuestions = questions.length;
    const totalScore = correctCount;
    const maxMarks = totalQuestions;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Whiteboard To-Do condition: Task is marked completed only if user scores 66% or higher
    if (accuracy >= 66) {
      todosStore.forEach((todo) => {
        if (
          todo.topicId === topicId ||
          todo.quizId === quizId ||
          todo.quizId === topicId ||
          todo.topicId === quizId ||
          todo.id === topicId
        ) {
          todo.completed = true;
        }
      });
    }

    const resultData: TestResultData = {
      testId: quizId,
      testTitle: quizTitle,
      dateAttempted: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      attemptType: "first",
      totalScore,
      maxTotalMarks: maxMarks,
      accuracyPercentage: accuracy,
      totalCorrect: correctCount,
      totalIncorrect: incorrectCount,
      totalUnattempted: unattemptedCount,
      totalPositiveMarks: correctCount,
      totalNegativeMarks: 0,
      subjects: [
        {
          id: quizSubject.toLowerCase(),
          name: quizSubject,
          partLabel: "Part A",
          maxMarks,
          score: totalScore,
          correctCount,
          incorrectCount,
          unattemptedCount,
          positiveMarks: correctCount,
          negativeMarks: 0,
        },
      ],
    };

    testResultsHistoryStore.unshift(resultData);
    return resultData;
  },

  getTestResultsHistory: (): TestResultData[] => [...testResultsHistoryStore],

  getTestResultById: (testId: string): TestResultData | undefined => {
    return testResultsHistoryStore.find((r) => r.testId === testId);
  },

  // Score Booster
  getScoreBoosterStatus: () => ({ ...scoreBoosterState }),

  getScoreBoosterTasks: (subject?: string): ScoreBoosterTask[] => {
    if (subject && subject.toLowerCase() !== "all") {
      return scoreBoosterTasksStore.filter(
        (t) => (t.subject || "").toLowerCase() === subject.toLowerCase()
      );
    }
    return [...scoreBoosterTasksStore];
  },

  completeScoreBoosterTask: (taskId: string) => {
    const task = scoreBoosterTasksStore.find((t) => t.id === taskId);
    if (task) {
      task.completed = true;
    }
    scoreBoosterState.currentMarks = Math.min(
      scoreBoosterState.nextGoalMarks,
      scoreBoosterState.currentMarks + (task?.pointsValue || 4)
    );
    scoreBoosterState.tasksCompleted += 1;
    scoreBoosterState.characterPlatform = "jumping";

    return {
      success: true,
      newMarks: scoreBoosterState.currentMarks,
      tasksCompletedTotal: scoreBoosterState.tasksCompleted,
      triggerAnimation: "jumping" as const,
    };
  },

  resetScoreBoosterTasks: () => {
    scoreBoosterTasksStore.forEach((t) => {
      t.completed = t.id === "task_101";
    });
    scoreBoosterState.currentMarks = 142;
    scoreBoosterState.tasksCompleted = 14;
    scoreBoosterState.characterPlatform = "lower";
  },

  // Improvement Book (Mistakes)
  getMistakes: (studentId?: string): LoggedMistake[] => {
    if (studentId) {
      return mistakesStore.filter((m) => isMatchingStudentId(m.studentId, studentId));
    }
    if (studentProfileStore && studentProfileStore.id) {
      return mistakesStore.filter((m) => isMatchingStudentId(m.studentId, studentProfileStore.id));
    }
    return [];
  },

  updateMistakeReviewed: (id: string, reviewed: boolean, studentId?: string): LoggedMistake | null => {
    const mistake = mistakesStore.find(
      (m) => m.id === id && (!studentId || isMatchingStudentId(m.studentId, studentId))
    );
    if (!mistake) return null;
    mistake.reviewed = reviewed;
    return mistake;
  },

  // Papers
  getPapers: (filter?: {
    type?: string | null;
    subject?: string | null;
    year?: string | null;
    exam?: string | null;
  }): PastExamPaper[] => {
    return PAPERS_STORE.filter((p) => {
      // 1. Subject filter
      if (filter?.subject && filter.subject.toLowerCase() !== "all") {
        const reqSubj = filter.subject.toLowerCase();
        const pSubj = (p.subject || "").toLowerCase();
        const pTitle = p.title.toLowerCase();

        const matchesSubj =
          pSubj === reqSubj ||
          pSubj.includes(reqSubj) ||
          reqSubj.includes(pSubj) ||
          pTitle.includes(reqSubj);

        if (!matchesSubj) return false;
      }

      // 2. Year / Session filter
      if (filter?.year) {
        const reqYear = filter.year.trim().toLowerCase();
        const pYearStr = String(p.year);
        const pAcadYear = (p.academicYear || "").toLowerCase();
        const pTitle = p.title.toLowerCase();

        const matchesYear =
          pAcadYear.includes(reqYear) ||
          pYearStr === reqYear ||
          pTitle.includes(reqYear) ||
          (reqYear.includes("-") && reqYear.startsWith(pYearStr)) ||
          (reqYear.includes("-") && reqYear.endsWith(pYearStr.slice(-2)));

        if (!matchesYear) return false;
      }

      // 3. Type filter
      if (filter?.type && filter.type.toLowerCase() !== "all") {
        const reqType = filter.type.toLowerCase();
        const pType = (p.type || "").toLowerCase();
        const pTitle = p.title.toLowerCase();

        if (reqType === "sample") {
          const isSample =
            pType.includes("sample") ||
            pTitle.includes("sample") ||
            pTitle.includes("sqp") ||
            !pType.includes("pyq");
          if (!isSample) return false;
        } else if (reqType === "pyq") {
          const isPyq =
            pType.includes("pyq") ||
            pType.includes("past") ||
            pTitle.includes("pyq") ||
            pTitle.includes("board exam");
          if (!isPyq) return false;
        }
      }

      // 4. Exam filter
      if (filter?.exam) {
        if (p.exam.toLowerCase() !== filter.exam.toLowerCase()) {
          if (!p.exam.toLowerCase().includes("cbse") && !filter.exam.toLowerCase().includes("cbse")) {
            return false;
          }
        }
      }

      return true;
    });
  },

  // AI Assistant & Chat
  solveDoubt: (req: {
    query: string;
    mode: DoubtSolverMode;
    searchType?: SearchChipType;
  }) => {
    const mode = req.mode || "detailed";
    let text = "";
    let latex: string[] = [];
    let hints: string[] = [];

    if (mode === "socratic") {
      text = `💡 **Let's break this down collaboratively!**\n\nWhen thinking about: *"${req.query}"*\n\n1. What fundamental physical principle or conservation law relates the variables here?\n2. If you change one boundary condition, what happens to the resultant quantity?`;
      latex = ["F = G \\frac{m_1 m_2}{r^2}"];
      hints = [
        "Think about what forces are acting on the system",
        "Consider what stays constant during the process",
      ];
    } else if (mode === "exam") {
      text = `🎯 **Exam-Ready Solution (CBSE Class 10 Marking Rubric):**\n\n**Statement:**\nFor the problem *"${req.query}"*:\n\n**Step 1:** State the governing formula and given values with proper SI units.\n**Step 2:** Substitute values into the equation and carry out systematic cancellation.\n**Step 3:** Final answer with appropriate units and physical interpretation.`;
      latex = ["v = \\sqrt{\\frac{GM}{r}}", "T^2 = \\frac{4\\pi^2}{GM} a^3"];
      hints = ["Always mention units in board examinations to avoid losing 0.5 marks."];
    } else {
      // Detailed
      text = `📘 **Detailed Pedagogical Explanation:**\n\nIn response to: *"${req.query}"*\n\nGravitational and central forces govern orbits through balance between inertia and central attraction. As distance changes, orbital velocity adjusts according to conservation of angular momentum.`;
      latex = ["v = \\sqrt{\\frac{GM}{r}}"];
      hints = ["Newton's Cannonball thought experiment provides the physical intuition."];
    }

    const newResolvedDoubt: ResolvedDoubt = {
      id: "doubt_" + Date.now(),
      query: req.query,
      mode,
      answerSnippet: text.substring(0, 160) + "...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      latexFormulas: latex,
      subject: "Science",
    };
    resolvedDoubtsStore.unshift(newResolvedDoubt);

    return {
      id: "ans_" + Date.now(),
      mode,
      text,
      latexFormulas: latex,
      followUpHints: hints,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  },

  sendChatMessage: (req: {
    message: string;
    sessionId?: string;
    mode?: DoubtSolverMode;
  }): ChatMessage => {
    const sessionId = req.sessionId || "default_session";
    if (!chatSessionsStore[sessionId]) {
      chatSessionsStore[sessionId] = [];
    }

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: req.message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: req.mode,
    };
    chatSessionsStore[sessionId].push(userMsg);

    const mode = req.mode || "detailed";
    let replyText = "";
    let latex: string[] = [];

    if (mode === "socratic") {
      replyText = `That's a thoughtful question! Let's examine: "${req.message}". What happens to the system if external work is done on it?`;
    } else if (mode === "exam") {
      replyText = `Here is the concise board-level answer for: "${req.message}". Make sure to include the relevant diagram and formula in your answer sheet.`;
      latex = ["E = mc^2"];
    } else {
      replyText = `Great question! Regarding "${req.message}": In classical mechanics and CBSE Class 10 curriculum, this principle establishes equilibrium between opposing tendencies.`;
    }

    const aiMsg: ChatMessage = {
      id: "allie_" + Date.now(),
      sender: "allie",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode,
      latexFormulas: latex,
    };
    chatSessionsStore[sessionId].push(aiMsg);

    return aiMsg;
  },

  getChatHistory: (sessionId: string): ChatMessage[] => {
    return chatSessionsStore[sessionId] || [];
  },

  clearChatSession: (sessionId: string): boolean => {
    if (chatSessionsStore[sessionId]) {
      delete chatSessionsStore[sessionId];
      return true;
    }
    return false;
  },

  appendChatMessage: (sessionId: string, msg: ChatMessage): void => {
    if (!chatSessionsStore[sessionId]) {
      chatSessionsStore[sessionId] = [];
    }
    chatSessionsStore[sessionId].push(msg);
  },

  addResolvedDoubt: (doubt: ResolvedDoubt): void => {
    resolvedDoubtsStore.unshift(doubt);
  },

  getMyDoubts: (): ResolvedDoubt[] => [...resolvedDoubtsStore],

  // --------------------------------------------------------------------------
  // Teacher Admin Portal Methods
  // --------------------------------------------------------------------------
  getTeacherProfile: (id?: string): TeacherProfile => {
    const t = teachersStore.find((x) => x.id === id) || teachersStore[0];
    return { ...t };
  },

  authenticateTeacher: (credential: string): { teacher: TeacherProfile; token: string } => {
    const t =
      teachersStore.find(
        (x) =>
          x.id.toLowerCase() === credential.toLowerCase() ||
          x.email.toLowerCase() === credential.toLowerCase()
      ) || teachersStore[0];
    return {
      teacher: { ...t },
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(credential)}.teacher_signature`,
    };
  },

  getTeacherStudents: (filters?: {
    class?: string;
    subject?: string;
    performance?: string;
    search?: string;
  }): {
    students: TeacherStudentSummary[];
    totalStudents: number;
    classAverageScore: number;
    activeTodayCount: number;
    needsAttentionCount: number;
  } => {
    let list = [...teacherStudentsStore];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    const filterClass = filters?.class;
    if (filterClass && filterClass !== "all") {
      const cls = filterClass.toLowerCase();
      list = list.filter((s) => s.section.toLowerCase() === cls);
    }

    const filterPerf = filters?.performance;
    if (filterPerf && filterPerf !== "all") {
      const perf = filterPerf.toLowerCase();
      list = list.filter((s) => s.performanceBand.toLowerCase() === perf);
    }

    const filterSubj = filters?.subject;
    if (filterSubj && filterSubj !== "all") {
      const subj = filterSubj.toLowerCase();
      list = list.filter((s) =>
        s.subjects.some((sub) => sub.subject.toLowerCase() === subj)
      );
    }

    const totalStudents = teacherStudentsStore.length;
    const sumScores = teacherStudentsStore.reduce((acc, s) => acc + s.overallScorePercentage, 0);
    const classAverageScore = Math.round(sumScores / (totalStudents || 1));
    const activeTodayCount = teacherStudentsStore.filter((s) =>
      s.lastActive.toLowerCase().includes("today")
    ).length;
    const needsAttentionCount = teacherStudentsStore.filter(
      (s) => s.performanceBand === "lagging"
    ).length;

    const summaries: TeacherStudentSummary[] = list.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      grade: s.grade,
      section: s.section,
      overallScorePercentage: s.overallScorePercentage,
      tasksCompleted: s.tasksCompleted,
      totalAssignedTasks: s.totalAssignedTasks,
      chaptersCompleted: s.chaptersCompleted,
      totalChapters: s.totalChapters,
      scoreBoosterMarks: s.scoreBoosterMarks,
      scoreBoosterGoal: s.scoreBoosterGoal,
      attendancePercentage: s.attendancePercentage,
      timeSpentHours: s.timeSpentHours,
      lastActive: s.lastActive,
      performanceBand: s.performanceBand,
      teacherRankOutOf10: s.teacherRankOutOf10,
      teacherRemarks: s.teacherRemarks,
    }));

    return {
      students: summaries,
      totalStudents,
      classAverageScore,
      activeTodayCount,
      needsAttentionCount,
    };
  },

  getTeacherStudentDetail: (studentId: string): TeacherStudentDetail | null => {
    const s = teacherStudentsStore.find((x) => x.id === studentId);
    return s ? { ...s } : null;
  },

  updateStudentRemarks: (
    studentId: string,
    remarks: string,
    rankOutOf10?: number
  ): TeacherStudentDetail | null => {
    const s = teacherStudentsStore.find((x) => x.id === studentId);
    if (!s) return null;
    s.teacherRemarks = remarks;
    if (typeof rankOutOf10 === "number") {
      s.teacherRankOutOf10 = Math.min(10, Math.max(1, rankOutOf10));
    }
    if (!s.notesHistory) s.notesHistory = [];
    s.notesHistory.unshift({
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      author: "Prof. Sarah Jenkins",
      note: remarks,
    });
    return { ...s };
  },

  getTeacherUploads: (filter?: {
    subject?: string;
    type?: string;
    search?: string;
  }): TeacherPdfUpload[] => {
    return teacherUploadsStore.filter((u) => {
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        if (!u.title.toLowerCase().includes(q) && !u.filename.toLowerCase().includes(q)) return false;
      }
      if (filter?.subject && filter.subject.toLowerCase() !== "all") {
        if (u.subject.toLowerCase() !== filter.subject.toLowerCase()) return false;
      }
      if (filter?.type && filter.type.toLowerCase() !== "all") {
        if (u.type.toLowerCase() !== filter.type.toLowerCase()) return false;
      }
      return true;
    });
  },

  addTeacherUpload: (req: CreatePdfUploadRequest & { uploadedBy?: string }): TeacherPdfUpload => {
    const id = "up_" + Date.now();
    const pdfUrl =
      req.pdfUrl ||
      `/api/pdf?subject=${encodeURIComponent(req.subject)}&title=${encodeURIComponent(req.title)}`;
    const newUpload: TeacherPdfUpload = {
      id,
      title: req.title,
      filename: req.fileName || `${req.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
      subject: req.subject,
      chapterId: req.chapterId,
      chapterTitle: req.chapterTitle,
      type: req.type,
      academicYear: req.academicYear || "2024-25",
      fileSizeBytes: req.fileSizeBytes || 1850000,
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      uploadedBy: req.uploadedBy || "Prof. Sarah Jenkins",
      pdfUrl,
      description: req.description,
      downloadCount: 0,
      isStudentVisible: true,
    };
    teacherUploadsStore.unshift(newUpload);

    // CRITICAL: Synchronize with PAPERS_STORE if Sample Paper or PYQ so students see it in /papers!
    if (req.type === "Sample Paper" || req.type === "PYQ") {
      const yearNum = parseInt(req.academicYear.split("-")[0]) || 2025;
      PAPERS_STORE.unshift({
        id: `paper_${id}`,
        title: req.title,
        year: yearNum,
        exam: "CBSE Class 10",
        pdfUrl,
        solutionUrl: pdfUrl,
        subject: req.subject.toLowerCase(),
        type: req.type === "PYQ" ? "pyq" : "sample",
        academicYear: req.academicYear || "2024-25",
      });
    }

    return newUpload;
  },

  deleteTeacherUpload: (id: string): boolean => {
    const item = teacherUploadsStore.find((u) => u.id === id);
    if (!item) return false;
    teacherUploadsStore = teacherUploadsStore.filter((u) => u.id !== id);

    // Also remove from PAPERS_STORE if it was synchronized there
    PAPERS_STORE = PAPERS_STORE.filter((p) => p.id !== `paper_${id}` && p.title !== item.title);
    return true;
  },

  getTeacherRankings: (subjectFilter?: string): TeacherRankingItem[] => {
    // Sort students by overall performance descending
    const sorted = [...teacherStudentsStore].sort((a, b) => {
      if (subjectFilter && subjectFilter.toLowerCase() !== "all") {
        const subA =
          a.subjects.find((s) => s.subject.toLowerCase() === subjectFilter.toLowerCase())
            ?.scorePercentage || 0;
        const subB =
          b.subjects.find((s) => s.subject.toLowerCase() === subjectFilter.toLowerCase())
            ?.scorePercentage || 0;
        return subB - subA;
      }
      return b.overallScorePercentage - a.overallScorePercentage;
    });

    return sorted.map((s, idx) => {
      const subjectMap: Record<string, number> = {};
      s.subjects.forEach((sub) => {
        subjectMap[sub.subject] = sub.scorePercentage;
      });

      return {
        studentId: s.id,
        studentName: s.name,
        section: s.section,
        autoRank: idx + 1,
        teacherRankOutOf10: s.teacherRankOutOf10,
        overallScorePercentage: s.overallScorePercentage,
        quizAccuracy: Math.round(
          s.subjects.reduce((acc, sub) => acc + sub.averageAccuracy, 0) / s.subjects.length
        ),
        tasksCompleted: s.tasksCompleted,
        subjectScores: subjectMap,
        teacherRemarks: s.teacherRemarks,
        lastUpdated: s.lastActive,
      };
    });
  },

  updateStudentRanking: (
    studentId: string,
    rankOutOf10: number,
    remarks?: string
  ): TeacherRankingItem | null => {
    const s = teacherStudentsStore.find((x) => x.id === studentId);
    if (!s) return null;
    s.teacherRankOutOf10 = Math.min(10, Math.max(1, rankOutOf10));
    if (remarks !== undefined) {
      s.teacherRemarks = remarks;
    }
    const rankings = serverStore.getTeacherRankings();
    return rankings.find((r) => r.studentId === studentId) || null;
  },

  getTeacherAnalytics: (): TeacherClassAnalytics => {
    const totalStudents = teacherStudentsStore.length;
    const avgScore = Math.round(
      teacherStudentsStore.reduce((a, s) => a + s.overallScorePercentage, 0) / (totalStudents || 1)
    );
    const avgChapters = Math.round(
      (teacherStudentsStore.reduce(
        (a, s) => a + s.chaptersCompleted / s.totalChapters,
        0
      ) /
        (totalStudents || 1)) *
        100
    );
    const avgTasks = Math.round(
      (teacherStudentsStore.reduce((a, s) => a + s.tasksCompleted / s.totalAssignedTasks, 0) /
        (totalStudents || 1)) *
        100
    );
    const activeRate = Math.round(
      (teacherStudentsStore.filter((s) => s.lastActive.includes("Today")).length /
        (totalStudents || 1)) *
        100
    );

    const subjects = ["Physics", "Chemistry", "Biology", "Mathematics"];
    const subjectStats = subjects.map((subj) => {
      let totalScore = 0;
      let totalQuizzes = 0;
      let laggingCount = 0;
      teacherStudentsStore.forEach((st) => {
        const item = st.subjects.find((sb) => sb.subject === subj);
        if (item) {
          totalScore += item.scorePercentage;
          totalQuizzes += item.quizzesTaken;
          if (item.status === "needs-attention" || item.scorePercentage < 65) {
            laggingCount += 1;
          }
        }
      });
      return {
        subject: subj,
        averageScorePercentage: Math.round(totalScore / (totalStudents || 1)),
        totalQuizzesTaken: totalQuizzes,
        completionRatePercentage: Math.min(
          100,
          Math.round((totalQuizzes / (totalStudents * 8)) * 100)
        ),
        laggingStudentCount: laggingCount,
      };
    });

    const weakTopics = [
      {
        topicId: "optics-sign-conventions",
        topicTitle: "Mirror & Lens Sign Conventions",
        subject: "Physics",
        averageAccuracyPercentage: 54,
        studentsStrugglingCount: 4,
      },
      {
        topicId: "redox-equations",
        topicTitle: "Balancing Complex Redox Reactions",
        subject: "Chemistry",
        averageAccuracyPercentage: 58,
        studentsStrugglingCount: 3,
      },
      {
        topicId: "trig-applications",
        topicTitle: "Trigonometric Heights & Distances",
        subject: "Mathematics",
        averageAccuracyPercentage: 61,
        studentsStrugglingCount: 3,
      },
      {
        topicId: "resistor-combinations",
        topicTitle: "Parallel Resistor Circuit Derivations",
        subject: "Physics",
        averageAccuracyPercentage: 64,
        studentsStrugglingCount: 2,
      },
    ];

    const laggingStudents: Array<{
      studentId: string;
      studentName: string;
      subject: string;
      scorePercentage: number;
      reason: string;
      suggestedAction: string;
    }> = [];

    teacherStudentsStore.forEach((st) => {
      st.subjects.forEach((sb) => {
        if (sb.status === "needs-attention" || sb.scorePercentage < 65) {
          laggingStudents.push({
            studentId: st.id,
            studentName: st.name,
            subject: sb.subject,
            scorePercentage: sb.scorePercentage,
            reason: `${sb.subject} score (${sb.scorePercentage}%) is below class target. Review ${st.weakTopics[0] || "fundamentals"}.`,
            suggestedAction: "Assign Remedial Quiz & Notify Allie",
          });
        }
      });
    });

    return {
      overview: {
        totalStudents,
        classAverageScore: avgScore,
        chapterCompletionRate: avgChapters,
        taskCompletionRate: avgTasks,
        activeStudentsRate: activeRate,
      },
      subjectStats,
      weakTopics,
      laggingStudents,
    };
  },

  scheduleTeacherTest: (
    req: TeacherScheduleTestRequest
  ): { event: CalendarEvent; message: string } => {
    const id = "evt_" + Date.now();
    const dateObj = new Date(req.scheduledDate);
    const dateStr = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newEvent: CalendarEvent = {
      id,
      day: dateObj.getDate() || 18,
      dateStr,
      title: req.title,
      subject: req.subject,
      durationMinutes: req.durationMinutes,
      questionsCount: req.questionsCount,
      type: (req.type as "quiz" | "mock") || "quiz",
      timeStr,
      status: "scheduled",
      scheduledAt: req.scheduledDate,
      quizTopicId: req.topicId || "teacher-scheduled",
    };

    // CRITICAL: Push directly into student academic calendar store!
    calendarEventsStore.push(newEvent);

    return {
      event: newEvent,
      message: `Test "${req.title}" scheduled and added to student calendar for ${dateStr}.`,
    };
  },

  getTeacherExportData: (format: "json" | "csv" = "json"): string | object => {
    if (format === "csv") {
      const header =
        "Student ID,Name,Grade,Section,Overall Score %,Attendance %,Tasks Completed,Chapters Completed,Teacher Rank (out of 10),Teacher Remarks\n";
      const rows = teacherStudentsStore
        .map((s) => {
          const cleanRemarks = (s.teacherRemarks || "").replace(/"/g, '""');
          return `"${s.id}","${s.name}","${s.grade}","${s.section}",${s.overallScorePercentage},${s.attendancePercentage},${s.tasksCompleted},${s.chaptersCompleted},${s.teacherRankOutOf10},"${cleanRemarks}"`;
        })
        .join("\n");
      return header + rows;
    }
    return teacherStudentsStore;
  },
};
