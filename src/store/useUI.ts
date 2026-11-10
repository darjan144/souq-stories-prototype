import { useEffect, useState } from 'react';
import { create } from 'zustand';

import { useAuth } from './useAuth';
import { useGame } from './useGame';

type Toast = { id: number; message: string; icon?: string };
type UIState = {
  toast?: Toast;
  /** True on desktop web when the owner's WhatsApp phone is shown next to the app. */
  ownerPanelVisible: boolean;
  showToast: (message: string, icon?: string) => void;
  hideToast: () => void;
  setOwnerPanelVisible: (v: boolean) => void;
};

export const useUI = create<UIState>()((set) => ({
  ownerPanelVisible: false,
  showToast: (message, icon) => set({ toast: { id: Date.now(), message, icon } }),
  hideToast: () => set({ toast: undefined }),
  setOwnerPanelVisible: (v) => set({ ownerPanelVisible: v }),
}));

/** True once both persisted stores have loaded from storage. */
export function useHydrated() {
  const check = () => useAuth.persist.hasHydrated() && useGame.persist.hasHydrated();
  const [ready, setReady] = useState(check);
  useEffect(() => {
    const unsubs = [useAuth.persist.onFinishHydration(() => setReady(check())), useGame.persist.onFinishHydration(() => setReady(check()))];
    setReady(check());
    return () => unsubs.forEach((u) => u());
  }, []);
  return ready;
}
