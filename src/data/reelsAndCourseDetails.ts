import {
  CourseItem,
  CourseRichDetail,
  CuratedVideoLecture,
  ReelLesson,
  ReelVisualType,
} from '../types/app';
import { getDeepEnrichmentForCourse } from './deepCourseEnrichment';

export const DANESH_REELS: ReelLesson[] = [
  {
    id: 'reel-circuits',
    courseCode: 'EE-201',
    storyTitleFa: 'مدار الکتریکی',
    storyTitleEn: 'Circuits',
    titleFa: 'راز تشدید و میرایی در مدارهای RLC در ۳۰ ثانیه',
    titleEn: 'RLC Resonance & Damping Intuition in 30s',
    categoryFa: 'مهندسی برق',
    categoryEn: 'Electrical Eng.',
    fieldId: 'ee-power',
    image: '/src/assets/images/reel_circuits_oscilloscope_1795019066028.jpg',
    ringGradient: 'from-amber-400 via-rose-500 to-sky-500',
    visualType: 'oscilloscope',
    formulaLatex: '\\alpha = \\frac{R}{2L}, \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}}',
    feynmanBulletsFa: [
      'سلف مثل چرخ طیار سنگین با تغییر جریان مخالفت می‌کند و انرژی را مغناطیسی نگه می‌دارد.',
      'خازن مثل مخزن آب، ولتاژ را ذخیره کرده و جلوی پرش ناگهانی آن را می‌گیرد.',
      'مقاومت انرژی این نوسان رفت‌وبرگشتی را مثل اصطکاک به گرما تبدیل و آرام می‌کند.',
      'وقتی α = ω₀ شود، سیستم بدون نوسان اضافی سریع‌ترین پاسخ را می‌دهد (میرایی بحرانی).',
    ],
    feynmanBulletsEn: [
      'Inductors act like heavy flywheels resisting sudden current changes via magnetic storage.',
      'Capacitors behave like elastic pressure tanks buffering sudden voltage spikes.',
      'Resistors act as friction, converting oscillating energy smoothly into heat.',
      'When α equals ω₀, the circuit settles fastest without overshoot (critical damping).',
    ],
    narrationFa:
      'در مدارهای الکتریکی سری آر ال سی، سلف و خازن انرژی را میان میدان مغناطیسی و الکتریکی دست‌به‌دست می‌کنند، درست مثل پاندولی که در هوا تاب می‌خورد. مقاومت همان اصطکاک است که این نوسان را آرام می‌کند. اگر نسبت آر به دو ال دقیقاً با فرکانس تشدید برابر شود، به نقطه طلایی میرایی بحرانی می‌رسیم.',
    narrationEn:
      'In a series RLC circuit, inductors and capacitors pass energy back and forth like a swinging pendulum. Resistance acts as damping friction. When alpha equals omega-naught, you hit critical damping—the fastest possible response without ringing.',
    likes: 1420,
    saves: 486,
    shares: 192,
  },
  {
    id: 'reel-quantum',
    courseCode: 'PHYS-201',
    storyTitleFa: 'فیزیک کوانتوم',
    storyTitleEn: 'Quantum',
    titleFa: 'چرا الکترون‌ها در اتم سقوط نمی‌کنند؟ (معادله شرودینگر)',
    titleEn: 'Standing Waves & Quantized Energy Levels',
    categoryFa: 'فیزیک مهندسی',
    categoryEn: 'Physics',
    fieldId: 'physics',
    image: '/src/assets/images/reel_quantum_wave_1795019065831.jpg',
    ringGradient: 'from-cyan-400 via-sky-500 to-indigo-600',
    visualType: 'quantum',
    formulaLatex: 'i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\nabla^2\\psi + V\\psi',
    feynmanBulletsFa: [
      'الکترون در مقیاس نانو یک ذره نقطه‌ای نیست؛ مثل موج ایستاده روی سیم گیتار رفتار می‌کند.',
      'فقط طول‌موج‌هایی دور هسته دوام می‌آورند که یک دور کامل با خودشان هم‌فاز شوند.',
      'این هم‌فازی اجباری باعث گسسته‌شدن سطوح انرژی و پایه نیمه‌رساناها و ترانزیستورها می‌شود.',
    ],
    feynmanBulletsEn: [
      'At atomic scales, electrons behave like standing waves plucked along a guitar string.',
      'Only wavelengths forming closed constructive loops around the nucleus survive.',
      'This natural boundary constraint quantizes energy levels and enables all semiconductors.',
    ],
    narrationFa:
      'الکترون دور هسته اتم مثل یک موج ایستاده روی سیم گیتار است. فقط فرکانس‌هایی مجاز هستند که پس از یک دور چرخش دقیقاً روی خودشان منطبق شوند؛ به همین دلیل ترازهای انرژی کوانتیده می‌شوند و شیمی و نیمه‌رساناها شکل می‌گیرند.',
    narrationEn:
      'An electron bound to an atom behaves like a standing wave on a guitar string. Only wavelengths that fit cleanly around the orbit interfere constructively, creating discrete energy bands that power modern transistors.',
    likes: 1890,
    saves: 640,
    shares: 315,
  },
  {
    id: 'reel-ai',
    courseCode: 'AI-401',
    storyTitleFa: 'هوش مصنوعی',
    storyTitleEn: 'AI & Attention',
    titleFa: 'معماری Transformer و جادوی Self-Attention در مدل‌های زبانی',
    titleEn: 'How Self-Attention Connects Context in Transformers',
    categoryFa: 'هوش مصنوعی',
    categoryEn: 'AI & ML',
    fieldId: 'cs-ai',
    image: '/src/assets/images/reel_ai_neural_1795019066672.jpg',
    ringGradient: 'from-amber-400 via-orange-500 to-sky-500',
    visualType: 'neural',
    formulaLatex: '\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
    feynmanBulletsFa: [
      'هر کلمه در جمله سه بردار می‌سازد: پرس‌وجو (Query)، کلید (Key) و مقدار (Value).',
      'ضرب نقطه‌ای Q در K میزان ارتباط هر کلمه با تمام کلمات دیگر جمله را هم‌زمان می‌سنجد.',
      'تقسیم بر جذر d_k از اشباع‌شدن تابع Softmax جلوگیری کرده و گرادیان‌ها را زنده نگه می‌دارد.',
    ],
    feynmanBulletsEn: [
      'Each token emits three projections: a Query, a Key, and a Value vector.',
      'Dot products between Queries and Keys score relevance across every token simultaneously.',
      'Scaling by square-root d_k keeps Softmax gradients crisp during deep backpropagation.',
    ],
    narrationFa:
      'در معماری ترنسفورمر به جای خواندن جمله کلمه به کلمه، هر واژه یک پرس‌وجو می‌فرستد تا ببیند به کدام واژه‌های دیگر جمله بیشتر وابسته است. ضرب داخلی کوئری و کلید وزن توجه را می‌سازد و تمام زمینه جمله در یک گام موازی ترکیب می‌شود.',
    narrationEn:
      'Instead of reading word by word, a Transformer lets every token query every other token in parallel. Query-Key dot products compute attention weights so long-range context fuses in a single matrix pass.',
    likes: 2640,
    saves: 980,
    shares: 520,
  },
  {
    id: 'reel-algorithms',
    courseCode: 'CS-301',
    storyTitleFa: 'برنامه‌نویسی',
    storyTitleEn: 'Algorithms',
    titleFa: 'الگوریتم دایکسترا و برنامه‌ریزی پویا روی گراف‌ها',
    titleEn: 'Shortest Paths: Why Dijkstra Always Picks the Nearest Wavefront',
    categoryFa: 'کامپیوتر',
    categoryEn: 'Algorithms',
    fieldId: 'cs-algorithms',
    image: '/src/assets/images/reel_code_algorithms_1795019066671.jpg',
    ringGradient: 'from-emerald-400 via-teal-500 to-sky-500',
    visualType: 'graph',
    formulaLatex: 'T(V, E) = O((V + E)\\log V)',
    feynmanBulletsFa: [
      'دایکسترا مثل موج آب در کانال‌ها پیش می‌رود و همیشه نزدیک‌ترین راس دیده نشده را تثبیت می‌کند.',
      'اگر همه وزن‌ها مثبت باشند، هیچ مسیر غیرمستقیمی نمی‌تواند از کوتاه‌ترین مسیر فعلی ارزان‌تر شود.',
      'استفاده از Min-Heap انتخاب راس بعدی را از زمان خطی به لگاریتمی کاهش می‌دهد.',
    ],
    feynmanBulletsEn: [
      'Dijkstra expands like water flooding pipes, locking in the closest unvisited node next.',
      'With non-negative weights, no detour through farther nodes can beat the minimum frontier.',
      'A binary Min-Heap trims candidate selection from linear scans down to logarithmic time.',
    ],
    narrationFa:
      'الگوریتم دایکسترا درست مثل پخش‌شدن موج آب در شبکه لوله‌هاست؛ همیشه نزدیک‌ترین گره به مبدا را قطعی می‌کند چون با وزن‌های مثبت هیچ مسیر دورتر نمی‌تواند میان‌بر ارزان‌تری بسازد.',
    narrationEn:
      'Dijkstra works like water expanding through pipes: it locks in the closest unvisited frontier node because positive edge weights guarantee no longer path can double back cheaper.',
    likes: 1750,
    saves: 612,
    shares: 248,
  },
  {
    id: 'reel-thermo',
    courseCode: 'ME-204',
    storyTitleFa: 'ترمودینامیک',
    storyTitleEn: 'Thermo',
    titleFa: 'چرا بازده هیچ موتور گرمایی به ۱۰۰٪ نمی‌رسد؟ (قانون دوم و آنتروپی)',
    titleEn: 'Carnot Limit & Entropy: Why Heat Engines Never Hit 100%',
    categoryFa: 'مهندسی مکانیک',
    categoryEn: 'Mechanical Eng.',
    fieldId: 'me-thermo',
    image: '/src/assets/images/course_thermodynamics_mech_1795017177354.jpg',
    ringGradient: 'from-orange-400 via-amber-500 to-rose-500',
    visualType: 'thermo',
    formulaLatex: '\\eta_{\\max} = 1 - \\frac{T_C}{T_H}',
    feynmanBulletsFa: [
      'گرما حرکت بی‌نظم میلیاردها مولکول است و کار مکانیکی حرکت هم‌جهت همه آن‌ها.',
      'برای تبدیل حرکت تصادفی به کار منظم، ناگزیر بخشی از گرما باید به چشمه سرد منتقل شود.',
      'اختلاف دمای منبع داغ و چشمه سرد سقف راندمان هر نیروگاه و موتور جت را تعیین می‌کند.',
    ],
    feynmanBulletsEn: [
      'Heat is disordered molecular jitter, while mechanical work is coordinated motion.',
      'Turning random thermal jitter into directional torque requires rejecting waste heat.',
      'The temperature gap between hot combustion and cold sink caps maximum Carnot efficiency.',
    ],
    narrationFa:
      'چرا هیچ نیروگاهی صد درصد گرمای سوخت را به برق تبدیل نمی‌کند؟ چون گرما حرکت تصادفی مولکول‌هاست و برای مرتب‌کردن بخشی از آن به شکل کار مکانیکی، بخشی از انرژی حتماً باید به محیط سرد تخلیه شود.',
    narrationEn:
      'Heat is random molecular motion, whereas shaft work is coordinated energy. To organize thermal jitter into torque, some entropy must be exported to a colder reservoir, capping efficiency at the Carnot limit.',
    likes: 1180,
    saves: 394,
    shares: 145,
  },
  {
    id: 'reel-control',
    courseCode: 'EE-341',
    storyTitleFa: 'کنترل خطی',
    storyTitleEn: 'Control',
    titleFa: 'قطب‌های تابع تبدیل چطور آینده سیستم را پیش‌بینی می‌کنند؟',
    titleEn: 'How S-Plane Poles Predict System Stability & Overshoot',
    categoryFa: 'برق — کنترل',
    categoryEn: 'Control Systems',
    fieldId: 'ee-control',
    image: '/src/assets/images/course_electrical_circuits_1795017176720.jpg',
    ringGradient: 'from-sky-400 via-blue-500 to-indigo-500',
    visualType: 'oscilloscope',
    formulaLatex: 's = -\\zeta\\omega_n \\pm j\\omega_n\\sqrt{1-\\zeta^2}',
    feynmanBulletsFa: [
      'بخش حقیقی قطب تعیین می‌کند سیستم چقدر سریع آرام می‌شود (سمت چپ یعنی پایدار).',
      'بخش موهومی قطب فرکانس لرزش و نوسان سیستم هنگام رسیدن به هدف را مشخص می‌کند.',
      'با کنترل‌کننده PID می‌توان قطب‌های سیستم را به ناحیه امن و سریع صفحه s جابه‌جا کرد.',
    ],
    feynmanBulletsEn: [
      'The real coordinate σ controls how fast transients decay (left-half plane = stable).',
      'The imaginary coordinate ω sets oscillation frequency during step settling.',
      'Tuning a PID controller relocates closed-loop poles into the sweet spot.',
    ],
    narrationFa:
      'قطب‌های تابع تبدیل مثل اثر انگشت رفتار سیستم هستند. هرچه قطب‌ها بیشتر به سمت چپ محور عمودی بروند سیستم سریع‌تر آرام می‌شود، و فاصله از محور افقی میزان لرزش آن را تعیین می‌کند.',
    narrationEn:
      'Transfer-function poles act like an X-ray of system behavior. Moving poles farther left speeds up settling, while height off the real axis sets ringing frequency.',
    likes: 1310,
    saves: 420,
    shares: 170,
  },
];

