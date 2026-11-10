import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, space } from '@/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  background?: string;
};

/** Page wrapper. Tab screens pass edges={['top']}; stack screens with a header use the default (none). */
export function Screen({ children, scroll = true, edges = [], contentStyle, background = colors.white }: Props) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
  content: { padding: space.xl, paddingBottom: 48 },
});
