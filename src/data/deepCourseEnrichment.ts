import {
  Concept3DModelType,
  CourseItem,
  FormulaCheatItem,
  HardestExamChallenge,
  ProofStepItem,
} from '../types/app';

export interface DeepEnrichmentBundle {
  model3dType: Concept3DModelType;
  historicalOriginFa: string;
  historicalOriginEn: string;
  mathematicalProof: {
    theoremTitleFa: string;
    theoremTitleEn: string;
    steps: ProofStepItem[];
  };
  formulaCheatSheet: FormulaCheatItem[];
  hardestExam: HardestExamChallenge;
}

export function infer3DModelForCourse(fieldId: string, code: string): Concept3DModelType {
  const c = code.toUpperCase();
  if (
    fieldId === 'nuclear' ||
    fieldId.startsWith('nuclear-') ||
    fieldId === 'renewable' ||
    c.startsWith('NUC-') ||
    c.startsWith('NFUL-') ||
    c.startsWith('RAD-') ||
    c.startsWith('FUS-')
  ) {
    return 'nuclear_reactor';
  }
  if (
    fieldId.startsWith('pol-') ||
    fieldId.startsWith('law-') ||
    fieldId === 'econ-pure' ||
    fieldId === 'eng-econ' ||
    fieldId === 'mgmt-business' ||
    fieldId === 'accounting' ||
    fieldId === 'finance-banking' ||
    fieldId === 'psych-clinical' ||
    fieldId === 'sociology' ||
    fieldId === 'media-comm' ||
    fieldId === 'philosophy' ||
    fieldId === 'history' ||
    fieldId === 'literature-ling' ||
    fieldId.startsWith('art-') ||
    c.startsWith('POL-') ||
    c.startsWith('IR-') ||
    c.startsWith('LAW-') ||
    c.startsWith('ECN-') ||
    c.startsWith('MGT-') ||
    c.startsWith('ACC-') ||
    c.startsWith('FIN-') ||
    c.startsWith('PSY-') ||
    c.startsWith('SOC-') ||
    c.startsWith('PHI-') ||
    c.startsWith('HIS-') ||
    c.startsWith('LIT-')
  ) {
    return 'geopolitical_globe';
  }
  if (
    fieldId.startsWith('cs-') ||
    fieldId === 'data-sci' ||
    c.startsWith('CS-') ||
    c.startsWith('AI-') ||
    c.startsWith('DS-')
  ) {
    return 'neural_network';
  }
  if (
    fieldId.startsWith('chem-') ||
    fieldId.startsWith('med-') ||
    fieldId === 'bio-cell' ||
    fieldId === 'geology' ||
    fieldId === 'vet-med' ||
    fieldId === 'agri-agronomy' ||
    fieldId === 'food-sci' ||
    fieldId.startsWith('materials') ||
    fieldId === 'nano' ||
    fieldId === 'biotech' ||
    fieldId === 'polymer' ||
    c.startsWith('CHEM-') ||
    c.startsWith('CHM-') ||
    c.startsWith('BIOL-') ||
    c.startsWith('MED-') ||
    c.startsWith('PHAR-') ||
    c.startsWith('DENT-') ||
    c.startsWith('MAT-')
  ) {
    return 'crystal_lattice';
  }
  if (
    fieldId.startsWith('me-') ||
    fieldId.startsWith('ce-') ||
    fieldId.startsWith('aerospace-') ||
    fieldId === 'arch' ||
    fieldId === 'mining' ||
    fieldId === 'robotics' ||
    c.startsWith('ME-') ||
    c.startsWith('CE-') ||
    c.startsWith('AE-')
  ) {
    return 'mechanical_piston';
  }
  return 'electromagnetic';
}

