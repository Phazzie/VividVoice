import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/vivid-voice/Header';
import { ErrorBoundary } from '@/components/ErrorBoundary';
// import { Belleza, Alegreya } from 'next/font/google';

// const belleza = Belleza({
//   subsets: ['latin'],
//   weight: '400',
//   variable: '--font-headline',
// });

export const metadata: Metadata = {
  title: 'Staging Stories with the Skeptical Wombat',
  description: 'AI-powered narrative story reader with expressive voice acting. Transform your stories into immersive audio experiences with advanced AI analysis.',
  keywords: ['AI', 'voice acting', 'story analysis', 'text-to-speech', 'narrative', 'fiction writing'],
  authors: [{ name: 'VividVoice Team' }],
  creator: 'VividVoice',
  openGraph: {
    title: 'Staging Stories with the Skeptical Wombat',
    description: 'Transform your stories into immersive audio experiences with AI-powered voice acting and narrative analysis.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staging Stories with the Skeptical Wombat',
    description: 'AI-powered narrative story reader with expressive voice acting.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ErrorBoundary>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
