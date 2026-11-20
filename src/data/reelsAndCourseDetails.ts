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
  {
    id: 'reel-nuclear',
    courseCode: 'NUC-310',
    storyTitleFa: 'مهندسی هسته‌ای',
    storyTitleEn: 'Nuclear Eng.',
    titleFa: 'چگونه نوترون‌های تاخیری کنترل ایمن راکتور هسته‌ای را ممکن می‌کنند؟',
    titleEn: 'How Delayed Neutrons Make Nuclear Reactors Controllable',
    categoryFa: 'مهندسی هسته‌ای',
    categoryEn: 'Nuclear Engineering',
    fieldId: 'nuclear',
    image: '/src/assets/images/reel_quantum_wave_1795019065831.jpg',
    ringGradient: 'from-cyan-400 via-sky-500 to-teal-500',
    visualType: 'quantum',
    formulaLatex: 'k_{\\text{eff}} = \\eta f p \\varepsilon P_{FNL} P_{TNL} = 1',
    feynmanBulletsFa: [
      'در هر شکافت اورانیوم-۲۳۵، بیش از ۹۹٪ نوترون‌ها آنی (در کسری از میلی‌ثانیه) آزاد می‌شوند.',
      'اما حدود ۰.۶۵٪ نوترون‌ها با تاخیر چند ثانیه‌ای (Delayed Neutrons) ظاهر می‌شوند و سرعت واکنش را مثل ترمز طبیعی کند می‌کنند.',
      'میله‌های کنترل بور و کادمیوم دقیقاً با تنظیم همین کسر کوچک، ضریب تکثیر k_eff را روی ۱ ثابت نگه می‌دارند.',
    ],
    feynmanBulletsEn: [
      'Over 99% of fission neutrons appear instantaneously, far too fast for mechanical rods.',
      'The tiny 0.65% delayed neutron fraction slows reactor time constants from milliseconds to seconds.',
      'Boron control rods adjust absorption smoothly to hold effective multiplication k_eff at exactly 1.0.',
    ],
    narrationFa:
      'اگر همه نوترون‌های شکافت آنی بودند، کنترل راکتور هسته‌ای تقریباً غیرممکن می‌شد! اما حدود شش‌دهم درصد نوترون‌ها چند ثانیه دیرتر آزاد می‌شوند و همین تاخیر طلایی به میله‌های کنترل و سیستم‌های ایمنی فرصت دقیق برای تنظیم توان نیروگاه می‌دهد.',
    narrationEn:
      'If every fission neutron arrived instantly, controlling a reactor would be impossible. That tiny 0.65 percent delayed fraction stretches reaction times from milliseconds to seconds, allowing boron rods to stabilize power effortlessly.',
    likes: 1640,
    saves: 590,
    shares: 274,
  },
  {
    id: 'reel-politics',
    courseCode: 'IR-201',
    storyTitleFa: 'علوم سیاسی و IR',
    storyTitleEn: 'Political Sci',
    titleFa: 'معمای امنیت در روابط بین‌الملل: چرا دولت‌های تدافعی دچار رقابت تسلیحاتی می‌شوند؟',
    titleEn: 'The Security Dilemma: Why Defensive States Still Trigger Arms Races',
    categoryFa: 'علوم سیاسی و روابط بین‌الملل',
    categoryEn: 'Political Science & IR',
    fieldId: 'pol-ir',
    image: '/src/assets/images/course_algorithms_cs_1795017178932.jpg',
    ringGradient: 'from-indigo-500 via-sky-500 to-amber-400',
    visualType: 'graph',
    formulaLatex: '\\delta \\ge \\frac{T - R}{T - P} \\implies \\text{Stable Treaty}',
    feynmanBulletsFa: [
      'در نبود یک پلیس جهانی، وقتی کشور A برای دفاع از خود دیوارش را بلندتر می‌کند، کشور B آن را تهدید می‌بیند.',
      'در پاسخ، کشور B هم مسلح می‌شود و در نهایت هر دو هزینه بیشتری داده‌اند ولی امنیت کمتری دارند (معمای امنیت).',
      'معاهدات شفاف، راستی‌آزمایی و سازمان‌های بین‌المللی با کاهش عدم قطعیت راه خروج از این تله هستند.',
    ],
    feynmanBulletsEn: [
      'Under international anarchy, defensive measures by State A look potentially offensive to State B.',
      'State B counters in kind, leaving both states spending more yet feeling less secure.',
      'Transparent treaties, verification regimes, and repeated diplomacy break the escalation cycle.',
    ],
    narrationFa:
      'معمای امنیت یکی از مهم‌ترین مفاهیم علوم سیاسی و روابط بین‌الملل است: حتی وقتی دو کشور فقط قصد دفاع دارند، نبود اعتماد و شفافیت باعث می‌شود تقویت امنیت یکی، ناامنی دیگری را رقم بزند؛ به همین دلیل دیپلماسی و معاهدات راستی‌آزمایی نقش حیاتی دارند.',
    narrationEn:
      'The Security Dilemma explains why even purely defensive states slip into arms races: without transparency, one state’s security feels like another’s threat—making diplomacy and verifiable treaties essential.',
    likes: 1520,
    saves: 540,
    shares: 289,
  },
  {
    id: 'reel-medicine',
    courseCode: 'PHAR-301',
    storyTitleFa: 'پزشکی و دارو',
    storyTitleEn: 'Medicine',
    titleFa: 'نیمه‌عمر دارو و قانون ۵ نیمه‌عمر برای رسیدن به غلظت درمانی پایدار',
    titleEn: 'Drug Half-Life & Why Steady State Takes 5 Half-Lives',
    categoryFa: 'پزشکی و داروسازی',
    categoryEn: 'Medicine & Pharmacy',
    fieldId: 'med-pharmacy',
    image: '/src/assets/images/reel_ai_neural_1795019066672.jpg',
    ringGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    visualType: 'oscilloscope',
    formulaLatex: 't_{1/2} = \\frac{0.693 \\cdot V_d}{CL}',
    feynmanBulletsFa: [
      'نیمه‌عمر زمانی است که غلظت دارو در پلاسمای خون دقیقاً نصف می‌شود و به حجم توزیع (Vd) و کلیرانس (CL) وابسته است.',
      'صرف‌نظر از اندازه دوز، بعد از گذشت ۴ تا ۵ نیمه‌عمر بیش از ۹۷٪ غلظت پایدار (Steady State) در خون شکل می‌گیرد.',
      'در بیماران با کاهش عملکرد کلیه یا کبد، کلیرانس کم شده و نیمه‌عمر دارو طولانی‌تر می‌شود؛ پس باید دوز را تعدیل کرد.',
    ],
    feynmanBulletsEn: [
      'Half-life is the time for plasma drug concentration to halve, governed by Volume of Distribution and Clearance.',
      'Regardless of dose size, steady state (~97%) is reached after 4 to 5 half-lives.',
      'Impaired renal or hepatic clearance prolongs half-life, requiring careful clinical dose adjustments.',
    ],
    narrationFa:
      'در فارماکولوژی بالینی، نیمه‌عمر دارو نشان می‌دهد بدن با چه سرعتی دارو را پاکسازی می‌کند. پس از حدود پنج نیمه‌عمر، میزان ورود و دفع دارو به تعادل می‌رسد و دوز درمانی پایدار در خون تثبیت می‌شود.',
    narrationEn:
      'In clinical pharmacology, drug half-life connects volume of distribution to organ clearance. After roughly five half-lives, intake and elimination balance out at steady-state therapeutic levels.',
    likes: 1410,
    saves: 475,
    shares: 210,
  },
];

