import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import {
  GoogleGenAI,
  ThinkingLevel,
  Type,
  Modality,
  LiveServerMessage,
} from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseJsonSafe<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      return fallback;
    }
  }
}

function formatApiError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('GEMINI_API_KEY')) {
    return { status: 500, message: 'کلید هوش مصنوعی در تنظیمات سرور پیکربندی نشده است (Settings > Secrets).' };
  }
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    return { status: 429, message: 'سهمیه موقت درخواست‌ها پر شده است؛ لطفاً چند لحظه دیگر دوباره تلاش کنید.' };
  }
  if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand')) {
    return { status: 503, message: 'سرویس هوش مصنوعی موقتاً شلوغ است؛ لطفاً چند ثانیه دیگر دوباره تلاش کنید.' };
  }
  if (msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('API_KEY_INVALID')) {
    return { status: 403, message: 'دسترسی کلید API معتبر نیست؛ لطفاً در بخش Settings > Secrets بررسی کنید.' };
  }
  return { status: 500, message: msg || 'خطای غیرمنتظره در پردازش درخواست.' };
}

// ============================================================================
// Server-Side Store for Lecture Notes, Peer Ratings & Community Forum
// ============================================================================
interface LectureNote {
  id: string;
  titleFa: string;
  titleEn: string;
  courseCode: string;
  fieldFa: string;
  fieldEn: string;
  author: string;
  university: string;
  pages: number;
  ratingSum: number;
  ratingCount: number;
  downloads: number;
  summaryFa: string;
  summaryEn: string;
  previewFormula: string;
  contentSnippet: string;
  createdAt: string;
}

const lectureNotesStore: LectureNote[] = [
  {
    id: 'note-ee-201',
    titleFa: 'جزوه جامع مدارهای الکتریکی ۱ (گره، مش، تونن و مدارهای مرتبه اول/دوم)',
    titleEn: 'Circuits I Complete Notes (Nodal, Mesh, Thevenin & RLC Transients)',
    courseCode: 'EE-201',
    fieldFa: 'مهندسی برق',
    fieldEn: 'Electrical Engineering',
    author: 'سارا محمدی',
    university: 'دانشگاه صنعتی شریف',
    pages: 64,
    ratingSum: 186,
    ratingCount: 39,
    downloads: 1420,
    summaryFa: 'تحلیل کامل مدارهای مقاومتی، قضایای تونن و نورتن، پاسخ طبیعی و پله مدارهای RC، RL و RLC سری و موازی به همراه مثال‌های امتحانی حل‌شده.',
    summaryEn: 'Complete resistive analysis, Thevenin/Norton equivalents, natural and step responses of RC, RL, and RLC circuits with solved exam problems.',
    previewFormula: 'L\\frac{d^2i}{dt^2} + R\\frac{di}{dt} + \\frac{1}{C}i = \\frac{dv_s}{dt}',
    contentSnippet: 'قضیه تونن: هر شبکه خطی دوقطبی را می‌توان با یک منبع ولتاژ مستقل V_th سری با یک مقاومت معادل R_th جایگزین کرد. برای محاسبه R_th در حضور منابع وابسته از روش منبع تست استفاده می‌کنیم.',
    createdAt: '1404/08/12',
  },
  {
    id: 'note-math-102',
    titleFa: 'فرمول‌نامه کامل ریاضی عمومی ۲ و انتگرال‌های چندگانه و برداری',
    titleEn: 'Calculus II & Vector Calculus Cheat-Sheet (Stokes & Divergence)',
    courseCode: 'MATH-102',
    fieldFa: 'ریاضیات پایه مهندسی',
    fieldEn: 'Engineering Mathematics',
    author: 'امیرحسین رضایی',
    university: 'دانشگاه تهران',
    pages: 28,
    ratingSum: 245,
    ratingCount: 51,
    downloads: 2380,
    summaryFa: 'خلاصه فشرده مختصات استوانه‌ای و کروی، انتگرال خط و سطح، قضایای گرین، استوکس و دیورژانس گاوس ویژه مرور شب امتحان.',
    summaryEn: 'Compact cheat-sheet for cylindrical/spherical coordinates, line & surface integrals, Green, Stokes, and Gauss Divergence theorems.',
    previewFormula: '\\iint_{\\Sigma} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_{\\partial\\Sigma} \\mathbf{F} \\cdot d\\mathbf{r}',
    contentSnippet: 'قضیه دیورژانس گاوس شار خروجی یک میدان برداری از یک سطح بسته را به انتگرال سه‌گانه دیورژانس میدان در حجم محصور تبدیل می‌کند. ژاکوبین در مختصات کروی برابر با rho^2 * sin(phi) است.',
    createdAt: '1404/08/05',
  },
  {
    id: 'note-me-204',
    titleFa: 'خلاصه ترمودینامیک ۱ و ۲ (قانون اول، آنتروپی و چرخه‌های توان)',
    titleEn: 'Engineering Thermodynamics Summary (Laws, Entropy & Power Cycles)',
    courseCode: 'ME-204',
    fieldFa: 'مهندسی مکانیک',
    fieldEn: 'Mechanical Engineering',
    author: 'کیانوش فرهادی',
    university: 'دانشگاه صنعتی امیرکبیر',
    pages: 52,
    ratingSum: 142,
    ratingCount: 30,
    downloads: 980,
    summaryFa: 'جداول بخار، تحلیل حجم کنترل، چرخه کارنو، رانکین، برایتون و اوتو همراه با نمودارهای T-s و P-v و نکات تستی کنکور ارشد.',
    summaryEn: 'Steam tables, control volume analysis, Carnot, Rankine, Brayton, and Otto cycles with T-s and P-v diagrams.',
    previewFormula: '\\Delta S_{\\text{gen}} = \\Delta S_{\\text{sys}} + \\sum \\frac{\\dot{Q}_k}{T_k} \\ge 0',
    contentSnippet: 'در چرخه رانکین ایده‌آل، پمپ و توربین فرآیندهای آیزنتروپیک (تک‌دما-برگشت‌پذیر و بی‌دررو) دارند. راندمان حرارتی برابر است با نسبت کار خالص به گرمای ورودی در بویلر.',
    createdAt: '1404/07/28',
  },
  {
    id: 'note-cs-301',
    titleFa: 'جزوه طراحی الگوریتم‌ها (تقسیم و حل، برنامه‌ریزی پویا و گراف)',
    titleEn: 'Algorithm Design Lecture Notes (Divide & Conquer, DP & Graphs)',
    courseCode: 'CS-301',
    fieldFa: 'مهندسی کامپیوتر',
    fieldEn: 'Computer Engineering',
    author: 'مهسا کاظمی',
    university: 'دانشگاه صنعتی اصفهان',
    pages: 74,
    ratingSum: 215,
    ratingCount: 44,
    downloads: 1890,
    summaryFa: 'قضیه مستر، الگوریتم‌های حریصانه، برنامه‌ریزی پویا (کوله‌پشتی، LCS، ماتریس)، کوتاه‌ترین مسیر دایکسترا و بلمن-فورد و پیچیدگی NP-Complete.',
    summaryEn: 'Master theorem, greedy algorithms, dynamic programming, Dijkstra, Bellman-Ford, and NP-completeness proofs.',
    previewFormula: 'T(n) = aT\\left(\\frac{n}{b}\\right) + f(n) \\implies \\Theta(n^{\\log_b a})',
    contentSnippet: 'برنامه‌ریزی پویا زمانی کاربرد دارد که مساله دارای زیرساختار بهینه و زیرمسئله‌های هم‌پوشان باشد. در مقایسه با تقسیم و حل، پاسخ زیرمسئله‌ها در جدول ذخیره (Memoize) می‌شود.',
    createdAt: '1404/07/19',
  },
  {
    id: 'note-ce-210',
    titleFa: 'تحلیل سازه‌های ۱ (خطوط تاثیر، خرپا و تغییر مکان با کار مجازی)',
    titleEn: 'Structural Analysis I (Influence Lines, Trusses & Virtual Work)',
    courseCode: 'CE-210',
    fieldFa: 'مهندسی عمران',
    fieldEn: 'Civil Engineering',
    author: 'پویا شریفی',
    university: 'دانشگاه علم و صنعت ایران',
    pages: 48,
    ratingSum: 118,
    ratingCount: 25,
    downloads: 760,
    summaryFa: 'تعیین درجه نامعینی سازه‌ها، رسم نمودار لنگر و برش، روش کار مجازی برای تغییرمکان تیرها و قاب‌ها و قضیه مولر-برسلاو.',
    summaryEn: 'Determinacy & stability, shear/moment diagrams, virtual work deflections, and Muller-Breslau principle.',
    previewFormula: '1 \\cdot \\Delta = \\int_0^L \\frac{m(x) M(x)}{EI} dx + \\sum \\frac{n_i N_i L_i}{E_i A_i}',
    contentSnippet: 'در روش کار مجازی واحد، یک بار واحد مجازی در جهت تغییرمکان مطلوب اعمال می‌شود و کار خارجی مجازی با انرژی کرنشی درونی مجازی برابر قرار می‌گیرد.',
    createdAt: '1404/07/04',
  },
];

interface ForumReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface ForumThread {
  id: string;
  title: string;
  body: string;
  field: string;
  courseCode: string;
  author: string;
  upvotes: number;
  solved: boolean;
  createdAt: string;
  replies: ForumReply[];
}

const forumThreadsStore: ForumThread[] = [
  {
    id: 'th-1',
    title: 'تفاوت شهودی تبدیل لاپلاس و تبدیل فوریه در تحلیل مدارهای RLC چیست؟',
    body: 'در کتاب هیت و سادیکو هر دو تبدیل برای رفتن به حوزه فرکانس استفاده می‌شوند، اما دقیقاً چه زمانی باید به جای jω از s = σ + jω استفاده کنیم؟',
    field: 'مهندسی برق',
    courseCode: 'EE-202',
    author: 'نیما افشاری',
    upvotes: 24,
    solved: true,
    createdAt: '۲ ساعت پیش',
    replies: [
      {
        id: 'rep-1',
        author: 'دکتر پارسا (دستیار علمی)',
        text: 'تبدیل فوریه روی محور موهومی (σ = 0) تعریف می‌شود و فقط برای سیگنال‌های پایدار و پاسخ حالت ماندگار مناسب است. اما لاپلاس عامل میرایی σ را هم وارد می‌کند تا پاسخ گذرا (Transient)، شرایط اولیه خازن/سلف و مدارهای ناپایدار را هم تحلیل کند.',
        createdAt: '۱ ساعت پیش',
      },
    ],
  },
  {
    id: 'th-2',
    title: 'چطور در برنامه‌ریزی پویا (Dynamic Programming) رابطه بازگشتی را بدون سردرگمی بنویسیم؟',
    body: 'مخصوصاً در مسائل رشته‌ای مثل Edit Distance و Longest Common Subsequence همیشه سر تعریف وضعیت dp[i][j] گیر می‌کنم.',
    field: 'مهندسی کامپیوتر',
    courseCode: 'CS-301',
    author: 'زهرا کریمی',
    upvotes: 19,
    solved: false,
    createdAt: '۵ ساعت پیش',
    replies: [
      {
        id: 'rep-2',
        author: 'مهسا کاظمی',
        text: 'بهترین روش این است که ابتدا با کلمات دقیق فارسی تعریف کنی dp[i][j] یعنی پاسخ بهینه برای پیشوند طول i از رشته اول و طول j از رشته دوم؛ بعد فقط آخرین تصمیم (حذف، درج، جایگزینی) را مدل کنی.',
        createdAt: '۳ ساعت پیش',
      },
    ],
  },
  {
    id: 'th-3',
    title: 'معیار انتخاب مختصات استوانه‌ای در مقابل کروی برای انتگرال‌های سه‌گانه در ریاضی ۲',
    body: 'سر جلسه امتحان چطور سریع تشخیص بدهم ناحیه انتگرال‌گیری به روش استوانه‌ای ساده‌تر حل می‌شود یا کروی؟',
    field: 'ریاضیات پایه مهندسی',
    courseCode: 'MATH-102',
    author: 'رضا تهرانی',
    upvotes: 31,
    solved: true,
    createdAt: 'دیروز',
    replies: [
      {
        id: 'rep-3',
        author: 'امیرحسین رضایی',
        text: 'اگر محور تقارن تقاطع یک مخروط و استوانه یا سهمی‌گون با محور z باشد (x²+y² همراه با z)، مختصات استوانه‌ای ایده‌آل است. اما اگر x²+y²+z² در صورت انتگرال‌ده یا مرز کره ظاهر شود، کروی بهترین انتخاب است.',
        createdAt: 'دیروز',
      },
    ],
  },
];

