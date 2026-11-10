import { Platform } from 'react-native';

// Palette shared with the pitch deck.
export const colors = {
  brown: '#2B1D14', // date brown: primary text, dark surfaces
  saffron: '#E3A13B',
  terracotta: '#C2502E', // primary action
  teal: '#1F5C58',
  olive: '#6B8E4E',
  spice: '#8C5A3C',
  sand: '#F3ECE3', // cards
  sandDark: '#D9CBB8',
  white: '#FFFFFF',
  muted: '#6E5B4E',
  border: '#E8DED2',
  success: '#2F7D4F',
};

export const fonts = {
  heading: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, Cambria, serif' }),
};

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const type = {
  h1: { fontFamily: fonts.heading, fontSize: 30, fontWeight: '700' as const, color: colors.brown },
  h2: { fontFamily: fonts.heading, fontSize: 22, fontWeight: '700' as const, color: colors.brown },
  h3: { fontSize: 17, fontWeight: '700' as const, color: colors.brown },
  body: { fontSize: 15, lineHeight: 22, color: colors.brown },
  small: { fontSize: 13, lineHeight: 18, color: colors.muted },
  label: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 1, textTransform: 'uppercase' as const, color: colors.muted },
};
