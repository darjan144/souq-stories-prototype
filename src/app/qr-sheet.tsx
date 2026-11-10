import { Platform, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { categories } from '@/data/categories';
import { shops } from '@/data/shops';
import { purchaseQrValue, visitQrValue } from '@/game/rules';
import { colors, space, type } from '@/theme';

/** Two printed codes per shop: VISIT (stall front) and PURCHASE (owner's counter). */
export default function QrSheet() {
  return (
    <Screen>
      <Text style={[type.body, { color: colors.muted }]}>
        Each shop has two printed codes that never change: a visit code for the front of the stall, and a purchase code the owner keeps at the counter.
      </Text>
      {Platform.OS === 'web' ? <Button title="Print this page" icon="printer" small variant="secondary" style={{ marginTop: space.md }} onPress={() => window.print()} /> : null}
      {shops.map((s) => (
        <View key={s.id} style={styles.shop}>
          <Text style={type.h3}>{s.name}</Text>
          <Text style={[type.small, { color: categories[s.category].color }]}>{categories[s.category].label}</Text>
          <View style={styles.row}>
            <View style={styles.cell}>
              <QRCode value={visitQrValue(s.id)} size={110} color={colors.teal} />
              <Text style={[styles.tag, { color: colors.teal }]}>VISIT · stall front</Text>
            </View>
            <View style={styles.cell}>
              <QRCode value={purchaseQrValue(s.id)} size={110} color={colors.terracotta} />
              <Text style={[styles.tag, { color: colors.terracotta }]}>PURCHASE · counter</Text>
            </View>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  shop: { marginTop: space.xl, padding: space.md, borderWidth: 1.5, borderColor: colors.border, borderRadius: 16, gap: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: space.md },
  cell: { alignItems: 'center', gap: 6 },
  tag: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
});
