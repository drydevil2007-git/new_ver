// ============================================================================
// DaneshYar — Resilient API Bridge (Express Pass-Through + Static Hosting Fallback)
// ============================================================================

const GEMINI_MODEL = 'gemini-2.5-flash';

function getApiKey(): string {
  try {
    const custom = localStorage.getItem('dy_gemini_key') || localStorage.getItem('gemini_api_key');
    if (custom && custom.trim()) return custom.trim();
  } catch {
    /* ignore */
  }
  return '';
}

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return fallback;
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
}

const DEFAULT_AI_CONFIG = {
  systemPrompt:
    'تو «دانشیار» هستی، استاد و دستیار هوشمند آموزش مهندسی دانشگاهی. مفاهیم را با دقت علمی، مثال‌های شهودی روزمره، پرهیز از پیچیدگی غیرضروری و فرمول‌های استاندارد LaTeX آموزش بده.',
  temperature: 0.4,
  feynmanStyle: 'balanced' as 'storytelling' | 'balanced' | 'rigorous',
  thinkingLevel: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH',
};

async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const key = getApiKey();
  if (!key) {
    throw new Error('کلید هوش مصنوعی در تنظیمات ادمین تنظیم نشده است.');
  }
  const aiCfg = getLocal('dy_admin_ai_config', DEFAULT_AI_CONFIG);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: typeof aiCfg.temperature === 'number' ? aiCfg.temperature : 0.4,
      maxOutputTokens: 2048,
    },
    systemInstruction: {
      parts: [{ text: systemPrompt ? `${aiCfg.systemPrompt}\n${systemPrompt}` : aiCfg.systemPrompt }],
    },
  };

  const res = await originalFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`خطا در هوش مصنوعی جمینای (${res.status})`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function extractJson<T>(rawText: string, fallback: T): T {
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean) as T;
  } catch {
    return fallback;
  }
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// Seeded static-fallback stores matching Express schemas 1:1
const INITIAL_USERS = [
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
];

const INITIAL_LOGS = [
  { id: 'log-1', actor: 'سارا محمدی', action: 'تنظیم پرامپت فاینمن', target: 'AI Engine Config', timestamp: '۱۰:۲۴' },
  { id: 'log-2', actor: 'دکتر مریم شریعتی', action: 'انتشار مقاله جدید', target: 'درک شهودی تبدیل لاپلاس', timestamp: '۰۹:۵۰' },
];

const INITIAL_ARTICLES = [
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
    excerptEn: 'How higher-order RLC differential equations reduce to polynomial algebra and pole stability.',
    markdownFa: '## چرا حوزه زمان کافی نیست؟\n$$F(s) = \\int_0^\\infty f(t) e^{-st}\\,dt$$',
    markdownEn: '## One-Sided Laplace Transform\n$$F(s) = \\int_0^\\infty f(t) e^{-st}\\,dt$$',
    takeawaysFa: ['مشتق در زمان معادل ضرب در s است.'],
    takeawaysEn: ['Time differentiation maps to multiplication by s.'],
    status: 'published',
  },
];

const INITIAL_NOTES = [
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
    summaryFa: 'تحلیل کامل مدارهای مقاومتی، قضایای تونن و نورتن، پاسخ طبیعی و پله مدارهای RC، RL و RLC.',
    summaryEn: 'Complete resistive analysis, Thevenin/Norton equivalents, and RLC transient responses.',
    previewFormula: 'L\\frac{d^2i}{dt^2} + R\\frac{di}{dt} + \\frac{1}{C}i = \\frac{dv_s}{dt}',
    contentSnippet: 'قضیه تونن: هر شبکه خطی دوقطبی را می‌توان با یک منبع ولتاژ و مقاومت معادل جایگزین کرد.',
    createdAt: '۱۴۰۴/۰۸/۱۲',
    status: 'published',
  },
  {
    id: 'note-math-102',
    titleFa: 'فرمول‌نامه کامل ریاضی عمومی ۲ و انتگرال‌های چندگانه و برداری',
    titleEn: 'Calculus II & Vector Calculus Cheat-Sheet',
    courseCode: 'MATH-102',
    fieldFa: 'ریاضیات پایه مهندسی',
    fieldEn: 'Engineering Mathematics',
    author: 'امیرحسین رضایی',
    university: 'دانشگاه تهران',
    pages: 28,
    ratingSum: 245,
    ratingCount: 51,
    downloads: 2380,
    summaryFa: 'خلاصه مختصات استوانه‌ای و کروی، گرین، استوکس و دیورژانس گاوس.',
    summaryEn: 'Cylindrical/spherical coordinates, Green, Stokes, and Gauss Divergence theorems.',
    previewFormula: '\\iint_{\\Sigma} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_{\\partial\\Sigma} \\mathbf{F} \\cdot d\\mathbf{r}',
    contentSnippet: 'قضیه دیورژانس گاوس شار خروجی از سطح بسته را به انتگرال حجمی تبدیل می‌کند.',
    createdAt: '۱۴۰۴/۰۸/۰۵',
    status: 'published',
  },
];