function inferVisualType(fieldId: string): ReelVisualType {
  if (fieldId.startsWith('ee-') || fieldId === 'embedded' || fieldId === 'robotics') return 'oscilloscope';
  if (fieldId === 'physics' || fieldId === 'optics' || fieldId === 'nuclear') return 'quantum';
  if (fieldId === 'cs-ai' || fieldId === 'data-sci') return 'neural';
  if (fieldId.startsWith('cs-') || fieldId === 'math' || fieldId === 'stats' || fieldId === 'numerical') return 'graph';
  return 'thermo';
}

function inferImageForField(fieldId: string): string {
  const v = inferVisualType(fieldId);
  if (v === 'oscilloscope') return '/src/assets/images/reel_circuits_oscilloscope_1795019066028.jpg';
  if (v === 'quantum') return '/src/assets/images/reel_quantum_wave_1795019065831.jpg';
  if (v === 'neural') return '/src/assets/images/reel_ai_neural_1795019066672.jpg';
  if (v === 'graph') return '/src/assets/images/reel_code_algorithms_1795019066671.jpg';
  return '/src/assets/images/course_thermodynamics_mech_1795017177354.jpg';
}

export function buildReelForCourse(course: CourseItem): ReelLesson {
  const existing = DANESH_REELS.find((r) => r.courseCode === course.code);
  if (existing) return existing;

  const visualType = inferVisualType(course.fieldId);
  const image = inferImageForField(course.fieldId);
  const topicsListFa = course.topicsFa.slice(0, 3);
  const topicsListEn = course.topicsEn.slice(0, 3);

  return {
    id: `reel-${course.id}`,
    courseCode: course.code,
    storyTitleFa: course.titleFa.split('(')[0].trim().slice(0, 22),
    storyTitleEn: course.titleEn.split('(')[0].trim().slice(0, 20),
    titleFa: `${course.titleFa}: مرور سریع فاینمن در ۳۰ ثانیه`,
    titleEn: `${course.titleEn}: 30-Second Feynman Breakdown`,
    categoryFa: course.code,
    categoryEn: course.code,
    fieldId: course.fieldId,
    image,
    ringGradient: 'from-sky-400 via-cyan-500 to-emerald-500',
    visualType,
    formulaLatex: course.keyFormula,
    feynmanBulletsFa: [
      `هسته اصلی درس ${course.titleFa} پیرامون ${topicsListFa[0] || 'مدل‌سازی مهندسی'} شکل می‌گیرد.`,
      ...(topicsListFa[1] ? [`ارتباط مستقیم با ${topicsListFa[1]} برای تحلیل رفتار واقعی سیستم.`] : []),
      ...(topicsListFa[2] ? [`تسلط بر ${topicsListFa[2]} کلید حل مسائل امتحانی و پروژه‌های صنعتی است.`] : []),
    ],
    feynmanBulletsEn: [
      `The core intuition of ${course.titleEn} revolves around ${topicsListEn[0] || 'engineering modeling'}.`,
      ...(topicsListEn[1] ? [`Connects directly to ${topicsListEn[1]} for analyzing real physical systems.`] : []),
      ...(topicsListEn[2] ? [`Mastering ${topicsListEn[2]} unlocks both exam problems and industrial design.`] : []),
    ],
    narrationFa: `مرور سریع درس ${course.titleFa}. در این مبحث ابتدا بر ${topicsListFa.join('، ')} تمرکز می‌کنیم تا شهود فیزیکی و فرمول بنیادین درس کاملاً در ذهن تثبیت شود.`,
    narrationEn: `Quick micro-lesson for ${course.titleEn}. Focus on ${topicsListEn.join(', ')} to lock in both the core physical intuition and governing equation.`,
    likes: 420 + (course.code.charCodeAt(0) * 7) % 600,
    saves: 140 + (course.code.charCodeAt(1) * 5) % 250,
    shares: 52 + (course.code.charCodeAt(2) * 3) % 90,
  };
}

