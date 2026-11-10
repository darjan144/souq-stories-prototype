import { useState } from 'react';
import { View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import type { Shop } from '@/data/types';
import { colors } from '@/theme';
import { StoryPlaceholder } from './StoryPlaceholder';

/** Native: plays the owner's YouTube story, or the branded placeholder when there is none yet. */
export function StoryVideo({ shop, onWatched }: { shop: Shop; onWatched: () => void }) {
  const [width, setWidth] = useState(0);
  if (!shop.youtubeId) return <StoryPlaceholder shop={shop} onWatched={onWatched} />;
  return (
    <View style={{ backgroundColor: colors.brown }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <YoutubePlayer
          height={Math.round((width * 9) / 16)}
          width={width}
          videoId={shop.youtubeId}
          onChangeState={(state: string) => {
            if (state === 'ended') onWatched();
          }}
          initialPlayerParams={{ cc_load_policy: true, rel: false, modestbranding: true }}
        />
      ) : null}
    </View>
  );
}
