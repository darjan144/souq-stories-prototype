import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BadgeTile } from '@/components/cards';
import { Screen } from '@/components/Screen';
import { Card, Icon, ProgressBar, SectionTitle } from '@/components/ui';
import { badges, leaderboard } from '@/data/content';
import { impactOf, levelFor } from '@/game/rules';
import { useAuth } from '@/store/useAuth';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function Profile() {
  const router = useRouter();
  const account = useAuth((s) => s.account);
  const signOut = useAuth((s) => s.signOut);
  const g = useGame();
  const lvl = levelFor(g.xp);
  const imp = impactOf({ checkIns: g.checkIns, reservations: g.reservations, storyCards: g.storyCards, household: account?.household });
  const initials = (account?.name ?? 'S').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  const board = [...leaderboard, ...(account?.household ? [{ household: account.household, xp: g.xp, me: true }] : [])].sort((a, b) => b.xp - a.xp);

  return (
    <Screen edges={['top']}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.h2}>{account?.name}</Text>
          <Text style={type.small}>{account?.household ? `${account.household} · family mode` : `+971 ${account?.phone ?? ''}`}</Text>
        </View>
      </View>

      <Card color={colors.brown} style={{ gap: space.md, marginTop: space.xl }}>
        <View style={styles.between}>
          <View>
            <Text style={[type.label, { color: colors.sandDark }]}>{t.profile.level}</Text>
            <Text style={[type.h2, { color: colors.saffron }]}>{lvl.current.name}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.points}>{g.points}</Text>
            <Text style={[type.small, { color: colors.sandDark }]}>{t.profile.points}</Text>
          </View>
        </View>
        <ProgressBar value={lvl.progress} color={colors.saffron} />
        <Text style={[type.small, { color: colors.sand }]}>{lvl.next ? t.profile.toNext(lvl.toNext, lvl.next.name) : t.profile.maxLevel}</Text>
      </Card>

      <SectionTitle title={t.profile.impact} action={t.profile.seeImpact} onAction={() => router.push('/impact')} />
      <View style={styles.impactRow}>
        <ImpactStat value={imp.shopsSupported} label="shops" icon="storefront-outline" color={colors.teal} />
        <ImpactStat value={imp.kgSaved} label="kg saved" icon="leaf" color={colors.olive} />
        <ImpactStat value={`${imp.seasonalShare}%`} label="in season" icon="sprout" color={colors.saffron} />
      </View>

      <SectionTitle title={`${t.profile.badges} · ${g.badges.length}/${badges.length}`} />
      <View style={styles.badges}>
        {badges.map((b) => (
          <BadgeTile key={b.id} badge={b} unlocked={g.badges.includes(b.id)} />
        ))}
      </View>

      <SectionTitle title={t.profile.leaderboard} />
      <Card style={{ gap: 2, paddingVertical: space.sm }}>
        {board.map((row, i) => {
          const me = 'me' in row && row.me;
          return (
            <View key={row.household} style={[styles.boardRow, me && styles.me]}>
              <Text style={[styles.rank, i < 3 && { color: colors.terracotta }]}>{i + 1}</Text>
              <Text style={[type.body, { flex: 1, fontWeight: me ? '800' : '500' }]}>{row.household}{me ? ' (you)' : ''}</Text>
              <Text style={[type.body, { fontWeight: '700' }]}>{row.xp}</Text>
            </View>
          );
        })}
        {!account?.household ? <Text style={[type.small, { padding: space.sm }]}>Add a household name at registration to join the leaderboard.</Text> : null}
      </Card>

      <View style={{ marginTop: space.xl, gap: space.sm }}>
        <MenuRow icon="storefront-outline" label="Shop view (owner dashboard)" onPress={() => router.push('/shop-dashboard')} />
        <MenuRow icon="tools" label={t.profile.demo} onPress={() => router.push('/demo')} />
        <MenuRow icon="information-outline" label={t.profile.about} onPress={() => router.push('/about')} />
        <MenuRow
          icon="logout"
          label={t.profile.signOut}
          onPress={() => {
            signOut();
            router.replace('/welcome');
          }}
        />
      </View>
    </Screen>
  );
}

function ImpactStat({ value, label, icon, color }: { value: string | number; label: string; icon: string; color: string }) {
  return (
    <Card style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <Icon name={icon} color={color} size={22} />
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.brown }}>{value}</Text>
      <Text style={type.small}>{label}</Text>
    </Card>
  );
}

function MenuRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Card color={colors.white} onPress={onPress} style={styles.menu}>
      <Icon name={icon} color={colors.teal} />
      <Text style={[type.body, { flex: 1, fontWeight: '600' }]}>{label}</Text>
      <Icon name="chevron-right" color={colors.muted} />
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.terracotta, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.white, fontSize: 24, fontWeight: '800' },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  points: { fontSize: 32, fontWeight: '800', color: colors.white },
  impactRow: { flexDirection: 'row', gap: space.sm },
  badges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  boardRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 10, paddingHorizontal: space.sm, borderRadius: 10 },
  me: { backgroundColor: colors.white },
  rank: { width: 22, fontWeight: '800', color: colors.muted, fontSize: 16 },
  menu: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderWidth: 1.5, borderColor: colors.border },
});
