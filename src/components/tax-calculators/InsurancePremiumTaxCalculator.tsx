"use client";

import { useState, useEffect } from "react";
import {
  Region,
  ukInsurancePremiumTax,
  usInsurancePremiumTax,
  euInsurancePremiumTax,
  formatCurrency,
  formatPercentage
} from "@/lib/tax-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxInput } from "./BaseTaxCalculator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type InsuranceType = "standard" | "travel" | "auto" | "health" | "home" | "life" | "marine" | "fire";

export default function InsurancePremiumTaxCalculator({ region }: { region: Region }) {
  // Common state
  const [insurancePremium, setInsurancePremium] = useState<number>(1000);
  const [insuranceType, setInsuranceType] = useState<InsuranceType>("standard");
  const [usState, setUsState] = useState<string>("california");
  const [euCountry, setEuCountry] = useState<string>("germany");

  // Results
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isExempt, setIsExempt] = useState<boolean>(false);
  const [exemptionReason, setExemptionReason] = useState<string>("");

  // Calculate insurance premium tax
  const calculateIPT = () => {
    let tax = 0;
    let exempt = false;
    let reason = "";
    let rate = 0;

    if (region === "uk") {
      // UK Insurance Premium Tax
      const ukIpt = ukInsurancePremiumTax;

      // Check exemptions
      const exemptTypes = ukIpt.exemptions;
      if (insuranceType === "life" || exemptTypes.some(type => insuranceType.includes(type.toLowerCase()))) {
        exempt = true;
        reason = "This type of insurance is exempt from IPT in the UK";
      } else {
        // Apply appropriate rate
        rate = insuranceType === "travel" ? ukIpt.higherRate : ukIpt.standardRate;
        tax = (insurancePremium * rate) / 100;
      }
    }
    else if (region === "us") {
      // US Insurance Premium Tax (varies by state)
      const stateRate = usInsurancePremiumTax[usState] || 0;

      // Some US states exempt certain types of insurance
      if (usState === "oregon" || (usState === "hawaii" && insuranceType === "life")) {
        exempt = true;
        reason = `Insurance of this type is exempt from premium tax in ${usState}`;
      } else {
        rate = stateRate;
        tax = (insurancePremium * stateRate) / 100;
      }
    }
    else if (region === "eu") {
      // EU Insurance Premium Tax (varies by country)
      const countryInfo = euInsurancePremiumTax[euCountry];

      if (countryInfo) {
        // Check exemptions
        if (countryInfo.exemptions && insuranceType &&
            countryInfo.exemptions.some(type => insuranceType.includes(type.toLowerCase()))) {
          exempt = true;
          reason = `This type of insurance is exempt from IPT in ${euCountry}`;
        }
        // Check for special rates
        else if (countryInfo.specialRates &&
                 insuranceType &&
                 countryInfo.specialRates[insuranceType]) {
          rate = countryInfo.specialRates[insuranceType];
          tax = (insurancePremium * rate) / 100;
        }
        // Apply standard rate
        else {
          rate = countryInfo.standardRate;
          tax = (insurancePremium * rate) / 100;
        }
      }
    }

    // Set effective rate
    const effectiveRateValue = exempt ? 0 : rate;

    // Set state
    setTaxAmount(tax);
    setEffectiveRate(effectiveRateValue);
    setTotalCost(insurancePremium + tax);
    setIsExempt(exempt);
    setExemptionReason(reason);
  };

  // Recalculate when inputs change
  useEffect(() => {
    calculateIPT();
  }, [
    insurancePremium, insuranceType,
    usState, euCountry, region
  ]);

  // Get available insurance types for each region
  const getInsuranceTypes = () => {
    if (region === "uk") {
      return [
        { value: "standard", label: "Standard Insurance" },
        { value: "travel", label: "Travel Insurance" },
        { value: "auto", label: "Motor Insurance" },
        { value: "home", label: "Home Insurance" },
        { value: "life", label: "Life Insurance (exempt)" }
      ];
    }
    else if (region === "us") {
      return [
        { value: "standard", label: "Standard Insurance" },
        { value: "auto", label: "Auto Insurance" },
        { value: "home", label: "Home Insurance" },
        { value: "health", label: "Health Insurance" },
        { value: "life", label: "Life Insurance" }
      ];
    }
    else {  // EU
      const countryInfo = euInsurancePremiumTax[euCountry];
      const types = [
        { value: "standard", label: "Standard Insurance" }
      ];

      // Add special types if available for the country
      if (countryInfo?.specialRates) {
        Object.keys(countryInfo.specialRates).forEach(type => {
          types.push({
            value: type as InsuranceType,
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} Insurance`
          });
        });
      }

      // Add exempt types
      if (countryInfo?.exemptions) {
        countryInfo.exemptions.forEach(type => {
          const typeLower = type.toLowerCase().replace(" insurance", "");
          types.push({
            value: typeLower as InsuranceType,
            label: `${type} (exempt)`
          });
        });
      }

      return types;
    }
  };

  // UI components for each region
  const renderUkInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="insurance-premium"
        label="Insurance Premium"
        value={insurancePremium}
        onChange={(value) => setInsurancePremium(Number(value) || 0)}
        prefix="£"
        required
      />

      <div>
        <Label>Insurance Type</Label>
        <Select value={insuranceType} onValueChange={(value) => setInsuranceType(value as InsuranceType)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select insurance type" />
          </SelectTrigger>
          <SelectContent>
            {getInsuranceTypes().map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>UK Insurance Premium Tax (IPT) is charged on most general insurance policies.</p>
        <p>The standard rate is {ukInsurancePremiumTax.standardRate}%, with a higher rate of {ukInsurancePremiumTax.higherRate}% for travel insurance and some other types.</p>
        <p>Life insurance and several other types are exempt from IPT.</p>
      </div>
    </div>
  );

  const renderUsInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="insurance-premium"
        label="Insurance Premium"
        value={insurancePremium}
        onChange={(value) => setInsurancePremium(Number(value) || 0)}
        prefix="$"
        required
      />

      <div>
        <Label>Insurance Type</Label>
        <Select value={insuranceType} onValueChange={(value) => setInsuranceType(value as InsuranceType)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select insurance type" />
          </SelectTrigger>
          <SelectContent>
            {getInsuranceTypes().map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>State</Label>
        <Tabs defaultValue={usState} value={usState} onValueChange={setUsState} className="mt-2">
          <TabsList className="flex flex-wrap">
            {Object.keys(usInsurancePremiumTax).map((state) => (
              <TabsTrigger key={state} value={state}>
                {state.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>In the US, insurance premium taxes vary by state.</p>
        <p>The current rate for {usState.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} is {usInsurancePremiumTax[usState]}%.</p>
        <p>Some states offer exemptions for certain types of insurance.</p>
      </div>
    </div>
  );

  const renderEuInputs = () => (
    <div className="space-y-4">
      <TaxInput
        id="insurance-premium"
        label="Insurance Premium"
        value={insurancePremium}
        onChange={(value) => setInsurancePremium(Number(value) || 0)}
        prefix="€"
        required
      />

      <div>
        <Label>Insurance Type</Label>
        <Select value={insuranceType} onValueChange={(value) => setInsuranceType(value as InsuranceType)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select insurance type" />
          </SelectTrigger>
          <SelectContent>
            {getInsuranceTypes().map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Country</Label>
        <Tabs defaultValue={euCountry} value={euCountry} onValueChange={setEuCountry} className="mt-2">
          <TabsList className="flex flex-wrap">
            {Object.keys(euInsurancePremiumTax).map((country) => (
              <TabsTrigger key={country} value={country}>
                {country.charAt(0).toUpperCase() + country.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>Insurance Premium Tax rates in the EU vary by country.</p>
        {euInsurancePremiumTax[euCountry] && (
          <p>The standard rate in {euCountry.charAt(0).toUpperCase() + euCountry.slice(1)} is {euInsurancePremiumTax[euCountry].standardRate}%.</p>
        )}
        <p>Some insurance types may have special rates or be exempt.</p>
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
            <h3 className="text-lg font-medium mb-4">Insurance Premium Tax Calculator</h3>
            {getRegionInputs()}
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tax Results</h3>
            <div className="space-y-6">
              {isExempt ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                  <h4 className="font-medium">Tax Exempt</h4>
                  <p className="text-sm mt-1">{exemptionReason}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Tax Amount</p>
                      <p className="text-xl font-semibold">{formatCurrency(taxAmount, region)}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-xl font-semibold">{formatCurrency(totalCost, region)}</p>
                    </div>
                  </div>

                  <div className="p-4 border border-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Insurance Premium</span>
                      <span>{formatCurrency(insurancePremium, region)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Tax Rate</span>
                      <span className="font-medium">{formatPercentage(effectiveRate)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Insurance Premium Tax</span>
                      <span>{formatCurrency(taxAmount, region)}</span>
                    </div>
                    <div className="h-px bg-muted my-3"></div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Total Cost</span>
                      <span>{formatCurrency(totalCost, region)}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="p-4 bg-muted/10 rounded-lg border border-muted/50">
                <h4 className="text-sm font-medium mb-2">Insurance Premium Tax Information</h4>
                <div className="text-sm space-y-1">
                  {region === "uk" && (
                    <>
                      <p>UK has a standard rate of {ukInsurancePremiumTax.standardRate}% and a higher rate of {ukInsurancePremiumTax.higherRate}%.</p>
                      <p>Higher rate applies to travel insurance and some motor insurance policies.</p>
                      <p>Key exemptions include life insurance, permanent health insurance, and insurance for commercial ships.</p>
                    </>
                  )}
                  {region === "us" && (
                    <>
                      <p>US insurance premium taxes are levied at the state level.</p>
                      <p>Rates range from 0% (exempt states) to over 4% (highest taxing states).</p>
                      <p>Some states offer exemptions for certain insurance types (e.g., health, life, crop).</p>
                    </>
                  )}
                  {region === "eu" && euInsurancePremiumTax[euCountry] && (
                    <>
                      <p>{euCountry.charAt(0).toUpperCase() + euCountry.slice(1)} has a standard rate of {euInsurancePremiumTax[euCountry].standardRate}%.</p>
                      {euInsurancePremiumTax[euCountry].specialRates && (
                        <p>Special rates apply to certain insurance types, such as:
                          {Object.entries(euInsurancePremiumTax[euCountry].specialRates || {}).map(([type, rate], i, arr) =>
                            ` ${type} (${rate}%)${i < arr.length - 1 ? ',' : '.'}`
                          )}
                        </p>
                      )}
                      {euInsurancePremiumTax[euCountry].exemptions && (
                        <p>Exemptions include: {euInsurancePremiumTax[euCountry].exemptions?.join(', ')}.</p>
                      )}
                    </>
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
