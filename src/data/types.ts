import type { ImageSourcePropType } from 'react-native';

export type Category = 'dates' | 'fish' | 'spices' | 'bakery' | 'produce' | 'honey' | 'dairy' | 'grocery';
export type LatLng = { latitude: number; longitude: number };

export type Shop = {
  id: string;
  name: string;
  nameAr: string;
  owner: string;
  category: Category;
  tagline: string;
  story: string;
  origin: string;
  inSeason: string[];
  tip: string;
  coords: LatLng;
  hours: string;
  since: number;
  /** YouTube video id for the owner's story. Empty = placeholder poster. */
  youtubeId?: string;
  /** Stock photo, added later (needs approval before download). */
  image?: ImageSourcePropType;
};

export type PickType = 'evening' | 'naturallyShaped' | 'freshToday';

export type SouqPick = {
  id: string;
  shopId: string;
  title: string;
  type: PickType;
  price: number;
  usualPrice: number;
  kg: number;
  pickupWindow: string;
  left: number;
};

/** Purchase-based kinds can carry coupons; visit-based kinds give points only. */
export type ChallengeKind = 'distinctShopPurchases' | 'picks' | 'seasonalPurchases' | 'distinctShopVisits' | 'comingSoon';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  kind: ChallengeKind;
  target: number;
  days?: number;
  rewardPoints: number;
  rewardCouponId?: string;
  fundedBy: 'shop' | 'sponsor';
  steps: string[];
};

export type BadgeRule =
  | { type: 'visitAt'; shopId: string }
  | { type: 'distinctVisits'; count: number }
  | { type: 'purchases'; count: number }
  | { type: 'picks'; count: number }
  | { type: 'householdPurchases'; count: number };

export type Badge = { id: string; name: string; description: string; icon: string; color: string; rule: BadgeRule };

/**
 * Prices are haggled, so rewards are never a percentage: either a fixed amount
 * off the agreed price or a gift with purchase. Each shop chooses for its own
 * coupons. Sponsor-funded amounts are reimbursed to the shop by bank transfer.
 */
export type CouponTemplate = {
  id: string;
  title: string;
  description: string;
  kind: 'amountOff' | 'gift';
  value?: number; // AED, for amountOff
  shopId?: string; // undefined = any partner shop
  fundedBy: 'shop' | 'sponsor';
  funderName: string;
};

export type PriceBand = 'under20' | '20to50' | '50to100' | 'over100';
