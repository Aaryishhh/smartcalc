"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import BaseTaxCalculator, { TaxInput, TaxResult } from "./BaseTaxCalculator";
import {
  Region,
  formatCurrency,
  ukInheritanceTaxBrackets,
  formatPercentage
} from "@/lib/tax-utils";

// EU inheritance tax rates (simplified, varies by country)
const euInheritanceTaxRates = {
  "germany": {
    spouseExemption: 500000,
    childExemption: 400000,
    siblingExemption: 20000,
    otherExemption: 20000,
    rates: [
      { min: 0, max: 75000, rate: 7 },
      { min: 75001, max: 300000, rate: 11 },
      { min: 300001, max: 600000, rate: 15 },
      { min: 600001, max: 6000000, rate: 19 },
      { min: 6000001, max: 13000000, rate: 23 },
      { min: 13000001, max: 26000000, rate: 27 },
      { min: 26000001, max: null, rate: 30 }
    ]
  },
  "france": {
    spouseExemption: 100000, // Actually fully exempt in France
    childExemption: 100000,
    siblingExemption: 15932,
    otherExemption: 1594,
    rates: [
      { min: 0, max: 8072, rate: 5 },
      { min: 8073, max: 12109, rate: 10 },
      { min: 12110, max: 15932, rate: 15 },
      { min: 15933, max: 552324, rate: 20 },
      { min: 552325, max: 902838, rate: 30 },
      { min: 902839, max: 1805677, rate: 40 },
      { min: 1805678, max: null, rate: 45 }
    ]
  },
  "italy": {
    spouseExemption: 1000000,
    childExemption: 1000000,
    siblingExemption: 100000,
    otherExemption: 0,
    rates: [
      { min: 0, max: null, rate: 4 } // Flat rate of 4% beyond exemptions
    ]
  },
  "spain": {
    // Spain has regional variations, this is a simplified version
    spouseExemption: 16000,
    childExemption: 16000,
    siblingExemption: 8000,
    otherExemption: 0,
    rates: [
      { min: 0, max: 7993, rate: 7.65 },
      { min: 7994, max: 31956, rate: 8.5 },
      { min: 31957, max: 79881, rate: 10.2 },
      { min: 79882, max: 239389, rate: 11.05 },
      { min: 239390, max: 398778, rate: 13.6 },
      { min: 398779, max: 797555, rate: 16.15 },
      { min: 797556, max: null, rate: 18.7 }
    ]
  }
};

// US inheritance/estate tax (federal)
const usEstateTax = {
  exemption: 13610000, // 2024 exemption
  rates: [
    { min: 0, max: 10000, rate: 18 },
    { min: 10001, max: 20000, rate: 20 },
    { min: 20001, max: 40000, rate: 22 },
    { min: 40001, max: 60000, rate: 24 },
    { min: 60001, max: 80000, rate: 26 },
    { min: 80001, max: 100000, rate: 28 },
    { min: 100001, max: 150000, rate: 30 },
    { min: 150001, max: 250000, rate: 32 },
    { min: 250001, max: 500000, rate: 34 },
    { min: 500001, max: 750000, rate: 37 },
    { min: 750001, max: 1000000, rate: 39 },
    { min: 1000001, max: null, rate: 40 }
  ]
};

type RelationshipType = "spouse" | "child" | "sibling" | "other";

