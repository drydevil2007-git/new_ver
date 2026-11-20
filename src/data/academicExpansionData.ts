import { CourseItem, DifficultyLevel, FacultyGroupId, FieldCategory } from '../types/app';

export interface FacultyGroupMeta {
  id: FacultyGroupId;
  nameFa: string;
  nameEn: string;
}

export const FACULTY_GROUPS: FacultyGroupMeta[] = [
  { id: 'all', nameFa: 'همه دانشکده‌ها', nameEn: 'All Faculties' },
  { id: 'nuclear-energy', nameFa: 'مهندسی هسته‌ای و انرژی', nameEn: 'Nuclear & Energy' },
  { id: 'engineering', nameFa: 'فنی و مهندسی', nameEn: 'Engineering' },
  { id: 'basic-sciences', nameFa: 'علوم پایه', nameEn: 'Pure & Natural Sciences' },
  { id: 'medical', nameFa: 'علوم پزشکی و سلامت', nameEn: 'Medical & Health' },
  { id: 'economics-mgmt', nameFa: 'اقتصاد، مدیریت و مالی', nameEn: 'Economics & Mgmt' },
  { id: 'law', nameFa: 'حقوق و فقه', nameEn: 'Law & Jurisprudence' },
  { id: 'political-ir', nameFa: 'علوم سیاسی و روابط بین‌الملل', nameEn: 'Political Science & IR' },
  { id: 'humanities-psych', nameFa: 'علوم انسانی و روانشناسی', nameEn: 'Humanities & Psych' },
  { id: 'arts-arch', nameFa: 'هنر، معماری و شهرسازی', nameEn: 'Arts, Arch & Urbanism' },
  { id: 'agriculture-vet', nameFa: 'کشاورزی، دامپزشکی و محیط‌زیست', nameEn: 'Agriculture & Vet' },
];

export const EXPANDED_ACADEMIC_FIELDS: FieldCategory[] = [
  // Expanded Nuclear Engineering Specializations (Ministry of Science)
  {
    id: 'nuclear-fuel',
    nameFa: 'چرخه سوخت و مواد هسته‌ای',
    nameEn: 'Nuclear Fuel Cycle & Materials',
    facultyFa: 'دانشکده مهندسی هسته‌ای و انرژی',
    facultyEn: 'Nuclear & Energy Engineering',
    facultyGroup: 'nuclear-energy',
  },
  {
    id: 'nuclear-radiomed',
    nameFa: 'پرتوپزشکی و حفاظت در برابر اشعه',
    nameEn: 'Radiomedicine & Radiation Protection',
    facultyFa: 'دانشکده مهندسی هسته‌ای و انرژی',
    facultyEn: 'Nuclear & Energy Engineering',
    facultyGroup: 'nuclear-energy',
  },
  {
    id: 'nuclear-fusion',
    nameFa: 'فیزیک پلاسما و مهندسی همجوشی',
    nameEn: 'Plasma Physics & Fusion Engineering',
    facultyFa: 'دانشکده مهندسی هسته‌ای و انرژی',
    facultyEn: 'Nuclear & Energy Engineering',
    facultyGroup: 'nuclear-energy',
  },

  // Pure & Natural Sciences
  {
    id: 'chem-pure',
    nameFa: 'شیمی محض و کاربردی',
    nameEn: 'Pure & Applied Chemistry',
    facultyFa: 'دانشکده علوم پایه',
    facultyEn: 'Pure & Natural Sciences',
    facultyGroup: 'basic-sciences',
  },
  {
    id: 'bio-cell',
    nameFa: 'زیست‌شناسی سلولی، مولکولی و ژنتیک',
    nameEn: 'Cellular, Molecular Biology & Genetics',
    facultyFa: 'دانشکده علوم پایه',
    facultyEn: 'Pure & Natural Sciences',
    facultyGroup: 'basic-sciences',
  },
  {
    id: 'geology',
    nameFa: 'زمین‌شناسی و ژئوفیزیک',
    nameEn: 'Geology & Geophysics',
    facultyFa: 'دانشکده علوم پایه',
    facultyEn: 'Pure & Natural Sciences',
    facultyGroup: 'basic-sciences',
  },
  {
    id: 'astronomy',
    nameFa: 'نجوم، اخترفیزیک و کیهان‌شناسی',
    nameEn: 'Astronomy, Astrophysics & Cosmology',
    facultyFa: 'دانشکده علوم پایه',
    facultyEn: 'Pure & Natural Sciences',
    facultyGroup: 'basic-sciences',
  },

  // Medical & Health Sciences (Ministry of Health)
  {
    id: 'med-general',
    nameFa: 'پزشکی عمومی (علوم پایه و بالینی)',
    nameEn: 'General Medicine (Preclinical & Clinical)',
    facultyFa: 'دانشکده علوم پزشکی',
    facultyEn: 'Medical Sciences',
    facultyGroup: 'medical',
  },
  {
    id: 'med-dentistry',
    nameFa: 'دندانپزشکی',
    nameEn: 'Dentistry & Oral Medicine',
    facultyFa: 'دانشکده علوم پزشکی',
    facultyEn: 'Medical Sciences',
    facultyGroup: 'medical',
  },
  {
    id: 'med-pharmacy',
    nameFa: 'داروسازی و فارماکولوژی',
    nameEn: 'Pharmacy & Pharmacology',
    facultyFa: 'دانشکده داروسازی',
    facultyEn: 'Pharmacy Sciences',
    facultyGroup: 'medical',
  },
  {
    id: 'med-nursing',
    nameFa: 'پرستاری، تغذیه و بهداشت عمومی',
    nameEn: 'Nursing, Nutrition & Public Health',
    facultyFa: 'دانشکده علوم پزشکی و سلامت',
    facultyEn: 'Health & Nursing',
    facultyGroup: 'medical',
  },

  // Agriculture, Food & Veterinary
  {
    id: 'vet-med',
    nameFa: 'دامپزشکی',
    nameEn: 'Veterinary Medicine',
    facultyFa: 'دانشکده دامپزشکی',
    facultyEn: 'Veterinary Sciences',
    facultyGroup: 'agriculture-vet',
  },
  {
    id: 'agri-agronomy',
    nameFa: 'مهندسی کشاورزی، زراعت و علوم خاک',
    nameEn: 'Agronomy, Crop & Soil Science',
    facultyFa: 'دانشکده کشاورزی و منابع طبیعی',
    facultyEn: 'Agriculture & Natural Resources',
    facultyGroup: 'agriculture-vet',
  },
  {
    id: 'food-sci',
    nameFa: 'علوم و مهندسی صنایع غذایی',
    nameEn: 'Food Science & Technology',
    facultyFa: 'دانشکده کشاورزی و صنایع غذایی',
    facultyEn: 'Food Science & Agriculture',
    facultyGroup: 'agriculture-vet',
  },

  // Arts, Design & Urbanism
  {
    id: 'art-urban',
    nameFa: 'شهرسازی و برنامه‌ریزی شهری',
    nameEn: 'Urban Planning & City Design',
    facultyFa: 'دانشکده هنر و معماری',
    facultyEn: 'Arts & Architecture',
    facultyGroup: 'arts-arch',
  },
  {
    id: 'art-cinema',
    nameFa: 'سینما، تئاتر و مطالعات نمایشی',
    nameEn: 'Cinema, Theater & Dramatic Arts',
    facultyFa: 'دانشکده هنرهای زیبا',
    facultyEn: 'Fine Arts',
    facultyGroup: 'arts-arch',
  },
  {
    id: 'art-design',
    nameFa: 'طراحی صنعتی، گرافیک و ارتباط تصویری',
    nameEn: 'Industrial & Graphic Design',
    facultyFa: 'دانشکده هنرهای زیبا',
    facultyEn: 'Fine Arts & Design',
    facultyGroup: 'arts-arch',
  },
  {
    id: 'art-music',
    nameFa: 'موسیقی و تاریخ هنر',
    nameEn: 'Musicology & Art History',
    facultyFa: 'دانشکده هنرهای زیبا',
    facultyEn: 'Fine Arts',
    facultyGroup: 'arts-arch',
  },

  // Economics, Management & Finance
  {
    id: 'econ-pure',
    nameFa: 'علوم اقتصادی (خرد، کلان و اقتصادسنجی)',
    nameEn: 'Economics (Micro, Macro & Econometrics)',
    facultyFa: 'دانشکده اقتصاد و مدیریت',
    facultyEn: 'Economics & Management',
    facultyGroup: 'economics-mgmt',
  },
  {
    id: 'mgmt-business',
    nameFa: 'مدیریت بازرگانی، استراتژیک و MBA',
    nameEn: 'Business Management, Strategy & MBA',
    facultyFa: 'دانشکده اقتصاد و مدیریت',
    facultyEn: 'Economics & Management',
    facultyGroup: 'economics-mgmt',
  },
  {
    id: 'accounting',
    nameFa: 'حسابداری و حسابرسی',
    nameEn: 'Accounting & Auditing',
    facultyFa: 'دانشکده اقتصاد و مدیریت',
    facultyEn: 'Economics & Management',
    facultyGroup: 'economics-mgmt',
  },
  {
    id: 'finance-banking',
    nameFa: 'مدیریت مالی، بورس و مهندسی مالی',
    nameEn: 'Finance, Markets & Financial Engineering',
    facultyFa: 'دانشکده اقتصاد و مدیریت',
    facultyEn: 'Economics & Management',
    facultyGroup: 'economics-mgmt',
  },

  // Law & Jurisprudence
  {
    id: 'law-public',
    nameFa: 'حقوق عمومی، اساسی و اداری',
    nameEn: 'Public, Constitutional & Administrative Law',
    facultyFa: 'دانشکده حقوق و علوم قضایی',
    facultyEn: 'Faculty of Law',
    facultyGroup: 'law',
  },
  {
    id: 'law-civil',
    nameFa: 'حقوق مدنی، قراردادها و خصوصی',
    nameEn: 'Civil, Contract & Private Law',
    facultyFa: 'دانشکده حقوق و علوم قضایی',
    facultyEn: 'Faculty of Law',
    facultyGroup: 'law',
  },
  {
    id: 'law-criminal',
    nameFa: 'حقوق جزا، آیین دادرسی و جرم‌شناسی',
    nameEn: 'Criminal Law & Criminology',
    facultyFa: 'دانشکده حقوق و علوم قضایی',
    facultyEn: 'Faculty of Law',
    facultyGroup: 'law',
  },
  {
    id: 'law-intl',
    nameFa: 'حقوق تجارت و حقوق بین‌الملل',
    nameEn: 'Commercial & International Law',
    facultyFa: 'دانشکده حقوق و علوم قضایی',
    facultyEn: 'Faculty of Law',
    facultyGroup: 'law',
  },

  // Psychology, Sociology & Humanities
  {
    id: 'psych-clinical',
    nameFa: 'روان‌شناسی (عمومی، شناختی و بالینی)',
    nameEn: 'Psychology (Cognitive & Clinical)',
    facultyFa: 'دانشکده علوم انسانی و اجتماعی',
    facultyEn: 'Humanities & Social Sciences',
    facultyGroup: 'humanities-psych',
  },
  {
    id: 'sociology',
    nameFa: 'جامعه‌شناسی و علوم اجتماعی',
    nameEn: 'Sociology & Social Sciences',
    facultyFa: 'دانشکده علوم انسانی و اجتماعی',
    facultyEn: 'Humanities & Social Sciences',
    facultyGroup: 'humanities-psych',
  },
  {
    id: 'media-comm',
    nameFa: 'علوم ارتباطات و مطالعات رسانه',
    nameEn: 'Communication & Media Studies',
    facultyFa: 'دانشکده علوم انسانی و اجتماعی',
    facultyEn: 'Humanities & Social Sciences',
    facultyGroup: 'humanities-psych',
  },
  {
    id: 'philosophy',
    nameFa: 'فلسفه، منطق و معرفت‌شناسی',
    nameEn: 'Philosophy, Logic & Epistemology',
    facultyFa: 'دانشکده ادبیات و علوم انسانی',
    facultyEn: 'Literature & Humanities',
    facultyGroup: 'humanities-psych',
  },
  {
    id: 'history',
    nameFa: 'تاریخ ایران و جهان و باستان‌شناسی',
    nameEn: 'History & Archaeology',
    facultyFa: 'دانشکده ادبیات و علوم انسانی',
    facultyEn: 'Literature & Humanities',
    facultyGroup: 'humanities-psych',
  },
  {
    id: 'literature-ling',
    nameFa: 'زبان و ادبیات فارسی و زبان‌شناسی',
    nameEn: 'Persian Literature & Linguistics',
    facultyFa: 'دانشکده ادبیات و علوم انسانی',
    facultyEn: 'Literature & Humanities',
    facultyGroup: 'humanities-psych',
  },

  // Political Science & International Relations
  {
    id: 'pol-science',
    nameFa: 'علوم سیاسی و اندیشه سیاسی',
    nameEn: 'Political Science & Political Thought',
    facultyFa: 'دانشکده حقوق و علوم سیاسی',
    facultyEn: 'Political Science & IR',
    facultyGroup: 'political-ir',
  },
  {
    id: 'pol-ir',
    nameFa: 'روابط بین‌الملل و دیپلماسی',
    nameEn: 'International Relations & Diplomacy',
    facultyFa: 'دانشکده حقوق و علوم سیاسی',
    facultyEn: 'Political Science & IR',
    facultyGroup: 'political-ir',
  },
  {
    id: 'pol-policy',
    nameFa: 'سیاست‌گذاری عمومی، ژئوپلیتیک و مطالعات منطقه‌ای',
    nameEn: 'Public Policy, Geopolitics & Regional Studies',
    facultyFa: 'دانشکده حقوق و علوم سیاسی',
    facultyEn: 'Political Science & IR',
    facultyGroup: 'political-ir',
  },
];

