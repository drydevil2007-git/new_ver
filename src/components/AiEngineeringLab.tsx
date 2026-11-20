import React, { useEffect, useState } from 'react';
import {
  Calculator,
  Sparkles,
  FileUp,
  ImagePlus,
  Loader2,
  CheckCircle2,
  Layers,
  AlertCircle,
  Trash2,
  Eye,
  Terminal,
  Activity,
  Cpu,
  Play,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check,
  Network,
  Sliders,
  Settings,
  X,
} from 'lucide-react';
import { Lang, LeitnerCard } from '../types/app';
import { LatexBlock, LatexInline } from './MathRenderer';

export type LabTab = 'solver' | 'simulation' | 'schematics' | 'feynman' | 'pdf';

interface AiEngineeringLabProps {
  lang: Lang;
  activeTab: LabTab;
  onChangeTab: (tab: LabTab) => void;
  initialFeynmanTopic?: string;
  onImportFlashcards: (cards: Omit<LeitnerCard, 'id' | 'box' | 'lastReviewedAt' | 'reviewCount'>[]) => void;
}

interface SolverStep {
  stepNumber: number;
  title: string;
  explanation: string;
  latex: string;
}

interface SolverResult {
  problemTitle: string;
  detectedDomain: string;
  givenLatex: string;
  steps: SolverStep[];
  finalAnswerLatex: string;
  physicalIntuition: string;
}

interface FeynmanResult {
  title: string;
  analogy: string;
  simpleExplanation: string;
  realWorldExample: string;
  commonMisconception: string;
  keyFormulaLatex: string;
  selfCheckQuestion: string;
}

interface PdfExtractResult {
  documentTitle: string;
  summary: string;
  keyConcepts: string[];
  keyFormulas: Array<{ name: string; latex: string }>;
  flashcards: Array<{ front: string; back: string; formulaLatex: string }>;
  examQuestions: Array<{ question: string; modelAnswer: string; difficulty: string }>;
}

interface SimMetric {
  label: string;
  value: string;
  unit: string;
  status: 'optimal' | 'nominal' | 'warning' | 'critical';
  note: string;
}

interface SimResult {
  systemTitle: string;
  discipline: string;
  mathModelLatex: string;
  transferFunctionOrEquation: string;
  metrics: SimMetric[];
  pythonCode: string;
  executionOutput: string;
  plotPoints: Array<{ x: number; y: number }>;
  plotXLabel: string;
  plotYLabel: string;
  stabilityAnalysis: {
    isStable: boolean;
    polesLatex: string;
    zerosLatex?: string;
    gainMarginDb?: string;
    phaseMarginDeg?: string;
    verdictFa: string;
  };
  engineeringInsights: string;
  practicalRecommendation: string;
}

interface SchematicEq {
  name: string;
  latex: string;
  physicalLaw: string;
  description: string;
}

interface SchematicResult {
  schematicTitle: string;
  category: string;
  detectedNodesAndLoops: string[];
  governingEquations: SchematicEq[];
  stateSpaceOrTransferFunction: string;
  stepByStepDerivation: Array<{
    stepNumber: number;
    title: string;
    latex: string;
    explanation: string;
  }>;
  designRuleChecks: Array<{
    component: string;
    status: 'pass' | 'warning' | 'fail';
    message: string;
  }>;
  finalEngineeringVerdict: string;
  optimizationAdvice: string;
}

