import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexBlockProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const LatexBlock: React.FC<LatexBlockProps> = ({
  math,
  displayMode = true,
  className = '',
}) => {
  const html = useMemo(() => {
    if (!math || !math.trim()) return '';
    try {
      const cleaned = math
        .trim()
        .replace(/^\$\$\s*/, '')
        .replace(/\s*\$\$$/, '')
        .replace(/^\$\s*/, '')
        .replace(/\s*\$$/, '');
      return katex.renderToString(cleaned, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return math;
    }
  }, [math, displayMode]);

  if (!html) return null;

  return (
    <span
      dir="ltr"
      className={`inline-block max-w-full overflow-x-auto align-middle ${displayMode ? 'block my-2 text-center' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface RichMathTextProps {
  text: string;
  className?: string;
}

/**
 * Renders mixed Persian/English prose containing $$...$$ display equations
 * and $...$ inline equations using KaTeX.
 */
export const RichMathText: React.FC<RichMathTextProps> = ({ text, className = '' }) => {
  const segments = useMemo(() => {
    if (!text) return [];
    const tokens: Array<{ type: 'text' | 'block' | 'inline'; value: string }> = [];
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\n$]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
      }
      const raw = match[0];
      if (raw.startsWith('$$')) {
        tokens.push({ type: 'block', value: raw.slice(2, -2) });
      } else {
        tokens.push({ type: 'inline', value: raw.slice(1, -1) });
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      tokens.push({ type: 'text', value: text.slice(lastIndex) });
    }
    return tokens;
  }, [text]);

  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>
      {segments.map((seg, i) => {
        if (seg.type === 'block') {
          return <LatexBlock key={i} math={seg.value} displayMode={true} className="my-2 py-2 px-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/70" />;
        }
        if (seg.type === 'inline') {
          return <LatexBlock key={i} math={seg.value} displayMode={false} className="mx-1" />;
        }
        return <span key={i}>{seg.value}</span>;
      })}
    </div>
  );
};
