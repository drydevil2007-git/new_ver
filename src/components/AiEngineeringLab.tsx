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
} from 'lucide-react';
import { Lang, LeitnerCard } from '../types/app';
import { LatexBlock } from './MathRenderer';

export type LabTab = 'solver' | 'feynman' | 'pdf';

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

export const AiEngineeringLab: React.FC<AiEngineeringLabProps> = ({
  lang,
  activeTab,
  onChangeTab,
  initialFeynmanTopic,
  onImportFlashcards,
}) => {
  // 1. Formula Solver State
  const [solverProblem, setSolverProblem] = useState(
    'یک مدار سری RLC با R = 4 Ω، L = 1 H و C = 0.04 F به یک منبع پله 10 ولت متصل است. معادله دیفرانسیل جریان i(t) و پاسخ طبیعی/کامل را در شرایط اولیه صفر استخراج کن.'
  );
  const [solverDomain, setSolverDomain] = useState('auto');
  const [solverImage, setSolverImage] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [solverLoading, setSolverLoading] = useState(false);
  const [solverError, setSolverError] = useState<string | null>(null);
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);

  // 2. Feynman State
  const [feynmanTopic, setFeynmanTopic] = useState(
    initialFeynmanTopic || 'تبدیل لاپلاس و قطب‌های پایداری سیستم'
  );
  const [feynmanLevel, setFeynmanLevel] = useState<'child5' | 'highschool' | 'undergrad' | 'researcher'>('undergrad');
  const [feynmanLoading, setFeynmanLoading] = useState(false);
  const [feynmanError, setFeynmanError] = useState<string | null>(null);
  const [feynmanResult, setFeynmanResult] = useState<FeynmanResult | null>(null);

  // 3. PDF Slide / Note Extractor State
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
      setRevealedAnswers({});
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'خطای ارتباط با سرور');
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePushExtractedToLeitner = () => {
    if (!pdfResult?.flashcards?.length) return;
    onImportFlashcards(
      pdfResult.flashcards.map((fc) => ({
        front: fc.front,
        back: fc.back,
        formulaLatex: fc.formulaLatex,
        deck: pdfResult.documentTitle || (lang === 'fa' ? 'اسلاید استخراج‌شده' : 'Extracted Slides'),
      }))
    );
    setImportedFlashcardsBanner(true);
  };

  return (
    <div className="space-y-6">
      {/* Header + Segmented Lab Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'آزمایشگاه هوش مصنوعی مهندسی' : 'AI Engineering & Study Studio'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'fa'
              ? 'حل گام‌به‌گام معادلات با LaTeX، دستیار شهودی فاینمن و استخراج هوشمند اسلایدهای PDF'
              : 'Step-by-step LaTeX formula solver, Feynman concept intuition, and smart PDF slide extraction'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 self-start overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => onChangeTab('solver')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
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
            onClick={() => onChangeTab('feynman')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
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
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
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
      {/* TAB 1: AI Math & Engineering Formula Solver                           */}
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

            {/* Optional Image Upload of handwritten / printed problem */}
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

          {/* Derivation Output Stage */}
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
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-medium text-sky-600 dark:text-sky-400">{solverResult.detectedDomain}</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{solverResult.problemTitle}</h3>
                  </div>
                </div>

                {solverResult.givenLatex && (
                  <div className="rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3.5">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {lang === 'fa' ? 'مفروضات و معادلات پایه' : 'Given Parameters'}
                    </div>
                    <LatexBlock math={solverResult.givenLatex} displayMode={true} className="text-sm text-slate-900 dark:text-white my-0" />
                  </div>
                )}

                <div className="space-y-4">
                  {solverResult.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center tabular-nums">
                          {step.stepNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{step.title}</h4>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.explanation}</p>
                      {step.latex && (
                        <div className="rounded-xl bg-slate-100/90 dark:bg-slate-950/70 px-3 py-2 border border-slate-200/70 dark:border-slate-800">
                          <LatexBlock math={step.latex} displayMode={true} className="text-sm text-slate-900 dark:text-slate-100 my-0" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Final Boxed Result */}
                <div className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300/70 dark:border-emerald-800/70 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'پاسخ نهایی تاییدشده' : 'Verified Final Result'}</span>
                  </div>
                  <LatexBlock math={solverResult.finalAnswerLatex} displayMode={true} className="text-base text-slate-900 dark:text-white my-1" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                    {solverResult.physicalIntuition}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: Feynman AI Study Assistant                                     */}
      {/* ===================================================================== */}
      {activeTab === 'feynman' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form onSubmit={handleAskFeynman} className="lg:col-span-4 glass-surface rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'دستیار یادگیری به روش فاینمن' : 'Feynman Study Assistant'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'fa'
                ? 'هر مفهوم سخت فیزیک، مدار، ترمودینامیک یا الگوریتم را وارد کنید تا با مثال ملموس و زبان ساده تشریح شود.'
                : 'Enter any complex engineering or physics concept to receive an intuitive analogy, plain breakdown, and real-world example.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'fa' ? 'موضوع یا مفهوم درسی' : 'Concept or Course Topic'}
              </label>
              <input
                type="text"
                value={feynmanTopic}
                onChange={(e) => setFeynmanTopic(e.target.value)}
                placeholder={lang === 'fa' ? 'مثلاً: آنتروپی در قانون دوم ترمودینامیک' : 'e.g. Entropy in Thermodynamics'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'fa' ? 'سطح عمق توضیح (۴ لایه فاینمن)' : 'Multi-Level Feynman Depth'}
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                {(
                  [
                    { id: 'child5', fa: 'کودک ۵ ساله', en: '5-Year-Old' },
                    { id: 'highschool', fa: 'دبیرستانی', en: 'High School' },
                    { id: 'undergrad', fa: 'کارشناسی', en: 'Undergrad' },
                    { id: 'researcher', fa: 'پژوهشگر ارشد', en: 'Researcher' },
                  ] as const
                ).map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFeynmanLevel(lvl.id)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      feynmanLevel === lvl.id
                        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'fa' ? lvl.fa : lvl.en}
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
              <span>{lang === 'fa' ? 'تشریح به زبان فاینمن' : 'Explain with Feynman Technique'}</span>
            </button>

            {feynmanError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feynmanError}</span>
              </div>
            )}
          </form>

          <div className="lg:col-span-8 glass-surface rounded-3xl p-6 min-h-[400px]">
            {!feynmanResult && !feynmanLoading && (
              <div className="h-full min-h-[340px] flex flex-col items-center justify-center text-center space-y-3 text-slate-500 dark:text-slate-400">
                <Sparkles className="w-10 h-10 text-sky-500/70" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'fa' ? 'یادگیری عمیق بدون حفظ‌کردن طوطی‌وار' : 'Deep Understanding Without Rote Memorization'}
                </h4>
                <p className="text-sm max-w-md">
                  {lang === 'fa'
                    ? 'یک موضوع مهندسی را ارسال کنید تا تشبیه روزمره، کاربرد صنعتی، اشتباه رایج دانشجویان و فرمول کلیدی آن نمایش داده شود.'
                    : 'Submit any STEM topic to see a relatable analogy, real-world engineering example, common pitfall, and core LaTeX formula.'}
                </p>
              </div>
            )}

            {feynmanLoading && (
              <div className="h-full min-h-[340px] flex flex-col items-center justify-center space-y-3 text-slate-600 dark:text-slate-300">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                <p className="text-sm font-medium">
                  {lang === 'fa' ? 'در حال ساخت تشبیه ملموس و تحلیل مهندسی...' : 'Crafting intuitive analogy and engineering breakdown...'}
                </p>
              </div>
            )}

            {feynmanResult && !feynmanLoading && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
                  {feynmanResult.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-800/60 p-4 space-y-1.5">
                    <div className="text-xs font-bold text-sky-700 dark:text-sky-400">
                      {lang === 'fa' ? 'تشبیه ساده و ملموس' : 'Intuitive Analogy'}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{feynmanResult.analogy}</p>
                  </div>

                  <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 p-4 space-y-1.5">
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400">
                      {lang === 'fa' ? 'تله رایج در امتحان' : 'Common Misconception'}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{feynmanResult.commonMisconception}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {lang === 'fa' ? 'توضیح گام‌به‌گام به زبان ساده' : 'Plain-Language Explanation'}
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed">
                    {feynmanResult.simpleExplanation}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {lang === 'fa' ? 'کاربرد واقعی در صنعت و مهندسی' : 'Real-World Engineering Application'}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{feynmanResult.realWorldExample}</p>
                </div>

                {feynmanResult.keyFormulaLatex && (
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {lang === 'fa' ? 'رابطه ریاضی بنیادین' : 'Key Governing Equation'}
                    </div>
                    <LatexBlock math={feynmanResult.keyFormulaLatex} displayMode={true} className="text-base text-slate-900 dark:text-white my-0" />
                  </div>
                )}

                <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 p-4">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    {lang === 'fa' ? 'پرسش خودآزمایی فاینمن' : 'Feynman Self-Check Question'}
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-100">{feynmanResult.selfCheckQuestion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: Smart PDF Slide / Note Extractor                               */}
      {/* ===================================================================== */}
      {activeTab === 'pdf' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'استخراج هوشمند از اسلاید PDF یا جزوه' : 'Smart PDF Slide & Note Extractor'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'fa'
                ? 'فایل PDF اسلاید درس، عکس تخته استاد یا فایل متنی جزوه را بکشید و رها کنید تا خلاصه، فرمول‌ها، فلش‌کارت و سوالات امتحانی تولید شود.'
                : 'Drag and drop lecture PDFs, slide screenshots, or text notes to generate structured summaries, LaTeX equations, flashcards, and exam questions.'}
            </p>

            {/* Drag & Drop Zone */}
            <label
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
              className={`block rounded-2xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
                pdfDragOver
                  ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40'
                  : 'border-slate-300 dark:border-slate-700 hover:border-sky-400'
              }`}
            >
              <FileUp className="w-8 h-8 text-sky-600 dark:text-sky-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {uploadedFile
                  ? `${uploadedFile.name} (${uploadedFile.sizeLabel})`
                  : lang === 'fa'
                  ? 'فایل PDF، تصویر اسلاید یا TXT را اینجا رها کنید یا کلیک کنید'
                  : 'Drop PDF, Slide Image, or TXT here (or click to browse)'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'fa' ? 'پشتیبانی از PDF، PNG، JPG، TXT و MD' : 'Supports PDF, PNG, JPG, TXT, MD'}
              </div>
              <input
                type="file"
                accept=".pdf,.txt,.md,image/*"
                onChange={(e) => handleProcessPdfFile(e.target.files?.[0])}
                className="hidden"
              />
            </label>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'fa' ? 'یا متن جزوه / سرفصل اسلاید را اینجا بچسبانید' : 'Or paste lecture slide text directly'}
              </label>
              <textarea
                rows={4}
                value={pastedNotes}
                onChange={(e) => setPastedNotes(e.target.value)}
                placeholder={
                  lang === 'fa'
                    ? 'مثلاً متن اسلایدهای کنترل خطی: معیار پایداری راث-هورویتز برای بررسی ریشه‌های سمت راست صفحه مختلط...'
                    : 'Paste slide text or lecture excerpt here...'
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="button"
              onClick={handleExtractPdf}
              disabled={pdfLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>
                {pdfLoading
                  ? lang === 'fa' ? 'در حال استخراج مفاهیم و سوالات...' : 'Extracting Summaries & Questions...'
                  : lang === 'fa' ? 'استخراج خلاصه، فلش‌کارت و سوال امتحانی' : 'Extract Summary, Flashcards & Exam'}
              </span>
            </button>

            {pdfError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl">
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
                  {lang === 'fa' ? 'تبدیل اسلاید خام به بسته یادگیری فعال' : 'Turn Raw Slides into an Active Study Pack'}
                </h4>
                <p className="text-sm max-w-md">
                  {lang === 'fa'
                    ? 'پس از بارگذاری اسلاید، خروجی در سه بخش خلاصه، فلش‌کارت آماده ورود به جعبه لایتنر و سوالات امتحانی دسته‌بندی می‌شود.'
                    : 'Upload any lecture PDF or image to unlock structured summaries, one-click Leitner flashcards, and practice exam questions.'}
                </p>
              </div>
            )}

            {pdfLoading && (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center space-y-3 text-slate-600 dark:text-slate-300">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                <p className="text-sm font-medium">
                  {lang === 'fa' ? 'در حال تحلیل اسلایدها و فرمول‌ها...' : 'Analyzing slides, equations, and key concepts...'}
                </p>
              </div>
            )}

            {pdfResult && !pdfLoading && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{pdfResult.documentTitle}</h3>
                  <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    {(
                      [
                        { id: 'summary', fa: 'خلاصه و فرمول‌ها', en: 'Summary' },
                        { id: 'flashcards', fa: `فلش‌کارت (${pdfResult.flashcards.length})`, en: `Cards (${pdfResult.flashcards.length})` },
                        { id: 'exam', fa: `سوالات امتحان (${pdfResult.examQuestions.length})`, en: `Exam (${pdfResult.examQuestions.length})` },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPdfViewTab(t.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                          pdfViewTab === t.id
                            ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {lang === 'fa' ? t.fa : t.en}
                      </button>
                    ))}
                  </div>
                </div>

                {pdfViewTab === 'summary' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{pdfResult.summary}</p>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {lang === 'fa' ? 'مفاهیم کلیدی استخراج‌شده' : 'Extracted Core Concepts'}
                      </div>
                      <ul className="space-y-1.5 text-sm text-slate-800 dark:text-slate-100">
                        {pdfResult.keyConcepts.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono text-xs text-sky-600 dark:text-sky-400 mt-1">{idx + 1}.</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {pdfResult.keyFormulas.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pdfResult.keyFormulas.map((f, idx) => (
                          <div key={idx} className="rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3">
                            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">{f.name}</div>
                            <LatexBlock math={f.latex} displayMode={true} className="text-xs text-slate-900 dark:text-white my-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {pdfViewTab === 'flashcards' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {lang === 'fa'
                          ? 'تمام این فلش‌کارت‌ها آماده انتقال مستقیم به جعبه لایتنر شما هستند.'
                          : 'Import all extracted cards directly into your Leitner spaced-repetition box.'}
                      </p>
                      <button
                        type="button"
                        onClick={handlePushExtractedToLeitner}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'افزودن همه به جعبه لایتنر' : 'Add All to Leitner Box'}</span>
                      </button>
                    </div>

                    {importedFlashcardsBanner && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          {lang === 'fa'
                            ? 'فلش‌کارت‌ها با موفقیت به جعبه ۱ لایتنر در بخش «جعبه یادگیری» اضافه شدند!'
                            : 'Flashcards added to Box 1 in your Study Deck!'}
                        </span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {pdfResult.flashcards.map((fc, idx) => (
                        <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 space-y-2">
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{fc.front}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">{fc.back}</div>
                          {fc.formulaLatex && (
                            <LatexBlock math={fc.formulaLatex} displayMode={true} className="text-xs text-sky-700 dark:text-sky-300 my-0" />
                          )}
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
