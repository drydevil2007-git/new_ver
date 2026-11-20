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
  Search,
  UserPlus,
  Circle,
  CheckCheck,
} from 'lucide-react';
import { Lang, LeitnerCard, UserSession } from '../types/app';
import { LatexBlock, RichMathText } from './MathRenderer';
import { getFirebaseIdToken } from '../lib/googleAuth';

interface CommunityAndNotesProps {
  lang: Lang;
  user: UserSession | null;
  onRequestLogin: () => void;
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
  status?: 'published' | 'draft';
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
  senderId?: string;
  sender: string;
  role: 'student' | 'professor' | 'ai-bot';
  text: string;
  timestamp: string;
}

export const CommunityAndNotes: React.FC<CommunityAndNotesProps> = ({
  lang,
  user,
  onRequestLogin,
  onGenerateFlashcardsFromNote,
}) => {
  const [subTab, setSubTab] = useState<'chat' | 'notes' | 'forum'>('chat');

  // Real-Time Academic Chat & @دانشیار State
  const [channels, setChannels] = useState<AcademicChannel[]>([]);
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, AcademicChatMessage[]>>({});
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-math');
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [chatContacts, setChatContacts] = useState<Array<{ id: string; name: string; role: string; university: string }>>([]);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [unreadByChannel, setUnreadByChannel] = useState<Record<string, number>>({});
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const activeChannelIdRef = useRef(activeChannelId);

  useEffect(() => {
    activeChannelIdRef.current = activeChannelId;
  }, [activeChannelId]);

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
  const [communityError, setCommunityError] = useState<string | null>(null);

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

  }, []);

  useEffect(() => {
    let active = true;
    let ws: WebSocket | null = null;
    if (!user) {
      setChannels([]);
      setChatContacts([]);
      setMessagesByChannel({});
      return () => {
        active = false;
      };
    }

    const connect = async () => {
      setChatError(null);
      try {
        const token = await getFirebaseIdToken();
        if (!token) throw new Error(lang === 'fa' ? 'نشست ورود منقضی شده است.' : 'Your sign-in session has expired.');
        const [stateResponse, contactsResponse] = await Promise.all([
          fetch('/api/chat/state'),
          fetch('/api/chat/contacts'),
        ]);
        if (!stateResponse.ok || !contactsResponse.ok) {
          throw new Error(lang === 'fa' ? 'دریافت گفتگوها ناموفق بود.' : 'Could not load your conversations.');
        }
        const [state, contactsData] = await Promise.all([stateResponse.json(), contactsResponse.json()]);
        if (!active) return;
        if (Array.isArray(state.channels)) {
          setChannels(state.channels);
          if (!state.channels.some((channel: AcademicChannel) => channel.id === activeChannelId)) {
            setActiveChannelId('ch-math');
          }
        }
        if (state.messagesByChannel) setMessagesByChannel(state.messagesByChannel);
        if (Array.isArray(contactsData.contacts)) setChatContacts(contactsData.contacts);

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(
          `${protocol}//${window.location.host}/ws/academic-chat?token=${encodeURIComponent(token)}`
        );
        ws.onmessage = (ev) => {
          try {
            const event = JSON.parse(ev.data);
            if (event.type === 'chat:init') {
              if (Array.isArray(event.channels)) setChannels(event.channels);
              if (event.messagesByChannel) setMessagesByChannel(event.messagesByChannel);
            } else if (event.type === 'chat:message' && event.message) {
              const incoming: AcademicChatMessage = event.message;
              setMessagesByChannel((prev) => {
                const existing = prev[incoming.channelId] || [];
                if (existing.some((message) => message.id === incoming.id)) return prev;
                return { ...prev, [incoming.channelId]: [...existing, incoming] };
              });
              if (incoming.senderId !== user.id && incoming.channelId !== activeChannelIdRef.current) {
                setUnreadByChannel((prev) => ({
                  ...prev,
                  [incoming.channelId]: (prev[incoming.channelId] || 0) + 1,
                }));
              }
            }
          } catch {
            setChatError(lang === 'fa' ? 'پیام دریافتی قابل پردازش نیست.' : 'Could not process an incoming message.');
          }
        };
        ws.onerror = () => {
          if (active) setChatError(lang === 'fa' ? 'اتصال زنده چت برقرار نشد.' : 'Live chat connection failed.');
        };
      } catch (error) {
        if (active) {
          setChatError(error instanceof Error ? error.message : String(error));
        }
      }
    };

    void connect();
    return () => {
      active = false;
      ws?.close();
    };
  }, [user?.id, lang]);

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
    const text = chatInput.trim();
    if (!text || sendingChat || !user) return;
    setSendingChat(true);
    setChatError(null);
    try {
      const resp = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: activeChannelId,
          text,
          lang,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Message could not be sent.');
      if (data.message) {
        setChatInput('');
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
    } catch (error) {
      setChatError(error instanceof Error ? error.message : String(error));
    } finally {
      setSendingChat(false);
    }
  };

  const handleOpenDirectMessage = async (contact: (typeof chatContacts)[number]) => {
    try {
      const resp = await fetch(`/api/chat/direct/${encodeURIComponent(contact.id)}`, { method: 'POST' });
      const data = await resp.json();
      if (!resp.ok || !data.channel) throw new Error(data.error || 'Conversation could not be opened.');
      setChannels((prev) => prev.some((channel) => channel.id === data.channel.id) ? prev : [...prev, data.channel]);
      setMessagesByChannel((prev) => ({ ...prev, [data.channel.id]: data.messages || prev[data.channel.id] || [] }));
      setActiveChannelId(data.channel.id);
      setUnreadByChannel((prev) => ({ ...prev, [data.channel.id]: 0 }));
      setShowContactPicker(false);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : String(error));
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
      if (!resp.ok) throw new Error(data.error || 'Could not rate this note.');
      if (data.note) {
        setNotes((prev) => prev.map((n) => (n.id === noteId ? data.note : n)));
      }
    } catch (error) {
      setCommunityError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    if (!user) {
      onRequestLogin();
      return;
    }
    setCommunityError(null);
    try {
      const resp = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFa: newNoteTitle.trim(),
          courseCode: newNoteCode.trim(),
          summaryFa: newNoteSummary.trim(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Could not submit the note.');
      if (data.note) {
        setNotes((prev) => [data.note, ...prev]);
        setNewNoteTitle('');
        setNewNoteSummary('');
        setShowAddNote(false);
      }
    } catch (error) {
      setCommunityError(error instanceof Error ? error.message : String(error));
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
    if (!newThreadTitle.trim() || !newThreadBody.trim()) return;
    if (!user) {
      onRequestLogin();
      return;
    }
    setCommunityError(null);
    try {
      const resp = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newThreadTitle.trim(),
          body: newThreadBody.trim(),
          courseCode: newThreadCode.trim(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Could not post the question.');
      if (data.thread) {
        setThreads((prev) => [data.thread, ...prev]);
        setNewThreadTitle('');
        setNewThreadBody('');
        setShowNewThread(false);
      }
    } catch (error) {
      setCommunityError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleReplyThread = async (threadId: string) => {
    const text = (replyDrafts[threadId] || '').trim();
    if (!text) return;
    if (!user) {
      onRequestLogin();
      return;
    }
    setCommunityError(null);
    try {
      const resp = await fetch(`/api/forum/${threadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Could not post the reply.');
      if (data.thread) {
        setThreads((prev) => prev.map((t) => (t.id === threadId ? data.thread : t)));
        setReplyDrafts((prev) => ({ ...prev, [threadId]: '' }));
      }
    } catch (error) {
      setCommunityError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleUpvoteThread = async (threadId: string) => {
    if (!user) {
      onRequestLogin();
      return;
    }
    setCommunityError(null);
    try {
      const resp = await fetch(`/api/forum/${threadId}/upvote`, { method: 'POST' });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Could not upvote the question.');
      if (data.thread) {
        setThreads((prev) => prev.map((t) => (t.id === threadId ? data.thread : t)));
      }
    } catch (error) {
      setCommunityError(error instanceof Error ? error.message : String(error));
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
  const visibleChatChannels = channels.filter((channel) => {
    const name = lang === 'fa' ? channel.nameFa : channel.nameEn;
    return name.toLowerCase().includes(chatSearch.trim().toLowerCase());
  });

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
        !user ? (
          <div className="glass-surface rounded-3xl p-10 text-center space-y-4">
            <MessageSquare className="w-10 h-10 mx-auto text-sky-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'برای ورود به گفتگوی دانشجویی وارد شوید' : 'Sign in to join the student chat'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {lang === 'fa' ? 'گفتگوها و پیام‌های خصوصی فقط برای حساب‌های واردشده در دسترس هستند.' : 'Channels and private messages are available to signed-in members only.'}
            </p>
            <button type="button" onClick={onRequestLogin} className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold cursor-pointer">
              {lang === 'fa' ? 'ورود یا ثبت‌نام' : 'Sign in or register'}
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Channels & DMs Sidebar */}
          <aside className="lg:col-span-4 glass-surface rounded-3xl overflow-hidden flex flex-col min-h-[580px] max-h-[720px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                    <Circle className="w-2 h-2 fill-current" />
                    {lang === 'fa' ? 'حساب تأییدشده' : 'Verified account'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContactPicker((value) => !value)}
                  className="p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 cursor-pointer"
                  title={lang === 'fa' ? 'گفتگوی جدید' : 'New chat'}
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={chatSearch}
                  onChange={(event) => setChatSearch(event.target.value)}
                  placeholder={lang === 'fa' ? 'جستجوی گفتگوها' : 'Search chats'}
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 ps-9 pe-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {showContactPicker && (
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 max-h-52 overflow-y-auto">
                <div className="px-2 pb-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'شروع گفتگوی خصوصی' : 'Start a private conversation'}
                </div>
                {chatContacts.length ? chatContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => void handleOpenDirectMessage(contact)}
                    className="w-full flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-start hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{contact.name}</span>
                    <span className="text-[10px] text-slate-400">{contact.role}</span>
                  </button>
                )) : (
                  <p className="px-2 py-2 text-xs text-slate-500">
                    {lang === 'fa' ? 'هنوز کاربر دیگری برای گفتگو ثبت‌نام نکرده است.' : 'No other members have joined yet.'}
                  </p>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {lang === 'fa' ? 'کانال‌های درسی' : 'Study channels'}
              </div>
              {visibleChatChannels.filter((channel) => channel.type === 'channel').map((channel) => {
                const active = channel.id === activeChannelId;
                const messages = messagesByChannel[channel.id] || [];
                const latest = messages[messages.length - 1];
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => {
                      setActiveChannelId(channel.id);
                      setUnreadByChannel((prev) => ({ ...prev, [channel.id]: 0 }));
                    }}
                    className={`w-full rounded-xl px-3 py-3 text-start transition-colors cursor-pointer ${active ? 'bg-sky-100 dark:bg-sky-950/60' : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate text-xs font-bold ${active ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-100'}`}>
                        {lang === 'fa' ? channel.nameFa : channel.nameEn}
                      </span>
                      {unreadByChannel[channel.id] ? <span className="min-w-5 rounded-full bg-sky-600 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">{unreadByChannel[channel.id]}</span> : null}
                    </div>
                    <div className="mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {latest?.text || channel.courseCode}
                    </div>
                  </button>
                );
              })}
              <div className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {lang === 'fa' ? 'گفتگوهای خصوصی' : 'Private chats'}
              </div>
              {visibleChatChannels.filter((channel) => channel.type === 'dm').map((channel) => {
                const active = channel.id === activeChannelId;
                const messages = messagesByChannel[channel.id] || [];
                const latest = messages[messages.length - 1];
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => {
                      setActiveChannelId(channel.id);
                      setUnreadByChannel((prev) => ({ ...prev, [channel.id]: 0 }));
                    }}
                    className={`w-full rounded-xl px-3 py-3 text-start transition-colors cursor-pointer ${active ? 'bg-sky-100 dark:bg-sky-950/60' : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate text-xs font-bold ${active ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-100'}`}>{lang === 'fa' ? channel.nameFa : channel.nameEn}</span>
                      {unreadByChannel[channel.id] ? <span className="min-w-5 rounded-full bg-sky-600 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">{unreadByChannel[channel.id]}</span> : null}
                    </div>
                    <div className="mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">{latest?.text || (lang === 'fa' ? 'گفتگوی جدید' : 'New conversation')}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Active Chat Stream */}
          <div className="lg:col-span-8 glass-surface rounded-3xl overflow-hidden flex flex-col min-h-[580px] max-h-[720px]">
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

            {chatError && (
              <div className="mx-4 mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                {chatError}
              </div>
            )}

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto bg-slate-100/60 dark:bg-slate-950/30 p-4 sm:p-6 space-y-3">
              {activeMessages.map((msg) => {
                const isBot = msg.role === 'ai-bot';
                const isProf = msg.role === 'professor';
                const isMine = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : isBot ? 'justify-center' : 'justify-start'}`}
                  >
                    <div className={`max-w-[88%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-sm ${isMine ? 'rounded-br-sm bg-sky-600 text-white' : isBot ? 'border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 text-slate-800 dark:text-slate-100' : 'rounded-bl-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100'}`}>
                      <div className="flex items-center justify-between gap-4 pb-1 text-[10px]">
                        <span
                          className={`font-bold ${isBot ? 'text-sky-700 dark:text-sky-300' : isProf && !isMine ? 'text-emerald-700 dark:text-emerald-300' : isMine ? 'text-sky-100' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                          {msg.sender}
                        </span>
                        <span className={isMine ? 'text-sky-100' : 'text-slate-400'}>{msg.timestamp}</span>
                      </div>
                      <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${isMine ? '[&_p]:text-white' : ''}`}>
                        <RichMathText text={msg.text} />
                      </div>
                      {isMine && <div className="mt-1 flex justify-end text-sky-100"><CheckCheck className="w-3 h-3" /></div>}
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

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
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
                  disabled={sendingChat}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'fa' ? 'ارسال' : 'Send'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        )
      )}

      {/* ===================================================================== */}
      {/* TAB 2: Student Community Q&A Forum                                    */}
      {/* ===================================================================== */}
      {subTab === 'forum' && (
        <div className="space-y-5">
          {communityError && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              {communityError}
            </div>
          )}
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
          {communityError && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              {communityError}
            </div>
          )}
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
                {lang === 'fa' ? 'ارسال برای بازبینی' : 'Submit for Review'}
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
                      {note.status === 'draft' && (
                        <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                          {lang === 'fa' ? 'در انتظار بازبینی' : 'Pending review'}
                        </span>
                      )}
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
