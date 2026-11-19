import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Baby,
  BookOpen,
  Briefcase,
  Video,
  Play,
  Sparkles,
  BrainCircuit,
  Layers,
  GitBranch,
  Wrench,
  Box,
  ScrollText,
  Swords,
  ChevronRight,
  Eye,
  RotateCcw,
  AlertTriangle,
  GraduationCap,
  Search,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { ENGINEERING_FIELDS } from '../data/coursesData';
import { getCourseRichDetail } from '../data/reelsAndCourseDetails';
import { CourseItem, Lang } from '../types/app';
import { LatexBlock } from './MathRenderer';
import { EngineeringConcept3DViewer } from './EngineeringConcept3DViewer';

export type CourseDetailTab =
  | 'child5'
  | 'model3d'
  | 'deep'
  | 'exam'
  | 'syllabus'
  | 'papers'
  | 'industry'
  | 'videos';

interface CourseDetailModalProps {
  lang: Lang;
  course: CourseItem;
  allCourses: CourseItem[];
  initialTab?: CourseDetailTab;
  onClose: () => void;
  onSelectCourse: (course: CourseItem) => void;
  onWatchReel: (course: CourseItem) => void;
  onAskFeynman: (topic: string) => void;
  onStartQuiz: (topic: string) => void;
  onGenerateFlashcards: (topic: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  lang,
  course,
  allCourses,
  initialTab = 'child5',
  onClose,
  onSelectCourse,
  onWatchReel,
  onAskFeynman,
  onStartQuiz,
  onGenerateFlashcards,
}) => {
  const [activeTab, setActiveTab] = useState<CourseDetailTab>(initialTab);
  const [revealedSteps, setRevealedSteps] = useState<number>(1);
  const [paperSearchQuery, setPaperSearchQuery] = useState(course.titleEn || course.titleFa);
  const [doiInput, setDoiInput] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, course.id]);

  useEffect(() => {
    setRevealedSteps(1);
    setPaperSearchQuery(course.titleEn || course.titleFa);
    setDoiInput('');
  }, [course.id]);

  const field = useMemo(
    () => ENGINEERING_FIELDS.find((f) => f.id === course.fieldId),
    [course.fieldId]
  );

  const detail = useMemo(() => getCourseRichDetail(course, allCourses), [course, allCourses]);

  const diffLabel =
    course.difficulty === 'introductory'
      ? lang === 'fa' ? 'پایه' : 'Introductory'
      : course.difficulty === 'intermediate'
      ? lang === 'fa' ? 'تخصصی' : 'Intermediate'
      : lang === 'fa' ? 'پیشرفته' : 'Advanced';

  const tabs: Array<{
    id: CourseDetailTab;
    icon: React.ComponentType<{ className?: string }>;
    fa: string;
    en: string;
  }> = [
    { id: 'child5', icon: Baby, fa: 'توضیح ۵ سالگی', en: '5yo Analogy' },
    { id: 'model3d', icon: Box, fa: 'مدل سه‌بعدی تعاملی', en: '3D Model' },
    { id: 'deep', icon: ScrollText, fa: 'اثبات، تاریخچه و فرمول‌نامه', en: 'Proofs & Cheat Sheet' },
    { id: 'exam', icon: Swords, fa: 'غول مرحله آخر (امتحان)', en: 'Hardest Exam' },
    { id: 'syllabus', icon: BookOpen, fa: 'سرفصل‌ها و نقشه راه', en: 'Syllabus & Path' },
    { id: 'papers', icon: GraduationCap, fa: 'مقالات و کتب مرجع', en: 'Papers & Books' },
    { id: 'industry', icon: Briefcase, fa: 'صنعت و بازار کار', en: 'Industry & Jobs' },
    { id: 'videos', icon: Video, fa: 'ویدیوهای منتخب', en: 'Lectures' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-5">
      <div className="glass-surface bg-white/95 dark:bg-slate-900/95 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{course.code}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'fa' ? field?.nameFa : field?.nameEn}</span>
              <span aria-hidden="true">·</span>
              <span>{diffLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {course.credits} {lang === 'fa' ? 'واحد' : 'Credits'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'fa' ? course.titleFa : course.titleEn}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={lang === 'fa' ? 'بستن' : 'Close'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Formula + Quick Watch Reel Banner */}
        <div className="rounded-2xl bg-slate-100/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {lang === 'fa' ? 'فرمول بنیادین درس' : 'Core Governing Equation'}
            </div>
            <LatexBlock math={course.keyFormula} displayMode={true} className="text-sm text-slate-900 dark:text-white my-0" />
          </div>

          <button
            type="button"
            onClick={() => onWatchReel(course)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{lang === 'fa' ? 'مشاهده ریلز ۳۰ ثانیه‌ای' : 'Watch 30s Reel'}</span>
          </button>
        </div>

        {/* 7-Section Detail Segmented Bar */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? t.fa : t.en}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: 5-Year-Old Feynman Analogy */}
        {activeTab === 'child5' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-amber-50/75 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Baby className="w-4 h-4" />
                <span>
                  {lang === 'fa'
                    ? 'اگر بخواهیم به زبان یک کودک ۵ ساله توضیح دهیم:'
                    : 'Explained to a Curious 5-Year-Old:'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed">
                {lang === 'fa' ? detail.feynmanChild5Fa : detail.feynmanChild5En}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'مباحث کلیدی که در این درس مسلط می‌شوید:' : 'Core Topics Mastered:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(lang === 'fa' ? course.topicsFa : course.topicsEn).map((tp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-3 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span className="font-mono text-sky-600 dark:text-sky-400 me-1.5">0{idx + 1}.</span>
                    {tp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Interactive 3D Visual Model */}
        {activeTab === 'model3d' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {lang === 'fa'
                ? 'با کشیدن ماوس مدل را بچرخانید، با اسکرول بزرگنمایی کنید و روی پین‌های شماره‌دار سه‌بعدی کلیک کنید تا توضیح و فرمول هر بخش را ببینید.'
                : 'Drag to orbit, scroll to zoom, and click numbered 3D hotspot pins to inspect each engineering component and equation.'}
            </p>
            <EngineeringConcept3DViewer
              lang={lang}
              initialModelType={detail.model3dType}
              heightClass="h-[340px] sm:h-[400px]"
              allowModelSwitch={true}
            />
          </div>
        )}

        {/* TAB 3: Mathematical Proof, Historical Origin & Formula Cheat Sheet */}
        {activeTab === 'deep' && (
          <div className="space-y-6">
            {/* Historical Origins */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-5 space-y-2">
              <div className="text-xs font-bold text-sky-700 dark:text-sky-400">
                {lang === 'fa' ? 'ریشه‌های تاریخی و تکامل علمی نظریه' : 'Historical Origins & Scientific Evolution'}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {lang === 'fa' ? detail.historicalOriginFa : detail.historicalOriginEn}
              </p>
            </div>

            {/* Complete Mathematical Proof */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {lang === 'fa'
                  ? detail.mathematicalProof.theoremTitleFa
                  : detail.mathematicalProof.theoremTitleEn}
              </h3>

              <div className="space-y-3">
                {detail.mathematicalProof.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-4 space-y-2.5"
                  >
                    <div className="text-xs font-bold text-sky-700 dark:text-sky-400">
                      {lang === 'fa' ? st.labelFa : st.labelEn}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {lang === 'fa' ? st.textFa : st.textEn}
                    </p>
                    <div className="rounded-xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3 py-2">
                      <LatexBlock math={st.latex} displayMode={true} className="text-xs sm:text-sm my-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extensive Formula Cheat Sheet */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'فرمول‌نامه جامع و شیت مرور شب امتحان' : 'Comprehensive Formula Cheat Sheet'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {detail.formulaCheatSheet.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/60 p-4 space-y-2"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {lang === 'fa' ? item.nameFa : item.nameEn}
                    </div>
                    <div className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2">
                      <LatexBlock math={item.latex} displayMode={true} className="text-xs my-0" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'fa' ? item.conditionFa : item.conditionEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 'غول مرحله آخر: سخت‌ترین سوال امتحانی' + 4-Step Interactive Solver */}
        {activeTab === 'exam' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-rose-300/70 dark:border-rose-700/60 bg-rose-50/65 dark:bg-rose-950/25 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-extrabold text-rose-700 dark:text-rose-300">
                  <Swords className="w-4 h-4" />
                  <span>
                    {lang === 'fa'
                      ? 'غول مرحله آخر: سخت‌ترین سوال امتحانی'
                      : 'The Hardest Exam Challenge'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  {lang === 'fa' ? detail.hardestExam.sourceFa : detail.hardestExam.sourceEn} ·{' '}
                  {lang === 'fa'
                    ? detail.hardestExam.difficultyBadgeFa
                    : detail.hardestExam.difficultyBadgeEn}
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                {lang === 'fa'
                  ? detail.hardestExam.problemStatementFa
                  : detail.hardestExam.problemStatementEn}
              </p>

              <div className="rounded-xl bg-white/90 dark:bg-slate-950/85 border border-rose-200/80 dark:border-rose-800/60 px-3.5 py-2.5">
                <LatexBlock
                  math={detail.hardestExam.problemFormulaLatex}
                  displayMode={true}
                  className="text-xs sm:text-sm text-slate-900 dark:text-white my-0"
                />
              </div>
            </div>

            {/* Interactive Step Reveal Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                {lang === 'fa'
                  ? `حل تشریحی گام‌به‌گام (${revealedSteps} از ${detail.hardestExam.steps.length} گام آشکارشده)`
                  : `Step-by-Step Interactive Solution (${revealedSteps} / ${detail.hardestExam.steps.length} steps revealed)`}
              </div>
              <div className="flex items-center gap-2">
                {revealedSteps < detail.hardestExam.steps.length && (
                  <button
                    type="button"
                    onClick={() => setRevealedSteps((s) => Math.min(detail.hardestExam.steps.length, s + 1))}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>{lang === 'fa' ? 'نمایش گام بعدی' : 'Reveal Next Step'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setRevealedSteps(
                      revealedSteps >= detail.hardestExam.steps.length
                        ? 0
                        : detail.hardestExam.steps.length
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {revealedSteps >= detail.hardestExam.steps.length ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'fa' ? 'مخفی‌کردن حل' : 'Hide Solution'}</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'fa' ? 'نمایش کل حل' : 'Reveal All'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step-by-Step Cards */}
            <div className="space-y-3">
              {detail.hardestExam.steps.slice(0, revealedSteps).map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/75 p-4 sm:p-5 space-y-3"
                >
                  <div className="text-xs sm:text-sm font-extrabold text-sky-700 dark:text-sky-400">
                    {lang === 'fa' ? step.titleFa : step.titleEn}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {lang === 'fa' ? step.explanationFa : step.explanationEn}
                  </p>
                  {step.mathLatex && (
                    <div className="rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2">
                      <LatexBlock math={step.mathLatex} displayMode={true} className="text-xs sm:text-sm my-0" />
                    </div>
                  )}
                  {(step.trapWarningFa || step.trapWarningEn) && (
                    <div className="rounded-xl bg-amber-50/90 dark:bg-amber-950/35 border border-amber-300/70 dark:border-amber-800/60 px-3.5 py-2.5 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <span>{lang === 'fa' ? step.trapWarningFa : step.trapWarningEn}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Syllabus & Prerequisites Roadmap */}
        {activeTab === 'syllabus' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'دروس پیش‌نیاز پیشنهادی' : 'Recommended Prerequisites'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detail.prerequisiteCodes.map((code) => {
                    const match = allCourses.find((c) => c.code === code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => match && onSelectCourse(match)}
                        className="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-sky-400 cursor-pointer"
                      >
                        {code} {match ? `· ${lang === 'fa' ? match.titleFa : match.titleEn}` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'دروس بعدی در نقشه راه' : 'Unlocks Next Courses'}</span>
                </div>
                {detail.unlockedCodes.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'fa' ? 'درس تخصصی سطح پیشرفته در این گرایش' : 'Capstone specialization in this track'}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {detail.unlockedCodes.map((code) => {
                      const match = allCourses.find((c) => c.code === code);
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => match && onSelectCourse(match)}
                          className="px-2.5 py-1 rounded-lg border border-sky-300 dark:border-sky-700/60 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-sky-500 cursor-pointer"
                        >
                          {code} {match ? `· ${lang === 'fa' ? match.titleFa : match.titleEn}` : ''}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {(lang === 'fa' ? detail.syllabusFa : detail.syllabusEn).map((mod, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 space-y-1"
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{mod.chapter}</div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{mod.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Curated Scientific Papers & Textbooks (Open Access) */}
        {activeTab === 'papers' && (
          <div className="space-y-6">
            {/* Header intro banner */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-teal-500/10 border border-sky-200 dark:border-sky-800/60 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-sm">
                <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span>
                  {lang === 'fa'
                    ? 'دانلود رایگان و قانونی مقالات و کتب مرجع دانشگاهی'
                    : 'Free & Legal Academic Papers & Reference Textbooks'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'fa'
                  ? `برای مطالعه عمیق درس «${course.titleFa}»، نیازی به پرداخت دلاری به ناشران نیست. با پلتفرم‌های دسترسی آزاد (Open Access) و مخازن دانشگاهی رسمی زیر، نسخه‌های قانونی و رایگان مقالات ISI، مقالات کنفرانسی و کتاب‌های مرجع را پیدا و دریافت کنید.`
                  : `For deep mastery of "${course.titleEn}", you don't need to pay for articles behind commercial paywalls. Use open-access platforms and official university repositories below to obtain free, legal copies of scientific papers and reference textbooks.`}
              </p>
            </div>

            {/* Dynamic Search Box for this course */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-sky-600" />
                  {lang === 'fa' ? 'عبارت جستجوی مرجع برای این درس:' : 'Active Reference Search Query:'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{course.code}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={paperSearchQuery}
                  onChange={(e) => setPaperSearchQuery(e.target.value)}
                  placeholder={lang === 'fa' ? 'عنوان درس یا موضوع پژوهشی...' : 'Course title or research topic...'}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPaperSearchQuery(course.titleEn || course.titleFa)}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {lang === 'fa' ? 'عنوان انگلیسی' : 'English Title'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperSearchQuery(course.titleFa)}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {lang === 'fa' ? 'عنوان فارسی' : 'Persian Title'}
                  </button>
                </div>
              </div>

              {/* 1-Click Search Engines Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 1. CORE */}
                <a
                  href={`https://core.ac.uk/search?q=${encodeURIComponent(paperSearchQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 flex items-start justify-between gap-3 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        CORE
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        ۲۵۰M+ مقاله
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lang === 'fa'
                        ? 'بزرگ‌ترین موتور جستجو و تجمیع‌کننده مقالات پژوهشی دنیا از مخازن دانشگاهی رسمی.'
                        : "World's largest aggregator of open access research papers from university repositories."}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0 mt-0.5" />
                </a>

                {/* 2. OA.mg */}
                <a
                  href={`https://oa.mg/search?q=${encodeURIComponent(paperSearchQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 flex items-start justify-between gap-3 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        OA.mg
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400">
                        موتور جستجوی مقالات
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lang === 'fa'
                        ? 'موتور جست‌وجوی هوشمند برای پیدا کردن مقالات علمی و نسخه‌های قانونی آزاد آن‌ها.'
                        : 'Next-gen academic search engine matching scholarly papers to free full-text copies.'}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0 mt-0.5" />
                </a>

                {/* 3. DOAJ */}
                <a
                  href={`https://doaj.org/search/articles?ref=doaj&q=${encodeURIComponent(paperSearchQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 flex items-start justify-between gap-3 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        DOAJ
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
                        ژورنال‌های داوری‌شده
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lang === 'fa'
                        ? 'فهرست ژورنال‌های دسترسی آزاد جهانی؛ مقالات علمی داوری‌شده معتبر بدون پرداخت هزینه.'
                        : 'Directory of Open Access Journals with peer-reviewed open scientific literature.'}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0 mt-0.5" />
                </a>

                {/* 4. Library Genesis */}
                <a
                  href={`https://libgen.rs/search.php?req=${encodeURIComponent(paperSearchQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 flex items-start justify-between gap-3 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        Library Genesis (LibGen)
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                        کتاب‌های مرجع و تکست‌بوک
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lang === 'fa'
                        ? 'پایگاه شناخته‌شده برای یافتن کتاب‌های مرجع درسی، تکست‌بوک‌های زبان اصلی و مقالات.'
                        : 'Well-known archive for course reference books, textbooks, and academic papers.'}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0 mt-0.5" />
                </a>
              </div>
            </div>

            {/* Browser Extensions & DOI Tools */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'fa'
                  ? 'افزونه‌ها و ابزارهای پیدا کردن نسخه رایگان با DOI یا لینک مقاله:'
                  : 'Browser Extensions & Instant DOI Lookup Tools:'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Unpaywall */}
                <a
                  href="https://unpaywall.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-1.5 hover:border-emerald-500/70 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Unpaywall</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'fa'
                      ? 'افزونه مرورگر برای پیدا کردن نسخه‌های قانونی و رایگان مقالات علمی هنگام گشت‌وگذار در وب.'
                      : 'Browser extension discovering legal free versions of paywalled scholarly research.'}
                  </p>
                </a>

                {/* Open Access Button */}
                <a
                  href="https://openaccessbutton.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-1.5 hover:border-sky-500/70 hover:bg-sky-50/30 dark:hover:bg-sky-950/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Open Access Button</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'fa'
                      ? 'پیدا کردن نسخه آزاد مقاله تنها با وارد کردن شناسه دیجیتال (DOI) یا لینک صفحه مقاله.'
                      : 'Find free versions instantly by entering paper URL or DOI, or request from the author.'}
                  </p>
                </a>

                {/* PaperPanda */}
                <a
                  href="https://paperpanda.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-1.5 hover:border-indigo-500/70 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">PaperPanda</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'fa'
                      ? 'افزونه‌ای سریع برای پیدا کردن و دانلود نسخه‌های رایگان مقالات علمی با یک کلیک.'
                      : 'Chrome & Firefox extension to download free academic papers with a single click.'}
                  </p>
                </a>
              </div>

              {/* Interactive DOI Resolver */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-2.5">
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa'
                    ? 'شناسه DOI یا لینک صفحه مقاله را وارد کنید:'
                    : 'Paste Paper DOI or Article URL:'}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={doiInput}
                    onChange={(e) => setDoiInput(e.target.value)}
                    placeholder="مثلاً: 10.1109/JPROC.2020.123456 یا لینک صفحه ژورنال..."
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={
                        doiInput.trim()
                          ? `https://openaccessbutton.org/`
                          : 'https://openaccessbutton.org/'
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{lang === 'fa' ? 'در OA Button' : 'In OA Button'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={
                        doiInput.trim()
                          ? `https://oa.mg/search?q=${encodeURIComponent(doiInput.trim())}`
                          : 'https://oa.mg/'
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{lang === 'fa' ? 'در OA.mg' : 'In OA.mg'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Ethics & Best Practices Note */}
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold">
                  {lang === 'fa' ? 'توصیه اخلاقی و پژوهشی دانشیار:' : 'DaneshYar Research Advisory:'}
                </span>
                <p className="leading-relaxed">
                  {lang === 'fa'
                    ? 'برای دسترسی قانونی و مطمئن، بهتره همیشه اول سراغ منابع Open Access رسمی (CORE، DOAJ و Unpaywall) و نسخه‌های منتشرشده در مخازن رسمی دانشگاه‌ها (مانند arXiv یا مخزن دانشگاه نویسنده) بری.'
                    : 'For legal and reliable access, always prioritize official Open Access sources (CORE, DOAJ, Unpaywall) and author preprints in institutional university repositories.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Industry Applications & Job Market */}
        {activeTab === 'industry' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-emerald-50/75 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-4 space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {lang === 'fa' ? 'ارزش در بازار کار و فرصت‌های شغلی' : 'Career Value & Job Market Demand'}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
                {lang === 'fa' ? detail.marketDemandFa : detail.marketDemandEn}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'کاربردهای واقعی در پروژه‌های صنعتی' : 'Real-World Engineering Applications'}
              </div>
              <ul className="space-y-2">
                {(lang === 'fa' ? detail.industryApplicationsFa : detail.industryApplicationsEn).map((app, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2"
                  >
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{i + 1}.</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <Wrench className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'نرم‌افزارها و ابزارهای صنعتی مرتبط' : 'Industry Standard Toolchain'}</span>
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-200">
                {detail.industryTools.join('  ·  ')}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Curated Video Lectures */}
        {activeTab === 'videos' && (
          <div className="space-y-3">
            {detail.curatedVideos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {vid.source} · {vid.duration} · {vid.language === 'fa' ? 'دوره فارسی' : 'International Lecture'}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? vid.titleFa : vid.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {vid.instructor} — {lang === 'fa' ? vid.focusFa : vid.focusEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onWatchReel(course)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-semibold whitespace-nowrap shrink-0 hover:bg-sky-100 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{lang === 'fa' ? 'خلاصه ریلز ۳۰ث' : 'Watch 30s Summary'}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAskFeynman(lang === 'fa' ? course.titleFa : course.titleEn);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'fa' ? 'تشریح ۴ سطحی فاینمن' : '4-Level Feynman Studio'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGenerateFlashcards(lang === 'fa' ? course.titleFa : course.titleEn);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'فلش‌کارت' : 'Flashcards'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartQuiz(lang === 'fa' ? course.titleFa : course.titleEn);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'شبیه‌ساز آزمون' : 'Exam Quiz'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
