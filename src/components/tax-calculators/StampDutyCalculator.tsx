"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import BaseTaxCalculator, { TaxInput, TaxResult } from "./BaseTaxCalculator";
import { Region, formatCurrency, formatPercentage } from "@/lib/tax-utils";

// UK Stamp Duty Land Tax rates (2024)
const ukStampDutyRates = {
  residential: [
    { min: 0, max: 250000, rate: 0 }, // 0% up to £250,000
    { min: 250001, max: 925000, rate: 5 }, // 5% on portion from £250,001 to £925,000
    { min: 925001, max: 1500000, rate: 10 }, // 10% on portion from £925,001 to £1.5 million
    { min: 1500001, max: null, rate: 12 }, // 12% on portion above £1.5 million
  ],
  residential_additional: [
    { min: 0, max: 250000, rate: 3 }, // 3% up to £250,000
    { min: 250001, max: 925000, rate: 8 }, // 8% on portion from £250,001 to £925,000
    { min: 925001, max: 1500000, rate: 13 }, // 13% on portion from £925,001 to £1.5 million
    { min: 1500001, max: null, rate: 15 }, // 15% on portion above £1.5 million
  ],
  nonresidential: [
    { min: 0, max: 150000, rate: 0 }, // 0% up to £150,000
    { min: 150001, max: 250000, rate: 2 }, // 2% on portion from £150,001 to £250,000
    { min: 250001, max: null, rate: 5 }, // 5% on portion above £250,000
  ],
  firstTimeBuyer: [
    { min: 0, max: 425000, rate: 0 }, // 0% up to £425,000
    { min: 425001, max: 625000, rate: 5 }, // 5% on portion from £425,001 to £625,000
    { min: 625001, max: 925000, rate: 5 }, // 5% on portion from £625,001 to £925,000
    { min: 925001, max: 1500000, rate: 10 }, // 10% on portion from £925,001 to £1.5 million
    { min: 1500001, max: null, rate: 12 }, // 12% on portion above £1.5 million
  ],
};

// EU Property Transfer Taxes (simplified average across EU countries)
const euPropertyTaxRates = {
  france: {
    residential: [
      { min: 0, max: null, rate: 5.8 }, // Standard rate
    ],
    nonresidential: [
      { min: 0, max: null, rate: 5.8 }, // Standard rate
    ],
  },
  germany: {
    residential: [
      { min: 0, max: null, rate: 3.5 }, // Varies by region from 3.5% to 6.5%
    ],
    nonresidential: [
      { min: 0, max: null, rate: 3.5 }, // Varies by region from 3.5% to 6.5%
    ],
  },
  spain: {
    residential: [
      { min: 0, max: null, rate: 8 }, // Varies by region
    ],
    nonresidential: [
      { min: 0, max: null, rate: 8 }, // Varies by region
    ],
  },
  italy: {
    residential: [
      { min: 0, max: null, rate: 2 }, // Main residence: 2%, Second home: 9%
    ],
    nonresidential: [
      { min: 0, max: null, rate: 9 }, // Standard rate
    ],
  },
};

// US Property Transfer Taxes (varies significantly by state & county)
const usPropertyTaxRates = {
  california: {
    residential: [
      { min: 0, max: null, rate: 0.11 }, // $1.10 per $1,000 of value (0.11%), plus local taxes
    ],
    nonresidential: [
      { min: 0, max: null, rate: 0.11 }, // Same as residential
    ],
  },
  new_york: {
    residential: [
      { min: 0, max: 500000, rate: 0.4 }, // 0.4% for properties under $500,000
      { min: 500001, max: 1000000, rate: 1.425 }, // 1.425% for $500,000 to $1,000,000
      { min: 1000001, max: null, rate: 3.9 }, // 3.9% for over $1,000,000 (NYC "mansion tax")
    ],
    nonresidential: [
      { min: 0, max: null, rate: 0.4 }, // Commercial transfer tax
    ],
  },
  florida: {
    residential: [
      { min: 0, max: null, rate: 0.7 }, // Standard rate
    ],
    nonresidential: [
      { min: 0, max: null, rate: 0.7 }, // Standard rate
    ],
  },
  texas: {
    residential: [
      { min: 0, max: null, rate: 0 }, // No state transfer tax
    ],
    nonresidential: [
      { min: 0, max: null, rate: 0 }, // No state transfer tax
    ],
  },
};

