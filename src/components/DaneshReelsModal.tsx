import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  X,
  Heart,
  Bookmark,
  MessageCircle,
  Bot,
  Share2,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Send,
  Loader2,
  BookOpen,
  Check,
  ChevronRight,
  ThumbsUp,
} from 'lucide-react';
import { Lang, ReelLesson, ReelVisualType } from '../types/app';
import { LatexBlock, RichMathText } from './MathRenderer';

interface DaneshReelsModalProps {
  lang: Lang;
  reels: ReelLesson[];
  initialIndex: number;
  onClose: () => void;
  onOpenCourseByCode?: (courseCode: string) => void;
  onMarkViewed?: (reelId: string) => void;
}

interface ReelCommentItem {
  id: string;
  author: string;
  badge: string;
  text: string;
  likes: number;
  time: string;
}

const DEFAULT_REEL_COMMENTS: ReelCommentItem[] = [
  {
    id: 'rc-1',
    author: 'امیرحسین رضایی',
    badge: 'برق · دانشگاه تهران',
    text: 'توضیح شهودی این رابطه دقیقاً همون چیزی بود که سر کلاس متوجه نشده بودم!',
    likes: 24,
    time: '۲ ساعت پیش',
  },
  {
    id: 'rc-2',
    author: 'سارا محمدی',
    badge: 'کامپیوتر · صنعتی شریف',
    text: 'نکته فرمولی آخرش توی امتحان پایان‌ترم خیلی به کار میاد.',
    likes: 15,
    time: '۴۵ دقیقه پیش',
  },
];

