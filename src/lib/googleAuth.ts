import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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

export function getGoogleAccessToken(): string | null {
  return cachedAccessToken;
}

export async function signOutGoogle(): Promise<void> {
  cachedAccessToken = null;
  try {
    await signOut(auth);
  } catch {
    // Ignore if user wasn't signed in via Firebase
  }
}
