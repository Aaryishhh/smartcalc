"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxInput, SliderInput } from "./tax-calculators/BaseTaxCalculator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  calculateTaxWithBrackets,
  ukIncomeTaxBrackets,
  usFederalIncomeTaxBrackets,
  formatCurrency,
  euIncomeTaxBrackets
} from "@/lib/tax-utils";

// US State income tax rates (simplified)
const usStateTaxRates = {
  california: [
    { min: 0, max: 10099, rate: 1 },
    { min: 10100, max: 23942, rate: 2 },
    { min: 23943, max: 37788, rate: 4 },
    { min: 37789, max: 52455, rate: 6 },
    { min: 52456, max: null, rate: 8 }
  ],
  new_york: [
    { min: 0, max: 8500, rate: 4 },
    { min: 8501, max: 11700, rate: 4.5 },
    { min: 11701, max: 13900, rate: 5.25 },
    { min: 13901, max: 80650, rate: 5.85 },
    { min: 80651, max: null, rate: 6.25 }
  ],
  texas: [], // No state income tax
  florida: [], // No state income tax
  washington: [], // No state income tax
  colorado: [
    { min: 0, max: null, rate: 4.4 } // Flat tax rate
  ],
  illinois: [
    { min: 0, max: null, rate: 4.95 } // Flat tax rate
  ]
};

export default function TaxComparison() {
  const [income, setIncome] = useState<number>(50000);
  const [selectedTaxType, setSelectedTaxType] = useState<string>("income");
  const [euCountry, setEuCountry] = useState<string>("germany");
  const [usState, setUsState] = useState<string>("california");

  // Calculate income tax for each region
  const ukIncomeTax = calculateTaxWithBrackets(income, ukIncomeTaxBrackets);

  // EU Tax calculation
  let euIncomeTax = 0;
  if (euCountry in euIncomeTaxBrackets) {
    euIncomeTax = calculateTaxWithBrackets(income, euIncomeTaxBrackets[euCountry]);
  }

  // US Tax calculation
  const usFederalTax = calculateTaxWithBrackets(income, usFederalIncomeTaxBrackets);
  const usStateTax = calculateTaxWithBrackets(income, usStateTaxRates[usState as keyof typeof usStateTaxRates] || []);
  const usTotalTax = usFederalTax + usStateTax;

  // Calculate effective tax rates
  const ukEffectiveRate = (ukIncomeTax / income) * 100;
  const euEffectiveRate = (euIncomeTax / income) * 100;
  const usEffectiveRate = (usTotalTax / income) * 100;

  // Find the highest and lowest tax rates
  const taxRates = [
    { region: "UK", rate: ukEffectiveRate, amount: ukIncomeTax },
    { region: "EU", rate: euEffectiveRate, amount: euIncomeTax },
    { region: "US", rate: usEffectiveRate, amount: usTotalTax }
  ].sort((a, b) => a.rate - b.rate);

  const lowestTax = taxRates[0];
  const highestTax = taxRates[2];
  const difference = highestTax.rate - lowestTax.rate;

  // Format currency with proper region
  const formattedDifference = formatCurrency(
    highestTax.amount - lowestTax.amount,
    lowestTax.region.toLowerCase() as "uk" | "eu" | "us"
  );

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent/20 shadow-lg">
        <CardHeader>
          <CardTitle>Tax Rate Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <h3 className="text-lg font-medium">Input Parameters</h3>

              <SliderInput
                id="comparison-income"
                label="Annual Income"
                value={income}
                onChange={(value) => setIncome(value)}
                prefix="$"
                required
                min={10000}
                max={500000}
                step={5000}
                formatDisplay={(value) => value.toLocaleString()}
              />

              <div>
                <label className="block text-sm font-medium mb-2">Tax Type</label>
                <div className="mt-2">
                  <Select value={selectedTaxType} onValueChange={setSelectedTaxType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tax type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income Tax</SelectItem>
                      <SelectItem value="capital-gains" disabled>Capital Gains Tax</SelectItem>
                      <SelectItem value="vat" disabled>VAT/Sales Tax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">EU Country</label>
                <div className="mt-2">
                  <Select value={euCountry} onValueChange={setEuCountry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="germany">Germany</SelectItem>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="spain">Spain</SelectItem>
                      <SelectItem value="italy">Italy</SelectItem>
                      <SelectItem value="netherlands">Netherlands</SelectItem>
                      <SelectItem value="belgium">Belgium</SelectItem>
                      <SelectItem value="sweden">Sweden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">US State</label>
                <div className="mt-2">
                  <Select value={usState} onValueChange={setUsState}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="california">California</SelectItem>
                      <SelectItem value="new_york">New York</SelectItem>
                      <SelectItem value="texas">Texas</SelectItem>
                      <SelectItem value="florida">Florida</SelectItem>
                      <SelectItem value="washington">Washington</SelectItem>
                      <SelectItem value="colorado">Colorado</SelectItem>
                      <SelectItem value="illinois">Illinois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Comparison Results</h3>
              <div className="space-y-4">
                {/* UK Tax Result */}
                <div className="p-4 rounded-lg border border-muted">
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-2 gap-1">
                    <span className="font-medium">UK (GBP)</span>
                    <span>{formatCurrency(ukIncomeTax, "uk")}</span>
                  </div>
                  <div className="h-3 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-[hsl(var(--income-tax))]"
                      style={{ width: `${(ukEffectiveRate / highestTax.rate) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-right mt-1">Effective Rate: {ukEffectiveRate.toFixed(2)}%</div>
                </div>

                {/* EU Tax Result */}
                <div className="p-4 rounded-lg border border-muted">
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-2 gap-1">
                    <span className="font-medium">EU ({euCountry}) (EUR)</span>
                    <span>{formatCurrency(euIncomeTax, "eu")}</span>
                  </div>
                  <div className="h-3 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-[hsl(var(--indirect-tax))]"
                      style={{ width: `${(euEffectiveRate / highestTax.rate) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-right mt-1">Effective Rate: {euEffectiveRate.toFixed(2)}%</div>
                </div>

                {/* US Tax Result */}
                <div className="p-4 rounded-lg border border-muted">
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-2 gap-1">
                    <span className="font-medium">US ({usState.replace('_', ' ')}) (USD)</span>
                    <span>{formatCurrency(usTotalTax, "us")}</span>
                  </div>
                  <div className="h-3 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-[hsl(var(--business-tax))]"
                      style={{ width: `${(usEffectiveRate / highestTax.rate) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-right mt-1">Effective Rate: {usEffectiveRate.toFixed(2)}%</div>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-lg bg-muted/10 border border-muted mt-6">
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <div className="space-y-2">
                    <div className="flex flex-col xs:flex-row justify-between">
                      <span>Lowest Tax:</span>
                      <span className="font-medium">{lowestTax.region} at {lowestTax.rate.toFixed(2)}%</span>
                    </div>
                    <div className="flex flex-col xs:flex-row justify-between">
                      <span>Highest Tax:</span>
                      <span className="font-medium">{highestTax.region} at {highestTax.rate.toFixed(2)}%</span>
                    </div>
                    <div className="flex flex-col xs:flex-row justify-between">
                      <span>Difference:</span>
                      <span className="font-medium">{difference.toFixed(2)}% ({formattedDifference})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
