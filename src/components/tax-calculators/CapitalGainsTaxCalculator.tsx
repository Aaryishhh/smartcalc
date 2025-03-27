"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import BaseTaxCalculator, { TaxInput, TaxResult } from "./BaseTaxCalculator";
import {
  Region,
  formatCurrency,
  ukCapitalGainsTaxBrackets,
  formatPercentage
} from "@/lib/tax-utils";

// EU Capital Gains Tax rates (simplified, varies by country)
interface SimpleRateCountry {
  rate: number;
  allowance: number;
}

interface ProgressiveRateCountry {
  rates: Array<{
    min: number;
    max: number | null;
    rate: number;
  }>;
  allowance: number;
}

type CountryRates = SimpleRateCountry | ProgressiveRateCountry;

const euCapitalGainsTaxRates: Record<string, CountryRates> = {
  "germany": { rate: 25, allowance: 1000 },
  "france": { rate: 30, allowance: 0 }, // Flat rate with no allowance
  "italy": { rate: 26, allowance: 0 },
  "spain": {
    rates: [
      { min: 0, max: 6000, rate: 19 },
      { min: 6001, max: 50000, rate: 21 },
      { min: 50001, max: 200000, rate: 23 },
      { min: 200001, max: null, rate: 26 }
    ],
    allowance: 0
  }
};

// US Capital Gains Tax rates (simplified, 2024)
const usCapitalGainsTaxRates = {
  shortTerm: [
    { min: 0, max: 11600, rate: 10 },
    { min: 11601, max: 47150, rate: 12 },
    { min: 47151, max: 100525, rate: 22 },
    { min: 100526, max: 191950, rate: 24 },
    { min: 191951, max: 243725, rate: 32 },
    { min: 243726, max: 609350, rate: 35 },
    { min: 609351, max: null, rate: 37 }
  ],
  longTerm: [
    { min: 0, max: 44625, rate: 0 },
    { min: 44626, max: 492300, rate: 15 },
    { min: 492301, max: null, rate: 20 }
  ]
};

