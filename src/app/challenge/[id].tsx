import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card, Icon, IconCircle, ProgressBar, Tag } from '@/components/ui';
import { getChallenge, getCouponTemplate } from '@/data/content';
import { challengeProgress } from '@/game/rules';
import { useAuth } from '@/store/useAuth';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const ch = getChallenge(id);
  const checkIns = useGame((s) => s.checkIns);
  const reservations = useGame((s) => s.reservations);
  const storyCards = useGame((s) => s.storyCards);
  const done = useGame((s) => s.completedChallenges.includes(id));
  const household = useAuth((s) => s.account?.household);

  if (!ch) return <Screen><Text style={type.body}>Not found</Text></Screen>;
  const soon = ch.kind === 'comingSoon';
  const value = done ? ch.target : challengeProgress(ch, { checkIns, reservations, storyCards, household });
  const coupon = ch.rewardCouponId ? getCouponTemplate(ch.rewardCouponId) : undefined;

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: space.md }}>
        <IconCircle icon={done ? 'trophy' : ch.icon} color={done ? colors.success : soon ? colors.sandDark : colors.teal} size={84} />
        <Text style={[type.h1, { textAlign: 'center' }]}>{ch.title}</Text>
        <Text style={[type.body, { textAlign: 'center', color: colors.muted }]}>{ch.description}</Text>
        <Tag label={ch.fundedBy === 'shop' ? t.challenges.fundedShop : t.challenges.fundedSponsor} color={ch.fundedBy === 'shop' ? colors.olive : colors.teal} icon="hand-heart" />
      </View>

      {!soon ? (
        <Card style={{ marginTop: space.xl, gap: space.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={type.h3}>{done ? t.challenges.completed : 'Progress'}</Text>
            <Text style={[type.h3, { color: done ? colors.success : colors.terracotta }]}>
              {value} / {ch.target}
            </Text>
          </View>
          <ProgressBar value={value / ch.target} color={done ? colors.success : colors.terracotta} height={12} />
          {ch.days ? <Text style={type.small}>Within {ch.days} days</Text> : null}
        </Card>
      ) : null}

      <Text style={[type.h3, styles.h]}>{t.challenges.reward}</Text>
      <Card color={colors.brown} style={{ gap: space.sm }}>
        <View style={styles.row}>
          <Icon name="star-circle" color={colors.saffron} size={24} />
          <Text style={[type.body, { color: colors.white, fontWeight: '700' }]}>+{ch.rewardPoints} points</Text>
        </View>
        {coupon ? (
          <View style={styles.row}>
            <Icon name="ticket-percent" color={colors.saffron} size={24} />
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { color: colors.white, fontWeight: '700' }]}>{coupon.title}</Text>
              <Text style={[type.small, { color: colors.sandDark }]}>
                {t.coupon.fundedBy} {coupon.funderName}
              </Text>
            </View>
          </View>
        ) : null}
      </Card>

      <Text style={[type.h3, styles.h]}>{t.challenges.how}</Text>
      <View style={{ gap: space.md }}>
        {ch.steps.map((s, i) => (
          <View key={s} style={styles.row}>
            <View style={styles.num}>
              <Text style={{ color: colors.white, fontWeight: '800' }}>{i + 1}</Text>
            </View>
            <Text style={[type.body, { flex: 1 }]}>{s}</Text>
          </View>
        ))}
      </View>

      {!soon && !done ? <Button title={t.challenges.exploreCta} icon="map-outline" style={{ marginTop: space.xl }} onPress={() => router.navigate('/explore')} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  h: { marginTop: space.xl, marginBottom: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.terracotta, alignItems: 'center', justifyContent: 'center' },
});
