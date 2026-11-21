import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Upload,
  Trash2,
  User,
  Building2,
  GraduationCap,
  Mail,
  Check,
  Sparkles,
  Link as LinkIcon,
  Crown,
  ShieldCheck,
} from 'lucide-react';
import { Lang, UserSession } from '../types/app';

interface ProfileModalProps {
  lang: Lang;
  isOpen: boolean;
  user: UserSession | null;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserSession) => void;
}

// Academic 3D Avatar Presets (DiceBear Notionists / Avatars with academic seeds)
const AVATAR_PRESETS = [
  { id: 'p1', nameFa: 'مهندس کامپیوتر', nameEn: 'Software Engineer', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=DaneshYarDev&backgroundColor=b6e3f4' },
  { id: 'p2', nameFa: 'پژوهشگر فیزیک', nameEn: 'Physics Researcher', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumLab&backgroundColor=c0aede' },
  { id: 'p3', nameFa: 'مهندس برق', nameEn: 'Electrical Engineer', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CircuitHero&backgroundColor=ffd5dc' },
  { id: 'p4', nameFa: 'دانشمند داده', nameEn: 'Data Scientist', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlgorithmicAI&backgroundColor=d1d4f9' },
  { id: 'p5', nameFa: 'دانشجوی پزشکی', nameEn: 'Medical Scholar', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=BioGenetics&backgroundColor=b6e3f4' },
  { id: 'p6', nameFa: 'مهندس هوافضا', nameEn: 'Aerospace Pioneer', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CosmicVoyager&backgroundColor=ffdfbf' },
  { id: 'p7', nameFa: 'آواتار مینیمال ۱', nameEn: 'Minimalist Student A', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=SinaRad&backgroundColor=b6e3f4' },
  { id: 'p8', nameFa: 'آواتار مینیمال ۲', nameEn: 'Minimalist Student B', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=SaraTehrani&backgroundColor=ffd5dc' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  lang,
  isOpen,
  user,
  onClose,
  onUpdateUser,
}) => {
  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [field, setField] = useState(user?.field || '');
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL || null);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [activeTab, setActiveTab] = useState<'avatar' | 'info'>('avatar');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !user) return null;

  // Handle local image file upload + client-side compression via HTML5 Canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check mime type
    if (!file.type.startsWith('image/')) {
      alert(lang === 'fa' ? 'لطفاً یک فایل تصویری معتبر انتخاب کنید.' : 'Please select a valid image file.');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 256x256 square crop for ultra-fast load and lightweight local storage
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
          // Compress to WebP or JPEG at 0.85 quality (~20KB-40KB)
          const dataUrl = canvas.toDataURL('image/webp', 0.85);
          setPhotoURL(dataUrl);
        }
        setIsCompressing(false);
      };
      img.onerror = () => setIsCompressing(false);
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => setIsCompressing(false);
    reader.readAsDataURL(file);

    // Reset input value so same file can be re-uploaded if desired
    e.target.value = '';
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setPhotoURL(customUrl.trim());
      setCustomUrl('');
      setShowUrlInput(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoURL(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || user.name;
    const parts = cleanName.split(' ').filter(Boolean);
    const avatarInitials = parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : cleanName.slice(0, 2).toUpperCase();

    const updated: UserSession = {
      ...user,
      name: cleanName,
      university: university.trim() || user.university,
      field: field.trim() || user.field,
      photoURL: photoURL || null,
      avatarInitials,
    };

    onUpdateUser(updated);
    onClose();
  };

  const roleLabel = (role: UserSession['role']) => {
    if (role === 'admin') return lang === 'fa' ? '👑 مدیر ارشد سامانه' : '👑 Super Admin';
    if (role === 'professor') return lang === 'fa' ? 'استاد دانشگاه' : 'Professor';
    return lang === 'fa' ? 'دانشجو' : 'Student';
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={lang === 'fa' ? 'پروفایل و تصویر کاربری' : 'User Profile & Avatar'}
        className="glass-surface bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-white/60 dark:border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'مدیریت پروفایل کاربری' : 'Profile & Avatar Settings'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'fa' ? 'ویرایش تصویر، مشخصات دانشگاهی و نقش' : 'Customize your avatar and academic info'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'avatar'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{lang === 'fa' ? 'تصویر و آواتار' : 'Avatar & Photo'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'info'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{lang === 'fa' ? 'مشخصات دانشگاهی' : 'Academic Info'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* TAB 1: AVATAR CUSTOMIZATION */}
          {activeTab === 'avatar' && (
            <div className="space-y-4">
              {/* Central Avatar Preview with Action Triggers */}
              <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl glass-subtle space-y-3">
                <div className="relative group">
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center text-2xl font-extrabold text-white shadow-xl ring-4 ring-white/80 dark:ring-slate-800 transition-transform group-hover:scale-105 ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600'
                        : user.role === 'professor'
                        ? 'bg-gradient-to-tr from-indigo-600 to-sky-600'
                        : 'bg-gradient-to-tr from-sky-600 to-teal-500'
                    }`}
                  >
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt={name || user.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.avatarInitials}</span>
                    )}
                  </div>

                  {/* Hidden Native File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Camera overlay badge */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title={lang === 'fa' ? 'آپلود عکس از دستگاه' : 'Upload photo from device'}
                    className="absolute bottom-0 end-0 p-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white shadow-lg ring-2 ring-white dark:ring-slate-900 transition-all cursor-pointer hover:scale-110"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {name || user.name}
                  </div>
                  <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                    {roleLabel(user.role)}
                  </div>
                </div>

                {/* Photo Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isCompressing ? (lang === 'fa' ? 'در حال بهینه‌سازی...' : 'Compressing...') : (lang === 'fa' ? 'آپلود تصویر' : 'Upload Photo')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'لینک مستقیم' : 'Paste URL'}</span>
                  </button>

                  {photoURL && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'fa' ? 'حذف تصویر' : 'Remove'}</span>
                    </button>
                  )}
                </div>

                {/* Direct URL input accordion */}
                {showUrlInput && (
                  <div className="w-full pt-2 flex items-center gap-2">
                    <input
                      type="url"
                      dir="ltr"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold cursor-pointer hover:bg-sky-700"
                    >
                      {lang === 'fa' ? 'اعمال' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Preset Avatars Library */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>{lang === 'fa' ? 'آواتارهای آماده دانشگاهی' : 'Academic Avatar Presets'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{AVATAR_PRESETS.length} گزینه</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = photoURL === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setPhotoURL(preset.url)}
                        title={lang === 'fa' ? preset.nameFa : preset.nameEn}
                        className={`relative rounded-2xl p-1 transition-all cursor-pointer group ${
                          isSelected
                            ? 'ring-2 ring-sky-500 scale-105 shadow-md bg-sky-50 dark:bg-sky-950/60'
                            : 'hover:scale-105 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={preset.url}
                            alt={preset.nameEn}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC INFO EDIT */}
          {activeTab === 'info' && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'fa' ? 'علی رضایی' : 'Ali Rezaei'}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{lang === 'fa' ? 'دانشگاه محل تحصیل / تدریس' : 'University'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder={lang === 'fa' ? 'دانشگاه صنعتی شریف' : 'Sharif University of Technology'}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{lang === 'fa' ? 'رشته و گرایش تخصصی' : 'Major / Specialization'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder={lang === 'fa' ? 'مهندسی برق — سیستم‌های قدرت' : 'Electrical Engineering — Power'}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'fa' ? 'ایمیل حساب کاربری (ثابت)' : 'Account Email'}</span>
                </label>
                <input
                  type="email"
                  dir="ltr"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{lang === 'fa' ? 'نقش امنیتی سامانه' : 'Role'}</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{roleLabel(user.role)}</span>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {lang === 'fa' ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer hover:scale-102"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'fa' ? 'ذخیره تغییرات پروفایل' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
