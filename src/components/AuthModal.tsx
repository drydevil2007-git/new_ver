import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  LogIn,
  UserPlus,
  Building2,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Lang, UserRole, UserSession } from '../types/app';
import { signInWithGoogleAccount } from '../lib/googleAuth';

interface AuthModalProps {
  lang: Lang;
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: UserSession, isNewRegistration?: boolean) => void;
}

interface StoredRegisteredUser extends UserSession {
  password: string;
}

const REGISTERED_USERS_KEY = 'daneshyar_registered_users_v1';

// Alphanumeric CAPTCHA generator excluding visually ambiguous characters (0, O, 1, I)
function createRandomCaptcha(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Authorized system administrator accounts (recognized strictly upon standard email + password or verified Google sign-in)
const AUTHORIZED_ADMIN_EMAILS = [
  'hashssshdh@gmail.com',
  'drydevil2007@gmail.com',
  'admin@danshyar.ir',
  'admin@gmail.com',
];

export const DEMO_PROFESSOR_PROFILE: UserSession = {
  id: 'prof-demo',
  name: 'دکتر مریم شریعتی',
  email: 'm.shariati@sharif.edu',
  university: 'دانشگاه صنعتی شریف',
  field: 'هیئت علمی کنترل و رباتیک',
  role: 'professor',
  avatarInitials: 'م ش',
  joinedAt: '۱۴۰۳/۰۷/۱۴',
};

export const DEMO_STUDENT_PROFILE: UserSession = {
  id: 'student-demo',
  name: 'امیرحسین رضایی',
  email: 'a.rezaei@ut.ac.ir',
  university: 'دانشگاه تهران',
  field: 'کارشناسی ارشد مهندسی برق',
  role: 'student',
  avatarInitials: 'ا ر',
  joinedAt: '۱۴۰۴/۰۱/۲۰',
};

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'DY';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const AuthModal: React.FC<AuthModalProps> = ({
  lang,
  isOpen,
  initialTab = 'login',
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Sign-In fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regUniversity, setRegUniversity] = useState('');
  const [regField, setRegField] = useState('');
  const [regRole, setRegRole] = useState<Exclude<UserRole, 'admin'>>('student');

  // CAPTCHA verification state
  const [captchaCode, setCaptchaCode] = useState<string>(() => createRandomCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');

  // Background video state for registration
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const regenerateCaptcha = () => {
    setCaptchaCode(createRandomCaptcha());
    setCaptchaInput('');
  };

  useEffect(() => {
    if (tab === 'register' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [tab, isOpen]);

  const getStoredUsers = (): StoredRegisteredUser[] => {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const gUser = await signInWithGoogleAccount();
      const email = gUser.email.toLowerCase();
      const isAuthorizedAdmin = AUTHORIZED_ADMIN_EMAILS.includes(email);

      if (isAuthorizedAdmin) {
        const adminSession: UserSession = {
          id: `admin-${gUser.uid}`,
          name: gUser.name || (lang === 'fa' ? 'مدیر ارشد سیستم' : 'System Administrator'),
          email,
          university: lang === 'fa' ? 'دانشگاه صنعتی شریف' : 'Sharif University',
          field: lang === 'fa' ? 'مدیریت ارشد سیستم' : 'System Administration',
          role: 'admin',
          avatarInitials: computeInitials(gUser.name || 'مدیر ارشد'),
          joinedAt: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'),
          photoURL: gUser.photoURL,
        };
        onLoginSuccess(adminSession, false);
        onClose();
        return;
      }

      const existing = getStoredUsers().find((u) => u.email.toLowerCase() === email);
      const userSession: UserSession = {
        id: `google-${gUser.uid}`,
        name: gUser.name || email.split('@')[0],
        email,
        university: existing?.university || (lang === 'fa' ? 'دانشگاه سراسری' : 'University Campus'),
        field: existing?.field || (lang === 'fa' ? 'مهندسی' : 'Engineering'),
        role: existing && existing.role !== 'admin' ? existing.role : 'student',
        avatarInitials: computeInitials(gUser.name || email),
        joinedAt: existing?.joinedAt || new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'),
        photoURL: gUser.photoURL,
      };

      fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userSession.name,
          email: userSession.email,
          university: userSession.university,
          major: userSession.field,
          role: userSession.role === 'professor' ? 'Professor' : 'Student',
        }),
      }).catch(() => {});

      onLoginSuccess(userSession, false);
      onClose();
    } catch (err: any) {
      const code = String(err?.code || '');
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMsg(
          lang === 'fa'
            ? 'پنجره ورود با گوگل بسته شد. در صورت تمایل دوباره تلاش کنید.'
            : 'Google Sign-In popup was closed before finishing.'
        );
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg(
          lang === 'fa'
            ? 'مرورگر پنجره ورود گوگل را مسدود کرد؛ لطفاً مجوز Pop-up را فعال کنید.'
            : 'Browser blocked the sign-in popup. Please allow popups for this site.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setErrorMsg(
          lang === 'fa'
            ? 'دامنه سایت در Firebase مجاز نیست. لطفاً از danshyar-edu.web.app استفاده کنید یا با مدیر سایت تماس بگیرید.'
            : 'This domain is not authorized in Firebase. Please use danshyar-edu.web.app or contact admin.'
        );
      } else {
        setErrorMsg(
          lang === 'fa'
            ? `خطا در ورود با حساب گوگل: ${err?.message || 'لطفاً دوباره تلاش کنید.'}`
            : `Google Sign-In failed: ${err?.message || 'Please try again.'}`
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const email = loginEmail.trim().toLowerCase();
    const pass = loginPassword.trim();

    if (!email || !pass) {
      setErrorMsg(
        lang === 'fa'
          ? 'لطفاً ایمیل دانشگاهی و رمز عبور را وارد کنید.'
          : 'Please enter both email and password.'
      );
      return;
    }

    if (pass.length < 4) {
      setErrorMsg(
        lang === 'fa'
          ? 'رمز عبور باید حداقل ۴ کاراکتر باشد.'
          : 'Password must be at least 4 characters.'
      );
      return;
    }

    // Recognize authorized administrator only after standard email + password entry
    if (AUTHORIZED_ADMIN_EMAILS.includes(email)) {
      const storedAdmin = getStoredUsers().find((u) => u.email.toLowerCase() === email);
      if (storedAdmin && storedAdmin.password !== pass) {
        setErrorMsg(lang === 'fa' ? 'رمز عبور نادرست است.' : 'Incorrect password.');
        return;
      }
      const adminSession: UserSession = {
        id: 'admin-owner',
        name: storedAdmin?.name || (lang === 'fa' ? 'مدیر ارشد سیستم' : 'System Administrator'),
        email,
        university: storedAdmin?.university || (lang === 'fa' ? 'دانشگاه صنعتی شریف' : 'Sharif University'),
        field: storedAdmin?.field || (lang === 'fa' ? 'مدیریت سیستم' : 'System Administration'),
        role: 'admin',
        avatarInitials: 'م ا',
        joinedAt: storedAdmin?.joinedAt || '۱۴۰۳/۰۶/۰۱',
      };
      onLoginSuccess(adminSession, false);
      onClose();
      return;
    }

    const stored = getStoredUsers();
    const matched = stored.find((u) => u.email.toLowerCase() === email);
    if (matched) {
      if (matched.password !== pass) {
        setErrorMsg(lang === 'fa' ? 'رمز عبور نادرست است.' : 'Incorrect password.');
        return;
      }
      const { password: _pwd, ...session } = matched;
      onLoginSuccess({ ...session, role: session.role === 'admin' ? 'student' : session.role }, false);
      onClose();
      return;
    }

    const derivedName = email.split('@')[0].replace(/[._-]/g, ' ');
    const studentSession: UserSession = {
      id: `usr-${Date.now()}`,
      name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
      email,
      university: lang === 'fa' ? 'دانشگاه سراسری' : 'University Campus',
      field: lang === 'fa' ? 'مهندسی' : 'Engineering',
      role: 'student',
      avatarInitials: computeInitials(derivedName),
      joinedAt: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'),
    };
    onLoginSuccess(studentSession, false);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const name = regName.trim();
    const email = regEmail.trim().toLowerCase();
    const pass = regPassword.trim();

    if (!name || !email || pass.length < 4) {
      setErrorMsg(
        lang === 'fa'
          ? 'نام، ایمیل معتبر و رمز عبور حداقل ۴ کاراکتری الزامی است.'
          : 'Name, valid email, and a password (min 4 chars) are required.'
      );
      return;
    }

    // CAPTCHA verification check
    if (!captchaInput.trim() || captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMsg(
        lang === 'fa'
          ? 'کد امنیتی کپچا نادرست است؛ لطفاً کد جدید را وارد کنید.'
          : 'Security CAPTCHA is incorrect. Please try again with the new code.'
      );
      regenerateCaptcha();
      return;
    }

    // Standard registration strictly assigns student or professor role
    const session: UserSession = {
      id: `usr-${Date.now()}`,
      name,
      email,
      university: regUniversity.trim() || (lang === 'fa' ? 'دانشگاه صنعتی امیرکبیر' : 'Amirkabir University'),
      field: regField.trim() || (lang === 'fa' ? 'مهندسی برق / کامپیوتر' : 'Engineering'),
      role: regRole,
      avatarInitials: computeInitials(name),
      joinedAt: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'),
    };

    try {
      const existing = getStoredUsers().filter((u) => u.email.toLowerCase() !== email);
      localStorage.setItem(
        REGISTERED_USERS_KEY,
        JSON.stringify([{ ...session, password: pass }, ...existing])
      );
    } catch {
      // ignore storage quota
    }

    // Sync new user with backend directory asynchronously
    fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: session.name,
        email: session.email,
        university: session.university,
        major: session.field,
        role: session.role === 'professor' ? 'Professor' : 'Student',
      }),
    }).catch(() => {});

    onLoginSuccess(session, true);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          {/* Background Video during registration */}
          {tab === 'register' && (
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                className="w-full h-full object-cover opacity-60 scale-105 filter brightness-75 contrast-110 transition-opacity duration-700"
                src="/videos/auth_bg.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-900/80 backdrop-blur-[2px]" />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'fa' ? 'حساب کاربری دانشیار' : 'DaneshYar Authentication'}
            className="glass-surface bg-white/95 dark:bg-slate-900/95 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200/80 dark:border-slate-700/70"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'حساب کاربری دانشیار' : 'DaneshYar Account'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'fa'
                    ? 'با حساب گوگل یا ایمیل دانشگاهی وارد شوید تا پیشرفت دروس و یادداشت‌های شما ذخیره شود.'
                    : 'Sign in with Google or your university email to sync courses and notes.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {tab === 'register' && (
                  <button
                    type="button"
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    title={
                      isVideoMuted
                        ? lang === 'fa'
                          ? 'پخش صدای ویدیو'
                          : 'Unmute video audio'
                        : lang === 'fa'
                        ? 'قطع صدای ویدیو'
                        : 'Mute video audio'
                    }
                    aria-label={isVideoMuted ? 'Unmute video audio' : 'Mute video audio'}
                    className={`min-w-[40px] min-h-[40px] rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      !isVideoMuted
                        ? 'border-rose-500 bg-rose-500/10 text-rose-500 shadow-sm animate-pulse'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={lang === 'fa' ? 'بستن' : 'Close'}
                  className="min-w-[40px] min-h-[40px] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Continue with Google Button */}
            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center gap-3 text-sm font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
              ) : (
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
              )}
              <span>
                {googleLoading
                  ? lang === 'fa' ? 'در حال اتصال به گوگل...' : 'Connecting to Google...'
                  : lang === 'fa' ? 'ورود با حساب گوگل' : 'Continue with Google'}
              </span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-medium text-slate-400">
                {lang === 'fa' ? 'یا با ایمیل و رمز عبور' : 'or with email and password'}
              </span>
            </div>

            {/* Tabs: Sign In | Register */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  tab === 'login'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'fa' ? 'ورود' : 'Sign In'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  tab === 'register'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{lang === 'fa' ? 'ثبت‌نام' : 'Register'}</span>
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {lang === 'fa' ? 'ایمیل' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                    <input
                      type="email"
                      dir="ltr"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className="w-full ps-10 pe-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {lang === 'fa' ? 'رمز عبور' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                    <input
                      type="password"
                      dir="ltr"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full ps-10 pe-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm"
                >
                  {lang === 'fa' ? 'ورود به حساب کاربری' : 'Sign In to DaneshYar'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={lang === 'fa' ? 'مثال: نیما محمدی' : 'Nima Mohammadi'}
                        className="w-full ps-9 pe-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {lang === 'fa' ? 'نقش دانشگاهی' : 'Academic Role'}
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as Exclude<UserRole, 'admin'>)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="student">{lang === 'fa' ? '🎓 دانشجو' : '🎓 Student'}</option>
                      <option value="professor">{lang === 'fa' ? '👨‍🏫 استاد / هیئت علمی' : '👨‍🏫 Professor'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {lang === 'fa' ? 'ایمیل' : 'Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                      <input
                        type="email"
                        dir="ltr"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@university.edu"
                        className="w-full ps-9 pe-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {lang === 'fa' ? 'رمز عبور' : 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                      <input
                        type="password"
                        dir="ltr"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full ps-9 pe-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {lang === 'fa' ? 'دانشگاه' : 'University'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                      <input
                        type="text"
                        value={regUniversity}
                        onChange={(e) => setRegUniversity(e.target.value)}
                        placeholder={lang === 'fa' ? 'دانشگاه تهران / شریف' : 'University name'}
                        className="w-full ps-9 pe-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {lang === 'fa' ? 'رشته و گرایش' : 'Field of Study'}
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                      <input
                        type="text"
                        value={regField}
                        onChange={(e) => setRegField(e.target.value)}
                        placeholder={lang === 'fa' ? 'مهندسی برق / کامپیوتر' : 'Major / Field'}
                        className="w-full ps-9 pe-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* CAPTCHA Security Verification */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-sky-500" />
                      <span>{lang === 'fa' ? 'کد امنیتی کپچا' : 'Security CAPTCHA'}</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'fa' ? 'تأیید هویت ضد ربات' : 'Anti-bot verification'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                    {/* Visual Captcha Box with distortion and noise lines */}
                    <div className="relative overflow-hidden flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 dark:bg-slate-950 border border-slate-700 select-none shadow-inner">
                      <div className="absolute inset-0 pointer-events-none opacity-30">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <line x1="0" y1="10" x2="220" y2="38" stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1="0" y1="36" x2="220" y2="12" stroke="#f43f5e" strokeWidth="1.5" />
                          <line x1="15" y1="42" x2="190" y2="6" stroke="#a855f7" strokeWidth="1" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-lg font-black tracking-widest text-white drop-shadow-md z-10" dir="ltr">
                        {captchaCode.split('').map((char, idx) => (
                          <span
                            key={idx}
                            style={{
                              transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * ((idx + 2) * 3)}deg) translateY(${idx % 2 === 0 ? '-1px' : '2px'})`,
                              display: 'inline-block',
                            }}
                            className={
                              idx % 3 === 0
                                ? 'text-sky-400'
                                : idx % 3 === 1
                                ? 'text-emerald-400'
                                : 'text-amber-300'
                            }
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={regenerateCaptcha}
                        title={lang === 'fa' ? 'تغییر کد کپچا' : 'Refresh captcha code'}
                        className="z-10 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* User Captcha Input */}
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        required
                        maxLength={8}
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                        placeholder={lang === 'fa' ? 'کد بالا را وارد کنید' : 'Enter captcha'}
                        className="w-full px-3.5 py-2.5 text-sm font-mono tracking-widest uppercase rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:normal-case placeholder:font-sans placeholder:tracking-normal"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm"
                >
                  {lang === 'fa' ? 'ایجاد حساب و ورود' : 'Create Account & Continue'}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {lang === 'fa'
                    ? 'نشست شما به‌صورت امن با احراز هویت گوگل یا حساب محلی ذخیره می‌شود.'
                    : 'Your session is securely persisted with Google Auth or local account storage.'}
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
