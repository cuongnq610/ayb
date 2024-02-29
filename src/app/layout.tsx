import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from '@/views/common/header/header';
import { Providers } from '@/app/providers';
import { ProvidersRedux } from '@/redux/provider';
import { Slide, ToastContainer } from 'react-toastify';
import { GoogleTagManager } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: 'All Your Base',
  description: 'Join the AYB crypto prediction game!',
  keywords: ['Up down', 'charts', 'blockchain', 'Classic'],
  openGraph: {
    type: 'website',
    images: '/thumbnail.png',
  },
  icons: ["favicon.ico"]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </head>
      <body className={'bg-main overflow-x-hidden'}>
        <GoogleTagManager gtmId="G-KMHJ2PQVMF" />
        <ProvidersRedux>
          <Providers>
            <Header />
            {children}
            <ToastContainer
              className="toast-position"
              autoClose={4000}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable={false}
              pauseOnHover
              transition={Slide}
              theme={'dark'}
              closeButton={false}
              toastStyle={{
                borderRadius: '4px',
                padding: 0,
                height: 'fit-content',
                width: 'fit-content',
                zIndex: 100000,
              }}
            />
          </Providers>
        </ProvidersRedux>
      </body>
    </html>
  );
}
