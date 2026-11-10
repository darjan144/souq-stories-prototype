import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { categories } from '@/data/categories';
import { SOUQ } from '@/data/shops';
import { colors } from '@/theme';
import type { SouqMapProps } from './SouqMap.types';
import { Icon } from './ui';

// iOS: Apple Maps, Android: Google Maps. Both work in Expo Go without API keys.
export function SouqMap({ shops, selectedId, onSelect }: SouqMapProps) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{ ...SOUQ.center, latitudeDelta: 0.0045, longitudeDelta: 0.0045 }}
      showsPointsOfInterests={false}
      showsUserLocation={false}
      toolbarEnabled={false}
      onPress={(e) => {
        if (e.nativeEvent.action !== 'marker-press') onSelect(null);
      }}
    >
      {shops.map((s) => {
        const selected = s.id === selectedId;
        const cat = categories[s.category];
        return (
          <Marker key={s.id} coordinate={s.coords} onPress={() => onSelect(s.id)} title={s.name} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.pin, { backgroundColor: cat.color }, selected && styles.selected]}>
              <Icon name={cat.icon} size={selected ? 22 : 18} color={colors.white} />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  selected: { width: 46, height: 46, borderRadius: 23, borderWidth: 3 },
});
