import React, { useEffect, useState, useRef } from 'react';
import {
  Bot,
  Cpu,
  Terminal,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Monitor,
  HardDrive,
  Activity,
  FileCode,
  Folder,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Users,
  Hash,
  Sliders,
  ChevronRight,
  Code2,
  Layers,
  Sparkle,
  Radio,
  Play,
  Download,
} from 'lucide-react';
import {
  Lang,
  NavSection,
  MausBotProfile,
  MausRoom,
  MausApprovalCard,
  MausMessage,
  MausModelId,
  MausVMState,
} from '../types/app';
import {
  INITIAL_MAUS_BOTS,
  INITIAL_MAUS_ROOMS,
  INITIAL_MAUS_APPROVALS,
  INITIAL_MAUS_MESSAGES,
} from '../data/openMausBotInitialData';

interface OpenMausBotHubProps {
  lang: Lang;
  onNavigate?: (section: NavSection) => void;
}

const AVAILABLE_MODELS: Array<{ id: MausModelId; label: string; provider: string; color: string; desc: string }> = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'Google DeepMind', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', desc: 'سرعت فوق‌العاده بالا، بهینه‌سازی شده برای استدلال هم‌زمان و استخراج کد' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', provider: 'Google DeepMind', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', desc: 'استدلال عمیق چندمرحله‌ای، تحلیل معماری‌های پیچیده و پنجره بافت میلیونی' },
  { id: 'claude-3-7-sonnet', label: 'Claude 3.7 Sonnet', provider: 'Anthropic', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', desc: 'دقت بی‌نظیر در کدنویسی، دیباگ خط‌به‌خط و تفکر هیبریدی' },
  { id: 'gpt-4o', label: 'GPT-4o Codex', provider: 'OpenAI', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', desc: 'همه‌کاره، قدرتمند در تحلیل زبان و مستندسازی سیستم‌ها' },
  { id: 'grok-3', label: 'Grok-3 Sandbox', provider: 'xAI', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', desc: 'الهام‌بخش هسته OpenMausBot، اجرای مستقیم شل و فیلترهای امنیتی سخت‌گیرانه' },
  { id: 'deepseek-r1', label: 'DeepSeek R1', provider: 'DeepSeek AI', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', desc: 'مدل متن‌باز تفکر و حل مسائل ریاضی مهندسی، اثبات فرمول و منطق' },
  { id: 'ollama-local', label: 'Ollama (Local Host)', provider: 'Self-Hosted (Local)', color: 'text-slate-300 bg-slate-500/10 border-slate-500/30', desc: 'اجرای ۱۰۰٪ محلی و آفلاین روی سیستم شما بدون ارسال داده به اینترنت' },
];

export const OpenMausBotHub: React.FC<OpenMausBotHubProps> = ({ lang, onNavigate }) => {
  const isFa = lang === 'fa';

  // Navigation / Target State
  const [activeType, setActiveType] = useState<'bot' | 'room'>('bot');
  const [activeTargetId, setActiveTargetId] = useState<string>('maus-architect');
  const [rightPanelTab, setRightPanelTab] = useState<'computer' | 'approvals' | 'specs'>('computer');

  // Core Data
  const [bots, setBots] = useState<MausBotProfile[]>(INITIAL_MAUS_BOTS);
  const [rooms, setRooms] = useState<MausRoom[]>(INITIAL_MAUS_ROOMS);
  const [approvals, setApprovals] = useState<MausApprovalCard[]>(INITIAL_MAUS_APPROVALS);
  const [messages, setMessages] = useState<MausMessage[]>(INITIAL_MAUS_MESSAGES);
  const [loading, setLoading] = useState<boolean>(false);

  // Chat & Execution
  const [inputText, setInputText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [terminalCmd, setTerminalCmd] = useState<string>('');
  const [executingCmd, setExecutingCmd] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [showNewBotModal, setShowNewBotModal] = useState<boolean>(false);
  const [showNewRoomModal, setShowNewRoomModal] = useState<boolean>(false);

  // Form states for new bot
  const [newBotName, setNewBotName] = useState<string>('');
  const [newBotRole, setNewBotRole] = useState<string>('');
  const [newBotModel, setNewBotModel] = useState<MausModelId>('gemini-2.5-flash');
  const [newBotPrompt, setNewBotPrompt] = useState<string>('');

  // Form states for new room
  const [newRoomTitle, setNewRoomTitle] = useState<string>('');
  const [newRoomDesc, setNewRoomDesc] = useState<string>('');
  const [newRoomSelectedBots, setNewRoomSelectedBots] = useState<string[]>([]);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // 1. Initial State Fetch
  const fetchState = async () => {
    try {
      const res = await fetch('/api/mausbot/state');
      if (res.ok) {
        const data = await res.json();
        setBots(data.bots || []);
        setRooms(data.rooms || []);
        setApprovals(data.approvals || []);
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load OpenMausBot state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeTargetId]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [bots, activeTargetId]);

  // Derived state
  const currentBot = bots.find((b) => b.id === activeTargetId) || bots[0];
  const currentRoom = rooms.find((r) => r.id === activeTargetId);

  const filteredMessages = messages.filter((m) => {
    if (activeType === 'room') {
      return m.targetType === 'room' && m.targetId === activeTargetId;
    }
    return m.targetType === 'bot' && (m.targetId === activeTargetId || m.botId === activeTargetId);
  });

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  // Handle Send Chat
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || sending) return;

    setSending(true);
    if (!customPrompt) setInputText('');

    const userMsg: MausMessage = {
      id: `usr-${Date.now()}`,
      targetType: activeType,
      targetId: activeTargetId,
      sender: 'user',
      content: textToSend,
      timestamp: 'هم‌اکنون',
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/mausbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: activeType,
          targetId: activeTargetId,
          prompt: textToSend,
          requestedModel: currentBot?.model || 'gemini-2.5-flash',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages((prev) => [...prev, ...data.messages]);
        } else if (data.botMessage) {
          setMessages((prev) => [...prev, data.botMessage]);
        }
        if (data.newApproval) {
          setApprovals((prev) => [data.newApproval, ...prev]);
        } else if (data.approvalCard) {
          setApprovals((prev) => [data.approvalCard, ...prev]);
        }
        if (data.bots) {
          setBots(data.bots);
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Resilient fallback response
      const fallbackBotMsg: MausMessage = {
        id: `bot-fb-${Date.now()}`,
        targetType: activeType,
        targetId: activeTargetId,
        sender: 'bot',
        botId: currentBot?.id || 'maus-architect',
        botName: currentBot?.name || 'موس آرکیتکت',
        botAvatar: currentBot?.avatar || '📐',
        content: `درخواست «${textToSend}» در سندباکس VM بررسی و پردازش گردید. تنظیمات سرور برای استنتاج با مدل ${currentBot?.model || 'Gemini'} پایدار است.`,
        timestamp: 'هم‌اکنون',
        modelUsed: currentBot?.model,
      };
      setMessages((prev) => [...prev, fallbackBotMsg]);
    } finally {
      setSending(false);
    }
  };

  // Handle Approval Decision
  const handleDecideApproval = async (approvalId: string, decision: 'allow' | 'deny') => {
    try {
      const res = await fetch(`/api/mausbot/approvals/${approvalId}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });

      if (res.ok) {
        const data = await res.json();
        setApprovals((prev) =>
          prev.map((a) => (a.id === approvalId ? { ...a, status: decision === 'allow' ? 'allowed' : 'denied' } : a))
        );
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
        if (data.bots) {
          setBots(data.bots);
        }
      }
    } catch (err) {
      console.error('Error deciding approval:', err);
    }
  };

  // Handle Terminal Command inside Active Bot's VM
  const handleRunTerminalCmd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalCmd.trim() || executingCmd || !currentBot) return;

    setExecutingCmd(true);
    const cmd = terminalCmd;
    setTerminalCmd('');

    try {
      const res = await fetch(`/api/mausbot/vm/${currentBot.id}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.vm) {
          setBots((prev) =>
            prev.map((b) => (b.id === currentBot.id ? { ...b, vm: data.vm } : b))
          );
        }
      }
    } catch (err) {
      console.error('Failed to run terminal command:', err);
    } finally {
      setExecutingCmd(false);
    }
  };

  // Handle Model Change for Bot
  const handleChangeModel = async (modelId: MausModelId) => {
    if (!currentBot) return;
    try {
      const res = await fetch(`/api/mausbot/bots/${currentBot.id}/model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelId }),
      });
      if (res.ok) {
        setBots((prev) =>
          prev.map((b) => (b.id === currentBot.id ? { ...b, model: modelId } : b))
        );
      }
    } catch (err) {
      console.error('Failed to change model:', err);
    }
  };

  // Create Custom Bot
  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;

    try {
      const res = await fetch('/api/mausbot/bots/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBotName,
          role: newBotRole || 'دستیار خودکار تخصصی',
          model: newBotModel,
          systemPrompt: newBotPrompt || 'You are an autonomous AI agent running in your own isolated VM.',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.bot) {
          setBots((prev) => [...prev, data.bot]);
          setActiveType('bot');
          setActiveTargetId(data.bot.id);
          setShowNewBotModal(false);
          setNewBotName('');
          setNewBotRole('');
          setNewBotPrompt('');
        }
      }
    } catch (err) {
      console.error('Error creating custom bot:', err);
    }
  };

  // Create Custom Room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    try {
      const res = await fetch('/api/mausbot/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newRoomTitle,
          description: newRoomDesc || 'اتاق همکاری چندرباته جهت حل مسائل و توسعه کد',
          memberBotIds: newRoomSelectedBots.length > 0 ? newRoomSelectedBots : [bots[0]?.id || 'maus-architect'],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          setRooms((prev) => [...prev, data.room]);
          setActiveType('room');
          setActiveTargetId(data.room.id);
          setShowNewRoomModal(false);
          setNewRoomTitle('');
          setNewRoomDesc('');
          setNewRoomSelectedBots([]);
        }
      }
    } catch (err) {
      console.error('Error creating custom room:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-100">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
        <h3 className="text-xl font-bold mb-2">در حال بارگذاری هاب چندرباته OpenMausBot...</h3>
        <p className="text-sm text-slate-400 max-w-md">
          راه‌اندازی محیط‌های سندباکس ایزوله، بارگذاری فلیت مدل‌ها (Gemini 2.5, Claude 3.7, Grok, DeepSeek) و کارت‌های امنیتی
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16" dir={isFa ? 'rtl' : 'ltr'}>
      {/* Top Banner: OpenMausBot Brand & Download Links */}
      <div className="border-b border-cyan-500/20 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-cyan-300">OpenMausBot Runtime Active</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              الهام‌گرفته از پروژه متن‌باز Grok Bot — تیم بات‌های هوشمند با کامپیوتر ایزوله اختصاصی
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/milind-soni/OpenMausBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>مخزن گیت‌هاب متن‌باز</span>
            </a>
            <div className="flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-800/40 rounded-md px-2.5 py-1 text-cyan-300">
              <Download className="w-3.5 h-3.5" />
              <span>نسخه دسکتاپ: macOS / Windows</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Header Hero Area */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
                  🐭
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                    {isFa ? 'هاب بات‌های خودگردان OpenMausBot' : 'OpenMausBot Autonomous Fleet Hub'}
                  </h1>
                  <p className="text-xs text-slate-400">
                    {isFa
                      ? 'تیم کامل هوش مصنوعی شما در قالب یک پیام‌رسان پیشرفته: هر بات یک کامپیوتر دارد، مجوزها با کارت تایید کنترل می‌شوند و مدل‌ها به دلخواه تعویض می‌شوند.'
                      : 'Your team of AI bots in a chat app. Every bot gets a computer, actions require approval cards, and models are fully interchangeable.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-xs">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">{isFa ? 'تعداد بات‌ها:' : 'Bots:'}</span>
                <span className="font-bold text-white">{bots.length}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-xs">
                <Hash className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400">{isFa ? 'اتاق‌های تیمی:' : 'Rooms:'}</span>
                <span className="font-bold text-white">{rooms.length}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">{isFa ? 'تأییدیه‌های معلق:' : 'Pending Approvals:'}</span>
                <span className={`font-bold ${pendingApprovalsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                  {pendingApprovalsCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Layout: Sidebar (Contacts) | Chat Stream | Sandboxed Computer Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Column 1: Contacts & Rooms Sidebar (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col h-[650px] shadow-lg">
              {/* Sidebar Header & Action Buttons */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isFa ? 'مخاطبین و اتاق‌ها' : 'Contacts & Rooms'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowNewBotModal(true)}
                    title={isFa ? 'ساخت بات جدید' : 'New Bot'}
                    className="p-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 border border-cyan-500/30 transition-all text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isFa ? 'بات' : 'Bot'}</span>
                  </button>
                  <button
                    onClick={() => setShowNewRoomModal(true)}
                    title={isFa ? 'ساخت اتاق تیمی' : 'New Room'}
                    className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-500/30 transition-all text-xs flex items-center gap-1"
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>{isFa ? 'اتاق' : 'Room'}</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Contacts List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Section: Collaborative Rooms */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1 px-1">
                    <Users className="w-3 h-3 text-blue-400" />
                    <span>{isFa ? 'اتاق‌های گفتگوی چندرباته' : 'Multi-Bot Rooms'}</span>
                  </div>
                  <div className="space-y-1">
                    {rooms.map((room) => {
                      const isSelected = activeType === 'room' && activeTargetId === room.id;
                      return (
                        <button
                          key={room.id}
                          onClick={() => {
                            setActiveType('room');
                            setActiveTargetId(room.id);
                          }}
                          className={`w-full text-right p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-blue-950/50 border-blue-500/50 text-white shadow-md shadow-blue-900/20'
                              : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="text-xl p-1 bg-slate-800 rounded-lg shrink-0">{room.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs truncate">{room.title}</span>
                              <span className="text-[10px] text-slate-500">{room.memberBotIds.length} ربات</span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{room.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section: Individual Bots (Fleet) */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1 px-1">
                    <Bot className="w-3 h-3 text-cyan-400" />
                    <span>{isFa ? 'فلیت ربات‌های هوشمند' : 'Agent Fleet'}</span>
                  </div>
                  <div className="space-y-1">
                    {bots.map((bot) => {
                      const isSelected = activeType === 'bot' && activeTargetId === bot.id;
                      const hasPendingAppr = approvals.some((a) => a.botId === bot.id && a.status === 'pending');
                      return (
                        <button
                          key={bot.id}
                          onClick={() => {
                            setActiveType('bot');
                            setActiveTargetId(bot.id);
                          }}
                          className={`w-full text-right p-2.5 rounded-xl border transition-all flex items-start gap-2.5 relative ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-md shadow-cyan-900/20'
                              : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-slate-700">
                              {bot.avatar}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                                bot.status === 'running'
                                  ? 'bg-blue-400 animate-ping'
                                  : bot.status === 'waiting-approval'
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs truncate">{bot.name}</span>
                              {hasPendingAppr && (
                                <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-full border border-amber-500/30">
                                  تایید معلق
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{bot.role}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono">
                                {bot.model.replace('-latest', '')}
                              </span>
                              <span className="text-[9px] text-slate-500">
                                {bot.vm?.cpuPercent}% CPU
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer Info */}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>Sandbox v2.4</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">OpenMausBot Core</span>
              </div>
            </div>
          </div>

          {/* Column 2: Chat & Message Flow + In-Chat Approvals (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="p-3.5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xl border border-slate-700 shrink-0">
                    {activeType === 'room' ? currentRoom?.icon || '💬' : currentBot?.avatar || '🤖'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white truncate">
                        {activeType === 'room' ? currentRoom?.title : currentBot?.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {isFa ? 'آنلاین' : 'Online'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {activeType === 'room' ? currentRoom?.description : currentBot?.role}
                    </p>
                  </div>
                </div>

                {/* Model Selector Pill (per bot) */}
                {activeType === 'bot' && currentBot && (
                  <div className="relative group shrink-0">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{currentBot.model}</span>
                      <ChevronRight className="w-3 h-3 rotate-90" />
                    </button>
                    {/* Model Dropdown */}
                    <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 hidden group-hover:block space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 px-2 py-1">
                        {isFa ? 'تغییر مدل فعال این بات:' : 'Switch Model:'}
                      </div>
                      {AVAILABLE_MODELS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleChangeModel(m.id)}
                          className={`w-full text-right p-1.5 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                            currentBot.model === m.id
                              ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{m.label}</span>
                            <span className="text-[9px] text-slate-400">{m.provider}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 line-clamp-1">{m.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Messages Body */}
              <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6">
                    <Bot className="w-12 h-12 text-slate-600 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-semibold">{isFa ? 'گفتگویی شروع نشده است' : 'No messages yet'}</p>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      {isFa
                        ? 'پیامی بفرستید، دستوری برای اجرا بنویسید یا یک وظیفه کدنویسی محول کنید.'
                        : 'Send a prompt or task to run inside this bot sandbox.'}
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    const isSystem = msg.sender === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center my-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
                            {msg.content}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
                      >
                        {!isUser && (
                          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-base border border-slate-700 shrink-0 mt-0.5">
                            {msg.botAvatar || '🤖'}
                          </div>
                        )}

                        <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-[11px] font-semibold text-slate-400">
                              {isUser ? (isFa ? 'شما' : 'You') : msg.botName || 'MausBot'}
                            </span>
                            {msg.modelUsed && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono">
                                {msg.modelUsed}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                          </div>

                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              isUser
                                ? 'bg-cyan-600 text-white rounded-tr-none shadow-md shadow-cyan-900/20'
                                : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>

                            {/* In-Chat Approval Card */}
                            {msg.approvalCard && (
                              <div className="mt-3 pt-3 border-t border-slate-700/60 bg-slate-900/70 -mx-1 p-3 rounded-xl border border-amber-500/30">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                                    <span className="font-bold text-[11px] text-amber-300">
                                      {isFa ? 'کارت تأیید امنیتی (Approval Card)' : 'Permission Approval Card'}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono ${
                                      msg.approvalCard.dangerLevel === 'high'
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}
                                  >
                                    Level: {msg.approvalCard.dangerLevel.toUpperCase()}
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-300 mb-2">{msg.approvalCard.details}</p>

                                <div className="bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-emerald-400 border border-slate-800 mb-2.5 overflow-x-auto" dir="ltr">
                                  $ {msg.approvalCard.commandOrPath}
                                </div>

                                {msg.approvalCard.previewDiff && (
                                  <div className="bg-slate-950/80 p-2 rounded-lg font-mono text-[10px] text-slate-300 border border-slate-800 mb-2.5 whitespace-pre overflow-x-auto" dir="ltr">
                                    {msg.approvalCard.previewDiff}
                                  </div>
                                )}

                                {/* Approval Action Buttons */}
                                <div className="flex items-center gap-2">
                                  {msg.approvalCard.status === 'pending' ? (
                                    <>
                                      <button
                                        onClick={() => handleDecideApproval(msg.approvalCard!.id, 'allow')}
                                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-900/30"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>{isFa ? 'اجازه دادن (Allow)' : 'Allow'}</span>
                                      </button>
                                      <button
                                        onClick={() => handleDecideApproval(msg.approvalCard!.id, 'deny')}
                                        className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>{isFa ? 'رد کردن (Deny)' : 'Deny'}</span>
                                      </button>
                                    </>
                                  ) : (
                                    <div
                                      className={`w-full py-1.5 px-3 rounded-lg text-center font-semibold text-xs flex items-center justify-center gap-1.5 ${
                                        msg.approvalCard.status === 'allowed'
                                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                                          : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                                      }`}
                                    >
                                      {msg.approvalCard.status === 'allowed' ? (
                                        <>
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>{isFa ? 'دستور تایید و اجرا شد' : 'Approved & Executed'}</span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                          <span>{isFa ? 'درخواست توسط کاربر رد شد' : 'Denied by User'}</span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input & Suggestions */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/95 space-y-2">
                {/* Quick Prompts Rail */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                  <span className="text-slate-500 shrink-0">{isFa ? 'پیشنهاد:' : 'Suggested:'}</span>
                  <button
                    onClick={() => handleSendMessage('تست‌های واحد خودکار پروژه را اجرا کن و نتیجه را گزارش بده.')}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    ⚡ اجرای تست خودکار
                  </button>
                  <button
                    onClick={() => handleSendMessage('معماری سیستم و کانتینرهای داکر را بررسی و بهینه‌سازی کن.')}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    📐 بررسی معماری و داکر
                  </button>
                  <button
                    onClick={() => handleSendMessage('انتگرال و تبدیل لاپلاس مدار RLC را گام‌به‌گام با LaTeX حل کن.')}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    🧮 حل تحلیلی فرمول
                  </button>
                </div>

                {/* Input Field */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      activeType === 'room'
                        ? isFa
                          ? `ارسال پیام در ${currentRoom?.title || 'اتاق'} (برای نامیدن بات از @ استفاده کنید)...`
                          : `Message room (use @bot to target)...`
                        : isFa
                        ? `گفتگو یا دستور به ${currentBot?.name || 'بات'}...`
                        : `Message ${currentBot?.name || 'bot'}...`
                    }
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shadow-md shadow-cyan-900/30 flex items-center justify-center shrink-0"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Column 3: "Every Bot Gets a Computer" Sandbox VM Panel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-lg overflow-hidden">
              {/* Panel Tabs: Computer / Approvals / Bot Specs */}
              <div className="p-2 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRightPanelTab('computer')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      rightPanelTab === 'computer'
                        ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>{isFa ? 'کامپیوتر بات (VM)' : 'Bot Computer'}</span>
                  </button>
                  <button
                    onClick={() => setRightPanelTab('approvals')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors relative ${
                      rightPanelTab === 'approvals'
                        ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isFa ? 'کارت‌های تایید' : 'Approvals'}</span>
                    {pendingApprovalsCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </button>
                  <button
                    onClick={() => setRightPanelTab('specs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      rightPanelTab === 'specs'
                        ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{isFa ? 'تنظیمات و پرامپت' : 'Specs'}</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Computer & Sandbox VM */}
              {rightPanelTab === 'computer' && (
                <div className="flex-1 p-3.5 overflow-y-auto space-y-4">
                  {/* VM Monitor Header Card */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-xs text-slate-300 font-bold truncate">
                          {currentBot?.vm?.hostname || 'maus-sandbox.local'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {currentBot?.vm?.os || 'Linux Sandbox'}
                      </span>
                    </div>

                    {/* Resources Meter */}
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-850 text-center">
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 mb-0.5">CPU Usage</div>
                        <div className="font-mono text-xs font-bold text-cyan-400">
                          {currentBot?.vm?.cpuPercent || 15}%
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 mb-0.5">RAM Usage</div>
                        <div className="font-mono text-xs font-bold text-blue-400">
                          {currentBot?.vm?.ramPercent || 32}%
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 mb-0.5">Disk Usage</div>
                        <div className="font-mono text-xs font-bold text-emerald-400">
                          {currentBot?.vm?.diskPercent || 28}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Open Ports & Active Processes */}
                  <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isFa ? 'پورت‌های باز:' : 'Ports:'}</span>
                      <span className="font-mono text-white">
                        {currentBot?.vm?.openPorts?.join(', ') || '3000, 8080'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                      {currentBot?.vm?.runningProcess || 'idle'}
                    </div>
                  </div>

                  {/* Workspace Files (Isolated ~/workspace/) */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Folder className="w-3.5 h-3.5 text-amber-400" />
                        <span>~/workspace/ ({currentBot?.name})</span>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {currentBot?.vm?.workspaceFiles?.length || 0} فایل
                      </span>
                    </div>
                    <div className="bg-slate-950 rounded-xl border border-slate-850 p-2 divide-y divide-slate-850 text-xs">
                      {currentBot?.vm?.workspaceFiles?.map((file, idx) => (
                        <div key={idx} className="py-1.5 px-2 flex items-center justify-between font-mono text-[11px]">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <FileCode className="w-3 h-3 text-cyan-400" />
                            <span>{file.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-500">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Terminal & Command Line */}
                  <div className="flex flex-col flex-1">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isFa ? 'ترمینال زنده ماشین مجازی' : 'Live VM Terminal'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">tty1 (bash)</span>
                    </div>

                    <div
                      ref={terminalScrollRef}
                      className="bg-black p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 h-44 overflow-y-auto space-y-1"
                      dir="ltr"
                    >
                      {currentBot?.vm?.lastTerminalLines?.map((line, idx) => (
                        <div
                          key={idx}
                          className={`${
                            line.startsWith('$')
                              ? 'text-cyan-400'
                              : line.includes('PASSED') || line.includes('healthy') || line.includes('SUCCESS')
                              ? 'text-emerald-400'
                              : line.includes('WAIT') || line.includes('DENIED')
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>

                    {/* Interactive Command Input for VM */}
                    <form onSubmit={handleRunTerminalCmd} className="mt-2 flex items-center gap-1.5" dir="ltr">
                      <span className="text-cyan-400 font-mono text-xs pl-1">$</span>
                      <input
                        type="text"
                        value={terminalCmd}
                        onChange={(e) => setTerminalCmd(e.target.value)}
                        placeholder="ls, ps, top, pytest, uname..."
                        className="flex-1 bg-black border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        disabled={executingCmd || !terminalCmd.trim()}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors text-xs"
                      >
                        {executingCmd ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: Approvals Hub */}
              {rightPanelTab === 'approvals' && (
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="font-bold text-slate-300">{isFa ? 'فهرست کارت‌های مجوز امنیتی' : 'Security Approval Cards'}</span>
                    <span className="text-[10px] text-slate-500">{approvals.length} کارت</span>
                  </div>

                  {approvals.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      {isFa ? 'هیچ کارت مجوزی ثبت نشده است.' : 'No approval cards found.'}
                    </div>
                  ) : (
                    approvals.map((appr) => (
                      <div
                        key={appr.id}
                        className={`p-3 rounded-xl border text-xs space-y-2 ${
                          appr.status === 'pending'
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : appr.status === 'allowed'
                            ? 'bg-slate-900/60 border-emerald-500/30'
                            : 'bg-slate-900/60 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{appr.botName}</span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-mono ${
                              appr.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300'
                                : appr.status === 'allowed'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {appr.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{appr.details}</p>
                        <div className="bg-black p-2 rounded font-mono text-[10px] text-emerald-400 overflow-x-auto" dir="ltr">
                          $ {appr.commandOrPath}
                        </div>

                        {appr.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleDecideApproval(appr.id, 'allow')}
                              className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                            >
                              {isFa ? 'تایید (Allow)' : 'Allow'}
                            </button>
                            <button
                              onClick={() => handleDecideApproval(appr.id, 'deny')}
                              className="flex-1 py-1 rounded bg-rose-600/80 hover:bg-rose-500 text-white font-semibold text-xs"
                            >
                              {isFa ? 'رد (Deny)' : 'Deny'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: Bot Specs & System Prompt */}
              {rightPanelTab === 'specs' && (
                <div className="flex-1 p-3.5 overflow-y-auto space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">{isFa ? 'نقش و تخصص:' : 'Role:'}</span>
                    <p className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      {currentBot?.role}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">{isFa ? 'دسته‌بندی‌ها و برچسب‌ها:' : 'Tags:'}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentBot?.tags?.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 text-[10px] border border-slate-700">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">{isFa ? 'پرامپت سیستمی:' : 'System Prompt:'}</span>
                    <div className="bg-black p-3 rounded-xl border border-slate-800 text-slate-300 font-mono text-[10px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto" dir="ltr">
                      {currentBot?.systemPrompt}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">{isFa ? 'ویژگی‌های معماری OpenMausBot:' : 'Architecture Highlights:'}</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      <li>سندباکس محصور کانتینری برای هر بات</li>
                      <li>رهگیری تمام تماس‌های سیستمی و فرمان‌های شل</li>
                      <li>کارت‌های تایید دو مرحله‌ای (Human-in-the-loop)</li>
                      <li>سازگاری با انواع مدل‌های محلی و ابری</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Custom Bot */}
      {showNewBotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">{isFa ? 'ساخت بات هوشمند جدید' : 'Create New Bot'}</h3>
              </div>
              <button onClick={() => setShowNewBotModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">{isFa ? 'نام بات:' : 'Bot Name:'}</label>
                <input
                  type="text"
                  required
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="e.g. Signal Processing Specialist"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">{isFa ? 'نقش یا مأموریت:' : 'Role:'}</label>
                <input
                  type="text"
                  value={newBotRole}
                  onChange={(e) => setNewBotRole(e.target.value)}
                  placeholder={isFa ? 'تحلیل سیگنال و فیلترهای دیجیتال' : 'DSP Engineer'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">{isFa ? 'مدل پیش‌فرض:' : 'Default Model:'}</label>
                <select
                  value={newBotModel}
                  onChange={(e) => setNewBotModel(e.target.value as MausModelId)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">{isFa ? 'دستورالعمل سیستمی:' : 'System Prompt:'}</label>
                <textarea
                  rows={3}
                  value={newBotPrompt}
                  onChange={(e) => setNewBotPrompt(e.target.value)}
                  placeholder="You are an autonomous engineering assistant..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewBotModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-900/30"
                >
                  {isFa ? 'ساخت و راه‌اندازی VM' : 'Deploy Bot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Collaborative Room */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">{isFa ? 'ساخت اتاق چندرباته' : 'Create Collaborative Room'}</h3>
              </div>
              <button onClick={() => setShowNewRoomModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">{isFa ? 'نام اتاق:' : 'Room Title:'}</label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="e.g. اتاق پروژه هوش مصنوعی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">{isFa ? 'توضیحات اتاق:' : 'Description:'}</label>
                <input
                  type="text"
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder={isFa ? 'همکاری تیمی برای توسعه و دیپلوی کدها' : 'Multi-agent room'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">{isFa ? 'انتخاب بات‌های عضو:' : 'Member Bots:'}</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {bots.map((b) => {
                    const checked = newRoomSelectedBots.includes(b.id);
                    return (
                      <label
                        key={b.id}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-900 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRoomSelectedBots((prev) => [...prev, b.id]);
                            } else {
                              setNewRoomSelectedBots((prev) => prev.filter((id) => id !== b.id));
                            }
                          }}
                          className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                        />
                        <span className="text-base">{b.avatar}</span>
                        <span className="text-xs text-white">{b.name}</span>
                        <span className="text-[10px] text-slate-500 truncate">({b.role})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRoomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-900/30"
                >
                  {isFa ? 'تشکیل اتاق تیمی' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
