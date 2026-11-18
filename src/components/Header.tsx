import React, { useState } from 'react';
import { Menu, X, Mic, GraduationCap, Landmark } from 'lucide-react';
import { Lang, NavSection } from '../types/app';

interface HeaderProps {
  lang: Lang;
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onLaunchVoiceCoach: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  activeSection,
  onNavigate,
  onLaunchVoiceCoach,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: Array<{ id: NavSection; labelFa: string; labelEn: string; isCampus?: boolean }> = [
    { id: 'courses', labelFa: 'دروس و نقشه', labelEn: 'Courses' },
    { id: 'ai-lab', labelFa: 'آزمایشگاه AI', labelEn: 'AI Lab' },
    { id: 'articles', labelFa: 'مقالات علمی', labelEn: 'Articles' },
    { id: 'community', labelFa: 'چت و انجمن', labelEn: 'Chat' },
    { id: 'campus', labelFa: 'هم‌دانشگاهی', labelEn: 'Campus Voice', isCampus: true },
    { id: 'study-deck', labelFa: 'جعبه یادگیری', labelEn: 'Study Deck' },
    { id: 'study-rooms', labelFa: 'اتاق مطالعه', labelEn: 'Rooms' },
    { id: 'admin', labelFa: 'مدیریت', labelEn: 'Admin' },
  ];

  const handleNav = (id: NavSection) => {
    onNavigate(id);
    setMobileOpen(false);
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
                  <span className="inline-flex items-center gap-0.5 text-amber-500 dark:text-amber-400" aria-hidden="true">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <Landmark className="w-3.5 h-3.5" />
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

        {/* Zone 3: 1 primary action + mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onLaunchVoiceCoach}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs xl:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Mic className="w-4 h-4" />
            <span>{lang === 'fa' ? 'مربی صوتی زنده' : 'Voice Coach'}</span>
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
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-1">
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
                  <span className="inline-flex items-center gap-0.5 text-amber-500 dark:text-amber-400" aria-hidden="true">
                    <GraduationCap className="w-4 h-4" />
                    <Landmark className="w-4 h-4" />
                  </span>
                )}
                <span>{lang === 'fa' ? item.labelFa : item.labelEn}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onLaunchVoiceCoach();
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-xl cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>{lang === 'fa' ? 'شروع مربی صوتی' : 'Start Voice Coach'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
