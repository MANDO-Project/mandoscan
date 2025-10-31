import { Outfit } from 'next/font/google';
// import '../globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthGuard from '@/components/auth/AuthGuard';


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AuthGuard>
          <div className={`${outfit.className} dark:bg-gray-900 min-h-screen`}>
            {children}
          </div>
        </AuthGuard>
      </SidebarProvider>
    </ThemeProvider>
  );
}
