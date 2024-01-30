import './globals.css';
import { DM_sans } from './fonts';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export const metadata = {
  title: 'Eco-Flyer | The eco-friendly holiday planner',
  description: 'Book your next holiday with the planet in mind',
  generator: 'Next.js',
  applicationName: 'Eco-Flyer',
  authors: [{ name: 'Daniel Santos', url: 'https://github.com/dsantos747' }],
  keywords: ['flights', 'emissions', 'environment', 'travel', 'low emissions', 'climate'],
  creator: 'Daniel Santos',
  metadataBase: new URL('https://eco-flyer.vercel.app/'),
  openGraph: {
    description: 'Book your next holiday with the planet in mind',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={DM_sans.className}>{children}</body>
    </html>
  );
}
