import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/store/useAuth';
import { useGame } from '@/store/useGame';
import { useUI } from '@/store/useUI';
import { colors, space, type } from '@/theme';

export default function Demo() {
  const router = useRouter();
  const g = useGame();
  const forget = useAuth((s) => s.forget);
  const showToast = useUI((s) => s.showToast);

  return (
    <Screen>
      <Text style={[type.body, { color: colors.muted }]}>Helpers for live demos. They only change data on this device.</Text>
      <View style={{ gap: space.md, marginTop: space.xl }}>
        <Card style={{ gap: space.sm }}>
          <Text style={type.h3}>Stage the Souq Week finale</Text>
          <Text style={type.small}>Adds two confirmed purchases from yesterday, so the next confirmed purchase completes Souq Week and unlocks a coupon.</Text>
          <Button title="Set Souq Week to 2/3" small icon="calendar-week" onPress={() => { g.demoSouqWeekAlmost(); showToast('Souq Week is at 2/3', 'calendar-week'); }} />
        </Card>
        <Card style={{ gap: space.sm }}>
          <Text style={type.h3}>Points</Text>
          <Button title="Add 100 points" small variant="secondary" icon="star-circle" onPress={() => { g.demoAddPoints(100); showToast('+100 points', 'star-circle'); }} />
        </Card>
        <Card style={{ gap: space.sm }}>
          <Text style={type.h3}>Printable QR codes</Text>
          <Text style={type.small}>One code per shop. Print and place them at the demo table, then scan them with the app.</Text>
          <Button title="Open QR sheet" small variant="secondary" icon="printer" onPress={() => router.push('/qr-sheet')} />
        </Card>
        <Card style={{ gap: space.sm }}>
          <Text style={type.h3}>Shop owner view</Text>
          <Button title="Open shop dashboard" small variant="secondary" icon="storefront-outline" onPress={() => router.push('/shop-dashboard')} />
        </Card>
        <Card style={{ gap: space.sm }}>
          <Text style={type.h3}>Reset</Text>
          <Button title="Reset progress (keep account)" small variant="ghost" icon="refresh" onPress={() => { g.reset(); showToast('Progress reset', 'refresh'); }} />
          <Button
            title="Full reset (sign out, delete account)"
            small
            variant="ghost"
            icon="logout"
            onPress={() => {
              g.reset();
              forget();
              router.replace('/welcome');
            }}
          />
        </Card>
      </View>
    </Screen>
  );
}