export default function CapitalGainsTaxCalculator({ region }: { region: Region }) {
  const [purchaseAmount, setPurchaseAmount] = useState<number>(100000);
  const [saleAmount, setSaleAmount] = useState<number>(150000);
  const [isResidentialProperty, setIsResidentialProperty] = useState<boolean>(false);
  const [isHigherRateTaxpayer, setIsHigherRateTaxpayer] = useState<boolean>(false);
  const [euCountry, setEuCountry] = useState<string>("germany");
  const [isLongTerm, setIsLongTerm] = useState<boolean>(true);
  const [taxResults, setTaxResults] = useState<TaxResult[]>([]);

  const calculateTax = () => {
    let results: TaxResult[] = [];
    const gain = saleAmount - purchaseAmount;

    if (gain <= 0) {
      results = [
        {
          label: "Total Gain/Loss",
          value: gain,
          description: "No tax is due on capital losses."
        }
      ];
    } else {
      if (region === "uk") {
        // UK Capital Gains Tax calculation
        const taxableGain = Math.max(0, gain - (ukCapitalGainsTaxBrackets[0]?.max || 0));
        const taxRate = isHigherRateTaxpayer ?
          (isResidentialProperty ? 28 : 20) :
          (isResidentialProperty ? 18 : 10);

        const taxAmount = taxableGain * (taxRate / 100);

        results = [
          {
            label: "Total Gain",
            value: gain
          },
          {
            label: "Annual Exemption",
            value: Math.min(ukCapitalGainsTaxBrackets[0]?.max || 0, gain)
          },
          {
            label: "Taxable Gain",
            value: taxableGain
          },
          {
            label: "Tax Rate",
            value: taxRate,
            description: `${isHigherRateTaxpayer ? "Higher/Additional" : "Basic"} rate taxpayer${isResidentialProperty ? " (Residential Property)" : ""}`
          },
          {
            label: "Capital Gains Tax",
            value: taxAmount,
            isTotal: true
          }
        ];
      }
      else if (region === "eu") {
        // EU Capital Gains Tax calculation
        const countryRates = euCapitalGainsTaxRates[euCountry as keyof typeof euCapitalGainsTaxRates];

        if (!countryRates) {
          results = [{ label: "Error", value: 0, description: "Country data not available" }];
        } else {
          const taxableGain = Math.max(0, gain - (countryRates.allowance || 0));
          let taxAmount = 0;

          if (euCountry === "spain" && 'rates' in countryRates) {
            // Spain has progressive rates
            const rates = countryRates.rates;
            let remainingGain = taxableGain;

            for (const bracket of rates) {
              if (remainingGain <= 0) break;

              const { min, max, rate } = bracket;
              const bracketSize = max === null ? remainingGain : Math.min(max - min + 1, remainingGain);

              taxAmount += bracketSize * (rate / 100);
              remainingGain -= bracketSize;
            }
          } else if ('rate' in countryRates) {
            // Flat rate countries
            taxAmount = taxableGain * (countryRates.rate / 100);
          }

          results = [
            {
              label: "Total Gain",
              value: gain
            },
            {
              label: "Tax-Free Allowance",
              value: countryRates.allowance || 0
            },
            {
              label: "Taxable Gain",
              value: taxableGain
            },
            {
              label: "Capital Gains Tax",
              value: taxAmount,
              isTotal: true
            }
          ];
        }
      }
      else if (region === "us") {
        // US Capital Gains Tax calculation
        const applicableRates = isLongTerm ? usCapitalGainsTaxRates.longTerm : usCapitalGainsTaxRates.shortTerm;

        let taxAmount = 0;
        let remainingGain = gain;

        for (const bracket of applicableRates) {
          if (remainingGain <= 0) break;

          const { min, max, rate } = bracket;
          const bracketSize = max === null ? remainingGain : Math.min(max - min + 1, remainingGain);

          taxAmount += bracketSize * (rate / 100);
          remainingGain -= bracketSize;
        }

        results = [
          {
            label: "Total Gain",
            value: gain
          },
          {
            label: "Holding Period",
            value: 0,
            description: isLongTerm ? "Long-term (Over 1 year)" : "Short-term (1 year or less)"
          },
          {
            label: "Capital Gains Tax",
            value: taxAmount,
            isTotal: true
          }
        ];
      }
    }

    setTaxResults(results);
  };

  // Calculate tax on initial render and when inputs change
  useEffect(() => {
    calculateTax();
  }, [purchaseAmount, saleAmount, isResidentialProperty, isHigherRateTaxpayer, euCountry, isLongTerm, region]);

  return (
    <BaseTaxCalculator
      region={region}
      title="Capital Gains Tax Calculator"
      description={`Calculate capital gains tax for ${region === "uk" ? "UK" : region === "eu" ? "EU" : "US"} residents.`}
      taxResults={taxResults}
    >
      <TaxInput
        id="purchase-amount"
        label="Purchase Amount"
        value={purchaseAmount}
        onChange={(value) => setPurchaseAmount(Number(value) || 0)}
        required
        min={0}
        placeholder="Enter the purchase amount"
        prefix={region === "uk" ? "£" : region === "eu" ? "€" : "$"}
      />

      <TaxInput
        id="sale-amount"
        label="Sale Amount"
        value={saleAmount}
        onChange={(value) => setSaleAmount(Number(value) || 0)}
        required
        min={0}
        placeholder="Enter the sale amount"
        prefix={region === "uk" ? "£" : region === "eu" ? "€" : "$"}
      />

      {region === "uk" && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-residential"
              checked={isResidentialProperty}
              onCheckedChange={(checked) => setIsResidentialProperty(checked === true)}
            />
            <label htmlFor="is-residential" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Residential Property
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-higher-rate"
              checked={isHigherRateTaxpayer}
              onCheckedChange={(checked) => setIsHigherRateTaxpayer(checked === true)}
            />
            <label htmlFor="is-higher-rate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Higher/Additional Rate Taxpayer
            </label>
          </div>
        </>
      )}

      {region === "eu" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Select value={euCountry} onValueChange={setEuCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="italy">Italy</SelectItem>
              <SelectItem value="spain">Spain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {region === "us" && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is-long-term"
            checked={isLongTerm}
            onCheckedChange={(checked) => setIsLongTerm(checked === true)}
          />
          <label htmlFor="is-long-term" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Long-term holding (over 1 year)
          </label>
        </div>
      )}
    </BaseTaxCalculator>
  );
}
