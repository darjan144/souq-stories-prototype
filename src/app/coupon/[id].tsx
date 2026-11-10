import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card, Icon } from '@/components/ui';
import { getCouponTemplate } from '@/data/content';
import { getShop } from '@/data/shops';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function CouponScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const coupon = useGame((s) => s.coupons.find((c) => c.id === id));
  const tpl = coupon ? getCouponTemplate(coupon.templateId) : undefined;

  if (!coupon || !tpl) return <Screen><Text style={type.body}>Coupon not found</Text></Screen>;
  const shop = tpl.shopId ? getShop(tpl.shopId) : undefined;
  const gift = tpl.kind === 'gift';

  return (
    <Screen>
      <Card color={colors.brown} style={styles.ticket}>
        <Icon name={gift ? 'gift-outline' : 'ticket-percent'} size={44} color={colors.saffron} />
        <Text style={[type.label, { color: colors.saffron }]}>{gift ? t.coupon.gift : t.coupon.amountOff(tpl.value ?? 0)}</Text>
        <Text style={[type.h2, { color: colors.white, textAlign: 'center' }]}>{tpl.title}</Text>
        <Text style={[type.small, { color: colors.sandDark, textAlign: 'center' }]}>{tpl.description}</Text>
        <Text style={styles.code}>{coupon.code}</Text>
      </Card>

      <View style={{ gap: space.sm, marginTop: space.xl }}>
        <Row icon="storefront-outline" label={t.coupon.validAt} value={shop ? shop.name : t.coupon.anyShop} />
        <Row icon="hand-heart" label={t.coupon.fundedBy} value={`${tpl.funderName}${tpl.fundedBy === 'sponsor' ? ' (shop is reimbursed by bank transfer)' : ''}`} />
      </View>

      {coupon.status === 'redeemed' ? (
        <Card color={colors.sand} style={styles.note}>
          <Icon name="check-circle" color={colors.success} />
          <Text style={[type.body, { flex: 1 }]}>{t.coupon.redeemed}</Text>
        </Card>
      ) : coupon.status === 'pending' ? (
        <Card color={colors.sand} style={styles.note}>
          <Icon name="whatsapp" color={colors.success} />
          <Text style={[type.body, { flex: 1 }]}>{t.coupon.pending}</Text>
        </Card>
      ) : (
        <>
          <Card color="#FFF4DF" style={[styles.note, { borderWidth: 1.5, borderColor: '#F2D9A6' }]}>
            <Icon name="information-outline" color={colors.spice} />
            <Text style={[type.body, { flex: 1 }]}>{t.coupon.howTo}</Text>
          </Card>
          <Button title={t.coupon.useNow} icon="qrcode-scan" style={{ marginTop: space.lg }} onPress={() => router.navigate('/scan')} />
        </>
      )}
    </Screen>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
      <Icon name={icon} color={colors.teal} />
      <Text style={[type.small, { width: 80 }]}>{label}</Text>
      <Text style={[type.body, { flex: 1, fontWeight: '600' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ticket: { alignItems: 'center', gap: space.sm, paddingVertical: space.xl },
  code: { fontSize: 22, fontWeight: '800', letterSpacing: 3, color: colors.saffron, marginTop: space.sm },
  note: { flexDirection: 'row', gap: space.md, alignItems: 'center', marginTop: space.xl },
});
