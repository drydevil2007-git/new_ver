import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Calendar,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Clock,
  TrendingUp,
  Award,
  UploadCloud,
  RefreshCw,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  HelpCircle,
  Brain,
  ListTodo,
} from 'lucide-react';
import { Lang, LeitnerCard, NavSection } from '../types/app';
import { LatexBlock, LatexInline } from './MathRenderer';

interface ExamSprintHubProps {
  lang: Lang;
  onNavigate: (section: NavSection) => void;
  onImportFlashcards: (cards: Omit<LeitnerCard, 'id' | 'box' | 'lastReviewedAt' | 'reviewCount'>[]) => void;
  initialCourseCode?: string;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  formulaLatex?: string;
  options: string[];
  correctIndex: number;
  sourceCitation: string;
  confidenceLevel: 'high_certainty' | 'extrapolated_standard';
  confidenceNote: string;
  feynmanExplanation: string;
  weaknessTopic: string;
}

export interface DailyScheduleDay {
  dayNumber: number;
  dayLabel: string;
  focusTopic: string;
  estimatedMinutes: number;
  highYieldTip: string;
  tasks: Array<{ id: string; text: string; done: boolean; sourceRef?: string }>;
}

export interface ExamSprintFlashcard {
  id: string;
  front: string;
  back: string;
  formulaLatex?: string;
  sourceCitation: string;
  confidenceLevel: 'high_certainty' | 'extrapolated_standard';
  confidenceNote: string;
  hint: string;
}

export interface GuidedProblemStep {
  stepNumber: number;
  title: string;
  hint: string;
  explanation: string;
  latex: string;
}

export interface GuidedProblem {
  id: string;
  problemTitle: string;
  difficulty: 'midterm' | 'final' | 'boss';
  sourceCitation: string;
  confidenceLevel: 'high_certainty' | 'extrapolated_standard';
  confidenceNote: string;
  problemLatex: string;
  problemStatement: string;
  socraticHint: string;
  steps: GuidedProblemStep[];
  finalAnswerLatex: string;
  commonExamTrap: string;
}

export interface WeakSpotItem {
  id: string;
  topicName: string;
  currentMasteryPercent: number;
  remedyRecommendation: string;
  sourceCitation: string;
  freshDrill: {
    question: string;
    hint: string;
    solutionLatex: string;
    explanation: string;
  };
}

export interface ExamSprintData {
  courseTitle: string;
  examDate: string;
  daysRemaining: number;
  sourceDocName: string;
  overallReadinessScore: number;
  syllabusTopics: string[];
  diagnosticQuiz: DiagnosticQuestion[];
  dailySchedule: DailyScheduleDay[];
  flashcards: ExamSprintFlashcard[];
  guidedProblems: GuidedProblem[];
  weakSpots: WeakSpotItem[];
}