// ============================================================================
// Admin Panel Stores (Users, Logs, AI Tuning, Analytics)
// ============================================================================
interface AdminUser {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  role: 'Student' | 'Professor' | 'Admin' | 'Moderator';
  status: 'active' | 'suspended';
  lastActive: string;
  queriesCount: number;
}

const adminUsersStore: AdminUser[] = [
  {
    id: 'u-1',
    name: 'دکتر مریم شریعتی',
    email: 'm.shariati@sharif.edu',
    university: 'صنعتی شریف',
    major: 'مهندسی برق و کنترل',
    role: 'Professor',
    status: 'active',
    lastActive: '۵ دقیقه پیش',
    queriesCount: 312,
  },
  {
    id: 'u-2',
    name: 'امیرحسین رضایی',
    email: 'a.rezaei@ut.ac.ir',
    university: 'دانشگاه تهران',
    major: 'مهندسی برق',
    role: 'Moderator',
    status: 'active',
    lastActive: '۱۲ دقیقه پیش',
    queriesCount: 184,
  },
  {
    id: 'u-3',
    name: 'سارا محمدی',
    email: 's.mohammadi@sharif.edu',
    university: 'صنعتی شریف',
    major: 'مهندسی کامپیوتر',
    role: 'Admin',
    status: 'active',
    lastActive: 'آنلاین',
    queriesCount: 429,
  },
  {
    id: 'u-4',
    name: 'کیانوش فرهادی',
    email: 'k.farhadi@aut.ac.ir',
    university: 'صنعتی امیرکبیر',
    major: 'مهندسی مکانیک',
    role: 'Student',
    status: 'active',
    lastActive: '۱ ساعت پیش',
    queriesCount: 97,
  },
  {
    id: 'u-5',
    name: 'مهسا کاظمی',
    email: 'm.kazemi@iut.ac.ir',
    university: 'صنعتی اصفهان',
    major: 'هوش مصنوعی',
    role: 'Student',
    status: 'active',
    lastActive: '۳ ساعت پیش',
    queriesCount: 146,
  },
  {
    id: 'u-6',
    name: 'پویا شریفی',
    email: 'p.sharifi@iust.ac.ir',
    university: 'علم و صنعت',
    major: 'مهندسی عمران',
    role: 'Student',
    status: 'suspended',
    lastActive: '۲ روز پیش',
    queriesCount: 28,
  },
];

interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

const adminActivityLogs: ActivityLog[] = [
  { id: 'log-1', actor: 'سارا محمدی', action: 'تنظیم پرامپت فاینمن', target: 'AI Engine Config', timestamp: '۱۰:۲۴' },
  { id: 'log-2', actor: 'دکتر مریم شریعتی', action: 'انتشار مقاله جدید', target: 'درک شهودی تبدیل لاپلاس', timestamp: '۰۹:۵۰' },
  { id: 'log-3', actor: 'امیرحسین رضایی', action: 'تایید پاسخ انجمن', target: 'تفاوت لاپلاس و فوریه (EE-202)', timestamp: '۰۹:۱۲' },
  { id: 'log-4', actor: 'کیانوش فرهادی', action: 'بارگذاری جزوه PDF', target: 'ME-204 ترمودینامیک', timestamp: 'دیروز' },
];

