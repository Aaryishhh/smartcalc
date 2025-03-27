"use client";

import { useState, useEffect } from "react";
import {
  calculateTaxWithBrackets,
  ukDividendTaxBrackets,
  usDividendTaxBrackets,
  euDividendTaxRates,
  formatCurrency,
  formatPercentage,
  Region
} from "@/lib/tax-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TaxInput } from "./BaseTaxCalculator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DividendTaxCalculator({ region }: { region: Region }) {
  const [dividendAmount, setDividendAmount] = useState<number>(10000);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);
  const [filingStatus, setFilingStatus] = useState<string>("single");
  const [euCountry, setEuCountry] = useState<string>("germany");

  // Tax calculation
  const calculateDividendTax = () => {
    let tax = 0;

    if (region === "uk") {
      tax = calculateTaxWithBrackets(dividendAmount, ukDividendTaxBrackets);
    }
    else if (region === "us") {
      const bracketsByStatus = usDividendTaxBrackets[filingStatus] || usDividendTaxBrackets.single;
      tax = calculateTaxWithBrackets(dividendAmount, bracketsByStatus);
    }
    else if (region === "eu") {
      // For EU, using flat rates
      const rate = euDividendTaxRates[euCountry] || euDividendTaxRates.germany;
      tax = (dividendAmount * rate) / 100;
    }

    setTaxAmount(tax);
    setEffectiveRate(dividendAmount > 0 ? (tax / dividendAmount) * 100 : 0);
  };

  // Recalculate when inputs change
  useEffect(() => {
    calculateDividendTax();
  }, [dividendAmount, region, filingStatus, euCountry]);

  // Create tax breakdown
  const getTaxBreakdown = () => {
    if (region === "uk") {
      return ukDividendTaxBrackets.map((bracket, index) => {
        const min = bracket.min;
        const max = bracket.max === null ? Infinity : bracket.max;
        const applicable = dividendAmount > min;
        const taxableAmount = applicable
          ? Math.min(dividendAmount - min, max - min + 1) > 0
            ? Math.min(dividendAmount - min, max - min + 1)
            : 0
          : 0;
        const taxForBracket = (taxableAmount * bracket.rate) / 100;

        return {
          name: bracket.name || `Bracket ${index + 1}`,
          rate: bracket.rate,
          taxableAmount,
          tax: taxForBracket,
          applicable
        };
      }).filter(bracket => bracket.applicable);
    }
    else if (region === "us") {
      const brackets = usDividendTaxBrackets[filingStatus] || usDividendTaxBrackets.single;

      return brackets.map((bracket, index) => {
        const min = bracket.min;
        const max = bracket.max === null ? Infinity : bracket.max;
        const applicable = dividendAmount > min;
        const taxableAmount = applicable
          ? Math.min(dividendAmount - min, max - min + 1) > 0
            ? Math.min(dividendAmount - min, max - min + 1)
            : 0
          : 0;
        const taxForBracket = (taxableAmount * bracket.rate) / 100;

        return {
          name: bracket.name || `Bracket ${index + 1}`,
          rate: bracket.rate,
          taxableAmount,
          tax: taxForBracket,
          applicable
        };
      }).filter(bracket => bracket.applicable);
    }
    else if (region === "eu") {
      const rate = euDividendTaxRates[euCountry] || euDividendTaxRates.germany;

      return [{
        name: "Flat Rate",
        rate: rate,
        taxableAmount: dividendAmount,
        tax: (dividendAmount * rate) / 100,
        applicable: true
      }];
    }

    return [];
  };

  const taxBreakdown = getTaxBreakdown();

  // Format for region-specific content
  const getRegionContent = () => {
    if (region === "uk") {
      return (
        <div className="text-sm text-muted-foreground mt-4">
          <p>The UK taxes dividends above the £500 dividend allowance at rates of 8.75% (basic), 33.75% (higher) and 39.35% (additional) based on your income tax band.</p>
        </div>
      );
    }
    else if (region === "us") {
      return (
        <div className="space-y-4">
          <div>
            <Label>Filing Status</Label>
            <Tabs defaultValue="single" value={filingStatus} onValueChange={setFilingStatus} className="mt-2">
              <TabsList className="grid grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="single">Single</TabsTrigger>
                <TabsTrigger value="married">Married Joint</TabsTrigger>
                <TabsTrigger value="head">Head of Household</TabsTrigger>
                <TabsTrigger value="separate">Married Separate</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Rates shown are for qualified dividends. Ordinary dividends are taxed at standard income tax rates.</p>
          </div>
        </div>
      );
    }
    else if (region === "eu") {
      return (
        <div className="space-y-4">
          <div>
            <Label>EU Country</Label>
            <Tabs defaultValue="germany" value={euCountry} onValueChange={setEuCountry} className="mt-2">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="germany">Germany</TabsTrigger>
                <TabsTrigger value="france">France</TabsTrigger>
                <TabsTrigger value="spain">Spain</TabsTrigger>
                <TabsTrigger value="italy">Italy</TabsTrigger>
                <TabsTrigger value="netherlands">Netherlands</TabsTrigger>
                <TabsTrigger value="belgium">Belgium</TabsTrigger>
                <TabsTrigger value="sweden">Sweden</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>European countries typically apply flat withholding taxes on dividend income.</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const currencySymbol = region === "uk" ? "£" : region === "eu" ? "€" : "$";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Dividend Tax Calculator</h3>
            <div className="space-y-4">
              <TaxInput
                id="dividend-amount"
                label="Dividend Amount"
                value={dividendAmount}
                onChange={(value) => setDividendAmount(Number(value) || 0)}
                prefix={currencySymbol}
                required
              />

              {getRegionContent()}
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tax Calculation Results</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Dividend Income</p>
                  <p className="text-2xl font-semibold">{formatCurrency(dividendAmount, region)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Tax Due</p>
                  <p className="text-2xl font-semibold">{formatCurrency(taxAmount, region)}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Effective Tax Rate:</span>
                  <span className="font-medium">{formatPercentage(effectiveRate)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Net Dividend:</span>
                  <span className="font-medium">{formatCurrency(dividendAmount - taxAmount, region)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Tax Breakdown</h4>
                <div className="space-y-2">
                  {taxBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/20 rounded text-sm">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground ml-2">({formatPercentage(item.rate)})</span>
                      </div>
                      <span>{formatCurrency(item.tax, region)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
