import { Redirect, Tabs } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useAuth } from '@/store/useAuth';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { colors } from '@/theme';

function ScanButton({ onPress }: { onPress?: (...args: any[]) => void }) {
  return (
    <View style={styles.scanWrap}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={t.tabs.scan} style={({ pressed }) => [styles.scan, pressed && { opacity: 0.85 }]}>
        <Icon name="qrcode-scan" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const loggedIn = useAuth((s) => s.loggedIn);
  const activeCoupons = useGame((s) => s.coupons.filter((c) => c.status === 'active').length + s.reservations.filter((r) => r.status === 'reserved').length);
  if (!loggedIn) return <Redirect href="/welcome" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontWeight: '600', fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.border, backgroundColor: colors.white },
      }}
    >
      <Tabs.Screen name="explore" options={{ title: t.tabs.explore, tabBarIcon: ({ color }) => <Icon name="map-outline" color={color} size={24} /> }} />
      <Tabs.Screen name="challenges" options={{ title: t.tabs.challenges, tabBarIcon: ({ color }) => <Icon name="flag-checkered" color={color} size={24} /> }} />
      <Tabs.Screen name="scan" options={{ title: t.tabs.scan, tabBarButton: (props) => <ScanButton onPress={props.onPress} /> }} />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t.tabs.wallet,
          tabBarIcon: ({ color }) => <Icon name="ticket-percent-outline" color={color} size={24} />,
          tabBarBadge: activeCoupons || undefined,
          tabBarBadgeStyle: { backgroundColor: colors.terracotta },
        }}
      />
      <Tabs.Screen name="profile" options={{ title: t.tabs.profile, tabBarIcon: ({ color }) => <Icon name="account-circle" color={color} size={24} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanWrap: { flex: 1, alignItems: 'center' },
  scan: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -18,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