export function getFieldFacultyGroup(field: FieldCategory): Exclude<FacultyGroupId, 'all'> {
  if (field.facultyGroup) return field.facultyGroup;
  const id = field.id;
  if (id === 'nuclear' || id.startsWith('nuclear-') || id === 'renewable' || id === 'petroleum') {
    return 'nuclear-energy';
  }
  if (id === 'math' || id === 'physics' || id === 'stats' || id === 'optics' || id === 'chem-pure' || id === 'bio-cell' || id === 'geology' || id === 'astronomy') {
    return 'basic-sciences';
  }
  if (id.startsWith('med-') || id.startsWith('bme-')) return 'medical';
  if (id === 'arch' || id.startsWith('art-')) return 'arts-arch';
  if (id === 'env' || id === 'vet-med' || id === 'agri-agronomy' || id === 'food-sci') return 'agriculture-vet';
  if (id === 'eng-econ' || id === 'econ-pure' || id === 'mgmt-business' || id === 'accounting' || id === 'finance-banking') {
    return 'economics-mgmt';
  }
  if (id.startsWith('law-')) return 'law';
  if (id.startsWith('pol-')) return 'political-ir';
  if (id === 'psych-clinical' || id === 'sociology' || id === 'media-comm' || id === 'philosophy' || id === 'history' || id === 'literature-ling') {
    return 'humanities-psych';
  }
  return 'engineering';
}

type SeedTuple = [
  code: string,
  fieldId: string,
  titleFa: string,
  titleEn: string,
  credits: number,
  difficulty: DifficultyLevel,
  topicsFa: string[],
  topicsEn: string[],
  keyFormula: string
];

