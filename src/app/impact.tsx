import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { StatTile } from '@/components/cards';
import { Screen } from '@/components/Screen';
import { Card, Icon, SectionTitle } from '@/components/ui';
import { categories } from '@/data/categories';
import { getShop } from '@/data/shops';
import { impactOf } from '@/game/rules';
import { useSnapshot } from '@/store/useGame';
import { t } from '@/strings';
import { colors, fonts, space, type } from '@/theme';

export default function Impact() {
  const router = useRouter();
  const imp = impactOf(useSnapshot());

  return (
    <Screen>
      <Card color={colors.brown} style={{ gap: space.sm }}>
        <Icon name="hand-heart" size={28} color={colors.saffron} />
        <Text style={styles.quote}>{t.impact.headline(imp.shopsSupported, imp.kgSaved, imp.seasonalShare)}</Text>
      </Card>

      <View style={styles.grid}>
        <StatTile value={imp.purchases} label={t.impact.purchases} icon="shopping-outline" color={colors.terracotta} />
        <StatTile value={imp.shopsSupported} label={t.impact.shops} icon="storefront-outline" color={colors.teal} />
        <StatTile value={imp.newShopsTried} label={t.impact.newShops} icon="star-circle" color={colors.saffron} />
        <StatTile value={imp.kgSaved} label={t.impact.kg} icon="leaf" color={colors.olive} />
        <StatTile value={`${imp.seasonalShare}%`} label={t.impact.seasonal} icon="sprout" color={colors.olive} />
        <StatTile value={imp.visits} label={t.impact.visits} icon="qrcode-scan" color={colors.teal} />
        <StatTile value={imp.estimatedSpend} label={t.impact.local} icon="cash" color={colors.spice} />
        <StatTile value={`${imp.stories}/${imp.totalShops}`} label={t.impact.stories} icon="cards-outline" color="#7A5C8C" />
      </View>
      {imp.purchases ? (
        <Text style={[type.small, { textAlign: 'center' }]}>Spend is estimated from the optional price ranges owners choose ({imp.bandCoverage}% of your purchases have one).</Text>
      ) : null}

      {imp.supportedShopIds.length ? (
        <>
          <SectionTitle title="Shops you supported" />
          <View style={{ gap: space.sm }}>
            {imp.supportedShopIds.map((id) => {
              const s = getShop(id);
              if (!s) return null;
              return (
                <Card key={id} color={colors.white} onPress={() => router.push(`/shop/${id}`)} style={styles.shopRow}>
                  <Icon name={categories[s.category].icon} color={categories[s.category].color} />
                  <Text style={[type.body, { flex: 1, fontWeight: '600' }]}>{s.name}</Text>
                  <Icon name="chevron-right" color={colors.muted} />
                </Card>
              );
            })}
          </View>
        </>
      ) : (
        <Text style={[type.small, { marginTop: space.xl, textAlign: 'center' }]}>Buy something at a shop or collect a Souq Pick to start your impact story.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  quote: { fontFamily: fonts.heading, fontSize: 20, lineHeight: 28, fontStyle: 'italic', color: colors.saffron },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: space.xl },
  shopRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderWidth: 1.5, borderColor: colors.border },
});
