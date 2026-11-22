import React from 'react';
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
  Landmark,
  Box,
  Target,
  Cpu,
  Bot,
  Zap,
  Code2,
} from 'lucide-react';
import { Lang, NavSection } from '../types/app';
import { ENGINEERING_COURSES, ENGINEERING_FIELDS } from '../data/coursesData';
import { LatexBlock } from './MathRenderer';
import { StoryCirclesBar } from './StoryCirclesBar';
import type { LabTab } from './AiEngineeringLab';

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
      id: 'mercury',
      icon: Cpu,
      titleFa: '⚡ دانشیار مرکیوری: عامل خودگردان و مغز دوم',
      titleEn: '⚡ Mercury Agent: Soul-Driven AI & Second Brain',
      descFa: 'عامل هوشمند با شخصیت قابل ویرایش (SOUL.md)، حافظه مغز دوم، ناوگان ربات‌های تخصصی (ارشمیدس، تورینگ، اویلر، هیپاتیا) و نظارت بر امنیت.',
      descEn: 'Persistent second-brain memory, editable soul, autonomous specialist bot fleet, and permission-gated execution.',
      action: () => onNavigate('mercury'),
    },
    {
      id: 'mausbot',
      icon: Bot,
      titleFa: '🐭 فلیت ربات‌های اوپن‌ماوس‌بات (OpenMausBot)',
      titleEn: '🐭 OpenMausBot Autonomous Fleet & Sandboxed VMs',
      descFa: 'تیم بات‌های هوش مصنوعی با کامپیوتر ایزوله اختصاصی (VM)، کارت‌های تایید مجوز (Approval Cards)، اتاق‌های چندرباته و پشتیبانی از مدل‌های Claude، Gemini، Grok و DeepSeek.',
      descEn: 'Your AI team in a chat app. Every bot gets an isolated computer sandbox, interactive approval cards for dangerous actions, and multi-bot collaborative rooms.',
      action: () => onNavigate('mausbot'),
    },
    {
      id: 'claudable',
      icon: Code2,
      titleFa: '✨ وب‌ساز هوشمند کلودبل (Claudable Studio)',
      titleEn: '✨ Claudable Studio: Lovable for CLI Agents',
      descFa: 'ساخت و دیپلوی آنی وب‌اپلیکیشن‌ها و شبیه‌سازهای مهندسی با ایجنت‌های محلی Claude Code، Cursor و Codex همراه با پیش‌نمایش زنده و هات‌لود.',
      descEn: 'Build and deploy full-stack engineering tools effortlessly with local CLI coding agents, live hot-reload sandbox, and Vercel edge deployment.',
      action: () => onNavigate('claudable'),
    },
    {
      id: 'strata',
      icon: Zap,
      titleFa: '⚡ هسته استنتاج محلی Strata: اجرای MoE بدون اینترنت',
      titleEn: '⚡ Strata Local Engine: Frontier MoE on Consumer Hardware',
      descFa: 'اجرای مدل‌های فرانتیر (Qwen3.8 Flash و DeepSeek V4) روی کارت‌های گرافیک معمولی با لایه‌بندی حافظه VRAM/RAM/NVMe، بدون تحریم، آفلاین و ۱۰۰٪ خصوصی.',
      descEn: 'Run 110B+ MoE models on consumer gaming GPUs using layered VRAM/RAM/NVMe offloading with OpenAI/Anthropic compatible local APIs.',
      action: () => onNavigate('strata'),
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
      titleFa: 'پایگاه مقالات و کتب مرجع',
      titleEn: 'Academic Research & Textbook Hub',
      descFa: 'دسترسی آزاد به مراجع علمی دانشگاهی، مقالات پژوهشی و تکست‌بوک‌ها از طریق پایگاه‌های معتبر CORE، DOAJ، arXiv و Unpaywall.',
      descEn: 'Open access to academic textbooks, reference materials, and research papers via CORE, DOAJ, arXiv, and Unpaywall.',
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


  // Strip decorative leading emoji from titles (icons already carry that role)
  const cleanTitle = (t: string) => t.replace(/^[^\p{L}\p{N}]+/u, '');

  const groups: Array<{ id: string; titleFa: string; titleEn: string; ids: string[] }> = [
    {
      id: 'learn',
      titleFa: 'یادگیری و مرور',
      titleEn: 'Learn & review',
      ids: ['exam-sprint', 'solver', 'leitner', 'voice', 'pdf', 'mindmap', 'models3d'],
    },
    {
      id: 'together',
      titleFa: 'کار گروهی و منابع',
      titleEn: 'Together & sources',
      ids: ['rooms', 'campus', 'papers'],
    },
    {
      id: 'agents',
      titleFa: 'عامل‌ها و ابزارهای پیشرفته',
      titleEn: 'Agents & advanced tools',
      ids: ['mercury', 'mausbot', 'claudable', 'strata'],
    },
  ];

  const sheetRows: Array<{ labelFa: string; labelEn: string; math: string; final?: boolean }> = [
    {
      labelFa: 'معادله',
      labelEn: 'Equation',
      math: 'L\\,\\ddot{i}+R\\,\\dot{i}+\\tfrac{1}{C}\\,i=0',
    },
    {
      labelFa: 'لاپلاس',
      labelEn: 'Laplace',
      math: '\\left(Ls^{2}+Rs+\\tfrac{1}{C}\\right)I(s)=0',
    },
    {
      labelFa: 'تعریف',
      labelEn: 'Define',
      math: '\\alpha=\\tfrac{R}{2L},\\;\\omega_0=\\tfrac{1}{\\sqrt{LC}}',
    },
    {
      labelFa: 'ریشه‌ها',
      labelEn: 'Roots',
      math: 's=-\\alpha\\pm\\sqrt{\\alpha^{2}-\\omega_0^{2}}',
    },
    {
      labelFa: 'میرایی بحرانی',
      labelEn: 'Critical',
      math: '\\alpha=\\omega_0\\;\\Rightarrow\\;R=2\\sqrt{L/C}',
      final: true,
    },
  ];

  const primaryBtn =
    'inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-amber-300 dark:text-slate-950 text-sm font-bold shadow-[0_3px_0_0_var(--color-sky-600)] dark:shadow-[0_3px_0_0_var(--color-sky-400)] hover:-translate-y-px active:translate-y-[2px] active:shadow-none transition-transform cursor-pointer';
  const secondaryBtn =
    'inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-900/60 hover:border-sky-600 dark:hover:border-sky-400 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer';

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero: statement on the left, a worked solution on the right */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-2 sm:pt-6">
          <div className="lg:col-span-7 space-y-7">
            <h1 className="text-[1.9rem] sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.45] sm:leading-[1.4] [text-wrap:balance]">
              {lang === 'fa'
                ? 'تسلط عمیق بر همه علوم دانشگاهی؛ از مهندسی هسته‌ای تا علوم سیاسی'
                : 'Master University Disciplines from Nuclear Engineering to Political Science'}
            </h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-[1.95] max-w-[62ch]">
              {lang === 'fa'
                ? `دانشیار ${ENGINEERING_COURSES.length} درس سرفصل رسمی در ${ENGINEERING_FIELDS.length} رشته دانشگاهی (مهندسی هسته‌ای، برق، کامپیوتر، پزشکی، حقوق، اقتصاد، روان‌شناسی تا علوم سیاسی و روابط بین‌الملل) را همراه با نقشه سه‌بعدی پیش‌نیازها، مدل‌های سه‌بعدی تعاملی و دستیار فاینمن یکجا گرد آورده است.`
                : `DaneshYar unifies ${ENGINEERING_COURSES.length} official curriculum courses across ${ENGINEERING_FIELDS.length} disciplines (from Nuclear Engineering, Medicine, Law, and Economics to Political Science & IR) with 3D prerequisite graphs, interactive 3D labs, and Feynman AI.`}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button type="button" onClick={() => onNavigate('exam-sprint')} className={primaryBtn}>
                <Target className="w-4 h-4" aria-hidden="true" />
                <span>{lang === 'fa' ? 'برای امتحان بعدی‌ات برنامه بساز' : 'Build Your Exam Prep Plan'}</span>
              </button>
              <button type="button" onClick={() => onOpenLabTab('solver')} className={secondaryBtn}>
                <Calculator className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                <span>{lang === 'fa' ? 'حل فرمول و معادله' : 'Formula Solver'}</span>
              </button>
              <button type="button" onClick={() => onOpenLabTab('feynman')} className={secondaryBtn}>
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                <span>{lang === 'fa' ? 'دستیار فاینمن' : 'Feynman AI'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300 underline decoration-sky-300 dark:decoration-sky-700 underline-offset-[6px] hover:decoration-current cursor-pointer"
            >
              <Network className="w-4 h-4" aria-hidden="true" />
              <span>{lang === 'fa' ? 'نقشه سه‌بعدی و کاتالوگ دروس' : '3D Mind Map & Courses'}</span>
              <DirArrow className="w-4 h-4 transition-transform rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          </div>

          {/* The memorable element: one solved problem, drawn like a page of an engineer's notebook */}
          <figure className="lg:col-span-5 m-0">
            <div className="solution-sheet rounded-2xl overflow-hidden">
              <div className="relative z-[1] flex items-center justify-between gap-3 px-5 h-9 border-b border-slate-300/70 dark:border-slate-600/50 bg-slate-100/80 dark:bg-slate-900/60">
                <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  {lang === 'fa' ? 'مدار RLC سری' : 'Series RLC circuit'}
                </span>
                <span className="hidden sm:inline text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {lang === 'fa' ? 'چه زمانی نوسان نمی‌کند؟' : 'When does it stop ringing?'}
                </span>
              </div>
              <div>
                {sheetRows.map((row, i) => (
                  <div
                    key={row.labelEn}
                    className="sheet-row grid items-center"
                    style={{ ['--i' as string]: i, gridTemplateColumns: 'var(--margin) 1fr' } as React.CSSProperties}
                  >
                    <div className="px-3 text-[11px] leading-tight font-semibold text-slate-600 dark:text-slate-400 text-center">
                      {lang === 'fa' ? row.labelFa : row.labelEn}
                    </div>
                    <div className="ps-4 sm:ps-5 pe-3 py-3 text-[0.95rem] sm:text-lg text-slate-900 dark:text-slate-100 overflow-x-auto">
                      {row.final ? (
                        <span className="marker-hl inline-block">
                          <LatexBlock math={row.math} displayMode={false} className="my-0" />
                        </span>
                      ) : (
                        <LatexBlock math={row.math} displayMode={false} className="my-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span>
                {lang === 'fa'
                  ? 'نمونه‌ای از خروجی حل‌کننده؛ هر گام قابل بررسی و پرسیدن است.'
                  : 'Sample solver output — every step can be checked and questioned.'}
              </span>
              <button
                type="button"
                onClick={() => onOpenLabTab('solver')}
                className="shrink-0 font-semibold text-sky-700 dark:text-sky-300 hover:underline cursor-pointer"
              >
                {lang === 'fa' ? 'مسئله‌ی خودت را بده' : 'Try your own'}
              </button>
            </figcaption>
          </figure>
        </div>

        {/* Facts, set like a table: heavy rule on top, hairlines between */}
        <dl className="mt-12 pt-6 border-t-2 border-slate-900 dark:border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-y-6">
          {stats.map((st, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-1 pe-4 lg:ps-6 lg:border-s border-slate-300 dark:border-slate-700 lg:first:border-s-0 lg:first:ps-0"
            >
              <dt className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 order-2">{st.label}</dt>
              <dd className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums font-mono order-1">
                <span dir="ltr" className="inline-block">{st.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Instagram-Style DaneshReels Story Circles */}
      <StoryCirclesBar
        lang={lang}
        onOpenReel={(_, idx) => onOpenReelStory(idx)}
        viewedIds={viewedReelIds}
      />

      {/* Tool index: a table of contents rather than a wall of identical cards */}
      <section className="space-y-8" aria-labelledby="tools-heading">
        <div className="max-w-2xl">
          <h2 id="tools-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {lang === 'fa' ? 'ابزارهای هوشمند و تخصصی یادگیری مهندسی' : 'Advanced Engineering Study Suite'}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2 leading-[1.9]">
            {lang === 'fa'
              ? 'هر ابزار مستقیماً به دروس دانشگاهی، فرمول‌ها و چرخه مرور شما متصل است.'
              : 'Each tool connects directly to your university curriculum, LaTeX derivations, and active recall deck.'}
          </p>
        </div>

        {groups.map((group) => {
          const items = group.ids
            .map((id) => capabilities.find((c) => c.id === id))
            .filter((c): c is (typeof capabilities)[number] => Boolean(c));
          return (
            <div key={group.id} className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b-2 border-slate-900 dark:border-slate-300">
                {lang === 'fa' ? group.titleFa : group.titleEn}
              </h3>
              <ul className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
                {items.map((cap) => {
                  const Icon = cap.icon;
                  return (
                    <li key={cap.id} className="border-b border-slate-300/80 dark:border-slate-700/70">
                      <button
                        type="button"
                        onClick={cap.action}
                        className="index-row group w-full text-start flex items-start gap-4 py-4 px-2 rounded-lg cursor-pointer"
                      >
                        <span className="mt-0.5 w-9 h-9 shrink-0 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                          <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 space-y-1">
                          <span className="block text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                            {cleanTitle(lang === 'fa' ? cap.titleFa : cap.titleEn)}
                          </span>
                          <span className="block text-sm text-slate-700 dark:text-slate-300 leading-[1.85] line-clamp-3">
                            {lang === 'fa' ? cap.descFa : cap.descEn}
                          </span>
                        </span>
                        <DirArrow
                          className="w-4 h-4 mt-2 shrink-0 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
};
