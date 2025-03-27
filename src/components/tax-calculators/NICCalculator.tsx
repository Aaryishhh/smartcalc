"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BaseTaxCalculator, { TaxInput, TaxResult } from "./BaseTaxCalculator";
import {
  Region,
  formatCurrency,
  ukNICBrackets,
  formatPercentage
} from "@/lib/tax-utils";

// Define simple types for country-specific settings
type Country = "germany" | "france" | "italy" | "spain";

// Define country specific configurations
const EU_COUNTRIES = {
  germany: {
    employee: {
      pension: 9.35,
      health: 7.3,
      unemployment: 1.3,
      nursingCare: 1.7
    },
    employer: {
      pension: 9.35,
      health: 7.3,
      unemployment: 1.3,
      nursingCare: 1.7
    },
    ceiling: {
      pension: 87600, // Annual ceiling
      health: 58050 // Annual ceiling
    }
  },
  france: {
    employee: {
      healthAndPension: 7.3,
      otherContributions: 9.2
    },
    employer: {
      healthAndPension: 13.0,
      otherContributions: 25.0
    },
    ceiling: {
      socialSecurity: 43992
    }
  },
  italy: {
    employee: {
      pension: 9.19,
      otherContributions: 0.91
    },
    employer: {
      pension: 23.81,
      otherContributions: 8.64
    },
    ceiling: {
      pension: 103055
    }
  },
  spain: {
    employee: {
      generalRate: 6.35
    },
    employer: {
      generalRate: 29.9
    },
    ceiling: {
      general: 48841
    }
  }
};

