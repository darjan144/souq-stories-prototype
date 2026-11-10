import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card, Icon, IconCircle } from '@/components/ui';
import { bandLabel, getCouponTemplate } from '@/data/content';
import { getShop } from '@/data/shops';
import { useGame } from '@/store/useGame';
import { useUI } from '@/store/useUI';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

/** Pending purchase: waits for the owner's WhatsApp confirmation. */
export default function SaleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const sale = useGame((s) => s.sales.find((x) => x.id === id));
  const coupon = useGame((s) => s.coupons.find((c) => c.id === sale?.couponId));
  const confirmSale = useGame((s) => s.confirmSale);
  const ownerPanel = useUI((s) => s.ownerPanelVisible);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, []);

  if (!sale) return <Screen><Text style={type.body}>Purchase not found</Text></Screen>;
  const shop = getShop(sale.shopId);
  const tpl = coupon ? getCouponTemplate(coupon.templateId) : undefined;
  const done = sale.status === 'confirmed';

  return (
    <Screen contentStyle={{ alignItems: 'center' }}>
      <Animated.View style={{ marginTop: space.xl, opacity: done ? 1 : pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.55, 1] }) }}>
        <IconCircle icon={done ? 'check' : 'whatsapp'} color={done ? colors.success : '#25D366'} size={96} />
      </Animated.View>
      <Text style={[type.h1, { textAlign: 'center', marginTop: space.xl }]}>{done ? t.sale.confirmed : t.sale.waiting(shop?.owner ?? 'the owner')}</Text>
      <Text style={[type.body, { color: colors.muted, textAlign: 'center', marginTop: space.sm }]}>{done ? shop?.name : t.sale.waitingBody}</Text>

      <Card style={{ alignSelf: 'stretch', marginTop: space.xl, gap: space.sm }}>
        <Row icon="storefront-outline" text={shop?.name ?? ''} />
        <Row icon={sale.firstTime ? 'star-circle' : 'account-heart'} text={sale.firstTime ? 'First purchase at this shop' : 'Returning customer'} />
        {tpl ? <Row icon={tpl.kind === 'gift' ? 'gift-outline' : 'ticket-percent'} text={tpl.title} /> : null}
        {done && sale.band ? <Row icon="cash" text={bandLabel(sale.band) ?? ''} /> : null}
      </Card>

      {!done && ownerPanel ? (
        <Card color="#E7F8EE" style={{ alignSelf: 'stretch', marginTop: space.lg, flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
          <Icon name="arrow-right" color={colors.success} />
          <Text style={[type.small, { flex: 1, color: colors.brown, fontWeight: '600' }]}>{t.sale.ownerPanelHint}</Text>
        </Card>
      ) : null}
      {!done && !ownerPanel ? (
        <Button title={t.sale.demoConfirm} icon="whatsapp" variant="dark" style={{ alignSelf: 'stretch', marginTop: space.lg }} onPress={() => confirmSale(sale.id)} />
      ) : null}
      {done ? <Button title="Back to the souq" icon="map-outline" variant="secondary" style={{ alignSelf: 'stretch', marginTop: space.lg }} onPress={() => router.navigate('/explore')} /> : null}
    </Screen>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
      <Icon name={icon} color={colors.teal} />
      <Text style={[type.body, { flex: 1 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