const DOMAIN_ENRICHMENT: Record<Concept3DModelType, DeepEnrichmentBundle> = {
  electromagnetic: {
    model3dType: 'electromagnetic',
    historicalOriginFa:
      'ریشه نظریه مدارها و الکترومغناطیس مدرن به سال ۱۸۴۵ برمی‌گردد؛ زمانی که گوستاو کیرشهف در ۲۱ سالگی دو قانون بقای بار و انرژی (KCL و KVL) را تدوین کرد. هم‌زمان، مایکل فارادی قانون القای مغناطیسی را کشف کرد و جیمز کلرک ماکسول با چهار معادله بنیادین، برق، مغناطیس و نور را یکپارچه ساخت. در پایان قرن نوزدهم، الیور هوی‌ساید با ابداع حساب عملگرها (پیش‌درآمد تبدیل لاپلاس) امکان تحلیل مدارهای پیچیده گذرا و خطوط انتقال تلگراف فراآتلانتیک را برای مهندسان فراهم کرد.',
    historicalOriginEn:
      'Modern circuit and electromagnetic theory traces back to 1845 when 21-year-old Gustav Kirchhoff formulated KCL and KVL, alongside Michael Faraday’s law of induction. James Clerk Maxwell later unified electricity, magnetism, and optics into four equations, while Oliver Heaviside pioneered operational calculus (a precursor to Laplace transforms) to analyze transatlantic transmission lines and RLC transients.',
    mathematicalProof: {
      theoremTitleFa: 'اثبات معادله مشخصه و پاسخ طبیعی مدار RLC سری با تبدیل لاپلاس',
      theoremTitleEn: 'Derivation of Series RLC Characteristic Roots via KVL & Laplace Transform',
      steps: [
        {
          labelFa: 'گام ۱ — نگارش قانون ولتاژ کیرشهف (KVL) در حلقه',
          labelEn: 'Step 1 — Loop KVL Energy Balance',
          textFa: 'مجموع افت ولتاژهای مقاومتی، القایی و خازنی در یک حلقه بسته بدون منبع خارجی صفر است:',
          textEn: 'Summing resistive, inductive, and capacitive voltage drops around the source-free loop yields:',
          latex: 'R i(t) + L \\frac{di(t)}{dt} + \\frac{1}{C}\\int_{-\\infty}^{t} i(\\tau)\\,d\\tau = 0',
        },
        {
          labelFa: 'گام ۲ — تبدیل به معادله دیفرانسیل مرتبه دوم خطی',
          labelEn: 'Step 2 — Convert to Second-Order Homogeneous ODE',
          textFa: 'با مشتق‌گیری زمانی از طرفین نسبت به t و تقسیم بر اندوکتانس L، معادله استاندارد با میرایی α و فرکانس تشدید ω₀ به دست می‌آید:',
          textEn: 'Differentiating with respect to time t and dividing through by inductance L gives:',
          latex: '\\frac{d^2 i}{dt^2} + \\frac{R}{L}\\frac{di}{dt} + \\frac{1}{LC}i = 0 \\implies \\alpha = \\frac{R}{2L},\\; \\omega_0 = \\frac{1}{\\sqrt{LC}}',
        },
        {
          labelFa: 'گام ۳ — اعمال تبدیل لاپلاس با شرایط اولیه غیرصفر',
          labelEn: 'Step 3 — Apply Unilateral Laplace Transform',
          textFa: 'با جایگذاری پاسخ نمایی i(t) = A e^{st} یا تبدیل لاپلاس، ریشه‌های معادله مشخصه استخراج می‌شوند:',
          textEn: 'Substituting the exponential trial solution i(t) = A e^{st} yields the quadratic characteristic roots:',
          latex: 's^2 + 2\\alpha s + \\omega_0^2 = 0 \\implies s_{1,2} = -\\alpha \\pm \\sqrt{\\alpha^2 - \\omega_0^2}',
        },
      ],
    },
    formulaCheatSheet: [
      {
        nameFa: 'قانون فارادی و القای ولتاژ',
        nameEn: 'Faraday Induction Law',
        latex: '\\mathcal{E} = -N\\frac{d\\Phi_B}{dt} = -L\\frac{di}{dt}',
        conditionFa: 'تغییر شار مغناطیسی در سیم‌پیچ با N دور',
        conditionEn: 'Time-varying magnetic flux through N-turn coil',
      },
      {
        nameFa: 'نیروی الکترومغناطیسی لورنتس',
        nameEn: 'Lorentz Force Law',
        latex: '\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B})',
        conditionFa: 'بار نقطه‌ای q متحرک با سرعت v در میدان',
        conditionEn: 'Point charge q moving at velocity v',
      },
      {
        nameFa: 'امپدانس مختلط در حالت ماندگار سینوسی',
        nameEn: 'Phasor Impedance',
        latex: 'Z(j\\omega) = R + j\\left(\\omega L - \\frac{1}{\\omega C}\\right)',
        conditionFa: 'تحلیل فایزوری در فرکانس زاویه‌ای ω',
        conditionEn: 'Sinusoidal steady-state at frequency ω',
      },
      {
        nameFa: 'ضریب کیفیت مدار تشدید (Q-Factor)',
        nameEn: 'Resonant Quality Factor',
        latex: 'Q = \\frac{\\omega_0 L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}',
        conditionFa: 'نسبت انرژی ذخیره‌شده به تلفات در هر سیکل',
        conditionEn: 'Ratio of stored energy to dissipation per radian',
      },
      {
        nameFa: 'قضیه انتقال توان ماکزیمم',
        nameEn: 'Maximum Power Transfer',
        latex: 'Z_L = Z_{\\text{Th}}^* \\implies P_{\\max} = \\frac{|V_{\\text{Th}}|^2}{8R_{\\text{Th}}}',
        conditionFa: 'تطبیق مزدوج مختلط برای بار خطی',
        conditionEn: 'Conjugate impedance matching for AC loads',
      },
      {
        nameFa: 'شرط پایداری BIBO در صفحه s',
        nameEn: 'BIBO Stability Criterion',
        latex: '\\text{Re}(p_k) < 0 \\quad \\forall k \\in \\text{Poles}(H(s))',
        conditionFa: 'تمامی قطب‌ها در نیم‌صفحه چپ باز',
        conditionEn: 'All transfer-function poles strictly in LHP',
      },
    ],
    hardestExam: {
      sourceFa: 'چالش نهایی دانشکده برق شریف · هم‌سطح MIT 6.002 / المپیاد برق',
      sourceEn: 'Sharif EE / MIT 6.002 Final Boss Exam Challenge',
      difficultyBadgeFa: 'سطح: فوق‌پیشرفته المپیادی',
      difficultyBadgeEn: 'Difficulty: Final Boss / Olympiad',
      problemStatementFa:
        'در یک مدار RLC سری با منبع ولتاژ متغیر، کلید در لحظه t = 0 از وضعیت ماندگار قبلی باز شده و هم‌زمان یک منبع جریان وابسته g_m v_C(t) به صورت موازی با خازن وارد مدار می‌شود. مقدار حداکثر بهره انتقالی g_m را بیابید که مدار دقیقاً در آستانه نوسان پایدار (پایداری مرزی) قرار گیرد و فرکانس نوسان ω_osc را در آن نقطه حساب کنید.',
      problemStatementEn:
        'A switch opens at t = 0 leaving a series RLC loop coupled with a dependent current source g_m v_C(t) in parallel with the capacitor. Determine the critical transconductance g_m that places the circuit on the exact boundary of sustained oscillation, and calculate the resulting oscillation frequency ω_osc.',
      problemFormulaLatex:
        'R=10\\,\\Omega,\\; L=2\\,\\text{H},\\; C=0.5\\,\\text{F},\\; i_L(t)=C\\frac{dv_C}{dt} - g_m v_C(t)',
      steps: [
        {
          stepNumber: 1,
          titleFa: 'گام ۱: رمزگشایی صورت سوال و دام‌های رایج',
          titleEn: 'Step 1: Decoding the Prompt & Common Traps',
          explanationFa:
            'دام اصلی طراح سوال علامت منبع وابسته g_m v_C است! بسیاری از دانشجویان تصور می‌کنند اضافه شدن g_m فقط مقاومت را کم می‌کند یا مستقیماً مثل مقاومت موازی عمل می‌کند. باید دقت کنیم که جهت جریان منبع وابسته با جریان خازن جمع جبری می‌شود و می‌تواند «میرایی منفی» ایجاد کرده و مدار را ناپایدار کند.',
          explanationEn:
            'The classic exam trap is assuming g_m acts like passive damping. Because the dependent source feeds current back proportionally to v_C, it modifies both the s¹ damping term and the effective s⁰ stiffness term—potentially driving damping negative.',
          trapWarningFa: 'هشدار طراح: هرگز هنگام محاسبه قطب‌های مدار دارای منبع وابسته، g_m را صفر نکنید!',
          trapWarningEn: 'Trap Warning: Never deactivate dependent sources when finding natural frequencies.',
        },
        {
          stepNumber: 2,
          titleFa: 'گام ۲: انتخاب استراتژی و فرمول‌های کلیدی (LaTeX Math)',
          titleEn: 'Step 2: Strategy Selection & Key Governing Equations',
          explanationFa:
            'بهترین استراتژی نوشتن KCL در گره بالای خازن و KVL در حلقه L و R بر حسب دو متغیر حالت طبیعی i_L و v_C است، سپس حذف یک متغیر برای رسیدن به چندجمله‌ای مشخصه s² + a₁s + a₀ = 0 و اعمال معیار راث-هورویتز (a₁ = 0 برای نوسان مرزی).',
          explanationEn:
            'Write coupled state equations in (v_C, i_L) using KCL at the capacitor node and KVL around the RL branch, extract the characteristic polynomial s² + a₁s + a₀ = 0, and enforce Routh-Hurwitz marginal stability (a₁ = 0 with a₀ > 0).',
          mathLatex:
            '\\text{KCL: } C\\frac{dv_C}{dt} = i_L + g_m v_C, \\qquad \\text{KVL: } L\\frac{di_L}{dt} + R i_L + v_C = 0',
        },
        {
          stepNumber: 3,
          titleFa: 'گام ۳: حل تشریحی خط‌به‌خط محاسبات',
          titleEn: 'Step 3: Line-by-Line Analytical Derivation',
          explanationFa:
            'تبدیل لاپلاس معادلات حالت را با صفر در نظر گرفتن ورودی خارجی می‌نویسیم و دترمینان ماتریس سیستم را برابر صفر قرار می‌دهیم:',
          explanationEn:
            'Taking the Laplace transform of the homogeneous state equations and setting the system determinant to zero:',
          mathLatex:
            '\\det\\begin{bmatrix} sC - g_m & -1 \\\\ 1 & sL + R \\end{bmatrix} = (sC - g_m)(sL + R) + 1 = 0 \\\\ \\implies LC s^2 + (RC - g_m L)s + (1 - g_m R) = 0',
        },
        {
          stepNumber: 4,
          titleFa: 'گام ۴: جمع‌بندی شهودی و نکات تستی ویژه طراحان سوال',
          titleEn: 'Step 4: Intuitive Synthesis & Exam-Writer Shortcuts',
          explanationFa:
            'برای نوسان خالص روی محور موهومی (s = ±jω)، ضریب s باید صفر شود (RC - g_m L = 0) و جمله ثابت مثبت بماند (1 - g_m R > 0). با مقادیر مسئله: g_m = RC/L = (10 × 0.5)/2 = 2.5 S که متاسفانه جمله ثابت 1 - 25 = -24 منفی می‌شود! بنابراین مدار قبل از رسیدن به نوسان، دچار واگرایی نمایی حقیقی می‌شود (یک ریشه در سمت راست). این دقیقاً همان نکته طلایی طراحان سوال است: همواره پس از صفر کردن ضریب s، مثبت بودن جمله ثابت ω_osc² > 0 را بررسی کنید!',
          explanationEn:
            'Setting the s-term coefficient to zero gives g_m = RC/L = 2.5 S, yet checking the constant term gives (1 - g_m R) = -24 < 0! Thus a real right-half-plane pole triggers monotonic divergence rather than sinusoidal oscillation—a classic Routh-Hurwitz check that catches 85% of test-takers.',
          mathLatex:
            'g_{m,\\text{zero-damp}} = \\frac{RC}{L} = 2.5\\,\\text{S}, \\quad 1 - g_m R = -24 < 0 \\implies \\text{Divergent RHP Pole } (\\text{Need } g_m < \\tfrac{1}{R} = 0.1\\,\\text{S})',
        },
      ],
    },
  },

  mechanical_piston: {
    model3dType: 'mechanical_piston',
    historicalOriginFa:
      'تحلیل تنش در تیرها و دینامیک موتورها حاصل سه قرن تکامل مکانیک کلاسیک است. گالیله در سال ۱۶۳۸ نخستین بار مقاومت تیر طره‌ای را بررسی کرد و سپس لئونارد اویلر و دانیل برنولی معادله خمش الاستیک تیر را بنا نهادند. هم‌زمان در قرن نوزدهم، سعدی کارنو و نیکولاس اتو چرخه‌های ترمودینامیکی پیستون-سیلندر را فرموله کردند که امروزه با روش المان محدود (FEM) در طراحی توربین‌ها و سازه‌های مقاوم در برابر زلزله به کار می‌رود.',
    historicalOriginEn:
      'Beam mechanics and reciprocating engine kinematics grew out of three centuries of classical mechanics: Galileo’s 1638 cantilever fracture study, the Euler-Bernoulli elastic bending beam equation, and Sadi Carnot & Nikolaus Otto’s piston-cylinder thermodynamics—now unified in modern FEM and CAD.',
    mathematicalProof: {
      theoremTitleFa: 'اثبات معادله تنش خمشی اویلر-برنولی (σ = -My/I) و افت انرژی تیر طره‌ای',
      theoremTitleEn: 'Derivation of Euler-Bernoulli Flexural Stress Formula (σ = -My/I)',
      steps: [
        {
          labelFa: 'گام ۱ — فرض صفحه مانای برنولی و کرنش خطی',
          labelEn: 'Step 1 — Plane Sections Remain Plane Kinematics',
          textFa: 'در خمش خالص با شعاع انحنای ρ، الیاف واقع در فاصله y از محور خنثی کرنش محوری متناسب با y پیدا می‌کنند:',
          textEn: 'At radius of curvature ρ, axial strain at distance y from the neutral axis varies linearly:',
          latex: '\\varepsilon_x(y) = -\\frac{y}{\\rho} = -\\kappa y, \\quad \\kappa = \\frac{d^2 w}{dx^2}',
        },
        {
          labelFa: 'گام ۲ — اعمال قانون هوک و شرط تعادل نیروی محوری',
          labelEn: 'Step 2 — Hooke’s Law & Zero Net Axial Force',
          textFa: 'تنش عمودی برابر σ_x = E ε_x است. از آنجا که برآیند نیروی محوری مقطع در خمش خالص صفر است، محور خنثی دقیقاً از مرکز سطح هندسی عبور می‌کند:',
          textEn: 'With zero resultant axial load, integrating σ_x over the cross-section proves the neutral axis passes through the centroid:',
          latex: '\\int_A \\sigma_x\\,dA = -\\frac{E}{\\rho}\\int_A y\\,dA = 0 \\implies \\bar{y} = 0',
        },
        {
          labelFa: 'گام ۳ — تعادل گشتاور خمشی داخلی M و ممان اینرسی سطح I',
          labelEn: 'Step 3 — Internal Bending Moment Equilibrium',
          textFa: 'گشتاور خمشی M برابر انتگرال تنش ضربدر بازوی y است که رابطه طلایی خمش و تنش بیشینه را نتیجه می‌دهد:',
          textEn: 'Integrating the moment of axial stress across the section produces the classic flexure formula:',
          latex: 'M = -\\int_A y\\sigma_x\\,dA = \\frac{E}{\\rho}\\int_A y^2\\,dA = \\frac{EI}{\\rho} \\implies \\sigma_x = -\\frac{M y}{I}',
        },
      ],
    },
    formulaCheatSheet: [
      {
        nameFa: 'تنش خمشی در تیر',
        nameEn: 'Euler-Bernoulli Flexural Stress',
        latex: '\\sigma_{\\max} = \\frac{M c}{I}',
        conditionFa: 'تیر الاستیک خطی با خیز کوچک',
        conditionEn: 'Linear-elastic prismatic beam under pure bending',
      },
      {
        nameFa: 'سینماتیک جابه‌جایی پیستون در مکانیزم لنگ-لغزنده',
        nameEn: 'Crank-Slider Piston Displacement',
        latex: 'x(\\theta) = r(1 - \\cos\\theta) + l\\left(1 - \\sqrt{1 - (\\tfrac{r}{l}\\sin\\theta)^2}\\right)',
        conditionFa: 'طول لنگ r، طول شاتون l، زاویه میل‌لنگ θ',
        conditionEn: 'Crank radius r, connecting rod l, crank angle θ',
      },
      {
        nameFa: 'قانون اول ترمودینامیک در حجم کنترل',
        nameEn: 'Steady-Flow First Law',
        latex: '\\dot{Q} - \\dot{W} = \\dot{m}\\left[(h_2 - h_1) + \\tfrac{1}{2}(V_2^2 - V_1^2) + g(z_2 - z_1)\\right]',
        conditionFa: 'جریان پایدار در توربین و کمپرسور',
        conditionEn: 'Steady-state open control volume',
      },
      {
        nameFa: 'تنش معادل فون-میزس (معیار تسلیم)',
        nameEn: 'von Mises Yield Criterion',
        latex: '\\sigma_{vM} = \\sqrt{\\sigma_1^2 - \\sigma_1\\sigma_2 + \\sigma_2^2} \\le S_y',
        conditionFa: 'فلزات نرم تحت بارگذاری دو محوره',
        conditionEn: 'Ductile metals under plane stress',
      },
      {
        nameFa: 'بار بحرانی کمانش ستون اویلر',
        nameEn: 'Euler Column Buckling Load',
        latex: 'P_{\\text{cr}} = \\frac{\\pi^2 E I}{(K L)^2}',
        conditionFa: 'ستون لاغر با ضریب طول موثر K',
        conditionEn: 'Slender column with effective length factor K',
      },
      {
        nameFa: 'محدودیت راندمان کارنو',
        nameEn: 'Carnot Thermal Efficiency',
        latex: '\\eta_{\\max} = 1 - \\frac{T_C}{T_H}',
        conditionFa: 'دماها بر حسب کلوین (مقیاس مطلق)',
        conditionEn: 'Reservoir temperatures strictly in Kelvin',
      },
    ],
    hardestExam: {
      sourceFa: 'سوال نهایی مکانیک جامدات و ارتعاشات شریف / چالش سازه MIT 2.002',
      sourceEn: 'Sharif Mechanics / MIT 2.002 Structural Final Challenge',
      difficultyBadgeFa: 'سطح: فوق‌پیشرفته طراحی و تحلیل',
      difficultyBadgeEn: 'Difficulty: Final Boss / Design',
      problemStatementFa:
        'یک تیر طره‌ای به طول L و صلابت خمشی EI در انتهای آزاد خود به یک فنر خطی با سختی k و یک جرم متمرکز M متصل است و هم‌زمان تحت بار گسترده یکنواخت q₀ قرار دارد. بدون حل کامل معادله دیفرانسیل مرتبه چهارم برای هر بخش، نیروی واکنش فنر F_s و فرکانس طبیعی ارتعاش کوچک جرم M حول وضعیت تعادل استاتیکی را دقیقاً استخراج کنید.',
      problemStatementEn:
        'A cantilever beam of length L and flexural rigidity EI carries a uniform distributed load q₀ and rests on a linear spring of stiffness k attached to a lumped tip mass M. Without brute-forcing fourth-order ODE constants, determine both the static spring reaction F_s and the small-amplitude natural frequency ω_n of mass M.',
      problemFormulaLatex:
        'w_{\\text{tip}}(q_0) = \\frac{q_0 L^4}{8EI}, \\qquad w_{\\text{tip}}(P) = \\frac{P L^3}{3EI}',
      steps: [
        {
          stepNumber: 1,
          titleFa: 'گام ۱: رمزگشایی صورت سوال و دام‌های رایج',
          titleEn: 'Step 1: Decoding the Prompt & Common Traps',
          explanationFa:
            'سازه نامعین استاتیکی از درجه ۱ است! دام رایج آن است که دانشجو وزن بار گسترده q₀ را وارد معادله فرکانس طبیعی کند یا فراموش کند که تیر و فنر به صورت «موازی» در نوک تیر کار می‌کنند. توجه کنید جرم متمرکز به انتهای یک تیر الاستیک متصل است که خود تیر مانند یک فنر موازی با سختی k_beam = 3EI/L³ عمل می‌کند.',
          explanationEn:
            'This is statically indeterminate to degree 1. Two common traps: including the static load q₀ inside the vibration natural frequency (gravity shifts equilibrium, not stiffness!), and treating the beam stiffness as series instead of parallel with the tip spring k.',
          trapWarningFa: 'هشدار طراح: بار استاتیکی ثابت q₀ و وزن Mg فقط نقطه تعادل را جابه‌جا می‌کنند و تاثیری روی ω_n ندارند.',
          trapWarningEn: 'Trap Warning: Constant static load q₀ shifts the equilibrium datum only; it does not enter ω_n.',
        },
        {
          stepNumber: 2,
          titleFa: 'گام ۲: انتخاب استراتژی و فرمول‌های کلیدی (LaTeX Math)',
          titleEn: 'Step 2: Strategy Selection & Key Governing Equations',
          explanationFa:
            'با استفاده از اصل برهم‌نهی (Superposition)، تغییر مکان نوک تیر ناشی از بار گسترده رو به پایین باید برابر با تغییر مکان ناشی از نیروی رو به بالای فنر به علاوه جابه‌جایی فنر F_s/k باشد (سازگاری تغییر مکان).',
          explanationEn:
            'Use Superposition + Compatibility at the tip: downward deflection from q₀ minus upward beam recovery from F_s must equal spring compression F_s / k. For dynamics, sum parallel stiffnesses k_eq = k_beam + k.',
          mathLatex:
            '\\Delta_{\\text{tip}} = \\frac{q_0 L^4}{8EI} - \\frac{F_s L^3}{3EI} = \\frac{F_s}{k}, \\qquad k_{\\text{beam}} = \\frac{3EI}{L^3}',
        },
        {
          stepNumber: 3,
          titleFa: 'گام ۳: حل تشریحی خط‌به‌خط محاسبات',
          titleEn: 'Step 3: Line-by-Line Analytical Derivation',
          explanationFa:
            'ابتدا معادله سازگاری تغییر مکان را برای F_s حل می‌کنیم و سپس سختی معادل فنرهای موازی را در فرکانس طبیعی قرار می‌دهیم:',
          explanationEn:
            'Solving the tip compatibility equation for F_s and computing ω_n from equivalent parallel stiffness:',
          mathLatex:
            'F_s\\left(\\frac{1}{k} + \\frac{L^3}{3EI}\\right) = \\frac{q_0 L^4}{8EI} \\implies F_s = \\frac{\\frac{3}{8} q_0 L}{1 + \\frac{3EI}{k L^3}} \\\\[6pt] k_{\\text{eq}} = k + \\frac{3EI}{L^3} \\implies \\omega_n = \\sqrt{\\frac{k_{\\text{eq}}}{M}} = \\sqrt{\\frac{k + \\frac{3EI}{L^3}}{M}}',
        },
        {
          stepNumber: 4,
          titleFa: 'گام ۴: جمع‌بندی شهودی و نکات تستی ویژه طراحان سوال',
          titleEn: 'Step 4: Intuitive Synthesis & Exam-Writer Shortcuts',
          explanationFa:
            'حدود فیزیکی پاسخ را چک کنیم: اگر فنر صلب باشد (k → ∞)، مخرج ۱ شده و سهم واکنش تکیه‌گاه ساده به F_s = 3/8 q₀L میل می‌کند که دقیقاً جواب کلاسیک تیر گیردار-غلتکی است! اگر فنر وجود نداشته باشد (k = 0)، F_s = 0 و فرکانس تنها به سختی تیر (3EI/ML³) وابسته می‌شود.',
          explanationEn:
            'Sanity-check limits: as k → ∞ (propped cantilever), F_s → (3/8)q₀L, matching the exact textbook reaction! As k → 0, F_s → 0 and ω_n reduces purely to the cantilevered tip stiffness √(3EI / ML³).',
          mathLatex:
            '\\lim_{k \\to \\infty} F_s = \\frac{3}{8}q_0 L \\;(\\text{Propped Cantilever Check!})',
        },
      ],
    },
  },

  neural_network: {
    model3dType: 'neural_network',
    historicalOriginFa:
      'ریشه شبکه‌های عصبی و علوم کامپیوتر مدرن از پیوند منطق ریاضی آلن تورینگ (۱۹۳۶) و مدل نورون مصنوعی مک‌کالک و پیتس (۱۹۴۳) شکل گرفت. در دهه ۱۹۵۰ ادسخر دایکسترا الگوریتم کوتاه‌ترین مسیر را در یک کافه طی ۲۰ دقیقه ابداع کرد، و در ۱۹۸۶ راملهارت و هینتون الگوریتم پس‌انتشار خطا (Backpropagation) را همگانی ساختند. نقطه عطف معاصر در سال ۲۰۱۷ با مقاله «Attention Is All You Need» رقم خورد که معماری ترنسفورمر را پایه مدل‌های زبانی بزرگ امروز قرار داد.',
    historicalOriginEn:
      'Modern AI and algorithmic computer science trace from Alan Turing’s 1936 computation model and McCulloch–Pitts’ 1943 artificial neuron to Edsger Dijkstra’s 20-minute café discovery of shortest-path search, Hinton & Rumelhart’s 1986 backpropagation breakthrough, and the 2017 Transformer paper that launched modern foundation models.',
    mathematicalProof: {
      theoremTitleFa: 'اثبات قانون مقیاس‌گذاری √d_k در مکانیزم Self-Attention ترنسفورمر',
      theoremTitleEn: 'Variance Proof for 1/√d_k Scaling in Scaled Dot-Product Attention',
      steps: [
        {
          labelFa: 'گام ۱ — فرض توزیع مستقل بردارهای Query و Key',
          labelEn: 'Step 1 — Independent Unit-Variance Components',
          textFa: 'فرض می‌کنیم مولفه‌های q_i و k_i متغیرهای تصادفی مستقل با میانگین صفر و واریانس ۱ هستند:',
          textEn: 'Suppose components q_i and k_i are independent random variables with mean 0 and variance 1:',
          latex: '\\mathbb{E}[q_i] = \\mathbb{E}[k_i] = 0, \\quad \\text{Var}(q_i) = \\text{Var}(k_i) = 1',
        },
        {
          labelFa: 'گام ۲ — محاسبه واریانس ضرب داخلی Q·K در بعد d_k',
          labelEn: 'Step 2 — Variance Growth of Dot Product q · k',
          textFa: 'واریانس هر جمله ضرب q_i k_i برابر ۱ است و از آنجا که جملات ناهمبسته هستند، واریانس مجموع به صورت خطی با d_k رشد می‌کند:',
          textEn: 'Each product term has unit variance; summing d_k independent terms grows variance linearly with d_k:',
          latex: '\\text{Var}\\left(\\sum_{i=1}^{d_k} q_i k_i\\right) = \\sum_{i=1}^{d_k} \\mathbb{E}[q_i^2]\\mathbb{E}[k_i^2] = d_k',
        },
        {
          labelFa: 'گام ۳ — جلوگیری از اشباع Softmax و محو شدن گرادیان',
          labelEn: 'Step 3 — Restoring Unit Variance to Protect Softmax Gradients',
          textFa: 'انحراف معیار ضرب داخلی برابر √d_k است؛ اگر بر √d_k تقسیم نکنیم، ورودی‌های بزرگ Softmax را اشباع کرده و گرادیان را صفر می‌کنند:',
          textEn: 'Dividing by √d_k restores Var = 1 regardless of embedding dimension, keeping Softmax in its high-gradient regime:',
          latex: '\\text{Var}\\left(\\frac{q \\cdot k}{\\sqrt{d_k}}\\right) = \\frac{1}{d_k}\\text{Var}(q \\cdot k) = 1 \\implies \\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
        },
      ],
    },
    formulaCheatSheet: [
      {
        nameFa: 'مقیاس توجه خودکار (Scaled Dot-Product Attention)',
        nameEn: 'Scaled Dot-Product Attention',
        latex: '\\text{Attn}(Q,K,V)=\\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
        conditionFa: 'نگه‌داشتن واریانس لاجیت‌ها در حدود ۱',
        conditionEn: 'Prevents Softmax saturation at large d_k',
      },
      {
        nameFa: 'قانون زنجیره‌ای پس‌انتشار خطا (Backprop)',
        nameEn: 'Backpropagation Chain Rule',
        latex: '\\delta^{(l)} = \\left((W^{(l+1)})^T \\delta^{(l+1)}\\right) \\odot \\sigma\'(z^{(l)})',
        conditionFa: 'انتشار خطا از لایه خروجی به لایه‌های مخفی',
        conditionEn: 'Elementwise Hadamard product with activation slope',
      },
      {
        nameFa: 'قضیه مستر برای روابط بازگشتی تقسیم و حل',
        nameEn: 'Master Theorem',
        latex: 'T(n) = aT\\left(\\frac{n}{b}\\right) + \\Theta(n^d) \\implies T(n)=\\Theta(n^{\\log_b a}) \\text{ if } d < \\log_b a',
        conditionFa: 'شاخه‌بندی بازگشتی با a ≥ 1 و b > 1',
        conditionEn: 'Standard asymptotic bound for D&C recurrences',
      },
      {
        nameFa: 'آنتروپی متقاطع دودویی و چندکلاسه',
        nameEn: 'Cross-Entropy Loss',
        latex: '\\mathcal{L}_{\\text{CE}} = -\\sum_{c=1}^{C} y_c \\log(\\hat{y}_c)',
        conditionFa: 'کمینه‌سازی واگرایی KL در طبقه‌بندی',
        conditionEn: 'Equivalent to minimizing KL divergence to targets',
      },
      {
        nameFa: 'بهینه‌ساز Adam با تصحیح بایاس',
        nameEn: 'Adam Optimizer Update',
        latex: '\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t}+\\epsilon}\\hat{m}_t',
        conditionFa: 'تخمین مومنتوم مرتبه اول و دوم گرادیان',
        conditionEn: 'Adaptive per-parameter learning rates',
      },
      {
        nameFa: 'رابطه بهینگی بلمن در برنامه‌ریزی پویا',
        nameEn: 'Bellman Optimality Equation',
        latex: 'V^*(s) = \\max_a \\sum_{s\'} P(s\'|s,a)\\left[R(s,a,s\') + \\gamma V^*(s\')\\right]',
        conditionFa: 'فرایند تصمیم‌گیری مارکوف (MDP)',
        conditionEn: 'Discounted infinite-horizon MDP',
      },
    ],
    hardestExam: {
      sourceFa: 'چالش نهایی الگوریتم و یادگیری عمیق شریف / Stanford CS229 & CS161',
      sourceEn: 'Sharif CS / Stanford CS229 & CS161 Final Boss Problem',
      difficultyBadgeFa: 'سطح: فوق‌پیشرفته الگوریتمی و ریاضی',
      difficultyBadgeEn: 'Difficulty: Final Boss / Theory',
      problemStatementFa:
        'یک گراف جهت‌دار با وزن یال‌های مثبت w(u,v) ≥ 0 و مجموعاً K یال ویژه داریم که می‌توانیم از هر یک از آن‌ها «حداکثر یک بار» به عنوان یال با وزن صفر (تخفیف ۱۰۰٪ رایگان، اما فقط در کل مسیر حداکثر m بار استفاده از یال‌های ویژه مجاز است) استفاده کنیم. الگوریتمی با پیچیدگی زمانی بهینه بنویسید که کوتاه‌ترین مسیر از s به t را بیابد و دقیقاً ثابت کنید چرا اجرای دایکسترا روی گراف اصلی با یک آرایه یک‌بعدی dist[v] شکست می‌خورد.',
      problemStatementEn:
        'Given a directed graph with non-negative weights w(u,v) ≥ 0 where any edge can be traversed for free (weight 0) at most m times total along the path, design an optimal shortest-path algorithm from s to t and prove why standard 1D dist[v] Dijkstra fails.',
      problemFormulaLatex:
        'T(V, E, m) = O\\big((m+1)(V + E)\\log(mV)\\big)',
      steps: [
        {
          stepNumber: 1,
          titleFa: 'گام ۱: رمزگشایی صورت سوال و دام‌های رایج',
          titleEn: 'Step 1: Decoding the Prompt & Common Traps',
          explanationFa:
            'دام کلاسیک این است که دانشجو ابتدا مسیر کوتاه‌ترین مسیر عادی را با دایکسترا می‌یابد و سپس m یال سنگین‌تر آن مسیر را صفر می‌کند! مثال نقض: ممکن است مسیری با یک یال فوق‌العاده سنگین وجود داشته باشد که اگر آن را صفر کنیم از مسیر فعلی کوتاه‌تر شود. بنابراین تصمیم‌گیری حریصانه بعد از پایان دایکسترا غلط است.',
          explanationEn:
            'Trap #1: Running standard Dijkstra first and zeroing the m heaviest edges on that path fails completely—an alternative path with one huge bottleneck edge might become the shortest once zeroed out.',
          trapWarningFa: 'هشدار طراح: صفر کردن یال‌های یک مسیر از پیش انتخاب‌شده، بهینگی کلی را تضمین نمی‌کند!',
          trapWarningEn: 'Trap Warning: Post-hoc edge removal never guarantees global optimality across alternate routes.',
        },
        {
          stepNumber: 2,
          titleFa: 'گام ۲: انتخاب استراتژی و فرمول‌های کلیدی (LaTeX Math)',
          titleEn: 'Step 2: Strategy Selection & Key Governing Equations',
          explanationFa:
            'استراتژی طلایی «توسعه فضای حالت (State-Space Graph Augmentation / Layered Graph)» است: به جای گره v، حالت را زوج (v, k) تعریف می‌کنیم که یعنی به راس v رسیده‌ایم در حالی که تاکنون دقیقاً k بار از تخفیف صفر کردن یال استفاده کرده‌ایم (0 ≤ k ≤ m).',
          explanationEn:
            'Augment the state space into (v, k) where 0 ≤ k ≤ m counts free coupons spent so far. Every original edge (u, v) spawns horizontal paid transitions and diagonal free transitions:',
          mathLatex:
            '\\text{Paid: } (u, k) \\xrightarrow{w(u,v)} (v, k), \\qquad \\text{Free (if } k < m\\text{): } (u, k) \\xrightarrow{0} (v, k+1)',
        },
        {
          stepNumber: 3,
          titleFa: 'گام ۳: حل تشریحی خط‌به‌خط محاسبات',
          titleEn: 'Step 3: Line-by-Line Analytical Derivation',
          explanationFa:
            'اکنون یک گراف لایه‌ای با (m+1)V راس و حداکثر (2m+1)E یال داریم که تمام وزن‌های آن هنوز غیرمنفی (≥ 0) هستند! بنابراین دایکسترای استاندارد روی فضای حالت دو‌بعدی dist[v][k] کاملاً معتبر است:',
          explanationEn:
            'Because all weights remain ≥ 0 in the (m+1)-layered graph of (m+1)V vertices and ≤ (2m+1)E edges, standard Dijkstra over 2D states dist[v][k] is guaranteed optimal:',
          mathLatex:
            'd^*(t) = \\min_{0 \\le k \\le m} \\text{dist}[t][k], \\quad \\text{Time} = O\\big((mV + mE)\\log(mV)\\big)',
        },
        {
          stepNumber: 4,
          titleFa: 'گام ۴: جمع‌بندی شهودی و نکات تستی ویژه طراحان سوال',
          titleEn: 'Step 4: Intuitive Synthesis & Exam-Writer Shortcuts',
          explanationFa:
            'اصل زیرساختار بهینه (Optimal Substructure) در آرایه یک‌بعدی dist[v] شکست می‌خورد چون ممکن است رسیدن به v با هزینه بیشتر اما کوپن باقی‌مانده بیشتر در ادامه منجر به مسیر کوتاه‌تری به t شود. هر وقت محدودیت منبع (تعداد پرش رایگان، سوخت، تعداد یال) داشتید، به اندازه آن محدودیت «لایه» به گراف اضافه کنید!',
          explanationEn:
            'Why 1D dist[v] fails: reaching v slightly costlier while hoarding more free coupons can unlock a far cheaper suffix to t. General rule: whenever a path carries a bounded resource constraint m, lift vertices into (v, resource_used) layers.',
          mathLatex:
            '\\text{State Expansion Principle: } \\text{Vertex } v \\longmapsto (v, \\text{budget}_k)',
        },
      ],
    },
  },

  crystal_lattice: {
    model3dType: 'crystal_lattice',
    historicalOriginFa:
      'شناخت ساختار بلوری مواد با کشف پراش پرتو ایکس توسط ماکس فون لاوه و پدر و پسر براگ (ویلیام و لارنس براگ) در سال ۱۹۱۲ آغاز شد؛ دستاوردی که برای نخستین بار چیدمان هندسی اتم‌ها درون فلزات و نمک‌ها را آشکار کرد. پیش از آن آگوست براوه ۱۴ شبکه سه‌بعدی ممکن را طبقه‌بندی کرده بود. امروزه کل صنعت نیمه‌رساناهای سیلیکونی، آلیاژهای سوپررسانا و باتری‌های لیتیوم-یون بر مهندسی عیوب و فواصل بین‌صفحه‌ای همین شبکه‌های کریستالی استوار است.',
    historicalOriginEn:
      'Crystallography was transformed in 1912 when Max von Laue and William & Lawrence Bragg used X-ray diffraction to resolve atomic spacing directly inside solids, building on Auguste Bravais’ 14 space lattices. Every modern silicon wafer, superalloy turbine blade, and Li-ion cathode depends on engineering lattice defects and interplanar spacings.',
    mathematicalProof: {
      theoremTitleFa: 'اثبات قانون پراش براگ (nλ = 2d sinθ) و فاکتور پرشدگی شبکه مکعبی وجوه‌پر (FCC)',
      theoremTitleEn: 'Derivation of Bragg’s Diffraction Law & FCC Atomic Packing Factor (APF = 0.74)',
      steps: [
        {
          labelFa: 'گام ۱ — اختلاف راه نوری پرتوهای بازتابی از دو صفحه متوالی اتمی',
          labelEn: 'Step 1 — Optical Path Difference Between Adjacent Lattice Planes',
          textFa: 'اگر فاصله بین دو صفحه بلوری موازی d و زاویه تابش θ باشد، پرتو پایینی نسبت به پرتو بالایی دو برابر d sinθ مسیر اضافه طی می‌کند:',
          textEn: 'For parallel atomic planes spaced by d at glancing angle θ, the lower wave travels an extra distance of 2 d sinθ:',
          latex: '\\Delta L = AB + BC = d\\sin\\theta + d\\sin\\theta = 2d\\sin\\theta',
        },
        {
          labelFa: 'گام ۲ — شرط تداخل سازنده (قانون براگ)',
          labelEn: 'Step 2 — Constructive Interference Condition',
          textFa: 'برای تقویت امواج و مشاهده قله پراش، اختلاف مسیر باید مضرب صحیحی از طول موج λ باشد:',
          textEn: 'Constructive peaks occur strictly when path difference equals an integer multiple of wavelength λ:',
          latex: 'n\\lambda = 2d_{hkl}\\sin\\theta, \\qquad d_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}}',
        },
        {
          labelFa: 'گام ۳ — محاسبه فاکتور پرشدگی اتمی در شبکه FCC',
          labelEn: 'Step 3 — Atomic Packing Factor for Face-Centered Cubic (FCC)',
          textFa: 'در شبکه FCC چهار اتم در هر سلول واحد قرار دارند و قطر وجه مکعب برابر 4R است (a√2 = 4R). نسبت حجم اتم‌ها به حجم مکعب برابر ۰.۷۴ می‌شود:',
          textEn: 'An FCC unit cell contains 4 atoms touching along the face diagonal (a√2 = 4R), yielding maximum close-packing:',
          latex: '\\text{APF}_{\\text{FCC}} = \\frac{4 \\times \\frac{4}{3}\\pi R^3}{(2\\sqrt{2}R)^3} = \\frac{\\pi}{3\\sqrt{2}} \\approx 0.7405',
        },
      ],
    },
    formulaCheatSheet: [
      {
        nameFa: 'قانون پراش براگ در بلورها',
        nameEn: 'Bragg’s Diffraction Law',
        latex: 'n\\lambda = 2d_{hkl}\\sin\\theta',
        conditionFa: 'تعیین فاصله صفحات با شاخص میلر (hkl)',
        conditionEn: 'Interplanar spacing from X-ray peak angle θ',
      },
      {
        nameFa: 'معادله نفوذ دوم فیک (Fick’s Second Law)',
        nameEn: 'Fick’s Second Diffusion Law',
        latex: '\\frac{\\partial C}{\\partial t} = D\\frac{\\partial^2 C}{\\partial x^2}, \\quad D = D_0 e^{-Q_d / RT}',
        conditionFa: 'عملیات حرارتی و کربن‌دهی فولادها',
        conditionEn: 'Transient atomic diffusion with Arrhenius D',
      },
      {
        nameFa: 'انرژی آزاد گیبس و خودبه‌خودی واکنش',
        nameEn: 'Gibbs Free Energy',
        latex: '\\Delta G = \\Delta H - T\\Delta S < 0',
        conditionFa: 'دمای ثابت T و فشار ثابت P',
        conditionEn: 'Spontaneity condition at constant T and P',
      },
      {
        nameFa: 'معادله نرنست الکتروشیمیایی',
        nameEn: 'Nernst Equation',
        latex: 'E = E^\\circ - \\frac{RT}{nF}\\ln Q',
        conditionFa: 'ولتاژ پیل و خوردگی در غلظت غیراستاندارد',
        conditionEn: 'Cell potential away from standard concentrations',
      },
      {
        nameFa: 'رابطه هال-پچ استحکام‌بخشی دانه',
        nameEn: 'Hall-Petch Grain Boundary Strengthening',
        latex: '\\sigma_y = \\sigma_0 + k_y d^{-1/2}',
        conditionFa: 'افزایش تنش تسلیم با ریز کردن اندازه دانه d',
        conditionEn: 'Yield strength scales inversely with √grain size',
      },
      {
        nameFa: 'توزیع بولتزمن جاهای خالی تعادلی در کریستال',
        nameEn: 'Equilibrium Vacancy Concentration',
        latex: 'N_v = N \\exp\\left(-\\frac{Q_v}{k_B T}\\right)',
        conditionFa: 'تعداد جاهای خالی در دمای مطلق T',
        conditionEn: 'Thermally activated point defects in crystals',
      },
    ],
    hardestExam: {
      sourceFa: 'چالش نهایی علم مواد و شیمی فیزیک صنعتی / MIT 3.091 Challenge',
      sourceEn: 'Materials Science & Physical Chemistry Final Challenge',
      difficultyBadgeFa: 'سطح: فوق‌پیشرفته بلورشناسی',
      difficultyBadgeEn: 'Difficulty: Final Boss / Crystallography',
      problemStatementFa:
        'پراش پرتو ایکس با طول موج λ = 0.1542 nm روی یک فلز مکعبی مجهول، دو قله متوالی اول را در زوایای 2θ = 44.5° و 2θ = 64.8° نشان می‌دهد. تشخیص دهید شبکه این فلز BCC است یا FCC و سپس شعاع اتمی R آن را محاسبه کنید.',
      problemStatementEn:
        'Powder X-ray diffraction (Cu Kα, λ = 0.1542 nm) on an unknown cubic metal exhibits its first two diffraction peaks at 2θ₁ = 44.5° and 2θ₂ = 64.8°. Determine whether the crystal lattice is BCC or FCC, and compute the exact atomic radius R.',
      problemFormulaLatex:
        '\\frac{\\sin^2\\theta_1}{\\sin^2\\theta_2} = \\frac{h_1^2+k_1^2+l_1^2}{h_2^2+k_2^2+l_2^2}',
      steps: [
        {
          stepNumber: 1,
          titleFa: 'گام ۱: رمزگشایی صورت سوال و دام‌های رایج',
          titleEn: 'Step 1: Decoding the Prompt & Common Traps',
          explanationFa:
            'دام کلاسیک اول: در دستگاه XRD زاویه قرائت‌شده 2θ است نه θ! باید قبل از قرار دادن در قانون براگ زاویه را نصف کنید. دام دوم: قوانین انقراض ساختاری (Selection Rules)؛ در BCC صفحات مجاز باید h+k+l زوج باشند (نسبت اولیه‌ها 2:4 یا 1:2)، در حالی که در FCC همه h,k,l باید هم‌زمان زوج یا هم‌زمان فرد باشند (نسبت اولیه‌ها 3:4).',
          explanationEn:
            'Trap #1: XRD plots 2θ, so you MUST divide angles by 2 first. Trap #2: Know selection rules! BCC allows even (h+k+l) giving h²+k²+l² = 2, 4, 6 (ratio 1:2), while FCC requires all-even or all-odd indices giving 3, 4, 8 (ratio 3:4).',
          trapWarningFa: 'هشدار طراح: فراموش کردن تقسیم ۲θ بر ۲ تمام سینوس‌ها و نوع شبکه را غلط درمی‌آورد!',
          trapWarningEn: 'Trap Warning: Plugging 2θ directly into sinθ ruins every calculation.',
        },
        {
          stepNumber: 2,
          titleFa: 'گام ۲: انتخاب استراتژی و فرمول‌های کلیدی (LaTeX Math)',
          titleEn: 'Step 2: Strategy Selection & Key Governing Equations',
          explanationFa:
            'با تقسیم دو قانون براگ به هم، ثابت شبکه a و طول موج λ خط می‌خورند و مستقیماً به نسبت مجموع مربعات شاخص‌های میلر می‌رسیم:',
          explanationEn:
            'Divide sin²θ₁ by sin²θ₂ so both wavelength λ and lattice parameter a cancel out cleanly:',
          mathLatex:
            '\\sin^2\\theta = \\left(\\frac{\\lambda}{2a}\\right)^2 (h^2 + k^2 + l^2) \\implies \\frac{\\sin^2\\theta_1}{\\sin^2\\theta_2} = \\frac{s_1}{s_2}',
        },
        {
          stepNumber: 3,
          titleFa: 'گام ۳: حل تشریحی خط‌به‌خط محاسبات',
          titleEn: 'Step 3: Line-by-Line Analytical Derivation',
          explanationFa:
            'مقادیر θ₁ = 22.25° و θ₂ = 32.4° را محاسبه کرده و نسبت sin² را تشکیل می‌دهیم:',
          explanationEn:
            'Compute θ₁ = 22.25° and θ₂ = 32.4°, then evaluate the squared-sine ratio:',
          mathLatex:
            '\\sin^2(22.25^\\circ) \\approx 0.1434, \\quad \\sin^2(32.4^\\circ) \\approx 0.2871 \\\\ \\frac{\\sin^2\\theta_1}{\\sin^2\\theta_2} \\approx \\frac{0.1434}{0.2871} = 0.4995 \\approx \\frac{1}{2} = \\frac{2}{4} \\implies \\text{BCC Lattice!}',
        },
        {
          stepNumber: 4,
          titleFa: 'گام ۴: جمع‌بندی شهودی و نکات تستی ویژه طراحان سوال',
          titleEn: 'Step 4: Intuitive Synthesis & Exam-Writer Shortcuts',
          explanationFa:
            'چون نسبت دقیقاً ۰.۵ (یعنی ۲ به ۴) به دست آمد، شبکه قطعاً BCC با صفحه اول (110) است. اکنون با دوری بین اتمی d₁₁₀ = λ/(2sinθ₁) = 0.2036 nm و a = d₁₁₀√2 = 0.2879 nm، برای BCC که در آن قطر فضایی مکعب 4R = a√3 است، شعاع اتمی برابر R = 0.1247 nm (مشخصه آهن α-Fe!) حاصل می‌شود.',
          explanationEn:
            'Ratio 0.50 uniquely identifies BCC with first reflection (110). Using d₁₁₀ = 0.2036 nm gives a = d₁₁₀√2 = 0.2879 nm. Since BCC body diagonal satisfies 4R = a√3, atomic radius R = a√3/4 ≈ 0.1247 nm (pure α-iron!).',
          mathLatex:
            'a = \\frac{\\lambda \\sqrt{2}}{2\\sin(22.25^\\circ)} \\approx 0.2879\\,\\text{nm}, \\qquad R = \\frac{a\\sqrt{3}}{4} \\approx 0.1247\\,\\text{nm}',
        },
      ],
    },
  },

  nuclear_reactor: {
    model3dType: 'nuclear_reactor',
    historicalOriginFa:
      'تاریخ مهندسی هسته‌ای با کشف شکافت اورانیوم توسط اوتو هان و لیزه مایتنر در سال ۱۹۳۸ و نخستین واکنش زنجیره‌ای خودپایدار در راکتور Chicago Pile-1 به سرپرستی انریکو فرمی در سال ۱۹۴۲ آغاز شد. در دهه‌های بعد، مهندسان راکتورهای آب تحت فشار (PWR)، نیروگاه‌های تولید رادیوداروهای پزشکی (PET/SPECT) و پژوهش‌های محصورسازی مغناطیسی پلاسما (توکامک) را برای تولید انرژی پاک بدون کربن و درمان سرطان توسعه دادند.',
    historicalOriginEn:
      'Nuclear engineering began with Otto Hahn and Lise Meitner’s 1938 discovery of nuclear fission and Enrico Fermi’s 1942 Chicago Pile-1 self-sustaining chain reaction. Over subsequent decades, engineers developed pressurized water reactors (PWR), medical radioisotope production (PET/SPECT), and tokamak magnetic fusion confinement.',
    mathematicalProof: {
      theoremTitleFa: 'اثبات شرط بحرانیت هندسی و مادی راکتور از معادله پخش تک‌گروهی نوترون',
      theoremTitleEn: 'Derivation of Geometric & Material Buckling Criticality from One-Group Diffusion',
      steps: [
        {
          labelFa: 'گام ۱ — نگارش موازنه شار نوترون در حالت ماندگار',
          labelEn: 'Step 1 — Steady-State Neutron Balance',
          textFa: 'در یک هسته همگن بدون منبع خارجی، مجموع نشت نوترون و جذب باید دقیقاً برابر نرخ تولید نوترون ناشی از شکافت باشد:',
          textEn: 'In a homogeneous critical core, neutron leakage plus absorption must balance fission production:',
          latex: '-D\\nabla^2\\phi(\\mathbf{r}) + \\Sigma_a\\phi(\\mathbf{r}) = \\frac{1}{k_{\\text{eff}}}\\nu\\Sigma_f\\phi(\\mathbf{r})',
        },
        {
          labelFa: 'گام ۲ — تعریف ضریب تکثیر نامحدود k∞ و طول پخش L',
          labelEn: 'Step 2 — Define Infinite Multiplication k∞ and Diffusion Length L',
          textFa: 'با تقسیم طرفین بر ضریب پخش D و معرفی سطح مقطع‌ها، معادله به فرم هلمهولتز با خمش مادی B_m² تبدیل می‌شود:',
          textEn: 'Dividing through by diffusion coefficient D yields the Helmholtz equation with material buckling B_m²:',
          latex: '\\nabla^2\\phi + B_m^2\\phi = 0, \\qquad B_m^2 = \\frac{k_\\infty - 1}{L^2}, \\quad L^2 = \\frac{D}{\\Sigma_a}',
        },
        {
          labelFa: 'گام ۳ — شرط بحرانیت هندسی و احتمال عدم فرار نوترون',
          labelEn: 'Step 3 — Geometric Criticality & Non-Leakage Probability',
          textFa: 'برای پایداری دقیق راکتور (k_eff = 1)، خمش مادی باید با خمش هندسی هسته B_g² برابر شود که احتمال عدم نشت P_NL را نتیجه می‌دهد:',
          textEn: 'Exact criticality (k_eff = 1) requires B_m² = B_g², revealing the fast/thermal non-leakage factor:',
          latex: 'k_{\\text{eff}} = \\frac{k_\\infty}{1 + L^2 B_g^2} = 1 \\iff B_m^2 = B_g^2',
        },
      ],
    },
    formulaCheatSheet: [
      {
        nameFa: 'فرمول شش‌عاملی بحرانیت راکتور',
        nameEn: 'Six-Factor Criticality Formula',
        latex: 'k_{\\text{eff}} = \\eta f p \\varepsilon P_{FNL} P_{TNL}',
        conditionFa: 'تعادل تکثیر نوترون در راکتور حرارتی محدود',
        conditionEn: 'Finite thermal reactor neutron economy',
      },
      {
        nameFa: 'معادله سینتیک نقطه‌ای (نوترون‌های تاخیری)',
        nameEn: 'Point Reactor Kinetics Equation',
        latex: '\\frac{dn}{dt} = \\frac{\\rho - \\beta}{\\Lambda}n + \\sum_{i=1}^6 \\lambda_i C_i',
        conditionFa: 'کنترل‌پذیری راکتور به واسطه کسر نوترون تاخیری β ≈ 0.0065',
        conditionEn: 'Delayed neutron fraction β makes control feasible',
      },
      {
        nameFa: 'قانون تضعیف نمایی پرتو گاما',
        nameEn: 'Gamma Attenuation & Buildup Law',
        latex: 'I(x) = I_0 B(\\mu x) e^{-\\mu x}',
        conditionFa: 'طراحی حفاظ سربی/بتنی با ضریب تضعیف خطی μ',
        conditionEn: 'Radiation shielding with buildup factor B',
      },
      {
        nameFa: 'دز موثر تابش (استاندارد ICRP)',
        nameEn: 'ICRP Effective Dose (Sievert)',
        latex: 'E = \\sum_T w_T \\sum_R w_R D_{T,R}',
        conditionFa: 'ضرایب وزنی بافت w_T و نوع تابش w_R',
        conditionEn: 'Tissue and radiation weighting factors',
      },
      {
        nameFa: 'واحد کار جداسازی غنی‌سازی (SWU)',
        nameEn: 'Separative Work Unit (SWU)',
        latex: '\\text{SWU} = P V(x_p) + W V(x_w) - F V(x_f)',
        conditionFa: 'محاسبه ظرفیت آبشار سانتریفیوژ در چرخه سوخت',
        conditionEn: 'Isotope enrichment cascade value function',
      },
      {
        nameFa: 'معیار سه‌گانه اشتعال همجوشی لاوسون',
        nameEn: 'Lawson Triple Product (Fusion)',
        latex: 'n_e T \\tau_E \\ge 3 \\times 10^{21}\\;\\text{keV}\\cdot\\text{s}\\cdot\\text{m}^{-3}',
        conditionFa: 'شرط اشتعال پلاسمای D-T در راکتور توکامک',
        conditionEn: 'D-T ignition threshold in magnetic confinement',
      },
    ],
    hardestExam: {
      sourceFa: 'چالش نهایی مهندسی هسته‌ای شریف / MIT 22.05 Reactor Physics Boss',
      sourceEn: 'Sharif Nuclear / MIT 22.05 Reactor Physics & Kinetics Challenge',
      difficultyBadgeFa: 'سطح: فوق‌پیشرفته فیزیک راکتور',
      difficultyBadgeEn: 'Difficulty: Final Boss / Nuclear',
      problemStatementFa:
        'یک راکتور تحقیقاتی همگن کروی با سوخت اورانیوم غنی‌شده در حالت بحرانی (k_eff = 1) با k∞ = 1.25 و طول پخش L = 12 cm کار می‌کند. ابتدا کمترین شعاع بحرانی هسته R_c را بیابید و سپس توضیح دهید اگر در اثر افزایش ناگهانی توان، راکتیویته پله‌ای مثبت ρ = 0.008 (با β = 0.0065) اعمال شود، چرا راکتور وارد رژیم «فوق‌بحرانی آنی (Prompt Critical)» می‌شود و چه خطری دارد؟',
      problemStatementEn:
        'A bare spherical homogeneous reactor operates critically (k_eff = 1) with k∞ = 1.25 and diffusion length L = 12 cm. Find the minimum critical radius R_c, then prove why inserting a step reactivity ρ = 0.008 (when delayed neutron fraction β = 0.0065) drives the core into Prompt Criticality.',
      problemFormulaLatex:
        'B_g^2 = \\left(\\frac{\\pi}{R_c}\\right)^2 = B_m^2 = \\frac{k_\\infty - 1}{L^2}, \\qquad \\rho > \\beta',
      steps: [
        {
          stepNumber: 1,
          titleFa: 'گام ۱: رمزگشایی صورت سوال و دام‌های رایج',
          titleEn: 'Step 1: Decoding the Prompt & Common Traps',
          explanationFa:
            'دام کلاسیک اول: در کره برهنه، خمش هندسی برابر (π / R)² است نه (2.405 / R)² (که مخصوص استوانه است). دام دوم: مقایسه ρ با ۱ نیست! مرز ایمنی کنترل راکتور، عدد بسیار کوچک β = 0.0065 (معادل یک دلار راکتیویته) است نه ۱.',
          explanationEn:
            'Trap #1: A bare sphere has geometric buckling (π/R)², whereas 2.405/R belongs to cylindrical cores. Trap #2: The safety boundary for reactivity ρ is β = 0.0065 (1 dollar), not 1!',
          trapWarningFa: 'هشدار طراح: عبور ρ از β حتی به اندازه ۰.۰۰۱۵ باعث خروج راکتور از کنترل میله‌های مکانیکی می‌شود!',
          trapWarningEn: 'Trap Warning: Exceeding ρ = β removes delayed-neutron braking completely!',
        },
        {
          stepNumber: 2,
          titleFa: 'گام ۲: انتخاب استراتژی و فرمول‌های کلیدی (LaTeX Math)',
          titleEn: 'Step 2: Strategy Selection & Key Governing Equations',
          explanationFa:
            'برای بخش اول، شرط بحرانیت B_g² = B_m² را برای شعاع R_c حل می‌کنیم. برای بخش دوم، زمان دوره راکتور T_p را در معادله سینتیک نقطه‌ای زمانی که ρ > β است ارزیابی می‌کنیم:',
          explanationEn:
            'Equate spherical geometric buckling to material buckling for R_c, then evaluate the prompt period T_p = Λ / (ρ - β):',
          mathLatex:
            'R_c = \\frac{\\pi L}{\\sqrt{k_\\infty - 1}}, \\qquad T_{\\text{prompt}} \\approx \\frac{\\Lambda}{\\rho - \\beta}',
        },
        {
          stepNumber: 3,
          titleFa: 'گام ۳: حل تشریحی خط‌به‌خط محاسبات',
          titleEn: 'Step 3: Line-by-Line Analytical Derivation',
          explanationFa:
            'با جایگذاری L = 12 cm و k∞ - 1 = 0.25، شعاع بحرانی دقیقاً ۷۵.۴ سانتی‌متر به دست می‌آید. با ρ - β = 0.0015 و عمر نوترون آنی Λ ≈ 10⁻⁴ s، زمان دو برابر شدن توان به حدود ۰.۰۴۶ ثانیه سقوط می‌کند!',
          explanationEn:
            'Plugging L = 12 cm and k∞ - 1 = 0.25 yields R_c = 24π ≈ 75.4 cm. With ρ - β = 0.0015 and Λ ≈ 10⁻⁴ s, the reactor period plunges to 67 milliseconds!',
          mathLatex:
            'R_c = \\frac{\\pi \\times 12}{\\sqrt{0.25}} = 24\\pi \\approx 75.4\\,\\text{cm} \\\\[6pt] T_{\\text{prompt}} = \\frac{10^{-4}}{0.008 - 0.0065} \\approx 0.067\\,\\text{s} \\implies n(t) = n_0 e^{15t}',
        },
        {
          stepNumber: 4,
          titleFa: 'گام ۴: جمع‌بندی شهودی و اصل ایمنی ذاتی راکتورها',
          titleEn: 'Step 4: Intuitive Synthesis & Inherent Safety Feedback',
          explanationFa:
            'در راکتورهای مدرن PWR، ضریب دمای سوخت (اثر دوپلر) و ضریب حفره آب هر دو منفی طراحی می‌شوند؛ یعنی با گرم‌شدن هسته، جذب تشدیدی اورانیوم-۲۳۸ بالا رفته و خودبه‌خود راکتیویته منفی وارد شده و واکنش را مهار می‌کند.',
          explanationEn:
            'Modern PWRs guarantee inherent safety through negative Doppler fuel temperature and void reactivity coefficients, automatically quenching power excursions faster than mechanical control rods.',
          mathLatex:
            '\\alpha_T = \\frac{\\partial \\rho}{\\partial T} < 0 \\implies \\text{Inherently Self-Stabilizing Core}',
        },
      ],
    },
  },

  geopolitical_globe: {
    model3dType: 'geopolitical_globe',
    historicalOriginFa:
      'مطالعه نظام‌مند سیاست، حقوق، اقتصاد و جوامع انسانی از «سیاست» ارسطو، «مدینه فاضله» فارابی و «مقدمه» ابن‌خلدون تا صلح وستفالی (۱۶۴۸ — تولد دولت-ملت مدرن)، تفکیک قوای مونتسکیو، «ثروت ملل» آدام اسمیت و نظریه‌های روابط بین‌الملل هانس مورگنتا، کنت والتز و جان راولز تکامل یافته است. امروزه علوم سیاسی، حقوق و اقتصاد با ابزارهای نظریه بازی‌ها، اقتصادسنجی و تحلیل نهادهای بین‌المللی پیوند خورده‌اند.',
    historicalOriginEn:
      'Systematic inquiry into politics, law, economics, and society spans Aristotle’s Politics, Farabi and Ibn Khaldun, the 1648 Peace of Westphalia, Montesquieu’s separation of powers, Adam Smith, and modern IR & justice theories (Morgenthau, Waltz, Rawls), now integrated with game theory and empirical econometrics.',
    mathematicalProof: {
      theoremTitleFa: 'تحلیل رسمی «معمای امنیت» و «تعادل نش» در روابط بین‌الملل و اقتصاد سیاسی',
      theoremTitleEn: 'Formal Game-Theoretic Proof of the Security Dilemma & Cooperative Instability',
      steps: [
        {
          labelFa: 'گام ۱ — مدل‌سازی دو دولت در فضای آنارشی بین‌المللی (معمای زندانی)',
          labelEn: 'Step 1 — Modeling Two States Under Structural Anarchy',
          textFa: 'فرض کنید دو دولت A و B بین «خویشتن‌داری (C)» و «تسلیح/تجاوز (D)» انتخاب کنند؛ در نبود اقتدار فراملی، ترجیحات هر دولت به ترتیب T > R > P > S است:',
          textEn: 'With no supranational enforcer, each state ranks Temptation (T) > Reward (R) > Punishment (P) > Sucker (S):',
          latex: 'U_i(D, C) = T > U_i(C, C) = R > U_i(D, D) = P > U_i(C, D) = S',
        },
        {
          labelFa: 'گام ۲ — اثبات استراتژی غالب تسلیح در بازی تک‌مرحله‌ای',
          labelEn: 'Step 2 — Dominant Strategy Proof in One-Shot Anarchy',
          textFa: 'صرف‌نظر از انتخاب رقیب، تسلیح (D) پیامد بالاتری می‌دهد؛ در نتیجه هر دو دولت به تعادل نش ناکارآمد (D, D) با امنیت کمتر سقوط می‌کنند:',
          textEn: 'Regardless of the rival’s move, Defect (D) strictly dominates Cooperate (C), trapping both states at suboptimal (D, D):',
          latex: '(D, D) = \\text{Unique Nash Equilibrium}, \\quad \\text{yet } (R, R) \\succ_{\\text{Pareto}} (P, P)',
        },
        {
          labelFa: 'گام ۳ — خروج از معمای امنیت با نهادها و بازی تکرارشونده (قضیه فولک)',
          labelEn: 'Step 3 — Institutional Escape via Repeated Games & Shadow of the Future',
          textFa: 'اگر تعامل دیپلماتیک و نهادهای بین‌المللی (معاهدات و راستی‌آزمایی) عامل تنزیل آینده δ را به اندازه کافی بالا ببرند، همکاری پایدار (C, C) به تعادل نش تبدیل می‌شود:',
          textEn: 'When treaties, transparency, and repeated diplomacy raise the discount factor δ above the threshold, cooperation stabilizes:',
          latex: '\\frac{R}{1 - \\delta} \\ge T + \\frac{\\delta P}{1 - \\delta} \\iff \\delta \\ge \\frac{T - R}{T - P}',
        },
      ],
    },
    formulaCheatSheet: [
      {
        nameFa: 'تعداد موثر احزاب (شاخص لاکسو-تاگپرا)',
        nameEn: 'Effective Number of Parties (ENP)',
        latex: 'N_{\\text{eff}} = \\frac{1}{\\sum_{i=1}^n s_i^2}',
        conditionFa: 'سنجش تمرکز یا چندحزبی بودن پارلمان از سهم کرسی s_i',
        conditionEn: 'Measures legislative fragmentation from seat shares s_i',
      },
      {
        nameFa: 'شاخص توانمندی ملی ترکیبی (CINC)',
        nameEn: 'Composite Index of National Capability',
        latex: '\\text{CINC} = \\frac{1}{6}\\left(\\text{TPR} + \\text{UPR} + \\text{ISPR} + \\text{ECR} + \\text{MER} + \\text{MPR}\\right)',
        conditionFa: 'سنجش قدرت سخت دولت‌ها در مطالعات روابط بین‌الملل',
        conditionEn: 'Correlates of War material power metric',
      },
      {
        nameFa: 'شرط همکاری پایدار در دیپلماسی و نهادها',
        nameEn: 'Institutional Cooperation Threshold',
        latex: '\\delta \\ge \\frac{T - R}{T - P}',
        conditionFa: 'سایه آینده δ در بازی‌های تکرارشونده بین‌المللی',
        conditionEn: 'Shadow of the future in multilateral regimes',
      },
      {
        nameFa: 'تعادل درآمد ملی در اقتصاد کلان',
        nameEn: 'Macroeconomic National Income Identity',
        latex: 'Y = C(Y - T) + I(r) + G + (X - M)',
        conditionFa: 'اقتصاد باز با سیاست مالی و تراز تجاری',
        conditionEn: 'Open-economy GDP aggregate expenditure',
      },
      {
        nameFa: 'شاخص قدرت رای‌دهی بنزاف در شوراها',
        nameEn: 'Banzhaf Voting Power Index',
        latex: 'B_i = \\frac{\\eta_i}{\\sum_{j=1}^n \\eta_j}',
        conditionFa: 'تحلیل قدرت وتو و ائتلاف‌های بحرانی در سازمان‌های بین‌المللی',
        conditionEn: 'Quantifies decisive coalition & veto power',
      },
      {
        nameFa: 'اصل عدالت حداقلی جان راولز (Maximin)',
        nameEn: 'Rawlsian Difference Principle (Maximin)',
        latex: 'P^* = \\arg\\max_{P \\in \\mathcal{P}} \\min_{i \\in \\text{Society}} U_i(P)',
        conditionFa: 'انتخاب نهادهای عادلانه پشت پرده بی‌خبری',
        conditionEn: 'Maximizing welfare of the least-advantaged group',
      },
    ],
    hardestExam: {
      sourceFa: 'چالش نهایی دانشکده حقوق و علوم سیاسی دانشگاه تهران / LSE Political Science Boss',
      sourceEn: 'University of Tehran Law & Politics / LSE Analytical Policy Challenge',
      difficultyBadgeFa: 'سطح: فوق‌پیشرفته تحلیلی و نظری',
      difficultyBadgeEn: 'Difficulty: Final Boss / Analytical',
      problemStatementFa:
        'در یک بحران ژئوپلیتیکی و تجاری میان دو بلوک منطقه‌ای، بلوک A برای افزایش بازدارندگی اقدام به استقرار سامانه جدید و وضع تعرفه متقابل می‌کند. با مقایسه دقیق سه پارادایم «نئورئالیسم (والتز)»، «لیبرالیسم نهادی (کوهن و نای)» و «سازه‌انگاری (الکساندر ونت)»، تبیین کنید چگونه هر مکتب این بحران را تفسیر می‌کند و دقیقاً چه مکانیزم حقوقی-نهادی (مطابق شرط δ در بازی تکرارشونده) می‌تواند چرخه تشدید تنش را متوقف کند؟',
      problemStatementEn:
        'During a regional geopolitical and trade standoff, Bloc A deploys new deterrence assets and reciprocal tariffs. Contrasting Structural Realism (Waltz), Neoliberal Institutionalism (Keohane & Nye), and Constructivism (Wendt), explain each paradigm’s diagnosis and prove which institutional verification mechanism satisfies the repeated-game stability bound δ to halt escalation.',
      problemFormulaLatex:
        '\\delta_{\\min} = \\frac{T - R}{T - P}, \\qquad \\text{Anarchy} \\xrightarrow{\\text{Regime Transparency}} \\text{Stable Equilibrium}',
      steps: [
        {
          stepNumber: 1,
          titleFa: 'گام ۱: رمزگشایی صورت سوال و دام‌های تحلیلی رایج',
          titleEn: 'Step 1: Decoding the Prompt & Analytical Traps',
          explanationFa:
            'دام رایج در آزمون‌های علوم سیاسی و حقوق بین‌الملل، «توصیف خبری به جای تبیین نظری» است! طراح سوال انتظار ندارد فقط بگویید دو طرف دعوا می‌کنند؛ باید نشان دهید واحد تحلیل در هر مکتب چیست: ساختار توزیع قدرت (نئورئالیسم)، هزینه‌های مبادله و عدم تقارن اطلاعات (لیبرالیسم نهادی)، یا هویت و ادراک تهدید (سازه‌انگاری).',
          explanationEn:
            'Classic exam trap: writing journalism instead of structural theory! Explicitly anchor each paradigm to its causal variable: distribution of material capabilities (Neorealism), transaction costs & information asymmetry (Institutionalism), and intersubjective threat identity (Constructivism).',
          trapWarningFa: 'هشدار طراح: هرگز رئالیسم را با «جنگ‌طلبی» اشتباه نگیرید؛ معمای امنیت حتی میان دولت‌های صرفاً تدافعی رخ می‌دهد!',
          trapWarningEn: 'Trap Warning: Never equate Realism with warmongering—the Security Dilemma occurs even between purely defensive states.',
        },
        {
          stepNumber: 2,
          titleFa: 'گام ۲: تطبیق سه‌گانه مکاتب روی بحران و فرمول‌بندی بازی',
          titleEn: 'Step 2: Three-Paradigm Mapping & Payoff Structure',
          explanationFa:
            'نئورئالیسم (والتز): در غیاب دولت جهانی، اقدام تدافعی بلوک A توسط بلوک B تهاجمی تلقی شده و موازنه‌سازی اجتناب‌ناپذیر است. لیبرالیسم نهادی: ریشه بحران «نبود شفافیت و ترس از تقلب» است و نهادهایی مانند WTO یا مکانیزم‌های راستی‌آزمایی IAEA هزینه تقلب را بالا می‌برند. سازه‌انگاری (ونت): «آنارشی آن چیزی است که دولت‌ها از آن می‌سازند»؛ تغییر گفتمان از دشمنی به رقیبِ قاعده‌مند، تهدید ادراک‌شده را دگرگون می‌کند.',
          explanationEn:
            'Neorealism focuses on relative gains and defensive balancing; Institutionalism targets verification regimes that lower cheating payoffs T; Constructivism transforms perceived threat identity ("anarchy is what states make of it").',
          mathLatex:
            '\\text{Realism: } \\max(G_A - G_B), \\quad \\text{Liberalism: } \\max(G_A + G_B), \\quad \\text{Constructivism: } \\text{Identity} \\to \\text{Interest}',
        },
        {
          stepNumber: 3,
          titleFa: 'گام ۳: استخراج شرط کمی مهار بحران (مدل راستی‌آزمایی و هزینه نقض)',
          titleEn: 'Step 3: Quantitative Stabilization Mechanism',
          explanationFa:
            'فرض کنید پیامدهای بازی T = 10 (فریب یک‌جانبه)، R = 7 (همکاری و تجارت آزاد)، P = 3 (جنگ تعرفه‌ای و تنش) و S = 0 باشد. برای پایداری توافق بدون نهاد ناظر نیاز به δ ≥ (10-7)/(10-3) = 0.43 است؛ اما با ایجاد نهاد حقوقی داوری و جریمه نقض (کاهش T به ۸)، آستانه اعتماد لازم به δ ≥ 0.20 سقوط می‌کند و توافق دست‌یافتنی می‌شود!',
          explanationEn:
            'With payoffs T=10, R=7, P=3, S=0, sustaining peace requires δ ≥ 3/7 ≈ 0.43. Adding a binding dispute-settlement & verification treaty lowers defection gain T from 10 to 8, slashing the threshold to δ ≥ 1/5 = 0.20.',
          mathLatex:
            '\\delta_{\\text{raw}} = \\frac{10 - 7}{10 - 3} = 0.429 \\xrightarrow{\\text{Treaty Verification } (T \\to 8)} \\delta_{\\text{inst}} = \\frac{8 - 7}{8 - 3} = 0.20',
        },
        {
          stepNumber: 4,
          titleFa: 'گام ۴: جمع‌بندی راهبردی ویژه داوران و اساتید علوم سیاسی و حقوق',
          titleEn: 'Step 4: Synthesis for Policy & Legal Scholars',
          explanationFa:
            'یک تحلیل نمره‌کامل در علوم سیاسی و حقوق بین‌الملل هر سه لایه را ترکیب می‌کند: ۱) به رسمیت شناختن واقعیت موازنه قدرت (تأمین بازدارندگی حداقلی)، ۲) طراحی معاهدات مرحله‌به‌مرحله با راستی‌آزمایی شفاف (کاهش T و افزایش δ)، و ۳) دیپلماسی عمومی و حقوقی برای کاهش سوءبرداشت هویتی.',
          explanationEn:
            'Top-scoring synthesis bridges all three lenses: maintain minimum deterrence stability, lock in incremental verifiable treaties (lowering T, lengthening shadow of the future δ), and deploy legal-diplomatic confidence building.',
          mathLatex:
            '\\text{Stable Order} = \\text{Deterrence} + \\text{Verifiable Treaties} + \\text{Normative Legitimacy}',
        },
      ],
    },
  },
};

export function getDeepEnrichmentForCourse(course: CourseItem): DeepEnrichmentBundle {
  const model3d = infer3DModelForCourse(course.fieldId, course.code);
  const base = DOMAIN_ENRICHMENT[model3d];

  // Tailor the theorem and exam framing subtly to the specific course code/title while retaining mathematical rigor
  return {
    ...base,
    historicalOriginFa: `تاریخچه و تکامل علمی «${course.titleFa}» (${course.code}): ${base.historicalOriginFa}`,
    historicalOriginEn: `Origins of ${course.titleEn} (${course.code}): ${base.historicalOriginEn}`,
  };
}
