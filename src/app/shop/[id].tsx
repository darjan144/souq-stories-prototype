import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PickCard } from '@/components/cards';
import { SouqTips } from '@/components/SouqTips';
import { StoryVideo } from '@/components/StoryVideo';
import { Button, Card, Chip, Icon, IconCircle, Tag } from '@/components/ui';
import { categories } from '@/data/categories';
import { badges, picksForShop } from '@/data/content';
import { getShop, shops } from '@/data/shops';
import { useGame } from '@/store/useGame';
import { useUI } from '@/store/useUI';
import { t } from '@/strings';
import { colors, space, type } from '@/theme';

export default function ShopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const shop = getShop(id);
  const collectStory = useGame((s) => s.collectStory);
  const showToast = useUI((s) => s.showToast);
  const visitedToday = useGame((s) => s.checkIns.some((c) => c.shopId === id && new Date(c.at).toDateString() === new Date().toDateString()));

  if (!shop) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={type.body}>Shop not found</Text>
      </View>
    );
  }
  const cat = categories[shop.category];
  const shopPicks = picksForShop(shop.id);
  const badge = badges.find((b) => b.rule.type === 'visitAt' && b.rule.shopId === shop.id);

  const onWatched = () => {
    if (collectStory(shop.id)) {
      showToast(t.shop.storyCard(useGame.getState().storyCards.length, shops.length), 'cards-outline');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: shop.name }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <StoryVideo shop={shop} onWatched={onWatched} />

        <View style={styles.body}>
          <View style={{ gap: 4 }}>
            <Tag label={cat.label} color={cat.color} icon={cat.icon} />
            <Text style={[type.h1, { marginTop: space.sm }]}>{shop.name}</Text>
            <Text style={styles.ar}>{shop.nameAr}</Text>
            <View style={styles.meta}>
              <Icon name="account-tie" size={16} color={colors.muted} />
              <Text style={type.small}>
                {shop.owner} · since {shop.since} · {shop.hours}
              </Text>
            </View>
          </View>

          <Text style={[type.h3, styles.h]}>{t.shop.story}</Text>
          <Text style={type.body}>{shop.story}</Text>

          <View style={styles.infoRow}>
            <IconCircle icon="map-marker-radius" color={colors.teal} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={type.label}>{t.shop.origin}</Text>
              <Text style={type.body}>{shop.origin}</Text>
            </View>
          </View>

          <Text style={[type.h3, styles.h]}>{t.shop.inSeason}</Text>
          <View style={styles.wrap}>
            {shop.inSeason.map((s) => (
              <Chip key={s} label={s} icon="sprout" color={colors.olive} />
            ))}
          </View>

          <View style={{ marginTop: space.xl }}>
            <SouqTips owner={shop.owner} />
          </View>

          <Card color={colors.sand} style={styles.tip}>
            <Icon name="lightbulb-on-outline" size={24} color={colors.saffron} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={type.label}>{t.shop.tip}</Text>
              <Text style={type.body}>{shop.tip}</Text>
            </View>
          </Card>

          <Text style={[type.h3, styles.h]}>{t.shop.picks}</Text>
          {shopPicks.length ? (
            <View style={{ gap: space.md }}>
              {shopPicks.map((p) => (
                <PickCard key={p.id} pick={p} onPress={() => router.push(`/pick/${p.id}`)} />
              ))}
            </View>
          ) : (
            <Text style={type.small}>{t.shop.noPicks}</Text>
          )}

          <Card color={colors.brown} style={{ marginTop: space.xl, gap: space.md }}>
            <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
              <IconCircle icon={visitedToday ? 'check' : 'qrcode-scan'} color={visitedToday ? colors.success : colors.terracotta} />
              <View style={{ flex: 1 }}>
                <Text style={[type.h3, { color: colors.white }]}>{visitedToday ? 'Visited today' : t.shop.checkInTitle}</Text>
                <Text style={[type.small, { color: colors.sandDark }]}>{t.shop.checkInBody}</Text>
              </View>
            </View>
            {badge ? (
              <Text style={[type.small, { color: colors.saffron }]}>
                <Icon name="medal" size={14} color={colors.saffron} /> {t.shop.badgeHint(badge.name)}
              </Text>
            ) : null}
            <Button title={t.shop.checkInCta} icon="qrcode-scan" small onPress={() => router.navigate('/scan')} />
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: { padding: space.xl },
  ar: { fontSize: 20, color: colors.terracotta },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  h: { marginTop: space.xl, marginBottom: space.sm },
  infoRow: { flexDirection: 'row', gap: space.md, alignItems: 'center', marginTop: space.xl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tip: { flexDirection: 'row', gap: space.md, marginTop: space.xl },
});
