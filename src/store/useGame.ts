import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { badges, challenges, getCouponTemplate, getPick } from '@/data/content';
import {
  badgeEarned,
  challengeProgress,
  DAY,
  makeCode,
  POINTS,
  POINTS_PER_VOUCHER,
  sameDay,
  type CheckIn,
  type OwnedCoupon,
  type Reservation,
  type Snapshot,
} from '@/game/rules';
import { useAuth } from './useAuth';

export type RewardSummary = {
  kind: 'checkin' | 'collect';
  shopId?: string;
  points: number;
  alreadyDone?: boolean;
  kgSaved?: number;
  badges: string[];
  challenges: string[];
  coupons: string[]; // owned coupon ids
  progress: { challengeId: string; value: number; target: number }[];
};

type GameData = {
  points: number; // spendable
  xp: number; // lifetime, drives level
  checkIns: CheckIn[];
  storyCards: string[];
  reservations: Reservation[];
  coupons: OwnedCoupon[];
  badges: string[];
  completedChallenges: string[];
  lastReward?: RewardSummary;
};

type GameActions = {
  checkIn: (shopId: string) => RewardSummary;
  collectStory: (shopId: string) => boolean;
  reservePick: (pickId: string) => Reservation;
  collectPick: (reservationId: string) => RewardSummary | undefined;
  redeemCoupon: (couponId: string) => void;
  convertPoints: () => OwnedCoupon | undefined;
  demoSouqWeekAlmost: () => void;
  demoAddPoints: (n: number) => void;
  reset: () => void;
};

const initial: GameData = {
  points: 0,
  xp: 0,
  checkIns: [],
  storyCards: [],
  reservations: [],
  coupons: [],
  badges: [],
  completedChallenges: [],
  lastReward: undefined,
};

const uid = () => Math.random().toString(36).slice(2, 10);

const snapshotOf = (d: Pick<GameData, 'checkIns' | 'reservations' | 'storyCards'>): Snapshot => ({
  checkIns: d.checkIns,
  reservations: d.reservations,
  storyCards: d.storyCards,
  household: useAuth.getState().account?.household,
});

/** Applies challenge completions and badge unlocks after a verified action. */
function settle(state: GameData, next: Partial<GameData>, base: Omit<RewardSummary, 'badges' | 'challenges' | 'coupons' | 'progress'>) {
  const merged: GameData = { ...state, ...next };
  const snap = snapshotOf(merged);
  let points = merged.points + base.points;
  let xp = merged.xp + base.points;
  const newChallenges: string[] = [];
  const newCoupons: OwnedCoupon[] = [];
  const progress: RewardSummary['progress'] = [];

  for (const ch of challenges) {
    if (ch.kind === 'comingSoon' || merged.completedChallenges.includes(ch.id)) continue;
    const value = challengeProgress(ch, snap);
    progress.push({ challengeId: ch.id, value, target: ch.target });
    if (value >= ch.target) {
      newChallenges.push(ch.id);
      points += ch.rewardPoints;
      xp += ch.rewardPoints;
      if (ch.rewardCouponId && getCouponTemplate(ch.rewardCouponId)) {
        newCoupons.push({ id: uid(), templateId: ch.rewardCouponId, code: makeCode('SQ'), status: 'active', earnedAt: Date.now() });
      }
    }
  }
  const newBadges = badges.filter((b) => !merged.badges.includes(b.id) && badgeEarned(b, snap)).map((b) => b.id);

  const reward: RewardSummary = {
    ...base,
    points: points - merged.points,
    badges: newBadges,
    challenges: newChallenges,
    coupons: newCoupons.map((c) => c.id),
    progress,
  };
  return {
    ...next,
    points,
    xp,
    badges: [...merged.badges, ...newBadges],
    completedChallenges: [...merged.completedChallenges, ...newChallenges],
    coupons: [...newCoupons, ...merged.coupons],
    lastReward: reward,
  } satisfies Partial<GameData>;
}

export const useGame = create<GameData & GameActions>()(
  persist(
    (set, get) => ({
      ...initial,

      checkIn: (shopId) => {
        const s = get();
        const now = Date.now();
        if (s.checkIns.some((c) => c.shopId === shopId && sameDay(c.at, now))) {
          const reward: RewardSummary = { kind: 'checkin', shopId, points: 0, alreadyDone: true, badges: [], challenges: [], coupons: [], progress: [] };
          set({ lastReward: reward });
          return reward;
        }
        set(settle(s, { checkIns: [...s.checkIns, { shopId, at: now }] }, { kind: 'checkin', shopId, points: POINTS.checkIn }));
        return get().lastReward!;
      },

      collectStory: (shopId) => {
        if (get().storyCards.includes(shopId)) return false;
        set({ storyCards: [...get().storyCards, shopId] });
        return true;
      },

      reservePick: (pickId) => {
        const existing = get().reservations.find((r) => r.pickId === pickId && r.status === 'reserved');
        if (existing) return existing;
        const r: Reservation = { id: uid(), pickId, code: makeCode('PK'), status: 'reserved', reservedAt: Date.now() };
        set({ reservations: [r, ...get().reservations] });
        return r;
      },

      collectPick: (reservationId) => {
        const s = get();
        const r = s.reservations.find((x) => x.id === reservationId);
        if (!r || r.status === 'collected') return undefined;
        const pick = getPick(r.pickId);
        const reservations = s.reservations.map((x) => (x.id === reservationId ? { ...x, status: 'collected' as const, collectedAt: Date.now() } : x));
        set(settle(s, { reservations }, { kind: 'collect', shopId: pick?.shopId, points: POINTS.collectPick, kgSaved: pick?.kg }));
        return get().lastReward;
      },

      redeemCoupon: (couponId) =>
        set({ coupons: get().coupons.map((c) => (c.id === couponId ? { ...c, status: 'redeemed' as const, redeemedAt: Date.now() } : c)) }),

      convertPoints: () => {
        const s = get();
        if (s.points < POINTS_PER_VOUCHER) return undefined;
        const c: OwnedCoupon = { id: uid(), templateId: 'points-aed5', code: makeCode('SQ'), status: 'active', earnedAt: Date.now() };
        set({ points: s.points - POINTS_PER_VOUCHER, coupons: [c, ...s.coupons] });
        return c;
      },

      // Demo helper: two check-ins yesterday at shops not yet visited this week,
      // so the next real scan completes Souq Week on stage.
      demoSouqWeekAlmost: () => {
        const s = get();
        const yesterday = Date.now() - DAY;
        const recent = new Set(s.checkIns.filter((c) => c.at > Date.now() - 7 * DAY).map((c) => c.shopId));
        // Shops without their own badge, so staging doesn't hand out badges.
        const candidates = ['bakery', 'grocery', 'dairy', 'honey'].filter((id) => !recent.has(id));
        const need = Math.max(0, 2 - recent.size);
        const added = candidates.slice(0, need).map((shopId, i) => ({ shopId, at: yesterday - i * 3600000 }));
        set({ checkIns: [...s.checkIns, ...added], points: s.points + added.length * POINTS.checkIn, xp: s.xp + added.length * POINTS.checkIn });
      },

      demoAddPoints: (n) => set({ points: get().points + n, xp: get().xp + n }),

      reset: () => set({ ...initial }),
    }),
    {
      name: 'souq-game',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => {
        const { checkIn, collectStory, reservePick, collectPick, redeemCoupon, convertPoints, demoSouqWeekAlmost, demoAddPoints, reset, ...data } = s;
        return data;
      },
    },
  ),
);
