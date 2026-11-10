import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ShopCard } from '@/components/cards';
import { ShopArt } from '@/components/ShopArt';
import { SouqMap } from '@/components/SouqMap';
import { Button, Card, Chip, Icon, Segmented, Tag } from '@/components/ui';
import { categories } from '@/data/categories';
import { picks, picksForShop } from '@/data/content';
import { getShop, shops } from '@/data/shops';
import type { Category } from '@/data/types';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function Explore() {
  const router = useRouter();
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const visible = useMemo(() => (cat === 'all' ? shops : shops.filter((s) => s.category === cat)), [cat]);
  const sel = selected ? getShop(selected) : undefined;
  const open = (id: string) => router.push(`/shop/${id}`);

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={type.label}>{t.explore.eyebrow}</Text>
          <Text style={type.h1}>{t.explore.title}</Text>
        </View>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label={t.explore.all} selected={cat === 'all'} onPress={() => setCat('all')} />
          {(Object.keys(categories) as Category[]).map((c) => (
            <Chip key={c} label={categories[c].label} icon={categories[c].icon} color={categories[c].color} selected={cat === c} onPress={() => setCat(c)} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.banner}>
          <Icon name="basket-outline" size={16} color={colors.white} />
          <Text style={styles.bannerText}>{t.explore.picksToday(picks.length)}</Text>
        </View>
        <Segmented
          iconOnly
          value={mode}
          onChange={setMode}
          options={[
            { value: 'map', label: t.explore.map, icon: 'map-outline' },
            { value: 'list', label: t.explore.list, icon: 'format-list-bulleted' },
          ]}
        />
      </View>

      {mode === 'map' ? (
        <View style={styles.mapWrap}>
          <SouqMap shops={visible} selectedId={selected} onSelect={setSelected} />
          {sel ? (
            <Card color={colors.white} style={styles.selCard}>
              <View style={{ flexDirection: 'row', gap: space.md }}>
                <View style={{ width: 84 }}>
                  <ShopArt shop={sel} height={84} rounded={14} iconSize={36} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={type.h3}>{sel.name}</Text>
                  <Text style={type.small} numberOfLines={2}>
                    {sel.tagline}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <Tag label={sel.hours} color={colors.teal} icon="clock-outline" />
                    {picksForShop(sel.id).length ? (
                      <Tag label={`${picksForShop(sel.id).length} Souq Pick${picksForShop(sel.id).length > 1 ? 's' : ''}`} color={colors.terracotta} />
                    ) : null}
                  </View>
                </View>
              </View>
              <Button title={t.explore.openShop} icon="play-circle" small onPress={() => open(sel.id)} style={{ marginTop: space.md }} />
            </Card>
          ) : (
            <View style={styles.hint} pointerEvents="none">
              <Text style={styles.hintText}>{t.explore.tapHint}</Text>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{ padding: space.xl, gap: space.md }}
          renderItem={({ item }) => <ShopCard shop={item} onPress={() => open(item.id)} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md, paddingHorizontal: space.xl, paddingTop: space.md },
  chips: { gap: space.sm, paddingHorizontal: space.xl, paddingTop: space.md, paddingBottom: space.sm },
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xl, paddingBottom: space.md },
  mapWrap: { flex: 1, position: 'relative', overflow: 'hidden' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.terracotta, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  bannerText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  selCard: { position: 'absolute', left: 12, right: 12, bottom: 12, zIndex: 500, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  hint: { position: 'absolute', bottom: 16, alignSelf: 'center', backgroundColor: colors.brown, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, zIndex: 500 },
  hintText: { color: colors.white, fontWeight: '600' },
});