const EXPANDED_SEEDS: SeedTuple[] = [
  // =========================================================================
  // A. NUCLEAR ENGINEERING (Expanded across Reactor, Fuel, Radiomedicine, Fusion)
  // =========================================================================
  ['NUC-312', 'nuclear', 'سینتیک و کنترل راکتور هسته‌ای', 'Nuclear Reactor Kinetics & Control', 3, 'advanced', ['معادلات سینتیک نقطه‌ای و نوترون‌های تاخیری', 'مسمومیت زنون-۱۳۵ و ساماریوم-۱۴۹', 'ضرایب بازخورد دما و حفره'], ['Point Kinetics & Delayed Neutrons', 'Xenon-135 & Samarium Poisoning', 'Reactivity Feedback'], '\\frac{dn}{dt} = \\frac{\\rho - \\beta}{\\Lambda}n + \\sum_i \\lambda_i C_i'],
  ['NUC-412', 'nuclear', 'ترابرد نوترون و روش مونت‌کارلو (MCNP)', 'Neutron Transport & Monte Carlo', 3, 'advanced', ['معادله ترابرد بولتزمن', 'تقریب‌های SN و PN و انتشار چندگروهی', 'شبیه‌سازی مونت‌کارلو با MCNP و OpenMC'], ['Boltzmann Transport Equation', 'SN/PN Multigroup Approximations', 'MCNP / OpenMC Simulation'], '\\hat{\\Omega}\\cdot\\nabla\\psi + \\Sigma_t\\psi = S + \\int\\Sigma_s\\psi\'\\,d\\Omega\''],
  ['NUC-420', 'nuclear', 'تکنولوژی نیروگاه‌های هسته‌ای (PWR/BWR)', 'Nuclear Power Plant Engineering', 3, 'intermediate', ['مدار اولیه و ثانویه راکتور آب تحت فشار PWR', 'سیستم‌های ایمنی غیرفعال و محفظه مهار', 'چرخه بخار و ژنراتور بخار'], ['PWR Primary & Secondary Loops', 'Passive Safety & Containment', 'Steam Generator Cycles'], 'P_{\\text{elec}} = \\eta_{\\text{th}} \\cdot E_f \\int_V \\Sigma_f \\phi\\,dV'],

  ['NFUL-301', 'nuclear-fuel', 'مقدمه‌ای بر چرخه سوخت هسته‌ای', 'Nuclear Fuel Cycle Engineering', 3, 'introductory', ['اکتشاف، کیک زرد و تبدیل UF6', 'غنی‌سازی ایزوتوپی با سانتریفیوژ گازی', 'سوخت مصرف‌شده و بازفرآوری PUREX'], ['Uranium Milling & UF6 Conversion', 'Gas Centrifuge Enrichment', 'Spent Fuel & PUREX'], '\\text{SWU} = P V(x_p) + W V(x_w) - F V(x_f)'],
  ['NFUL-310', 'nuclear-fuel', 'مواد هسته‌ای و آسیب تابشی در سوخت', 'Nuclear Materials & Radiation Damage', 3, 'intermediate', ['سرامیک UO2 و غلاف آلیاژ زیرکالوی', 'جابه‌جایی اتمی (dpa) و تورم تابشی', 'خوردگی و خزش تحت شار نوترونی'], ['UO2 Fuel & Zircaloy Cladding', 'Atomic Displacements (dpa)', 'Irradiation Swelling & Creep'], '\\text{Burnup} = \\frac{\\int P(t)\\,dt}{m_{\\text{HM}}} \\;(\\text{MWd/kgU})'],
  ['NFUL-405', 'nuclear-fuel', 'مدیریت و دفن پسماندهای هسته‌ای', 'Nuclear Waste Management & Disposal', 3, 'advanced', ['طبقه‌بندی پسماندهای سطح بالا و پایین', 'شیشه‌سازی (Vitrification) و موانع چندلایه', 'دفن عمیق زمین‌شناختی و واپاشی حرارتی'], ['HLW / LLW Classification', 'Glass Vitrification Barriers', 'Deep Geological Repositories'], 'P_{\\text{decay}}(t) = 0.066 P_0 \\left(t^{-0.2} - (t+T_0)^{-0.2}\\right)'],

  ['RAD-301', 'nuclear-radiomed', 'برهمکنش پرتو با ماده و فیزیک پرتوپزشکی', 'Radiation Interaction & Radiomedicine', 3, 'introductory', ['پدیده فوتوالکتریک، کامپتون و تولید زوج', 'قانون تضعیف نمایی پرتو ایکس و گاما', 'قدرت توقف بتا و منحنی براگ در پروتون‌تراپی'], ['Photoelectric, Compton & Pair Prod.', 'Gamma Exponential Attenuation', 'Bragg Peak in Proton Therapy'], 'I(x) = I_0 e^{-\\mu x}'],
  ['RAD-310', 'nuclear-radiomed', 'آشکارسازی و دوزیمتری پرتوها', 'Radiation Detection & Dosimetry', 3, 'intermediate', ['اتاقک یونیزاسیون، گایگر و سوسوزن NaI', 'آشکارسازهای نیمه‌هادی HPGe', 'دز جذبی (Gy)، دز معادل و موثر (Sv)'], ['Ionization & Scintillation Detectors', 'HPGe Gamma Spectroscopy', 'Absorbed (Gy) & Effective Dose (Sv)'], 'E = \\sum_T w_T \\sum_R w_R D_{T,R}'],
  ['RAD-402', 'nuclear-radiomed', 'رادیوایزوتوپ‌ها، پزشکی هسته‌ای (PET/SPECT) و حفاظت اشعه', 'Radioisotopes, PET/SPECT & Radiation Protection', 3, 'advanced', ['تولید تکنسیم-99m و رادیوداروهای FDG', 'تصویربرداری PET و SPECT و شتاب‌دهنده Linac', 'اصل ALARA، حفاظ‌سازی سربی و استاندارد ICRP'], ['Tc-99m & FDG Radiopharmaceuticals', 'PET/SPECT & Linac Radiotherapy', 'ALARA & ICRP Shielding'], '\\dot{D} = \\frac{\\Gamma A}{r^2} B(\\mu x) e^{-\\mu x}'],

  ['FUS-301', 'nuclear-fusion', 'مبانی فیزیک پلاسما و مگنتوهیدرودینامیک (MHD)', 'Plasma Physics & MHD', 3, 'intermediate', ['طول دبای و فرکانس نوسان پلاسما', 'حرکت ذرات باردار در میدان مغناطیسی', 'معادلات MHD ایده‌آل و ناپایداری‌ها'], ['Debye Length & Plasma Frequency', 'Guiding Center Drifts', 'Ideal MHD Equilibrium'], '\\lambda_D = \\sqrt{\\frac{\\varepsilon_0 k_B T_e}{n_e e^2}}'],
  ['FUS-405', 'nuclear-fusion', 'مهندسی همجوشی هسته‌ای و راکتور توکامک (ITER)', 'Fusion Engineering & Tokamak Reactors', 3, 'advanced', ['واکنش دوتریم-تریتیم (D-T) و معیار لاوسون', 'محصورسازی مغناطیسی در توکامک و استلاریتور', 'بلنکت تولید تریتیم و دیورتور حرارتی'], ['D-T Fusion & Lawson Criterion', 'Tokamak Magnetic Confinement', 'Tritium Breeding Blanket'], 'n_e T \\tau_E \\ge 3 \\times 10^{21}\\;\\text{keV}\\cdot\\text{s}\\cdot\\text{m}^{-3}'],

  // =========================================================================
  // B. PURE & NATURAL SCIENCES (Chemistry, Biology, Geology, Astronomy)
  // =========================================================================
  ['CHM-201', 'chem-pure', 'شیمی آلی ۱ و ۲ (ساختار و مکانیزم واکنش‌ها)', 'Organic Chemistry I & II', 3, 'introductory', ['استریوشیمی و کایرالیته مولکولی', 'مکانیزم‌های SN1, SN2, E1, E2', 'شیمی کربونیل‌ها و سنتز ترکیبات آروماتیک'], ['Stereochemistry & Chirality', 'SN1/SN2 & E1/E2 Mechanisms', 'Carbonyl & Aromatic Synthesis'], '\\text{rate}_{\\text{SN2}} = k[\\text{R-X}][\\text{Nu}^-]'],
  ['CHM-302', 'chem-pure', 'شیمی تجزیه دستگاهی و طیف‌سنجی مولکولی', 'Instrumental Analysis & Spectroscopy', 3, 'intermediate', ['طیف‌سنجی جذب اتمی، UV-Vis و FTIR', 'رزونانس مغناطیسی هسته (NMR) و طیف‌سنجی جرمی', 'کروماتوگرافی HPLC و GC-MS'], ['UV-Vis & FTIR Spectroscopy', 'NMR & Mass Spectrometry', 'HPLC & GC-MS Chromatography'], 'A = \\varepsilon b c = -\\log_{10}(I/I_0)'],
  ['CHM-315', 'chem-pure', 'شیمی فیزیک و شیمی کوانتومی', 'Physical & Quantum Chemistry', 3, 'advanced', ['ترمودینامیک شیمیایی و تعادل فازها', 'سینتیک واکنش‌ها و نظریه حالت گذار', 'اوربیتال‌های مولکولی و معادله شرودینگر'], ['Chemical Thermodynamics', 'Transition State Kinetics', 'Molecular Orbital Theory'], '\\Delta G^\\circ = -RT\\ln K_{\\text{eq}}'],
  ['CHM-320', 'chem-pure', 'شیمی معدنی و کمپلکس‌های آلی-فلزی', 'Inorganic & Organometallic Chemistry', 3, 'intermediate', ['نظریه تقارن و گروه‌های نقطه‌ای', 'نظریه میدان بلور و میدان لیگاند', 'کاتالیزورهای فلزات واسطه'], ['Molecular Symmetry & Point Groups', 'Crystal & Ligand Field Theory', 'Transition Metal Catalysis'], '\\Delta_t = \\frac{4}{9}\\Delta_o'],

  ['BIOL-201', 'bio-cell', 'زیست‌شناسی سلولی و مولکولی', 'Cellular & Molecular Biology', 3, 'introductory', ['ساختار اندامک‌ها و انتقال غشایی', 'همانندسازی DNA، رونویسی و ترجمه پروتئین', 'چرخه سلولی و پیام‌رسانی درون‌سلولی'], ['Organelles & Membrane Transport', 'Central Dogma: DNA to Protein', 'Cell Cycle & Signaling'], '\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Protein}'],
  ['BIOL-302', 'bio-cell', 'ژنتیک پایه، مولکولی و مهندسی ژنوم', 'Genetics & Genome Engineering', 3, 'intermediate', ['قوانین مندل، پیوستگی ژنی و نقشه‌یابی کروموزوم', 'ژنتیک جمعیت و تعادل هاردی-واینبرگ', 'اپی‌ژنتیک و ویرایش CRISPR-Cas9'], ['Mendelian & Linkage Mapping', 'Hardy-Weinberg Equilibrium', 'Epigenetics & CRISPR-Cas9'], 'p^2 + 2pq + q^2 = 1'],
  ['BIOL-310', 'bio-cell', 'بیوشیمی ساختار و متابولیسم', 'Biochemistry: Structure & Metabolism', 3, 'intermediate', ['ساختار سه‌بعدی پروتئین‌ها و آنزیم‌ها', 'گلیکولیز، چرخه کربس و فسفریلاسیون اکسیداتیو', 'متابولیسم لیپیدها و اسیدهای آمینه'], ['Protein Folding & Catalysis', 'Glycolysis & Krebs Cycle', 'Oxidative Phosphorylation'], '\\text{pH} = \\text{p}K_a + \\log_{10}\\frac{[\\text{A}^-]}{[\\text{HA}]}'],
  ['BIOL-401', 'bio-cell', 'میکروبیولوژی و ایمنی‌شناسی مولکولی', 'Microbiology & Molecular Immunology', 3, 'advanced', ['فیزیولوژی باکتری‌ها و ویروس‌شناسی', 'ایمنی ذاتی و اکتسابی (لنفوسیت‌های B و T)', 'آنتی‌بادی‌های مونوکلونال و واکسیناسیون'], ['Bacteriology & Virology', 'Innate & Adaptive Immunity', 'Monoclonal Antibodies'], 'N(t) = N_0 \\cdot 2^{t / t_d}'],

  ['GEO-201', 'geology', 'کانی‌شناسی، بلورشناسی و سنگ‌شناسی', 'Mineralogy & Petrology', 3, 'introductory', ['تقارن بلوری و دسته‌بندی سیلیکات‌ها', 'سنگ‌های آذرین، رسوبی و دگرگونی', 'میکروسکوپ پلاریزان مقاطع نازک'], ['Crystal Symmetry & Silicates', 'Igneous, Sedimentary & Metamorphic', 'Optical Petrography'], 'P = \\rho g h'],
  ['GEO-305', 'geology', 'زمین‌شناسی ساختمانی و زمین‌ساخت ورقه‌ای', 'Structural Geology & Plate Tectonics', 3, 'intermediate', ['چین‌ها، گسل‌ها و تحلیل تانسور تنش پوسته', 'حاشیه‌های همگرا، واگرا و گسل‌های امتدادلغز', 'نقشه‌برداری زمین‌شناسی و استریونت'], ['Folds, Faults & Crustal Stress', 'Plate Boundaries & Subduction', 'Stereonet Mapping'], 'M_w = \\frac{2}{3}\\log_{10}(M_0) - 10.7'],
  ['GEO-402', 'geology', 'ژئوفیزیک اکتشافی و آب‌های زیرزمینی', 'Exploration Geophysics & Hydrogeology', 3, 'advanced', ['لرزه‌نگاری انعکاسی و انکساری', 'گرانش‌سنجی، مغناطیس‌سنجی و ژئوالکتریک', 'هیدرولیک سفره‌های آب زیرزمینی و چاه‌ها'], ['Seismic Reflection & Refraction', 'Gravity & Magnetics', 'Aquifer Hydraulics'], 'Q = -K A \\frac{dh}{dl}'],

  ['AST-201', 'astronomy', 'مبانی اخترفیزیک و مکانیک سماوی', 'Astrophysics & Celestial Mechanics', 3, 'intermediate', ['قوانین کپلر و مسئله دو جسم گرانشی', 'قدر ظاهری، قدر مطلق و نمودار هرتسپرونگ-راسل', 'ساختار و تحول ستارگان'], ['Kepler Laws & Orbital Mechanics', 'Magnitudes & H-R Diagram', 'Stellar Structure & Evolution'], 'L = 4\\pi R^2 \\sigma T_{\\text{eff}}^4'],
  ['AST-401', 'astronomy', 'نسبیت عام، سیاه‌چاله‌ها و کیهان‌شناسی', 'General Relativity & Cosmology', 3, 'advanced', ['معادلات میدان اینشتین و متریک شوارتزشیلد', 'انبساط کیهان، قانون هابل و تابش CMB', 'ماده تاریک، انرژی تاریک و معادله فریدمن'], ['Einstein Field Equations & Schwarzschild', 'Hubble Expansion & CMB', 'Dark Energy & Friedmann Eq.'], '\\left(\\frac{\\dot{a}}{a}\\right)^2 = \\frac{8\\pi G}{3}\\rho - \\frac{k c^2}{a^2} + \\frac{\\Lambda c^2}{3}'],

  // =========================================================================
  // C. MEDICAL & HEALTH SCIENCES (Medicine, Dentistry, Pharmacy, Nursing)
  // =========================================================================
  ['MED-101', 'med-general', 'آناتومی و تشریح بدن انسان (تنه، اندام و نوروآناتومی)', 'Human Gross & Neuroanatomy', 4, 'introductory', ['آناتومی اسکلتی-عضلانی اندام‌ها و قفسه سینه', 'کالبدشناسی عروق و اعصاب جمجمه‌ای', 'ساختار قشر مخ، ساقه مغز و نخاع'], ['Musculoskeletal & Thoracic Anatomy', 'Vascular & Cranial Nerves', 'Cerebral Cortex & Spinal Cord'], '\\text{BMI} = \\frac{m\\,(\\text{kg})}{h^2\\,(\\text{m}^2)}'],
  ['MED-202', 'med-general', 'فیزیولوژی پزشکی (گایتون)', 'Medical Physiology (Guyton)', 4, 'intermediate', ['فیزیولوژی قلب، الکتروکاردیوگرام و همودینامیک', 'تنفس، تبادل گازها و تعادل اسید-باز', 'فیزیولوژی کلیه، نفرون و غدد درون‌ریز'], ['Cardiac Cycle & Hemodynamics', 'Pulmonary Gas Exchange', 'Renal Filtration & Endocrinology'], '\\text{CO} = \\text{HR} \\times \\text{SV}, \\quad \\text{MAP} = \\text{DBP} + \\tfrac{1}{3}(\\text{SBP}-\\text{DBP})'],
  ['MED-301', 'med-general', 'آسیب‌شناسی (پاتولوژی رابینز) و ایمونولوژی', 'Pathology (Robbins) & Immunology', 4, 'intermediate', ['آسیب سلولی، التهاب حاد/مزمن و ترمیم بافت', 'نئوپلازی، کارسینوژنز و پاتولوژی سیستمیک', 'بیماری‌های خودایمنی و حساسیت مفرط'], ['Cell Injury & Inflammation', 'Neoplasia & Carcinogenesis', 'Autoimmunity & Hypersensitivity'], '\\text{Anion Gap} = [\\text{Na}^+] - ([\\text{Cl}^-] + [\\text{HCO}_3^-])'],
  ['MED-401', 'med-general', 'بیماری‌های داخلی، نشانه‌شناسی و استدلال بالینی', 'Internal Medicine & Clinical Reasoning', 4, 'advanced', ['شرح‌حال‌گیری، معاینه بالینی و تشخیص افتراقی', 'بیماری‌های قلبی-عروقی، ریوی و گوارشی', 'طب مبتنی بر شواهد (EBM) و تفسیر آزمایش‌ها'], ['Physical Exam & Differential Dx', 'Cardiology, Pulmonology & GI', 'Evidence-Based Medicine'], '\\text{PPV} = \\frac{\\text{Sensitivity} \\times \\text{Prev}}{\\text{Sens}\\cdot\\text{Prev} + (1-\\text{Spec})(1-\\text{Prev})}'],

  ['DENT-201', 'med-dentistry', 'آناتومی سر و گردن و مورفولوژی دندان‌ها', 'Head-Neck Anatomy & Dental Morphology', 3, 'introductory', ['عصب سه‌قلو (Trigeminal) و بی‌حسی موضعی', 'مورفولوژی تاج، ریشه و اکلوژن دندانی', 'بافت‌شناسی مینا، عاج و پالپ'], ['Trigeminal Nerve & Anesthesia', 'Crown/Root Morphology & Occlusion', 'Enamel, Dentin & Pulp Histology'], '\\text{DMFT} = D + M + F'],
  ['DENT-305', 'med-dentistry', 'درمان ریشه (اندودانتیکس) و دندانپزشکی ترمیمی', 'Endodontics & Restorative Dentistry', 3, 'intermediate', ['تشخیص بیماری‌های پالپ و پری‌اپیکال', 'آماده‌سازی کانال، شستشو و ابتوریشن', 'مواد کامپوزیتی، باندینگ و بیومکانیک ترمیم'], ['Pulpal Diagnosis & Canal Prep', 'Obturation & Endodontic Seal', 'Dental Composites & Bonding'], '\\sigma_{\\text{bond}} = \\frac{F_{\\text{fracture}}}{A_{\\text{interface}}}'],
  ['DENT-402', 'med-dentistry', 'ارتودنسی، پریودانتیکس و پروتزهای دندانی', 'Orthodontics, Periodontics & Prosthodontics', 3, 'advanced', ['رشد جمجمه‌ای-صورتی و بیومکانیک حرکت دندان', 'بیماری‌های لثه، جراحی پریو و ایمپلنت', 'طراحی پروتزهای ثابت، متحرک و ایمپلنت'], ['Craniofacial Growth & Tooth Movement', 'Periodontal Therapy & Implants', 'Fixed & Removable Prosthodontics'], 'M_c = F \\times d_{\\perp}'],

  ['PHAR-301', 'med-pharmacy', 'فارماکولوژی و فارماکوکینتیک بالینی', 'Pharmacology & Clinical Pharmacokinetics', 4, 'intermediate', ['جذب، توزیع، متابولیسم و دفع دارو (ADME)', 'تداخلات دارویی و گیرنده‌های فارماکودینامیک', 'محاسبه دوز بارگیری، نیمه‌عمر و کلیرانس'], ['ADME & Bioavailability', 'Receptor Pharmacodynamics', 'Loading Dose, Half-Life & Clearance'], 't_{1/2} = \\frac{0.693 \\cdot V_d}{CL}'],
  ['PHAR-310', 'med-pharmacy', 'شیمی دارویی و طراحی دارو', 'Medicinal Chemistry & Drug Design', 3, 'advanced', ['رابطه ساختار و فعالیت (SAR / QSAR)', 'طراحی دارو بر پایه گیرنده و داکینگ مولکولی', 'متابولیسم فاز ۱ و ۲ کبدی و پیش‌داروها'], ['SAR & QSAR Modeling', 'Structure-Based Drug Design', 'Phase I/II Metabolism & Prodrugs'], '\\text{IC}_{50} \\to K_i = \\frac{\\text{IC}_{50}}{1 + [S]/K_m}'],
  ['PHAR-402', 'med-pharmacy', 'فارماسیوتیکس، فارماکوگنوزی و سم‌شناسی', 'Pharmaceutics, Pharmacognosy & Toxicology', 3, 'intermediate', ['فرمولاسیون قرص، کپسول و نانوحامل‌های دارویی', 'متابولیت‌های ثانویه گیاهان دارویی', 'سم‌شناسی بالینی، شاخص درمانی و پادزهرها'], ['Dosage Form Formulation', 'Medicinal Phytochemistry', 'Clinical Toxicology & Antidotes'], '\\text{TI} = \\frac{\\text{TD}_{50}}{\\text{ED}_{50}}'],

  ['NURS-201', 'med-nursing', 'مراقبت‌های پرستاری داخلی-جراحی و ICU', 'Medical-Surgical & Critical Care Nursing', 3, 'intermediate', ['فرآیند پرستاری، پایش علائم حیاتی و تریاژ', 'تفسیر ABG، ونتیلاتور و احیای قلبی-ریوی ACLS', 'محاسبه دقیق دوز انفوزیون و ایمنی بیمار'], ['Triage & Vital Sign Monitoring', 'ABG Interpretation & ACLS', 'IV Infusion Calculations'], '\\text{Drop Rate} = \\frac{\\text{Volume (mL)} \\times \\text{Drop Factor}}{\\text{Time (min)}}'],
  ['PUBH-301', 'med-nursing', 'اپیدمیولوژی، آمار زیستی و تغذیه بالینی', 'Epidemiology, Biostatistics & Clinical Nutrition', 3, 'introductory', ['مطالعات هم‌گروهی، مورد-شاهدی و کارآزمایی RCT', 'نسبت شانس (OR)، خطر نسبی (RR) و عدد R0', 'نیازهای انرژی، درشت‌مغذی‌ها و رژیم‌درمانی'], ['Cohort, Case-Control & RCTs', 'Odds Ratio, Relative Risk & R0', 'Clinical Dietetics & BMR'], 'R_0 = \\beta \\cdot c \\cdot D, \\quad RR = \\frac{a/(a+b)}{c/(c+d)}'],

  // =========================================================================
  // D. VETERINARY, AGRICULTURE & FOOD SCIENCE
  // =========================================================================
  ['VET-201', 'vet-med', 'آناتومی تطبیقی و فیزیولوژی دامپزشکی', 'Comparative Veterinary Anatomy & Physiology', 3, 'introductory', ['کالبدشناسی تطبیقی نشخوارکنندگان، تک‌سمیان و دام کوچک', 'فیزیولوژی گوارش شکمبه‌ای و تولیدمثل دام', 'هماتولوژی و بیوشیمی بالینی دامپزشکی'], ['Ruminant & Companion Anatomy', 'Rumen Digestion Physiology', 'Veterinary Hematology'], '\\text{RER} = 70 \\times (\\text{BW}_{\\text{kg}})^{0.75}'],
  ['VET-310', 'vet-med', 'بیماری‌های داخلی، جراحی و بیماری‌های مشترک (زئونوز)', 'Veterinary Internal Medicine, Surgery & Zoonoses', 4, 'advanced', ['تشخیص و درمان بیماری‌های عفونی و متابولیک دام', 'اصول بیهوشی، جراحی دامپزشکی و تصویربرداری', 'اپیدمیولوژی بیماری‌های مشترک انسان و دام (One Health)'], ['Infectious & Metabolic Diseases', 'Veterinary Anesthesia & Surgery', 'One Health & Zoonoses'], 'H = 1 - \\frac{1}{R_0}'],

  ['AGR-201', 'agri-agronomy', 'اصول زراعت، اصلاح نباتات و گیاه‌پزشکی', 'Agronomy, Plant Breeding & Crop Protection', 3, 'introductory', ['فیزیولوژی گیاهان زراعی و تناوب کشت', 'اصلاح نباتات، هتروزیس و وراثت‌پذیری', 'مدیریت تلفیقی آفات و بیماری‌های گیاهی (IPM)'], ['Crop Physiology & Rotation', 'Plant Breeding & Heritability', 'Integrated Pest Management'], 'h^2 = \\frac{V_A}{V_P}, \\quad \\text{HI} = \\frac{Y_{\\text{econ}}}{Y_{\\text{bio}}}'],
  ['AGR-305', 'agri-agronomy', 'علوم و مهندسی خاک و آبیاری هوشمند', 'Soil Science & Precision Irrigation', 3, 'intermediate', ['فیزیک و شیمی خاک، ظرفیت تبادل کاتیونی CEC', 'نیاز آبی گیاه و معادله پنمن-مونتیث', 'کشاورزی پایدار و مدیریت شوری خاک'], ['Soil Physics & CEC Chemistry', 'Penman-Monteith Evapotranspiration', 'Salinity & Precision Irrigation'], 'ET_c = K_c \\cdot ET_0'],

  ['FOOD-301', 'food-sci', 'شیمی، میکروبیولوژی و فناوری فرآوری مواد غذایی', 'Food Chemistry, Microbiology & Processing', 3, 'intermediate', ['واکنش مایلارد، اکسیداسیون لیپید و فعالیت آبی aw', 'پاستوریزاسیون، استریلیزاسیون و زمان مرگ حرارتی D-Value', 'سیستم ایمنی غذا HACCP و کنترل کیفیت'], ['Maillard Reaction & Water Activity', 'Thermal Processing & D-Value', 'HACCP Food Safety'], '\\log_{10}\\left(\\frac{N}{N_0}\\right) = -\\frac{t}{D_T}'],

  // =========================================================================
  // E. ARTS, URBANISM, CINEMA, DESIGN & MUSIC
  // =========================================================================
  ['URB-201', 'art-urban', 'مبانی شهرسازی، برنامه‌ریزی شهری و GIS', 'Urban Planning, Theory & Spatial GIS', 3, 'introductory', ['تاریخ شهرنشینی، طرح‌های جامع و تفصیلی', 'تحلیل مکانی با GIS و کاربری اراضی', 'توسعه پایدار شهری و بازآفرینی بافت‌های تاریخی'], ['Comprehensive & Detailed Plans', 'Spatial Analysis with GIS', 'Urban Regeneration'], 'D_{\\text{pop}} = \\frac{P_{\\text{zone}}}{A_{\\text{ha}}}, \\quad \\text{FAR} = \\frac{A_{\\text{floor}}}{A_{\\text{lot}}}'],
  ['URB-310', 'art-urban', 'طراحی فضای شهری و حمل‌ونقل انسان‌محور', 'Urban Design & Transit-Oriented Mobility', 3, 'intermediate', ['خوانایی شهر (کوین لینچ) و سرزندگی فضاهای عمومی', 'مدل‌سازی چهارمرحله‌ای ترافیک و TOD', 'اقتصاد شهری و عدالت فضایی'], ['Kevin Lynch Imageability', 'Transit-Oriented Development', 'Urban Economics & Equity'], 'T_{ij} = k \\frac{P_i P_j}{d_{ij}^\\beta}'],

  ['CIN-201', 'art-cinema', 'تاریخ سینما، تحلیل فیلم و زیبایی‌شناسی تدوین', 'Film History, Analysis & Editing Aesthetics', 3, 'introductory', ['مکاتب سینمایی: مونتاژ شوروی، نئورئالیسم، موج نو', 'میزانسن، قاب‌بندی، نورپردازی و حرکت دوربین', 'ریتم، تداوم و نظریه مونتاژ آیزنشتاین'], ['Film Movements & World Cinema', 'Mise-en-scène & Cinematography', 'Montage Theory & Rhythm'], '\\text{Aspect Ratio} = \\frac{W}{H} \\in \\{1.85:1,\\; 2.39:1\\}'],
  ['CIN-305', 'art-cinema', 'فیلم‌نامه‌نویسی، دراماتورژی و اصول کارگردانی', 'Screenwriting, Dramaturgy & Directing', 3, 'intermediate', ['ساختار سه‌پرده‌ای، پیرنگ و قوس تحول شخصیت', 'گفت‌وگونویسی، زیرمتن و اقتباس ادبی', 'دکوپاژ، هدایت بازیگر و تولید فیلم کوتاه'], ['Three-Act Structure & Character Arc', 'Dialogue & Subtext', 'Shot Listing & Directing Actors'], '\\text{Act I (25\\%)} \\to \\text{Act II (50\\%)} \\to \\text{Act III (25\\%)}'],

  ['DES-201', 'art-design', 'مبانی هنرهای تجسمی، رنگ‌شناسی و تایپوگرافی', 'Visual Fundamentals, Color Theory & Typography', 3, 'introductory', ['اصول گشتالت، ترکیب‌بندی و نسبت طلایی', 'هارمونی رنگ، کنتراست و فضای رنگ RGB/CMYK', 'تایپوگرافی فارسی و لاتین و سیستم‌های شبکه‌ای (Grid)'], ['Gestalt & Golden Ratio Composition', 'Color Systems & Contrast', 'Persian/Latin Typography & Grids'], '\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618'],
  ['DES-308', 'art-design', 'طراحی صنعتی، ارگونومی و طراحی تجربه‌کاربری (UX)', 'Industrial Design, Ergonomics & UX', 3, 'intermediate', ['آنتروپومتری، ارگونومی فیزیکی و شناختی', 'تفکر طراحی (Design Thinking) و نمونه‌سازی سریع', 'تعامل انسان و محصول و آزمون کاربردپذیری'], ['Anthropometry & Cognitive Ergonomics', 'Design Thinking & Prototyping', 'Usability & Human Factors'], 'T_{\\text{Fitts}} = a + b\\log_2\\left(1 + \\frac{D}{W}\\right)'],

  ['MUS-201', 'art-music', 'تئوری موسیقی، هارمونی و تاریخ هنر ایران و جهان', 'Music Theory, Harmony & Art History', 3, 'introductory', ['فواصل، گام‌ها، هارمونی کلاسیک و دستگاه‌های موسیقی ایرانی', 'کنترپوان، فرم و تحلیل آثار سمفونیک', 'تاریخ هنر از باستان و هنر اسلامی تا هنر معاصر'], ['Scales, Harmony & Persian Radif', 'Counterpoint & Musical Form', 'World & Islamic Art History'], 'f_n = f_0 \\cdot 2^{n/12}'],

  // =========================================================================
  // F. ECONOMICS, MANAGEMENT, ACCOUNTING & FINANCE
  // =========================================================================
  ['ECN-201', 'econ-pure', 'اقتصاد خرد ۱ و ۲ (رفتار مصرف‌کننده و بنگاه)', 'Microeconomics I & II', 3, 'introductory', ['نظریه مطلوبیت، منحنی‌های بی‌تفاوتی و کشش تقاضا', 'تولید، هزینه و تعادل رقابت کامل، انحصار و انحصار چندجانبه', 'نظریه بازی‌ها، تعادل نش و شکست بازار'], ['Consumer Utility & Elasticity', 'Perfect Competition, Monopoly & Oligopoly', 'Game Theory & Market Failure'], '\\text{MRS}_{xy} = \\frac{MU_x}{MU_y} = \\frac{P_x}{P_y}, \\quad MR = MC'],
  ['ECN-202', 'econ-pure', 'اقتصاد کلان ۱ و ۲ (رشد، تورم و سیاست پولی)', 'Macroeconomics I & II', 3, 'intermediate', ['حسابداری درآمد ملی (GDP)، بیکاری و تورم', 'مدل‌های IS-LM و AD-AS و منحنی فیلیپس', 'مدل رشد سولو، سیاست‌های پولی و مالی بانک مرکزی'], ['National Accounts (GDP) & Inflation', 'IS-LM, AD-AS & Phillips Curve', 'Solow Growth & Monetary Policy'], 'Y = C(Y-T) + I(r) + G + NX'],
  ['ECN-305', 'econ-pure', 'اقتصادسنجی ۱ و ۲ (مدل‌های رگرسیون و سری زمانی)', 'Econometrics I & II', 3, 'advanced', ['حداقل مربعات معمولی (OLS) و قضیه گوس-مارکوف', 'واریانس ناهمسانی، خودهمبستگی و متغیر ابزاری (IV)', 'داده‌های تابلویی (Panel Data) و مدل‌های VAR'], ['OLS & Gauss-Markov Theorem', 'Instrumental Variables & Endogeneity', 'Panel Data & VAR Models'], '\\hat{\\beta}_{\\text{IV}} = (Z^T X)^{-1} Z^T y'],
  ['ECN-402', 'econ-pure', 'اقتصاد بین‌الملل، پول و بانکداری و اقتصاد توسعه', 'International Economics, Banking & Development', 3, 'intermediate', ['مزیت نسبی، مدل هکشر-اوهلین و تعرفه‌های تجاری', 'تراز پرداخت‌ها، نرخ ارز و سه‌گانه ناممکن ماندل-فلمینگ', 'شاخص جینی، فقر و نظریه‌های توسعه اقتصادی'], ['Comparative Advantage & Trade Policy', 'Exchange Rates & Impossible Trinity', 'Gini Index & Development Theories'], 'M \\cdot V = P \\cdot Y, \\quad \\frac{e P^*}{P} = \\varepsilon'],

  ['MGT-201', 'mgmt-business', 'مبانی سازمان، مدیریت و رفتار سازمانی', 'Principles of Management & Organizational Behavior', 3, 'introductory', ['مکاتب مدیریت، برنامه‌ریزی و ساختارهای سازمانی', 'انگیزش، رهبری، فرهنگ سازمانی و پویایی تیم‌ها', 'تصمیم‌گیری سازمانی و مدیریت تعارض'], ['Management Schools & Org Design', 'Motivation, Leadership & Culture', 'Organizational Decision Making'], '\\text{ROE} = \\frac{\\text{Net Income}}{\\text{Sales}} \\times \\frac{\\text{Sales}}{\\text{Assets}} \\times \\frac{\\text{Assets}}{\\text{Equity}}'],
  ['MGT-305', 'mgmt-business', 'مدیریت استراتژیک، بازاریابی و کارآفرینی (MBA)', 'Strategic Management, Marketing & Entrepreneurship', 3, 'intermediate', ['پنج نیروی پورتر، SWOT و مزیت رقابتی پایدار', 'بخش‌بندی بازار (STP)، آمیخته بازاریابی و ارزش طول عمر مشتری', 'بوم مدل کسب‌وکار، رشد استارتاپی و نوآوری'], ['Porter Five Forces & Strategy', 'STP Marketing & Customer LTV', 'Business Model Canvas & Scaling'], '\\text{LTV} = \\frac{\\text{ARPU} \\times \\text{Gross Margin}}{\\text{Churn Rate}}'],

  ['ACC-201', 'accounting', 'اصول حسابداری، حسابداری میانه و گزارشگری مالی (IFRS)', 'Financial Accounting & IFRS Reporting', 3, 'introductory', ['معادله اساسی حسابداری، ثبت رویدادها و تراز آزمایشی', 'تهیه ترازنامه، صورت سود و زیان و جریان وجوه نقد', 'استانداردهای بین‌المللی گزارشگری مالی (IFRS)'], ['Accounting Equation & Ledger', 'Balance Sheet, Income & Cash Flow', 'IFRS Financial Reporting'], '\\text{Assets} = \\text{Liabilities} + \\text{Equity}'],
  ['ACC-310', 'accounting', 'حسابداری صنعتی (بهای تمام‌شده) و اصول حسابرسی', 'Cost Accounting & Auditing Principles', 3, 'intermediate', ['هزینه‌یابی سفارش کار، مرحله‌ای و مبتنی بر فعالیت (ABC)', 'تحلیل نقطه سربه‌سر (CVP) و انحرافات بودجه', 'ریسک حسابرسی، کنترل داخلی و گزارش حسابرس مستقل'], ['Job-Order, Process & ABC Costing', 'Break-Even CVP & Variance Analysis', 'Audit Risk & Internal Controls'], 'Q_{\\text{BE}} = \\frac{FC}{P - VC}, \\quad AR = IR \\times CR \\times DR'],

  ['FIN-301', 'finance-banking', 'مدیریت مالی، نظریه سبد سهام و بازار سرمایه', 'Corporate Finance, Portfolio Theory & Capital Markets', 3, 'intermediate', ['ارزش زمانی پول، هزینه سرمایه (WACC) و ساختار سرمایه', 'مدل قیمت‌گذاری دارایی سرمایه‌ای (CAPM) و مرز کارای مارکوویتز', 'ارزش‌گذاری سهام، اوراق قرضه و تحلیل بنیادی'], ['WACC & Capital Structure', 'CAPM & Markowitz Efficient Frontier', 'Equity & Bond Valuation'], 'E(R_i) = R_f + \\beta_i \\left(E(R_m) - R_f\\right)'],
  ['FIN-405', 'finance-banking', 'مهندسی مالی، مشتقات و مدیریت ریسک (Black-Scholes)', 'Financial Engineering, Derivatives & Risk', 3, 'advanced', ['قراردادهای آتی، اختیار معامله و سوآپ', 'معادله قیمت‌گذاری بلک-شولز و یونانی‌ها (Delta/Gamma)', 'ارزش در معرض ریسک (VaR) و آزمون استرس'], ['Futures, Options & Swaps', 'Black-Scholes PDE & Greeks', 'Value at Risk (VaR)'], 'C = S_0 N(d_1) - K e^{-rT} N(d_2)'],

  // =========================================================================
  // G. LAW & JURISPRUDENCE (Public, Civil, Criminal, Commercial & Intl)
  // =========================================================================
  ['LAW-101', 'law-public', 'مقدمه علم حقوق و کلیات حقوق اساسی', 'Introduction to Law & Constitutional Law', 3, 'introductory', ['مفهوم قاعده حقوقی، منابع حقوق و سلسله‌مراتب هنجارها', 'اصل تفکیک قوا، حاکمیت قانون و حقوق شهروندی', 'ساختار قوای سه‌گانه و نظارت بر قانون اساسی'], ['Sources & Hierarchy of Norms', 'Separation of Powers & Rule of Law', 'Constitutional Review'], '\\text{Constitution} \\succ \\text{Statute} \\succ \\text{Regulation}'],
  ['LAW-210', 'law-public', 'حقوق اداری و دادرسی دیوان عدالت اداری', 'Administrative Law & Judicial Review', 3, 'intermediate', ['سازمان اداری، قراردادهای اداری و اختیارات دولت', 'اصل قانونی بودن اعمال اداری و ابطال مصوبات', 'مسئولیت مدنی دولت و ماموران عمومی'], ['Administrative Acts & Contracts', 'Legality Principle & Ultra Vires', 'State Liability'], '\\text{Validity} \\iff \\text{Competence} \\land \\text{Due Process} \\land \\text{Legality}'],

  ['LAW-201', 'law-civil', 'حقوق مدنی: اشخاص، اموال و قواعد عمومی قراردادها', 'Civil Law: Persons, Property & Contracts', 3, 'intermediate', ['اهلیت، مالکیت، حق انتفاع و حقوق عینی', 'شرایط اساسی صحت معاملات، ایجاب و قبول و اصل لزوم', 'خیارات، فسخ، اقاله و تعهدات قراردادی'], ['Legal Capacity & Property Rights', 'Contract Formation & Pacta Sunt Servanda', 'Rescission & Remedies'], '\\text{Contract} = \\text{Consent} \\land \\text{Capacity} \\land \\text{Subject} \\land \\text{Lawful Cause}'],
  ['LAW-305', 'law-civil', 'مسئولیت مدنی (الزامات خارج از قرارداد) و آیین دادرسی مدنی', 'Tort Law (Civil Liability) & Civil Procedure', 3, 'advanced', ['ارکان مسئولیت مدنی: ضرر، فعل زیان‌بار و رابطه سببیت', 'مسئولیت محض، تقصیر و جبران خسارت مادی و معنوی', 'صلاحیت دادگاه‌ها، ادله اثبات دعوا و تجدیدنظرخواهی'], ['Harm, Fault & Causation in Torts', 'Strict Liability & Damages', 'Civil Jurisdiction & Evidence'], '\\text{Liability} \\iff \\text{Damage} \\land \\text{Breach} \\land \\text{Causation}'],

  ['LAW-220', 'law-criminal', 'حقوق جزای عمومی و اختصاصی', 'General & Specific Criminal Law', 3, 'intermediate', ['اصل قانونی بودن جرایم و مجازات‌ها و عطف بماسبق نشدن', 'عنصر قانونی، مادی و معنوی جرم و شروع به جرم', 'جرایم علیه اشخاص، اموال و امنیت عمومی'], ['Nulla Poena Sine Lege', 'Actus Reus & Mens Rea', 'Offenses Against Persons & Property'], '\\text{Crime} = \\text{Legal Element} \\land \\text{Actus Reus} \\land \\text{Mens Rea}'],
  ['LAW-320', 'law-criminal', 'آیین دادرسی کیفری و جرم‌شناسی', 'Criminal Procedure & Criminology', 3, 'advanced', ['اصل برائت، حق دفاع و دادرسی عادلانه', 'مراحل کشف، تعقیب، تحقیقات مقدماتی و صدور حکم', 'مکاتب جرم‌شناسی، بزه‌دیده‌شناسی و پیشگیری از جرم'], ['Presumption of Innocence & Fair Trial', 'Investigation & Trial Stages', 'Criminological Theories'], 'P(\\text{Guilt} \\mid \\text{Evidence}) > 1 - \\epsilon_{\\text{doubt}}'],

  ['LAW-330', 'law-intl', 'حقوق تجارت (شرکت‌ها، اسناد تجاری و ورشکستگی)', 'Commercial & Corporate Law', 3, 'intermediate', ['تاجر، اعمال تجاری و انواع شرکت‌های سهامی و با مسئولیت محدود', 'اسناد تجاری: برات، سفته، چک و اصل استقلال امضاها', 'حقوق ورشکستگی، تصفیه و قراردادهای بانکی'], ['Corporate Governance & Corporations', 'Negotiable Instruments', 'Insolvency & Bankruptcy'], '\\text{Liability}_{\\text{LLC}} \\le \\text{Subscribed Capital}'],
  ['LAW-410', 'law-intl', 'حقوق بین‌الملل عمومی، معاهدات و حقوق بشر', 'Public International Law, Treaties & Human Rights', 3, 'advanced', ['منابع حقوق بین‌الملل (ماده ۳۸ اساسنامه دیوان ICJ) و کنوانسیون وین', 'مسئولیت بین‌المللی دولت‌ها، حقوق دریاها و حل مسالمت‌آمیز اختلافات', 'حقوق بین‌الملل بشردوستانه (ژنو) و داوری بین‌المللی'], ['ICJ Art. 38 Sources & Vienna Convention', 'State Responsibility & Law of the Sea', 'Humanitarian Law & Arbitration'], '\\text{Jus Cogens} \\succ \\text{Treaty} \\sim \\text{Custom}'],

  // =========================================================================
  // H. PSYCHOLOGY, SOCIOLOGY, MEDIA, PHILOSOPHY, HISTORY & LITERATURE
  // =========================================================================
  ['PSY-101', 'psych-clinical', 'مباحث اساسی روان‌شناسی و روان‌شناسی تحولی', 'General & Developmental Psychology', 3, 'introductory', ['مکاتب روان‌شناسی، یادگیری، حافظه و انگیزش', 'نظریه‌های رشد شناختی پیاژه، ویگوتسکی و اریکسون', 'روان‌شناسی اجتماعی، نگرش‌ها و پویایی گروه'], ['Learning, Memory & Motivation', 'Piaget, Vygotsky & Erikson Stages', 'Social Cognition & Group Dynamics'], 'd\' = z(\\text{Hit}) - z(\\text{FA})'],
  ['PSY-302', 'psych-clinical', 'روان‌شناسی شناختی و عصب‌روان‌شناسی', 'Cognitive Psychology & Neuropsychology', 3, 'intermediate', ['ادراک، توجه انتخابی، حافظه کاری و سوگیری‌های شناختی', 'کارکردهای اجرایی قشر پیش‌پیشانی و نقشه‌برداری fMRI', 'تصمیم‌گیری انسانی و مدل‌های سیستم ۱ و ۲'], ['Attention, Working Memory & Biases', 'Prefrontal Executive Functions', 'Dual-Process Decision Theory'], 'H = -\\sum_i p_i \\log_2 p_i'],
  ['PSY-401', 'psych-clinical', 'آسیب‌شناسی روانی (DSM-5)، روانسنجی و روان‌درمانی', 'Psychopathology, Psychometrics & Psychotherapy', 3, 'advanced', ['ملاک‌های تشخیصی DSM-5 در اختلالات اضطرابی و خلقی', 'پایایی (آلفای کرونباخ)، روایی و آزمون‌های روان‌شناختی', 'درمان شناختی-رفتاری (CBT)، ACT و مصاحبه بالینی'], ['DSM-5 Diagnostic Frameworks', 'Cronbach Alpha & Psychometrics', 'CBT, ACT & Clinical Interviewing'], '\\alpha = \\frac{k}{k-1}\\left(1 - \\frac{\\sum \\sigma_i^2}{\\sigma_T^2}\\right)'],

  ['SOC-201', 'sociology', 'مبانی جامعه‌شناسی و نظریه‌های کلاسیک و معاصر', 'Sociological Foundations & Social Theory', 3, 'introductory', ['دورکیم (همبستگی و آنومی)، وبر (عقلانیت) و مارکس (ساختار طبقاتی)', 'کارکردگرایی ساختاری، کنش متقابل نمادین و نظریه انتقادی', 'بوردیو (سرمایه فرهنگی و عادت‌واره) و مدرنیته گیدنز'], ['Durkheim, Weber & Marx Foundations', 'Symbolic Interactionism & Critical Theory', 'Bourdieu Habitus & Giddens Structuration'], '\\text{Capital}_{\\text{total}} = C_{\\text{econ}} + C_{\\text{cultural}} + C_{\\text{social}}'],
  ['SOC-308', 'sociology', 'روش تحقیق کمی و کیفی و جامعه‌شناسی توسعه و شهری', 'Social Research Methods, Urban & Development Sociology', 3, 'intermediate', ['پیمایش، نمونه‌گیری احتمالی و تحلیل داده‌های اجتماعی با SPSS/R', 'گرندد تئوری، مردم‌نگاری و تحلیل گفتمان کیفی', 'توسعه، نابرابری اجتماعی، شکاف نسلی و تحولات شهری'], ['Surveys, Sampling & Quantitative Analysis', 'Grounded Theory & Ethnography', 'Inequality, Modernization & Urban Life'], 'n = \\frac{Z^2 p(1-p)}{e^2}'],

  ['MEDA-201', 'media-comm', 'نظریه‌های ارتباطات، افکار عمومی و مطالعات رسانه', 'Communication Theory, Public Opinion & Media Studies', 3, 'intermediate', ['مدل‌های ارتباطی، برجسته‌سازی (Agenda-Setting) و مارپیچ سکوت', 'اقتصاد سیاسی رسانه، الگوریتم‌های شبکه‌های اجتماعی و سواد رسانه‌ای', 'روزنامه‌نگاری تحقیقی و روابط عمومی راهبردی'], ['Agenda-Setting & Spiral of Silence', 'Media Political Economy & Algorithms', 'Investigative Journalism'], 'C = B\\log_2\\left(1 + \\frac{S}{N}\\right)'],

  ['PHI-101', 'philosophy', 'منطق قدیم، منطق ریاضی جدید و تفکر نقادانه', 'Classical, Symbolic Logic & Critical Thinking', 3, 'introductory', ['قیاس، استقرا، مغالطات منطقی و تحلیل استدلال', 'منطق گزاره‌ای و محمولات مرتبه اول (فرگه و راسل)', 'جداول ارزش، صدق، سازگاری و قضیه ناتمامیت گودل'], ['Syllogisms & Informal Fallacies', 'Propositional & First-Order Logic', 'Truth Tables & Gödel Incompleteness'], '((P \\to Q) \\land P) \\vdash Q'],
  ['PHI-210', 'philosophy', 'تاریخ فلسفه غرب و فلسفه اسلامی (حکمت متعالیه)', 'History of Western & Islamic Philosophy', 3, 'intermediate', ['افلاطون، ارسطو، دکارت، کانت، هگل و فلسفه تحلیلی معاصر', 'فارابی، ابن‌سینا (مشاء)، سهروردی (اشراق) و ملاصدرا (اصالت وجود)', 'مسئله نفس و بدن، علیت و حرکت جوهری'], ['Plato, Aristotle, Descartes & Kant', 'Avicenna, Suhrawardi & Mulla Sadra', 'Metaphysics & Mind-Body Problem'], '\\forall x\\,(\\text{Contingent}(x) \\to \\exists y\\,\\text{Cause}(y,x))'],
  ['PHI-315', 'philosophy', 'معرفت‌شناسی، فلسفه علم و فلسفه اخلاق', 'Epistemology, Philosophy of Science & Ethics', 3, 'advanced', ['توجیه معرفتی، شکاکیت و مسئله گتیه', 'ابطال‌پذیری کارل پوپر و پارادایم‌های علمی توماس کوهن', 'اخلاق فضیلت، وظیفه‌گرایی کانت، فایده‌گرایی و اخلاق هوش مصنوعی'], ['Justified True Belief & Gettier', 'Popper Falsifiability & Kuhn Paradigms', 'Virtue, Deontology & AI Ethics'], 'K(S,p) \\iff B(S,p) \\land T(p) \\land J(S,p)'],

  ['HIS-201', 'history', 'تاریخ ایران (باستان، اسلامی و معاصر) و تاریخ‌نگاری', 'Iranian History & Historiography', 3, 'introductory', ['ساختارهای سیاسی و تمدنی هخامنشی، ساسانی و تمدن ایرانی-اسلامی', 'تحولات مشروطه، دولت مدرن و تاریخ معاصر ایران', 'روش‌شناسی تاریخ، نقد منابع و تاریخ‌نگاری تحلیلی'], ['Ancient & Islamic-Era Iran', 'Constitutional Era & Modern Iran', 'Historical Method & Source Criticism'], '\\text{Primary Source} \\xrightarrow{\\text{Critique}} \\text{Historical Synthesis}'],
  ['HIS-305', 'history', 'تاریخ جهان مدرن و باستان‌شناسی تطبیقی', 'Modern World History & Comparative Archaeology', 3, 'intermediate', ['رنسانس، انقلاب صنعتی، جنگ‌های جهانی و نظم پساجنگ سرد', 'روش‌های کاوش باستان‌شناسی و تاریخ‌گذاری رادیوکربن C-14', 'تاریخ علم، فناوری و تبادلات جاده ابریشم'], ['Industrial Revolution to Post-Cold War', 'Radiocarbon C-14 Dating & Excavation', 'History of Science & Silk Road'], 't = \\frac{1}{\\lambda}\\ln\\left(\\frac{N_0}{N(t)}\\right)'],

  ['LIT-201', 'literature-ling', 'دستور زبان، عروض و قافیه و متون کلاسیک فارسی', 'Persian Grammar, Prosody & Classical Texts', 3, 'introductory', ['ساختار نحوی زبان فارسی، سبک‌شناسی و بلاغت (معانی، بیان، بدیع)', 'عروض، وزن شعر فارسی و موسیقی کلام', 'تحلیل شاهنامه فردوسی، مثنوی مولوی، سعدی، حافظ و تاریخ بیهقی'], ['Persian Syntax & Rhetoric', 'Prosody & Poetic Meter', 'Shahnameh, Rumi, Saadi & Hafez'], '\\text{Meter} = \\sum (\\text{Short } \\smile \\;+\\; \\text{Long } -) \\implies \\text{Bahr}'],
  ['LIT-310', 'literature-ling', 'زبان‌شناسی همگانی، نقد ادبی و مطالعات ترجمه', 'General Linguistics, Literary Criticism & Translation', 3, 'intermediate', ['آواشناسی، واج‌شناسی، نحو چامسکی و معناشناسی', 'مکاتب نقد ادبی: فرمالیسم، ساختارگرایی و هرمنوتیک', 'نظریه‌های ترجمه، معادل‌یابی فرهنگی و پردازش زبان'], ['Phonology, Chomsky Syntax & Semantics', 'Formalism, Structuralism & Hermeneutics', 'Translation Theory & Pragmatics'], 'S \\to NP + VP'],

  // =========================================================================
  // I. POLITICAL SCIENCE, INTERNATIONAL RELATIONS & PUBLIC POLICY
  // =========================================================================
  ['POL-101', 'pol-science', 'مبانی علم سیاست و بنیادهای فلسفی سیاست', 'Foundations of Political Science & Theory', 3, 'introductory', ['مفاهیم قدرت، اقتدار، مشروعیت، حاکمیت و دولت-ملت', 'دموکراسی، لیبرالیسم، سوسیالیسم، محافظه‌کاری و عدالت اجتماعی', 'نقش نهادها، تفکیک قوا و فرهنگ سیاسی'], ['Power, Authority, Legitimacy & State', 'Political Ideologies & Justice', 'Institutions & Political Culture'], 'P_{\\text{legit}} = f(\\text{Consent},\\; \\text{Rule of Law},\\; \\text{Accountability})'],
  ['POL-205', 'pol-science', 'تاریخ اندیشه‌های سیاسی در غرب و اسلام', 'History of Political Thought (West & Islam)', 3, 'intermediate', ['جمهور افلاطون، سیاست ارسطو، ماکیاولی، هابز، لاک، روسو و مونتسکیو', 'مدینه فاضله فارابی، سیاست‌نامه خواجه نظام‌الملک، ابن‌خلدون و اندیشه معاصر', 'نظریه‌های قرارداد اجتماعی و عدالت جان راولز'], ['Plato, Aristotle, Machiavelli & Social Contract', 'Farabi, Nizam al-Mulk & Ibn Khaldun', 'Rawlsian Justice & Modern Thought'], '\\text{Maximin: } \\max_{\\text{policy}} \\min_{i} U_i'],
  ['POL-302', 'pol-science', 'نظام‌های سیاسی تطبیقی و احزاب سیاسی', 'Comparative Politics & Party Systems', 3, 'intermediate', ['مقایسه نظام‌های ریاستی، پارلمانی و نیمه‌ریاستی', 'نظام‌های انتخاباتی (اکثریتی و تناسبی) و قانون دوورژه', 'احزاب سیاسی، گروه‌های فشار و دموکراسی‌سازی'], ['Presidential vs. Parliamentary Systems', 'Electoral Systems & Duverger Law', 'Parties, Interest Groups & Democratization'], 'N_{\\text{eff}} = \\frac{1}{\\sum_{i=1}^n s_i^2}'],
  ['POL-315', 'pol-science', 'جامعه‌شناسی سیاسی و نظریه‌های انقلاب و جنبش‌های اجتماعی', 'Political Sociology & Theories of Revolution', 3, 'advanced', ['رابطه دولت و جامعه، نخبگان سیاسی و شکاف‌های اجتماعی (لیپست-روکان)', 'نظریه‌های انقلاب (اسکاچپول، تیلی، گار و محرومیت نسبی)', 'جنبش‌های اجتماعی جدید و کنش جمعی'], ['State-Society & Social Cleavages', 'Revolution Theories (Skocpol, Tilly)', 'Collective Action & Social Movements'], 'P(\\text{Mobilization}) = f(\\text{Grievance},\\; \\text{Resources},\\; \\text{Opportunity})'],

  ['IR-201', 'pol-ir', 'اصول و نظریه‌های روابط بین‌الملل', 'Principles & Theories of International Relations', 3, 'introductory', ['رئالیسم کلاسیک و نئورئالیسم (مورگنتا و والتز) و توازن قوا', 'لیبرالیسم نهادی، وابستگی متقابل و صلح دموکراتیک', 'سازه‌انگاری (الکساندر ونت)، نظریه انتقادی و مکتب انگلیسی'], ['Realism, Neorealism & Balance of Power', 'Institutional Liberalism & Interdependence', 'Constructivism & English School'], '\\text{Security Dilemma: } \\Delta S_A \\uparrow \\implies \\Delta T_B \\uparrow \\implies \\Delta S_A \\downarrow'],
  ['IR-301', 'pol-ir', 'تاریخ روابط بین‌الملل، دیپلماسی و سیاست خارجی', 'Diplomatic History & Foreign Policy Analysis', 3, 'intermediate', ['از صلح وستفالی ۱۶۴۸ و کنگره وین تا جنگ سرد و نظم چندقطبی', 'مدل‌های تصمیم‌گیری سیاست خارجی (گراهام آلیسون) و دیپلماسی عمومی', 'اصول مذاکره بین‌المللی، آداب کنسولی و مدیریت بحران'], ['Westphalia 1648 to Multipolar Order', 'Allison Foreign Policy Models', 'Negotiation & Crisis Diplomacy'], 'U_i(a_i, a_{-i}) \\ge U_i(a\'_i, a_{-i})'],
  ['IR-312', 'pol-ir', 'سازمان‌های بین‌المللی و حکمرانی جهانی', 'International Organizations & Global Governance', 3, 'intermediate', ['ساختار سازمان ملل متحد، شورای امنیت، مجمع عمومی و حق وتو', 'اتحادیه اروپا، سازمان تجارت جهانی (WTO)، IMF و آژانس انرژی اتمی (IAEA)', 'رژیم‌های بین‌المللی، امنیت جمعی و حفظ صلح'], ['UN Charter, Security Council & Veto', 'EU, WTO, IMF & IAEA Regimes', 'Collective Security & Peacekeeping'], 'B_i = \\frac{\\text{Critical Coalitions}_i}{\\sum_j \\text{Critical Coalitions}_j}'],
  ['IR-405', 'pol-ir', 'اقتصاد سیاسی بین‌الملل (IPE)', 'International Political Economy', 3, 'advanced', ['مرکانتیلیسم، لیبرالیسم اقتصادی و نظریه نظام جهانی والرشتاین', 'تحریم‌های اقتصادی، زنجیره‌های ارزش جهانی و ژئواکونومی انرژی', 'نقش شرکت‌های چندملیتی، ارزهای ذخیره و بحران‌های مالی جهانی'], ['Mercantilism, Liberalism & World-Systems', 'Sanctions & Energy Geoeconomics', 'MNCs, Reserve Currencies & Crises'], '\\text{HHI}_{\\text{trade}} = \\sum_{k=1}^N \\left(\\frac{X_k}{X_{\\text{total}}}\\right)^2'],

  ['POL-320', 'pol-policy', 'سیاست‌گذاری عمومی و حکمرانی خوب', 'Public Policy Analysis & Governance', 3, 'intermediate', ['چرخه سیاست‌گذاری: دستورکارگذاری، تدوین، اجرا و ارزیابی', 'تحلیل هزینه-فایده، شکست دولت و حکمرانی مشارکتی', 'سیاست‌گذاری علم، فناوری، انرژی و محیط‌زیست'], ['Policy Cycle: Agenda to Evaluation', 'Cost-Benefit & Governance Metrics', 'Science, Energy & Climate Policy'], '\\text{BCR} = \\frac{\\sum_{t} B_t / (1+r)^t}{\\sum_{t} C_t / (1+r)^t}'],
  ['POL-410', 'pol-policy', 'ژئوپلیتیک، مطالعات امنیتی و مسائل استراتژیک خاورمیانه', 'Geopolitics, Security Studies & Middle East Affairs', 3, 'advanced', ['نظریه‌های ژئوپلیتیک (مکیندر، اسپایکمن) و ژئوپلیتیک انرژی و آبراه‌ها', 'بازدارندگی استراتژیک، امنیت سایبری و کنترل تسلیحات هسته‌ای (NPT)', 'پویایی‌های امنیتی و منطقه‌ای خاورمیانه، اوراسیا و شرق آسیا'], ['Mackinder/Spykman & Chokepoints', 'Strategic Deterrence & NPT', 'Middle East & Eurasia Security'], '\\text{Power}_{\\text{CINC}} = \\frac{1}{6}\\left(TPR + UPR + ISPR + ECR + MER + MPR\\right)'],
];

export const EXPANDED_ACADEMIC_COURSES: CourseItem[] = EXPANDED_SEEDS.map(
  ([code, fieldId, titleFa, titleEn, credits, difficulty, topicsFa, topicsEn, keyFormula], idx) => ({
    id: `course-exp-${idx + 1}`,
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
