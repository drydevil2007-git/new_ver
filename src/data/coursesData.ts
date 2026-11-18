import { CourseItem, DifficultyLevel, EngineeringArticle, FieldCategory } from '../types/app';

export const ENGINEERING_FIELDS: FieldCategory[] = [
  { id: 'math', nameFa: 'ریاضیات پایه مهندسی', nameEn: 'Engineering Mathematics', facultyFa: 'علوم پایه', facultyEn: 'Basic Sciences' },
  { id: 'physics', nameFa: 'فیزیک مهندسی', nameEn: 'Engineering Physics', facultyFa: 'علوم پایه', facultyEn: 'Basic Sciences' },
  { id: 'ee-power', nameFa: 'مهندسی برق — قدرت', nameEn: 'Electrical — Power Systems', facultyFa: 'مهندسی برق', facultyEn: 'Electrical Engineering' },
  { id: 'ee-electronics', nameFa: 'مهندسی برق — الکترونیک', nameEn: 'Electrical — Electronics', facultyFa: 'مهندسی برق', facultyEn: 'Electrical Engineering' },
  { id: 'ee-telecom', nameFa: 'مهندسی برق — مخابرات', nameEn: 'Electrical — Telecommunications', facultyFa: 'مهندسی برق', facultyEn: 'Electrical Engineering' },
  { id: 'ee-control', nameFa: 'مهندسی برق — کنترل', nameEn: 'Electrical — Control Systems', facultyFa: 'مهندسی برق', facultyEn: 'Electrical Engineering' },
  { id: 'cs-software', nameFa: 'مهندسی نرم‌افزار', nameEn: 'Software Engineering', facultyFa: 'کامپیوتر', facultyEn: 'Computer Engineering' },
  { id: 'cs-algorithms', nameFa: 'الگوریتم و علوم کامپیوتر', nameEn: 'Algorithms & Theory', facultyFa: 'کامپیوتر', facultyEn: 'Computer Engineering' },
  { id: 'cs-ai', nameFa: 'هوش مصنوعی و یادگیری ماشین', nameEn: 'AI & Machine Learning', facultyFa: 'کامپیوتر', facultyEn: 'Computer Engineering' },
  { id: 'cs-arch', nameFa: 'معماری کامپیوتر و سخت‌افزار', nameEn: 'Computer Architecture', facultyFa: 'کامپیوتر', facultyEn: 'Computer Engineering' },
  { id: 'cs-networks', nameFa: 'شبکه‌های کامپیوتری و امنیت', nameEn: 'Networks & Cybersecurity', facultyFa: 'کامپیوتر', facultyEn: 'Computer Engineering' },
  { id: 'me-thermo', nameFa: 'مکانیک — ترمودینامیک و سیالات', nameEn: 'Mechanical — Thermofluids', facultyFa: 'مهندسی مکانیک', facultyEn: 'Mechanical Engineering' },
  { id: 'me-solid', nameFa: 'مکانیک — طراحی جامدات', nameEn: 'Mechanical — Solid Mechanics', facultyFa: 'مهندسی مکانیک', facultyEn: 'Mechanical Engineering' },
  { id: 'me-dynamics', nameFa: 'مکانیک — دینامیک و ارتعاشات', nameEn: 'Mechanical — Dynamics & Vibrations', facultyFa: 'مهندسی مکانیک', facultyEn: 'Mechanical Engineering' },
  { id: 'me-manufacturing', nameFa: 'مهندسی ساخت و تولید', nameEn: 'Manufacturing Engineering', facultyFa: 'مهندسی مکانیک', facultyEn: 'Mechanical Engineering' },
  { id: 'ce-structures', nameFa: 'عمران — سازه و زلزله', nameEn: 'Civil — Structural Engineering', facultyFa: 'مهندسی عمران', facultyEn: 'Civil Engineering' },
  { id: 'ce-geotech', nameFa: 'عمران — ژئوتکنیک و خاک', nameEn: 'Civil — Geotechnical', facultyFa: 'مهندسی عمران', facultyEn: 'Civil Engineering' },
  { id: 'ce-hydraulics', nameFa: 'عمران — آب و هیدرولیک', nameEn: 'Civil — Hydraulics & Water', facultyFa: 'مهندسی عمران', facultyEn: 'Civil Engineering' },
  { id: 'ce-transport', nameFa: 'عمران — حمل‌ونقل و راه', nameEn: 'Civil — Transportation', facultyFa: 'مهندسی عمران', facultyEn: 'Civil Engineering' },
  { id: 'chem-process', nameFa: 'مهندسی شیمی — فرآیند', nameEn: 'Chemical — Process Design', facultyFa: 'مهندسی شیمی', facultyEn: 'Chemical Engineering' },
  { id: 'chem-kinetics', nameFa: 'مهندسی شیمی — سینتیک و راکتور', nameEn: 'Chemical — Kinetics & Reactors', facultyFa: 'مهندسی شیمی', facultyEn: 'Chemical Engineering' },
  { id: 'polymer', nameFa: 'مهندسی پلیمر', nameEn: 'Polymer Engineering', facultyFa: 'مهندسی شیمی', facultyEn: 'Chemical Engineering' },
  { id: 'aerospace-aero', nameFa: 'هوافضا — آیرودینامیک', nameEn: 'Aerospace — Aerodynamics', facultyFa: 'مهندسی هوافضا', facultyEn: 'Aerospace Engineering' },
  { id: 'aerospace-prop', nameFa: 'هوافضا — پیشرانش و فضا', nameEn: 'Aerospace — Propulsion & Orbital', facultyFa: 'مهندسی هوافضا', facultyEn: 'Aerospace Engineering' },
  { id: 'ie-or', nameFa: 'صنایع — تحقیق در عملیات', nameEn: 'Industrial — Operations Research', facultyFa: 'مهندسی صنایع', facultyEn: 'Industrial Engineering' },
  { id: 'ie-systems', nameFa: 'صنایع — سیستم‌ها و کیفیت', nameEn: 'Industrial — Systems & Quality', facultyFa: 'مهندسی صنایع', facultyEn: 'Industrial Engineering' },
  { id: 'materials-met', nameFa: 'مهندسی مواد و متالورژی', nameEn: 'Materials & Metallurgy', facultyFa: 'مهندسی مواد', facultyEn: 'Materials Science' },
  { id: 'materials-nano', nameFa: 'نانومواد و کریستالوگرافی', nameEn: 'Nanomaterials & Crystallography', facultyFa: 'مهندسی مواد', facultyEn: 'Materials Science' },
  { id: 'bme-bioelectric', nameFa: 'مهندسی پزشکی — بیوالکتریک', nameEn: 'Biomedical — Bioelectric', facultyFa: 'مهندسی پزشکی', facultyEn: 'Biomedical Engineering' },
  { id: 'bme-biomech', nameFa: 'مهندسی پزشکی — بیومکانیک', nameEn: 'Biomedical — Biomechanics', facultyFa: 'مهندسی پزشکی', facultyEn: 'Biomedical Engineering' },
  { id: 'robotics', nameFa: 'رباتیک و مکاترونیک', nameEn: 'Robotics & Mechatronics', facultyFa: 'بین‌رشته‌ای', facultyEn: 'Interdisciplinary' },
  { id: 'petroleum', nameFa: 'مهندسی نفت و مخازن', nameEn: 'Petroleum & Reservoir Eng.', facultyFa: 'مهندسی نفت', facultyEn: 'Petroleum Engineering' },
  { id: 'mining', nameFa: 'مهندسی معدن و مکانیک سنگ', nameEn: 'Mining & Rock Mechanics', facultyFa: 'مهندسی معدن', facultyEn: 'Mining Engineering' },
  { id: 'nuclear', nameFa: 'مهندسی هسته‌ای و راکتور', nameEn: 'Nuclear & Reactor Engineering', facultyFa: 'مهندسی انرژی', facultyEn: 'Energy Engineering' },
  { id: 'renewable', nameFa: 'انرژی‌های تجدیدپذیر', nameEn: 'Renewable Energy Systems', facultyFa: 'مهندسی انرژی', facultyEn: 'Energy Engineering' },
  { id: 'arch', nameFa: 'معماری و سازه‌های فضایی', nameEn: 'Architecture & Spatial Structures', facultyFa: 'معماری', facultyEn: 'Architecture' },
  { id: 'env', nameFa: 'مهندسی محیط‌زیست', nameEn: 'Environmental Engineering', facultyFa: 'محیط زیست', facultyEn: 'Environmental' },
  { id: 'optics', nameFa: 'فوتونیک و لیزر', nameEn: 'Photonics & Laser Engineering', facultyFa: 'فیزیک و اپتیک', facultyEn: 'Photonics' },
  { id: 'biotech', nameFa: 'بیوتکنولوژی مهندسی', nameEn: 'Biotechnology Engineering', facultyFa: 'زیست‌فناوری', facultyEn: 'Biotechnology' },
  { id: 'stats', nameFa: 'آمار و احتمال مهندسی', nameEn: 'Probability & Statistics', facultyFa: 'علوم پایه', facultyEn: 'Basic Sciences' },
  { id: 'numerical', nameFa: 'محاسبات عددی و شبیه‌سازی', nameEn: 'Numerical Methods & FEM', facultyFa: 'بین‌رشته‌ای', facultyEn: 'Computational Eng.' },
  { id: 'data-sci', nameFa: 'علم داده و کلان‌داده', nameEn: 'Data Science & Big Data', facultyFa: 'کامپیوتر', facultyEn: 'Data Science' },
  { id: 'embedded', nameFa: 'سیستم‌های نهفته و FPGA', nameEn: 'Embedded Systems & FPGA', facultyFa: 'برق و کامپیوتر', facultyEn: 'Embedded Systems' },
  { id: 'marine', nameFa: 'مهندسی دریا و هیدرودینامیک', nameEn: 'Marine & Naval Engineering', facultyFa: 'مهندسی دریا', facultyEn: 'Marine Engineering' },
  { id: 'eng-econ', nameFa: 'اقتصاد و مدیریت مهندسی', nameEn: 'Engineering Economics & Mgmt', facultyFa: 'مدیریت مهندسی', facultyEn: 'Engineering Management' },
];

type SeedTuple = [
  string, // code
  string, // fieldId
  string, // titleFa
  string, // titleEn
  number, // credits
  DifficultyLevel,
  string[], // topicsFa
  string[], // topicsEn
  string // formula
];

