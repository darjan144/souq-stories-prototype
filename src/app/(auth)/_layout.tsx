import { Stack } from 'expo-router';

import { colors } from '@/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: false,
        headerShadowVisible: false,
        headerTitle: '',
        headerTintColor: colors.brown,
        headerStyle: { backgroundColor: colors.white },
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
}