export const AiEngineeringLab: React.FC<AiEngineeringLabProps> = ({
  lang,
  activeTab,
  onChangeTab,
  initialFeynmanTopic,
  onImportFlashcards,
}) => {
  // Google AI Studio Global Status
  const [showStudioSettings, setShowStudioSettings] = useState(false);
  const [customStudioKey, setCustomStudioKey] = useState(
    () => localStorage.getItem('dy_gemini_key') || ''
  );
  const [selectedStudioModel, setSelectedStudioModel] = useState('gemini-3.8-flash');
  const [copiedCode, setCopiedCode] = useState(false);

  // 1. Formula Solver State
  const [solverProblem, setSolverProblem] = useState(
    'یک مدار سری RLC با R = 4 Ω، L = 1 H و C = 0.04 F به یک منبع پله 10 ولت متصل است. معادله دیفرانسیل جریان i(t) و پاسخ طبیعی/کامل را در شرایط اولیه صفر استخراج کن.'
  );
  const [solverDomain, setSolverDomain] = useState('auto');
  const [solverImage, setSolverImage] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [solverLoading, setSolverLoading] = useState(false);
  const [solverError, setSolverError] = useState<string | null>(null);
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);

  // 2. Google AI Studio Simulation & Python Code Execution State
  const [simDiscipline, setSimDiscipline] = useState<'control' | 'mechanics' | 'fluids' | 'algorithms'>('control');
  const [simControlParams, setSimControlParams] = useState({ omega_n: 5.0, zeta: 0.4, K: 2.5 });
  const [simMechParams, setSimMechParams] = useState({ L: 6.0, P: 12.0, E: 200.0, I: 8.0 });
  const [simFluidParams, setSimFluidParams] = useState({ D: 0.1, Q: 0.05, rho: 1000.0, mu: 0.001 });
  const [simAlgoParams, setSimAlgoParams] = useState({ a: 2, b: 2, k: 1, p: 0 });
  const [simUserObjective, setSimUserObjective] = useState('');
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<SimResult | null>(null);
  const [simViewMode, setSimViewMode] = useState<'response' | 'code' | 'logs'>('response');

  // 3. Google AI Studio Multimodal Schematic Analyzer State
  const [schematicCategory, setSchematicCategory] = useState<'analog_circuit' | 'free_body' | 'control_block' | 'truss_structure'>('analog_circuit');
  const [schematicPresetKey, setSchematicPresetKey] = useState('mosfet_cs');
  const [schematicImage, setSchematicImage] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [schematicPrompt, setSchematicPrompt] = useState('تحلیل کامل سیگنال کوچک، بهره ولتاژ، فرکانس قطع میلر و حاشیه اشباع ترانزیستور.');
  const [schematicLoading, setSchematicLoading] = useState(false);
  const [schematicError, setSchematicError] = useState<string | null>(null);
  const [schematicResult, setSchematicResult] = useState<SchematicResult | null>(null);

  // 4. Feynman State
  const [feynmanTopic, setFeynmanTopic] = useState(
    initialFeynmanTopic || 'تبدیل لاپلاس و قطب‌های پایداری سیستم'
  );
  const [feynmanLevel, setFeynmanLevel] = useState<'child5' | 'highschool' | 'undergrad' | 'researcher'>('undergrad');
  const [feynmanLoading, setFeynmanLoading] = useState(false);
  const [feynmanError, setFeynmanError] = useState<string | null>(null);
  const [feynmanResult, setFeynmanResult] = useState<FeynmanResult | null>(null);

  // 5. PDF Slide / Note Extractor State
  const [pdfDragOver, setPdfDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    mimeType: string;
    base64Data?: string;
    textContent?: string;
    sizeLabel: string;
  } | null>(null);
  const [pastedNotes, setPastedNotes] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfResult, setPdfResult] = useState<PdfExtractResult | null>(null);
  const [pdfViewTab, setPdfViewTab] = useState<'summary' | 'flashcards' | 'exam'>('summary');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [importedFlashcardsBanner, setImportedFlashcardsBanner] = useState(false);

  useEffect(() => {
    if (initialFeynmanTopic) {
      setFeynmanTopic(initialFeynmanTopic);
    }
  }, [initialFeynmanTopic]);

  // Initial trigger for simulation if empty
  useEffect(() => {
    if (!simResult && activeTab === 'simulation') {
      runSimulation();
    }
  }, [activeTab]);

  // Initial trigger for schematic if empty
  useEffect(() => {
    if (!schematicResult && activeTab === 'schematics') {
      runSchematicAnalysis();
    }
  }, [activeTab]);

  const saveStudioKey = () => {
    if (customStudioKey.trim()) {
      localStorage.setItem('dy_gemini_key', customStudioKey.trim());
    } else {
      localStorage.removeItem('dy_gemini_key');
    }
    setShowStudioSettings(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const solverPresets =
    lang === 'fa'
      ? [
          {
            label: 'مدار گذرا RLC',
            text: 'در یک مدار سری RLC با R = 4 Ω، L = 1 H و C = 0.04 F و ورودی پله V_s = 10u(t)، پاسخ کامل جریان i(t) را با فرض شرایط اولیه صفر محاسبه کن.',
          },
          {
            label: 'انتگرال سه‌گانه کروی',
            text: 'حجم و گشتاور لختی یک کره توپر همگن به شعاع R و چگالی ثابت ρ را با انتگرال سه‌گانه در مختصات کروی به دست آور.',
          },
          {
            label: 'میدان مغناطیسی گاوس/آمپر',
            text: 'با استفاده از قانون آمپر، میدان مغناطیسی B(r) را در داخل و خارج یک سیم استوانه‌ای ضخیم به شعاع R با چگالی جریان یکنواخت J محاسبه کن.',
          },
        ]
      : [
          {
            label: 'RLC Step Response',
            text: 'A series RLC circuit has R = 4 Ω, L = 1 H, and C = 0.04 F driven by Vs = 10u(t). Derive the differential equation and find i(t) for zero initial conditions.',
          },
          {
            label: 'Spherical Integral',
            text: 'Derive the moment of inertia of a uniform solid sphere of radius R and mass M about its diameter using triple integrals in spherical coordinates.',
          },
          {
            label: 'Ampere Law Cylinder',
            text: 'Using Ampere Law, derive the magnetic field B(r) inside and outside a long cylindrical conductor of radius R carrying uniform current density J.',
          },
        ];

  const handleSolveFormula = async (e: React.FormEvent) => {
    e.preventDefault();
    setSolverLoading(true);
    setSolverError(null);
    try {
      const resp = await fetch('/api/ai/formula-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: solverProblem,
          domain: solverDomain,
          lang,
          imageBase64: solverImage?.base64,
          imageMimeType: solverImage?.mimeType,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'خطا در حل فرمول');
      setSolverResult(data);
    } catch (err) {
      setSolverError(err instanceof Error ? err.message : 'خطای ارتباط با سرور');
    } finally {
      setSolverLoading(false);
    }
  };

  const handleSolverImagePick = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.split(',')[1] || '';
      setSolverImage({ base64, mimeType: file.type || 'image/png', name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const runSimulation = async () => {
    setSimLoading(true);
    setSimError(null);
    try {
      const activeParams =
        simDiscipline === 'control'
          ? simControlParams
          : simDiscipline === 'mechanics'
          ? simMechParams
          : simDiscipline === 'fluids'
          ? simFluidParams
          : simAlgoParams;

      const systemName =
        simDiscipline === 'control'
          ? 'سیستم کنترل حلقه بسته درجه ۲'
          : simDiscipline === 'mechanics'
          ? 'خمش و تنش تیر دو سر ساده'
          : simDiscipline === 'fluids'
          ? 'دینامیک سیالات و افت فشار دارسی در لوله'
          : 'قضیه مستر و پیچیدگی الگوریتم‌های بازگشتی';

      const resp = await fetch('/api/ai/studio-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discipline: simDiscipline,
          systemName,
          parameters: activeParams,
          userPrompt: simUserObjective,
          lang,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'خطا در اجرای شبیه‌سازی مهندسی');
      setSimResult(data);
    } catch (err) {
      setSimError(err instanceof Error ? err.message : 'خطای ارتباط با شبیه‌ساز استودیو');
    } finally {
      setSimLoading(false);
    }
  };

  const runSchematicAnalysis = async () => {
    setSchematicLoading(true);
    setSchematicError(null);
    try {
      const resp = await fetch('/api/ai/schematic-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schematicCategory,
          schematicPresetKey,
          image: schematicImage ? { base64: schematicImage.base64, mimeType: schematicImage.mimeType } : null,
          userPrompt: schematicPrompt,
          lang,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'خطا در تحلیل دیاگرام');
      setSchematicResult(data);
    } catch (err) {
      setSchematicError(err instanceof Error ? err.message : 'خطای تحلیل چندوجهی');
    } finally {
      setSchematicLoading(false);
    }
  };

  const handleSchematicImagePick = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result || '');
      const base64 = res.split(',')[1] || '';
      setSchematicImage({ base64, mimeType: file.type || 'image/png', name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleAskFeynman = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeynmanLoading(true);
    setFeynmanError(null);
    try {
      const resp = await fetch('/api/ai/feynman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: feynmanTopic, level: feynmanLevel, lang }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'خطا در دریافت توضیح فاینمن');
      setFeynmanResult(data);
    } catch (err) {
      setFeynmanError(err instanceof Error ? err.message : 'خطای ارتباط با سرور');
    } finally {
      setFeynmanLoading(false);
    }
  };

  const handleProcessPdfFile = (file: File | undefined) => {
    if (!file) return;
    const sizeLabel = `${(file.size / 1024).toFixed(0)} KB`;
    if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          mimeType: 'text/plain',
          textContent: String(reader.result || ''),
          sizeLabel,
        });
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const res = String(reader.result || '');
        const base64Data = res.split(',')[1] || '';
        setUploadedFile({
          name: file.name,
          mimeType: file.type || 'application/pdf',
          base64Data,
          sizeLabel,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractPdf = async () => {
    if (!uploadedFile && !pastedNotes.trim()) {
      setPdfError(lang === 'fa' ? 'لطفاً فایل اسلاید را بارگذاری کنید یا متن جزوه را وارد نمایید.' : 'Please upload a slide file or paste lecture notes.');
      return;
    }
    setPdfLoading(true);
    setPdfError(null);
    setImportedFlashcardsBanner(false);
    try {
      const resp = await fetch('/api/ai/extract-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: uploadedFile?.name || 'Lecture Notes',
          mimeType: uploadedFile?.mimeType,
          base64Data: uploadedFile?.base64Data,
          textContent: uploadedFile?.textContent || pastedNotes,
          lang,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'خطا در استخراج محتوا');
      setPdfResult(data);
      setPdfViewTab('summary');
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'خطای ارتباط با سرور');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleExportFlashcards = () => {
    if (!pdfResult?.flashcards) return;
    onImportFlashcards(
      pdfResult.flashcards.map((fc) => ({
        courseCode: 'SLIDE-EXTRACT',
        question: fc.front,
        answer: fc.back,
        latex: fc.formulaLatex,
        tags: [pdfResult.documentTitle, 'PDF Extract'],
      }))
    );
    setImportedFlashcardsBanner(true);
  };

  // Helper for rendering SVG Plot Curves
  const renderSvgPlot = (points: Array<{ x: number; y: number }>) => {
    if (!points || points.length === 0) return null;
    const padL = 40;
    const padR = 20;
    const padT = 20;
    const padB = 35;
    const width = 500;
    const height = 240;

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs) || 1;
    const minY = Math.min(0, Math.min(...ys));
    const maxY = Math.max(...ys) * 1.15 || 1;

    const scaleX = (val: number) => padL + ((val - minX) / (maxX - minX)) * (width - padL - padR);
    const scaleY = (val: number) => height - padB - ((val - minY) / (maxY - minY)) * (height - padT - padB);

    const pathData = points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.x).toFixed(1)} ${scaleY(p.y).toFixed(1)}`)
      .join(' ');

    const areaData = `${pathData} L ${scaleX(points[points.length - 1].x).toFixed(1)} ${scaleY(minY).toFixed(1)} L ${scaleX(points[0].x).toFixed(1)} ${scaleY(minY).toFixed(1)} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 select-none">
        <defs>
          <linearGradient id="plotGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid horizontal lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const val = minY + pct * (maxY - minY);
          const y = scaleY(val);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
              <text x={padL - 6} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={padL} y1={scaleY(minY)} x2={width - padR} y2={scaleY(minY)} stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="1.5" />
        <line x1={padL} y1={padT} x2={padL} y2={scaleY(minY)} stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="1.5" />

        {/* Filled Curve */}
        <path d={areaData} fill="url(#plotGradient)" />
        <path d={pathData} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Key Points */}
        {points.map((p, idx) => (
          <circle key={idx} cx={scaleX(p.x)} cy={scaleY(p.y)} r="3" className="fill-white dark:fill-slate-900 stroke-sky-500 stroke-2" />
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* GOOGLE AI STUDIO BRANDING & ENGINE STATUS BAR                          */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-teal-500/10 p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {lang === 'fa' ? 'استودیوی مهندسی هوش مصنوعی دانشیار' : 'DaneshYar AI Engineering Studio'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                  Google AI Studio Powered
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {lang === 'fa'
                  ? 'مجهز به اجرای زنده کدهای پایتون (Code Execution)، شبیه‌سازی ماتریسی و تحلیل چندوجهی مدارهای مهندسی'
                  : 'Equipped with live Python code execution, matrix state-space simulations, and multimodal circuit vision.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'fa' ? 'موتور جمینای ۳.۸ / ۳.۵ آنلاین' : 'Gemini 3.8 / 3.5 Engine Online'}</span>
            </span>

            <a
              href="https://aistudio.google.com/u/1/apps/029930de-fdd0-42dc-8a8d-d9966e41815b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-sky-500 shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
              <span>{lang === 'fa' ? 'اپلیکیشن در Google AI Studio' : 'Open in Google AI Studio'}</span>
            </a>

            <button
              type="button"
              onClick={() => setShowStudioSettings(!showStudioSettings)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'تنظیمات API' : 'API Config'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible API Settings */}
        {showStudioSettings && (
          <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="password"
              value={customStudioKey}
              onChange={(e) => setCustomStudioKey(e.target.value)}
              placeholder={lang === 'fa' ? 'کلید API اختصاصی Google AI Studio (اختیاری)...' : 'Personal Google AI Studio API Key...'}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={saveStudioKey}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {lang === 'fa' ? 'ذخیره کلید' : 'Save Key'}
            </button>
            <button
              type="button"
              onClick={() => setShowStudioSettings(false)}
              className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 5-WAY SEGMENTED LAB SWITCHER                                          */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'آزمایشگاه و استودیوی مهندسی' : 'AI Engineering & Study Studio'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'fa'
              ? 'حل فرمول‌های LaTeX، شبیه‌ساز پایتون، تحلیل نقشه‌ها و مدارها، دستیار فاینمن و استخراج PDF'
              : 'LaTeX equation solver, Python simulations, circuit schematics, Feynman AI, and PDF slide extraction'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 self-start overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => onChangeTab('solver')}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'solver'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{lang === 'fa' ? 'حل فرمول LaTeX' : 'Formula Solver'}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('simulation')}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'simulation'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{lang === 'fa' ? 'شبیه‌ساز و پایتون استودیو' : 'Studio Simulation'}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('schematics')}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'schematics'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>{lang === 'fa' ? 'تحلیل مدار و دیاگرام' : 'Schematic Vision'}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('feynman')}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'feynman'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'fa' ? 'دستیار فاینمن' : 'Feynman AI'}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('pdf')}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>{lang === 'fa' ? 'استخراج اسلاید PDF' : 'PDF Extractor'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: FORMULA SOLVER (ORIGINAL & REFINED)                           */}
      {/* ===================================================================== */}
      {activeTab === 'solver' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form onSubmit={handleSolveFormula} className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ورودی مسئله مهندسی یا ریاضی' : 'Problem & Equation Input'}
              </h3>
              <select
                value={solverDomain}
                onChange={(e) => setSolverDomain(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
              >
                <option value="auto">{lang === 'fa' ? 'تشخیص خودکار حوزه' : 'Auto-detect Domain'}</option>
                <option value="calculus">{lang === 'fa' ? 'حساب دیفرانسیل و انتگرال' : 'Calculus & ODE'}</option>
                <option value="circuits">{lang === 'fa' ? 'تحلیل مدارهای الکتریکی' : 'Circuit Analysis'}</option>
                <option value="physics">{lang === 'fa' ? 'فیزیک و مکانیک تحلیلی' : 'Physics & Mechanics'}</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {solverPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSolverProblem(preset.text)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={solverProblem}
              onChange={(e) => setSolverProblem(e.target.value)}
              placeholder={
                lang === 'fa'
                  ? 'معادله انتگرال، مدار RLC یا مسئله فیزیک را بنویسید...'
                  : 'Enter your calculus equation, circuit problem, or physics derivation...'
              }
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 p-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                <ImagePlus className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>
                  {solverImage
                    ? solverImage.name
                    : lang === 'fa'
                    ? 'افزودن تصویر فرمول یا مدار (اختیاری)'
                    : 'Attach equation/circuit photo (optional)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSolverImagePick(e.target.files?.[0])}
                  className="hidden"
                />
              </label>
              {solverImage && (
                <button
                  type="button"
                  onClick={() => setSolverImage(null)}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={solverLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {solverLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              <span>
                {solverLoading
                  ? lang === 'fa' ? 'در حال استنتاج گام‌به‌گام...' : 'Deriving Step-by-Step...'
                  : lang === 'fa' ? 'حل گام‌به‌گام با LaTeX' : 'Solve with Step-by-Step LaTeX'}
              </span>
            </button>

            {solverError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{solverError}</span>
              </div>
            )}
          </form>

          <div className="lg:col-span-7 glass-surface rounded-3xl p-6 min-h-[420px]">
            {!solverResult && !solverLoading && (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center space-y-3 text-slate-500 dark:text-slate-400">
                <Calculator className="w-10 h-10 text-sky-500/70" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'fa' ? 'آماده استخراج اثبات گام‌به‌گام' : 'Ready for Rigorous Derivation'}
                </h4>
                <p className="text-sm max-w-md">
                  {lang === 'fa'
                    ? 'مسئله را وارد کنید یا یکی از نمونه‌های آماده را برگزینید تا تمام مراحل حل با رندر دقیق KaTeX نمایش داده شود.'
                    : 'Enter a problem or pick a preset to inspect every mathematical step rendered with crisp KaTeX typesetting.'}
                </p>
              </div>
            )}

            {solverLoading && (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center space-y-3 text-slate-600 dark:text-slate-300">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                <p className="text-sm font-medium">
                  {lang === 'fa' ? 'در حال بررسی شرایط اولیه، واحدها و اثبات جبری...' : 'Verifying boundary conditions & algebraic steps...'}
                </p>
              </div>
            )}

            {solverResult && !solverLoading && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    {solverResult.detectedDomain}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {solverResult.problemTitle}
                  </h3>
                </div>

                {solverResult.givenLatex && (
                  <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                      {lang === 'fa' ? 'مدل ریاضی مسئله:' : 'Problem Mathematical Formulation:'}
                    </span>
                    <LatexBlock latex={solverResult.givenLatex} />
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'fa' ? 'مراحل گام‌به‌گام استنتاج و حل:' : 'Step-by-Step Derivation Steps:'}
                  </h4>
                  {solverResult.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 space-y-2"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{lang === 'fa' ? `گام ${st.stepNumber}: ${st.title}` : `Step ${st.stepNumber}: ${st.title}`}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">{st.explanation}</p>
                      {st.latex && (
                        <div className="overflow-x-auto py-1">
                          <LatexBlock latex={st.latex} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    {lang === 'fa' ? 'پاسخ نهایی تحلیلی:' : 'Final Closed-Form Solution:'}
                  </span>
                  <div className="overflow-x-auto py-1">
                    <LatexBlock latex={solverResult.finalAnswerLatex} />
                  </div>
                </div>

                {solverResult.physicalIntuition && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                    <span className="font-bold block mb-1">
                      {lang === 'fa' ? '💡 بینش فیزیکی و تله امتحانی:' : '💡 Physical Intuition & Exam Pitfalls:'}
                    </span>
                    <p>{solverResult.physicalIntuition}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: GOOGLE AI STUDIO SIMULATION & PYTHON CODE EXECUTION           */}
      {/* ===================================================================== */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Discipline Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl glass-surface">
            {[
              { id: 'control', labelFa: 'سیستم‌های کنترل و برق (Control & Servos)', labelEn: 'Control & Electrical' },
              { id: 'mechanics', labelFa: 'مقاومت مصالح و خمش تیرها (Beam Mechanics)', labelEn: 'Beam Mechanics' },
              { id: 'fluids', labelFa: 'مکانیک سیالات و اصطکاک لوله‌ها (Fluid Dynamics)', labelEn: 'Fluid Dynamics' },
              { id: 'algorithms', labelFa: 'قضیه مستر و تحلیل الگوریتم (Algorithms)', labelEn: 'Algorithm Complexity' },
            ].map((disc) => (
              <button
                key={disc.id}
                type="button"
                onClick={() => {
                  setSimDiscipline(disc.id as any);
                  setSimResult(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  simDiscipline === disc.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'fa' ? disc.labelFa : disc.labelEn}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Control Panel & Parameters */}
            <div className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sky-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'تنظیم پارامترهای فیزیکی سیستم' : 'System Physical Parameters'}
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  NumPy / SciPy
                </span>
              </div>

              {/* Dynamic Parameter Sliders by Discipline */}
              {simDiscipline === 'control' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'فرکانس طبیعی (ω_n)' : 'Natural Frequency (omega_n)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{simControlParams.omega_n} rad/s</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.5"
                      value={simControlParams.omega_n}
                      onChange={(e) => setSimControlParams({ ...simControlParams, omega_n: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'ضریب میرایی (ζ)' : 'Damping Ratio (zeta)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">
                        {simControlParams.zeta} {simControlParams.zeta < 1 ? '(زیرمیرا)' : '(بیش‌میرا)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.5"
                      step="0.05"
                      value={simControlParams.zeta}
                      onChange={(e) => setSimControlParams({ ...simControlParams, zeta: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'بهره حلقه پیشرو (K)' : 'DC Loop Gain (K)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{simControlParams.K}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={simControlParams.K}
                      onChange={(e) => setSimControlParams({ ...simControlParams, K: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {simDiscipline === 'mechanics' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'طول دهانه تیر (L)' : 'Beam Span (L)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{simMechParams.L} m</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      step="0.5"
                      value={simMechParams.L}
                      onChange={(e) => setSimMechParams({ ...simMechParams, L: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'بار متمرکز وارد بر تیر (P)' : 'Point Load (P)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{simMechParams.P} kN</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      step="2"
                      value={simMechParams.P}
                      onChange={(e) => setSimMechParams({ ...simMechParams, P: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'مدول یانگ مصالح (E)' : 'Young Modulus (E)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{simMechParams.E} GPa (فولاد)</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="210"
                      step="10"
                      value={simMechParams.E}
                      onChange={(e) => setSimMechParams({ ...simMechParams, E: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {simDiscipline === 'fluids' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'قطر لوله انتقال (D)' : 'Pipe Diameter (D)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{simFluidParams.D} m (100 mm)</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.01"
                      value={simFluidParams.D}
                      onChange={(e) => setSimFluidParams({ ...simFluidParams, D: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'دبی حجمی جریان (Q)' : 'Volumetric Flow (Q)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{(simFluidParams.Q * 1000).toFixed(0)} L/s</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.2"
                      step="0.005"
                      value={simFluidParams.Q}
                      onChange={(e) => setSimFluidParams({ ...simFluidParams, Q: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {simDiscipline === 'algorithms' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'تعداد زیرمسئله‌ها (a)' : 'Subproblem Count (a)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{simAlgoParams.a}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={simAlgoParams.a}
                      onChange={(e) => setSimAlgoParams({ ...simAlgoParams, a: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{lang === 'fa' ? 'ضریب کاهش اندازه (b)' : 'Divisor Factor (b)'}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{simAlgoParams.b}</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      step="1"
                      value={simAlgoParams.b}
                      onChange={(e) => setSimAlgoParams({ ...simAlgoParams, b: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fa' ? 'هدف مهندسی سفارشی (اختیاری):' : 'Custom Engineering Objective (Optional):'}
                </label>
                <input
                  type="text"
                  value={simUserObjective}
                  onChange={(e) => setSimUserObjective(e.target.value)}
                  placeholder={
                    lang === 'fa'
                      ? 'مثلاً: بررسی فراجهش کمتر از ۱۰٪ با جبران‌ساز پیش‌فاز...'
                      : 'e.g., Target overshoot under 10% with lead compensation...'
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="button"
                onClick={runSimulation}
                disabled={simLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-60 text-white text-sm font-semibold shadow-md shadow-sky-600/25 transition-all cursor-pointer"
              >
                {simLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>
                  {simLoading
                    ? lang === 'fa' ? 'در حال اجرای شبیه‌سازی در گوگل استودیو...' : 'Running Studio Simulation...'
                    : lang === 'fa' ? 'اجرای زنده کدهای پایتون و شبیه‌سازی' : 'Run Python Simulation & Plot'}
                </span>
              </button>

              {simError && (
                <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{simError}</span>
                </div>
              )}
            </div>

            {/* Simulation Results Display */}
            <div className="lg:col-span-7 glass-surface rounded-3xl p-6 min-h-[460px] space-y-6">
              {simLoading && (
                <div className="min-h-[380px] flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === 'fa' ? 'اجرای محاسبات ماتریسی با SciPy و ترسیم پاسخ دینامیکی...' : 'Computing state matrices & plotting dynamic curves...'}
                  </p>
                </div>
              )}

              {simResult && !simLoading && (
                <>
                  {/* Top Bar with Title & View Switch */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {simResult.systemTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Engine: Python 3.12 · NumPy · SciPy Signal
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 self-start">
                      {[
                        { id: 'response', labelFa: 'نمودار پاسخ', labelEn: 'Response Curve' },
                        { id: 'code', labelFa: 'کد پایتون', labelEn: 'Python Code' },
                        { id: 'logs', labelFa: 'لاگ خروجی', labelEn: 'Execution Log' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSimViewMode(tab.id as any)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            simViewMode === tab.id
                              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {lang === 'fa' ? tab.labelFa : tab.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4 Performance Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {simResult.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-3 space-y-1"
                      >
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">{m.label}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">{m.value}</span>
                          <span className="text-xs text-slate-500">{m.unit}</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 line-clamp-1">{m.note}</span>
                      </div>
                    ))}
                  </div>

                  {/* View 1: Response Plot & Equations */}
                  {simViewMode === 'response' && (
                    <div className="space-y-4">
                      {/* Mathematical Model Card */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {lang === 'fa' ? 'مدل ریاضی و تابع تبدیل سیستم:' : 'Mathematical Model & Transfer Function:'}
                        </span>
                        <div className="overflow-x-auto">
                          <LatexBlock latex={simResult.transferFunctionOrEquation} />
                        </div>
                      </div>

                      {/* Interactive SVG Plot */}
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>{simResult.plotYLabel}</span>
                          <span>{simResult.plotXLabel}</span>
                        </div>
                        {renderSvgPlot(simResult.plotPoints)}
                      </div>

                      {/* Stability & Poles */}
                      {simResult.stabilityAnalysis && (
                        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{lang === 'fa' ? 'ارزیابی پایداری و قطب‌های سیستم:' : 'Stability & Poles Analysis:'}</span>
                          </div>
                          <LatexBlock latex={simResult.stabilityAnalysis.polesLatex} />
                          <p className="text-xs text-sky-900 dark:text-sky-200 font-medium mt-1">
                            {simResult.stabilityAnalysis.verdictFa}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* View 2: Python Code Editor */}
                  {simViewMode === 'code' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Python 3.12 Script</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(simResult.pythonCode)}
                          className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? (lang === 'fa' ? 'کپی شد!' : 'Copied!') : (lang === 'fa' ? 'کپی کد پایتون' : 'Copy Code')}</span>
                        </button>
                      </div>
                      <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
                        {simResult.pythonCode}
                      </pre>
                    </div>
                  )}

                  {/* View 3: Execution Output Log */}
                  {simViewMode === 'logs' && (
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Terminal Standard Output (stdout):</span>
                      <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-96 whitespace-pre-wrap">
                        {simResult.executionOutput}
                      </pre>
                    </div>
                  )}

                  {/* Engineering Insights */}
                  {simResult.engineeringInsights && (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-1">
                      <span className="font-bold block">
                        {lang === 'fa' ? '💡 بینش فیزیکی و توصیه بهینه‌سازی صنعتی:' : '💡 Engineering Insights & Optimization:'}
                      </span>
                      <p>{simResult.engineeringInsights}</p>
                      {simResult.practicalRecommendation && (
                        <p className="mt-1 font-semibold text-amber-800 dark:text-amber-300">
                          {simResult.practicalRecommendation}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: GOOGLE AI STUDIO MULTIMODAL SCHEMATIC ANALYZER                 */}
      {/* ===================================================================== */}
      {activeTab === 'schematics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Panel & Preset Schematics */}
            <div className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-sky-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'انتخاب یا بارگذاری دیاگرام مهندسی' : 'Select or Upload Schematic'}
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                  Multimodal Vision
                </span>
              </div>

              {/* 4 Authentic Engineering Preset Schematics */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fa' ? 'شماتیک‌های استاندارد دانشگاهی:' : 'Standard University Schematics:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'mosfet_cs', cat: 'analog_circuit', labelFa: 'تقویت‌کننده ماسفت (CS)', labelEn: 'MOSFET CS Amp' },
                    { key: 'free_body', cat: 'free_body', labelFa: 'دیاگرام جسم آزاد تیر (FBD)', labelEn: 'Beam FBD' },
                    { key: 'control_block', cat: 'control_block', labelFa: 'سیستم فیدبک و لید (Control)', labelEn: 'Lead Feedback' },
                    { key: 'truss', cat: 'truss_structure', labelFa: 'خرپای دوبعدی وارن (Truss)', labelEn: 'Warren Truss' },
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => {
                        setSchematicCategory(preset.cat as any);
                        setSchematicPresetKey(preset.key);
                        setSchematicImage(null);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-right transition-all cursor-pointer border ${
                        schematicPresetKey === preset.key && !schematicImage
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {lang === 'fa' ? preset.labelFa : preset.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image Upload for User's Schematics */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fa' ? 'یا بارگذاری تصویر مدار / دیاگرام خودتان:' : 'Or upload your circuit/diagram image:'}
                </label>
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                    <ImagePlus className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>
                      {schematicImage
                        ? schematicImage.name
                        : lang === 'fa'
                        ? 'انتخاب تصویر مدار، نقشه یا دیاگرام (PNG/JPG)'
                        : 'Choose schematic file (PNG/JPG)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSchematicImagePick(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  {schematicImage && (
                    <button
                      type="button"
                      onClick={() => setSchematicImage(null)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Inquiry Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fa' ? 'پرسش یا هدف تحلیلی از این دیاگرام:' : 'Analysis Target / Inquiry:'}
                </label>
                <textarea
                  rows={3}
                  value={schematicPrompt}
                  onChange={(e) => setSchematicPrompt(e.target.value)}
                  placeholder={
                    lang === 'fa'
                      ? 'مثلاً: استخراج معادلات KCL، محاسبه بهره ولتاژ سیگنال کوچک و بررسی اثر میلر...'
                      : 'e.g. Extract KCL equations, compute gain, and check Miller capacitor effect...'
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="button"
                onClick={runSchematicAnalysis}
                disabled={schematicLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 disabled:opacity-60 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
              >
                {schematicLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
                <span>
                  {schematicLoading
                    ? lang === 'fa' ? 'تحلیل چندوجهی با بینایی ماشین گوگل استودیو...' : 'Analyzing Schematic with Gemini Vision...'
                    : lang === 'fa' ? 'تحلیل چندوجهی مدار و استخراج معادلات' : 'Analyze Schematic & Extract Equations'}
                </span>
              </button>

              {schematicError && (
                <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{schematicError}</span>
                </div>
              )}
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7 glass-surface rounded-3xl p-6 min-h-[460px] space-y-6">
              {schematicLoading && (
                <div className="min-h-[380px] flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === 'fa' ? 'تشخیص گره‌ها، المان‌ها و استخراج معادلات حالت با Gemini Vision...' : 'Detecting circuit nodes, elements & state equations...'}
                  </p>
                </div>
              )}

              {schematicResult && !schematicLoading && (
                <>
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {schematicResult.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                      {schematicResult.schematicTitle}
                    </h3>
                  </div>

                  {/* Detected Nodes / Loops Chips */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {lang === 'fa' ? 'گره‌ها و المان‌های شناسایی شده در نقشه:' : 'Identified Schematic Nodes & Components:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {schematicResult.detectedNodesAndLoops.map((node, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {node}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Governing Physical Equations */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {lang === 'fa' ? 'معادلات حاکم بر مدار (قوانین فیزیکی KCL / KVL):' : 'Governing Physical Equations:'}
                    </h4>
                    {schematicResult.governingEquations.map((eq, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          <span>{eq.name}</span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {eq.physicalLaw}
                          </span>
                        </div>
                        <LatexBlock latex={eq.latex} />
                        <p className="text-xs text-slate-600 dark:text-slate-400">{eq.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Transfer Function / State Space Box */}
                  {schematicResult.stateSpaceOrTransferFunction && (
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        {lang === 'fa' ? 'رابطه تحلیلی نهایی / تابع تبدیل سیستم:' : 'Final Analytical Transfer Function:'}
                      </span>
                      <LatexBlock latex={schematicResult.stateSpaceOrTransferFunction} />
                    </div>
                  )}

                  {/* Step by Step Derivation */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {lang === 'fa' ? 'مراحل اثبات و حل مرحله‌به‌مرحله:' : 'Derivation Steps:'}
                    </h4>
                    {schematicResult.stepByStepDerivation.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 space-y-1.5"
                      >
                        <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                          {lang === 'fa' ? `گام ${st.stepNumber}: ${st.title}` : `Step ${st.stepNumber}: ${st.title}`}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{st.explanation}</p>
                        <LatexBlock latex={st.latex} />
                      </div>
                    ))}
                  </div>

                  {/* Design Rule Checks */}
                  {schematicResult.designRuleChecks && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {lang === 'fa' ? 'بررسی قواعد طراحی مهندسی (Design Rule Check):' : 'Design Rule Checks (DRC):'}
                      </span>
                      <div className="space-y-1.5">
                        {schematicResult.designRuleChecks.map((drc, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                              drc.status === 'pass'
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                            }`}
                          >
                            <span className="font-semibold">{drc.component}</span>
                            <span>{drc.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verdict & Optimization */}
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs sm:text-sm">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {lang === 'fa' ? 'جمع‌بندی مهندسی و پیشنهاد بهینه‌سازی:' : 'Engineering Verdict & Advice:'}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{schematicResult.finalEngineeringVerdict}</p>
                    {schematicResult.optimizationAdvice && (
                      <p className="text-sky-700 dark:text-sky-300 font-semibold mt-1">
                        {schematicResult.optimizationAdvice}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: FEYNMAN AI (ORIGINAL)                                          */}
      {/* ===================================================================== */}
      {activeTab === 'feynman' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form onSubmit={handleAskFeynman} className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'مفهوم علمی مورد نظر برای درک شهودی' : 'Feynman Conceptual Topic'}
            </h3>

            <input
              type="text"
              value={feynmanTopic}
              onChange={(e) => setFeynmanTopic(e.target.value)}
              placeholder={
                lang === 'fa'
                  ? 'مفهوم پیچیده (مثلاً تانسور تنش، تبدیل فوریه، آنتروپی...)'
                  : 'Enter complex topic (e.g., Stress tensor, Fourier transform...)'
              }
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 p-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                {lang === 'fa' ? 'سطح ساده‌سازی و تمثیل:' : 'Target Audience Level:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'child5', labelFa: 'کودک ۵ ساله', labelEn: '5-Year Old' },
                  { id: 'highschool', labelFa: 'دبیرستان', labelEn: 'High School' },
                  { id: 'undergrad', labelFa: 'دانشجو کارشناسی', labelEn: 'Undergraduate' },
                  { id: 'researcher', labelFa: 'پژوهشگر ارشد', labelEn: 'Researcher' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFeynmanLevel(lvl.id as any)}
                    className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      feynmanLevel === lvl.id
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {lang === 'fa' ? lvl.labelFa : lvl.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={feynmanLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {feynmanLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>
                {feynmanLoading
                  ? lang === 'fa' ? 'در حال ساخت تمثیل شهودی...' : 'Formulating Intuition...'
                  : lang === 'fa' ? 'توضیح به سبک فاینمن' : 'Explain with Feynman Method'}
              </span>
            </button>

            {feynmanError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feynmanError}</span>
              </div>
            )}
          </form>

          <div className="lg:col-span-7 glass-surface rounded-3xl p-6 min-h-[420px]">
            {!feynmanResult && !feynmanLoading && (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center space-y-3 text-slate-500 dark:text-slate-400">
                <Sparkles className="w-10 h-10 text-sky-500/70" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'fa' ? 'تکنیک فاینمن: اگر نتوانی ساده توضیح دهی، آن را نفهمیده‌ای' : 'Feynman Technique: Real Understanding is Simple'}
                </h4>
                <p className="text-sm max-w-md">
                  {lang === 'fa'
                    ? 'هر مفهوم مهندسی را وارد کنید تا با تمثیل‌های ملموس زندگی واقعی و بدون اصطلاحات گیج‌کننده تبیین شود.'
                    : 'Enter any engineering subject to receive vivid analogies and intuitive explanations stripped of jargon.'}
                </p>
              </div>
            )}

            {feynmanLoading && (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center space-y-3 text-slate-600 dark:text-slate-300">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                <p className="text-sm font-medium">
                  {lang === 'fa' ? 'در حال یافتن بهترین تمثیل فیزیکی و حذف پیچیدگی‌های غیرضروری...' : 'Finding physical analogies and distilling core principles...'}
                </p>
              </div>
            )}

            {feynmanResult && !feynmanLoading && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {feynmanResult.title}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 text-sky-950 dark:text-sky-100 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                    {lang === 'fa' ? 'تمثیل کلیدی (Analogy):' : 'Key Real-World Analogy:'}
                  </span>
                  <p className="text-sm sm:text-base font-medium">{feynmanResult.analogy}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'fa' ? 'توضیح مفهومی بدون اصطلاحات پیچیده:' : 'Conceptual Explanation:'}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {feynmanResult.simpleExplanation}
                  </p>
                </div>

                {feynmanResult.keyFormulaLatex && (
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                      {lang === 'fa' ? 'فرمول اصلی مرتبط:' : 'Core Associated Formula:'}
                    </span>
                    <LatexBlock latex={feynmanResult.keyFormulaLatex} />
                  </div>
                )}

                {feynmanResult.commonMisconception && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs sm:text-sm text-rose-900 dark:text-rose-200">
                    <span className="font-bold block mb-1">
                      {lang === 'fa' ? '⚠️ باور غلط متداول بین دانشجویان:' : '⚠️ Common Student Misconception:'}
                    </span>
                    <p>{feynmanResult.commonMisconception}</p>
                  </div>
                )}

                {feynmanResult.selfCheckQuestion && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                    <span className="font-bold block mb-1">
                      {lang === 'fa' ? '🎯 پرسش خودآزمایی برای سنجش درک عمیق:' : '🎯 Self-Check Comprehension Question:'}
                    </span>
                    <p>{feynmanResult.selfCheckQuestion}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: PDF SLIDE & NOTE EXTRACTOR (ORIGINAL)                         */}
      {/* ===================================================================== */}
      {activeTab === 'pdf' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'بارگذاری اسلاید یا متن جزوه' : 'Upload Slides or Paste Notes'}
            </h3>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setPdfDragOver(true);
              }}
              onDragLeave={() => setPdfDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setPdfDragOver(false);
                handleProcessPdfFile(e.dataTransfer.files?.[0]);
              }}
              className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
                pdfDragOver
                  ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30'
                  : 'border-slate-300 dark:border-slate-700 hover:border-sky-400'
              }`}
            >
              <label className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                <FileUp className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {uploadedFile
                    ? `${uploadedFile.name} (${uploadedFile.sizeLabel})`
                    : lang === 'fa'
                    ? 'فایل PDF، اسلاید یا TXT را اینجا بکشید'
                    : 'Drag & drop PDF, slides, or TXT file here'}
                </span>
                <span className="text-xs text-slate-500">
                  {lang === 'fa' ? 'یا برای انتخاب فایل کلیک کنید' : 'or click to browse'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.pptx"
                  onChange={(e) => handleProcessPdfFile(e.target.files?.[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {lang === 'fa' ? 'یا متن جزوه را مستقیم پیست کنید:' : 'Or paste lecture text directly:'}
              </label>
              <textarea
                rows={4}
                value={pastedNotes}
                onChange={(e) => setPastedNotes(e.target.value)}
                placeholder={
                  lang === 'fa'
                    ? 'متن اسلایدها یا جزوه درسی را اینجا قرار دهید...'
                    : 'Paste slide transcripts or notes here...'
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="button"
              onClick={handleExtractPdf}
              disabled={pdfLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              <span>
                {pdfLoading
                  ? lang === 'fa' ? 'در حال استخراج اسلاید و ساخت فلش‌کارت...' : 'Extracting Slides & Generating Cards...'
                  : lang === 'fa' ? 'استخراج خلاصه، فرمول‌ها و سوالات' : 'Extract Summary, Formulas & Exam QA'}
              </span>
            </button>

            {pdfError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pdfError}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 glass-surface rounded-3xl p-6 min-h-[420px]">
            {!pdfResult && !pdfLoading && (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center space-y-3 text-slate-500 dark:text-slate-400">
                <FileUp className="w-10 h-10 text-sky-500/70" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'fa' ? 'آماده استخراج خودکار اسلایدهای درسی' : 'Ready to Extract Lecture Slides'}
                </h4>
                <p className="text-sm max-w-md">
                  {lang === 'fa'
                    ? 'فایل اسلاید درس را بارگذاری کنید تا هوش مصنوعی خلاصه مفهومی، فرمول‌های کلیدی، فلش‌کارت‌ها و نمونه سوالات امتحانی را استخراج کند.'
                    : 'Upload your lecture slide deck to automatically extract key concepts, formulas, active-recall flashcards, and exam questions.'}
                </p>
              </div>
            )}

            {pdfLoading && (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center space-y-3 text-slate-600 dark:text-slate-300">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                <p className="text-sm font-medium">
                  {lang === 'fa' ? 'در حال تحلیل متن اسلایدها و استخراج فرمول‌ها و سوالات...' : 'Parsing slides, isolating mathematical expressions and synthesizing flashcards...'}
                </p>
              </div>
            )}

            {pdfResult && !pdfLoading && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {pdfResult.documentTitle}
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 self-start">
                    {[
                      { id: 'summary', labelFa: 'خلاصه و فرمول‌ها', labelEn: 'Summary & Formulas' },
                      { id: 'flashcards', labelFa: `فلش‌کارت‌ها (${pdfResult.flashcards.length})`, labelEn: `Cards (${pdfResult.flashcards.length})` },
                      { id: 'exam', labelFa: `نمونه سوال (${pdfResult.examQuestions.length})`, labelEn: `Exam (${pdfResult.examQuestions.length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPdfViewTab(tab.id as any)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          pdfViewTab === tab.id
                            ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {lang === 'fa' ? tab.labelFa : tab.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {pdfViewTab === 'summary' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {pdfResult.summary}
                    </p>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {lang === 'fa' ? 'مفاهیم کلیدی استخراج‌شده:' : 'Extracted Key Concepts:'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {pdfResult.keyConcepts.map((kc, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs font-medium rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                          >
                            {kc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {lang === 'fa' ? 'فرمول‌های مهم این جلسه:' : 'Essential Formulas:'}
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {pdfResult.keyFormulas.map((kf, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-1"
                          >
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{kf.name}</span>
                            <LatexBlock latex={kf.latex} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {pdfViewTab === 'flashcards' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {lang === 'fa' ? 'فلش‌کارت‌های استاندارد آزمون فعال' : 'Active Recall Study Flashcards'}
                      </span>
                      <button
                        type="button"
                        onClick={handleExportFlashcards}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'انتقال به جعبه لایتنر' : 'Export to Leitner Box'}</span>
                      </button>
                    </div>

                    {importedFlashcardsBanner && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-medium">
                        {lang === 'fa'
                          ? '✓ فلش‌کارت‌ها با موفقیت به جعبه لایتنر شما افزوده شدند!'
                          : '✓ Flashcards successfully imported into your Leitner Box!'}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pdfResult.flashcards.map((fc, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 block mb-1">
                              {lang === 'fa' ? `کارت ${i + 1}` : `Card ${i + 1}`}
                            </span>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">{fc.front}</p>
                          </div>
                          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                            <p>{fc.back}</p>
                            {fc.formulaLatex && (
                              <div className="mt-1">
                                <LatexBlock latex={fc.formulaLatex} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pdfViewTab === 'exam' && (
                  <div className="space-y-3">
                    {pdfResult.examQuestions.map((eq, idx) => {
                      const shown = !!revealedAnswers[idx];
                      return (
                        <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 space-y-2.5">
                          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              {lang === 'fa' ? `سوال ${idx + 1}` : `Question ${idx + 1}`} · {eq.difficulty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                              className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{shown ? (lang === 'fa' ? 'پنهان کردن پاسخ' : 'Hide Answer') : (lang === 'fa' ? 'نمایش پاسخ تشریحی' : 'Reveal Answer')}</span>
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{eq.question}</p>
                          {shown && (
                            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-sm text-emerald-800 dark:text-emerald-200">
                              {eq.modelAnswer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
