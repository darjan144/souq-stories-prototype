import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { categories } from '@/data/categories';
import type { Shop } from '@/data/types';
import { colors } from '@/theme';
import { Icon } from './ui';

/** Shop photo when available, otherwise an illustrated tile in the category colour. */
export function ShopArt({ shop, height = 120, rounded = 16, style, iconSize, hideIcon }: { shop: Shop; height?: number; rounded?: number; style?: StyleProp<ViewStyle>; iconSize?: number; hideIcon?: boolean }) {
  const cat = categories[shop.category];
  if (shop.image) {
    return <Image source={shop.image} style={[{ height, borderRadius: rounded, width: '100%' }, style as object]} resizeMode="cover" />;
  }
  const size = iconSize ?? Math.min(64, height * 0.45);
  return (
    <View style={[styles.tile, { height, borderRadius: rounded, backgroundColor: cat.color }, style]}>
      <View style={[styles.blob, { width: height * 1.1, height: height * 1.1, borderRadius: height, right: -height * 0.35, top: -height * 0.4 }]} />
      <View style={[styles.blob, { width: height * 0.7, height: height * 0.7, borderRadius: height, left: -height * 0.2, bottom: -height * 0.3 }]} />
      {hideIcon ? null : <Icon name={cat.icon} size={size} color={colors.white} />}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { width: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blob: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.12)' },
});
