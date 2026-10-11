"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Search,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { PracticeAndReviseSection } from "@/components/PracticeAndReviseSection";
import { apiClient } from "@/services/apiClient";

export interface SubjectChapter {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
  topicId?: string;
  pdfUrl?: string;
  hasQuiz?: boolean;
}

export interface SubjectItem {
  id: string;
  title: string;
  displayTitle: string;
  code: string;
  category: "Core Science" | "Mathematics" | "Languages" | "Applied Studies";
  themeGradient: string;
  iconType: "dna" | "flask" | "code" | "letter-a" | "hindi" | "data" | "pi" | "health" | "physics" | "globe";
  chaptersCount: number;
  chapters: SubjectChapter[];
}

export const SUBJECTS_DATA: SubjectItem[] = [
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
    ]
  },
  {
    id: "chemistry",
    title: "Chemistry",
    displayTitle: "Chemistry",
    code: "CHEM-10",
    category: "Core Science",
    themeGradient: "from-[#186470] via-[#134E58] to-[#0D363D]",
    iconType: "flask",
    chaptersCount: 5,
    chapters: [
      { id: "chem-1", number: 1, title: "Chemical Reactions and Equations", description: "Balancing chemical equations, combination, decomposition, displacement, and redox reactions.", durationMinutes: 45, topicId: "chemical-reactions", hasQuiz: true },
      { id: "chem-2", number: 2, title: "Acids, Bases and Salts", description: "pH scale, neutralization, chemical properties, washing soda, baking soda, and plaster of Paris.", durationMinutes: 50, topicId: "acids-bases", hasQuiz: true },
      { id: "chem-3", number: 3, title: "Metals and Non-Metals", description: "Physical & chemical properties, reactivity series, ionic compounds, and metallurgy basics.", durationMinutes: 55, topicId: "metals-nonmetals", hasQuiz: true },
      { id: "chem-4", number: 4, title: "Carbon and its Compounds", description: "Covalent bonding, versatile nature of carbon, homologous series, and IUPAC nomenclature.", durationMinutes: 60, topicId: "carbon-compounds", hasQuiz: true },
      { id: "chem-5", number: 5, title: "Periodic Classification of Elements", description: "Dobereiner's triads, Newlands' octaves, Mendeleev's periodic table, and Modern Periodic trends.", durationMinutes: 45, topicId: "periodic-classification", hasQuiz: true },
    ]
  },
  {
    id: "biology",
    title: "Biology",
    displayTitle: "Biology",
    code: "BIO-10",
    category: "Core Science",
    themeGradient: "from-[#1B362A] via-[#152B21] to-[#0F1E17]",
    iconType: "dna",
    chaptersCount: 6,
    chapters: [
      { id: "bio-1", number: 1, title: "Life Processes", description: "Nutrition (autotrophic & heterotrophic), respiration, human circulatory system, and excretion.", durationMinutes: 60, topicId: "life-processes", hasQuiz: true },
      { id: "bio-2", number: 2, title: "Control and Coordination", description: "Nervous system, reflex arc, human brain structure, and plant & animal hormones.", durationMinutes: 45, topicId: "control-coordination", hasQuiz: true },
      { id: "bio-3", number: 3, title: "How do Organisms Reproduce?", description: "Asexual reproduction methods, sexual reproduction in flowering plants, and human reproductive system.", durationMinutes: 50, topicId: "reproduction", hasQuiz: true },
      { id: "bio-4", number: 4, title: "Heredity and Evolution", description: "Mendelian genetics, monohybrid & dihybrid crosses, sex determination, and speciation.", durationMinutes: 45, topicId: "heredity", hasQuiz: true },
      { id: "bio-5", number: 5, title: "Our Environment", description: "Ecosystem dynamics, food chains, trophic levels, biomagnification, and ozone layer depletion.", durationMinutes: 35, topicId: "our-environment", hasQuiz: true },
      { id: "bio-6", number: 6, title: "Sustainable Management of Natural Resources", description: "Conservation of forests, wildlife, dams, water harvesting, and the 5 R's principle.", durationMinutes: 30, topicId: "natural-resources", hasQuiz: true },
    ]
  },
  {
    id: "maths",
    title: "Mathematics",
    displayTitle: "Maths",
    code: "MATH-10",
    category: "Mathematics",
    themeGradient: "from-[#1E293B] via-[#172131] to-[#0F172A]",
    iconType: "pi",
    chaptersCount: 14,
    chapters: [
      { id: "math-1", number: 1, title: "Real Numbers", description: "Fundamental Theorem of Arithmetic, irrationality proofs, and decimal expansions.", durationMinutes: 45, topicId: "real-numbers", hasQuiz: true },
      { id: "math-2", number: 2, title: "Polynomials", description: "Geometrical meaning of zeroes, relationship between zeroes and coefficients.", durationMinutes: 40, topicId: "polynomials", hasQuiz: true },
      { id: "math-3", number: 3, title: "Pair of Linear Equations in Two Variables", description: "Graphical method, substitution method, elimination method, and consistency.", durationMinutes: 50, topicId: "linear-equations", hasQuiz: true },
      { id: "math-4", number: 4, title: "Quadratic Equations", description: "Standard form, factorization, quadratic formula, and nature of roots.", durationMinutes: 50, topicId: "quadratic-equations", hasQuiz: true },
      { id: "math-5", number: 5, title: "Arithmetic Progressions", description: "nth term of an AP, sum of first n terms, and word problems.", durationMinutes: 45, topicId: "arithmetic-progressions", hasQuiz: true },
      { id: "math-6", number: 6, title: "Triangles", description: "Basic Proportionality Theorem (Thales), similarity criteria (AAA, SSS, SAS).", durationMinutes: 55, topicId: "triangles", hasQuiz: true },
      { id: "math-7", number: 7, title: "Coordinate Geometry", description: "Distance formula, section formula, midpoint formula, and collinearity.", durationMinutes: 45, topicId: "coordinate-geometry", hasQuiz: true },
      { id: "math-8", number: 8, title: "Introduction to Trigonometry", description: "Trigonometric ratios, values at standard angles, and Pythagorean trigonometric identities.", durationMinutes: 55, topicId: "intro-trigonometry", hasQuiz: true },
      { id: "math-9", number: 9, title: "Some Applications of Trigonometry", description: "Heights and distances, line of sight, angle of elevation, and angle of depression.", durationMinutes: 45, topicId: "applications-trigonometry", hasQuiz: true },
      { id: "math-10", number: 10, title: "Circles", description: "Tangents to a circle, theorems on tangent perpendicularity and lengths from external point.", durationMinutes: 40, topicId: "circles", hasQuiz: true },
      { id: "math-11", number: 11, title: "Areas Related to Circles", description: "Area of sector, area of segment of circle, and perimeter combinations.", durationMinutes: 40, topicId: "areas-circles", hasQuiz: true },
      { id: "math-12", number: 12, title: "Surface Areas and Volumes", description: "Surface area and volume of combinations of solids (cubes, cylinders, cones, spheres).", durationMinutes: 50, topicId: "surface-areas-volumes", hasQuiz: true },
      { id: "math-13", number: 13, title: "Statistics", description: "Mean of grouped data (direct & assumed mean), median, and mode.", durationMinutes: 45, topicId: "statistics", hasQuiz: true },
      { id: "math-14", number: 14, title: "Probability", description: "Theoretical probability of events, coin, die, and card problems.", durationMinutes: 35, topicId: "probability", hasQuiz: true },
    ]
  },
  {
    id: "english",
    title: "English",
    displayTitle: "English",
    code: "ENG-10",
    category: "Languages",
    themeGradient: "from-[#7C2D12] via-[#65230D] to-[#431407]",
    iconType: "letter-a",
    chaptersCount: 11,
    chapters: [
      { id: "eng-1", number: 1, title: "A Letter to God & Dust of Snow", description: "Faith and irony in Lencho's story, nature's healing power in poetry.", durationMinutes: 35, hasQuiz: true },
      { id: "eng-2", number: 2, title: "Nelson Mandela: Long Walk to Freedom", description: "Struggle against apartheid, courage, and universal human freedom.", durationMinutes: 40, hasQuiz: true },
      { id: "eng-3", number: 3, title: "Two Stories about Flying", description: "His First Flight & The Black Aeroplane – conquering fear and mystery.", durationMinutes: 40, hasQuiz: true },
      { id: "eng-4", number: 4, title: "From the Diary of Anne Frank", description: "Personal reflections during wartime hiding and the bond with Kitty.", durationMinutes: 40, hasQuiz: true },
      { id: "eng-5", number: 5, title: "Glimpses of India", description: "A Baker from Goa, Coorg, and Tea from Assam – rich cultural heritage.", durationMinutes: 45, hasQuiz: true },
      { id: "eng-6", number: 6, title: "Mijbil the Otter & Madam Rides the Bus", description: "Affectionate bonding with pets, and Valli's first innocent adventure.", durationMinutes: 45, hasQuiz: true },
      { id: "eng-7", number: 7, title: "The Sermon at Benares & The Proposal", description: "Kisa Gotami's realization on mortality, and Chekhov's farcical play.", durationMinutes: 45, hasQuiz: true },
      { id: "eng-8", number: 8, title: "A Triumph of Surgery", description: "Tricki the pampered dog and James Herriot's pragmatic common sense.", durationMinutes: 35, hasQuiz: true },
      { id: "eng-9", number: 9, title: "The Thief's Story & The Midnight Visitor", description: "Anil's reforming trust in Hari Singh, and Ausable's witty secret agent intellect.", durationMinutes: 40, hasQuiz: true },
      { id: "eng-10", number: 10, title: "Footprints without Feet & The Making of a Scientist", description: "Griffin's misuse of science, and Richard Ebright's curious journey into biology.", durationMinutes: 45, hasQuiz: true },
      { id: "eng-11", number: 11, title: "The Necklace & Bholi", description: "Matilda's ruinous vanity, and Bholi's transformative education and self-respect.", durationMinutes: 40, hasQuiz: true },
    ]
  },
  {
    id: "hindi",
    title: "Hindi",
    displayTitle: "Hindi",
    code: "HIN-10",
    category: "Languages",
    themeGradient: "from-[#78350F] via-[#5F2709] to-[#3B1904]",
    iconType: "hindi",
    chaptersCount: 10,
    chapters: [
      { id: "hin-1", number: 1, title: "नेताजी का चश्मा (स्वयं प्रकाश)", description: "कैप्टन चश्मेवाले की देशभक्ति और देशप्रेम की सच्ची भावना।", durationMinutes: 35, hasQuiz: true },
      { id: "hin-2", number: 2, title: "बालगोबिन भगत (रामवृक्ष बेनीपुरी)", description: "कबीरपंथी संन्यासी का सादा जीवन और सामाजिक रूढ़ियों का खंडन।", durationMinutes: 40, hasQuiz: true },
      { id: "hin-3", number: 3, title: "लखनवी अंदाज़ (यशपाल)", description: "सामंती नफासत और बनावटी जीवनशैली पर तीखा व्यंग्य।", durationMinutes: 35, hasQuiz: true },
      { id: "hin-4", number: 4, title: "एक कहानी यह भी (मन्नू भंडारी)", description: "लेखिका के बचपन के अनुभव और स्वतंत्रता आंदोलन का प्रभाव।", durationMinutes: 40, hasQuiz: true },
      { id: "hin-5", number: 5, title: "नौबतखाने में इबादत (यतींद्र मिश्र)", description: "उस्ताद बिस्मिल्ला खाँ की संगीत साधना और गंगा-जमुनी तहज़ीब।", durationMinutes: 40, hasQuiz: true },
      { id: "hin-6", number: 6, title: "सूरदास के पद (काव्य खंड)", description: "गोपियों का विरह और उद्धव के ज्ञानोपदेश पर प्रेम की विजय।", durationMinutes: 40, hasQuiz: true },
      { id: "hin-7", number: 7, title: "राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)", description: "धनुर्भंग के उपरांत ओजस्वी संवाद और विनय का सामंजस्य।", durationMinutes: 45, hasQuiz: true },
      { id: "hin-8", number: 8, title: "उत्साह और अट नहीं रही है (सूर्यकांत त्रिपाठी निराला)", description: "बादलों का आह्वान, क्रांति चेतना और फागुन का अप्रतिम सौंदर्य।", durationMinutes: 35, hasQuiz: true },
      { id: "hin-9", number: 9, title: "यह दंतुरित मुसकान और फसल (नागार्जुन)", description: "शिशु की मोहक मुसकान और कृषक परिश्रम का जीवंत चित्रण।", durationMinutes: 35, hasQuiz: true },
      { id: "hin-10", number: 10, title: "संगतकार (मंगलेश डबराल)", description: "मुख्य गायक को संबल देने वाले सहयोगी कलाकारों का महत्व।", durationMinutes: 30, hasQuiz: true },
    ]
  },
  {
    id: "sst",
    title: "Social Science (SST)",
    displayTitle: "SST",
    code: "SST-10",
    category: "Applied Studies",
    themeGradient: "from-[#44403C] via-[#332E2B] to-[#1C1917]",
    iconType: "globe",
    chaptersCount: 12,
    chapters: [
      { id: "sst-1", number: 1, title: "The Rise of Nationalism in Europe", description: "French Revolution, romanticism, unification of Germany & Italy, and nation-state emergence.", durationMinutes: 45, hasQuiz: true },
      { id: "sst-2", number: 2, title: "Nationalism in India", description: "Non-Cooperation, Civil Disobedience, Salt March, and collective belonging.", durationMinutes: 50, hasQuiz: true },
      { id: "sst-3", number: 3, title: "The Making of a Global World", description: "Pre-modern silk routes, colonialism, trade, and Bretton Woods institutions.", durationMinutes: 40, hasQuiz: true },
      { id: "sst-4", number: 4, title: "Print Culture and the Modern World", description: "Evolution of print technology from East Asia to Europe and its revolutionary impact.", durationMinutes: 40, hasQuiz: true },
      { id: "sst-5", number: 5, title: "Resources and Development", description: "Classification of resources, land degradation, soil types, and conservation.", durationMinutes: 40, hasQuiz: true },
      { id: "sst-6", number: 6, title: "Forest and Wildlife & Water Resources", description: "Flora, fauna conservation, multi-purpose river projects, and rainwater harvesting.", durationMinutes: 45, hasQuiz: true },
      { id: "sst-7", number: 7, title: "Agriculture", description: "Types of farming, cropping seasons (Rabi, Kharif, Zaid), and technological reforms.", durationMinutes: 40, hasQuiz: true },
      { id: "sst-8", number: 8, title: "Minerals and Energy Resources", description: "Metallic & non-metallic minerals, coal, petroleum, natural gas, and renewable power.", durationMinutes: 45, hasQuiz: true },
      { id: "sst-9", number: 9, title: "Power Sharing & Federalism", description: "Belgium vs Sri Lanka models, decentralization, and state-centre relations.", durationMinutes: 45, hasQuiz: true },
      { id: "sst-10", number: 10, title: "Political Parties & Outcomes of Democracy", description: "Functions, party system in India, democratic accountability, and social diversity.", durationMinutes: 45, hasQuiz: true },
      { id: "sst-11", number: 11, title: "Development & Sectors of the Indian Economy", description: "National income, HDI metrics, primary, secondary, tertiary sectors, and formal employment.", durationMinutes: 45, hasQuiz: true },
      { id: "sst-12", number: 12, title: "Money and Credit & Globalisation", description: "Banking, formal vs informal credit, SHGs, MNCs, and WTO trade integration.", durationMinutes: 50, hasQuiz: true },
    ]
  },
  {
    id: "computer-science",
    title: "Computer Science (IT 402)",
    displayTitle: "Comput...",
    code: "CS-402",
    category: "Applied Studies",
    themeGradient: "from-[#134E4A] via-[#0E3936] to-[#062422]",
    iconType: "code",
    chaptersCount: 6,
    chapters: [
      { id: "cs-1", number: 1, title: "Communication & Self-Management Skills", description: "Verbal/non-verbal communication, stress management, and self-motivation strategies.", durationMinutes: 35, hasQuiz: true },
      { id: "cs-2", number: 2, title: "Information and Communication Technology (ICT) Skills", description: "Operating systems, file management, cyber safety, and maintenance.", durationMinutes: 35, hasQuiz: true },
      { id: "cs-3", number: 3, title: "Digital Documentation (Advanced)", description: "Styles, templates, table of contents, and mail merge in document processors.", durationMinutes: 45, hasQuiz: true },
      { id: "cs-4", number: 4, title: "Electronic Spreadsheet (Advanced)", description: "Scenarios, Goal Seek, Subtotals, linking data, and macro automation.", durationMinutes: 50, hasQuiz: true },
      { id: "cs-5", number: 5, title: "Database Management System (RDBMS)", description: "Relational data model, primary keys, queries, forms, and report generation in SQL.", durationMinutes: 55, hasQuiz: true },
      { id: "cs-6", number: 6, title: "Web Applications and Security", description: "Network types, instant messaging, blog creation, online safety, and workplace hazards.", durationMinutes: 45, hasQuiz: true },
    ]
  },
  {
    id: "informatics-practices",
    title: "Artificial Intelligence (AI 417)",
    displayTitle: "Informati...",
    code: "AI-417",
    category: "Applied Studies",
    themeGradient: "from-[#253245] via-[#1B2737] to-[#0F172A]",
    iconType: "data",
    chaptersCount: 5,
    chapters: [
      { id: "ip-1", number: 1, title: "Introduction to Artificial Intelligence", description: "AI, ML, DL distinctions, three domains of AI, and smart home & city applications.", durationMinutes: 40, hasQuiz: true },
      { id: "ip-2", number: 2, title: "AI Project Cycle", description: "Problem scoping, data acquisition, data exploration, modelling, and evaluation stages.", durationMinutes: 50, hasQuiz: true },
      { id: "ip-3", number: 3, title: "Data Literacy & Advance Python for AI", description: "NumPy arrays, data analysis structures, and algorithmic decision trees.", durationMinutes: 50, hasQuiz: true },
      { id: "ip-4", number: 4, title: "Computer Vision & Natural Language Processing", description: "Image features, pixel arrays, text preprocessing, tokenization, and bag of words.", durationMinutes: 50, hasQuiz: true },
      { id: "ip-5", number: 5, title: "Evaluation & AI Ethics", description: "Confusion matrix, accuracy, precision, recall, F1 score, and AI bias & privacy.", durationMinutes: 45, hasQuiz: true },
    ]
  },
  {
    id: "physical-education",
    title: "Physical Education",
    displayTitle: "Physical..",
    code: "PED-10",
    category: "Applied Studies",
    themeGradient: "from-[#233831] via-[#1A2C26] to-[#111E1A]",
    iconType: "health",
    chaptersCount: 5,
    chapters: [
      { id: "ped-1", number: 1, title: "Human Body & Growth Physiology", description: "Skeletal system, muscular system, cardio-respiratory endurance, and posture.", durationMinutes: 35, hasQuiz: true },
      { id: "ped-2", number: 2, title: "Physical Fitness, Wellness and Lifestyle", description: "Components of fitness (strength, endurance, speed, flexibility), and stress reduction.", durationMinutes: 40, hasQuiz: true },
      { id: "ped-3", number: 3, title: "Yoga as Preventive Care", description: "Asanas for lifestyle diseases, pranayama, meditation, and mental focus.", durationMinutes: 45, hasQuiz: true },
      { id: "ped-4", number: 4, title: "Sports & Nutrition Fundamentals", description: "Balanced diet, macro & micro nutrients, hydration, and healthy weight management.", durationMinutes: 40, hasQuiz: true },
      { id: "ped-5", number: 5, title: "Common Sports Injuries & First Aid", description: "Sprains, strains, fractures, R.I.C.E. procedure, and sports safety guidelines.", durationMinutes: 35, hasQuiz: true },
    ]
  }
];

