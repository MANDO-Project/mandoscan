import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import CognitoAuthProvider from './auth-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Mandoscan',
  description: 'AI-Powered Smart Contract Vulnerability Detection Tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CognitoAuthProvider>{children}</CognitoAuthProvider>
      </body>
    </html>
  );
}