export default function InheritanceTaxCalculator({ region }: { region: Region }) {
  const [estateValue, setEstateValue] = useState<number>(800000);
  const [relationship, setRelationship] = useState<RelationshipType>("spouse");
  const [mainResidence, setMainResidence] = useState<boolean>(true);
  const [mainResidenceValue, setMainResidenceValue] = useState<number>(400000);
  const [euCountry, setEuCountry] = useState<string>("germany");
  const [usState, setUsState] = useState<string>("california");
  const [taxResults, setTaxResults] = useState<TaxResult[]>([]);

  const calculateTax = () => {
    let results: TaxResult[] = [];

    if (region === "uk") {
      // UK Inheritance Tax calculation
      const nilRateBand = ukInheritanceTaxBrackets[0]?.max || 0; // 325,000
      const residenceNilRateBand = 175000; // Additional allowance for main residence passed to direct descendants

      let totalAllowance = nilRateBand;
      let residenceAllowance = 0;

      // Add Residence Nil Rate Band if applicable (passed to children/direct descendants and includes main residence)
      if (mainResidence && (relationship === "child") && mainResidenceValue > 0) {
        residenceAllowance = Math.min(residenceNilRateBand, mainResidenceValue);
        totalAllowance += residenceAllowance;
      }

      // Spouse transfers are exempt in the UK
      if (relationship === "spouse") {
        totalAllowance = estateValue; // Fully exempt
      }

      const taxableAmount = Math.max(0, estateValue - totalAllowance);
      const taxRate = ukInheritanceTaxBrackets[1]?.rate || 40; // 40%
      const taxAmount = taxableAmount * (taxRate / 100);

      results = [
        {
          label: "Total Estate Value",
          value: estateValue
        },
        {
          label: "Nil Rate Band",
          value: nilRateBand
        }
      ];

      if (residenceAllowance > 0) {
        results.push({
          label: "Residence Nil Rate Band",
          value: residenceAllowance,
          description: "Additional allowance for main residence passed to direct descendants"
        });
      }

      if (relationship === "spouse") {
        results.push({
          label: "Spousal Exemption",
          value: estateValue,
          description: "Transfers between spouses are exempt from inheritance tax"
        });
      }

      results.push(
        {
          label: "Taxable Estate",
          value: taxableAmount
        },
        {
          label: "Tax Rate",
          value: relationship === "spouse" ? 0 : taxRate,
          description: relationship === "spouse" ? "Spousal transfers are exempt" : "40% on value above allowances"
        },
        {
          label: "Inheritance Tax",
          value: taxAmount,
          isTotal: true
        }
      );
    }
    else if (region === "eu") {
      // EU Inheritance Tax calculation
      const countryRates = euInheritanceTaxRates[euCountry as keyof typeof euInheritanceTaxRates];

      if (!countryRates) {
        results = [{ label: "Error", value: 0, description: "Country data not available" }];
        return;
      }

      // Determine the applicable exemption based on relationship
      let exemption = 0;
      switch (relationship) {
        case "spouse":
          exemption = countryRates.spouseExemption;
          break;
        case "child":
          exemption = countryRates.childExemption;
          break;
        case "sibling":
          exemption = countryRates.siblingExemption;
          break;
        default:
          exemption = countryRates.otherExemption;
      }

      const taxableAmount = Math.max(0, estateValue - exemption);

      // Calculate tax using progressive brackets
      let taxAmount = 0;
      let remainingAmount = taxableAmount;

      for (const bracket of countryRates.rates) {
        if (remainingAmount <= 0) break;

        const { min, max, rate } = bracket;
        const bracketSize = max === null ? remainingAmount : Math.min(max - min + 1, remainingAmount);

        taxAmount += bracketSize * (rate / 100);
        remainingAmount -= bracketSize;
      }

      results = [
        {
          label: "Total Estate Value",
          value: estateValue
        },
        {
          label: "Personal Exemption",
          value: exemption,
          description: `Exemption for ${relationship}`
        },
        {
          label: "Taxable Estate",
          value: taxableAmount
        },
        {
          label: "Inheritance Tax",
          value: taxAmount,
          isTotal: true
        }
      ];
    }
    else if (region === "us") {
      // US Estate Tax calculation (federal only, simplified)
      const exemption = usEstateTax.exemption;
      const taxableAmount = Math.max(0, estateValue - exemption);

      let taxAmount = 0;
      if (taxableAmount > 0) {
        let remainingAmount = taxableAmount;

        for (const bracket of usEstateTax.rates) {
          if (remainingAmount <= 0) break;

          const { min, max, rate } = bracket;
          const bracketWidth = max === null ? remainingAmount : Math.min(max - min + 1, remainingAmount);

          taxAmount += bracketWidth * (rate / 100);
          remainingAmount -= bracketWidth;
        }
      }

      // Add state estate tax info based on selected state
      let stateInfo = "";
      switch (usState) {
        case "california":
          stateInfo = "California has no state estate or inheritance tax";
          break;
        case "massachusetts":
          stateInfo = "Massachusetts has estate tax on estates over $1 million (not calculated here)";
          break;
        case "new_york":
          stateInfo = "New York has estate tax on estates over $6.58 million (not calculated here)";
          break;
        case "washington":
          stateInfo = "Washington has estate tax on estates over $2.193 million (not calculated here)";
          break;
      }

      results = [
        {
          label: "Total Estate Value",
          value: estateValue
        },
        {
          label: "Federal Exemption",
          value: exemption,
          description: "2024 federal estate tax exemption"
        },
        {
          label: "Taxable Estate",
          value: taxableAmount
        },
        {
          label: "Federal Estate Tax",
          value: taxAmount,
          isTotal: true,
          description: stateInfo
        }
      ];
    }

    setTaxResults(results);
  };

  // Calculate tax on initial render and when inputs change
  useEffect(() => {
    calculateTax();
  }, [estateValue, relationship, mainResidence, mainResidenceValue, euCountry, usState, region]);

  return (
    <BaseTaxCalculator
      region={region}
      title={region === "us" ? "Estate Tax Calculator" : "Inheritance Tax Calculator"}
      description={`Calculate ${region === "us" ? "estate" : "inheritance"} tax for ${region === "uk" ? "UK" : region === "eu" ? "EU" : "US"} residents.`}
      taxResults={taxResults}
    >
      <TaxInput
        id="estate-value"
        label="Total Estate Value"
        value={estateValue}
        onChange={(value) => setEstateValue(Number(value) || 0)}
        required
        min={0}
        placeholder="Enter the total estate value"
        prefix={region === "uk" ? "£" : region === "eu" ? "€" : "$"}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Relationship to Deceased</label>
        <Select value={relationship} onValueChange={(value) => setRelationship(value as RelationshipType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spouse">Spouse/Civil Partner</SelectItem>
            <SelectItem value="child">Child/Grandchild</SelectItem>
            <SelectItem value="sibling">Sibling</SelectItem>
            <SelectItem value="other">Other Relative/Friend</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {region === "uk" && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="main-residence"
              checked={mainResidence}
              onCheckedChange={(checked) => setMainResidence(checked === true)}
            />
            <label htmlFor="main-residence" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Includes Main Residence
            </label>
          </div>

          {mainResidence && (
            <TaxInput
              id="residence-value"
              label="Main Residence Value"
              value={mainResidenceValue}
              onChange={(value) => setMainResidenceValue(Number(value) || 0)}
              min={0}
              max={estateValue}
              placeholder="Enter the main residence value"
              prefix="£"
              helperText="This is used to calculate the Residence Nil Rate Band if applicable"
            />
          )}
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
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Select value={usState} onValueChange={setUsState}>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="california">California</SelectItem>
              <SelectItem value="massachusetts">Massachusetts</SelectItem>
              <SelectItem value="new_york">New York</SelectItem>
              <SelectItem value="washington">Washington</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Note: This calculator focuses on federal estate tax. Some states have additional estate or inheritance taxes.
          </p>
        </div>
      )}
    </BaseTaxCalculator>
  );
}
