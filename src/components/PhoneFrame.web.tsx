import { useEffect, type ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useHydrated, useUI } from '@/store/useUI';
import { t } from '@/strings';
import { colors, fonts } from '@/theme';
import { OwnerWhatsApp } from './OwnerWhatsApp';

/**
 * Desktop web (the presentation setup): customer app on the left, the shop owner's
 * WhatsApp on the right, both driven by the same live state. Narrow screens show
 * the customer app full screen.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const hydrated = useHydrated();
  const setOwnerPanelVisible = useUI((s) => s.setOwnerPanelVisible);
  const dual = width >= 900;

  useEffect(() => setOwnerPanelVisible(dual), [dual]);

  if (width < 760) return <View style={styles.full}>{children}</View>;

  const frameH = Math.min(860, height - 110);
  const frameW = Math.max(340, Math.min(410, Math.round(frameH * 0.47)));

  return (
    <View style={styles.page}>
      <View style={styles.top}>
        <Text style={styles.brand}>
          {t.appName} <Text style={styles.brandAr}>{t.appNameAr}</Text>
        </Text>
        <Text style={styles.hint}>
          Prototype · register with any number, code 1234{dual ? ' · scan a purchase code on the left, confirm it on WhatsApp on the right' : ''}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          {dual ? <Text style={styles.label}>{t.owner.customerLabel}</Text> : null}
          <View style={[styles.frame, { height: frameH, width: frameW }]}>{children}</View>
        </View>
        {dual ? (
          <View style={styles.col}>
            <Text style={styles.label}>{t.owner.phoneLabel}</Text>
            <View style={[styles.frame, { height: frameH, width: frameW }]}>
              <SafeAreaProvider>{hydrated ? <OwnerWhatsApp /> : null}</SafeAreaProvider>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  page: { flex: 1, backgroundColor: colors.brown, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  top: { alignItems: 'center', marginBottom: 12, gap: 2 },
  brand: { fontFamily: fonts.heading, fontSize: 24, fontWeight: '700', color: colors.saffron },
  brandAr: { fontFamily: undefined, fontSize: 20, color: colors.white, fontWeight: '400' },
  hint: { fontSize: 13, color: colors.sandDark },
  row: { flexDirection: 'row', gap: 56, alignItems: 'flex-start' },
  col: { alignItems: 'center', gap: 8 },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', color: colors.sandDark },
  frame: {
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
