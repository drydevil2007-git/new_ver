import React, { useEffect, useMemo, useState } from 'react';
import {
  Landmark,
  GraduationCap,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Plus,
  Send,
  BarChart3,
  TrendingUp,
  Loader2,
  Scale,
  CheckCircle2,
  Reply,
  X,
} from 'lucide-react';
import {
  AiPerspectiveSummary,
  CampusCategory,
  CampusPoll,
  CampusThread,
  Lang,
  UserSession,
} from '../types/app';

interface CampusVoiceHubProps {
  lang: Lang;
  user?: UserSession | null;
  onOpenAuth?: () => void;
}

const CATEGORY_LABELS: Array<{ id: 'all' | CampusCategory; fa: string; en: string }> = [
  { id: 'all', fa: 'همه دغدغه‌ها', en: 'All Debates' },
  { id: 'ai-future', fa: 'آینده مهندسی و AI', en: 'AI & Engineering Future' },
  { id: 'migration-stay', fa: 'مهاجرت یا ماندن', en: 'Migration vs. Staying' },
  { id: 'university-industry', fa: 'دانشگاه و صنعت', en: 'University & Industry' },
  { id: 'engineering-ethics', fa: 'اخلاق مهندسی', en: 'Engineering Ethics' },
  { id: 'student-life', fa: 'زندگی دانشجویی', en: 'Student Life' },
];

