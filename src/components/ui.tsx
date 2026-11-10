import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, space, type } from '@/theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function Icon({ name, size = 20, color = colors.brown }: { name: string; size?: number; color?: ColorValue }) {
  return <MaterialCommunityIcons name={name as IconName} size={size} color={color as string | undefined} />;
}

type ButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
};

export function Button({ title, onPress, icon, variant = 'primary', disabled, style, small }: ButtonProps) {
  const bg = { primary: colors.terracotta, secondary: colors.sand, dark: colors.brown, ghost: 'transparent' }[variant];
  const fg = variant === 'secondary' || variant === 'ghost' ? colors.brown : colors.white;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        variant === 'ghost' && { borderWidth: 1.5, borderColor: colors.sandDark },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={small ? 16 : 20} color={fg} /> : null}
      <Text style={[styles.btnText, small && { fontSize: 14 }, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children, style, onPress, color = colors.sand }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; color?: string }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: color, opacity: pressed ? 0.9 : 1 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, { backgroundColor: color }, style]}>{children}</View>;
}

export function Chip({ label, selected, onPress, icon, color = colors.brown }: { label: string; selected?: boolean; onPress?: () => void; icon?: string; color?: string }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected ? { backgroundColor: color, borderColor: color } : null]}>
      {icon ? <Icon name={icon} size={14} color={selected ? colors.white : color} /> : null}
      <Text style={[styles.chipText, { color: selected ? colors.white : colors.brown }]}>{label}</Text>
    </Pressable>
  );
}

export function Tag({ label, color = colors.teal, icon }: { label: string; color?: string; icon?: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '1F' }]}>
      {icon ? <Icon name={icon} size={13} color={color} /> : null}
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value, color = colors.terracotta, height = 8 }: { value: number; color?: string; height?: number }) {
  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height, borderRadius: height, backgroundColor: color }} />
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.section}>
      <Text style={type.h3}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={{ color: colors.terracotta, fontWeight: '700' }}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function IconCircle({ icon, color, size = 44 }: { icon: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={size * 0.5} color={colors.white} />
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  iconOnly,
}: {
  options: { value: T; label: string; icon?: string }[];
  value: T;
  onChange: (v: T) => void;
  iconOnly?: boolean;
}) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: on }}
            style={[styles.segmentItem, iconOnly && { paddingHorizontal: 12 }, on && styles.segmentOn]}
          >
            {o.icon ? <Icon name={o.icon} size={18} color={on ? colors.white : colors.brown} /> : null}
            {!iconOnly ? <Text style={{ fontWeight: '700', color: on ? colors.white : colors.brown }}>{o.label}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, paddingVertical: 15, paddingHorizontal: space.xl, borderRadius: radius.pill },
  btnSmall: { paddingVertical: 9, paddingHorizontal: space.lg },
  btnText: { fontSize: 16, fontWeight: '700' },
  card: { borderRadius: radius.md, padding: space.lg },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  chipText: { fontSize: 14, fontWeight: '600' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill },
  tagText: { fontSize: 12, fontWeight: '700' },
  track: { backgroundColor: colors.border, overflow: 'hidden', width: '100%' },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.xl, marginBottom: space.md },
  segment: { flexDirection: 'row', backgroundColor: colors.sand, borderRadius: radius.pill, padding: 4 },
  segmentItem: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: radius.pill },
  segmentOn: { backgroundColor: colors.brown },
});
