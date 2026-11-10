import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PhoneFrame } from '@/components/PhoneFrame';
import { Toast } from '@/components/Toast';
import { useHydrated } from '@/store/useUI';
import { colors, fonts } from '@/theme';

export default function RootLayout() {
  const hydrated = useHydrated();
  return (
    <PhoneFrame>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {hydrated ? (
          <Stack
            screenOptions={{
              headerTransparent: false,
              headerShadowVisible: false,
              headerTintColor: colors.brown,
              headerStyle: { backgroundColor: colors.white },
              headerTitleStyle: { fontFamily: fonts.heading, fontWeight: '700' },
              headerBackTitle: 'Back',
              contentStyle: { backgroundColor: colors.white },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="shop/[id]" options={{ title: '' }} />
            <Stack.Screen name="pick/[id]" options={{ title: 'Souq Pick' }} />
            <Stack.Screen name="coupon/[id]" options={{ title: 'Coupon' }} />
            <Stack.Screen name="challenge/[id]" options={{ title: 'Challenge' }} />
            <Stack.Screen name="reward" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="impact" options={{ title: 'Your impact' }} />
            <Stack.Screen name="shop-dashboard" options={{ title: 'Shop view' }} />
            <Stack.Screen name="demo" options={{ title: 'Demo tools' }} />
            <Stack.Screen name="qr-sheet" options={{ title: 'Shop QR codes' }} />
            <Stack.Screen name="about" options={{ title: 'About' }} />
          </Stack>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.terracotta} />
          </View>
        )}
        <Toast />
      </SafeAreaProvider>
    </PhoneFrame>
  );
}
