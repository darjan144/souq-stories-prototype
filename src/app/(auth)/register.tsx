import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { useAuth } from '@/store/useAuth';
import { t } from '@/strings';
import { space, type } from '@/theme';

export default function Register() {
  const router = useRouter();
  const startRegister = useAuth((s) => s.startRegister);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [household, setHousehold] = useState('');
  const valid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 7;

  return (
    <Screen>
      <Text style={[type.h1, { marginBottom: space.xl }]}>{t.register.title}</Text>
      <Field label={t.register.name} value={name} onChangeText={setName} placeholder="e.g. Mariam" autoCapitalize="words" />
      <Field label={t.register.phone} prefix="+971" value={phone} onChangeText={setPhone} placeholder="50 123 4567" keyboardType="phone-pad" />
      <Field label={t.register.household} hint={t.register.householdHint} value={household} onChangeText={setHousehold} placeholder="e.g. Al Nuaimi family" />
      <Button
        title={t.register.cta}
        disabled={!valid}
        onPress={() => {
          startRegister({ name: name.trim(), phone: phone.trim(), household: household.trim() || undefined });
          router.push('/otp');
        }}
      />
    </Screen>
  );
}
