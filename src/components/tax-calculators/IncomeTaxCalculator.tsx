"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BaseTaxCalculator, { TaxInput, TaxResult } from "./BaseTaxCalculator";
import {
  Region,
  formatCurrency,
  calculateTaxWithBrackets,
  ukIncomeTaxBrackets,
  usFederalIncomeTaxBrackets,
  formatPercentage
} from "@/lib/tax-utils";

// EU tax rates (simplified, varies by country)
const euIncomeTaxRates = {
  "germany": [
    { min: 0, max: 10908, rate: 0, name: "Tax Free Allowance" },
    { min: 10909, max: 62809, rate: 14, name: "First Bracket" }, // Progressive from 14% to 42%
    { min: 62810, max: 277825, rate: 42, name: "Second Bracket" },
    { min: 277826, max: null, rate: 45, name: "Third Bracket" }
  ],
  "france": [
    { min: 0, max: 10777, rate: 0, name: "Tax Free Allowance" },
    { min: 10778, max: 27478, rate: 11, name: "First Bracket" },
    { min: 27479, max: 78570, rate: 30, name: "Second Bracket" },
    { min: 78571, max: 168994, rate: 41, name: "Third Bracket" },
    { min: 168995, max: null, rate: 45, name: "Fourth Bracket" }
  ],
  "italy": [
    { min: 0, max: 15000, rate: 23, name: "First Bracket" },
    { min: 15001, max: 28000, rate: 25, name: "Second Bracket" },
    { min: 28001, max: 50000, rate: 35, name: "Third Bracket" },
    { min: 50001, max: null, rate: 43, name: "Fourth Bracket" }
  ],
  "spain": [
    { min: 0, max: 12450, rate: 19, name: "First Bracket" },
    { min: 12451, max: 20200, rate: 24, name: "Second Bracket" },
    { min: 20201, max: 35200, rate: 30, name: "Third Bracket" },
    { min: 35201, max: 60000, rate: 37, name: "Fourth Bracket" },
    { min: 60001, max: 300000, rate: 45, name: "Fifth Bracket" },
    { min: 300001, max: null, rate: 47, name: "Sixth Bracket" }
  ]
};

// US State tax rates (simplified)
const usStateTaxRates = {
  "california": [
    { min: 0, max: 10099, rate: 1, name: "First Bracket" },
    { min: 10100, max: 23942, rate: 2, name: "Second Bracket" },
    { min: 23943, max: 37788, rate: 4, name: "Third Bracket" },
    { min: 37789, max: 52455, rate: 6, name: "Fourth Bracket" },
    { min: 52456, max: 66295, rate: 8, name: "Fifth Bracket" },
    { min: 66296, max: 338639, rate: 9.3, name: "Sixth Bracket" },
    { min: 338640, max: 406364, rate: 10.3, name: "Seventh Bracket" },
    { min: 406365, max: 677275, rate: 11.3, name: "Eighth Bracket" },
    { min: 677276, max: null, rate: 12.3, name: "Ninth Bracket" }
  ],
  "texas": [], // No state income tax
  "new_york": [
    { min: 0, max: 8500, rate: 4, name: "First Bracket" },
    { min: 8501, max: 11700, rate: 4.5, name: "Second Bracket" },
    { min: 11701, max: 13900, rate: 5.25, name: "Third Bracket" },
    { min: 13901, max: 80650, rate: 5.85, name: "Fourth Bracket" },
    { min: 80651, max: 215400, rate: 6.25, name: "Fifth Bracket" },
    { min: 215401, max: 1077550, rate: 6.85, name: "Sixth Bracket" },
    { min: 1077551, max: null, rate: 8.82, name: "Seventh Bracket" }
  ],
  "florida": [] // No state income tax
};

