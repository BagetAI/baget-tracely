import type { Metadata } from 'next';
import { Libre_Baskerville, Lato, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const libreBaskerville = Libre_Baskerville({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-libre' 
});

const lato = Lato({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-lato' 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  title: 'Tracely | AI-Powered Error Contextualization',
  description: 'Explain stack traces, suggest fixes, and link past incidents directly in Slack.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${libreBaskerville.variable} ${lato.variable} ${jetbrainsMono.variable} font-sans bg-[#F4ECD8] text-[#4A3728] antialiased`}>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
