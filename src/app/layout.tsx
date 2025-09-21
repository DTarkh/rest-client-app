import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import type React from 'react';
import { AppProvider } from './_/providers/AppProvider';
import { AuthProvider } from './_/providers/AuthProvider';
import TanstackQueryProvider from './_/providers/TanstackQueryProvider';
import { Toaster } from 'sonner';
import 'prismjs/themes/prism-tomorrow.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rest Client – Streamline Your API Testing',
  description:
    'Rest Client is a powerful REST client for developers and teams. Test APIs, manage requests, track history, and generate code in multiple languages — all in one professional platform.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <AuthProvider>
            <TanstackQueryProvider>
              {children}
              <Toaster richColors position='top-right' />
            </TanstackQueryProvider>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
