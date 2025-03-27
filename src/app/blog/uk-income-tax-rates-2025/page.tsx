import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "UK Income Tax Rates & Bands for 2025/26 | Complete Guide",
  description: "Comprehensive guide to UK income tax rates, bands and allowances for 2025/26. Calculate your tax liability with our expert breakdown of personal allowance, basic rate, higher rate and additional rate thresholds.",
  keywords: "UK income tax rates 2025, UK tax bands, personal allowance 2025, income tax calculator UK, higher rate tax threshold, additional rate tax, UK tax allowances 2025",
};

export default function UKIncomeTaxRatesGuide() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">UK Income Tax Rates & Bands for 2025/26: Complete Guide</h1>
          <div className="flex justify-center items-center text-sm text-muted-foreground mb-6">
            <span>Published: March 25, 2025</span>
            <span className="mx-2">•</span>
            <span>8 min read</span>
            <span className="mx-2">•</span>
            <span>By Smart Tax Calculator Team</span>
          </div>

          <div className="border-t border-b py-4 flex justify-center space-x-4 text-sm">
            <span>Category: Income Tax</span>
            <span>|</span>
            <span>Last Updated: March 26, 2025</span>
          </div>
        </header>

        <div className="bg-card p-4 rounded-lg mb-8 shadow">
          <h2 className="text-xl font-bold mb-3">Table of Contents</h2>
          <ul className="space-y-1">
            <li><a href="#introduction" className="hover:underline">Introduction to UK Income Tax</a></li>
            <li><a href="#personal-allowance" className="hover:underline">Personal Allowance</a></li>
            <li><a href="#tax-bands" className="hover:underline">Income Tax Bands & Rates</a></li>
            <li><a href="#income-types" className="hover:underline">Types of Taxable Income</a></li>
            <li><a href="#allowances" className="hover:underline">Tax-Free Allowances & Reliefs</a></li>
            <li><a href="#calculation" className="hover:underline">How to Calculate Your Income Tax</a></li>
            <li><a href="#changes" className="hover:underline">Key Changes for 2025/26</a></li>
            <li><a href="#faq" className="hover:underline">Frequently Asked Questions</a></li>
          </ul>
        </div>

        <section id="introduction" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Introduction to UK Income Tax</h2>
          <p>
            Income tax is a tax you pay on your income. Not all income is taxable, and you're only taxed on income above your Personal Allowance. The UK uses a progressive tax system, which means that the more you earn, the more tax you pay.
          </p>
          <p>
            For the 2025/26 tax year (which runs from 6 April 2025 to 5 April 2026), there are several key updates that UK taxpayers need to be aware of. This comprehensive guide breaks down everything you need to know about the current income tax rates, bands, and allowances.
          </p>
        </section>

        <section id="personal-allowance" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Personal Allowance</h2>
          <p>
            The Personal Allowance is the amount of income you can earn before you start paying income tax. For the 2025/26 tax year, the standard Personal Allowance is <strong>£13,500</strong> for most people.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="font-medium">Important Note:</p>
            <p>Your Personal Allowance may be larger if you claim Marriage Allowance or Blind Person's Allowance. It's smaller if your income is over £125,000 – in fact, it's zero if your income is over £125,000.</p>
          </div>
          <p>
            For every £2 you earn over £100,000, your Personal Allowance reduces by £1. This means that if you earn £125,000 or more, you don't receive any Personal Allowance and all of your income is taxed.
          </p>
        </section>

        <section id="tax-bands" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Income Tax Bands & Rates (2025/26)</h2>
          <p>
            Income tax in the UK is charged at different rates, depending on how much you earn and the tax band that your income falls into. Here are the income tax bands and rates for 2025/26:
          </p>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 border-b text-left">Band</th>
                  <th className="px-4 py-2 border-b text-left">Taxable Income</th>
                  <th className="px-4 py-2 border-b text-left">Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b">Personal Allowance</td>
                  <td className="px-4 py-2 border-b">Up to £13,500</td>
                  <td className="px-4 py-2 border-b">0%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">Basic Rate</td>
                  <td className="px-4 py-2 border-b">£13,501 to £50,500</td>
                  <td className="px-4 py-2 border-b">20%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">Higher Rate</td>
                  <td className="px-4 py-2 border-b">£50,501 to £125,000</td>
                  <td className="px-4 py-2 border-b">40%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">Additional Rate</td>
                  <td className="px-4 py-2 border-b">Over £125,000</td>
                  <td className="px-4 py-2 border-b">45%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            These rates apply to most types of income, including wages, self-employed profits, pensions, and rental income. However, different rates apply to dividends and capital gains.
          </p>
        </section>

        <section id="income-types" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Types of Taxable Income</h2>
          <p>
            Income tax applies to various types of income, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Wages and salaries</li>
            <li>Self-employment profits</li>
            <li>Some state benefits</li>
            <li>Pension income (state, personal, and company)</li>
            <li>Rental income</li>
            <li>Benefits and perks from your job</li>
            <li>Interest on savings over your savings allowance</li>
            <li>Dividends from company shares over your dividend allowance</li>
          </ul>
          <p>
            Some income is tax-free, such as income from tax-exempt accounts like ISAs, and certain benefits.
          </p>
        </section>

        <section id="allowances" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Tax-Free Allowances & Reliefs</h2>
          <p>
            Besides the Personal Allowance, you may be entitled to other tax-free allowances:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Savings Allowance:</strong> Up to £1,000 of interest from savings tax-free, depending on your income tax band</li>
            <li><strong>Dividend Allowance:</strong> £500 of dividends tax-free</li>
            <li><strong>Marriage Allowance:</strong> Transfer £1,350 of your Personal Allowance to your spouse or civil partner</li>
            <li><strong>Trading Allowance:</strong> £1,000 tax-free allowance for trading income</li>
            <li><strong>Property Allowance:</strong> £1,000 tax-free allowance for property income</li>
            <li><strong>Rent a Room Relief:</strong> Up to £7,500 tax-free income from letting out a room in your home</li>
          </ul>
          <p>
            These allowances can significantly reduce your tax liability if applied correctly.
          </p>
        </section>

        <section id="calculation" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">How to Calculate Your Income Tax</h2>
          <p>
            To calculate your income tax liability for 2025/26:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>Add up all your taxable income</li>
            <li>Subtract your tax-free Personal Allowance</li>
            <li>Calculate tax on each portion of your taxable income</li>
            <li>Add the tax amounts together</li>
          </ol>
          <p>
            For example, if your annual salary is £60,000:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal Allowance: £13,500 at 0% = £0</li>
            <li>Basic rate: £37,000 (£50,500 - £13,500) at 20% = £7,400</li>
            <li>Higher rate: £9,500 (£60,000 - £50,500) at 40% = £3,800</li>
            <li>Total income tax: £11,200</li>
          </ul>
          <div className="bg-primary/5 p-4 rounded-md my-6">
            <p className="font-medium">Use Our Calculator:</p>
            <p className="mb-4">Instead of calculating manually, use our free Income Tax Calculator to get an accurate calculation of your tax liability for 2025/26.</p>
            <Link href="/income-tax" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 inline-block">
              Calculate Your Income Tax Now
            </Link>
          </div>
        </section>

        <section id="changes" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Key Changes for 2025/26</h2>
          <p>
            Here are the significant changes to income tax for the 2025/26 tax year:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal Allowance increased from £12,570 to £13,500</li>
            <li>Basic rate band expanded to £50,500 (previously £50,270)</li>
            <li>Dividend Allowance decreased to £500 (previously £1,000)</li>
            <li>National Insurance contribution thresholds aligned with income tax bands</li>
          </ul>
          <p>
            These changes will affect most taxpayers in the UK, with many seeing a slight reduction in their overall tax burden.
          </p>
        </section>

        <section id="faq" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">When does the 2025/26 tax year start and end?</h3>
              <p>The 2025/26 tax year runs from April 6, 2025, to April 5, 2026.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Do I need to file a Self Assessment tax return?</h3>
              <p>You may need to file a Self Assessment tax return if you're self-employed, have additional untaxed income, or need to claim certain tax reliefs. The deadline for online submissions is January 31, 2027, for the 2025/26 tax year.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">How do tax codes work?</h3>
              <p>Tax codes tell your employer or pension provider how much tax to deduct. The most common code for 2025/26 will be 1350L, which represents the standard Personal Allowance of £13,500.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">What is the Marriage Allowance?</h3>
              <p>Marriage Allowance lets you transfer £1,350 of your Personal Allowance to your spouse or civil partner, potentially reducing their tax by up to £270 annually. This is beneficial if one partner earns less than the Personal Allowance and the other is a basic rate taxpayer.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">How are bonuses taxed?</h3>
              <p>Bonuses are taxed as regular income, often at your highest marginal rate. As they're added to your regular income, they can push you into a higher tax band, resulting in more tax being deducted.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
          <p>
            Understanding UK income tax rates and how they apply to your earnings is essential for effective financial planning. The 2025/26 tax year brings several changes that could impact your tax liability.
          </p>
          <p>
            To ensure you're paying the correct amount of tax and taking advantage of all available allowances and reliefs, use our Income Tax Calculator and stay informed about the latest tax updates.
          </p>
          <div className="bg-primary/5 p-4 rounded-md my-6">
            <p className="mb-4 font-medium">Need to calculate your tax liability?</p>
            <Link href="/income-tax" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 inline-block">
              Try Our Income Tax Calculator
            </Link>
          </div>
        </section>

        <div className="border-t pt-6 mt-10">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> The information provided in this article is for general informational purposes only and should not be considered as professional tax or financial advice. Tax laws and regulations are complex and subject to change. Always consult with a qualified tax professional for advice specific to your situation.
          </p>
        </div>

        {/* Related Articles */}
        <div className="border-t pt-6 mt-10">
          <h3 className="text-xl font-bold mb-4">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/blog/self-assessment-filing-guide" className="p-4 border rounded-md hover:bg-muted/50">
              <h4 className="font-bold">Self-Assessment Tax Filing: Complete Step-by-Step Guide</h4>
              <p className="text-sm text-muted-foreground">Everything you need to know about filing your self-assessment tax return</p>
            </Link>
            <Link href="/blog/capital-gains-tax-changes-2025" className="p-4 border rounded-md hover:bg-muted/50">
              <h4 className="font-bold">Capital Gains Tax Changes: What You Need to Know</h4>
              <p className="text-sm text-muted-foreground">Detailed breakdown of the recent changes to Capital Gains Tax rates</p>
            </Link>
          </div>
        </div>
      </article>

      {/* Structured data for article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "UK Income Tax Rates & Bands for 2025/26: Complete Guide",
            "description": "Comprehensive guide to UK income tax rates, bands and allowances for 2025/26. Calculate your tax liability with our expert breakdown of personal allowance, basic rate, higher rate and additional rate thresholds.",
            "image": "https://smartcalculator.uk/images/income-tax-guide.jpg",
            "datePublished": "2025-03-25T08:00:00+00:00",
            "dateModified": "2025-03-26T10:00:00+00:00",
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
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://smartcalculator.uk/blog/uk-income-tax-rates-2025"
            }
          })
        }}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "When does the 2025/26 tax year start and end?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 2025/26 tax year runs from April 6, 2025, to April 5, 2026."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to file a Self Assessment tax return?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You may need to file a Self Assessment tax return if you're self-employed, have additional untaxed income, or need to claim certain tax reliefs. The deadline for online submissions is January 31, 2027, for the 2025/26 tax year."
                }
              },
              {
                "@type": "Question",
                "name": "How do tax codes work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Tax codes tell your employer or pension provider how much tax to deduct. The most common code for 2025/26 will be 1350L, which represents the standard Personal Allowance of £13,500."
                }
              },
              {
                "@type": "Question",
                "name": "What is the Marriage Allowance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Marriage Allowance lets you transfer £1,350 of your Personal Allowance to your spouse or civil partner, potentially reducing their tax by up to £270 annually. This is beneficial if one partner earns less than the Personal Allowance and the other is a basic rate taxpayer."
                }
              },
              {
                "@type": "Question",
                "name": "How are bonuses taxed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bonuses are taxed as regular income, often at your highest marginal rate. As they're added to your regular income, they can push you into a higher tax band, resulting in more tax being deducted."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