const COURSE_SEEDS: SeedTuple[] = [
  // 1. math (4)
  ['MATH-101', 'math', 'ریاضی عمومی ۱', 'Calculus I', 3, 'introductory', ['حد و پیوستگی', 'مشتق و کاربردها', 'انتگرال ریمان'], ['Limits & Continuity', 'Derivatives', 'Riemann Integrals'], '\\int_a^b f(x)\\,dx = F(b) - F(a)'],
  ['MATH-102', 'math', 'ریاضی عمومی ۲', 'Calculus II & Vector Calculus', 3, 'introductory', ['انتگرال چندگانه', 'قضیه استوکس', 'قضیه دیورژانس گاوس'], ['Multiple Integrals', 'Stokes Theorem', 'Divergence Theorem'], '\\iint_{\\Sigma} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_{\\partial\\Sigma} \\mathbf{F} \\cdot d\\mathbf{r}'],
  ['MATH-201', 'math', 'معادلات دیفرانسیل', 'Differential Equations', 3, 'intermediate', ['معادلات مرتبه اول و دوم', 'تبدیل لاپلاس', 'سری‌های توانی'], ['First & Second Order ODEs', 'Laplace Transform', 'Power Series'], '\\mathcal{L}\\{f\'(t)\\} = sF(s) - f(0)'],
  ['MATH-205', 'math', 'ریاضیات مهندسی پیشرفته', 'Advanced Engineering Math', 3, 'advanced', ['سری و تبدیل فوریه', 'آنالیز مختلط و مانده‌ها', 'معادلات با مشتقات جزئی PDE'], ['Fourier Transform', 'Complex Residues', 'Partial Differential Eqs'], '\\oint_C f(z)\\,dz = 2\\pi i \\sum \\text{Res}(f, z_k)'],

  // 2. physics (4)
  ['PHYS-101', 'physics', 'فیزیک ۱ (مکانیک و گرما)', 'Physics I: Mechanics', 3, 'introductory', ['سینماتیک و دینامیک نیوتنی', 'کار و انرژی', 'تکانه زاویه‌ای'], ['Newtonian Dynamics', 'Work & Energy', 'Angular Momentum'], '\\tau = \\frac{d\\mathbf{L}}{dt} = I\\alpha'],
  ['PHYS-102', 'physics', 'فیزیک ۲ (الکتریسیته و مغناطیس)', 'Physics II: Electromagnetism', 3, 'introductory', ['قانون گاوس', 'قانون آمپر و فارادی', 'معادلات ماکسول'], ['Gauss Law', 'Faraday Induction', 'Maxwell Equations'], '\\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}'],
  ['PHYS-201', 'physics', 'فیزیک مدرن و کوانتوم مهندسی', 'Modern & Quantum Physics', 3, 'intermediate', ['نسبیت خاص', 'معادله شرودینگر', 'ساختار باند انرژی'], ['Special Relativity', 'Schrödinger Equation', 'Energy Bands'], 'i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi'],
  ['PHYS-301', 'physics', 'اپتیک موجی و تداخل‌سنجی', 'Wave Optics & Interferometry', 3, 'advanced', ['پراش فرانهوفر', 'تداخل مایکلسون', 'قطبش نور'], ['Fraunhofer Diffraction', 'Interferometry', 'Polarization'], 'd\\sin\\theta = m\\lambda'],

  // 3. ee-power (4)
  ['EE-201', 'ee-power', 'تحلیل مدارهای الکتریکی ۱', 'Electric Circuits I', 3, 'introductory', ['قوانین کیرشهف', 'قضیه تونن و نورتن', 'مدارهای مرتبه اول و دوم'], ['KVL & KCL', 'Thevenin Equivalent', 'RLC Transients'], 'L\\frac{d^2i}{dt^2} + R\\frac{di}{dt} + \\frac{1}{C}i = 0'],
  ['EE-202', 'ee-power', 'تحلیل مدارهای الکتریکی ۲', 'Electric Circuits II (AC & Laplace)', 3, 'intermediate', ['فازورها و توان AC', 'مدارهای سه فاز', 'تابع شبکه در حوزه s'], ['AC Phasors', 'Three-Phase Power', 's-Domain Transfer'], 'S = P + jQ = V_{\\text{rms}} I_{\\text{rms}}^*'],
  ['EE-311', 'ee-power', 'ماشین‌های الکتریکی ۱ و ۲', 'Electric Machinery', 3, 'intermediate', ['ترانسفورماتورهای قدرت', 'موتور القایی سه فاز', 'ژنراتور سنکرون'], ['Power Transformers', 'Induction Motors', 'Synchronous Generators'], 'n_s = \\frac{120 f}{p}'],
  ['EE-412', 'ee-power', 'تحلیل و حفاظت سیستم‌های قدرت', 'Power System Analysis', 3, 'advanced', ['پخش بار نیوتن-رافسون', 'اتصال کوتاه متقارن', 'رله‌های حفاظتی'], ['Newton-Raphson Load Flow', 'Fault Analysis', 'Protection Relays'], 'I_{\\text{fault}} = \\frac{V_f}{Z_1 + Z_2 + Z_0}'],

  // 4. ee-electronics (4)
  ['EE-221', 'ee-electronics', 'الکترونیک ۱ (دیود و ترانزیستور)', 'Electronics I (Diodes & BJT/MOS)', 3, 'introductory', ['مدارهای دیودی', 'بایاس BJT و MOSFET', 'تقویت‌کننده‌های سیگنال کوچک'], ['Diode Circuits', 'BJT & MOSFET Bias', 'Small-Signal Amps'], 'I_D = \\frac{1}{2}\\mu_n C_{ox}\\frac{W}{L}(V_{GS}-V_{th})^2'],
  ['EE-322', 'ee-electronics', 'الکترونیک ۲ (پاسخ فرکانسی و فیدبک)', 'Electronics II (Frequency & Feedback)', 3, 'intermediate', ['پاسخ فرکانسی تقویت‌کننده', 'فیدبک منفی و پایداری', 'طبقات تفاضلی'], ['Frequency Response', 'Negative Feedback', 'Differential Pairs'], 'A_f = \\frac{A}{1 + A\\beta}'],
  ['EE-421', 'ee-electronics', 'طراحی مدارهای مجتمع آنالوگ CMOS', 'Analog CMOS IC Design', 3, 'advanced', ['آینه جریان و کاسکود', 'تصحیح فرکانسی Op-Amp', 'تحلیل نویز حرارتی'], ['Current Mirrors', 'Op-Amp Compensation', 'Noise Analysis'], 'g_m = \\sqrt{2\\mu_n C_{ox}\\frac{W}{L}I_D}'],
  ['EE-425', 'ee-electronics', 'طراحی VLSI دیجیتال', 'Digital VLSI Design', 3, 'advanced', ['تاخیر انتشار اینورتر CMOS', 'مدارهای منطقی پویا', 'طراحی حافظه SRAM'], ['CMOS Delay', 'Dynamic Logic', 'SRAM Cells'], 'P_{\\text{dyn}} = \\alpha C_L V_{DD}^2 f'],

  // 5. ee-telecom (4)
  ['EE-230', 'ee-telecom', 'سیگنال‌ها و سیستم‌ها', 'Signals & Systems', 3, 'intermediate', ['کانولوشن گسسته و پیوسته', 'تبدیل فوریه و Z', 'نمونه‌برداری نایکوئیست'], ['Convolution', 'Fourier & Z-Transform', 'Nyquist Sampling'], 'y(t) = (x * h)(t) = \\int_{-\\infty}^{\\infty} x(\\tau)h(t-\\tau)d\\tau'],
  ['EE-331', 'ee-telecom', 'الکترومغناطیس مهندسی', 'Engineering Electromagnetics', 3, 'intermediate', ['خطوط انتقال و نمودار اسمیت', 'امواج صفحه در دی‌الکتریک', 'موجبرها'], ['Transmission Lines', 'Plane Waves', 'Waveguides'], '\\Gamma = \\frac{Z_L - Z_0}{Z_L + Z_0}'],
  ['EE-335', 'ee-telecom', 'مخابرات ۱ (مدولاسیون آنالوگ و دیجیتال)', 'Communication Systems I', 3, 'intermediate', ['مدولاسیون AM و FM', 'مدولاسیون BPSK و QAM', 'تحلیل نسبت سیگنال به نویز'], ['AM & FM', 'BPSK & QAM', 'SNR Analysis'], 'C = B \\log_2\\left(1 + \\frac{S}{N}\\right)'],
  ['EE-432', 'ee-telecom', 'پردازش سیگنال دیجیتال (DSP)', 'Digital Signal Processing', 3, 'advanced', ['تبدیل FFT', 'طراحی فیلترهای FIR و IIR', 'پردازش چندنرخی'], ['Fast Fourier Transform', 'FIR/IIR Filters', 'Multirate DSP'], 'X[k] = \\sum_{n=0}^{N-1} x[n]e^{-j2\\pi kn/N}'],

  // 6. ee-control (4)
  ['EE-341', 'ee-control', 'سیستم‌های کنترل خطی', 'Linear Control Systems', 3, 'intermediate', ['مکان هندسی ریشه‌ها', 'معیار راث-هورویتز', 'نمودار بود و نایکوئیست'], ['Root Locus', 'Routh-Hurwitz', 'Bode & Nyquist'], 'G_{cl}(s) = \\frac{G(s)}{1 + G(s)H(s)}'],
  ['EE-441', 'ee-control', 'کنترل مدرن (فضای حالت)', 'Modern State-Space Control', 3, 'advanced', ['کنترل‌پذیری و رویت‌پذیری', 'تنظیم‌کننده خطی درجه دوم LQR', 'فیلتر کالمن'], ['Controllability', 'LQR Optimal Control', 'Kalman Filter'], '\\dot{x} = Ax + Bu, \\quad y = Cx'],
  ['EE-443', 'ee-control', 'سیستم‌های کنترل دیجیتال', 'Digital Control Systems', 3, 'advanced', ['گسسته‌سازی نگهدار مرتبه صفر', 'پایداری در صفحه Z', 'کنترل‌کننده PID گسسته'], ['ZOH Discretization', 'Z-Plane Stability', 'Digital PID'], 'u[k] = K_p e[k] + K_i\\sum e[j] + K_d(e[k]-e[k-1])'],
  ['EE-448', 'ee-control', 'کنترل غیرخطی و فازی', 'Nonlinear & Fuzzy Control', 3, 'advanced', ['پایداری لیاپانوف', 'کنترل مد لغزشی', 'صفحه فاز'], ['Lyapunov Stability', 'Sliding Mode Control', 'Phase Plane'], '\\dot{V}(x) = \\nabla V(x)^T f(x) < 0'],

  // 7. cs-software (4)
  ['CS-101', 'cs-software', 'مبانی برنامه‌سازی و پایتون/C++', 'Programming Fundamentals', 3, 'introductory', ['ساختارهای کنترلی', 'اشاره‌گرها و حافظه', 'بازگشت'], ['Control Flow', 'Pointers & Memory', 'Recursion'], 'T(n) = T(n-1) + O(1)'],
  ['CS-201', 'cs-software', 'برنامه‌سازی شیءگرا و الگوهای طراحی', 'Object-Oriented Programming', 3, 'introductory', ['وراثت و چندریختی', 'اصول SOLID', 'الگوهای طراحی GoF'], ['Inheritance & Polymorphism', 'SOLID Principles', 'Design Patterns'], '\\text{Cohesion} \\uparrow \\implies \\text{Coupling} \\downarrow'],
  ['CS-304', 'cs-software', 'مهندسی نرم‌افزار و معماری سیستم', 'Software Engineering & Architecture', 3, 'intermediate', ['مدل‌های چابک', 'معماری میکروسرویس', 'آزمون واحد و CI/CD'], ['Agile Methods', 'Microservices', 'Unit Testing'], '\\text{MTBF} = \\frac{\\text{Uptime}}{\\text{Failures}}'],
  ['CS-402', 'cs-software', 'مهندسی سیستم‌های توزیع‌شده', 'Distributed Systems', 3, 'advanced', ['قضیه CAP', 'الگوریتم اجماع Raft و Paxos', 'ساعت‌های منطقی لامپورت'], ['CAP Theorem', 'Raft Consensus', 'Lamport Clocks'], '\\text{Quorum}: R + W > N'],

  // 8. cs-algorithms (4)
  ['CS-105', 'cs-algorithms', 'ساختمان‌های گسسته', 'Discrete Structures', 3, 'introductory', ['منطق گزاره‌ها و استقرا', 'ترکیبیات', 'نظریه گراف پایه'], ['Propositional Logic', 'Combinatorics', 'Graph Theory'], '|V| - |E| + |F| = 2'],
  ['CS-205', 'cs-algorithms', 'ساختمان داده‌ها', 'Data Structures', 3, 'intermediate', ['درخت‌های AVL و قرمز-سیاه', 'درهم‌سازی Hash Table', 'پشته و صف اولویت'], ['AVL & Red-Black Trees', 'Hashing', 'Heaps'], 'h_{\\text{AVL}}(n) \\le 1.44 \\log_2(n+2)'],
  ['CS-301', 'cs-algorithms', 'طراحی الگوریتم‌ها', 'Algorithm Design', 3, 'intermediate', ['تقسیم و حل و قضیه مستر', 'برنامه‌ریزی پویا', 'کوتاه‌ترین مسیر گراف'], ['Master Theorem', 'Dynamic Programming', 'Shortest Paths'], 'T(n) = aT(n/b) + f(n)'],
  ['CS-401', 'cs-algorithms', 'نظریه زبان‌ها و اتوماتا', 'Automata & Computability', 3, 'advanced', ['ماشین‌های متناهی DFA/NFA', 'گرامر مستقل از متن', 'ماشین تورینگ و P vs NP'], ['DFA/NFA', 'Context-Free Grammars', 'Turing Machines'], 'L \\in \\mathbf{NP} \\iff \\exists V \\in \\mathbf{P}'],

  // 9. cs-ai (4)
  ['AI-301', 'cs-ai', 'مبانی هوش مصنوعی و جستجو', 'Artificial Intelligence', 3, 'intermediate', ['جستجوی آگاهانه A*', 'الگوریتم مینی‌مکس و هرس آلفا-بتا', 'شبکه‌های بیزین'], ['A* Search', 'Minimax Pruning', 'Bayesian Networks'], 'f(n) = g(n) + h(n)'],
  ['AI-305', 'cs-ai', 'یادگیری ماشین آماری', 'Machine Learning', 3, 'intermediate', ['رگرسیون و گرادیان کاهشی', 'ماشین بردار پشتیبان SVM', 'درخت تصمیم و بوستینگ'], ['Gradient Descent', 'Support Vector Machines', 'Ensemble Boosting'], '\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta J(\\theta_t)'],
  ['AI-401', 'cs-ai', 'یادگیری عمیق و شبکه‌های عصبی', 'Deep Learning', 3, 'advanced', ['پس‌انتشار خطا', 'شبکه‌های کانولوشنی CNN', 'معماری Transformer و Attention'], ['Backpropagation', 'CNNs', 'Transformers'], '\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V'],
  ['AI-410', 'cs-ai', 'پردازش زبان طبیعی و مدل‌های زبانی', 'NLP & Language Models', 3, 'advanced', ['توکنایزیشن و تعبیه کلمات', 'مدل‌های زبانی بزرگ LLM', 'RAG و هم‌ترازی'], ['Embeddings', 'Large Language Models', 'RAG Systems'], '\\mathcal{L}_{\\text{CE}} = -\\sum_{t} \\log P(x_t | x_{<t})'],

  // 10. cs-arch (4)
  ['CA-201', 'cs-arch', 'مدارهای منطقی', 'Digital Logic Design', 3, 'introductory', ['جبر بول و کارنو', 'فلیپ‌فلاپ‌ها', 'ماشین‌های حالت متناهی'], ['Boolean Algebra', 'Flip-Flops', 'Finite State Machines'], 'Q^+ = D \\cdot CLK'],
  ['CA-301', 'cs-arch', 'معماری کامپیوتر (RISC-V / MIPS)', 'Computer Architecture', 3, 'intermediate', ['لوله‌کشی Pipeline', 'مخاطرات داده و کنترل', 'حافظه نهان Cache'], ['Pipelining', 'Hazard Resolution', 'Cache Hierarchy'], '\\text{AMAT} = T_{\\text{hit}} + \\text{MissRate} \\times T_{\\text{miss}}'],
  ['CA-305', 'cs-arch', 'سیستم‌های عامل', 'Operating Systems', 3, 'intermediate', ['زمان‌بندی پردازنده', 'همگام‌سازی و بن‌بست', 'حافظه مجازی و صفحه‌بندی'], ['CPU Scheduling', 'Deadlocks & Mutex', 'Virtual Memory'], 'E(\\text{Turnaround}) = \\sum (T_{\\text{finish}} - T_{\\text{arrival}}) / n'],
  ['CA-405', 'cs-arch', 'پردازش موازی و معماری GPU', 'Parallel & GPU Computing', 3, 'advanced', ['قانون آمدال', 'مدل CUDA و حافظه اشتراکی', 'MPI و OpenMP'], ['Amdahl Law', 'CUDA Architecture', 'MPI/OpenMP'], 'S_{\\text{latency}}(s) = \\frac{1}{(1-p) + p/s}'],

  // 11. cs-networks (4)
  ['NET-301', 'cs-networks', 'شبکه‌های کامپیوتری', 'Computer Networks', 3, 'intermediate', ['مدل TCP/IP و OSI', 'مسیریابی OSPF و BGP', 'کنترل ازدحام TCP'], ['TCP/IP Stack', 'Routing Protocols', 'Congestion Control'], '\\text{Throughput} \\le \\frac{\\text{MSS}}{\\text{RTT}} \\cdot \\frac{C}{\\sqrt{p}}'],
  ['NET-401', 'cs-networks', 'امنیت شبکه و رمزنگاری', 'Network Security & Cryptography', 3, 'advanced', ['رمزنگاری RSA و ECC', 'رمزنگاری متقارن AES', 'پروتکل TLS 1.3'], ['RSA & Elliptic Curves', 'AES Symmetric', 'TLS Handshake'], 'c \\equiv m^e \\pmod n, \\quad m \\equiv c^d \\pmod n'],
  ['NET-406', 'cs-networks', 'امنیت سیستم‌های نرم‌افزاری', 'Application Security', 3, 'advanced', ['سرریز بافر', 'تزریق SQL و XSS', 'مدل‌سازی تهدید'], ['Buffer Overflows', 'Injection Defenses', 'Threat Modeling'], '\\text{Risk} = \\text{Likelihood} \\times \\text{Impact}'],
  ['NET-412', 'cs-networks', 'رایانش ابری و کانتینرسازی', 'Cloud & Container Systems', 3, 'intermediate', ['معماری داکر و کوبرنتیز', 'تعادل بار و مقیاس‌پذیری', 'شبکه‌های تعریف‌شده با نرم‌افزار SDN'], ['Docker & Kubernetes', 'Auto-scaling', 'SDN'], '\\text{Availability} = \\frac{\\text{MTTF}}{\\text{MTTF} + \\text{MTTR}}'],

  // 12. me-thermo (4)
  ['ME-204', 'me-thermo', 'ترمودینامیک ۱ و ۲', 'Engineering Thermodynamics', 3, 'intermediate', ['قانون اول و دوم ترمودینامیک', 'آنتروپی و اگزرژی', 'چرخه‌های رانکین و برایتون'], ['1st & 2nd Laws', 'Entropy & Exergy', 'Power Cycles'], '\\eta_{\\text{Carnot}} = 1 - \\frac{T_L}{T_H}'],
  ['ME-208', 'me-thermo', 'مکانیک سیالات ۱', 'Fluid Mechanics I', 3, 'intermediate', ['استاتیک سیالات', 'معادله برنولی و مومنتوم', 'جریان در لوله‌ها و نمودار مودی'], ['Hydrostatics', 'Bernoulli & Momentum', 'Pipe Flow'], '\\frac{P}{\\rho g} + \\frac{V^2}{2g} + z = \\text{const}'],
  ['ME-304', 'me-thermo', 'انتقال حرارت', 'Heat Transfer', 3, 'intermediate', ['هدایت پایا و گذرا', 'جابه‌جایی آزاد و اجباری', 'مبدل‌های حرارتی LMTD'], ['Conduction', 'Convection', 'Heat Exchangers'], 'q\'\' = -k\\frac{dT}{dx} = h(T_s - T_\\infty)'],
  ['ME-404', 'me-thermo', 'دینامیک سیالات محاسباتی (CFD)', 'Computational Fluid Dynamics', 3, 'advanced', ['معادلات ناویر-استوکس', 'روش حجم محدود', 'مدل‌سازی آشفتگی k-ε'], ['Navier-Stokes', 'Finite Volume Method', 'Turbulence Models'], '\\rho\\left(\\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u}\\cdot\\nabla\\mathbf{u}\\right) = -\\nabla p + \\mu\\nabla^2\\mathbf{u}'],

  // 13. me-solid (4)
  ['ME-105', 'me-solid', 'استاتیک مهندسی', 'Engineering Statics', 3, 'introductory', ['تعادل ذره و جسم صلب', 'تحلیل خرپا و قاب', 'ممان اینرسی سطح'], ['Rigid Body Equilibrium', 'Trusses & Frames', 'Area Moment of Inertia'], '\\sum \\mathbf{F} = 0, \\quad \\sum \\mathbf{M}_O = 0'],
  ['ME-202', 'me-solid', 'مقاومت مصالح ۱ و ۲', 'Mechanics of Materials', 3, 'intermediate', ['تنش و کرنش محوری و برشی', 'خمش تیرها و پیچش', 'دایره مور و کمانش اویلر'], ['Stress & Strain', 'Bending & Torsion', 'Mohr Circle & Buckling'], '\\sigma = \\frac{M y}{I}, \\quad P_{cr} = \\frac{\\pi^2 E I}{(KL)^2}'],
  ['ME-310', 'me-solid', 'طراحی اجزای ماشین', 'Machine Element Design', 3, 'intermediate', ['تئوری‌های شکست خستگی', 'طراحی شفت و بلبرینگ', 'چرخ‌دنده‌ها و فنرها'], ['Fatigue Failure', 'Shafts & Bearings', 'Gears & Springs'], '\\frac{\\sigma_a}{S_e} + \\frac{\\sigma_m}{S_{ut}} = \\frac{1}{n}'],
  ['ME-415', 'me-solid', 'تئوری الاستیسیته و پلاستیسیته', 'Theory of Elasticity', 3, 'advanced', ['تانسور تنش کوشی', 'تابع تنش ایری', 'معیار تسلیم فون‌میسز'], ['Cauchy Stress Tensor', 'Airy Stress Function', 'Von Mises Yield'], '\\sigma_{\\text{vm}} = \\sqrt{\\frac{(\\sigma_1-\\sigma_2)^2+(\\sigma_2-\\sigma_3)^2+(\\sigma_3-\\sigma_1)^2}{2}}'],

  // 14. me-dynamics (4)
  ['ME-206', 'me-dynamics', 'دینامیک مهندسی', 'Engineering Dynamics', 3, 'introductory', ['سینماتیک ذره و جسم صلب', 'قانون دوم اویلر', 'کار و انرژی و ضربه'], ['Rigid Kinematics', 'Newton-Euler', 'Impulse & Momentum'], '\\sum \\mathbf{M}_G = I_G\\boldsymbol{\\alpha} + \\boldsymbol{\\omega}\\times(I_G\\boldsymbol{\\omega})'],
  ['ME-320', 'me-dynamics', 'ارتعاشات مکانیکی', 'Mechanical Vibrations', 3, 'intermediate', ['سیستم‌های یک‌درجه آزادی میرا', 'تشدید و ضریب انتقال', 'سیستم‌های چنددرجه آزادی و مودها'], ['Damped SDOF', 'Resonance', 'Modal Analysis'], 'm\\ddot{x} + c\\dot{x} + kx = F_0\\cos(\\omega t)'],
  ['ME-325', 'me-dynamics', 'دینامیک سیستم‌ها و کنترل مکانیکی', 'System Dynamics & Control', 3, 'intermediate', ['مدل‌سازی سیستم‌های الکترومکانیکی', 'تابع تبدیل مکانیکی', 'پاسخ زمانی و پایداری'], ['Electromechanical Models', 'Transfer Functions', 'Time Response'], 'G(s) = \\frac{1}{ms^2 + cs + k}'],
  ['ME-422', 'me-dynamics', 'دینامیک تحلیلی و لاگرانژ', 'Analytical Dynamics', 3, 'advanced', ['مختصات تعمیم‌یافته', 'معادلات اویلر-لاگرانژ', 'مکانیک هامیلتونی'], ['Generalized Coordinates', 'Euler-Lagrange', 'Hamiltonian Mechanics'], '\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = Q_i'],

  // 15. me-manufacturing (3)
  ['ME-240', 'me-manufacturing', 'علم و فناوری جوشکاری و شکل‌دهی', 'Manufacturing Processes', 3, 'introductory', ['ریخته‌گری و انجماد', 'نورد و اکستروژن', 'ماشین‌کاری و نرخ براده‌برداری'], ['Casting', 'Metal Forming', 'Machining'], 'F_c = k_s \\cdot a_p \\cdot f'],
  ['ME-342', 'me-manufacturing', 'سیستم‌های CNC و CAD/CAM', 'CNC & CAD/CAM Engineering', 3, 'intermediate', ['برنامه‌نویسی G-Code', 'تولید سطوح منحنی NURBS', 'تولید افزایشی و پرینت سه‌بعدی'], ['G-Code Programming', 'NURBS Surfaces', 'Additive Manufacturing'], '\\text{MRR} = v_f \\cdot a_p \\cdot a_e'],
  ['ME-445', 'me-manufacturing', 'اتوماسیون صنعتی و PLC', 'Industrial Automation & PLC', 3, 'advanced', ['منطق نردبانی Ladder', 'حسگرها و عملگرهای صنعتی', 'شبکه SCADA و Modbus'], ['Ladder Logic', 'Industrial Sensors', 'SCADA Systems'], '\\text{ScanTime} = T_{\\text{in}} + T_{\\text{prog}} + T_{\\text{out}}'],

  // 16. ce-structures (4)
  ['CE-210', 'ce-structures', 'تحلیل سازه‌های ۱ و ۲', 'Structural Analysis', 3, 'intermediate', ['خطوط تاثیر', 'روش کار مجازی', 'روش شیب-افت و ماتریس سختی'], ['Influence Lines', 'Virtual Work', 'Stiffness Matrix'], '\\mathbf{F} = \\mathbf{K}\\mathbf{u}'],
  ['CE-311', 'ce-structures', 'طراحی سازه‌های بتن آرمه', 'Reinforced Concrete Design', 3, 'intermediate', ['مقطع مستطیلی خمش', 'طراحی برشی و خاموت', 'ستون‌های تحت بار محوری و لنگر'], ['Flexural Design', 'Shear Stirrups', 'Columns'], 'M_n = A_s f_y \\left(d - \\frac{a}{2}\\right)'],
  ['CE-314', 'ce-structures', 'طراحی سازه‌های فولادی', 'Steel Structure Design', 3, 'intermediate', ['اتصالات پیچی و جوشی', 'تیرورق و مهاربند', 'ضوابط LRFD'], ['Bolted/Welded Joints', 'Plate Girders', 'LRFD Code'], '\\phi_b M_n \\ge M_u'],
  ['CE-412', 'ce-structures', 'مهندسی زلزله و دینامیک سازه', 'Earthquake Engineering', 3, 'advanced', ['طیف پاسخ طرح', 'تحلیل تاریخچه زمانی', 'جداگرهای لرزه‌ای'], ['Response Spectrum', 'Time History', 'Base Isolation'], 'V = C_s W'],

  // 17. ce-geotech (3)
  ['CE-220', 'ce-geotech', 'مکانیک خاک', 'Soil Mechanics', 3, 'intermediate', ['دانه‌بندی و حدود اتربرگ', 'تنش موثر و تراوش', 'تئوری تحکیم ترزاقی'], ['Atterberg Limits', 'Effective Stress', 'Consolidation'], '\\sigma\' = \\sigma - u'],
  ['CE-322', 'ce-geotech', 'مهندسی پی (شالوده)', 'Foundation Engineering', 3, 'intermediate', ['ظرفیت باربری پی سطحی', 'طراحی دیوار حائل', 'شمع‌های عمیق'], ['Bearing Capacity', 'Retaining Walls', 'Deep Piles'], 'q_u = cN_c + qN_q + \\frac{1}{2}\\gamma B N_\\gamma'],
  ['CE-425', 'ce-geotech', 'ژئوتکنیک لرزه‌ای و روانگرایی', 'Geotechnical Earthquake Eng.', 3, 'advanced', ['پتانسیل روانگرایی خاک', 'پایداری شیروانی دینامیکی', 'بهسازی خاک'], ['Liquefaction', 'Slope Stability', 'Ground Improvement'], '\\text{FS}_L = \\frac{\\text{CRR}}{\\text{CSR}}'],

  // 18. ce-hydraulics (3)
  ['CE-230', 'ce-hydraulics', 'هیدرولیک و کانال‌های روباز', 'Open-Channel Hydraulics', 3, 'intermediate', ['معادله مانینگ', 'پرش هیدرولیکی و عدد فرود', 'پروفیل جریان متغیر تدریجی'], ['Manning Equation', 'Hydraulic Jump', 'Gradually Varied Flow'], 'V = \\frac{1}{n} R_h^{2/3} S^{1/2}'],
  ['CE-331', 'ce-hydraulics', 'هیدرولوژی مهندسی', 'Engineering Hydrology', 3, 'intermediate', ['هیدروگراف واحد', 'تحلیل سیلاب و دوره بازگشت', 'نفوذ و تبخیر'], ['Unit Hydrograph', 'Flood Frequency', 'Infiltration'], 'Q_p = C \\cdot i \\cdot A'],
  ['CE-432', 'ce-hydraulics', 'طراحی سدها و سازه‌های آبی', 'Hydraulic Structures & Dams', 3, 'advanced', ['سدهای خاکی و بتنی', 'سرریزها و حوضچه آرامش', 'تراوش زیر پی سد'], ['Concrete/Earth Dams', 'Spillways', 'Seepage Uplift'], '\\text{FS}_{\\text{slide}} = \\frac{\\sum V \\tan\\phi + cB}{\\sum H}'],

  // 19. ce-transport (3)
  ['CE-240', 'ce-transport', 'مهندسی راه و روسازی', 'Highway & Pavement Eng.', 3, 'introductory', ['طراحی هندسی قوس‌های افقی/قائم', 'تراکم روسازی آسفالتی', 'دید توقف'], ['Geometric Design', 'Asphalt Pavements', 'Sight Distance'], 'R_{\\min} = \\frac{V^2}{127(e + f_s)}'],
  ['CE-341', 'ce-transport', 'مهندسی ترافیک و مدل‌سازی جریان', 'Traffic Engineering', 3, 'intermediate', ['رابطه گرین‌شیلدز', 'ظرفیت تقاطع چراغ‌دار', 'سطح سرویس LOS'], ['Greenshields Model', 'Signal Timing', 'Level of Service'], 'q = k \\cdot u = k \\cdot u_f\\left(1 - \\frac{k}{k_j}\\right)'],
  ['CE-440', 'ce-transport', 'برنامه‌ریزی حمل‌ونقل شهری', 'Transportation Planning', 3, 'advanced', ['مدل چهارمرحله‌ای تقاضا', 'تخصیص ترافیک واردروپ', 'لجستیک هوشمند'], ['Four-Step Model', 'Wardrop Equilibrium', 'Smart Transit'], 'T_{ij} = A_i O_i B_j D_j f(c_{ij})'],

  // 20. chem-process (4)
  ['CHE-201', 'chem-process', 'موازنه جرم و انرژی', 'Material & Energy Balances', 3, 'introductory', ['موازنه در فرآیندهای بازگشتی', 'گازهای حقیقی و کمپرسیبیلیتی', 'آنتالپی واکنش'], ['Recycle Balances', 'Real Gases', 'Reaction Enthalpy'], '\\sum \\dot{m}_{\\text{in}} - \\sum \\dot{m}_{\\text{out}} + \\dot{r}_{\\text{gen}} = 0'],
  ['CHE-301', 'chem-process', 'ترمودینامیک مهندسی شیمی', 'Chemical Eng. Thermodynamics', 3, 'intermediate', ['معادلات حالت پنگ-رابینسون', 'فوگاسیته و ضریب فعالیت', 'تعادل فاز بخار-مایع VLE'], ['Cubic EOS', 'Fugacity', 'VLE Equilibrium'], 'y_i \\hat{\\phi}_i P = x_i \\gamma_i P_i^{\\text{sat}}'],
  ['CHE-305', 'chem-process', 'عملیات واحد (تقطیر و جذب)', 'Unit Operations (Separation)', 3, 'intermediate', ['برج تقطیر مک‌کیب-تیل', 'جذب گاز و استخراج', 'ضریب انتقال جرم'], ['McCabe-Thiele', 'Gas Absorption', 'Mass Transfer'], 'N_A = k_c(C_{Ai} - C_A)'],
  ['CHE-402', 'chem-process', 'طراحی و شبیه‌سازی فرآیند (Aspen)', 'Process Design & Simulation', 3, 'advanced', ['شبکه مبدل‌های پینچ', 'اقتصاد طراحی کارخانه', 'کنترل فرآیند چندمتغیره'], ['Pinch Analysis', 'Plant Economics', 'Process Control'], '\\Delta T_{\\min} \\to Q_{H,\\min}, Q_{C,\\min}'],

  // 21. chem-kinetics (3)
  ['CHE-320', 'chem-kinetics', 'سینتیک و طراحی راکتورهای شیمیایی', 'Chemical Reaction Engineering', 3, 'intermediate', ['راکتورهای ناپیوسته، CSTR و PFR', 'طراحی راکتور غیرهم‌دما', 'کاتالیزورهای ناهمگن'], ['Batch, CSTR & PFR', 'Non-isothermal Reactors', 'Catalysis'], 'V_{\\text{CSTR}} = \\frac{F_{A0} X}{-r_A}'],
  ['CHE-422', 'chem-kinetics', 'پدیده‌های انتقال پیشرفته', 'Transport Phenomena', 3, 'advanced', ['تشابه انتقال جرم، حرارت و مومنتوم', 'تانسور تنش نیوتنی', 'انتشار چندجزئی'], ['Momentum/Heat/Mass Analogy', 'Boundary Layers', 'Diffusion'], '\\mathbf{J}_A = -D_{AB}\\nabla C_A'],
  ['CHE-425', 'chem-kinetics', 'مهندسی الکتروشیمی و پیل سوختی', 'Electrochemical Engineering', 3, 'advanced', ['معادله باتلر-ولمر', 'پتانسیل نرنست', 'طراحی پیل سوختی PEM'], ['Butler-Volmer', 'Nernst Potential', 'PEM Fuel Cells'], 'E = E^0 - \\frac{RT}{nF}\\ln Q'],

  // 22. polymer (3)
  ['POLY-201', 'polymer', 'شیمی و سنتز پلیمرها', 'Polymer Chemistry', 3, 'introductory', ['پلیمریزاسیون مرحله‌ای و زنجیره‌ای', 'توزیع جرم مولکولی', 'کوپلیمریزاسیون'], ['Step & Chain Polymerization', 'MWD', 'Copolymerization'], 'M_w / M_n = \\text{PDI}'],
  ['POLY-302', 'polymer', 'رئولوژی و فرآیند شکل‌دهی پلیمر', 'Polymer Rheology & Processing', 3, 'intermediate', ['سیالات غیروتون و ویسکوالاستیک', 'اکستروژن و تزریق پلاستیک', 'مدل ماکسول و کلوین'], ['Viscoelasticity', 'Injection Molding', 'Maxwell Model'], '\\tau = K \\dot{\\gamma}^n'],
  ['POLY-401', 'polymer', 'کامپوزیت‌های پلیمری پیشرفته', 'Polymer Composites', 3, 'advanced', ['تئوری کلاسیک ورقه‌ها CLT', 'الیاف کربن و شیشه', 'تنش بین‌لایه‌ای'], ['Laminate Theory', 'Carbon Fiber', 'Interlaminar Stress'], '\\mathbf{N} = \\mathbf{A}\\boldsymbol{\\varepsilon}^0 + \\mathbf{B}\\boldsymbol{\\kappa}'],

  // 23. aerospace-aero (4)
  ['AE-201', 'aerospace-aero', 'آیرودینامیک ۱ (جریان پتانسیل)', 'Aerodynamics I', 3, 'intermediate', ['قضیه کوتا-جوکوفسکی', 'تئوری ایرفویل نازک', 'تئوری خط بال پرانتل'], ['Kutta-Joukowski', 'Thin Airfoil Theory', 'Lifting-Line Theory'], 'L\' = \\rho_\\infty V_\\infty \\Gamma'],
  ['AE-301', 'aerospace-aero', 'آیرودینامیک ۲ (جریان تراکم‌پذیر)', 'Compressible Aerodynamics', 3, 'advanced', ['موج ضربه‌ای قائم و مایل', 'جریان فانو و رایلی', 'انبساط پرانتل-مایر'], ['Normal & Oblique Shocks', 'Fanno/Rayleigh Flow', 'Supersonic Nozzles'], 'M_2^2 = \\frac{1 + \\frac{\\gamma-1}{2}M_1^2}{\\gamma M_1^2 - \\frac{\\gamma-1}{2}}'],
  ['AE-310', 'aerospace-aero', 'مکانیک پرواز و پایداری هواپیما', 'Flight Mechanics & Stability', 3, 'intermediate', ['پایداری استاتیکی طولی و عرضی', 'مودهای فوگوئید و دوره کوتاه', 'عملکرد اوج‌گیری و برد'], ['Static Stability', 'Phugoid & Short Period', 'Aircraft Performance'], 'C_{m,\\alpha} < 0'],
  ['AE-405', 'aerospace-aero', 'آئروالاستیسیته و فلاتر', 'Aeroelasticity & Flutter', 3, 'advanced', ['واگرایی استاتیکی بال', 'پدیده فلاتر', 'پاسخ به تندباد'], ['Wing Divergence', 'Flutter Speed', 'Gust Response'], 'q_D = \\frac{K_\\theta}{e c S C_{L,\\alpha}}'],

  // 24. aerospace-prop (3)
  ['AE-320', 'aerospace-prop', 'پیشرانش هوافضایی (توربوجت و راکت)', 'Aerospace Propulsion', 3, 'intermediate', ['موتورهای توربوجت و توربوفن', 'معادله تراست راکت', 'نازل همگرا-واگرا'], ['Turbofan Cycles', 'Rocket Thrust', 'De Laval Nozzle'], 'I_{sp} = \\frac{F}{\\dot{m} g_0}'],
  ['AE-330', 'aerospace-prop', 'مکانیک مدارهای فضایی', 'Orbital Mechanics', 3, 'intermediate', ['قوانین کپلر و معادله ویز-ویوا', 'انتقال مداری هوهمان', 'عناصر مداری شش‌گانه'], ['Keplerian Orbits', 'Hohmann Transfer', 'Orbital Elements'], 'v^2 = \\mu\\left(\\frac{2}{r} - \\frac{1}{a}\\right)'],
  ['AE-432', 'aerospace-prop', 'طراحی و کنترل وضعیت ماهواره', 'Spacecraft Attitude Control', 3, 'advanced', ['کواترنیون‌ها و ماتریس چرخش', 'چرخ‌های عکس‌العملی', 'پایداری چرخشی'], ['Quaternions', 'Reaction Wheels', 'Spin Stabilization'], '\\dot{\\mathbf{q}} = \\frac{1}{2}\\Omega(\\boldsymbol{\\omega})\\mathbf{q}'],

  // 25. ie-or (4)
  ['IE-201', 'ie-or', 'تحقیق در عملیات ۱ (برنامه‌ریزی خطی)', 'Operations Research I (LP)', 3, 'intermediate', ['روش سیمپلکس', 'قضیه دوگانگی', 'تحلیل حساسیت'], ['Simplex Method', 'Duality Theory', 'Sensitivity Analysis'], '\\max \\mathbf{c}^T\\mathbf{x} \\quad \\text{s.t. } A\\mathbf{x} \\le \\mathbf{b}'],
  ['IE-302', 'ie-or', 'تحقیق در عملیات ۲ (غیرخطی و عدد صحیح)', 'Operations Research II (MIP/NLP)', 3, 'advanced', ['شاخه و کران', 'شرایط بهینگی KKT', 'مسیر بحرانی شبکه‌ها'], ['Branch & Bound', 'KKT Conditions', 'Network Flows'], '\\nabla f(x^*) + \\sum \\lambda_i \\nabla g_i(x^*) = 0'],
  ['IE-310', 'ie-or', 'فرآیندهای تصادفی و نظریه صف', 'Stochastic Processes & Queuing', 3, 'intermediate', ['زنجیره‌های مارکوف', 'سیستم صف M/M/1 و M/M/c', 'شبیه‌سازی گسسته-پیشامد'], ['Markov Chains', 'M/M/1 Queues', 'Discrete Simulation'], 'L = \\lambda W = \\frac{\\rho}{1 - \\rho}'],
  ['IE-405', 'ie-or', 'بهینه‌سازی فراابتکاری و ژنتیک', 'Metaheuristic Optimization', 3, 'advanced', ['الگوریتم ژنتیک', 'تبرید شبیه‌سازی‌شده SA', 'بهینه‌سازی ازدحام ذرات PSO'], ['Genetic Algorithms', 'Simulated Annealing', 'Particle Swarm'], 'P(\\Delta E) = \\exp(-\\Delta E / T)'],

  // 26. ie-systems (3)
  ['IE-220', 'ie-systems', 'طرح‌ریزی و کنترل موجودی و تولید', 'Production & Inventory Control', 3, 'intermediate', ['مدل EOQ', 'برنامه‌ریزی نیازمندی مواد MRP', 'زمان‌بندی کارگاهی'], ['EOQ Model', 'MRP Planning', 'Job-Shop Scheduling'], 'Q^* = \\sqrt{\\frac{2 D S}{H}}'],
  ['IE-325', 'ie-systems', 'کنترل کیفیت آماری و شش سیگما', 'Statistical Quality Control', 3, 'intermediate', ['نمودارهای کنترل X-bar و R', 'شاخص‌های قابلیت فرآیند Cp و Cpk', 'نمونه‌گیری پذیرش'], ['Control Charts', 'Cp / Cpk Capability', 'Acceptance Sampling'], 'C_{pk} = \\min\\left(\\frac{\\text{USL}-\\mu}{3\\sigma}, \\frac{\\mu-\\text{LSL}}{3\\sigma}\\right)'],
  ['IE-420', 'ie-systems', 'مدیریت زنجیره تامین و لجستیک', 'Supply Chain Management', 3, 'advanced', ['اثر شلاق چرمی', 'مکان‌یابی هاب‌ها', 'قراردادهای اشتراک ریسک'], ['Bullwhip Effect', 'Facility Location', 'Supply Contracts'], '\\text{Var}(Q) / \\text{Var}(D) \\ge 1 + \\frac{2L}{p}'],

  // 27. materials-met (4)
  ['MAT-101', 'materials-met', 'علم مواد و مهندسی متالورژی', 'Materials Science & Engineering', 3, 'introductory', ['ساختارهای بلوری BCC/FCC/HCP', 'نقص‌های نقطه‌ای و نابجایی', 'تست کشش و ضربه'], ['Crystal Structures', 'Dislocations', 'Tensile Testing'], '\\sigma_y = \\sigma_0 + k_y d^{-1/2}'],
  ['MAT-205', 'materials-met', 'ترمودینامیک و سینتیک مواد', 'Thermodynamics of Materials', 3, 'intermediate', ['نمودارهای فازی دوتایی', 'قانون اهرم و نقطه اوتکتیک', 'قوانین نفوذ فیک'], ['Phase Diagrams', 'Lever Rule', 'Fick Diffusion'], 'J = -D \\frac{\\partial C}{\\partial x}'],
  ['MAT-308', 'materials-met', 'عملیات حرارتی و استحاله فازی', 'Heat Treatment & Phase Transformations', 3, 'intermediate', ['نمودار TTT و CCT', 'تشکیل مارتنزیت و پرلیت', 'سخت‌کاری رسوبی'], ['TTT Diagrams', 'Martensite', 'Precipitation Hardening'], '\\Delta G^* = \\frac{16\\pi \\gamma^3}{3(\\Delta G_v)^2}'],
  ['MAT-402', 'materials-met', 'مکانیک شکست و خوردگی فلزات', 'Fracture Mechanics & Corrosion', 3, 'advanced', ['ضریب شدت تنش K_IC', 'رشد ترک خستگی پاریس', 'حفاظت کاتدی'], ['Stress Intensity K_IC', 'Paris Law', 'Cathodic Protection'], 'K_I = Y \\sigma \\sqrt{\\pi a}'],

  // 28. materials-nano (3)
  ['NANO-301', 'materials-nano', 'مبانی نانوساختارها و نقاط کوانتومی', 'Nanostructures & Quantum Dots', 3, 'intermediate', ['محدودیت کوانتومی', 'نانولوله‌های کربنی و گرافن', 'سنتز سول-ژل'], ['Quantum Confinement', 'Graphene & CNTs', 'Sol-Gel Synthesis'], 'E_n = \\frac{n^2 h^2}{8 m^* L^2}'],
  ['NANO-305', 'materials-nano', 'روش‌های مشخصه‌یابی (SEM, TEM, XRD)', 'Materials Characterization', 3, 'intermediate', ['پراش اشعه ایکس XRD و براگ', 'میکروسکوپ الکترونی روبشی', 'طیف‌سنجی رامان'], ['XRD & Bragg Law', 'SEM / TEM', 'Raman Spectroscopy'], 'n\\lambda = 2d\\sin\\theta'],
  ['NANO-404', 'materials-nano', 'بیونانومواد و حامل‌های دارویی', 'Bionanomaterials', 3, 'advanced', ['فولرن‌ها و لیپوزوم‌ها', 'رهاسازی کنترل‌شده دارو', 'زیست‌سازگاری سطوح'], ['Liposomes', 'Controlled Drug Release', 'Biocompatibility'], 'M_t / M_\\infty = k t^n'],

  // 29. bme-bioelectric (4)
  ['BME-201', 'bme-bioelectric', 'فیزیولوژی و آناتومی مهندسی', 'Engineering Physiology', 3, 'introductory', ['پتانسیل استراحت و عمل غشا', 'سیستم قلبی-عروقی', 'پتانسیل نرنست و گلدمن'], ['Action Potential', 'Cardiovascular System', 'Goldman Equation'], 'C_m \\frac{dV_m}{dt} + I_{\\text{ion}} = I_{\\text{ext}}'],
  ['BME-301', 'bme-bioelectric', 'پردازش سیگنال‌های حیاتی (ECG/EEG)', 'Biomedical Signal Processing', 3, 'intermediate', ['حذف نویز برق شهر و حرکت', 'تشخیص QRS در ECG', 'آنالیز طیفی موج مغزی'], ['ECG QRS Detection', 'EEG Spectral Analysis', 'Adaptive Filtering'], '\\text{HR} = \\frac{60}{RR_{\\text{sec}}}'],
  ['BME-310', 'bme-bioelectric', 'تصویربرداری پزشکی (MRI, CT, سونوگرافی)', 'Medical Imaging Systems', 3, 'intermediate', ['تبدیل رادون در CT', 'فیزیک رزونانس مغناطیسی MRI', 'تصویربرداری داپلر اولتراسوند'], ['CT Radon Transform', 'MRI Physics', 'Ultrasound Doppler'], '\\omega_0 = \\gamma B_0'],
  ['BME-405', 'bme-bioelectric', 'رابط مغز و کامپیوتر (BCI)', 'Brain-Computer Interfaces', 3, 'advanced', ['پتانسیل برانگیخته P300', 'الگوریتم CSP', 'کدگشایی حرکت'], ['P300 & SSVEP', 'Common Spatial Patterns', 'Neural Decoding'], 'W^T \\Sigma_1 W = \\Lambda'],

  // 30. bme-biomech (3)
  ['BME-220', 'bme-biomech', 'بیومکانیک استخوان و بافت نرم', 'Tissue Biomechanics', 3, 'intermediate', ['رفتار غیرخطی تاندون و رباط', 'قانون ولف در استخوان', 'مدل هایپری‌الاستیک مونی-ریولین'], ['Soft Tissue Hyperelasticity', 'Wolff Law', 'Tendon Mechanics'], '\\sigma = E\\varepsilon + \\eta\\dot{\\varepsilon}'],
  ['BME-322', 'bme-biomech', 'بیومکانیک حرکت و تحلیل گیت', 'Gait & Movement Biomechanics', 3, 'intermediate', ['دینامیک معکوس مفاصل', 'الکترومیوگرافی سطحی', 'طراحی ارتز و پروتز'], ['Inverse Dynamics', 'Surface EMG', 'Prosthetics'], '\\mathbf{M}_{\\text{joint}} = I\\boldsymbol{\\alpha} - \\sum (\\mathbf{r}\\times\\mathbf{F})'],
  ['BME-420', 'bme-biomech', 'همودینامیک و مکانیک جریان خون', 'Hemodynamics', 3, 'advanced', ['رئولوژی غیرنیوتنی خون', 'جریان وومرسلی در شریان‌ها', 'مدل‌سازی استنت عروقی'], ['Womersley Flow', 'Blood Rheology', 'Arterial Stents'], '\\alpha = R\\sqrt{\\frac{\\omega}{\\nu}}'],

  // 31. robotics (4)
  ['ROB-301', 'robotics', 'مبانی رباتیک (سینماتیک و دینامیک)', 'Robotics: Kinematics & Dynamics', 3, 'intermediate', ['ماتریس دناویت-هارتنبرگ', 'ژاکوبین ربات', 'دینامیک بازوی رباتیک'], ['DH Parameters', 'Robot Jacobian', 'Manipulator Dynamics'], 'M(q)\\ddot{q} + C(q,\\dot{q})\\dot{q} + g(q) = \\tau'],
  ['ROB-310', 'robotics', 'سیستم‌های مکاترونیک و عملگرها', 'Mechatronics Systems', 3, 'intermediate', ['انکودرها و IMU', 'درایور موتورهای براشلس BLDC', 'مدل‌سازی سیستم‌های جفت‌شده'], ['Encoders & IMU', 'BLDC Motor Drives', 'Coupled Systems'], 'K_t i_a = J\\ddot{\\theta} + b\\dot{\\theta} + \\tau_L'],
  ['ROB-401', 'robotics', 'بینایی ماشین رباتیک و SLAM', 'Robot Vision & SLAM', 3, 'advanced', ['هندسه اپی‌پولار', 'فیلتر ذره‌ای و EKF-SLAM', 'ناوبری بصری'], ['Epipolar Geometry', 'EKF-SLAM', 'Visual Odometry'], '\\mathbf{x}' + '^T \\mathbf{F} \\mathbf{x} = 0'],
  ['ROB-412', 'robotics', 'برنامه‌ریزی حرکت و ربات‌های خودران', 'Motion Planning & Autonomy', 3, 'advanced', ['الگوریتم RRT* و PRM', 'کنترل پیش‌بین مدل MPC', 'جلوگیری از برخورد'], ['RRT* Path Planning', 'Model Predictive Control', 'Obstacle Avoidance'], '\\min_{u} \\sum_{k=0}^{N-1} (\\|x_k\\|_Q^2 + \\|u_k\\|_R^2)'],

  // 32. petroleum (3)
  ['PET-201', 'petroleum', 'خواص سنگ و سیالات مخزن', 'Reservoir Rock & Fluid Properties', 3, 'introductory', ['تخلخل و تراوایی دارسی', 'تراوایی نسبی و فشار مویینه', 'نمودار فاز هیدروکربنی'], ['Porosity & Permeability', 'Capillary Pressure', 'PVT Behavior'], 'q = -\\frac{k A}{\\mu} \\frac{dP}{dx}'],
  ['PET-305', 'petroleum', 'مهندسی مخازن نفت و گاز', 'Reservoir Engineering', 3, 'intermediate', ['موازنه مواد مخازن', 'چاه‌آزمایی و افت فشار', 'شبیه‌سازی جریان دوفازی'], ['Material Balance', 'Well Testing', 'Multiphase Simulation'], '\\frac{\\partial P}{\\partial t} = \\frac{k}{\\phi \\mu c_t} \\nabla^2 P'],
  ['PET-402', 'petroleum', 'ازدیاد برداشت از مخازن (EOR)', 'Enhanced Oil Recovery', 3, 'advanced', ['تزریق گاز امتزاجی CO2', 'روش‌های حرارتی بخار', 'تزریق پلیمر و سورفکتانت'], ['CO2 Miscible Flooding', 'Steam Injection', 'Chemical EOR'], 'N_{ca} = \\frac{\\mu v}{\\sigma}'],

  // 33. mining (3)
  ['MIN-201', 'mining', 'مکانیک سنگ مهندسی', 'Rock Mechanics', 3, 'intermediate', ['معیار شکست موهر-کلمب و هوک-براون', 'تنش‌های برجا در پوسته', 'طبقه‌بندی توده سنگ RMR'], ['Hoek-Brown Criterion', 'In-Situ Stress', 'RMR Classification'], '\\sigma_1 = \\sigma_3 + \\sigma_{ci}\\left(m_b\\frac{\\sigma_3}{\\sigma_{ci}} + s\\right)^a'],
  ['MIN-304', 'mining', 'طراحی معادن روباز و زیرزمینی', 'Mine Design & Excavation', 3, 'intermediate', ['الگوریتم لرش-گراسمن پیت نهایی', 'طراحی آتشباری', 'نگهداری تونل'], ['Lerchs-Grossmann Pit', 'Blasting Design', 'Tunnel Support'], '\\text{SR} = \\frac{\\text{Waste Volume}}{\\text{Ore Tonnage}}'],
  ['MIN-401', 'mining', 'کانی‌آرایی و فرآوری مواد معدنی', 'Mineral Processing', 3, 'advanced', ['خردایش و قانون باند', 'فلوتاسیون کفی', 'جدایش مغناطیسی'], ['Comminution Bond Law', 'Froth Flotation', 'Magnetic Separation'], 'W = 10 W_i \\left(\\frac{1}{\\sqrt{P_{80}}} - \\frac{1}{\\sqrt{F_{80}}}\\right)'],

  // 34. nuclear (3)
  ['NUC-301', 'nuclear', 'فیزیک هسته‌ای و تابش', 'Nuclear Physics & Radiation', 3, 'intermediate', ['واپاشی رادیواکتیو', 'سطح مقطع برهم‌کنش نوترون', 'آشکارسازی تابش'], ['Radioactive Decay', 'Neutron Cross-Section', 'Radiation Detection'], 'N(t) = N_0 e^{-\\lambda t}'],
  ['NUC-310', 'nuclear', 'مهندسی و فیزیک راکتور ۱', 'Nuclear Reactor Theory', 3, 'advanced', ['معادله پخش نوترون', 'ضریب تکثیر موثر k_eff', 'فرمول چهارعاملی و شش‌عاملی'], ['Neutron Diffusion', 'Criticality k_eff', 'Six-Factor Formula'], '-D\\nabla^2\\phi + \\Sigma_a\\phi = \\frac{1}{k_{\\text{eff}}}\\nu\\Sigma_f\\phi'],
  ['NUC-405', 'nuclear', 'ترмоهیدرولیک راکتورهای هسته‌ای', 'Reactor Thermal-Hydraulics', 3, 'advanced', ['شار حرارتی بحرانی CHF', 'جریان دوفازی جوشش', 'ایمنی هسته‌ای'], ['Critical Heat Flux', 'Two-Phase Boiling', 'Nuclear Safety'], '\\text{DNBR} = \\frac{q\'\'_{\\text{CHF}}}{q\'\'_{\\text{local}}}'],

  // 35. renewable (3)
  ['REN-201', 'renewable', 'سیستم‌های فتوولتائیک و انرژی خورشیدی', 'Solar & Photovoltaic Systems', 3, 'introductory', ['فیزیک سلول خورشیدی', 'ردیابی نقطه بیشینه توان MPPT', 'اینورترهای متصل به شبکه'], ['PV Cell Physics', 'MPPT Algorithms', 'Grid-Tie Inverters'], 'I = I_L - I_0\\left(e^{\\frac{q(V+IR_s)}{nkT}} - 1\\right)'],
  ['REN-302', 'renewable', 'انرژی بادی و طراحی توربین', 'Wind Energy Engineering', 3, 'intermediate', ['حد بتز در توربین باد', 'توزیع سرعت باد ویبول', 'ژنراتور القایی دوسوتغذیه DFIG'], ['Betz Limit', 'Weibull Wind Speed', 'DFIG Turbines'], 'P_{\\text{max}} = \\frac{16}{27} \\cdot \\frac{1}{2}\\rho A v^3'],
  ['REN-401', 'renewable', 'ریزگردها (Microgrids) و ذخیره انرژی', 'Microgrids & Energy Storage', 3, 'advanced', ['کنترل دروپ', 'باتری‌های لیتیوم-یون و BMS', 'مدیریت بهینه بار'], ['Droop Control', 'Lithium-Ion BMS', 'Load Dispatch'], '\\omega = \\omega_0 - m_p(P - P_0)'],

  // 36. arch (3)
  ['ARC-101', 'arch', 'ایستایی و سیستم‌های سازه‌ای در معماری', 'Structural Systems in Architecture', 3, 'introductory', ['خرپاهای فضاکار', 'ساختارهای پوسته و کابلی', 'توزیع بار ثقلی و جانبی'], ['Space Frames', 'Shells & Cables', 'Load Paths'], 'H = \\frac{w L^2}{8 f}'],
  ['ARC-205', 'arch', 'تنظیم شرایط محیطی و معماری پایدار', 'Environmental Control & Sustainability', 3, 'intermediate', ['نور روز و آسایش حرارتی', 'تبادل حرارت جداره ساختمان', 'شبیه‌سازی انرژی'], ['Daylighting', 'Thermal Comfort', 'Building Energy'], 'U_{\\text{wall}} = \\frac{1}{\\sum R_i}'],
  ['ARC-310', 'arch', 'آکوستیک معماری و طراحی سالن', 'Architectural Acoustics', 3, 'intermediate', ['زمان واخنش سابین', 'ضریب جذب صوت مصالح', 'عایق‌بندی صوتی'], ['Sabine Reverberation', 'Sound Absorption', 'Acoustic Isolation'], 'RT_{60} = \\frac{0.161 V}{\\sum S_i \\alpha_i}'],

  // 37. env (3)
  ['ENV-201', 'env', 'شیمی و میکروبیولوژی محیط‌زیست', 'Environmental Chemistry', 3, 'introductory', ['تقاضای اکسیژن بیوشیمیایی BOD', 'تعادل کربنات آب', 'سینتیک رشد باکتری مونود'], ['BOD / COD', 'Water Chemistry', 'Monod Kinetics'], '\\mu = \\mu_{\\max}\\frac{S}{K_s + S}'],
  ['ENV-304', 'env', 'طراحی تصفیه‌خانه آب و فاضلاب', 'Water & Wastewater Treatment', 3, 'intermediate', ['فرایند لجن فعال', 'ته‌نشینی و فیلتراسیون', 'اسمز معکوس RO'], ['Activated Sludge', 'Sedimentation', 'Reverse Osmosis'], '\\Pi = i M R T'],
  ['ENV-402', 'env', 'مدل‌سازی آلودگی هوا و انتشار', 'Air Pollution & Dispersion', 3, 'advanced', ['مدل دودکش گوسی', 'شیمی مه دود فتوشیمیایی', 'فیلترهای کیسه‌ای و اسکرابر'], ['Gaussian Plume', 'Photochemical Smog', 'Scrubbers'], 'C(x,y,z) = \\frac{Q}{2\\pi u \\sigma_y \\sigma_z}\\exp\\left(-\\frac{y^2}{2\\sigma_y^2}\\right)'],

  // 38. optics (3)
  ['OPT-301', 'optics', 'فیزیک و مهندسی لیزر', 'Laser Physics & Engineering', 3, 'intermediate', ['وارونگی جمعیت و کاواک اپتیکی', 'پایداری کاواک لیزر', 'مد-لاکینگ و Q-Switching'], ['Population Inversion', 'Optical Cavities', 'Q-Switching'], '0 \\le g_1 g_2 \\le 1'],
  ['OPT-305', 'optics', 'مخابرات نوری و فیبرهای اپتیکی', 'Optical Fiber Communications', 3, 'intermediate', ['عدد V و مودهای فیبر', 'پاشندگی رنگی و پلاریزاسیون', 'تقویت‌کننده اربیوم EDFA'], ['Fiber Modes', 'Chromatic Dispersion', 'EDFA Amplifiers'], 'V = \\frac{2\\pi a}{\\lambda}\\sqrt{n_1^2 - n_2^2}'],
  ['OPT-402', 'optics', 'فوتونیک مجتمع و اپتیک غیرخطی', 'Integrated Photonics', 3, 'advanced', ['تولید هارمونیک دوم SHG', 'موجبرهای سیلیکونی', 'مدولاتور ماخ-زندر'], ['Second Harmonic Gen.', 'Silicon Waveguides', 'Mach-Zehnder'], '\\Delta k = k_3 - 2k_1 = 0'],

  // 39. biotech (3)
  ['BIO-201', 'biotech', 'مهندسی بیوشیمی و آنزیمولوژی', 'Biochemical Engineering', 3, 'introductory', ['سینتیک آنزیمی میکائلیس-منتین', 'مهارکننده‌های رقابتی', 'تثبیت آنزیم'], ['Michaelis-Menten', 'Enzyme Inhibition', 'Immobilization'], 'v = \\frac{V_{\\max}[S]}{K_m + [S]}'],
  ['BIO-304', 'biotech', 'طراحی بیوراکتورها و تخمیر', 'Bioreactor Design', 3, 'intermediate', ['انتقال اکسیژن kLa', 'تخمیر پیوسته کموستات', 'استریل‌سازی حرارتی'], ['Oxygen Transfer kLa', 'Chemostat', 'Sterilization'], 'OTR = k_L a (C^* - C_L)'],
  ['BIO-401', 'biotech', 'بیوانفورماتیک و مهندسی ژنتیک', 'Bioinformatics & Genetic Eng.', 3, 'advanced', ['هم‌ترازی توالی نیدلمن-وانش', 'مدل مخفی مارکوف HMM', 'ویرایش ژنوم CRISPR'], ['Sequence Alignment', 'Hidden Markov Models', 'CRISPR Systems'], 'S_{ij} = \\max(S_{i-1,j-1}+s, S_{i-1,j}-d, S_{i,j-1}-d)'],

  // 40. stats (3)
  ['STAT-201', 'stats', 'احتمال مهندسی و متغیرهای تصادفی', 'Engineering Probability', 3, 'introductory', ['توزیع‌های گاوسی، پواسون و نمایی', 'قضیه بیز', 'تابع مولد گشتاور'], ['Gaussian & Poisson', 'Bayes Theorem', 'MGF'], 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}'],
  ['STAT-301', 'stats', 'آمار مهندسی و آزمون فرض', 'Engineering Statistics', 3, 'intermediate', ['تخمین ماکسیمم درست‌نمایی MLE', 'آزمون t و آنووا ANOVA', 'فاصله اطمینان'], ['Maximum Likelihood', 'Hypothesis Testing', 'ANOVA'], '\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_\\theta \\sum \\ln f(x_i|\\theta)'],
  ['STAT-401', 'stats', 'تحلیل رگرسیون و سری‌های زمانی', 'Regression & Time Series', 3, 'advanced', ['رگرسیون چندگانه حداقل مربعات', 'مدل‌های ARIMA', 'هم‌خطی چندگانه'], ['Multiple Regression', 'ARIMA Forecasting', 'Multicollinearity'], '\\hat{\\boldsymbol{\\beta}} = (X^T X)^{-1} X^T \\mathbf{y}'],

  // 41. numerical (3)
  ['NUM-201', 'numerical', 'محاسبات عددی', 'Numerical Methods', 3, 'introductory', ['ریشه‌یابی نیوتن-رافسون', 'درونیابی لاگرانژ و اسپلاین', 'انتگرال‌گیری گوس-لژاندر'], ['Newton-Raphson', 'Spline Interpolation', 'Gauss Quadrature'], 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}'],
  ['NUM-305', 'numerical', 'روش اجزای محدود (FEM)', 'Finite Element Method', 3, 'advanced', ['فرمول‌بندی ضعیف گالرکین', 'توابع شکل ایزوپارامتریک', 'تحلیل المان خرپا و تیر'], ['Galerkin Weak Form', 'Isoparametric Elements', 'Stiffness Assembly'], '\\int_\\Omega B^T D B\\,d\\Omega \\cdot \\mathbf{u} = \\mathbf{f}'],
  ['NUM-401', 'numerical', 'حل عددی معادلات PDE', 'Numerical PDEs', 3, 'advanced', ['روش‌های تفاضل محدود', 'پایداری فون‌نویمان و شرط CFL', 'روش کرانک-نیکلسون'], ['Finite Difference', 'CFL Stability', 'Crank-Nicolson'], 'C = \\frac{u\\,\\Delta t}{\\Delta x} \\le 1'],

  // 42. data-sci (3)
  ['DS-301', 'data-sci', 'پایگاه داده‌ها و SQL پیشرفته', 'Database Systems', 3, 'introductory', ['طراحی ER و نرمال‌سازی BCNF', 'شاخص‌گذاری B+ Tree', 'تراکنش‌های ACID'], ['Normalization BCNF', 'B+ Tree Indexing', 'ACID Transactions'], '\\sigma_{\\text{cond}}(R \\bowtie S)'],
  ['DS-310', 'data-sci', 'کلان‌داده و پردازش توزیع‌شده Spark', 'Big Data & Spark', 3, 'intermediate', ['مدل MapReduce', 'جریان داده Kafka', 'ذخیره‌سازی ستونی Parquet'], ['MapReduce', 'Stream Processing', 'Columnar Storage'], '\\text{Skew} = \\max(T_i) / \\text{mean}(T_i)'],
  ['DS-405', 'data-sci', 'تحلیل شبکه‌های اجتماعی و گراف', 'Graph & Network Analytics', 3, 'advanced', ['الگوریتم PageRank', 'تشخیص جوامع', 'شبکه‌های عصبی گرافی GNN'], ['PageRank', 'Community Detection', 'Graph Neural Nets'], 'PR(u) = \\frac{1-d}{N} + d\\sum_{v\\in B_u}\\frac{PR(v)}{L(v)}'],

  // 43. embedded (3)
  ['EMB-301', 'embedded', 'میکروکنترلرها و معماری ARM', 'Microcontrollers & ARM', 3, 'intermediate', ['ثبات‌های وقفه و تایمر', 'باس‌های SPI، I2C و UART', 'کنترل PWM'], ['Interrupts & Timers', 'SPI/I2C/UART', 'PWM Control'], 'f_{\\text{PWM}} = \\frac{f_{\\text{clk}}}{(\\text{PSC}+1)(\\text{ARR}+1)}'],
  ['EMB-310', 'embedded', 'طراحی دیجیتال با VHDL و FPGA', 'FPGA & HDL Design', 3, 'intermediate', ['کدنویسی همزمان VHDL/Verilog', 'تحلیل زمان‌بندی Setup/Hold', 'پیاده‌سازی پردازنده روی FPGA'], ['Verilog/VHDL', 'Timing Closure', 'FPGA Synthesis'], 'T_{\\text{clk}} \\ge T_{\\text{co}} + T_{\\text{comb}} + T_{\\text{setup}}'],
  ['EMB-402', 'embedded', 'سیستم‌های عامل بلادرنگ (RTOS)', 'Real-Time Operating Systems', 3, 'advanced', ['زمان‌بندی Rate Monotonic', 'وارونگی اولویت و پروتکل وراثت', 'کرنل FreeRTOS'], ['Rate Monotonic', 'Priority Inheritance', 'FreeRTOS'], '\\sum_{i=1}^n \\frac{C_i}{T_i} \\le n(2^{1/n} - 1)'],

  // 44. marine (3)
  ['MAR-201', 'marine', 'استاتیک و پایداری شناورها', 'Ship Hydrostatics & Stability', 3, 'introductory', ['ارتفاع متاسنتریک GM', 'منحنی پایداری GZ', 'اثر سطح آزاد'], ['Metacentric Height', 'GZ Curve', 'Free Surface Effect'], 'GM = KB + BM - KG'],
  ['MAR-304', 'marine', 'هیدرودینامیک و مقاومت کشتی', 'Marine Hydrodynamics', 3, 'intermediate', ['مقاومت موج‌سازی و اصطکاکی', 'قانون تشابه فرود', 'طراحی پروانه کشتی'], ['Wave Resistance', 'Froude Scaling', 'Propeller Design'], 'Fn = \\frac{V}{\\sqrt{g L}}'],
  ['MAR-401', 'marine', 'مهندسی سکوهای فراساحلی', 'Offshore Structures', 3, 'advanced', ['تئوری موج خطی ایری', 'معادله موریسون برای بار موج', 'تحلیل خستگی سکوهای دریایی'], ['Airy Wave Theory', 'Morison Equation', 'Offshore Fatigue'], 'F = \\rho C_M V \\dot{u} + \\frac{1}{2}\\rho C_D A u|u|'],

  // 45. eng-econ (3)
  ['ECON-201', 'eng-econ', 'اقتصاد مهندسی و ارزیابی پروژه‌ها', 'Engineering Economics', 3, 'introductory', ['ارزش خالص فعلی NPV', 'نرخ بازده داخلی IRR', 'تحلیل استهلاک و تورم'], ['Net Present Value', 'Internal Rate of Return', 'Depreciation'], 'NPV = \\sum_{t=0}^n \\frac{CF_t}{(1+i)^t}'],
  ['ECON-302', 'eng-econ', 'مدیریت پروژه مهندسی (PMBOK)', 'Engineering Project Mgmt', 3, 'intermediate', ['روش مسیر بحرانی CPM و PERT', 'مدیریت ارزش کسب‌شده EVM', 'تراز منابع'], ['CPM & PERT', 'Earned Value Mgmt', 'Resource Leveling'], 'CPI = \\frac{EV}{AC}, \\quad SPI = \\frac{EV}{PV}'],
  ['ECON-405', 'eng-econ', 'تحلیل تصمیم‌گیری و ریسک مهندسی', 'Decision & Risk Analysis', 3, 'advanced', ['درخت تصمیم و ارزش اطلاعات', 'شبیه‌سازی مونت‌کارلو ریسک', 'تئوری بازی‌ها در مناقصات'], ['Decision Trees', 'Monte Carlo Risk', 'Game Theory'], 'EVPI = E[\\max_a U(a,\\theta)] - \\max_a E[U(a,\\theta)]'],
];

