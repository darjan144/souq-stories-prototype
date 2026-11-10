import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, space, type } from '@/theme';

export function Field({ label, hint, prefix, ...input }: TextInputProps & { label: string; hint?: string; prefix?: string }) {
  return (
    <View style={{ gap: 6, marginBottom: space.lg }}>
      <Text style={type.label}>{label}</Text>
      <View style={styles.box}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput placeholderTextColor={colors.muted} style={styles.input} {...input} />
      </View>
      {hint ? <Text style={type.small}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: space.md, backgroundColor: colors.white },
  prefix: { fontSize: 16, color: colors.muted, marginRight: 8 },
  input: { flex: 1, fontSize: 16, paddingVertical: 13, color: colors.brown },
});
