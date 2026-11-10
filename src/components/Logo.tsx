import { Text, View } from 'react-native';

import { t } from '@/strings';
import { colors, fonts } from '@/theme';

export function Logo({ size = 40, light }: { size?: number; light?: boolean }) {
  return (
    <View>
      <Text style={{ fontFamily: fonts.heading, fontWeight: '700', fontSize: size, color: light ? colors.saffron : colors.brown }}>{t.appName}</Text>
      <Text style={{ fontSize: size * 0.6, color: light ? colors.white : colors.terracotta, marginTop: 2 }}>{t.appNameAr}</Text>
    </View>
  );
}