type PropertyType = "residential" | "nonresidential";

export default function StampDutyCalculator({ region }: { region: Region }) {
  const [propertyValue, setPropertyValue] = useState<number>(300000);
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState<boolean>(false);
  const [isAdditionalProperty, setIsAdditionalProperty] = useState<boolean>(false);
  const [euCountry, setEuCountry] = useState<"france" | "germany" | "spain" | "italy">("france");
  const [usState, setUsState] = useState<"california" | "new_york" | "florida" | "texas">("california");
  const [taxResults, setTaxResults] = useState<TaxResult[]>([]);

  const calculateTax = () => {
    let results: TaxResult[] = [];
    let taxBreakdown: { band: string; tax: number }[] = [];

    if (region === "uk") {
      // UK Stamp Duty calculation
      let rates;

      if (isFirstTimeBuyer && propertyValue <= 625000 && propertyType === "residential") {
        rates = ukStampDutyRates.firstTimeBuyer;
      } else if (isAdditionalProperty && propertyType === "residential") {
        rates = ukStampDutyRates.residential_additional;
      } else if (propertyType === "nonresidential") {
        rates = ukStampDutyRates.nonresidential;
      } else {
        rates = ukStampDutyRates.residential;
      }

      let remainingValue = propertyValue;
      let totalTax = 0;

      for (let i = 0; i < rates.length; i++) {
        const rate = rates[i];
        const min = rate.min;
        const max = rate.max || Infinity;

        if (remainingValue <= 0) break;

        const bandUpperLimit = Math.min(max, remainingValue);
        const taxableAmount = bandUpperLimit - min + 1 > 0 ? bandUpperLimit - min + 1 : 0;
        const taxForBand = (taxableAmount > 0) ? (taxableAmount * rate.rate / 100) : 0;

        if (taxableAmount > 0) {
          taxBreakdown.push({
            band: `${formatCurrency(min, "uk")} to ${max === Infinity ? "above" : formatCurrency(max, "uk")}`,
            tax: taxForBand
          });

          totalTax += taxForBand;
          remainingValue -= taxableAmount;
        }
      }

      const effectiveRate = (totalTax / propertyValue) * 100;

      results = [
        {
          label: "Property Value",
          value: propertyValue,
        }
      ];

      taxBreakdown.forEach(band => {
        if (band.tax > 0) {
          results.push({
            label: `Rate for ${band.band}`,
            value: band.tax,
          });
        }
      });

      results.push(
        {
          label: "Total Stamp Duty",
          value: totalTax,
          description: `Effective rate: ${formatPercentage(effectiveRate)}`,
          isTotal: true
        }
      );
    }
    else if (region === "eu") {
      // EU Property Transfer Tax calculation
      const countryRates = euPropertyTaxRates[euCountry] || euPropertyTaxRates.france;
      const rates = countryRates[propertyType] || countryRates.residential;

      // Most EU countries use flat rates
      const taxRate = rates[0].rate / 100;
      const taxAmount = propertyValue * taxRate;

      results = [
        {
          label: "Property Value",
          value: propertyValue,
        },
        {
          label: "Tax Rate",
          value: rates[0].rate,
          description: `Standard rate for ${euCountry}`
        },
        {
          label: `Property Transfer Tax (${euCountry})`,
          value: taxAmount,
          isTotal: true
        }
      ];
    }
    else if (region === "us") {
      // US Property Transfer Tax calculation
      const stateRates = usPropertyTaxRates[usState] || usPropertyTaxRates.california;
      const rates = stateRates[propertyType] || stateRates.residential;

      let totalTax = 0;

      // For states with progressive rates like New York
      if (rates.length > 1) {
        let remainingValue = propertyValue;

        for (let i = 0; i < rates.length; i++) {
          const rate = rates[i];
          const min = rate.min;
          const max = rate.max || Infinity;

          if (remainingValue <= 0 || remainingValue < min) break;

          const bandAmount = max === null ?
            remainingValue - min + 1 :
            Math.min(max, remainingValue) - min + 1;

          const taxForBand = bandAmount * rate.rate / 100;

          taxBreakdown.push({
            band: `${formatCurrency(min, "us")} to ${max === Infinity ? "above" : formatCurrency(max, "us")}`,
            tax: taxForBand
          });

          totalTax += taxForBand;
          remainingValue -= bandAmount;
        }
      } else {
        // For states with flat rates
        totalTax = propertyValue * (rates[0].rate / 100);

        taxBreakdown.push({
          band: "All value",
          tax: totalTax
        });
      }

      const effectiveRate = (totalTax / propertyValue) * 100;

      results = [
        {
          label: "Property Value",
          value: propertyValue,
        }
      ];

      if (taxBreakdown.length > 1) {
        taxBreakdown.forEach(band => {
          if (band.tax > 0) {
            results.push({
              label: `Rate for ${band.band}`,
              value: band.tax,
            });
          }
        });
      }

      // Add state-specific information
      let description = "";
      if (usState === "texas") {
        description = "No state transfer tax, but local taxes may apply";
      } else if (usState === "new_york" && propertyValue > 1000000) {
        description = "Includes NYC mansion tax for properties over $1M";
      } else if (usState === "california") {
        description = "Some counties add additional transfer taxes";
      }

      results.push(
        {
          label: `Transfer Tax (${usState.replace("_", " ")})`,
          value: totalTax,
          description: description || `Effective rate: ${formatPercentage(effectiveRate)}`,
          isTotal: true
        }
      );
    }

    setTaxResults(results);
  };

  // Calculate tax on initial render and when inputs change
  useEffect(() => {
    calculateTax();
  }, [propertyValue, propertyType, isFirstTimeBuyer, isAdditionalProperty, euCountry, usState, region]);

  return (
    <BaseTaxCalculator
      region={region}
      title={region === "uk" ? "Stamp Duty Calculator" : "Property Transfer Tax Calculator"}
      description={`Calculate ${region === "uk" ? "stamp duty" : "property transfer taxes"} for ${region === "uk" ? "UK" : region === "eu" ? "EU" : "US"} properties.`}
      taxResults={taxResults}
    >
      <TaxInput
        id="property-value"
        label="Property Value"
        value={propertyValue}
        onChange={(value) => setPropertyValue(Number(value) || 0)}
        required
        min={0}
        placeholder="Enter property value"
        prefix={region === "uk" ? "£" : region === "eu" ? "€" : "$"}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Property Type</label>
        <Select
          value={propertyType}
          onValueChange={(value) => setPropertyType(value as PropertyType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="nonresidential">Non-Residential / Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {region === "uk" && propertyType === "residential" && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="first-time-buyer"
              checked={isFirstTimeBuyer}
              onCheckedChange={(checked) => {
                setIsFirstTimeBuyer(checked === true);
                if (checked) setIsAdditionalProperty(false);
              }}
            />
            <label htmlFor="first-time-buyer" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              First Time Buyer
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="additional-property"
              checked={isAdditionalProperty}
              disabled={isFirstTimeBuyer}
              onCheckedChange={(checked) => {
                setIsAdditionalProperty(checked === true);
                if (checked) setIsFirstTimeBuyer(false);
              }}
            />
            <label htmlFor="additional-property" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Additional Property (3% surcharge)
            </label>
          </div>
        </>
      )}

      {region === "eu" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Select
            value={euCountry}
            onValueChange={(value) => setEuCountry(value as "france" | "germany" | "spain" | "italy")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="spain">Spain</SelectItem>
              <SelectItem value="italy">Italy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {region === "us" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Select
            value={usState}
            onValueChange={(value) => setUsState(value as "california" | "new_york" | "florida" | "texas")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="california">California</SelectItem>
              <SelectItem value="new_york">New York</SelectItem>
              <SelectItem value="florida">Florida</SelectItem>
              <SelectItem value="texas">Texas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </BaseTaxCalculator>
  );
}
