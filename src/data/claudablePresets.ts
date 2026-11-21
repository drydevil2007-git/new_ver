import {
  ClaudableAgentEngine,
  ClaudableEngineSpec,
  ClaudableProject,
  ClaudableTemplatePreset,
} from '../types/app';

export const CLAUDABLE_ENGINES: ClaudableEngineSpec[] = [
  {
    id: 'claude-code',
    name: 'Claude Code CLI',
    provider: 'Anthropic (Claude 3.7 Sonnet / Opus 4.6)',
    model: 'claude-3-7-sonnet-20250219',
    contextWindow: '200,000 Tokens',
    descriptionFa: 'قدرتمندترین ایجنت کدنویسی جهان بر اساس فلسفه یونیکس با تفکر عمیق گام‌به‌گام و ابزارهای شل',
    descriptionEn: 'Frontier agentic coding CLI with Unix philosophy, step-by-step reasoning & tool calling',
    badge: 'پیشنهادی · دقت ۹۹٪',
    cliCommand: 'npm i -g @anthropic-ai/claude-code && claude',
    isPopular: true,
  },
  {
    id: 'codex-cli',
    name: 'OpenAI Codex CLI',
    provider: 'OpenAI (GPT-5 Codex Reasoning)',
    model: 'gpt-5-codex-preview',
    contextWindow: '128,000 Tokens',
    descriptionFa: 'تحلیل عمیق منطق محاسباتی، ویرایش هم‌زمان چند فایل و تولید خودکار تست‌های واحد',
    descriptionEn: 'High-reasoning coding engine with autonomous multi-file edits and unit test generation',
    badge: 'استدلال بالا',
    cliCommand: 'npm i -g @openai/codex && codex',
  },
  {
    id: 'cursor-cli',
    name: 'Cursor Agent CLI',
    provider: 'Cursor (Multi-Model Composer)',
    model: 'cursor-agent-v2-hybrid',
    contextWindow: '200,000 Tokens',
    descriptionFa: 'سازگار با AGENTS.md و کامپوزر سریع برای بازتولید المان‌های مدرن UI با Tailwind CSS',
    descriptionEn: 'AGENTS.md compliant rapid app composer with instant Tailwind and shadcn/ui scaffolding',
    badge: 'UI سریع',
    cliCommand: 'curl https://cursor.com/install -fsS | bash && cursor-agent',
    isPopular: true,
  },
  {
    id: 'gemini-cli',
    name: 'Google Gemini CLI',
    provider: 'Google DeepMind (Gemini 2.5 Pro)',
    model: 'gemini-2.5-pro-preview-0514',
    contextWindow: '1,000,000+ Tokens',
    descriptionFa: 'پنجره کانتکست یک میلیونی برای تحلیل کل کدبیس، دیتاست‌های بزرگ مهندسی و اسناد حجیم',
    descriptionEn: 'Massive 1M token context for whole-codebase digestion, large telemetry and datasheets',
    badge: 'کانتکست ۱M+',
    cliCommand: 'npm i -g @google/gemini-cli && gemini',
  },
  {
    id: 'qwen-code',
    name: 'Qwen 2.5 Coder CLI',
    provider: 'Alibaba / Hugging Face (Open Source)',
    model: 'qwen2.5-coder-32b-instruct',
    contextWindow: '128,000 Tokens',
    descriptionFa: 'موتور قدرتمند متن‌باز بدون هزینه اشتراک، بهینه برای محیط‌های آفلاین و سرورهای محلی',
    descriptionEn: 'Top-tier open-source coding engine with zero subscription fees for on-premise execution',
    badge: '۱۰۰٪ رایگان و متن‌باز',
    cliCommand: 'ollama run qwen2.5-coder:32b',
  },
];

