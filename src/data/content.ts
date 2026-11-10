import { colors } from '@/theme';
import type { Badge, Challenge, CouponTemplate, PriceBand, SouqPick } from './types';

export const picks: SouqPick[] = [
  { id: 'p-dates-1', shopId: 'dates', title: 'Mixed Khalas box, 1 kg', type: 'evening', price: 18, usualPrice: 30, kg: 1, pickupWindow: '19:00 – 21:30', left: 4 },
  { id: 'p-fish-1', shopId: 'fish', title: "Today's safi, cleaned, 1.5 kg", type: 'freshToday', price: 22, usualPrice: 35, kg: 1.5, pickupWindow: '18:00 – 20:30', left: 3 },
  { id: 'p-bakery-1', shopId: 'bakery', title: 'Evening bread bag: khameer and chebab', type: 'evening', price: 8, usualPrice: 15, kg: 0.8, pickupWindow: '19:00 – 20:45', left: 6 },
  { id: 'p-produce-1', shopId: 'produce', title: 'Naturally shaped tomatoes, 2 kg', type: 'naturallyShaped', price: 6, usualPrice: 12, kg: 2, pickupWindow: '17:00 – 21:30', left: 8 },
  { id: 'p-produce-2', shopId: 'produce', title: 'Salad box: cucumber, lettuce, herbs', type: 'freshToday', price: 9, usualPrice: 16, kg: 1.2, pickupWindow: '17:00 – 21:30', left: 5 },
  { id: 'p-dairy-1', shopId: 'dairy', title: 'Laban, 2 × 1 L', type: 'freshToday', price: 7, usualPrice: 12, kg: 2, pickupWindow: '12:00 – 13:45', left: 4 },
  { id: 'p-grocery-1', shopId: 'grocery', title: 'Local eggs, tray of 15 (mixed sizes)', type: 'naturallyShaped', price: 10, usualPrice: 16, kg: 0.9, pickupWindow: '18:00 – 23:00', left: 7 },
];

export const getPick = (id: string) => picks.find((p) => p.id === id);
export const picksForShop = (shopId: string) => picks.filter((p) => p.shopId === shopId);

/** Optional price band the owner picks when confirming a sale (prices are haggled). */
export const PRICE_BANDS: { id: PriceBand; label: string; mid: number }[] = [
  { id: 'under20', label: 'Under AED 20', mid: 12 },
  { id: '20to50', label: 'AED 20–50', mid: 35 },
  { id: '50to100', label: 'AED 50–100', mid: 75 },
  { id: 'over100', label: 'AED 100+', mid: 120 },
];
export const bandLabel = (b?: PriceBand) => PRICE_BANDS.find((x) => x.id === b)?.label;

// Coupons come only from confirmed purchases. Shops decide gift vs amount off.
export const couponTemplates: CouponTemplate[] = [
  {
    id: 'souq-week-aed10',
    title: 'AED 10 off your next purchase',
    description: 'Reward for Souq Week. Agree your price first, then AED 10 comes off. Any partner shop.',
    kind: 'amountOff',
    value: 10,
    fundedBy: 'sponsor',
    funderName: 'Sustainability sponsor (example)',
  },
  {
    id: 'green-basket-herbs',
    title: 'Free bunch of fresh herbs',
    description: 'Reward for Food Saver. A gift from Joseph and Salem with your next purchase.',
    kind: 'gift',
    shopId: 'produce',
    fundedBy: 'shop',
    funderName: 'Green Basket Stall',
  },
  {
    id: 'honey-aed15',
    title: 'AED 15 off new-harvest sidr honey',
    description: 'Reward for Seasonal Shopper. Comes off the price you agree with Ahmed.',
    kind: 'amountOff',
    value: 15,
    shopId: 'honey',
    fundedBy: 'shop',
    funderName: 'Hajar Mountain Honey',
  },
  {
    id: 'points-aed5',
    title: 'AED 5 voucher',
    description: 'Converted from 100 points. Use with a purchase at any partner shop.',
    kind: 'amountOff',
    value: 5,
    fundedBy: 'sponsor',
    funderName: 'Souq Stories rewards pool',
  },
];

export const getCouponTemplate = (id: string) => couponTemplates.find((c) => c.id === id);

