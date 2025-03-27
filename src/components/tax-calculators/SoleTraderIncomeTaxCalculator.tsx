"use client";

import { useState, useEffect } from "react";
import {
  Region,
  ukIncomeTaxBrackets,
  ukSelfEmployedNI,
  usSelfEmployedTaxRates,
  euSelfEmployedTaxRates,
  calculateTaxWithBrackets,
  formatCurrency,
  formatPercentage
} from "@/lib/tax-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxInput } from "./BaseTaxCalculator";
import { Checkbox } from "@/components/ui/checkbox";

export default function SoleTraderIncomeTaxCalculator({ region }: { region: Region }) {
  // Common state
  const [businessIncome, setBusinessIncome] = useState<number>(50000);
  const [businessExpenses, setBusinessExpenses] = useState<number>(15000);
  const [additionalDeductions, setAdditionalDeductions] = useState<number>(0);
  const [filingStatus, setFilingStatus] = useState<string>("single"); // For US
  const [euCountry, setEuCountry] = useState<string>("germany");
  const [simpleExpenseRate, setSimpleExpenseRate] = useState<boolean>(false); // For UK

  // Results
  const [netProfit, setNetProfit] = useState<number>(0);
  const [incomeTax, setIncomeTax] = useState<number>(0);
  const [niContributions, setNiContributions] = useState<number>(0); // UK National Insurance or US Self-Employment Tax
  const [totalTax, setTotalTax] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);
  const [takeHome, setTakeHome] = useState<number>(0);

  // Breakdown of tax calculations
  const [taxBreakdown, setTaxBreakdown] = useState<Array<{
    label: string;
    value: number;
    rate?: number;
    description?: string
  }>>([]);

  // Calculate sole trader tax
  const calculateSoleTraderTax = () => {
    let taxableIncome = 0;
    let incomeTaxAmount = 0;
    let niContributionsAmount = 0;
    let totalTaxAmount = 0;
    let netProfitAmount = 0;
    let takeHomeAmount = 0;
    let breakdown: Array<{ label: string; value: number; rate?: number; description?: string }> = [];

    // Calculate net profit
    let totalExpenses = businessExpenses;

    // Adjust calculations based on region
    if (region === "uk") {
      // UK Tax Calculation
      if (simpleExpenseRate) {
        // Use simplified expenses (flat rate)
        totalExpenses = businessIncome * 0.2; // Simplified example: 20% of turnover
      }

      netProfitAmount = Math.max(0, businessIncome - totalExpenses - additionalDeductions);
      taxableIncome = netProfitAmount;

      // Income Tax
      incomeTaxAmount = calculateTaxWithBrackets(taxableIncome, ukIncomeTaxBrackets);

      // National Insurance Contributions
      let class2Contribution = 0;
      let class4Contribution = 0;

      // Class 2 (fixed weekly amount if profits above threshold)
      if (netProfitAmount > ukSelfEmployedNI.class2Threshold) {
        class2Contribution = ukSelfEmployedNI.class2Weekly * 52; // 52 weeks
      }

      // Class 4 (percentage of profits between thresholds)
      if (netProfitAmount > ukSelfEmployedNI.class4LowerThreshold) {
        const lowerBand = Math.min(
          netProfitAmount - ukSelfEmployedNI.class4LowerThreshold,
          ukSelfEmployedNI.class4UpperThreshold - ukSelfEmployedNI.class4LowerThreshold
        );

        class4Contribution = (lowerBand * ukSelfEmployedNI.class4LowerRate) / 100;

        if (netProfitAmount > ukSelfEmployedNI.class4UpperThreshold) {
          const upperBand = netProfitAmount - ukSelfEmployedNI.class4UpperThreshold;
          class4Contribution += (upperBand * ukSelfEmployedNI.class4UpperRate) / 100;
        }
      }

      niContributionsAmount = class2Contribution + class4Contribution;

      // Create breakdown
      breakdown = [
        {
          label: "Business Income",
          value: businessIncome,
          description: "Total business turnover"
        },
        {
          label: "Business Expenses",
          value: -totalExpenses,
          description: simpleExpenseRate ? "Simplified expenses (20% of turnover)" : "Itemized business expenses"
        }
      ];

      if (additionalDeductions > 0) {
        breakdown.push({
          label: "Additional Deductions",
          value: -additionalDeductions,
          description: "Tax allowances and reliefs"
        });
      }

      breakdown.push({
        label: "Net Profit",
        value: netProfitAmount,
        description: "Taxable profit after expenses and deductions"
      });

      breakdown.push({
        label: "Income Tax",
        value: -incomeTaxAmount,
        description: "Personal Income Tax on profits"
      });

      if (class2Contribution > 0) {
        breakdown.push({
          label: "Class 2 NI",
          value: -class2Contribution,
          description: `Fixed rate of £${ukSelfEmployedNI.class2Weekly} per week`
        });
      }

      if (class4Contribution > 0) {
        breakdown.push({
          label: "Class 4 NI",
          value: -class4Contribution,
          description: `${ukSelfEmployedNI.class4LowerRate}% on profits £${ukSelfEmployedNI.class4LowerThreshold.toLocaleString()} to £${ukSelfEmployedNI.class4UpperThreshold.toLocaleString()}, ${ukSelfEmployedNI.class4UpperRate}% above`
        });
      }
    }
    else if (region === "us") {
      // US Tax Calculation
      netProfitAmount = Math.max(0, businessIncome - totalExpenses - additionalDeductions);

      // Self-employment tax (Social Security and Medicare)
      const socialSecurityTaxable = Math.min(netProfitAmount, usSelfEmployedTaxRates.socialSecurityWageCap);
      const socialSecurityTax = (socialSecurityTaxable * usSelfEmployedTaxRates.socialSecurityRate) / 100;
      const medicareTax = (netProfitAmount * usSelfEmployedTaxRates.medicareRate) / 100;
      niContributionsAmount = socialSecurityTax + medicareTax;

      // Deduct 50% of SE tax from income for income tax purposes
      const seTaxDeduction = niContributionsAmount * (usSelfEmployedTaxRates.selfEmploymentTaxDeduction / 100);
      taxableIncome = Math.max(0, netProfitAmount - seTaxDeduction);

      // Federal Income Tax
      const bracketsByStatus = usSelfEmployedTaxRates.incomeTaxBrackets[filingStatus] || usSelfEmployedTaxRates.incomeTaxBrackets.single;
      incomeTaxAmount = calculateTaxWithBrackets(taxableIncome, bracketsByStatus);

      // Create breakdown
      breakdown = [
        {
          label: "Business Income",
          value: businessIncome,
          description: "Total business revenue"
        },
        {
          label: "Business Expenses",
          value: -totalExpenses,
          description: "Business expenses"
        }
      ];

      if (additionalDeductions > 0) {
        breakdown.push({
          label: "Additional Deductions",
          value: -additionalDeductions,
          description: "Standard/itemized deductions and other tax benefits"
        });
      }

      breakdown.push({
        label: "Net Business Profit",
        value: netProfitAmount,
        description: "Net business income before taxes"
      });

      breakdown.push({
        label: "SE Tax Deduction",
        value: -seTaxDeduction,
        description: `${usSelfEmployedTaxRates.selfEmploymentTaxDeduction}% of self-employment tax is deductible`
      });

      breakdown.push({
        label: "Federal Income Tax",
        value: -incomeTaxAmount,
        description: `Based on ${filingStatus} filing status`
      });

      breakdown.push({
        label: "Social Security Tax",
        value: -socialSecurityTax,
        description: `${usSelfEmployedTaxRates.socialSecurityRate}% up to $${usSelfEmployedTaxRates.socialSecurityWageCap.toLocaleString()}`
      });

      breakdown.push({
        label: "Medicare Tax",
        value: -medicareTax,
        description: `${usSelfEmployedTaxRates.medicareRate}% on all net earnings`
      });
    }
    else if (region === "eu") {
      // EU Tax Calculation - varies by country
      const countryInfo = euSelfEmployedTaxRates[euCountry];

      if (countryInfo) {
        netProfitAmount = Math.max(0, businessIncome - totalExpenses - additionalDeductions);

        // Income Tax
        incomeTaxAmount = calculateTaxWithBrackets(netProfitAmount, countryInfo.incomeTaxRates);

        // Social Security Contributions
        niContributionsAmount = (netProfitAmount * countryInfo.socialSecurityRate) / 100;

        // If there's a base amount or cap, adjust the calculation
        if (countryInfo.socialSecurityBase) {
          // This is a simplification; actual rules are more complex
          niContributionsAmount = Math.min(niContributionsAmount, countryInfo.socialSecurityBase);
        }

        // Create breakdown
        breakdown = [
          {
            label: "Business Income",
            value: businessIncome,
            description: "Total business revenue"
          },
          {
            label: "Business Expenses",
            value: -totalExpenses,
            description: "Business expenses"
          }
        ];

        if (additionalDeductions > 0) {
          breakdown.push({
            label: "Additional Deductions",
            value: -additionalDeductions,
            description: "Tax deductions and allowances"
          });
        }

        breakdown.push({
          label: "Net Profit",
          value: netProfitAmount,
          description: "Taxable profit after expenses"
        });

        breakdown.push({
          label: "Income Tax",
          value: -incomeTaxAmount,
          description: `Progressive income tax rates in ${euCountry.charAt(0).toUpperCase() + euCountry.slice(1)}`
        });

        breakdown.push({
          label: "Social Security",
          value: -niContributionsAmount,
          description: `${countryInfo.socialSecurityRate}% social security contributions`
        });

        if (countryInfo.specialTreatment) {
          breakdown.push({
            label: "Special Note",
            value: 0,
            description: countryInfo.specialTreatment
          });
        }
      }
    }

    // Calculate total tax and take-home pay
    totalTaxAmount = incomeTaxAmount + niContributionsAmount;
    takeHomeAmount = netProfitAmount - totalTaxAmount;

    // Calculate effective tax rate
    const effectiveRateValue = netProfitAmount > 0 ? (totalTaxAmount / netProfitAmount) * 100 : 0;

    // Set state
    setNetProfit(netProfitAmount);
    setIncomeTax(incomeTaxAmount);
    setNiContributions(niContributionsAmount);
    setTotalTax(totalTaxAmount);
    setEffectiveRate(effectiveRateValue);
    setTakeHome(takeHomeAmount);
    setTaxBreakdown(breakdown);
  };

  // Recalculate when inputs change
  useEffect(() => {
    calculateSoleTraderTax();
  }, [
    businessIncome, businessExpenses, additionalDeductions,
    filingStatus, euCountry, simpleExpenseRate, region
  ]);

  // UI components for each region
  const renderUkInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="business-income"
        label="Business Income (Turnover)"
        value={businessIncome}
        onChange={(value) => setBusinessIncome(Number(value) || 0)}
        prefix="£"
        required
      />

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="simple-expenses"
            checked={simpleExpenseRate}
            onCheckedChange={(checked) => setSimpleExpenseRate(!!checked)}
          />
          <label
            htmlFor="simple-expenses"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use simplified expenses (20% of turnover)
          </label>
        </div>
      </div>

      {!simpleExpenseRate && (
        <TaxInput
          id="business-expenses"
          label="Business Expenses"
          value={businessExpenses}
          onChange={(value) => setBusinessExpenses(Number(value) || 0)}
          prefix="£"
        />
      )}

      <TaxInput
        id="additional-deductions"
        label="Additional Deductions & Allowances"
        value={additionalDeductions}
        onChange={(value) => setAdditionalDeductions(Number(value) || 0)}
        prefix="£"
      />

      <div className="text-sm text-muted-foreground mt-4">
        <p>UK sole traders pay Income Tax on their profits, plus National Insurance contributions (Class 2 and Class 4).</p>
        <p>Class 2 is a fixed weekly amount, while Class 4 is a percentage of profits above certain thresholds.</p>
      </div>
    </div>
  );

  const renderUsInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="business-income"
        label="Business Income (Revenue)"
        value={businessIncome}
        onChange={(value) => setBusinessIncome(Number(value) || 0)}
        prefix="$"
        required
      />

      <TaxInput
        id="business-expenses"
        label="Business Expenses"
        value={businessExpenses}
        onChange={(value) => setBusinessExpenses(Number(value) || 0)}
        prefix="$"
      />

      <TaxInput
        id="additional-deductions"
        label="Additional Deductions"
        value={additionalDeductions}
        onChange={(value) => setAdditionalDeductions(Number(value) || 0)}
        prefix="$"
      />

      <div>
        <Label>Filing Status</Label>
        <Tabs defaultValue="single" value={filingStatus} onValueChange={setFilingStatus} className="mt-2">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="single">Single</TabsTrigger>
            <TabsTrigger value="married">Married Joint</TabsTrigger>
            <TabsTrigger value="head">Head of Household</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>US self-employed individuals pay both income tax and self-employment tax (Social Security and Medicare).</p>
        <p>Self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare) on net earnings.</p>
        <p>You can deduct 50% of your self-employment tax when calculating your income tax.</p>
      </div>
    </div>
  );

  const renderEuInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="business-income"
        label="Business Income"
        value={businessIncome}
        onChange={(value) => setBusinessIncome(Number(value) || 0)}
        prefix="€"
        required
      />

      <TaxInput
        id="business-expenses"
        label="Business Expenses"
        value={businessExpenses}
        onChange={(value) => setBusinessExpenses(Number(value) || 0)}
        prefix="€"
      />

      <TaxInput
        id="additional-deductions"
        label="Additional Deductions"
        value={additionalDeductions}
        onChange={(value) => setAdditionalDeductions(Number(value) || 0)}
        prefix="€"
      />

      <div>
        <Label>Country</Label>
        <Tabs defaultValue="germany" value={euCountry} onValueChange={setEuCountry} className="mt-2">
          <TabsList className="flex flex-wrap">
            {Object.keys(euSelfEmployedTaxRates).map((country) => (
              <TabsTrigger key={country} value={country}>
                {country.charAt(0).toUpperCase() + country.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>Self-employed tax systems vary significantly across EU countries.</p>
        <p>Most countries charge income tax plus social security contributions on business profits.</p>
        {euSelfEmployedTaxRates[euCountry]?.specialTreatment && (
          <p className="text-xs italic mt-1">{euSelfEmployedTaxRates[euCountry]?.specialTreatment}</p>
        )}
      </div>
    </div>
  );

  const getRegionInputs = () => {
    switch (region) {
      case "uk":
        return renderUkInputs();
      case "us":
        return renderUsInputs();
      case "eu":
        return renderEuInputs();
      default:
        return null;
    }
  };

  const currencySymbol = region === "uk" ? "£" : region === "eu" ? "€" : "$";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Sole Trader Income Tax Calculator</h3>
            {getRegionInputs()}
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tax Calculation Results</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-xl font-semibold">{formatCurrency(netProfit, region)}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Take Home Pay</p>
                  <p className="text-xl font-semibold">{formatCurrency(takeHome, region)}</p>
                </div>
              </div>

              <div className="p-4 border border-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total Tax</span>
                  <span className="font-medium">{formatCurrency(totalTax, region)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Income Tax</span>
                  <span>{formatCurrency(incomeTax, region)}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span>{region === "uk" ? "National Insurance" : region === "us" ? "Self-Employment Tax" : "Social Security"}</span>
                  <span>{formatCurrency(niContributions, region)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Effective Tax Rate</span>
                  <span>{formatPercentage(effectiveRate)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Calculation Breakdown</h4>
                <div className="space-y-2">
                  {taxBreakdown.map((item, index) => (
                    <div key={index} className={`p-3 ${item.value < 0 ? 'bg-muted/20' : 'bg-muted/10'} rounded`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{item.label}</span>
                        <span className={item.value < 0 ? 'text-red-500' : ''}>
                          {item.value === 0 && item.description && !item.description.includes("Special")
                            ? "-"
                            : formatCurrency(item.value, region)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
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
