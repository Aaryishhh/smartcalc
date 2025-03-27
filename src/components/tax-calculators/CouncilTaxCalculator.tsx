"use client";

import { useState, useEffect } from "react";
import {
  Region,
  ukCouncilTaxBands,
  ukCouncilAreas,
  usPropertyTaxRates,
  euPropertyTaxRates,
  formatCurrency,
  formatPercentage
} from "@/lib/tax-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxInput, SliderInput } from "./BaseTaxCalculator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function CouncilTaxCalculator({ region }: { region: Region }) {
  // Common state
  const [propertyValue, setPropertyValue] = useState<number>(250000);
  const [councilBand, setCouncilBand] = useState<string>("D");
  const [councilArea, setCouncilArea] = useState<string>("Metropolitan");
  const [usState, setUsState] = useState<string>("california");
  const [euCountry, setEuCountry] = useState<string>("germany");
  const [discount, setDiscount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);
  const [taxBreakdown, setTaxBreakdown] = useState<Array<{ label: string; value: number; description?: string }>>([]);

  // Calculate property/council tax
  const calculatePropertyTax = () => {
    let tax = 0;
    let breakdown: Array<{ label: string; value: number; description?: string }> = [];

    if (region === "uk") {
      // UK Council Tax calculation - based on bands
      const selectedBand = ukCouncilTaxBands.find(band => band.band === councilBand);
      if (selectedBand) {
        // Get base rate for the band
        const baseRate = selectedBand.rate;

        // Apply area multiplier
        const areaMultiplier = ukCouncilAreas[councilArea] || 1.0;
        const areaAdjustedRate = baseRate * areaMultiplier;

        // Apply any discounts (e.g., single occupancy, etc.)
        const discountMultiplier = 1 - (discount / 100);

        tax = areaAdjustedRate * discountMultiplier;

        breakdown = [
          {
            label: `Band ${selectedBand.band} Base Rate`,
            value: baseRate,
            description: selectedBand.description
          }
        ];

        if (areaMultiplier !== 1.0) {
          breakdown.push({
            label: `${councilArea} Area Adjustment`,
            value: areaAdjustedRate - baseRate,
            description: `${councilArea} multiplier: ${areaMultiplier}`
          });
        }

        if (discount > 0) {
          breakdown.push({
            label: "Discount",
            value: -(areaAdjustedRate * (discount / 100)),
            description: `${discount}% discount applied`
          });
        }
      }
    }
    else if (region === "us") {
      // US Property Tax calculation - based on property value
      const taxRate = usPropertyTaxRates[usState] || usPropertyTaxRates.california;

      // Calculate tax based on property value and rate
      tax = (propertyValue * taxRate) / 100;

      // Apply any homestead exemptions or other discounts
      if (discount > 0) {
        const discountAmount = (tax * discount) / 100;
        tax -= discountAmount;
      }

      breakdown = [
        {
          label: "Property Value",
          value: propertyValue,
          description: `Assessed value of property`
        },
        {
          label: "Tax Rate",
          value: taxRate,
          description: `${usState.replace('_', ' ')} property tax rate: ${taxRate}%`
        }
      ];

      if (discount > 0) {
        breakdown.push({
          label: "Exemptions/Discounts",
          value: -(tax * discount / 100),
          description: `${discount}% homestead exemption or other discounts`
        });
      }
    }
    else if (region === "eu") {
      // EU Property Tax calculation
      const countryInfo = euPropertyTaxRates[euCountry];

      if (countryInfo) {
        if (countryInfo.type === "percentage" && countryInfo.rate) {
          // Percentage-based tax
          tax = (propertyValue * countryInfo.rate) / 100;

          breakdown = [
            {
              label: "Property Value",
              value: propertyValue,
              description: `Assessed value of property`
            },
            {
              label: "Tax Rate",
              value: countryInfo.rate,
              description: `${euCountry} property tax rate: ${countryInfo.rate}%`
            }
          ];
        }
        else if (countryInfo.type === "value_based" && countryInfo.brackets) {
          // Value-based taxation with brackets
          const applicableBracket = countryInfo.brackets.find(
            bracket => propertyValue >= bracket.min &&
                      (bracket.max === null || propertyValue <= bracket.max)
          );

          if (applicableBracket) {
            tax = applicableBracket.rate;

            breakdown = [
              {
                label: "Base Rate",
                value: tax,
                description: `Based on property value: ${formatCurrency(propertyValue, region)}`
              }
            ];
          }
        }
        else if (countryInfo.type === "fixed" && countryInfo.baseAmount) {
          // Fixed amount taxation
          tax = countryInfo.baseAmount;

          breakdown = [
            {
              label: "Fixed Rate",
              value: tax,
              description: countryInfo.description
            }
          ];
        }

        // Apply any discounts
        if (discount > 0) {
          const discountAmount = (tax * discount) / 100;
          tax -= discountAmount;

          breakdown.push({
            label: "Discount",
            value: -discountAmount,
            description: `${discount}% discount applied`
          });
        }
      }
    }

    // Set the effective rate (as a percentage of property value)
    const effectiveRateValue = (tax / propertyValue) * 100;

    setTaxAmount(tax);
    setEffectiveRate(effectiveRateValue);
    setTaxBreakdown(breakdown);
  };

  // When property value changes, set the appropriate UK council band
  useEffect(() => {
    if (region === "uk") {
      // Find the appropriate band based on property value
      const appropriateBand = ukCouncilTaxBands.find(
        band => propertyValue >= band.valueFrom &&
               (band.valueTo === null || propertyValue <= band.valueTo)
      );

      if (appropriateBand) {
        setCouncilBand(appropriateBand.band);
      }
    }
  }, [propertyValue, region]);

  // Recalculate when inputs change
  useEffect(() => {
    calculatePropertyTax();
  }, [
    propertyValue, councilBand, councilArea,
    usState, euCountry, discount, region
  ]);

  // UI components for each region
  const renderUkInputs = () => (
    <div className="space-y-4">
      <SliderInput
        id="property-value"
        label="Property Value"
        value={propertyValue}
        onChange={(value) => setPropertyValue(value)}
        prefix="£"
        required
        min={10000}
        max={1000000}
        step={5000}
        formatDisplay={(value) => value.toLocaleString()}
        helperText="Drag the slider or enter the value directly"
      />

      <div className="mt-2">
        <Label>Council Tax Band</Label>
        <div className="mt-2">
          <Select value={councilBand} onValueChange={setCouncilBand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select band" />
            </SelectTrigger>
            <SelectContent>
              {ukCouncilTaxBands.map((band) => (
                <SelectItem key={band.band} value={band.band}>
                  Band {band.band} - {band.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Selected band: {ukCouncilTaxBands.find(band => band.band === councilBand)?.description}
        </p>
      </div>

      <div className="mt-2">
        <Label>Council Area</Label>
        <div className="mt-2">
          <Select value={councilArea} onValueChange={setCouncilArea}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(ukCouncilAreas).map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Discounts</Label>
        <Tabs defaultValue="0" value={discount.toString()} onValueChange={(val) => setDiscount(Number(val))} className="mt-2">
          <TabsList className="grid grid-cols-1 xs:grid-cols-3 w-full">
            <TabsTrigger value="0" className="text-sm">None</TabsTrigger>
            <TabsTrigger value="25" className="text-sm">Single Occupancy (25%)</TabsTrigger>
            <TabsTrigger value="100" className="text-sm">Exempt (100%)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>UK Council Tax is based on the value of your property as of April 1991 and is set by your local council.</p>
        <p>Discounts may apply for single occupancy (25%) or other exemptions.</p>
      </div>
    </div>
  );

  const renderUsInputs = () => (
    <div className="space-y-4">
      <SliderInput
        id="property-value"
        label="Property Value"
        value={propertyValue}
        onChange={(value) => setPropertyValue(value)}
        prefix="$"
        required
        min={50000}
        max={2000000}
        step={10000}
        formatDisplay={(value) => value.toLocaleString()}
        helperText="Drag the slider or enter the value directly"
      />

      <div className="mt-2">
        <Label>State</Label>
        <div className="mt-2">
          <Select value={usState} onValueChange={setUsState}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(usPropertyTaxRates).map((state) => (
                <SelectItem key={state} value={state}>
                  {state.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Homestead Exemption</Label>
        <Tabs defaultValue="0" value={discount.toString()} onValueChange={(val) => setDiscount(Number(val))} className="mt-2">
          <TabsList className="grid grid-cols-1 xs:grid-cols-3 w-full">
            <TabsTrigger value="0" className="text-sm">None</TabsTrigger>
            <TabsTrigger value="20" className="text-sm">Standard (20%)</TabsTrigger>
            <TabsTrigger value="50" className="text-sm">Senior (50%)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>US Property Tax varies significantly by state and is typically calculated as a percentage of the assessed property value.</p>
        <p>Many states offer homestead exemptions for primary residences and additional benefits for seniors or disabled residents.</p>
      </div>
    </div>
  );

  const renderEuInputs = () => (
    <div className="space-y-4">
      <SliderInput
        id="property-value"
        label="Property Value"
        value={propertyValue}
        onChange={(value) => setPropertyValue(value)}
        prefix="€"
        required
        min={50000}
        max={2000000}
        step={10000}
        formatDisplay={(value) => value.toLocaleString()}
        helperText="Drag the slider or enter the value directly"
      />

      <div className="mt-2">
        <Label>Country</Label>
        <div className="mt-2">
          <Select value={euCountry} onValueChange={setEuCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(euPropertyTaxRates).map((country) => (
                <SelectItem key={country} value={country}>
                  {country.charAt(0).toUpperCase() + country.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Discounts/Exemptions</Label>
        <Tabs defaultValue="0" value={discount.toString()} onValueChange={(val) => setDiscount(Number(val))} className="mt-2">
          <TabsList className="grid grid-cols-1 xs:grid-cols-2 w-full">
            <TabsTrigger value="0" className="text-sm">None</TabsTrigger>
            <TabsTrigger value="30" className="text-sm">Residential (30%)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>Property tax systems in EU countries vary widely:</p>
        <p>{euPropertyTaxRates[euCountry]?.description || "Property tax based on assessed value"}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">{region === "uk" ? "Council Tax" : "Property Tax"} Calculator</h3>
            {getRegionInputs()}
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tax Results</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted/30 rounded-lg gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Annual {region === "uk" ? "Council" : "Property"} Tax</p>
                  <p className="text-xl sm:text-2xl font-semibold">{formatCurrency(taxAmount, region)}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-muted-foreground">Effective Rate</p>
                  <p className="text-lg sm:text-xl font-semibold">{formatPercentage(effectiveRate)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Payment:</span>
                  <span className="font-medium">{formatCurrency(taxAmount / 12, region)}</span>
                </div>
                {region === "uk" && (
                  <div className="flex justify-between text-sm mb-2">
                    <span>Council Tax Band:</span>
                    <span className="font-medium">Band {councilBand}</span>
                  </div>
                )}
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="breakdown" className="border-b-0">
                  <AccordionTrigger className="py-2">
                    <h4 className="text-sm font-medium">Tax Breakdown</h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {taxBreakdown.map((item, index) => (
                        <div key={index} className="p-3 bg-muted/20 rounded">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="font-medium text-sm">{item.label}</span>
                            <span className="text-sm sm:text-right">
                              {typeof item.value === 'number' && !isNaN(item.value) &&
                              item.label.toLowerCase().includes('rate') &&
                              !item.label.toLowerCase().includes('base')
                                ? `${item.value}%`
                                : formatCurrency(item.value, region)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
