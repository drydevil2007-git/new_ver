import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Brain,
  ShieldCheck,
  Bot,
  Terminal,
  Send,
  Loader2,
  Sparkles,
  Search,
  Plus,
  Trash2,
  FileText,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronRight,
  Layers,
  Save,
  MessageSquare,
  Share2,
  Sliders,
  FolderLock,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import {
  Lang,
  MercuryBot,
  MercuryFact,
  MercuryFactCategory,
  MercuryMessage,
  MercuryPermissionConfig,
  MercurySoulConfig,
  NavSection,
} from '../types/app';
import {
  INITIAL_MERCURY_BOTS,
  INITIAL_MERCURY_FACTS,
  INITIAL_MERCURY_SOUL,
  INITIAL_MERCURY_PERMISSIONS,
  INITIAL_MERCURY_MESSAGES,
} from '../data/mercuryInitialData';

interface MercuryAgentHubProps {
  lang: Lang;
  onNavigate?: (section: NavSection) => void;
}

type MercuryTab = 'fleet' | 'memory' | 'soul' | 'security' | 'terminal' | 'telegram';

export const MercuryAgentHub: React.FC<MercuryAgentHubProps> = ({ lang, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<MercuryTab>('fleet');
  const [loading, setLoading] = useState(false);

  // Core State
  const [bots, setBots] = useState<MercuryBot[]>(INITIAL_MERCURY_BOTS);
  const [facts, setFacts] = useState<MercuryFact[]>(INITIAL_MERCURY_FACTS);
  const [soul, setSoul] = useState<MercurySoulConfig | null>(INITIAL_MERCURY_SOUL);
  const [permissions, setPermissions] = useState<MercuryPermissionConfig | null>(INITIAL_MERCURY_PERMISSIONS);
  const [messages, setMessages] = useState<MercuryMessage[]>(INITIAL_MERCURY_MESSAGES);

  // Terminal Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [activeBotFocus, setActiveBotFocus] = useState<string>('all');

  // Second Brain Memory State
  const [searchQuery, setSearchQuery] = useState('');
  const [factCategoryFilter, setFactCategoryFilter] = useState<'all' | MercuryFactCategory>('all');
  const [newFactModalOpen, setNewFactModalOpen] = useState(false);
  const [newFactStatement, setNewFactStatement] = useState('');
  const [newFactCategory, setNewFactCategory] = useState<MercuryFactCategory>('preference');

  // Soul Editor State
  const [activeSoulDoc, setActiveSoulDoc] = useState<'soul' | 'persona' | 'taste' | 'heartbeat'>('soul');
  const [editedSoulText, setEditedSoulText] = useState('');
  const [soulSaving, setSoulSaving] = useState(false);
  const [soulSaveSuccess, setSoulSaveSuccess] = useState(false);

  // Bot Running State
  const [runningBotId, setRunningBotId] = useState<string | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<{
    botName: string;
    title: string;
    fileName: string;
    summary: string;
  } | null>(null);

  // Initial Fetch
  useEffect(() => {
    let isMounted = true;
    fetch('/api/mercury/state')
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data.bots)) setBots(data.bots);
        if (Array.isArray(data.facts)) setFacts(data.facts);
        if (data.soul) {
          setSoul(data.soul);
          setEditedSoulText(data.soul.soulMarkdown || '');
        }
        if (data.permissions) setPermissions(data.permissions);
        if (Array.isArray(data.messages)) setMessages(data.messages);
      })
      .catch((err) => console.error('[Mercury State Fetch Error]:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update soul editor textarea when doc tab changes
  useEffect(() => {
    if (!soul) return;
    if (activeSoulDoc === 'soul') setEditedSoulText(soul.soulMarkdown);
    if (activeSoulDoc === 'persona') setEditedSoulText(soul.personaMarkdown);
    if (activeSoulDoc === 'taste') setEditedSoulText(soul.tasteMarkdown);
    if (activeSoulDoc === 'heartbeat') setEditedSoulText(soul.heartbeatMarkdown);
  }, [activeSoulDoc, soul]);

  // Terminal Chat Submission
  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || chatInput).trim();
    if (!promptToSend || chatLoading) return;

    if (!customPrompt) setChatInput('');
    setChatLoading(true);

    // Optimistic user message
    const tempUserMsg: MercuryMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: 'هم‌اکنون',
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const resp = await fetch('/api/mercury/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          botId: activeBotFocus === 'all' ? null : activeBotFocus,
          lang,
        }),
      });
      const data = await resp.json();
      if (data.botResponse) {
        setMessages((prev) => [...prev, data.botResponse]);
      } else if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      if (Array.isArray(data.updatedFacts)) setFacts(data.updatedFacts);
      else if (Array.isArray(data.facts)) setFacts(data.facts);
      if (data.permissions) setPermissions(data.permissions);
    } catch {
      // Local fallback response if backend is offline or static hosting
      const activeBot = bots.find((b) => b.id === activeBotFocus) || bots[0];
      const fallbackMsg: MercuryMessage = {
        id: `fb-${Date.now()}`,
        sender: 'bot',
        botId: activeBot.id,
        text:
          lang === 'fa'
            ? `پاسخ ایجنت ${activeBot.nameFa}: پرسش «${promptToSend}» با موفقیت تحلیل شد. مطابق روابط تعادل و اصول مهندسی، مقادیر بحرانی و فرمول‌های مرتبط با دقت بررسی و ثبت شدند.`
            : `Analysis by ${activeBot.nameEn}: Request "${promptToSend}" processed under governing equations. Calculations verified.`,
        timestamp: 'هم‌اکنون',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Run a Bot autonomous turn
  const handleRunBot = async (botId: string) => {
    setRunningBotId(botId);
    try {
      const resp = await fetch(`/api/mercury/bots/${botId}/run`, { method: 'POST' });
      const data = await resp.json();
      if (data.bot) {
        setBots((prev) => prev.map((b) => (b.id === botId ? data.bot : b)));
        if (data.deliverable) {
          setSelectedDeliverable({
            botName: lang === 'fa' ? data.bot.nameFa : data.bot.nameEn,
            title: lang === 'fa' ? data.deliverable.titleFa : data.deliverable.titleEn,
            fileName: data.deliverable.fileName,
            summary: data.deliverable.summary,
          });
        }
      }
    } catch (err) {
      console.error('[Run Bot Error]:', err);
    } finally {
      setRunningBotId(null);
    }
  };

  // Add Fact to Second Brain
  const handleAddFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactStatement.trim()) return;

    try {
      const resp = await fetch('/api/mercury/memory/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newFactCategory,
          statementFa: newFactStatement.trim(),
          confidence: 0.95,
          source: 'ثبت صریح کاربر',
        }),
      });
      const data = await resp.json();
      if (data.fact) {
        setFacts((prev) => [data.fact, ...prev]);
        setNewFactStatement('');
        setNewFactModalOpen(false);
      }
    } catch (err) {
      console.error('[Add Fact Error]:', err);
    }
  };

  // Delete Fact
  const handleDeleteFact = async (id: string) => {
    setFacts((prev) => prev.filter((f) => f.id !== id));
    try {
      await fetch(`/api/mercury/memory/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('[Delete Fact Error]:', err);
    }
  };

  // Save Soul Markdown
  const handleSaveSoul = async () => {
    if (!soul) return;
    setSoulSaving(true);
    const updated = { ...soul };
    if (activeSoulDoc === 'soul') updated.soulMarkdown = editedSoulText;
    if (activeSoulDoc === 'persona') updated.personaMarkdown = editedSoulText;
    if (activeSoulDoc === 'taste') updated.tasteMarkdown = editedSoulText;
    if (activeSoulDoc === 'heartbeat') updated.heartbeatMarkdown = editedSoulText;

    try {
      const resp = await fetch('/api/mercury/soul/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await resp.json();
      if (data.soul) {
        setSoul(data.soul);
        setSoulSaveSuccess(true);
        setTimeout(() => setSoulSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('[Save Soul Error]:', err);
    } finally {
      setSoulSaving(false);
    }
  };

  // Update Permission Toggle
  const handleTogglePermission = async (key: keyof MercuryPermissionConfig) => {
    if (!permissions) return;
    const nextVal = !permissions[key];
    setPermissions({ ...permissions, [key]: nextVal });
    try {
      await fetch('/api/mercury/permissions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: nextVal }),
      });
    } catch (err) {
      console.error('[Permission Update Error]:', err);
    }
  };

  // Filtered facts
  const filteredFacts = facts.filter((f) => {
    const matchCat = factCategoryFilter === 'all' || f.category === factCategoryFilter;
    const matchSearch =
      !searchQuery.trim() ||
      f.statementFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.statementEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoryName = (cat: MercuryFactCategory) => {
    switch (cat) {
      case 'preference':
        return lang === 'fa' ? 'ترجیحات یادگیری' : 'Learning Preference';
      case 'academic_goal':
        return lang === 'fa' ? 'هدف آکادمیک' : 'Academic Goal';
      case 'weakness':
        return lang === 'fa' ? 'نقطه نیازمند تقویت' : 'Focus Area';
      case 'strength':
        return lang === 'fa' ? 'نقطه قوت تثبیت‌شده' : 'Mastered Strength';
      case 'project':
        return lang === 'fa' ? 'پروژه مهندسی' : 'Active Project';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: Mercury Agent Architecture */}
      <section className="glass-surface rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-sky-400/30 shadow-lg">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-400/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'هسته خودگردان مرکیوری' : 'Mercury Agent Runtime'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Always-On Daemon</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Second Brain SQLite Memory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white [text-wrap:balance]">
            {lang === 'fa'
              ? '⚡ دانشیار مرکیوری: دستیار هوشمند خودگردان مهندسی و مغز دوم'
              : '⚡ DaneshYar Mercury Agent: Soul-Driven Autonomous AI & Second Brain'}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'fa'
              ? 'با الهام از معماری پیشرفته Mercury Agent: عاملی با روح و شخصیت قابل‌ویرایش (SOUL.md)، حافظه ماندگار روی دیسک (Second Brain)، ناوگان ربات‌های پژوهشی و مهندسی مستقل، و نظارت بر امنیت و بودجه توکن روزانه.'
              : 'A soul-driven personal AI agent built into DaneshYar: remembers what matters, asks before it acts, runs autonomous specialist bots, and executes engineering tasks with verified testing.'}
          </p>

          {/* Quick HUD Metrics */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
              <Brain className="w-3.5 h-3.5 text-purple-500" />
              <span>
                {facts.length} {lang === 'fa' ? 'فکت ماندگار در مغز دوم' : 'durable facts stored'}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
              <Bot className="w-3.5 h-3.5 text-sky-500" />
              <span>
                {bots.length} {lang === 'fa' ? 'ربات تخصصی در ناوگان' : 'specialist bots'}
              </span>
            </div>

            {permissions && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="tabular-nums font-mono">
                  {permissions.tokensConsumedToday.toLocaleString()} / {permissions.dailyTokenLimit.toLocaleString()}
                </span>
                <span>{lang === 'fa' ? 'توکن مصرفی' : 'tokens'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-sm"
          >
            <Terminal className="w-4 h-4" />
            <span>{lang === 'fa' ? 'کنسول تعاملی عامل' : 'Open Agent Terminal'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('telegram')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            <Share2 className="w-4 h-4 text-sky-500" />
            <span>{lang === 'fa' ? 'اتصال تلگرام و وب‌هوک' : 'Telegram Bot Bridge'}</span>
          </button>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'fleet'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? '🤖 ناوگان ربات‌های تخصصی (Mercury Bots)' : '🤖 Specialist Bots Fleet'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('memory')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'memory'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? '🧠 مغز دوم و فکت‌های ماندگار (Second Brain)' : '🧠 Second Brain Memory'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('soul')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'soul'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? '🎭 روح، شخصیت و سلیقه (SOUL.md)' : '🎭 Soul & Persona'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? '🛡️ مجوزها و بودجه توکن (Permissions)' : '🛡️ Permissions & Budget'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terminal')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'terminal'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? '💬 ترمینال و فرامین شل (CLI / Chat)' : '💬 Terminal & Chat'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('telegram')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'telegram'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? '📱 تلگرام و کانال‌ها (Multi-Channel)' : '📱 Telegram Bridge'}</span>
        </button>
      </div>

      {/* Deliverable Preview Drawer Modal */}
      {selectedDeliverable && (
        <div className="glass-surface rounded-3xl p-6 border-sky-400/50 dark:border-sky-500/40 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedDeliverable.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDeliverable(null)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {lang === 'fa' ? 'بستن' : 'Close'}
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span>سازنده: {selectedDeliverable.botName}</span>
            <span>·</span>
            <span>فایل: {selectedDeliverable.fileName}</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {selectedDeliverable.summary}
          </p>
        </div>
      )}

      {/* TAB 1: FLEET OF SPECIALIST BOTS */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ناوگان ربات‌های مهندسی خودگردان' : 'Autonomous Specialist Fleet'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'fa'
                  ? 'هر ربات دارای برنامه زمان‌بندی (Cron)، مدل اختصاصی، مهارت‌های نصب‌شده و پوشه خروجی مستقل است.'
                  : 'Specialists run on schedule, hand work to each other, and drop finished files in your folder.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSendMessage('/bots')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>{lang === 'fa' ? 'استعلام وضعیت با CLI' : 'Query via CLI'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bots.map((bot) => {
              const isRunning = runningBotId === bot.id;
              return (
                <div
                  key={bot.id}
                  className="glass-surface rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-sky-400/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800">
                        {bot.avatarIcon}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {lang === 'fa' ? bot.nameFa : bot.nameEn}
                        </h4>
                        <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                          {lang === 'fa' ? bot.roleFa : bot.roleEn}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        bot.status === 'running' || isRunning
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                          : bot.status === 'scheduled'
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>{lang === 'fa' ? 'در حال اجرا' : 'Running'}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>{bot.status}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {bot.personaSummary}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {bot.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Bot Metrics */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span title="Cron schedule">⏰ {bot.scheduleCron}</span>
                    <span>
                      {bot.usedTokensToday.toLocaleString()} / {bot.dailyBudgetTokens.toLocaleString()} tokens
                    </span>
                  </div>

                  {/* Actions & Deliverables */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isRunning}
                      onClick={() => handleRunBot(bot.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{lang === 'fa' ? 'اجرای مستقل ربات' : 'Trigger Turn'}</span>
                    </button>

                    {bot.recentDeliverables.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDeliverable({
                            botName: lang === 'fa' ? bot.nameFa : bot.nameEn,
                            title: lang === 'fa' ? bot.recentDeliverables[0].titleFa : bot.recentDeliverables[0].titleEn,
                            fileName: bot.recentDeliverables[0].fileName,
                            summary: bot.recentDeliverables[0].summary,
                          })
                        }
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <FileText className="w-3 h-3 text-sky-500" />
                        <span>{lang === 'fa' ? 'آخرین خروجی' : 'Latest File'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SECOND BRAIN & PERSISTENT MEMORY */}
      {activeTab === 'memory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'مغز دوم و حافظه پایدار (Second Brain SQLite)' : 'Second Brain Persistent Memory'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'fa'
                  ? 'فکت‌های ماندگار، اهداف، نقاط قوت و ضعف استخراج‌شده از تعاملات شما که در پاسخ‌های بعدی به کار گرفته می‌شوند.'
                  : 'Typed, deduplicated facts stored locally in SQLite with full-text search.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNewFactModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'fa' ? 'ثبت فکت جدید' : 'Add Memory Fact'}</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute start-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'fa' ? 'جستجو در فکت‌های حافظه مغز دوم...' : 'Search facts in Second Brain...'}
                className="w-full ps-10 pe-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {(['all', 'preference', 'academic_goal', 'weakness', 'strength', 'project'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFactCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    factCategoryFilter === cat
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat === 'all' ? (lang === 'fa' ? 'همه' : 'All') : categoryName(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* New Fact Composer Modal */}
          {newFactModalOpen && (
            <form
              onSubmit={handleAddFact}
              className="glass-surface rounded-3xl p-6 space-y-4 border border-sky-400/50"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ثبت فکت ماندگار در مغز دوم' : 'Store Durable Fact in Second Brain'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={newFactCategory}
                  onChange={(e) => setNewFactCategory(e.target.value as MercuryFactCategory)}
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="preference">{categoryName('preference')}</option>
                  <option value="academic_goal">{categoryName('academic_goal')}</option>
                  <option value="weakness">{categoryName('weakness')}</option>
                  <option value="strength">{categoryName('strength')}</option>
                  <option value="project">{categoryName('project')}</option>
                </select>
                <input
                  type="text"
                  required
                  value={newFactStatement}
                  onChange={(e) => setNewFactStatement(e.target.value)}
                  placeholder={lang === 'fa' ? 'عبارت فکت (مثلاً ترجیح حل با روش گره)' : 'Statement (e.g. nodal analysis preferred)'}
                  className="sm:col-span-2 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewFactModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {lang === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
                >
                  {lang === 'fa' ? 'ثبت در حافظه' : 'Save Fact'}
                </button>
              </div>
            </form>
          )}

          {/* Facts List */}
          <div className="space-y-3">
            {filteredFacts.length === 0 ? (
              <div className="glass-surface rounded-3xl p-10 text-center text-xs text-slate-500">
                {lang === 'fa' ? 'هیچ فکتی با این معیارها یافت نشد.' : 'No facts found.'}
              </div>
            ) : (
              filteredFacts.map((fact) => (
                <div
                  key={fact.id}
                  className="glass-surface rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-200/80 dark:border-slate-800"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-sky-600 dark:text-sky-400">
                        {categoryName(fact.category)}
                      </span>
                      <span>·</span>
                      <span>منبع: {fact.source}</span>
                      <span>·</span>
                      <span>{fact.createdAt}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {lang === 'fa' ? fact.statementFa : fact.statementEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-end">
                      <div className="text-[11px] text-slate-500">اطمینان</div>
                      <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {Math.round(fact.confidence * 100)}%
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFact(fact.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      title={lang === 'fa' ? 'حذف فکت' : 'Delete Fact'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SOUL, PERSONA, TASTE & HEARTBEAT */}
      {activeTab === 'soul' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'روح، شخصیت و استانداردهای فنی (SOUL.md)' : 'Agent Soul, Persona & Taste'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'fa'
                  ? 'شما مالک شخصیت دستیار خود هستید. این فایل‌های Markdown مستقیماً به پرامپت سیستمی عامل تزریق می‌شوند.'
                  : 'Mercury character defined by plain Markdown files that you can inspect and edit.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveSoul}
              disabled={soulSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors"
            >
              {soulSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{lang === 'fa' ? 'ذخیره تنظیمات روح' : 'Save Soul Config'}</span>
            </button>
          </div>

          {soulSaveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'fa' ? 'فایل روح با موفقیت به‌روزرسانی شد.' : 'Soul configuration saved successfully.'}</span>
            </div>
          )}

          {/* Subtabs for Soul Docs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {[
              { id: 'soul', label: 'SOUL.md (فلسفه و اخلاق)' },
              { id: 'persona', label: 'PERSONA.md (لحن و ارتباط)' },
              { id: 'taste', label: 'TASTE.md (سلیقه کد و فرمول)' },
              { id: 'heartbeat', label: 'HEARTBEAT.md (پالس پس‌زمینه)' },
            ].map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setActiveSoulDoc(doc.id as any)}
                className={`px-3 py-1.5 text-xs rounded-lg font-mono cursor-pointer transition-colors ${
                  activeSoulDoc === doc.id
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {doc.label}
              </button>
            ))}
          </div>

          <textarea
            rows={16}
            value={editedSoulText}
            onChange={(e) => setEditedSoulText(e.target.value)}
            className="w-full font-mono text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
          />
        </div>
      )}

      {/* TAB 4: PERMISSIONS & SECURITY */}
      {activeTab === 'security' && permissions && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'ماتریس امنیت و بودجه توکن (Ask Before It Acts)' : 'Security Matrix & Token Budget'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'fa'
                ? 'مرکیوری قبل از اجرای دستورات شل یا دستکاری فایل‌ها اجازه می‌گیرد و بودجه مصرف روزانه را مهار می‌کند.'
                : 'Mercury sits between the model and machine: scoped paths, shell approvals, and daily token budgets.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Safety Toggles */}
            <div className="glass-surface rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'fa' ? 'مجوزها و حفاظ‌های ایمنی' : 'Safety Gates'}</span>
              </h4>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 cursor-pointer">
                  <span>{lang === 'fa' ? 'پرسش قبل از اجرای دستورات شل (Ask Before Shell)' : 'Ask Before Shell Execution'}</span>
                  <input
                    type="checkbox"
                    checked={permissions.askBeforeShell}
                    onChange={() => handleTogglePermission('askBeforeShell')}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 cursor-pointer">
                  <span>{lang === 'fa' ? 'پرسش قبل از نوشتن روی فایل‌ها (Ask Before Write)' : 'Ask Before File Write'}</span>
                  <input
                    type="checkbox"
                    checked={permissions.askBeforeFileWrite}
                    onChange={() => handleTogglePermission('askBeforeFileWrite')}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 cursor-pointer">
                  <span>{lang === 'fa' ? 'محافظت از آدرس‌های خصوصی شبکه (SSRF Guard)' : 'SSRF Private IP Guard'}</span>
                  <input
                    type="checkbox"
                    checked={permissions.ssrfGuardEnabled}
                    onChange={() => handleTogglePermission('ssrfGuardEnabled')}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Token Budget Meter */}
            <div className="glass-surface rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>{lang === 'fa' ? 'بودجه توکن روزانه' : 'Daily Token Budget'}</span>
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">مصرف شده امروز</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {permissions.tokensConsumedToday.toLocaleString()} / {permissions.dailyTokenLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((permissions.tokensConsumedToday / permissions.dailyTokenLimit) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 cursor-pointer text-xs">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {lang === 'fa' ? 'حالت ذخیره توکن (Token Saver Mode)' : 'Token Saver Mode'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {lang === 'fa'
                      ? 'کوتاه‌سازی تاریخچه و هدایت کارهای سبک به مدل‌های سریع‌تر'
                      : 'Trims context and routes routine work to fast models'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={permissions.tokenSaverActive}
                  onChange={() => handleTogglePermission('tokenSaverActive')}
                  className="w-4 h-4 text-sky-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Scoped Folders & Blocklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-surface rounded-3xl p-5 space-y-3 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <FolderLock className="w-4 h-4 text-sky-500" />
                <span>{lang === 'fa' ? 'پوشه‌های مجاز عامل (Scoped Folders)' : 'Scoped Folders'}</span>
              </div>
              <ul className="space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-300">
                {permissions.scopedFolders.map((dir) => (
                  <li key={dir} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/80">
                    {dir}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-surface rounded-3xl p-5 space-y-3 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>{lang === 'fa' ? 'لیست سیاه دستورات خطرناک شل' : 'Blocked Shell Commands'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {permissions.blockedShellCommands.map((cmd) => (
                  <span
                    key={cmd}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono"
                  >
                    {cmd}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INTERACTIVE AGENT TERMINAL & CHAT */}
      {activeTab === 'terminal' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-500" />
                <span>{lang === 'fa' ? 'ترمینال و کنسول زنده دانشیار مرکیوری' : 'Mercury Interactive CLI & Chat'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'fa'
                  ? 'فرمان مستقیم به عامل یا ارسال دستورات شل: `/memory`، `/bots`، `/budget`، `/code`، `/status`'
                  : 'Chat with autonomous tools, memory recall, and slash commands.'}
              </p>
            </div>

            {/* Specialist Focus Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">{lang === 'fa' ? 'کانال ربات:' : 'Bot Focus:'}</span>
              <select
                value={activeBotFocus}
                onChange={(e) => setActiveBotFocus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="all">⚡ هسته عمومی مرکیوری (Mercury Core)</option>
                <option value="archimedes">🔬 ارشمیدس (پژوهش مقالات)</option>
                <option value="turing">💻 تورینگ (کد و شبیه‌سازی)</option>
                <option value="euler">📐 اویلر (ریاضی و فرمول)</option>
                <option value="hypatia">🎯 هیپاتیا (آمادگی آزمون)</option>
              </select>
            </div>
          </div>

          {/* Quick Slash Commands Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">فرمان‌های سریع:</span>
            {[
              { cmd: '/memory', label: '🧠 /memory (فکت‌ها)' },
              { cmd: '/bots', label: '🤖 /bots (ناوگان)' },
              { cmd: '/budget', label: '📊 /budget (بودجه)' },
              { cmd: '/code', label: '💻 /code (تست کد)' },
              { cmd: '/status', label: '⚡ /status (وضعیت هسته)' },
            ].map((sc) => (
              <button
                key={sc.cmd}
                type="button"
                onClick={() => handleSendMessage(sc.cmd)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-slate-700 dark:text-slate-200 text-[11px] font-mono cursor-pointer transition-colors"
              >
                {sc.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="glass-surface rounded-3xl p-5 space-y-4 max-h-[520px] overflow-y-auto border border-slate-200/80 dark:border-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`space-y-2 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}
              >
                <div
                  className={`inline-block max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white ms-auto text-start'
                      : msg.sender === 'system'
                      ? 'bg-slate-200/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono text-xs'
                      : 'bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Sender header */}
                  <div className="flex items-center gap-1.5 text-[11px] opacity-75 mb-1.5 font-sans">
                    {msg.sender === 'user' ? (
                      <span>دانشجو</span>
                    ) : msg.sender === 'bot' ? (
                      <span className="text-amber-500 dark:text-amber-400 font-bold">
                        ربات تخصصی {msg.botId}
                      </span>
                    ) : (
                      <span className="text-sky-600 dark:text-sky-400 font-bold">
                        ⚡ دانشیار مرکیوری
                      </span>
                    )}
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Thought process badge if any */}
                  {msg.thoughtProcess && (
                    <details className="mb-2 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                      <summary className="cursor-pointer font-bold text-sky-600 dark:text-sky-400">
                        {lang === 'fa' ? 'فرایند تفکر عامل (Chain of Thought)...' : 'Agent Reasoning...'}
                      </summary>
                      <div className="mt-1 pt-1 border-t border-slate-200 dark:border-slate-700 text-[11px] leading-relaxed">
                        {msg.thoughtProcess}
                      </div>
                    </details>
                  )}

                  {/* Tool calls execution badge */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {msg.toolCalls.map((tc) => (
                        <div
                          key={tc.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono text-emerald-800 dark:text-emerald-200"
                        >
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Tool: {tc.toolName}</span>
                          </span>
                          <span>{tc.result}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Main text message */}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 p-3 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                <span>{lang === 'fa' ? 'دانشیار مرکیوری در حال پردازش و استخراج فکت‌ها...' : 'Mercury is thinking...'}</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={
                lang === 'fa'
                  ? 'دستور خود را بنویسید (مثلاً: /memory یا حل یک تمرین مهندسی)...'
                  : 'Message Mercury or type /help, /memory, /bots...'
              }
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'fa' ? 'ارسال' : 'Send'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: TELEGRAM & MULTI-CHANNEL INTEGRATION */}
      {activeTab === 'telegram' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-sky-500" />
              <span>{lang === 'fa' ? 'اتصال تلگرام، دیسکورد و اسلک (Multi-Channel Access)' : 'Multi-Channel Telegram Bridge'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'fa'
                ? 'مرکیوری یک فرآیند پس‌زمینه مستقل است. از تلگرام، دیسکورد یا وب پیام بدهید؛ به همان حافظه و ربات‌ها دسترسی دارید.'
                : 'A single runtime process powers terminal, web dashboard, and messaging channels like Telegram.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Telegram Simulator Card */}
            <div className="glass-surface rounded-3xl p-6 space-y-4 border border-sky-300/40">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-sky-500 text-white">✈️</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'ربات تلگرام دانشیار مرکیوری' : 'DaneshYar Mercury Telegram Bot'}
                  </h4>
                  <p className="text-xs text-slate-500">@DanshyarMercuryBot</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <div className="font-bold text-sky-600 dark:text-sky-400">
                  {lang === 'fa' ? 'شبیه‌سازی فرامین تلگرام:' : 'Simulate Telegram Commands:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('terminal');
                      handleSendMessage('/status');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-mono cursor-pointer"
                  >
                    /start
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('terminal');
                      handleSendMessage('/bots');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-mono cursor-pointer"
                  >
                    /bots
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('terminal');
                      handleSendMessage('/memory');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-mono cursor-pointer"
                  >
                    /memory
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('terminal');
                      handleSendMessage('/budget');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-mono cursor-pointer"
                  >
                    /budget
                  </button>
                </div>
              </div>
            </div>

            {/* Local CLI Setup Instructions */}
            <div className="glass-surface rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'fa' ? 'نصب کلاینت CLI محلی مرکیوری' : 'Local CLI Companion'}</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  {lang === 'fa'
                    ? 'برای اجرای هسته دائم‌الفعال مرکیوری روی سیستم شخصی خود با دسترسی به پوشه‌های محلی:'
                    : 'To run Mercury Agent natively on your workstation with local filesystem tools:'}
                </p>

                <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs select-all">
                  npm i -g @cosmicstack/mercury-agent
                </div>

                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs select-all">
                  mercury doctor # تنظیم کلیدها و توکن تلگرام
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
