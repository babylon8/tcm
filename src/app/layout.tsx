import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-body',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'TCM Self-Diagnosis | Traditional Chinese Medicine Health Assessment',
  description: 'Discover your TCM constitution type, check symptoms from a Traditional Chinese Medicine perspective, and receive personalized health recommendations.',
  keywords: ['TCM', 'Traditional Chinese Medicine', 'Constitution', 'Health', 'Diagnosis', 'Chinese Medicine'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${cormorant.variable} font-body bg-warm-50 text-ink-900 antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col relative">
            {/* Subtle background texture */}
            <div className="fixed inset-0 pointer-events-none opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }} />
            
            <Navbar />
            
            <main className="flex-1 relative">
              {children}
            </main>
            
            <footer className="border-t bg-white/50 mt-auto">
              <div className="container mx-auto px-4 py-6">
                <div className="text-center text-sm text-ink-500">
                  <div className="mb-3 p-4 bg-sage-50 border border-sage-200 rounded-lg max-w-2xl mx-auto">
                    <p className="text-sage-700 font-display font-semibold">⚠️ Medical Disclaimer</p>
                    <p className="text-sage-600 text-xs mt-1">
                      This application is for educational and self-awareness purposes only. 
                      It does not provide medical diagnosis. Always consult a licensed TCM practitioner or healthcare professional for actual treatment.
                    </p>
                  </div>
                  <p className="mt-4 text-ink-400">
                    © {new Date().getFullYear()} TCM Self-Diagnosis Webapp. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
