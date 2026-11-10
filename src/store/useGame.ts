import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { badges, challenges, getCouponTemplate, getPick } from '@/data/content';
import type { PriceBand } from '@/data/types';
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
  type Sale,
  type Snapshot,
} from '@/game/rules';
import { useAuth } from './useAuth';

export type RewardSummary = {
  id: string;
  kind: 'visit' | 'purchase' | 'collect';
  shopId?: string;
  points: number;
  alreadyDone?: boolean;
  kgSaved?: number;
  newShop?: boolean;
  badges: string[];
  challenges: string[];
  coupons: string[]; // owned coupon ids
  progress: { challengeId: string; value: number; target: number }[];
};

/** Things the owner does in the WhatsApp mock that aren't customer actions. */
export type OwnerEvent = { id: string; shopId: string; at: number; type: 'pickPosted' | 'summary'; text: string };

type GameData = {
  points: number; // spendable
  xp: number; // lifetime, drives level
  checkIns: CheckIn[];
  storyCards: string[];
  reservations: Reservation[];
  sales: Sale[];
  coupons: OwnedCoupon[];
  badges: string[];
  completedChallenges: string[];
  ownerEvents: OwnerEvent[];
  lastReward?: RewardSummary;
};

type GameActions = {
  visit: (shopId: string) => RewardSummary;
  startPurchase: (shopId: string, firstTime: boolean, couponId?: string) => Sale;
  confirmSale: (saleId: string, band?: PriceBand) => void;
  collectStory: (shopId: string) => boolean;
  reservePick: (pickId: string) => Reservation;
  collectPick: (reservationId: string) => void;
  convertPoints: () => OwnedCoupon | undefined;
  addOwnerEvent: (e: Omit<OwnerEvent, 'id' | 'at'>) => void;
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
  sales: [],
  coupons: [],
  badges: [],
  completedChallenges: [],
  ownerEvents: [],
  lastReward: undefined,
};

const uid = () => Math.random().toString(36).slice(2, 10);

const snapshotOf = (d: GameData): Snapshot => ({
  checkIns: d.checkIns,
  reservations: d.reservations,
  storyCards: d.storyCards,
  sales: d.sales,
  household: useAuth.getState().account?.household,
});

type BaseReward = Omit<RewardSummary, 'id' | 'badges' | 'challenges' | 'coupons' | 'progress'>;

/** After a verified action: award points, complete challenges (coupons only from purchase challenges), unlock badges. */
function settle(state: GameData, next: Partial<GameData>, base: BaseReward): Partial<GameData> {
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
      if (ch.rewardCouponId && ch.kind !== 'distinctShopVisits' && getCouponTemplate(ch.rewardCouponId)) {
        newCoupons.push({ id: uid(), templateId: ch.rewardCouponId, code: makeCode('SQ'), status: 'active', earnedAt: Date.now() });
      }
    }
  }
  const newBadges = badges.filter((b) => !merged.badges.includes(b.id) && badgeEarned(b, snap)).map((b) => b.id);

  return {
    ...next,
    points,
    xp,
    badges: [...merged.badges, ...newBadges],
    completedChallenges: [...merged.completedChallenges, ...newChallenges],
    coupons: [...newCoupons, ...(next.coupons ?? merged.coupons)],
    lastReward: {
      ...base,
      id: uid(),
      points: points - merged.points,
      badges: newBadges,
      challenges: newChallenges,
      coupons: newCoupons.map((c) => c.id),
      progress,
    },
  };
}

