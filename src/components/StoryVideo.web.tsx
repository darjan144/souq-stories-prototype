import { View } from 'react-native';

import type { Shop } from '@/data/types';
import { t } from '@/strings';
import { colors } from '@/theme';
import { StoryPlaceholder } from './StoryPlaceholder';
import { Button } from './ui';

/** Web: privacy-friendly YouTube embed, or the branded placeholder when there is no video yet. */
export function StoryVideo({ shop, onWatched }: { shop: Shop; onWatched: () => void }) {
  if (!shop.youtubeId) return <StoryPlaceholder shop={shop} onWatched={onWatched} />;
  return (
    <View style={{ backgroundColor: colors.brown }}>
      <View style={{ width: '100%', aspectRatio: 16 / 9 }}>
        <iframe
          title={`${shop.name} story`}
          src={`https://www.youtube-nocookie.com/embed/${shop.youtubeId}?rel=0&cc_load_policy=1&modestbranding=1`}
          style={{ border: 0, width: '100%', height: '100%' }}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </View>
      {/* The embed can't report "ended" without the YouTube JS API, so collection is a tap. */}
      <View style={{ padding: 12 }}>
        <Button title={t.video.collect} icon="cards-outline" variant="secondary" small onPress={onWatched} />
      </View>
    </View>
  );
}
