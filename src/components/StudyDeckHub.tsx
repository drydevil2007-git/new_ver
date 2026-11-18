import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Layers,
  BrainCircuit,
  Mic,
  MicOff,
  Volume2,
  RotateCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  Send,
  AlertCircle,
  Radio,
  Clock,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Lang, LeitnerCard } from '../types/app';
import { LatexBlock } from './MathRenderer';

export type DeckTab = 'flashcards' | 'quiz' | 'voice';

interface StudyDeckHubProps {
  lang: Lang;
  activeTab: DeckTab;
  onChangeTab: (tab: DeckTab) => void;
  cards: LeitnerCard[];
  onPromoteCard: (cardId: string) => void;
  onResetCard: (cardId: string) => void;
  onAddCards: (newCards: Omit<LeitnerCard, 'id' | 'box' | 'lastReviewedAt' | 'reviewCount'>[]) => void;
  initialQuizTopic?: string;
  initialFlashcardTopic?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  formulaLatex?: string;
  options: string[];
  correctIndex: number;
  feynmanExplanation: string;
}

function float32ToPcmBase64(float32: Float32Array): string {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function pcm24kBase64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const float32 = new Float32Array(bytes.length / 2);
  for (let i = 0; i < float32.length; i++) {
    float32[i] = view.getInt16(i * 2, true) / 32768;
  }
  return float32;
}

