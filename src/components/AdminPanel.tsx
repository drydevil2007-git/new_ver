import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Users,
  Sliders,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Ban,
  Save,
  Search,
  Loader2,
  Activity,
  Eye,
  EyeOff,
  Server,
  FileText,
  Newspaper,
  X,
  KeyRound,
  Baby,
  Swords,
  Download,
} from 'lucide-react';
import { exportCourseDatabaseAsJson } from '../lib/courseDatabase';
import { ENGINEERING_FIELDS } from '../data/coursesData';
import {
  CourseItem,
  DifficultyLevel,
  Lang,
  LectureNote,
  ScientificArticle,
  UserSession,
} from '../types/app';
import { LatexBlock } from './MathRenderer';

interface AdminPanelProps {
  lang: Lang;
  courses: CourseItem[];
  currentUser?: UserSession | null;
  onAddCourse: (course: Omit<CourseItem, 'id'>) => void;
  onUpdateCourse: (course: CourseItem) => void;
  onDeleteCourse: (courseId: string) => void;
  onNotify?: (message: string) => void;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  role: 'Student' | 'Professor' | 'Admin' | 'Moderator';
  status: 'active' | 'suspended';
  lastActive: string;
  queriesCount: number;
}

interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

interface AiTuningConfig {
  systemPrompt: string;
  temperature: number;
  feynmanStyle: 'storytelling' | 'balanced' | 'rigorous';
  thinkingLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface AdminOverviewData {
  metrics: {
    activeUsers: number;
    totalRegisteredUsers: number;
    uploadedNotes: number;
    publishedArticles: number;
    forumThreads: number;
    totalAiQueries: number;
  };
  aiQueryBreakdown: {
    feynman: number;
    formulaSolver: number;
    quiz: number;
    chatBot: number;
    pdfExtract: number;
  };
  users: AdminUser[];
  logs: ActivityLog[];
  aiConfig: AiTuningConfig;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  lang,
  courses,
  currentUser,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onNotify,
}) => {
  const [tab, setTab] = useState<'analytics' | 'courses' | 'content' | 'users' | 'ai-tuning'>('analytics');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const notify = (fa: string, en: string) => {
    onNotify?.(lang === 'fa' ? fa : en);
  };

  // ============================================================================
  // Course Editor Modal State
  // ============================================================================
  const [courseSearch, setCourseSearch] = useState('');
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [formCode, setFormCode] = useState('EE-499');
  const [formFieldId, setFormFieldId] = useState(ENGINEERING_FIELDS[2]?.id || ENGINEERING_FIELDS[0].id);
  const [formTitleFa, setFormTitleFa] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formCredits, setFormCredits] = useState(3);
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>('intermediate');
  const [formTopicsFa, setFormTopicsFa] = useState('');
  const [formTopicsEn, setFormTopicsEn] = useState('');
  const [formFormula, setFormFormula] = useState('H(s) = \\frac{Y(s)}{X(s)}');
  const [formFeynmanFa, setFormFeynmanFa] = useState('');
  const [formExamQuestionFa, setFormExamQuestionFa] = useState('');
  const [formExamFormula, setFormExamFormula] = useState('');
  const [formExamSolutionFa, setFormExamSolutionFa] = useState('');

  // ============================================================================
  // Content Moderation State (Articles + Notes)
  // ============================================================================
  const [articles, setArticles] = useState<ScientificArticle[]>([]);
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ScientificArticle | null>(null);
  const [editingNote, setEditingNote] = useState<LectureNote | null>(null);

  // ============================================================================
  // User Management & Modal State
  // ============================================================================
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminUser['role']>('Student');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // ============================================================================
  // AI Tuning & API Key Settings State
  // ============================================================================
  const [aiConfig, setAiConfig] = useState<AiTuningConfig>({
    systemPrompt:
      'تو «دانشیار» هستی، استاد و دستیار هوشمند آموزش مهندسی دانشگاهی. مفاهیم را با دقت علمی، مثال‌های شهودی روزمره، پرهیز از پیچیدگی غیرضروری و فرمول‌های استاندارد LaTeX آموزش بده.',
    temperature: 0.4,
    feynmanStyle: 'balanced',
    thinkingLevel: 'HIGH',
  });
  const [geminiClientKey, setGeminiClientKey] = useState<string>(() => {
    try {
      return localStorage.getItem('dy_gemini_key') || '';
    } catch {
      return '';
    }
  });
  const [showKeyText, setShowKeyText] = useState(false);
  const [savingAi, setSavingAi] = useState(false);

  const loadAdminOverview = async () => {
    setLoadingOverview(true);
    try {
      const resp = await fetch('/api/admin/overview');
      const data: AdminOverviewData = await resp.json();
      if (data && data.metrics) {
        setOverview(data);
        if (data.aiConfig) setAiConfig(data.aiConfig);
      }
    } catch {
      // ignore
    } finally {
      setLoadingOverview(false);
    }
  };

  const loadContentModeration = async () => {
    setContentLoading(true);
    try {
      const [artRes, noteRes] = await Promise.all([
        fetch('/api/articles?includeDrafts=true'),
        fetch('/api/notes?includeDrafts=true'),
      ]);
      const artJson = await artRes.json();
      const noteJson = await noteRes.json();
      if (Array.isArray(artJson.articles)) setArticles(artJson.articles);
      if (Array.isArray(noteJson.notes)) setNotes(noteJson.notes);
    } catch {
      // ignore
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    loadAdminOverview();
    loadContentModeration();
  }, []);

  const filteredCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return courses.slice(0, 30);
    return courses
      .filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.titleFa.toLowerCase().includes(q) ||
          c.titleEn.toLowerCase().includes(q)
      )
      .slice(0, 36);
  }, [courses, courseSearch]);

  const openCreateCourse = () => {
    setEditingCourse(null);
    setFormCode('ENG-405');
    setFormFieldId(ENGINEERING_FIELDS[0].id);
    setFormTitleFa('');
    setFormTitleEn('');
    setFormCredits(3);
    setFormDifficulty('intermediate');
    setFormTopicsFa('');
    setFormTopicsEn('');
    setFormFormula('E = mc^2');
    setFormFeynmanFa('');
    setFormExamQuestionFa('');
    setFormExamFormula('');
    setFormExamSolutionFa('');
    setShowCourseModal(true);
  };

  const openEditCourse = (c: CourseItem) => {
    setEditingCourse(c);
    setFormCode(c.code);
    setFormFieldId(c.fieldId);
    setFormTitleFa(c.titleFa);
    setFormTitleEn(c.titleEn);
    setFormCredits(c.credits);
    setFormDifficulty(c.difficulty);
    setFormTopicsFa(c.topicsFa.join('، '));
    setFormTopicsEn(c.topicsEn.join(', '));
    setFormFormula(c.keyFormula);
    setFormFeynmanFa(c.feynmanAnalogyFa || '');
    setFormExamQuestionFa(c.hardestExamQuestionFa || '');
    setFormExamFormula(c.hardestExamFormulaLatex || c.keyFormula);
    setFormExamSolutionFa(c.hardestExamSolutionSummaryFa || '');
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleFa.trim() && !formTitleEn.trim()) return;
    const topicsFaArr = formTopicsFa
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);
    const topicsEnArr = formTopicsEn
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const payloadFields = {
      code: formCode.trim() || 'ENG-101',
      fieldId: formFieldId,
      titleFa: formTitleFa.trim() || formTitleEn.trim(),
      titleEn: formTitleEn.trim() || formTitleFa.trim(),
      credits: Number(formCredits) || 3,
      difficulty: formDifficulty,
      topicsFa: topicsFaArr.length > 0 ? topicsFaArr : editingCourse?.topicsFa || ['مبانی نظری', 'مسائل کاربردی'],
      topicsEn: topicsEnArr.length > 0 ? topicsEnArr : topicsFaArr.length > 0 ? topicsFaArr : editingCourse?.topicsEn || ['Core Theory', 'Applied Problems'],
      keyFormula: formFormula.trim() || editingCourse?.keyFormula || 'f(x) = 0',
      feynmanAnalogyFa: formFeynmanFa.trim() || undefined,
      hardestExamQuestionFa: formExamQuestionFa.trim() || undefined,
      hardestExamFormulaLatex: formExamFormula.trim() || undefined,
      hardestExamSolutionSummaryFa: formExamSolutionFa.trim() || undefined,
    };

    if (editingCourse) {
      onUpdateCourse({
        ...editingCourse,
        ...payloadFields,
      });
      notify(
        `درس ${payloadFields.code} با موفقیت ویرایش و در کاتالوگ ذخیره شد.`,
        `Course ${payloadFields.code} updated cleanly.`
      );
    } else {
      onAddCourse(payloadFields);
      notify(
        `درس جدید ${payloadFields.code} به کاتالوگ اضافه شد.`,
        `New course ${payloadFields.code} added to catalog.`
      );
    }
    setShowCourseModal(false);
  };

  // ============================================================================
  // User Management Handlers
  // ============================================================================
  const handleRoleChange = async (userId: string, role: AdminUser['role']) => {
    try {
      const resp = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await resp.json();
      if (data.user && overview) {
        setOverview({
          ...overview,
          users: overview.users.map((u) => (u.id === userId ? data.user : u)),
          logs: data.logs || overview.logs,
        });
        notify(`نقش ${data.user.name} به ${role} تغییر یافت.`, `Updated role for ${data.user.name} to ${role}.`);
      }
    } catch {
      // ignore
    }
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const resp = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await resp.json();
      if (data.user && overview) {
        setOverview({
          ...overview,
          users: overview.users.map((u) => (u.id === user.id ? data.user : u)),
          logs: data.logs || overview.logs,
        });
        notify(
          nextStatus === 'active' ? `حساب ${user.name} فعال شد.` : `حساب ${user.name} مسدود شد.`,
          `User ${user.name} is now ${nextStatus}.`
        );
      }
    } catch {
      // ignore
    }
  };

  const handleSaveEditedUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const resp = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          university: editingUser.university,
          major: editingUser.major,
          role: editingUser.role,
          status: editingUser.status,
        }),
      });
      const data = await resp.json();
      if (data.user && overview) {
        setOverview({
          ...overview,
          users: overview.users.map((u) => (u.id === editingUser.id ? data.user : u)),
          logs: data.logs || overview.logs,
        });
        notify(`اطلاعات کاربر ${data.user.name} به‌روزرسانی شد.`, `Saved profile for ${data.user.name}.`);
        setEditingUser(null);
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    try {
      const resp = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await resp.json();
      if (data.ok && overview) {
        setOverview({
          ...overview,
          users: overview.users.filter((u) => u.id !== user.id),
          logs: data.logs || overview.logs,
        });
        notify(`کاربر ${user.name} حذف شد.`, `Removed user ${user.name}.`);
      }
    } catch {
      // ignore
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    try {
      const resp = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          role: newUserRole,
        }),
      });
      const data = await resp.json();
      if (data.user && overview) {
        setOverview({
          ...overview,
          users: [data.user, ...overview.users],
          logs: data.logs || overview.logs,
        });
        notify(`کاربر جدید ${data.user.name} ثبت شد.`, `Added user ${data.user.name}.`);
        setNewUserName('');
        setNewUserEmail('');
      }
    } catch {
      // ignore
    }
  };

  // ============================================================================
  // Articles & Notes Moderation Handlers
  // ============================================================================
  const handleToggleArticleStatus = async (art: ScientificArticle) => {
    const nextStatus = art.status === 'draft' ? 'published' : 'draft';
    try {
      const resp = await fetch(`/api/articles/${art.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await resp.json();
      if (data.article) {
        setArticles((prev) => prev.map((a) => (a.id === art.id ? data.article : a)));
        if (overview && data.logs) setOverview({ ...overview, logs: data.logs });
        notify(
          nextStatus === 'published' ? `مقاله «${art.titleFa}» منتشر شد.` : `مقاله «${art.titleFa}» به پیش‌نویس منتقل شد.`,
          `Article status set to ${nextStatus}.`
        );
      }
    } catch {
      // ignore
    }
  };

  const handleSaveEditedArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      const resp = await fetch(`/api/articles/${editingArticle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFa: editingArticle.titleFa,
          categoryFa: editingArticle.categoryFa,
          difficulty: editingArticle.difficulty,
          authorFa: editingArticle.authorFa,
          readMinutes: editingArticle.readMinutes,
          excerptFa: editingArticle.excerptFa,
          markdownFa: editingArticle.markdownFa,
          status: editingArticle.status || 'published',
        }),
      });
      const data = await resp.json();
      if (data.article) {
        setArticles((prev) => prev.map((a) => (a.id === editingArticle.id ? data.article : a)));
        if (overview && data.logs) setOverview({ ...overview, logs: data.logs });
        setEditingArticle(null);
        notify('مقاله علمی با موفقیت ویرایش شد.', 'Article updated cleanly.');
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteArticle = async (art: ScientificArticle) => {
    try {
      const resp = await fetch(`/api/articles/${art.id}`, { method: 'DELETE' });
      const data = await resp.json();
      if (data.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== art.id));
        if (overview && data.logs) setOverview({ ...overview, logs: data.logs });
        notify(`مقاله «${art.titleFa}» حذف شد.`, 'Article deleted.');
      }
    } catch {
      // ignore
    }
  };

  const handleToggleNoteStatus = async (note: LectureNote) => {
    const nextStatus = note.status === 'draft' ? 'published' : 'draft';
    try {
      const resp = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await resp.json();
      if (data.note) {
        setNotes((prev) => prev.map((n) => (n.id === note.id ? data.note : n)));
        if (overview && data.logs) setOverview({ ...overview, logs: data.logs });
        notify(
          nextStatus === 'published' ? `جزوه «${note.titleFa}» منتشر شد.` : `جزوه «${note.titleFa}» به پیش‌نویس رفت.`,
          `Note status set to ${nextStatus}.`
        );
      }
    } catch {
      // ignore
    }
  };

  const handleSaveEditedNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      const resp = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFa: editingNote.titleFa,
          courseCode: editingNote.courseCode,
          author: editingNote.author,
          university: editingNote.university,
          summaryFa: editingNote.summaryFa,
          previewFormula: editingNote.previewFormula,
          status: editingNote.status || 'published',
        }),
      });
      const data = await resp.json();
      if (data.note) {
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? data.note : n)));
        if (overview && data.logs) setOverview({ ...overview, logs: data.logs });
        setEditingNote(null);
        notify('جزوه دانشجویی ویرایش شد.', 'Lecture note updated.');
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteNote = async (note: LectureNote) => {
    try {
      const resp = await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
      const data = await resp.json();
      if (data.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== note.id));
        if (overview && data.logs) setOverview({ ...overview, logs: data.logs });
        notify(`جزوه «${note.titleFa}» حذف شد.`, 'Lecture note deleted.');
      }
    } catch {
      // ignore
    }
  };

  // ============================================================================
  // AI Tuning & Key Save Handler
  // ============================================================================
  const handleSaveAiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAi(true);
    try {
      try {
        if (geminiClientKey.trim()) {
          localStorage.setItem('dy_gemini_key', geminiClientKey.trim());
        } else {
          localStorage.removeItem('dy_gemini_key');
        }
        localStorage.setItem('dy_admin_ai_config', JSON.stringify(aiConfig));
      } catch {
        // ignore storage errors
      }

      const resp = await fetch('/api/admin/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiConfig),
      });
      const data = await resp.json();
      if (data.aiConfig) {
        setAiConfig(data.aiConfig);
        if (overview && data.logs) {
          setOverview({ ...overview, logs: data.logs });
        }
      }
      notify('تنظیمات هسته هوش مصنوعی و کلید API با موفقیت ذخیره شد.', 'AI Engine & API configuration saved.');
    } catch {
      // ignore
    } finally {
      setSavingAi(false);
    }
  };

  const popularCourses = [
    { name: lang === 'fa' ? 'EE-201 · مدارهای الکتریکی ۱' : 'EE-201 · Electric Circuits I', students: 482 },
    { name: lang === 'fa' ? 'MATH-201 · معادلات دیفرانسیل' : 'MATH-201 · Differential Equations', students: 439 },
    { name: lang === 'fa' ? 'CS-301 · طراحی الگوریتم‌ها' : 'CS-301 · Algorithm Design', students: 391 },
    { name: lang === 'fa' ? 'ME-204 · ترمودینامیک ۱ و ۲' : 'ME-204 · Thermodynamics', students: 318 },
  ];

  const visibleCourseCount = useMemo(
    () => courses.filter((c) => c.visible !== false).length,
    [courses]
  );

  const roleLabel = (r: AdminUser['role']) => {
    if (lang === 'en') return r;
    if (r === 'Admin') return 'مدیر سیستم';
    if (r === 'Professor') return 'استاد';
    if (r === 'Moderator') return 'ناظر علمی';
    return 'دانشجو';
  };

  return (
    <div className="space-y-6">
      {/* Header + Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? '👑 استودیوی مدیریت جامع دانشیار' : '👑 DaneshYar Admin Editing Studio'}
            </h2>
            {currentUser?.role === 'admin' && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                · {currentUser.name} ({currentUser.email})
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lang === 'fa'
              ? 'ویرایش کامل دروس و فرمول‌ها، مدیریت کاربران، بازبینی مقالات و جزوات و تنظیم هسته هوش مصنوعی'
              : 'Full CRUD studio for courses & equations, users & roles, content moderation, and AI engine settings'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 self-start overflow-x-auto max-w-full">
          {(
            [
              { id: 'analytics', icon: BarChart3, fa: 'داشبورد تحلیلی', en: 'Analytics' },
              { id: 'courses', icon: BookOpen, fa: 'ویرایش دروس', en: 'Course Studio' },
              { id: 'content', icon: Newspaper, fa: 'محتوا و مقالات', en: 'Articles & Notes' },
              { id: 'users', icon: Users, fa: 'مدیریت کاربران', en: 'Users' },
              { id: 'ai-tuning', icon: Sliders, fa: 'تنظیمات AI', en: 'AI Engine' },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  tab === item.id
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'fa' ? item.fa : item.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: Analytics Dashboard                                            */}
      {/* ===================================================================== */}
      {tab === 'analytics' && (
        <div className="space-y-6">
          {loadingOverview && !overview ? (
            <div className="glass-surface rounded-3xl p-12 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-sky-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: lang === 'fa' ? 'کاربران فعال ماهانه' : 'Monthly Active Users',
                    value: (overview?.metrics?.activeUsers ?? 1108).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US'),
                    sub: lang === 'fa' ? '+۱۸٪ نسبت به ماه قبل' : '+18% vs last month',
                  },
                  {
                    label: lang === 'fa' ? 'دروس ثبت‌شده در کاتالوگ' : 'Catalog Courses',
                    value: courses.length.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US'),
                    sub: lang === 'fa' ? `${visibleCourseCount} فعال در کاتالوگ` : `${visibleCourseCount} visible`,
                  },
                  {
                    label: lang === 'fa' ? 'جزوات و مقالات علمی' : 'Notes & Articles',
                    value: (notes.length + articles.length).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US'),
                    sub: lang === 'fa' ? 'قابل ویرایش در تب محتوا' : 'Moderated in Content tab',
                  },
                  {
                    label: lang === 'fa' ? 'حجم درخواست‌های هوش مصنوعی' : 'AI Query Volume',
                    value: (overview?.metrics?.totalAiQueries ?? 3493).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US'),
                    sub: lang === 'fa' ? 'فاینمن، حل فرمول و ربات چت' : 'Feynman, Solver & @Bot',
                  },
                ].map((kpi, idx) => (
                  <div key={idx} className="glass-surface rounded-2xl p-5 space-y-1.5">
                    <div className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {kpi.value}
                    </div>
                    <div className="text-xs text-sky-600 dark:text-sky-400 font-medium">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 glass-surface rounded-3xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'پربازدیدترین دروس مهندسی' : 'Most Popular Engineering Courses'}
                  </h3>
                  <div className="space-y-3.5">
                    {popularCourses.map((pc, i) => {
                      const pct = Math.round((pc.students / 500) * 100);
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{pc.name}</span>
                            <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                              {pc.students} {lang === 'fa' ? 'دانشجو' : 'students'}
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-sky-600 dark:bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-6 glass-surface rounded-3xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'توزیع مصرف موتورهای هوش مصنوعی' : 'AI Engine Query Volume Breakdown'}
                  </h3>
                  <div className="space-y-3.5">
                    {[
                      { label: lang === 'fa' ? 'دستیار فاینمن' : 'Feynman Explainer', val: overview?.aiQueryBreakdown?.feynman ?? 1240 },
                      { label: lang === 'fa' ? 'حل فرمول LaTeX' : 'Formula Solver', val: overview?.aiQueryBreakdown?.formulaSolver ?? 890 },
                      { label: lang === 'fa' ? 'آزمون‌ساز هوشمند' : 'Smart Quiz Simulator', val: overview?.aiQueryBreakdown?.quiz ?? 615 },
                      { label: lang === 'fa' ? 'ربات چت @دانشیار' : '@DaneshYar Chat Bot', val: overview?.aiQueryBreakdown?.chatBot ?? 430 },
                      { label: lang === 'fa' ? 'استخراج اسلاید PDF' : 'PDF Slide Extractor', val: overview?.aiQueryBreakdown?.pdfExtract ?? 318 },
                    ].map((row, idx) => {
                      const pct = Math.min(100, Math.round((row.val / 1300) * 100));
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-slate-700 dark:text-slate-200">{row.label}</span>
                            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">{row.val}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: Course Editing Studio (Full CRUD + Feynman & Exam Overrides)   */}
      {/* ===================================================================== */}
      {tab === 'courses' && (
        <div className="space-y-5">
          <div className="glass-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder={lang === 'fa' ? 'جستجوی کد یا عنوان درس برای ویرایش یا حذف...' : 'Search course code or title to edit/delete...'}
                className="w-full ps-10 pe-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportCourseDatabaseAsJson()}
                title={lang === 'fa' ? 'دانلود دیتابیس جامع تمام دروس دانشگاهی در فرمت JSON' : 'Download Complete Courses Database as JSON'}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'fa' ? 'خروجی بانک دروس (JSON)' : 'Export Database'}</span>
              </button>
              <button
                type="button"
                onClick={openCreateCourse}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'fa' ? 'افزودن درس جدید' : 'Add New Course'}</span>
              </button>
            </div>
          </div>

          {/* Course Table */}
          <div className="glass-surface rounded-3xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>
                {lang === 'fa'
                  ? `کل دروس: ${courses.length} · فعال در کاتالوگ: ${visibleCourseCount} · مخفی: ${courses.length - visibleCourseCount}`
                  : `Total: ${courses.length} · Visible: ${visibleCourseCount} · Hidden: ${courses.length - visibleCourseCount}`}
              </span>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                {lang === 'fa' ? 'ویرایش‌های توضیح ۵ سالگی و سوال غول امتحان فوراً در صفحه جزئیات درس اعمال می‌شوند.' : '5yo analogy & exam edits reflect immediately in course detail view.'}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'کد' : 'Code'}</th>
                    <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'عنوان درس و سرفصل' : 'Course Title'}</th>
                    <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'سطح و واحد' : 'Difficulty'}</th>
                    <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'نمایش' : 'Visibility'}</th>
                    <th className="p-3.5 text-end font-semibold">{lang === 'fa' ? 'عملیات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                  {filteredCourses.map((c) => {
                    const isVisible = c.visible !== false;
                    return (
                      <tr key={c.id} className={`hover:bg-slate-50/70 dark:hover:bg-slate-900/40 ${!isVisible ? 'opacity-60' : ''}`}>
                        <td className="p-3.5 font-mono text-sky-700 dark:text-sky-400 font-semibold whitespace-nowrap">{c.code}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {lang === 'fa' ? c.titleFa : c.titleEn}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                            {(lang === 'fa' ? c.topicsFa : c.topicsEn).join(' · ')}
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {c.difficulty === 'introductory'
                            ? lang === 'fa' ? 'پایه' : 'Intro'
                            : c.difficulty === 'intermediate'
                            ? lang === 'fa' ? 'تخصصی' : 'Interm.'
                            : lang === 'fa' ? 'پیشرفته' : 'Adv.'} · {c.credits} {lang === 'fa' ? 'واحد' : 'Cr'}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateCourse({ ...c, visible: !isVisible });
                              notify(
                                !isVisible ? `درس ${c.code} در کاتالوگ فعال شد.` : `درس ${c.code} مخفی شد.`,
                                `Course ${c.code} visibility updated.`
                              );
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                              isVisible
                                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{isVisible ? (lang === 'fa' ? 'نمایش' : 'Visible') : (lang === 'fa' ? 'مخفی' : 'Hidden')}</span>
                          </button>
                        </td>
                        <td className="p-3.5 text-end whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditCourse(c)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 text-xs font-semibold cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteCourse(c.id);
                                notify(`درس ${c.code} از کاتالوگ حذف شد.`, `Deleted course ${c.code}.`);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 cursor-pointer"
                              title={lang === 'fa' ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: Article & Note Moderator                                       */}
      {/* ===================================================================== */}
      {tab === 'content' && (
        <div className="space-y-6">
          {contentLoading ? (
            <div className="glass-surface rounded-3xl p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Scientific Articles Moderator */}
              <div className="glass-surface rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'fa' ? 'مدیریت و بازبینی مقالات علمی' : 'Scientific Articles Moderator'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{articles.length}</span>
                </div>

                <div className="space-y-3">
                  {articles.map((art) => {
                    const isPublished = art.status !== 'draft';
                    return (
                      <div
                        key={art.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 p-4 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {lang === 'fa' ? art.titleFa : art.titleEn}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {art.authorFa} · {art.categoryFa} · {art.readMinutes} {lang === 'fa' ? 'دقیقه' : 'min'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleArticleStatus(art)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap cursor-pointer ${
                              isPublished
                                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                : 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {isPublished
                              ? lang === 'fa' ? 'منتشرشده' : 'Published'
                              : lang === 'fa' ? 'پیش‌نویس' : 'Draft'}
                          </button>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800/70">
                          <button
                            type="button"
                            onClick={() => setEditingArticle({ ...art })}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(art)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'fa' ? 'حذف' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lecture Notes Moderator */}
              <div className="glass-surface rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lang === 'fa' ? 'مدیریت جزوات و فرمول‌نامه‌ها' : 'Lecture Notes Moderator'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{notes.length}</span>
                </div>

                <div className="space-y-3">
                  {notes.map((note) => {
                    const isPublished = note.status !== 'draft';
                    return (
                      <div
                        key={note.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 p-4 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {lang === 'fa' ? note.titleFa : note.titleEn}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-mono text-sky-600 dark:text-sky-400">{note.courseCode}</span> · {note.author} · {note.university}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleNoteStatus(note)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap cursor-pointer ${
                              isPublished
                                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                : 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {isPublished
                              ? lang === 'fa' ? 'منتشرشده' : 'Published'
                              : lang === 'fa' ? 'پیش‌نویس' : 'Draft'}
                          </button>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800/70">
                          <button
                            type="button"
                            onClick={() => setEditingNote({ ...note })}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'fa' ? 'حذف' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: User Management & Editor Modal + Activity Logs                 */}
      {/* ===================================================================== */}
      {tab === 'users' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-5">
            <form onSubmit={handleCreateUser} className="glass-surface rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder={lang === 'fa' ? 'نام کاربر' : 'Full name'}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
              <input
                type="email"
                dir="ltr"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="email@university.edu"
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as AdminUser['role'])}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                <option value="Student">{roleLabel('Student')}</option>
                <option value="Professor">{roleLabel('Professor')}</option>
                <option value="Moderator">{roleLabel('Moderator')}</option>
                <option value="Admin">{roleLabel('Admin')}</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'fa' ? 'افزودن کاربر' : 'Add User'}</span>
              </button>
            </form>

            <div className="glass-surface rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'کاربر' : 'User'}</th>
                      <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'نقش' : 'Role'}</th>
                      <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'وضعیت' : 'Status'}</th>
                      <th className="p-3.5 text-end font-semibold">{lang === 'fa' ? 'عملیات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                    {overview.users.map((u) => (
                      <tr key={u.id}>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {u.email} · {u.university}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as AdminUser['role'])}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-medium text-slate-800 dark:text-slate-100"
                          >
                            <option value="Student">{roleLabel('Student')}</option>
                            <option value="Professor">{roleLabel('Professor')}</option>
                            <option value="Moderator">{roleLabel('Moderator')}</option>
                            <option value="Admin">{roleLabel('Admin')}</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                              u.status === 'active'
                                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                : 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {u.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            <span>{u.status === 'active' ? (lang === 'fa' ? 'فعال' : 'Active') : (lang === 'fa' ? 'مسدود' : 'Suspended')}</span>
                          </button>
                        </td>
                        <td className="p-3.5 text-end whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingUser({ ...u })}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 cursor-pointer"
                              title={lang === 'fa' ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="lg:col-span-4 glass-surface rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'گزارش فعالیت‌های اخیر' : 'Recent Activity Logs'}
              </h3>
            </div>
            <div className="space-y-3 max-h-[380px] overflow-y-auto">
              {(overview.logs || []).map((log) => (
                <div key={log.id} className="pb-3 border-b border-slate-200/70 dark:border-slate-800/70 last:border-0 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{log.actor}</span>
                    <span className="font-mono">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    {log.action} · <span className="text-sky-600 dark:text-sky-400">{log.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: AI Engine Settings & Runtime Metrics                           */}
      {/* ===================================================================== */}
      {tab === 'ai-tuning' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form onSubmit={handleSaveAiConfig} className="lg:col-span-7 glass-surface rounded-3xl p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'تنظیمات هسته هوش مصنوعی جمینای و سبک فاینمن' : 'Gemini AI System Prompt & Pedagogical Tuning'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {lang === 'fa'
                  ? 'تغییرات مستقیماً روی دستیار فاینمن، حل فرمول، ربات چت @دانشیار و رابط کلاینت اعمال می‌شوند.'
                  : 'Changes apply immediately to Feynman AI, Formula Solver, @DaneshYar bot, and client bridge.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'fa' ? 'دستورالعمل سیستمی (System Prompt)' : 'Global System Prompt'}
              </label>
              <textarea
                rows={4}
                value={aiConfig.systemPrompt}
                onChange={(e) => setAiConfig((p) => ({ ...p, systemPrompt: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 p-3.5 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fa' ? `دما و خلاقیت (${aiConfig.temperature})` : `Temperature (${aiConfig.temperature})`}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={aiConfig.temperature}
                  onChange={(e) => setAiConfig((p) => ({ ...p, temperature: Number(e.target.value) }))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fa' ? 'سبک توضیح فاینمن' : 'Explanation Style'}
                </label>
                <select
                  value={aiConfig.feynmanStyle}
                  onChange={(e) =>
                    setAiConfig((p) => ({ ...p, feynmanStyle: e.target.value as AiTuningConfig['feynmanStyle'] }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="storytelling">{lang === 'fa' ? 'داستانی و شهودی' : 'Storytelling & Intuitive'}</option>
                  <option value="balanced">{lang === 'fa' ? 'آکادمیک متعادل' : 'Balanced Academic'}</option>
                  <option value="rigorous">{lang === 'fa' ? 'اثبات ریاضی دقیق' : 'Rigorous Mathematical'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fa' ? 'عمق استدلال' : 'Reasoning Depth'}
                </label>
                <select
                  value={aiConfig.thinkingLevel}
                  onChange={(e) =>
                    setAiConfig((p) => ({ ...p, thinkingLevel: e.target.value as AiTuningConfig['thinkingLevel'] }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="LOW">LOW (سریع)</option>
                  <option value="MEDIUM">MEDIUM (متعادل)</option>
                  <option value="HIGH">HIGH (استنتاج عمیق)</option>
                </select>
              </div>
            </div>

            {/* Client-Side Static Override API Key Settings */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/60 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <KeyRound className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>
                    {lang === 'fa' ? 'تنظیم کلید Gemini برای میزبانی استاتیک (اختیاری)' : 'Static Hosting Gemini Key Override (Optional)'}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowKeyText((s) => !s)}
                  className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  {showKeyText ? (lang === 'fa' ? 'مخفی کردن' : 'Hide') : (lang === 'fa' ? 'نمایش' : 'Show')}
                </button>
              </div>
              <input
                type={showKeyText ? 'text' : 'password'}
                dir="ltr"
                value={geminiClientKey}
                onChange={(e) => setGeminiClientKey(e.target.value)}
                placeholder="AIza... (خالی = استفاده از کلید امن سرور)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={savingAi}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold cursor-pointer"
              >
                {savingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{lang === 'fa' ? 'ذخیره و اعمال تنظیمات' : 'Save & Apply AI Config'}</span>
              </button>
            </div>
          </form>

          {/* Server Metrics & System Status Panel */}
          <div className="lg:col-span-5 glass-surface rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'وضعیت سرور و متریک‌های سیستم' : 'Server Metrics & Runtime'}
                </h3>
              </div>
              <button
                type="button"
                onClick={loadAdminOverview}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                {lang === 'fa' ? 'بروزرسانی' : 'Refresh'}
              </button>
            </div>

            <div className="divide-y divide-slate-200/70 dark:divide-slate-800/70 text-xs sm:text-sm">
              {[
                {
                  label: lang === 'fa' ? 'سرویس هسته AI' : 'AI Core Runtime',
                  val: 'Express + Gemini SDK',
                },
                {
                  label: lang === 'fa' ? 'دروس فعال / کل کاتالوگ' : 'Visible / Total Courses',
                  val: `${visibleCourseCount} / ${courses.length}`,
                },
                {
                  label: lang === 'fa' ? 'کل درخواست‌های پردازش‌شده AI' : 'Total AI Queries',
                  val: String(overview?.metrics?.totalAiQueries ?? 0),
                },
                {
                  label: lang === 'fa' ? 'تعداد کاربران ثبت‌شده' : 'Registered Users',
                  val: String(overview?.metrics?.totalRegisteredUsers ?? 0),
                },
                {
                  label: lang === 'fa' ? 'سطح استنتاج فعال' : 'Active Thinking Level',
                  val: `${aiConfig.thinkingLevel} · T=${aiConfig.temperature}`,
                },
                {
                  label: lang === 'fa' ? 'اپراتور نشست فعلی' : 'Current Session Operator',
                  val: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Guest View',
                },
              ].map((row, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: Course Editor Modal ('ویرایش / افزودن درس')                  */}
      {/* ===================================================================== */}
      {showCourseModal && (
        <div
          onClick={() => setShowCourseModal(false)}
          className="fixed inset-0 z-[105] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveCourse}
            className="glass-surface bg-white/95 dark:bg-slate-900/95 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {editingCourse
                    ? lang === 'fa' ? `ویرایش درس ${editingCourse.code}` : `Edit Course ${editingCourse.code}`
                    : lang === 'fa' ? 'ویرایش / افزودن درس جدید' : 'Add New Course'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'fa'
                    ? 'تمام مشخصات، سرفصل، فرمول LaTeX، توضیح ۵ سالگی و غول امتحان را مدیریت کنید.'
                    : 'Configure course details, syllabus, LaTeX equation, 5yo analogy, and hardest exam challenge.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa' ? 'کد درس' : 'Code'}
                </label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="EE-410"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa' ? 'دانشکده / گرایش' : 'Department / Field'}
                </label>
                <select
                  value={formFieldId}
                  onChange={(e) => setFormFieldId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  {ENGINEERING_FIELDS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {lang === 'fa' ? f.nameFa : f.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa' ? 'سطح دشواری' : 'Difficulty'}
                </label>
                <select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="introductory">{lang === 'fa' ? 'پایه' : 'Introductory'}</option>
                  <option value="intermediate">{lang === 'fa' ? 'تخصصی' : 'Intermediate'}</option>
                  <option value="advanced">{lang === 'fa' ? 'پیشرفته' : 'Advanced'}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa' ? 'تعداد واحد' : 'Credits'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={formCredits}
                  onChange={(e) => setFormCredits(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa' ? 'عنوان فارسی درس' : 'Course Title (FA)'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitleFa}
                  onChange={(e) => setFormTitleFa(e.target.value)}
                  placeholder="مثال: کنترل خطی مدرن"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa' ? 'عنوان انگلیسی درس' : 'Course Title (EN)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  placeholder="Modern Linear Control Systems"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa' ? 'سرفصل‌های فارسی (جداشده با ویرگول)' : 'Syllabus Topics (FA)'}
                </label>
                <input
                  type="text"
                  value={formTopicsFa}
                  onChange={(e) => setFormTopicsFa(e.target.value)}
                  placeholder="تبدیل لاپلاس، مکان هندسی ریشه‌ها، نمودار بود"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'fa' ? 'سرفصل‌های انگلیسی (جداشده با کاما)' : 'Syllabus Topics (EN)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formTopicsEn}
                  onChange={(e) => setFormTopicsEn(e.target.value)}
                  placeholder="Laplace Transform, Root Locus, Bode Plot"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {lang === 'fa' ? 'فرمول کلیدی درس (LaTeX)' : 'Key Governing Formula (LaTeX)'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={formFormula}
                onChange={(e) => setFormFormula(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white"
              />
              {formFormula.trim() && (
                <div className="rounded-xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <LatexBlock math={formFormula} displayMode={true} className="text-xs my-0" />
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/50 p-4 space-y-2">
              <label className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Baby className="w-4 h-4" />
                <span>{lang === 'fa' ? 'توضیح ۵ سالگی فاینمن (اختیاری — جایگزین متن پیش‌فرض)' : 'Feynman 5-Year-Old Analogy Override'}</span>
              </label>
              <textarea
                rows={2}
                value={formFeynmanFa}
                onChange={(e) => setFormFeynmanFa(e.target.value)}
                placeholder={lang === 'fa' ? 'مثال کودکانه و ملموس برای درک هسته اصلی درس...' : 'Simple toy/everyday analogy for a 5-year-old...'}
                className="w-full rounded-xl border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/50 p-4 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                <Swords className="w-4 h-4" />
                <span>{lang === 'fa' ? 'چالش سخت‌ترین سوال امتحان (غول مرحله آخر)' : 'Hardest Exam Challenge Override'}</span>
              </div>
              <textarea
                rows={2}
                value={formExamQuestionFa}
                onChange={(e) => setFormExamQuestionFa(e.target.value)}
                placeholder={lang === 'fa' ? 'صورت سخت‌ترین سوال امتحانی یا المپیادی درس...' : 'Hardest exam problem statement...'}
                className="w-full rounded-xl border border-rose-200 dark:border-rose-800/60 bg-white dark:bg-slate-950 p-3 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                dir="ltr"
                value={formExamFormula}
                onChange={(e) => setFormExamFormula(e.target.value)}
                placeholder="Exam Formula LaTeX (optional)"
                className="w-full rounded-xl border border-rose-200 dark:border-rose-800/60 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
              <textarea
                rows={2}
                value={formExamSolutionFa}
                onChange={(e) => setFormExamSolutionFa(e.target.value)}
                placeholder={lang === 'fa' ? 'راهبرد حل تشریحی و دام امتحانی...' : 'Key solution strategy & trap warning...'}
                className="w-full rounded-xl border border-rose-200 dark:border-rose-800/60 bg-white dark:bg-slate-950 p-3 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingCourse ? (lang === 'fa' ? 'ذخیره تغییرات درس' : 'Save Course Changes') : (lang === 'fa' ? 'افزودن به کاتالوگ' : 'Create Course')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: User Editor Modal                                            */}
      {/* ===================================================================== */}
      {editingUser && (
        <div
          onClick={() => setEditingUser(null)}
          className="fixed inset-0 z-[105] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveEditedUser}
            className="glass-surface bg-white/95 dark:bg-slate-900/95 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ویرایش مشخصات کاربر' : 'Edit User Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                required
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                placeholder={lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="email"
                dir="ltr"
                required
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                placeholder="email@university.edu"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={editingUser.university}
                  onChange={(e) => setEditingUser({ ...editingUser, university: e.target.value })}
                  placeholder={lang === 'fa' ? 'دانشگاه' : 'University'}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={editingUser.major}
                  onChange={(e) => setEditingUser({ ...editingUser, major: e.target.value })}
                  placeholder={lang === 'fa' ? 'رشته' : 'Major'}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as AdminUser['role'] })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="Student">{roleLabel('Student')}</option>
                  <option value="Professor">{roleLabel('Professor')}</option>
                  <option value="Moderator">{roleLabel('Moderator')}</option>
                  <option value="Admin">{roleLabel('Admin')}</option>
                </select>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as AdminUser['status'] })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="active">{lang === 'fa' ? 'فعال' : 'Active'}</option>
                  <option value="suspended">{lang === 'fa' ? 'مسدود' : 'Suspended'}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                {lang === 'fa' ? 'ذخیره اطلاعات' : 'Save User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: Article Editor Modal                                         */}
      {/* ===================================================================== */}
      {editingArticle && (
        <div
          onClick={() => setEditingArticle(null)}
          className="fixed inset-0 z-[105] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveEditedArticle}
            className="glass-surface bg-white/95 dark:bg-slate-900/95 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ویرایش و بازبینی مقاله علمی' : 'Moderate & Edit Article'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              required
              value={editingArticle.titleFa}
              onChange={(e) => setEditingArticle({ ...editingArticle, titleFa: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={editingArticle.categoryFa}
                onChange={(e) => setEditingArticle({ ...editingArticle, categoryFa: e.target.value })}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
              <select
                value={editingArticle.difficulty}
                onChange={(e) => setEditingArticle({ ...editingArticle, difficulty: e.target.value as DifficultyLevel })}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
              >
                <option value="introductory">{lang === 'fa' ? 'پایه' : 'Introductory'}</option>
                <option value="intermediate">{lang === 'fa' ? 'تخصصی' : 'Intermediate'}</option>
                <option value="advanced">{lang === 'fa' ? 'پیشرفته' : 'Advanced'}</option>
              </select>
              <select
                value={editingArticle.status || 'published'}
                onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as 'published' | 'draft' })}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
              >
                <option value="published">{lang === 'fa' ? 'منتشرشده' : 'Published'}</option>
                <option value="draft">{lang === 'fa' ? 'پیش‌نویس' : 'Draft'}</option>
              </select>
            </div>
            <input
              type="text"
              value={editingArticle.excerptFa}
              onChange={(e) => setEditingArticle({ ...editingArticle, excerptFa: e.target.value })}
              placeholder={lang === 'fa' ? 'چکیده مقاله' : 'Excerpt'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
            />
            <textarea
              rows={6}
              value={editingArticle.markdownFa}
              onChange={(e) => setEditingArticle({ ...editingArticle, markdownFa: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                {lang === 'fa' ? 'ذخیره مقاله' : 'Save Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: Lecture Note Editor Modal                                    */}
      {/* ===================================================================== */}
      {editingNote && (
        <div
          onClick={() => setEditingNote(null)}
          className="fixed inset-0 z-[105] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveEditedNote}
            className="glass-surface bg-white/95 dark:bg-slate-900/95 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'ویرایش جزوه دانشجویی' : 'Edit Lecture Note'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              required
              value={editingNote.titleFa}
              onChange={(e) => setEditingNote({ ...editingNote, titleFa: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={editingNote.courseCode}
                onChange={(e) => setEditingNote({ ...editingNote, courseCode: e.target.value })}
                placeholder="EE-201"
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
              />
              <select
                value={editingNote.status || 'published'}
                onChange={(e) => setEditingNote({ ...editingNote, status: e.target.value as 'published' | 'draft' })}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
              >
                <option value="published">{lang === 'fa' ? 'منتشرشده' : 'Published'}</option>
                <option value="draft">{lang === 'fa' ? 'پیش‌نویس' : 'Draft'}</option>
              </select>
            </div>
            <textarea
              rows={3}
              value={editingNote.summaryFa}
              onChange={(e) => setEditingNote({ ...editingNote, summaryFa: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-white"
            />
            <input
              type="text"
              dir="ltr"
              value={editingNote.previewFormula}
              onChange={(e) => setEditingNote({ ...editingNote, previewFormula: e.target.value })}
              placeholder="Preview Formula (LaTeX)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                {lang === 'fa' ? 'ذخیره جزوه' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
