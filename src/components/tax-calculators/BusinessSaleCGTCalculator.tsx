"use client";

import { useState, useEffect } from "react";
import {
  Region,
  ukBusinessSaleCGT,
  usBusinessSaleCGT,
  euBusinessSaleCGT,
  formatCurrency,
  formatPercentage
} from "@/lib/tax-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxInput } from "./BaseTaxCalculator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BusinessSaleCGTCalculator({ region }: { region: Region }) {
  // Common state
  const [saleProceeds, setSaleProceeds] = useState<number>(1000000);
  const [acquisitionCost, setAcquisitionCost] = useState<number>(400000);
  const [additionalCosts, setAdditionalCosts] = useState<number>(50000);
  const [ownershipYears, setOwnershipYears] = useState<number>(5);

  // UK specific
  const [qualifiesForBADR, setQualifiesForBADR] = useState<boolean>(true);
  const [sellerTaxBand, setSellerTaxBand] = useState<string>("higher"); // basic or higher

  // US specific
  const [qualifiesForQSBS, setQualifiesForQSBS] = useState<boolean>(false);
  const [incomeBracket, setIncomeBracket] = useState<string>("medium"); // low, medium, high

  // EU specific
  const [euCountry, setEuCountry] = useState<string>("germany");
  const [qualifiesForRelief, setQualifiesForRelief] = useState<boolean>(false);

  // Results
  const [capitalGain, setCapitalGain] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [netProceeds, setNetProceeds] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);

  // Calculate business sale capital gains tax
  const calculateBusinessSaleCGT = () => {
    // Calculate basic capital gain
    let gain = Math.max(0, saleProceeds - acquisitionCost - additionalCosts);
    let taxableGain = gain;
    let rate = 0;
    let tax = 0;

    if (region === "uk") {
      // UK Business Sale Capital Gains Tax
      const ukCGT = ukBusinessSaleCGT;

      // Apply annual exempt amount
      taxableGain = Math.max(0, gain - ukCGT.baseAllowance);

      // Apply tax rate based on relief and tax band
      if (qualifiesForBADR) {
        rate = ukCGT.businessAssetDisposalRate;

        // Check if within lifetime limit
        if (gain > ukCGT.businessAssetDisposalLifetimelimit) {
          const excessGain = gain - ukCGT.businessAssetDisposalLifetimelimit;
          // Apply standard rate to excess
          const standardRate = sellerTaxBand === "higher" ? ukCGT.higherRate : ukCGT.basicRate;

          tax = (ukCGT.businessAssetDisposalLifetimelimit * rate / 100) +
                (excessGain * standardRate / 100);

          // Blended rate
          rate = (tax / taxableGain) * 100;
        } else {
          tax = (taxableGain * rate) / 100;
        }
      } else {
        rate = sellerTaxBand === "higher" ? ukCGT.higherRate : ukCGT.basicRate;
        tax = (taxableGain * rate) / 100;
      }
    }
    else if (region === "us") {
      // US Business Sale Capital Gains Tax
      const usCGT = usBusinessSaleCGT;

      // Check if short-term or long-term
      const isLongTerm = ownershipYears >= 1;

      if (!isLongTerm) {
        // Short-term is taxed as ordinary income
        rate = usCGT.shortTermRate;
        tax = (gain * rate) / 100;
      }
      else if (qualifiesForQSBS) {
        // Qualified Small Business Stock exclusion
        const exclusionPercent = usCGT.qualifiedBusinessStockExclusion;
        taxableGain = gain * (1 - (exclusionPercent / 100));

        // Apply long-term rate to remaining taxable gain
        rate = Array.isArray(usCGT.longTermRates[incomeBracket])
          ? usCGT.longTermRates[incomeBracket][0]
          : usCGT.longTermRates[incomeBracket]; // Fallback to direct value

        tax = (taxableGain * rate) / 100;

        // Effective rate on total gain
        rate = (tax / gain) * 100;
      }
      else {
        // Standard long-term capital gains
        rate = Array.isArray(usCGT.longTermRates[incomeBracket])
          ? usCGT.longTermRates[incomeBracket][0]
          : usCGT.longTermRates[incomeBracket]; // Fallback to direct value
        tax = (gain * rate) / 100;
      }
    }
    else if (region === "eu") {
      // EU Business Sale Capital Gains Tax (varies by country)
      const countryCGT = euBusinessSaleCGT[euCountry];

      if (countryCGT) {
        if (qualifiesForRelief && countryCGT.relief && countryCGT.relief.length > 0) {
          // Apply relief if available
          const relief = countryCGT.relief[0]; // Take first relief for simplicity
          rate = relief.rate;

          if (rate === 0) {
            // Full exemption
            taxableGain = 0;
            tax = 0;
          } else {
            // Reduced rate
            tax = (gain * rate) / 100;
          }
        } else {
          // Apply standard rate
          rate = countryCGT.basicRate;
          tax = (gain * rate) / 100;
        }
      }
    }

    // Calculate net proceeds and effective rate
    const netProceedsAmount = saleProceeds - tax;
    const effectiveRateValue = gain > 0 ? (tax / gain) * 100 : 0;

    // Set state
    setCapitalGain(gain);
    setTaxRate(rate);
    setTaxAmount(tax);
    setNetProceeds(netProceedsAmount);
    setEffectiveRate(effectiveRateValue);
  };

  // Recalculate when inputs change
  useEffect(() => {
    calculateBusinessSaleCGT();
  }, [
    saleProceeds, acquisitionCost, additionalCosts, ownershipYears,
    qualifiesForBADR, sellerTaxBand, qualifiesForQSBS, incomeBracket,
    euCountry, qualifiesForRelief, region
  ]);

  // Check if relief is available
  const isReliefAvailable = () => {
    if (region === "uk") {
      return true; // BADR is available
    } else if (region === "us") {
      return ownershipYears >= 5; // QSBS requires 5+ years
    } else if (region === "eu") {
      const countryCGT = euBusinessSaleCGT[euCountry];
      return !!(countryCGT && countryCGT.relief && countryCGT.relief.length > 0);
    }

    return false;
  };

  // Get relief description
  const getReliefDescription = () => {
    if (region === "uk") {
      return `Business Asset Disposal Relief (formerly Entrepreneurs' Relief) provides a reduced ${ukBusinessSaleCGT.businessAssetDisposalRate}% tax rate on qualifying business disposals up to a lifetime limit of ${formatCurrency(ukBusinessSaleCGT.businessAssetDisposalLifetimelimit, "uk")}.`;
    } else if (region === "us") {
      return `Qualified Small Business Stock (QSBS) allows for ${usBusinessSaleCGT.qualifiedBusinessStockExclusion}% exclusion of capital gains from federal income tax if held for at least 5 years.`;
    } else if (region === "eu") {
      const countryCGT = euBusinessSaleCGT[euCountry];
      if (countryCGT && countryCGT.relief && countryCGT.relief.length > 0) {
        const relief = countryCGT.relief[0]; // Take first relief for simplicity
        return `${relief.type}: ${relief.requirements}`;
      }
      if (countryCGT && countryCGT.specialProvisions) {
        return countryCGT.specialProvisions;
      }
      return "No specific relief available.";
    }

    return "";
  };

  // UI components for each region
  const renderUkInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="sale-proceeds"
        label="Sale Proceeds"
        value={saleProceeds}
        onChange={(value) => setSaleProceeds(Number(value) || 0)}
        prefix="£"
        required
      />

      <TaxInput
        id="acquisition-cost"
        label="Original Acquisition Cost"
        value={acquisitionCost}
        onChange={(value) => setAcquisitionCost(Number(value) || 0)}
        prefix="£"
      />

      <TaxInput
        id="additional-costs"
        label="Additional Costs"
        value={additionalCosts}
        onChange={(value) => setAdditionalCosts(Number(value) || 0)}
        prefix="£"
      />

      <div className="space-y-2">
        <Label>Seller's Tax Band</Label>
        <Tabs defaultValue={sellerTaxBand} value={sellerTaxBand} onValueChange={setSellerTaxBand} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basic">Basic Rate</TabsTrigger>
            <TabsTrigger value="higher">Higher Rate</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="badr"
            checked={qualifiesForBADR}
            onCheckedChange={(checked) => setQualifiesForBADR(!!checked)}
          />
          <label
            htmlFor="badr"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Qualifies for Business Asset Disposal Relief
          </label>
        </div>
        <p className="text-xs text-muted-foreground ml-6">{getReliefDescription()}</p>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>UK Capital Gains Tax on business sales is {ukBusinessSaleCGT.basicRate}% for basic rate taxpayers and {ukBusinessSaleCGT.higherRate}% for higher rate taxpayers.</p>
        <p>The annual tax-free allowance is {formatCurrency(ukBusinessSaleCGT.baseAllowance, "uk")}.</p>
      </div>
    </div>
  );

  const renderUsInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="sale-proceeds"
        label="Sale Proceeds"
        value={saleProceeds}
        onChange={(value) => setSaleProceeds(Number(value) || 0)}
        prefix="$"
        required
      />

      <TaxInput
        id="acquisition-cost"
        label="Original Acquisition Cost"
        value={acquisitionCost}
        onChange={(value) => setAcquisitionCost(Number(value) || 0)}
        prefix="$"
      />

      <TaxInput
        id="additional-costs"
        label="Additional Costs"
        value={additionalCosts}
        onChange={(value) => setAdditionalCosts(Number(value) || 0)}
        prefix="$"
      />

      <TaxInput
        id="ownership-years"
        label="Years of Ownership"
        value={ownershipYears}
        onChange={(value) => setOwnershipYears(Number(value) || 0)}
      />

      <div className="space-y-2">
        <Label>Income Bracket</Label>
        <Tabs defaultValue={incomeBracket} value={incomeBracket} onValueChange={setIncomeBracket} className="mt-2">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="low">Low</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="high">High</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          Low: Under $44,625 | Medium: $44,626-$492,300 | High: Over $492,300 (single filer)
        </p>
      </div>

      {ownershipYears >= 5 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="qsbs"
              checked={qualifiesForQSBS}
              onCheckedChange={(checked) => setQualifiesForQSBS(!!checked)}
            />
            <label
              htmlFor="qsbs"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Qualifies for Section 1202 QSBS Exclusion
            </label>
          </div>
          <p className="text-xs text-muted-foreground ml-6">{getReliefDescription()}</p>
        </div>
      )}

      <div className="text-sm text-muted-foreground mt-4">
        <p>Long-term capital gains (assets held for more than 1 year) are taxed at 0%, 15%, or 20% based on income.</p>
        <p>Short-term gains (held for less than or equal to 1 year) are taxed as ordinary income (up to 37%).</p>
      </div>
    </div>
  );

  const renderEuInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="sale-proceeds"
        label="Sale Proceeds"
        value={saleProceeds}
        onChange={(value) => setSaleProceeds(Number(value) || 0)}
        prefix="€"
        required
      />

      <TaxInput
        id="acquisition-cost"
        label="Original Acquisition Cost"
        value={acquisitionCost}
        onChange={(value) => setAcquisitionCost(Number(value) || 0)}
        prefix="€"
      />

      <TaxInput
        id="additional-costs"
        label="Additional Costs"
        value={additionalCosts}
        onChange={(value) => setAdditionalCosts(Number(value) || 0)}
        prefix="€"
      />

      <TaxInput
        id="ownership-years"
        label="Years of Ownership"
        value={ownershipYears}
        onChange={(value) => setOwnershipYears(Number(value) || 0)}
      />

      <div>
        <Label>Country</Label>
        <Tabs defaultValue={euCountry} value={euCountry} onValueChange={setEuCountry} className="mt-2">
          <TabsList className="flex flex-wrap">
            {Object.keys(euBusinessSaleCGT).map((country) => (
              <TabsTrigger key={country} value={country}>
                {country.charAt(0).toUpperCase() + country.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isReliefAvailable() && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="eu-relief"
              checked={qualifiesForRelief}
              onCheckedChange={(checked) => setQualifiesForRelief(!!checked)}
            />
            <label
              htmlFor="eu-relief"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Qualifies for Tax Relief
            </label>
          </div>
          <p className="text-xs text-muted-foreground ml-6">{getReliefDescription()}</p>
        </div>
      )}

      <div className="text-sm text-muted-foreground mt-4">
        <p>Capital gains tax rates for business sales vary widely across EU countries.</p>
        <p>
          {euCountry.charAt(0).toUpperCase() + euCountry.slice(1)} has a standard rate of {formatPercentage(euBusinessSaleCGT[euCountry]?.basicRate || 0)}.
        </p>
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
            <h3 className="text-lg font-medium mb-4">Business Sale Capital Gains Tax Calculator</h3>
            {getRegionInputs()}
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tax Calculation Results</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Capital Gain</p>
                  <p className="text-xl font-semibold">{formatCurrency(capitalGain, region)}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Tax Amount</p>
                  <p className="text-xl font-semibold">{formatCurrency(taxAmount, region)}</p>
                </div>
              </div>

              <div className="p-4 border border-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Sale Proceeds</span>
                  <span>{formatCurrency(saleProceeds, region)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Acquisition Cost</span>
                  <span>-{formatCurrency(acquisitionCost, region)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Additional Costs</span>
                  <span>-{formatCurrency(additionalCosts, region)}</span>
                </div>
                <div className="h-px bg-muted my-2"></div>
                <div className="flex justify-between items-center mb-2 font-medium">
                  <span>Capital Gain</span>
                  <span>{formatCurrency(capitalGain, region)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Tax Rate</span>
                  <span className="font-medium">{formatPercentage(taxRate)}</span>
                </div>
                <div className="flex justify-between items-center text-red-500 mb-3">
                  <span>Capital Gains Tax</span>
                  <span>{formatCurrency(taxAmount, region)}</span>
                </div>
                <div className="h-px bg-muted my-2"></div>
                <div className="flex justify-between items-center font-medium">
                  <span>Net Proceeds</span>
                  <span>{formatCurrency(netProceeds, region)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Effective Tax Rate</span>
                  <span>{formatPercentage(effectiveRate)}</span>
                </div>
              </div>

              {/* Apply a different style based on relief status */}
              <div className={(region === "uk" && qualifiesForBADR) ||
                (region === "us" && qualifiesForQSBS) ||
                (region === "eu" && qualifiesForRelief)
                  ? "p-4 rounded-lg bg-green-50 border border-green-200"
                  : "p-4 rounded-lg bg-muted/10 border border-muted/50"
              }>
                <h4 className="text-sm font-medium mb-2">Tax Relief Information</h4>
                <div className="text-sm space-y-1">
                  {region === "uk" && (
                    <p>
                      {qualifiesForBADR
                        ? `You qualify for Business Asset Disposal Relief, reducing your tax rate to ${ukBusinessSaleCGT.businessAssetDisposalRate}% (subject to lifetime limit).`
                        : `Standard capital gains tax rates apply: ${ukBusinessSaleCGT.basicRate}% for basic rate taxpayers, ${ukBusinessSaleCGT.higherRate}% for higher rate taxpayers.`
                      }
                    </p>
                  )}
                  {region === "us" && (
                    <p>
                      {ownershipYears < 1
                        ? "Short-term capital gains are taxed as ordinary income."
                        : qualifiesForQSBS
                          ? `You qualify for QSBS exclusion, allowing up to ${usBusinessSaleCGT.qualifiedBusinessStockExclusion}% of your gain to be excluded from tax.`
                          : `Long-term capital gains are taxed at ${Array.isArray(usBusinessSaleCGT.longTermRates[incomeBracket]) ? usBusinessSaleCGT.longTermRates[incomeBracket][0] : usBusinessSaleCGT.longTermRates[incomeBracket]}% based on your income level.`
                      }
                    </p>
                  )}
                  {region === "eu" && (
                    <p>
                      {qualifiesForRelief && isReliefAvailable()
                        ? `You qualify for special tax relief in ${euCountry.charAt(0).toUpperCase() + euCountry.slice(1)}.`
                        : `Standard capital gains tax rate of ${formatPercentage(euBusinessSaleCGT[euCountry]?.basicRate || 0)} applies in ${euCountry.charAt(0).toUpperCase() + euCountry.slice(1)}.`
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
