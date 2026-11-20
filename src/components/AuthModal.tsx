import React, { useState } from 'react';
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
} from 'lucide-react';
import { Lang, UserRole, UserSession } from '../types/app';
import {
  getFirebaseIdToken,
  getVerifiedAccountRole,
  registerWithEmail,
  requestPasswordReset,
  signInWithEmail,
  signInWithGoogleAccount,
} from '../lib/googleAuth';

interface AuthModalProps {
  lang: Lang;
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: UserSession, isNewRegistration?: boolean) => void;
}

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

  React.useEffect(() => {
    try {
      localStorage.removeItem('daneshyar_registered_users_v1');
    } catch {
      // Ignore unavailable browser storage.
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setErrorMsg(null);
    }
  }, [initialTab, isOpen]);

  const finishFirebaseLogin = async (
    account: { uid: string; name: string; email: string; photoURL?: string | null },
    preferredRole: Exclude<UserRole, 'admin'> = 'student',
    isNewRegistration = false,
    profile?: { university?: string; field?: string }
  ) => {
    const email = account.email.trim().toLowerCase();
    const role = await getVerifiedAccountRole();
    const storedProfile = (() => {
      try {
        return JSON.parse(localStorage.getItem(`daneshyar_profile_${account.uid}`) || '{}') as Partial<UserSession>;
      } catch {
        return {};
      }
    })();
    const name = account.name.trim() || storedProfile.name || email.split('@')[0];
    const session: UserSession = {
      id: account.uid,
      name,
      email,
      university: profile?.university || storedProfile.university || (lang === 'fa' ? 'دانشگاه سراسری' : 'University Campus'),
      field: profile?.field || storedProfile.field || (lang === 'fa' ? 'مهندسی' : 'Engineering'),
      role: role === 'admin' ? 'admin' : (storedProfile.role === 'professor' ? 'professor' : preferredRole),
      avatarInitials: computeInitials(name),
      joinedAt: storedProfile.joinedAt || new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'),
      photoURL: account.photoURL,
    };

    try {
      localStorage.setItem(`daneshyar_profile_${account.uid}`, JSON.stringify(session));
    } catch {
      // The Firebase account remains usable without local profile caching.
    }

    const token = await getFirebaseIdToken();
    let profileSyncFailed = !token;
    if (token) {
      try {
        const response = await fetch('/api/account/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: session.name,
            university: session.university,
            major: session.field,
            role: session.role === 'professor' ? 'Professor' : 'Student',
          }),
        });
        profileSyncFailed = !response.ok;
      } catch {
        profileSyncFailed = true;
      }
    }

    onLoginSuccess(session, isNewRegistration);
    if (profileSyncFailed) {
      setErrorMsg(
        lang === 'fa'
          ? 'ورود انجام شد، اما همگام‌سازی پروفایل با سرور ناموفق بود. اتصال سرور را بررسی و دوباره وارد شوید.'
          : 'You are signed in, but your profile could not sync with the server. Check the server connection and sign in again.'
      );
    } else {
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const gUser = await signInWithGoogleAccount();
      await finishFirebaseLogin(gUser);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const code = String((err as { code?: string })?.code || '');
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
              ? 'دامنه این سایت در تنظیمات Firebase مجاز نیست.'
              : 'This site domain is not authorized in Firebase.'
        );
      } else {
        setErrorMsg(
          lang === 'fa'
            ? `خطا در ورود با حساب گوگل: ${error.message || 'لطفاً دوباره تلاش کنید.'}`
            : `Google Sign-In failed: ${error.message || 'Please try again.'}`
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const email = loginEmail.trim().toLowerCase();
    const pass = loginPassword;

    if (!email || !pass) {
      setErrorMsg(
        lang === 'fa'
          ? 'لطفاً ایمیل و رمز عبور را وارد کنید.'
          : 'Please enter both email and password.'
      );
      return;
    }

    try {
      setGoogleLoading(true);
      const account = await signInWithEmail(email, pass);
      await finishFirebaseLogin({
        uid: account.uid,
        name: account.displayName || email.split('@')[0],
        email: account.email || email,
        photoURL: account.photoURL,
      });
    } catch (err) {
      const code = String((err as { code?: string })?.code || '');
      const message =
        code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
          ? (lang === 'fa' ? 'ایمیل یا رمز عبور نادرست است.' : 'Email or password is incorrect.')
          : code === 'auth/operation-not-allowed'
          ? (lang === 'fa' ? 'ورود با ایمیل و رمز در Firebase فعال نیست.' : 'Email/password sign-in is disabled in Firebase.')
          : code === 'auth/too-many-requests'
          ? (lang === 'fa' ? 'تلاش‌های زیادی انجام شده؛ کمی بعد دوباره امتحان کنید.' : 'Too many attempts. Try again later.')
          : lang === 'fa'
          ? `ورود انجام نشد: ${err instanceof Error ? err.message : 'لطفاً دوباره تلاش کنید.'}`
          : `Sign-in failed: ${err instanceof Error ? err.message : 'Please try again.'}`;
      setErrorMsg(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg(lang === 'fa' ? 'ابتدا ایمیل خود را وارد کنید.' : 'Enter your email address first.');
      return;
    }
    try {
      await requestPasswordReset(email);
      setErrorMsg(lang === 'fa' ? 'لینک بازنشانی رمز عبور برای ایمیل شما ارسال شد.' : 'Password reset link sent to your email.');
    } catch (err) {
      setErrorMsg(
        lang === 'fa'
          ? `ارسال لینک بازنشانی ناموفق بود: ${err instanceof Error ? err.message : 'دوباره تلاش کنید.'}`
          : `Could not send reset link: ${err instanceof Error ? err.message : 'Please try again.'}`
      );
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const name = regName.trim();
    const email = regEmail.trim().toLowerCase();
    const pass = regPassword;

    if (!name || !email || pass.length < 6) {
      setErrorMsg(
        lang === 'fa'
          ? 'نام، ایمیل معتبر و رمز عبور حداقل ۶ کاراکتری الزامی است.'
          : 'Name, valid email, and a password (min 6 characters) are required.'
      );
      return;
    }

    try {
      setGoogleLoading(true);
      const account = await registerWithEmail(name, email, pass);
      await finishFirebaseLogin(
        {
          uid: account.uid,
          name: account.displayName || name,
          email: account.email || email,
          photoURL: account.photoURL,
        },
        regRole,
        true,
        {
          university: regUniversity.trim() || (lang === 'fa' ? 'دانشگاه صنعتی امیرکبیر' : 'Amirkabir University'),
          field: regField.trim() || (lang === 'fa' ? 'مهندسی برق / کامپیوتر' : 'Engineering'),
        }
      );
    } catch (err) {
      const code = String((err as { code?: string })?.code || '');
      setErrorMsg(
        code === 'auth/email-already-in-use'
          ? lang === 'fa' ? 'این ایمیل قبلاً ثبت شده است؛ وارد حساب شوید.' : 'This email is already registered. Sign in instead.'
          : code === 'auth/operation-not-allowed'
          ? lang === 'fa' ? 'ثبت‌نام با ایمیل در Firebase فعال نیست.' : 'Email/password sign-up is disabled in Firebase.'
          : code === 'auth/weak-password'
          ? lang === 'fa' ? 'رمز عبور ضعیف است؛ حداقل ۶ نویسه انتخاب کنید.' : 'Password is too weak; use at least 6 characters.'
          : lang === 'fa'
          ? `ثبت‌نام انجام نشد: ${err instanceof Error ? err.message : 'لطفاً دوباره تلاش کنید.'}`
          : `Registration failed: ${err instanceof Error ? err.message : 'Please try again.'}`
      );
    } finally {
      setGoogleLoading(false);
    }
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
              <button
                type="button"
                onClick={onClose}
                aria-label={lang === 'fa' ? 'بستن' : 'Close'}
                className="min-w-[40px] min-h-[40px] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
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
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  {lang === 'fa' ? 'رمز عبور را فراموش کرده‌اید؟' : 'Forgot password?'}
                </button>

                <button
                  type="submit"
                  disabled={googleLoading}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-60"
                >
                  {googleLoading
                    ? lang === 'fa' ? 'در حال ورود...' : 'Signing in...'
                    : lang === 'fa' ? 'ورود به حساب کاربری' : 'Sign In to DaneshYar'}
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
                        minLength={6}
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

                <button
                  type="submit"
                  disabled={googleLoading}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-60"
                >
                  {googleLoading
                    ? lang === 'fa' ? 'در حال ایجاد حساب...' : 'Creating account...'
                    : lang === 'fa' ? 'ایجاد حساب و ورود' : 'Create Account & Continue'}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {lang === 'fa'
                    ? 'ورود با Firebase امن انجام می‌شود؛ رمز عبور روی این دستگاه ذخیره نمی‌شود.'
                    : 'Sign-in is secured by Firebase; your password is never stored on this device.'}
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
