import type { ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { t } from '@/strings';
import { colors, fonts } from '@/theme';

/** On desktop browsers, show the app inside a phone frame with a short intro beside it. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  if (width < 760) return <View style={styles.full}>{children}</View>;

  const frameH = Math.min(860, height - 48);
  return (
    <View style={styles.page}>
      {width >= 1040 ? (
        <View style={styles.side}>
          <Text style={styles.brand}>{t.appName}</Text>
          <Text style={styles.brandAr}>{t.appNameAr}</Text>
          <Text style={styles.tag}>{t.tagline}</Text>
          <Text style={styles.body}>
            Interactive prototype for Bright Ideas 2026 (Sharjah Media City). Register with any number, use code 1234, then explore the souq, watch owner
            stories, reserve Souq Picks, check in with QR codes and earn coupons.
          </Text>
          <Text style={styles.note}>{t.sampleData}</Text>
        </View>
      ) : null}
      <View style={[styles.frame, { height: frameH, width: Math.round(frameH * 0.47) }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  page: { flex: 1, backgroundColor: colors.brown, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 72, padding: 24 },
  side: { maxWidth: 380 },
  brand: { fontFamily: fonts.heading, fontSize: 52, fontWeight: '700', color: colors.saffron },
  brandAr: { fontSize: 34, color: colors.white, marginTop: 4 },
  tag: { fontSize: 20, fontStyle: 'italic', color: colors.sandDark, marginTop: 16 },
  body: { fontSize: 16, lineHeight: 24, color: colors.white, marginTop: 24 },
  note: { fontSize: 13, color: colors.sandDark, marginTop: 20 },
  frame: {
    minWidth: 360,
    maxWidth: 420,
    borderRadius: 44,
    borderWidth: 12,
    borderColor: '#1A110B',
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
  },
});