export default function IncomeTaxCalculator({ region }: { region: Region }) {
  // Change to store income as string to allow empty values
  const [income, setIncome] = useState<string | number>("50000");
  const [euCountry, setEuCountry] = useState<string>("germany");
  const [usState, setUsState] = useState<string>("california");
  const [taxResults, setTaxResults] = useState<TaxResult[]>([]);

  const calculateTax = () => {
    // Convert income to number for calculations, default to 0 if empty
    const incomeValue = income === "" ? 0 : typeof income === "string" ? parseFloat(income) : income;
    let results: TaxResult[] = [];

    // Don't calculate tax if income is empty or 0, show empty results instead
    if (!incomeValue && String(income) === "") {
      setTaxResults([]);
      return;
    }

    if (region === "uk") {
      // UK Income Tax calculation
      const taxAmount = calculateTaxWithBrackets(incomeValue, ukIncomeTaxBrackets);

      // Calculate effective tax rate
      const effectiveRate = (taxAmount / incomeValue) * 100;

      results = [
        {
          label: "Total Income",
          value: incomeValue,
        },
        {
          label: "Income Tax",
          value: taxAmount,
          description: `Effective tax rate: ${formatPercentage(effectiveRate)}`
        },
        {
          label: "Net Income",
          value: incomeValue - taxAmount,
          isTotal: true
        }
      ];
    }
    else if (region === "eu") {
      // EU Income Tax calculation based on selected country
      const taxBrackets = euIncomeTaxRates[euCountry as keyof typeof euIncomeTaxRates] || [];
      const taxAmount = calculateTaxWithBrackets(incomeValue, taxBrackets);

      // Calculate effective tax rate
      const effectiveRate = (taxAmount / incomeValue) * 100;

      results = [
        {
          label: "Total Income",
          value: incomeValue,
        },
        {
          label: "Income Tax",
          value: taxAmount,
          description: `Effective tax rate: ${formatPercentage(effectiveRate)}`
        },
        {
          label: "Net Income",
          value: incomeValue - taxAmount,
          isTotal: true
        }
      ];
    }
    else if (region === "us") {
      // US Income Tax calculation including federal and state taxes
      const federalTaxAmount = calculateTaxWithBrackets(incomeValue, usFederalIncomeTaxBrackets);

      // State tax calculation
      const stateTaxBrackets = usStateTaxRates[usState as keyof typeof usStateTaxRates] || [];
      const stateTaxAmount = calculateTaxWithBrackets(incomeValue, stateTaxBrackets);

      const totalTaxAmount = federalTaxAmount + stateTaxAmount;

      // Calculate effective tax rate
      const effectiveRate = (totalTaxAmount / incomeValue) * 100;

      results = [
        {
          label: "Total Income",
          value: incomeValue,
        },
        {
          label: "Federal Income Tax",
          value: federalTaxAmount,
        },
        {
          label: "State Income Tax",
          value: stateTaxAmount,
          description: usState === "texas" || usState === "florida" ? "No state income tax" : undefined
        },
        {
          label: "Total Tax",
          value: totalTaxAmount,
          description: `Effective tax rate: ${formatPercentage(effectiveRate)}`
        },
        {
          label: "Net Income",
          value: incomeValue - totalTaxAmount,
          isTotal: true
        }
      ];
    }

    setTaxResults(results);
  };

  // Calculate tax on initial render and when inputs change
  useEffect(() => {
    calculateTax();
  }, [income, region, euCountry, usState]);

  // Handle income change without forcing numeric conversion
  const handleIncomeChange = (value: string | number) => {
    // Allow empty string or valid numbers
    if (value === "" || typeof value === "number" || !isNaN(Number(value))) {
      setIncome(value);
    }
  };

  return (
    <BaseTaxCalculator
      region={region}
      title="Income Tax Calculator"
      description={`Calculate income tax for ${region === "uk" ? "UK" : region === "eu" ? "EU" : "US"} residents based on annual income.`}
      taxResults={taxResults}
    >
      <TaxInput
        id="income"
        label="Annual Income"
        value={income}
        onChange={handleIncomeChange}
        required
        min={0}
        placeholder="Enter your annual income"
        prefix={region === "uk" ? "£" : region === "eu" ? "€" : "$"}
      />

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
              <SelectItem value="texas">Texas</SelectItem>
              <SelectItem value="new_york">New York</SelectItem>
              <SelectItem value="florida">Florida</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </BaseTaxCalculator>
  );
}
