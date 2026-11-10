import { Redirect } from 'expo-router';

import { useAuth } from '@/store/useAuth';

export default function Index() {
  const loggedIn = useAuth((s) => s.loggedIn);
  return <Redirect href={loggedIn ? '/explore' : '/welcome'} />;
}
