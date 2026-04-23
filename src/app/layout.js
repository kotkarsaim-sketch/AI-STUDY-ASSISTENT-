import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { StudyProvider } from '@/context/StudyContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata = {
  title: 'AI Study Assistant — Summaries, Quizzes & Flashcards',
  description: 'Upload your notes or PDFs and instantly get AI-generated summaries, quizzes, and flashcards. Study smarter, not harder. All processing happens in your browser.',
  keywords: ['study assistant', 'AI', 'summaries', 'quizzes', 'flashcards', 'PDF', 'notes'],
  authors: [{ name: 'AI Study Assistant' }],
  openGraph: {
    title: 'AI Study Assistant',
    description: 'Upload your notes — get instant summaries, quizzes, and flashcards.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <StudyProvider>
          <div className="page-wrapper">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </StudyProvider>
      </body>
    </html>
  );
}