export default function NICCalculator({ region }: { region: Region }) {
  const [income, setIncome] = useState<number>(50000);
  const [nicType, setNicType] = useState<string>("employed");
  const [euCountry, setEuCountry] = useState<Country>("germany");
  const [taxResults, setTaxResults] = useState<TaxResult[]>([]);

  const calculateNIC = () => {
    let results: TaxResult[] = [];

    if (region === "uk") {
      // UK National Insurance calculation
      if (nicType === "employed") {
        // Class 1 NICs for employees
        let nicAmount = 0;

        for (let i = 0; i < ukNICBrackets.length; i++) {
          const bracket = ukNICBrackets[i];
          const min = bracket.min;
          const max = bracket.max === null ? Infinity : bracket.max;
          const rate = bracket.rate / 100;

          if (income > min) {
            const contributionAmount = Math.min(income, max) - min;
            nicAmount += contributionAmount > 0 ? contributionAmount * rate : 0;
          }
        }

        // Calculate effective rate
        const effectiveRate = (nicAmount / income) * 100;

        results = [
          {
            label: "Gross Annual Income",
            value: income
          },
          {
            label: "National Insurance Contributions",
            value: nicAmount,
            description: `Class 1 NICs (Employed) - Effective rate: ${formatPercentage(effectiveRate)}`
          },
          {
            label: "Income After NICs",
            value: income - nicAmount,
            isTotal: true
          }
        ];
      } else {
        // Class 2 & 4 NICs for self-employed
        const class2Rate = 3.45; // Weekly rate
        const class2AnnualAmount = class2Rate * 52;

        // Class 4 NICs
        const lowerProfitThreshold = 12570;
        const upperProfitThreshold = 50270;
        const mainRate = 9; // 9% between thresholds
        const higherRate = 2; // 2% above upper threshold

        let class4Amount = 0;

        if (income > lowerProfitThreshold) {
          if (income <= upperProfitThreshold) {
            class4Amount = (income - lowerProfitThreshold) * (mainRate / 100);
          } else {
            class4Amount = (upperProfitThreshold - lowerProfitThreshold) * (mainRate / 100) +
                          (income - upperProfitThreshold) * (higherRate / 100);
          }
        }

        const totalNIC = class2AnnualAmount + class4Amount;
        const effectiveRate = (totalNIC / income) * 100;

        results = [
          {
            label: "Gross Annual Income",
            value: income
          },
          {
            label: "Class 2 NICs",
            value: class2AnnualAmount,
            description: `Flat rate: £${class2Rate} per week`
          },
          {
            label: "Class 4 NICs",
            value: class4Amount,
            description: `9% between £12,570 - £50,270, then 2% above`
          },
          {
            label: "Total National Insurance",
            value: totalNIC,
            description: `Effective rate: ${formatPercentage(effectiveRate)}`
          },
          {
            label: "Income After NICs",
            value: income - totalNIC,
            isTotal: true
          }
        ];
      }
    }
    else if (region === "eu") {
      // EU Social Security contribution calculation
      // Germany specific calculation
      if (euCountry === "germany") {
        const countryData = EU_COUNTRIES.germany;
        const pensionCeiling = countryData.ceiling.pension;
        const healthCeiling = countryData.ceiling.health;

        const pensionContributionBase = Math.min(income, pensionCeiling);
        const healthContributionBase = Math.min(income, healthCeiling);

        const pensionContribution = pensionContributionBase * (countryData.employee.pension / 100);
        const healthContribution = healthContributionBase * (countryData.employee.health / 100);
        const unemploymentContribution = pensionContributionBase * (countryData.employee.unemployment / 100);
        const nursingContribution = healthContributionBase * (countryData.employee.nursingCare / 100);

        const totalContribution = pensionContribution + healthContribution + unemploymentContribution + nursingContribution;
        const effectiveRate = (totalContribution / income) * 100;

        results = [
          {
            label: "Gross Annual Income",
            value: income
          },
          {
            label: "Pension Insurance",
            value: pensionContribution,
            description: `${countryData.employee.pension}% up to €${pensionCeiling.toLocaleString()}`
          },
          {
            label: "Health Insurance",
            value: healthContribution,
            description: `${countryData.employee.health}% up to €${healthCeiling.toLocaleString()}`
          },
          {
            label: "Unemployment Insurance",
            value: unemploymentContribution,
            description: `${countryData.employee.unemployment}% up to €${pensionCeiling.toLocaleString()}`
          },
          {
            label: "Nursing Care Insurance",
            value: nursingContribution,
            description: `${countryData.employee.nursingCare}% up to €${healthCeiling.toLocaleString()}`
          },
          {
            label: "Total Social Security Contributions",
            value: totalContribution,
            description: `Effective rate: ${formatPercentage(effectiveRate)}`
          },
          {
            label: "Income After Social Security",
            value: income - totalContribution,
            isTotal: true
          }
        ];
      }
      // France specific calculation
      else if (euCountry === "france") {
        const countryData = EU_COUNTRIES.france;
        const ssCeiling = countryData.ceiling.socialSecurity;

        const healthAndPensionBase = Math.min(income, ssCeiling);
        const healthAndPensionContribution = healthAndPensionBase * (countryData.employee.healthAndPension / 100);

        // Other contributions apply to the full income
        const otherContributions = income * (countryData.employee.otherContributions / 100);

        const totalContribution = healthAndPensionContribution + otherContributions;
        const effectiveRate = (totalContribution / income) * 100;

        results = [
          {
            label: "Gross Annual Income",
            value: income
          },
          {
            label: "Health & Pension Insurance",
            value: healthAndPensionContribution,
            description: `${countryData.employee.healthAndPension}% up to €${ssCeiling.toLocaleString()}`
          },
          {
            label: "Other Social Contributions",
            value: otherContributions,
            description: `${countryData.employee.otherContributions}% on total income`
          },
          {
            label: "Total Social Security Contributions",
            value: totalContribution,
            description: `Effective rate: ${formatPercentage(effectiveRate)}`
          },
          {
            label: "Income After Social Security",
            value: income - totalContribution,
            isTotal: true
          }
        ];
      }
      // Italy specific calculation
      else if (euCountry === "italy") {
        const countryData = EU_COUNTRIES.italy;
        const pensionCeiling = countryData.ceiling.pension;

        const pensionBase = Math.min(income, pensionCeiling);
        const pensionContribution = pensionBase * (countryData.employee.pension / 100);

        // Other contributions apply to the full income
        const otherContributions = income * (countryData.employee.otherContributions / 100);

        const totalContribution = pensionContribution + otherContributions;
        const effectiveRate = (totalContribution / income) * 100;

        results = [
          {
            label: "Gross Annual Income",
            value: income
          },
          {
            label: "Pension Contribution",
            value: pensionContribution,
            description: `${countryData.employee.pension}% up to €${pensionCeiling.toLocaleString()}`
          },
          {
            label: "Other Contributions",
            value: otherContributions,
            description: `${countryData.employee.otherContributions}% on total income`
          },
          {
            label: "Total Social Security Contributions",
            value: totalContribution,
            description: `Effective rate: ${formatPercentage(effectiveRate)}`
          },
          {
            label: "Income After Social Security",
            value: income - totalContribution,
            isTotal: true
          }
        ];
      }
      // Spain specific calculation
      else if (euCountry === "spain") {
        const countryData = EU_COUNTRIES.spain;
        const ceiling = countryData.ceiling.general;

        const contributionBase = Math.min(income, ceiling);
        const contribution = contributionBase * (countryData.employee.generalRate / 100);

        const effectiveRate = (contribution / income) * 100;

        results = [
          {
            label: "Gross Annual Income",
            value: income
          },
          {
            label: "Social Security Contribution",
            value: contribution,
            description: `${countryData.employee.generalRate}% up to €${ceiling.toLocaleString()}`
          },
          {
            label: "Income After Social Security",
            value: income - contribution,
            isTotal: true
          }
        ];
      }
    }
    else if (region === "us") {
      // US Social Security and Medicare taxes
      const socialSecurityRate = 6.2; // 6.2%
      const medicareRate = 1.45; // 1.45%
      const medicareAdditionalRate = 0.9; // Additional Medicare tax over $200,000
      const socialSecurityWageCap = 168600; // 2024 wage cap

      const socialSecurityBase = Math.min(income, socialSecurityWageCap);
      const socialSecurityTax = socialSecurityBase * (socialSecurityRate / 100);

      let medicareTax = income * (medicareRate / 100);

      // Add additional Medicare tax for high earners
      if (income > 200000) {
        medicareTax += (income - 200000) * (medicareAdditionalRate / 100);
      }

      const totalTax = socialSecurityTax + medicareTax;
      const effectiveRate = (totalTax / income) * 100;

      results = [
        {
          label: "Gross Annual Income",
          value: income
        },
        {
          label: "Social Security Tax",
          value: socialSecurityTax,
          description: `6.2% up to $${socialSecurityWageCap.toLocaleString()}`
        },
        {
          label: "Medicare Tax",
          value: medicareTax,
          description: income > 200000 ?
            `1.45% on all earnings + 0.9% on earnings above $200,000` :
            `1.45% on all earnings`
        },
        {
          label: "Total FICA Taxes",
          value: totalTax,
          description: `Effective rate: ${formatPercentage(effectiveRate)}`
        },
        {
          label: "Income After FICA Taxes",
          value: income - totalTax,
          isTotal: true
        }
      ];
    }

    setTaxResults(results);
  };

  // Calculate NIC on initial render and when inputs change
  useEffect(() => {
    calculateNIC();
  }, [income, region, euCountry, nicType]);

  return (
    <BaseTaxCalculator
      region={region}
      title={region === "uk" ? "National Insurance Calculator" : "Social Security Calculator"}
      description={region === "uk"
        ? "Calculate National Insurance Contributions for UK residents"
        : region === "eu"
          ? "Calculate Social Security contributions for EU residents"
          : "Calculate Social Security (FICA) taxes for US residents"}
      taxResults={taxResults}
    >
      <TaxInput
        id="income"
        label="Annual Income"
        value={income}
        onChange={(value) => setIncome(Number(value) || 0)}
        required
        min={0}
        placeholder="Enter your annual income"
        prefix={region === "uk" ? "£" : region === "eu" ? "€" : "$"}
      />

      {region === "uk" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Employment Type</label>
          <Select value={nicType} onValueChange={setNicType}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed (Class 1)</SelectItem>
              <SelectItem value="self-employed">Self-Employed (Class 2 & 4)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {region === "eu" && (
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
      )}
    </BaseTaxCalculator>
  );
}
