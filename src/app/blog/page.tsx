import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "UK Tax Guides & Calculator Resources | Smart Tax Calculator",
  description: "Expert tax guides, calculator tutorials, and the latest UK tax information. Stay updated with tax rates, allowances, and strategies for personal and business tax planning.",
  keywords: "UK tax guides, tax calculator tutorials, UK tax information, tax planning, HMRC guidance, tax tips",
};

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "Ultimate Guide to UK Income Tax Rates for 2025",
      slug: "uk-income-tax-rates-2025",
      excerpt: "Understanding the latest income tax bands, personal allowances, and how to optimize your tax position for the 2025 tax year.",
      date: "March 25, 2025",
      category: "Income Tax",
      readTime: "8 min read",
    },
    {
      id: 2,
      title: "Capital Gains Tax Changes: What You Need to Know",
      slug: "capital-gains-tax-changes-2025",
      excerpt: "Detailed breakdown of the recent changes to Capital Gains Tax rates, exemptions, and strategies to minimize your CGT liability.",
      date: "March 20, 2025",
      category: "Capital Gains",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "Self-Assessment Tax Filing: Complete Step-by-Step Guide",
      slug: "self-assessment-filing-guide",
      excerpt: "Everything you need to know about filing your self-assessment tax return, key deadlines, allowable expenses, and avoiding common mistakes.",
      date: "March 15, 2025",
      category: "Self Assessment",
      readTime: "10 min read",
    },
    {
      id: 4,
      title: "VAT for Small Businesses: Registration, Thresholds & Returns",
      slug: "vat-small-business-guide",
      excerpt: "Your complete guide to Value Added Tax for small businesses, including registration requirements, thresholds, and completing VAT returns.",
      date: "March 10, 2025",
      category: "VAT",
      readTime: "9 min read",
    },
    {
      id: 5,
      title: "Inheritance Tax Planning: Protect Your Family's Assets",
      slug: "inheritance-tax-planning-strategies",
      excerpt: "Effective strategies to minimize inheritance tax liability and ensure your assets are passed to your loved ones efficiently.",
      date: "March 5, 2025",
      category: "Inheritance Tax",
      readTime: "7 min read",
    },
    {
      id: 6,
      title: "Stamp Duty Land Tax: Rates, Exemptions & Calculations",
      slug: "stamp-duty-land-tax-explained",
      excerpt: "Understanding Stamp Duty Land Tax when buying property in the UK, including current rates, exemptions for first-time buyers, and calculation methods.",
      date: "March 1, 2025",
      category: "Stamp Duty",
      readTime: "6 min read",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">UK Tax Guides & Resources</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Expert guidance on UK taxation, calculators, and financial planning. Stay updated with the latest tax rates and strategies.
        </p>
      </header>

      {/* Featured article */}
      <div className="mb-12 rounded-lg overflow-hidden shadow-lg bg-card">
        <div className="p-6 md:p-8">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            Featured
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            <Link href="/blog/uk-tax-rates-2025-complete-guide" className="hover:underline">
              Complete Guide to UK Tax Rates and Allowances for 2025
            </Link>
          </h2>
          <p className="text-muted-foreground mb-4">
            This comprehensive guide covers all UK tax rates, thresholds, and allowances for the 2025 tax year.
            From income tax and National Insurance to capital gains, inheritance tax, and more - everything you need to know in one place.
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>March 26, 2025</span>
            <span className="mx-2">•</span>
            <span>Tax Planning</span>
            <span className="mx-2">•</span>
            <span>12 min read</span>
          </div>
        </div>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {articles.map((article) => (
          <article key={article.id} className="rounded-lg overflow-hidden shadow bg-card">
            <div className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary">
                  {article.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                <Link href={`/blog/${article.slug}`} className="hover:underline">
                  {article.title}
                </Link>
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {article.excerpt}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{article.date}</span>
                <span className="mx-2">•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 rounded-lg p-6 md:p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Stay Updated with UK Tax Changes</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join our newsletter to receive the latest tax updates, calculator improvements,
          and expert guidance directly to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
          <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Subscribe
          </button>
        </div>
      </div>

      {/* Structured data for blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "headline": "UK Tax Guides & Calculator Resources",
            "description": "Expert tax guides, calculator tutorials, and the latest UK tax information. Stay updated with tax rates, allowances, and strategies for personal and business tax planning.",
            "url": "https://smartcalculator.uk/blog",
            "author": {
              "@type": "Organization",
              "name": "Smart Tax Calculator UK"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Smart Tax Calculator UK",
              "logo": {
                "@type": "ImageObject",
                "url": "https://smartcalculator.uk/logo.png"
              }
            }
          })
        }}
      />
    </div>
  );
}