function inferVisualType(fieldId: string): ReelVisualType {
  if (fieldId.startsWith('ee-') || fieldId === 'embedded' || fieldId === 'robotics' || fieldId.startsWith('med-')) return 'oscilloscope';
  if (fieldId === 'physics' || fieldId === 'optics' || fieldId === 'nuclear' || fieldId.startsWith('nuclear-') || fieldId === 'astronomy') return 'quantum';
  if (fieldId === 'cs-ai' || fieldId === 'data-sci' || fieldId === 'psych-clinical') return 'neural';
  if (fieldId.startsWith('cs-') || fieldId === 'math' || fieldId === 'stats' || fieldId === 'numerical' || fieldId.startsWith('pol-') || fieldId.startsWith('law-') || fieldId === 'econ-pure' || fieldId === 'philosophy') return 'graph';
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
  nuclear: {
    child5Fa:
      'هسته اتم مثل یک قطار دومینوهای فوق‌العاده پرانرژی است: یک نوترون به اولین دومینو می‌زند، گرمای زیادی آزاد می‌شود و آب را به بخار تبدیل می‌کند تا توربین برق بچرخد؛ میله‌های کنترل هم مثل دست ما هستند که سرعت افتادن دومینوها را دقیق و امن تنظیم می‌کنند!',
    child5En:
      'Think of a nuclear core like an ultra-energetic chain of dominoes: one neutron tips the next, releasing clean heat to spin steam turbines, while control rods act like careful hands pacing the chain reaction safely!',
    industryFa: [
      'بهره‌برداری، تحلیل ایمنی و طراحی هسته نیروگاه‌های هسته‌ای آب تحت فشار (PWR) و راکتورهای نسل چهارم (SMR)',
      'تولید رادیوداروهای تشخیصی و درمانی (تکنسیم-99m، PET/SPECT) و پرتودرمانی سرطان در بیمارستان‌ها',
      'پژوهش‌های پلاسما و همجوشی هسته‌ای، آشکارسازی پرتوها و حفاظت در برابر اشعه در صنعت و پزشکی',
    ],
    industryEn: [
      'PWR & Small Modular Reactor (SMR) core physics, thermal-hydraulics, and nuclear safety engineering',
      'Medical radioisotope production (Tc-99m, FDG), PET/SPECT imaging, and clinical radiation therapy',
      'Tokamak magnetic fusion R&D, MCNP radiation transport modeling, and health physics shielding',
    ],
    marketFa:
      'فرصت‌های تخصصی در نیروگاه‌های انرژی پاک، مراکز پزشکی هسته‌ای و رادیوتراپی، آزمایشگاه‌های فیزیک پلاسما و نهادهای نظارت و ایمنی تابش.',
    marketEn:
      'Specialized careers across nuclear power plants, medical physics & oncology centers, national fusion labs, and IAEA safety compliance.',
    tools: ['MCNP6 / OpenMC', 'RELAP5 / TRACE', 'GEANT4', 'MATLAB / Python'],
    videos: [
      {
        id: 'v-nuc-1',
        titleFa: 'اصول مهندسی هسته‌ای و فیزیک راکتور — دانشگاه صنعتی شریف و امیرکبیر',
        titleEn: 'Introduction to Nuclear Engineering & Ionizing Radiation (MIT 22.01)',
        source: 'MIT OCW / دانشکده مهندسی انرژی',
        instructor: 'Prof. Michael Short / اساتید مهندسی هسته‌ای',
        duration: '26 Lectures · Full Course',
        language: 'en',
        focusFa: 'واکنش زنجیره‌ای شکافت، پخش نوترون، دوزیمتری و ایمنی راکتور',
        focusEn: 'Fission kinetics, neutron diffusion, radiation shielding, and reactor safety',
      },
      {
        id: 'v-nuc-2',
        titleFa: 'آشنایی با فیزیک پرتوپزشکی، دوزیمتری و شبیه‌سازی مونت‌کارلو',
        titleEn: 'Reactor Thermal-Hydraulics & Plasma Confinement Deep Dive',
        source: 'فرادرس / IAEA Open Learning',
        instructor: 'متخصصان پرتوپزشکی و راکتور',
        duration: '۱۸ جلسه تخصصی',
        language: 'fa',
        focusFa: 'برهمکنش پرتو با بافت، اصول ALARA و تحلیل حرارتی قلب راکتور',
        focusEn: 'Radiation-tissue interactions, ALARA shielding, and core heat removal',
      },
    ],
  },
  medical: {
    child5Fa:
      'بدن انسان مثل یک شهر هوشمند شگفت‌انگیز است: قلب پمپ مرکزی آب‌رسانی است، عصب‌ها کابل‌های اینترنت پرسرعت هستند، گلبول‌های سفید پلیس شهرند و داروها مثل تعمیرکارهای دقیق دقیقاً سر آدرس مشکل می‌روند!',
    child5En:
      'The human body is like a bustling smart city: the heart is the central pump, nerves are fiber-optic cables, immune cells are the security patrol, and medicines act like precision repair technicians!',
    industryFa: [
      'تشخیص بالینی، درمان بیمارستانی، مراقبت‌های ویژه (ICU) و پزشکی مبتنی بر شواهد (EBM)',
      'صنایع داروسازی، فرمولاسیون داروهای نوین، فارماکووژیلانس و کارآزمایی‌های بالینی (Clinical Trials)',
      'اپیدمیولوژی سلامت عمومی، مدیریت نظام سلامت، دندانپزشکی دیجیتال و سلامت دیجیتال',
    ],
    industryEn: [
      'Clinical diagnostics, hospital internal medicine, critical care, and evidence-based practice',
      'Pharmaceutical R&D, drug formulation, clinical pharmacokinetics, and biopharma trials',
      'Public health epidemiology, digital dentistry, preventive nutrition, and health-tech',
    ],
    marketFa:
      'جایگاه حیاتی و پایدار در بیمارستان‌ها، کلینیک‌های تخصصی، شرکت‌های داروسازی و بیوتکنولوژی، و مراکز پژوهش پزشکی.',
    marketEn:
      'Resilient global demand across hospitals, specialty clinics, pharmaceutical companies, and biomedical research.',
    tools: ['UpToDate / PubMed', 'SPSS / R Biostatistics', 'ChemDraw / AutoDock', 'DICOM / ECG Monitors'],
    videos: [
      {
        id: 'v-med-1',
        titleFa: 'آموزش جامع فیزیولوژی گایتون و فارماکولوژی بالینی',
        titleEn: 'Medical Physiology & Pharmacology Visual Series (Osmosis / Ninja Nerd)',
        source: 'دانشگاه علوم پزشکی تهران / Ninja Nerd',
        instructor: 'اساتید علوم پایه پزشکی',
        duration: '۳۲ جلسه جامع',
        language: 'fa',
        focusFa: 'فیزیولوژی قلب و کلیه، مکانیزم اثر داروها و تفسیر علائم بالینی',
        focusEn: 'Cardiorenal physiology, receptor pharmacology, and clinical reasoning',
      },
      {
        id: 'v-med-2',
        titleFa: 'اپیدمیولوژی و آمار زیستی کاربردی (Johns Hopkins / Harvard)',
        titleEn: 'Clinical Epidemiology & Evidence-Based Medicine (HarvardX)',
        source: 'Coursera / HarvardX',
        instructor: 'Prof. Miguel Hernán',
        duration: '14 Modules',
        language: 'en',
        focusFa: 'تحلیل کارآزمایی بالینی، حساسیت/ویژگی آزمون‌ها و مدل‌های همه‌گیری',
        focusEn: 'RCT design, predictive values, and causal inference in medicine',
      },
    ],
  },
  economics: {
    child5Fa:
      'تصور کن توی حیاط مدرسه فقط ۱۰ تا بستنی هست ولی ۲۰ نفر می‌خواهند بخرند! اقتصاد یاد می‌دهد چطور منابع محدود را عاقلانه تقسیم کنیم، پس‌انداز و سرمایه‌گذاری کنیم و بفهمیم چرا قیمت‌ها بالا و پایین می‌روند.',
    child5En:
      'Imagine there are 10 ice creams at recess but 20 kids want one! Economics studies how people, businesses, and governments make smart choices with limited resources and why prices rise or fall.',
    industryFa: [
      'تحلیل بازار سرمایه، مدیریت سبد سهام، بانکداری سرمایه‌گذاری و مهندسی مالی (FinTech)',
      'سیاست‌گذاری پولی و مالی، تحلیل کلان اقتصادی، بودجه‌ریزی و مشاوره مدیریت استراتژیک',
      'حسابرسی مستقل، گزارشگری مالی IFRS، علم داده اقتصادی (اقتصادسنجی) و تحلیل کسب‌وکار',
    ],
    industryEn: [
      'Capital markets, portfolio management, investment banking, and quantitative fintech',
      'Central bank monetary policy, macro forecasting, and management consulting',
      'IFRS financial reporting, auditing, causal econometrics, and corporate strategy',
    ],
    marketFa:
      'بازار کار بسیار پویا در بانک‌ها، شرکت‌های سرمایه‌گذاری و بورس، استارتاپ‌های فین‌تک، موسسات حسابرسی و مشاوران مدیریت.',
    marketEn:
      'Strong demand in investment firms, consulting, fintech, corporate finance, and public economic institutions.',
    tools: ['Stata / EViews / R', 'Python (Quant / Pandas)', 'Bloomberg / Excel Financial Modeling', 'Power BI'],
    videos: [
      {
        id: 'v-ecn-1',
        titleFa: 'اصول اقتصاد خرد، کلان و اقتصادسنجی — دانشگاه تهران و شریف',
        titleEn: 'Principles of Microeconomics & Macroeconomics (MIT 14.01)',
        source: 'مکتب‌خونه / MIT OCW',
        instructor: 'Prof. Jonathan Gruber / اساتید دانشکده اقتصاد',
        duration: '۲۴ جلسه کامل',
        language: 'fa',
        focusFa: 'تعادل بازار، سیاست پولی، رگرسیون اقتصادسنجی و ارزش‌گذاری دارایی‌ها',
        focusEn: 'Market equilibrium, monetary policy, econometrics, and CAPM valuation',
      },
      {
        id: 'v-ecn-2',
        titleFa: 'بازارهای مالی و مهندسی مالی (Yale ECON 252 — Robert Shiller)',
        titleEn: 'Financial Markets Full Course (Yale — Nobel Laureate Robert Shiller)',
        source: 'Yale Open Courses',
        instructor: 'Prof. Robert Shiller',
        duration: '23 Lectures',
        language: 'en',
        focusFa: 'نظریه سبد سهام، مدیریت ریسک، مشتقات مالی و اقتصاد رفتاری',
        focusEn: 'Portfolio theory, derivatives, risk management, and behavioral finance',
      },
    ],
  },
  law: {
    child5Fa:
      'قانون مثل قوانین یک بازی فوتبال است: بدون داور و قوانین روشن که برای همه یکسان باشد، هیچ‌کس نمی‌داند خطا چیست و بازی به هم می‌ریزد! علم حقوق همین قوانین عادلانه را برای زندگی، قراردادها و کشورها می‌سازد.',
    child5En:
      'Law is like the rulebook of a soccer match: without clear, fair rules applied equally to everyone, no one knows what counts as a foul! Legal studies build fair rules for contracts, citizens, and nations.',
    industryFa: [
      'وکالت دادگستری، قضاوت، سردفتری و مشاوره حقوقی تخصصی شرکت‌ها و استارتاپ‌ها',
      'تنظیم قراردادهای تجاری و بین‌المللی، داوری تجاری بین‌المللی و مالکیت فکری',
      'حقوق فناوری، حریم خصوصی داده، حقوق انرژی و مشاوره در سازمان‌های بین‌المللی',
    ],
    industryEn: [
      'Litigation, judiciary, corporate legal counsel, and startup contract architecture',
      'International commercial arbitration, M&A transactions, and intellectual property law',
      'Tech regulation, data privacy compliance, constitutional review, and treaty law',
    ],
    marketFa:
      'تقاضای مستمر در دفاتر حقوقی و وکالت، واحدهای حقوقی بانک‌ها و شرکت‌های بزرگ، داوری بین‌المللی و بخش عمومی.',
    marketEn:
      'Enduring careers across law firms, corporate counsel, arbitration chambers, compliance, and public institutions.',
    tools: ['سامانه قوانین و آرای وحدت رویه', 'Westlaw / LexisNexis', 'Contract Drafting Templates', 'ICC Arbitration Rules'],
    videos: [
      {
        id: 'v-law-1',
        titleFa: 'مجموعه درس حقوق مدنی، قراردادها و حقوق اساسی — دانشکده حقوق دانشگاه تهران',
        titleEn: 'Contract Law: From Trust to Promise to Contract (HarvardX)',
        source: 'دانشکده حقوق دانشگاه تهران / HarvardX',
        instructor: 'Prof. Charles Fried / اساتید حقوق',
        duration: '۲۰ جلسه تحلیلی',
        language: 'fa',
        focusFa: 'قواعد عمومی قراردادها، مسئولیت مدنی، تفکیک قوا و اصول دادرسی',
        focusEn: 'Contract formation, tort liability, separation of powers, and due process',
      },
      {
        id: 'v-law-2',
        titleFa: 'حقوق بین‌الملل عمومی و معاهدات (Leiden / UN Audiovisual Library)',
        titleEn: 'Public International Law & Treaty Law (UN Audiovisual Library)',
        source: 'United Nations Law Library',
        instructor: 'ICJ Judges & Scholars',
        duration: '18 Lectures',
        language: 'en',
        focusFa: 'کنوانسیون وین، قواعد آمره، حل مسالمت‌آمیز اختلافات و حقوق بشر',
        focusEn: 'Vienna Convention, Jus Cogens norms, ICJ cases, and humanitarian law',
      },
    ],
  },
  political: {
    child5Fa:
      'وقتی یک گروه بزرگ از آدم‌ها در یک خانه یا محله زندگی می‌کنند، باید تصمیم بگیرند چه کسی مدیریت کند، بودجه چطور خرج شود و با همسایه‌ها چطور صلح و دوستی بسازند؛ علوم سیاسی و روابط بین‌الملل دقیقاً علم همین تصمیم‌های بزرگ است!',
    child5En:
      'When millions of people share a country—and countries share one planet—they have to decide who leads, how rules are made fairly, and how neighbors keep peace and trade; that is Political Science and IR!',
    industryFa: [
      'تحلیل‌گری سیاسی و ژئوپلیتیک، اندیشکده‌ها (Think Tanks) و پژوهش‌های استراتژیک',
      'دیپلماسی، وزارت امور خارجه، سازمان‌های بین‌المللی و مدیریت بحران‌های منطقه‌ای',
      'سیاست‌گذاری عمومی، حکمرانی داده، مشاوره رسانه‌ای و ارزیابی اثر قوانین و برنامه‌های توسعه',
    ],
    industryEn: [
      'Geopolitical risk analysis, policy think tanks, and strategic intelligence research',
      'Diplomacy, foreign service, multilateral organizations (UN/WTO), and crisis negotiation',
      'Public policy evaluation, governance consulting, and political economy advisory',
    ],
    marketFa:
      'فرصت‌های شغلی در اندیشکده‌های سیاست‌گذاری، رسانه‌های تحلیلی، سازمان‌های بین‌المللی، مشاوره ریسک ژئوپلیتیک و بخش عمومی.',
    marketEn:
      'Roles across policy think tanks, diplomatic corps, international organizations, political risk consultancies, and media.',
    tools: ['R / SPSS Political Data', 'V-Dem & Polity V Datasets', 'COW / SIPRI Databases', 'Policy Brief Frameworks'],
    videos: [
      {
        id: 'v-pol-1',
        titleFa: 'مبانی علم سیاست، اندیشه سیاسی و روابط بین‌الملل — دانشکده حقوق و علوم سیاسی تهران',
        titleEn: 'Introduction to Political Philosophy (Yale PLSC 114 — Steven Smith)',
        source: 'دانشگاه تهران / Yale Open Courses',
        instructor: 'Prof. Steven B. Smith / اساتید علوم سیاسی',
        duration: '۲۴ جلسه تحلیلی',
        language: 'fa',
        focusFa: 'اندیشه سیاسی غرب و اسلام، دموکراسی، رئالیسم، لیبرالیسم و سازه‌انگاری',
        focusEn: 'Classical & modern political philosophy, realism, liberalism, and constructivism',
      },
      {
        id: 'v-pol-2',
        titleFa: 'نظریه‌های روابط بین‌الملل و سیاست خارجی (LSE / Oxford)',
        titleEn: 'International Relations, Game Theory & Global Order (LSE / Yale)',
        source: 'LSE Public Lectures / Coursera',
        instructor: 'Prof. Ian Shapiro & IR Faculty',
        duration: '16 Seminars',
        language: 'en',
        focusFa: 'معمای امنیت، موازنه قوا، اقتصاد سیاسی بین‌الملل و دیپلماسی بحران',
        focusEn: 'Security dilemma, balance of power, IPE, and multilateral diplomacy',
      },
    ],
  },
  psychology: {
    child5Fa:
      'مغز ما مثل یک ابرکامپیوتر پر از احساسات، خاطره‌ها و عادت‌هاست! روان‌شناسی و جامعه‌شناسی مثل عینک‌های جادویی هستند که نشان می‌دهند چرا آدم‌ها خوشحال، مضطرب یا شجاع می‌شوند و چطور در کنار هم جامعه می‌سازند.',
    child5En:
      'Our mind is an amazing living supercomputer of memories, feelings, and habits! Psychology and sociology are special lenses that explain how we think, heal, and connect with communities.',
    industryFa: [
      'مشاوره و روان‌درمانی بالینی (CBT/ACT)، سنجش روانسنجی و کلینیک‌های سلامت روان',
      'پژوهش تجربه کاربری (UX Research)، علوم شناختی، اقتصاد رفتاری و هوش مصنوعی انسان‌محور',
      'پژوهش‌های اجتماعی، افکارسنجی، مدیریت منابع انسانی و راهبرد ارتباطات و رسانه',
    ],
    industryEn: [
      'Clinical psychotherapy (CBT/ACT), psychological assessment, and mental health services',
      'UX research, cognitive science, behavioral economics, and human-centered AI',
      'Social research, public opinion polling, organizational psychology, and media strategy',
    ],
    marketFa:
      'رشد سریع بازار کار در کلینیک‌های تخصصی، تیم‌های UX و محصول در شرکت‌های فناوری، مراکز پژوهش اجتماعی و رسانه.',
    marketEn:
      'Fast-growing opportunities in clinical care, tech UX/behavioral science teams, HR analytics, and social research.',
    tools: ['SPSS / JASP / R', 'NVivo / MAXQDA', 'DSM-5 Diagnostic Guides', 'Qualtrics / PsychoPy'],
    videos: [
      {
        id: 'v-psy-1',
        titleFa: 'مقدمه‌ای بر روان‌شناسی و علوم شناختی (Yale PSYC 110 — Paul Bloom)',
        titleEn: 'Introduction to Psychology (Yale PSYC 110 — Prof. Paul Bloom)',
        source: 'Yale Open Courses / مکتب‌خونه',
        instructor: 'Prof. Paul Bloom',
        duration: '20 Lectures',
        language: 'en',
        focusFa: 'ادراک، حافظه، رشد شناختی، آسیب‌شناسی روانی و روان‌شناسی اجتماعی',
        focusEn: 'Perception, memory, development, psychopathology, and social behavior',
      },
      {
        id: 'v-psy-2',
        titleFa: 'نظریه‌های جامعه‌شناسی و روش تحقیق علوم اجتماعی',
        titleEn: 'Foundations of Modern Social Theory (Yale SOCY 151)',
        source: 'دانشگاه تهران / Yale Open Courses',
        instructor: 'Prof. Iván Szelényi / اساتید علوم اجتماعی',
        duration: '۲۴ جلسه',
        language: 'fa',
        focusFa: 'آرای دورکیم، وبر، مارکس، بوردیو و تحلیل داده‌های پیمایشی',
        focusEn: 'Durkheim, Weber, Marx, Bourdieu, and empirical social research',
      },
    ],
  },
  humanities: {
    child5Fa:
      'فلسفه، تاریخ و ادبیات مثل گنجینه داستان‌ها و سوال‌های بزرگ بشر هستند: تاریخ می‌گوید دیروز چه یاد گرفتیم، ادبیات به فکرها بال و زیبایی می‌دهد و فلسفه یاد می‌دهد چطور عمیق، منطقی و بدون خطا فکر کنیم!',
    child5En:
      'Philosophy, history, and literature are humanity’s treasure chest of big questions: history remembers our lessons, literature gives ideas beauty, and philosophy trains us to reason clearly without fallacies!',
    industryFa: [
      'پژوهش دانشگاهی، ویراستاری تخصصی، نشر علمی، ترجمه و تولید محتوای راهبردی',
      'اخلاق هوش مصنوعی (AI Ethics)، منطق صوری، زبان‌شناسی محاسباتی و پردازش زبان طبیعی (NLP)',
      'میراث فرهنگی، موزه‌داری، مستندسازی تاریخی و مشاوره فرهنگی و آموزشی',
    ],
    industryEn: [
      'Academic research, publishing, literary translation, and editorial leadership',
      'AI Ethics, formal logic, computational linguistics, and NLP language design',
      'Cultural heritage, historical archiving, curatorial studies, and documentary writing',
    ],
    marketFa:
      'فرصت‌های بین‌رشته‌ای نوین در زبان‌شناسی محاسباتی، اخلاق فناوری، آموزش، نشر، رسانه‌های فرهنگی و پژوهش‌های تاریخی.',
    marketEn:
      'Growing interdisciplinary niches in AI ethics, computational linguistics, education, publishing, and cultural media.',
    tools: ['Zotero / LaTeX Humanities', 'Praat / NLTK Linguistics', 'Archival Databases', 'Critical Discourse Frameworks'],
    videos: [
      {
        id: 'v-hum-1',
        titleFa: 'فلسفه اخلاق و عدالت (Harvard — Michael Sandel) و منطق نقادانه',
        titleEn: 'Justice: What’s the Right Thing to Do? (Harvard — Michael Sandel)',
        source: 'Harvard University / مکتب‌خونه',
        instructor: 'Prof. Michael Sandel',
        duration: '12 Iconic Lectures',
        language: 'en',
        focusFa: 'فایده‌گرایی، وظیفه‌گرایی کانت، قرارداد اجتماعی و استدلال منطقی',
        focusEn: 'Utilitarianism, Kantian ethics, Rawlsian justice, and moral reasoning',
      },
      {
        id: 'v-hum-2',
        titleFa: 'تاریخ ادبیات فارسی، سبک‌شناسی و زبان‌شناسی معاصر',
        titleEn: 'Persian Classical Literature & Modern Linguistics Seminar',
        source: 'دانشکده ادبیات دانشگاه تهران',
        instructor: 'اساتید ادبیات و فلسفه',
        duration: '۲۰ جلسه تخصصی',
        language: 'fa',
        focusFa: 'تحلیل شاهنامه، مثنوی، منطق و تاریخ‌نگاری تحلیلی ایران و جهان',
        focusEn: 'Classical Persian poetics, linguistics, philosophy, and historiography',
      },
    ],
  },
  arts: {
    child5Fa:
      'هنر، سینما و شهرسازی یعنی تبدیل کردن ایده‌های توی سرمان به رنگ، داستان، موسیقی و شهرهایی که آدم‌ها از قدم زدن در آن‌ها لذت ببرند — جایی که خلاقیت با هندسه و احساس یکی می‌شود!',
    child5En:
      'Art, cinema, and urban design turn imagination into color, stories, music, and welcoming cities—where creativity meets geometry and human emotion!',
    industryFa: [
      'طراحی شهری پایدار، تحلیل مکانی GIS، بازآفرینی محلات و مشاوره طرح‌های جامع شهری',
      'تولید فیلم، فیلم‌نامه‌نویسی، کارگردانی، تدوین، انیمیشن و استودیوهای رسانه‌ای',
      'طراحی محصول صنعتی، برندینگ، تایپوگرافی و طراحی تجربه کاربری (UI/UX)',
    ],
    industryEn: [
      'Sustainable urban planning, GIS spatial design, and transit-oriented city studios',
      'Filmmaking, screenwriting, cinematography, editing, and interactive media',
      'Industrial product design, visual branding, typography, and digital UX systems',
    ],
    marketFa:
      'بازار خلاقانه و بین‌المللی در استودیوهای طراحی محصول و UX، دفاتر شهرسازی، صنعت سینما و رسانه، و برندینگ.',
    marketEn:
      'Vibrant creative demand across UX/product studios, urban consultancies, cinema production, and brand design.',
    tools: ['QGIS / ArcGIS', 'Figma / Adobe Creative Cloud', 'DaVinci Resolve / Blender', 'Rhino / KeyShot'],
    videos: [
      {
        id: 'v-art-1',
        titleFa: 'اصول شهرسازی مدرن، زیبایی‌شناسی سینما و طراحی صنعتی',
        titleEn: 'Visual Storytelling, Typography & Urban Design Masterclass',
        source: 'دانشکده هنرهای زیبا / MIT Urban Studies',
        instructor: 'اساتید هنر، سینما و شهرسازی',
        duration: '۱۸ کارگاه عملی',
        language: 'fa',
        focusFa: 'ترکیب‌بندی، دراماتورژی، خوانایی شهری و تفکر طراحی',
        focusEn: 'Composition, screenwriting, urban imageability, and design thinking',
      },
    ],
  },
  science: {
    child5Fa:
      'دانشمندان علوم پایه و طبیعت مثل کارآگاه‌های کنجکاو هستند: زیر میکروسکوپ از مولکول‌ها و سلول‌ها سرنخ می‌گیرند، سنگ‌های زمین را می‌خوانند و با تلسکوپ راز ستاره‌ها و رشد گیاهان را کشف می‌کنند!',
    child5En:
      'Natural scientists are nature’s curious detectives: reading clues inside molecules, cells, Earth’s rocks, living crops, and distant stars to discover how the universe works!',
    industryFa: [
      'آزمایشگاه‌های شیمی دارویی، پلیمر، کنترل کیفیت مواد غذایی و طیف‌سنجی پیشرفته',
      'پژوهش‌های ژنتیک، بیوتکنولوژی، کشاورزی هوشمند، مدیریت منابع آب و کلینیک‌های دامپزشکی',
      'اکتشافات زمین‌شناسی، پایش لرزه‌خیزی، آب‌شناسی و رصدخانه‌های اخترفیزیک',
    ],
    industryEn: [
      'Analytical chemistry labs, pharmaceutical synthesis, food safety (HACCP), and spectroscopy',
      'Genomics, molecular biotech, precision agriculture, and veterinary health',
      'Geophysical exploration, hydrogeology, climate modeling, and astrophysics R&D',
    ],
    marketFa:
      'فرصت‌های گسترده در مراکز تحقیق و توسعه (R&D)، صنایع غذایی و دارویی، آزمایشگاه‌های ژنتیک، کشاورزی نوین و شرکت‌های اکتشاف.',
    marketEn:
      'Broad careers across R&D labs, biotech/genomics, agri-tech, food quality, veterinary clinics, and geosciences.',
    tools: ['ChemDraw / Gaussian', 'BLAST / BioPython', 'QGIS / Petrel', 'R / Python SciPy'],
    videos: [
      {
        id: 'v-sci-1',
        titleFa: 'زیست‌شناسی مولکولی، شیمی آلی و اخترفیزیک (MIT 7.012 / 5.12)',
        titleEn: 'Fundamentals of Biology, Organic Chemistry & Astrophysics (MIT OCW)',
        source: 'MIT OpenCourseWare / دانشگاه تهران',
        instructor: 'Prof. Eric Lander & Science Faculty',
        duration: '28 Lectures',
        language: 'en',
        focusFa: 'بیوشیمی و ژنتیک، مکانیزم‌های شیمی آلی، زمین‌ساخت و کیهان‌شناسی',
        focusEn: 'Molecular genetics, organic synthesis, plate tectonics, and cosmology',
      },
    ],
  },
};