// ============================================================================
// Rich Course Detail & Explanation Engine (Child-5 Analogy, Syllabus, Industry, Videos)
// ============================================================================
interface DomainBlueprint {
  child5Fa: string;
  child5En: string;
  industryFa: string[];
  industryEn: string[];
  marketFa: string;
  marketEn: string;
  tools: string[];
  videos: CuratedVideoLecture[];
}

const DOMAIN_BLUEPRINTS: Record<string, DomainBlueprint> = {
  ee: {
    child5Fa:
      'تصور کن برق مثل آبی است که توی لوله‌ها جریان دارد: ولتاژ مثل فشار پمپ آب است، جریان مثل مقدار آبی که از لوله رد می‌شود و مقاومت مثل تنگ‌شدن شلنگ آب وقتی رویش پا می‌گذاری!',
    child5En:
      'Imagine electricity as water flowing through garden pipes: voltage is the water pressure pushing it, current is how fast water flows, and resistance is stepping gently on the hose to slow it down!',
    industryFa: [
      'طراحی بردهای الکترونیکی قدرت، اینورترهای خورشیدی و شارژرهای سریع خودروهای برقی',
      'کنترل هوشمند شبکه‌های توزیع برق، پست‌های فشار قوی و ربات‌های صنعتی',
      'پردازش سیگنال راداری، مخابرات 5G و طراحی تراشه‌های مجتمع CMOS',
    ],
    industryEn: [
      'Power electronics inverters, EV fast chargers, and PCB hardware design',
      'Smart grid stabilization, industrial motor drives, and autonomous control loops',
      '5G RF front-ends, DSP signal pipelines, and mixed-signal CMOS IC design',
    ],
    marketFa:
      'تقاضای بسیار بالا در شرکت‌های اتوماسیون صنعتی، مخابرات، انرژی‌های نو، خودروسازی برقی و استارتاپ‌های سخت‌افزاری.',
    marketEn:
      'High global demand across EV powertrains, semiconductor fabs, telecom hardware, and industrial automation.',
    tools: ['MATLAB / Simulink', 'LTspice / PSpice', 'Altium Designer', 'Cadence Virtuoso'],
    videos: [
      {
        id: 'v-ee-1',
        titleFa: 'مجموعه درس تحلیل مدار و سیستم‌ها — دانشگاه صنعتی شریف (مکتب‌خونه)',
        titleEn: 'Circuits & Electronics Full Series — MIT 6.002 OCW',
        source: 'مکتب‌خونه / درس‌افزار شریف',
        instructor: 'دکتر سیدعلی‌اکبر جلالی / اساتید دانشکده برق',
        duration: '۲۴ جلسه · ۴۵ دقیقه',
        language: 'fa',
        focusFa: 'تحلیل گره و مش، قضایای شبکه، پاسخ گذرا و تبدیل لاپلاس',
        focusEn: 'Nodal/mesh methods, Thevenin equivalents, and Laplace transients',
      },
      {
        id: 'v-ee-2',
        titleFa: 'درک بصری سری فوریه و لاپلاس (3Blue1Brown)',
        titleEn: 'But What is the Fourier / Laplace Transform? (3Blue1Brown)',
        source: 'MIT OCW / 3Blue1Brown',
        instructor: 'Prof. Anant Agarwal & Grant Sanderson',
        duration: '22 min Visual Deep Dive',
        language: 'en',
        focusFa: 'تصویرسازی هندسی تبدیل سیگنال به چرخش‌های فرکانسی',
        focusEn: 'Visualizing frequency wrapping, poles, and system stability',
      },
    ],
  },
  cs: {
    child5Fa:
      'فکر کن داری اتاق اسباب‌بازی‌هایت را مرتب می‌کنی: اگر لگوها را توی جعبه‌های برچسب‌دار بگذاری (ساختمان داده) و یک نقشه سریع برای پیداکردن اسباب‌بازی محبوبت بکشی (الگوریتم)، هر بار در یک چشم‌به‌هم‌زدن پیدایش می‌کنی!',
    child5En:
      'Imagine sorting your toy room: if you put LEGO bricks in labeled bins (Data Structures) and follow a clever shortcut checklist to find your favorite robot (Algorithms), you find anything in one second!',
    industryFa: [
      'معماری سرویس‌های کلود مقیاس‌پذیر، موتورهای جستجو و پایگاه‌داده‌های توزیع‌شده',
      'توسعه مدل‌های هوش مصنوعی، بینایی ماشین و سیستم‌های پیشنهادگر هوشمند',
      'بهینه‌سازی مسیر ناوگان، امنیت سایبری و پردازش بلادرنگ جریان داده',
    ],
    industryEn: [
      'High-throughput cloud backends, distributed databases, and search engines',
      'Production machine learning pipelines, LLMs, and computer vision systems',
      'Low-latency routing optimization, cryptography, and cybersecurity architecture',
    ],
    marketFa:
      'بیشترین سهم فرصت‌های شغلی فناوری اطلاعات و هوش مصنوعی با امکان کار بین‌المللی و استارتاپی.',
    marketEn:
      'Top-tier market demand across AI engineering, backend architecture, systems engineering, and fintech.',
    tools: ['Python / PyTorch', 'C++20 / Rust', 'Docker & Kubernetes', 'PostgreSQL / Redis'],
    videos: [
      {
        id: 'v-cs-1',
        titleFa: 'ساختمان داده و طراحی الگوریتم — دانشگاه صنعتی شریف و تهران',
        titleEn: 'Introduction to Algorithms — MIT 6.006 / Stanford CS161',
        source: 'مکتب‌خونه / کوئرا کالج',
        instructor: 'دکتر محمد قدسی / دکتر حمید ضرابی‌زاده',
        duration: '۲۸ جلسه کامل',
        language: 'fa',
        focusFa: 'درخت‌های متوازن، گراف، برنامه‌ریزی پویا و تحلیل پیچیدگی زمانی',
        focusEn: 'Balanced trees, graph traversal, dynamic programming, and asymptotic bounds',
      },
      {
        id: 'v-cs-2',
        titleFa: 'یادگیری عمیق و شبکه‌های عصبی (Stanford CS231n / Karpathy)',
        titleEn: 'Neural Networks: Zero to Hero & Transformers (Andrej Karpathy)',
        source: 'Stanford Online / Karpathy Lectures',
        instructor: 'Andrej Karpathy',
        duration: '2h 15m Interactive Lecture',
        language: 'en',
        focusFa: 'پیاده‌سازی گام‌به‌گام گرادیان، پس‌انتشار خطا و بلوک Attention',
        focusEn: 'Building backpropagation and self-attention transformers from scratch',
      },
    ],
  },
  me: {
    child5Fa:
      'وقتی کتری روی اجاق می‌جوشد، بخار داغ دوست دارد به سمت بیرون بدود و درپوش کتری را تکان دهد! مهندس‌ها همین هل‌دادن بخار را کنترل می‌کنند تا چرخ قطار یا موتور هواپیما را بچرخانند.',
    child5En:
      'When water boils in a kettle, hot steam wants to race out and rattle the lid! Mechanical engineers guide that steam push so smoothly that it spins huge turbines and flies airplanes.',
    industryFa: [
      'طراحی توربین‌های نیروگاهی، کمپرسورهای صنعتی، موتورهای جت و سیستم‌های HVAC',
      'تحلیل استحکام، ارتعاشات و ایمنی برخورد در بدنه خودروها و ربات‌های جراح',
      'شبیه‌سازی آیرودینامیک جریان سیال (CFD) و تولید قطعات دقیق CNC',
    ],
    industryEn: [
      'Gas & steam turbines, HVAC thermal systems, and aerospace propulsion',
      'Structural fatigue, vibration isolation, and automotive crashworthiness',
      'Computational Fluid Dynamics (CFD) aerodynamics and precision CAD/CAM',
    ],
    marketFa:
      'جایگاه کلیدی در صنایع نفت و گاز، نیروگاه‌ها، خودروسازی، هوافضا و شرکت‌های طراحی مهندسی و بازرسی فنی.',
    marketEn:
      'Essential across aerospace, energy turbines, automotive R&D, robotics, and thermal management.',
    tools: ['ANSYS Fluent & Mechanical', 'SolidWorks / CATIA', 'ABAQUS', 'MATLAB'],
    videos: [
      {
        id: 'v-me-1',
        titleFa: 'آموزش جامع ترمودینامیک و مکانیک سیالات مهندسی (فرادرس / مکتب‌خونه)',
        titleEn: 'Engineering Thermodynamics & Fluid Mechanics — MIT / NPTEL',
        source: 'مکتب‌خونه / دانشگاه علم و صنعت',
        instructor: 'اساتید دانشکده مکانیک',
        duration: '۲۲ جلسه · ۵۰ دقیقه',
        language: 'fa',
        focusFa: 'قانون اول و دوم، نمودارهای T-s، معادله برنولی و تحلیل چرخه‌های توان',
        focusEn: 'Control volumes, entropy generation, Bernoulli flows, and power cycles',
      },
      {
        id: 'v-me-2',
        titleFa: 'مبانی انتقال حرارت و جریان آشفته (Stanford / MIT)',
        titleEn: 'Navier-Stokes & Boundary Layers Visualized (MIT Fluids)',
        source: 'MIT OpenCourseWare',
        instructor: 'Prof. Ascher Shapiro / Dr. John Bush',
        duration: '45 min Classic Lab',
        language: 'en',
        focusFa: 'دیدن جریان آرام و آشفته در تونل آب و تفسیر فیزیکی عدد رینولدز',
        focusEn: 'Observing laminar-turbulent transition and boundary-layer separation',
      },
    ],
  },
  math: {
    child5Fa:
      'مشتق مثل سرعت‌سنج ماشین است که همین الان می‌گوید چقدر تند می‌روی؛ انتگرال هم مثل این است که همه‌چیزهایی را که در طول سفر جمع کرده‌ای روی هم بچینی تا کل مسافت راه را بفهمی!',
    child5En:
      'A derivative is like a car speedometer telling how fast you are moving right this instant; an integral adds up all those tiny steps over the whole trip to tell you how far you traveled!',
    industryFa: [
      'مدل‌سازی کمی در علوم مهندسی، بهینه‌سازی مالی، کنترل پرواز و شبیه‌سازی فیزیکی',
      'پایه ریاضی الگوریتم‌های یادگیری عمیق (جبر خطی، گرادیان و تئوری احتمال)',
      'تحلیل المان محدود (FEM) برای پیش‌بینی تنش در سازه‌ها و قطعات صنعتی',
    ],
    industryEn: [
      'Quantitative modeling, flight control laws, and finite-element physics solvers',
      'Mathematical backbone of deep learning (vector calculus, linear algebra, probability)',
      'Signal spectral estimation, inverse problems, and computational engineering',
    ],
    marketFa:
      'مزیت رقابتی قطعی برای ورود به گرایش‌های علم داده، تحقیق در عملیات، مدل‌سازی عددی و مهندسی مالی.',
    marketEn:
      'Foundational multiplier for quantitative R&D, machine learning, computational physics, and OR.',
    tools: ['MATLAB', 'NumPy / SciPy / SymPy', 'Mathematica', 'COMSOL Multiphysics'],
    videos: [
      {
        id: 'v-math-1',
        titleFa: 'ریاضی عمومی ۱ و ۲ و معادلات دیفرانسیل — دانشگاه صنعتی شریف',
        titleEn: 'Essence of Calculus & Linear Algebra (3Blue1Brown)',
        source: 'درس‌افزار شریف / مکتب‌خونه',
        instructor: 'دکتر علی‌اکبر عالم‌زاده / اساتید علوم ریاضی',
        duration: '۳۰ جلسه کامل',
        language: 'fa',
        focusFa: 'مفهوم هندسی مشتق، انتگرال سه‌گانه، تبدیل لاپلاس و سری فوریه',
        focusEn: 'Geometric calculus, multivariable Jacobians, and differential equations',
      },
      {
        id: 'v-math-2',
        titleFa: 'جبر خطی و معادلات دیفرانسیل (Gilbert Strang — MIT 18.06)',
        titleEn: 'Linear Algebra & Differential Equations (MIT 18.06 — Gilbert Strang)',
        source: 'MIT OpenCourseWare',
        instructor: 'Prof. Gilbert Strang',
        duration: '50 min per Lecture',
        language: 'en',
        focusFa: 'فضاهای برداری، مقادیر ویژه، SVD و حل ماتریسی سیستم‌های دیفرانسیل',
        focusEn: 'Four fundamental subspaces, eigenvalues, SVD, and coupled ODEs',
      },
    ],
  },
  ce: {
    child5Fa:
      'وقتی روی یک پل کاغذی ماشین اسباب‌بازی می‌گذاری، اگر کاغذ را به شکل مثلث تا کنی خیلی قوی‌تر می‌شود! مهندسان عمران دقیقاً حساب می‌کنند هر ستون و تیر چقدر وزن را بی‌خطر تحمل می‌کند.',
    child5En:
      'When you fold a paper bridge into triangles, it suddenly holds heavy toy cars without bending! Civil engineers calculate exactly how each beam and column shares weight safely.',
    industryFa: [
      'طراحی و مقاوم‌سازی لرزه‌ای برج‌ها، پل‌های دهانه‌بلند و سدهای بتنی',
      'تحلیل پایداری شیروانی‌ها، گودبرداری عمیق و تونل‌های مترو',
      'مدیریت منابع آب، شبکه‌های آبرسانی شهری و مهندسی ترافیک هوشمند',
    ],
    industryEn: [
      'Seismic-resilient high-rise buildings, long-span bridges, and concrete dams',
      'Deep excavation stabilization, tunneling, and geotechnical foundation design',
      'Urban water hydraulics, flood modeling, and smart transport networks',
    ],
    marketFa:
      'بازار کار گسترده در دفاتر مهندسی مشاور، پروژه‌های عمرانی، نظارت نظام‌مهندسی و شرکت‌های بین‌المللی زیرساخت.',
    marketEn:
      'Consistent demand across structural consultancies, infrastructure EPCs, and geotechnical labs.',
    tools: ['ETABS & SAP2000', 'SAFE', 'PLAXIS 2D/3D', 'AutoCAD Civil 3D'],
    videos: [
      {
        id: 'v-ce-1',
        titleFa: 'تحلیل سازه‌ها و طراحی بتن و فولاد — دانشگاه تهران و علم‌وصنعت',
        titleEn: 'Structural Mechanics & Earthquake Design Series',
        source: 'مکتب‌خونه / فرادرس',
        instructor: 'اساتید دانشکده عمران',
        duration: '۲۵ جلسه تخصصی',
        language: 'fa',
        focusFa: 'روش کار مجازی، خطوط تاثیر، تحلیل ماتریسی و آیین‌نامه ۲۸۰۰ زلزله',
        focusEn: 'Virtual work, matrix stiffness analysis, and seismic base shear',
      },
      {
        id: 'v-ce-2',
        titleFa: 'اصول مهندسی سازه‌های مدرن (ETH / MIT Engineering Mechanics)',
        titleEn: 'Mechanics of Deformable Structures (MIT 2.002)',
        source: 'MIT OpenCourseWare',
        instructor: 'Prof. Lallit Anand',
        duration: '48 min Lecture',
        language: 'en',
        focusFa: 'تنش، کرنش، خمش تیرها و کمانش ستون‌ها با آزمایش‌های واقعی',
        focusEn: 'Bending moments, buckling instabilities, and structural ductility',
      },
    ],
  },
};

