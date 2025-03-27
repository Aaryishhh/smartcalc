"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BaseTaxCalculator, { TaxInput, TaxResult } from "./BaseTaxCalculator";
import { Region, formatCurrency, formatPercentage } from "@/lib/tax-utils";

// Define excise duty rates for different products
type ExciseProduct = "alcohol" | "tobacco" | "fuel" | "betting";

// Define the rate structure interface
interface ExciseDutyRate {
  rate: number;
  unit: string;
}

// Define the structure for excise rates for each category
interface ExciseRates {
  [key: string]: {
    [key: string]: ExciseDutyRate;
  };
}

// UK Excise Duty rates (simplified)
const ukExciseDutyRates: ExciseRates = {
  alcohol: {
    beer: { rate: 19.08, unit: "per liter of pure alcohol" },
    wine: { rate: 2.67, unit: "per 75cl bottle (12-15%)" },
    spirits: { rate: 28.74, unit: "per liter of pure alcohol" },
  },
  tobacco: {
    cigarettes: { rate: 16.5, unit: "% of retail price plus £262.90 per 1,000 cigarettes" },
    cigars: { rate: 327.92, unit: "per kg" },
    hand_rolling: { rate: 360.37, unit: "per kg" },
  },
  fuel: {
    petrol: { rate: 0.53, unit: "per liter" },
    diesel: { rate: 0.53, unit: "per liter" },
    biodiesel: { rate: 0.53, unit: "per liter" },
  },
  betting: {
    general: { rate: 15, unit: "% of profits" },
    online: { rate: 21, unit: "% of profits" },
  },
};

// EU Excise Duty rates (simplified average across EU)
const euExciseDutyRates: ExciseRates = {
  alcohol: {
    beer: { rate: 18.00, unit: "per liter of pure alcohol" },
    wine: { rate: 2.20, unit: "per 75cl bottle (12-15%)" },
    spirits: { rate: 25.00, unit: "per liter of pure alcohol" },
  },
  tobacco: {
    cigarettes: { rate: 15.0, unit: "% of retail price plus €200.00 per 1,000 cigarettes" },
    cigars: { rate: 290.00, unit: "per kg" },
    hand_rolling: { rate: 320.00, unit: "per kg" },
  },
  fuel: {
    petrol: { rate: 0.47, unit: "per liter" },
    diesel: { rate: 0.37, unit: "per liter" },
    biodiesel: { rate: 0.33, unit: "per liter" },
  },
  betting: {
    general: { rate: 20, unit: "% of profits" },
    online: { rate: 25, unit: "% of profits" },
  },
};

// US Excise Duty rates (simplified federal rates)
const usExciseDutyRates: ExciseRates = {
  alcohol: {
    beer: { rate: 7.00, unit: "per barrel (31 gallons)" },
    wine: { rate: 1.07, unit: "per 75cl bottle (12-15%)" },
    spirits: { rate: 13.50, unit: "per proof gallon" },
  },
  tobacco: {
    cigarettes: { rate: 1.01, unit: "per pack of 20" },
    cigars: { rate: 52.75, unit: "per 1,000 units" },
    hand_rolling: { rate: 24.78, unit: "per pound" },
  },
  fuel: {
    petrol: { rate: 0.18, unit: "per gallon" },
    diesel: { rate: 0.24, unit: "per gallon" },
    biodiesel: { rate: 0.13, unit: "per gallon" },
  },
  betting: {
    general: { rate: 0.25, unit: "% of wager (varies by state)" },
    online: { rate: 0, unit: "% (varies by state)" },
  },
};