export const CampusVoiceHub: React.FC<CampusVoiceHubProps> = ({ lang, user, onOpenAuth }) => {
  const [threads, setThreads] = useState<CampusThread[]>([]);
  const [polls, setPolls] = useState<CampusPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | CampusCategory>('all');

  const [votedPolls, setVotedPolls] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('daneshyar_campus_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [upvotedThreads, setUpvotedThreads] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('daneshyar_campus_upvoted_threads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>('cmp-1');
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // AI Perspective per thread
  const [perspectives, setPerspectives] = useState<Record<string, AiPerspectiveSummary>>({});
  const [perspectiveLoadingId, setPerspectiveLoadingId] = useState<string | null>(null);
  const [perspectiveError, setPerspectiveError] = useState<string | null>(null);

  // New Thread Modal/Composer
  const [composerOpen, setComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newAuthor, setNewAuthor] = useState(user?.name || '');
  const [newBadge, setNewBadge] = useState(
    user?.field && user?.university
      ? `${user.field} · ${user.university}`
      : user?.university || user?.field || ''
  );
  const [newCategory, setNewCategory] = useState<CampusCategory>('university-industry');
  const [submittingThread, setSubmittingThread] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setNewAuthor(user.name);
      setNewBadge(
        user.field && user.university
          ? `${user.field} · ${user.university}`
          : user.university || user.field || ''
      );
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    fetch('/api/campus/state')
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data.threads)) {
          const sanitized = data.threads.map((t: any) => ({
            ...t,
            upvotes: typeof t.upvotes === 'number' ? t.upvotes : 0,
            createdAt: t.createdAt || 'اخیراً',
            badgeFa: t.badgeFa || 'دانشجو',
            badgeEn: t.badgeEn || 'Student',
            comments: Array.isArray(t.comments)
              ? t.comments.map((c: any) => ({
                  ...c,
                  upvotes: typeof c.upvotes === 'number' ? c.upvotes : 0,
                  createdAt: c.createdAt || 'اخیراً',
                  badgeFa: c.badgeFa || 'دانشجو',
                  badgeEn: c.badgeEn || 'Student',
                  replies: Array.isArray(c.replies)
                    ? c.replies.map((r: any) => ({
                        ...r,
                        badgeFa: r.badgeFa || 'دانشجو',
                        badgeEn: r.badgeEn || 'Student',
                        createdAt: r.createdAt || 'اخیراً',
                      }))
                    : [],
                }))
              : [],
          }));
          setThreads(sanitized);
        }
        if (Array.isArray(data.polls)) setPolls(data.polls);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredThreads = useMemo(() => {
    if (categoryFilter === 'all') return threads;
    return threads.filter((t) => t.category === categoryFilter);
  }, [threads, categoryFilter]);

  const categoryName = (cat: CampusCategory) => {
    const found = CATEGORY_LABELS.find((c) => c.id === cat);
    return found ? (lang === 'fa' ? found.fa : found.en) : cat;
  };

  const handleCastVote = async (pollId: string, optionId: string) => {
    if (votedPolls[pollId]) return;
    setPolls((prev) =>
      prev.map((p) =>
        p.id === pollId
          ? {
              ...p,
              options: (p.options || []).map((o) => (o.id === optionId ? { ...o, votes: (o.votes || 0) + 1 } : o)),
            }
          : p
      )
    );
    const nextVoted = { ...votedPolls, [pollId]: optionId };
    setVotedPolls(nextVoted);
    try {
      localStorage.setItem('daneshyar_campus_votes', JSON.stringify(nextVoted));
    } catch {
      // ignore
    }

    try {
      const resp = await fetch(`/api/campus/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      });
      const data = await resp.json();
      if (data.poll) {
        setPolls((prev) => prev.map((p) => (p.id === pollId ? data.poll : p)));
      }
    } catch {
      // optimistic state kept
    }
  };

  const handleUpvoteThread = async (threadId: string) => {
    if (upvotedThreads.includes(threadId)) return;
    const nextUpvoted = [...upvotedThreads, threadId];
    setUpvotedThreads(nextUpvoted);
    try {
      localStorage.setItem('daneshyar_campus_upvoted_threads', JSON.stringify(nextUpvoted));
    } catch {
      // ignore
    }
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, upvotes: (t.upvotes || 0) + 1 } : t)));
    try {
      const resp = await fetch(`/api/campus/threads/${threadId}/upvote`, { method: 'POST' });
      const data = await resp.json();
      if (data.thread) {
        setThreads((prev) => prev.map((t) => (t.id === threadId ? data.thread : t)));
      }
    } catch {
      // ignore
    }
  };

  const handleUpvoteComment = async (threadId: string, commentId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          comments: (t.comments || []).map((c) =>
            c.id === commentId ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c
          ),
        };
      })
    );
    try {
      const resp = await fetch(`/api/campus/threads/${threadId}/comments/${commentId}/upvote`, {
        method: 'POST',
      });
      const data = await resp.json();
      if (data.thread) {
        setThreads((prev) => prev.map((t) => (t.id === threadId ? data.thread : t)));
      }
    } catch {
      // optimistic state kept
    }
  };

  const handlePostComment = async (threadId: string, parentCommentId?: string) => {
    if (!user) {
      onOpenAuth?.();
      return;
    }
    const raw = parentCommentId ? replyInputs[parentCommentId] : commentInputs[threadId];
    const text = (raw || '').trim();
    if (!text) return;

    if (parentCommentId) {
      setReplyInputs((prev) => ({ ...prev, [parentCommentId]: '' }));
      setReplyTargetId(null);
    } else {
      setCommentInputs((prev) => ({ ...prev, [threadId]: '' }));
    }

    const authorName = user.name || (lang === 'fa' ? 'دانشجوی دانشیار' : 'Campus Student');
    const badgeText = user.field && user.university
      ? `${user.field} · ${user.university}`
      : user.university || user.field || (lang === 'fa' ? 'دانشجو' : 'Student');

    try {
      const resp = await fetch(`/api/campus/threads/${threadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: authorName,
          badgeFa: badgeText,
          text,
          parentCommentId,
        }),
      });
      const data = await resp.json();
      if (data.thread) {
        setThreads((prev) => prev.map((t) => (t.id === threadId ? data.thread : t)));
      }
    } catch {
      // ignore
    }
  };

  const handleFetchAiPerspective = async (thread: CampusThread) => {
    if (perspectives[thread.id]) {
      setPerspectives((prev) => {
        const copy = { ...prev };
        delete copy[thread.id];
        return copy;
      });
      return;
    }

    setPerspectiveLoadingId(thread.id);
    setPerspectiveError(null);
    try {
      const resp = await fetch('/api/ai/campus-perspective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lang === 'fa' ? thread.titleFa : thread.titleEn,
          body: lang === 'fa' ? thread.bodyFa : thread.bodyEn,
          comments: (thread.comments || []).map((c) => `${c.author}: ${c.text}`),
          lang,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setPerspectiveError(data.error || (lang === 'fa' ? 'خطا در تحلیل هوش مصنوعی' : 'AI analysis error'));
      } else if (data.perspective) {
        setPerspectives((prev) => ({ ...prev, [thread.id]: data.perspective }));
      }
    } catch {
      setPerspectiveError(lang === 'fa' ? 'ارتباط با سرور هوش مصنوعی برقرار نشد.' : 'Could not reach AI service.');
    } finally {
      setPerspectiveLoadingId(null);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth?.();
      return;
    }
    if (!newTitle.trim() || !newBody.trim() || submittingThread) return;
    setSubmittingThread(true);
    const authorName = user.name || newAuthor.trim() || (lang === 'fa' ? 'دانشجوی دانشیار' : 'DaneshYar Student');
    const badgeText = user.field && user.university
      ? `${user.field} · ${user.university}`
      : newBadge.trim() || user.university || (lang === 'fa' ? 'دانشجو' : 'Student');

    try {
      const resp = await fetch('/api/campus/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCategory,
          titleFa: newTitle.trim(),
          bodyFa: newBody.trim(),
          author: authorName,
          badgeFa: badgeText,
        }),
      });
      const data = await resp.json();
      if (data.thread) {
        setThreads((prev) => [data.thread, ...prev]);
        setExpandedThreadId(data.thread.id);
        setCategoryFilter('all');
        setNewTitle('');
        setNewBody('');
        setComposerOpen(false);
      }
    } catch {
      // ignore
    } finally {
      setSubmittingThread(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="glass-surface rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400">
            <GraduationCap className="w-4 h-4" />
            <Landmark className="w-4 h-4" />
            <span>
              {lang === 'fa'
                ? 'همدانشگاهی · تریبون آزاد دانشجویان، جامعه و اخلاق مهندسی'
                : 'Campus Voice · Student Society, Engineering Ethics & Career Debates'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white [text-wrap:balance]">
            {lang === 'fa'
              ? 'صدای همدانشگاهی: گفتگوی بی‌واسطه درباره دانشگاه، صنعت و آینده'
              : 'Campus & Society Student Voice'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'fa'
              ? 'فضایی برای طرح دغدغه‌های واقعی دانشجویان مهندسی؛ از تاثیر هوش مصنوعی بر بازار کار و انتخاب بین مهاجرت یا ماندن، تا نظرسنجی‌های زنده و جمع‌بندی متوازن هوش مصنوعی.'
              : 'An open campus forum to debate societal challenges, AI disruption, migration vs. local building, engineering ethics, and student life—complete with live polls and balanced AI perspectives.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!user) {
              onOpenAuth?.();
              return;
            }
            setComposerOpen((o) => !o);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'fa' ? 'طرح موضوع جدید' : 'Start New Debate'}</span>
        </button>
      </section>

      {/* New Topic Composer Drawer */}
      {composerOpen && (
        <form
          onSubmit={handleCreateThread}
          className="glass-surface rounded-3xl p-6 space-y-4 border-sky-400/50 dark:border-sky-500/40"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'ایجاد گفتگوی جدید در همدانشگاهی' : 'Publish a New Campus Debate'}
            </h3>
            <button
              type="button"
              onClick={() => setComposerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as CampusCategory)}
              className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white"
            >
              {CATEGORY_LABELS.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {lang === 'fa' ? cat.fa : cat.en}
                </option>
              ))}
            </select>
            {user ? (
              <div className="md:col-span-2 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-lg object-cover ring-1 ring-sky-500/40" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {user.avatarInitials || user.name.slice(0, 2)}
                  </div>
                )}
                <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 dark:text-slate-300">{user.field || 'دانشجو'} · {user.university}</span>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder={lang === 'fa' ? 'نام یا نام مستعار دانشجویی' : 'Your name or handle'}
                  className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder={lang === 'fa' ? 'رشته و دانشگاه (مثلاً برق · امیرکبیر)' : 'Major & University (e.g., EE · AUT)'}
                  className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white"
                />
              </>
            )}
          </div>

          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={lang === 'fa' ? 'تیتر پرسش یا دغدغه اصلی...' : 'Debate headline or core question...'}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white"
          />

          <textarea
            required
            rows={3}
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder={lang === 'fa' ? 'تجربه، دیدگاه یا سوال خود را برای سایر دانشجویان بنویسید...' : 'Share your perspective, context, or question...'}
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setComposerOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {lang === 'fa' ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submittingThread}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
            >
              {submittingThread ? (lang === 'fa' ? 'در حال انتشار...' : 'Publishing...') : (lang === 'fa' ? 'انتشار گفتگو' : 'Publish Topic')}
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 overflow-x-auto no-scrollbar">
        {CATEGORY_LABELS.map((cat) => {
          const active = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'fa' ? cat.fa : cat.en}
            </button>
          );
        })}
      </div>

      {perspectiveError && (
        <div className="rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/40 px-4 py-3 text-xs text-rose-800 dark:text-rose-200">
          {perspectiveError}
        </div>
      )}

      {/* Two-Column Main Layout: Discussions Feed (8 cols) + Live Polls & Trending Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main: Discussion Threads (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {loading ? (
            <div className="glass-surface rounded-3xl p-10 flex items-center justify-center gap-3 text-sm text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
              <span>{lang === 'fa' ? 'در حال بارگذاری گفتگوهای همدانشگاهی...' : 'Loading Campus discussions...'}</span>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="glass-surface rounded-3xl p-10 text-center space-y-4">
              <MessageSquare className="w-10 h-10 text-sky-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fa'
                  ? 'هنوز در این دسته‌بندی موضوعی مطرح نشده است'
                  : 'No debates yet in this category'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {lang === 'fa'
                  ? 'شما می‌توانید اولین دانشجویی باشید که در این زمینه تجربه یا پرسش خود را برای هم‌دانشگاهی‌ها مطرح می‌کند.'
                  : 'Be the first student to initiate a thoughtful discussion here.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  {lang === 'fa' ? 'طرح موضوع جدید' : 'Start Debate'}
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  {lang === 'fa' ? 'مشاهده همه گفتگوها' : 'View All Debates'}
                </button>
              </div>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isExpanded = expandedThreadId === thread.id;
              const isUpvoted = upvotedThreads.includes(thread.id);
              const aiView = perspectives[thread.id];
              const isAiBusy = perspectiveLoadingId === thread.id;

              return (
                <article
                  key={thread.id}
                  className="glass-surface rounded-3xl p-5 sm:p-6 space-y-4 transition-all"
                >
                  {/* Clean Unboxed Typographic Metadata (Zero Static Pills) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sky-700 dark:text-sky-400">
                        {categoryName(thread.category)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{thread.author}</span>
                      <span aria-hidden="true">·</span>
                      <span>{(lang === 'fa' ? thread.badgeFa : thread.badgeEn) || (lang === 'fa' ? 'دانشجو' : 'Student')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{thread.createdAt || (lang === 'fa' ? 'اخیراً' : 'Recently')}</span>
                    </div>

                    {thread.trending && (
                      <div className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'بحث داغ هفته' : 'Trending'}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {lang === 'fa' ? thread.titleFa : thread.titleEn}
                  </h3>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {lang === 'fa' ? thread.bodyFa : thread.bodyEn}
                  </p>

                  {/* Action Toolbar: Upvote, Comments Toggle, AI Perspective */}
                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpvoteThread(thread.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                          isUpvoted
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="tabular-nums font-mono">{thread.upvotes || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="tabular-nums">
                          {(thread.comments || []).length} {lang === 'fa' ? 'دیدگاه' : 'Comments'}
                        </span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFetchAiPerspective(thread)}
                      disabled={isAiBusy}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-800 dark:text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {isAiBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Scale className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {aiView
                          ? lang === 'fa' ? 'بستن تحلیل هوش مصنوعی' : 'Hide AI Perspective'
                          : lang === 'fa' ? 'تحلیل متوازن AI (موافق و مخالف)' : 'AI Perspective'}
                      </span>
                    </button>
                  </div>

                  {/* Balanced AI Perspective Panel */}
                  {aiView && (
                    <div className="rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/60 dark:bg-sky-950/30 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-300">
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {lang === 'fa'
                            ? 'جمع‌بندی متوازن و چندوجهی دانشیار از دیدگاه‌های موافق و منتقد'
                            : 'Balanced AI Perspective: Pro / Con / Engineering Ethics'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-white/80 dark:bg-slate-900/70 border border-emerald-200/80 dark:border-emerald-800/50 p-3.5 space-y-2">
                          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            {lang === 'fa' ? 'استدلال‌های موافق و فرصت‌ها (Pro)' : 'Supporting Arguments (Pro)'}
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                            {(Array.isArray(aiView.proPoints) ? aiView.proPoints : []).map((pt, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="font-mono text-emerald-600 font-bold">+</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-xl bg-white/80 dark:bg-slate-900/70 border border-rose-200/80 dark:border-rose-800/50 p-3.5 space-y-2">
                          <div className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            {lang === 'fa' ? 'نقدها، ریسک‌ها و دغدغه‌ها (Con)' : 'Critical Concerns (Con)'}
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                            {(Array.isArray(aiView.conPoints) ? aiView.conPoints : []).map((pt, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="font-mono text-rose-600 font-bold">−</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {lang === 'fa' ? 'زاویه اخلاق مهندسی: ' : 'Engineering Ethics Lens: '}
                          </span>
                          <span>{aiView.ethicsLens}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {lang === 'fa' ? 'جمع‌بندی راهگشا: ' : 'Balanced Takeaway: '}
                          </span>
                          <span>{aiView.balancedTakeaway}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rich Comment & Nested Reply Threads */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/70 space-y-4">
                      {(!thread.comments || thread.comments.length === 0) ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {lang === 'fa'
                            ? 'هنوز دیدگاهی ثبت نشده است. اولین نفری باشید که نظر می‌دهید!'
                            : 'No comments yet. Be the first student to weigh in!'}
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {(thread.comments || []).map((comment) => (
                            <div
                              key={comment.id}
                              className="rounded-2xl bg-slate-50/85 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-4 space-y-2.5"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 dark:text-white">{comment.author}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{(lang === 'fa' ? comment.badgeFa : comment.badgeEn) || (lang === 'fa' ? 'دانشجو' : 'Student')}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{comment.createdAt || (lang === 'fa' ? 'اخیراً' : 'Recently')}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleUpvoteComment(thread.id, comment.id)}
                                    className="inline-flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                    <span className="tabular-nums font-mono">{comment.upvotes || 0}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReplyTargetId(replyTargetId === comment.id ? null : comment.id)
                                    }
                                    className="inline-flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                                  >
                                    <Reply className="w-3 h-3" />
                                    <span>{lang === 'fa' ? 'پاسخ' : 'Reply'}</span>
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                                {comment.text}
                              </p>

                              {/* Nested Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="ms-4 ps-3 border-s border-slate-300 dark:border-slate-700 space-y-2 pt-1">
                                  {(comment.replies || []).map((rep) => (
                                    <div key={rep.id} className="space-y-1">
                                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                          {rep.author}
                                        </span>
                                        <span aria-hidden="true">·</span>
                                        <span>{(lang === 'fa' ? rep.badgeFa : rep.badgeEn) || (lang === 'fa' ? 'دانشجو' : 'Student')}</span>
                                        <span aria-hidden="true">·</span>
                                        <span>{rep.createdAt || (lang === 'fa' ? 'اخیراً' : 'Recently')}</span>
                                      </div>
                                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {rep.text}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Inline Nested Reply Box */}
                              {replyTargetId === comment.id && (
                                user ? (
                                  <div className="flex items-center gap-2 pt-1">
                                    <input
                                      type="text"
                                      value={replyInputs[comment.id] || ''}
                                      onChange={(e) =>
                                        setReplyInputs((prev) => ({ ...prev, [comment.id]: e.target.value }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handlePostComment(thread.id, comment.id);
                                      }}
                                      placeholder={
                                        lang === 'fa'
                                          ? `پاسخ به ${comment.author}...`
                                          : `Reply to ${comment.author}...`
                                      }
                                      className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handlePostComment(thread.id, comment.id)}
                                      className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer"
                                    >
                                      {lang === 'fa' ? 'ارسال' : 'Send'}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs">
                                    <span className="text-slate-600 dark:text-slate-300">
                                      {lang === 'fa' ? 'برای ارسال پاسخ وارد حساب کاربری خود شوید.' : 'Sign in to reply.'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={onOpenAuth}
                                      className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[11px] cursor-pointer"
                                    >
                                      {lang === 'fa' ? 'ورود' : 'Sign In'}
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Top-Level Comment or Authentication Barrier */}
                      {user ? (
                        <div className="flex items-center gap-2 pt-1">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-sky-500/30"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                              {user.avatarInitials || user.name.slice(0, 2)}
                            </div>
                          )}
                          <input
                            type="text"
                            value={commentInputs[thread.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({ ...prev, [thread.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handlePostComment(thread.id);
                            }}
                            placeholder={
                              lang === 'fa'
                                ? `دیدگاه خود را با عنوان ${user.name} بنویسید...`
                                : `Share your thought as ${user.name}...`
                            }
                            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                          <button
                            type="button"
                            onClick={() => handlePostComment(thread.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{lang === 'fa' ? 'ثبت نظر' : 'Post'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border border-dashed border-sky-400/60 dark:border-sky-500/40 bg-sky-50/60 dark:bg-sky-950/30 text-xs">
                          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                            <MessageSquare className="w-4 h-4 text-sky-600 shrink-0" />
                            <span>
                              {lang === 'fa'
                                ? 'برای مشارکت در این گفتگو و ثبت دیدگاه دانشجویی، لطفاً وارد شوید.'
                                : 'Please sign in or register to join this debate and post a comment.'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={onOpenAuth}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-semibold text-xs whitespace-nowrap shadow-sm cursor-pointer"
                          >
                            {lang === 'fa' ? 'ورود به حساب / ثبت‌نام' : 'Sign In / Register'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* Right Sidebar: Live Interactive Student Polls & Community Guidelines (4 cols) */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="glass-surface rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'نظرسنجی‌های زنده دانشجویی' : 'Live Student Polls'}
              </h3>
            </div>

            <div className="space-y-6">
              {polls.map((poll) => {
                const totalVotes = (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0) || 1;
                const userChoice = votedPolls[poll.id];

                return (
                  <div
                    key={poll.id}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/60 p-4 space-y-3"
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {lang === 'fa' ? poll.questionFa : poll.questionEn}
                    </h4>

                    <div className="space-y-2">
                      {(poll.options || []).map((opt) => {
                        const pct = Math.round(((opt.votes || 0) / totalVotes) * 100);
                        const isChosen = userChoice === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={Boolean(userChoice)}
                            onClick={() => handleCastVote(poll.id, opt.id)}
                            className={`relative w-full text-start rounded-xl border p-2.5 overflow-hidden transition-colors cursor-pointer ${
                              isChosen
                                ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40'
                                : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 hover:border-sky-400'
                            }`}
                          >
                            {/* Live Horizontal Bar */}
                            <div
                              className={`absolute inset-y-0 start-0 transition-all duration-500 ${
                                isChosen
                                  ? 'bg-sky-500/20 dark:bg-sky-400/20'
                                  : 'bg-slate-300/25 dark:bg-slate-700/35'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                            <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                              <span className="font-medium text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                {isChosen && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />}
                                <span>{lang === 'fa' ? opt.labelFa : opt.labelEn}</span>
                              </span>
                              <span className="font-mono font-bold tabular-nums text-slate-700 dark:text-slate-300 shrink-0">
                                {pct}%
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>
                        {totalVotes} {lang === 'fa' ? 'رای ثبت‌شده' : 'total votes'}
                      </span>
                      <span>
                        {userChoice
                          ? lang === 'fa' ? 'رای شما ثبت شد' : 'Vote recorded'
                          : lang === 'fa' ? 'برای رای‌دادن کلیک کنید' : 'Tap an option to vote'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Debate Civic Guidelines */}
          <div className="glass-surface rounded-3xl p-5 space-y-3 border-sky-200/50 dark:border-sky-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-400">
              <GraduationCap className="w-4 h-4" />
              <span>{lang === 'fa' ? 'مرام‌نامه گفتگوی آکادمیک' : 'Campus Debate Code'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-sky-500 font-bold">✓</span>
                <span>
                  {lang === 'fa'
                    ? 'احترام به دیدگاه‌های متفاوت و تمرکز بر نقد استدلال به جای اشخاص'
                    : 'Constructive critique focusing on empirical evidence and reason.'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-500 font-bold">✓</span>
                <span>
                  {lang === 'fa'
                    ? 'اشتراک‌گذاری تجارب واقعی دانشگاهی و صنعتی برای توانمندسازی هم‌دانشگاهی‌ها'
                    : 'Share authentic academic and industry experiences to empower peers.'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-500 font-bold">✓</span>
                <span>
                  {lang === 'fa'
                    ? 'پایبندی به استانداردهای اخلاق مهندسی، امانت‌داری علمی و مسئولیت اجتماعی'
                    : 'Adhere to engineering ethics, scholarly integrity, and public safety.'}
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
