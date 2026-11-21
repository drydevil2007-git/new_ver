import React, { useEffect, useState } from 'react';
import {
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Terminal,
  Play,
  Send,
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Server,
  RefreshCw,
  Gauge,
  Box,
  Monitor,
  Flame,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';
import {
  Lang,
  NavSection,
  StrataHardwareProfile,
  StrataModelSpec,
  StrataServingConfig,
} from '../types/app';
import {
  INITIAL_STRATA_HARDWARE,
  INITIAL_STRATA_MODELS,
  INITIAL_STRATA_CONFIG,
} from '../data/strataInitialData';

interface StrataHubProps {
  lang: Lang;
  onNavigate?: (section: NavSection) => void;
}

type StrataTab = 'playground' | 'planner' | 'models' | 'setup';

export const StrataHub: React.FC<StrataHubProps> = ({ lang, onNavigate }) => {
  const isFa = lang === 'fa';
  const [activeTab, setActiveTab] = useState<StrataTab>('playground');
  const [loading, setLoading] = useState<boolean>(false);

  // Core Data
  const [hardware, setHardware] = useState<StrataHardwareProfile | null>(INITIAL_STRATA_HARDWARE);
  const [models, setModels] = useState<StrataModelSpec[]>(INITIAL_STRATA_MODELS);
  const [config, setConfig] = useState<StrataServingConfig | null>(INITIAL_STRATA_CONFIG);
  const [endpoints, setEndpoints] = useState<{ openai: string; anthropic: string; health: string }>({
    openai: 'http://127.0.0.1:8080/v1/chat/completions',
    anthropic: 'http://127.0.0.1:8080/v1/messages',
    health: 'http://127.0.0.1:8080/health',
  });

  // Playground Chat
  const [prompt, setPrompt] = useState<string>('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'strata'; text: string; stats?: any; timestamp: string }>>([
    {
      sender: 'strata',
      text: 'هسته استنتاج محلی Strata Engine با مدل Qwen3.8-Flash-Next در وضعیت آنلاین قرار دارد. تمام استدلال‌ها و حل معادلات درون سخت‌افزار محلی (VRAM + RAM) اجرا می‌شوند و نیازی به اینترنت یا ارسال داده به خارج از سیستم نیست.',
      timestamp: 'هم‌اکنون',
      stats: {
        tokensPerSec: 32.4,
        firstTokenMs: 135,
        layersOnVram: 48,
        expertsOnRam: 16,
        isLocalOffline: true,
      },
    },
  ]);
  const [inferring, setInferring] = useState<boolean>(false);

  // Memory & Hardware Planner State
  const [plannerVram, setPlannerVram] = useState<number>(16);
  const [plannerRam, setPlannerRam] = useState<number>(64);
  const [plannerModelId, setPlannerModelId] = useState<string>('qwen-3.8-flash');
  const [planResult, setPlanResult] = useState<any>(null);
  const [calculatingPlan, setCalculatingPlan] = useState<boolean>(false);

  // Copy status
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch initial status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/strata/status');
      if (res.ok) {
        const data = await res.json();
        setHardware(data.hardware);
        setModels(data.models || []);
        setConfig(data.config);
        if (data.endpoints) setEndpoints(data.endpoints);
        if (data.hardware) {
          setPlannerVram(data.hardware.vramTotalGb);
          setPlannerRam(data.hardware.ramTotalGb);
        }
      }
    } catch (err) {
      console.error('Failed to fetch Strata status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Calculate memory plan
  const handleCalculatePlan = async () => {
    setCalculatingPlan(true);
    try {
      const res = await fetch('/api/strata/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vramGb: plannerVram,
          ramGb: plannerRam,
          modelId: plannerModelId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlanResult(data.plan);
      }
    } catch (err) {
      console.error('Failed to calculate memory plan:', err);
    } finally {
      setCalculatingPlan(false);
    }
  };

  useEffect(() => {
    if (models.length > 0) {
      handleCalculatePlan();
    }
  }, [plannerVram, plannerRam, plannerModelId, models]);

  // Handle local playground inference
  const handleSendPrompt = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || prompt;
    if (!textToSend.trim() || inferring) return;

    setInferring(true);
    if (!customText) setPrompt('');

    const userEntry = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatLog((prev) => [...prev, userEntry]);

    try {
      const res = await fetch('/api/strata/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        const strataEntry = {
          sender: 'strata' as const,
          text: data.reply,
          stats: data.stats,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        };
        setChatLog((prev) => [...prev, strataEntry]);
        if (config && data.stats?.tokensPerSec) {
          setConfig((prev) => (prev ? { ...prev, currentTokensPerSec: data.stats.tokensPerSec } : prev));
        }
      }
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setInferring(false);
    }
  };

  // Switch Active Model
  const handleSelectActiveModel = async (modelId: string) => {
    try {
      const res = await fetch('/api/strata/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeModelId: modelId }),
      });
      if (res.ok) {
        setConfig((prev) => (prev ? { ...prev, activeModelId: modelId } : prev));
      }
    } catch (err) {
      console.error('Failed to change active model:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeModel = models.find((m) => m.id === config?.activeModelId) || models[0];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-100">
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
        <h3 className="text-xl font-bold mb-2">در حال اتصال به هسته محلی Strata Engine...</h3>
        <p className="text-sm text-slate-400 max-w-md">
          تحلیل کارت گرافیک، محاسبه حافظه VRAM و رم سیستمی، و آماده‌سازی موتور استنتاج MoE
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16" dir={isFa ? 'rtl' : 'ltr'}>
      {/* Top Banner: Local & Offline Assurance */}
      <div className="border-b border-emerald-500/20 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-300">Strata Local Engine · 127.0.0.1:8080 Active</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              استنتاج ۱۰۰٪ محلی و بدون فیلتر مدل‌های فرانتیر (Qwen 3.8 / DeepSeek V4) روی سخت‌افزار شخصی
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/niko1221/strata"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>مخزن گیت‌هاب Strata</span>
            </a>
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/40 rounded-md px-2.5 py-1 text-emerald-300">
              <Lock className="w-3.5 h-3.5" />
              <span>حفظ ۱۰۰٪ حریم خصوصی و امنیت داده</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-5">
        {/* Header Hero Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
                  ⚡
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    {isFa ? 'هسته استنتاج محلی Strata' : 'Strata Local Inference Engine'}
                  </h1>
                  <p className="text-xs text-slate-400">
                    {isFa
                      ? 'اجرای غول‌های هوش مصنوعی (مدل‌های ۱۱۰ تا ۱۲۸ میلیارد پارامتری MoE) روی کارت‌های گرافیک و رم معمولی از طریق لایه‌بندی حافظه و استریم اکسپرت‌ها'
                      : 'Run massive Mixture-of-Experts frontier models on consumer GPUs using tiered VRAM/RAM/NVMe offloading.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-xs">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">{isFa ? 'سرعت استنتاج:' : 'Speed:'}</span>
                <span className="font-bold text-white font-mono">{config?.currentTokensPerSec || 31.4} t/s</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-xs">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">{isFa ? 'حافظه VRAM تخصیص‌یافته:' : 'VRAM:'}</span>
                <span className="font-bold text-white font-mono">{config?.vramAllocatedGb || 12.8} GB</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-xs">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">{isFa ? 'رم سیستم:' : 'System RAM:'}</span>
                <span className="font-bold text-white font-mono">{config?.ramAllocatedGb || 38.2} GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'playground'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isFa ? 'محیط آزمون زنده (Playground)' : 'Live Playground'}</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'planner'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isFa ? 'برنامه‌ریز سخت‌افزار و لایه‌بندی حافظه' : 'Hardware & Offload Planner'}</span>
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'models'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{isFa ? 'کاتالوگ مدل‌های MoE' : 'MoE Model Catalog'}</span>
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'setup'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{isFa ? 'دستورات نصب سریع و اتصال ابزارها' : 'Quick Install & Connect'}</span>
          </button>
        </div>

        {/* TAB 1: Live Playground */}
        {activeTab === 'playground' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Chat Column (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[600px] shadow-lg overflow-hidden">
              <div className="p-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-800">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white">{activeModel?.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Pack: {activeModel?.recommendedPack} · Localhost:8080
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Zero Cloud Leak
                  </span>
                </div>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-slate-500">
                      <span>{msg.sender === 'user' ? (isFa ? 'شما' : 'You') : 'Strata Local Engine'}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-900/20'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.stats && (
                        <div className="mt-3 pt-2.5 border-t border-slate-700/60 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
                          <div>
                            <span className="text-slate-500 block">Speed:</span>
                            <span className="text-emerald-400 font-bold">{msg.stats.tokensPerSec} t/s</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Latency:</span>
                            <span className="text-cyan-400 font-bold">{msg.stats.firstTokenMs} ms</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Offload:</span>
                            <span className="text-amber-400 font-bold">
                              {msg.stats.layersOnVram}L GPU / {msg.stats.expertsOnRam}E RAM
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/95 space-y-2">
                <div className="flex items-center gap-2 overflow-x-auto text-[11px] pb-1 no-scrollbar">
                  <span className="text-slate-500 shrink-0">{isFa ? 'پرسش‌های نمونه:' : 'Examples:'}</span>
                  <button
                    onClick={() =>
                      handleSendPrompt(
                        undefined,
                        'معادله حالت یک سیستم غیرخطی را با روش خطی‌سازی لیاپانوف و فرمول‌های LaTeX بررسی کن.'
                      )
                    }
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    🧮 تحلیل پایداری لیاپانوف
                  </button>
                  <button
                    onClick={() =>
                      handleSendPrompt(
                        undefined,
                        'یک تابع بهینه پایتون برای حل معادله دیفرانسیل عددی رانگ-کوتا مرتبه ۴ بنویس.'
                      )
                    }
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    💻 الگوریتم رانگ-کوتا (RK4)
                  </button>
                </div>

                <form onSubmit={handleSendPrompt} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      isFa
                        ? 'ارسال پرسش، مسئله ریاضی یا درخواست کد به هسته محلی Strata...'
                        : 'Prompt local Strata engine...'
                    }
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={inferring || !prompt.trim()}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shadow-md shadow-emerald-900/30 flex items-center justify-center shrink-0"
                  >
                    {inferring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>

            {/* Hardware & Live Stream Monitor Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Live Memory Tiering Visualization Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-xs text-white">
                      {isFa ? 'معماری لایه‌بندی حافظه در Strata' : 'Tiered Memory Architecture'}
                    </h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Realtime Stream</span>
                </div>

                {/* Tier 1: GPU VRAM */}
                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Tier 1: GPU VRAM (تایرهای فعال)</span>
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400 font-bold">
                      {config?.vramAllocatedGb || 12.8} / {hardware?.vramTotalGb || 16} GB
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round(((config?.vramAllocatedGb || 12.8) / (hardware?.vramTotalGb || 16)) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    نگهداری لایه‌های اولیه، Attention، ماتریس‌های تعبیه و حافظه موقت KV Cache برای سرعت حداکثری
                  </p>
                </div>

                {/* Tier 2: System RAM */}
                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Tier 2: System RAM (اکسپرت‌های MoE)</span>
                    </span>
                    <span className="font-mono text-[11px] text-cyan-400 font-bold">
                      {config?.ramAllocatedGb || 38.2} / {hardware?.ramTotalGb || 64} GB
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round(((config?.ramAllocatedGb || 38.2) / (hardware?.ramTotalGb || 64)) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    ذخیره‌سازی وزن‌های تخصص‌یافته اکسپرت‌ها و فراخوانی دینامیک در گذرگاه PCIe بر اساس نیاز هر توکن
                  </p>
                </div>

                {/* Tier 3: High-Speed NVMe Storage */}
                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>Tier 3: NVMe Cache (استریم آنی)</span>
                    </span>
                    <span className="font-mono text-[11px] text-amber-400 font-bold">
                      {config?.nvmeStreamBandwidthGbS || 5.8} GB/s Stream
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    امکان اجرای مدل‌های فراتر از ظرفیت رم فیزیکی با بارگذاری هم‌زمان بلوک‌های کم‌استفاده روی NVMe PCIe 4.0
                  </p>
                </div>
              </div>

              {/* Endpoints & Integration Pill */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>{isFa ? 'درگاه اتصال سازگار با OpenAI / Anthropic' : 'Local Compatible Endpoints'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Port 8080</span>
                </div>

                <div className="bg-black p-2.5 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800 flex items-center justify-between" dir="ltr">
                  <span className="truncate">{endpoints.openai}</span>
                  <button
                    onClick={() => copyToClipboard(endpoints.openai, 'ep-openai')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 ml-2"
                  >
                    {copiedId === 'ep-openai' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400">
                  می‌توانید ابزارهایی مانند Claude Code، Codex CLI، Cursor و آزمایشگاه هوش مصنوعی دانشیار را مستقیماً به این درگاه وصل کنید.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Hardware & Offload Planner */}
        {activeTab === 'planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Input Sliders (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
              <div>
                <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>{isFa ? 'مشخصات سخت‌افزاری شما' : 'Your Hardware Specs'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  ظرفیت کارت گرافیک و رم سیستم خود را مشخص کنید تا تخصیص لایه‌ها و سرعت دقیق محاسبه شود.
                </p>
              </div>

              {/* VRAM Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">{isFa ? 'حافظه کارت گرافیک (VRAM):' : 'GPU VRAM:'}</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">{plannerVram} GB</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="48"
                  step="2"
                  value={plannerVram}
                  onChange={(e) => setPlannerVram(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>6 GB (RTX 3060)</span>
                  <span>12-16 GB (RTX 4070/4080)</span>
                  <span>24 GB (RTX 3090/4090)</span>
                  <span>48 GB</span>
                </div>
              </div>

              {/* System RAM Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">{isFa ? 'رم سیستم (System RAM):' : 'System RAM:'}</span>
                  <span className="font-mono text-cyan-400 font-bold text-sm">{plannerRam} GB</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="128"
                  step="8"
                  value={plannerRam}
                  onChange={(e) => setPlannerRam(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>16 GB</span>
                  <span>32 GB</span>
                  <span>64 GB (توصیه‌شده)</span>
                  <span>128 GB</span>
                </div>
              </div>

              {/* Model Choice */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">
                  {isFa ? 'انتخاب مدل جهت تحلیل تناسب:' : 'Target Model:'}
                </label>
                <select
                  value={plannerModelId}
                  onChange={(e) => setPlannerModelId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.parameters}) - {m.recommendedPack}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Plan Calculation Result (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">
                    {isFa ? 'نتیجه تحلیل و برنامه آف‌لودینگ Strata' : 'Strata Offloading Plan'}
                  </h3>
                </div>
                {planResult && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      planResult.fitScore >= 95
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : planResult.fitScore >= 75
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    Fit Score: {planResult.fitScore}%
                  </span>
                )}
              </div>

              {planResult ? (
                <div className="space-y-4">
                  {/* Allocation Meters */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 mb-1">{isFa ? 'تخصیص به VRAM' : 'VRAM Allocation'}</div>
                      <div className="font-mono text-base font-bold text-emerald-400">{planResult.vramAllocatedGb} GB</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 mb-1">{isFa ? 'تخصیص به رم سیستم' : 'RAM Allocation'}</div>
                      <div className="font-mono text-base font-bold text-cyan-400">{planResult.ramAllocatedGb} GB</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 mb-1">{isFa ? 'سرعت تخمینی' : 'Estimated Speed'}</div>
                      <div className="font-mono text-base font-bold text-white">{planResult.estimatedTokensPerSec} t/s</div>
                    </div>
                  </div>

                  {/* Verdict & Recommendation */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {planResult.isFullFit
                          ? isFa
                            ? 'سخت‌افزار شما توانایی اجرای کامل و با حداکثر سرعت این مدل را دارد.'
                            : 'Hardware fully fits in RAM/VRAM with zero paging slowdown.'
                          : isFa
                          ? `مدل نیازمند ${planResult.nvmeStreamingGb} گیگابایت استریم لایه‌ای از حافظه NVMe است.`
                          : `Tiered NVMe streaming active for remaining ${planResult.nvmeStreamingGb} GB.`}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      بسته کوانتیزه‌سازی پیشنهادی: <strong className="text-white font-mono">{planResult.recommendedPack}</strong>.
                      پنجره بافت تا ۶۴,۰۰۰ توکن بدون افت کیفیت محاسباتی پشتیبانی می‌شود.
                    </p>
                  </div>

                  {/* Terminal Launch Command */}
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">
                      {isFa ? 'دستور اجرای این مدل در ترمینال:' : 'Terminal Launch Command:'}
                    </label>
                    <div className="bg-black p-3 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 flex items-center justify-between" dir="ltr">
                      <span className="truncate">$ {planResult.launchCommand}</span>
                      <button
                        onClick={() => copyToClipboard(planResult.launchCommand, 'cmd-launch')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 ml-2"
                      >
                        {copiedId === 'cmd-launch' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  در حال محاسبه برنامه بهینه آف‌لودینگ...
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MoE Models Catalog */}
        {activeTab === 'models' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {models.map((m) => {
              const isSelected = config?.activeModelId === m.id;
              return (
                <div
                  key={m.id}
                  className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                    isSelected ? 'border-emerald-500 shadow-emerald-900/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {m.parameters} ({m.activeParameters})
                      </span>
                      {isSelected && (
                        <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>فعال در لوکال</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-white">{m.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{isFa ? m.descriptionFa : m.descriptionEn}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rec Pack:</span>
                        <span className="text-slate-300">{m.recommendedPack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Min VRAM:</span>
                        <span className="text-emerald-400">{m.vramRequiredGb} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Min RAM:</span>
                        <span className="text-cyan-400">{m.ramRequiredGb} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Context:</span>
                        <span className="text-slate-300">{m.contextWindow.toLocaleString()} tokens</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectActiveModel(m.id)}
                    disabled={isSelected}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                    }`}
                  >
                    {isSelected ? (isFa ? 'مدل جاری هسته' : 'Currently Active') : (isFa ? 'بارگذاری در هسته محلی' : 'Load into Engine')}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: One-Click Quick Install & Connect */}
        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Quick Install Scripts (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>{isFa ? 'دستور نصب تک‌خطی Strata در کامپیوتر' : 'One-Line Install Commands'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  نیازی به دسترسی ادمین ندارد. با اجرای یک فرمان، موتور بر اساس کارت گرافیک شما کامپایل و راه‌اندازی می‌شود.
                </p>
              </div>

              {/* Windows PowerShell */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">ویندوز (PowerShell):</span>
                <div className="bg-black p-3 rounded-xl font-mono text-[11px] text-cyan-400 border border-slate-800 flex items-center justify-between" dir="ltr">
                  <span className="truncate">irm -TimeoutSec 120 https://github.com/Niko1221/Strata/releases/latest/download/install.ps1 | iex</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'irm -TimeoutSec 120 https://github.com/Niko1221/Strata/releases/latest/download/install.ps1 | iex',
                        'install-win'
                      )
                    }
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 ml-2"
                  >
                    {copiedId === 'install-win' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Linux / macOS */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">لینوکس و مک‌او‌اس (Bash / Zsh):</span>
                <div className="bg-black p-3 rounded-xl font-mono text-[11px] text-emerald-400 border border-slate-800 flex items-center justify-between" dir="ltr">
                  <span className="truncate">curl -fsSL https://github.com/Niko1221/Strata/releases/latest/download/install.sh -o install.sh && sh install.sh</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'curl -fsSL https://github.com/Niko1221/Strata/releases/latest/download/install.sh -o install.sh && sh install.sh',
                        'install-nix'
                      )
                    }
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 ml-2"
                  >
                    {copiedId === 'install-nix' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Launch & Serve */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">{isFa ? 'راه‌اندازی مدل در پس‌زمینه:' : 'Launch and Serve:'}</span>
                <div className="bg-black p-3 rounded-xl font-mono text-[11px] text-amber-400 border border-slate-800 flex items-center justify-between" dir="ltr">
                  <span>strata launch --family qwen --model q2_0 --context 64k</span>
                  <button
                    onClick={() =>
                      copyToClipboard('strata launch --family qwen --model q2_0 --context 64k', 'launch-cmd')
                    }
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 ml-2"
                  >
                    {copiedId === 'launch-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Connecting Existing Coding Tools (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>{isFa ? 'اتصال ابزارهای برنامه‌نویسی به Strata' : 'Connect Your Coding Tools'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  استفاده از هوش مصنوعی محلی در ابزارهایی مانند Claude Code، Codex CLI و دانشیار بدون پرداخت هزینه اشتراک.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="font-semibold text-white mb-1">Claude Code (Anthropic API):</div>
                  <div className="bg-black p-2 rounded font-mono text-[10px] text-slate-300" dir="ltr">
                    export ANTHROPIC_BASE_URL="http://127.0.0.1:8080"
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="font-semibold text-white mb-1">Codex CLI / Cursor (OpenAI API):</div>
                  <div className="bg-black p-2 rounded font-mono text-[10px] text-slate-300" dir="ltr">
                    export OPENAI_BASE_URL="http://127.0.0.1:8080/v1"
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="font-semibold text-white mb-1">اتصال به دستیارهای دانشیار:</div>
                  <p className="text-[11px] text-slate-400">
                    هاب آزمایشگاه AI دانشیار، ماوس‌بات و مرکیوری می‌توانند روی سخت‌افزار خودتان بدون محدودیت سهمیه (Quota) پردازش شوند.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
