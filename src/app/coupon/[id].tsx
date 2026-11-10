import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Screen } from '@/components/Screen';
import { Button, Card, Icon } from '@/components/ui';
import { getCouponTemplate } from '@/data/content';
import { getShop } from '@/data/shops';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function CouponScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const coupon = useGame((s) => s.coupons.find((c) => c.id === id));
  const redeemCoupon = useGame((s) => s.redeemCoupon);
  const tpl = coupon ? getCouponTemplate(coupon.templateId) : undefined;

  if (!coupon || !tpl) return <Screen><Text style={type.body}>Coupon not found</Text></Screen>;
  const shop = tpl.shopId ? getShop(tpl.shopId) : undefined;
  const redeemed = coupon.status === 'redeemed';

  return (
    <Screen>
      <Card color={colors.brown} style={styles.ticket}>
        <Text style={[type.label, { color: colors.saffron }]}>{tpl.fundedBy === 'shop' ? t.challenges.fundedShop : t.challenges.fundedSponsor}</Text>
        <Text style={[type.h2, { color: colors.white, textAlign: 'center' }]}>{tpl.title}</Text>
        <Text style={[type.small, { color: colors.sandDark, textAlign: 'center' }]}>{tpl.description}</Text>

        <View style={styles.qr}>
          {redeemed ? (
            <View style={styles.redeemed}>
              <Icon name="check-circle" size={96} color={colors.success} />
            </View>
          ) : (
            <QRCode value={`souqstories://redeem/${coupon.code}`} size={180} color={colors.brown} backgroundColor={colors.white} />
          )}
        </View>
        <Text style={styles.code}>{coupon.code}</Text>
      </Card>

      <View style={{ gap: space.sm, marginTop: space.xl }}>
        <Row icon="storefront-outline" label={t.coupon.validAt} value={shop ? shop.name : t.coupon.anyShop} />
        <Row icon="hand-heart" label={t.coupon.fundedBy} value={tpl.funderName} />
      </View>

      {redeemed ? (
        <Card color={colors.sand} style={{ marginTop: space.xl, flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
          <Icon name="heart-outline" color={colors.terracotta} />
          <Text style={[type.body, { flex: 1 }]}>{t.coupon.redeemed}</Text>
        </Card>
      ) : (
        <>
          <Text style={[type.small, { marginTop: space.xl, textAlign: 'center' }]}>{t.coupon.showShop}</Text>
          <Button title={t.coupon.simulate} icon="whatsapp" variant="dark" style={{ marginTop: space.md }} onPress={() => redeemCoupon(coupon.id)} />
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
  qr: { backgroundColor: colors.white, padding: 14, borderRadius: 16, marginTop: space.md },
  redeemed: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  code: { fontSize: 22, fontWeight: '800', letterSpacing: 3, color: colors.saffron, marginTop: space.sm },
});