const INITIAL_CAMPUS_THREADS = [
  {
    id: 'cmp-1',
    category: 'ai-future',
    titleFa: 'آینده مهندسی با هوش مصنوعی: آیا ابزارهای کدنویسی و طراحی جای مهندسان تازه‌کار را می‌گیرند؟',
    titleEn: 'Future of Engineering with AI: Will Copilots Replace Junior Engineers?',
    bodyFa: 'تجربه شما در دانشگاه و کارآموزی درباره مهارت‌های ضروری در عصر هوش مصنوعی چیست؟',
    bodyEn: 'How should university curricula shift toward systems thinking in the age of AI?',
    author: 'امیرحسین رضایی',
    badgeFa: 'ارشد برق · دانشگاه تهران',
    badgeEn: 'MSc Electrical · UT',
    upvotes: 142,
    createdAt: '۳ ساعت پیش',
    trending: true,
    comments: [],
  },
];

const INITIAL_CAMPUS_POLLS = [
  {
    id: 'poll-1',
    questionFa: 'بزرگ‌ترین چالش دانشجویان مهندسی در سال جاری چیست؟',
    questionEn: 'What is the biggest challenge for engineering students this year?',
    category: 'university-industry',
    options: [
      { id: 'p1-o1', labelFa: 'شکاف مهارت‌های دانشگاهی با نیاز واقعی صنعت', labelEn: 'University-to-industry skill gap', votes: 342 },
      { id: 'p1-o2', labelFa: 'سردرگمی میان مهاجرت تحصیلی و ماندن', labelEn: 'Migration vs. staying locally', votes: 289 },
    ],
  },
];

function appendLog(actor: string, action: string, target: string) {
  const logs = getLocal<any[]>('dy_admin_logs', INITIAL_LOGS);
  logs.unshift({
    id: `log-${Date.now()}`,
    actor,
    action,
    target,
    timestamp: 'هم‌اکنون',
  });
  setLocal('dy_admin_logs', logs.slice(0, 20));
  return logs.slice(0, 20);
}

const originalFetch = window.fetch.bind(window);

