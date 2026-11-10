import type { ReactNode } from 'react';

/** Native: no frame. The web version (PhoneFrame.web.tsx) frames the app on desktop. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
