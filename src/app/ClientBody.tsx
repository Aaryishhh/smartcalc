"use client";

import { useEffect } from "react";
import { initGA, pageview } from "@/lib/gtag";
import { usePathname } from "next/navigation";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Initialize Google Analytics once on mount
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    // For GA tracking, we only need the pathname without search params for basic tracking
    pageview(pathname || "");
  }, [pathname]);

  // Structured data
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Smart Tax Calculator",
    "url": "https://smartcalculator.uk",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://smartcalculator.uk/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Smart Tax Calculator",
    "description": "Free tax calculators for income tax, VAT, capital gains, inheritance tax, stamp duty, dividend tax, and more. Accurate 2025 tax calculations for personal and business purposes.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP"
    },
    "featureList": [
      "Income Tax Calculator",
      "Capital Gains Tax Calculator",
      "VAT Calculator",
      "Inheritance Tax Calculator",
      "Stamp Duty Calculator",
      "Dividend Tax Calculator",
      "National Insurance Calculator"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I calculate my income tax for 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To calculate income tax for 2025, first determine your taxable income by subtracting allowable deductions from your gross income. Then apply the current tax rates for your region. For many countries, this involves a progressive tax system with different tax brackets. Use our free income tax calculator for accurate calculations based on your specific location."
        }
      },
      {
        "@type": "Question",
        "name": "What are the global tax rates for 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tax rates for 2025 vary by country and region. Most countries use a progressive tax system with different brackets. Our Global Tax Calculator provides up-to-date rates for various regions including the UK, EU countries, and the US. Different rates apply to different types of income such as employment, dividends, and capital gains."
        }
      },
      {
        "@type": "Question",
        "name": "How much tax do I pay on rental income?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rental income tax varies by country. Generally, it's taxed at the same rates as other income, though specific deductions and allowances may apply. You can typically deduct allowable expenses from your rental income before calculating tax. Many jurisdictions also offer property allowances. Use our calculator to determine your specific rental income tax liability."
        }
      }
    ]
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
