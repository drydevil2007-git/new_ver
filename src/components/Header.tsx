import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Mic,
  GraduationCap,
  Landmark,
  Crown,
  LogIn,
  LogOut,
  ChevronDown,
  Building2,
  Calendar,
  Cpu,
  Bot,
  Zap,
  Code2,
  BookOpen,
  Sparkles,
  Layers,
  FileText,
  MessageSquare,
  Headphones,
  Target,
  LayoutGrid,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Lang, NavSection, UserSession } from '../types/app';

interface HeaderProps {
  lang: Lang;
  activeSection: NavSection;
  user: UserSession | null;
  onNavigate: (section: NavSection) => void;
  onLaunchVoiceCoach: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

interface NavItem {
  id: NavSection;
  labelFa: string;
  labelEn: string;
  descFa: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

interface NavCategory {
  id: string;
  titleFa: string;
  titleEn: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  activeSection,
  user,
  onNavigate,
  onLaunchVoiceCoach,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const categories: NavCategory[] = [
    {
      id: 'education',
      titleFa: 'آموزش و آزمون',
      titleEn: 'Learning & Exams',
      icon: BookOpen,
      items: [
        {
          id: 'exam-sprint',
          labelFa: 'آمادگی شب امتحان',
          labelEn: 'Exam Sprint',
          descFa: 'مرور فوق فشرده، فرمول‌نامه و پیش‌بینی سوالات',
          descEn: 'High-yield exam prep and formula sheets',
          icon: Target,
          iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
          iconColor: 'text-rose-600 dark:text-rose-400',
          badge: 'ویژه',
        },
        {
          id: 'courses',
          labelFa: 'دروس و نقشه‌های یادگیری',
          labelEn: 'Courses & Roadmaps',
          descFa: 'چارت دانشگاهی، مدل‌های سه‌بعدی و سرفصل‌ها',
          descEn: 'University syllabi and 3D concept viewers',
          icon: BookOpen,
          iconBg: 'bg-sky-500/10 dark:bg-sky-500/20',
          iconColor: 'text-sky-600 dark:text-sky-400',
        },
        {
          id: 'study-deck',
          labelFa: 'جعبه یادگیری لایتنر',
          labelEn: 'Study Deck & Leitner',
          descFa: 'مرور فاصله‌دار، کوییزهای سریع و فلش‌کارت',
          descEn: 'Spaced repetition flashcards and quick quizzes',
          icon: Layers,
          iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
        },
        {
          id: 'articles',
          labelFa: 'کتب و مقالات علمی',
          labelEn: 'Books & Scientific Papers',
          descFa: 'آرشیو مقالات مرجع، رفرنس‌های دانشگاهی و نگارش',
          descEn: 'Open-access papers, reference books and editor',
          icon: FileText,
          iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
      ],
    },
    {
      id: 'ai-suite',
      titleFa: 'هوش مصنوعی و ایجنت‌ها',
      titleEn: 'AI & Agents Suite',
      icon: Sparkles,
      items: [
        {
          id: 'claudable',
          labelFa: 'کلودبل استودیو',
          labelEn: 'Claudable Studio',
          descFa: 'ساخت و ویرایش زنده وب‌اپلیکیشن‌ها با هوش مصنوعی',
          descEn: 'Full-stack AI web builder and live canvas',
          icon: Code2,
          iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
          iconColor: 'text-purple-600 dark:text-purple-400',
          badge: 'جدید',
        },
        {
          id: 'mercury',
          labelFa: 'مرکیوری ایجنت',
          labelEn: 'Mercury Agent',
          descFa: 'ایجنت پیشرفته حل مسائل الگوریتمی و ریاضی مهندسی',
          descEn: 'Autonomous deep-thinking algorithmic agent',
          icon: Cpu,
          iconBg: 'bg-sky-500/10 dark:bg-sky-500/20',
          iconColor: 'text-sky-600 dark:text-sky-400',
        },
        {
          id: 'mausbot',
          labelFa: 'اوپن‌ماوس‌بات',
          labelEn: 'OpenMausBot',
          descFa: 'بات تعاملی اتوماسیون داده و تحلیل محتوا',
          descEn: 'Interactive automation & content analytics bot',
          icon: Bot,
          iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
          iconColor: 'text-cyan-600 dark:text-cyan-400',
        },
        {
          id: 'strata',
          labelFa: 'استراتا آفلاین',
          labelEn: 'Strata Local',
          descFa: 'اجرای سبک و محلی مدل‌های زبانی بدون اینترنت',
          descEn: 'Ultra-light local AI inference engine',
          icon: Zap,
          iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
          iconColor: 'text-amber-600 dark:text-amber-400',
        },
        {
          id: 'ai-lab',
          labelFa: 'آزمایشگاه مهندسی AI',
          labelEn: 'AI Engineering Lab',
          descFa: 'تکنیک یادگیری فاینمن و مهندسی سیستماتیک پرامپت',
          descEn: 'Feynman technique and prompt playground',
          icon: Sparkles,
          iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
          iconColor: 'text-pink-600 dark:text-pink-400',
        },
      ],
    },
    {
      id: 'community-campus',
      titleFa: 'دانشجویی و هم‌دانشگاهی',
      titleEn: 'Campus & Community',
      icon: Landmark,
      items: [
        {
          id: 'campus',
          labelFa: 'هم‌دانشگاهی',
          labelEn: 'Campus Voice',
          descFa: 'شبکه اساتید و دانشجویان، رزومه و اخبار دانشگاه',
          descEn: 'Academic networking, profs, resume and news',
          icon: GraduationCap,
          iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
          iconColor: 'text-amber-600 dark:text-amber-400',
        },
        {
          id: 'community',
          labelFa: 'چت و تالار گفتگو',
          labelEn: 'Chat & Community',
          descFa: 'تالار گفتگوی زنده، تبادل جزوات و حل تمرین',
          descEn: 'Real-time discussions and peer notes exchange',
          icon: MessageSquare,
          iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          id: 'study-rooms',
          labelFa: 'اتاق مطالعه مجازی',
          labelEn: 'Study Rooms',
          descFa: 'تایمر پومودورو گروهی، موسیقی تمرکز و همنشینی مطالعه',
          descEn: 'Collaborative Pomodoro sessions and focus lofi',
          icon: Headphones,
          iconBg: 'bg-teal-500/10 dark:bg-teal-500/20',
          iconColor: 'text-teal-600 dark:text-teal-400',
        },
      ],
    },
  ];

  const handleNav = (id: NavSection) => {
    onNavigate(id);
    setActiveDropdown(null);
    setMobileOpen(false);
    setProfileMenuOpen(false);
  };

  const roleBadgeLabel = (role: UserSession['role']) => {
    if (role === 'admin') return lang === 'fa' ? '👑 مدیر ارشد' : '👑 Super Admin';
    if (role === 'professor') return lang === 'fa' ? 'استاد' : 'Professor';
    return lang === 'fa' ? 'دانشجو' : 'Student';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Wordmark & Quick Overview Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('overview')}
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500 rounded-lg group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span>{lang === 'fa' ? 'دانشیار' : 'DaneshYar'}</span>
          </button>
        </div>

        {/* Categorized Navigation Dropdowns (فهرست‌بندی ساختاریافته) */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-sm font-medium">
          {/* Direct Home Pill */}
          <button
            type="button"
            onClick={() => handleNav('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-colors cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            {lang === 'fa' ? 'خانه' : 'Home'}
          </button>

          {/* Group Dropdowns */}
          {categories.map((cat) => {
            const isOpen = activeDropdown === cat.id;
            const hasActiveItem = cat.items.some((i) => i.id === activeSection);
            const IconComponent = cat.icon;

            return (
              <div key={cat.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(isOpen ? null : cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer ${
                    hasActiveItem || isOpen
                      ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{lang === 'fa' ? cat.titleFa : cat.titleEn}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute start-0 mt-2 w-80 sm:w-96 rounded-2xl glass-surface bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 space-y-1 z-50"
                    >
                      {/* Menu Header with Category Title & Quick Login Access */}
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {lang === 'fa' ? `فهرست ${cat.titleFa}` : cat.titleEn}
                        </span>
                        {!user && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDropdown(null);
                              onOpenAuth();
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                          >
                            <LogIn className="w-3 h-3" />
                            <span>{lang === 'fa' ? 'ورود به حساب' : 'Sign In'}</span>
                          </button>
                        )}
                      </div>

                      {/* Menu Items List */}
                      <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto p-0.5">
                        {cat.items.map((item) => {
                          const isItemActive = activeSection === item.id;
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleNav(item.id)}
                              className={`w-full text-start flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                                isItemActive
                                  ? 'bg-sky-50 dark:bg-sky-950/60 ring-1 ring-sky-500/30'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
                              >
                                <ItemIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs sm:text-sm font-bold truncate ${
                                      isItemActive
                                        ? 'text-sky-600 dark:text-sky-400'
                                        : 'text-slate-800 dark:text-slate-100'
                                    }`}
                                  >
                                    {lang === 'fa' ? item.labelFa : item.labelEn}
                                  </span>
                                  {item.badge && (
                                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {lang === 'fa' ? item.descFa : item.descEn}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right Actions: Prominent Login / Profile + Admin + Voice Coach + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Prominent Admin Panel Button (if admin) */}
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-md ${
                activeSection === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white ring-2 ring-amber-300/80'
                  : 'bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-amber-600/95 hover:from-amber-400 hover:to-rose-500 text-white shadow-amber-500/20'
              }`}
            >
              <Crown className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'fa' ? '👑 پنل مدیریت' : '👑 Admin'}</span>
            </button>
          )}

          {/* PROMINENT LOGIN BUTTON (ورود در نوار هدر) */}
          {!user ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-sky-600/20 hover:shadow-sky-600/35 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer ring-1 ring-white/20"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>{lang === 'fa' ? 'ورود / ثبت‌نام' : 'Sign In / Register'}</span>
            </button>
          ) : (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((o) => !o)}
                className="inline-flex items-center gap-2 ps-1.5 pe-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:border-sky-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <span
                  className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${
                    user.role === 'admin'
                      ? 'bg-gradient-to-br from-amber-500 to-rose-500'
                      : user.role === 'professor'
                      ? 'bg-indigo-600'
                      : 'bg-sky-600'
                  }`}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.avatarInitials
                  )}
                </span>
                <span className="hidden sm:inline text-xs font-bold text-slate-900 dark:text-white max-w-[120px] truncate">
                  {user.name}
                </span>
                <span
                  className={`hidden md:inline text-[11px] font-semibold ${
                    user.role === 'admin'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {roleBadgeLabel(user.role)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute end-0 mt-2 w-72 rounded-2xl glass-surface bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-2xl p-4 space-y-3 z-50">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div
                      className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-sm font-extrabold text-white shrink-0 ${
                        user.role === 'admin'
                          ? 'bg-gradient-to-br from-amber-500 to-rose-500'
                          : user.role === 'professor'
                          ? 'bg-indigo-600'
                          : 'bg-sky-600'
                      }`}
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.avatarInitials
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </div>
                      <div
                        className={`text-[11px] font-bold mt-0.5 ${
                          user.role === 'admin'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-sky-600 dark:text-sky-400'
                        }`}
                      >
                        {roleBadgeLabel(user.role)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user.university} · {user.field}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {lang === 'fa' ? `عضویت: ${user.joinedAt}` : `Joined: ${user.joinedAt}`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                    {user.role === 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleNav('admin')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'باز کردن پنل مدیریت' : 'Open Admin Control'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      {lang === 'fa' ? 'تغییر حساب / پنجره ورود' : 'Switch Account / Auth'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{lang === 'fa' ? 'خروج از حساب کاربری' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Voice Coach CTA */}
          <button
            type="button"
            onClick={onLaunchVoiceCoach}
            title={lang === 'fa' ? 'مربی صوتی زنده' : 'Voice Coach'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{lang === 'fa' ? 'مربی صوتی زنده' : 'Voice Coach'}</span>
          </button>

          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={lang === 'fa' ? 'فهرست ناوبری' : 'Toggle navigation'}
            className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer (فهرست‌بندی شده برای موبایل با دسترسی ورود) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Top Quick Login Button in Mobile Drawer */}
            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-sky-600 to-indigo-600 shadow-md shadow-sky-600/20 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'fa' ? 'ورود به حساب کاربری / ثبت‌نام' : 'Sign In / Register'}</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.avatarInitials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">{user.name}</div>
                    <div className="text-[10px] text-slate-400">{user.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onLogout();
                  }}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Home */}
            <button
              type="button"
              onClick={() => handleNav('overview')}
              className={`w-full text-start flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeSection === 'overview'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{lang === 'fa' ? 'صفحه اصلی (نمای کلی)' : 'Home Overview'}</span>
            </button>

            {/* Categorized Sections */}
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <cat.icon className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? cat.titleFa : cat.titleEn}</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {cat.items.map((item) => {
                    const isItemActive = activeSection === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNav(item.id)}
                        className={`w-full text-start flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          isItemActive
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}>
                            <ItemIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{lang === 'fa' ? item.labelFa : item.labelEn}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-xl cursor-pointer shadow-md"
              >
                <Crown className="w-4 h-4" />
                <span>{lang === 'fa' ? '👑 پنل مدیریت جامع' : '👑 Admin Control Center'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onLaunchVoiceCoach();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-xl cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{lang === 'fa' ? 'شروع مربی صوتی زنده' : 'Start Voice Coach'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