async function handleStaticApiFallback(apiPath: string, query: URLSearchParams, init?: RequestInit): Promise<Response> {
  const method = (init?.method || 'GET').toUpperCase();
  const body = init?.body ? JSON.parse(String(init.body)) : {};

  // Admin overview
  if (apiPath === '/api/admin/overview') {
    const users = getLocal<any[]>('dy_admin_users', INITIAL_USERS);
    const logs = getLocal<any[]>('dy_admin_logs', INITIAL_LOGS);
    const aiConfig = getLocal('dy_admin_ai_config', DEFAULT_AI_CONFIG);
    const notes = getLocal<any[]>('dy_notes', INITIAL_NOTES);
    const articles = getLocal<any[]>('dy_articles', INITIAL_ARTICLES);
    const threads = getLocal<any[]>('dy_forum_threads', []);
    return jsonResponse({
      metrics: {
        activeUsers: users.filter((u) => u.status === 'active').length * 214 + 38,
        totalRegisteredUsers: users.length,
        uploadedNotes: notes.length,
        publishedArticles: articles.length,
        forumThreads: threads.length || 3,
        totalAiQueries: 3493,
      },
      aiQueryBreakdown: {
        feynman: 1240,
        formulaSolver: 890,
        quiz: 615,
        chatBot: 430,
        pdfExtract: 318,
      },
      users,
      logs,
      aiConfig,
    });
  }

  // Admin Users
  if (apiPath === '/api/admin/users' && method === 'POST') {
    const users = getLocal<any[]>('dy_admin_users', INITIAL_USERS);
    const newUser = {
      id: `u-${Date.now()}`,
      name: body.name || 'کاربر جدید',
      email: body.email || 'user@university.edu',
      university: body.university || 'دانشگاه سراسری',
      major: body.major || 'مهندسی',
      role: body.role || 'Student',
      status: 'active',
      lastActive: 'هم‌اکنون',
      queriesCount: 0,
    };
    users.unshift(newUser);
    setLocal('dy_admin_users', users);
    const logs = appendLog('مدیر سیستم', 'افزودن کاربر جدید', newUser.name);
    return jsonResponse({ user: newUser, logs });
  }

  if (apiPath.startsWith('/api/admin/users/')) {
    const id = apiPath.split('/').pop()!;
    const users = getLocal<any[]>('dy_admin_users', INITIAL_USERS);
    if (method === 'PATCH') {
      const target = users.find((u) => u.id === id);
      if (!target) return jsonResponse({ error: 'کاربر یافت نشد.' }, 404);
      Object.assign(target, {
        ...(body.name ? { name: body.name } : {}),
        ...(body.email ? { email: body.email } : {}),
        ...(body.university ? { university: body.university } : {}),
        ...(body.major ? { major: body.major } : {}),
        ...(body.role ? { role: body.role } : {}),
        ...(body.status ? { status: body.status } : {}),
      });
      setLocal('dy_admin_users', users);
      const logs = appendLog('مدیر سیستم', 'به‌روزرسانی کاربر', target.name);
      return jsonResponse({ user: target, logs });
    }
    if (method === 'DELETE') {
      const next = users.filter((u) => u.id !== id);
      setLocal('dy_admin_users', next);
      const logs = appendLog('مدیر سیستم', 'حذف کاربر', id);
      return jsonResponse({ ok: true, id, logs });
    }
  }

  if (apiPath === '/api/admin/ai-config') {
    if (method === 'PUT') {
      const current = getLocal('dy_admin_ai_config', DEFAULT_AI_CONFIG);
      const updated = { ...current, ...body };
      setLocal('dy_admin_ai_config', updated);
      const logs = appendLog('مدیر سیستم', 'به‌روزرسانی تنظیمات AI', `${updated.feynmanStyle} · ${updated.thinkingLevel}`);
      return jsonResponse({ aiConfig: updated, logs });
    }
    return jsonResponse({ aiConfig: getLocal('dy_admin_ai_config', DEFAULT_AI_CONFIG) });
  }

  // Articles CRUD
  if (apiPath === '/api/articles') {
    const articles = getLocal<any[]>('dy_articles', INITIAL_ARTICLES);
    if (method === 'POST') {
      const created = {
        id: `art-${Date.now()}`,
        titleFa: body.titleFa || 'مقاله جدید',
        titleEn: body.titleEn || body.titleFa || 'New Guide',
        categoryFa: body.categoryFa || 'مهندسی عمومی',
        categoryEn: body.categoryEn || body.categoryFa || 'Engineering',
        difficulty: body.difficulty || 'intermediate',
        authorFa: body.authorFa || 'نویسنده دانشیار',
        authorEn: body.authorEn || body.authorFa || 'DaneshYar Contributor',
        readMinutes: Number(body.readMinutes) || 5,
        date: 'امروز',
        image: '/src/assets/images/hero_engineering_lab_1795017177911.jpg',
        excerptFa: body.excerptFa || String(body.markdownFa || '').slice(0, 120),
        excerptEn: body.excerptEn || body.excerptFa || '',
        markdownFa: body.markdownFa || '',
        markdownEn: body.markdownEn || body.markdownFa || '',
        codeSnippet: body.codeSnippet,
        takeawaysFa: body.takeawaysFa || ['نکته کلیدی مقاله'],
        takeawaysEn: body.takeawaysEn || ['Key takeaway'],
        status: 'published',
      };
      articles.unshift(created);
      setLocal('dy_articles', articles);
      return jsonResponse({ article: created });
    }
    const includeDrafts = query.get('includeDrafts') === 'true';
    return jsonResponse({
      articles: includeDrafts ? articles : articles.filter((a) => a.status !== 'draft'),
    });
  }

  if (apiPath.startsWith('/api/articles/')) {
    const id = apiPath.split('/').pop()!;
    const articles = getLocal<any[]>('dy_articles', INITIAL_ARTICLES);
    if (method === 'PATCH') {
      const art = articles.find((a) => a.id === id);
      if (!art) return jsonResponse({ error: 'مقاله یافت نشد.' }, 404);
      Object.assign(art, body);
      setLocal('dy_articles', articles);
      const logs = appendLog('مدیر سیستم', 'ویرایش مقاله علمی', art.titleFa);
      return jsonResponse({ article: art, logs });
    }
    if (method === 'DELETE') {
      const next = articles.filter((a) => a.id !== id);
      setLocal('dy_articles', next);
      const logs = appendLog('مدیر سیستم', 'حذف مقاله علمی', id);
      return jsonResponse({ ok: true, id, logs });
    }
  }

  // Notes CRUD
  if (apiPath === '/api/notes') {
    const notes = getLocal<any[]>('dy_notes', INITIAL_NOTES);
    if (method === 'POST') {
      const created = {
        id: `note-${Date.now()}`,
        titleFa: body.titleFa || 'جزوه جدید',
        titleEn: body.titleEn || body.titleFa || 'Lecture Note',
        courseCode: body.courseCode || 'ENG-101',
        fieldFa: body.fieldFa || 'مهندسی عمومی',
        fieldEn: body.fieldEn || 'Engineering',
        author: body.author || 'دانشجوی دانشیار',
        university: body.university || 'دانشگاه سراسری',
        pages: 24,
        ratingSum: 5,
        ratingCount: 1,
        downloads: 1,
        summaryFa: body.summaryFa || '',
        summaryEn: body.summaryFa || '',
        previewFormula: body.previewFormula || 'E = mc^2',
        contentSnippet: body.summaryFa || body.titleFa || '',
        createdAt: 'امروز',
        status: 'published',
      };
      notes.unshift(created);
      setLocal('dy_notes', notes);
      return jsonResponse({ note: created });
    }
    const includeDrafts = query.get('includeDrafts') === 'true';
    return jsonResponse({
      notes: includeDrafts ? notes : notes.filter((n) => n.status !== 'draft'),
    });
  }

  if (apiPath.startsWith('/api/notes/')) {
    const parts = apiPath.split('/');
    const id = parts[3];
    const notes = getLocal<any[]>('dy_notes', INITIAL_NOTES);
    if (parts[4] === 'rate' && method === 'POST') {
      const note = notes.find((n) => n.id === id);
      if (!note) return jsonResponse({ error: 'جزوه یافت نشد.' }, 404);
      note.ratingSum += Math.min(Math.max(Number(body.stars) || 5, 1), 5);
      note.ratingCount += 1;
      setLocal('dy_notes', notes);
      return jsonResponse({ note });
    }
    if (method === 'PATCH') {
      const note = notes.find((n) => n.id === id);
      if (!note) return jsonResponse({ error: 'جزوه یافت نشد.' }, 404);
      Object.assign(note, body);
      setLocal('dy_notes', notes);
      const logs = appendLog('مدیر سیستم', 'ویرایش جزوه', note.titleFa);
      return jsonResponse({ note, logs });
    }
    if (method === 'DELETE') {
      const next = notes.filter((n) => n.id !== id);
      setLocal('dy_notes', next);
      const logs = appendLog('مدیر سیستم', 'حذف جزوه', id);
      return jsonResponse({ ok: true, id, logs });
    }
  }

  // Campus state & actions
  if (apiPath === '/api/campus/state') {
    return jsonResponse({
      threads: getLocal('dy_campus_threads', INITIAL_CAMPUS_THREADS),
      polls: getLocal('dy_campus_polls', INITIAL_CAMPUS_POLLS),
    });
  }
  if (apiPath === '/api/campus/threads' && method === 'POST') {
    const threads = getLocal<any[]>('dy_campus_threads', INITIAL_CAMPUS_THREADS);
    const created = {
      id: `cmp-${Date.now()}`,
      category: body.category || 'student-life',
      titleFa: body.titleFa || body.title || 'گفتگو',
      titleEn: body.titleEn || body.titleFa || body.title || 'Discussion',
      bodyFa: body.bodyFa || body.body || '',
      bodyEn: body.bodyEn || body.bodyFa || body.body || '',
      author: body.author || 'دانشجوی دانشیار',
      badgeFa: body.badgeFa || 'دانشجو',
      badgeEn: 'Student',
      upvotes: 1,
      createdAt: 'هم‌اکنون',
      comments: [],
    };
    threads.unshift(created);
    setLocal('dy_campus_threads', threads);
    return jsonResponse({ thread: created });
  }
  if (apiPath.startsWith('/api/campus/polls/') && apiPath.endsWith('/vote')) {
    const id = apiPath.split('/')[4];
    const polls = getLocal<any[]>('dy_campus_polls', INITIAL_CAMPUS_POLLS);
    const poll = polls.find((p) => p.id === id);
    if (poll) {
      const opt = poll.options.find((o: any) => o.id === body.optionId);
      if (opt) opt.votes += 1;
      setLocal('dy_campus_polls', polls);
      return jsonResponse({ poll });
    }
  }

  // AI endpoints (when key configured in client)
  if (apiPath === '/api/ai/feynman') {
    const raw = await callGemini(
      `Explain "${body.topic}" using Feynman Technique (level: ${body.level || 'undergrad'}, lang: ${body.lang || 'fa'}) as JSON with keys title, analogy, simpleExplanation, realWorldExample, commonMisconception, keyFormulaLatex, selfCheckQuestion.`
    );
    return jsonResponse(extractJson(raw, {
      title: body.topic,
      analogy: `مفهوم ${body.topic} را می‌توان با جریان آب و ذخیره انرژی در یک سیستم ساده تشبیه کرد.`,
      simpleExplanation: 'ورودی و خروجی سیستم از طریق قوانین پایستگی به هم مرتبط می‌شوند.',
      realWorldExample: 'کاربرد مستقیم در طراحی سیستم‌های صنعتی و کنترل خودکار.',
      commonMisconception: 'نادیده گرفتن شرایط مرزی و غیرخطی بودن سیستم.',
      keyFormulaLatex: 'H(s) = \\frac{Y(s)}{X(s)}',
      selfCheckQuestion: 'اگر ثابت زمانی سیستم دو برابر شود چه اتفاقی می‌افتد؟',
    }));
  }

  if (apiPath === '/api/ai/flashcards') {
    const raw = await callGemini(
      `Generate ${body.count || 5} flashcards for "${body.sourceText}" in ${body.lang || 'fa'} as JSON { "cards": [{ "front", "back", "formulaLatex", "hint" }] }.`
    );
    const parsed = extractJson<{ cards?: any[]; flashcards?: any[] }>(raw, {
      cards: [{ front: body.sourceText, back: 'پاسخ مفهومی کلیدی', formulaLatex: 'H(s)=Y(s)/X(s)', hint: 'نکته کلیدی' }],
    });
    return jsonResponse({ cards: parsed.cards || parsed.flashcards || [] });
  }

  if (apiPath === '/api/ai/campus-perspective') {
    const raw = await callGemini(
      `Analyze "${body.title || body.threadTitle}" neutrally in ${body.lang || 'fa'} and return JSON { "proPoints": [], "conPoints": [], "ethicsLens": "", "balancedTakeaway": "" }.`
    );
    return jsonResponse({
      perspective: extractJson(raw, {
        proPoints: ['افزایش بهره‌وری و دسترسی سریع‌تر به ابزارهای تحلیلی'],
        conPoints: ['خطر کاهش تسلط بر مبانی پایه بدون تمرین مستقل'],
        ethicsLens: 'مهندس مسئول اعتبارسنجی مستقل نتایج ابزارهاست.',
        balancedTakeaway: 'ترکیب تسلط تئوری با ابزارهای مدرن بهترین مسیر حرفه‌ای است.',
      }),
    });
  }

  return jsonResponse({ error: 'مسیر یافت نشد.' }, 404);
}

window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  if (url.startsWith('/api/') || url.includes('/api/')) {
    const parsedUrl = new URL(url, window.location.origin);
    const apiPath = parsedUrl.pathname;

    try {
      const realResp = await originalFetch(input, init);
      const contentType = realResp.headers.get('content-type') || '';
      if (realResp.status !== 404 && !contentType.includes('text/html')) {
        return realResp;
      }
    } catch {
      // Static host / offline fallback below
    }

    try {
      return await handleStaticApiFallback(apiPath, parsedUrl.searchParams, init);
    } catch (err) {
      return jsonResponse(
        { error: err instanceof Error ? err.message : 'خطای پردازش درخواست' },
        500
      );
    }
  }

  return originalFetch(input, init);
};
