import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { metaMaskWallet, okxWallet, rabbyWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';


const projectId = "2ae95a6ea051d601941893705e93b2b0";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [...(process.env.NEXT_PUBLIC_INCLUDE_TESTNET === 'true' ? [arbitrumSepolia] : [arbitrumSepolia])],
  [publicProvider()]
);

const demoAppInfo = {
  appName: 'updown',
  projectId: "2ae95a6ea051d601941893705e93b2b0"
};

const connectors = connectorsForWallets([
  // ...wallets,
  {
    groupName: 'Wallets',
    wallets: [metaMaskWallet({ projectId, chains }), okxWallet({
      projectId: "2ae95a6ea051d601941893705e93b2b0",
      chains
    }), rabbyWallet({chains: chains}), coinbaseWallet({
      appName: "updown",
      chains: chains
    })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { wagmiConfig, demoAppInfo, chains };