export default function ExciseDutyCalculator({ region }: { region: Region }) {
  const [productCategory, setProductCategory] = useState<ExciseProduct>("alcohol");
  const [productType, setProductType] = useState<string>("beer");
  const [quantity, setQuantity] = useState<number>(10);
  const [retailPrice, setRetailPrice] = useState<number>(100);
  const [alcoholStrength, setAlcoholStrength] = useState<number>(5);
  const [taxResults, setTaxResults] = useState<TaxResult[]>([]);

  // Get the appropriate rates based on the region
  const getExciseRates = (): ExciseRates => {
    switch (region) {
      case "uk":
        return ukExciseDutyRates;
      case "eu":
        return euExciseDutyRates;
      case "us":
        return usExciseDutyRates;
      default:
        return ukExciseDutyRates;
    }
  };

  // Get the product types for the selected category
  const getProductTypes = () => {
    const rates = getExciseRates();
    return Object.keys(rates[productCategory] || {});
  };

  // Calculate tax based on product category and type
  const calculateTax = () => {
    const rates = getExciseRates();
    const productRates = rates[productCategory];

    if (!productRates || !productRates[productType]) {
      setTaxResults([]);
      return;
    }

    const selectedRate: ExciseDutyRate = productRates[productType];
    let taxAmount = 0;
    let description = "";

    switch (productCategory) {
      case "alcohol":
        if (productType === "beer") {
          // Beer is taxed per liter of pure alcohol
          const litersOfPureAlcohol = (quantity * (alcoholStrength / 100));
          taxAmount = litersOfPureAlcohol * selectedRate.rate;
          description = `${quantity} liters of beer at ${alcoholStrength}% ABV`;
        } else if (productType === "wine") {
          // Wine is taxed per 75cl bottle
          taxAmount = (quantity / 0.75) * selectedRate.rate;
          description = `${quantity} liters of wine`;
        } else if (productType === "spirits") {
          // Spirits are taxed per liter of pure alcohol
          const litersOfPureAlcohol = (quantity * (alcoholStrength / 100));
          taxAmount = litersOfPureAlcohol * selectedRate.rate;
          description = `${quantity} liters of spirits at ${alcoholStrength}% ABV`;
        }
        break;

      case "tobacco":
        if (productType === "cigarettes") {
          // Cigarettes have a specific and ad valorem component
          if (region === "uk") {
            const specificComponent = (quantity / 20) * 262.90 / 1000;
            const adValoremComponent = retailPrice * (16.5 / 100);
            taxAmount = specificComponent + adValoremComponent;
          } else if (region === "eu") {
            const specificComponent = (quantity / 20) * 200.00 / 1000;
            const adValoremComponent = retailPrice * (15.0 / 100);
            taxAmount = specificComponent + adValoremComponent;
          } else {
            // US taxes per pack
            taxAmount = (quantity / 20) * selectedRate.rate;
          }
          description = `${quantity} cigarettes at ${formatCurrency(retailPrice, region)}`;
        } else if (productType === "cigars" || productType === "hand_rolling") {
          // Cigars and hand rolling tobacco are taxed per kg
          const weightInKg = quantity / 1000;
          taxAmount = weightInKg * selectedRate.rate;
          description = `${quantity} grams of ${productType === "cigars" ? "cigars" : "hand rolling tobacco"}`;
        }
        break;

      case "fuel":
        // Fuel is taxed per liter/gallon
        if (region === "us") {
          // Convert liters to gallons for US
          const gallons = quantity * 0.264172;
          taxAmount = gallons * selectedRate.rate;
          description = `${quantity} liters (${gallons.toFixed(2)} gallons) of ${productType}`;
        } else {
          taxAmount = quantity * selectedRate.rate;
          description = `${quantity} liters of ${productType}`;
        }
        break;

      case "betting":
        // Betting is taxed as percentage of profits/wager
        taxAmount = retailPrice * (selectedRate.rate / 100);
        description = `${formatCurrency(retailPrice, region)} in ${productType} betting profits`;
        break;
    }

    // Build results
    const results: TaxResult[] = [
      {
        label: "Product",
        value: 0,
        description: description,
      },
      {
        label: "Duty Rate",
        value: 0,
        description: `${selectedRate.rate} ${selectedRate.unit}`,
      },
      {
        label: "Excise Duty",
        value: taxAmount,
        isTotal: true,
      },
    ];

    setTaxResults(results);
  };

  // Update product type when category changes
  useEffect(() => {
    const types = getProductTypes();
    if (types.length > 0 && !types.includes(productType)) {
      setProductType(types[0]);
    }
  }, [productCategory, region, productType]);

  // Calculate tax when inputs change
  useEffect(() => {
    calculateTax();
  }, [productCategory, productType, quantity, retailPrice, alcoholStrength, region]);

  return (
    <BaseTaxCalculator
      region={region}
      title="Excise Duty Calculator"
      description={`Calculate excise duties for ${region === "uk" ? "UK" : region === "eu" ? "EU" : "US"} goods.`}
      taxResults={taxResults}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Category</label>
          <div className="mt-2">
            <Select
              value={productCategory}
              onValueChange={(value) => setProductCategory(value as ExciseProduct)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select product category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alcohol">Alcoholic Beverages</SelectItem>
                <SelectItem value="tobacco">Tobacco Products</SelectItem>
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="betting">Betting & Gaming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Product Type</label>
          <div className="mt-2">
            <Select
              value={productType}
              onValueChange={setProductType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {getProductTypes().map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(productCategory === "alcohol" && (productType === "beer" || productType === "spirits")) && (
          <TaxInput
            id="alcohol-strength"
            label="Alcohol Strength (% ABV)"
            value={alcoholStrength}
            onChange={(value) => setAlcoholStrength(Number(value) || 0)}
            min={0}
            max={100}
            step="0.1"
            placeholder="Enter alcohol strength"
            suffix="%"
          />
        )}

        {productCategory === "alcohol" && (
          <TaxInput
            id="alcohol-quantity"
            label="Quantity"
            value={quantity}
            onChange={(value) => setQuantity(Number(value) || 0)}
            min={0}
            placeholder="Enter quantity"
            suffix="liters"
          />
        )}

        {productCategory === "tobacco" && (
          <TaxInput
            id="tobacco-quantity"
            label={productType === "cigarettes" ? "Number of Cigarettes" : "Weight"}
            value={quantity}
            onChange={(value) => setQuantity(Number(value) || 0)}
            min={0}
            placeholder="Enter quantity"
            suffix={productType === "cigarettes" ? "cigarettes" : "grams"}
          />
        )}

        {productCategory === "fuel" && (
          <TaxInput
            id="fuel-quantity"
            label="Quantity"
            value={quantity}
            onChange={(value) => setQuantity(Number(value) || 0)}
            min={0}
            placeholder="Enter quantity"
            suffix="liters"
          />
        )}

        {(productCategory === "tobacco" && productType === "cigarettes") || (productCategory === "betting") ? (
          <TaxInput
            id="retail-price"
            label={productCategory === "betting" ? "Profits/Wager" : "Retail Price"}
            value={retailPrice}
            onChange={(value) => setRetailPrice(Number(value) || 0)}
            min={0}
            placeholder="Enter amount"
            prefix={region === "uk" ? "£" : region === "eu" ? "€" : "$"}
          />
        ) : null}
      </div>
    </BaseTaxCalculator>
  );
}
