'use client';

import * as React from 'react';
import { WagmiConfig } from 'wagmi';
import { chains, demoAppInfo, wagmiConfig } from '@/config/wagmi';
import merge from 'lodash.merge';
import { darkTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';

const myTheme = merge(darkTheme(), {
  colors: {
    // accentColor: '#07296d',
    connectButtonBackground: 'transparent',
    connectButtonBackgroundError: 'red',
    connectButtonInnerBackground: '#23Aaff',
    connectButtonText: '#fff',
    connectButtonTextError: 'red',
    connectionIndicator: 'red',
  },
  radii: {
    connectButton: '20px',
  },
  fonts: {},
} as Theme);

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains} theme={myTheme} coolMode>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
