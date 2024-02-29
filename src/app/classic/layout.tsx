import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'All Your Base | Crypto Prediction Game',
  description: 'Join the AYB crypto prediction game!',
};

export default function ClassicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
