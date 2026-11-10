import { StyleSheet, Text, View } from 'react-native';

import { t } from '@/strings';
import { colors, space, type } from '@/theme';
import { Card, Icon } from './ui';

/** Reminder for visitors and supermarket shoppers: taste and haggle, it's how the souq works. */
export function SouqTips({ owner, compact }: { owner: string; compact?: boolean }) {
  return (
    <Card color="#FFF4DF" style={[styles.card, compact && { padding: space.md }]}>
      {!compact ? <Text style={[type.label, { color: colors.spice }]}>{t.tips.title}</Text> : null}
      <View style={styles.row}>
        <Icon name="food-variant" size={22} color={colors.terracotta} />
        <Text style={[type.body, styles.text]}>{t.tips.taste(owner)}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="hand-heart" size={22} color={colors.terracotta} />
        <Text style={[type.body, styles.text]}>{t.tips.haggle}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.sm, borderWidth: 1.5, borderColor: '#F2D9A6' },
  row: { flexDirection: 'row', gap: space.md, alignItems: 'center' },
  text: { flex: 1, fontWeight: '600' },
});