export function LearnSubjectView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject");

  // Selected subject state for full-page chapter view
  const [activeSubject, setActiveSubject] = React.useState<SubjectItem | null>(null);
  const [subjectsList, setSubjectsList] = React.useState<SubjectItem[]>(SUBJECTS_DATA);

  // Accordion open/close state for the All Chapters list
  const [isChaptersExpanded, setIsChaptersExpanded] = React.useState<boolean>(true);

  // Curriculum dropdown state
  const [selectedCurriculum, setSelectedCurriculum] = React.useState<string>("NCERT");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const curriculumOptions = [
    { label: "NCERT", description: "National Council of Educational Research" },
    { label: "CBSE Exemplar", description: "High-yield application questions" },
    { label: "JEE Main Prep", description: "Competitive engineering focus" }
  ];

  // Fetch subjects dynamically from backend API on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadSubjects() {
      try {
        const response = await apiClient.learn.getSubjects();
        if (isMounted && response?.subjects && response.subjects.length > 0) {
          setSubjectsList(response.subjects as unknown as SubjectItem[]);
        }
      } catch (err) {
        console.info("Using local subjects curriculum fallback:", err);
      }
    }
    loadSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync active subject with URL query parameter
  React.useEffect(() => {
    if (subjectParam) {
      const match = subjectsList.find((s) => s.id === subjectParam);
      if (match) {
        setActiveSubject(match);
      }
    }
  }, [subjectParam, subjectsList]);

  // Filter subjects by search query
  const filteredSubjects = React.useMemo(() => {
    if (!searchQuery.trim()) return subjectsList;
    return subjectsList.filter((s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, subjectsList]);

  // Split subjects into rows of 4 for authentic bookshelf layout
  const shelfRows = React.useMemo(() => {
    const rows: SubjectItem[][] = [];
    for (let i = 0; i < filteredSubjects.length; i += 4) {
      rows.push(filteredSubjects.slice(i, i + 4));
    }
    return rows;
  }, [filteredSubjects]);

  const handleOpenChapterPdf = (chapter: SubjectChapter) => {
    const pdfUrl =
      chapter.pdfUrl ||
      `/api/pdf?subject=${encodeURIComponent(activeSubject?.id || "science")}&chapter=${encodeURIComponent(chapter.id)}&title=${encodeURIComponent(chapter.title)}&desc=${encodeURIComponent(chapter.description || "")}`;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  // Render SVG emblems for the 3D book covers
  const renderEmblem = (iconType: SubjectItem["iconType"]) => {
    switch (iconType) {
      case "dna":
        return (
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-200/95 stroke-current fill-none stroke-[2.2]" viewBox="0 0 48 48">
            <path d="M14 8C20 16 28 16 34 24C40 32 32 32 34 40" strokeLinecap="round" />
            <path d="M34 8C28 16 20 16 14 24C8 32 16 32 14 40" strokeLinecap="round" />
            <path d="M17 12H31M15 20H33M15 28H33M17 36H31" strokeLinecap="round" strokeWidth="2" />
          </svg>
        );
      case "flask":
        return (
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-teal-200/95 stroke-current fill-none stroke-[2.2]" viewBox="0 0 48 48">
            <path d="M20 8H28M22 8V18L13 36C12 38 13.5 40 16 40H32C34.5 40 36 38 35 36L26 18V8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 30H31" strokeLinecap="round" strokeWidth="1.8" />
            <circle cx="21" cy="34" r="1.5" fill="currentColor" />
            <circle cx="27" cy="33" r="2" fill="currentColor" />
          </svg>
        );
      case "code":
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-10 rounded-lg border-2 border-teal-300/40 bg-black/40 flex items-center justify-center p-1.5 shadow-inner">
              <span className="text-teal-200 font-mono text-xs font-bold">&lt;/&gt;</span>
            </div>
            <div className="w-4 h-2 bg-teal-400/40 rounded-b mt-0.5" />
            <div className="w-8 h-1 bg-teal-400/30 rounded-full" />
          </div>
        );
      case "letter-a":
        return (
          <div className="w-16 h-16 flex items-center justify-center">
            <span className="text-amber-100/95 font-serif font-black text-5xl tracking-tighter drop-shadow-md">
              A
            </span>
          </div>
        );
      case "hindi":
        return (
          <div className="w-16 h-16 flex flex-col items-center justify-center">
            <span className="text-amber-200/95 font-serif font-bold text-4xl leading-none drop-shadow-md">
              हिं
            </span>
            <div className="w-8 h-1 bg-amber-300/50 rounded-full mt-1" />
          </div>
        );
      case "data":
        return (
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-slate-200/90 stroke-current fill-none stroke-[2.2]" viewBox="0 0 48 48">
            <ellipse cx="24" cy="12" rx="14" ry="5" />
            <path d="M10 12V24C10 26.8 16.3 29 24 29C31.7 29 38 26.8 38 24V12" />
            <path d="M10 24V36C10 38.8 16.3 41 24 41C31.7 41 38 38.8 38 36V24" />
          </svg>
        );
      case "pi":
        return (
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-amber-200/95 stroke-current fill-none stroke-[2.8]" viewBox="0 0 48 48">
            <path d="M10 14H38M17 14V36M31 14V34C31 35.5 32.5 36.5 34 36.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="24" r="16" opacity="0.2" strokeWidth="1.5" />
          </svg>
        );
      case "health":
        return (
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-200/90 stroke-current fill-none stroke-[2.2]" viewBox="0 0 48 48">
            <path d="M24 7L38 13V24C38 32.5 32 39 24 42C16 39 10 32.5 10 24V13L24 7Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 16V28M18 22H30" strokeLinecap="round" />
          </svg>
        );
      case "physics":
        return (
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-slate-100/95 stroke-current fill-none stroke-[2.4]" viewBox="0 0 48 48">
            <path d="M16 12V24C16 28.4 19.6 32 24 32C28.4 32 32 28.4 32 24V12" strokeLinecap="round" />
            <path d="M12 12H20M28 12H36" strokeLinecap="round" strokeWidth="3" />
            <path d="M24 8C14 8 8 18 8 24C8 30 14 40 24 40C34 40 40 30 40 24C40 18 34 8 24 8Z" opacity="0.3" strokeWidth="1.2" strokeDasharray="3 3" />
          </svg>
        );
      case "globe":
        return (
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-stone-200/90 stroke-current fill-none stroke-[2.2]" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="15" />
            <path d="M9 24H39" opacity="0.6" />
            <path d="M24 9C28 13 30 18 30 24C30 30 28 35 24 39C20 35 18 30 18 24C18 18 20 13 24 9Z" />
          </svg>
        );
      default:
        return <BookOpen className="w-12 h-12 text-white/80" />;
    }
  };

  // =========================================================================
  // VIEW MODE A: FULL-PAGE CHAPTER VIEW (matching user reference images)
  // =========================================================================
  if (activeSubject) {
    return (
      <div className="min-h-screen w-full bg-[#F4F7FC] text-slate-800 flex flex-col p-4 sm:p-6 lg:p-8 pl-16 sm:pl-20 lg:pl-24 pr-4 sm:pr-8 lg:pr-12 antialiased select-none">
        {/* Top Breadcrumb Navigation */}
        <div className="w-full max-w-7xl 2xl:max-w-[1560px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <button
              type="button"
              onClick={() => {
                setActiveSubject(null);
                router.push("/learn", { scroll: false });
              }}
              className="hover:text-slate-900 transition-colors font-medium cursor-pointer"
            >
              Explore
            </button>
            <span className="text-slate-400">&gt;</span>
            <button
              type="button"
              onClick={() => {
                setActiveSubject(null);
                router.push("/learn", { scroll: false });
              }}
              className="hover:text-slate-900 transition-colors font-medium cursor-pointer"
            >
              Study
            </button>
            <span className="text-slate-400">&gt;</span>
            <span className="font-semibold text-slate-900">{activeSubject.title}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveSubject(null);
              router.push("/learn", { scroll: false });
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Subjects</span>
          </button>
        </div>

        {/* 2-Column Full-Page Stage: Left Sidebar + Right Chapter List */}
        <div className="w-full max-w-7xl 2xl:max-w-[1560px] mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 items-start flex-1">
          
          {/* LEFT SIDEBAR: Subject List */}
          <aside className="w-full md:w-56 lg:w-64 shrink-0 flex flex-col space-y-1.5">
            {SUBJECTS_DATA.map((subject) => {
              const isCurrent = subject.id === activeSubject.id;
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => {
                    setActiveSubject(subject);
                    router.push(`/learn?subject=${subject.id}`, { scroll: false });
                  }}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? "bg-[#E2E8F0]/90 text-slate-900 font-bold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium"
                  }`}
                >
                  <span className="truncate">{subject.title}</span>
                </button>
              );
            })}
          </aside>

          {/* RIGHT MAIN CONTAINER: Expanded Subject Chapters Card */}
          <main className="flex-1 w-full min-w-0 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-10 lg:p-12">
            {/* Header: Subject Title + Class 10 */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeSubject.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Class 10
              </p>
            </div>

            {/* Collapsible "All Chapters" Container */}
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden mb-10">
              {/* Accordion Trigger */}
              <button
                type="button"
                onClick={() => setIsChaptersExpanded(!isChaptersExpanded)}
                className="w-full flex items-center justify-between p-5 sm:px-8 bg-white hover:bg-slate-50/70 transition-colors text-left cursor-pointer"
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    All Chapters
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {activeSubject.chapters.length} chapters
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${
                    isChaptersExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Chapter Rows with enhanced width & spacing */}
              {isChaptersExpanded && (
                <div className="border-t border-slate-200/80 divide-y divide-slate-100 bg-white">
                  {activeSubject.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="p-5 sm:px-8 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div
                        className="min-w-0 cursor-pointer flex-1 pr-4"
                        onClick={() => handleOpenChapterPdf(chapter)}
                      >
                        <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
                          {chapter.title}
                        </h3>
                        {chapter.description && (
                          <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 mt-1">
                            {chapter.description}
                          </p>
                        )}
                      </div>

                      {/* Clean Study Action (Only Study button, Quiz removed) */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenChapterPdf(chapter)}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                          title="Open Chapter PDF Notes"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Study</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revision Content Section */}
            <div className="pt-2">
              <div className="inline-block mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Revision Content
                </h3>
                <div className="w-12 h-0.5 bg-amber-400 rounded-full mt-0.5" />
              </div>

              {/* Revision Content Action Card */}
              <div
                onClick={() => {
                  router.push(`/revision?subject=${encodeURIComponent(activeSubject.id)}&title=${encodeURIComponent(activeSubject.title + ' Quick Revision')}`);
                }}
                className="w-full p-5 sm:p-6 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Class 10th Quick Revision &amp; Formula Sheets
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {activeSubject.chapters.length} chapters &bull; High-yield summary cards
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

          </main>
        </div>

        {/* 3. PRACTICE MORE & REVISE NOW (Shown on scroll) */}
        <div className="w-full max-w-7xl 2xl:max-w-[1560px] mx-auto mt-12 sm:mt-16 pb-12">
          <PracticeAndReviseSection />
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE B: BOOKSHELF SELECTION VIEW (when no subject is selected)
  // =========================================================================
  return (
    <div className="min-h-screen w-full bg-[#F4F7FC] text-slate-800 flex flex-col p-4 sm:p-6 lg:p-8 pl-16 sm:pl-20 lg:pl-24 antialiased select-none">
      {/* 1. TOP BREADCRUMB & BACK NAVIGATION */}
      <div className="w-full max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Classroom Dashboard</span>
        </Link>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or topics..."
            className="pl-8 pr-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 w-44 sm:w-56 shadow-2xs"
          />
        </div>
      </div>

      {/* 2. MAIN BOOKSHELF STAGE CONTAINER */}
      <main className="w-full max-w-6xl mx-auto py-2">
        <div className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-10">
          
          {/* Header Row: "Select Subject" & "NCERT" Dropdown */}
          <div className="flex items-center justify-between pb-8 mb-4 border-b border-slate-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Select Subject
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Choose a subject textbook to open theory modules, formulas, and study chapters.
              </p>
            </div>

            {/* Curriculum Dropdown (NCERT) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <span>{selectedCurriculum}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <span className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Curriculum Standards
                  </span>
                  {curriculumOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setSelectedCurriculum(opt.label);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex flex-col transition-colors cursor-pointer ${
                        selectedCurriculum === opt.label
                          ? "bg-slate-100 text-slate-900 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{opt.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* THE BOOKSHELF: Shelves with 3D Book Covers sitting on realistic ledges     */}
          {/* ========================================================================= */}
          <div className="space-y-10 sm:space-y-12 pt-2">
            {shelfRows.length === 0 && (
              <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">No subjects found</p>
                <p className="text-xs text-slate-400 mt-1">
                  No subjects match your current filter. Try searching for a different keyword.
                </p>
              </div>
            )}
            {shelfRows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative">
                {/* Book Row Grid: 4 books per shelf */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 items-end px-3 sm:px-6 z-10 relative">
                  {row.map((subject) => (
                    <div
                      key={subject.id}
                      onClick={() => {
                        setActiveSubject(subject);
                        router.push(`/learn?subject=${subject.id}`, { scroll: false });
                      }}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      {/* 3D Standing Book Cover */}
                      <div
                        className={`relative w-[130px] sm:w-[145px] h-[175px] sm:h-[195px] rounded-2xl bg-gradient-to-br ${subject.themeGradient}
                          p-3 flex flex-col items-center justify-between text-white shadow-[0_12px_24px_-6px_rgba(15,23,42,0.25)]
                          transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_20px_32px_-6px_rgba(15,23,42,0.35)] group-hover:rotate-[-1deg]`}
                      >
                        {/* Book Spine 3D Curve Shadow on the edge */}
                        <div className="absolute right-0 top-0 bottom-0 w-3 rounded-r-2xl bg-black/25 pointer-events-none" />
                        <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-white/15 pointer-events-none" />

                        {/* Top: Subtle category tag */}
                        <div className="w-full flex items-center justify-between text-[10px] text-white/75 font-mono tracking-tight px-1 font-medium">
                          <span>{subject.code}</span>
                          <span className="text-[9px] uppercase tracking-wider text-white/60">{selectedCurriculum}</span>
                        </div>

                        {/* Center: Custom Subject Emblem */}
                        <div className="my-auto transition-transform duration-300 group-hover:scale-110">
                          {renderEmblem(subject.iconType)}
                        </div>

                        {/* Bottom: Frosted Subject Title Pill */}
                        <div className="w-full pt-1">
                          <div className="w-full py-1.5 px-2 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-center shadow-xs">
                            <span className="text-xs sm:text-[13px] font-bold text-white tracking-wide truncate block">
                              {subject.displayTitle}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Page Pages Edge Texture */}
                        <div className="absolute -bottom-1 left-2 right-4 h-1 bg-stone-200/90 rounded-b-xs shadow-xs pointer-events-none" />
                      </div>

                      {/* Subtle book ground contact shadow */}
                      <div className="w-24 h-2 bg-slate-400/20 rounded-full blur-xs mt-1 transition-all duration-300 group-hover:w-20 group-hover:opacity-40" />
                    </div>
                  ))}
                </div>

                {/* THE SHELF LEDGE (Horizontal Bar where the books rest) */}
                <div className="w-full h-3 sm:h-3.5 bg-gradient-to-b from-white via-slate-200 to-slate-300 rounded-full border border-slate-300/60 shadow-[0_6px_12px_-2px_rgba(15,23,42,0.06)] mt-[-4px]" />
              </div>
            ))}
          </div>

        </div>
        
        {/* 3. PRACTICE MORE & REVISE NOW (Shown on scroll) */}
        <div className="mt-12 sm:mt-16 pb-12">
          <PracticeAndReviseSection />
        </div>
      </main>
    </div>
  );
}
