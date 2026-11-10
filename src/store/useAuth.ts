import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Mocked auth: no server. Any 4-digit code verifies.
export type Account = { name: string; phone: string; household?: string };
type Pending = { mode: 'register' | 'login'; name?: string; phone: string; household?: string };

type AuthState = {
  account?: Account;
  loggedIn: boolean;
  pending?: Pending;
  startRegister: (a: Account) => void;
  startLogin: (phone: string) => void;
  verifyOtp: (code: string) => boolean;
  signOut: () => void;
  forget: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      loggedIn: false,
      startRegister: (a) => set({ pending: { mode: 'register', ...a } }),
      startLogin: (phone) => set({ pending: { mode: 'login', phone } }),
      verifyOtp: (code) => {
        const p = get().pending;
        if (!p || !/^\d{4}$/.test(code)) return false;
        if (p.mode === 'register') {
          set({ account: { name: p.name || 'Souq friend', phone: p.phone, household: p.household || undefined }, loggedIn: true, pending: undefined });
        } else {
          const existing = get().account;
          const account = existing && existing.phone === p.phone ? existing : { name: 'Souq friend', phone: p.phone };
          set({ account, loggedIn: true, pending: undefined });
        }
        return true;
      },
      signOut: () => set({ loggedIn: false }),
      forget: () => set({ loggedIn: false, account: undefined, pending: undefined }),
    }),
    { name: 'souq-auth', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
