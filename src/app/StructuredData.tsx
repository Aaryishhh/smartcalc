"use client";

export default function StructuredData() {
  // All structured data in one place
  const structuredData = [
    // Website structured data
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Smart Tax Calculator",
      "url": "https://smartcalculator.uk",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://smartcalculator.uk/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    // WebApplication structured data
    {
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
    },
    // FAQ structured data
    {
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
        },
        {
          "@type": "Question",
          "name": "How does the Capital Gains Tax calculator work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Capital Gains Tax calculator works by taking the sale price of your asset, subtracting the original purchase price and any allowable expenses, applying your annual tax-free allowance (where applicable), and then calculating the tax based on your tax band and jurisdiction. Different regions have different CGT rates for various asset types. Our calculator provides an accurate estimate based on your location and circumstances."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to pay VAT on my small business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "VAT (or similar consumption taxes like GST or sales tax) requirements vary by country. In many regions, you need to register when your taxable turnover exceeds a certain threshold. Once registered, you must charge VAT on your products or services, submit regular returns, and pay the collected tax to the relevant tax authority. Our calculator can help you determine your VAT obligations based on your business location and turnover."
          }
        }
      ]
    }
  ];

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}
    </>
  );
}