export const CLAUDABLE_PRESETS: ClaudableTemplatePreset[] = [
  {
    id: 'fem-structural',
    titleFa: 'شبیه‌ساز و تحلیلگر المان محدود (FEM Structural Analyzer)',
    titleEn: 'Finite Element Method (FEM) Structural Beam Visualizer',
    category: 'simulation',
    iconName: 'Cpu',
    promptFa: 'یک وب‌اپلیکیشن مهندسی مکانیک و عمران برای تحلیل تنش تیر دو سر گیردار بساز که با تغییر بار وارده، دیاگرام لنگر خمشی، نیروی برشی و انحنای الاستیک را به صورت گرافیکی نمایش دهد.',
    promptEn: 'Build a mechanical/civil engineering app for cantilever beam stress analysis that dynamically plots bending moment, shear force and elastic deflection.',
    tags: ['تنش و خمش', 'مکانیک جامدات', 'رسم ماتریسی', 'FEM'],
  },
  {
    id: 'iot-telemetry',
    titleFa: 'داشبورد مانیتورینگ بلادرنگ سنسورهای IoT صنعتی',
    titleEn: 'Real-time Industrial IoT Sensor Telemetry Dashboard',
    category: 'iot',
    iconName: 'Activity',
    promptFa: 'یک داشبورد مانیتورینگ برای خط تولید کارخانه هوشمند بساز که دما، ارتعاش موتور، فشار روغن و جریان برق را با نمودار زنده، آلارم‌های بحرانی و اتصال به دیتابیس شبیه‌سازی کند.',
    promptEn: 'Create a modern industrial IoT telemetry dashboard tracking motor temperature, vibration, pressure, and current with live graphs and alert thresholds.',
    tags: ['اینترنت اشیاء', 'نمودار زنده', 'تله‌متری صنعتی', 'Supabase'],
  },
  {
    id: 'circuit-logic',
    titleFa: 'استودیوی شبیه‌سازی مدارهای منطقی و FPGA',
    titleEn: 'Digital Logic Circuit Sandbox & Truth Table Simulator',
    category: 'engineering',
    iconName: 'Layers',
    promptFa: 'یک نرم‌افزار تحت وب تعاملی برای طراحی و شبیه‌سازی مدارهای منطقی بساز که گیت‌های AND, OR, XOR, NOT و فلیپ‌فلاپ D را با سیم‌کشی زنده و جدول صحت خودکار نمایش دهد.',
    promptEn: 'Develop an interactive digital logic simulator with AND, OR, XOR gates, D-flip-flops, visual wiring, and real-time truth table evaluation.',
    tags: ['مهندسی برق', 'مدار منطقی', 'جدول درستی', 'FPGA'],
  },
  {
    id: 'satellite-orbit',
    titleFa: 'شبیه‌ساز مکانیک مداری ماهواره و کنترل وضعیت',
    titleEn: 'Satellite Orbital Mechanics & Attitude Control Studio',
    category: 'simulation',
    iconName: 'Globe',
    promptFa: 'یک ابزار مهندسی هوافضا طراحی کن که معادله مداری کپلری، ارتفاع اوج و حضیض، انحراف مداری (Inclination) و ردیابی رد زمینی ماهواره به همراه پنل‌های خورشیدی را محاسبه و شبیه‌سازی کند.',
    promptEn: 'Build an aerospace engineering Keplerian orbit simulator computing apogee, perigee, orbital period, inclination, and ground track with solar exposure.',
    tags: ['هوافضا', 'مکانیک کپلر', 'مدار ماهواره', 'فیزیک فضا'],
  },
  {
    id: 'academic-erp',
    titleFa: 'پرتال هوشمند انتخاب واحد و درخت پیش‌نیاز دروس',
    titleEn: 'Intelligent Academic Curriculum & Course Prerequisite ERP',
    category: 'academic',
    iconName: 'Sparkles',
    promptFa: 'یک سیستم مدیریت مسیر تحصیلی برای دانشجویان مهندسی بساز که گراف پیش‌نیازها و هم‌نیازها را بررسی کرده و معدل ترم و معدل کل را با ضریب دروس محاسبه کند.',
    promptEn: 'Build an academic curriculum planner for engineering students with prerequisite validation, conflict detection, and weighted GPA projection.',
    tags: ['انتخاب واحد', 'گراف پیش‌نیاز', 'محاسبه معدل', 'دانشگاه'],
  },
];

