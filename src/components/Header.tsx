import React, { useEffect, useRef, useState } from 'react';
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const navItems: Array<{ id: NavSection; labelFa: string; labelEn: string; isCampus?: boolean; isMercury?: boolean; isMaus?: boolean; isStrata?: boolean; isClaudable?: boolean }> = [
    { id: 'exam-sprint', labelFa: '🎯 آمادگی امتحان', labelEn: '🎯 Exam Prep' },
    { id: 'claudable', labelFa: '✨ کلودبل استودیو', labelEn: '✨ Claudable Studio', isClaudable: true },
    { id: 'mercury', labelFa: '⚡ مرکیوری ایجنت', labelEn: '⚡ Mercury Agent', isMercury: true },
    { id: 'mausbot', labelFa: '🐭 اوپن‌ماوس‌بات', labelEn: '🐭 OpenMausBot', isMaus: true },
    { id: 'strata', labelFa: '⚡ استراتا محلی', labelEn: '⚡ Strata Local', isStrata: true },
    { id: 'courses', labelFa: 'دروس و نقشه', labelEn: 'Courses' },
    { id: 'ai-lab', labelFa: 'آزمایشگاه AI', labelEn: 'AI Lab' },
    { id: 'articles', labelFa: 'کتب و مقالات علمی', labelEn: 'Books & Papers' },
    { id: 'community', labelFa: 'چت و انجمن', labelEn: 'Chat' },
    { id: 'campus', labelFa: 'هم‌دانشگاهی', labelEn: 'Campus', isCampus: true },
    { id: 'study-deck', labelFa: 'جعبه یادگیری', labelEn: 'Study' },
    { id: 'study-rooms', labelFa: 'اتاق مطالعه', labelEn: 'Rooms' },
  ];

  const handleNav = (id: NavSection) => {
    onNavigate(id);
    setMobileOpen(false);
    setProfileMenuOpen(false);
  };

  const roleBadgeLabel = (role: UserSession['role']) => {
    if (role === 'admin') return lang === 'fa' ? '👑 مدیر ارشد' : '👑 Super Admin';
    if (role === 'professor') return lang === 'fa' ? 'استاد' : 'Professor';
    return lang === 'fa' ? 'دانشجو' : 'Student';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('overview')}
          className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500 rounded-md"
        >
          {lang === 'fa' ? 'دانشیار' : 'DaneshYar'}
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1.5 inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.isCampus && (
                  <span
                    className="inline-flex items-center gap-0.5 text-amber-500 dark:text-amber-400"
                    aria-hidden="true"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <Landmark className="w-3.5 h-3.5" />
                  </span>
                )}
                {item.isClaudable && (
                  <span
                    className="inline-flex items-center text-indigo-500 dark:text-indigo-400"
                    aria-hidden="true"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </span>
                )}
                {item.isMercury && (
                  <span
                    className="inline-flex items-center text-sky-500 dark:text-sky-400"
                    aria-hidden="true"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                  </span>
                )}
                {item.isMaus && (
                  <span
                    className="inline-flex items-center text-cyan-500 dark:text-cyan-400"
                    aria-hidden="true"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </span>
                )}
                {item.isStrata && (
                  <span
                    className="inline-flex items-center text-emerald-500 dark:text-emerald-400"
                    aria-hidden="true"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </span>
                )}
                <span>{lang === 'fa' ? item.labelFa : item.labelEn}</span>
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[19px] h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Admin Prominent CTA (when admin) + Auth/Profile + Voice Coach */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Prominent Luxury Admin Panel Button when logged in as Admin */}
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
              <span>{lang === 'fa' ? '👑 پنل مدیریت' : '👑 Admin Panel'}</span>
            </button>
          )}

          {/* Auth Login/Register OR User Profile Dropdown Pill */}
          {!user ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:border-sky-500 text-slate-800 dark:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{lang === 'fa' ? 'ورود / ثبت‌نام' : 'Login / Register'}</span>
            </button>
          ) : (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((o) => !o)}
                className="inline-flex items-center gap-2 ps-1.5 pe-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 hover:border-sky-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
                <span className="hidden sm:inline text-xs font-bold text-slate-900 dark:text-white max-w-[110px] truncate">
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
                      {lang === 'fa' ? 'تغییر حساب / ورود سریع' : 'Switch Account'}
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

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={lang === 'fa' ? 'منوی ناوبری' : 'Toggle navigation'}
            className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-start flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {item.isCampus && (
                  <span
                    className="inline-flex items-center gap-0.5 text-amber-500 dark:text-amber-400"
                    aria-hidden="true"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <Landmark className="w-4 h-4" />
                  </span>
                )}
                {item.isClaudable && (
                  <span
                    className="inline-flex items-center text-indigo-500 dark:text-indigo-400"
                    aria-hidden="true"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </span>
                )}
                {item.isMercury && (
                  <span className="inline-flex items-center text-sky-500 dark:text-sky-400" aria-hidden="true">
                    <Cpu className="w-4 h-4" />
                  </span>
                )}
                {item.isMaus && (
                  <span className="inline-flex items-center text-cyan-500 dark:text-cyan-400" aria-hidden="true">
                    <Bot className="w-4 h-4" />
                  </span>
                )}
                {item.isStrata && (
                  <span className="inline-flex items-center text-emerald-500 dark:text-emerald-400" aria-hidden="true">
                    <Zap className="w-4 h-4" />
                  </span>
                )}
                <span>{lang === 'fa' ? item.labelFa : item.labelEn}</span>
              </button>
            );
          })}

          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-xl cursor-pointer"
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
            <span>{lang === 'fa' ? 'شروع مربی صوتی' : 'Start Voice Coach'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
