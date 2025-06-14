import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BudgetWise - Smart Budgeting',
  description: 'Manage your finances effectively with BudgetWise.',
  icons: {
    icon: '/favicon.ico', // Assuming a favicon might be added later
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts link for Inter is handled by next/font, so no manual <link> needed here if using next/font */}
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
