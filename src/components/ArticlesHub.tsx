import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Plus,
  X,
  Check,
  Copy,
  Clock,
  CheckCircle2,
  Code2,
  ArrowRight,
  ArrowLeft,
  Download,
  ExternalLink,
  GraduationCap,
  Search,
  Library,
  FileText,
  Trash2,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import { DifficultyLevel, Lang, ScientificArticle, ScientificResourceItem, UserSession } from '../types/app';
import { RichMathText } from './MathRenderer';

interface ArticlesHubProps {
  lang: Lang;
  user?: UserSession | null;
  onOpenAuth?: () => void;
}

const GLOBAL_LIBRARY_RESOURCES: ScientificResourceItem[] = [
  {
    id: 'lib-1',
    type: 'book',
    titleFa: 'مبانی مدارهای الکتریکی (سادیکو و الکساندر)',
    titleEn: 'Fundamentals of Electric Circuits (Alexander & Sadiku)',
    authors: 'Charles K. Alexander, Matthew N. O. Sadiku',
    editionOrJournal: 'ویرایش ۷ام (7th Edition)',
    year: '2021',
    summaryFa: 'تکست‌بوک شماره یک مدارهای الکتریکی در دانشگاه‌های ایران و جهان؛ تحلیل گره و مش، مدارهای RLC و تبدیل لاپلاس.',
    summaryEn: 'Definitive circuit theory textbook covering complete nodal/mesh and RLC transient analysis.',
    downloadUrl: 'https://libgen.rs/search.php?req=Fundamentals+of+Electric+Circuits+Alexander+Sadiku',
    platform: 'LibGen',
    isLegalOpenAccess: false,
  },
  {
    id: 'lib-2',
    type: 'book',
    titleFa: 'سیگنال‌ها و سیستم‌ها (آلن وی. اوپنهایم)',
    titleEn: 'Signals and Systems (Alan V. Oppenheim & Alan S. Willsky)',
    authors: 'Alan V. Oppenheim, Alan S. Willsky',
    editionOrJournal: 'ویرایش ۲ام (Prentice Hall)',
    year: '1997',
    summaryFa: 'کتاب مرجع دانشگاه MIT، شریف و تهران برای سیستم‌های LTI، کانولوشن، فوریه و لاپلاس.',
    summaryEn: 'Standard university textbook for continuous and discrete LTI systems, convolution, and Fourier/Z transforms.',
    downloadUrl: 'https://libgen.rs/search.php?req=Signals+and+Systems+Oppenheim+Willsky',
    platform: 'LibGen',
    isLegalOpenAccess: false,
  },
  {
    id: 'lib-3',
    type: 'book',
    titleFa: 'مهندسی کنترل مدرن (کاتسوهیکو اوگاتا)',
    titleEn: 'Modern Control Engineering (Katsuhiko Ogata)',
    authors: 'Katsuhiko Ogata',
    editionOrJournal: 'ویرایش ۵ام (Pearson)',
    year: '2010',
    summaryFa: 'کتاب جامع کنترل خطی؛ مکان ریشه‌ها (Root Locus)، نمودار بود، پایداری نایکویست و فضای حالت.',
    summaryEn: 'Comprehensive guide covering classical feedback, Bode/Nyquist stability criteria, and modern state-space control.',
    downloadUrl: 'https://libgen.rs/search.php?req=Modern+Control+Engineering+Ogata',
    platform: 'LibGen',
    isLegalOpenAccess: false,
  },
  {
    id: 'lib-4',
    type: 'book',
    titleFa: 'مقدمه‌ای بر الگوریتم‌ها (CLRS)',
    titleEn: 'Introduction to Algorithms (Cormen, Leiserson, Rivest, Stein)',
    authors: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    editionOrJournal: 'ویرایش ۴ام (MIT Press)',
    year: '2022',
    summaryFa: 'معتبرترین مرجع جهانی الگوریتم‌ها؛ پیچیدگی زمانی، درخت‌ها، برنامه‌نویسی پویا و الگوریتم‌های گراف.',
    summaryEn: 'The international standard textbook on algorithmic design, dynamic programming, and graph theory.',
    downloadUrl: 'https://libgen.rs/search.php?req=Introduction+to+Algorithms+Cormen+Leiserson+Rivest+Stein',
    platform: 'LibGen',
    isLegalOpenAccess: false,
  },
  {
    id: 'lib-5',
    type: 'book',
    titleFa: 'هوش مصنوعی: رویکردی مدرن (AIMA)',
    titleEn: 'Artificial Intelligence: A Modern Approach (Russell & Norvig)',
    authors: 'Stuart Russell, Peter Norvig',
    editionOrJournal: 'ویرایش ۴ام (Pearson)',
    year: '2020',
    summaryFa: 'کتاب مرجع شماره یک دانشگاه‌های جهان در هوش مصنوعی؛ عامل‌های هوشمند، یادگیری عمیق و منطق.',
    summaryEn: 'Leading university AI text covering rational agents, probabilistic reasoning, and deep learning.',
    downloadUrl: 'https://libgen.rs/search.php?req=Artificial+Intelligence+A+Modern+Approach+Russell+Norvig',
    platform: 'LibGen',
    isLegalOpenAccess: false,
  },
  {
    id: 'lib-6',
    type: 'paper',
    titleFa: 'توجه تنها چیزی است که نیاز دارید (مقاله ترنسفورمرها)',
    titleEn: 'Attention Is All You Need (Transformer Architecture)',
    authors: 'Ashish Vaswani, Noam Shazeer, et al. (Google Brain)',
    editionOrJournal: 'NeurIPS / arXiv Open Access',
    year: '2017',
    doi: '10.48550/arXiv.1706.03762',
    summaryFa: 'مقاله سرنوشت‌ساز تاریخ هوش مصنوعی که مکانیزم Self-Attention و معماری Transformer را معرفی کرد.',
    summaryEn: 'Introduced the Transformer architecture, revolutionizing natural language processing and modern LLMs.',
    downloadUrl: 'https://oa.mg/search?q=Attention+Is+All+You+Need+Vaswani',
    platform: 'OA.mg',
    isLegalOpenAccess: true,
  },
  {
    id: 'lib-7',
    type: 'paper',
    titleFa: 'رویکردی نو در فیلترینگ و پیش‌بینی سیستم‌های خطی (فیلتر کالمن)',
    titleEn: 'A New Approach to Linear Filtering and Prediction Problems',
    authors: 'Rudolf E. Kalman',
    editionOrJournal: 'Journal of Basic Engineering (ASME)',
    year: '1960',
    doi: '10.1115/1.3662552',
    summaryFa: 'فرمول‌بندی تاریخی فیلتر کالمن برای تخمین بهینه حالت در حضور نویز (ناوبری آپولو و پهپادها).',
    summaryEn: 'Landmark formulation of recursive Kalman filtering for optimal state estimation in dynamic systems.',
    downloadUrl: 'https://core.ac.uk/search?q=Kalman+New+Approach+Linear+Filtering+Prediction',
    platform: 'CORE',
    isLegalOpenAccess: true,
  },
  {
    id: 'lib-8',
    type: 'book',
    titleFa: 'حساب دیفرانسیل و انتگرال جیمز استوارت',
    titleEn: 'Calculus: Early Transcendentals (James Stewart)',
    authors: 'James Stewart, Daniel Clegg, Saleem Watson',
    editionOrJournal: 'ویرایش ۹ام (Cengage)',
    year: '2020',
    summaryFa: 'محبوب‌ترین کتاب ریاضی عمومی ۱ و ۲ مهندسی؛ انتگرال‌های چندگانه، میدان‌های برداری، استوکس و دیورژانس.',
    summaryEn: 'Premier multivariable calculus reference covering limits, vector fields, and surface integrals.',
    downloadUrl: 'https://libgen.rs/search.php?req=Calculus+Early+Transcendentals+James+Stewart',
    platform: 'LibGen',
    isLegalOpenAccess: false,
  },
  {
    id: 'lib-9',
    type: 'book',
    titleFa: 'مبانی فیزیک هالیدی، رزنیک و واکر',
    titleEn: 'Fundamentals of Physics (Halliday, Resnick & Walker)',
    authors: 'David Halliday, Robert Resnick, Jearl Walker',
    editionOrJournal: 'ویرایش ۱۲ام (Wiley)',
    year: '2021',
    summaryFa: 'مرجع بی‌رقیب فیزیک پایه دانشگاهی؛ مکانیک نیوتنی، امواج، الکترومغناطیس و نورشناسی.',
    summaryEn: 'World standard physics text spanning mechanics, thermodynamics, and electromagnetism.',
    downloadUrl: 'https://libgen.rs/search.php?req=Fundamentals+of+Physics+Halliday+Resnick+Walker',
    platform: 'LibGen',
    isLegalOpenAccess: false,
  },
  {
    id: 'lib-10',
    type: 'book',
    titleFa: 'ترمودینامیک با رویکرد مهندسی (سنجل و بولز)',
    titleEn: 'Thermodynamics: An Engineering Approach (Cengel & Boles)',
    authors: 'Yunus A. Cengel, Michael A. Boles',
    editionOrJournal: 'ویرایش ۹ام (McGraw-Hill)',
    year: '2019',
    summaryFa: 'مرجع ترمودینامیک مهندسی؛ قانون اول و دوم، محاسبه اگزرژی، چرخه‌های کارنو، رانکین و برایتون.',
    summaryEn: 'Standard engineering thermodynamics reference on power cycles, entropy, and energy systems.',
    downloadUrl: 'https://libgen.rs/search.php?req=Thermodynamics+An+Engineering+Approach+Cengel+Boles',
    platform: 'LibGen',
    isLegalOpenAccess: false,
  },
];

