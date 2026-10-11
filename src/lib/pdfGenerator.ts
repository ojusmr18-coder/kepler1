/**
 * Clean, zero-dependency PDF-1.4 stream generator for Kepler chapter study materials.
 */

function sanitizeForPdf(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "*")
    .replace(/[\u00A0]/g, " ")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text: string, maxCharsPerLine = 78): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export interface ChapterPdfData {
  title: string;
  subject?: string;
  chapterId?: string;
  description?: string;
  keyPoints?: string[];
  formulas?: string[];
}

export function generateChapterPdfBuffer(data: ChapterPdfData): Buffer {
  const subjectName = (data.subject || "General Science").toUpperCase();
  const chapterTitle = data.title || "Chapter Study Guide";
  const desc = data.description || "Comprehensive syllabus study notes, key principles, and conceptual summaries for board examinations and entrance tests.";

  const contentOps: string[] = [
    "BT",
    // Header Title
    "/F1 20 Tf",
    "50 780 Td",
    `(${sanitizeForPdf("KEPLER LEARNING PLATFORM")}) Tj`,
    
    // Subtitle / Curriculum
    "0 -18 Td",
    "/F2 10 Tf",
    `(${sanitizeForPdf("NCERT / CBSE Class 10 Curriculum - Comprehensive Chapter Study Document")}) Tj`,
    
    // Divider line
    "0 -14 Td",
    `(${sanitizeForPdf("------------------------------------------------------------------------------------------------------")}) Tj`,
    
    // Subject Badge & Chapter Title
    "0 -28 Td",
    "/F1 16 Tf",
    `(${sanitizeForPdf(chapterTitle)}) Tj`,
    
    "0 -18 Td",
    "/F2 11 Tf",
    `(${sanitizeForPdf(`Subject: ${subjectName}  |  Chapter ID: ${data.chapterId || "MODULE-10"}`)}) Tj`,
    
    // Section 1: Overview
    "0 -28 Td",
    "/F1 12 Tf",
    `(${sanitizeForPdf("1. CHAPTER OVERVIEW & LEARNING OBJECTIVES")}) Tj`,
    "/F2 10 Tf"
  ];

  // Wrapped description lines
  const descLines = wrapText(desc, 80);
  descLines.forEach((line) => {
    contentOps.push("0 -16 Td");
    contentOps.push(`(${sanitizeForPdf(line)}) Tj`);
  });

  // Section 2: Key Concepts
  contentOps.push("0 -24 Td");
  contentOps.push("/F1 12 Tf");
  contentOps.push(`(${sanitizeForPdf("2. CORE PRINCIPLES & SYLLABUS HIGHLIGHTS")}) Tj`);
  contentOps.push("/F2 10 Tf");

  const defaultKeyPoints = [
    "Fundamental Definitions: Master exact terminology, standard SI units, and dimensional relations.",
    "Derivations & Laws: Understand the assumptions, domain of validity, and mathematical consequences.",
    "Ray / Circuit / Schematic Diagrams: Always sketch clear, labelled figures for maximum clarity.",
    "Numerical Problem Solving: Systematically write given data, target variable, formula, and units."
  ];
  const points = data.keyPoints && data.keyPoints.length > 0 ? data.keyPoints : defaultKeyPoints;

  points.forEach((pt) => {
    const wrappedPt = wrapText(`* ${pt}`, 80);
    wrappedPt.forEach((line, idx) => {
      contentOps.push("0 -16 Td");
      contentOps.push(`(${sanitizeForPdf(idx > 0 ? "  " + line : line)}) Tj`);
    });
  });

  // Section 3: High Yield Notes & Formulas
  contentOps.push("0 -24 Td");
  contentOps.push("/F1 12 Tf");
  contentOps.push(`(${sanitizeForPdf("3. HIGH-YIELD FORMULAS & EXAM STRATEGY")}) Tj`);
  contentOps.push("/F2 10 Tf");

  const defaultFormulas = [
    "Standard Formula: Ensure all input variables are converted to MKS / SI units prior to calculation.",
    "Sign Conventions: Double-check sign conventions (+ / -) in Cartesian coordinate computations.",
    "Step-by-step Presentation: Write the governing equation before substituting numerical parameters.",
    "Units Verification: Always attach dimensional units (e.g. m/s, J, N, Ohm) to final responses."
  ];
  const formulas = data.formulas && data.formulas.length > 0 ? data.formulas : defaultFormulas;

  formulas.forEach((fm) => {
    const wrappedFm = wrapText(`- ${fm}`, 80);
    wrappedFm.forEach((line, idx) => {
      contentOps.push("0 -16 Td");
      contentOps.push(`(${sanitizeForPdf(idx > 0 ? "  " + line : line)}) Tj`);
    });
  });

  // Footer banner
  contentOps.push("0 -36 Td");
  contentOps.push("/F2 9 Tf");
  contentOps.push(`(${sanitizeForPdf("Kepler Learning Platform  |  Official Student Study Reference  |  Offline Document")}) Tj`);
  contentOps.push("ET");

  const contentStream = contentOps.join("\n");
  const streamByteLength = Buffer.byteLength(contentStream, "utf-8");

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj",
    `4 0 obj\n<< /Length ${streamByteLength} >>\nstream\n${contentStream}\nendstream\nendobj`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj"
  ];

  let offset = 9; // strlen("%PDF-1.4\n")
  const xref: string[] = ["xref", `0 ${objects.length + 1}`, "0000000000 65535 f "];
  let body = "%PDF-1.4\n";

  for (const obj of objects) {
    const pad = String(offset).padStart(10, "0");
    xref.push(`${pad} 00000 n `);
    const objWithNewline = obj + "\n";
    body += objWithNewline;
    offset += Buffer.byteLength(objWithNewline, "utf-8");
  }

  const xrefOffset = offset;
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  const completePdf = body + xref.join("\n") + "\n" + trailer;

  return Buffer.from(completePdf, "utf-8");
}
