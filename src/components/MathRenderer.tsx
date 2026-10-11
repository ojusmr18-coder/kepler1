"use client";

import * as React from "react";
import katex from "katex";

export interface MathFormulaProps {
  /** Raw LaTeX math expression (e.g. "T^2 = \\frac{4\\pi^2}{GM} a^3") */
  math: string;
  /** Whether to render as centered display block math (default: true) */
  displayMode?: boolean;
  /** Optional container class name */
  className?: string;
}

/**
 * Pure LaTeX formula renderer using KaTeX.
 * Handles fractions, powers, roots, Greek symbols, and complex expressions.
 */
export function MathFormula({
  math,
  displayMode = true,
  className = "",
}: MathFormulaProps) {
  const html = React.useMemo(() => {
    if (!math) return "";
    let clean = math.trim();
    if (clean.startsWith("$$") && clean.endsWith("$$")) {
      clean = clean.slice(2, -2).trim();
    } else if (clean.startsWith("$") && clean.endsWith("$")) {
      clean = clean.slice(1, -1).trim();
    }

    try {
      return katex.renderToString(clean, {
        displayMode,
        throwOnError: false,
      });
    } catch (err) {
      console.warn("KaTeX rendering error for:", math, err);
      return clean;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`inline-block select-text max-w-full overflow-x-auto align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export interface MathTextProps {
  /** Text that may contain $inline math$, $$display math$$, or raw LaTeX expressions */
  content: string;
  /** Optional container class name */
  className?: string;
  /** Wrapper element type */
  as?: "span" | "div" | "p";
}

/**
 * Parses mixed text containing LaTeX formulas ($...$ or $$...$$) and normal text.
 * Also intelligently identifies standalone LaTeX commands (\frac, \sqrt, etc.)
 * and renders all formulas properly via KaTeX while keeping normal words intact.
 */
export function MathText({ content, className = "", as = "span" }: MathTextProps) {
  const renderedElements = React.useMemo(() => {
    if (!content) return null;

    // 1. If entire content has no dollar signs but has typical formula syntax without spaces
    // e.g. "\frac{1}{f} = \frac{1}{v} - \frac{1}{u}" or "T^2 = \frac{4\pi^2}{GM} a^3"
    const trimmed = content.trim();
    if (
      !trimmed.includes("$") &&
      (/\\(?:frac|sqrt|times|cdot|pi|alpha|beta|theta|sum|int|infty|approx|propto|ll|gg|pm|neq)\b/.test(trimmed) ||
       /\b(?:\\text)\b/.test(trimmed)) &&
      !trimmed.includes(". ") && // Not a multi-sentence paragraph
      trimmed.length < 120
    ) {
      try {
        const html = katex.renderToString(trimmed, {
          displayMode: false,
          throwOnError: false,
        });
        return (
          <span
            className="inline-block px-0.5 align-baseline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        // Fall back to general parser below
      }
    }

    // 2. Pattern matching $$display$$ and $inline$
    const mathRegex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
    const parts = content.split(mathRegex);

    return parts.map((part, index) => {
      if (!part) return null;

      // 2a. Display math $$...$$
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="block my-2 text-center overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index}>{part}</span>;
        }
      }

      // 2b. Inline math $...$
      if (part.startsWith("$") && part.endsWith("$")) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="inline-block px-0.5 align-baseline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index}>{part}</span>;
        }
      }

      // 2c. Check for un-delimited LaTeX snippets like \frac{...}{...} or \sqrt{...}
      if (/\\(?:frac|sqrt)\{[^}]+\}/.test(part)) {
        // Split around the LaTeX command chunks
        const latexChunkRegex = /(\\(?:frac|sqrt)\{[^}]+\}(?:\{[^}]+\})?)/g;
        const subParts = part.split(latexChunkRegex);
        return (
          <React.Fragment key={index}>
            {subParts.map((sub, sIdx) => {
              if (latexChunkRegex.test(sub)) {
                try {
                  const html = katex.renderToString(sub, {
                    displayMode: false,
                    throwOnError: false,
                  });
                  return (
                    <span
                      key={sIdx}
                      className="inline-block px-0.5 align-baseline"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                } catch {
                  return <span key={sIdx}>{sub}</span>;
                }
              }
              return <span key={sIdx}>{sub}</span>;
            })}
          </React.Fragment>
        );
      }

      // 2d. Regular plain text
      return <span key={index}>{part}</span>;
    });
  }, [content]);

  const Component = as;

  return <Component className={className}>{renderedElements}</Component>;
}
