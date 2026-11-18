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
} from 'lucide-react';
import { ENGINEERING_FIELDS } from '../data/coursesData';
import { CourseItem, DifficultyLevel, Lang } from '../types/app';

interface AdminPanelProps {
  lang: Lang;
  courses: CourseItem[];
  onAddCourse: (course: Omit<CourseItem, 'id'>) => void;
  onUpdateCourse: (course: CourseItem) => void;
  onDeleteCourse: (courseId: string) => void;
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
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [tab, setTab] = useState<'analytics' | 'courses' | 'users' | 'ai-tuning'>('analytics');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Course CRUD state
  const [courseSearch, setCourseSearch] = useState('');
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [formCode, setFormCode] = useState('EE-499');
  const [formFieldId, setFormFieldId] = useState(ENGINEERING_FIELDS[2].id);
  const [formTitleFa, setFormTitleFa] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formCredits, setFormCredits] = useState(3);
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>('intermediate');
  const [formTopics, setFormTopics] = useState('');
  const [formFormula, setFormFormula] = useState('H(s) = \\frac{Y(s)}{X(s)}');

  // New User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminUser['role']>('Student');

  // AI Tuning state
  const [aiConfig, setAiConfig] = useState<AiTuningConfig>({
    systemPrompt: '',
    temperature: 0.4,
    feynmanStyle: 'balanced',
    thinkingLevel: 'HIGH',
  });
  const [savingAi, setSavingAi] = useState(false);
  const [aiSavedToast, setAiSavedToast] = useState(false);

  const loadAdminOverview = async () => {
    setLoadingOverview(true);
    try {
      const resp = await fetch('/api/admin/overview');
      const data: AdminOverviewData = await resp.json();
      setOverview(data);
      if (data.aiConfig) setAiConfig(data.aiConfig);
    } catch {
      // ignore
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    loadAdminOverview();
  }, []);

  const filteredCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return courses.slice(0, 24);
    return courses
      .filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.titleFa.toLowerCase().includes(q) ||
          c.titleEn.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [courses, courseSearch]);

  const openCreateCourse = () => {
    setEditingCourse(null);
    setFormCode('ENG-405');
    setFormFieldId(ENGINEERING_FIELDS[0].id);
    setFormTitleFa('');
    setFormTitleEn('');
    setFormCredits(3);
    setFormDifficulty('intermediate');
    setFormTopics('');
    setFormFormula('E = mc^2');
    setShowCourseForm(true);
  };

  const openEditCourse = (c: CourseItem) => {
    setEditingCourse(c);
    setFormCode(c.code);
    setFormFieldId(c.fieldId);
    setFormTitleFa(c.titleFa);
    setFormTitleEn(c.titleEn);
    setFormCredits(c.credits);
    setFormDifficulty(c.difficulty);
    setFormTopics(c.topicsFa.join('، '));
    setFormFormula(c.keyFormula);
    setShowCourseForm(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleFa.trim() && !formTitleEn.trim()) return;
    const topicsArr = formTopics
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingCourse) {
      onUpdateCourse({
        ...editingCourse,
        code: formCode.trim() || editingCourse.code,
        fieldId: formFieldId,
        titleFa: formTitleFa.trim() || formTitleEn.trim(),
        titleEn: formTitleEn.trim() || formTitleFa.trim(),
        credits: Number(formCredits) || 3,
        difficulty: formDifficulty,
        topicsFa: topicsArr.length > 0 ? topicsArr : editingCourse.topicsFa,
        topicsEn: topicsArr.length > 0 ? topicsArr : editingCourse.topicsEn,
        keyFormula: formFormula.trim() || editingCourse.keyFormula,
      });
    } else {
      onAddCourse({
        code: formCode.trim() || 'ENG-101',
        fieldId: formFieldId,
        titleFa: formTitleFa.trim() || formTitleEn.trim(),
        titleEn: formTitleEn.trim() || formTitleFa.trim(),
        credits: Number(formCredits) || 3,
        difficulty: formDifficulty,
        topicsFa: topicsArr.length > 0 ? topicsArr : ['مبانی نظری', 'مسائل کاربردی'],
        topicsEn: topicsArr.length > 0 ? topicsArr : ['Core Theory', 'Applied Problems'],
        keyFormula: formFormula.trim() || 'f(x) = 0',
      });
    }
    setShowCourseForm(false);
  };

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
        });
        setNewUserName('');
        setNewUserEmail('');
      }
    } catch {
      // ignore
    }
  };

  const handleSaveAiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAi(true);
    setAiSavedToast(false);
    try {
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
        setAiSavedToast(true);
      }
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'پنل مدیریت جامع دانشیار' : 'DaneshYar Admin Control Center'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'fa'
              ? 'تحلیل شاخص‌های پلتفرم، مدیریت کامل دروس، کاربران و تنظیمات مدل هوش مصنوعی'
              : 'Platform analytics, full course CRUD, user roles & activity logs, and AI tuning'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 self-start overflow-x-auto max-w-full">
          {(
            [
              { id: 'analytics', icon: BarChart3, fa: 'داشبورد تحلیلی', en: 'Analytics' },
              { id: 'courses', icon: BookOpen, fa: 'مدیریت دروس', en: 'Courses CRUD' },
              { id: 'users', icon: Users, fa: 'مدیریت کاربران', en: 'Users & Logs' },
              { id: 'ai-tuning', icon: Sliders, fa: 'تنظیمات AI', en: 'AI Tuning' },
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
                    value: overview?.metrics.activeUsers.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US') || '1,108',
                    sub: lang === 'fa' ? '+۱۸٪ نسبت به ماه قبل' : '+18% vs last month',
                  },
                  {
                    label: lang === 'fa' ? 'دروس ثبت‌شده در کاتالوگ' : 'Catalog Courses',
                    value: courses.length.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US'),
                    sub: lang === 'fa' ? 'در ۴۵ گرایش دانشگاهی' : 'Across 45 fields',
                  },
                  {
                    label: lang === 'fa' ? 'جزوات و مقالات علمی' : 'Uploaded Notes & Articles',
                    value: (
                      (overview?.metrics.uploadedNotes || 5) + (overview?.metrics.publishedArticles || 3)
                    ).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US'),
                    sub: lang === 'fa' ? 'با ارزیابی همتایان' : 'Peer-verified repository',
                  },
                  {
                    label: lang === 'fa' ? 'حجم درخواست‌های هوش مصنوعی' : 'AI Query Volume',
                    value: (overview?.metrics.totalAiQueries || 3493).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US'),
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
                {/* Popular Courses Bar Visualization */}
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

                {/* AI Query Distribution */}
                <div className="lg:col-span-6 glass-surface rounded-3xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {lang === 'fa' ? 'توزیع مصرف موتورهای هوش مصنوعی' : 'AI Engine Query Volume Breakdown'}
                  </h3>
                  <div className="space-y-3.5">
                    {[
                      { label: lang === 'fa' ? 'دستیار فاینمن' : 'Feynman Explainer', val: overview?.aiQueryBreakdown.feynman || 1240 },
                      { label: lang === 'fa' ? 'حل فرمول LaTeX' : 'Formula Solver', val: overview?.aiQueryBreakdown.formulaSolver || 890 },
                      { label: lang === 'fa' ? 'آزمون‌ساز هوشمند' : 'Smart Quiz Simulator', val: overview?.aiQueryBreakdown.quiz || 615 },
                      { label: lang === 'fa' ? 'ربات چت @دانشیار' : '@DaneshYar Chat Bot', val: overview?.aiQueryBreakdown.chatBot || 430 },
                      { label: lang === 'fa' ? 'استخراج اسلاید PDF' : 'PDF Slide Extractor', val: overview?.aiQueryBreakdown.pdfExtract || 318 },
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
      {/* TAB 2: Course & Content Manager (Full CRUD)                           */}
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
            <button
              type="button"
              onClick={openCreateCourse}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'fa' ? 'افزودن درس جدید' : 'Add Course'}</span>
            </button>
          </div>

          {showCourseForm && (
            <form onSubmit={handleSaveCourse} className="glass-surface rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingCourse
                    ? lang === 'fa' ? `ویرایش درس ${editingCourse.code}` : `Edit ${editingCourse.code}`
                    : lang === 'fa' ? 'تعریف درس دانشگاهی جدید' : 'Create New University Course'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCourseForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  {lang === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="EE-410"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
                />
                <select
                  value={formFieldId}
                  onChange={(e) => setFormFieldId(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  {ENGINEERING_FIELDS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {lang === 'fa' ? f.nameFa : f.nameEn}
                    </option>
                  ))}
                </select>
                <select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as DifficultyLevel)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="introductory">{lang === 'fa' ? 'پایه' : 'Introductory'}</option>
                  <option value="intermediate">{lang === 'fa' ? 'تخصصی' : 'Intermediate'}</option>
                  <option value="advanced">{lang === 'fa' ? 'پیشرفته' : 'Advanced'}</option>
                </select>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formCredits}
                  onChange={(e) => setFormCredits(Number(e.target.value))}
                  placeholder="3"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formTitleFa}
                  onChange={(e) => setFormTitleFa(e.target.value)}
                  placeholder={lang === 'fa' ? 'عنوان فارسی درس' : 'Persian Course Title'}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  placeholder="English Course Title"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formTopics}
                  onChange={(e) => setFormTopics(e.target.value)}
                  placeholder={lang === 'fa' ? 'سرفصل‌ها (با ویرگول جدا کنید)' : 'Syllabus topics (comma separated)'}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={formFormula}
                  onChange={(e) => setFormFormula(e.target.value)}
                  placeholder="LaTeX Key Formula"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingCourse ? (lang === 'fa' ? 'ذخیره تغییرات' : 'Save Changes') : (lang === 'fa' ? 'ثبت در کاتالوگ' : 'Create Course')}</span>
              </button>
            </form>
          )}

          {/* Course Table */}
          <div className="glass-surface rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'کد' : 'Code'}</th>
                    <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'عنوان درس' : 'Course Title'}</th>
                    <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'سطح' : 'Difficulty'}</th>
                    <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'واحد' : 'Credits'}</th>
                    <th className="p-3.5 text-end font-semibold">{lang === 'fa' ? 'عملیات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
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
                          : lang === 'fa' ? 'پیشرفته' : 'Adv.'}
                      </td>
                      <td className="p-3.5 font-mono tabular-nums text-slate-700 dark:text-slate-200">{c.credits}</td>
                      <td className="p-3.5 text-end whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditCourse(c)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-600 cursor-pointer"
                            title={lang === 'fa' ? 'ویرایش' : 'Edit'}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteCourse(c.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 cursor-pointer"
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
      )}

      {/* ===================================================================== */}
      {/* TAB 3: User Management & Activity Logs                                */}
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
                <option value="Student">Student</option>
                <option value="Professor">Professor</option>
                <option value="Moderator">Moderator</option>
                <option value="Admin">Admin</option>
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
                      <th className="p-3.5 text-start font-semibold">{lang === 'fa' ? 'پرسش AI' : 'Queries'}</th>
                      <th className="p-3.5 text-end font-semibold">{lang === 'fa' ? 'وضعیت' : 'Status'}</th>
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
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                            <option value="Moderator">Moderator</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-3.5 font-mono tabular-nums text-slate-700 dark:text-slate-200">
                          {u.queriesCount}
                        </td>
                        <td className="p-3.5 text-end">
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
              {overview.logs.map((log) => (
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
      {/* TAB 4: AI Tuning Panel                                                */}
      {/* ===================================================================== */}
      {tab === 'ai-tuning' && (
        <form onSubmit={handleSaveAiConfig} className="glass-surface rounded-3xl p-6 sm:p-8 max-w-3xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'تنظیمات هسته هوش مصنوعی و سبک فاینمن' : 'AI System Prompt & Pedagogical Tuning'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {lang === 'fa'
                ? 'تغییرات مستقیماً روی دستیار فاینمن، حل فرمول و ربات چت @دانشیار اعمال می‌شوند.'
                : 'Changes apply immediately to Feynman AI, Formula Solver, and @DaneshYar chat bot.'}
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
                {lang === 'fa' ? `خلاقیت پاسخ (${aiConfig.temperature})` : `Creativity (${aiConfig.temperature})`}
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
                {lang === 'fa' ? 'سبک توضیح فاینمن' : 'Feynman Style'}
              </label>
              <select
                value={aiConfig.feynmanStyle}
                onChange={(e) =>
                  setAiConfig((p) => ({ ...p, feynmanStyle: e.target.value as AiTuningConfig['feynmanStyle'] }))
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                <option value="storytelling">{lang === 'fa' ? 'داستان‌محور و تشبیهی' : 'Storytelling & Analogy'}</option>
                <option value="balanced">{lang === 'fa' ? 'متعادل دانشگاهی' : 'Balanced Academic'}</option>
                <option value="rigorous">{lang === 'fa' ? 'دقیق با اثبات ریاضی' : 'Rigorous Mathematical'}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'fa' ? 'عمق استدلال فرمول‌حل‌کن' : 'Solver Reasoning Depth'}
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

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={savingAi}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
            >
              {savingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{lang === 'fa' ? 'ذخیره و اعمال تنظیمات' : 'Save & Apply AI Config'}</span>
            </button>

            {aiSavedToast && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'fa' ? 'تنظیمات با موفقیت اعمال شد.' : 'AI configuration updated.'}</span>
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