const ConceptMotionOverlay: React.FC<{ visualType: ReelVisualType; isPlaying: boolean }> = ({
  visualType,
  isPlaying,
}) => {
  if (visualType === 'oscilloscope') {
    return (
      <svg viewBox="0 0 280 68" className="w-full h-14 opacity-95" aria-hidden="true">
        <defs>
          <linearGradient id="oscGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <line x1="0" y1="34" x2="280" y2="34" stroke="rgba(148,163,184,0.28)" strokeWidth="1" />
        <path
          d="M0 34 Q 20 6, 40 34 T 80 34 T 120 34 T 160 34 T 200 34 T 240 34 T 280 34"
          fill="none"
          stroke="url(#oscGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          {isPlaying && (
            <animate
              attributeName="d"
              dur="2.4s"
              repeatCount="indefinite"
              values="
                M0 34 Q 20 6, 40 34 T 80 34 T 120 34 T 160 34 T 200 34 T 240 34 T 280 34;
                M0 34 Q 20 62, 40 34 T 80 34 T 120 34 T 160 34 T 200 34 T 240 34 T 280 34;
                M0 34 Q 20 6, 40 34 T 80 34 T 120 34 T 160 34 T 200 34 T 240 34 T 280 34
              "
            />
          )}
        </path>
        <path
          d="M0 34 Q 35 14, 70 34 T 140 34 T 210 34 T 280 34"
          fill="none"
          stroke="rgba(56,189,248,0.45)"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (visualType === 'quantum') {
    return (
      <svg viewBox="0 0 280 68" className="w-full h-14 opacity-95" aria-hidden="true">
        {[16, 28, 40].map((r, i) => (
          <circle
            key={r}
            cx="140"
            cy="34"
            r={r}
            fill="none"
            stroke={i === 1 ? '#38bdf8' : 'rgba(251,191,36,0.55)'}
            strokeWidth="1.5"
            strokeDasharray="6 4"
          >
            {isPlaying && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={i % 2 === 0 ? '0 140 34' : '360 140 34'}
                to={i % 2 === 0 ? '360 140 34' : '0 140 34'}
                dur={`${6 + i * 2}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
        <circle cx="140" cy="34" r="4.5" fill="#38bdf8" />
      </svg>
    );
  }

  if (visualType === 'neural') {
    const layers = [40, 110, 180, 245];
    const ys = [14, 34, 54];
    return (
      <svg viewBox="0 0 280 68" className="w-full h-14 opacity-95" aria-hidden="true">
        {layers.slice(0, -1).map((x1, li) =>
          ys.map((y1) =>
            ys.map((y2) => (
              <line
                key={`${li}-${y1}-${y2}`}
                x1={x1}
                y1={y1}
                x2={layers[li + 1]}
                y2={y2}
                stroke="rgba(56,189,248,0.32)"
                strokeWidth="1"
              />
            ))
          )
        )}
        {layers.map((x, li) =>
          ys.map((y, yi) => (
            <circle
              key={`${li}-${yi}`}
              cx={x}
              cy={y}
              r="4.2"
              fill={(li + yi) % 2 === 0 ? '#38bdf8' : '#f59e0b'}
            />
          ))
        )}
      </svg>
    );
  }

  if (visualType === 'graph') {
    const nodes = [
      { x: 28, y: 36 },
      { x: 92, y: 16 },
      { x: 92, y: 54 },
      { x: 168, y: 22 },
      { x: 168, y: 52 },
      { x: 248, y: 34 },
    ];
    return (
      <svg viewBox="0 0 280 68" className="w-full h-14 opacity-95" aria-hidden="true">
        <path
          d="M28 36 L92 16 L168 22 L248 34"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M28 36 L92 54 L168 52 L248 34 M92 16 L168 52"
          fill="none"
          stroke="rgba(148,163,184,0.4)"
          strokeWidth="1.2"
        />
        {nodes.map((n, idx) => (
          <circle
            key={idx}
            cx={n.x}
            cy={n.y}
            r="4.5"
            fill={idx === 0 || idx === 5 ? '#f59e0b' : '#38bdf8'}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 280 68" className="w-full h-14 opacity-95" aria-hidden="true">
      <rect x="28" y="16" width="60" height="34" rx="8" fill="rgba(249,115,22,0.35)" stroke="#fb923c" />
      <rect x="192" y="16" width="60" height="34" rx="8" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" />
      <path d="M92 34 H186" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6 6">
        {isPlaying && (
          <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.2s" repeatCount="indefinite" />
        )}
      </path>
    </svg>
  );
};

export const DaneshReelsModal: React.FC<DaneshReelsModalProps> = ({
  lang,
  reels,
  initialIndex,
  onClose,
  onOpenCourseByCode,
  onMarkViewed,
}) => {
  const safeInitialIndex = Math.max(0, Math.min(initialIndex, reels.length - 1));
  const [activeIndex, setActiveIndex] = useState(safeInitialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100 over 30s
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  // Per-reel expanded caption toggle ("بیشتر... / بستن")
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  // Like / Save / Share states persisted in localStorage
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('daneshyar_reel_likes');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('daneshyar_reel_saves');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  // Comments Drawer
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsByReel, setCommentsByReel] = useState<Record<string, ReelCommentItem[]>>(() => {
    try {
      const s = localStorage.getItem('daneshyar_reel_comments');
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });
  const [commentInput, setCommentInput] = useState('');

  // Ask AI Drawer
  const [askAiOpen, setAskAiOpen] = useState(false);
  const [askQuestion, setAskQuestion] = useState('');
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [askLoading, setAskLoading] = useState(false);

  const feedRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  const activeReel = reels[activeIndex] || reels[0];

  // Lock background page scroll while fullscreen Reels player is mounted
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Scroll immediately to initialIndex on mount
  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    if (safeInitialIndex > 0) {
      el.scrollTo({
        top: safeInitialIndex * el.clientHeight,
        behavior: 'instant' as ScrollBehavior,
      });
    }
  }, [safeInitialIndex]);

  const scrollToReel = useCallback(
    (targetIdx: number) => {
      const clamped = Math.max(0, Math.min(reels.length - 1, targetIdx));
      const el = feedRef.current;
      if (el) {
        isProgrammaticScrollRef.current = true;
        el.scrollTo({
          top: clamped * el.clientHeight,
          behavior: 'smooth',
        });
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 420);
      }
      setActiveIndex(clamped);
    },
    [reels.length]
  );

  // Mark active reel as viewed
  useEffect(() => {
    if (activeReel && onMarkViewed) {
      onMarkViewed(activeReel.id);
    }
  }, [activeReel?.id, onMarkViewed]);

  // Reset per-reel transient state when switching slides
  useEffect(() => {
    setProgress(0);
    setAskAnswer(null);
    setAskQuestion('');
    setAskAiOpen(false);
    setCommentsOpen(false);
    setCopiedShareId(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [activeIndex]);

  // Active 30-second reading timer
  useEffect(() => {
    if (!isPlaying || askAiOpen || commentsOpen) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeIndex < reels.length - 1) {
            scrollToReel(activeIndex + 1);
            return 0;
          }
          return 0;
        }
        return Math.min(100, prev + 100 / 300); // 30 seconds at 100ms tick
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, askAiOpen, commentsOpen, activeIndex, reels.length, scrollToReel]);

  // Play Gemini TTS Narration when soundEnabled is toggled on
  useEffect(() => {
    let cancelled = false;
    if (!soundEnabled || !activeReel) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const playNarration = async () => {
      setAudioLoading(true);
      try {
        const script = lang === 'fa' ? activeReel.narrationFa : activeReel.narrationEn;
        const resp = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: script }),
        });
        const data = await resp.json();
        if (cancelled) return;
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.play().catch(() => {});
        }
      } catch {
        // fail gracefully without intrusive modal errors
      } finally {
        if (!cancelled) setAudioLoading(false);
      }
    };

    playNarration();

    return () => {
      cancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundEnabled, activeReel?.id, lang]);

  // Keyboard navigation (Escape, ArrowUp, ArrowDown)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (askAiOpen) setAskAiOpen(false);
        else if (commentsOpen) setCommentsOpen(false);
        else onClose();
      } else if (e.key === 'ArrowDown' && !askAiOpen && !commentsOpen) {
        e.preventDefault();
        scrollToReel(activeIndex + 1);
      } else if (e.key === 'ArrowUp' && !askAiOpen && !commentsOpen) {
        e.preventDefault();
        scrollToReel(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, askAiOpen, commentsOpen, onClose, scrollToReel]);

  const handleFeedScroll = () => {
    if (isProgrammaticScrollRef.current) return;
    const el = feedRef.current;
    if (!el || el.clientHeight === 0) return;
    const nextIdx = Math.round(el.scrollTop / el.clientHeight);
    if (nextIdx !== activeIndex && nextIdx >= 0 && nextIdx < reels.length) {
      setActiveIndex(nextIdx);
    }
  };

  const toggleLike = (reelId: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId];
      try {
        localStorage.setItem('daneshyar_reel_likes', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleSave = (reelId: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId];
      try {
        localStorage.setItem('daneshyar_reel_saves', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleShare = (reel: ReelLesson) => {
    const summary = `${lang === 'fa' ? reel.titleFa : reel.titleEn} (${reel.courseCode}) — DaneshYar`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary).catch(() => {});
    }
    setCopiedShareId(reel.id);
    setTimeout(() => setCopiedShareId(null), 2000);
  };

  const getCommentsForReel = (reelId: string): ReelCommentItem[] => {
    const custom = commentsByReel[reelId];
    return custom ? [...custom, ...DEFAULT_REEL_COMMENTS] : DEFAULT_REEL_COMMENTS;
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text || !activeReel) return;
    const newComment: ReelCommentItem = {
      id: `rc-${Date.now()}`,
      author: lang === 'fa' ? 'دانشجوی دانشیار' : 'DaneshYar Student',
      badge: lang === 'fa' ? 'مهندسی · هم‌کلاسی' : 'Engineering Peer',
      text,
      likes: 1,
      time: lang === 'fa' ? 'هم‌اکنون' : 'Just now',
    };
    setCommentsByReel((prev) => {
      const updated = {
        ...prev,
        [activeReel.id]: [newComment, ...(prev[activeReel.id] || [])],
      };
      try {
        localStorage.setItem('daneshyar_reel_comments', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setCommentInput('');
  };

  const handleAskAi = async (customQ?: string) => {
    const q = (customQ ?? askQuestion).trim();
    if (!q || askLoading || !activeReel) return;
    if (customQ) setAskQuestion(customQ);
    setAskLoading(true);
    try {
      const resp = await fetch('/api/ai/reel-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: lang === 'fa' ? activeReel.titleFa : activeReel.titleEn,
          question: q,
          formulaLatex: activeReel.formulaLatex,
          lang,
        }),
      });
      const data = await resp.json();
      setAskAnswer(data.answer || data.error || '');
    } catch {
      setAskAnswer(lang === 'fa' ? 'خطا در ارتباط با دستیار هوش مصنوعی.' : 'Could not reach AI assistant.');
    } finally {
      setAskLoading(false);
    }
  };

  const activeComments = getCommentsForReel(activeReel.id);
  const elapsedSec = Math.min(30, Math.round((progress / 100) * 30));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'fa' ? 'پخش‌کننده تمام‌صفحه دانشریلز' : 'Fullscreen DaneshReels Player'}
      className="fixed inset-0 z-[9999] h-[100dvh] w-screen bg-slate-950 overflow-hidden select-none"
    >
      {/* Desktop Vertical Quick Navigation Controls (Floating outside central reel lane) */}
      <div className="hidden lg:flex flex-col items-center gap-3 fixed top-1/2 -translate-y-1/2 start-6 z-40">
        <button
          type="button"
          onClick={() => scrollToReel(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label={lang === 'fa' ? 'ریل قبلی' : 'Previous reel'}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center border border-white/15 backdrop-blur-xl transition-colors cursor-pointer"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="text-xs font-mono text-slate-300 tabular-nums">
          {activeIndex + 1}/{reels.length}
        </div>
        <button
          type="button"
          onClick={() => scrollToReel(activeIndex + 1)}
          disabled={activeIndex === reels.length - 1}
          aria-label={lang === 'fa' ? 'ریل بعدی' : 'Next reel'}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center border border-white/15 backdrop-blur-xl transition-colors cursor-pointer"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Top-Right Close Escape Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label={lang === 'fa' ? 'بستن تمام‌صفحه' : 'Exit fullscreen'}
        className="hidden lg:flex fixed top-5 end-6 z-40 min-h-[44px] px-4 rounded-full bg-white/10 hover:bg-rose-500/80 border border-white/15 backdrop-blur-xl text-white items-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
        <span>{lang === 'fa' ? 'خروج از ریلز' : 'Close Reels'}</span>
      </button>

      {/* True Fullscreen 100dvh Snap-Scroll Vertical Feed */}
      <div
        ref={feedRef}
        onScroll={handleFeedScroll}
        className={`h-[100dvh] w-full ${
          askAiOpen || commentsOpen ? 'overflow-hidden' : 'overflow-y-scroll'
        } snap-y snap-mandatory no-scrollbar scroll-smooth`}
      >
        {reels.map((reel, idx) => {
          const isCurrent = idx === activeIndex;
          const isLiked = likedIds.includes(reel.id);
          const isSaved = savedIds.includes(reel.id);
          const isExpanded = Boolean(expandedMap[reel.id]);
          const bullets = lang === 'fa' ? reel.feynmanBulletsFa : reel.feynmanBulletsEn;
          const narration = lang === 'fa' ? reel.narrationFa : reel.narrationEn;
          const reelComments = getCommentsForReel(reel.id);

          return (
            <section
              key={reel.id}
              className="relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden flex items-center justify-center bg-slate-950"
            >
              {/* Full-bleed Ambient Blurred Image Fill for Wide Viewports */}
              <img
                src={reel.image}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="hidden md:block absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-110 pointer-events-none"
              />

              {/* Full-Height 100dvh Interactive Reel Canvas (Edge-to-edge on mobile, crisp 9:16 stage on desktop) */}
              <div className="relative h-[100dvh] w-full md:max-w-[540px] lg:max-w-[560px] md:border-x md:border-white/15 bg-slate-900 overflow-hidden shadow-2xl">
                {/* Primary Vertical Background Visual */}
                <img
                  src={reel.image}
                  alt={lang === 'fa' ? reel.titleFa : reel.titleEn}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* High-Contrast Measured Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/75" />

                {/* Top Progress Bar + Header Controls */}
                <header className="absolute top-0 inset-x-0 z-30 p-4 pt-3.5 space-y-2.5 bg-gradient-to-b from-slate-950/90 via-slate-950/55 to-transparent">
                  {/* Smooth Reading Time Progress Bar + Playlist Segments */}
                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300 transition-[width] duration-100 ease-linear"
                        style={{ width: `${isCurrent ? progress : idx < activeIndex ? 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-300 font-mono tabular-nums">
                      <div className="flex items-center gap-1 flex-1 max-w-[65%]">
                        {reels.slice(0, 8).map((r, sIdx) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => scrollToReel(sIdx)}
                            aria-label={`Reel ${sIdx + 1}`}
                            className={`h-1 flex-1 rounded-full transition-colors cursor-pointer ${
                              sIdx === activeIndex
                                ? 'bg-sky-400'
                                : sIdx < activeIndex
                                ? 'bg-white/75'
                                : 'bg-white/25'
                            }`}
                          />
                        ))}
                      </div>
                      <span>
                        {isCurrent ? `${elapsedSec}s / 30s` : `${idx + 1}/${reels.length}`}
                      </span>
                    </div>
                  </div>

                  {/* Course Creator Header & Playback Controls */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr ${reel.ringGradient} shrink-0`}
                      >
                        <img
                          src={reel.image}
                          alt={reel.courseCode}
                          referrerPolicy="no-referrer"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white truncate">
                          {lang === 'fa' ? reel.storyTitleFa : reel.storyTitleEn}
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono truncate">
                          {reel.courseCode} · {lang === 'fa' ? reel.categoryFa : reel.categoryEn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSoundEnabled((s) => !s)}
                        aria-label={lang === 'fa' ? 'تغییر وضعیت صدا و روایت' : 'Toggle voice narration'}
                        className="min-h-[44px] min-w-[44px] rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                      >
                        {audioLoading && isCurrent ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-sky-300" />
                        ) : (
                          <VolumeX className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPlaying((p) => !p)}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className="min-h-[44px] min-w-[44px] rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        aria-label={lang === 'fa' ? 'بستن ریلز' : 'Close Reels'}
                        className="lg:hidden min-h-[44px] min-w-[44px] rounded-full bg-white/15 hover:bg-rose-500/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </header>

                {/* Main Bottom Educational Overlay (Safe padding-bottom: 100px + side inset clearance) */}
                <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-5 pb-[100px] pt-24 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none">
                  <div className="pe-[76px] space-y-3 pointer-events-auto">
                    {/* Compact Animated Concept Card + LaTeX Equation */}
                    <div className="rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 p-3 space-y-2 shadow-lg">
                      <ConceptMotionOverlay visualType={reel.visualType} isPlaying={isPlaying && isCurrent} />
                      <div className="rounded-xl bg-slate-900/90 border border-white/10 px-2.5 py-1.5 text-white overflow-x-auto">
                        <LatexBlock
                          math={reel.formulaLatex}
                          displayMode={true}
                          className="text-xs sm:text-sm my-0"
                        />
                      </div>
                    </div>

                    {/* Title & Course Quick Launch */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug [text-wrap:balance]">
                        {lang === 'fa' ? reel.titleFa : reel.titleEn}
                      </h3>
                    </div>

                    {/* Scrollable Caption Container (max-height: 40vh, overflow-y: auto, masked fade at top) */}
                    <div className="space-y-2">
                      <div
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        style={{
                          WebkitMaskImage: isExpanded
                            ? 'linear-gradient(to bottom, transparent 0%, black 18px, black 100%)'
                            : undefined,
                          maskImage: isExpanded
                            ? 'linear-gradient(to bottom, transparent 0%, black 18px, black 100%)'
                            : undefined,
                        }}
                        className="max-h-[40vh] overflow-y-auto overscroll-contain pe-1 space-y-2 select-text"
                      >
                        <ul className={`space-y-1.5 text-xs sm:text-[13px] text-slate-100/95 leading-relaxed ${isExpanded ? 'pt-3' : ''}`}>
                          {bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2">
                              <span className="font-mono text-[11px] font-bold text-sky-400 mt-0.5 shrink-0">
                                {bIdx + 1}.
                              </span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        {isExpanded && (
                          <div className="rounded-xl bg-white/10 border border-white/15 p-3 text-xs sm:text-[13px] text-slate-100 leading-relaxed space-y-1.5">
                            <div className="text-[11px] font-bold text-amber-300">
                              {lang === 'fa' ? 'توضیح کامل فاینمن و روایت مفهومی:' : 'Full Feynman Explanation:'}
                            </div>
                            <p>{narration}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMap((prev) => ({ ...prev, [reel.id]: !prev[reel.id] }))
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/12 hover:bg-white/22 border border-white/15 text-xs font-semibold text-sky-300 transition-colors cursor-pointer"
                        >
                          <span>
                            {isExpanded
                              ? lang === 'fa' ? 'بستن' : 'Show less'
                              : lang === 'fa' ? 'بیشتر...' : 'Read more...'}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isExpanded ? '-rotate-90' : 'rotate-90'
                            }`}
                          />
                        </button>

                        {onOpenCourseByCode && (
                          <button
                            type="button"
                            onClick={() => onOpenCourseByCode(reel.courseCode)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/35 text-xs font-semibold text-white transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-sky-300" />
                            <span>
                              {lang === 'fa' ? 'درس‌نامه عمیق و غول امتحان' : 'Full Course & Exam'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Safe Bar Indicator (Swipe cue / Slide counter inside the 100px safe bottom zone) */}
                <div className="absolute inset-x-0 bottom-4 z-20 px-5 pe-24 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
                  <span>
                    {lang === 'fa'
                      ? idx < reels.length - 1
                        ? 'برای ریل بعدی به بالا بکشید یا اسکرول کنید'
                        : 'پایان فهرست دانشریلز'
                      : idx < reels.length - 1
                      ? 'Swipe or scroll up for next reel'
                      : 'End of DaneshReels feed'}
                  </span>
                  <span className="font-mono tabular-nums text-slate-300">
                    {idx + 1} / {reels.length}
                  </span>
                </div>

                {/* Floating Side Action Buttons Stack (inset-inline-end: 16px, bottom: 100px) */}
                <aside
                  aria-label={lang === 'fa' ? 'ابزارهای تعاملی ریل' : 'Reel interactions'}
                  className="absolute end-4 bottom-[100px] z-30 flex flex-col items-center gap-3 p-2 rounded-3xl bg-slate-900/55 backdrop-blur-xl border border-white/15 shadow-2xl"
                >
                  {/* Like */}
                  <button
                    type="button"
                    onClick={() => toggleLike(reel.id)}
                    aria-label={lang === 'fa' ? 'پسندیدن' : 'Like'}
                    className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                  >
                    <span className="w-11 h-11 rounded-full bg-white/12 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                      <Heart
                        className={`w-5 h-5 transition-transform group-active:scale-125 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                        }`}
                      />
                    </span>
                    <span className="text-[11px] font-mono tabular-nums">
                      {reel.likes + (isLiked ? 1 : 0)}
                    </span>
                  </button>

                  {/* Bookmark / Save */}
                  <button
                    type="button"
                    onClick={() => toggleSave(reel.id)}
                    aria-label={lang === 'fa' ? 'ذخیره' : 'Bookmark'}
                    className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                  >
                    <span className="w-11 h-11 rounded-full bg-white/12 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                      <Bookmark
                        className={`w-5 h-5 ${
                          isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'
                        }`}
                      />
                    </span>
                    <span className="text-[11px] font-mono tabular-nums">
                      {reel.saves + (isSaved ? 1 : 0)}
                    </span>
                  </button>

                  {/* Comments */}
                  <button
                    type="button"
                    onClick={() => {
                      setAskAiOpen(false);
                      setCommentsOpen(true);
                    }}
                    aria-label={lang === 'fa' ? 'نظرات دانشجویان' : 'Comments'}
                    className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                  >
                    <span className="w-11 h-11 rounded-full bg-white/12 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </span>
                    <span className="text-[11px] font-mono tabular-nums">
                      {reelComments.length}
                    </span>
                  </button>

                  {/* Ask AI */}
                  <button
                    type="button"
                    onClick={() => {
                      setCommentsOpen(false);
                      setAskAiOpen(true);
                    }}
                    aria-label={lang === 'fa' ? 'پرسش از هوش مصنوعی' : 'Ask AI'}
                    className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                  >
                    <span className="w-11 h-11 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-lg flex items-center justify-center transition-colors">
                      <Bot className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold text-sky-300">
                      {lang === 'fa' ? 'AI' : 'Ask AI'}
                    </span>
                  </button>

                  {/* Share */}
                  <button
                    type="button"
                    onClick={() => handleShare(reel)}
                    aria-label={lang === 'fa' ? 'اشتراک‌گذاری' : 'Share'}
                    className="flex flex-col items-center gap-0.5 text-white cursor-pointer group"
                  >
                    <span className="w-11 h-11 rounded-full bg-white/12 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                      {copiedShareId === reel.id ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-5 h-5 text-white" />
                      )}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums">
                      {copiedShareId === reel.id ? (lang === 'fa' ? 'کپی' : 'Copied') : reel.shares}
                    </span>
                  </button>
                </aside>
              </div>
            </section>
          );
        })}
      </div>

      {/* Comments Bottom Sheet Drawer */}
      {commentsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setCommentsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-[540px] lg:max-w-[560px] rounded-t-3xl bg-slate-950/95 backdrop-blur-2xl border-t border-white/20 p-5 space-y-4 max-h-[72dvh] flex flex-col"
          >
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <span>
                  {lang === 'fa'
                    ? `دیدگاه‌های دانشجویان (${activeComments.length})`
                    : `Student Comments (${activeComments.length})`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCommentsOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-lg text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pe-1">
              {activeComments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-white/8 border border-white/10 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <span className="font-bold text-slate-100">{c.author}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{c.badge}</span>
                    </div>
                    <span className="shrink-0">{c.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">{c.text}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono tabular-nums pt-0.5">
                    <ThumbsUp className="w-3 h-3 text-sky-400" />
                    <span>{c.likes}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1 shrink-0">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={lang === 'fa' ? 'نظر یا نکته امتحانی خود را بنویسید...' : 'Add a study note or comment...'}
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'ارسال' : 'Post'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ask AI Bottom Sheet Drawer */}
      {askAiOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setAskAiOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-[540px] lg:max-w-[560px] rounded-t-3xl bg-slate-950/95 backdrop-blur-2xl border-t border-white/20 p-5 space-y-3.5 max-h-[75dvh] overflow-y-auto"
          >
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Bot className="w-4 h-4 text-sky-400" />
                <span>
                  {lang === 'fa' ? 'پرسش فوری از دانشیار درباره این ریل' : 'Ask AI About This Micro-Lesson'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAskAiOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-lg text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(lang === 'fa'
                ? ['چرا این فرمول اینجوریه؟', 'یه مثال واقعی از صنعت بزن', 'تله امتحانی این مبحث چیه؟']
                : ['Why does this formula work?', 'Give an industry example', 'Common exam trap?']
              ).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAskAi(preset)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-sky-200 cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {askLoading && (
              <div className="flex items-center gap-2 text-xs text-sky-300 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{lang === 'fa' ? 'در حال نگارش پاسخ سریع...' : 'Generating quick answer...'}</span>
              </div>
            )}

            {askAnswer && !askLoading && (
              <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 text-xs sm:text-sm text-slate-100 leading-relaxed">
                <RichMathText text={askAnswer} />
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                placeholder={lang === 'fa' ? 'هر سوالی درباره این مفهوم دارید بپرسید...' : 'Ask anything about this topic...'}
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={askLoading}
                className="min-h-[44px] px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'بپرس' : 'Ask'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
