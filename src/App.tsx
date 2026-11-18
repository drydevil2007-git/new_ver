import React, { useEffect, useState } from 'react';
import {
  Languages,
  Moon,
  Sun,
  Home,
  BookOpen,
  Sparkles,
  MessageSquare,
  Layers,
  Landmark,
} from 'lucide-react';
import { Header } from './components/Header';
import { OverviewHero } from './components/OverviewHero';
import { CoursesAndMindMap } from './components/CoursesAndMindMap';
import { AiEngineeringLab, LabTab } from './components/AiEngineeringLab';
import { DeckTab, StudyDeckHub } from './components/StudyDeckHub';
import { StudyRoomsAndTools } from './components/StudyRoomsAndTools';
import { CommunityAndNotes } from './components/CommunityAndNotes';
import { CampusVoiceHub } from './components/CampusVoiceHub';
import { ArticlesHub } from './components/ArticlesHub';
import { AdminPanel } from './components/AdminPanel';
import { DaneshReelsModal } from './components/DaneshReelsModal';
import { CourseDetailModal, CourseDetailTab } from './components/CourseDetailModal';
import { ENGINEERING_COURSES } from './data/coursesData';
import { DANESH_REELS, buildReelForCourse } from './data/reelsAndCourseDetails';
import { CourseItem, Lang, LeitnerCard, NavSection, ReelLesson, Theme } from './types/app';

const INITIAL_FLASHCARDS: LeitnerCard[] = [
  {
    id: 'lc-1',
    front: 'شرط پایداری BIBO برای یک سیستم LTI پیوسته در صفحه مختلط s چیست؟',
    back: 'تمام قطب‌های تابع تبدیل سیستم (ریشه‌های مخرج) باید اکیداً در نیم‌صفحه چپ محور موهومی (Re(s) < 0) قرار داشته باشند.',
    formulaLatex: '\\text{Re}(p_k) < 0 \\quad \\forall k',
    hint: 'جایی که پاسخ ضربه به صفر میل می‌کند',
    deck: 'EE-341 · سیستم‌های کنترل',
    box: 2,
    lastReviewedAt: Date.now(),
    reviewCount: 2,
  },
  {
    id: 'lc-2',
    front: 'قضیه دیورژانس گاوس چه رابطه‌ای بین شار سطحی و انتگرال حجمی برقرار می‌کند؟',
    back: 'شار خروجی میدان برداری F از یک سطح بسته برابر است با انتگرال سه‌گانه دیورژانس F روی حجم محصور.',
    formulaLatex: '\\oiint_{\\partial V} \\mathbf{F}\\cdot d\\mathbf{S} = \\iiint_V (\\nabla \\cdot \\mathbf{F})\\,dV',
    hint: 'تعمیم قضیه اساسی حسابان به سه‌بعد',
    deck: 'MATH-102 · ریاضی عمومی ۲',
    box: 1,
    lastReviewedAt: Date.now(),
    reviewCount: 0,
  },
  {
    id: 'lc-3',
    front: 'شرط میرایی بحرانی (Critical Damping) در مدار RLC سری چیست؟',
    back: 'وقتی ضریب میرایی α برابر فرکانس تشدید طبیعی ω₀ باشد، سیستم بدون نوسان در سریع‌ترین زمان به حالت ماندگار می‌رسد.',
    formulaLatex: '\\alpha = \\frac{R}{2L} = \\omega_0 = \\frac{1}{\\sqrt{LC}}',
    hint: 'دو ریشه حقیقی برابر در معادله مشخصه',
    deck: 'EE-201 · مدارهای الکتریکی ۱',
    box: 1,
    lastReviewedAt: Date.now(),
    reviewCount: 1,
  },
  {
    id: 'lc-4',
    front: 'پیچیدگی زمانی جستجوی کوتاه‌ترین مسیر با الگوریتم دایکسترا (با Binary Heap) چقدر است؟',
    back: 'به ازای V راس و E یال با وزن غیرمنفی، پیچیدگی زمانی برابر با O((V + E) log V) است.',
    formulaLatex: 'T(V,E) = O((V + E)\\log V)',
    hint: 'هر یال حداکثر یک عملیات Decrease-Key دارد',
    deck: 'CS-301 · طراحی الگوریتم‌ها',
    box: 3,
    lastReviewedAt: Date.now(),
    reviewCount: 4,
  },
];