const PRESET_COURSES = [
  {
    code: 'EE-201',
    titleFa: 'مدارهای الکتریکی ۱ (گره، مش، تونن و RLC مرتبه دوم)',
    titleEn: 'Electric Circuits I (Nodal, Mesh, Thevenin & RLC)',
    days: 5,
    sampleFile: 'جزوه_جامع_مدار_دانشگاه_شریف_جلسات_۱_تا_۸.pdf',
    notesSnippet: `قضایای تونن و نورتن: هر شبکه خطی دو قطبی را می‌توان با یک منبع ولتاژ تونن سری با مقاومت معادل یا منبع جریان نورتن موازی جایگزین کرد.
مدارهای مرتبه اول: پاسخ کامل برابر است با پاسخ حالت ماندگار بعلاوه پاسخ گذرا: x(t) = x(infinity) + [x(0+) - x(infinity)] * e^(-t/tau).
مدارهای مرتبه دوم سری RLC: ضریب تضعیف آلفا برابر R / (2L) و فرکانس تشدید طبیعی امگا صفر برابر 1 / sqrt(LC) است. اگر آلفا کمتر از امگا صفر باشد سیستم زیرمیرا و نوسانی خواهد بود.`,
  },
  {
    code: 'MATH-102',
    titleFa: 'ریاضی عمومی ۲ (انتگرال‌های چندگانه، استوکس و دیورژانس)',
    titleEn: 'Calculus II (Multiple Integrals, Stokes & Divergence)',
    days: 7,
    sampleFile: 'خلاصه_ریاضی_۲_دانشگاه_تهران_انتگرال_برداری.pdf',
    notesSnippet: `انتگرال سه‌گانه در مختصات کروی: ژاکوبین تبدیل برابر r^2 * sin(phi) است. المان حجم dV = r^2 sin(phi) dr dphi dtheta.
قضیه گرین در صفحه: شار و دوران یک میدان دوبعدی را به انتگرال خطی دور مرز بسته مرتبط می‌کند.
قضیه دیورژانس گاوس: شار خروجی میدان F از سطح بسته برابر است با انتگرال سه‌گانه دیورژانس F در حجم محصور.
قضیه استوکس: شار کرل میدان F از سطح باز برابر با انتگرال خطی F روی مرز بسته آن سطح است.`,
  },
  {
    code: 'EE-341',
    titleFa: 'سیستم‌های کنترل خطی (مکان ریشه‌ها و پایداری)',
    titleEn: 'Linear Control Systems (Root Locus & Nyquist)',
    days: 4,
    sampleFile: 'جزوه_کنترل_خطی_مکان_هندسی_ریشه‌ها.pdf',
    notesSnippet: `معیار پایداری راث-هرویتز: تعداد تغییر علامت در ستون اول جدول راث برابر تعداد قطب‌های نیم‌صفحه راست است.
مکان ریشه‌ها: مکان صفرهای سیستم مداربسته با تغییر بهره K رسم می‌شود. زوایای مجانب‌ها برابر (2k+1)*180 / (n-m) است.
حاشیه فاز و حاشیه بهره: معیارهای پایداری نسبی در حوزه فرکانس هستند که از نمودارهای بود و نایکویست به دست می‌آیند.`,
  },
];

