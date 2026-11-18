import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Plus,
  X,
  Check,
  Copy,
  Clock,
  CheckCircle2,
  Code2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { DifficultyLevel, Lang, ScientificArticle } from '../types/app';
import { RichMathText } from './MathRenderer';

interface ArticlesHubProps {
  lang: Lang;
}

export const ArticlesHub: React.FC<ArticlesHubProps> = ({ lang }) => {
  const [articles, setArticles] = useState<ScientificArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [activeArticle, setActiveArticle] = useState<ScientificArticle | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Article Editor Modal
  const [showEditor, setShowEditor] = useState(false);
  const [titleFa, setTitleFa] = useState('');
  const [categoryFa, setCategoryFa] = useState('برق و کنترل');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [authorFa, setAuthorFa] = useState('امیرحسین رضایی');
  const [readMinutes, setReadMinutes] = useState(6);
  const [excerptFa, setExcerptFa] = useState('');
  const [markdownFa, setMarkdownFa] = useState(
    '## مقدمه و ایده اصلی\nدر تحلیل مهندسی، رابطه زیر پایه مدل‌سازی سیستم است:\n\n$$\\frac{d^2y}{dt^2} + 2\\zeta\\omega_n\\frac{dy}{dt} + \\omega_n^2 y = \\omega_n^2 u(t)$$\n\n## نکات پیاده‌سازی\nبا تنظیم ضریب میرایی $\\zeta$ می‌توان فراجهش (Overshoot) پاسخ پله را کنترل کرد.'
  );
  const [codeTitle, setCodeTitle] = useState('');
  const [codeBody, setCodeBody] = useState('');
  const [takeawaysInput, setTakeawaysInput] = useState('');

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.articles)) setArticles(d.articles);
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => set.add(lang === 'fa' ? a.categoryFa : a.categoryEn));
    return ['all', ...Array.from(set)];
  }, [articles, lang]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const cat = lang === 'fa' ? a.categoryFa : a.categoryEn;
      if (selectedCategory !== 'all' && cat !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && a.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [articles, selectedCategory, selectedDifficulty, lang]);

  const difficultyLabel = (d: DifficultyLevel) => {
    if (d === 'introductory') return lang === 'fa' ? 'پایه' : 'Introductory';
    if (d === 'intermediate') return lang === 'fa' ? 'تخصصی' : 'Intermediate';
    return lang === 'fa' ? 'پیشرفته' : 'Advanced';
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFa.trim() || !markdownFa.trim()) return;
    try {
      const takeawaysFa = takeawaysInput
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      const resp = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFa,
          categoryFa,
          categoryEn: categoryFa,
          difficulty,
          authorFa,
          readMinutes,
          excerptFa,
          markdownFa,
          codeSnippet: codeBody.trim()
            ? { language: 'python', title: codeTitle || 'Engineering Script', code: codeBody }
            : undefined,
          takeawaysFa,
        }),
      });
      const data = await resp.json();
      if (data.article) {
        setArticles((prev) => [data.article, ...prev]);
        setShowEditor(false);
        setTitleFa('');
        setExcerptFa('');
        setCodeTitle('');
        setCodeBody('');
        setTakeawaysInput('');
        setActiveArticle(data.article);
      }
    } catch {
      // ignore
    }
  };

  const renderMarkdownSections = (md: string) => {
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];
    let buffer: string[] = [];

    const flushBuffer = (keyPrefix: number) => {
      if (buffer.length === 0) return;
      const joined = buffer.join('\n').trim();
      if (joined) {
        elements.push(
          <RichMathText
            key={`p-${keyPrefix}`}
            text={joined}
            className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed"
          />
        );
      }
      buffer = [];
    };

    lines.forEach((line, idx) => {
      if (line.startsWith('## ')) {
        flushBuffer(idx);
        elements.push(
          <h4 key={`h-${idx}`} className="text-lg font-bold text-slate-900 dark:text-white pt-3">
            {line.replace(/^##\s+/, '')}
          </h4>
        );
      } else {
        buffer.push(line);
      }
    });
    flushBuffer(lines.length);
    return elements;
  };

  const BackArrow = lang === 'fa' ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'مجله علمی و مقالات مهندسی دانشیار' : 'Scientific Articles & Engineering Publication Hub'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'fa'
              ? 'راهنماهای عمیق مهندسی با فرمول‌های LaTeX، قطعه کدهای آزمایشگاهی و نکات کلیدی امتحان'
              : 'In-depth engineering guides with KaTeX derivations, annotated code snippets, and key takeaways'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEditor(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'fa' ? 'انتشار مقاله جدید' : 'Publish Guide'}</span>
        </button>
      </div>

      {/* Full Article View */}
      {activeArticle ? (
        <article className="glass-surface rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              <BackArrow className="w-4 h-4" />
              <span>{lang === 'fa' ? 'بازگشت به فهرست مقالات' : 'Back to Articles'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{lang === 'fa' ? activeArticle.categoryFa : activeArticle.categoryEn}</span>
              <span aria-hidden="true">·</span>
              <span>{difficultyLabel(activeArticle.difficulty)}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readMinutes} {lang === 'fa' ? 'دقیقه' : 'min'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight [text-wrap:balance]">
              {lang === 'fa' ? activeArticle.titleFa : activeArticle.titleEn}
            </h1>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {lang === 'fa' ? activeArticle.authorFa : activeArticle.authorEn} · {activeArticle.date}
            </div>
          </div>

          <div className="aspect-[16/7] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
            <img
              src={activeArticle.image}
              alt={lang === 'fa' ? activeArticle.titleFa : activeArticle.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rich Markdown + KaTeX body */}
          <div className="space-y-4 max-w-3xl">
            {renderMarkdownSections(lang === 'fa' ? activeArticle.markdownFa : activeArticle.markdownEn)}
          </div>

          {/* Syntax-highlighted style Code Snippet */}
          {activeArticle.codeSnippet && (
            <div className="max-w-3xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="inline-flex items-center gap-2 text-sky-400 font-mono">
                  <Code2 className="w-4 h-4" />
                  <span>{activeArticle.codeSnippet.title}</span>
                  <span className="text-slate-500">({activeArticle.codeSnippet.language})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeArticle.codeSnippet!.code);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 1800);
                  }}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? (lang === 'fa' ? 'کپی شد' : 'Copied') : (lang === 'fa' ? 'کپی کد' : 'Copy')}</span>
                </button>
              </div>
              <pre dir="ltr" className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-sky-100">
                <code>{activeArticle.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Key Takeaways */}
          <div className="max-w-3xl rounded-2xl bg-emerald-50/75 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'fa' ? 'نکات کلیدی مقاله' : 'Key Engineering Takeaways'}</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100">
              {(lang === 'fa' ? activeArticle.takeawaysFa : activeArticle.takeawaysEn).map((tk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{i + 1}.</span>
                  <span>{tk}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ) : (
        /* Categorized Article Feed */
        <div className="space-y-5">
          <div className="glass-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat === 'all' ? (lang === 'fa' ? 'همه موضوعات' : 'All Categories') : cat}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              {(['all', 'introductory', 'intermediate', 'advanced'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                    selectedDifficulty === d
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d === 'all' ? (lang === 'fa' ? 'همه سطوح' : 'All') : difficultyLabel(d)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((art) => (
              <article
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="group glass-surface rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer hover:border-sky-500/50 transition-all"
              >
                <div>
                  <div className="aspect-[4/3] bg-slate-900 overflow-hidden">
                    <img
                      src={art.image}
                      alt={lang === 'fa' ? art.titleFa : art.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{lang === 'fa' ? art.categoryFa : art.categoryEn}</span>
                      <span aria-hidden="true">·</span>
                      <span>{difficultyLabel(art.difficulty)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.readMinutes} {lang === 'fa' ? 'دقیقه مطالعه' : 'min read'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 leading-snug">
                      {lang === 'fa' ? art.titleFa : art.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'fa' ? art.excerptFa : art.excerptEn}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-3 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {lang === 'fa' ? art.authorFa : art.authorEn}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'مطالعه مقاله' : 'Read Guide'}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Article Creation & Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handlePublishArticle}
            className="glass-surface bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ویرایشگر انتشار مقاله علمی جدید' : 'Publish New Engineering Guide'}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={titleFa}
                onChange={(e) => setTitleFa(e.target.value)}
                placeholder={lang === 'fa' ? 'عنوان مقاله مهندسی' : 'Article Title'}
                className="sm:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={categoryFa}
                onChange={(e) => setCategoryFa(e.target.value)}
                placeholder={lang === 'fa' ? 'دسته‌بندی (مثلاً برق و کنترل)' : 'Category'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
              >
                <option value="introductory">{lang === 'fa' ? 'پایه' : 'Introductory'}</option>
                <option value="intermediate">{lang === 'fa' ? 'تخصصی' : 'Intermediate'}</option>
                <option value="advanced">{lang === 'fa' ? 'پیشرفته' : 'Advanced'}</option>
              </select>
              <input
                type="text"
                value={authorFa}
                onChange={(e) => setAuthorFa(e.target.value)}
                placeholder={lang === 'fa' ? 'نام نویسنده' : 'Author'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="number"
                min={1}
                max={45}
                value={readMinutes}
                onChange={(e) => setReadMinutes(Number(e.target.value))}
                placeholder="6"
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            <input
              type="text"
              value={excerptFa}
              onChange={(e) => setExcerptFa(e.target.value)}
              placeholder={lang === 'fa' ? 'چکیده کوتاه مقاله (۱ تا ۲ خط)' : 'Short summary excerpt'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {lang === 'fa' ? 'متن مقاله (با پشتیبانی Markdown و فرمول‌های $...$ و $$...$$)' : 'Article Body (Markdown + LaTeX)'}
              </label>
              <textarea
                rows={6}
                required
                value={markdownFa}
                onChange={(e) => setMarkdownFa(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={codeTitle}
                onChange={(e) => setCodeTitle(e.target.value)}
                placeholder={lang === 'fa' ? 'عنوان قطعه کد (اختیاری)' : 'Code snippet title (optional)'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={takeawaysInput}
                onChange={(e) => setTakeawaysInput(e.target.value)}
                placeholder={lang === 'fa' ? 'نکته کلیدی مقاله (اختیاری)' : 'Key takeaway (optional)'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {codeTitle && (
              <textarea
                rows={3}
                dir="ltr"
                value={codeBody}
                onChange={(e) => setCodeBody(e.target.value)}
                placeholder="# Python / MATLAB / C++ snippet"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 p-3 text-xs font-mono text-sky-100"
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'انتشار در مجله علمی' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
