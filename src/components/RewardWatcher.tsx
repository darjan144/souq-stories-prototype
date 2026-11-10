import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useGame } from '@/store/useGame';

/**
 * Purchases and pickups are confirmed by the owner (WhatsApp mock or demo button),
 * not by a screen the customer is on. When that happens, open the reward screen.
 */
export function RewardWatcher() {
  const router = useRouter();
  useEffect(
    () =>
      useGame.subscribe((s, prev) => {
        const r = s.lastReward;
        if (r && r.id !== prev.lastReward?.id && (r.kind === 'purchase' || r.kind === 'collect')) {
          router.push('/reward');
        }
      }),
    [],
  );
  return null;
}
