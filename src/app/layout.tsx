import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/vivid-voice/Header';
import { Belleza, Alegreya } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Staging Stories with the Skeptical Wombat',
  description: 'AI-powered narrative story reader with expressive voice acting.',
};

const belleza = Belleza({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-headline',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${belleza.variable} ${alegreya.variable} dark`}>
      <body className="antialiased min-h-screen bg-background text-foreground font-body">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
