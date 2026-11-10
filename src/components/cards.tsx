import { StyleSheet, Text, View } from 'react-native';

import { categories } from '@/data/categories';
import { getCouponTemplate, picksForShop } from '@/data/content';
import { getShop } from '@/data/shops';
import type { Badge, Challenge, Shop, SouqPick } from '@/data/types';
import type { OwnedCoupon } from '@/game/rules';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';
import { ShopArt } from './ShopArt';
import { Card, Icon, IconCircle, ProgressBar, Tag } from './ui';

export function ShopCard({ shop, onPress }: { shop: Shop; onPress: () => void }) {
  const cat = categories[shop.category];
  const count = picksForShop(shop.id).length;
  return (
    <Card onPress={onPress} style={styles.row}>
      <View style={{ width: 76 }}>
        <ShopArt shop={shop} height={76} rounded={14} iconSize={34} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={type.h3} numberOfLines={1}>
          {shop.name}
        </Text>
        <Text style={type.small} numberOfLines={2}>
          {shop.tagline}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 2 }}>
          <Tag label={cat.label} color={cat.color} />
          {count ? <Tag label={`${count} Souq Pick${count > 1 ? 's' : ''}`} color={colors.terracotta} icon="basket-outline" /> : null}
        </View>
      </View>
    </Card>
  );
}

export function PickCard({ pick, onPress, showShop }: { pick: SouqPick; onPress: () => void; showShop?: boolean }) {
  const info = t.pick.types[pick.type];
  const shop = getShop(pick.shopId);
  return (
    <Card onPress={onPress} color={colors.white} style={styles.pick}>
      <View style={{ flex: 1, gap: 4 }}>
        <Tag label={info.label} color={pick.type === 'naturallyShaped' ? colors.olive : pick.type === 'freshToday' ? colors.teal : colors.terracotta} />
        <Text style={type.h3}>{pick.title}</Text>
        {showShop && shop ? <Text style={type.small}>{shop.name}</Text> : null}
        <Text style={type.small}>
          {t.pick.pickup} {pick.pickupWindow} · {t.pick.left(pick.left)}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.price}>AED {pick.price}</Text>
        <Text style={styles.usual}>
          {t.pick.usual} {pick.usualPrice}
        </Text>
      </View>
    </Card>
  );
}

export function ChallengeCard({ challenge, value, done, onPress }: { challenge: Challenge; value: number; done?: boolean; onPress: () => void }) {
  const soon = challenge.kind === 'comingSoon';
  const color = done ? colors.success : soon ? colors.muted : colors.terracotta;
  return (
    <Card onPress={onPress} style={{ gap: space.md }}>
      <View style={styles.row}>
        <IconCircle icon={done ? 'check' : challenge.icon} color={done ? colors.success : soon ? colors.sandDark : colors.teal} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.h3}>{challenge.title}</Text>
          <Text style={type.small}>{challenge.description}</Text>
        </View>
      </View>
      {!soon ? (
        <View style={{ gap: 6 }}>
          <View style={styles.between}>
            <Text style={[type.small, { fontWeight: '700', color }]}>{done ? t.challenges.completed : `${value} / ${challenge.target}`}</Text>
            <Text style={type.small}>
              +{challenge.rewardPoints} pts{challenge.rewardCouponId ? ' + coupon' : ''}
            </Text>
          </View>
          <ProgressBar value={done ? 1 : value / challenge.target} color={color} />
        </View>
      ) : (
        <Tag label={t.challenges.soon} color={colors.muted} icon="clock-outline" />
      )}
    </Card>
  );
}

export function CouponCard({ coupon, onPress }: { coupon: OwnedCoupon; onPress: () => void }) {
  const tpl = getCouponTemplate(coupon.templateId);
  if (!tpl) return null;
  const redeemed = coupon.status === 'redeemed';
  return (
    <Card onPress={onPress} color={redeemed ? colors.sand : colors.brown} style={[styles.row, { opacity: redeemed ? 0.7 : 1 }]}>
      <IconCircle icon={redeemed ? 'check' : tpl.kind === 'gift' ? 'gift-outline' : 'ticket-percent'} color={redeemed ? colors.muted : colors.saffron} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.h3, { color: redeemed ? colors.brown : colors.white }]}>{tpl.title}</Text>
        <Text style={[type.small, { color: redeemed ? colors.muted : colors.sandDark }]}>
          {redeemed ? 'Redeemed' : coupon.status === 'pending' ? t.wallet.pending : tpl.kind === 'gift' ? t.coupon.gift : t.coupon.amountOff(tpl.value ?? 0)}
        </Text>
      </View>
      <Icon name="chevron-right" color={redeemed ? colors.muted : colors.white} />
    </Card>
  );
}

export function BadgeTile({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
  return (
    <View style={styles.badge}>
      <View style={[styles.badgeIcon, { backgroundColor: unlocked ? badge.color : colors.border }]}>
        <Icon name={unlocked ? badge.icon : 'lock'} size={26} color={unlocked ? colors.white : colors.muted} />
      </View>
      <Text style={[styles.badgeName, !unlocked && { color: colors.muted }]} numberOfLines={2}>
        {badge.name}
      </Text>
    </View>
  );
}

export function StatTile({ value, label, icon, color = colors.teal }: { value: string | number; label: string; icon: string; color?: string }) {
  return (
    <Card style={styles.stat}>
      <Icon name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={type.small}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  pick: { flexDirection: 'row', gap: space.md, borderWidth: 1.5, borderColor: colors.border },
  price: { fontSize: 18, fontWeight: '800', color: colors.terracotta },
  usual: { fontSize: 12, color: colors.muted, textDecorationLine: 'line-through' },
  badge: { width: '30%', alignItems: 'center', gap: 6, marginBottom: space.lg },
  badgeIcon: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
  badgeName: { fontSize: 12, fontWeight: '700', textAlign: 'center', color: colors.brown },
  stat: { width: '48%', gap: 4, marginBottom: space.md },
  statValue: { fontSize: 26, fontWeight: '800', color: colors.brown },
});
