import { Text, View } from 'react-native';

import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function About() {
  return (
    <Screen>
      <Logo size={32} />
      <Text style={[type.body, { marginTop: space.lg }]}>{t.tagline}.</Text>
      <View style={{ gap: space.md, marginTop: space.xl }}>
        <Card>
          <Text style={type.h3}>Prototype notice</Text>
          <Text style={type.body}>
            Built for Bright Ideas 2026 (Sharjah Media City). The souq location is real (Souq Al Jubail, Sharjah); the shops, owners, offers, numbers and
            leaderboard are fictional sample data. Login, payments, QR verification and WhatsApp are mocked on the device.
          </Text>
        </Card>
        <Card>
          <Text style={type.h3}>Coming next</Text>
          <Text style={type.body}>Real owner story videos, Arabic and other community languages, AI-generated subtitles and stories, live shop onboarding over WhatsApp.</Text>
        </Card>
        <Card>
          <Text style={type.h3}>Credits</Text>
          <Text style={type.body}>Map data and web tiles © OpenStreetMap contributors. Photos: to be added (licence-free sources will be credited here).</Text>
        </Card>
        <Text style={[type.small, { color: colors.muted, textAlign: 'center' }]}>{t.sampleData} · v0.1</Text>
      </View>
    </Screen>
  );
}