interface AiTuningConfig {
  systemPrompt: string;
  temperature: number;
  feynmanStyle: 'storytelling' | 'balanced' | 'rigorous';
  thinkingLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

let aiTuningConfig: AiTuningConfig = {
  systemPrompt:
    'تو «دانشیار» هستی، استاد و دستیار هوشمند آموزش مهندسی دانشگاهی. مفاهیم را با دقت علمی، مثال‌های شهودی روزمره، پرهیز از پیچیدگی غیرضروری و فرمول‌های استاندارد LaTeX آموزش بده.',
  temperature: 0.4,
  feynmanStyle: 'balanced',
  thinkingLevel: 'HIGH',
};

const aiQueryStats = {
  feynman: 1240,
  formulaSolver: 890,
  quiz: 615,
  chatBot: 430,
  pdfExtract: 318,
};

// ============================================================================
// Scientific Articles Hub Store
// ============================================================================
interface ScientificArticleRecord {
  id: string;
  titleFa: string;
  titleEn: string;
  categoryFa: string;
  categoryEn: string;
  difficulty: 'introductory' | 'intermediate' | 'advanced';
  authorFa: string;
  authorEn: string;
  readMinutes: number;
  date: string;
  image: string;
  excerptFa: string;
  excerptEn: string;
  markdownFa: string;
  markdownEn: string;
  codeSnippet?: { language: string; title: string; code: string };
  takeawaysFa: string[];
  takeawaysEn: string[];
}

const articlesStore: ScientificArticleRecord[] = [
  {
    id: 'art-laplace-intuition',
    titleFa: 'درک شهودی تبدیل لاپلاس: کوچ مهندسان از حوزه زمان به صفحه s',
    titleEn: 'Intuitive Laplace Transforms: Leaving the Time Domain',
    categoryFa: 'برق و کنترل',
    categoryEn: 'Electrical & Control',
    difficulty: 'intermediate',
    authorFa: 'دکتر مریم شریعتی',
    authorEn: 'Dr. Maryam Shariati',
    readMinutes: 7,
    date: '۱۴۰۴/۰۸/۱۲',
    image: '/src/assets/images/course_electrical_circuits_1795017176720.jpg',
    excerptFa: 'چگونه معادلات دیفرانسیل مرتبه بالای مدارهای RLC به جبر ساده تبدیل می‌شوند و مکان قطب‌ها پایداری سیستم را پیش‌بینی می‌کند؟',
    excerptEn: 'How higher-order RLC differential equations reduce to polynomial algebra and how pole locations dictate stability.',
    markdownFa: `## چرا حوزه زمان همیشه کافی نیست؟\nقوانین فیزیکی خازن و سلف به شکل مشتق و انتگرال ظاهر می‌شوند. حل هم‌زمان چند حلقه KVL در حوزه زمان به معادلات دیفرانسیل جفت‌شده منجر می‌شود.\n\n## تعریف دقیق تبدیل لاپلاس یک‌طرفه\nبا ضرب تابع در هسته نمایی مختلط $e^{-st}$ که در آن $s = \\sigma + j\\omega$ است، هم فرکانس نوسان ($\\omega$) و هم نرخ میرایی ($\\sigma$) را مدل می‌کنیم:\n\n$$F(s) = \\int_0^\\infty f(t) e^{-(\\sigma + j\\omega)t}\\,dt$$\n\n## خواندن پایداری از روی صفحه مختلط\nاگر تمام قطب‌های تابع تبدیل $H(s)$ در نیم‌صفحه چپ محور موهومی قرار بگیرند ($\\text{Re}(p_k) < 0$)، پاسخ ضربه سیستم به صفر میل کرده و سیستم پایدار BIBO است.`,
    markdownEn: `## Why Time Domain Isn't Always Enough\nPhysical laws for capacitors and inductors appear as derivatives and integrals. Coupled KVL loops produce intricate ODE systems.\n\n## One-Sided Laplace Transform\nBy projecting signals onto complex exponentials $e^{-st}$ with $s = \\sigma + j\\omega$, we capture both oscillation frequency and exponential damping:\n\n$$F(s) = \\int_0^\\infty f(t) e^{-(\\sigma + j\\omega)t}\\,dt$$\n\n## Reading Stability Directly from Poles\nWhen every pole of $H(s)$ lies strictly in the left-half s-plane ($\\text{Re}(p_k) < 0$), transient modes decay and the system is BIBO stable.`,
    codeSnippet: {
      language: 'python',
      title: 'Step Response Simulation (SciPy / Control)',
      code: `import numpy as np
from scipy import signal

# H(s) = 1 / (L*s^2 + R*s + 1/C)
R, L, C = 4.0, 1.0, 0.04
sys = signal.TransferFunction([1.0], [L, R, 1.0 / C])
t, y = signal.step(sys)
poles = sys.poles
print("System Poles:", poles)  # Real parts < 0 => Stable`,
    },
    takeawaysFa: [
      'مشتق‌گیری در حوزه زمان معادل ضرب در s و لحاظ کردن شرایط اولیه در حوزه لاپلاس است.',
      'بخش حقیقی قطب (σ) سرعت میرایی و بخش موهومی (ω) فرکانس نوسان را تعیین می‌کند.',
      'قطب‌های روی محور موهومی نشان‌دهنده نوسان پایدار بدون میرایی (اسیلاتور) هستند.',
    ],
    takeawaysEn: [
      'Time differentiation maps to algebraic multiplication by s minus initial state terms.',
      'Real part σ governs decay rate while imaginary part ω sets oscillation frequency.',
      'Poles on the jω axis produce undamped sustained oscillation.',
    ],
  },
  {
    id: 'art-dp-dag',
    titleFa: 'نگاشت برنامه‌ریزی پویا به کوتاه‌ترین مسیر در گراف‌های DAG',
    titleEn: 'Mapping Dynamic Programming to Shortest Paths on DAGs',
    categoryFa: 'الگوریتم و نرم‌افزار',
    categoryEn: 'Algorithms & CS',
    difficulty: 'advanced',
    authorFa: 'دکتر الناز بهرامی',
    authorEn: 'Dr. Elnaz Bahrami',
    readMinutes: 6,
    date: '۱۴۰۴/۰۸/۰۵',
    image: '/src/assets/images/course_algorithms_cs_1795017178932.jpg',
    excerptFa: 'یکپارچه‌سازی تئوری گراف و برنامه‌ریزی پویا: چرا هر رابطه بازگشتی معتبر یک گراف بدون دور جهت‌دار است.',
    excerptEn: 'Unifying graph theory and dynamic programming through topological orderings on directed acyclic state graphs.',
    markdownFa: `## هم‌ارزی بنیادین DP و گراف‌های بدون دور\nدر هر مسئله برنامه‌ریزی پویا، وضعیت‌ها (States) راس‌های یک گراف و گذارهای تصمیم‌گیری یال‌های جهت‌دار وزن‌دار هستند. شرط بدون دور بودن (Acyclic) تضمین می‌کند که زیرمسئله‌ها به خودشان وابسته نباشند.\n\n## رابطه بازگشتی بهینگی بلمن\n$$d(v) = \\min_{(u,v) \\in E} \\{ d(u) + w(u,v) \\}$$\n\n## ترتیب توپولوژیک و پیاده‌سازی تمیز\nبا مرتب‌سازی توپولوژیک در زمان $O(V+E)$، جدول بهینه‌سازی بدون نیاز به پشته بازگشتی عمیق پر می‌شود.`,
    markdownEn: `## Core Equivalence of DP and DAGs\nEach DP state acts as a graph vertex and each transition as a weighted directed edge. Acyclicity guarantees well-defined subproblem ordering.\n\n## Bellman Optimality Recurrence\n$$d(v) = \\min_{(u,v) \\in E} \\{ d(u) + w(u,v) \\}$$\n\n## Topological Bottom-Up Execution\nIterating in topological order solves all states in $O(V+E)$ time without recursion overhead.`,
    codeSnippet: {
      language: 'cpp',
      title: 'Topological DAG Shortest Path (C++20)',
      code: `vector<long long> dist(n, INF);
dist[src] = 0;
for (int u : topoOrder) {
  if (dist[u] == INF) continue;
  for (auto [v, w] : adj[u]) {
    dist[v] = min(dist[v], dist[u] + w);
  }
}`,
    },
    takeawaysFa: [
      'اگر گراف وضعیت‌ها دور داشته باشد، مسئله از حالت DP استاندارد خارج شده و نیازمند الگوریتم بلمن-فورد یا دایکستراست.',
      'تبدیل بازگشت با Memoization به حلقه توپولوژیک مصرف حافظه پشته را حذف می‌کند.',
    ],
    takeawaysEn: [
      'Cycles in state transitions break standard DP and require Bellman-Ford or Dijkstra.',
      'Bottom-up topological evaluation eliminates recursive call-stack overflow.',
    ],
  },
  {
    id: 'art-cfd-turbulence',
    titleFa: 'از معادلات ناویر-استوکس تا شبیه‌سازی آشفتگی روی پره توربین',
    titleEn: 'From Navier-Stokes to Turbine Blade Turbulence Simulation',
    categoryFa: 'مکانیک و هوافضا',
    categoryEn: 'Mechanical & Aerospace',
    difficulty: 'introductory',
    authorFa: 'مهندس سهراب نادری',
    authorEn: 'Sohrab Naderi, MSc',
    readMinutes: 5,
    date: '۱۴۰۴/۰۷/۲۸',
    image: '/src/assets/images/course_thermodynamics_mech_1795017177354.jpg',
    excerptFa: 'آشنایی ساده و کاربردی با عدد رینولدز، لایه مرزی و روش‌های حل عددی جریان سیالات در مهندسی مکانیک.',
    excerptEn: 'A practical primer on Reynolds number, boundary layers, and finite-volume fluid simulation.',
    markdownFa: `## جدال اینرسی و لزجت\nعدد بی‌بعد رینولدز نسبت نیروهای اینرسی به نیروهای لزج سیال را می‌سنجد:\n\n$$Re = \\frac{\\rho V L}{\\mu}$$\n\n## معادله پایستگی تکانه ناویر-استوکس\n$$\\rho\\left(\\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u}\\cdot\\nabla\\mathbf{u}\\right) = -\\nabla p + \\mu\\nabla^2\\mathbf{u}$$\n\nدر شبیه‌سازی‌های صنعتی CFD، مدل‌سازی گردابه‌های ریز با تقریب RANS و مدل‌های $k-\\varepsilon$ هزینه محاسبات را هزاران برابر کاهش می‌دهد.`,
    markdownEn: `## Inertia vs. Viscosity\nThe dimensionless Reynolds number quantifies the ratio of inertial to viscous forces:\n\n$$Re = \\frac{\\rho V L}{\\mu}$$\n\n## Navier-Stokes Momentum Conservation\n$$\\rho\\left(\\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u}\\cdot\\nabla\\mathbf{u}\\right) = -\\nabla p + \\mu\\nabla^2\\mathbf{u}$$\n\nIndustrial CFD employs RANS turbulence closures like $k-\\varepsilon$ to keep turbine blade simulations computationally tractable.`,
    codeSnippet: {
      language: 'matlab',
      title: 'Reynolds & Friction Factor Estimator (MATLAB)',
      code: `rho = 1.225; V = 45; L = 0.25; mu = 1.81e-5;
Re = (rho * V * L) / mu;
Cf = 0.074 * Re^(-0.2); % Turbulent flat-plate estimate
fprintf('Re = %.2e, Cf = %.4f\\n', Re, Cf);`,
    },
    takeawaysFa: [
      'افزایش عدد رینولدز باعث انتقال لایه مرزی از حالت آرام به آشفته می‌شود.',
      'جدایش جریان پشت پره توربین عامل اصلی افت فشار و تولید آنتروپی است.',
    ],
    takeawaysEn: [
      'Higher Reynolds numbers trigger transition from laminar to turbulent boundary layers.',
      'Flow separation on blade suction sides drives aerodynamic drag and entropy generation.',
    ],
  },
];

// ============================================================================
// Real-Time Academic Chat Channels & Direct Messages (+ @دانشیار Bot)
// ============================================================================
interface AcademicChatMessage {
  id: string;
  channelId: string;
  sender: string;
  role: 'student' | 'professor' | 'ai-bot';
  text: string;
  timestamp: string;
}

interface AcademicChannel {
  id: string;
  nameFa: string;
  nameEn: string;
  type: 'channel' | 'dm';
  courseCode?: string;
  descriptionFa: string;
  descriptionEn: string;
}

const academicChannels: AcademicChannel[] = [
  {
    id: 'ch-math',
    nameFa: '#ریاضی-عمومی',
    nameEn: '#general-calculus',
    type: 'channel',
    courseCode: 'MATH-102',
    descriptionFa: 'رفع اشکال انتگرال‌ها، سری‌های توانی و معادلات دیفرانسیل · با @دانشیار سوال بپرسید',
    descriptionEn: 'Calculus, series & ODE problem solving · Tag @دانشیار for AI help',
  },
  {
    id: 'ch-circuits',
    nameFa: '#مدارهای-الکتریکی',
    nameEn: '#electric-circuits',
    type: 'channel',
    courseCode: 'EE-201',
    descriptionFa: 'تحلیل گره، مش، قضیه تونن و پاسخ گذرای مدارهای RLC',
    descriptionEn: 'Nodal, mesh, Thevenin & RLC transient analysis',
  },
  {
    id: 'ch-programming',
    nameFa: '#برنامه‌نویسی',
    nameEn: '#programming-cs',
    type: 'channel',
    courseCode: 'CS-301',
    descriptionFa: 'ساختمان داده‌ها، الگوریتم‌ها، C++ و پایتون دانشگاهی',
    descriptionEn: 'Data structures, algorithms, C++ & Python',
  },
  {
    id: 'ch-thermo',
    nameFa: '#ترمودینامیک',
    nameEn: '#thermodynamics',
    type: 'channel',
    courseCode: 'ME-204',
    descriptionFa: 'قانون اول و دوم، جداول بخار و چرخه‌های توان',
    descriptionEn: 'First/Second Laws, steam tables & power cycles',
  },
  {
    id: 'dm-shariati',
    nameFa: 'دکتر مریم شریعتی (استاد کنترل)',
    nameEn: 'Dr. Maryam Shariati (Control Prof)',
    type: 'dm',
    descriptionFa: 'پیام مستقیم علمی و راهنمایی پروژه کنترل خطی',
    descriptionEn: 'Direct academic mentoring & project office hours',
  },
  {
    id: 'dm-sara',
    nameFa: 'سارا محمدی (هم‌گروهی پروژه)',
    nameEn: 'Sara Mohammadi (Peer)',
    type: 'dm',
    descriptionFa: 'هماهنگی جزوه‌نویسی و تمرین‌های سری ۳',
    descriptionEn: 'Peer collaboration on lecture notes & assignments',
  },
];

const channelMessagesStore = new Map<string, AcademicChatMessage[]>([
  [
    'ch-math',
    [
      {
        id: 'm-1',
        channelId: 'ch-math',
        sender: 'امیرحسین رضایی',
        role: 'student',
        text: 'بچه‌ها در انتگرال سه‌گانه حجم کره، کران‌های $\\phi$ و $\\theta$ چرا با هم فرق دارند؟',
        timestamp: '۱۰:۰۵',
      },
      {
        id: 'm-2',
        channelId: 'ch-math',
        sender: 'دستیار هوشمند @دانشیار',
        role: 'ai-bot',
        text: 'در مختصات کروی، زاویه قطبی $\\phi$ از محور $+z$ تا $-z$ اندازه گرفته می‌شود، بنابراین بازه آن $[0, \\pi]$ است؛ اما زاویه سمتی $\\theta$ دور محور $z$ یک دور کامل می‌چرخد و بازه $[0, 2\\pi]$ دارد. المان حجم نیز برابر است با: $$dV = \\rho^2 \\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$$',
        timestamp: '۱۰:۰۶',
      },
    ],
  ],
  [
    'ch-circuits',
    [
      {
        id: 'm-c1',
        channelId: 'ch-circuits',
        sender: 'نیما افشاری',
        role: 'student',
        text: 'کسی می‌دونه برای محاسبه مقاومت تونن وقتی منبع وابسته داریم چطور عمل کنیم؟',
        timestamp: '۰۹:۳۰',
      },
      {
        id: 'm-c2',
        channelId: 'ch-circuits',
        sender: 'دکتر مریم شریعتی',
        role: 'professor',
        text: 'حتماً تمام منابع مستقل را خاموش کنید (منبع ولتاژ اتصال کوتاه و منبع جریان مدار باز)، اما منابع وابسته را نگه دارید و یک منبع تست ۱ ولتی به دو سر خروجی وصل کنید.',
        timestamp: '۰۹:۳۴',
      },
    ],
  ],
  [
    'ch-programming',
    [
      {
        id: 'm-p1',
        channelId: 'ch-programming',
        sender: 'مهسا کاظمی',
        role: 'student',
        text: 'برای تمرین الگوریتم دایکسترا با یال وزن منفی آیا میشه فقط یک عدد مثبت به همه یال‌ها اضافه کرد؟',
        timestamp: '۱۱:۱۰',
      },
    ],
  ],
  [
    'ch-thermo',
    [
      {
        id: 'm-t1',
        channelId: 'ch-thermo',
        sender: 'کیانوش فرهادی',
        role: 'student',
        text: 'در چرخه رانکین ایده‌آل چرا کار پمپ خیلی کوچکتر از کار توربین در میاد؟',
        timestamp: '۰۸:۴۵',
      },
    ],
  ],
  [
    'dm-shariati',
    [
      {
        id: 'm-d1',
        channelId: 'dm-shariati',
        sender: 'دکتر مریم شریعتی',
        role: 'professor',
        text: 'سلام! فایل شبیه‌سازی مکان هندسی ریشه‌ها برای پروژه میان‌ترم رو بررسی کردم، نمودار بود رو هم به گزارش اضافه کنید.',
        timestamp: 'دیروز',
      },
    ],
  ],
  [
    'dm-sara',
    [
      {
        id: 'm-d2',
        channelId: 'dm-sara',
        sender: 'سارا محمدی',
        role: 'student',
        text: 'سلام، جزوه فصل چهارم مدار ۲ رو اسکن کردم؛ الان تو بخش استخراج PDF می‌ذارم که فلش‌کارتاش بسازیم.',
        timestamp: '۱۲:۰۰',
      },
    ],
  ],
]);

const academicChatSockets = new Set<WebSocket>();

function broadcastAcademicChat(payload: Record<string, unknown>) {
  const str = JSON.stringify(payload);
  for (const sock of academicChatSockets) {
    if (sock.readyState === WebSocket.OPEN) {
      sock.send(str);
    }
  }
}

// ============================================================================
// Collaborative Virtual Study Rooms (Server-Authoritative Real-Time State)
// ============================================================================
interface StudyGoal {
  id: string;
  text: string;
  author: string;
  completed: boolean;
}

interface RoomChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface RoomMember {
  clientId: string;
  name: string;
  major: string;
}

interface StudyRoomState {
  id: string;
  nameFa: string;
  nameEn: string;
  topicFa: string;
  topicEn: string;
  pomodoro: {
    phase: 'focus' | 'break';
    durationSec: number;
    remainingSec: number;
    isRunning: boolean;
    updatedBy: string;
  };
  goals: StudyGoal[];
  scratchpad: {
    content: string;
    lastEditedBy: string;
    updatedAt: string;
  };
  chat: RoomChatMessage[];
}

const studyRooms = new Map<string, StudyRoomState>();
const roomSockets = new Map<string, Map<string, { ws: WebSocket; member: RoomMember }>>();

function seedStudyRooms() {
  const initialRooms: StudyRoomState[] = [
    {
      id: 'room-calculus',
      nameFa: 'تالار ریاضی مهندسی و معادلات',
      nameEn: 'Engineering Math & ODE Hall',
      topicFa: 'مرور تبدیل لاپلاس، سری فوریه و انتگرال سطح',
      topicEn: 'Laplace Transforms, Fourier Series & Surface Integrals',
      pomodoro: {
        phase: 'focus',
        durationSec: 25 * 60,
        remainingSec: 25 * 60,
        isRunning: false,
        updatedBy: 'سیستم',
      },
      goals: [
        { id: 'g-1', text: 'حل ۵ تمرین تبدیل لاپلاس معکوس با بسط کسرهای جزئی', author: 'امیرحسین', completed: true },
        { id: 'g-2', text: 'مرور شرایط دیریکله در سری فوریه', author: 'سارا', completed: false },
        { id: 'g-3', text: 'تست ۲۰ دقیقه‌ای فرمول‌های قضیه استوکس', author: 'کیانوش', completed: false },
      ],
      scratchpad: {
        content:
          'یادداشت مشترک گروه:\n۱) تبدیل لاپلاس مشتق دوم:\n$$\\mathcal{L}\\{y\'\'(t)\\} = s^2 Y(s) - s y(0) - y\'(0)$$\n\n۲) نکته مهم: همواره قطب‌های تابع تبدیل را برای بررسی پایداری BIBO در نیم‌صفحه چپ محور موهومی چک کنید.',
        lastEditedBy: 'امیرحسین',
        updatedAt: new Date().toISOString(),
      },
      chat: [
        { id: 'c-1', sender: 'امیرحسین', text: 'سلام بچه‌ها! تایمر ۲۵ دقیقه‌ای رو برای فصل لاپلاس شروع کنیم؟', timestamp: '۱۰:۱۵' },
        { id: 'c-2', sender: 'سارا', text: 'من آماده‌ام، فرمول‌های مشتق رو در تخته مشترک گذاشتم.', timestamp: '۱۰:۱۶' },
      ],
    },
    {
      id: 'room-circuits',
      nameFa: 'آزمایشگاه مدار و الکترونیک',
      nameEn: 'Circuits & Electronics Lab',
      topicFa: 'تحلیل پاسخ فرکانسی، بود دیاگرام و تقویت‌کننده‌های عملیاتی',
      topicEn: 'Frequency Response, Bode Plots & Op-Amps',
      pomodoro: {
        phase: 'focus',
        durationSec: 50 * 60,
        remainingSec: 42 * 60 + 15,
        isRunning: false,
        updatedBy: 'سیستم',
      },
      goals: [
        { id: 'g-c1', text: 'رسم نمودار بود برای تابع تبدیل مرتبه دوم', author: 'نیما', completed: false },
        { id: 'g-c2', text: 'حل مسائل تقویت‌کننده تفاضلی Op-Amp', author: 'مهسا', completed: true },
      ],
      scratchpad: {
        content:
          'فرمول‌های کلیدی مدار RLC:\n$$\\omega_0 = \\frac{1}{\\sqrt{LC}}, \\quad \\alpha_{\\text{series}} = \\frac{R}{2L}$$\nشرط میرایی بحرانی: $\\alpha = \\omega_0$',
        lastEditedBy: 'نیما',
        updatedAt: new Date().toISOString(),
      },
      chat: [
        { id: 'c-c1', sender: 'نیما', text: 'کسی با محاسبه قطب مزدوج در مدار RLC موازی مشکل نداره؟', timestamp: '۰۹:۴۰' },
      ],
    },
    {
      id: 'room-algorithms',
      nameFa: 'کمپ الگوریتم و ساختمان داده',
      nameEn: 'Algorithms & Data Structures Camp',
      topicFa: 'گراف‌ها، درخت‌های متوازن و برنامه‌ریزی پویا',
      topicEn: 'Graphs, Balanced Trees & Dynamic Programming',
      pomodoro: {
        phase: 'focus',
        durationSec: 25 * 60,
        remainingSec: 18 * 60,
        isRunning: false,
        updatedBy: 'سیستم',
      },
      goals: [
        { id: 'g-a1', text: 'پیاده‌سازی الگوریتم دایکسترا با Min-Heap', author: 'زهرا', completed: true },
        { id: 'g-a2', text: 'تحلیل پیچیدگی زمانی الگوریتم فلوید-وارشال', author: 'پویا', completed: false },
      ],
      scratchpad: {
        content:
          'پیچیدگی‌های کلیدی:\n- Dijkstra (Binary Heap): $O((V + E)\\log V)$\n- Bellman-Ford: $O(V \\cdot E)$\n- Floyd-Warshall: $O(V^3)$',
        lastEditedBy: 'زهرا',
        updatedAt: new Date().toISOString(),
      },
      chat: [
        { id: 'c-a1', sender: 'زهرا', text: 'بخش گراف وزن‌دار منفی بلمن-فورد رو الان با هم مرور می‌کنیم.', timestamp: '۱۱:۰۵' },
      ],
    },
  ];

  for (const room of initialRooms) {
    studyRooms.set(room.id, room);
    roomSockets.set(room.id, new Map());
  }
}

seedStudyRooms();

function getRoomPayload(room: StudyRoomState) {
  const membersMap = roomSockets.get(room.id);
  const members = membersMap ? Array.from(membersMap.values()).map((m) => m.member) : [];
  return {
    ...room,
    members,
  };
}

function broadcastToRoom(roomId: string, event: Record<string, unknown>, excludeClientId?: string) {
  const sockets = roomSockets.get(roomId);
  if (!sockets) return;
  const payload = JSON.stringify(event);
  for (const [cid, entry] of sockets.entries()) {
    if (excludeClientId && cid === excludeClientId) continue;
    if (entry.ws.readyState === WebSocket.OPEN) {
      entry.ws.send(payload);
    }
  }
}

// Authoritative server-side Pomodoro ticker (1s interval)
setInterval(() => {
  for (const [roomId, room] of studyRooms.entries()) {
    if (!room.pomodoro.isRunning) continue;
    if (room.pomodoro.remainingSec > 0) {
      room.pomodoro.remainingSec -= 1;
    } else {
      // Auto-switch phase when timer reaches 0
      const nextPhase = room.pomodoro.phase === 'focus' ? 'break' : 'focus';
      const nextDur = nextPhase === 'focus' ? 25 * 60 : 5 * 60;
      room.pomodoro.phase = nextPhase;
      room.pomodoro.durationSec = nextDur;
      room.pomodoro.remainingSec = nextDur;
      room.pomodoro.isRunning = false;
    }
    broadcastToRoom(roomId, {
      type: 'timer:sync',
      pomodoro: room.pomodoro,
    });
  }
}, 1000);

// ============================================================================
// Server Initialization
// ============================================================================
async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  // WebSocket Upgrade Router
  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);
    if (
      url.pathname === '/ws/voice-coach' ||
      url.pathname === '/ws/study-room' ||
      url.pathname === '/ws/academic-chat'
    ) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', async (clientWs, request) => {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);

    // ------------------------------------------------------------------------
    // 1. Real-Time Collaborative Study Room WebSocket
    // ------------------------------------------------------------------------
    if (url.pathname === '/ws/study-room') {
      let currentRoomId = url.searchParams.get('roomId') || 'room-calculus';
      const clientId = url.searchParams.get('clientId') || `stu-${Math.random().toString(36).slice(2, 8)}`;
      const name = url.searchParams.get('name') || 'دانشجوی مهمان';
      const major = url.searchParams.get('major') || 'مهندسی';

      if (!studyRooms.has(currentRoomId)) {
        currentRoomId = 'room-calculus';
      }

      const joinRoom = (roomId: string) => {
        const prevMap = roomSockets.get(currentRoomId);
        if (prevMap) {
          prevMap.delete(clientId);
          broadcastToRoom(currentRoomId, {
            type: 'presence:sync',
            members: Array.from(prevMap.values()).map((m) => m.member),
          });
        }
        currentRoomId = roomId;
        if (!roomSockets.has(currentRoomId)) {
          roomSockets.set(currentRoomId, new Map());
        }
        const map = roomSockets.get(currentRoomId)!;
        map.set(clientId, { ws: clientWs, member: { clientId, name, major } });

        const room = studyRooms.get(currentRoomId)!;
        clientWs.send(JSON.stringify({ type: 'room:init', room: getRoomPayload(room) }));
        broadcastToRoom(
          currentRoomId,
          {
            type: 'presence:sync',
            members: Array.from(map.values()).map((m) => m.member),
          },
          clientId
        );
      };

      joinRoom(currentRoomId);

      clientWs.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          const room = studyRooms.get(currentRoomId);
          if (!room) return;

          if (msg.type === 'room:switch' && typeof msg.roomId === 'string' && studyRooms.has(msg.roomId)) {
            joinRoom(msg.roomId);
            return;
          }

          if (msg.type === 'timer:action') {
            if (msg.action === 'start') {
              room.pomodoro.isRunning = true;
            } else if (msg.action === 'pause') {
              room.pomodoro.isRunning = false;
            } else if (msg.action === 'reset') {
              room.pomodoro.isRunning = false;
              room.pomodoro.remainingSec = room.pomodoro.durationSec;
            } else if (msg.action === 'set_phase') {
              const phase = msg.phase === 'break' ? 'break' : 'focus';
              const dur = typeof msg.durationSec === 'number' ? msg.durationSec : phase === 'focus' ? 25 * 60 : 5 * 60;
              room.pomodoro.phase = phase;
              room.pomodoro.durationSec = dur;
              room.pomodoro.remainingSec = dur;
              room.pomodoro.isRunning = false;
            }
            room.pomodoro.updatedBy = name;
            broadcastToRoom(currentRoomId, { type: 'timer:sync', pomodoro: room.pomodoro });
            return;
          }

          if (msg.type === 'goal:create' && msg.goal) {
            const exists = room.goals.some((g) => g.id === msg.goal.id);
            if (!exists) {
              room.goals.unshift({
                id: String(msg.goal.id),
                text: String(msg.goal.text).slice(0, 200),
                author: String(msg.goal.author || name),
                completed: false,
              });
              broadcastToRoom(currentRoomId, { type: 'goals:sync', goals: room.goals });
            }
            return;
          }

          if (msg.type === 'goal:toggle' && typeof msg.goalId === 'string') {
            const target = room.goals.find((g) => g.id === msg.goalId);
            if (target) {
              target.completed = !target.completed;
              broadcastToRoom(currentRoomId, { type: 'goals:sync', goals: room.goals });
            }
            return;
          }

          if (msg.type === 'goal:delete' && typeof msg.goalId === 'string') {
            room.goals = room.goals.filter((g) => g.id !== msg.goalId);
            broadcastToRoom(currentRoomId, { type: 'goals:sync', goals: room.goals });
            return;
          }

          if (msg.type === 'scratchpad:update' && typeof msg.content === 'string') {
            room.scratchpad = {
              content: msg.content,
              lastEditedBy: name,
              updatedAt: new Date().toISOString(),
            };
            broadcastToRoom(
              currentRoomId,
              { type: 'scratchpad:sync', scratchpad: room.scratchpad },
              clientId
            );
            return;
          }

          if (msg.type === 'chat:send' && msg.message) {
            const exists = room.chat.some((c) => c.id === msg.message.id);
            if (!exists) {
              const newMsg: RoomChatMessage = {
                id: String(msg.message.id),
                sender: String(msg.message.sender || name),
                text: String(msg.message.text).slice(0, 500),
                timestamp: String(msg.message.timestamp || new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })),
              };
              room.chat = [...room.chat.slice(-49), newMsg];
              broadcastToRoom(currentRoomId, { type: 'chat:sync', chat: room.chat });
            }
          }
        } catch {
          // Ignore malformed WS packets
        }
      });

      clientWs.on('close', () => {
        const map = roomSockets.get(currentRoomId);
        if (map) {
          map.delete(clientId);
          broadcastToRoom(currentRoomId, {
            type: 'presence:sync',
            members: Array.from(map.values()).map((m) => m.member),
          });
        }
      });
      return;
    }

    // ------------------------------------------------------------------------
    // 1B. Real-Time Academic Chat & @دانشیار Bot WebSocket
    // ------------------------------------------------------------------------
    if (url.pathname === '/ws/academic-chat') {
      academicChatSockets.add(clientWs);
      clientWs.send(
        JSON.stringify({
          type: 'chat:init',
          channels: academicChannels,
          messagesByChannel: Object.fromEntries(channelMessagesStore.entries()),
        })
      );

      clientWs.on('close', () => {
        academicChatSockets.delete(clientWs);
      });
      return;
    }

    // ------------------------------------------------------------------------
    // 2. Gemini Live API Voice AI Study Coach WebSocket (/ws/voice-coach)
    // ------------------------------------------------------------------------
    if (url.pathname === '/ws/voice-coach') {
      const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'fa';
      const topic = url.searchParams.get('topic') || (lang === 'fa' ? 'مباحث مهندسی و فیزیک' : 'Engineering & Physics');
      const mode = url.searchParams.get('mode') || 'oral_exam';

      const systemPrompt =
        lang === 'fa'
          ? `تو «دانشیار»، مربی هوشمند مطالعه دانشگاهی و ممتحن آزمون شفاهی مهندسی هستی. موضوع فعلی: «${topic}». حالت جلسه: «${mode}». با دانشجو به زبان فارسی روان، محترمانه و علمی صحبت کن. پاسخ‌هایت کوتاه، دقیق، سقراطی و قابل فهم در مکالمه صوتی باشد. پس از توضیح کوتاه، یک سوال عمیق بپرس تا تسلط دانشجو سنجیده شود.`
          : `You are DaneshYar, a university engineering oral exam coach and study mentor. Current topic: "${topic}". Mode: "${mode}". Speak clearly, concisely, and encouragingly in English. Use Socratic questioning: keep spoken turns crisp and ask one probing follow-up question to drill conceptual mastery.`;

      let liveSession: Awaited<ReturnType<GoogleGenAI['live']['connect']>> | null = null;

      try {
        const ai = getAI();
        liveSession = await ai.live.connect({
          model: 'gemini-3.8-live',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Zephyr' },
              },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: systemPrompt,
          },
          callbacks: {
            onopen: () => {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'ready' }));
              }
            },
            onmessage: (message: LiveServerMessage) => {
              if (clientWs.readyState !== WebSocket.OPEN) return;
              const content = message.serverContent;
              if (content?.inputTranscription?.text) {
                clientWs.send(
                  JSON.stringify({
                    type: 'input_transcript',
                    text: content.inputTranscription.text,
                  })
                );
              }
              if (content?.outputTranscription?.text) {
                clientWs.send(
                  JSON.stringify({
                    type: 'output_transcript',
                    text: content.outputTranscription.text,
                  })
                );
              }
              for (const part of content?.modelTurn?.parts ?? []) {
                if (part.inlineData?.data) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'audio',
                      data: part.inlineData.data,
                    })
                  );
                }
              }
              if (content?.interrupted) {
                clientWs.send(JSON.stringify({ type: 'interrupted' }));
              }
              if (content?.turnComplete) {
                clientWs.send(JSON.stringify({ type: 'turn_complete' }));
              }
            },
            onerror: (err: unknown) => {
              if (clientWs.readyState === WebSocket.OPEN) {
                const msg = err instanceof Error ? err.message : 'Live session error';
                clientWs.send(JSON.stringify({ type: 'error', message: msg }));
              }
            },
            onclose: () => {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'closed' }));
              }
            },
          },
        });
      } catch (err) {
        const parsed = formatApiError(err);
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ type: 'error', message: parsed.message }));
          clientWs.close();
        }
        return;
      }

      clientWs.on('message', (raw) => {
        if (!liveSession) return;
        try {
          const msg = JSON.parse(raw.toString());
          if (msg.audio) {
            liveSession.sendRealtimeInput({
              audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (msg.text) {
            liveSession.sendRealtimeInput({
              text: String(msg.text),
            });
          }
        } catch {
          // Ignore invalid messages
        }
      });

      clientWs.on('close', () => {
        try {
          liveSession?.close();
        } catch {
          // ignore
        }
      });
    }
  });

  // ==========================================================================
  // AI Study & Engineering API Endpoints
  // ==========================================================================

  // 1. Multi-Level Feynman AI Study Assistant (child5 -> highschool -> undergrad -> researcher)
  app.post('/api/ai/feynman', async (req, res) => {
    try {
      const { topic, level = 'undergrad', lang = 'fa' } = req.body as {
        topic: string;
        level?: string;
        lang?: 'fa' | 'en';
      };
      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: 'لطفاً موضوع یا مفهوم موردنظر را وارد کنید.' });
      }

      aiQueryStats.feynman += 1;
      const ai = getAI();

      const levelGuidanceMap: Record<string, string> = {
        child5: 'Explain as if talking to a curious 5-year-old child using playful physical toys, water/blocks analogies, and zero jargon.',
        highschool: 'Explain for a bright high school physics/math student using everyday mechanics, intuition, and basic algebra.',
        undergrad: 'Explain for a university engineering undergraduate with clear physical intuition, practical engineering examples, and core equations.',
        researcher: 'Explain at a senior graduate researcher level with rigorous mathematical framing, boundary conditions, and deep theoretical connections.',
      };
      const depthInstruction = levelGuidanceMap[level] || levelGuidanceMap.undergrad;

      const styleInstruction =
        aiTuningConfig.feynmanStyle === 'storytelling'
          ? 'Lean heavily into memorable storytelling analogies.'
          : aiTuningConfig.feynmanStyle === 'rigorous'
          ? 'Include crisp formal precision alongside intuitive grounding.'
          : 'Balance everyday intuition with academic clarity.';

      const languageDirective =
        lang === 'fa'
          ? 'تمام متن‌های توضیحی را به فارسی روان، دقیق و دانشگاهی بنویس. فرمول ریاضی را با LaTeX استاندارد بنویس.'
          : 'Write all explanatory fields in clear, precise academic English. Format mathematical equations in standard LaTeX.';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Explain the engineering/physics/academic topic "${topic}" using the Feynman Technique.\nTarget audience & depth: ${depthInstruction}\nPedagogical style: ${styleInstruction}\n${languageDirective}`,
        config: {
          systemInstruction: `${aiTuningConfig.systemPrompt}\nYou specialize in the Multi-Level Feynman Technique across 4 mastery tiers.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              analogy: { type: Type.STRING, description: 'An intuitive everyday analogy tailored to the requested level' },
              simpleExplanation: { type: Type.STRING, description: 'Clear Feynman-style step-by-step explanation' },
              realWorldExample: { type: Type.STRING, description: 'Concrete engineering or real-world application' },
              commonMisconception: { type: Type.STRING, description: 'Typical mistake learners make at this level' },
              keyFormulaLatex: { type: Type.STRING, description: 'Pure LaTeX formula without $$ delimiters' },
              selfCheckQuestion: { type: Type.STRING, description: 'A quick conceptual question to test understanding' },
            },
            required: [
              'title',
              'analogy',
              'simpleExplanation',
              'realWorldExample',
              'commonMisconception',
              'keyFormulaLatex',
              'selfCheckQuestion',
            ],
          },
        },
      });

      const data = parseJsonSafe(response.text, null);
      if (!data) {
        return res.status(500).json({ error: 'خطا در ساختار پاسخ مدل.' });
      }
      res.json(data);
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // 2. AI Math & Engineering Formula Solver (Step-by-step LaTeX + optional Image)
  app.post('/api/ai/formula-solver', async (req, res) => {
    try {
      const { problem, domain = 'auto', lang = 'fa', imageBase64, imageMimeType } = req.body as {
        problem?: string;
        domain?: string;
        lang?: 'fa' | 'en';
        imageBase64?: string;
        imageMimeType?: string;
      };

      if (!problem?.trim() && !imageBase64) {
        return res.status(400).json({ error: 'لطفاً مسئله یا تصویر فرمول را وارد کنید.' });
      }

      aiQueryStats.formulaSolver += 1;
      const ai = getAI();
      const langNote =
        lang === 'fa'
          ? 'تمام توضیحات متنی را به فارسی شیوا بنویس، اما تمام عبارت‌های ریاضی و فیزیکی داخل فیلد latex را با نحو خالص LaTeX (بدون علامت $ یا $$ در ابتدا و انتها) بنویس.'
          : 'Write all step titles, explanations, and physical intuition in English, and put pure LaTeX (without outer $ or $$ delimiters) inside every latex field.';

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (imageBase64 && imageMimeType) {
        parts.push({
          inlineData: {
            mimeType: imageMimeType,
            data: imageBase64,
          },
        });
      }
      parts.push({
        text: `Solve this university math, circuit analysis, or physics/engineering problem step-by-step (domain hint: ${domain}):\n${problem || 'Solve the problem shown in the attached image.'}\n\n${langNote}`,
      });

      const configuredThinking =
        aiTuningConfig.thinkingLevel === 'LOW'
          ? ThinkingLevel.LOW
          : aiTuningConfig.thinkingLevel === 'MEDIUM'
          ? ThinkingLevel.MEDIUM
          : ThinkingLevel.HIGH;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          thinkingConfig: { thinkingLevel: configuredThinking },
          systemInstruction: `${aiTuningConfig.systemPrompt}\nYou are a rigorous university engineering & mathematics solver. Verify every algebraic step, unit, boundary condition, and circuit law (KVL/KCL/Laplace/Calculus) carefully before producing the final derivation.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problemTitle: { type: Type.STRING },
              detectedDomain: { type: Type.STRING },
              givenLatex: { type: Type.STRING, description: 'Pure LaTeX summary of given equations/parameters' },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    latex: { type: Type.STRING, description: 'Pure LaTeX equation for this step without $$ delimiters' },
                  },
                  required: ['stepNumber', 'title', 'explanation', 'latex'],
                },
              },
              finalAnswerLatex: { type: Type.STRING, description: 'Pure LaTeX final boxed/simplified answer without $$ delimiters' },
              physicalIntuition: { type: Type.STRING },
            },
            required: [
              'problemTitle',
              'detectedDomain',
              'givenLatex',
              'steps',
              'finalAnswerLatex',
              'physicalIntuition',
            ],
          },
        },
      });

      const data = parseJsonSafe(response.text, null);
      if (!data) {
        return res.status(500).json({ error: 'پاسخ فرمول‌حل‌کن قابل تجزیه نبود.' });
      }
      res.json(data);
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // 3. Smart MCQ Quiz Generator with Feynman Explanations
  app.post('/api/ai/quiz', async (req, res) => {
    try {
      const { topic, difficulty = 'intermediate', count = 5, lang = 'fa' } = req.body as {
        topic: string;
        difficulty?: string;
        count?: number;
        lang?: 'fa' | 'en';
      };
      if (!topic?.trim()) {
        return res.status(400).json({ error: 'لطفاً نام درس یا موضوع آزمون را مشخص کنید.' });
      }
      const safeCount = Math.min(Math.max(Number(count) || 5, 3), 8);
      const ai = getAI();
      const langNote = lang === 'fa' ? 'سوالات، گزینه‌ها و توضیحات فاینمن را به فارسی بنویس.' : 'Write questions, options, and Feynman explanations in English.';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Generate ${safeCount} university engineering multiple-choice questions on "${topic}" at "${difficulty}" difficulty. ${langNote}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quizTitle: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    formulaLatex: { type: Type.STRING, description: 'Optional pure LaTeX formula or empty string' },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.INTEGER },
                    feynmanExplanation: { type: Type.STRING },
                  },
                  required: ['id', 'question', 'formulaLatex', 'options', 'correctIndex', 'feynmanExplanation'],
                },
              },
            },
            required: ['quizTitle', 'questions'],
          },
        },
      });

      const data = parseJsonSafe(response.text, null);
      if (!data) return res.status(500).json({ error: 'خطا در تولید آزمون.' });
      res.json(data);
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // 4. Smart Spaced-Repetition Flashcard Generator
  app.post('/api/ai/flashcards', async (req, res) => {
    try {
      const { sourceText, courseTitle, count = 6, lang = 'fa' } = req.body as {
        sourceText: string;
        courseTitle?: string;
        count?: number;
        lang?: 'fa' | 'en';
      };
      if (!sourceText?.trim()) {
        return res.status(400).json({ error: 'محتوا یا موضوعی برای ساخت فلش‌کارت وارد نشده است.' });
      }
      const safeCount = Math.min(Math.max(Number(count) || 6, 3), 12);
      const ai = getAI();
      const langNote = lang === 'fa' ? 'متن فلش‌کارت‌ها به فارسی و فرمول‌ها با LaTeX خالص باشد.' : 'Write flashcards in English with pure LaTeX formulas.';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Create ${safeCount} high-yield spaced-repetition flashcards (active recall style) for university engineering students from this source (${courseTitle || 'Engineering'}):\n${sourceText}\n\n${langNote}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              deckName: { type: Type.STRING },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING },
                    formulaLatex: { type: Type.STRING },
                    hint: { type: Type.STRING },
                  },
                  required: ['front', 'back', 'formulaLatex', 'hint'],
                },
              },
            },
            required: ['deckName', 'cards'],
          },
        },
      });

      const data = parseJsonSafe(response.text, null);
      if (!data) return res.status(500).json({ error: 'خطا در ساخت فلش‌کارت‌ها.' });
      res.json(data);
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // 5. Smart PDF Slide / Note Extractor
  app.post('/api/ai/extract-pdf', async (req, res) => {
    try {
      const { fileName, mimeType, base64Data, textContent, lang = 'fa' } = req.body as {
        fileName?: string;
        mimeType?: string;
        base64Data?: string;
        textContent?: string;
        lang?: 'fa' | 'en';
      };

      if (!base64Data && !textContent?.trim()) {
        return res.status(400).json({ error: 'لطفاً یک فایل اسلاید (PDF/تصویر) یا متن جزوه بارگذاری کنید.' });
      }

      const ai = getAI();
      const langNote =
        lang === 'fa'
          ? 'خروجی خلاصه، مفاهیم، فلش‌کارت‌ها و سوالات امتحانی را به فارسی روان بنویس و فرمول‌ها را با LaTeX خالص برگردان.'
          : 'Write the summary, concepts, flashcards, and exam questions in clear academic English with pure LaTeX formulas.';

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (base64Data && mimeType) {
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      }
      parts.push({
        text: `Analyze this university lecture slide/note (${fileName || 'uploaded document'}).\n${textContent ? `Document text:\n${textContent}\n` : ''}Extract: 1) concise executive summary, 2) 4-6 core concepts, 3) key LaTeX equations, 4) 5 active-recall flashcards, 5) 3 realistic university exam questions with model answers.\n${langNote}`,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              documentTitle: { type: Type.STRING },
              summary: { type: Type.STRING },
              keyConcepts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              keyFormulas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    latex: { type: Type.STRING },
                  },
                  required: ['name', 'latex'],
                },
              },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING },
                    formulaLatex: { type: Type.STRING },
                  },
                  required: ['front', 'back', 'formulaLatex'],
                },
              },
              examQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    modelAnswer: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                  },
                  required: ['question', 'modelAnswer', 'difficulty'],
                },
              },
            },
            required: [
              'documentTitle',
              'summary',
              'keyConcepts',
              'keyFormulas',
              'flashcards',
              'examQuestions',
            ],
          },
        },
      });

      const data = parseJsonSafe(response.text, null);
      if (!data) return res.status(500).json({ error: 'خطا در تحلیل فایل اسلاید.' });
      res.json(data);
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // 6. Voice Coach Turn-Based Mode (Text/Transcribed Speech -> Coach Response + TTS WAV)
  app.post('/api/ai/voice-turn', async (req, res) => {
    try {
      const { message, history = [], topic = 'مهندسی برق و ریاضی', mode = 'oral_exam', lang = 'fa', withAudio = true } = req.body as {
        message: string;
        history?: Array<{ role: 'user' | 'model'; text: string }>;
        topic?: string;
        mode?: string;
        lang?: 'fa' | 'en';
        withAudio?: boolean;
      };
      if (!message?.trim()) {
        return res.status(400).json({ error: 'پیام خالی است.' });
      }

      const ai = getAI();
      const systemInstruction =
        lang === 'fa'
          ? `تو مربی صوتی و ممتحن شفاهی دانشیار در موضوع «${topic}» با حالت «${mode}» هستی. پاسخ‌هایت را کوتاه (۲ تا ۴ جمله)، علمی، تشویق‌کننده و مناسب خوانش صوتی بنویس و در انتها یک پرسش چالشی بپرس تا دانشجو توضیح دهد.`
          : `You are DaneshYar Voice Study Coach in "${mode}" mode for "${topic}". Keep replies crisp (2-4 sentences), encouraging, and natural for speech, ending with one probing oral-exam follow-up question.`;

      const historyText = history
        .slice(-6)
        .map((h) => `${h.role === 'user' ? 'Student' : 'Coach'}: ${h.text}`)
        .join('\n');

      const textResponse = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `${historyText ? `Conversation so far:\n${historyText}\n\n` : ''}Student: ${message}`,
        config: {
          systemInstruction,
        },
      });

      const replyText = textResponse.text?.trim() || (lang === 'fa' ? 'بسیار خوب، ادامه بده.' : 'Good point, please elaborate.');
      let audioBase64: string | null = null;

      if (withAudio) {
        try {
          const ttsResp = await ai.models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: replyText,
                    speechMetadata: {
                      style: 'Warm, articulate university professor coaching a student',
                    },
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Zephyr' },
                },
              },
            },
          });
          audioBase64 = ttsResp.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;
        } catch {
          audioBase64 = null;
        }
      }

      res.json({ replyText, audioBase64 });
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // 7. Audio Transcription for recorded student answer
  app.post('/api/ai/transcribe', async (req, res) => {
    try {
      const { base64Audio, mimeType = 'audio/webm', lang = 'fa' } = req.body as {
        base64Audio: string;
        mimeType?: string;
        lang?: 'fa' | 'en';
      };
      if (!base64Audio) {
        return res.status(400).json({ error: 'فایل صوتی ارسال نشده است.' });
      }
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Audio } },
            { text: lang === 'fa' ? 'این صدا را دقیقاً به فارسی (یا اصطلاحات انگلیسی علمی به کار رفته) متن‌نگاری کن.' : 'Transcribe this spoken academic answer accurately.' },
          ],
        },
      });
      res.json({ transcript: response.text?.trim() || '' });
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // 8. DaneshReels Instant "Ask AI About This Topic" Popover
  app.post('/api/ai/reel-ask', async (req, res) => {
    try {
      const { topic, question, formulaLatex, lang = 'fa' } = req.body as {
        topic: string;
        question: string;
        formulaLatex?: string;
        lang?: 'fa' | 'en';
      };
      if (!question?.trim()) {
        return res.status(400).json({ error: 'لطفاً سوال خود را درباره این ریل بنویسید.' });
      }
      aiQueryStats.feynman += 1;
      const ai = getAI();
      const langNote =
        lang === 'fa'
          ? 'پاسخ را به زبان فارسی بسیار روان، موجز (حداکثر ۴ جمله) و مناسب مطالعه سریع موبایلی بنویس و اگر فرمول نیاز بود با $...$ یا $$...$$ بیاور.'
          : 'Reply concisely (max 4 sentences) in clear English with $...$ or $$...$$ LaTeX for any math.';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Micro-lesson topic: "${topic}"${formulaLatex ? `\nKey formula: ${formulaLatex}` : ''}\nStudent question: "${question}"\n${langNote}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction: `${aiTuningConfig.systemPrompt}\nYou are answering a quick in-feed student question inside DaneshReels (30-second micro-learning feed). Be punchy, intuitive, and accurate.`,
        },
      });
      res.json({ answer: response.text?.trim() || '' });
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // 9. DaneshReels Narration Audio (Gemini Flash Lite TTS)
  app.post('/api/ai/tts', async (req, res) => {
    try {
      const { text } = req.body as { text: string };
      if (!text?.trim()) {
        return res.status(400).json({ error: 'متن روایت خالی است.' });
      }
      const ai = getAI();
      const ttsResp = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.slice(0, 600),
                speechMetadata: {
                  style: 'Energetic, crystal-clear educational micro-lesson narrator',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });
      const audioBase64 = ttsResp.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;
      res.json({ audioBase64 });
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // ==========================================================================
  // 'همدانشگاهی' (Campus & Society Student Voice) Store & REST APIs
  // ==========================================================================
  interface CampusReplyRecord {
    id: string;
    author: string;
    badgeFa: string;
    badgeEn: string;
    text: string;
    upvotes: number;
    createdAt: string;
  }

  interface CampusCommentRecord {
    id: string;
    author: string;
    badgeFa: string;
    badgeEn: string;
    text: string;
    upvotes: number;
    createdAt: string;
    replies: CampusReplyRecord[];
  }

  interface CampusThreadRecord {
    id: string;
    category: 'ai-future' | 'migration-stay' | 'university-industry' | 'engineering-ethics' | 'student-life';
    titleFa: string;
    titleEn: string;
    bodyFa: string;
    bodyEn: string;
    author: string;
    badgeFa: string;
    badgeEn: string;
    upvotes: number;
    createdAt: string;
    trending?: boolean;
    comments: CampusCommentRecord[];
  }

  interface CampusPollRecord {
    id: string;
    questionFa: string;
    questionEn: string;
    category: CampusThreadRecord['category'];
    options: Array<{ id: string; labelFa: string; labelEn: string; votes: number }>;
  }

  const campusThreadsStore: CampusThreadRecord[] = [
    {
      id: 'cmp-1',
      category: 'ai-future',
      titleFa: 'آینده مهندسی با هوش مصنوعی: آیا ابزارهای کدنویسی و طراحی جای مهندسان تازه‌کار را می‌گیرند؟',
      titleEn: 'Future of Engineering with AI: Will Copilots Replace Junior Engineers or Elevate Them?',
      bodyFa:
        'این روزها بسیاری از دانشجویان کارشناسی نگرانند که با رشد مدل‌های زبانی در کدنویسی، تحلیل مدار و نگارش گزارش‌های فنی، شرکت‌ها دیگر به استخدام نیروی جونیور نیاز نداشته باشند. تجربه کارآموزی شما چه می‌گوید؟ آیا باید تمرکز دانشگاه را از حفظ فرمول‌ها به معماری سیستم و دیباگ عمیق ببریم؟',
      bodyEn:
        'Many undergraduates worry that code generation and automated simulation tools will shrink junior engineering openings. From your internship experience, how should university curricula shift toward systems thinking and verification?',
      author: 'امیرحسین رضایی',
      badgeFa: 'ارشد برق · دانشگاه تهران',
      badgeEn: 'MSc Electrical · UT',
      upvotes: 142,
      createdAt: '۳ ساعت پیش',
      trending: true,
      comments: [
        {
          id: 'cc-1',
          author: 'سارا محمدی',
          badgeFa: 'توسعه‌دهنده سیستم · شریف',
          badgeEn: 'Systems Eng · Sharif',
          text: 'در تیم ما هوش مصنوعی سرعت نمونه‌سازی را ۳ برابر کرده، اما وقتی باگ واقعی در هم‌زمانی یا افت ولتاژ پیش می‌آید، کسی که مفاهیم پایه را عمیق نفهمیده باشد اصلاً نمی‌تواند خروجی AI را اعتبارسنجی کند.',
          upvotes: 48,
          createdAt: '۲ ساعت پیش',
          replies: [
            {
              id: 'cr-1',
              author: 'کیانوش فرهادی',
              badgeFa: 'کارشناسی مکانیک · امیرکبیر',
              badgeEn: 'BSc Mechanical · AUT',
              text: 'دقیقاً! در تحلیل ANSYS هم همینطور است؛ نرم‌افزار مش می‌زند اما بدون درک شرط مرزی و فیزیک مسئله، خروجی زیبا ولی کاملاً غلط تحویل می‌دهد.',
              upvotes: 19,
              createdAt: '۱ ساعت پیش',
            },
          ],
        },
        {
          id: 'cc-2',
          author: 'دکتر مریم شریعتی',
          badgeFa: 'هیئت علمی کنترل',
          badgeEn: 'Control Faculty',
          text: 'توصیه من به دانشجویان این است که پروژه‌های انتهای ترم را روی مسائل واقعی بدون جواب از پیش آماده متمرکز کنند تا قدرت «پرسش‌گری مهندسی» تقویت شود.',
          upvotes: 63,
          createdAt: '۴۵ دقیقه پیش',
          replies: [],
        },
      ],
    },
    {
      id: 'cmp-2',
      category: 'migration-stay',
      titleFa: 'چالش‌های مهاجرت تحصیلی در مقابل ماندن و ساختن در داخل؛ نگاه واقع‌بینانه دانشجویان سال آخر',
      titleEn: 'Academic Migration vs. Building Locally: Honest Perspectives from Senior Students',
      bodyFa:
        'بین دغدغه‌های بورسیه و اپلای از یک سو و فرصت‌های واقعی رشد تیم‌های فناوری، استارتاپ‌ها و پروژه‌های زیرساختی داخل کشور از سوی دیگر، چطور تصمیم معقول و بدون هیجان بگیریم؟ کسانی که هر دو مسیر را تجربه کرده‌اند چه نکاتی را قبل از انتخاب نمی‌دانستند؟',
      bodyEn:
        'Balancing graduate admissions abroad against building high-impact tech teams locally is one of the toughest student dilemmas. What tradeoffs did you discover only after committing?',
      author: 'مهسا کاظمی',
      badgeFa: 'کارشناسی کامپیوتر · صنعتی اصفهان',
      badgeEn: 'BSc CS · IUT',
      upvotes: 186,
      createdAt: '۶ ساعت پیش',
      trending: true,
      comments: [
        {
          id: 'cc-3',
          author: 'نیما افشاری',
          badgeFa: 'دانشجوی دکتری · واترلو / فارغ‌التحصیل شریف',
          badgeEn: 'PhD Candidate · Alumni',
          text: 'بزرگ‌ترین اشتباه تصمیم گرفتن از روی جو عمومی است. اگر هدف شما پژوهش مرز دانش در آزمایشگاه‌های خاص است اپلای منطقی است؛ اما برای کسانی که روحیه محصول‌سازی و کارآفرینی دارند، سرعت رشد مسئولیت‌پذیری در تیم‌های خوب داخل بسیار بالاست.',
          upvotes: 74,
          createdAt: '۴ ساعت پیش',
          replies: [],
        },
      ],
    },
    {
      id: 'cmp-3',
      category: 'university-industry',
      titleFa: 'ارتباط دانشگاه با صنعت: چرا پروژه‌های آزمایشگاهی ما ۱۰ سال از خطوط تولید واقعی عقب‌ترند؟',
      titleEn: 'University-Industry Gap: Bridging Classroom Theory and Production Engineering',
      bodyFa:
        'بخش زیادی از دروس تخصصی هنوز بر اساس سرفصل‌های دهه هفتاد و بدون آشنایی با استانداردهای صنعتی، کنترل نسخه، ایمنی و اقتصاد پروژه تدریس می‌شوند. چطور می‌توانیم در سطح انجمن‌های علمی پل عملی‌تری با مهندسان شاغل بزنیم؟',
      bodyEn:
        'Many lab syllabi still miss modern tooling, version control, safety standards, and cost engineering. How can student societies bridge this gap effectively?',
      author: 'پویا شریفی',
      badgeFa: 'کارشناسی عمران · علم و صنعت',
      badgeEn: 'BSc Civil · IUST',
      upvotes: 98,
      createdAt: 'دیروز',
      trending: true,
      comments: [
        {
          id: 'cc-4',
          author: 'سهراب نادری',
          badgeFa: 'مهندس ارشد طراحی صنعتی',
          badgeEn: 'Senior Design Eng.',
          text: 'ما در شرکتمان سه دانشجوی ترم ۶ را با تعریف «پروژه درس پروژه تخصصی» وارد یک مسئله واقعی کاهش لرزش پمپ کردیم؛ هم دانشگاه نمره واقعی داد هم دانشجوها تجربه رزومه‌ای واقعی گرفتند.',
          upvotes: 31,
          createdAt: 'دیروز',
          replies: [],
        },
      ],
    },
    {
      id: 'cmp-4',
      category: 'engineering-ethics',
      titleFa: 'اخلاق مهندسی در الگوریتم‌های تصمیم‌گیر و خودروهای خودران: مرز مسئولیت کجاست؟',
      titleEn: 'Engineering Ethics in Autonomous Systems & Algorithmic Decisions',
      bodyFa:
        'وقتی یک الگوریتم پزشکی یا سیستم ترمز خودکار در شرایط اضطراری تصمیم می‌گیرد، سهم مسئولیت طراح نرم‌افزار، مدیر محصول و نهاد ناظر چگونه باید تعریف شود؟ آیا درس اخلاق مهندسی در دانشگاه‌ها باید از تئوری صرف به شبیه‌سازی بحران تبدیل شود؟',
      bodyEn:
        'When an autonomous medical or vehicular system fails under edge conditions, how should responsibility be partitioned between engineers, companies, and regulators?',
      author: 'دکتر الناز بهرامی',
      badgeFa: 'پژوهشگر اخلاق فناوری',
      badgeEn: 'AI Ethics Researcher',
      upvotes: 87,
      createdAt: '۲ روز پیش',
      comments: [],
    },
    {
      id: 'cmp-5',
      category: 'student-life',
      titleFa: 'تعادل کار پاره‌وقت دانشجویی، فشار امتحانات و جلوگیری از فرسودگی تحصیلی',
      titleEn: 'Balancing Part-Time Tech Work, Exam Pressure & Avoiding Student Burnout',
      bodyFa:
        'از ترم پنج به بعد تقریباً همه هم‌ورودی‌ها بین نیاز به کسب درآمد و استقلال مالی و سنگینی دروس تخصصی و پروژه‌ها گرفتار فرسودگی می‌شوند. چه روتین هفتگی واقعی برای شما جواب داده است؟',
      bodyEn:
        'From junior year onward, many students juggle part-time engineering jobs alongside heavy coursework. What sustainable weekly schedule actually worked for you?',
      author: 'زهرا کریمی',
      badgeFa: 'کارشناسی صنایع · شیراز',
      badgeEn: 'BSc Industrial · ShirazU',
      upvotes: 114,
      createdAt: '۳ روز پیش',
      comments: [],
    },
  ];

  const campusPollsStore: CampusPollRecord[] = [
    {
      id: 'poll-1',
      questionFa: 'بزرگ‌ترین چالش دانشجویان مهندسی در سال جاری چیست؟',
      questionEn: 'What is the biggest challenge for engineering students this year?',
      category: 'university-industry',
      options: [
        { id: 'p1-o1', labelFa: 'شکاف مهارت‌های دانشگاهی با نیاز واقعی صنعت', labelEn: 'University-to-industry skill gap', votes: 342 },
        { id: 'p1-o2', labelFa: 'سردرگمی میان مهاجرت تحصیلی و ماندن', labelEn: 'Migration vs. staying locally dilemma', votes: 289 },
        { id: 'p1-o3', labelFa: 'فشار روانی امتحانات و هم‌زمانی کار دانشجویی', labelEn: 'Exam stress & work-study burnout', votes: 194 },
        { id: 'p1-o4', labelFa: 'کمبود منتورینگ و پروژه‌های پژوهشی کاربردی', labelEn: 'Lack of practical R&D mentorship', votes: 138 },
      ],
    },
    {
      id: 'poll-2',
      questionFa: 'هوش مصنوعی تا ۳ سال آینده بیشترین تاثیر را بر کدام حوزه دارد؟',
      questionEn: 'Where will AI reshape engineering workflows most over the next 3 years?',
      category: 'ai-future',
      options: [
        { id: 'p2-o1', labelFa: 'کدنویسی، تست خودکار و معماری نرم‌افزار', labelEn: 'Software engineering & automated QA', votes: 410 },
        { id: 'p2-o2', labelFa: 'شبیه‌سازی عددی و بهینه‌سازی طراحی (CAD/FEM)', labelEn: 'Physics simulation & generative CAD', votes: 215 },
        { id: 'p2-o3', labelFa: 'پژوهش بین‌رشته‌ای و مرور سریع مقالات', labelEn: 'Research synthesis & literature mining', votes: 186 },
      ],
    },
    {
      id: 'poll-3',
      questionFa: 'مهم‌ترین اولویت شما در انتخاب شغل اول پس از فارغ‌التحصیلی؟',
      questionEn: 'Top priority when choosing your first engineering role after graduation?',
      category: 'student-life',
      options: [
        { id: 'p3-o1', labelFa: 'محیط یادگیری عمیق و هم‌تیمی‌های ارشد قوی', labelEn: 'Deep mentorship & strong senior peers', votes: 298 },
        { id: 'p3-o2', labelFa: 'امنیت شغلی، درآمد رقابتی و ثبات مالی', labelEn: 'Compensation & financial stability', votes: 264 },
        { id: 'p3-o3', labelFa: 'اثرگذاری اجتماعی و حل مسائل واقعی کشور', labelEn: 'Societal impact & meaningful problems', votes: 152 },
      ],
    },
  ];

  app.get('/api/campus/state', (_req, res) => {
    res.json({ threads: campusThreadsStore, polls: campusPollsStore });
  });

  app.post('/api/campus/threads', (req, res) => {
    const { category, titleFa, bodyFa, author, badgeFa } = req.body as {
      category?: CampusThreadRecord['category'];
      titleFa: string;
      bodyFa: string;
      author?: string;
      badgeFa?: string;
    };
    if (!titleFa?.trim() || !bodyFa?.trim()) {
      return res.status(400).json({ error: 'عنوان و متن گفتگو الزامی است.' });
    }
    const created: CampusThreadRecord = {
      id: `cmp-${Date.now()}`,
      category: category || 'student-life',
      titleFa: titleFa.trim(),
      titleEn: titleFa.trim(),
      bodyFa: bodyFa.trim(),
      bodyEn: bodyFa.trim(),
      author: author?.trim() || 'دانشجوی دانشیار',
      badgeFa: badgeFa?.trim() || 'همدانشگاهی · مهندسی',
      badgeEn: badgeFa?.trim() || 'Campus Member',
      upvotes: 1,
      createdAt: 'لحظاتی پیش',
      comments: [],
    };
    campusThreadsStore.unshift(created);
    res.json({ thread: created });
  });

  app.post('/api/campus/threads/:id/upvote', (req, res) => {
    const thread = campusThreadsStore.find((t) => t.id === req.params.id);
    if (!thread) return res.status(404).json({ error: 'گفتگو یافت نشد.' });
    thread.upvotes += 1;
    res.json({ thread });
  });

  app.post('/api/campus/threads/:id/comments', (req, res) => {
    const thread = campusThreadsStore.find((t) => t.id === req.params.id);
    if (!thread) return res.status(404).json({ error: 'گفتگو یافت نشد.' });
    const { author, badgeFa, text, parentCommentId } = req.body as {
      author?: string;
      badgeFa?: string;
      text: string;
      parentCommentId?: string;
    };
    if (!text?.trim()) return res.status(400).json({ error: 'متن نظر خالی است.' });

    if (parentCommentId) {
      const parent = thread.comments.find((c) => c.id === parentCommentId);
      if (!parent) return res.status(404).json({ error: 'دیدگاه والد یافت نشد.' });
      parent.replies.push({
        id: `cr-${Date.now()}`,
        author: author?.trim() || 'همدانشگاهی',
        badgeFa: badgeFa?.trim() || 'دانشجوی مهندسی',
        badgeEn: 'Engineering Student',
        text: text.trim(),
        upvotes: 1,
        createdAt: 'هم‌اکنون',
      });
    } else {
      thread.comments.push({
        id: `cc-${Date.now()}`,
        author: author?.trim() || 'همدانشگاهی',
        badgeFa: badgeFa?.trim() || 'دانشجوی مهندسی',
        badgeEn: 'Engineering Student',
        text: text.trim(),
        upvotes: 1,
        createdAt: 'هم‌اکنون',
        replies: [],
      });
    }
    res.json({ thread });
  });

  app.post('/api/campus/threads/:id/comments/:commentId/upvote', (req, res) => {
    const thread = campusThreadsStore.find((t) => t.id === req.params.id);
    if (!thread) return res.status(404).json({ error: 'گفتگو یافت نشد.' });
    const comment = thread.comments.find((c) => c.id === req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'نظر یافت نشد.' });
    comment.upvotes += 1;
    res.json({ thread });
  });

  app.post('/api/campus/polls/:id/vote', (req, res) => {
    const poll = campusPollsStore.find((p) => p.id === req.params.id);
    if (!poll) return res.status(404).json({ error: 'نظرسنجی یافت نشد.' });
    const { optionId } = req.body as { optionId: string };
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) return res.status(400).json({ error: 'گزینه نامعتبر است.' });
    option.votes += 1;
    res.json({ poll });
  });

  // 10. AI Perspective Balanced Debate Summarizer for 'همدانشگاهی'
  app.post('/api/ai/campus-perspective', async (req, res) => {
    try {
      const { title, body, comments = [], lang = 'fa' } = req.body as {
        title: string;
        body: string;
        comments?: string[];
        lang?: 'fa' | 'en';
      };
      if (!title?.trim()) {
        return res.status(400).json({ error: 'عنوان بحث برای تحلیل ارسال نشده است.' });
      }
      aiQueryStats.chatBot += 1;
      const ai = getAI();
      const langRule =
        lang === 'fa'
          ? 'تمام خروجی را به زبان فارسی علمی، محترمانه، بی‌طرفانه و قابل اتکا بنویس.'
          : 'Write the entire balanced synthesis in clear, objective academic English.';

      const commentsContext =
        comments.length > 0
          ? `\nStudent viewpoints already shared:\n${comments.slice(0, 6).map((c, i) => `${i + 1}. ${c}`).join('\n')}`
          : '';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Analyze this university student & societal debate neutrally:\nTopic: ${title}\nContext: ${body}${commentsContext}\n${langRule}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
          systemInstruction:
            'You are a balanced university forum moderator and engineering ethics advisor. Synthesize both pro and con arguments fairly, highlight the engineering ethics perspective, and offer a constructive takeaway.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              proPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 strongest supporting or optimistic arguments.',
              },
              conPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 strongest critical concerns, counterarguments, or risks.',
              },
              ethicsLens: {
                type: Type.STRING,
                description: 'How engineering ethics and social responsibility frame this issue (2 sentences).',
              },
              balancedTakeaway: {
                type: Type.STRING,
                description: 'Actionable, nuanced synthesis for university students (2 sentences).',
              },
            },
            required: ['proPoints', 'conPoints', 'ethicsLens', 'balancedTakeaway'],
          },
        },
      });

      const parsed = parseJsonSafe(response.text, {
        proPoints: [],
        conPoints: [],
        ethicsLens: '',
        balancedTakeaway: '',
      });
      res.json({ perspective: parsed });
    } catch (err) {
      const parsed = formatApiError(err);
      res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // ==========================================================================
  // Community, Lecture Notes & Study Rooms REST APIs
  // ==========================================================================
  app.get('/api/notes', (_req, res) => {
    res.json({ notes: lectureNotesStore });
  });

  app.post('/api/notes', (req, res) => {
    const { titleFa, titleEn, courseCode, fieldFa, fieldEn, author, university, summaryFa, previewFormula } = req.body;
    if (!titleFa?.trim()) {
      return res.status(400).json({ error: 'عنوان جزوه الزامی است.' });
    }
    const newNote: LectureNote = {
      id: `note-${Date.now()}`,
      titleFa: titleFa.trim(),
      titleEn: titleEn?.trim() || titleFa.trim(),
      courseCode: courseCode?.trim() || 'ENG-101',
      fieldFa: fieldFa?.trim() || 'مهندسی عمومی',
      fieldEn: fieldEn?.trim() || 'General Engineering',
      author: author?.trim() || 'دانشجوی دانشیار',
      university: university?.trim() || 'دانشگاه سراسری',
      pages: Math.floor(Math.random() * 35) + 12,
      ratingSum: 5,
      ratingCount: 1,
      downloads: 1,
      summaryFa: summaryFa?.trim() || 'جزوه ارسالی توسط دانشجویان برای مرور مفاهیم کلیدی و فرمول‌ها.',
      summaryEn: summaryFa?.trim() || 'Peer-contributed lecture summary and formula sheet.',
      previewFormula: previewFormula?.trim() || 'E = mc^2',
      contentSnippet: summaryFa?.trim() || titleFa.trim(),
      createdAt: 'امروز',
    };
    lectureNotesStore.unshift(newNote);
    res.json({ note: newNote });
  });

  app.post('/api/notes/:id/rate', (req, res) => {
    const { id } = req.params;
    const { stars } = req.body as { stars: number };
    const note = lectureNotesStore.find((n) => n.id === id);
    if (!note) return res.status(404).json({ error: 'جزوه یافت نشد.' });
    const safeStars = Math.min(Math.max(Math.round(Number(stars) || 5), 1), 5);
    note.ratingSum += safeStars;
    note.ratingCount += 1;
    res.json({ note });
  });

  app.get('/api/forum', (_req, res) => {
    res.json({ threads: forumThreadsStore });
  });

  app.post('/api/forum', (req, res) => {
    const { title, body, field, courseCode, author } = req.body;
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ error: 'عنوان و متن پرسش الزامی است.' });
    }
    const newThread: ForumThread = {
      id: `th-${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      field: field?.trim() || 'مهندسی',
      courseCode: courseCode?.trim() || 'ENG-101',
      author: author?.trim() || 'دانشجوی دانشیار',
      upvotes: 1,
      solved: false,
      createdAt: 'لحظاتی پیش',
      replies: [],
    };
    forumThreadsStore.unshift(newThread);
    res.json({ thread: newThread });
  });

  app.post('/api/forum/:id/reply', (req, res) => {
    const thread = forumThreadsStore.find((t) => t.id === req.params.id);
    if (!thread) return res.status(404).json({ error: 'موضوع یافت نشد.' });
    const { author, text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'متن پاسخ الزامی است.' });
    thread.replies.push({
      id: `rep-${Date.now()}`,
      author: author?.trim() || 'هم‌کلاسی',
      text: text.trim(),
      createdAt: 'هم‌اکنون',
    });
    res.json({ thread });
  });

  app.post('/api/forum/:id/upvote', (req, res) => {
    const thread = forumThreadsStore.find((t) => t.id === req.params.id);
    if (!thread) return res.status(404).json({ error: 'موضوع یافت نشد.' });
    thread.upvotes += 1;
    res.json({ thread });
  });

  app.get('/api/rooms', (_req, res) => {
    const list = Array.from(studyRooms.values()).map((r) => getRoomPayload(r));
    res.json({ rooms: list });
  });

  app.post('/api/rooms', (req, res) => {
    const { nameFa, topicFa } = req.body as { nameFa?: string; topicFa?: string };
    if (!nameFa?.trim()) return res.status(400).json({ error: 'نام اتاق الزامی است.' });
    const id = `room-${Date.now().toString(36)}`;
    const newRoom: StudyRoomState = {
      id,
      nameFa: nameFa.trim(),
      nameEn: nameFa.trim(),
      topicFa: topicFa?.trim() || 'مطالعه گروهی و تمرکز عمیق',
      topicEn: topicFa?.trim() || 'Focused group engineering study',
      pomodoro: {
        phase: 'focus',
        durationSec: 25 * 60,
        remainingSec: 25 * 60,
        isRunning: false,
        updatedBy: 'سازنده اتاق',
      },
      goals: [],
      scratchpad: {
        content: 'تخته مشترک آماده یادداشت‌برداری و فرمول‌نویسی است...',
        lastEditedBy: 'سازنده اتاق',
        updatedAt: new Date().toISOString(),
      },
      chat: [],
    };
    studyRooms.set(id, newRoom);
    roomSockets.set(id, new Map());
    res.json({ room: getRoomPayload(newRoom) });
  });

  // ==========================================================================
  // Scientific Articles & Publication Hub APIs
  // ==========================================================================
  app.get('/api/articles', (_req, res) => {
    res.json({ articles: articlesStore });
  });

  app.post('/api/articles', (req, res) => {
    const {
      titleFa,
      titleEn,
      categoryFa,
      categoryEn,
      difficulty = 'intermediate',
      authorFa,
      authorEn,
      readMinutes = 6,
      excerptFa,
      markdownFa,
      codeSnippet,
      takeawaysFa = [],
    } = req.body;

    if (!titleFa?.trim() || !markdownFa?.trim()) {
      return res.status(400).json({ error: 'عنوان و متن مقاله الزامی است.' });
    }

    const newArticle: ScientificArticleRecord = {
      id: `art-${Date.now()}`,
      titleFa: titleFa.trim(),
      titleEn: titleEn?.trim() || titleFa.trim(),
      categoryFa: categoryFa?.trim() || 'مهندسی عمومی',
      categoryEn: categoryEn?.trim() || 'Engineering',
      difficulty,
      authorFa: authorFa?.trim() || 'نویسنده دانشیار',
      authorEn: authorEn?.trim() || authorFa?.trim() || 'DaneshYar Contributor',
      readMinutes: Number(readMinutes) || 5,
      date: 'امروز',
      image: '/src/assets/images/hero_engineering_lab_1795017177911.jpg',
      excerptFa: excerptFa?.trim() || markdownFa.trim().slice(0, 140) + '...',
      excerptEn: excerptFa?.trim() || markdownFa.trim().slice(0, 140) + '...',
      markdownFa: markdownFa.trim(),
      markdownEn: markdownFa.trim(),
      codeSnippet: codeSnippet?.code?.trim() ? codeSnippet : undefined,
      takeawaysFa: Array.isArray(takeawaysFa) && takeawaysFa.length > 0 ? takeawaysFa : ['نکته کلیدی مقاله منتشرشده'],
      takeawaysEn: Array.isArray(takeawaysFa) && takeawaysFa.length > 0 ? takeawaysFa : ['Key takeaway'],
    };

    articlesStore.unshift(newArticle);
    adminActivityLogs.unshift({
      id: `log-${Date.now()}`,
      actor: newArticle.authorFa,
      action: 'انتشار مقاله علمی',
      target: newArticle.titleFa,
      timestamp: 'هم‌اکنون',
    });

    res.json({ article: newArticle });
  });

  // ==========================================================================
  // Real-Time Academic Chat & @دانشیار AI Bot APIs
  // ==========================================================================
  app.get('/api/chat/state', (_req, res) => {
    res.json({
      channels: academicChannels,
      messagesByChannel: Object.fromEntries(channelMessagesStore.entries()),
    });
  });

  app.post('/api/chat/message', async (req, res) => {
    const { channelId, sender = 'دانشجو', role = 'student', text, lang = 'fa' } = req.body as {
      channelId: string;
      sender?: string;
      role?: 'student' | 'professor';
      text: string;
      lang?: 'fa' | 'en';
    };
    if (!channelId || !text?.trim()) {
      return res.status(400).json({ error: 'کانال و متن پیام الزامی است.' });
    }
    const list = channelMessagesStore.get(channelId) || [];
    const userMsg: AcademicChatMessage = {
      id: `m-${Date.now()}`,
      channelId,
      sender: sender.trim(),
      role,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    list.push(userMsg);
    channelMessagesStore.set(channelId, list.slice(-60));
    broadcastAcademicChat({ type: 'chat:message', message: userMsg });

    // Check if @دانشیار or @daneshyar was tagged
    const triggersBot = /@دانشیار|@daneshyar|@ai/i.test(text);
    let botMsg: AcademicChatMessage | null = null;

    if (triggersBot) {
      aiQueryStats.chatBot += 1;
      try {
        const ai = getAI();
        const channelMeta = academicChannels.find((c) => c.id === channelId);
        const recentContext = list
          .slice(-6)
          .map((m) => `${m.sender}: ${m.text}`)
          .join('\n');

        const aiResp = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `Channel: ${channelMeta?.nameFa || channelId} (${channelMeta?.courseCode || 'Engineering'})\nRecent thread:\n${recentContext}\n\nUser tagged you (@دانشیار). Respond concisely, directly, and helpfully using $...$ or $$...$$ LaTeX for equations.`,
          config: {
            systemInstruction: `${aiTuningConfig.systemPrompt}\nYou are replying inside a live university chat thread as @دانشیار. Keep responses crisp, encouraging, and mathematically rigorous.`,
          },
        });

        botMsg = {
          id: `bot-${Date.now()}`,
          channelId,
          sender: 'دستیار هوشمند @دانشیار',
          role: 'ai-bot',
          text: aiResp.text?.trim() || 'پاسخ آماده نشد.',
          timestamp: new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        const updatedList = channelMessagesStore.get(channelId) || [];
        updatedList.push(botMsg);
        channelMessagesStore.set(channelId, updatedList.slice(-60));
        broadcastAcademicChat({ type: 'chat:message', message: botMsg });
      } catch (err) {
        const parsed = formatApiError(err);
        botMsg = {
          id: `bot-err-${Date.now()}`,
          channelId,
          sender: 'دستیار هوشمند @دانشیار',
          role: 'ai-bot',
          text: parsed.message,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        };
        broadcastAcademicChat({ type: 'chat:message', message: botMsg });
      }
    }

    res.json({ message: userMsg, botMessage: botMsg });
  });

  // ==========================================================================
  // Comprehensive Admin Panel APIs
  // ==========================================================================
  app.get('/api/admin/overview', (_req, res) => {
    const activeUsersCount = adminUsersStore.filter((u) => u.status === 'active').length;
    const totalAiQueries = Object.values(aiQueryStats).reduce((a, b) => a + b, 0);
    res.json({
      metrics: {
        activeUsers: activeUsersCount * 214 + 38,
        totalRegisteredUsers: adminUsersStore.length,
        uploadedNotes: lectureNotesStore.length,
        publishedArticles: articlesStore.length,
        forumThreads: forumThreadsStore.length,
        totalAiQueries,
      },
      aiQueryBreakdown: aiQueryStats,
      users: adminUsersStore,
      logs: adminActivityLogs.slice(0, 20),
      aiConfig: aiTuningConfig,
    });
  });

  app.post('/api/admin/users', (req, res) => {
    const { name, email, university, major, role = 'Student' } = req.body;
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'نام و ایمیل کاربر الزامی است.' });
    }
    const newUser: AdminUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      university: university?.trim() || 'دانشگاه سراسری',
      major: major?.trim() || 'مهندسی',
      role,
      status: 'active',
      lastActive: 'هم‌اکنون',
      queriesCount: 0,
    };
    adminUsersStore.unshift(newUser);
    adminActivityLogs.unshift({
      id: `log-${Date.now()}`,
      actor: 'مدیر سیستم',
      action: 'افزودن کاربر جدید',
      target: `${newUser.name} (${newUser.role})`,
      timestamp: 'هم‌اکنون',
    });
    res.json({ user: newUser });
  });

  app.patch('/api/admin/users/:id', (req, res) => {
    const user = adminUsersStore.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد.' });
    const { role, status } = req.body as Partial<Pick<AdminUser, 'role' | 'status'>>;
    if (role) user.role = role;
    if (status) user.status = status;
    adminActivityLogs.unshift({
      id: `log-${Date.now()}`,
      actor: 'مدیر سیستم',
      action: role ? `تغییر نقش به ${role}` : `تغییر وضعیت به ${status}`,
      target: user.name,
      timestamp: 'هم‌اکنون',
    });
    res.json({ user, logs: adminActivityLogs.slice(0, 20) });
  });

  app.put('/api/admin/ai-config', (req, res) => {
    const { systemPrompt, temperature, feynmanStyle, thinkingLevel } = req.body as Partial<AiTuningConfig>;
    aiTuningConfig = {
      systemPrompt: systemPrompt?.trim() || aiTuningConfig.systemPrompt,
      temperature: typeof temperature === 'number' ? Math.min(1, Math.max(0, temperature)) : aiTuningConfig.temperature,
      feynmanStyle: feynmanStyle || aiTuningConfig.feynmanStyle,
      thinkingLevel: thinkingLevel || aiTuningConfig.thinkingLevel,
    };
    adminActivityLogs.unshift({
      id: `log-${Date.now()}`,
      actor: 'مدیر سیستم',
      action: 'به‌روزرسانی تنظیمات هوش مصنوعی',
      target: `${aiTuningConfig.feynmanStyle} · ${aiTuningConfig.thinkingLevel}`,
      timestamp: 'هم‌اکنون',
    });
    res.json({ aiConfig: aiTuningConfig, logs: adminActivityLogs.slice(0, 20) });
  });

  // ==========================================================================
  // Vite / Static Frontend Serving
  // ==========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`DaneshYar server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