export const ArticlesHub: React.FC<ArticlesHubProps> = ({ lang, user, onOpenAuth }) => {
  const [hubTab, setHubTab] = useState<'articles' | 'library'>('articles');
  const [articles, setArticles] = useState<ScientificArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [activeArticle, setActiveArticle] = useState<ScientificArticle | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Library State
  const [libSearchQuery, setLibSearchQuery] = useState('');
  const [libTypeFilter, setLibTypeFilter] = useState<'all' | 'book' | 'paper'>('all');
  const [libDoiInput, setLibDoiInput] = useState('');
  const [showAddLibModal, setShowAddLibModal] = useState(false);
  const [customLibResources, setCustomLibResources] = useState<ScientificResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem('dy_custom_global_library');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newLibType, setNewLibType] = useState<'book' | 'paper'>('book');
  const [newLibTitleFa, setNewLibTitleFa] = useState('');
  const [newLibTitleEn, setNewLibTitleEn] = useState('');
  const [newLibAuthors, setNewLibAuthors] = useState('');
  const [newLibEdition, setNewLibEdition] = useState('');
  const [newLibYear, setNewLibYear] = useState('2024');
  const [newLibSummary, setNewLibSummary] = useState('');
  const [newLibUrl, setNewLibUrl] = useState('');
  const [newLibPlatform, setNewLibPlatform] = useState<ScientificResourceItem['platform']>('LibGen');
  const [newLibDoi, setNewLibDoi] = useState('');

  const handleSaveLibResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLibTitleFa.trim() && !newLibTitleEn.trim()) return;

    const item: ScientificResourceItem = {
      id: `lib-user-${Date.now()}`,
      type: newLibType,
      titleFa: newLibTitleFa.trim() || newLibTitleEn.trim(),
      titleEn: newLibTitleEn.trim() || newLibTitleFa.trim(),
      authors: newLibAuthors.trim() || (lang === 'fa' ? 'نویسنده مرجع' : 'Author'),
      editionOrJournal: newLibEdition.trim() || (newLibType === 'book' ? 'ویرایش جدید' : 'ژورنال علمی'),
      year: newLibYear.trim() || '2024',
      summaryFa: newLibSummary.trim() || (lang === 'fa' ? 'منبع تکمیلی اضافه شده به کتابخانه' : 'Added library resource'),
      summaryEn: newLibSummary.trim() || 'Added library resource',
      doi: newLibDoi.trim() || undefined,
      downloadUrl:
        newLibUrl.trim() ||
        (newLibPlatform === 'LibGen'
          ? `https://libgen.rs/search.php?req=${encodeURIComponent(newLibTitleEn || newLibTitleFa)}`
          : `https://core.ac.uk/search?q=${encodeURIComponent(newLibTitleEn || newLibTitleFa)}`),
      platform: newLibPlatform,
      isLegalOpenAccess: newLibPlatform !== 'LibGen',
    };

    const next = [item, ...customLibResources];
    setCustomLibResources(next);
    try {
      localStorage.setItem('dy_custom_global_library', JSON.stringify(next));
    } catch {}

    setShowAddLibModal(false);
    setNewLibTitleFa('');
    setNewLibTitleEn('');
    setNewLibAuthors('');
    setNewLibEdition('');
    setNewLibSummary('');
    setNewLibUrl('');
    setNewLibDoi('');
  };

  const handleDeleteLibResource = (id: string) => {
    const next = customLibResources.filter((r) => r.id !== id);
    setCustomLibResources(next);
    try {
      localStorage.setItem('dy_custom_global_library', JSON.stringify(next));
    } catch {}
  };

  const allLibraryItems = useMemo(() => {
    return [...customLibResources, ...GLOBAL_LIBRARY_RESOURCES];
  }, [customLibResources]);

  const filteredLibraryItems = useMemo(() => {
    return allLibraryItems.filter((item) => {
      if (libTypeFilter !== 'all' && item.type !== libTypeFilter) return false;
      if (!libSearchQuery.trim()) return true;
      const q = libSearchQuery.toLowerCase();
      return (
        item.titleFa.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.authors.toLowerCase().includes(q) ||
        item.summaryFa.toLowerCase().includes(q)
      );
    });
  }, [allLibraryItems, libTypeFilter, libSearchQuery]);

  // Article Editor Modal
  const [showEditor, setShowEditor] = useState(false);
  const [titleFa, setTitleFa] = useState('');
  const [categoryFa, setCategoryFa] = useState('برق و کنترل');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [authorFa, setAuthorFa] = useState('امیرحسین رضایی');
  const [readMinutes, setReadMinutes] = useState(6);
  const [excerptFa, setExcerptFa] = useState('');
  const [markdownFa, setMarkdownFa] = useState(
    '## مقدمه و ایده اصلی\nدر تحلیل مهندسی، رابطه زیر پایه مدل‌سازی سیستم است:\n\n$$\\frac{d^2y}{dt^2} + 2\\zeta\\omega_n\\frac{dy}{dt} + \\omega_n^2 y = \\omega_n^2 u(t)$$\n\n## نکات پیاده‌سازی\nبا تنظیم ضریب میرایی $\\zeta$ می‌توان فراجهش (Overshoot) پاسخ پله را کنترل کرد.'
  );
  const [codeTitle, setCodeTitle] = useState('');
  const [codeBody, setCodeBody] = useState('');
  const [takeawaysInput, setTakeawaysInput] = useState('');

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.articles)) setArticles(d.articles);
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => set.add(lang === 'fa' ? a.categoryFa : a.categoryEn));
    return ['all', ...Array.from(set)];
  }, [articles, lang]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const cat = lang === 'fa' ? a.categoryFa : a.categoryEn;
      if (selectedCategory !== 'all' && cat !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && a.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [articles, selectedCategory, selectedDifficulty, lang]);

  const difficultyLabel = (d: DifficultyLevel) => {
    if (d === 'introductory') return lang === 'fa' ? 'پایه' : 'Introductory';
    if (d === 'intermediate') return lang === 'fa' ? 'تخصصی' : 'Intermediate';
    return lang === 'fa' ? 'پیشرفته' : 'Advanced';
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFa.trim() || !markdownFa.trim()) return;
    try {
      const takeawaysFa = takeawaysInput
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      const resp = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFa,
          categoryFa,
          categoryEn: categoryFa,
          difficulty,
          authorFa,
          readMinutes,
          excerptFa,
          markdownFa,
          codeSnippet: codeBody.trim()
            ? { language: 'python', title: codeTitle || 'Engineering Script', code: codeBody }
            : undefined,
          takeawaysFa,
        }),
      });
      const data = await resp.json();
      if (data.article) {
        setArticles((prev) => [data.article, ...prev]);
        setShowEditor(false);
        setTitleFa('');
        setExcerptFa('');
        setCodeTitle('');
        setCodeBody('');
        setTakeawaysInput('');
        setActiveArticle(data.article);
      }
    } catch {
      // ignore
    }
  };

  const renderMarkdownSections = (md: string) => {
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];
    let buffer: string[] = [];

    const flushBuffer = (keyPrefix: number) => {
      if (buffer.length === 0) return;
      const joined = buffer.join('\n').trim();
      if (joined) {
        elements.push(
          <RichMathText
            key={`p-${keyPrefix}`}
            text={joined}
            className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed"
          />
        );
      }
      buffer = [];
    };

    lines.forEach((line, idx) => {
      if (line.startsWith('## ')) {
        flushBuffer(idx);
        elements.push(
          <h4 key={`h-${idx}`} className="text-lg font-bold text-slate-900 dark:text-white pt-3">
            {line.replace(/^##\s+/, '')}
          </h4>
        );
      } else {
        buffer.push(line);
      }
    });
    flushBuffer(lines.length);
    return elements;
  };

  const BackArrow = lang === 'fa' ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {hubTab === 'library'
              ? lang === 'fa'
                ? 'کتابخانه کتب مرجع و مقالات علمی (۷ پایگاه)'
                : 'Scientific Books & Academic Papers Library (7 Hubs)'
              : lang === 'fa'
              ? 'مجله علمی و مقالات مهندسی دانشیار'
              : 'Scientific Articles & Engineering Publication Hub'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {hubTab === 'library'
              ? lang === 'fa'
                ? 'دانلود رایگان و قانونی کتب مرجع دانشگاهی، تکست‌بوک‌های زبان اصلی و مقالات ISI از طریق LibGen، CORE، DOAJ و OA.mg'
                : 'Free and legal access to academic textbooks, reference books, and ISI papers via LibGen, CORE, DOAJ, and OA.mg'
              : lang === 'fa'
              ? 'راهنماهای عمیق مهندسی با فرمول‌های LaTeX، قطعه کدهای آزمایشگاهی و نکات کلیدی امتحان'
              : 'In-depth engineering guides with KaTeX derivations, annotated code snippets, and key takeaways'}
          </p>
        </div>

        {hubTab === 'library' ? (
          <button
            type="button"
            onClick={() => {
              if (!user) {
                onOpenAuth?.();
                return;
              }
              setShowAddLibModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold self-start cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'fa' ? 'افزودن کتاب یا مقاله به کتابخانه' : 'Add Book / Paper to Library'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!user) {
                onOpenAuth?.();
                return;
              }
              setShowEditor(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold self-start cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'fa' ? 'انتشار مقاله جدید' : 'Publish Guide'}</span>
          </button>
        )}
      </div>

      {/* Main Mode Switcher: Articles Magazine vs Academic Library */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 w-fit">
        <button
          type="button"
          onClick={() => {
            setHubTab('articles');
            setActiveArticle(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            hubTab === 'articles'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'fa' ? 'مجله و مقالات آموزشی' : 'Articles & Guides'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setHubTab('library');
            setActiveArticle(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            hubTab === 'library'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>{lang === 'fa' ? 'مرجع دانلود کتب و مقالات (۷ پایگاه)' : 'Books & Papers Library (7 Platforms)'}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
            رایگان
          </span>
        </button>
      </div>

      {/* VIEW 1: Articles Mode */}
      {hubTab === 'articles' && (
        <>
          {/* Full Article View */}
      {activeArticle ? (
        <article className="glass-surface rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              <BackArrow className="w-4 h-4" />
              <span>{lang === 'fa' ? 'بازگشت به فهرست مقالات' : 'Back to Articles'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{lang === 'fa' ? activeArticle.categoryFa : activeArticle.categoryEn}</span>
              <span aria-hidden="true">·</span>
              <span>{difficultyLabel(activeArticle.difficulty)}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readMinutes} {lang === 'fa' ? 'دقیقه' : 'min'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight [text-wrap:balance]">
              {lang === 'fa' ? activeArticle.titleFa : activeArticle.titleEn}
            </h1>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {lang === 'fa' ? activeArticle.authorFa : activeArticle.authorEn} · {activeArticle.date}
            </div>
          </div>

          <div className="aspect-[16/7] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
            <img loading="lazy" decoding="async"
              src={activeArticle.image}
              alt={lang === 'fa' ? activeArticle.titleFa : activeArticle.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80';
              }}
            />
          </div>

          {/* Rich Markdown + KaTeX body */}
          <div className="space-y-4 max-w-3xl">
            {renderMarkdownSections(lang === 'fa' ? activeArticle.markdownFa : activeArticle.markdownEn)}
          </div>

          {/* Syntax-highlighted style Code Snippet */}
          {activeArticle.codeSnippet && (
            <div className="max-w-3xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="inline-flex items-center gap-2 text-sky-400 font-mono">
                  <Code2 className="w-4 h-4" />
                  <span>{activeArticle.codeSnippet.title}</span>
                  <span className="text-slate-500">({activeArticle.codeSnippet.language})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeArticle.codeSnippet!.code);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 1800);
                  }}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? (lang === 'fa' ? 'کپی شد' : 'Copied') : (lang === 'fa' ? 'کپی کد' : 'Copy')}</span>
                </button>
              </div>
              <pre dir="ltr" className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-sky-100">
                <code>{activeArticle.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Key Takeaways */}
          <div className="max-w-3xl rounded-2xl bg-emerald-50/75 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'fa' ? 'نکات کلیدی مقاله' : 'Key Engineering Takeaways'}</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100">
              {(lang === 'fa' ? activeArticle.takeawaysFa : activeArticle.takeawaysEn).map((tk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{i + 1}.</span>
                  <span>{tk}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ) : (
        /* Categorized Article Feed */
        <div className="space-y-5">
          {/* Open Access & Scientific Platforms Spotlight Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 border border-sky-300 dark:border-sky-800 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white text-[11px] font-bold">
                  {lang === 'fa' ? 'راهنمای ویژه پژوهش' : 'Featured Research Guide'}
                </span>
                <span className="text-xs font-semibold text-sky-800 dark:text-sky-300">
                  {lang === 'fa' ? '۷ سایت کاربردی برای دانلود رایگان مقالات و کتب' : '7 Free Academic Paper & Textbook Search Engines'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'fa'
                  ? 'نیازی به پرداخت دلاری برای مقالات ISI و کتاب‌های مرجع نیست؛ از Unpaywall، Open Access Button، CORE، DOAJ، OA.mg، PaperPanda و LibGen استفاده کنید.'
                  : 'Bypass academic paywalls legally with open-access repositories and automated DOI retrieval tools.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setHubTab('library')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Library className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'ورود به کتابخانه کتب و مقالات' : 'Enter Books & Papers Library'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = articles.find((a) => a.id === 'art-free-papers-books');
                  if (target) {
                    setActiveArticle(target);
                  } else {
                    setSelectedCategory(lang === 'fa' ? 'مهارت‌های پژوهشی و دانشگاهی' : 'Academic & Research Skills');
                  }
                }}
                className="px-3.5 py-2 rounded-xl border border-sky-400 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'مطالعه راهنما' : 'Read Guide'}</span>
              </button>
            </div>
          </div>

          <div className="glass-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat === 'all' ? (lang === 'fa' ? 'همه موضوعات' : 'All Categories') : cat}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              {(['all', 'introductory', 'intermediate', 'advanced'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                    selectedDifficulty === d
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d === 'all' ? (lang === 'fa' ? 'همه سطوح' : 'All') : difficultyLabel(d)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((art) => (
              <article
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="group glass-surface rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer hover:border-sky-500/50 transition-all"
              >
                <div>
                  <div className="aspect-[4/3] bg-slate-900 overflow-hidden">
                    <img loading="lazy" decoding="async"
                      src={art.image}
                      alt={lang === 'fa' ? art.titleFa : art.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80';
                      }}
                    />
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{lang === 'fa' ? art.categoryFa : art.categoryEn}</span>
                      <span aria-hidden="true">·</span>
                      <span>{difficultyLabel(art.difficulty)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.readMinutes} {lang === 'fa' ? 'دقیقه مطالعه' : 'min read'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 leading-snug">
                      {lang === 'fa' ? art.titleFa : art.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'fa' ? art.excerptFa : art.excerptEn}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-3 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {lang === 'fa' ? art.authorFa : art.authorEn}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'مطالعه مقاله' : 'Read Guide'}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
      </>
    )}

    {/* VIEW 2: Academic Library & Free Papers/Books Hub (7 Platforms) */}
    {hubTab === 'library' && (
      <div className="space-y-6">
        {/* Intro Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-teal-500/10 border border-sky-300 dark:border-sky-800 p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-sky-600 text-white shadow-md">
                <Library className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {lang === 'fa'
                    ? 'پایگاه جامع دانلود رایگان و قانونی کتب و مقالات علمی دانشگاهی'
                    : 'Open Access Textbooks & Research Papers Repository'}
                </h3>
                <p className="text-xs text-sky-700 dark:text-sky-300 font-semibold mt-0.5">
                  CORE · OA.mg · DOAJ · Library Genesis · Unpaywall · Open Access Button · PaperPanda
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddLibModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'fa' ? 'افزودن کتاب یا مقاله جدید' : 'Add Resource'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {lang === 'fa'
              ? 'دیگر نیازی به پرداخت دلاری برای دانلود مقالات ISI و کتاب‌های مرجع نیست. در این بخش مهم‌ترین تکست‌بوک‌های مهندسی و علوم پایه به همراه مقالات کلیدی اضافه شده‌اند و می‌توانید با استفاده از ۷ پایگاه دسترسی آزاد جهانی به بیش از ۲۵۰ میلیون پژوهش رسمی دیگر دسترسی داشته باشید.'
              : 'Access hundreds of millions of peer-reviewed papers and university textbooks directly without commercial paywalls.'}
          </p>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="glass-surface rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={libSearchQuery}
              onChange={(e) => setLibSearchQuery(e.target.value)}
              placeholder={
                lang === 'fa'
                  ? 'جستجو در عنوان کتاب، نام نویسنده یا موضوع (مثلاً: سادیکو، الگوریتم، لاپلاس، استوارت)...'
                  : 'Search by book title, author or subject...'
              }
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 shrink-0">
            <button
              type="button"
              onClick={() => setLibTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                libTypeFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang === 'fa' ? `همه منابع (${allLibraryItems.length})` : `All (${allLibraryItems.length})`}
            </button>
            <button
              type="button"
              onClick={() => setLibTypeFilter('book')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                libTypeFilter === 'book'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang === 'fa'
                ? `کتب مرجع (${allLibraryItems.filter((i) => i.type === 'book').length})`
                : `Books (${allLibraryItems.filter((i) => i.type === 'book').length})`}
            </button>
            <button
              type="button"
              onClick={() => setLibTypeFilter('paper')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                libTypeFilter === 'paper'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang === 'fa'
                ? `مقالات ISI (${allLibraryItems.filter((i) => i.type === 'paper').length})`
                : `Papers (${allLibraryItems.filter((i) => i.type === 'paper').length})`}
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLibraryItems.map((res) => {
            const isBook = res.type === 'book';
            return (
              <div
                key={res.id}
                className="glass-surface rounded-2xl p-5 flex flex-col justify-between space-y-3.5 hover:border-sky-500/60 transition-all shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        isBook
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {isBook ? <BookOpen className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      <span>{isBook ? (lang === 'fa' ? 'تکست‌بوک مرجع' : 'Textbook') : (lang === 'fa' ? 'مقاله علمی' : 'Research Paper')}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        {res.platform}
                      </span>
                      {res.id.startsWith('lib-user-') && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLibResource(res.id)}
                          title="حذف منبع"
                          className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {lang === 'fa' ? res.titleFa : res.titleEn}
                    </h4>
                    {lang === 'fa' && res.titleEn && res.titleEn !== res.titleFa && (
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                        {res.titleEn}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      ✍️ {res.authors}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {res.editionOrJournal} · {res.year}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lang === 'fa' ? res.summaryFa : res.summaryEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={res.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {isBook
                        ? lang === 'fa'
                          ? `دریافت کتاب (${res.platform})`
                          : `Download Book (${res.platform})`
                        : lang === 'fa'
                        ? `دریافت مقاله (${res.platform})`
                        : `Download Paper (${res.platform})`}
                    </span>
                  </a>

                  {res.doi && (
                    <a
                      href={`https://oa.mg/search?q=${encodeURIComponent(res.doi)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-mono shrink-0 inline-flex items-center gap-1"
                      title="DOI Lookup"
                    >
                      <span>DOI</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 1-Click Academic Engines Quick Grid */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>{lang === 'fa' ? 'کاوش مستقیم در ۷ پایگاه علمی دسترسی آزاد' : 'Direct Search on 7 Open Access Hubs'}</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {lang === 'fa'
                ? 'برای جستجوی هر موضوع یا کتاب خاص، روی هر کدام از موتورهای جستجو کلیک کنید:'
                : 'Click any engine to launch deep academic search:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href={`https://core.ac.uk/search?q=${encodeURIComponent(libSearchQuery || 'engineering')}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all space-y-1"
            >
              <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                <span>CORE</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'بزرگ‌ترین مجمع مقالات دانشگاهی (۲۵۰M+)' : '250M+ open papers'}
              </p>
            </a>

            <a
              href={`https://oa.mg/search?q=${encodeURIComponent(libSearchQuery || 'engineering')}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-500 hover:bg-sky-50/20 transition-all space-y-1"
            >
              <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                <span>OA.mg</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'موتور جستجوی مقالات علمی با هوش مصنوعی' : 'Smart paper search engine'}
              </p>
            </a>

            <a
              href={`https://doaj.org/search/articles?ref=doaj&q=${encodeURIComponent(libSearchQuery || 'engineering')}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-purple-500 hover:bg-purple-50/20 transition-all space-y-1"
            >
              <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                <span>DOAJ</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'دایرکتوری ژورنال‌های داوری‌شده معتبر' : 'Peer-reviewed open journals'}
              </p>
            </a>

            <a
              href={`https://libgen.rs/search.php?req=${encodeURIComponent(libSearchQuery || 'engineering')}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-amber-500 hover:bg-amber-50/20 transition-all space-y-1"
            >
              <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                <span>Library Genesis</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'دانلود کتاب‌های مرجع و تکست‌بوک‌ها' : 'Textbooks & reference manuals'}
              </p>
            </a>
          </div>

          {/* Browser Extensions & DOI Tools */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://unpaywall.org/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 hover:border-emerald-500 transition-all"
            >
              <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                <span>Unpaywall</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'افزونه کروم برای قفل سبز دانلود قانونی' : 'Browser extension for green legal locks'}
              </p>
            </a>

            <a
              href="https://openaccessbutton.org/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 hover:border-sky-500 transition-all"
            >
              <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                <span>Open Access Button</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'پیدا کردن نسخه آزاد با DOI یا URL' : 'Find free version with DOI or URL'}
              </p>
            </a>

            <a
              href="https://paperpanda.app/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 hover:border-indigo-500 transition-all"
            >
              <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                <span>PaperPanda</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'افزونه دانلود تک‌کلیک مقالات علمی' : '1-click academic paper downloader'}
              </p>
            </a>
          </div>

          {/* Quick DOI Lookup in Library */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 p-3.5 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'fa' ? 'جستجوی مستقیم شناسه دیجیتال (DOI):' : 'Direct DOI Resolver:'}
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={libDoiInput}
                onChange={(e) => setLibDoiInput(e.target.value)}
                placeholder="10.1109/..., 10.1016/... or article URL"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={libDoiInput.trim() ? `https://openaccessbutton.org/` : 'https://openaccessbutton.org/'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold inline-flex items-center gap-1"
                >
                  <span>OA Button</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={libDoiInput.trim() ? `https://oa.mg/search?q=${encodeURIComponent(libDoiInput.trim())}` : 'https://oa.mg/'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold inline-flex items-center gap-1"
                >
                  <span>OA.mg</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Advisory */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <span className="font-bold">
              {lang === 'fa' ? 'توصیه اخلاقی و پژوهشی دانشیار:' : 'DaneshYar Research Advisory:'}
            </span>
            <p className="leading-relaxed">
              {lang === 'fa'
                ? 'برای دسترسی قانونی و مطمئن، همواره اولویت اول شما استفاده از منابع رسمی Open Access (CORE و DOAJ) و مخازن رسمی دانشگاه‌ها باشد.'
                : 'Prioritize open-access repositories and official institutional archives for compliant scholarly literature.'}
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Add Custom Library Resource Modal */}
    {showAddLibModal && (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="glass-surface bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'افزودن کتاب یا مقاله به کتابخانه' : 'Add Book or Paper to Library'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddLibModal(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveLibResource} className="space-y-3.5">
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setNewLibType('book')}
                className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-colors ${
                  newLibType === 'book'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {lang === 'fa' ? 'کتاب مرجع (Textbook)' : 'Textbook'}
              </button>
              <button
                type="button"
                onClick={() => setNewLibType('paper')}
                className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-colors ${
                  newLibType === 'paper'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {lang === 'fa' ? 'مقاله علمی / ISI' : 'Research Paper'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'fa' ? 'عنوان فارسی منبع:' : 'Persian Title:'}
              </label>
              <input
                type="text"
                required
                value={newLibTitleFa}
                onChange={(e) => setNewLibTitleFa(e.target.value)}
                placeholder="مثلاً: طراحی مدارهای مجتمع CMOS"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'fa' ? 'عنوان انگلیسی منبع:' : 'English Title:'}
              </label>
              <input
                type="text"
                value={newLibTitleEn}
                onChange={(e) => setNewLibTitleEn(e.target.value)}
                placeholder="e.g. Design of Analog CMOS Integrated Circuits"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'fa' ? 'نویسنده / نویسندگان:' : 'Authors:'}
                </label>
                <input
                  type="text"
                  value={newLibAuthors}
                  onChange={(e) => setNewLibAuthors(e.target.value)}
                  placeholder="e.g. Behzad Razavi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'fa' ? 'پلتفرم:' : 'Platform:'}
                </label>
                <select
                  value={newLibPlatform}
                  onChange={(e) => setNewLibPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
                >
                  <option value="LibGen">Library Genesis (LibGen)</option>
                  <option value="CORE">CORE (مخازن رسمی)</option>
                  <option value="DOAJ">DOAJ (دسترسی آزاد)</option>
                  <option value="OA.mg">OA.mg (جستجوی هوشمند)</option>
                  <option value="Unpaywall">Unpaywall</option>
                  <option value="OpenAccessButton">Open Access Button</option>
                  <option value="PaperPanda">PaperPanda</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'fa' ? 'لینک دانلود مستقیم یا DOI:' : 'Download Link or DOI:'}
              </label>
              <input
                type="text"
                value={newLibUrl}
                onChange={(e) => setNewLibUrl(e.target.value)}
                placeholder="https://... یا خالی برای جستجوی خودکار در پایگاه"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddLibModal(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                {lang === 'fa' ? 'ذخیره در کتابخانه' : 'Save to Library'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

      {/* Article Creation & Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handlePublishArticle}
            className="glass-surface bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ویرایشگر انتشار مقاله علمی جدید' : 'Publish New Engineering Guide'}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={titleFa}
                onChange={(e) => setTitleFa(e.target.value)}
                placeholder={lang === 'fa' ? 'عنوان مقاله مهندسی' : 'Article Title'}
                className="sm:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={categoryFa}
                onChange={(e) => setCategoryFa(e.target.value)}
                placeholder={lang === 'fa' ? 'دسته‌بندی (مثلاً برق و کنترل)' : 'Category'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
              >
                <option value="introductory">{lang === 'fa' ? 'پایه' : 'Introductory'}</option>
                <option value="intermediate">{lang === 'fa' ? 'تخصصی' : 'Intermediate'}</option>
                <option value="advanced">{lang === 'fa' ? 'پیشرفته' : 'Advanced'}</option>
              </select>
              <input
                type="text"
                value={authorFa}
                onChange={(e) => setAuthorFa(e.target.value)}
                placeholder={lang === 'fa' ? 'نام نویسنده' : 'Author'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="number"
                min={1}
                max={45}
                value={readMinutes}
                onChange={(e) => setReadMinutes(Number(e.target.value))}
                placeholder="6"
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            <input
              type="text"
              value={excerptFa}
              onChange={(e) => setExcerptFa(e.target.value)}
              placeholder={lang === 'fa' ? 'چکیده کوتاه مقاله (۱ تا ۲ خط)' : 'Short summary excerpt'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {lang === 'fa' ? 'متن مقاله (با پشتیبانی Markdown و فرمول‌های $...$ و $$...$$)' : 'Article Body (Markdown + LaTeX)'}
              </label>
              <textarea
                rows={6}
                required
                value={markdownFa}
                onChange={(e) => setMarkdownFa(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={codeTitle}
                onChange={(e) => setCodeTitle(e.target.value)}
                placeholder={lang === 'fa' ? 'عنوان قطعه کد (اختیاری)' : 'Code snippet title (optional)'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={takeawaysInput}
                onChange={(e) => setTakeawaysInput(e.target.value)}
                placeholder={lang === 'fa' ? 'نکته کلیدی مقاله (اختیاری)' : 'Key takeaway (optional)'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {codeTitle && (
              <textarea
                rows={3}
                dir="ltr"
                value={codeBody}
                onChange={(e) => setCodeBody(e.target.value)}
                placeholder="# Python / MATLAB / C++ snippet"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 p-3 text-xs font-mono text-sky-100"
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'انتشار در مجله علمی' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