export const ExamSprintHub: React.FC<ExamSprintHubProps> = ({
  lang,
  onNavigate,
  onImportFlashcards,
  initialCourseCode,
}) => {
  // Setup inputs
  const [selectedCourse, setSelectedCourse] = useState(initialCourseCode || 'EE-201');
  const [courseCustomTitle, setCourseCustomTitle] = useState('مدارهای الکتریکی ۱');
  const [daysCount, setDaysCount] = useState(5);
  const [examDateStr, setExamDateStr] = useState('۱۴۰۴/۰۹/۱۵');
  const [sourceNotesText, setSourceNotesText] = useState(PRESET_COURSES[0].notesSnippet);
  const [uploadedFileName, setUploadedFileName] = useState(PRESET_COURSES[0].sampleFile);

  // Sprint execution state
  const [isGenerating, setIsGenerating] = useState(false);
  const [sprintData, setSprintData] = useState<ExamSprintData | null>(null);
  const [activeSprintTab, setActiveSprintTab] = useState<'diagnostic' | 'schedule' | 'flashcards' | 'problems' | 'weaknesses'>('diagnostic');

  // Interactive step trackers inside the generated sprint
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedProblemSteps, setRevealedProblemSteps] = useState<Record<string, number>>({});
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [importedFlashcardsBanner, setImportedFlashcardsBanner] = useState(false);
  const [activeDrillId, setActiveDrillId] = useState<string | null>(null);

  // Auto-fill presets on selection
  const handlePresetSelect = (code: string) => {
    setSelectedCourse(code);
    const p = PRESET_COURSES.find((c) => c.code === code);
    if (p) {
      setCourseCustomTitle(p.titleFa);
      setDaysCount(p.days);
      setSourceNotesText(p.notesSnippet);
      setUploadedFileName(p.sampleFile);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const txt = String(reader.result || '');
      setSourceNotesText(txt.slice(0, 4000) || `جزوه آپلود شده: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleGenerateSprint = async () => {
    setIsGenerating(true);
    setQuizSubmitted(false);
    setSelectedQuizAnswers({});
    setRevealedHints({});
    setRevealedProblemSteps({});
    setImportedFlashcardsBanner(false);

    try {
      const resp = await fetch('/api/ai/exam-sprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: courseCustomTitle,
          examDate: examDateStr,
          daysRemaining: daysCount,
          notesText: sourceNotesText,
          sourceFileName: uploadedFileName,
          lang,
        }),
      });
      const data: ExamSprintData = await resp.json();
      setSprintData(data);
      setActiveSprintTab('diagnostic');
    } catch {
      // Fallback generator handled by apiBridge
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-launch on first load for demo course
  useEffect(() => {
    handleGenerateSprint();
  }, []);

  const handleSelectQuizOption = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleToggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const calculateReadinessScore = () => {
    if (!sprintData) return 40;
    if (!quizSubmitted) return sprintData.overallReadinessScore || 45;
    let correct = 0;
    sprintData.diagnosticQuiz.forEach((q) => {
      if (selectedQuizAnswers[q.id] === q.correctIndex) correct++;
    });
    const quizPct = Math.round((correct / sprintData.diagnosticQuiz.length) * 40);
    const taskCount = Object.values(checkedTasks).filter(Boolean).length;
    const taskBonus = Math.min(taskCount * 5, 20);
    return Math.min(quizPct + 35 + taskBonus, 100);
  };

  const currentReadiness = calculateReadinessScore();

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Hero Banner with Clear Purpose */}
      <section className="relative rounded-3xl p-6 sm:p-10 overflow-hidden glass-surface border border-sky-200/80 dark:border-sky-900/50 bg-gradient-to-br from-white via-sky-50/40 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/95 dark:to-indigo-950/20 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-bold">
              <Target className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{lang === 'fa' ? 'هدف نهایی دانشیار: قبولی درخشان در امتحانات' : 'The Core DaneshYar Goal: Exam Mastery'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {lang === 'fa' ? 'آمادگی هوشمند امتحان از روی جزوه‌های خود شما' : 'Smart Exam Prep From Your Own Lecture Notes'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'fa'
                ? 'به جای سردرگمی بین ابزارهای مختلف، جزوه یا سرفصل‌های امتحانت را بده تا دانشیار یک مسیر هدفمند بسازد: آزمون تشخیصی کوتاه، تقویم روزانه، حل مسائل با سرنخ و ارجاع دقیق به صفحه جزوه.'
                : 'Instead of bouncing between disconnected tools, provide your lecture slides: DaneshYar diagnoses weak spots, builds a day-by-day roadmap, and solves exam problems with precise page citations.'}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm min-w-[200px] shrink-0">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {lang === 'fa' ? 'شاخص آمادگی تا شب امتحان' : 'Exam Readiness Gauge'}
            </div>
            <div className="text-3xl font-black text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <span>{currentReadiness}%</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="w-36 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${currentReadiness}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              {currentReadiness > 75
                ? (lang === 'fa' ? 'آمادگی عالی برای نمره بالای ۱۸' : 'High Honors Target')
                : (lang === 'fa' ? 'در حال تقویت و پوشش نقاط ضعف' : 'Closing Foundational Gaps')}
            </span>
          </div>
        </div>
      </section>

      {/* Control Setup Card: Course Selection & Upload */}
      <section className="glass-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>{lang === 'fa' ? 'گام ۱: مشخصات امتحان و منبع مطالعه' : 'Step 1: Exam Target & Study Source'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'fa'
                ? 'می‌توانید از جزوه‌های آماده دانشگاهی انتخاب کنید یا فایل جزوه شخصی خود را آپلود نمایید.'
                : 'Choose a verified university textbook snippet or upload your own class notes.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">{lang === 'fa' ? 'انتخاب سریع درس:' : 'Quick Presets:'}</span>
            {PRESET_COURSES.map((preset) => (
              <button
                key={preset.code}
                type="button"
                onClick={() => handlePresetSelect(preset.code)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCourse === preset.code
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.code}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {lang === 'fa' ? 'نام درس دانشگاهی:' : 'Course Name:'}
            </label>
            <input
              type="text"
              value={courseCustomTitle}
              onChange={(e) => setCourseCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {lang === 'fa' ? 'چند روز تا امتحان فرصت دارید؟' : 'Days Until Exam:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={30}
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value) || 3)}
                className="w-24 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 text-center"
              />
              <span className="text-xs text-slate-500 font-medium">{lang === 'fa' ? 'روز (برنامه‌ریزی دقیق)' : 'days'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {lang === 'fa' ? 'آپلود جزوه یا اسلاید امتحانی:' : 'Upload Lecture PDF/Notes:'}
            </label>
            <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-sky-400 dark:border-sky-600 bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-100/50 text-xs font-semibold text-sky-800 dark:text-sky-300 cursor-pointer transition-colors">
              <UploadCloud className="w-4 h-4 text-sky-600" />
              <span className="truncate max-w-[200px]">{uploadedFileName || (lang === 'fa' ? 'انتخاب فایل جزوه...' : 'Choose File...')}</span>
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.txt,.md,.png,.jpg" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {lang === 'fa' ? 'متن خلاصه سرفصل‌ها یا چکیده جزوه بارگذاری‌شده:' : 'Lecture Notes Snippet & Syllabus:'}
          </label>
          <textarea
            rows={3}
            value={sourceNotesText}
            onChange={(e) => setSourceNotesText(e.target.value)}
            placeholder={lang === 'fa' ? 'نکات مهم، سرفصل‌ها یا متون اسلایدهای کلاسی...' : 'Key syllabus, lecture takeaways...'}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'fa' ? 'پاسخ‌ها به صفحه جزوه ارجاع داده شده و موارد غیرقطعی صریحاً علامت‌گذاری می‌شوند.' : 'Every question cites note pages with strict certainty tagging.'}</span>
          </div>

          <button
            type="button"
            onClick={handleGenerateSprint}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{lang === 'fa' ? 'در حال تحلیل جزوه و چیدن برنامه...' : 'Analyzing & Building Sprint...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'fa' ? 'ساخت برنامه هوشمند آمادگی امتحان' : 'Build Custom Exam Sprint'}</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Main Sprint Dashboard: 5 Goal-Oriented Tabs */}
      {sprintData && (
        <section className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setActiveSprintTab('diagnostic')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSprintTab === 'diagnostic'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{lang === 'fa' ? '۱. آزمون کوتاه تشخیصی' : '1. Diagnostic Test'}</span>
              {quizSubmitted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveSprintTab('schedule')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSprintTab === 'schedule'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'fa' ? `۲. برنامه روزانه (${sprintData.dailySchedule.length} روزه)` : `2. Daily Plan (${sprintData.dailySchedule.length} Days)`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSprintTab('flashcards')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSprintTab === 'flashcards'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{lang === 'fa' ? `۳. فلش‌کارت‌ها با ارجاع جزوه (${sprintData.flashcards.length})` : `3. Flashcards (${sprintData.flashcards.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSprintTab('problems')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSprintTab === 'problems'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>{lang === 'fa' ? '۴. حل گام‌به‌گام با سرنخ' : '4. Guided Problems'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSprintTab('weaknesses')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSprintTab === 'weaknesses'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{lang === 'fa' ? `۵. رادار نقاط ضعف و تمرین تازه (${sprintData.weakSpots.length})` : `5. Weak Spot Drills (${sprintData.weakSpots.length})`}</span>
            </button>
          </div>

          {/* TAB 1: Diagnostic Baseline Test */}
          {activeSprintTab === 'diagnostic' && (
            <div className="glass-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-sky-600" />
                    <span>{lang === 'fa' ? 'آزمون کوتاه تشخیصی (سنجش خط پایه دانشجو)' : 'Quick Diagnostic Pre-Test'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'fa'
                      ? 'به ۳ سوال زیر پاسخ دهید تا نقاط ضعف شما مشخص شده و برنامه روزانه متناسب با وضعیت شما چیده شود.'
                      : 'Answer these 3 conceptual questions to map your strengths and pinpoint critical weak spots.'}
                  </p>
                </div>

                {!quizSubmitted && (
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(selectedQuizAnswers).length < sprintData.diagnosticQuiz.length}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-40"
                  >
                    {lang === 'fa' ? 'ثبت و تحلیل نتایج آزمون' : 'Submit & Analyze Readiness'}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {sprintData.diagnosticQuiz.map((q, idx) => {
                  const userChoice = selectedQuizAnswers[q.id];
                  const isCorrect = userChoice === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                          {lang === 'fa' ? `سوال تشخیصی شماره ${idx + 1}:` : `Question ${idx + 1}:`}
                        </span>

                        {/* Exact Source Citation & Confidence Tag */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[11px] font-medium text-sky-800 dark:text-sky-300">
                            <BookOpen className="w-3 h-3 text-sky-600" />
                            <span>{q.sourceCitation}</span>
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                              q.confidenceLevel === 'high_certainty'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>{q.confidenceNote}</span>
                          </span>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                        {q.question}
                      </p>

                      {q.formulaLatex && (
                        <div className="p-2 rounded-xl bg-slate-900 text-white text-xs max-w-xl">
                          <LatexBlock latex={q.formulaLatex} />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          let optStyle = 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800';
                          if (userChoice === optIdx) {
                            optStyle = 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200 font-bold';
                          }
                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold';
                            } else if (userChoice === optIdx) {
                              optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectQuizOption(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-xs text-start transition-all cursor-pointer ${optStyle}`}
                            >
                              <span className="font-bold me-2">{['الف', 'ب', 'ج', 'د'][optIdx] || optIdx + 1})</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feynman Explanation after Submission */}
                      {quizSubmitted && (
                        <div className={`p-4 rounded-xl text-xs space-y-1.5 ${isCorrect ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200' : 'bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200'}`}>
                          <div className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span>{lang === 'fa' ? 'تحلیل مفهومی فاینمن:' : 'Feynman Conceptual Breakdown:'}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {q.feynmanExplanation}
                          </p>
                          {!isCorrect && (
                            <div className="text-amber-800 dark:text-amber-300 font-semibold pt-1">
                              ⚠️ {lang === 'fa' ? `این مبحث (${q.weaknessTopic}) به عنوان نقطه ضعف در برگه شما علامت‌گذاری شد و در روزهای ۲ و ۳ تمرین تقویتی دارد.` : `Flagged as weak spot for Day 2-3 focused drills.`}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 border border-sky-300 dark:border-sky-800 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'fa' ? 'نتایج سنجش اولیه تحلیل شد! اکنون می‌توانید برنامه روزانه یا تمرین‌های نقاط ضعف را ببینید.' : 'Assessment complete! Proceed to your daily roadmap or weak-spot drills.'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSprintTab('schedule')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>{lang === 'fa' ? 'مشاهده برنامه روزانه' : 'View Daily Plan'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Adaptive Daily Schedule */}
          {activeSprintTab === 'schedule' && (
            <div className="glass-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-600" />
                    <span>{lang === 'fa' ? `برنامه زمان‌بندی هوشمند روزانه تا روز امتحان (${sprintData.daysRemaining} روز)` : `Smart Daily Study Roadmap (${sprintData.daysRemaining} Days)`}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'fa'
                      ? 'وظایف هر روز را تیک بزنید تا درصد آمادگی آزمون شما به ۱۰۰٪ نزدیک شود.'
                      : 'Check off daily milestones to push your exam readiness gauge to 100%.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {sprintData.dailySchedule.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-sky-600 text-white text-xs font-black flex items-center justify-center">
                          {day.dayNumber}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {day.dayLabel}: {day.focusTopic}
                          </h4>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lang === 'fa' ? `مدت پیشنهادی: ${day.estimatedMinutes} دقیقه` : `${day.estimatedMinutes} mins target`}
                          </span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                        💡 {day.highYieldTip}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {day.tasks.map((task) => {
                        const isDone = Boolean(checkedTasks[task.id]);
                        return (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTask(task.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                              isDone
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-slate-500 line-through'
                                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                  isDone
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-slate-400 bg-white dark:bg-slate-900'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <span className="font-medium">{task.text}</span>
                            </div>

                            {task.sourceRef && (
                              <span className="text-[10px] text-sky-700 dark:text-sky-400 font-semibold bg-sky-100/60 dark:bg-sky-950/60 px-2 py-0.5 rounded-md">
                                {task.sourceRef}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: High-Yield Flashcards with Exact Citations */}
          {activeSprintTab === 'flashcards' && (
            <div className="glass-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-sky-600" />
                    <span>{lang === 'fa' ? 'فلش‌کارت‌های استخراج‌شده از جزوه با ارجاع دقیق به صفحه' : 'High-Yield Flashcards with Precise Citations'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'fa'
                      ? 'تمام کارت‌ها به شماره صفحه و سرفصل جزوه مستند شده‌اند تا دانشجو بتواند مرجع را چک کند.'
                      : 'Every card quotes the exact lecture note slide/page number for trusted review.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onImportFlashcards(
                      sprintData.flashcards.map((c) => ({
                        front: c.front,
                        back: `${c.back}\n\n[منبع: ${c.sourceCitation}]`,
                        formulaLatex: c.formulaLatex,
                        hint: c.hint,
                        deck: sprintData.courseTitle,
                      }))
                    );
                    setImportedFlashcardsBanner(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>{lang === 'fa' ? 'انتقال همه به جعبه لایتنر دانشیار' : 'Import to Leitner Study Box'}</span>
                </button>
              </div>

              {importedFlashcardsBanner && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                  <span>✓ {lang === 'fa' ? 'فلش‌کارت‌ها با موفقیت به جعبه یادگیری لایتنر اضافه شدند!' : 'Flashcards imported into Leitner box!'}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('study-deck')}
                    className="underline text-sky-600 cursor-pointer"
                  >
                    {lang === 'fa' ? 'مشاهده در جعبه لایتنر' : 'Go to Study Box'}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sprintData.flashcards.map((card) => (
                  <div
                    key={card.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800">
                          📌 {card.sourceCitation}
                        </span>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            card.confidenceLevel === 'high_certainty'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {card.confidenceNote}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                        {card.front}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">
                        {card.back}
                      </p>

                      {card.formulaLatex && (
                        <div className="p-2 rounded-xl bg-slate-900 text-white text-xs max-w-sm mt-1">
                          <LatexBlock latex={card.formulaLatex} />
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium italic pt-2 border-t border-slate-100 dark:border-slate-800">
                      💡 {lang === 'fa' ? 'سرنخ مرور:' : 'Hint:'} {card.hint}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Guided Step-by-Step Problem Solving */}
          {activeSprintTab === 'problems' && (
            <div className="glass-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-sky-600" />
                    <span>{lang === 'fa' ? 'مسائل مهم امتحانی: حل مرحله‌به‌مرحله اول با راهنمایی و سپس پاسخ' : 'Exam Problems: Socratic Hint First, Step-by-Step Derivation'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'fa'
                      ? 'ابتدا سرنخ تفکر را بخوانید و خودتان روی کاغذ بنویسید؛ سپس گام‌های حل را یکی‌یکی باز کنید.'
                      : 'Ponder with the socratic hint first; reveal analytical steps one-by-one.'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {sprintData.guidedProblems.map((prob) => {
                  const showHint = Boolean(revealedHints[prob.id]);
                  const revealedStepCount = revealedProblemSteps[prob.id] || 0;

                  return (
                    <div
                      key={prob.id}
                      className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold">
                            {lang === 'fa' ? 'مسئله امتحانی' : 'Exam Problem'}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {prob.problemTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800">
                            📌 {prob.sourceCitation}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                        {prob.problemStatement}
                      </p>

                      {prob.problemLatex && (
                        <div className="p-3 rounded-xl bg-slate-900 text-white text-xs">
                          <LatexBlock latex={prob.problemLatex} />
                        </div>
                      )}

                      {/* Pedagogical Step: Socratic Hint Toggle */}
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setRevealedHints((prev) => ({ ...prev, [prob.id]: !prev[prob.id] }))}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold cursor-pointer transition-colors"
                        >
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <span>{showHint ? (lang === 'fa' ? 'بستن سرنخ راهنمایی' : 'Hide Hint') : (lang === 'fa' ? '💡 مشاهده سرنخ تفکر (قبل از دیدن حل)' : '💡 View Socratic Hint')}</span>
                        </button>

                        <AnimatePresence>
                          {showHint && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1"
                            >
                              <div className="font-bold flex items-center gap-1.5">
                                <span>راهنمای روش حل:</span>
                              </div>
                              <p>{prob.socraticHint}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Step-by-Step Reveal Controls */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {lang === 'fa'
                              ? `مراحل حل تشریحی (${revealedStepCount} از ${prob.steps.length} گام باز شده):`
                              : `Step-by-step Solution (${revealedStepCount}/${prob.steps.length} revealed):`}
                          </span>

                          <div className="flex items-center gap-2">
                            {revealedStepCount < prob.steps.length && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedProblemSteps((prev) => ({
                                    ...prev,
                                    [prob.id]: (prev[prob.id] || 0) + 1,
                                  }))
                                }
                                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer transition-colors"
                              >
                                {lang === 'fa' ? '+ باز کردن گام بعدی' : '+ Reveal Next Step'}
                              </button>
                            )}

                            {revealedStepCount > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedProblemSteps((prev) => ({
                                    ...prev,
                                    [prob.id]: 0,
                                  }))
                                }
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {prob.steps.slice(0, revealedStepCount).map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-4 rounded-xl border border-sky-100 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 space-y-2 text-xs"
                          >
                            <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center justify-between">
                              <span>گام {step.stepNumber}: {step.title}</span>
                              <span className="text-[10px] text-slate-500 font-normal">{step.hint}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {step.explanation}
                            </p>
                            <div className="p-2.5 rounded-xl bg-slate-900 text-white">
                              <LatexBlock latex={step.latex} />
                            </div>
                          </div>
                        ))}

                        {/* Final Boxed Answer when all steps are revealed */}
                        {revealedStepCount >= prob.steps.length && (
                          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 text-xs">
                            <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{lang === 'fa' ? 'پاسخ نهایی ساده‌شده:' : 'Final Boxed Answer:'}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-900 text-white">
                              <LatexBlock latex={prob.finalAnswerLatex} />
                            </div>
                            <div className="text-amber-800 dark:text-amber-300 font-medium pt-1">
                              ⚠️ {lang === 'fa' ? 'تله طراح سوال در امتحان:' : 'Common Exam Trap:'} {prob.commonExamTrap}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Weakness Radar & Fresh Drills */}
          {activeSprintTab === 'weaknesses' && (
            <div className="glass-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span>{lang === 'fa' ? 'نقاط ضعف تشخیصی و تمرین‌های تقویتی هدفمند' : 'Identified Weak Spots & Fresh Remedial Drills'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'fa'
                      ? 'مباحثی که در پیش‌آزمون اشتباه پاسخ دادید یا طبق جزوه تله‌خیز هستند با تمرین‌های تازه پوشش داده می‌شوند.'
                      : 'Pinpointed conceptual blindspots paired with tailored reinforcement drills.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {sprintData.weakSpots.map((ws) => {
                  const isDrillOpen = activeDrillId === ws.id;

                  return (
                    <div
                      key={ws.id}
                      className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/15 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-amber-500 text-white">
                            <AlertTriangle className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {ws.topicName}
                            </h4>
                            <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
                              {lang === 'fa' ? `سطح تسلط تخمینی فعلی: ${ws.currentMasteryPercent}%` : `Current Mastery: ${ws.currentMasteryPercent}%`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            📌 {ws.sourceCitation}
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveDrillId(isDrillOpen ? null : ws.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            <span>{isDrillOpen ? (lang === 'fa' ? 'بستن تمرین' : 'Close Drill') : (lang === 'fa' ? 'حل تمرین تقویتی' : 'Practice Drill')}</span>
                            {isDrillOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {ws.remedyRecommendation}
                      </p>

                      {/* Remedial Drill Card */}
                      <AnimatePresence>
                        {isDrillOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 space-y-3 text-xs"
                          >
                            <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-sky-600" />
                              <span>{lang === 'fa' ? 'صورت تمرین تقویتی تازه:' : 'Remedial Practice Drill:'}</span>
                            </div>

                            <p className="text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                              {ws.freshDrill.question}
                            </p>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 space-y-1">
                              <span className="font-bold text-amber-700 dark:text-amber-400">💡 سرنخ:</span>
                              <p>{ws.freshDrill.hint}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1">
                              <span className="text-[11px] text-slate-400">پاسخ تشریحی و فرمول:</span>
                              <LatexBlock latex={ws.freshDrill.solutionLatex} />
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                              {ws.freshDrill.explanation}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
