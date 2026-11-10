import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { useAuth } from '@/store/useAuth';
import { t } from '@/strings';
import { space, type } from '@/theme';

export default function Login() {
  const router = useRouter();
  const account = useAuth((s) => s.account);
  const startLogin = useAuth((s) => s.startLogin);
  const [phone, setPhone] = useState(account?.phone ?? '');

  return (
    <Screen>
      <Text style={[type.h1, { marginBottom: space.xl }]}>{t.login.title}</Text>
      <Field label={t.register.phone} prefix="+971" value={phone} onChangeText={setPhone} placeholder="50 123 4567" keyboardType="phone-pad" />
      <Button
        title={t.login.cta}
        disabled={phone.replace(/\D/g, '').length < 7}
        onPress={() => {
          startLogin(phone.trim());
          router.push('/otp');
        }}
      />
    </Screen>
  );
}
