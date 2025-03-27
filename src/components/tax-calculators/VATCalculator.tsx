"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BaseTaxCalculator, { TaxInput, TaxResult } from "./BaseTaxCalculator";
import {
  Region,
  formatCurrency,
  ukVATRates,
  euVATRates,
  formatPercentage
} from "@/lib/tax-utils";

// Define rate structures with proper types
interface BasicVATRates {
  standard: number;
  reduced: number;
}

interface SuperReducedVATRates extends BasicVATRates {
  superReduced: number;
}

// Define country specific EU VAT rates
type Country = "germany" | "france" | "italy" | "spain";

// Helper function to type guard for super-reduced rates
function hasSuperReducedRate(rates: BasicVATRates | SuperReducedVATRates): rates is SuperReducedVATRates {
  return 'superReduced' in rates;
}

// EU specific VAT rates (simplified) with proper typing
const EU_VAT_RATES: Record<Country, BasicVATRates | SuperReducedVATRates> = {
  germany: { standard: 19, reduced: 7 },
  france: { standard: 20, reduced: 5.5, superReduced: 2.1 },
  italy: { standard: 22, reduced: 10, superReduced: 4 },
  spain: { standard: 21, reduced: 10, superReduced: 4 }
};

// Helper to safely get superReduced rate
function getSuperReducedRate(country: Country): number {
  const rates = EU_VAT_RATES[country];
  if (hasSuperReducedRate(rates)) {
    return rates.superReduced;
  }
  return 0;
}

// Country has super-reduced rate?
function countrySupportsSuperReducedRate(country: Country): boolean {
  return country === "france" || country === "italy" || country === "spain";
}

// US sales tax rates (simplified)
const usStateSalesTaxRates = {
  "california": { state: 7.25, average: 8.82 },
  "new_york": { state: 4, average: 8.52 },
  "texas": { state: 6.25, average: 8.19 },
  "florida": { state: 6, average: 7.08 }
};

type VATRateType = "standard" | "reduced" | "zero" | "superReduced";