function selectBlueprint(fieldId: string): DomainBlueprint {
  if (fieldId.startsWith('ee-') || fieldId === 'embedded' || fieldId === 'optics' || fieldId === 'bme-bioelectric') {
    return DOMAIN_BLUEPRINTS.ee;
  }
  if (fieldId.startsWith('cs-') || fieldId === 'data-sci') {
    return DOMAIN_BLUEPRINTS.cs;
  }
  if (
    fieldId.startsWith('me-') ||
    fieldId.startsWith('aerospace-') ||
    fieldId.startsWith('chem-') ||
    fieldId === 'petroleum' ||
    fieldId === 'nuclear' ||
    fieldId === 'renewable' ||
    fieldId === 'robotics'
  ) {
    return DOMAIN_BLUEPRINTS.me;
  }
  if (fieldId.startsWith('ce-') || fieldId === 'arch' || fieldId === 'mining' || fieldId === 'env') {
    return DOMAIN_BLUEPRINTS.ce;
  }
  return DOMAIN_BLUEPRINTS.math;
}

export function getCourseRichDetail(course: CourseItem, allCourses: CourseItem[]): CourseRichDetail {
  const bp = selectBlueprint(course.fieldId);

  // Build contextual 5-year-old analogy incorporating the specific course title & topics
  const topicZeroFa = course.topicsFa[0] || course.titleFa;
  const topicZeroEn = course.topicsEn[0] || course.titleEn;

  const feynmanChild5Fa =
    course.code === 'EE-201'
      ? 'تصور کن باتری مثل یک پمپ آب پرقدرت است و سیم‌ها جوی‌های آب هستند؛ اگر دو راه داشته باشی آب بین هر دو تقسیم می‌شود، اما اگر راهی را تنگ‌تر کنی (مقاومت بیشتر)، آب کمتری از آنجا رد می‌شود!'
      : course.code === 'AI-401'
      ? 'فکر کن یک مغز کاغذی داری که هزاران عکس گربه و سگ می‌بیند و هر بار حدس اشتباهی می‌زند، گوشزد می‌کنی «کمی گوش‌هایش را تیزتر ببین!» تا کم‌کم با تمرین استاد تشخیص شود.'
      : `${bp.child5Fa} در درس «${course.titleFa}»، ما دقیقاً همین ایده ساده را برای فهمیدن «${topicZeroFa}» به کار می‌بریم.`;

  const feynmanChild5En =
    course.code === 'EE-201'
      ? 'Imagine a battery is a water pump and wires are garden canals: when two paths split, water divides smoothly, and squeezing one hose (higher resistance) sends less current down that branch!'
      : course.code === 'AI-401'
      ? 'Think of a giant puzzle brain looking at thousands of pictures; every time it guesses wrong, we gently nudge its tiny knobs so it gets smarter on the next try.'
      : `${bp.child5En} In "${course.titleEn}", we apply this exact everyday intuition to master ${topicZeroEn}.`;

  // Derive sibling prerequisite / unlocked courses cleanly within same field or math/physics
  const sameField = allCourses.filter((c) => c.fieldId === course.fieldId && c.id !== course.id);
  const diffOrder: Record<string, number> = { introductory: 1, intermediate: 2, advanced: 3 };
  const myLevel = diffOrder[course.difficulty] || 2;

  const prerequisiteCodes = sameField
    .filter((c) => (diffOrder[c.difficulty] || 2) < myLevel)
    .slice(0, 2)
    .map((c) => c.code);

  if (prerequisiteCodes.length === 0 && course.difficulty !== 'introductory') {
    prerequisiteCodes.push('MATH-101', 'PHYS-101');
  }

  const unlockedCodes = sameField
    .filter((c) => (diffOrder[c.difficulty] || 2) > myLevel)
    .slice(0, 2)
    .map((c) => c.code);

  const syllabusFa = [
    {
      chapter: `فصل ۱: تاریخچه، شهود فیزیکی و مبانی (${course.topicsFa[0] || course.titleFa})`,
      summary: `آشنایی با ریشه تاریخی مسئله، تعاریف بنیادین، مفروضات مدل‌سازی و ارتباط فیزیکی ${course.topicsFa[0] || course.titleFa} (۴ ساعت تدریس).`,
    },
    ...(course.topicsFa.slice(1).map((t, idx) => ({
      chapter: `فصل ${idx + 2}: استخراج ریاضی و تحلیل تخصصی (${t})`,
      summary: `اثبات قضایای محوری، حل مثال‌های استاندارد دانشگاهی و بررسی حالات مرزی در ${t} (۶ ساعت تدریس).`,
    }))),
    {
      chapter: `فصل ${course.topicsFa.length + 1}: معادلات کلیدی و مدل‌سازی عددی با ابزارهای مهندسی`,
      summary: `پیاده‌سازی شبیه‌سازی‌های عملی با ${bp.tools.slice(0, 2).join(' و ')} و بررسی رفتار غیرخطی سیستم‌ها.`,
    },
    {
      chapter: `فصل ${course.topicsFa.length + 2}: کاربرد صنعتی و کارگاه حل مسائل پایان ترم`,
      summary: `بررسی پروژه‌های واقعی صنعت، خطاهای رایج طراحان و آمادگی کامل برای سخت‌ترین سوالات آزمون ${course.code}.`,
    },
  ];

  const syllabusEn = [
    {
      chapter: `Module 1: Historical Origins, Intuition & Foundations (${course.topicsEn[0] || course.titleEn})`,
      summary: `Physical framing, historical breakthroughs, modeling assumptions, and core definitions for ${course.topicsEn[0] || course.titleEn} (4 hrs).`,
    },
    ...(course.topicsEn.slice(1).map((t, idx) => ({
      chapter: `Module ${idx + 2}: Rigorous Derivations & Analytical Methods (${t})`,
      summary: `Complete theorem proofs, worked university examples, and boundary-case analysis on ${t} (6 hrs).`,
    }))),
    {
      chapter: `Module ${course.topicsEn.length + 1}: Computational Modeling & Simulation Lab`,
      summary: `Hands-on numerical verification using ${bp.tools.slice(0, 2).join(' & ')} across realistic parameter sweeps.`,
    },
    {
      chapter: `Module ${course.topicsEn.length + 2}: Industrial Case Studies & Final Exam Synthesis`,
      summary: `End-to-end engineering design tradeoffs and Olympiad/final-exam mastery for ${course.code}.`,
    },
  ];

  const deep = getDeepEnrichmentForCourse(course);

  return {
    feynmanChild5Fa,
    feynmanChild5En,
    model3dType: deep.model3dType,
    historicalOriginFa: deep.historicalOriginFa,
    historicalOriginEn: deep.historicalOriginEn,
    mathematicalProof: deep.mathematicalProof,
    formulaCheatSheet: deep.formulaCheatSheet,
    hardestExam: deep.hardestExam,
    syllabusFa,
    syllabusEn,
    prerequisiteCodes,
    unlockedCodes,
    industryApplicationsFa: bp.industryFa,
    industryApplicationsEn: bp.industryEn,
    marketDemandFa: bp.marketFa,
    marketDemandEn: bp.marketEn,
    industryTools: bp.tools,
    curatedVideos: bp.videos,
  };
}
