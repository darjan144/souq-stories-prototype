import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card, Icon } from '@/components/ui';
import { categories } from '@/data/categories';
import { shops } from '@/data/shops';
import { parseShopCode } from '@/game/rules';
import { useGame } from '@/store/useGame';
import { useUI } from '@/store/useUI';
import { t } from '@/strings';
import { colors, radius, space, type } from '@/theme';

export default function Scan() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [focused, setFocused] = useState(false);
  const busy = useRef(false);
  const checkIn = useGame((s) => s.checkIn);
  const showToast = useUI((s) => s.showToast);

  // Only one camera preview may be active; unmount it when leaving the tab.
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      busy.current = false;
      return () => setFocused(false);
    }, []),
  );

  const handle = (data: string) => {
    if (busy.current) return;
    busy.current = true;
    const shopId = parseShopCode(data);
    if (!shopId) {
      showToast(t.scan.invalid, 'close');
      setTimeout(() => (busy.current = false), 1500);
      return;
    }
    checkIn(shopId);
    router.push('/reward');
  };

  return (
    <Screen edges={['top']}>
      <Text style={type.h1}>{t.scan.title}</Text>
      <Text style={[type.body, { color: colors.muted, marginTop: space.sm }]}>{t.scan.body}</Text>

      <View style={styles.cameraBox}>
        {permission?.granted && focused ? (
          <CameraView style={StyleSheet.absoluteFill} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={(r) => handle(r.data)} />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="qrcode-scan" size={56} color={colors.sandDark} />
            {permission && !permission.granted && !permission.canAskAgain ? (
              <Text style={[type.small, { color: colors.sand, textAlign: 'center' }]}>{t.scan.noCamera}</Text>
            ) : (
              <Button title={t.scan.allow} icon="camera" small onPress={requestPermission} />
            )}
          </View>
        )}
        <View style={styles.frame} pointerEvents="none" />
      </View>

      <Text style={[type.h3, { marginTop: space.xl, marginBottom: space.md }]}>{t.scan.simulateTitle}</Text>
      <View style={{ gap: space.sm }}>
        {shops.map((s) => (
          <Card key={s.id} color={colors.sand} onPress={() => handle(`souqstories://checkin/${s.id}`)} style={styles.sim}>
            <View style={[styles.dot, { backgroundColor: categories[s.category].color }]}>
              <Icon name={categories[s.category].icon} size={16} color={colors.white} />
            </View>
            <Text style={[type.body, { flex: 1, fontWeight: '600' }]}>{s.name}</Text>
            <Icon name="qrcode" color={colors.muted} />
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraBox: { height: 300, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.brown, marginTop: space.xl },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.lg, padding: space.xl },
  frame: { position: 'absolute', top: 50, bottom: 50, left: '20%', right: '20%', borderWidth: 3, borderColor: colors.saffron, borderRadius: 20 },
  sim: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 12 },
  dot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
