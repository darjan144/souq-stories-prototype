import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ShopArt } from '@/components/ShopArt';
import { SouqTips } from '@/components/SouqTips';
import { Button, Icon } from '@/components/ui';
import { getCouponTemplate } from '@/data/content';
import { getShop } from '@/data/shops';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { colors, radius, space, type } from '@/theme';

/** After scanning a shop's purchase QR: optional coupon, first-time question, then send to the owner. */
export default function Purchase() {
  const { shopId, coupon } = useLocalSearchParams<{ shopId: string; coupon?: string }>();
  const router = useRouter();
  const shop = getShop(shopId);
  const coupons = useGame((s) => s.coupons);
  const startPurchase = useGame((s) => s.startPurchase);
  const usable = coupons.filter((c) => c.status === 'active' && (() => {
    const tpl = getCouponTemplate(c.templateId);
    return tpl && (!tpl.shopId || tpl.shopId === shopId);
  })());
  const [couponId, setCouponId] = useState<string | undefined>(usable.some((c) => c.id === coupon) ? coupon : undefined);
  const [firstTime, setFirstTime] = useState<boolean | null>(null);

  if (!shop) return <Screen><Text style={type.body}>Shop not found</Text></Screen>;

  return (
    <Screen>
      <View style={styles.head}>
        <View style={{ width: 64 }}>
          <ShopArt shop={shop} height={64} rounded={14} iconSize={28} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.h2}>{shop.name}</Text>
          <Text style={type.small}>{t.purchase.intro(shop.name)}</Text>
        </View>
      </View>

      <View style={{ marginTop: space.lg }}>
        <SouqTips owner={shop.owner} compact />
      </View>

      <Text style={[type.h3, styles.h]}>{t.purchase.firstTime}</Text>
      <View style={{ gap: space.sm }}>
        <Option label={t.purchase.yes} icon="star-circle" selected={firstTime === true} onPress={() => setFirstTime(true)} />
        <Option label={t.purchase.no} icon="account-heart" selected={firstTime === false} onPress={() => setFirstTime(false)} />
      </View>

      <Text style={[type.h3, styles.h]}>{t.purchase.coupon}</Text>
      <Text style={[type.small, { marginBottom: space.sm }]}>{t.purchase.couponHint}</Text>
      <View style={{ gap: space.sm }}>
        <Option label={t.purchase.noCoupon} icon="close" selected={!couponId} onPress={() => setCouponId(undefined)} />
        {usable.map((c) => {
          const tpl = getCouponTemplate(c.templateId)!;
          return (
            <Option
              key={c.id}
              label={tpl.title}
              sub={tpl.kind === 'gift' ? t.coupon.gift : t.coupon.amountOff(tpl.value ?? 0)}
              icon={tpl.kind === 'gift' ? 'gift-outline' : 'ticket-percent'}
              selected={couponId === c.id}
              onPress={() => setCouponId(c.id)}
            />
          );
        })}
      </View>

      <Button
        title={t.purchase.send}
        icon="whatsapp"
        style={{ marginTop: space.xl }}
        disabled={firstTime === null}
        onPress={() => {
          const sale = startPurchase(shop.id, firstTime === true, couponId);
          router.replace(`/sale/${sale.id}`);
        }}
      />
    </Screen>
  );
}

function Option({ label, sub, icon, selected, onPress }: { label: string; sub?: string; icon: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[styles.option, selected && styles.optionOn]}>
      <Icon name={icon} color={selected ? colors.terracotta : colors.muted} />
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontWeight: '600' }]}>{label}</Text>
        {sub ? <Text style={type.small}>{sub}</Text> : null}
      </View>
      <Icon name={selected ? 'check-circle' : 'checkbox-blank-circle-outline'} color={selected ? colors.terracotta : colors.sandDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', gap: space.md, alignItems: 'center' },
  h: { marginTop: space.xl, marginBottom: space.sm },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border },
  optionOn: { borderColor: colors.terracotta, backgroundColor: '#FDF1EC' },
});
