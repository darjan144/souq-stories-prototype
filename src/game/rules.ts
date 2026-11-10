import { SEASONAL } from '@/data/categories';
import { getPick } from '@/data/content';
import { getShop, shops } from '@/data/shops';
import type { Badge, Challenge } from '@/data/types';

// Points are only awarded for verified real-world actions (QR check-in,
// shop-confirmed pickup, completed challenge). Never for views or likes.
export const POINTS = { checkIn: 10, collectPick: 25 };
export const POINTS_PER_VOUCHER = 100;
export const DAY = 24 * 60 * 60 * 1000;

export const LEVELS = [
  { name: 'Visitor', min: 0 },
  { name: 'Regular', min: 50 },
  { name: 'Souq Friend', min: 150 },
  { name: 'Souq Champion', min: 300 },
];

export type CheckIn = { shopId: string; at: number };
export type Reservation = { id: string; pickId: string; code: string; status: 'reserved' | 'collected'; reservedAt: number; collectedAt?: number };
export type OwnedCoupon = { id: string; templateId: string; code: string; status: 'active' | 'redeemed'; earnedAt: number; redeemedAt?: number };

export type Snapshot = {
  checkIns: CheckIn[];
  reservations: Reservation[];
  storyCards: string[];
  household?: string;
};

export function levelFor(xp: number) {
  let idx = 0;
  LEVELS.forEach((l, i) => {
    if (xp >= l.min) idx = i;
  });
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1;
  return { current, next, progress, toNext: next ? next.min - xp : 0 };
}

export const sameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString();

const distinct = (ids: string[]) => new Set(ids).size;

export function challengeProgress(ch: Challenge, s: Snapshot, now = Date.now()): number {
  const since = now - (ch.days ?? 3650) * DAY;
  const recent = s.checkIns.filter((c) => c.at >= since);
  switch (ch.kind) {
    case 'distinctShops':
      return Math.min(ch.target, distinct(recent.map((c) => c.shopId)));
    case 'picks':
      return Math.min(ch.target, s.reservations.filter((r) => r.status === 'collected').length);
    case 'seasonalShops':
      return Math.min(
        ch.target,
        distinct(recent.filter((c) => SEASONAL.includes(getShop(c.shopId)?.category ?? 'grocery')).map((c) => c.shopId)),
      );
    default:
      return 0;
  }
}

export function badgeEarned(b: Badge, s: Snapshot): boolean {
  const r = b.rule;
  switch (r.type) {
    case 'checkinAt':
      return s.checkIns.some((c) => c.shopId === r.shopId);
    case 'distinctShops':
      return distinct(s.checkIns.map((c) => c.shopId)) >= r.count;
    case 'picks':
      return s.reservations.filter((x) => x.status === 'collected').length >= r.count;
    case 'householdCheckins':
      return !!s.household && s.checkIns.length >= r.count;
  }
}

export function impactOf(s: Snapshot) {
  const collected = s.reservations.filter((r) => r.status === 'collected').map((r) => getPick(r.pickId)).filter((p) => !!p);
  const shopIds = new Set([...s.checkIns.map((c) => c.shopId), ...collected.map((p) => p.shopId)]);
  const touches = [...s.checkIns.map((c) => c.shopId), ...collected.map((p) => p.shopId)];
  const seasonalTouches = touches.filter((id) => SEASONAL.includes(getShop(id)?.category ?? 'grocery')).length;
  return {
    shopsSupported: shopIds.size,
    kgSaved: Math.round(collected.reduce((sum, p) => sum + p.kg, 0) * 10) / 10,
    localSpend: collected.reduce((sum, p) => sum + p.price, 0),
    seasonalShare: touches.length ? Math.round((seasonalTouches / touches.length) * 100) : 0,
    visits: s.checkIns.length,
    stories: s.storyCards.length,
    totalShops: shops.length,
    supportedShopIds: [...shopIds],
  };
}

export const parseShopCode = (data: string): string | null => {
  const m = data.trim().match(/^souqstories:\/\/checkin\/([a-z0-9-]+)$/i);
  const id = m ? m[1] : data.trim();
  return getShop(id) ? id : null;
};

export const shopQrValue = (shopId: string) => `souqstories://checkin/${shopId}`;

export const makeCode = (prefix: string) => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}${letters[Math.floor(Math.random() * letters.length)]}`;
};
