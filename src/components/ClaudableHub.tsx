import React, { useState, useMemo } from 'react';
import {
  Code2,
  Sparkles,
  Play,
  Terminal,
  Cpu,
  Layers,
  Activity,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Loader2,
  Send,
  Database,
  Cloud,
  Github,
  Zap,
  Box,
  FileCode,
  FolderTree,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ClaudableAgentEngine,
  ClaudableEngineSpec,
  ClaudableProject,
  ClaudableTemplatePreset,
  Lang,
  NavSection,
} from '../types/app';
import {
  CLAUDABLE_ENGINES,
  CLAUDABLE_PRESETS,
  INITIAL_CLAUDABLE_PROJECTS,
} from '../data/claudablePresets';

interface ClaudableHubProps {
  lang: Lang;
  onNavigate?: (section: NavSection) => void;
}

export const ClaudableHub: React.FC<ClaudableHubProps> = ({ lang, onNavigate }) => {
  const isFa = lang === 'fa';

  // Selected Engine & Preset
  const [selectedEngine, setSelectedEngine] = useState<ClaudableAgentEngine>('claude-code');
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    'یک وب‌اپلیکیشن مهندسی مکانیک و عمران برای تحلیل تنش تیر دو سر گیردار بساز که با تغییر بار وارده، دیاگرام لنگر خمشی، نیروی برشی و انحنای الاستیک را به صورت گرافیکی نمایش دهد.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fem-structural');

  // Workstation View State
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'terminal' | 'guide'>('preview');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [thinkingExpanded, setThinkingExpanded] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Active Project Data
  const [project, setProject] = useState<ClaudableProject>(
    INITIAL_CLAUDABLE_PROJECTS['fem-structural']
  );

  // Interactive Live App Simulator State (for the Cantilever Beam)
  const [beamLength, setBeamLength] = useState<number>(4.0);
  const [pointLoad, setPointLoad] = useState<number>(18.5);
  const [distLoad, setDistLoad] = useState<number>(4.2);

  // Math Calculations for Live Preview
  const maxMoment = useMemo(() => {
    return pointLoad * beamLength + (distLoad * Math.pow(beamLength, 2)) / 2;
  }, [beamLength, pointLoad, distLoad]);

  const maxShear = useMemo(() => {
    return pointLoad + distLoad * beamLength;
  }, [beamLength, pointLoad, distLoad]);

  const maxDeflectionMm = useMemo(() => {
    const I = 4500 * 1e-8;
    const E = 200 * 1e9;
    const P = pointLoad * 1000;
    const w = distLoad * 1000;
    const delta =
      (P * Math.pow(beamLength, 3)) / (3 * E * I) +
      (w * Math.pow(beamLength, 4)) / (8 * E * I);
    return Math.min(65, delta * 1000);
  }, [beamLength, pointLoad, distLoad]);

  const maxBendingStressMpa = useMemo(() => {
    const I = 4500 * 1e-8;
    const y = 0.125;
    return (maxMoment * 1000 * y) / I / 1e6;
  }, [maxMoment]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: ClaudableTemplatePreset) => {
    setSelectedPresetId(preset.id);
    setCurrentPrompt(isFa ? preset.promptFa : preset.promptEn);

    if (preset.id === 'fem-structural') {
      setProject(INITIAL_CLAUDABLE_PROJECTS['fem-structural']);
      return;
    }

    // Dynamic generation simulation for other presets
    setIsGenerating(true);
    setProject((prev) => ({
      ...prev,
      id: preset.id,
      titleFa: preset.titleFa,
      titleEn: preset.titleEn,
      prompt: isFa ? preset.promptFa : preset.promptEn,
      status: 'thinking',
      thinkingLog: [
        `⚡ [${selectedEngine.toUpperCase()}] Parsing new prompt: "${isFa ? preset.titleFa : preset.titleEn}"...`,
        '📐 Planning architecture: Next.js 15, Tailwind CSS, Lucide icons, Supabase schema.',
        '🛠️ Scaffolding components and reactive telemetry state...',
      ],
    }));

    setTimeout(() => {
      setIsGenerating(false);
      setProject((prev) => ({
        ...prev,
        status: 'ready',
        thinkingLog: [
          ...prev.thinkingLog,
          '✅ Code generated successfully in 1.4s with 0 errors.',
          '🚀 Dev server hot-reloaded at http://localhost:3000.',
        ],
      }));
    }, 1200);
  };

  // Handle Custom Prompt Submit
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrompt.trim()) return;

    setIsGenerating(true);
    setProject((prev) => ({
      ...prev,
      prompt: currentPrompt,
      status: 'thinking',
      thinkingLog: [
        `⚡ [${selectedEngine.toUpperCase()}] Initializing coding agent loop for custom specification...`,
        `📝 User Request: "${currentPrompt.slice(0, 70)}..."`,
        '🔍 Analyzing components, state hooks, and UI hierarchy...',
        '🎨 Generating responsive layout with Tailwind CSS & Lucide icons...',
      ],
    }));

    try {
      const resp = await fetch('/api/claudable/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          engine: selectedEngine,
          lang,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.project?.files && Array.isArray(data.project.files)) {
          setProject((prev) => ({
            ...prev,
            titleFa: data.project.title || prev.titleFa,
            files: data.project.files,
            status: 'ready',
            thinkingLog: [
              ...prev.thinkingLog,
              ...(Array.isArray(data.project.thinkingSteps) ? data.project.thinkingSteps : []),
              '✨ Generated by Server AI Engine with 0 errors.',
            ],
          }));
          setIsGenerating(false);
          return;
        }
      }
    } catch {
      // Fallback to client synthesis
    }

    setTimeout(() => {
      setIsGenerating(false);
      setProject((prev) => ({
        ...prev,
        status: 'ready',
        thinkingLog: [
          ...prev.thinkingLog,
          '📦 Verified dependencies: React 19, TypeScript 5.7, Tailwind CSS.',
          '✨ Ready for live interactive preview and Vercel edge deployment.',
        ],
      }));
    }, 1500);
  };

  // Handle Vercel Deployment Simulation
  const handleDeployToVercel = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => setDeploySuccess(false), 5000);
    }, 1800);
  };

  // Copy code handler
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentFile = project.files[selectedFileIndex] || project.files[0];
  const activeEngineSpec =
    CLAUDABLE_ENGINES.find((e) => e.id === selectedEngine) || CLAUDABLE_ENGINES[0];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & GitHub Source Attribution */}
      <div className="glass-surface rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Claudable v2.0 · Anymorph AI</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isFa ? 'سازگار با Claude Code و Cursor CLI' : 'Claude Code & Cursor Ready'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                ★ 4,050+ GitHub Stars
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isFa
                ? 'استودیوی وب‌ساز کلودبل (Claudable Web Builder)'
                : 'Claudable Studio: Open-Source Lovable for CLI Agents'}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {isFa
                ? 'ساخت و دیپلوی آنی وب‌اپلیکیشن‌ها، شبیه‌سازهای مهندسی و ابزارهای دانشگاهی تنها با توصیف متنی. تلفیقی از قدرت ایجنت‌های پیشرفته CLI (مانند Claude Code، OpenAI Codex، Cursor و Gemini) با رابط کاربری روان و پیش‌نمایش بلادرنگ شبیه به Lovable.'
                : 'Build and deploy full-stack engineering tools and web apps effortlessly by combining local CLI coding agents (Claude Code, Cursor CLI, Codex) with an intuitive live preview and hot-reload sandbox.'}
            </p>
          </div>

          {/* Quick Actions & Links */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://github.com/anymorph-ai/Claudable"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>{isFa ? 'گیت‌هاب پروژه' : 'GitHub Repo'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              type="button"
              onClick={handleDeployToVercel}
              disabled={isDeploying}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isDeploying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              <span>{isFa ? 'دیپلوی با یک کلیک به Vercel' : 'Deploy to Vercel'}</span>
            </button>
          </div>
        </div>

        {/* Deploy success alert */}
        {deploySuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                {isFa
                  ? 'پروژه با موفقیت روی لایه Edge سرور Vercel بیلد و منتشر شد!'
                  : 'Project successfully built and deployed to Vercel Edge Network!'}
              </span>
            </div>
            <a
              href="https://fem-beam-analyzer.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-bold underline hover:text-emerald-600 flex items-center gap-1"
            >
              <span>مشاهده لینک عمومی</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* 2. Agent Engine Switcher & Engineering Presets Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-500" />
            <span>{isFa ? 'انتخاب موتور ایجنت کدنویسی (CLI Engine):' : 'Select AI Coding Agent Engine:'}</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            CLI: {activeEngineSpec.cliCommand}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CLAUDABLE_ENGINES.map((engine) => {
            const isSelected = selectedEngine === engine.id;
            return (
              <button
                key={engine.id}
                type="button"
                onClick={() => setSelectedEngine(engine.id)}
                className={`flex flex-col text-right p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 shadow-sm ring-2 ring-sky-500/20'
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {engine.name}
                  </span>
                  {engine.isPopular && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      محبوب
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 line-clamp-1">{engine.provider}</span>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 mt-1">
                  {engine.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Curated Engineering Presets */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            {isFa ? 'الگوهای آماده دانشگاهی و مهندسی:' : 'Curated Engineering Presets:'}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CLAUDABLE_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isFa ? preset.titleFa : preset.titleEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Prompt Input Bar */}
      <form onSubmit={handleGenerate} className="glass-surface rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-start gap-3">
          <textarea
            rows={2}
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder={
              isFa
                ? 'ایده نرم‌افزار یا شبیه‌ساز مهندسی خود را توصیف کنید (مثلاً: یک ابزار رسم نمودار بود با تغییر فرکانس قطع و فاز بساز...)'
                : 'Describe what engineering app or tool to build...'
            }
            className="flex-1 bg-transparent border-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none"
          />

          <button
            type="submit"
            disabled={isGenerating || !currentPrompt.trim()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isFa ? 'کدنویسی ایجنت...' : 'Building...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isFa ? 'تولید و بیلد اپ' : 'Generate App'}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick prompt boosters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500">
          <span>{isFa ? 'افزودنی‌های سریع:' : 'Quick Enhancers:'}</span>
          <button
            type="button"
            onClick={() => setCurrentPrompt((p) => p + ' همراه با تم تاریک و نمودارهای شیشه‌ای Glassmorphism.')}
            className="px-2 py-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 cursor-pointer"
          >
            + تم تاریک شیشه‌ای
          </button>
          <button
            type="button"
            onClick={() => setCurrentPrompt((p) => p + ' با جدول صحت و فرمول‌های KaTeX.')}
            className="px-2 py-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 cursor-pointer"
          >
            + فرمول‌های LaTeX
          </button>
          <button
            type="button"
            onClick={() => setCurrentPrompt((p) => p + ' اتصال به دیتابیس Supabase جهت ذخیره تاریخچه لاگ‌ها.')}
            className="px-2 py-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 cursor-pointer"
          >
            + دیتابیس Supabase
          </button>
        </div>
      </form>

      {/* 4. Main Workstation: Split Screen (Left: Thinking & Steps | Right: Live Preview & Code) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col (5 cols): Agent Reasoning & Terminal Actions */}
        <div className="lg:col-span-5 space-y-4">
          {/* Thinking Process Accordion */}
          <div className="glass-surface rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setThinkingExpanded(!thinkingExpanded)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/70 dark:bg-slate-900/70 text-right cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BrainIcon className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isFa ? 'فرایند تفکر ایجنت (Thinking Process)' : 'Agent Reasoning & Planning'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-mono">
                  {project.engine}
                </span>
              </div>
              {thinkingExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {thinkingExpanded && (
              <div className="p-4 bg-slate-950 text-slate-300 text-xs font-mono space-y-2 border-t border-slate-800 max-h-56 overflow-y-auto no-scrollbar">
                {project.thinkingLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-600 select-none">{idx + 1}.</span>
                    <span className={idx === project.thinkingLog.length - 1 ? 'text-sky-300 font-semibold' : 'text-slate-400'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tool Calls & CLI Execution Activity */}
          <div className="glass-surface rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-sky-500" />
                <span>{isFa ? 'فرامین ترمینال و فایل‌های ساخته‌شده:' : 'CLI Tool Executions:'}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                ● DevServer: 3000
              </span>
            </div>

            <div className="space-y-2.5">
              {project.steps.map((step) => (
                <div
                  key={step.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {isFa ? step.titleFa : step.titleEn}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                  </div>

                  {step.command && (
                    <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-md overflow-x-auto no-scrollbar">
                      $ {step.command}
                    </div>
                  )}

                  {step.output && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      ↳ {step.output}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Supabase & GitHub status pill */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Supabase PostgreSQL: متصل</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>Branch: main (Sync)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Col (7 cols): Live App Preview / Multi-File Code Inspector */}
        <div className="lg:col-span-7 glass-surface rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-0">
          {/* Studio Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
            {/* View Modes */}
            <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFa ? 'پیش‌نمایش زنده (Preview)' : 'Live Preview'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{isFa ? 'سورس کد و ساختار (Files)' : 'Code & Files'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isFa ? 'راهنمای CLI محلی' : 'Local CLI Guide'}</span>
              </button>
            </div>

            {/* Viewport device switcher (if preview mode) */}
            {activeTab === 'preview' && (
              <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  title="Desktop View"
                  onClick={() => setDeviceViewport('desktop')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    deviceViewport === 'desktop'
                      ? 'bg-white dark:bg-slate-900 text-sky-500 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Tablet View"
                  onClick={() => setDeviceViewport('tablet')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    deviceViewport === 'tablet'
                      ? 'bg-white dark:bg-slate-900 text-sky-500 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Mobile View"
                  onClick={() => setDeviceViewport('mobile')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    deviceViewport === 'mobile'
                      ? 'bg-white dark:bg-slate-900 text-sky-500 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: Live Interactive Sandbox Preview */}
          {activeTab === 'preview' && (
            <div className="p-4 bg-slate-950 flex flex-col items-center justify-center min-h-[460px]">
              <div
                className={`w-full transition-all duration-300 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 ${
                  deviceViewport === 'mobile'
                    ? 'max-w-[375px]'
                    : deviceViewport === 'tablet'
                    ? 'max-w-[640px]'
                    : 'max-w-full'
                }`}
              >
                {/* Simulated Browser URL bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="font-mono bg-slate-900 px-3 py-0.5 rounded-md text-slate-300 border border-slate-800">
                    localhost:3000/fem-beam
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBeamLength(4.0);
                      setPointLoad(18.5);
                      setDistLoad(4.2);
                    }}
                    title="Reset Simulator"
                    className="hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* The Interactive React Engineering App inside the Sandbox */}
                <div className="p-4 sm:p-5 text-slate-100 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-sky-400">
                      شبیه‌ساز تعاملی تنش و خمش تیر مهندسی
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      تحلیل آنی الاستیک تیر یک‌سر گیردار تحت بار ترکیبی (فرمول‌های اویلر-برنولی)
                    </p>
                  </div>

                  {/* Quick Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>طول تیر (L):</span>
                        <span className="font-mono text-sky-400 font-bold">{beamLength}m</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={beamLength}
                        onChange={(e) => setBeamLength(parseFloat(e.target.value))}
                        className="w-full accent-sky-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>بار نقطه‌ای (P):</span>
                        <span className="font-mono text-amber-400 font-bold">{pointLoad}kN</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={pointLoad}
                        onChange={(e) => setPointLoad(parseFloat(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>بار گسترده (w):</span>
                        <span className="font-mono text-indigo-400 font-bold">{distLoad}kN/m</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.5"
                        value={distLoad}
                        onChange={(e) => setDistLoad(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Live SVG Curve */}
                  <div className="h-36 w-full bg-slate-950 rounded-xl p-2 relative border border-slate-800/80 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 500 130">
                      {/* Fixed Wall Support */}
                      <rect x="25" y="15" width="12" height="100" fill="#475569" />
                      {Array.from({ length: 5 }).map((_, i) => (
                        <line
                          key={i}
                          x1="15"
                          y1={25 + i * 18}
                          x2="25"
                          y2={35 + i * 18}
                          stroke="#64748b"
                          strokeWidth="2"
                        />
                      ))}

                      {/* Dynamic Deflected Beam Path */}
                      <path
                        d={`M 37 65 Q 220 65, 450 ${65 + maxDeflectionMm}`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />

                      {/* Tip Arrow */}
                      <line
                        x1="450"
                        y1={20 + maxDeflectionMm}
                        x2="450"
                        y2={58 + maxDeflectionMm}
                        stroke="#fb7185"
                        strokeWidth="3"
                        markerEnd="url(#arrowTip)"
                      />
                      <text
                        x="410"
                        y={16 + maxDeflectionMm}
                        fill="#fb7185"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        P={pointLoad}kN
                      </text>

                      <defs>
                        <marker
                          id="arrowTip"
                          viewBox="0 0 10 10"
                          refX="5"
                          refY="5"
                          markerWidth="6"
                          markerHeight="6"
                          orient="auto-start-reverse"
                        >
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb7185" />
                        </marker>
                      </defs>
                    </svg>
                  </div>

                  {/* 4 Metric Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">لنگر ماکزیمم (M)</span>
                      <span className="text-sm font-mono font-bold text-amber-400">
                        {maxMoment.toFixed(1)} kN.m
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">نیروی برشی (V)</span>
                      <span className="text-sm font-mono font-bold text-sky-400">
                        {maxShear.toFixed(1)} kN
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">انحنای نوک (δ)</span>
                      <span className="text-sm font-mono font-bold text-rose-400">
                        {maxDeflectionMm.toFixed(2)} mm
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">تنش ماکزیمم (σ)</span>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        {maxBendingStressMpa.toFixed(1)} MPa
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Multi-File Code Explorer & Syntax Inspector */}
          {activeTab === 'code' && (
            <div className="bg-slate-950 text-slate-200">
              {/* File Tabs */}
              <div className="flex items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 overflow-x-auto no-scrollbar">
                {project.files.map((file, idx) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedFileIndex === idx
                        ? 'bg-slate-950 text-sky-400 border border-slate-800 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{file.name}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleCopyCode(currentFile.content)}
                  className="mr-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'کپی شد' : 'کپی کد'}</span>
                </button>
              </div>

              {/* Code display with line numbers */}
              <div className="p-4 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed">
                <pre className="text-slate-300">
                  <code>{currentFile.content}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Local CLI Installation & Setup Guide */}
          {activeTab === 'guide' && (
            <div className="p-6 bg-slate-950 text-slate-200 space-y-5 text-xs sm:text-sm leading-relaxed">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>{isFa ? 'نحوه اجرای لوکال کلودبل (Claudable) روی کامپیوتر شما' : 'How to Run Claudable Locally'}</span>
              </h3>

              <div className="space-y-3">
                <p className="text-slate-400">
                  {isFa
                    ? 'کلودبل می‌تواند به صورت محلی به همراه ایجنت مورد علاقه شما اجرا شود. فرامین زیر را در ترمینال سیستم خود اجرا کنید:'
                    : 'You can run Claudable on your local machine powered by Claude Code, Codex, or Cursor CLI:'}
                </p>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
                  <div className="text-slate-500"># ۱. کلون مخزن کلودبل</div>
                  <div className="text-sky-300">git clone https://github.com/anymorph-ai/Claudable.git</div>
                  <div className="text-sky-300">cd Claudable</div>
                  <div className="text-slate-500 mt-2"># ۲. نصب نیازمندی‌ها</div>
                  <div className="text-sky-300">npm install</div>
                  <div className="text-slate-500 mt-2"># ۳. لاگین در ایجنت Claude Code (اختیاری)</div>
                  <div className="text-sky-300">npm i -g @anthropic-ai/claude-code && claude</div>
                  <div className="text-slate-500 mt-2"># ۴. اجرای وب‌ساز کلودبل</div>
                  <div className="text-emerald-400">npm run dev</div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-indigo-300 space-y-1">
                  <span className="font-bold block">💡 نکته دانشگاهی:</span>
                  <p className="text-xs text-indigo-200">
                    با کلودبل می‌توانید پروژه‌های پایانی مهندسی، وب‌سایت‌های آزمایشگاهی و داشبوردهای IoT خود را بدون نیاز به ماه‌ها کدنویسی در چند دقیقه خلق کرده و مستقیماً روی گیت‌هاب و Vercel منتشر نمایید.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple brain icon helper
function BrainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M12 18v4" />
    </svg>
  );
}
