"use client";

import * as React from "react";
import {
  Search,
  Disc,
  Brain,
  Mic,
  MicOff,
  ArrowUp,
  Plus,
  MessageCircleQuestion,
  FileText,
  GraduationCap,
  X,
  FileCheck,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { CartoonSend, CartoonSparkle, CartoonMic } from "@/components/ui/cartoon-icons";
import { ThinkingCatLogo } from "@/components/ThinkingCatLogo";
import { aiChatApi } from "@/services/aiChatApi";

export type SolverMode = "socratic" | "detailed" | "exam";
export type SearchChip = "search" | "deep-research" | "reason" | null;

interface UploadedFile {
  id: string;
  name: string;
  size: string;
}

export function DoubtSolvingInterface() {
  const [query, setQuery] = React.useState("");
  const [activeChip, setActiveChip] = React.useState<SearchChip>(null);
  const [selectedMode, setSelectedMode] = React.useState<SolverMode | null>(null);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [thinkingStatusText, setThinkingStatusText] = React.useState("Pondering your question...");
  const [isThinkingPreview, setIsThinkingPreview] = React.useState(false);
  
  // Interactive session state
  const [sessionId] = React.useState<string>(() => "session_" + Math.random().toString(36).substring(2, 9));
  const [submittedQuery, setSubmittedQuery] = React.useState<string | null>(null);
  const [activeSessionMode, setActiveSessionMode] = React.useState<SolverMode>("detailed");
  const [conversationHistory, setConversationHistory] = React.useState<
    Array<{ sender: "user" | "ai"; text: string; mode?: SolverMode; timestamp: string }>
  >([]);

  // ==========================================================================
  // FRONTEND CALL POINT 1: Initial Session History Retrieval (GET /api/ai/chat/history)
  // ==========================================================================
  React.useEffect(() => {
    async function loadSessionHistory() {
      try {
        const history = await aiChatApi.getChatHistory(sessionId);
        if (history.messages && history.messages.length > 0) {
          setConversationHistory(
            history.messages.map((m) => ({
              sender: m.sender === "allie" ? "ai" : "user",
              text: m.text,
              mode: m.mode,
              timestamp: m.timestamp,
            }))
          );
        }
      } catch (err) {
        console.info("Could not fetch remote chat history; using fresh local state:", err);
      }
    }
    loadSessionHistory();
  }, [sessionId]);

  // Preview thinking animations on manual click
  const handleCatClick = () => {
    if (isSubmitting) return;
    setIsThinkingPreview(true);
    setTimeout(() => {
      setIsThinkingPreview(false);
    }, 3800);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Dynamic placeholder based on selected mode
  const getPlaceholder = () => {
    if (selectedMode === "socratic") {
      return "Ask a doubt you want to explore through guided Socratic questions...";
    }
    if (selectedMode === "detailed") {
      return "Paste any question, formula, or concept for a comprehensive explanation...";
    }
    if (selectedMode === "exam") {
      return "Ask for high-yield questions, revision notes, or exam-ready answers...";
    }
    return "Ask me anything...";
  };

  const handleChipClick = (chip: "search" | "deep-research" | "reason") => {
    setActiveChip((prev) => (prev === chip ? null : chip));
  };

  const handleModeClick = (mode: SolverMode) => {
    setSelectedMode((prev) => (prev === mode ? null : mode));
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: (f.size / 1024).toFixed(1) + " KB",
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleMic = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate voice capture
      setTimeout(() => {
        setQuery((prev) => (prev ? prev + " Can you explain orbital velocity?" : "Can you explain orbital velocity?"));
        setIsRecording(false);
      }, 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ==========================================================================
  // FRONTEND CALL POINT 2: Send Message & Receive AI Response (POST /api/ai/chat)
  // ==========================================================================
  const handleSubmit = async () => {
    if (!query.trim() && uploadedFiles.length === 0) return;

    const currentMode = selectedMode || "detailed";
    const userText = query.trim() || `Analyze uploaded documents: ${uploadedFiles.map(f => f.name).join(", ")}`;
    
    setIsSubmitting(true);
    setSubmittedQuery(userText);
    setActiveSessionMode(currentMode);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append user message immediately to the UI thread
    const newHistory = [
      ...conversationHistory,
      { sender: "user" as const, text: userText, timestamp: now },
    ];
    setConversationHistory(newHistory);
    setQuery("");

    // Dynamic thinking statuses while Allie is formulating the answer
    setThinkingStatusText("Pondering the concept...");
    const timer1 = setTimeout(() => {
      setThinkingStatusText("Reviewing principles & key formulas...");
    }, 900);

    const timer2 = setTimeout(() => {
      setThinkingStatusText(
        currentMode === "socratic"
          ? "Formulating Socratic guiding questions..."
          : currentMode === "exam"
          ? "Structuring exam-ready scoring rubric..."
          : "Synthesizing comprehensive explanation..."
      );
    }, 1800);

    try {
      /**
       * ----------------------------------------------------------------------
       * BACKEND CALL: POST /api/ai/chat (or POST /api/ai/doubt-solve)
       * Request Body:
       *   { message: userText, sessionId, mode: currentMode, searchType: activeChip, attachments: [...] }
       * Expected Response:
       *   { id, sessionId, sender: "allie", text, latexFormulas, timestamp }
       * ----------------------------------------------------------------------
       */
      let aiResponseText = "";

      try {
        const response = await aiChatApi.sendMessage({
          message: userText,
          sessionId,
          mode: currentMode,
          searchType: activeChip || undefined,
          attachments: uploadedFiles.map((f) => ({ fileId: f.id, filename: f.name })),
        });
        aiResponseText = response.text;
      } catch (backendError) {
        // Fallback to contextual pedagogical preview when backend service is offline
        console.info("Backend API offline or unreachable, using local pedagogical preview:", backendError);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (currentMode === "socratic") {
          aiResponseText = `💡 **Let's think through this together!**\n\nBefore calculating the answer directly, consider this fundamental question:\n\n*What happens to the gravitational pull as an object moves twice as far from the center of mass?*\n\nTake a moment to reflect: Does the velocity need to increase or decrease to balance that gravitational pull? Reply with your hypothesis!`;
        } else if (currentMode === "detailed") {
          aiResponseText = `📘 **Comprehensive Conceptual Breakdown**\n\n1. **Core Principle**: Orbital velocity ($v_o$) represents the speed required to achieve equilibrium where gravitational force equals the necessary centripetal force.\n\n2. **Mathematical Formulation**:\n   $$v = \\sqrt{\\frac{GM}{r}}$$\n   Where:\n   - $G = 6.674 \\times 10^{-11} \\text{ m}^3\\text{kg}^{-1}\\text{s}^{-2}$\n   - $M$ = Mass of the primary body\n   - $r$ = Distance from the center of the body\n\n3. **Physical Intuition**: An orbiting satellite is in perpetual free-fall toward Earth, but its tangential velocity is sufficiently high that the curved surface of the Earth drops away beneath it at the exact same rate!`;
        } else {
          aiResponseText = `🎯 **Exam-Ready Revision & High-Yield Summary**\n\n• **Direct Definition (2 Marks)**: Minimum horizontal velocity imparted to a body so it revolves around a celestial body in a stable orbit.\n• **Key Formula**: $v = \\sqrt{\\frac{GM}{R+h}} = \\sqrt{g R}$ (near surface)\n• **Frequent Board/Exam Traps**:\n  ⚠️ Orbital speed is **independent** of the mass of the satellite ($m$).\n  ⚠️ Speed decreases as orbital radius ($r$) increases: $v \\propto \\frac{1}{\\sqrt{r}}$.\n• **Model Answer Rubric**: State Newton's Law of Gravitation, equate with $mv^2/r$, cancel mass $m$, and isolate $v$.`;
        }
      }

      clearTimeout(timer1);
      clearTimeout(timer2);

      setConversationHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiResponseText,
          mode: currentMode,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      // Thinking animation stops immediately once the response begins rendering
      setIsSubmitting(false);
    }
  };

  // ==========================================================================
  // FRONTEND CALL POINT 3: Clear / Reset Session (DELETE /api/ai/chat/session/{sessionId})
  // ==========================================================================
  const handleReset = async () => {
    try {
      if (sessionId) {
        await aiChatApi.clearSession(sessionId).catch(() => {});
      }
    } finally {
      setSubmittedQuery(null);
      setConversationHistory([]);
      setQuery("");
      setUploadedFiles([]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-slate-800 flex flex-col items-center justify-center px-4 pl-20 sm:pl-24 py-12 antialiased selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Banner / Breadcrumb if in active interactive conversation */}
      {submittedQuery ? (
        <div className="w-full max-w-[720px] flex items-center justify-between mb-6 pb-4 border-b border-slate-100 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Assistant
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <ThinkingCatLogo isThinking={isSubmitting} size="sm" showShadow={false} />
              <span className="text-xs font-medium text-slate-600">
                {isSubmitting ? "Allie is thinking..." : "Allie Active"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <CartoonSparkle className="w-3.5 h-3.5" />
            Mode:{" "}
            {activeSessionMode === "socratic"
              ? "Socratic Method"
              : activeSessionMode === "detailed"
              ? "Detailed Explanation"
              : "Exam Ready"}
          </div>
        </div>
      ) : null}

      {/* Main Home Container */}
      {!submittedQuery ? (
        <div className="w-full max-w-[700px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          {/* 1. Levitating Angel Cat Logo with Thinking Animations */}
          <div className="flex flex-col items-center mb-6">
            <ThinkingCatLogo
              isThinking={isThinkingPreview || isSubmitting}
              size="md"
              onClick={handleCatClick}
              title={
                isThinkingPreview || isSubmitting
                  ? "Allie Cat is thinking..."
                  : "Click to preview Allie Cat's thinking animation!"
              }
            />
            {isThinkingPreview && (
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/80 rounded-full px-2.5 py-0.5 mt-2 animate-in fade-in zoom-in-95 duration-200">
                🐾 Thinking animation preview active!
              </span>
            )}
          </div>

          {/* 2. Heading with vibrant blue gradient */}
          <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 bg-clip-text text-transparent text-center select-none leading-tight">
            Ready to assist you
          </h1>

          {/* 3. Subheading */}
          <p className="mt-2.5 text-slate-500 text-[15px] sm:text-base font-normal text-center select-none">
            Ask me anything or try one of the suggestions below
          </p>

          {/* 4. Main Input Card */}
          <div className="w-full mt-8 bg-white border border-slate-200/90 rounded-2xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200">
            {/* Uploaded File Previews (if any) */}
            {uploadedFiles.length > 0 && (
              <div className="px-5 pt-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-medium truncate max-w-[160px]">{file.name}</span>
                    <span className="text-slate-400">({file.size})</span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-slate-400 hover:text-red-500 ml-1 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Textarea */}
            <div className="px-5 pt-4 pb-2">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                rows={2}
                className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-[15px] sm:text-base outline-none resize-none min-h-[48px] max-h-[140px] leading-relaxed"
              />
            </div>

            {/* Middle Controls Row: Suggestion Chips (Left) & Mic + Submit (Right) */}
            <div className="flex items-center justify-between px-4 pb-3 gap-2">
              {/* Suggestion Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Chip */}
                <button
                  type="button"
                  onClick={() => handleChipClick("search")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all ${
                    activeChip === "search"
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                      : "bg-[#F1F5F9] text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>Search</span>
                </button>

                {/* Deep Research Chip */}
                <button
                  type="button"
                  onClick={() => handleChipClick("deep-research")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all ${
                    activeChip === "deep-research"
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                      : "bg-[#F1F5F9] text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  <Disc className="w-3.5 h-3.5 text-slate-500" />
                  <span>Deep Research</span>
                </button>

                {/* Reason Chip */}
                <button
                  type="button"
                  onClick={() => handleChipClick("reason")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all ${
                    activeChip === "reason"
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                      : "bg-[#F1F5F9] text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reason</span>
                </button>
              </div>

              {/* Action Buttons: Mic and Send */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-1.5 rounded-full transition-all ${
                    isRecording
                      ? "bg-red-50 text-red-600 animate-pulse ring-2 ring-red-400"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                  title={isRecording ? "Listening... click to stop" : "Use microphone"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <CartoonMic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!query.trim() && uploadedFiles.length === 0}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    query.trim() || uploadedFiles.length > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                      : "bg-[#F1F5F9] text-slate-400 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  <CartoonSend className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="border-t border-slate-100" />

            {/* Bottom Row: + Upload Files */}
            <div className="px-5 py-3 flex items-center justify-between">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-normal transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[2] text-slate-500" />
                <span>Upload Files</span>
              </button>

              {selectedMode && (
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
                  Active Mode:{" "}
                  {selectedMode === "socratic"
                    ? "Socratic Method"
                    : selectedMode === "detailed"
                    ? "Detailed Explanation"
                    : "Exam Ready"}
                </span>
              )}
            </div>
          </div>

          {/* 5. Bottom Three Cards: Socratic Method, Detailed Explanation, Exam Ready */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4 w-full">
            {/* Card 1: Socratic Method */}
            <button
              type="button"
              onClick={() => handleModeClick("socratic")}
              className={`bg-white border rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 group text-center ${
                selectedMode === "socratic"
                  ? "border-blue-500 ring-2 ring-blue-500/15 shadow-sm bg-blue-50/10"
                  : "border-slate-200/90 hover:border-slate-300 hover:shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
              }`}
            >
              <div
                className={`p-1 transition-colors ${
                  selectedMode === "socratic"
                    ? "text-blue-600"
                    : "text-slate-600 group-hover:text-slate-900"
                }`}
              >
                <MessageCircleQuestion className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span
                className={`text-[15px] font-medium transition-colors ${
                  selectedMode === "socratic"
                    ? "text-blue-700 font-semibold"
                    : "text-slate-700 group-hover:text-slate-900"
                }`}
              >
                Socratic Method
              </span>
            </button>

            {/* Card 2: Detailed Explanation */}
            <button
              type="button"
              onClick={() => handleModeClick("detailed")}
              className={`bg-white border rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 group text-center ${
                selectedMode === "detailed"
                  ? "border-blue-500 ring-2 ring-blue-500/15 shadow-sm bg-blue-50/10"
                  : "border-slate-200/90 hover:border-slate-300 hover:shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
              }`}
            >
              <div
                className={`p-1 transition-colors ${
                  selectedMode === "detailed"
                    ? "text-blue-600"
                    : "text-slate-600 group-hover:text-slate-900"
                }`}
              >
                <FileText className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span
                className={`text-[15px] font-medium transition-colors ${
                  selectedMode === "detailed"
                    ? "text-blue-700 font-semibold"
                    : "text-slate-700 group-hover:text-slate-900"
                }`}
              >
                Detailed Explanation
              </span>
            </button>

            {/* Card 3: Exam Ready */}
            <button
              type="button"
              onClick={() => handleModeClick("exam")}
              className={`bg-white border rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 group text-center ${
                selectedMode === "exam"
                  ? "border-blue-500 ring-2 ring-blue-500/15 shadow-sm bg-blue-50/10"
                  : "border-slate-200/90 hover:border-slate-300 hover:shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
              }`}
            >
              <div
                className={`p-1 transition-colors ${
                  selectedMode === "exam"
                    ? "text-blue-600"
                    : "text-slate-600 group-hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span
                className={`text-[15px] font-medium transition-colors ${
                  selectedMode === "exam"
                    ? "text-blue-700 font-semibold"
                    : "text-slate-700 group-hover:text-slate-900"
                }`}
              >
                Exam Ready
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Conversation / Doubt Resolution View */
        <div className="w-full max-w-[720px] flex flex-col animate-in fade-in duration-300">
          <div className="space-y-6 mb-8">
            {conversationHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  item.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl p-4.5 max-w-[90%] text-[15px] leading-relaxed ${
                    item.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-xs shadow-sm"
                      : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-xs"
                  }`}
                >
                  {item.sender === "ai" && (
                    <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-200/60 text-xs font-semibold text-blue-600">
                      <CartoonSparkle className="w-3.5 h-3.5" />
                      <span>
                        AI Assistant •{" "}
                        {item.mode === "socratic"
                          ? "Socratic Guidance"
                          : item.mode === "detailed"
                          ? "In-Depth Breakdown"
                          : "Exam Preparation"}
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-line">{item.text}</div>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 px-1">
                  {item.timestamp}
                </span>
              </div>
            ))}

            {isSubmitting && (
              <div className="flex items-center gap-4 text-slate-700 text-sm p-3.5 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/40 border border-amber-200/80 rounded-2xl w-fit shadow-xs animate-in fade-in zoom-in-95 duration-300">
                <ThinkingCatLogo isThinking={true} size="sm" showShadow={false} />
                <div className="flex flex-col pr-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Allie Cat is thinking...</span>
                  </div>
                  <span className="text-[12px] text-slate-600 mt-0.5 font-medium">
                    {thinkingStatusText}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Follow-up input box */}
          <div className="sticky bottom-4 w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-2 flex items-center gap-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up doubt or reply..."
              rows={1}
              className="flex-1 bg-transparent px-3 py-2 text-slate-800 placeholder:text-slate-400 text-sm outline-none resize-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!query.trim()}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <CartoonSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
