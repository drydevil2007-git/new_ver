import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  FileUp,
  Layers,
  Mic,
  Network,
  Users,
  Sparkles,
  Clapperboard,
  Landmark,
  Box,
  Target,
} from 'lucide-react';
import { Lang, NavSection } from '../types/app';
import { ENGINEERING_COURSES, ENGINEERING_FIELDS } from '../data/coursesData';
import { LatexBlock } from './MathRenderer';
import { StoryCirclesBar } from './StoryCirclesBar';
import { LabTab } from './AiEngineeringLab';

interface OverviewHeroProps {
  lang: Lang;
  onNavigate: (section: NavSection) => void;
  onOpenLabTab: (tab: LabTab) => void;
  onOpenDeckTab: (tab: 'flashcards' | 'quiz' | 'voice') => void;
  onOpenReelStory: (reelIndex: number) => void;
  viewedReelIds?: string[];
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({
  lang,
  onNavigate,
  onOpenLabTab,
  onOpenDeckTab,
  onOpenReelStory,
  viewedReelIds = [],
}) => {
  const [imgError, setImgError] = useState(false);
  const DirArrow = lang === 'fa' ? ArrowLeft : ArrowRight;

  const capabilities = [
    {
      id: 'exam-sprint',
      icon: Target,
      titleFa: '🎯 آمادگی هوشمند امتحان از روی جزوه‌های خودتان',
      titleEn: '🎯 Smart Exam Prep From Your Own Notes',
      descFa: 'آزمون تشخیصی کوتاه، تقویم روزانه تا روز امتحان، سوال و فلش‌کارت با ارجاع دقیق به صفحه جزوه و حل گام‌به‌گام با سرنخ.',
      descEn: 'Diagnostic test, day-by-day roadmap, flashcards citing note pages, and guided problem solving with socratic hints.',
      action: () => onNavigate('exam-sprint'),
    },
    {
      id: 'solver',
      icon: Calculator,
      titleFa: 'حل گام‌به‌گام فرمول‌ها با LaTeX',
      titleEn: 'AI Math & Circuit Formula Solver',
      descFa: 'تحلیل انتگرال، معادلات دیفرانسیل، مدارهای KVL/KCL و اثبات‌های فیزیک با خروجی ریاضی استاندارد.',
      descEn: 'Step-by-step calculus, circuit analysis, and physics derivations rendered cleanly with KaTeX.',
      action: () => onOpenLabTab('solver'),
    },
    {
      id: 'mindmap',
      icon: Network,
      titleFa: 'نقشه سه‌بعدی پیش‌نیاز دروس',
      titleEn: 'Interactive 3D Course Mind Map',
      descFa: 'کاوش سه‌بعدی زنجیره پیش‌نیازها و هم‌نیازهای رشته‌های برق، کامپیوتر و مکانیک.',
      descEn: 'Explore 3D prerequisite graphs linking foundational math, core engineering, and electives.',
      action: () => onNavigate('courses'),
    },
    {
      id: 'leitner',
      icon: Layers,
      titleFa: 'فلش‌کارت هوشمند جعبه لایتنر',
      titleEn: 'Spaced Repetition Leitner Box',
      descFa: 'تکرار فاصله‌دار ۵ مرحله‌ای با ساخت خودکار کارت از روی جزوات و پایش تسلط.',
      descEn: '5-box spaced repetition with automatic AI card generation and persistent mastery tracking.',
      action: () => onOpenDeckTab('flashcards'),
    },
    {
      id: 'voice',
      icon: Mic,
      titleFa: 'مربی صوتی زنده آزمون شفاهی',
      titleEn: 'Voice AI Study Coach',
      descFa: 'گفتگوی صوتی دوطرفه بلادرنگ برای آمادگی آزمون شفاهی، دفاع و تمرین مفاهیم عمیق.',
      descEn: 'Two-way spoken coaching for oral exam prep, Socratic drilling, and thesis defense.',
      action: () => onOpenDeckTab('voice'),
    },
    {
      id: 'pdf',
      icon: FileUp,
      titleFa: 'استخراج هوشمند اسلاید و جزوه PDF',
      titleEn: 'Smart PDF Slide & Note Extractor',
      descFa: 'بارگذاری اسلایدهای استاد برای دریافت فوری خلاصه، فرمول‌ها، فلش‌کارت و سوالات امتحانی.',
      descEn: 'Drop lecture PDFs or photos to extract summaries, LaTeX formulas, flashcards, and exam questions.',
      action: () => onOpenLabTab('pdf'),
    },
    {
      id: 'rooms',
      icon: Users,
      titleFa: 'اتاق‌های مطالعه اشتراکی زنده',
      titleEn: 'Collaborative Virtual Study Rooms',
      descFa: 'تایمر پومودورو همگام‌سازی‌شده، اهداف روزانه تیمی و تخته فرمول‌نویسی مشترک.',
      descEn: 'Server-synced Pomodoro timers, shared daily goals, and real-time collaborative scratchpads.',
      action: () => onNavigate('study-rooms'),
    },
    {
      id: 'campus',
      icon: Landmark,
      titleFa: 'تریبون هم‌دانشگاهی و نظرسنجی زنده',
      titleEn: 'Campus & Society Student Voice',
      descFa: 'تالار گفتگو درباره آینده مهندسی، مهاجرت، صنعت و نظرسنجی‌های زنده با تحلیل متوازن هوش مصنوعی.',
      descEn: 'Open student forum on career hurdles, engineering ethics, live polls, and balanced AI perspectives.',
      action: () => onNavigate('campus'),
    },
    {
      id: 'models3d',
      icon: Box,
      titleFa: 'مدل‌های سه‌بعدی و غول مرحله آخر',
      titleEn: '3D Models & Hardest Exam Solver',
      descFa: 'تجسم سه‌بعدی سیم‌پیچ، پیستون، شبکه عصبی و بلور همراه با اثبات و حل گام‌به‌گام سخت‌ترین سوالات امتحانی.',
      descEn: 'Interactive 3D electromagnetic, mechanical, neural, and crystal models paired with 4-step toughest exam solvers.',
      action: () => onNavigate('courses'),
    },
    {
      id: 'papers',
      icon: BookOpen,
      titleFa: 'مقالات و کتب مرجع رایگان',
      titleEn: 'Open Access Research & Textbook Hub',
      descFa: 'دسترسی رایگان و قانونی به بیش از ۲۵۰ میلیون مقاله علمی و تکست‌بوک با CORE، DOAJ، Unpaywall و LibGen.',
      descEn: 'Free and legal access to 250M+ peer-reviewed papers and textbooks via CORE, DOAJ, Unpaywall, and LibGen.',
      action: () => onNavigate('articles'),
    },
  ];

  const stats = [
    {
      value: `${ENGINEERING_COURSES.length}+`,
      label: lang === 'fa' ? 'درس از هسته‌ای تا علوم سیاسی' : 'Courses: Nuclear to Political Sci.',
    },
    {
      value: `${ENGINEERING_FIELDS.length}`,
      label: lang === 'fa' ? 'رشته دانشگاهی در ۱۰ دانشکده' : 'University Fields · 10 Faculties',
    },
    {
      value: lang === 'fa' ? '۶ مدل سه‌بعدی' : '6 3D Labs',
      label: lang === 'fa' ? 'راکتور، ژئوپلیتیک، شبکه عصبی و...' : 'Reactor, Globe, Neural Net & more',
    },
    {
      value: 'LaTeX',
      label: lang === 'fa' ? 'رندر دقیق معادلات و چارچوب‌ها' : 'Precision Mathematical Typesetting',
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Main Hero Split */}
      <section className="relative glass-surface rounded-3xl p-6 sm:p-10 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -end-24 w-72 h-72 rounded-full bg-sky-400/15 dark:bg-sky-500/15 blur-3xl ambient-orb"
        />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-medium text-sky-700 dark:text-sky-400">
                {lang === 'fa'
                  ? 'نسل جدید پلتفرم جامع آموزش دانشگاهی · danshyar.ir'
                  : 'Next-Generation All-Discipline University Platform · danshyar.ir'}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.22] [text-wrap:balance]">
                {lang === 'fa'
                  ? 'تسلط عمیق بر همه علوم دانشگاهی؛ از مهندسی هسته‌ای تا علوم سیاسی'
                  : 'Master University Disciplines from Nuclear Engineering to Political Science'}
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {lang === 'fa'
                  ? `دانشیار ${ENGINEERING_COURSES.length} درس سرفصل رسمی در ${ENGINEERING_FIELDS.length} رشته دانشگاهی (مهندسی هسته‌ای، برق، کامپیوتر، پزشکی، حقوق، اقتصاد، روان‌شناسی تا علوم سیاسی و روابط بین‌الملل) را همراه با نقشه سه‌بعدی پیش‌نیازها، مدل‌های سه‌بعدی تعاملی و دستیار فاینمن یکجا گرد آورده است.`
                  : `DaneshYar unifies ${ENGINEERING_COURSES.length} official curriculum courses across ${ENGINEERING_FIELDS.length} disciplines (from Nuclear Engineering, Medicine, Law, and Economics to Political Science & IR) with 3D prerequisite graphs, interactive 3D labs, and Feynman AI.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('exam-sprint')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-800 text-white text-sm font-bold transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                <Target className="w-4 h-4 text-amber-300" />
                <span>{lang === 'fa' ? 'برای امتحان بعدی‌ات برنامه بساز' : 'Build Your Exam Prep Plan'}</span>
                <DirArrow className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenLabTab('solver')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{lang === 'fa' ? 'حل فرمول و معادله' : 'Formula Solver'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer"
              >
                <Network className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{lang === 'fa' ? 'نقشه سه‌بعدی و کاتالوگ دروس' : '3D Mind Map & Courses'}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenReelStory(0)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/70 text-sm font-medium transition-colors cursor-pointer"
              >
                <Clapperboard className="w-4 h-4 text-amber-500" />
                <span>{lang === 'fa' ? 'دانشریلز (۳۰ث)' : 'DaneshReels (30s)'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('campus')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/70 text-sm font-medium transition-colors cursor-pointer"
              >
                <Landmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{lang === 'fa' ? 'هم‌دانشگاهی' : 'Campus Voice'}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenLabTab('feynman')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/70 text-sm font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{lang === 'fa' ? 'دستیار فاینمن' : 'Feynman AI'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[340px] rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-700/60 bg-slate-900">
            {!imgError ? (
              <img
                src="/src/assets/images/hero_engineering_lab_1795017177911.jpg"
                alt={lang === 'fa' ? 'آزمایشگاه مهندسی دانشگاهی دانشیار' : 'DaneshYar Engineering Research Studio'}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-sky-950 flex items-center justify-center p-6">
                <BookOpen className="w-16 h-16 text-sky-400/70" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent flex flex-col justify-end p-5 text-white">
              <p className="text-xs text-sky-300 font-medium mb-1">
                {lang === 'fa' ? 'نمونه استخراج و تحلیل زنده معادلات' : 'Live Engineering Equation Preview'}
              </p>
              <div className="bg-slate-950/65 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 text-white">
                <LatexBlock
                  math="\\mathcal{L}\\left\\{L\\frac{d^2i}{dt^2}+R\\frac{di}{dt}+\\frac{1}{C}i\\right\\} = \\left(Ls^2+Rs+\\frac{1}{C}\\right)I(s)"
                  displayMode={true}
                  className="text-xs sm:text-sm my-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4-column quantitative proof strip */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums font-mono">
                {st.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram-Style DaneshReels Story Circles */}
      <StoryCirclesBar
        lang={lang}
        onOpenReel={(_, idx) => onOpenReelStory(idx)}
        viewedIds={viewedReelIds}
      />

      {/* 6 Advanced Capabilities Deck */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'ابزارهای هوشمند و تخصصی یادگیری مهندسی' : 'Advanced Engineering Study Suite'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'fa'
                ? 'هر ابزار مستقیماً به دروس دانشگاهی، فرمول‌ها و چرخه مرور شما متصل است.'
                : 'Each tool connects directly to your university curriculum, LaTeX derivations, and active recall deck.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <button
                key={cap.id}
                type="button"
                onClick={cap.action}
                className="group text-start glass-surface rounded-2xl p-6 hover:border-sky-500/50 dark:hover:border-sky-400/50 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200/70 dark:border-sky-800/70 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {lang === 'fa' ? cap.titleFa : cap.titleEn}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lang === 'fa' ? cap.descFa : cap.descEn}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <span>{lang === 'fa' ? 'ورود به محیط ابزار' : 'Open Workspace'}</span>
                  <DirArrow className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