export const INITIAL_CLAUDABLE_PROJECTS: Record<string, ClaudableProject> = {
  'fem-structural': {
    id: 'fem-structural',
    titleFa: 'شبیه‌ساز تنش تیر و المان محدود (FEM Analyzer)',
    titleEn: 'Cantilever Beam Stress & Deflection Visualizer',
    prompt: 'یک وب‌اپلیکیشن مهندسی مکانیک و عمران برای تحلیل تنش تیر دو سر گیردار بساز که با تغییر بار وارده، دیاگرام لنگر خمشی، نیروی برشی و انحنای الاستیک را به صورت گرافیکی نمایش دهد.',
    engine: 'claude-code',
    framework: 'vite-react',
    status: 'ready',
    createdAt: 'همین الان',
    supabaseConnected: true,
    githubUrl: 'https://github.com/danshyar/fem-structural-beam',
    vercelUrl: 'https://fem-beam-analyzer.vercel.app',
    previewUrl: 'about:blank',
    thinkingLog: [
      '⚡ [Claude Code Engine] Parsing user engineering request: Cantilever Beam with Point & Distributed Loading...',
      '📐 Formulating governing differential equations: EI * d⁴v/dx⁴ = q(x) with boundary conditions v(0)=0, v\'(0)=0.',
      '📦 Scaffolding project structure with Vite, React 19, TypeScript, Tailwind CSS, Lucide icons, and KaTeX math notation.',
      '🛠️ Installing math utilities: numeric integration, canvas-based gradient stress rendering, and real-time slider hooks.',
      '🎨 Applying high-contrast dark mode glassmorphism with engineering precision color palettes (Sky, Emerald, Rose).',
      '✅ Running build verification test suite: 0 TypeScript warnings, bundling completed in 680ms.',
      '🚀 Dev server launched successfully at http://localhost:3000 — Ready for live user interaction.',
    ],
    steps: [
      {
        id: 's1',
        titleFa: 'تحلیل صورت‌مسئله مکانیک و معادلات اویلر-برنولی',
        titleEn: 'Parse Mechanics Formulation & Euler-Bernoulli Equations',
        tool: 'cli_command',
        command: 'claude --think "Analyze cantilever beam boundary conditions and shear equations"',
        output: 'Selected Euler-Bernoulli beam theory: σ = My/I, v(x) = P*x²*(3L - x)/(6EI)',
        status: 'completed',
        timestamp: '14:50:02',
      },
      {
        id: 's2',
        titleFa: 'ایجاد اسکلت پروژه فرانت‌اند با Vite و React',
        titleEn: 'Scaffold React + Vite + Tailwind Project Template',
        tool: 'create_file',
        command: 'npx create-vite beam-analyzer --template react-ts',
        output: 'Created 14 files in /src with Tailwind CSS 4.0 configuration',
        status: 'completed',
        timestamp: '14:50:08',
      },
      {
        id: 's3',
        titleFa: 'پیاده‌سازی کامپوننت هسته محاسبات مهندسی (BeamSimulator.tsx)',
        titleEn: 'Implement Core Finite Element Computation Engine',
        tool: 'create_file',
        command: 'touch src/components/BeamSimulator.tsx',
        output: 'Generated 240 lines of interactive canvas renderer with dynamic stress color map',
        status: 'completed',
        timestamp: '14:50:16',
      },
      {
        id: 's4',
        titleFa: 'اتصال دیتابیس Supabase جهت ذخیره پروژه‌ها و گزارش محاسباتی',
        titleEn: 'Configure Supabase Database Client for Calculation Logs',
        tool: 'db_migrate',
        command: 'supabase db push --schema beam_simulations',
        output: 'Applied migration: table beam_simulations (id, load_kn, length_m, max_stress_mpa)',
        status: 'completed',
        timestamp: '14:50:22',
      },
      {
        id: 's5',
        titleFa: 'دیپلوی خودکار به سرور ابری Vercel',
        titleEn: 'Instant Zero-Config Vercel Edge Deployment',
        tool: 'cli_command',
        command: 'vercel deploy --prod --yes',
        output: 'Production URL: https://fem-beam-analyzer.vercel.app',
        status: 'completed',
        timestamp: '14:50:29',
      },
    ],
    files: [
      {
        name: 'App.tsx',
        path: 'src/App.tsx',
        language: 'typescript',
        isMain: true,
        content: `import React, { useState, useMemo } from 'react';
import { Activity, ShieldAlert, Download, Share2, RefreshCw } from 'lucide-react';

export default function BeamAnalyzerApp() {
  const [beamLength, setBeamLength] = useState<number>(4.0); // meters
  const [pointLoad, setPointLoad] = useState<number>(18.5); // kN
  const [distLoad, setDistLoad] = useState<number>(4.2); // kN/m
  const [elasticModulus, setElasticModulus] = useState<number>(200); // GPa (Steel)
  const [momentInertia, setMomentInertia] = useState<number>(4500); // cm^4

  // Mechanics calculations
  const I_m4 = momentInertia * 1e-8;
  const E_pa = elasticModulus * 1e9;
  const P_n = pointLoad * 1000;
  const w_nm = distLoad * 1000;

  const maxMoment = useMemo(() => {
    // At root x=0: M_max = P*L + (w*L^2)/2 (in kN.m)
    return pointLoad * beamLength + (distLoad * Math.pow(beamLength, 2)) / 2;
  }, [beamLength, pointLoad, distLoad]);

  const maxShear = useMemo(() => {
    // V_max = P + w*L (in kN)
    return pointLoad + distLoad * beamLength;
  }, [beamLength, pointLoad, distLoad]);

  const maxDeflectionMm = useMemo(() => {
    // Delta_tip = (P*L^3)/(3EI) + (w*L^4)/(8EI)
    const delta = (P_n * Math.pow(beamLength, 3)) / (3 * E_pa * I_m4) +
                  (w_nm * Math.pow(beamLength, 4)) / (8 * E_pa * I_m4);
    return delta * 1000; // to mm
  }, [beamLength, P_n, w_nm, E_pa, I_m4]);

  const maxBendingStressMpa = useMemo(() => {
    // sigma = M * y / I  (assuming height h = 0.25m -> y = 0.125m)
    const y = 0.125;
    const sigma = (maxMoment * 1000 * y) / I_m4;
    return sigma / 1e6; // MPa
  }, [maxMoment, I_m4]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
            تحلیلگر تنش و انحنای تیر مهندسی (Claudable Studio)
          </h1>
          <p className="text-xs text-slate-400 mt-1">تولیدشده توسط موتور Claude Code CLI · شبیه‌سازی بلادرنگ تیر یک‌سر گیردار</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
            وضعیت الاستیک: ایمن
          </span>
        </div>
      </header>

      {/* Grid: Controls & Real-Time Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
            <Activity className="w-4 h-4" /> پارامترهای بارگذاری و هندسه
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span>طول تیر (L):</span>
              <span className="font-mono text-sky-400">{beamLength.toFixed(1)} متر</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={beamLength}
              onChange={(e) => setBeamLength(parseFloat(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span>بار نقطه‌ای در نوک (P):</span>
              <span className="font-mono text-amber-400">{pointLoad.toFixed(1)} kN</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={pointLoad}
              onChange={(e) => setPointLoad(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span>بار گسترده یکنواخت (w):</span>
              <span className="font-mono text-indigo-400">{distLoad.toFixed(1)} kN/m</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={distLoad}
              onChange={(e) => setDistLoad(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>مدول یانگ (E):</span>
              <span className="font-mono text-slate-200">200 GPa (فولاد ساختمانی)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>ممان اینرسی مقطع (I):</span>
              <span className="font-mono text-slate-200">{momentInertia} cm⁴</span>
            </div>
          </div>
        </div>

        {/* Real-time Visualizer & Metric Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 block mb-1">بیشینه لنگر (M_max)</span>
              <span className="text-lg font-mono font-bold text-amber-400">{maxMoment.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 mr-1">kN.m</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 block mb-1">بیشینه برش (V_max)</span>
              <span className="text-lg font-mono font-bold text-sky-400">{maxShear.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 mr-1">kN</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 block mb-1">تغییر مکان نوک (δ)</span>
              <span className="text-lg font-mono font-bold text-rose-400">{maxDeflectionMm.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 mr-1">mm</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 block mb-1">تنش خمشی (σ_max)</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{maxBendingStressMpa.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 mr-1">MPa</span>
            </div>
          </div>

          {/* Interactive Canvas Graph */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>شبیه‌سازی پروفیل انحنا و توزیع تنش برشی تیر</span>
              <span className="text-[10px] font-mono text-emerald-400">Interactive Canvas · Realtime</span>
            </h4>

            {/* SVG/Canvas representation of Cantilever Beam */}
            <div className="h-44 w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 160">
                {/* Wall constraint */}
                <rect x="30" y="20" width="16" height="120" fill="#334155" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <line key={i} x1="20" y1={30 + i * 20} x2="30" y2={40 + i * 20} stroke="#64748b" strokeWidth="2" />
                ))}

                {/* Deflected Beam Curve */}
                <path
                  d={\`M 46 80 Q 250 80, \${520} \${80 + Math.min(45, maxDeflectionMm * 1.8)}\`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                {/* Point Load Arrow at Tip */}
                <line
                  x1="520"
                  y1={30 + Math.min(45, maxDeflectionMm * 1.8)}
                  x2="520"
                  y2={75 + Math.min(45, maxDeflectionMm * 1.8)}
                  stroke="#fb7185"
                  strokeWidth="3"
                  markerEnd="url(#arrow)"
                />
                <text x="490" y={25 + Math.min(45, maxDeflectionMm * 1.8)} fill="#fb7185" fontSize="12" fontWeight="bold">
                  P = {pointLoad} kN
                </text>

                {/* Marker def */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb7185" />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>مدل تحلیلی: تیر اولر برنولی تحت بار متمرکز و بار گسترده</span>
              <span>تولیدشده توسط کلودبل در ۰.۶۸ ثانیه</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
      },
      {
        name: 'package.json',
        path: 'package.json',
        language: 'json',
        content: `{
  "name": "claudable-fem-beam-analyzer",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.475.0",
    "@supabase/supabase-js": "^2.48.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.1.0"
  }
}`,
      },
      {
        name: 'supabase.ts',
        path: 'src/lib/supabase.ts',
        language: 'typescript',
        content: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mock-db.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveBeamCalculation(data: {
  beamLength: number;
  pointLoad: number;
  maxMoment: number;
  maxDeflection: number;
}) {
  return await supabase.from('beam_simulations').insert([data]);
}`,
      },
    ],
  },
};
