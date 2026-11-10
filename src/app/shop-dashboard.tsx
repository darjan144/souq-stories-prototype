import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { StatTile } from '@/components/cards';
import { Screen } from '@/components/Screen';
import { Button, Card, Chip, Icon, SectionTitle } from '@/components/ui';
import { shopStats } from '@/data/content';
import { shops } from '@/data/shops';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

const WA_GREEN = '#25D366';

export default function ShopDashboard() {
  const [shopId, setShopId] = useState('produce');
  const [posted, setPosted] = useState(false);
  const shop = shops.find((s) => s.id === shopId)!;
  const max = Math.max(...shopStats.weeklyVisits.map((w) => w.visits));
  const before = shopStats.weeklyVisits.slice(0, 4).reduce((a, w) => a + w.visits, 0) / 4;
  const after = shopStats.weeklyVisits.slice(4).reduce((a, w) => a + w.visits, 0) / 4;
  const uplift = Math.round(((after - before) / before) * 100);

  return (
    <Screen>
      <Text style={type.small}>{t.dashboard.subtitle}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingVertical: space.md }}>
        {shops.map((s) => (
          <Chip key={s.id} label={s.name} selected={s.id === shopId} onPress={() => { setShopId(s.id); setPosted(false); }} />
        ))}
      </ScrollView>

      <Card color={colors.brown} style={{ gap: 4 }}>
        <Text style={[type.label, { color: colors.sandDark }]}>{shop.name}</Text>
        <Text style={styles.uplift}>+{uplift}%</Text>
        <Text style={[type.body, { color: colors.white }]}>more weekly visits since joining Souq Stories</Text>
      </Card>

      <SectionTitle title={t.dashboard.visitsTrend} />
      <Card style={{ paddingBottom: space.md }}>
        <View style={styles.chart}>
          {shopStats.weeklyVisits.map((w) => (
            <View key={w.week} style={styles.barCol}>
              <Text style={styles.barVal}>{w.visits}</Text>
              <View style={[styles.bar, { height: (w.visits / max) * 120, backgroundColor: 'joined' in w || shopStats.weeklyVisits.indexOf(w) >= 4 ? colors.terracotta : colors.sandDark }]} />
              <Text style={styles.barLabel}>{w.week}</Text>
              {'joined' in w ? <Text style={styles.joined}>{t.dashboard.joined}</Text> : null}
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.grid}>
        {shopStats.tiles.map((tile) => (
          <StatTile key={tile.label} value={tile.value} label={tile.label} icon={tile.icon} />
        ))}
      </View>

      <SectionTitle title={t.dashboard.post} />
      <Card style={{ gap: space.md, backgroundColor: '#ECE5DD' }}>
        <Text style={type.small}>{t.dashboard.postBody}</Text>
        <View style={[styles.bubble, styles.out]}>
          <Icon name="camera" color={colors.muted} size={18} />
          <Text style={type.body}>[photo] 3 kg naturally shaped tomatoes, AED 8, pickup until 9pm</Text>
        </View>
        {posted ? (
          <View style={[styles.bubble, styles.in]}>
            <Text style={[type.body, { fontWeight: '700' }]}>Souq Stories</Text>
            <Text style={type.body}>Your Souq Pick is live: "Naturally shaped tomatoes, 3 kg · AED 8 · until 21:00". 214 people nearby will see it.</Text>
          </View>
        ) : null}
        {!posted ? <Button title={t.dashboard.postCta} icon="whatsapp" style={{ backgroundColor: WA_GREEN }} onPress={() => setPosted(true)} /> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  uplift: { fontSize: 44, fontWeight: '800', color: colors.saffron },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, paddingTop: space.md },
  barCol: { alignItems: 'center', flex: 1, gap: 4 },
  bar: { width: 22, borderRadius: 6 },
  barVal: { fontSize: 11, color: colors.muted, fontWeight: '700' },
  barLabel: { fontSize: 11, color: colors.muted },
  joined: { fontSize: 10, color: colors.terracotta, fontWeight: '800', position: 'absolute', bottom: -16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: space.xl },
  bubble: { padding: space.md, borderRadius: 12, maxWidth: '88%', gap: 4 },
  out: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  in: { backgroundColor: colors.white, alignSelf: 'flex-start' },
});