export default function VATCalculator({ region }: { region: Region }) {
  const [priceExcludingVAT, setPriceExcludingVAT] = useState<number>(100);
  const [rateType, setRateType] = useState<VATRateType>("standard");
  const [euCountry, setEuCountry] = useState<Country>("germany");
  const [usState, setUsState] = useState<string>("california");
  const [localTaxRate, setLocalTaxRate] = useState<number>(0);
  const [includeLocalTax, setIncludeLocalTax] = useState<boolean>(true);
  const [taxResults, setTaxResults] = useState<TaxResult[]>([]);

  const calculateVAT = () => {
    let results: TaxResult[] = [];

    if (region === "uk") {
      // UK VAT calculation
      let vatRate = 0;

      switch (rateType) {
        case "standard":
          vatRate = ukVATRates.standard;
          break;
        case "reduced":
          vatRate = ukVATRates.reduced;
          break;
        case "zero":
          vatRate = ukVATRates.zero;
          break;
        default:
          vatRate = ukVATRates.standard;
      }

      const vatAmount = priceExcludingVAT * (vatRate / 100);
      const totalPrice = priceExcludingVAT + vatAmount;

      results = [
        {
          label: "Price (ex VAT)",
          value: priceExcludingVAT
        },
        {
          label: "VAT Rate",
          value: vatRate,
          description: `${rateType} rate`
        },
        {
          label: "VAT Amount",
          value: vatAmount
        },
        {
          label: "Total Price (inc VAT)",
          value: totalPrice,
          isTotal: true
        }
      ];
    }
    else if (region === "eu") {
      // EU VAT calculation
      const countryRates = EU_VAT_RATES[euCountry];
      let vatRate = 0;

      // Determine VAT rate based on country and rate type
      if (rateType === "standard") {
        vatRate = countryRates.standard;
      }
      else if (rateType === "reduced") {
        vatRate = countryRates.reduced;
      }
      else if (rateType === "superReduced") {
        if (euCountry === "germany") {
          vatRate = 0; // Germany doesn't have super-reduced rate
        } else {
          // Only France, Italy, and Spain have super-reduced rates
          // Type guard to check if superReduced exists on the rate object
          if (hasSuperReducedRate(countryRates)) {
            vatRate = countryRates.superReduced;
          }
        }
      }
      else if (rateType === "zero") {
        vatRate = 0;
      }

      const vatAmount = priceExcludingVAT * (vatRate / 100);
      const totalPrice = priceExcludingVAT + vatAmount;

      results = [
        {
          label: "Price (ex VAT)",
          value: priceExcludingVAT
        },
        {
          label: "VAT Rate",
          value: vatRate,
          description: `${rateType} rate in ${euCountry}`
        },
        {
          label: "VAT Amount",
          value: vatAmount
        },
        {
          label: "Total Price (inc VAT)",
          value: totalPrice,
          isTotal: true
        }
      ];
    }
    else if (region === "us") {
      // US Sales Tax calculation
      const stateRates = usStateSalesTaxRates[usState as keyof typeof usStateSalesTaxRates];

      if (!stateRates) {
        results = [{ label: "Error", value: 0, description: "State data not available" }];
        return;
      }

      const stateTaxRate = stateRates.state;
      const combinedRate = includeLocalTax
        ? stateRates.average
        : stateTaxRate + localTaxRate;

      const salesTaxAmount = priceExcludingVAT * (combinedRate / 100);
      const totalPrice = priceExcludingVAT + salesTaxAmount;

      results = [
        {
          label: "Price (before tax)",
          value: priceExcludingVAT
        },
        {
          label: "State Sales Tax",
          value: priceExcludingVAT * (stateTaxRate / 100),
          description: `${stateTaxRate}% state rate`
        }
      ];

      if (includeLocalTax) {
        const localAmount = priceExcludingVAT * ((combinedRate - stateTaxRate) / 100);
        results.push({
          label: "Local Sales Tax",
          value: localAmount,
          description: `${(combinedRate - stateTaxRate).toFixed(2)}% average local rate`
        });
      } else if (localTaxRate > 0) {
        const localAmount = priceExcludingVAT * (localTaxRate / 100);
        results.push({
          label: "Local Sales Tax",
          value: localAmount,
          description: `${localTaxRate}% custom local rate`
        });
      }

      results.push(
        {
          label: "Total Sales Tax",
          value: salesTaxAmount,
          description: `Combined rate: ${combinedRate}%`
        },
        {
          label: "Total Price (inc tax)",
          value: totalPrice,
          isTotal: true
        }
      );
    }

    setTaxResults(results);
  };

  // Update available rate types when EU country changes
  useEffect(() => {
    if (region === "eu" && rateType === "superReduced" && euCountry === "germany") {
      setRateType("standard");
    }
  }, [euCountry, region, rateType]);

  // Calculate tax on initial render and when inputs change
  useEffect(() => {
    calculateVAT();
  }, [priceExcludingVAT, rateType, euCountry, usState, localTaxRate, includeLocalTax, region]);

  return (
    <BaseTaxCalculator
      region={region}
      title={region === "us" ? "Sales Tax Calculator" : "VAT Calculator"}
      description={`Calculate ${region === "us" ? "sales tax" : "value added tax"} for ${region === "uk" ? "UK" : region === "eu" ? "EU" : "US"} purchases.`}
      taxResults={taxResults}
    >
      <TaxInput
        id="price-excluding-vat"
        label={`Price (${region === "us" ? "before tax" : "excluding VAT"})`}
        value={priceExcludingVAT}
        onChange={(value) => setPriceExcludingVAT(Number(value) || 0)}
        required
        min={0}
        placeholder="Enter the price excluding tax"
        prefix={region === "uk" ? "£" : region === "eu" ? "€" : "$"}
      />

      {region === "uk" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">VAT Rate</label>
          <Select value={rateType} onValueChange={(value) => setRateType(value as VATRateType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select VAT rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Rate (20%)</SelectItem>
              <SelectItem value="reduced">Reduced Rate (5%)</SelectItem>
              <SelectItem value="zero">Zero Rate (0%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {region === "eu" && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select
              value={euCountry}
              onValueChange={(value) => setEuCountry(value as Country)}
            >
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

          <div className="space-y-2">
            <label className="text-sm font-medium">VAT Rate</label>
            <Select value={rateType} onValueChange={(value) => setRateType(value as VATRateType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select VAT rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  Standard Rate ({EU_VAT_RATES[euCountry].standard}%)
                </SelectItem>
                <SelectItem value="reduced">
                  Reduced Rate ({EU_VAT_RATES[euCountry].reduced}%)
                </SelectItem>
                {countrySupportsSuperReducedRate(euCountry) && (
                  <SelectItem value="superReduced">
                    Super-Reduced Rate ({getSuperReducedRate(euCountry)}%)
                  </SelectItem>
                )}
                <SelectItem value="zero">Zero Rate (0%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {region === "us" && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <Select value={usState} onValueChange={setUsState}>
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="california">California</SelectItem>
                <SelectItem value="new_york">New York</SelectItem>
                <SelectItem value="texas">Texas</SelectItem>
                <SelectItem value="florida">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="include-local-tax"
              checked={includeLocalTax}
              onChange={(e) => setIncludeLocalTax(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="include-local-tax" className="text-sm font-medium">
              Use average local tax rate
            </label>
          </div>

          {!includeLocalTax && (
            <TaxInput
              id="local-tax-rate"
              label="Custom Local Tax Rate"
              value={localTaxRate}
              onChange={(value) => setLocalTaxRate(Number(value) || 0)}
              required
              min={0}
              max={15}
              step="0.1"
              placeholder="Enter local tax rate"
              suffix="%"
              helperText={`Base state rate: ${usStateSalesTaxRates[usState as keyof typeof usStateSalesTaxRates]?.state || 0}%`}
            />
          )}
        </>
      )}
    </BaseTaxCalculator>
  );
}
