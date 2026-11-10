import { colors } from '@/theme';
import type { Category } from './types';

export const categories: Record<Category, { label: string; icon: string; emoji: string; color: string }> = {
  dates: { label: 'Dates', icon: 'palm-tree', emoji: '🌴', color: colors.spice },
  fish: { label: 'Fish', icon: 'fish', emoji: '🐟', color: colors.teal },
  spices: { label: 'Spices', icon: 'shaker-outline', emoji: '🌶️', color: colors.terracotta },
  bakery: { label: 'Bakery', icon: 'bread-slice', emoji: '🥖', color: '#B07A3B' },
  produce: { label: 'Fruit & veg', icon: 'carrot', emoji: '🍅', color: colors.olive },
  honey: { label: 'Honey', icon: 'beehive-outline', emoji: '🍯', color: colors.saffron },
  dairy: { label: 'Dairy', icon: 'cup', emoji: '🥛', color: '#5F7C8A' },
  grocery: { label: 'Grocery', icon: 'basket', emoji: '🧺', color: '#7A5C8C' },
};

/** Categories whose products follow local seasons; used for the "bought in season" share. */
export const SEASONAL: Category[] = ['dates', 'fish', 'produce', 'honey'];
