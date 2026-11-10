import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUI } from '@/store/useUI';
import { colors } from '@/theme';
import { Icon } from './ui';

export function Toast() {
  const toast = useUI((s) => s.toast);
  const hide = useUI((s) => s.hideToast);
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return;
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();
    const t = setTimeout(() => Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => hide()), 2400);
    return () => clearTimeout(t);
  }, [toast?.id]);

  if (!toast) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        { top: insets.top + 10, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] },
      ]}
    >
      <Icon name={toast.icon ?? 'check-circle'} size={20} color={colors.saffron} />
      <Text style={styles.text}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.brown,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    zIndex: 100,
    elevation: 10,
  },
  text: { color: colors.white, fontWeight: '700', fontSize: 15, flex: 1 },
});
