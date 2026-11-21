import React, { useState } from 'react';
import { Flag, Check, Loader2 } from 'lucide-react';

interface ReportIssueButtonProps {
  lang?: 'fa' | 'en' | string;
  kind: string;
  target: string;
  context?: string;
  className?: string;
}

/** Lets users flag an incorrect AI solution / flashcard / answer for review. */
export const ReportIssueButton: React.FC<ReportIssueButtonProps> = ({
  lang = 'fa',
  kind,
  target,
  context = '',
  className = '',
}) => {
  const fa = lang === 'fa';
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async () => {
    if (!message.trim()) return;
    setState('sending');
    try {
      const resp = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, target, message, context }),
      });
      setState(resp.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 ${className}`} role="status">
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
        {fa ? 'گزارش شما ثبت شد؛ سپاس.' : 'Report received. Thank you.'}
      </span>
    );
  }

  return (
    <div className={className}>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer"
        >
          <Flag className="w-3.5 h-3.5" aria-hidden="true" />
          {fa ? 'گزارش اشکال در این پاسخ' : 'Report an error in this answer'}
        </button>
      ) : (
        <div className="space-y-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor={`report-${target}`}>
            {fa ? 'اشکال کجاست؟' : 'What is wrong?'}
          </label>
          <textarea
            id={`report-${target}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={state === 'sending' || !message.trim()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white disabled:opacity-50 cursor-pointer"
            >
              {state === 'sending' && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
              {fa ? 'ارسال گزارش' : 'Send report'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-500 cursor-pointer">
              {fa ? 'انصراف' : 'Cancel'}
            </button>
            {state === 'error' && (
              <span className="text-xs text-rose-600" role="alert">
                {fa ? 'ارسال ناموفق بود.' : 'Failed to send.'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/** Transparent label for AI-generated content. */
export const AiGeneratedBadge: React.FC<{ lang?: string; className?: string }> = ({ lang = 'fa', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 ${className}`}
    title={lang === 'fa' ? 'این پاسخ توسط هوش مصنوعی تولید شده و ممکن است خطا داشته باشد؛ با منبع درسی تطبیق دهید.' : 'AI-generated; verify against your textbook.'}
  >
    {lang === 'fa' ? 'تولیدشده با هوش مصنوعی · بررسی نشده' : 'AI-generated · unreviewed'}
  </span>
);
