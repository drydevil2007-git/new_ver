import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FileText,
  Star,
  ThumbsUp,
  MessageSquare,
  Layers,
  Plus,
  Send,
  CheckCircle2,
  Loader2,
  Hash,
  UserCheck,
  Sparkles,
  Lock,
  LogIn,
  User,
} from 'lucide-react';
import { Lang, LeitnerCard, UserSession } from '../types/app';
import { LatexBlock, RichMathText } from './MathRenderer';

interface CommunityAndNotesProps {
  lang: Lang;
  user?: UserSession | null;
  onOpenAuth?: () => void;
  onGenerateFlashcardsFromNote: (
    cards: Omit<LeitnerCard, 'id' | 'box' | 'lastReviewedAt' | 'reviewCount'>[]
  ) => void;
}

interface LectureNote {
  id: string;
  titleFa: string;
  titleEn: string;
  courseCode: string;
  fieldFa: string;
  fieldEn: string;
  author: string;
  university: string;
  pages: number;
  ratingSum: number;
  ratingCount: number;
  downloads: number;
  summaryFa: string;
  summaryEn: string;
  previewFormula: string;
  contentSnippet: string;
  createdAt: string;
}

interface ForumReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface ForumThread {
  id: string;
  title: string;
  body: string;
  field: string;
  courseCode: string;
  author: string;
  upvotes: number;
  solved: boolean;
  createdAt: string;
  replies: ForumReply[];
}

interface AcademicChannel {
  id: string;
  nameFa: string;
  nameEn: string;
  type: 'channel' | 'dm';
  courseCode?: string;
  descriptionFa: string;
  descriptionEn: string;
}

interface AcademicChatMessage {
  id: string;
  channelId: string;
  sender: string;
  role: 'student' | 'professor' | 'ai-bot';
  text: string;
  timestamp: string;
}

