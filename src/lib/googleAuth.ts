import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.setCustomParameters({ prompt: 'select_account' });

// Store OAuth access token strictly in memory (never localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

onAuthStateChanged(auth, (user: User | null) => {
  if (!user) {
    cachedAccessToken = null;
  }
});

export interface GoogleAuthResult {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
}

export async function signInWithGoogleAccount(): Promise<GoogleAuthResult> {
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (credential?.accessToken) {
    cachedAccessToken = credential.accessToken;
  }
  const user = result.user;
  const email = (user.email || '').trim().toLowerCase();
  if (!email) {
    throw new Error('حساب گوگل فاقد آدرس ایمیل معتبر است.');
  }
  return {
    uid: user.uid,
    name: user.displayName || email.split('@')[0],
    email,
    photoURL: user.photoURL,
  };
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  return result.user;
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  await updateProfile(result.user, { displayName: name.trim() });
  return result.user;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

export function getGoogleAccessToken(): string | null {
  return cachedAccessToken;
}

export async function getFirebaseIdToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch {
    return null;
  }
}

export async function getVerifiedAccountRole(): Promise<'student' | 'admin'> {
  const token = await getFirebaseIdToken();
  if (!token) return 'student';
  let response: Response;
  try {
    response = await fetch('/api/auth/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return 'student';
  }
  if (response.status === 404) return 'student';
  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || 'Unable to verify your account.');
  }
  const data = await response.json() as { role?: string };
  return data.role === 'admin' ? 'admin' : 'student';
}

export async function signOutGoogle(): Promise<void> {
  cachedAccessToken = null;
  try {
    await signOut(auth);
  } catch {
    // Ignore if user wasn't signed in via Firebase
  }
}
