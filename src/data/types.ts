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

export type ChallengeKind = 'distinctShops' | 'picks' | 'seasonalShops' | 'comingSoon';

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
  | { type: 'checkinAt'; shopId: string }
  | { type: 'distinctShops'; count: number }
  | { type: 'picks'; count: number }
  | { type: 'householdCheckins'; count: number };

export type Badge = { id: string; name: string; description: string; icon: string; color: string; rule: BadgeRule };

export type CouponTemplate = {
  id: string;
  title: string;
  description: string;
  shopId?: string; // undefined = any partner shop
  fundedBy: 'shop' | 'sponsor';
  funderName: string;
};
