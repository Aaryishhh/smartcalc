import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import ClientBody from "./ClientBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import AdsterraAd from "@/components/ui/AdsterraAd";


// Component mocks for features we're not implementing right now
const GoogleAnalytics = () => null;
const GoogleAdsense = () => null;

export const metadata: Metadata = {
  title: "Smart Tax Calculator | Free Online Tax Calculators",
  description: "Free tax calculators for income tax, VAT, capital gains, inheritance tax, stamp duty, dividend tax, and more. Accurate 2025 tax calculations for personal and business purposes.",
  metadataBase: new URL('https://smartcalculator.uk'),
  keywords: "tax calculator, income tax calculator, VAT calculator, capital gains tax, dividend tax, inheritance tax, stamp duty calculator, tax calculation, free tax calculator",
  verification: {
    google: "google-site-verification=G-H4S817RX07",
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Smart Tax Calculator | Free Online Tax Calculators",
    description: "Free tax calculators for income tax, VAT, capital gains, inheritance tax, stamp duty, dividend tax, and more. Accurate 2025 tax calculations for personal and business purposes.",
    url: 'https://smartcalculator.uk',
    siteName: 'Smart Tax Calculator',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: 'https://smartcalculator.uk/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Tax Calculator',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Tax Calculator | Free Online Tax Calculators',
    description: 'Free tax calculators for income tax, VAT, capital gains, inheritance tax, stamp duty, dividend tax, and more. Accurate 2025 tax calculations.',
    images: ['https://smartcalculator.uk/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: 'Smart Calculator' }],
  creator: 'Smart Calculator',
  publisher: 'Smart Calculator',
  category: 'Finance',
  applicationName: 'Smart Tax Calculator',
};

// Critical CSS - inlined for faster First Contentful Paint
const criticalCSS = `
  .tax-title {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  .tax-subtitle {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
  .tax-layout {
    padding: 2rem 1rem;
  }
  @media (min-width: 768px) {
    .tax-title {
      font-size: 3rem;
    }
    .tax-layout {
      padding: 3rem 1.5rem;
    }
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" id="root">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="tax-calculator-theme"
          enableSystem
          disableTransitionOnChange
        >
          <ClientBody>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <AdsterraAd />
              <main className="flex-1">
                <div className="container py-6 md:py-8 max-w-screen-2xl">
                  <Breadcrumbs />
                  {children}
                </div>
              </main>
              <footer className="py-6 md:py-0 md:pb-8 border-t">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left max-w-screen-2xl">
                  <div className="text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Smart Tax Calculator. All rights reserved.</p>
                    <p className="mt-1">Tax calculations are for guidance only.</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                  </div>
                </div>
              </footer>
            </div>
          </ClientBody>
        </ThemeProvider>
        <Toaster />
        {process.env.NODE_ENV === 'production' && (
          <>
            <GoogleAnalytics />
            <GoogleAdsense />
          </>
        )}
      </body>
    </html>
  );
}