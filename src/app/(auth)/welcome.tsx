import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { Button, Icon } from '@/components/ui';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function Welcome() {
  const router = useRouter();
  return (
    <Screen edges={['top', 'bottom']} background={colors.brown} contentStyle={styles.content}>
      <View style={{ gap: space.md }}>
        <Logo size={44} light />
        <Text style={styles.tagline}>{t.tagline}</Text>
      </View>

      <View style={{ gap: space.lg, marginVertical: space.xxl }}>
        {t.welcome.features.map((f, i) => (
          <View key={f.title} style={styles.feature}>
            <View style={[styles.icon, { backgroundColor: [colors.teal, colors.terracotta, colors.saffron][i] }]}>
              <Icon name={f.icon} size={24} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.h3, { color: colors.white }]}>{f.title}</Text>
              <Text style={[type.small, { color: colors.sandDark }]}>{f.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ gap: space.md }}>
        <Button title={t.welcome.register} icon="account-plus" onPress={() => router.push('/register')} />
        <Button title={t.welcome.login} variant="secondary" icon="login" onPress={() => router.push('/login')} />
        <Text style={styles.note}>{t.sampleData}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'space-between', paddingTop: 48 },
  tagline: { fontSize: 18, fontStyle: 'italic', color: colors.sandDark },
  feature: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  note: { textAlign: 'center', color: colors.sandDark, fontSize: 12, marginTop: space.sm },
});
