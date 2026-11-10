import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CouponCard } from '@/components/cards';
import { Screen } from '@/components/Screen';
import { Button, Card, Icon, IconCircle, Segmented, Tag } from '@/components/ui';
import { getPick } from '@/data/content';
import { getShop } from '@/data/shops';
import { POINTS_PER_VOUCHER } from '@/game/rules';
import { useGame } from '@/store/useGame';
import { useUI } from '@/store/useUI';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function Wallet() {
  const router = useRouter();
  const [tab, setTab] = useState<'coupons' | 'pickups'>('coupons');
  const coupons = useGame((s) => s.coupons);
  const reservations = useGame((s) => s.reservations);
  const points = useGame((s) => s.points);
  const convertPoints = useGame((s) => s.convertPoints);
  const collectPick = useGame((s) => s.collectPick);
  const showToast = useUI((s) => s.showToast);

  return (
    <Screen edges={['top']}>
      <Text style={type.h1}>{t.wallet.title}</Text>
      <View style={{ marginVertical: space.lg, alignSelf: 'flex-start' }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'coupons', label: t.wallet.coupons, icon: 'ticket-percent-outline' },
            { value: 'pickups', label: t.wallet.pickups, icon: 'basket-outline' },
          ]}
        />
      </View>

      {tab === 'coupons' ? (
        <View style={{ gap: space.md }}>
          <Card color={colors.sand} style={styles.convert}>
            <IconCircle icon="star-circle" color={colors.saffron} />
            <View style={{ flex: 1 }}>
              <Text style={type.h3}>{t.wallet.convertTitle(points)}</Text>
              <Text style={type.small}>{t.wallet.convertBody}</Text>
            </View>
            <Button
              title="Convert"
              small
              disabled={points < POINTS_PER_VOUCHER}
              onPress={() => {
                if (convertPoints()) showToast('AED 5 voucher added to your wallet', 'ticket-percent');
              }}
            />
          </Card>
          {coupons.length ? (
            coupons.map((c) => <CouponCard key={c.id} coupon={c} onPress={() => router.push(`/coupon/${c.id}`)} />)
          ) : (
            <Empty icon="ticket-percent-outline" text={t.wallet.emptyCoupons} />
          )}
        </View>
      ) : (
        <View style={{ gap: space.md }}>
          {reservations.length ? (
            reservations.map((r) => {
              const pick = getPick(r.pickId);
              const shop = pick ? getShop(pick.shopId) : undefined;
              if (!pick || !shop) return null;
              const done = r.status === 'collected';
              return (
                <Card key={r.id} color={done ? colors.sand : colors.white} style={[styles.pickup, !done && { borderWidth: 1.5, borderColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={type.h3}>{pick.title}</Text>
                      <Text style={type.small}>{shop.name}</Text>
                    </View>
                    {done ? <Tag label={t.wallet.collected} color={colors.success} icon="check" /> : <Text style={styles.code}>{r.code}</Text>}
                  </View>
                  {done ? (
                    <Text style={[type.small, { color: colors.olive, fontWeight: '600' }]}>
                      <Icon name="leaf" size={14} color={colors.olive} /> You saved {pick.kg} kg of good food
                    </Text>
                  ) : (
                    <>
                      <Text style={type.small}>{t.wallet.readyAt(pick.pickupWindow)}</Text>
                      <Button
                        title={t.wallet.confirmPickup}
                        variant="dark"
                        small
                        icon="whatsapp"
                        onPress={() => {
                          if (collectPick(r.id)) router.push('/reward');
                        }}
                      />
                    </>
                  )}
                </Card>
              );
            })
          ) : (
            <Empty icon="basket-outline" text={t.wallet.emptyPickups} />
          )}
        </View>
      )}
    </Screen>
  );
}

function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={{ alignItems: 'center', gap: space.md, padding: space.xxl }}>
      <Icon name={icon} size={40} color={colors.sandDark} />
      <Text style={[type.small, { textAlign: 'center' }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  convert: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  pickup: { gap: space.sm },
  code: { fontSize: 16, fontWeight: '800', letterSpacing: 1, color: colors.terracotta },
});
