"use client";

import { useState, useEffect } from "react";
import {
  Region,
  ukVehicleTaxRates,
  usVehicleTaxRates,
  usVehicleRegistrationFees,
  euVehicleTaxRates,
  formatCurrency,
  formatPercentage
} from "@/lib/tax-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxInput } from "./BaseTaxCalculator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VehicleTaxCalculator({ region }: { region: Region }) {
  // Common state
  const [vehicleValue, setVehicleValue] = useState<number>(25000);
  const [co2Emissions, setCo2Emissions] = useState<number>(120);
  const [engineSize, setEngineSize] = useState<number>(1600);
  const [vehicleWeight, setVehicleWeight] = useState<number>(1500);
  const [vehiclePower, setVehiclePower] = useState<number>(100);
  const [fuelType, setFuelType] = useState<string>("petrol");
  const [vehicleAge, setVehicleAge] = useState<string>("new");
  const [taxYear, setTaxYear] = useState<string>("first");
  const [usState, setUsState] = useState<string>("california");
  const [euCountry, setEuCountry] = useState<string>("germany");
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [taxBreakdown, setTaxBreakdown] = useState<Array<{ label: string; value: number; description?: string }>>([]);

  // Calculate vehicle tax
  const calculateVehicleTax = () => {
    let tax = 0;
    let breakdown: Array<{ label: string; value: number; description?: string }> = [];

    if (region === "uk") {
      // UK Vehicle Tax calculation
      const rates = ukVehicleTaxRates;
      const vehicleRates =
        fuelType === "petrol" ? rates.petrol :
        fuelType === "diesel" ? rates.diesel :
        fuelType === "electric" ? null : rates.alternative;

      // First determine which tax band applies
      if (fuelType === "electric") {
        tax = taxYear === "first" ? rates.electric.firstYearRate : rates.electric.standardRate;

        breakdown = [
          {
            label: taxYear === "first" ? "First Year Rate" : "Standard Rate",
            value: tax,
            description: "Electric vehicles"
          }
        ];
      } else if (vehicleRates) {
        // Find the applicable CO2 band
        const applicable = vehicleRates.find(
          band => co2Emissions >= (band.co2From || 0) &&
                 (band.co2To === undefined || band.co2To === null || co2Emissions <= band.co2To)
        );

        if (applicable) {
          tax = taxYear === "first" ? applicable.firstYearRate || 0 : applicable.standardRate || 0;

          breakdown = [
            {
              label: taxYear === "first" ? "First Year Rate" : "Standard Rate",
              value: tax,
              description: `CO2 emissions: ${co2Emissions} g/km (${
                applicable.co2From === 0 && applicable.co2To === 0
                  ? "Zero emissions"
                  : `${applicable.co2From}-${applicable.co2To !== null ? applicable.co2To : "+"} g/km`
              })`
            }
          ];
        }
      }
    }
    else if (region === "us") {
      // US Vehicle Tax (sales tax on vehicle purchase + registration fee)
      const stateTaxRate = usVehicleTaxRates[usState] || usVehicleTaxRates.california;
      const registrationFee = usVehicleRegistrationFees[usState] || usVehicleRegistrationFees.california;

      // For new vehicles, include sales tax
      let salesTax = 0;
      if (vehicleAge === "new") {
        salesTax = (vehicleValue * stateTaxRate) / 100;
      }

      // Add registration fee
      tax = salesTax + registrationFee;

      breakdown = [
        {
          label: "Registration Fee",
          value: registrationFee,
          description: `Annual registration fee for ${usState.replace('_', ' ')}`
        }
      ];

      if (vehicleAge === "new") {
        breakdown.unshift({
          label: "Sales Tax",
          value: salesTax,
          description: `${stateTaxRate}% of vehicle value (${formatCurrency(vehicleValue, region)})`
        });
      }
    }
    else if (region === "eu") {
      // EU Vehicle Tax calculation
      const countryRates = euVehicleTaxRates[euCountry];

      if (countryRates) {
        if (euCountry === "germany") {
          // Germany: based on engine size and CO2
          const baseRate = fuelType === "petrol" ? 2 : 9.5;
          const engineComponent = (engineSize / 100) * baseRate;

          // CO2 component (€2 per g/km above 95g/km)
          const co2Component = co2Emissions > 95 ? (co2Emissions - 95) * 2 : 0;

          // Electric vehicles are exempt from tax until 2025
          tax = fuelType === "electric" ? 0 : engineComponent + co2Component;

          breakdown = [];
          if (fuelType === "electric") {
            breakdown.push({
              label: "Electric Vehicle",
              value: 0,
              description: "Electric vehicles are exempt from tax"
            });
          } else {
            breakdown.push({
              label: "Engine Size Component",
              value: engineComponent,
              description: `${engineSize}cc at €${baseRate} per 100cc`
            });

            if (co2Component > 0) {
              breakdown.push({
                label: "CO2 Component",
                value: co2Component,
                description: `${co2Emissions}g/km (€2 per g/km above 95g/km)`
              });
            }
          }
        }
        else if (euCountry === "france") {
          // France: based on CO2 emissions
          const applicable = countryRates.brackets.find(
            (band: {co2From?: number; co2To?: number | null; rate: number}) =>
              co2Emissions >= (band.co2From || 0) &&
              (band.co2To === null || band.co2To === undefined || co2Emissions <= band.co2To)
          );

          tax = applicable ? applicable.rate : 0;

          breakdown = [
            {
              label: "CO2 Tax",
              value: tax,
              description: `CO2 emissions: ${co2Emissions} g/km`
            }
          ];
        }
        else if (euCountry === "spain") {
          // Spain: based on horsepower (approximate from kW)
          const horsePower = vehiclePower * 1.34; // Rough kW to HP conversion

          const applicable = countryRates.brackets.find(
            band => horsePower >= (band.from || 0) &&
                   (band.to === null || horsePower <= band.to)
          );

          tax = applicable ? applicable.rate : 0;

          breakdown = [
            {
              label: "Horsepower Tax",
              value: tax,
              description: `Approx. ${horsePower.toFixed(2)} HP (${vehiclePower} kW)`
            }
          ];
        }
        else if (euCountry === "italy") {
          // Italy: based on kW with surcharge for high-powered vehicles
          let baseKwTax = vehiclePower * countryRates.rate_per_kw;
          let surcharge = 0;

          if (vehiclePower > 100) {
            surcharge = (vehiclePower - 100) * countryRates.surcharge;
          }

          // Discount for electric/hybrid
          if (fuelType === "electric") {
            baseKwTax = baseKwTax * (1 - countryRates.electric_discount);
            surcharge = surcharge * (1 - countryRates.electric_discount);
          }

          tax = baseKwTax + surcharge;

          breakdown = [
            {
              label: "Base Power Tax",
              value: baseKwTax,
              description: `${vehiclePower} kW at €${countryRates.rate_per_kw} per kW`
            }
          ];

          if (surcharge > 0) {
            breakdown.push({
              label: "Power Surcharge",
              value: surcharge,
              description: `${vehiclePower - 100} kW above 100kW threshold`
            });
          }
        }
        else if (euCountry === "netherlands") {
          // Netherlands: based on weight and fuel type
          const baseRate = fuelType === "diesel" ? countryRates.diesel_rate : countryRates.petrol_rate;
          const weightRate = (vehicleWeight / 100) * countryRates.weight_rate;

          tax = baseRate + weightRate;

          breakdown = [
            {
              label: "Base Rate",
              value: baseRate,
              description: `${fuelType} vehicles`
            },
            {
              label: "Weight Component",
              value: weightRate,
              description: `${vehicleWeight} kg at €${countryRates.weight_rate} per 100kg`
            }
          ];
        }
        else if (euCountry === "belgium") {
          // Belgium: based on engine power (fiscal HP)
          // Simplified - actual calculation is complex
          const fiscalHP = Math.sqrt(engineSize) * 0.4; // Very rough approximation
          const hpTax = Math.max(countryRates.base_rate, fiscalHP * countryRates.rate_per_hp);

          tax = hpTax;

          breakdown = [
            {
              label: "Fiscal Horsepower Tax",
              value: tax,
              description: `Approx. ${fiscalHP.toFixed(2)} fiscal HP based on ${engineSize}cc`
            }
          ];
        }
        else if (euCountry === "sweden") {
          // Sweden: based on CO2
          const baseRate = countryRates.base_rate;
          const co2Component = co2Emissions > 95 ? (co2Emissions - 95) * countryRates.co2_rate : 0;

          // For the first three years, higher rates for non-eco vehicles
          let multiplier = 1;
          if (vehicleAge === "new" && fuelType !== "electric") {
            multiplier = 3;
          }

          tax = fuelType === "electric" ? 360 : (baseRate + co2Component) * multiplier;

          breakdown = [
            {
              label: "Base Rate",
              value: fuelType === "electric" ? 360 : baseRate,
              description: "Annual base tax"
            }
          ];

          if (fuelType !== "electric" && co2Component > 0) {
            breakdown.push({
              label: "CO2 Component",
              value: co2Component * multiplier,
              description: `${co2Emissions}g/km (${vehicleAge === "new" ? "3x rate for new vehicles" : "standard rate"})`
            });
          }
        }
      }
    }

    setTaxAmount(tax);
    setTaxBreakdown(breakdown);
  };

  // Recalculate when inputs change
  useEffect(() => {
    calculateVehicleTax();
  }, [
    region, vehicleValue, co2Emissions, engineSize,
    vehicleWeight, vehiclePower, fuelType, vehicleAge,
    taxYear, usState, euCountry
  ]);

  // UI components for each region
  const renderUkInputs = () => (
    <div className="space-y-4">
      <div>
        <Label>Fuel Type</Label>
        <Tabs defaultValue="petrol" value={fuelType} onValueChange={setFuelType} className="mt-2">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="petrol">Petrol</TabsTrigger>
            <TabsTrigger value="diesel">Diesel</TabsTrigger>
            <TabsTrigger value="alternative">Hybrid</TabsTrigger>
            <TabsTrigger value="electric">Electric</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <Label>Tax Year</Label>
        <Tabs defaultValue="first" value={taxYear} onValueChange={setTaxYear} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="first">First Year</TabsTrigger>
            <TabsTrigger value="standard">Standard Rate</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {fuelType !== "electric" && (
        <TaxInput
          id="co2-emissions"
          label="CO2 Emissions (g/km)"
          value={co2Emissions}
          onChange={(value) => setCo2Emissions(Number(value) || 0)}
          required
        />
      )}

      <div className="text-sm text-muted-foreground mt-4">
        <p>UK Vehicle Tax is based on CO2 emissions, with different rates for first year and subsequent years.</p>
        <p>Electric vehicles currently pay £0 for the first year and £195 standard rate.</p>
      </div>
    </div>
  );

  const renderUsInputs = () => (
    <div className="space-y-4">
      <div>
        <Label>State</Label>
        <Tabs defaultValue="california" value={usState} onValueChange={setUsState} className="mt-2">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="california">California</TabsTrigger>
            <TabsTrigger value="new_york">New York</TabsTrigger>
            <TabsTrigger value="texas">Texas</TabsTrigger>
            <TabsTrigger value="florida">Florida</TabsTrigger>
            <TabsTrigger value="washington">Washington</TabsTrigger>
            <TabsTrigger value="colorado">Colorado</TabsTrigger>
            <TabsTrigger value="illinois">Illinois</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <Label>Vehicle Age</Label>
        <Tabs defaultValue="new" value={vehicleAge} onValueChange={setVehicleAge} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="new">New Purchase</TabsTrigger>
            <TabsTrigger value="used">Used Vehicle</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {vehicleAge === "new" && (
        <TaxInput
          id="vehicle-value"
          label="Vehicle Value"
          value={vehicleValue}
          onChange={(value) => setVehicleValue(Number(value) || 0)}
          prefix="$"
          required
        />
      )}

      <div className="text-sm text-muted-foreground mt-4">
        <p>US vehicle taxes vary by state and typically include sales tax on new purchases and annual registration fees.</p>
        <p>Some states also charge based on vehicle value, weight, or age, but this calculator provides a simplified estimate.</p>
      </div>
    </div>
  );

  const renderEuInputs = () => (
    <div className="space-y-4">
      <div>
        <Label>Country</Label>
        <Tabs defaultValue="germany" value={euCountry} onValueChange={setEuCountry} className="mt-2">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="germany">Germany</TabsTrigger>
            <TabsTrigger value="france">France</TabsTrigger>
            <TabsTrigger value="spain">Spain</TabsTrigger>
            <TabsTrigger value="italy">Italy</TabsTrigger>
            <TabsTrigger value="netherlands">Netherlands</TabsTrigger>
            <TabsTrigger value="belgium">Belgium</TabsTrigger>
            <TabsTrigger value="sweden">Sweden</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <Label>Fuel Type</Label>
        <Tabs defaultValue="petrol" value={fuelType} onValueChange={setFuelType} className="mt-2">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="petrol">Petrol</TabsTrigger>
            <TabsTrigger value="diesel">Diesel</TabsTrigger>
            <TabsTrigger value="electric">Electric</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <Label>Vehicle Age</Label>
        <Tabs defaultValue="new" value={vehicleAge} onValueChange={setVehicleAge} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="new">New (1-3 years)</TabsTrigger>
            <TabsTrigger value="used">Used (4+ years)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {(euCountry === "germany" || euCountry === "france" || euCountry === "sweden") && (
        <TaxInput
          id="co2-emissions"
          label="CO2 Emissions (g/km)"
          value={co2Emissions}
          onChange={(value) => setCo2Emissions(Number(value) || 0)}
          required
        />
      )}

      {(euCountry === "germany" || euCountry === "belgium") && (
        <TaxInput
          id="engine-size"
          label="Engine Size (cc)"
          value={engineSize}
          onChange={(value) => setEngineSize(Number(value) || 0)}
          required
        />
      )}

      {(euCountry === "spain" || euCountry === "italy") && (
        <TaxInput
          id="power"
          label="Engine Power (kW)"
          value={vehiclePower}
          onChange={(value) => setVehiclePower(Number(value) || 0)}
          required
        />
      )}

      {euCountry === "netherlands" && (
        <TaxInput
          id="weight"
          label="Vehicle Weight (kg)"
          value={vehicleWeight}
          onChange={(value) => setVehicleWeight(Number(value) || 0)}
          required
        />
      )}

      <div className="text-sm text-muted-foreground mt-4">
        <p>EU vehicle taxes vary widely by country. Some are based on CO2 emissions, others on engine power or vehicle weight.</p>
        <p>Many EU countries offer incentives for electric vehicles.</p>
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
            <h3 className="text-lg font-medium mb-4">Vehicle Tax Calculator</h3>
            {getRegionInputs()}
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tax Results</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {region === "uk"
                      ? taxYear === "first"
                        ? "First Year Tax"
                        : "Annual Tax"
                      : region === "us"
                        ? vehicleAge === "new"
                          ? "Tax & Registration"
                          : "Annual Registration"
                        : "Annual Vehicle Tax"
                    }
                  </p>
                  <p className="text-2xl font-semibold">{formatCurrency(taxAmount, region)}</p>
                </div>
                {region === "us" && vehicleAge === "new" && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Percentage of Value</p>
                    <p className="text-xl font-semibold">
                      {formatPercentage((taxAmount / vehicleValue) * 100)}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Tax Breakdown</h4>
                <div className="space-y-2">
                  {taxBreakdown.map((item, index) => (
                    <div key={index} className="p-3 bg-muted/20 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{item.label}</span>
                        <span>{formatCurrency(item.value, region)}</span>
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
