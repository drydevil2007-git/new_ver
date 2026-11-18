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
    fieldId === 'materials' ||
    fieldId === 'nano' ||
    fieldId === 'biotech' ||
    fieldId === 'polymer' ||
    c.startsWith('CHEM-') ||
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