export const challenges: Challenge[] = [
  {
    id: 'souq-week',
    title: 'Souq Week',
    description: 'Buy from 3 different local shops within 7 days.',
    icon: 'calendar-week',
    kind: 'distinctShopPurchases',
    target: 3,
    days: 7,
    rewardPoints: 50,
    rewardCouponId: 'souq-week-aed10',
    fundedBy: 'sponsor',
    steps: ['Taste, haggle and agree a price', 'Scan the shop’s purchase QR at the counter', 'The owner confirms on WhatsApp, and it counts'],
  },
  {
    id: 'food-saver',
    title: 'Food Saver',
    description: 'Collect 2 Souq Picks and enjoy good food at its best.',
    icon: 'basket-check',
    kind: 'picks',
    target: 2,
    rewardPoints: 50,
    rewardCouponId: 'green-basket-herbs',
    fundedBy: 'shop',
    steps: ['Reserve a Souq Pick in any shop', 'Pick it up at the stall', 'The owner marks it collected on WhatsApp'],
  },
  {
    id: 'seasonal-shopper',
    title: 'Seasonal Shopper',
    description: 'Buy from 3 shops selling what is in season: dates, fish, vegetables or honey.',
    icon: 'sprout',
    kind: 'seasonalPurchases',
    target: 3,
    days: 30,
    rewardPoints: 50,
    rewardCouponId: 'honey-aed15',
    fundedBy: 'shop',
    steps: ['Read "In season now" on a shop’s story', 'Buy from seasonal shops', 'Three confirmed seasonal purchases this month completes it'],
  },
  {
    id: 'souq-explorer',
    title: 'Souq Explorer',
    description: 'Visit 5 different stalls and meet the people behind them.',
    icon: 'compass-outline',
    kind: 'distinctShopVisits',
    target: 5,
    days: 30,
    rewardPoints: 30,
    fundedBy: 'sponsor',
    steps: ['Walk the souq and say hello', 'Scan the visit QR at the front of each stall', 'Five different stalls completes it (points only)'],
  },
  {
    id: 'conscious-ramadan',
    title: 'Conscious Ramadan',
    description: 'A month of mindful iftar shopping with daily local picks and family goals.',
    icon: 'moon-waning-crescent',
    kind: 'comingSoon',
    target: 1,
    rewardPoints: 100,
    fundedBy: 'sponsor',
    steps: ['Plan iftar with local shops', 'Buy the right amount, share the rest', 'Families compete together'],
  },
];

export const getChallenge = (id: string) => challenges.find((c) => c.id === id);

export const badges: Badge[] = [
  { id: 'date-explorer', name: 'Date Explorer', description: 'Visited Al Dhaid Date House', icon: 'palm-tree', color: colors.spice, rule: { type: 'visitAt', shopId: 'dates' } },
  { id: 'fresh-catch', name: 'Fresh Catch', description: 'Visited Khor Fakkan Catch', icon: 'fish', color: colors.teal, rule: { type: 'visitAt', shopId: 'fish' } },
  { id: 'spice-route', name: 'Spice Route', description: 'Visited Spice Route Corner', icon: 'shaker-outline', color: colors.terracotta, rule: { type: 'visitAt', shopId: 'spices' } },
  { id: 'first-buy', name: 'Souq Shopper', description: 'First confirmed purchase', icon: 'shopping-outline', color: colors.olive, rule: { type: 'purchases', count: 1 } },
  { id: 'souq-regular', name: 'Souq Regular', description: 'Visited 5 different stalls', icon: 'storefront-outline', color: colors.saffron, rule: { type: 'distinctVisits', count: 5 } },
  { id: 'family-team', name: 'Family Team', description: '3 purchases in family mode', icon: 'home-heart', color: '#7A5C8C', rule: { type: 'householdPurchases', count: 3 } },
];

export const getBadge = (id: string) => badges.find((b) => b.id === id);

export const leaderboard = [
  { household: 'Al Mansoori family', xp: 420 },
  { household: 'Team Nair', xp: 365 },
  { household: 'The Santos household', xp: 290 },
  { household: 'Al Hammadi family', xp: 210 },
  { household: 'Rahman & sons', xp: 140 },
];

// Illustrative pilot projection for the shop-owner view (not real data).
export const shopStats = {
  weeklyVisits: [
    { week: 'W1', visits: 38 },
    { week: 'W2', visits: 41 },
    { week: 'W3', visits: 36 },
    { week: 'W4', visits: 40 },
    { week: 'W5', visits: 49, joined: true },
    { week: 'W6', visits: 55 },
    { week: 'W7', visits: 58 },
    { week: 'W8', visits: 63 },
  ],
  tiles: [
    { label: 'Profile views', value: '1,240', icon: 'eye' },
    { label: 'QR-verified visits', value: '212', icon: 'qrcode-scan' },
    { label: 'Confirmed app sales', value: '146', icon: 'shopping-outline' },
    { label: 'New customers', value: '58%', icon: 'account-plus' },
    { label: 'Souq Picks collected', value: '64', icon: 'basket-check' },
    { label: 'Repeat customers', value: '41%', icon: 'account-heart' },
  ],
};
