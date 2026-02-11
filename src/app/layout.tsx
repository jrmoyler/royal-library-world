import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Royal Library World | Aetheria Protocol',
  description: 'A 3D gamified portfolio experience — explore a cyber-medieval library to discover knowledge artifacts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
