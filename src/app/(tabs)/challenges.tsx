import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { ChallengeCard } from '@/components/cards';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/ui';
import { challenges } from '@/data/content';
import { challengeProgress } from '@/game/rules';
import { useGame, useSnapshot } from '@/store/useGame';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function Challenges() {
  const router = useRouter();
  const completed = useGame((s) => s.completedChallenges);
  const snap = useSnapshot();

  const active = challenges.filter((c) => c.kind !== 'comingSoon' && !completed.includes(c.id));
  const done = challenges.filter((c) => completed.includes(c.id));
  const soon = challenges.filter((c) => c.kind === 'comingSoon');
  const open = (id: string) => router.push(`/challenge/${id}`);

  return (
    <Screen edges={['top']}>
      <Text style={type.h1}>{t.challenges.title}</Text>
      <Text style={[type.body, { color: colors.muted, marginTop: space.sm }]}>{t.challenges.subtitle}</Text>

      {active.length ? <SectionTitle title={t.challenges.active} /> : null}
      <View style={{ gap: space.md }}>
        {active.map((c) => (
          <ChallengeCard key={c.id} challenge={c} value={challengeProgress(c, snap)} onPress={() => open(c.id)} />
        ))}
      </View>

      {done.length ? <SectionTitle title={t.challenges.completed} /> : null}
      <View style={{ gap: space.md }}>
        {done.map((c) => (
          <ChallengeCard key={c.id} challenge={c} value={c.target} done onPress={() => open(c.id)} />
        ))}
      </View>

      <SectionTitle title={t.challenges.soon} />
      <View style={{ gap: space.md }}>
        {soon.map((c) => (
          <ChallengeCard key={c.id} challenge={c} value={0} onPress={() => open(c.id)} />
        ))}
      </View>
    </Screen>
  );
}
