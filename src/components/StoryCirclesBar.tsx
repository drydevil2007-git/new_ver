import React from 'react';
import { Play, Clapperboard } from 'lucide-react';
import { DANESH_REELS } from '../data/reelsAndCourseDetails';
import { Lang, ReelLesson } from '../types/app';

interface StoryCirclesBarProps {
  lang: Lang;
  onOpenReel: (reel: ReelLesson, index: number) => void;
  viewedIds?: string[];
}

export const StoryCirclesBar: React.FC<StoryCirclesBarProps> = ({
  lang,
  onOpenReel,
  viewedIds = [],
}) => {
  return (
    <section
      aria-label={lang === 'fa' ? 'استوری‌های دانشریلز' : 'DaneshReels Course Stories'}
      className="glass-surface rounded-3xl p-4 sm:p-5 space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Clapperboard className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'دانشریلز — ریزآموزش‌های ۳۰ ثانیه‌ای دروس' : 'DaneshReels — 30s Course Micro-Lessons'}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onOpenReel(DANESH_REELS[0], 0)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{lang === 'fa' ? 'پخش همه ریلزها' : 'Watch Feed'}</span>
        </button>
      </div>

      <div className="flex items-start gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-1 pt-1">
        {DANESH_REELS.map((reel, idx) => {
          const isViewed = viewedIds.includes(reel.id);
          return (
            <button
              key={reel.id}
              type="button"
              onClick={() => onOpenReel(reel, idx)}
              className="group flex flex-col items-center gap-2 shrink-0 w-[74px] sm:w-[82px] focus-visible:outline-2 focus-visible:outline-sky-500 rounded-2xl cursor-pointer"
            >
              <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] flex items-center justify-center">
                {/* Animated Instagram-style gradient ring */}
                <div
                  className={`absolute inset-0 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                    isViewed
                      ? 'bg-slate-300 dark:bg-slate-700'
                      : `bg-gradient-to-tr ${reel.ringGradient} story-ring-animate`
                  }`}
                />
                <div className="relative w-[58px] h-[58px] sm:w-[63px] sm:h-[63px] rounded-full p-[2.5px] bg-white dark:bg-slate-950 overflow-hidden">
                  <img loading="lazy" decoding="async"
                    src={reel.image}
                    alt={lang === 'fa' ? reel.storyTitleFa : reel.storyTitleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/5 transition-colors rounded-full" />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight line-clamp-1">
                {lang === 'fa' ? reel.storyTitleFa : reel.storyTitleEn}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
