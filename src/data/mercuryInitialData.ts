import {
  MercuryBot,
  MercuryFact,
  MercuryMessage,
  MercuryPermissionConfig,
  MercurySoulConfig,
} from '../types/app';

export const INITIAL_MERCURY_BOTS: MercuryBot[] = [
  {
    id: 'archimedes',
    nameFa: 'ارشمیدس (Archimedes)',
    nameEn: 'Archimedes',
    roleFa: 'متخصص مکانیک، سیالات، ترمودینامیک و ارتعاشات سازه',
    roleEn: 'Mechanics, Fluids, Thermo & Vibrations Specialist',
    avatarIcon: 'Cpu',
    status: 'idle',
    scheduleCron: '0 8 * * *',
    deliverablesFolder: 'artifacts/mechanics/',
    skills: ['FEM Analysis', 'Euler-Bernoulli Beam', 'Navier-Stokes', 'Carnot Cycles'],
    dailyBudgetTokens: 120000,
    usedTokensToday: 18400,
    personaSummary: 'دقیق، متمرکز بر شهود فیزیکی و اثبات روابط تعادل نیروها و بقای انرژی.',
    recentDeliverables: [
      {
        id: 'deliv-1',
        titleFa: 'تحلیل ارتعاشات تیر یک‌سر گیردار با تشدید هماهنگ',
        titleEn: 'Cantilever Beam Harmonic Resonance Derivation',
        fileName: 'harmonic_beam_deflection.pdf',
        createdAt: 'دیروز ۱۶:۴۵',
        summary: 'محاسبه فرکانس‌های طبیعی و شکل مودهای الاستیک با تقریب ریلی-ریتز.',
      },
    ],
  },
  {
    id: 'turing',
    nameFa: 'آلن تورینگ (Alan Turing)',
    nameEn: 'Alan Turing',
    roleFa: 'متخصص الگوریتم، ساختمان داده، سیستم‌های عامل و امنیت',
    roleEn: 'Algorithms, Data Structures & OS Architect',
    avatarIcon: 'Terminal',
    status: 'idle',
    scheduleCron: '0 10 * * *',
    deliverablesFolder: 'artifacts/algorithms/',
    skills: ['Dynamic Programming', 'Graph Theory', 'Time Complexity', 'Memory Paging'],
    dailyBudgetTokens: 150000,
    usedTokensToday: 32100,
    personaSummary: 'تحلیلی، با تمرکز بر پیچیدگی زمانی O(n) و بهینه‌سازی مصرف حافظه.',
    recentDeliverables: [
      {
        id: 'deliv-2',
        titleFa: 'پیاده‌سازی بهینه درخت سگمنت و شار بیشینه ادموندز-کارپ',
        titleEn: 'Optimized Segment Tree & Max-Flow Implementations',
        fileName: 'segment_tree_and_flow.ts',
        createdAt: 'امروز ۱۰:۱۵',
        summary: 'تست‌های واحد جامع همراه با تحلیل مصرف حافظه و اثبات همگرایی.',
      },
    ],
  },
  {
    id: 'euler',
    nameFa: 'لئونارد اویلر (Leonhard Euler)',
    nameEn: 'Leonhard Euler',
    roleFa: 'متخصص مدارهای الکتریکی، الکترومغناطیس، سیگنال‌ها و سیستم‌های کنترل',
    roleEn: 'Circuits, Electromagnetics & Control Systems Lead',
    avatarIcon: 'Zap',
    status: 'idle',
    scheduleCron: '0 12 * * *',
    deliverablesFolder: 'artifacts/circuits/',
    skills: ['State-Space Control', 'Laplace Transforms', 'Fourier Series', 'Bode/Nyquist Stability'],
    dailyBudgetTokens: 140000,
    usedTokensToday: 21500,
    personaSummary: 'استاد پیوند ریاضیات پیوسته به مدارهای فیزیکی و پاسخ گذرای سیستم‌های خطی.',
    recentDeliverables: [
      {
        id: 'deliv-3',
        titleFa: 'طراحی کنترل‌کننده فیدبک حالت و مشاهده‌گر لونبرگر',
        titleEn: 'Full State Feedback & Luenberger Observer Synthesis',
        fileName: 'state_feedback_control.m',
        createdAt: '۲ روز پیش',
        summary: 'جانمایی قطب‌ها با فرمول اکرمن و بررسی حاشیه فاز و بهره.',
      },
    ],
  },
  {
    id: 'hypatia',
    nameFa: 'هیپاتیا (Hypatia)',
    nameEn: 'Hypatia',
    roleFa: 'متخصص متون علمی، نگارش مقالات ISI، استخراج فرضیات و مراجع دانشگاهی',
    roleEn: 'Academic Literature, ISI Papers & Scientific Methodology',
    avatarIcon: 'BookOpen',
    status: 'idle',
    scheduleCron: '0 14 * * *',
    deliverablesFolder: 'artifacts/papers/',
    skills: ['LaTeX Typesetting', 'Peer Review', 'Systematic Literature Review', 'Citation Graph'],
    dailyBudgetTokens: 100000,
    usedTokensToday: 14200,
    personaSummary: 'سخت‌گیر در استناد علمی، شیوای کلام و انطباق کامل با استانداردهای IEEE و Elsevier.',
    recentDeliverables: [
      {
        id: 'deliv-4',
        titleFa: 'مرور نظام‌مند کاربردهای یادگیری تقویتی در بهینه‌سازی شبکه برق هوشمند',
        titleEn: 'Systematic Review of RL in Smart Grid Dispatch',
        fileName: 'smart_grid_rl_survey.tex',
        createdAt: '۳ روز پیش',
        summary: 'طبقه‌بندی ۵۴ مقاله برتر با شاخص‌های اعتبارسنجی و ماتریس مقایسه.',
      },
    ],
  },
];