function selectBlueprint(fieldId: string): DomainBlueprint {
  if (fieldId === 'nuclear' || fieldId.startsWith('nuclear-')) {
    return DOMAIN_BLUEPRINTS.nuclear;
  }
  if (fieldId.startsWith('med-') || fieldId === 'vet-med') {
    return DOMAIN_BLUEPRINTS.medical;
  }
  if (fieldId === 'econ-pure' || fieldId === 'mgmt-business' || fieldId === 'accounting' || fieldId === 'finance-banking' || fieldId === 'eng-econ') {
    return DOMAIN_BLUEPRINTS.economics;
  }
  if (fieldId.startsWith('law-')) {
    return DOMAIN_BLUEPRINTS.law;
  }
  if (fieldId.startsWith('pol-')) {
    return DOMAIN_BLUEPRINTS.political;
  }
  if (fieldId === 'psych-clinical' || fieldId === 'sociology' || fieldId === 'media-comm') {
    return DOMAIN_BLUEPRINTS.psychology;
  }
  if (fieldId === 'philosophy' || fieldId === 'history' || fieldId === 'literature-ling') {
    return DOMAIN_BLUEPRINTS.humanities;
  }
  if (fieldId.startsWith('art-')) {
    return DOMAIN_BLUEPRINTS.arts;
  }
  if (fieldId === 'chem-pure' || fieldId === 'bio-cell' || fieldId === 'geology' || fieldId === 'astronomy' || fieldId === 'agri-agronomy' || fieldId === 'food-sci') {
    return DOMAIN_BLUEPRINTS.science;
  }
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

function getDefaultPrerequisitesForField(fieldId: string): string[] {
  if (fieldId.startsWith('pol-')) return ['POL-101', 'LAW-101'];
  if (fieldId.startsWith('law-')) return ['LAW-101', 'PHI-101'];
  if (fieldId === 'econ-pure' || fieldId === 'finance-banking' || fieldId === 'mgmt-business' || fieldId === 'accounting') return ['ECN-201', 'STAT-201'];
  if (fieldId.startsWith('med-') || fieldId === 'vet-med') return ['MED-101', 'BIOL-201'];
  if (fieldId === 'psych-clinical' || fieldId === 'sociology' || fieldId === 'media-comm') return ['PSY-101', 'SOC-201'];
  if (fieldId === 'philosophy' || fieldId === 'history' || fieldId === 'literature-ling') return ['PHI-101', 'HIS-201'];
  if (fieldId.startsWith('art-')) return ['DES-201', 'ARC-101'];
  if (fieldId === 'nuclear' || fieldId.startsWith('nuclear-')) return ['NUC-301', 'PHYS-201'];
  if (fieldId === 'chem-pure' || fieldId === 'bio-cell' || fieldId === 'agri-agronomy' || fieldId === 'food-sci') return ['CHM-201', 'BIOL-201'];
  return ['MATH-101', 'PHYS-101'];
}

export function getCourseRichDetail(course: CourseItem, allCourses: CourseItem[]): CourseRichDetail {
  const bp = selectBlueprint(course.fieldId);

  // Build contextual 5-year-old analogy incorporating the specific course title & topics
  const topicZeroFa = course.topicsFa[0] || course.titleFa;
  const topicZeroEn = course.topicsEn[0] || course.titleEn;

  const feynmanChild5Fa =
    course.feynmanAnalogyFa?.trim() ||
    (course.code === 'EE-201'
      ? 'تصور کن باتری مثل یک پمپ آب پرقدرت است و سیم‌ها جوی‌های آب هستند؛ اگر دو راه داشته باشی آب بین هر دو تقسیم می‌شود، اما اگر راهی را تنگ‌تر کنی (مقاومت بیشتر)، آب کمتری از آنجا رد می‌شود!'
      : course.code === 'AI-401'
      ? 'فکر کن یک مغز کاغذی داری که هزاران عکس گربه و سگ می‌بیند و هر بار حدس اشتباهی می‌زند، گوشزد می‌کنی «کمی گوش‌هایش را تیزتر ببین!» تا کم‌کم با تمرین استاد تشخیص شود.'
      : `${bp.child5Fa} در درس «${course.titleFa}»، ما دقیقاً همین ایده ساده را برای فهمیدن «${topicZeroFa}» به کار می‌بریم.`);

  const feynmanChild5En =
    course.feynmanAnalogyEn?.trim() ||
    (course.code === 'EE-201'
      ? 'Imagine a battery is a water pump and wires are garden canals: when two paths split, water divides smoothly, and squeezing one hose (higher resistance) sends less current down that branch!'
      : course.code === 'AI-401'
      ? 'Think of a giant puzzle brain looking at thousands of pictures; every time it guesses wrong, we gently nudge its tiny knobs so it gets smarter on the next try.'
      : `${bp.child5En} In "${course.titleEn}", we apply this exact everyday intuition to master ${topicZeroEn}.`);

  // Derive sibling prerequisite / unlocked courses cleanly within same field or domain defaults
  const sameField = allCourses.filter((c) => c.fieldId === course.fieldId && c.id !== course.id);
  const diffOrder: Record<string, number> = { introductory: 1, intermediate: 2, advanced: 3 };
  const myLevel = diffOrder[course.difficulty] || 2;

  const prerequisiteCodes = sameField
    .filter((c) => (diffOrder[c.difficulty] || 2) < myLevel)
    .slice(0, 2)
    .map((c) => c.code);

  if (prerequisiteCodes.length === 0 && course.difficulty !== 'introductory') {
    prerequisiteCodes.push(...getDefaultPrerequisitesForField(course.fieldId));
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

  const mergedHardestExam = {
    ...deep.hardestExam,
    problemStatementFa: course.hardestExamQuestionFa?.trim() || deep.hardestExam.problemStatementFa,
    problemStatementEn: course.hardestExamQuestionEn?.trim() || course.hardestExamQuestionFa?.trim() || deep.hardestExam.problemStatementEn,
    problemFormulaLatex: course.hardestExamFormulaLatex?.trim() || deep.hardestExam.problemFormulaLatex,
    steps: course.hardestExamSolutionSummaryFa?.trim()
      ? [
          {
            stepNumber: 1,
            titleFa: 'راهبرد و جمع‌بندی حل تشریحی مدیر/استاد',
            titleEn: 'Instructor Verified Solution Strategy',
            explanationFa: course.hardestExamSolutionSummaryFa.trim(),
            explanationEn:
              course.hardestExamSolutionSummaryEn?.trim() ||
              course.hardestExamSolutionSummaryFa.trim(),
            mathLatex: course.hardestExamFormulaLatex?.trim() || deep.hardestExam.problemFormulaLatex,
          },
          ...deep.hardestExam.steps.slice(1).map((st, idx) => ({
            ...st,
            stepNumber: idx + 2,
          })),
        ]
      : deep.hardestExam.steps,
  };

  return {
    feynmanChild5Fa,
    feynmanChild5En,
    model3dType: deep.model3dType,
    historicalOriginFa: deep.historicalOriginFa,
    historicalOriginEn: deep.historicalOriginEn,
    mathematicalProof: deep.mathematicalProof,
    formulaCheatSheet: deep.formulaCheatSheet,
    hardestExam: mergedHardestExam,
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