export default function App() {
  const [lang, setLang] = useState<Lang>('fa');
  const [theme, setTheme] = useState<Theme>('light');
  const [activeSection, setActiveSection] = useState<NavSection>('overview');

  // Deep-link states across sections
  const [labTab, setLabTab] = useState<LabTab>('solver');
  const [deckTab, setDeckTab] = useState<DeckTab>('flashcards');
  const [feynmanTopicSeed, setFeynmanTopicSeed] = useState<string | undefined>(undefined);
  const [quizTopicSeed, setQuizTopicSeed] = useState<string | undefined>(undefined);
  const [flashcardTopicSeed, setFlashcardTopicSeed] = useState<string | undefined>(undefined);

  // DaneshReels & Rich Course Detail Modal states
  const [reelsState, setReelsState] = useState<{
    open: boolean;
    reels: ReelLesson[];
    initialIndex: number;
  }>({ open: false, reels: DANESH_REELS, initialIndex: 0 });

  const [viewedReelIds, setViewedReelIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('daneshyar_viewed_reels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [detailModal, setDetailModal] = useState<{
    course: CourseItem;
    initialTab?: CourseDetailTab;
  } | null>(null);

  // Stateful Courses Catalog (synchronized with Admin Panel CRUD)
  const [courses, setCourses] = useState<CourseItem[]>(() => {
    try {
      const saved = localStorage.getItem('daneshyar_courses_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return ENGINEERING_COURSES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('daneshyar_courses_v1', JSON.stringify(courses));
    } catch {
      // ignore storage quota errors
    }
  }, [courses]);

  const handleAddCourse = (course: Omit<CourseItem, 'id'>) => {
    const newCourse: CourseItem = {
      ...course,
      id: `crs-${Date.now()}`,
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const handleUpdateCourse = (updated: CourseItem) => {
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  // Persistent Leitner Box Cards
  const [cards, setCards] = useState<LeitnerCard[]>(() => {
    try {
      const saved = localStorage.getItem('daneshyar_leitner_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_FLASHCARDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('daneshyar_leitner_cards', JSON.stringify(cards));
    } catch {
      // ignore storage errors
    }
  }, [cards]);

  // Sync HTML dir, lang, and .dark class cleanly
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const handlePromoteCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              box: Math.min(5, c.box + 1) as 1 | 2 | 3 | 4 | 5,
              lastReviewedAt: Date.now(),
              reviewCount: c.reviewCount + 1,
            }
          : c
      )
    );
  };

  const handleResetCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              box: 1,
              lastReviewedAt: Date.now(),
              reviewCount: c.reviewCount + 1,
            }
          : c
      )
    );
  };

  const handleAddCards = (
    incoming: Omit<LeitnerCard, 'id' | 'box' | 'lastReviewedAt' | 'reviewCount'>[]
  ) => {
    const created: LeitnerCard[] = incoming.map((item, idx) => ({
      ...item,
      id: `lc-${Date.now()}-${idx}`,
      box: 1,
      lastReviewedAt: Date.now(),
      reviewCount: 0,
    }));
    setCards((prev) => [...created, ...prev]);
  };

  const jumpToFeynman = (topic: string) => {
    setFeynmanTopicSeed(topic);
    setLabTab('feynman');
    setActiveSection('ai-lab');
  };

  const jumpToQuiz = (topic: string) => {
    setQuizTopicSeed(topic);
    setDeckTab('quiz');
    setActiveSection('study-deck');
  };

  const jumpToFlashcards = (topic: string) => {
    setFlashcardTopicSeed(topic);
    setDeckTab('flashcards');
    setActiveSection('study-deck');
  };

  const handleOpenStoryReel = (startIndex: number) => {
    setReelsState({ open: true, reels: DANESH_REELS, initialIndex: startIndex });
  };

  const handleWatchCourseReel = (course: CourseItem) => {
    const courseReel = buildReelForCourse(course);
    const mergedReels = [
      courseReel,
      ...DANESH_REELS.filter((r) => r.courseCode !== course.code),
    ];
    setDetailModal(null);
    setReelsState({ open: true, reels: mergedReels, initialIndex: 0 });
  };

  const handleOpenCourseByCode = (code: string) => {
    const match = courses.find((c) => c.code === code) || courses[0];
    setReelsState((prev) => ({ ...prev, open: false }));
    if (match) {
      setDetailModal({ course: match, initialTab: 'child5' });
    }
  };

  const handleMarkReelViewed = (reelId: string) => {
    setViewedReelIds((prev) => {
      if (prev.includes(reelId)) return prev;
      const next = [...prev, reelId];
      try {
        localStorage.setItem('daneshyar_viewed_reels', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const dockItems: Array<{ id: NavSection; icon: React.ComponentType<{ className?: string }>; fa: string; en: string }> = [
    { id: 'overview', icon: Home, fa: 'خانه', en: 'Home' },
    { id: 'courses', icon: BookOpen, fa: 'دروس', en: 'Courses' },
    { id: 'campus', icon: Landmark, fa: 'هم‌دانشگاهی', en: 'Campus' },
    { id: 'ai-lab', icon: Sparkles, fa: 'هوش مصنوعی', en: 'AI Lab' },
    { id: 'study-deck', icon: Layers, fa: 'جعبه یادگیری', en: 'Study' },
  ];

  return (
    <div className="relative min-h-screen canvas-backdrop flex flex-col justify-between transition-colors duration-200 pb-24 lg:pb-0 overflow-x-clip">
      {/* Subtle Ambient Lighting Orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-28 start-[-8%] w-[420px] h-[420px] rounded-full bg-sky-400/12 dark:bg-sky-500/12 blur-3xl ambient-orb" />
        <div className="absolute bottom-12 end-[-6%] w-[360px] h-[360px] rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl ambient-orb" />
      </div>

      <div className="relative z-10">
        <Header
          lang={lang}
          activeSection={activeSection}
          onNavigate={setActiveSection}
          onLaunchVoiceCoach={() => {
            setDeckTab('voice');
            setActiveSection('study-deck');
          }}
        />

        {/* Compact Workspace Utility Bar (Language RTL/LTR + Theme Light/Dark + Quick Breadcrumb) */}
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setActiveSection('overview')}
              className="hover:text-sky-600 dark:hover:text-sky-400 font-medium cursor-pointer"
            >
              {lang === 'fa' ? 'نمای کلی پلتفرم' : 'Platform Overview'}
            </button>
            {activeSection !== 'overview' && (
              <>
                <span aria-hidden="true">/</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeSection === 'courses' && (lang === 'fa' ? 'دروس و نقشه سه‌بعدی' : 'Courses & 3D Map')}
                  {activeSection === 'ai-lab' && (lang === 'fa' ? 'آزمایشگاه هوش مصنوعی' : 'AI Studio')}
                  {activeSection === 'articles' && (lang === 'fa' ? 'مقالات علمی و آموزشی' : 'Scientific Articles')}
                  {activeSection === 'study-deck' && (lang === 'fa' ? 'جعبه یادگیری و شبیه‌ساز آزمون' : 'Study Deck & Exam Simulator')}
                  {activeSection === 'study-rooms' && (lang === 'fa' ? 'اتاق مطالعه اشتراکی' : 'Study Rooms & Tools')}
                  {activeSection === 'community' && (lang === 'fa' ? 'چت علمی، انجمن و جزوات' : 'Academic Chat, Forum & Notes')}
                  {activeSection === 'campus' && (lang === 'fa' ? 'هم‌دانشگاهی · صدای دانشجو و جامعه' : 'Campus & Society Student Voice')}
                  {activeSection === 'admin' && (lang === 'fa' ? 'پنل مدیریت جامع ادمین' : 'Comprehensive Admin Panel')}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* RTL / LTR Language Toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md">
              <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mx-1.5" />
              <button
                type="button"
                onClick={() => setLang('fa')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  lang === 'fa'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                فارسی
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Light / Dark Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              aria-label={lang === 'fa' ? 'تغییر تم روشن یا تاریک' : 'Toggle theme'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 transition-colors cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-slate-700" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{theme === 'light' ? (lang === 'fa' ? 'حالت شب' : 'Dark') : (lang === 'fa' ? 'حالت روز' : 'Light')}</span>
            </button>
          </div>
        </div>

        {/* Main Active View */}
        <main className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6">
          {activeSection === 'overview' && (
            <OverviewHero
              lang={lang}
              onNavigate={setActiveSection}
              onOpenLabTab={(tab) => {
                setLabTab(tab);
                setActiveSection('ai-lab');
              }}
              onOpenDeckTab={(tab) => {
                setDeckTab(tab);
                setActiveSection('study-deck');
              }}
              onOpenReelStory={handleOpenStoryReel}
              viewedReelIds={viewedReelIds}
            />
          )}

          {activeSection === 'courses' && (
            <CoursesAndMindMap
              lang={lang}
              courses={courses}
              onAskFeynman={jumpToFeynman}
              onStartQuiz={jumpToQuiz}
              onGenerateFlashcards={jumpToFlashcards}
              onOpenReelStory={handleOpenStoryReel}
              onWatchCourseReel={handleWatchCourseReel}
              onOpenCourseDetail={(course, initialTab) => setDetailModal({ course, initialTab })}
              viewedReelIds={viewedReelIds}
            />
          )}

          {activeSection === 'ai-lab' && (
            <AiEngineeringLab
              lang={lang}
              activeTab={labTab}
              onChangeTab={setLabTab}
              initialFeynmanTopic={feynmanTopicSeed}
              onImportFlashcards={handleAddCards}
            />
          )}

          {activeSection === 'articles' && <ArticlesHub lang={lang} />}

          {activeSection === 'study-deck' && (
            <StudyDeckHub
              lang={lang}
              activeTab={deckTab}
              onChangeTab={setDeckTab}
              cards={cards}
              onPromoteCard={handlePromoteCard}
              onResetCard={handleResetCard}
              onAddCards={handleAddCards}
              initialQuizTopic={quizTopicSeed}
              initialFlashcardTopic={flashcardTopicSeed}
            />
          )}

          {activeSection === 'study-rooms' && <StudyRoomsAndTools lang={lang} />}

          {activeSection === 'community' && (
            <CommunityAndNotes lang={lang} onGenerateFlashcardsFromNote={handleAddCards} />
          )}

          {activeSection === 'campus' && <CampusVoiceHub lang={lang} />}

          {activeSection === 'admin' && (
            <AdminPanel
              lang={lang}
              courses={courses}
              onAddCourse={handleAddCourse}
              onUpdateCourse={handleUpdateCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}
        </main>
      </div>

      {/* Quiet Footer */}
      <footer className="relative z-10 mt-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            {lang === 'fa'
              ? 'دانشیار (danshyar.ir) — پلتفرم جامع آموزش مهندسی و دانشگاهی'
              : 'DaneshYar (danshyar.ir) — University & Engineering Education Platform'}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSection('courses')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {lang === 'fa' ? 'کاتالوگ دروس' : 'Courses'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('articles')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {lang === 'fa' ? 'مقالات علمی' : 'Articles'}
            </button>
            <button
              type="button"
              onClick={() => {
                setLabTab('solver');
                setActiveSection('ai-lab');
              }}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {lang === 'fa' ? 'حل فرمول LaTeX' : 'Formula Solver'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('community')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {lang === 'fa' ? 'چت علمی و انجمن' : 'Chat & Forum'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('campus')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {lang === 'fa' ? 'هم‌دانشگاهی' : 'Campus Voice'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('admin')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {lang === 'fa' ? 'پنل مدیریت' : 'Admin'}
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Navigation Dock (Mobile & Tablet) */}
      <nav
        aria-label={lang === 'fa' ? 'ناوبری سریع موبایل' : 'Mobile quick navigation'}
        className="lg:hidden fixed bottom-3 inset-x-3 z-30 glass-surface rounded-2xl h-16 px-1.5 grid grid-cols-5 items-center shadow-xl"
      >
        {dockItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                active
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] whitespace-nowrap">{lang === 'fa' ? item.fa : item.en}</span>
            </button>
          );
        })}
      </nav>

      {/* Rich Course Detail & 5-Year-Old / 3D / Proof / Hardest Exam Modal */}
      {detailModal && (
        <CourseDetailModal
          lang={lang}
          course={detailModal.course}
          allCourses={courses}
          initialTab={detailModal.initialTab}
          onClose={() => setDetailModal(null)}
          onSelectCourse={(nextCourse) => setDetailModal({ course: nextCourse, initialTab: 'child5' })}
          onWatchReel={handleWatchCourseReel}
          onAskFeynman={jumpToFeynman}
          onStartQuiz={jumpToQuiz}
          onGenerateFlashcards={jumpToFlashcards}
        />
      )}

      {/* Fullscreen 9:16 DaneshReels Vertical Player Modal */}
      {reelsState.open && (
        <DaneshReelsModal
          lang={lang}
          reels={reelsState.reels}
          initialIndex={reelsState.initialIndex}
          onClose={() => setReelsState((prev) => ({ ...prev, open: false }))}
          onOpenCourseByCode={handleOpenCourseByCode}
          onMarkViewed={handleMarkReelViewed}
        />
      )}
    </div>
  );
}
