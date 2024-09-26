'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SolanaProvider } from './solana-provider';
import { ReactQueryProvider } from './react-query-provider';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaProvider>
      <ReactQueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ReactQueryProvider>
    </SolanaProvider>
  );
}