// Add 18 supplementary advanced electives across core fields so total reaches 175+ courses cleanly
const SUPPLEMENTARY_ELECTIVES: SeedTuple[] = [
  ['MATH-302', 'math', 'جبر خطی عددی و کاربردی', 'Applied Linear Algebra', 3, 'intermediate', ['تجزیه SVD و مقادیر ویژه', 'فضاهای هیلبرت', 'ماتریس‌های متعامد'], ['SVD & Eigenvalues', 'Hilbert Spaces', 'Orthogonal Matrices'], 'A = U \\Sigma V^T'],
  ['PHYS-305', 'physics', 'فیزیک حالت جامد و نیمه‌رساناها', 'Solid State & Semiconductors', 3, 'advanced', ['شبکه کریستالی و فضای وارون', 'مدل کرونیگ-پنی', 'پیوند p-n'], ['Reciprocal Lattice', 'Kronig-Penney', 'p-n Junction'], 'n_i^2 = N_c N_v e^{-E_g / k_B T}'],
  ['EE-450', 'ee-power', 'الکترونیک قدرت و مبدل‌ها', 'Power Electronics', 3, 'advanced', ['مبدل‌های Buck و Boost', 'اینورتر PWM سه‌فاز', 'یکسوکننده‌های کنترل‌شده'], ['Buck/Boost Converters', 'Three-Phase Inverters', 'Controlled Rectifiers'], 'V_o = D \\cdot V_{\\text{in}}'],
  ['EE-438', 'ee-telecom', 'آنتن و انتشار امواج', 'Antennas & Wave Propagation', 3, 'advanced', ['آرایه‌های فازی', 'دوقطبی نیم‌موج و الگوی تشعشع', 'معادله فریس'], ['Phased Arrays', 'Radiation Pattern', 'Friis Equation'], 'P_r = P_t G_t G_r \\left(\\frac{\\lambda}{4\\pi R}\\right)^2'],
  ['CS-415', 'cs-software', 'طراحی کامپایلرها', 'Compiler Design', 3, 'advanced', ['تحلیل لغوی و نحوی LL/LR', 'تولید کد میانی IR', 'بهینه‌سازی ثبات‌ها'], ['Lexical & LR Parsing', 'IR Generation', 'Register Allocation'], 'LALR(1) \\subset LR(1)'],
  ['AI-420', 'cs-ai', 'یادگیری تقویتی عمیق', 'Deep Reinforcement Learning', 3, 'advanced', ['معادله بلمن', 'الگوریتم Q-Learning و PPO', 'مدل‌سازی MDP'], ['Bellman Equation', 'Q-Learning & PPO', 'MDP'], 'Q(s,a) = r + \\gamma \\max_{a\'} Q(s\',a\')'],
  ['ME-430', 'me-thermo', 'موتورهای احتراق داخلی و توربوماشین', 'IC Engines & Turbomachinery', 3, 'advanced', ['چرخه‌های دیزل و دوگانه', 'مثلث‌های سرعت توربین', 'احتراق و آلایندگی'], ['Diesel Cycles', 'Velocity Triangles', 'Combustion'], '\\Delta h_0 = U(V_{\\theta 2} - V_{\\theta 1})'],
  ['CE-450', 'ce-structures', 'طراحی پل‌های مدرن', 'Bridge Engineering', 3, 'advanced', ['بارگذاری متحرک AASHTO', 'پل‌های کابلی و قوسی', 'نشیمنگاه‌های الاستومری'], ['AASHTO Live Loads', 'Cable-Stayed Bridges', 'Elastomeric Bearings'], 'M_{\\max} = \\frac{P L}{4}'],
  ['CHE-430', 'chem-process', 'مهندسی بیوتکنولوژی صنعتی', 'Bioprocess Separation', 3, 'advanced', ['کروماتوگرافی ستونی', 'خشک‌کردن انجمادی', 'تخلیص پروتئین'], ['Chromatography', 'Freeze Drying', 'Protein Purification'], 'N = 16 \\left(\\frac{t_R}{W}\\right)^2'],
  ['AE-440', 'aerospace-aero', 'طراحی سازه‌های هوافضایی', 'Aerospace Structures', 3, 'advanced', ['جدارنازک و جریان برشی', 'صفحات کامپوزیتی بال', 'طراحی شکست ایمن'], ['Shear Flow', 'Composite Wing Box', 'Fail-Safe Design'], 'q = \\frac{V_y}{I_x} \\int t y\\,ds'],
  ['IE-435', 'ie-or', 'تحلیل قابلیت اطمینان سیستم‌ها', 'Reliability Engineering', 3, 'advanced', ['تابع خطر وایبول', 'سیستم‌های سری و موازی', 'درخت خطا FTA'], ['Weibull Hazard', 'Series/Parallel', 'Fault Tree Analysis'], 'R(t) = \\exp\\left(-\\int_0^t \\lambda(\\tau)d\\tau\\right)'],
  ['ROB-425', 'robotics', 'ربات‌های پرنده و کوادروتورها', 'Aerial Robotics & UAVs', 3, 'advanced', ['دینامیک کوادروتور', 'کنترل هندسی روی SO(3)', 'برنامه‌ریزی مسیر با حداقل جرق'], ['Quadrotor Dynamics', 'SO(3) Control', 'Minimum-Snap'], 'T = k_T \\sum_{i=1}^4 \\omega_i^2'],
  ['BME-430', 'bme-bioelectric', 'هوش مصنوعی در پزشکی و تشخیص', 'Medical AI & Diagnostics', 3, 'advanced', ['تقسیم‌بندی تصویر U-Net', 'پایش بیمار در ICU', 'مدل‌های بقا'], ['U-Net Segmentation', 'Clinical Monitoring', 'Survival Models'], '\\text{Dice} = \\frac{2|X \\cap Y|}{|X| + |Y|}'],
  ['DS-420', 'data-sci', 'بصری‌سازی علمی و داده', 'Scientific Visualization', 3, 'intermediate', ['الگوریتم Marching Cubes', 'گراف‌های مقیاس بزرگ', 'کدگذاری ادراکی'], ['Marching Cubes', 'Large Graph Layouts', 'Perceptual Encoding'], 'I = I_a k_a + I_d k_d (\\mathbf{N}\\cdot\\mathbf{L})'],
  ['EMB-420', 'embedded', 'اینترنت اشیا صنعتی (IIoT)', 'Industrial IoT Architecture', 3, 'intermediate', ['پروتکل‌های MQTT و CoAP', 'فناوری LoRaWAN', 'پردازش لبه Edge AI'], ['MQTT & CoAP', 'LoRaWAN', 'Edge AI'], '\\text{LinkBudget} = P_{tx} + G - L_{\\text{path}}'],
  ['NET-430', 'cs-networks', 'بلاکچین و دفترکل توزیع‌شده', 'Blockchain & Distributed Ledgers', 3, 'advanced', ['درخت مرکل', 'قراردادهای هوشمند', 'اجماع BFT و PoS'], ['Merkle Trees', 'Smart Contracts', 'BFT Consensus'], 'H(x) = \\text{SHA256}(\\text{SHA256}(x))'],
  ['MAT-425', 'materials-met', 'کامپوزیت‌ها و سوپرآلیاژهای هوافضا', 'Superalloys & Ceramics', 3, 'advanced', ['خزش در دمای بالا', 'سوپرآلیاژهای پایه نیکل', 'پوشش‌های سد حرارتی TBC'], ['High-Temp Creep', 'Nickel Superalloys', 'Thermal Barriers'], '\\dot{\\varepsilon}_s = A \\sigma^n e^{-Q_c / RT}'],
  ['NUM-415', 'numerical', 'حل عددی بهینه‌سازی و ماتریس‌های تنک', 'Sparse Linear Solvers', 3, 'advanced', ['روش گرادیان مزدوج CG', 'پیش‌شرطی‌سازها', 'تجزیه Cholesky تنک'], ['Conjugate Gradient', 'Preconditioners', 'Sparse Cholesky'], 'x_{k+1} = x_k + \\alpha_k p_k'],
];

