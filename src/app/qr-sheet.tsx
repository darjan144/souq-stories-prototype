import { Platform, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { categories } from '@/data/categories';
import { shops } from '@/data/shops';
import { shopQrValue } from '@/game/rules';
import { colors, space, type } from '@/theme';

export default function QrSheet() {
  return (
    <Screen>
      <Text style={[type.body, { color: colors.muted }]}>Each code encodes the shop's check-in link. Scan them from the Scan tab.</Text>
      {Platform.OS === 'web' ? <Button title="Print this page" icon="printer" small variant="secondary" style={{ marginTop: space.md }} onPress={() => window.print()} /> : null}
      <View style={styles.grid}>
        {shops.map((s) => (
          <View key={s.id} style={styles.cell}>
            <QRCode value={shopQrValue(s.id)} size={130} color={colors.brown} />
            <Text style={[type.h3, { textAlign: 'center', fontSize: 14 }]}>{s.name}</Text>
            <Text style={[type.small, { color: categories[s.category].color }]}>{categories[s.category].label}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: space.xl },
  cell: { width: '48%', alignItems: 'center', gap: 6, padding: space.md, borderWidth: 1.5, borderColor: colors.border, borderRadius: 16, marginBottom: space.md },
});