export const StudyDeckHub: React.FC<StudyDeckHubProps> = ({
  lang,
  activeTab,
  onChangeTab,
  cards,
  onPromoteCard,
  onResetCard,
  onAddCards,
  initialQuizTopic,
  initialFlashcardTopic,
}) => {
  // ==========================================================================
  // 1. Spaced Repetition Flashcards (Leitner Box 1-5)
  // ==========================================================================
  const [boxFilter, setBoxFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [genTopic, setGenTopic] = useState(initialFlashcardTopic || 'قضایای مدارهای الکتریکی و لاپلاس');
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    if (initialFlashcardTopic) setGenTopic(initialFlashcardTopic);
  }, [initialFlashcardTopic]);

  const boxCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    cards.forEach((c) => {
      counts[c.box] += 1;
    });
    return counts;
  }, [cards]);

  const activeCards = useMemo(() => {
    const list = boxFilter === 'all' ? cards : cards.filter((c) => c.box === boxFilter);
    return list;
  }, [cards, boxFilter]);

  const currentCard = activeCards.length > 0 ? activeCards[cardIndex % activeCards.length] : null;

  const handleGenerateFlashcards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;
    setGenLoading(true);
    setGenError(null);
    try {
      const resp = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText: genTopic, courseTitle: genTopic, count: 6, lang }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'خطا در تولید فلش‌کارت');
      if (Array.isArray(data.cards)) {
        onAddCards(
          data.cards.map((c: { front: string; back: string; formulaLatex?: string; hint?: string }) => ({
            front: c.front,
            back: c.back,
            formulaLatex: c.formulaLatex,
            hint: c.hint,
            deck: data.deckName || genTopic,
          }))
        );
        setBoxFilter(1);
        setCardIndex(0);
        setFlipped(false);
      }
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'خطای ارتباط با سرور');
    } finally {
      setGenLoading(false);
    }
  };

  // ==========================================================================
  // 2. Smart Quiz & Exam Simulator with Grading & Performance Metrics
  // ==========================================================================
  const [quizTopic, setQuizTopic] = useState(initialQuizTopic || 'سیستم‌های کنترل خطی و معیار پایداری');
  const [quizDifficulty, setQuizDifficulty] = useState<'introductory' | 'intermediate' | 'advanced'>('intermediate');
  const [quizCount, setQuizCount] = useState(4);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examSeconds, setExamSeconds] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examHistory, setExamHistory] = useState<
    Array<{
      id: string;
      topic: string;
      difficulty: string;
      correct: number;
      total: number;
      accuracy: number;
      durationSec: number;
      date: string;
    }>
  >(() => {
    try {
      const saved = localStorage.getItem('daneshyar_exam_history_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'ex-seed-1',
        topic: 'تحلیل مدارهای RLC و لاپلاس',
        difficulty: 'intermediate',
        correct: 4,
        total: 5,
        accuracy: 80,
        durationSec: 185,
        date: 'دیروز',
      },
      {
        id: 'ex-seed-2',
        topic: 'ریاضی مهندسی (سری فوریه)',
        difficulty: 'advanced',
        correct: 3,
        total: 4,
        accuracy: 75,
        durationSec: 210,
        date: '۲ روز پیش',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('daneshyar_exam_history_v1', JSON.stringify(examHistory));
    } catch {
      // ignore
    }
  }, [examHistory]);

  useEffect(() => {
    if (quizQuestions.length === 0 || examSubmitted) return;
    const timer = setInterval(() => {
      setExamSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizQuestions.length, examSubmitted]);

  useEffect(() => {
    if (initialQuizTopic) setQuizTopic(initialQuizTopic);
  }, [initialQuizTopic]);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuizLoading(true);
    setQuizError(null);
    setExamSubmitted(false);
    setExamSeconds(0);
    try {
      const resp = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic, difficulty: quizDifficulty, count: quizCount, lang }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'خطا در ساخت آزمون');
      setQuizTitle(data.quizTitle || quizTopic);
      setQuizQuestions(data.questions || []);
      setSelectedAnswers({});
      setExamSeconds(0);
    } catch (err) {
      setQuizError(err instanceof Error ? err.message : 'خطای ارتباط با سرور');
    } finally {
      setQuizLoading(false);
    }
  };

  const quizScore = useMemo(() => {
    let correct = 0;
    let answered = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] !== undefined) {
        answered += 1;
        if (selectedAnswers[q.id] === q.correctIndex) correct += 1;
      }
    });
    const accuracy = quizQuestions.length > 0 ? Math.round((correct / quizQuestions.length) * 100) : 0;
    return { correct, answered, total: quizQuestions.length, accuracy };
  }, [quizQuestions, selectedAnswers]);

  const handleFinishExam = () => {
    if (quizQuestions.length === 0 || examSubmitted) return;
    setExamSubmitted(true);
    const newAttempt = {
      id: `ex-${Date.now()}`,
      topic: quizTitle || quizTopic,
      difficulty: quizDifficulty,
      correct: quizScore.correct,
      total: quizScore.total,
      accuracy: quizScore.accuracy,
      durationSec: Math.max(1, examSeconds),
      date: lang === 'fa' ? 'هم‌اکنون' : 'Just now',
    };
    setExamHistory((prev) => [newAttempt, ...prev].slice(0, 8));
  };

  const performanceMetrics = useMemo(() => {
    if (examHistory.length === 0) {
      return { examsCount: 0, avgAccuracy: 0, avgTimePerQ: 0 };
    }
    const avgAccuracy = Math.round(
      examHistory.reduce((acc, item) => acc + item.accuracy, 0) / examHistory.length
    );
    const totalQuestions = examHistory.reduce((acc, item) => acc + item.total, 0);
    const totalTime = examHistory.reduce((acc, item) => acc + item.durationSec, 0);
    return {
      examsCount: examHistory.length,
      avgAccuracy,
      avgTimePerQ: totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0,
    };
  }, [examHistory]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ==========================================================================
  // 3. Voice AI Study Coach (Live WebSocket + Turn-Based Oral Exam Mode)
  // ==========================================================================
  const [coachTopic, setCoachTopic] = useState(
    lang === 'fa' ? 'تحلیل مدارهای RLC و تبدیل لاپلاس' : 'RLC Transients & Laplace Transforms'
  );
  const [coachMode, setCoachMode] = useState<'oral_exam' | 'concept_drill' | 'thesis_defense'>('oral_exam');
  const [liveStatus, setLiveStatus] = useState<'idle' | 'connecting' | 'live' | 'error'>('idle');
  const [liveError, setLiveError] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState(0);
  const [transcriptLog, setTranscriptLog] = useState<
    Array<{ id: string; role: 'user' | 'coach'; text: string; audioUrl?: string }>
  >([
    {
      id: 'init-coach',
      role: 'coach',
      text:
        lang === 'fa'
          ? 'سلام! من مربی صوتی دانشیار هستم. برای شروع آزمون شفاهی، میکروفون زنده را روشن کنید یا پاسخ خود را پایین بنویسید.'
          : 'Welcome! Start Live Voice Session for real-time two-way coaching, or type/record your oral exam answer below.',
    },
  ]);

  const [turnInput, setTurnInput] = useState('');
  const [turnLoading, setTurnLoading] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const stopLiveSession = () => {
    try {
      processorRef.current?.disconnect();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      inputCtxRef.current?.close();
      outputCtxRef.current?.close();
      wsRef.current?.close();
    } catch {
      // ignore cleanup errors
    }
    processorRef.current = null;
    mediaStreamRef.current = null;
    inputCtxRef.current = null;
    outputCtxRef.current = null;
    wsRef.current = null;
    nextPlayTimeRef.current = 0;
    setMicLevel(0);
    setLiveStatus('idle');
  };

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const startLiveSession = async () => {
    setLiveError(null);
    setLiveStatus('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;
      nextPlayTimeRef.current = outputCtx.currentTime;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/voice-coach?lang=${encodeURIComponent(
        lang
      )}&topic=${encodeURIComponent(coachTopic)}&mode=${encodeURIComponent(coachMode)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (ev) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const samples = ev.inputBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 0; i < samples.length; i++) sum += Math.abs(samples[i]);
          setMicLevel(Math.min(100, Math.round((sum / samples.length) * 420)));
          const base64 = float32ToPcmBase64(samples);
          ws.send(JSON.stringify({ audio: base64 }));
        };

        source.connect(processor);
        processor.connect(inputCtx.destination);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ready') {
            setLiveStatus('live');
            ws.send(
              JSON.stringify({
                text:
                  lang === 'fa'
                    ? `سلام مربی، لطفاً آزمون شفاهی درباره «${coachTopic}» را با اولین سوال شروع کن.`
                    : `Hello Coach, please start our oral exam session on "${coachTopic}" with your first question.`,
              })
            );
          } else if (msg.type === 'audio' && msg.data && outputCtxRef.current) {
            const float32 = pcm24kBase64ToFloat32(msg.data);
            const buf = outputCtxRef.current.createBuffer(1, float32.length, 24000);
            buf.getChannelData(0).set(float32);
            const src = outputCtxRef.current.createBufferSource();
            src.buffer = buf;
            src.connect(outputCtxRef.current.destination);
            const startAt = Math.max(outputCtxRef.current.currentTime, nextPlayTimeRef.current);
            src.start(startAt);
            nextPlayTimeRef.current = startAt + buf.duration;
          } else if (msg.type === 'input_transcript' && msg.text) {
            setTranscriptLog((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'user' && last.id.startsWith('live-in-')) {
                return [...prev.slice(0, -1), { ...last, text: last.text + msg.text }];
              }
              return [...prev, { id: `live-in-${Date.now()}`, role: 'user', text: msg.text }];
            });
          } else if (msg.type === 'output_transcript' && msg.text) {
            setTranscriptLog((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'coach' && last.id.startsWith('live-out-')) {
                return [...prev.slice(0, -1), { ...last, text: last.text + msg.text }];
              }
              return [...prev, { id: `live-out-${Date.now()}`, role: 'coach', text: msg.text }];
            });
          } else if (msg.type === 'interrupted' && outputCtxRef.current) {
            nextPlayTimeRef.current = outputCtxRef.current.currentTime;
          } else if (msg.type === 'error') {
            setLiveError(msg.message || 'خطا در جلسه صوتی زنده');
            stopLiveSession();
          }
        } catch {
          // ignore
        }
      };

      ws.onerror = () => {
        setLiveError(lang === 'fa' ? 'اتصال صوتی زنده برقرار نشد.' : 'Could not connect live audio session.');
        stopLiveSession();
      };
    } catch (err) {
      setLiveError(
        err instanceof Error
          ? err.message
          : lang === 'fa'
          ? 'دسترسی به میکروفون مجاز نیست؛ از حالت مکالمه پایین استفاده کنید.'
          : 'Microphone unavailable; use the turn-based voice/text mode below.'
      );
      setLiveStatus('error');
    }
  };

  const handleTurnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = turnInput.trim();
    if (!text || turnLoading) return;
    setTurnInput('');
    setLiveError(null);

    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, text };
    setTranscriptLog((prev) => [...prev, userMsg]);
    setTurnLoading(true);

    try {
      const resp = await fetch('/api/ai/voice-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: transcriptLog.slice(-6).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          topic: coachTopic,
          mode: coachMode,
          lang,
          withAudio: true,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'خطا در پاسخ مربی');

      let audioUrl: string | undefined;
      if (data.audioBase64) {
        audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
        const audio = new Audio(audioUrl);
        audio.play().catch(() => {});
      }

      setTranscriptLog((prev) => [
        ...prev,
        { id: `c-${Date.now()}`, role: 'coach', text: data.replyText, audioUrl },
      ]);
    } catch (err) {
      setLiveError(err instanceof Error ? err.message : 'خطا در ارتباط با مربی');
    } finally {
      setTurnLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'جعبه یادگیری فعال و آمادگی امتحان' : 'Active Study Deck & Exam Prep'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'fa'
              ? 'فلش‌کارت تکرار فاصله‌دار لایتنر، آزمون‌های هوشمند با توضیح فاینمن و مربی صوتی زنده'
              : 'Leitner spaced-repetition flashcards, Feynman-explained quizzes, and two-way voice coaching'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 self-start overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => onChangeTab('flashcards')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'fa' ? `جعبه لایتنر (${cards.length})` : `Leitner Box (${cards.length})`}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('quiz')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{lang === 'fa' ? 'آزمون هوشمند فاینمن' : 'Smart MCQ Quiz'}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('voice')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{lang === 'fa' ? 'مربی صوتی زنده' : 'Voice Study Coach'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: Spaced Repetition Flashcards (Leitner Box 1-5)                 */}
      {/* ===================================================================== */}
      {activeTab === 'flashcards' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 5-Box Mastery Tracker + AI Generator */}
          <div className="lg:col-span-5 space-y-5">
            <div className="glass-surface rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'توزیع کارت‌ها در ۵ جعبه لایتنر' : 'Leitner 5-Box Mastery'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setBoxFilter('all');
                    setCardIndex(0);
                    setFlipped(false);
                  }}
                  className={`text-xs font-semibold cursor-pointer ${
                    boxFilter === 'all' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500'
                  }`}
                >
                  {lang === 'fa' ? `همه (${cards.length})` : `All (${cards.length})`}
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {([1, 2, 3, 4, 5] as const).map((b) => {
                  const selected = boxFilter === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setBoxFilter(b);
                        setCardIndex(0);
                        setFlipped(false);
                      }}
                      className={`rounded-xl p-2.5 text-center border transition-colors cursor-pointer ${
                        selected
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60'
                          : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-sky-300'
                      }`}
                    >
                      <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums font-mono">
                        {boxCounts[b]}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === 'fa' ? `جعبه ${b}` : `Box ${b}`}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'fa'
                  ? 'جعبه ۱: مرور روزانه · جعبه ۲: هر ۲ روز · جعبه ۳: هر ۴ روز · جعبه ۴: هر ۸ روز · جعبه ۵: تسلط کامل'
                  : 'Box 1: Daily · Box 2: 2d · Box 3: 4d · Box 4: 8d · Box 5: Mastered'}
              </p>
            </div>

            <form onSubmit={handleGenerateFlashcards} className="glass-surface rounded-3xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'تولید خودکار فلش‌کارت از موضوع یا جزوه' : 'Auto-Generate Flashcards with AI'}
              </h4>
              <textarea
                rows={3}
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder={lang === 'fa' ? 'نام مبحث یا بخشی از جزوه را وارد کنید...' : 'Enter a topic or paste lecture notes...'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={genLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold cursor-pointer"
              >
                {genLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{lang === 'fa' ? 'ساخت ۶ فلش‌کارت جدید' : 'Generate 6 Smart Cards'}</span>
              </button>
              {genError && <p className="text-xs text-rose-600 dark:text-rose-400">{genError}</p>}
            </form>
          </div>

          {/* Right: 3D Interactive Flip Card */}
          <div className="lg:col-span-7 glass-surface rounded-3xl p-6 flex flex-col justify-between min-h-[410px] space-y-5">
            {currentCard ? (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {currentCard.deck} · {lang === 'fa' ? `جعبه ${currentCard.box}` : `Box ${currentCard.box}`}
                  </span>
                  <span className="tabular-nums font-mono">
                    {(cardIndex % activeCards.length) + 1} / {activeCards.length}
                  </span>
                </div>

                <div
                  onClick={() => setFlipped((f) => !f)}
                  className="perspective-1000 cursor-pointer flex-1 min-h-[240px] flex items-stretch"
                >
                  <div
                    className={`relative w-full transition-transform duration-500 preserve-3d ${
                      flipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 p-6 flex flex-col items-center justify-center text-center space-y-4">
                      <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                        {lang === 'fa' ? 'پرسش / مفهوم (برای مشاهده پاسخ کلیک کنید)' : 'Prompt (Click to flip)'}
                      </span>
                      <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                        {currentCard.front}
                      </p>
                      {currentCard.hint && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {lang === 'fa' ? `راهنما: ${currentCard.hint}` : `Hint: ${currentCard.hint}`}
                        </p>
                      )}
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-sky-400/50 bg-sky-50/85 dark:bg-slate-900/95 p-6 flex flex-col items-center justify-center text-center space-y-4">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {lang === 'fa' ? 'پاسخ و فرمول کلیدی' : 'Answer & Key Equation'}
                      </span>
                      <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                        {currentCard.back}
                      </p>
                      {currentCard.formulaLatex && (
                        <div className="w-full rounded-xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 px-3 py-2">
                          <LatexBlock math={currentCard.formulaLatex} displayMode={true} className="text-sm text-slate-900 dark:text-white my-0" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetCard(currentCard.id);
                      setFlipped(false);
                      setCardIndex((i) => i + 1);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'مرور مجدد (جعبه ۱)' : 'Review Again (Box 1)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipped((f) => !f)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'برگرداندن کارت' : 'Flip Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onPromoteCard(currentCard.id);
                      setFlipped(false);
                      setCardIndex((i) => i + 1);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'بلد بودم (ارتقا)' : 'Mastered (+Box)'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center space-y-3 text-slate-500 dark:text-slate-400">
                <Layers className="w-10 h-10 text-sky-500/70" />
                <p className="text-sm font-semibold">
                  {lang === 'fa' ? 'در این جعبه کارتی نیست. فیلتر را روی «همه» بگذارید یا کارت بسازید.' : 'No cards in this box. Switch to All or generate new cards.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: Smart Quiz & Exam Simulator with Automated Grading & Metrics   */}
      {/* ===================================================================== */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Performance Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-surface rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'میانگین دقت آزمون‌ها' : 'Avg Exam Accuracy'}
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {performanceMetrics.avgAccuracy}%
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500/80" />
            </div>

            <div className="glass-surface rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'تعداد آزمون‌های تکمیل‌شده' : 'Completed Simulations'}
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400 mt-0.5">
                  {performanceMetrics.examsCount}
                </div>
              </div>
              <Award className="w-6 h-6 text-sky-500/80" />
            </div>

            <div className="glass-surface rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'میانگین زمان هر سوال' : 'Avg Speed / Question'}
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                  {performanceMetrics.avgTimePerQ}s
                </div>
              </div>
              <Clock className="w-6 h-6 text-amber-500/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-5">
              <form onSubmit={handleGenerateQuiz} className="glass-surface rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'شبیه‌ساز آزمون و کوییز هوشمند' : 'Smart Exam & Quiz Simulator'}
                </h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {lang === 'fa' ? 'نام درس یا موضوع امتحان' : 'Exam Topic or Course'}
                  </label>
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {lang === 'fa' ? 'سطح دشواری' : 'Difficulty'}
                    </label>
                    <select
                      value={quizDifficulty}
                      onChange={(e) => setQuizDifficulty(e.target.value as 'introductory' | 'intermediate' | 'advanced')}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                    >
                      <option value="introductory">{lang === 'fa' ? 'پایه' : 'Introductory'}</option>
                      <option value="intermediate">{lang === 'fa' ? 'تخصصی' : 'Intermediate'}</option>
                      <option value="advanced">{lang === 'fa' ? 'پیشرفته' : 'Advanced'}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {lang === 'fa' ? 'تعداد سوال' : 'Questions'}
                    </label>
                    <select
                      value={quizCount}
                      onChange={(e) => setQuizCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                    >
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={quizLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold cursor-pointer"
                >
                  {quizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                  <span>{lang === 'fa' ? 'شروع آزمون زمان‌دار جدید' : 'Start New Timed Exam'}</span>
                </button>

                {quizQuestions.length > 0 && (
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {lang === 'fa' ? 'زمان سپری‌شده' : 'Exam Timer'}
                      </span>
                      <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {formatTimer(examSeconds)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {lang === 'fa' ? 'نمره لحظه‌ای' : 'Live Score'}
                      </span>
                      <span className="text-base font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400">
                        {quizScore.correct} / {quizScore.total} ({quizScore.accuracy}%)
                      </span>
                    </div>
                    {!examSubmitted && (
                      <button
                        type="button"
                        onClick={handleFinishExam}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        {lang === 'fa' ? 'ثبت برگه و صدور کارنامه' : 'Submit Exam & Grade'}
                      </button>
                    )}
                  </div>
                )}

                {quizError && <p className="text-xs text-rose-600 dark:text-rose-400">{quizError}</p>}
              </form>

              {/* Recent Exam Attempts History */}
              <div className="glass-surface rounded-3xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'کارنامه آزمون‌های اخیر' : 'Recent Exam History'}
                </h4>
                <div className="space-y-2.5">
                  {examHistory.slice(0, 4).map((ex) => (
                    <div key={ex.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{ex.topic}</span>
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">{ex.accuracy}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ex.accuracy}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{ex.correct}/{ex.total} · {formatTimer(ex.durationSec)}</span>
                        <span>{ex.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 glass-surface rounded-3xl p-6 min-h-[420px] space-y-5">
              {quizQuestions.length === 0 && !quizLoading && (
                <div className="min-h-[340px] flex flex-col items-center justify-center text-center space-y-3 text-slate-500 dark:text-slate-400">
                  <BrainCircuit className="w-10 h-10 text-sky-500/70" />
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'fa' ? 'شبیه‌ساز آزمون با تصحیح خودکار و تحلیل فاینمن' : 'Exam Simulator with Automated Grading & Feynman Diagnostics'}
                  </h4>
                  <p className="text-sm max-w-md">
                    {lang === 'fa'
                      ? 'با شروع آزمون، تایمر فعال می‌شود و پس از پاسخ یا ثبت برگه، تشخیص نقاط ضعف و توضیح شهودی فاینمن برای هر سوال نمایش داده می‌شود.'
                      : 'Start a timed simulation to receive instant Feynman-style concept diagnostics and performance grading.'}
                  </p>
                </div>
              )}

              {quizLoading && (
                <div className="min-h-[340px] flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {lang === 'fa' ? 'در حال طراحی سوالات دانشگاهی...' : 'Drafting engineering exam questions...'}
                  </p>
                </div>
              )}

              {quizQuestions.length > 0 && !quizLoading && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{quizTitle}</h3>
                    <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {quizScore.answered}/{quizScore.total} {lang === 'fa' ? 'پاسخ‌داده‌شده' : 'Answered'}
                    </span>
                  </div>

                  {examSubmitted && (
                    <div className="rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-5 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-base">
                          <Award className="w-5 h-5" />
                          <span>
                            {lang === 'fa'
                              ? `کارنامه نهایی: نمره ${quizScore.correct} از ${quizScore.total} (${quizScore.accuracy}%)`
                              : `Final Grade: ${quizScore.correct} / ${quizScore.total} (${quizScore.accuracy}%)`}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
                          {lang === 'fa' ? `مدت آزمون: ${formatTimer(examSeconds)}` : `Duration: ${formatTimer(examSeconds)}`}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        {quizScore.accuracy >= 75
                          ? lang === 'fa'
                            ? 'تسلط بسیار خوبی روی مفاهیم این مبحث دارید. می‌توانید به سطح دشواری بالاتر بروید یا نکات کلیدی را در جعبه لایتنر مرور کنید.'
                            : 'Strong conceptual mastery! Consider stepping up to Advanced difficulty.'
                          : lang === 'fa'
                          ? 'تحلیل فاینمن: برخی مباحث پایه نیاز به مرور عمیق‌تر دارند. توضیحات فاینمن زیر سوالات غلط را با دقت بخوانید و یک دور با دستیار فاینمن تمرین کنید.'
                          : 'Feynman Diagnostic: Review the missed conceptual traps below and drill the core intuition in the Feynman AI tab.'}
                      </p>
                    </div>
                  )}

                  {quizQuestions.map((q, qIdx) => {
                    const chosen = selectedAnswers[q.id];
                    const answered = chosen !== undefined || examSubmitted;
                    return (
                      <div key={q.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 space-y-3">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {qIdx + 1}. {q.question}
                        </div>
                        {q.formulaLatex && (
                          <div className="rounded-xl bg-slate-100 dark:bg-slate-950/70 px-3 py-2">
                            <LatexBlock math={q.formulaLatex} displayMode={true} className="text-xs my-0" />
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = chosen === oIdx;
                            const isCorrect = oIdx === q.correctIndex;
                            let style =
                              'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:border-sky-400';
                            if (answered) {
                              if (isCorrect) {
                                style =
                                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                              } else if (isSelected) {
                                style =
                                  'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                              }
                            }
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={answered}
                                onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                                className={`text-start px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-colors cursor-pointer ${style}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {answered && (
                          <div className="rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 p-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                            <span className="font-bold text-sky-700 dark:text-sky-400">
                              {lang === 'fa' ? 'تحلیل تشخیصی فاینمن: ' : 'Feynman Diagnostic: '}
                            </span>
                            {q.feynmanExplanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: Voice AI Study Coach (Live WebSocket + Turn-Based Oral Exam)   */}
      {/* ===================================================================== */}
      {activeTab === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Voice Control Console */}
          <div className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'مربی صوتی آزمون شفاهی' : 'Voice AI Study Coach'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {lang === 'fa'
                  ? 'مکالمه صوتی دوطرفه زنده برای شبیه‌سازی آزمون شفاهی، دفاع پروژه و تثبیت عمیق مفاهیم'
                  : 'Two-way real-time spoken coaching for oral exam prep and deep Socratic concept drilling.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'fa' ? 'موضوع جلسه تمرین' : 'Session Topic'}
              </label>
              <input
                type="text"
                value={coachTopic}
                onChange={(e) => setCoachTopic(e.target.value)}
                disabled={liveStatus === 'live'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'fa' ? 'حالت گفتگو' : 'Coaching Mode'}
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                {(
                  [
                    { id: 'oral_exam', fa: 'آزمون شفاهی', en: 'Oral Exam' },
                    { id: 'concept_drill', fa: 'تمرین مفهومی', en: 'Concept Drill' },
                    { id: 'thesis_defense', fa: 'دفاع پروژه', en: 'Defense' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={liveStatus === 'live'}
                    onClick={() => setCoachMode(m.id)}
                    className={`py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                      coachMode === m.id
                        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {lang === 'fa' ? m.fa : m.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time Live Voice Trigger & Level Meter */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <Radio className={`w-4 h-4 ${liveStatus === 'live' ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span>
                    {liveStatus === 'live'
                      ? lang === 'fa' ? 'مکالمه زنده برقرار است' : 'Live Voice Connected'
                      : liveStatus === 'connecting'
                      ? lang === 'fa' ? 'در حال اتصال صوتی...' : 'Connecting Live Audio...'
                      : lang === 'fa' ? 'آماده اتصال میکروفون زنده' : 'Ready for Live Mic'}
                  </span>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500">{micLevel}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all duration-100"
                  style={{ width: `${Math.max(4, micLevel)}%` }}
                />
              </div>

              {liveStatus !== 'live' ? (
                <button
                  type="button"
                  onClick={startLiveSession}
                  disabled={liveStatus === 'connecting'}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
                >
                  {liveStatus === 'connecting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  <span>{lang === 'fa' ? 'شروع مکالمه صوتی دوطرفه زنده' : 'Start Live Two-Way Voice'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopLiveSession}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer"
                >
                  <MicOff className="w-4 h-4" />
                  <span>{lang === 'fa' ? 'پایان جلسه صوتی زنده' : 'End Live Voice Session'}</span>
                </button>
              )}
            </div>

            {liveError && (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{liveError}</span>
              </div>
            )}
          </div>

          {/* Right: Live Transcript & Turn-Based Oral Exam Fallback */}
          <div className="lg:col-span-7 glass-surface rounded-3xl p-6 flex flex-col justify-between min-h-[450px] space-y-4">
            <div className="space-y-3 max-h-[340px] overflow-y-auto pe-1">
              {transcriptLog.map((entry) => (
                <div
                  key={entry.id}
                  className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    entry.role === 'coach'
                      ? 'bg-sky-50/80 dark:bg-sky-950/35 border border-sky-200/70 dark:border-sky-800/60 text-slate-800 dark:text-slate-100'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white ms-6'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                      {entry.role === 'coach'
                        ? lang === 'fa' ? 'مربی دانشیار' : 'DaneshYar Coach'
                        : lang === 'fa' ? 'شما (دانشجو)' : 'You (Student)'}
                    </span>
                    {entry.audioUrl && (
                      <button
                        type="button"
                        onClick={() => new Audio(entry.audioUrl).play().catch(() => {})}
                        className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'پخش صدا' : 'Replay Audio'}</span>
                      </button>
                    )}
                  </div>
                  <p>{entry.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleTurnSubmit} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={turnInput}
                onChange={(e) => setTurnInput(e.target.value)}
                placeholder={
                  lang === 'fa'
                    ? 'پاسخ خود را بنویسید (مربی با متن و صدای فارسی/انگلیسی پاسخ می‌دهد)...'
                    : 'Type your oral exam answer for spoken + text AI coaching...'
                }
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={turnLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold cursor-pointer"
              >
                {turnLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{lang === 'fa' ? 'ارسال پاسخ' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