export const CommunityAndNotes: React.FC<CommunityAndNotesProps> = ({
  lang,
  user,
  onOpenAuth,
  onGenerateFlashcardsFromNote,
}) => {
  const [subTab, setSubTab] = useState<'chat' | 'notes' | 'forum'>('chat');

  // Real-Time Academic Chat & @دانشیار State
  const [channels, setChannels] = useState<AcademicChannel[]>([]);
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, AcademicChatMessage[]>>({});
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-math');
  const [chatSender, setChatSender] = useState(user?.name || (lang === 'fa' ? 'دانشجو' : 'Student'));
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user?.name) {
      setChatSender(user.name);
    }
  }, [user?.name]);

  // Lecture Notes State
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [noteQuery, setNoteQuery] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCode, setNewNoteCode] = useState('EE-201');
  const [newNoteSummary, setNewNoteSummary] = useState('');
  const [generatingFromId, setGeneratingFromId] = useState<string | null>(null);
  const [generatedBanner, setGeneratedBanner] = useState<string | null>(null);

  // Forum State
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadBody, setNewThreadBody] = useState('');
  const [newThreadCode, setNewThreadCode] = useState('MATH-201');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/notes')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.notes)) setNotes(d.notes);
      })
      .catch(() => {});

    fetch('/api/forum')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.threads)) setThreads(d.threads);
      })
      .catch(() => {});

    fetch('/api/chat/state')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.channels)) setChannels(d.channels);
        if (d.messagesByChannel) setMessagesByChannel(d.messagesByChannel);
      })
      .catch(() => {});

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/academic-chat`);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'chat:init') {
          if (Array.isArray(msg.channels)) setChannels(msg.channels);
          if (msg.messagesByChannel) setMessagesByChannel(msg.messagesByChannel);
        } else if (msg.type === 'chat:message' && msg.message) {
          const incoming: AcademicChatMessage = msg.message;
          setMessagesByChannel((prev) => {
            const existing = prev[incoming.channelId] || [];
            if (existing.some((m) => m.id === incoming.id)) return prev;
            return {
              ...prev,
              [incoming.channelId]: [...existing, incoming],
            };
          });
        }
      } catch {
        // ignore
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const activeChannel = useMemo(
    () => channels.find((c) => c.id === activeChannelId) || channels[0] || null,
    [channels, activeChannelId]
  );

  const activeMessages = useMemo(
    () => messagesByChannel[activeChannelId] || [],
    [messagesByChannel, activeChannelId]
  );

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeMessages.length, activeChannelId]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth?.();
      return;
    }
    const text = chatInput.trim();
    if (!text || sendingChat) return;
    setChatInput('');
    setSendingChat(true);
    try {
      const resp = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: activeChannelId,
          sender: user.name,
          role: user.role,
          avatarUrl: user.photoURL,
          avatarInitials: user.avatarInitials,
          text,
          lang,
        }),
      });
      const data = await resp.json();
      if (data.message) {
        setMessagesByChannel((prev) => {
          const cur = prev[activeChannelId] || [];
          const next = cur.some((m) => m.id === data.message.id) ? cur : [...cur, data.message];
          const withBot =
            data.botMessage && !next.some((m) => m.id === data.botMessage.id)
              ? [...next, data.botMessage]
              : next;
          return { ...prev, [activeChannelId]: withBot };
        });
      }
    } catch {
      // ignore
    } finally {
      setSendingChat(false);
    }
  };

  const insertBotMention = (preset?: string) => {
    if (preset) {
      setChatInput(preset);
    } else if (!chatInput.includes('@دانشیار')) {
      setChatInput((prev) => (prev ? `${prev} @دانشیار ` : '@دانشیار '));
    }
  };

  const handleRateNote = async (noteId: string, stars: number) => {
    try {
      const resp = await fetch(`/api/notes/${noteId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars }),
      });
      const data = await resp.json();
      if (data.note) {
        setNotes((prev) => prev.map((n) => (n.id === noteId ? data.note : n)));
      }
    } catch {
      // ignore
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth?.();
      return;
    }
    if (!newNoteTitle.trim()) return;
    try {
      const resp = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFa: newNoteTitle.trim(),
          titleEn: newNoteTitle.trim(),
          courseCode: newNoteCode.trim(),
          summaryFa: newNoteSummary.trim(),
          author: user.name,
          university: user.university,
        }),
      });
      const data = await resp.json();
      if (data.note) {
        setNotes((prev) => [data.note, ...prev]);
        setNewNoteTitle('');
        setNewNoteSummary('');
        setShowAddNote(false);
      }
    } catch {
      // ignore
    }
  };

  const handleConvertNoteToFlashcards = async (note: LectureNote) => {
    setGeneratingFromId(note.id);
    setGeneratedBanner(null);
    try {
      const resp = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText: `${note.titleFa}\n${note.summaryFa}\n${note.contentSnippet}`,
          courseTitle: note.courseCode,
          count: 5,
          lang,
        }),
      });
      const data = await resp.json();
      if (Array.isArray(data.cards)) {
        onGenerateFlashcardsFromNote(
          data.cards.map((c: { front: string; back: string; formulaLatex?: string; hint?: string }) => ({
            front: c.front,
            back: c.back,
            formulaLatex: c.formulaLatex,
            hint: c.hint,
            deck: note.courseCode,
          }))
        );
        setGeneratedBanner(note.courseCode);
      }
    } catch {
      // ignore
    } finally {
      setGeneratingFromId(null);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth?.();
      return;
    }
    if (!newThreadTitle.trim() || !newThreadBody.trim()) return;
    try {
      const resp = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newThreadTitle.trim(),
          body: newThreadBody.trim(),
          courseCode: newThreadCode.trim(),
          author: user.name,
          badgeFa: `${user.field} · ${user.university}`,
        }),
      });
      const data = await resp.json();
      if (data.thread) {
        setThreads((prev) => [data.thread, ...prev]);
        setNewThreadTitle('');
        setNewThreadBody('');
        setShowNewThread(false);
      }
    } catch {
      // ignore
    }
  };

  const handleReplyThread = async (threadId: string) => {
    if (!user) {
      onOpenAuth?.();
      return;
    }
    const text = (replyDrafts[threadId] || '').trim();
    if (!text) return;
    try {
      const resp = await fetch(`/api/forum/${threadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          author: user.name,
        }),
      });
      const data = await resp.json();
      if (data.thread) {
        setThreads((prev) => prev.map((t) => (t.id === threadId ? data.thread : t)));
        setReplyDrafts((prev) => ({ ...prev, [threadId]: '' }));
      }
    } catch {
      // ignore
    }
  };

  const handleUpvoteThread = async (threadId: string) => {
    try {
      const resp = await fetch(`/api/forum/${threadId}/upvote`, { method: 'POST' });
      const data = await resp.json();
      if (data.thread) {
        setThreads((prev) => prev.map((t) => (t.id === threadId ? data.thread : t)));
      }
    } catch {
      // ignore
    }
  };

  const filteredNotes = notes.filter((n) => {
    const q = noteQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      n.titleFa.toLowerCase().includes(q) ||
      n.titleEn.toLowerCase().includes(q) ||
      n.courseCode.toLowerCase().includes(q) ||
      n.university.toLowerCase().includes(q)
    );
  });

  const studyChannels = channels.filter((c) => c.type === 'channel');
  const dmChannels = channels.filter((c) => c.type === 'dm');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'چت علمی لحظه‌ای، انجمن و مخزن جزوات' : 'Real-Time Academic Chat, Forum & Lecture Notes'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'fa'
              ? 'کانال‌های درسی با حضور ربات هوشمند @دانشیار، پیام مستقیم و آرشیو جزوات دانشگاهی'
              : 'Course study channels with @دانشیار AI bot, direct peer messaging, Q&A forum, and cheat-sheets'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 self-start">
          <button
            type="button"
            onClick={() => setSubTab('chat')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              subTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>{lang === 'fa' ? 'چت علمی و ربات @دانشیار' : 'Academic Chat'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('forum')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              subTab === 'forum'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{lang === 'fa' ? 'انجمن پرسش‌وپاسخ' : 'Q&A Forum'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('notes')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
              subTab === 'notes'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{lang === 'fa' ? 'جزوات و فرمول‌ها' : 'Lecture Notes'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: Real-Time Academic Chat Channels & @دانشیار Bot                 */}
      {/* ===================================================================== */}
      {subTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Channels & DMs Sidebar */}
          <aside className="lg:col-span-4 glass-surface rounded-3xl p-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'نام نمایشی شما در گفتگو' : 'Your Display Name'}
                </label>
                <input
                  type="text"
                  value={chatSender}
                  onChange={(e) => setChatSender(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'کانال‌های تخصصی دروس' : 'Course Study Channels'}
                </div>
                <div className="space-y-1">
                  {studyChannels.map((ch) => {
                    const active = ch.id === activeChannelId;
                    const count = (messagesByChannel[ch.id] || []).length;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setActiveChannelId(ch.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-sky-600 text-white font-semibold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="truncate">{lang === 'fa' ? ch.nameFa : ch.nameEn}</span>
                        <span className={`font-mono text-[11px] tabular-nums ${active ? 'text-sky-100' : 'text-slate-400'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'پیام‌های مستقیم (استاد و هم‌گروهی)' : 'Direct Messages'}
                </div>
                <div className="space-y-1">
                  {dmChannels.map((dm) => {
                    const active = dm.id === activeChannelId;
                    return (
                      <button
                        key={dm.id}
                        type="button"
                        onClick={() => setActiveChannelId(dm.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-sky-600 text-white font-semibold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <UserCheck className="w-4 h-4 shrink-0" />
                        <span className="truncate text-start">{lang === 'fa' ? dm.nameFa : dm.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-800/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-400">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'fa' ? 'فراخوانی ربات هوشمند در چت' : 'In-Thread AI Assistant'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'fa'
                  ? 'در هر کانال عبارت @دانشیار را در پیام خود بنویسید تا پاسخ ریاضی و مهندسی با LaTeX مستقیم داخل گفتگو ارسال شود.'
                  : 'Mention @دانشیار anywhere in a channel message to summon an instant LaTeX-formatted explanation directly in the thread.'}
              </p>
            </div>
          </aside>

          {/* Active Chat Stream */}
          <div className="lg:col-span-8 glass-surface rounded-3xl p-5 sm:p-6 flex flex-col justify-between min-h-[540px] max-h-[680px]">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeChannel ? (lang === 'fa' ? activeChannel.nameFa : activeChannel.nameEn) : '#ریاضی-عمومی'}
                  </h3>
                  {activeChannel?.courseCode && (
                    <span className="text-xs font-mono text-sky-600 dark:text-sky-400">
                      {activeChannel.courseCode}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeChannel ? (lang === 'fa' ? activeChannel.descriptionFa : activeChannel.descriptionEn) : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={() => insertBotMention()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'تگ کردن @دانشیار' : 'Tag @دانشیار'}</span>
              </button>
            </div>

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto py-4 space-y-3 pe-1">
              {activeMessages.map((msg) => {
                const isBot = msg.role === 'ai-bot';
                const isProf = msg.role === 'professor';
                const isMe = Boolean(user && msg.sender === user.name);
                return (
                  <div
                    key={msg.id}
                    className={`rounded-2xl p-4 space-y-1.5 border transition-all ${
                      isMe
                        ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 ring-1 ring-sky-500/20'
                        : isBot
                        ? 'bg-sky-50/85 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70'
                        : isProf
                        ? 'bg-emerald-50/75 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-white/75 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 font-bold">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-sky-600 text-white flex items-center justify-center text-[9px] shrink-0">
                          {isMe && user?.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            msg.sender.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <span
                          className={
                            isMe
                              ? 'text-sky-600 dark:text-sky-400'
                              : isBot
                              ? 'text-sky-700 dark:text-sky-400'
                              : isProf
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-slate-900 dark:text-white'
                          }
                        >
                          {msg.sender} {isMe && <span className="text-[10px] text-sky-500 font-normal">({lang === 'fa' ? 'شما' : 'You'})</span>}
                        </span>
                        <span className="font-normal text-slate-400">·</span>
                        <span className="font-normal text-slate-500 dark:text-slate-400">
                          {isBot
                            ? lang === 'fa' ? 'ربات هوش مصنوعی' : 'AI Assistant'
                            : isProf
                            ? lang === 'fa' ? 'استاد' : 'Professor'
                            : lang === 'fa' ? 'دانشجو' : 'Student'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{msg.timestamp}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed ps-7">
                      <RichMathText text={msg.text} />
                    </div>
                  </div>
                );
              })}

              {sendingChat && (
                <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 px-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === 'fa' ? 'در حال ارسال و بررسی @دانشیار...' : 'Sending message...'}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    insertBotMention(
                      lang === 'fa'
                        ? '@دانشیار لطفاً شرط پایداری مدار RLC سری را با فرمول لاپلاس توضیح بده'
                        : '@دانشیار Please explain RLC series stability condition using Laplace poles'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:border-sky-400 cursor-pointer"
                >
                  {lang === 'fa' ? 'نمونه: سوال از @دانشیار درباره لاپلاس' : 'Sample: Ask @دانشیار about Laplace'}
                </button>
              </div>

              {!user ? (
                <div className="p-4 rounded-2xl glass-subtle border border-sky-500/25 text-center space-y-2.5">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Lock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>
                      {lang === 'fa'
                        ? 'برای ارسال پیام و گفتگو با اساتید و دانشجویان، وارد حساب خود شوید'
                        : 'Please sign in or register to join the discussion and chat'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {lang === 'fa'
                      ? 'امکان ارسال پیام، تبادل نظر علمی و پرسش از هوش مصنوعی @دانشیار نیازمند حساب کاربری فعال است.'
                      : 'Sending messages and tagging @دانشیار for AI answers requires an active account.'}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/25 transition-all cursor-pointer hover:scale-102"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'ورود به حساب کاربری / ثبت‌نام' : 'Sign In / Register'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>{lang === 'fa' ? 'ارسال به عنوان:' : 'Sending as:'}</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-sky-600 text-white flex items-center justify-center text-[9px] shrink-0">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.avatarInitials
                          )}
                        </div>
                        <span className="text-sky-600 dark:text-sky-400">{user.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({user.university})</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSendChat} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        lang === 'fa'
                          ? 'پیام بنویسید یا برای پاسخ فوری بنویسید @دانشیار ...'
                          : 'Write a message or tag @دانشیار for AI help...'
                      }
                      className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="submit"
                      disabled={sendingChat || !chatInput.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold cursor-pointer shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>{lang === 'fa' ? 'ارسال' : 'Send'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: Student Community Q&A Forum                                    */}
      {/* ===================================================================== */}
      {subTab === 'forum' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {lang === 'fa'
                ? 'پرسش‌های مفهومی خود را با دانشجویان مهندسی و دستیاران علمی به اشتراک بگذارید.'
                : 'Discuss challenging engineering derivations and exam concepts with peers.'}
            </p>
            <button
              type="button"
              onClick={() => setShowNewThread((s) => !s)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'fa' ? 'پرسش جدید' : 'Ask Question'}</span>
            </button>
          </div>

          {showNewThread && (
            <form onSubmit={handleCreateThread} className="glass-surface rounded-2xl p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder={lang === 'fa' ? 'عنوان پرسش علمی...' : 'Question title...'}
                  className="sm:col-span-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newThreadCode}
                  onChange={(e) => setNewThreadCode(e.target.value)}
                  placeholder="MATH-201"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
              <textarea
                rows={3}
                value={newThreadBody}
                onChange={(e) => setNewThreadBody(e.target.value)}
                placeholder={lang === 'fa' ? 'توضیح دقیق مسئله یا ابهام درسی...' : 'Describe your question in detail...'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold cursor-pointer">
                {lang === 'fa' ? 'ارسال پرسش' : 'Post Question'}
              </button>
            </form>
          )}

          <div className="space-y-4">
            {threads.map((th) => (
              <div key={th.id} className="glass-surface rounded-3xl p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">{th.courseCode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{th.author}</span>
                      <span aria-hidden="true">·</span>
                      <span>{th.createdAt}</span>
                      {th.solved && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {lang === 'fa' ? 'پاسخ تاییدشده' : 'Solved'}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{th.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpvoteThread(th.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span className="font-mono tabular-nums">{th.upvotes}</span>
                  </button>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{th.body}</p>

                {th.replies.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                    {th.replies.map((rep) => (
                      <div key={rep.id} className="rounded-xl bg-slate-100/80 dark:bg-slate-900/70 p-3.5 text-xs sm:text-sm space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{rep.author}</span>
                          <span>{rep.createdAt}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{rep.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={replyDrafts[th.id] || ''}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [th.id]: e.target.value }))}
                    placeholder={lang === 'fa' ? 'پاسخ علمی خود را بنویسید...' : 'Write a helpful reply...'}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleReplyThread(th.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'ارسال' : 'Reply'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: Lecture Notes & Cheat-Sheets Repository                        */}
      {/* ===================================================================== */}
      {subTab === 'notes' && (
        <div className="space-y-5">
          <div className="glass-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <input
              type="text"
              value={noteQuery}
              onChange={(e) => setNoteQuery(e.target.value)}
              placeholder={lang === 'fa' ? 'جستجو در جزوات (مثلاً مدار، شریف، MATH-102)...' : 'Search notes by course code, title, or university...'}
              className="flex-1 min-w-[220px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 px-4 py-2 text-sm text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowAddNote((s) => !s)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'fa' ? 'ثبت جزوه جدید' : 'Share Note'}</span>
            </button>
          </div>

          {generatedBanner && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-2xl">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'fa'
                  ? `فلش‌کارت‌های درس ${generatedBanner} با موفقیت ساخته و به جعبه لایتنر در «جعبه یادگیری» اضافه شدند.`
                  : `Flashcards for ${generatedBanner} generated and added to your Leitner Box!`}
              </span>
            </div>
          )}

          {showAddNote && (
            <form onSubmit={handleAddNote} className="glass-surface rounded-2xl p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder={lang === 'fa' ? 'عنوان جزوه یا فرمول‌نامه' : 'Note title'}
                  className="sm:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newNoteCode}
                  onChange={(e) => setNewNoteCode(e.target.value)}
                  placeholder="EE-201"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
              <textarea
                rows={2}
                value={newNoteSummary}
                onChange={(e) => setNewNoteSummary(e.target.value)}
                placeholder={lang === 'fa' ? 'چکیده مباحث و فرمول‌های کلیدی جزوه...' : 'Summary and key concepts covered...'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'انتشار در مخزن جزوات' : 'Publish Note'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredNotes.map((note) => {
              const avg = (note.ratingSum / Math.max(1, note.ratingCount)).toFixed(1);
              return (
                <article key={note.id} className="glass-surface rounded-3xl p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">{note.courseCode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{lang === 'fa' ? note.fieldFa : note.fieldEn}</span>
                      <span aria-hidden="true">·</span>
                      <span>{note.university}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{note.pages} {lang === 'fa' ? 'صفحه' : 'pp'}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {lang === 'fa' ? note.titleFa : note.titleEn}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'fa' ? note.summaryFa : note.summaryEn}
                    </p>

                    <div className="rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3">
                      <LatexBlock math={note.previewFormula} displayMode={true} className="text-xs text-slate-900 dark:text-white my-0" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleRateNote(note.id, s)}
                            title={lang === 'fa' ? `امتیاز ${s} از ۵` : `Rate ${s}/5`}
                            className="p-0.5 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-3.5 h-3.5 ${s <= Math.round(Number(avg)) ? 'fill-amber-400' : ''}`} />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {avg} ({note.ratingCount})
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={generatingFromId === note.id}
                      onClick={() => handleConvertNoteToFlashcards(note)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 cursor-pointer"
                    >
                      {generatingFromId === note.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Layers className="w-3.5 h-3.5" />
                      )}
                      <span>{lang === 'fa' ? 'تبدیل به فلش‌کارت' : 'To Flashcards'}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