export const ENGINEERING_COURSES: CourseItem[] = [...COURSE_SEEDS, ...SUPPLEMENTARY_ELECTIVES].map(
  ([code, fieldId, titleFa, titleEn, credits, difficulty, topicsFa, topicsEn, keyFormula], idx) => ({
    id: `course-${idx + 1}`,
    code,
    fieldId,
    titleFa,
    titleEn,
    credits,
    difficulty,
    topicsFa,
    topicsEn,
    keyFormula,
  })
);

export const ENGINEERING_ARTICLES: EngineeringArticle[] = [
  {
    id: 'art-laplace-intuition',
    titleFa: 'درک شهودی تبدیل لاپلاس: چرا مهندسان از حوزه زمان به صفحه s کوچ می‌کنند؟',
    titleEn: 'Intuitive Laplace Transforms: Why Engineers Leave the Time Domain',
    fieldFa: 'مهندسی برق و کنترل',
    fieldEn: 'Electrical & Control',
    authorFa: 'دکتر مریم شریعتی',
    authorEn: 'Dr. Maryam Shariati',
    readMinutes: 6,
    date: '۱۴۰۴/۰۸/۱۰',
    image: '/src/assets/images/course_electrical_circuits_1795017176720.jpg',
    excerptFa: 'تبدیل معادلات دیفرانسیل پیچیده مدارهای RLC به جبر ساده چندجمله‌ای و خواندن پایداری سیستم مستقیماً از روی مکان قطب‌ها.',
    excerptEn: 'Turning complex RLC differential equations into crisp polynomial algebra and reading system stability straight from pole locations.',
    keyFormula: 'F(s) = \\int_0^{\\infty} f(t) e^{-(\\sigma + j\\omega)t}\\,dt',
    contentFa: [
      'در تحلیل مدارهای الکتریکی و سیستم‌های مکانیکی، قانون‌های بنیادی طبیعت (مانند قانون فارادی یا قانون دوم نیوتن) به زبان مشتق و انتگرال نوشته می‌شوند. حل مستقیم معادلات دیفرانسیل مرتبه بالا در حوزه زمان، به‌ویژه هنگام ورود شرایط اولیه و ورودی‌های پله یا ضربه، زمان‌بر و خطاپذیر است.',
      'تبدیل لاپلاس با ضرب کردن سیگنال در هسته نمایی مختلط e^{-st} دو کار جادویی انجام می‌دهد: نخست، عمل مشتق‌گیری را به ضرب در متغیر جبری s تبدیل می‌کند؛ دوم، با افزودن بخش حقیقی σ به فرکانس موهومی jω، امکان بررسی پاسخ گذرا و سیستم‌های ناپایدار را فراهم می‌سازد.',
      'در طراحی مهندسی، محل ریشه‌های مخرج تابع تبدیل (قطب‌ها) نقشه رفتار سیستم است: قطب‌های سمت چپ محور موهومی به معنای میرایی و پایداری، و فاصله آن‌ها از محور عمودی تعیین‌کننده سرعت همگرایی سیستم است.',
    ],
    contentEn: [
      'Physical laws governing circuits and mechanical assemblies naturally take the form of differential equations. Solving higher-order coupled ODEs directly in the time domain quickly becomes unwieldy when step inputs or initial stored energy are present.',
      'By projecting the time-domain signal onto decaying complex exponentials e^{-st}, the Laplace transform converts differentiation into algebraic multiplication by s while preserving transient initial conditions.',
      'In engineering practice, the pole-zero map acts as an X-ray of system dynamics: poles in the left-half s-plane guarantee stability, while their distance from the imaginary axis dictates settling speed.',
    ],
  },
  {
    id: 'art-entropy-turbines',
    titleFa: 'آنتروپی و بازده توربین‌ها: از قانون دوم ترمودینامیک تا طراحی موتورهای جت',
    titleEn: 'Entropy & Turbine Efficiency: From the 2nd Law to Jet Propulsion',
    fieldFa: 'مهندسی مکانیک و هوافضا',
    fieldEn: 'Mechanical & Aerospace',
    authorFa: 'مهندس سهراب نادری',
    authorEn: 'Sohrab Naderi, MSc',
    readMinutes: 7,
    date: '۱۴۰۴/۰۸/۰۲',
    image: '/src/assets/images/course_thermodynamics_mech_1795017177354.jpg',
    excerptFa: 'چرا حتی بهترین توربین‌های صنعتی نمی‌توانند تمام گرمای سوخت را به کار مکانیکی تبدیل کنند و نقش بازده آیزنتروپیک چیست؟',
    excerptEn: 'Why real gas turbines cannot convert 100% of fuel enthalpy into shaft work and how isentropic efficiency guides blade design.',
    keyFormula: '\\eta_T = \\frac{h_1 - h_2}{h_1 - h_{2s}}',
    contentFa: [
      'قانون اول ترمودینامیک تنها پایستگی انرژی را تضمین می‌کند، اما جهت فرآیندها و کیفیت انرژی را مشخص نمی‌کند. در طراحی توربین‌های گازی و بخار، اصطکاک سیال روی پره‌ها و شوک‌های موضعی باعث تولید آنتروپی می‌شود.',
      'برای سنجش عملکرد واقعی یک توربین، مهندسان حالت خروجی واقعی (h_2) را با خروجی ایده‌آل در فرآیند برگشت‌پذیر و بی‌دررو یا آیزنتروپیک (h_{2s}) مقایسه می‌کنند. هرچه خطوط جریان روی پره روان‌تر و جدایش لایه مرزی کمتر باشد، بازده آیزنتروپیک به ۱ نزدیک‌تر می‌شود.',
    ],
    contentEn: [
      'The First Law tracks energy conservation, whereas the Second Law dictates directionality and irreversible losses. Inside axial turbines, boundary-layer separation and tip leakage generate entropy.',
      'Engineers benchmark real blade rows by comparing actual enthalpy drop (h_1 - h_2) against an ideal isentropic expansion (h_1 - h_{2s}), using CFD streamlines to suppress wake losses.',
    ],
  },
  {
    id: 'art-graph-dp',
    titleFa: 'یکپارچه‌سازی برنامه‌ریزی پویا و الگوریتم‌های گراف در مسائل مهندسی مقیاس بزرگ',
    titleEn: 'Bridging Dynamic Programming & Graph Algorithms at Scale',
    fieldFa: 'مهندسی کامپیوتر و الگوریتم',
    fieldEn: 'Computer Science',
    authorFa: 'دکتر الناز بهرامی',
    authorEn: 'Dr. Elnaz Bahrami',
    readMinutes: 5,
    date: '۱۴۰۴/۰۷/۲۱',
    image: '/src/assets/images/course_algorithms_cs_1795017178932.jpg',
    excerptFa: 'نگاهی عمیق به هم‌ارزی کوتاه‌ترین مسیر در گراف‌های بدون دور جهت‌دار (DAG) و جدول‌های برنامه‌ریزی پویا.',
    excerptEn: 'Exploring the equivalence between shortest paths on Directed Acyclic Graphs (DAGs) and dynamic programming state tables.',
    keyFormula: 'd(v) = \\min_{(u,v)\\in E} \\{d(u) + w(u,v)\\}',
    contentFa: [
      'بسیاری از دانشجویان برنامه‌ریزی پویا و نظریه گراف را دو فصل جداگانه می‌بینند، در حالی که هر مسئله برنامه‌ریزی پویا در واقع یافتن کوتاه‌ترین یا بلندترین مسیر در یک گراف جهت‌دار بدون دور (DAG) از وضعیت‌هاست.',
      'وقتی ترتیب توپولوژیک گره‌ها را رعایت کنیم، زیرمسئله‌ها دقیقاً در زمانی محاسبه می‌شوند که تمام پیش‌نیازهای آن‌ها قبلاً حل شده است؛ همین دیدگاه در طراحی کامپایلرها و شبکه‌های عصبی محاسباتی نیز به کار می‌رود.',
    ],
    contentEn: [
      'Every dynamic programming recurrence corresponds directly to finding an optimal path over a Directed Acyclic Graph (DAG) of subproblem states.',
      'Evaluating states in topological order guarantees that every prerequisite subproblem is resolved prior to transition, forming the backbone of modern computational graphs.',
    ],
  },
];