export const INITIAL_MERCURY_FACTS: MercuryFact[] = [
  {
    id: 'fact-1',
    category: 'academic_goal',
    statementFa: 'کاربر دانشجوی مهندسی دانشگاه است و قصد آمادگی برای امتحانات پایان‌ترم و حل مسائل امتحانی را دارد.',
    statementEn: 'User is an engineering university student preparing for end-term exams and problem-solving.',
    confidence: 0.98,
    source: 'تنظیمات اولیه نمایه کاربری',
    createdAt: '۱۴۰۴/۰۸/۰۱',
  },
  {
    id: 'fact-2',
    category: 'preference',
    statementFa: 'کاربر ترجیح می‌دهد تمام فرمول‌های ریاضی و فیزیک با نمادگذاری دقیق KaTeX / LaTeX و توضیحات مرحله‌به‌مرحله فارسی نمایش داده شوند.',
    statementEn: 'Prefers all mathematical and physical equations rendered in strict KaTeX LaTeX with step-by-step Persian derivations.',
    confidence: 0.95,
    source: 'تاریخچه گفتگوهای حل تمرین',
    createdAt: '۱۴۰۴/۰۸/۰۳',
  },
  {
    id: 'fact-3',
    category: 'project',
    statementFa: 'پروژه‌های در حال توسعه شامل شبیه‌سازهای سه‌بعدی وب، استودیوی کلودبل و هسته استنتاج محلی استراتا هستند.',
    statementEn: 'Active projects include 3D WebGL simulators, Claudable studio, and Strata local inference.',
    confidence: 0.99,
    source: 'مخزن پروژه دانشیار',
    createdAt: '۱۴۰۴/۰۸/۱۰',
  },
];

export const INITIAL_MERCURY_SOUL: MercurySoulConfig = {
  soulMarkdown: `# DaneshYar Mercury Agent Soul (روح دانشیار مرکیوری)

نام عامل: دانشیار مرکیوری (DaneshYar Mercury)
هویت: همراه هوشمند، خودگردان، امین و مغز دوم دانشجویان مهندسی دانشگاه‌های ایران.

## اصول رفتاری پایه‌ای:
۱. همواره پاسخ‌ها را مستدل، دقیق و علمی با استناد به مبانی فیزیکی و ریاضی ارائه بده.
۲. از حدس‌های اثبات‌نشده بپرهیز؛ اگر بخشی از مسئله مجهول است صریحاً اعلام کن.
۳. در حل مسائل، ابتدا ایده و شهود فیزیکی را بیان کن، سپس فرمول ریاضی LaTeX و در نهایت نتیجه عددی و تحلیل مهندسی.
۴. زبان پیش‌فرض: فارسی سلیس، شیوا و دانشگاهی با اصطلاحات استاندارد مهندسی.`,
  personaMarkdown: `# Persona Directive
دانشیار مرکیوری نقش مربی دانشگاهی دلسوز، پژوهشگر خستگی‌ناپذیر و معمار نرم‌افزار ارشد را ایفا می‌کند. لحن آن مؤدبانه، پرانرژی و مشوق اندیشه مستقل دانشجو است.`,
  tasteMarkdown: `# Engineering Taste
طراحی مینیمال، معماری تمیز (Clean Architecture)، نمودارهای شفاف با رنگ‌های مهندسی (Sky, Emerald, Amber, Slate)، فرمول‌های ریاضی تمیز بدون حروف اضافه.`,
  heartbeatMarkdown: `# Daily Heartbeat Routine
هر روز ساعت ۸ صبح وضعیت ربات‌های تخصصی بررسی شده، خلاصه مطالعات جدید ثبت و یادگیری‌های روز قبل مرور می‌گردد.`,
};

export const INITIAL_MERCURY_PERMISSIONS: MercuryPermissionConfig = {
  askBeforeShell: true,
  askBeforeFileWrite: false,
  ssrfGuardEnabled: true,
  scopedFolders: ['artifacts/', 'data/', 'src/'],
  blockedShellCommands: ['rm -rf /', ':(){ :|:& };:', 'mkfs', 'dd if='],
  dailyTokenLimit: 500000,
  tokensConsumedToday: 86200,
  tokenSaverActive: true,
};

export const INITIAL_MERCURY_MESSAGES: MercuryMessage[] = [
  {
    id: 'merc-msg-init',
    sender: 'agent',
    text: 'سلام! من دانشیار مرکیوری هستم؛ مغز دوم و ایجنت خودگردان مهندسی شما. ربات‌های تخصصی من (ارشمیدس، تورینگ، اویلر و هیپاتیا) در سرور آماده حل مسئله، کدنویسی، شبیه‌سازی و تولید خروجی‌های دانشگاهی هستند.',
    timestamp: 'هم‌اکنون',
  },
];
