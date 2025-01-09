import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
