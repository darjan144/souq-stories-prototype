import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card, Icon } from '@/components/ui';
import { useAuth } from '@/store/useAuth';
import { useUI } from '@/store/useUI';
import { t } from '@/strings';
import { colors, radius, space, type } from '@/theme';

export default function Otp() {
  const router = useRouter();
  const pending = useAuth((s) => s.pending);
  const verifyOtp = useAuth((s) => s.verifyOtp);
  const showToast = useUI((s) => s.showToast);
  const [code, setCode] = useState('');

  const submit = (value = code) => {
    if (verifyOtp(value)) router.replace('/explore');
  };

  return (
    <Screen>
      <Text style={type.h1}>{t.otp.title}</Text>
      <Text style={[type.body, { color: colors.muted, marginTop: space.sm }]}>{t.otp.sentTo(pending?.phone ?? '')}</Text>

      <View style={styles.boxes}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.box, code.length === i && styles.boxActive]}>
            <Text style={styles.digit}>{code[i] ?? ''}</Text>
          </View>
        ))}
        <TextInput
          value={code}
          onChangeText={(v) => {
            const next = v.replace(/\D/g, '').slice(0, 4);
            setCode(next);
            if (next.length === 4) submit(next);
          }}
          keyboardType="number-pad"
          maxLength={4}
          autoFocus
          style={styles.hidden}
          accessibilityLabel="One-time code"
        />
      </View>

      <Card color={colors.sand} style={styles.hint}>
        <Icon name="information-outline" color={colors.teal} />
        <Text style={[type.small, { flex: 1, color: colors.brown }]}>{t.otp.hint}</Text>
      </Card>

      <Button title={t.otp.cta} disabled={code.length !== 4} onPress={() => submit()} />
      <Button title={t.otp.resend} variant="ghost" style={{ marginTop: space.md }} onPress={() => showToast('Code sent again (demo)', 'cellphone')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  boxes: { flexDirection: 'row', gap: space.md, marginVertical: space.xl, position: 'relative' },
  box: { flex: 1, height: 64, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  boxActive: { borderColor: colors.terracotta },
  digit: { fontSize: 26, fontWeight: '800', color: colors.brown },
  hidden: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.02, fontSize: 1 },
  hint: { flexDirection: 'row', gap: space.sm, alignItems: 'center', marginBottom: space.xl },
});
