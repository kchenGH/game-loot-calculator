import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Game Loot Calculator - Find Probabilities of Your Game Loot',
  description:
    'GameLootCalc.com is your ultimate game loot calculator to calculate probabilities and odds for loot drops. Enhance your gaming experience with precise insights!',
  keywords: [
    'game loot calculator',
    'loot drop probabilities',
    'gaming tools',
    'loot odds calculator',
    'game loot drops',
    'probability calculator for games',
    'gamelootcalc',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Primary Meta Tags */}
        <meta name="title" content="Game Loot Calculator - Find Probabilities of Your Game Loot" />
        <meta
          name="description"
          content="GameLootCalc.com is your ultimate game loot calculator to calculate probabilities and odds for loot drops. Enhance your gaming experience with precise insights!"
        />
        <meta
          name="keywords"
          content="game loot calculator, loot drop probabilities, gaming tools, loot odds calculator, game loot drops, probability calculator for games, gamelootcalc"
        />
        <meta name="author" content="GameLootCalc.com" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gamelootcalc.com/" />
        <meta property="og:title" content="Game Loot Calculator - Find Probabilities of Your Game Loot" />
        <meta
          property="og:description"
          content="GameLootCalc.com is your ultimate game loot calculator to calculate probabilities and odds for loot drops. Enhance your gaming experience with precise insights!"
        />
        <meta property="og:image" content="https://gamelootcalc.com/favicon.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://gamelootcalc.com/" />
        <meta property="twitter:title" content="Game Loot Calculator - Find Probabilities of Your Game Loot" />
        <meta
          property="twitter:description"
          content="GameLootCalc.com is your ultimate game loot calculator to calculate probabilities and odds for loot drops. Enhance your gaming experience with precise insights!"
        />
        <meta property="twitter:image" content="https://gamelootcalc.com/favicon.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
