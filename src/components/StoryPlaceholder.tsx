import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Shop } from '@/data/types';
import { t } from '@/strings';
import { colors } from '@/theme';
import { ShopArt } from './ShopArt';
import { Icon } from './ui';

const PREVIEW_MS = 6000;

/**
 * Branded poster shown until a real YouTube story exists. "Play" runs a short
 * preview with auto-subtitle lines from the owner's story, to show the AI
 * subtitles concept, then reports the story as watched.
 */
export function StoryPlaceholder({ shop, onWatched }: { shop: Shop; onWatched: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const lines = (shop.story.match(/[^.!?]+[.!?]+/g) ?? [shop.story]).map((l) => l.trim());

  useEffect(() => {
    if (!playing) return;
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: PREVIEW_MS, easing: Easing.linear, useNativeDriver: false }).start(({ finished }) => {
      if (finished) {
        setPlaying(false);
        onWatched();
      }
    });
    const step = PREVIEW_MS / Math.max(1, lines.length);
    const iv = setInterval(() => setLine((l) => Math.min(l + 1, lines.length - 1)), step);
    return () => clearInterval(iv);
  }, [playing]);

  return (
    <Pressable
      onPress={() => {
        if (!playing) {
          setLine(0);
          setPlaying(true);
        }
      }}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel={t.video.play}
    >
      <ShopArt shop={shop} height={220} rounded={0} hideIcon />
      <View style={styles.overlay} />
      {playing ? (
        <>
          <View style={styles.topRow}>
            <Text style={styles.badge}>{t.video.playing}</Text>
            <Text style={styles.badge}>CC · {t.video.subtitles}</Text>
          </View>
          <Text style={styles.subtitle}>{lines[line]}</Text>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
          </View>
        </>
      ) : (
        <View style={styles.center}>
          <View style={styles.play}>
            <Icon name="play" size={34} color={colors.brown} />
          </View>
          <Text style={styles.title}>{t.video.comingSoon}</Text>
          <Text style={styles.caption}>
            {shop.owner} · {t.video.length}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 220, backgroundColor: colors.brown, overflow: 'hidden' },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(43,29,20,0.45)' },
  center: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 8 },
  play: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.saffron, alignItems: 'center', justifyContent: 'center', paddingLeft: 4 },
  title: { color: colors.white, fontWeight: '700', fontSize: 16, marginTop: 6 },
  caption: { color: colors.sand, fontSize: 13 },
  topRow: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  badge: { color: colors.white, fontSize: 11, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  subtitle: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 26,
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  track: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  fill: { height: 4, backgroundColor: colors.saffron },
});
