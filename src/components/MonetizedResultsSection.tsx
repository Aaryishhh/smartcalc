"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import AdBanner from '@/components/AdBanner';
import { event } from '@/lib/gtag';
import { Card } from '@/components/ui/card';

interface ResultsData {
  title: string;
  summary: string;
  amount: number;
  breakdown: {
    label: string;
    value: number;
    percentage?: number;
    highlighted?: boolean;
  }[];
  taxYear: string;
  date: string;
}

interface MonetizedResultsSectionProps {
  results: ResultsData;
  calculatorType: string;
  onReset: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
  adSlots?: {
    main?: string;
    related?: string;
  };
}

export default function MonetizedResultsSection({
  results,
  calculatorType,
  onReset,
  onShare,
  onSave,
  onPrint,
  adSlots = {
    main: "1234567890",
    related: "2345678901"
  }
}: MonetizedResultsSectionProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [timeSinceCalculation, setTimeSinceCalculation] = useState(0);
  const [showRelatedAd, setShowRelatedAd] = useState(false);

  // Track results view for analytics
  useEffect(() => {
    // Track the event when results are shown
    event({
      action: 'view_results',
      category: calculatorType,
      label: results.taxYear,
      value: Math.round(results.amount)
    });

    // Start timer for showing additional ad
    const timer = setTimeout(() => {
      setShowRelatedAd(true);
    }, 6000); // Show related ad after 6 seconds

    // Update time counter since calculation (creates urgency)
    const timeInterval = setInterval(() => {
      setTimeSinceCalculation(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, [calculatorType, results]);

  // Action tracking for engagement metrics
  const trackAction = (action: string) => {
    event({
      action,
      category: calculatorType,
      label: 'results_interaction'
    });
  };

  return (
    <div className="results-container space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">{results.title}</h2>
        <span className="text-sm text-muted-foreground">
          {timeSinceCalculation < 60
            ? `Calculated ${timeSinceCalculation}s ago`
            : `Calculated ${Math.floor(timeSinceCalculation/60)}m ago`}
        </span>
      </div>

      <div className="summary-box bg-primary/5 p-4 rounded-lg border border-primary/10">
        <p className="text-lg mb-1">{results.summary}</p>
        <p className="text-3xl font-bold text-primary">
          {typeof results.amount === 'number'
            ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(results.amount)
            : results.amount}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Tax year: {results.taxYear} • Calculated on {results.date}
        </p>
      </div>

      {/* High-CTR main ad placement */}
      <AdBanner
        adSlot={adSlots.main || "1234567890"}  // Provide fallback value
        placement="results"
        testMode={true}
      />

      <div className="breakdown-section">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Tax Breakdown</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowMoreInfo(!showMoreInfo);
              trackAction(showMoreInfo ? 'hide_breakdown' : 'show_breakdown');
            }}
          >
            {showMoreInfo ? 'Show less' : 'Show more'}
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {results.breakdown.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between py-2 border-b ${
                item.highlighted ? 'bg-secondary/10 px-2 rounded' : ''
              } ${index === results.breakdown.length - 1 ? 'border-b-0 font-medium' : ''}`}
            >
              <span>{item.label}</span>
              <div className="flex items-center">
                {item.percentage && (
                  <span className="text-muted-foreground text-sm mr-3">
                    {item.percentage}%
                  </span>
                )}
                <span>
                  {typeof item.value === 'number'
                    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.value)
                    : item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {showMoreInfo && (
          <div className="mt-6 p-4 bg-secondary/5 rounded-lg border border-border animate-in fade-in-50 duration-200">
            <h4 className="font-medium mb-2">How this is calculated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This calculation is based on the current {results.taxYear} tax rates and allowances.
              Tax rates may vary based on your individual circumstances.
            </p>

            <div className="text-sm space-y-2">
              <p>• Personal Allowance: £12,570</p>
              <p>• Basic Rate: 20% (£12,571 to £50,270)</p>
              <p>• Higher Rate: 40% (£50,271 to £125,140)</p>
              <p>• Additional Rate: 45% (over £125,140)</p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = "/tax-rates";
                  trackAction('view_tax_rates');
                }}
              >
                View all tax rates
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = "/income-tax-guide";
                  trackAction('view_guide');
                }}
              >
                Tax guide
              </Button>
            </div>

            {/* Related content ad - high relevance placement */}
            {showRelatedAd && (
              <div className="mt-4">
                <AdBanner
                  adSlot={adSlots.related || "2345678901"}  // Provide fallback value
                  placement="content"
                  testMode={true}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="actions-section flex flex-wrap gap-2 justify-between items-center border-t pt-4">
        <div className="flex gap-2">
          {onSave && (
            <Button
              onClick={() => {
                onSave();
                trackAction('save_results');
              }}
              variant="secondary"
              size="sm"
            >
              Save
            </Button>
          )}

          {onPrint && (
            <Button
              onClick={() => {
                onPrint();
                trackAction('print_results');
              }}
              variant="outline"
              size="sm"
            >
              Print
            </Button>
          )}

          {onShare && (
            <Button
              onClick={() => {
                onShare();
                trackAction('share_results');
              }}
              variant="outline"
              size="sm"
            >
              Share
            </Button>
          )}
        </div>

        <Button
          onClick={() => {
            onReset();
            trackAction('recalculate');
          }}
          variant="outline"
          size="sm"
        >
          Recalculate
        </Button>
      </div>

      {/* Related calculators section */}
      <div className="related-calculators mt-8 pt-4 border-t">
        <h3 className="font-medium mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <RelatedCalculatorCard
            title="Salary Calculator"
            url="/take-home-pay"
            onClick={() => trackAction('related_calc_salary')}
          />
          <RelatedCalculatorCard
            title="Tax Comparison"
            url="/tax-comparison"
            onClick={() => trackAction('related_calc_comparison')}
          />
          <RelatedCalculatorCard
            title="Tax Savings"
            url="/tax-savings"
            onClick={() => trackAction('related_calc_savings')}
          />
        </div>
      </div>
    </div>
  );
}

function RelatedCalculatorCard({ title, url, onClick }: { title: string; url: string; onClick: () => void }) {
  return (
    <Card
      className="p-3 hover:shadow-md transition-shadow cursor-pointer hover:border-primary/20"
      onClick={() => {
        onClick();
        window.location.href = url;
      }}
    >
      <div className="flex justify-between items-center">
        <span>{title}</span>
        <span className="text-primary text-sm">→</span>
      </div>
    </Card>
  );
}
