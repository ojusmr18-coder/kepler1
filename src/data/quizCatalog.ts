import masterQuizzesData from "./masterQuizzes.json";

export interface MasterQuestion {
  id: string;
  qNum: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subtopic: string;
}

export interface MasterChapterQuiz {
  id: string;
  code: string;
  aliases: string[];
  title: string;
  subject: string;
  subjectId: string;
  category: string;
  durationMinutes: number;
  questionCount: number;
  subtopics: string[];
  questions: MasterQuestion[];
  correctAnswers: Record<string, number>;
}

export interface ChapterSelectionItem {
  id: string;
  code: string;
  title: string;
  subject: string;
  subjectId: string;
  subtopicsCount: number;
  questionCount: number;
}

const chaptersRecord = masterQuizzesData.chapters as Record<string, MasterChapterQuiz>;
const aliasMap = masterQuizzesData.aliasMap as Record<string, string>;

/**
 * Resolves a chapter quiz by code, alias (e.g. "light-reflection", "real-numbers"), or title match.
 */
export function getQuizByTopicOrChapter(idOrSlug?: string): MasterChapterQuiz | null {
  if (!idOrSlug) return null;
  const cleanId = idOrSlug.toLowerCase().trim();

  // 1. Direct match by code
  if (chaptersRecord[cleanId]) {
    return chaptersRecord[cleanId];
  }
  // Upper-case code check (e.g. JESC109)
  const upperKey = cleanId.toUpperCase();
  if (chaptersRecord[upperKey]) {
    return chaptersRecord[upperKey];
  }

  // 2. Alias lookup
  const targetCode = aliasMap[cleanId];
  if (targetCode && chaptersRecord[targetCode]) {
    return chaptersRecord[targetCode];
  }

  // 3. Match by partial alias or title
  for (const ch of Object.values(chaptersRecord)) {
    if (ch.code.toLowerCase() === cleanId) return ch;
    if (ch.aliases.some((a) => a.toLowerCase() === cleanId)) return ch;
    if (ch.title.toLowerCase().includes(cleanId) || cleanId.includes(ch.title.toLowerCase())) {
      return ch;
    }
  }

  return null;
}

/**
 * Returns all chapters for a given subjectId (e.g. 'maths', 'physics', 'chemistry', 'biology', 'sst', 'english', 'hindi')
 */
export function getChaptersForSubject(subjectId: string): ChapterSelectionItem[] {
  const sId = subjectId.toLowerCase().trim();
  const list: ChapterSelectionItem[] = [];

  for (const ch of Object.values(chaptersRecord)) {
    if (ch.subjectId.toLowerCase() === sId || (sId === "science" && ["physics", "chemistry", "biology"].includes(ch.subjectId.toLowerCase()))) {
      list.push({
        id: ch.code,
        code: ch.code,
        title: ch.title,
        subject: ch.subject,
        subjectId: ch.subjectId,
        subtopicsCount: ch.subtopics.length,
        questionCount: ch.questionCount,
      });
    }
  }

  // Sort by code (e.g. jemh101 -> jemh114)
  return list.sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * Returns chapter items grouped by subject ID for easy consumption by CustomPracticeSelection
 */
export function getChaptersBySubjectMap(): Record<string, Array<{ id: string; title: string; subtopicsCount: number }>> {
  const map: Record<string, Array<{ id: string; title: string; subtopicsCount: number }>> = {
    maths: [],
    physics: [],
    chemistry: [],
    biology: [],
    sst: [],
    english: [],
    hindi: [],
  };

  for (const ch of Object.values(chaptersRecord)) {
    const sId = ch.subjectId.toLowerCase();
    if (!map[sId]) {
      map[sId] = [];
    }
    map[sId].push({
      id: ch.code,
      title: ch.title,
      subtopicsCount: ch.subtopics.length,
    });
  }

  // Sort chapters numerically / by code
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => a.id.localeCompare(b.id));
  }

  return map;
}

