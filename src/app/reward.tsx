import { Redirect, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Icon, IconCircle, ProgressBar } from '@/components/ui';
import { getBadge, getChallenge, getCouponTemplate } from '@/data/content';
import { getShop } from '@/data/shops';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function Reward() {
  const router = useRouter();
  const reward = useGame((s) => s.lastReward);
  const coupons = useGame((s) => s.coupons);
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, []);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/explore'));
  if (!reward) return <Redirect href="/explore" />;
  const shop = reward.shopId ? getShop(reward.shopId) : undefined;
  const already = reward.alreadyDone;
  const title = already ? t.reward.already : reward.kind === 'collect' ? t.reward.collect : t.reward.checkin;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.burst, { transform: [{ scale: pop }] }]}>
          {already ? <Icon name="clock-outline" size={56} color={colors.white} /> : <Text style={styles.points}>+{reward.points}</Text>}
          {!already ? <Text style={styles.pointsLabel}>{t.reward.points}</Text> : null}
        </Animated.View>

        <Text style={[type.h1, { color: colors.white, textAlign: 'center' }]}>{title}</Text>
        {shop ? <Text style={[type.body, { color: colors.sandDark, textAlign: 'center' }]}>{shop.name}</Text> : null}
        {already ? <Text style={[type.body, { color: colors.sand, textAlign: 'center' }]}>{t.reward.alreadyBody}</Text> : null}
        {reward.kind === 'collect' && reward.kgSaved ? (
          <Text style={[type.h3, { color: colors.saffron, textAlign: 'center' }]}>You saved {reward.kgSaved} kg of good food</Text>
        ) : null}

        <View style={{ gap: space.md, marginTop: space.xl, alignSelf: 'stretch' }}>
          {reward.badges.map((id) => {
            const b = getBadge(id);
            return b ? (
              <Card key={id} color={colors.white} style={styles.row}>
                <IconCircle icon={b.icon} color={b.color} />
                <View style={{ flex: 1 }}>
                  <Text style={type.label}>{t.reward.unlockedBadge}</Text>
                  <Text style={type.h3}>{b.name}</Text>
                </View>
              </Card>
            ) : null;
          })}
          {reward.challenges.map((id) => {
            const c = getChallenge(id);
            return c ? (
              <Card key={id} color={colors.saffron} style={styles.row}>
                <IconCircle icon="trophy" color={colors.brown} />
                <View style={{ flex: 1 }}>
                  <Text style={[type.label, { color: colors.brown }]}>{t.reward.completed}</Text>
                  <Text style={type.h3}>
                    {c.title} · +{c.rewardPoints} pts
                  </Text>
                </View>
              </Card>
            ) : null;
          })}
          {reward.coupons.map((id) => {
            const owned = coupons.find((c) => c.id === id);
            const tpl = owned ? getCouponTemplate(owned.templateId) : undefined;
            return tpl ? (
              <Card key={id} color={colors.white} style={styles.row} onPress={() => router.replace(`/coupon/${id}`)}>
                <IconCircle icon="ticket-percent" color={colors.terracotta} />
                <View style={{ flex: 1 }}>
                  <Text style={type.label}>{t.reward.newCoupon}</Text>
                  <Text style={type.h3}>{tpl.title}</Text>
                </View>
                <Icon name="chevron-right" />
              </Card>
            ) : null;
          })}
          {!already && reward.progress.filter((p) => !reward.challenges.includes(p.challengeId)).length ? (
            <Card color="rgba(255,255,255,0.08)" style={{ gap: space.md }}>
              <Text style={[type.label, { color: colors.sandDark }]}>{t.reward.progress}</Text>
              {reward.progress
                .filter((p) => !reward.challenges.includes(p.challengeId))
                .map((p) => (
                  <View key={p.challengeId} style={{ gap: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.white, fontWeight: '600' }}>{getChallenge(p.challengeId)?.title}</Text>
                      <Text style={{ color: colors.sandDark }}>
                        {p.value} / {p.target}
                      </Text>
                    </View>
                    <ProgressBar value={p.value / p.target} color={colors.saffron} />
                  </View>
                ))}
            </Card>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {reward.coupons.length ? <Button title={t.reward.openWallet} variant="secondary" icon="ticket-percent-outline" onPress={() => router.replace('/wallet')} /> : null}
        <Button title={t.reward.done} onPress={close} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brown },
  content: { padding: space.xl, alignItems: 'center', gap: space.sm },
  burst: { width: 150, height: 150, borderRadius: 75, backgroundColor: colors.terracotta, alignItems: 'center', justifyContent: 'center', marginVertical: space.xl, borderWidth: 6, borderColor: colors.saffron },
  points: { fontSize: 48, fontWeight: '800', color: colors.white },
  pointsLabel: { color: colors.sand, fontWeight: '700', marginTop: -4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  footer: { padding: space.xl, gap: space.md },
});
