import { SEASONAL } from '@/data/categories';
import { getCouponTemplate, getPick, PRICE_BANDS } from '@/data/content';
import { getShop, shops } from '@/data/shops';
import type { Badge, Challenge, PriceBand } from '@/data/types';

/**
 * Two printed QR codes per shop:
 *  - VISIT QR at the stall front: proves a visit. Small points and badges, never coupons.
 *  - PURCHASE QR at the owner's counter: scanned after the deal. Creates a pending
 *    purchase that the owner confirms on WhatsApp (price band optional).
 * Coupons only come from confirmed purchases. The action of buying is what we
 * measure, not the exact money (prices are haggled, cash is common).
 */
export const POINTS = { visit: 5, purchase: 25, newShopBonus: 10, collectPick: 25 };
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
export type OwnedCoupon = { id: string; templateId: string; code: string; status: 'active' | 'pending' | 'redeemed'; earnedAt: number; redeemedAt?: number };
export type Sale = {
  id: string;
  shopId: string;
  at: number;
  status: 'pending' | 'confirmed';
  couponId?: string; // owned coupon used with this purchase
  firstTime: boolean; // customer says it's their first purchase at this shop
  band?: PriceBand; // optional, chosen by the owner
  confirmedAt?: number;
};

export type Snapshot = {
  checkIns: CheckIn[];
  reservations: Reservation[];
  storyCards: string[];
  sales: Sale[];
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
const isSeasonal = (shopId: string) => SEASONAL.includes(getShop(shopId)?.category ?? 'grocery');
export const confirmedSales = (s: Pick<Snapshot, 'sales'>) => s.sales.filter((x) => x.status === 'confirmed');

export function challengeProgress(ch: Challenge, s: Snapshot, now = Date.now()): number {
  const since = now - (ch.days ?? 3650) * DAY;
  const buys = confirmedSales(s).filter((x) => (x.confirmedAt ?? x.at) >= since);
  switch (ch.kind) {
    case 'distinctShopPurchases':
      return Math.min(ch.target, distinct(buys.map((x) => x.shopId)));
    case 'seasonalPurchases':
      return Math.min(ch.target, distinct(buys.filter((x) => isSeasonal(x.shopId)).map((x) => x.shopId)));
    case 'picks':
      return Math.min(ch.target, s.reservations.filter((r) => r.status === 'collected').length);
    case 'distinctShopVisits':
      return Math.min(ch.target, distinct(s.checkIns.filter((c) => c.at >= since).map((c) => c.shopId)));
    default:
      return 0;
  }
}

export function badgeEarned(b: Badge, s: Snapshot): boolean {
  const r = b.rule;
  switch (r.type) {
    case 'visitAt':
      return s.checkIns.some((c) => c.shopId === r.shopId);
    case 'distinctVisits':
      return distinct(s.checkIns.map((c) => c.shopId)) >= r.count;
    case 'purchases':
      return confirmedSales(s).length >= r.count;
    case 'picks':
      return s.reservations.filter((x) => x.status === 'collected').length >= r.count;
    case 'householdPurchases':
      return !!s.household && confirmedSales(s).length >= r.count;
  }
}

export function impactOf(s: Snapshot) {
  const collected = s.reservations.filter((r) => r.status === 'collected').map((r) => getPick(r.pickId)).filter((p) => !!p);
  const buys = confirmedSales(s);
  const supported = [...buys.map((x) => x.shopId), ...collected.map((p) => p.shopId)];
  const banded = buys.filter((x) => x.band);
  return {
    shopsSupported: new Set(supported).size,
    purchases: buys.length + collected.length,
    newShopsTried: buys.filter((x) => x.firstTime).length,
    kgSaved: Math.round(collected.reduce((sum, p) => sum + p.kg, 0) * 10) / 10,
    seasonalShare: supported.length ? Math.round((supported.filter(isSeasonal).length / supported.length) * 100) : 0,
    visits: s.checkIns.length,
    stories: s.storyCards.length,
    totalShops: shops.length,
    supportedShopIds: [...new Set(supported)],
    // Spend is an estimate from optional price bands; we report how many sales have one.
    estimatedSpend: banded.reduce((sum, x) => sum + (PRICE_BANDS.find((b) => b.id === x.band)?.mid ?? 0), 0) + collected.reduce((sum, p) => sum + p.price, 0),
    bandCoverage: buys.length ? Math.round((banded.length / buys.length) * 100) : 0,
  };
}

/** What a sponsor owes a shop: sponsor-funded amount-off coupons used in confirmed sales. */
export function sponsorOwed(s: Pick<Snapshot, 'sales'>, coupons: OwnedCoupon[], shopId: string) {
  return confirmedSales(s)
    .filter((x) => x.shopId === shopId && x.couponId)
    .reduce((sum, x) => {
      const tpl = getCouponTemplate(coupons.find((c) => c.id === x.couponId)?.templateId ?? '');
      return sum + (tpl && tpl.fundedBy === 'sponsor' && tpl.kind === 'amountOff' ? tpl.value ?? 0 : 0);
    }, 0);
}

export type ScannedCode = { kind: 'visit' | 'purchase'; shopId: string };

export const parseCode = (data: string): ScannedCode | null => {
  const m = data.trim().match(/^souqstories:\/\/(visit|checkin|buy)\/([a-z0-9-]+)$/i);
  if (!m || !getShop(m[2])) return null;
  return { kind: m[1].toLowerCase() === 'buy' ? 'purchase' : 'visit', shopId: m[2] };
};

export const visitQrValue = (shopId: string) => `souqstories://visit/${shopId}`;
export const purchaseQrValue = (shopId: string) => `souqstories://buy/${shopId}`;

export const makeCode = (prefix: string) => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}${letters[Math.floor(Math.random() * letters.length)]}`;
};