/**
 * Get all available chapter quizzes formatted for the test overview matrix
 */
export function getAllAvailableQuizzes(subjectFilter?: string): Array<{
  id: string;
  code: string;
  topicTitle: string;
  chapter: string;
  subject: string;
  subjectId: string;
  questionCount: number;
  durationMinutes: number;
  subtopics: string[];
}> {
  let list = Object.values(chaptersRecord);

  if (subjectFilter && subjectFilter.toLowerCase() !== "all") {
    const filter = subjectFilter.toLowerCase();
    list = list.filter(
      (c) =>
        c.subject.toLowerCase() === filter ||
        c.subjectId.toLowerCase() === filter ||
        (filter === "science" && ["physics", "chemistry", "biology"].includes(c.subjectId.toLowerCase()))
    );
  }

  return list.map((c) => ({
    id: c.code,
    code: c.code,
    topicTitle: c.title,
    chapter: c.title,
    subject: c.subject,
    subjectId: c.subjectId,
    questionCount: c.questionCount,
    durationMinutes: c.durationMinutes,
    subtopics: c.subtopics,
  }));
}

/**
 * Search targeted questions by a student's weak subtopic keywords
 */
export function getQuestionsForWeakSubtopic(weaknessText: string, limit = 5): MasterQuestion[] {
  const keywords = weaknessText.toLowerCase().split(/\s+/).filter((k) => k.length > 2);
  if (keywords.length === 0) return [];

  const matched: Array<{ score: number; q: MasterQuestion }> = [];

  for (const ch of Object.values(chaptersRecord)) {
    for (const q of ch.questions) {
      const haystack = `${q.subtopic} ${q.question} ${ch.title} ${ch.subject} ${q.options.join(" ")}`.toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (haystack.includes(kw)) score += 1;
      }
      if (score > 0) {
        matched.push({ score, q });
      }
    }
  }

  matched.sort((a, b) => b.score - a.score);
  return matched.slice(0, limit).map((m) => m.q);
}

/**
 * Generates an adaptive custom practice set from selected chapters
 */
export function buildCustomPracticeQuiz(chapterIds: string[], questionCount = 5): {
  quizId: string;
  title: string;
  subject: string;
  questions: MasterQuestion[];
  correctAnswers: Record<string, number>;
} {
  const resolvedChapters: MasterChapterQuiz[] = [];
  for (const cid of chapterIds) {
    const ch = getQuizByTopicOrChapter(cid);
    if (ch) resolvedChapters.push(ch);
  }

  if (resolvedChapters.length === 0) {
    // Fallback to first chapter
    const fallback = Object.values(chaptersRecord)[0];
    resolvedChapters.push(fallback);
  }

  // Aggregate questions across selected chapters
  const pool: MasterQuestion[] = [];
  resolvedChapters.forEach((ch) => pool.push(...ch.questions));

  // Pick questions evenly across chapters
  const selected: MasterQuestion[] = [];
  const correctMap: Record<string, number> = {};

  // Simple round-robin pick
  let idx = 0;
  while (selected.length < questionCount && pool.length > 0) {
    const q = pool[idx % pool.length];
    if (!selected.some((x) => x.id === q.id)) {
      selected.push(q);
      correctMap[q.id] = q.correctIndex;
    }
    idx++;
    if (idx >= pool.length * 2) break; // Avoid infinite loop
  }

  const primarySubject = resolvedChapters[0]?.subject || "CBSE Practice";
  const chapterTitles = resolvedChapters.map((c) => c.title).slice(0, 2).join(", ") + (resolvedChapters.length > 2 ? ` (+${resolvedChapters.length - 2} more)` : "");

  return {
    quizId: "custom_" + Date.now(),
    title: `Custom Practice: ${chapterTitles}`,
    subject: primarySubject,
    questions: selected,
    correctAnswers: correctMap,
  };
}

export const masterQuizzes = masterQuizzesData;