export const useGame = create<GameData & GameActions>()(
  persist(
    (set, get) => ({
      ...initial,

      visit: (shopId) => {
        const s = get();
        const now = Date.now();
        if (s.checkIns.some((c) => c.shopId === shopId && sameDay(c.at, now))) {
          const reward: RewardSummary = { id: uid(), kind: 'visit', shopId, points: 0, alreadyDone: true, badges: [], challenges: [], coupons: [], progress: [] };
          set({ lastReward: reward });
          return reward;
        }
        set(settle(s, { checkIns: [...s.checkIns, { shopId, at: now }] }, { kind: 'visit', shopId, points: POINTS.visit }));
        return get().lastReward!;
      },

      startPurchase: (shopId, firstTime, couponId) => {
        const s = get();
        const sale: Sale = { id: uid(), shopId, at: Date.now(), status: 'pending', firstTime, couponId };
        set({
          sales: [sale, ...s.sales],
          coupons: couponId ? s.coupons.map((c) => (c.id === couponId ? { ...c, status: 'pending' as const } : c)) : s.coupons,
        });
        return sale;
      },

      confirmSale: (saleId, band) => {
        const s = get();
        const sale = s.sales.find((x) => x.id === saleId);
        if (!sale || sale.status === 'confirmed') return;
        const newShop = sale.firstTime && !s.sales.some((x) => x.id !== saleId && x.shopId === sale.shopId && x.status === 'confirmed');
        const sales = s.sales.map((x) => (x.id === saleId ? { ...x, status: 'confirmed' as const, band, confirmedAt: Date.now() } : x));
        const coupons = sale.couponId ? s.coupons.map((c) => (c.id === sale.couponId ? { ...c, status: 'redeemed' as const, redeemedAt: Date.now() } : c)) : s.coupons;
        set(settle(s, { sales, coupons }, { kind: 'purchase', shopId: sale.shopId, points: POINTS.purchase + (newShop ? POINTS.newShopBonus : 0), newShop }));
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

      // Marked collected by the owner (WhatsApp mock, or the demo button on phones).
      collectPick: (reservationId) => {
        const s = get();
        const r = s.reservations.find((x) => x.id === reservationId);
        if (!r || r.status === 'collected') return;
        const pick = getPick(r.pickId);
        const reservations = s.reservations.map((x) => (x.id === reservationId ? { ...x, status: 'collected' as const, collectedAt: Date.now() } : x));
        set(settle(s, { reservations }, { kind: 'collect', shopId: pick?.shopId, points: POINTS.collectPick, kgSaved: pick?.kg }));
      },

      convertPoints: () => {
        const s = get();
        if (s.points < POINTS_PER_VOUCHER) return undefined;
        const c: OwnedCoupon = { id: uid(), templateId: 'points-aed5', code: makeCode('SQ'), status: 'active', earnedAt: Date.now() };
        set({ points: s.points - POINTS_PER_VOUCHER, coupons: [c, ...s.coupons] });
        return c;
      },

      addOwnerEvent: (e) => set({ ownerEvents: [...get().ownerEvents, { ...e, id: uid(), at: Date.now() }] }),

      // Demo helper: two confirmed purchases yesterday at shops not bought from this
      // week, so the next confirmed purchase completes Souq Week on stage.
      demoSouqWeekAlmost: () => {
        const s = get();
        const weekAgo = Date.now() - 7 * DAY;
        const bought = new Set(s.sales.filter((x) => x.status === 'confirmed' && (x.confirmedAt ?? x.at) > weekAgo).map((x) => x.shopId));
        const need = Math.max(0, 2 - bought.size);
        const at = Date.now() - DAY;
        const added: Sale[] = ['bakery', 'grocery', 'dairy', 'spices']
          .filter((id) => !bought.has(id))
          .slice(0, need)
          .map((shopId, i) => ({ id: uid(), shopId, at: at - i * 3600000, confirmedAt: at - i * 3600000, status: 'confirmed', firstTime: true, band: '20to50' }));
        set({ sales: [...added, ...s.sales], points: s.points + added.length * POINTS.purchase, xp: s.xp + added.length * POINTS.purchase });
      },

      demoAddPoints: (n) => set({ points: get().points + n, xp: get().xp + n }),

      reset: () => set({ ...initial }),
    }),
    {
      name: 'souq-game',
      version: 2, // v2: visits vs purchases. Older saved progress is reset.
      migrate: () => ({ ...initial }),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => {
        const { visit, startPurchase, confirmSale, collectStory, reservePick, collectPick, convertPoints, addOwnerEvent, demoSouqWeekAlmost, demoAddPoints, reset, ...data } = s;
        return data;
      },
    },
  ),
);

/** Current progress as a Snapshot for the rules functions. */
export function useSnapshot(): Snapshot {
  const checkIns = useGame((s) => s.checkIns);
  const reservations = useGame((s) => s.reservations);
  const storyCards = useGame((s) => s.storyCards);
  const sales = useGame((s) => s.sales);
  const household = useAuth((s) => s.account?.household);
  return { checkIns, reservations, storyCards, sales, household };
}
