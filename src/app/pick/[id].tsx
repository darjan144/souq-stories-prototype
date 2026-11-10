import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ShopArt } from '@/components/ShopArt';
import { Button, Card, Icon, Tag } from '@/components/ui';
import { getPick } from '@/data/content';
import { getShop } from '@/data/shops';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function PickScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const pick = getPick(id);
  const shop = pick ? getShop(pick.shopId) : undefined;
  const reservation = useGame((s) => s.reservations.find((r) => r.pickId === id && r.status === 'reserved'));
  const reservePick = useGame((s) => s.reservePick);

  if (!pick || !shop) return <Screen><Text style={type.body}>Not found</Text></Screen>;
  const info = t.pick.types[pick.type];

  return (
    <Screen>
      <ShopArt shop={shop} height={150} />
      <View style={{ gap: space.sm, marginTop: space.lg }}>
        <Tag label={info.label} color={pick.type === 'naturallyShaped' ? colors.olive : pick.type === 'freshToday' ? colors.teal : colors.terracotta} />
        <Text style={type.h2}>{pick.title}</Text>
        <Text style={type.small}>{shop.name}</Text>
        <Text style={type.body}>{info.blurb}</Text>
      </View>

      <Card style={styles.priceRow}>
        <View>
          <Text style={styles.price}>AED {pick.price}</Text>
          <Text style={styles.usual}>
            {t.pick.usual} AED {pick.usualPrice}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={type.small}>
            <Icon name="clock-outline" size={14} color={colors.muted} /> {t.pick.pickup} {pick.pickupWindow}
          </Text>
          <Text style={type.small}>{t.pick.left(pick.left)}</Text>
        </View>
      </Card>

      <View style={styles.good}>
        <Icon name="leaf" size={20} color={colors.olive} />
        <Text style={[type.small, { flex: 1, color: colors.olive, fontWeight: '600' }]}>{t.pick.good(pick.kg)}</Text>
      </View>

      {reservation ? (
        <Card color={colors.brown} style={{ alignItems: 'center', gap: space.sm, marginTop: space.xl }}>
          <Text style={[type.label, { color: colors.sandDark }]}>{t.pick.reserved}</Text>
          <Text style={styles.code}>{reservation.code}</Text>
          <Text style={[type.small, { color: colors.sand }]}>{t.pick.showCode}</Text>
          <Button title={t.pick.viewWallet} variant="secondary" small icon="ticket-percent-outline" onPress={() => router.navigate('/wallet')} style={{ marginTop: space.sm }} />
        </Card>
      ) : (
        <Button title={t.pick.reserve} icon="basket-check" style={{ marginTop: space.xl }} onPress={() => reservePick(pick.id)} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.xl },
  price: { fontSize: 28, fontWeight: '800', color: colors.terracotta },
  usual: { fontSize: 13, color: colors.muted, textDecorationLine: 'line-through' },
  good: { flexDirection: 'row', gap: space.sm, alignItems: 'center', marginTop: space.lg },
  code: { fontSize: 34, fontWeight: '800', letterSpacing: 3, color: colors.saffron },
});
