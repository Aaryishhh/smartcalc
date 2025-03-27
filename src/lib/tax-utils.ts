// Region types
export type Region = "uk" | "eu" | "us";

// Tax data interfaces
export interface TaxBracket {
  min: number;
  max: number | null; // null represents no upper limit
  rate: number; // percentage
  additionalRate?: number; // for special cases
  name?: string; // for display purposes
}

export interface TaxAllowance {
  name: string;
  amount: number;
  description?: string;
  conditions?: string;
}

// UK Income Tax Brackets (2024-2025)
export const ukIncomeTaxBrackets: TaxBracket[] = [
  { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
  { min: 12571, max: 50270, rate: 20, name: "Basic Rate" },
  { min: 50271, max: 125140, rate: 40, name: "Higher Rate" },
  { min: 125141, max: null, rate: 45, name: "Additional Rate" },
];

// UK Capital Gains Tax rates (2024-2025)
export const ukCapitalGainsTaxBrackets: TaxBracket[] = [
  { min: 0, max: 6000, rate: 0, name: "Annual Exemption" },
  { min: 6001, max: null, rate: 10, additionalRate: 20, name: "Basic/Higher Rate" }, // 10% for basic rate taxpayers, 20% for higher/additional rate
  // 18%/28% for residential property
];

// UK National Insurance Contributions (2024-2025)
export const ukNICBrackets: TaxBracket[] = [
  { min: 0, max: 12570, rate: 0, name: "Primary Threshold" },
  { min: 12571, max: 50270, rate: 12, name: "Main Rate" },
  { min: 50271, max: null, rate: 2, name: "Higher Rate" },
];

// UK Inheritance Tax (2024-2025)
export const ukInheritanceTaxBrackets: TaxBracket[] = [
  { min: 0, max: 325000, rate: 0, name: "Nil Rate Band" },
  { min: 325001, max: null, rate: 40, name: "Chargeable Rate" },
];

// UK VAT rates (2024-2025)
export const ukVATRates = {
  standard: 20,
  reduced: 5,
  zero: 0,
};

// EU simplified VAT rates (general ranges across EU countries)
export const euVATRates = {
  standardMin: 15,
  standardMax: 27,
  reducedMin: 5,
  reducedMax: 18,
  // Specific EU country VAT rates
  germany: 19,
  france: 20,
  spain: 21,
  italy: 22,
  netherlands: 21,
  belgium: 21,
  sweden: 25
};

// EU Income Tax Brackets for major countries - simplified
export interface EUCountryTaxBrackets {
  [key: string]: TaxBracket[];
}

export const euIncomeTaxBrackets: EUCountryTaxBrackets = {
  germany: [
    { min: 0, max: 10908, rate: 0, name: "Tax Free" },
    { min: 10909, max: 62809, rate: 14, name: "First Bracket" },
    { min: 62810, max: 277825, rate: 42, name: "Second Bracket" },
    { min: 277826, max: null, rate: 45, name: "Top Bracket" }
  ],
  france: [
    { min: 0, max: 10777, rate: 0, name: "Tax Free" },
    { min: 10778, max: 27478, rate: 11, name: "First Bracket" },
    { min: 27479, max: 78570, rate: 30, name: "Second Bracket" },
    { min: 78571, max: 168994, rate: 41, name: "Third Bracket" },
    { min: 168995, max: null, rate: 45, name: "Top Bracket" }
  ],
  spain: [
    { min: 0, max: 12450, rate: 19, name: "First Bracket" },
    { min: 12451, max: 20200, rate: 24, name: "Second Bracket" },
    { min: 20201, max: 35200, rate: 30, name: "Third Bracket" },
    { min: 35201, max: 60000, rate: 37, name: "Fourth Bracket" },
    { min: 60001, max: null, rate: 45, name: "Top Bracket" }
  ],
  italy: [
    { min: 0, max: 15000, rate: 23, name: "First Bracket" },
    { min: 15001, max: 28000, rate: 25, name: "Second Bracket" },
    { min: 28001, max: 50000, rate: 35, name: "Third Bracket" },
    { min: 50001, max: null, rate: 43, name: "Top Bracket" }
  ],
  netherlands: [
    { min: 0, max: 73031, rate: 36.93, name: "First Bracket" },
    { min: 73032, max: null, rate: 49.50, name: "Second Bracket" }
  ],
  belgium: [
    { min: 0, max: 15200, rate: 25, name: "First Bracket" },
    { min: 15201, max: 26830, rate: 40, name: "Second Bracket" },
    { min: 26831, max: 46440, rate: 45, name: "Third Bracket" },
    { min: 46441, max: null, rate: 50, name: "Top Bracket" }
  ],
  sweden: [
    { min: 0, max: 46600, rate: 0, name: "Municipal Tax Only" }, // Only municipal tax applies (30-32%)
    { min: 46601, max: 67900, rate: 20, name: "State Tax" }, // 20% state tax
    { min: 67901, max: null, rate: 25, name: "High Income" } // 25% state tax
  ]
};

// US Federal Income Tax Brackets (2024) - Simplified for single filers
export const usFederalIncomeTaxBrackets: TaxBracket[] = [
  { min: 0, max: 11600, rate: 10, name: "10% Bracket" },
  { min: 11601, max: 47150, rate: 12, name: "12% Bracket" },
  { min: 47151, max: 100525, rate: 22, name: "22% Bracket" },
  { min: 100526, max: 191950, rate: 24, name: "24% Bracket" },
  { min: 191951, max: 243725, rate: 32, name: "32% Bracket" },
  { min: 243726, max: 609350, rate: 35, name: "35% Bracket" },
  { min: 609351, max: null, rate: 37, name: "37% Bracket" },
];

// UK Dividend Tax Rates (2024-2025)
export const ukDividendTaxBrackets: TaxBracket[] = [
  { min: 0, max: 500, rate: 0, name: "Dividend Allowance" },
  { min: 501, max: 37700, rate: 8.75, name: "Basic Rate" },
  { min: 37701, max: 125140, rate: 33.75, name: "Higher Rate" },
  { min: 125141, max: null, rate: 39.35, name: "Additional Rate" }
];

// US Dividend Tax Rates (2024-2025) - Qualified dividends
export const usDividendTaxBrackets: Record<string, TaxBracket[]> = {
  // Single filers
  single: [
    { min: 0, max: 47025, rate: 0, name: "0% Rate" },
    { min: 47026, max: 518900, rate: 15, name: "15% Rate" },
    { min: 518901, max: null, rate: 20, name: "20% Rate" }
  ],
  // Married filing jointly
  married: [
    { min: 0, max: 94050, rate: 0, name: "0% Rate" },
    { min: 94051, max: 583750, rate: 15, name: "15% Rate" },
    { min: 583751, max: null, rate: 20, name: "20% Rate" }
  ],
  // Head of household
  head: [
    { min: 0, max: 63000, rate: 0, name: "0% Rate" },
    { min: 63001, max: 551350, rate: 15, name: "15% Rate" },
    { min: 551351, max: null, rate: 20, name: "20% Rate" }
  ],
  // Married filing separately
  separate: [
    { min: 0, max: 47025, rate: 0, name: "0% Rate" },
    { min: 47026, max: 291850, rate: 15, name: "15% Rate" },
    { min: 291851, max: null, rate: 20, name: "20% Rate" }
  ]
};

// EU Dividend Tax Rates (2024) - Flat rates for simplicity
export const euDividendTaxRates: Record<string, number> = {
  germany: 26.375, // 25% + 5.5% solidarity surcharge
  france: 30,      // Flat rate ("Prélèvement Forfaitaire Unique")
  spain: 26,       // Progressive rates from 19% to 26%
  italy: 26,       // Flat rate
  netherlands: 31, // Based on deemed return, approximated
  belgium: 30,     // Flat rate
  sweden: 30,      // Flat rate
};

// Utility functions
export const formatCurrency = (amount: number, region: Region): string => {
  const currencySymbol = {
    uk: "£",
    eu: "€",
    us: "$",
  }[region];

  return `${currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateTaxWithBrackets = (amount: number, brackets: TaxBracket[]): number => {
  let tax = 0;
  let remaining = amount;

  for (const bracket of brackets) {
    const min = bracket.min;
    const max = bracket.max === null ? Infinity : bracket.max;
    const rate = bracket.rate / 100;

    if (remaining <= 0) break;

    const taxableAmount = Math.min(max - min + 1, remaining);
    tax += taxableAmount * rate;
    remaining -= taxableAmount;
  }

  return tax;
};

// Helper to get tax rate at a specific income level
export const getTaxRateAtIncome = (income: number, brackets: TaxBracket[]): number => {
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income >= brackets[i].min) {
      return brackets[i].rate;
    }
  }
  return 0;
};

// Helper to format percentage
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};

// Vehicle tax rates and structures

// UK Vehicle Tax (VED) Rates 2024-2025
export interface VehicleTaxRate {
  co2From?: number;
  co2To?: number | null;  // Allow null for unlimited upper bounds
  firstYearRate?: number;
  standardRate?: number;
  flatRate?: number;
  description?: string;
}

export interface ElectricVehicleRates {
  firstYearRate: number;
  standardRate: number;
}

export interface VehicleTaxRates {
  petrol: VehicleTaxRate[];
  diesel: VehicleTaxRate[];
  alternative: VehicleTaxRate[];
  electric: ElectricVehicleRates;
}

// UK Vehicle Tax rates
export const ukVehicleTaxRates: VehicleTaxRates = {
  petrol: [
    { co2From: 0, co2To: 50, firstYearRate: 10, standardRate: 195 },
    { co2From: 51, co2To: 75, firstYearRate: 30, standardRate: 195 },
    { co2From: 76, co2To: 90, firstYearRate: 135, standardRate: 195 },
    { co2From: 91, co2To: 100, firstYearRate: 165, standardRate: 195 },
    { co2From: 101, co2To: 110, firstYearRate: 185, standardRate: 195 },
    { co2From: 111, co2To: 130, firstYearRate: 210, standardRate: 195 },
    { co2From: 131, co2To: 150, firstYearRate: 255, standardRate: 195 },
    { co2From: 151, co2To: 170, firstYearRate: 645, standardRate: 195 },
    { co2From: 171, co2To: 190, firstYearRate: 990, standardRate: 195 },
    { co2From: 191, co2To: 225, firstYearRate: 1420, standardRate: 195 },
    { co2From: 226, co2To: 255, firstYearRate: 2015, standardRate: 195 },
    { co2From: 256, co2To: null, firstYearRate: 2365, standardRate: 195 }
  ],
  diesel: [
    { co2From: 0, co2To: 50, firstYearRate: 10, standardRate: 195 },
    { co2From: 51, co2To: 75, firstYearRate: 30, standardRate: 195 },
    { co2From: 76, co2To: 90, firstYearRate: 165, standardRate: 195 },
    { co2From: 91, co2To: 100, firstYearRate: 195, standardRate: 195 },
    { co2From: 101, co2To: 110, firstYearRate: 215, standardRate: 195 },
    { co2From: 111, co2To: 130, firstYearRate: 240, standardRate: 195 },
    { co2From: 131, co2To: 150, firstYearRate: 285, standardRate: 195 },
    { co2From: 151, co2To: 170, firstYearRate: 675, standardRate: 195 },
    { co2From: 171, co2To: 190, firstYearRate: 1020, standardRate: 195 },
    { co2From: 191, co2To: 225, firstYearRate: 1450, standardRate: 195 },
    { co2From: 226, co2To: 255, firstYearRate: 2045, standardRate: 195 },
    { co2From: 256, co2To: null, firstYearRate: 2395, standardRate: 195 }
  ],
  alternative: [ // Hybrid vehicles
    { co2From: 0, co2To: 50, firstYearRate: 10, standardRate: 195 },
    { co2From: 51, co2To: 75, firstYearRate: 30, standardRate: 195 },
    { co2From: 76, co2To: 90, firstYearRate: 135, standardRate: 195 },
    { co2From: 91, co2To: 100, firstYearRate: 165, standardRate: 195 },
    { co2From: 101, co2To: 110, firstYearRate: 185, standardRate: 195 },
    { co2From: 111, co2To: 130, firstYearRate: 210, standardRate: 195 },
    { co2From: 131, co2To: 150, firstYearRate: 255, standardRate: 195 },
    { co2From: 151, co2To: 170, firstYearRate: 645, standardRate: 195 },
    { co2From: 171, co2To: 190, firstYearRate: 990, standardRate: 195 },
    { co2From: 191, co2To: 225, firstYearRate: 1420, standardRate: 195 },
    { co2From: 226, co2To: 255, firstYearRate: 2015, standardRate: 195 },
    { co2From: 256, co2To: null, firstYearRate: 2365, standardRate: 195 }
  ],
  electric: {
    firstYearRate: 0,
    standardRate: 195
  }
};

// US Vehicle Tax rates (simplified, based on average state registration + sales tax)
// The rates vary widely by state, so we're using approximate values
export const usVehicleTaxRates: Record<string, number> = {
  california: 7.25, // Sales tax percentage
  new_york: 8.00,
  texas: 6.25,
  florida: 6.00,
  washington: 6.50,
  colorado: 2.90,
  illinois: 7.25
};

// Annual registration fees (simplified)
export const usVehicleRegistrationFees: Record<string, number> = {
  california: 60,  // Base fee, not including weight/value fees
  new_york: 26,    // Base fee for passenger vehicles
  texas: 51.75,    // Base registration
  florida: 27.60,  // Base registration
  washington: 30,  // Base fee
  colorado: 60.36, // Base registration
  illinois: 151    // Annual registration
};

// EU Vehicle Tax rates (annual vehicle tax, simplified)
export const euVehicleTaxRates: Record<string, any> = {
  germany: {
    based_on: "CO2 and engine displacement",
    base_rate: 2, // €2 per 100cc for petrol, €9.50 per 100cc for diesel
    co2_rate: 2,  // €2 per g/km above 95g/km
    electric: 0   // Zero tax for electric vehicles
  },
  france: {
    based_on: "CO2 emissions",
    brackets: [
      { co2From: 0, co2To: 130, rate: 0 },
      { co2From: 131, co2To: 150, rate: 50 },
      { co2From: 151, co2To: 170, rate: 275 },
      { co2From: 171, co2To: 190, rate: 550 },
      { co2From: 191, co2To: 230, rate: 1400 },
      { co2From: 231, co2To: null, rate: 2000 }
    ]
  },
  spain: {
    based_on: "horsepower",
    brackets: [
      { from: 0, to: 8, rate: 25.24 },
      { from: 8.01, to: 11.99, rate: 68.16 },
      { from: 12, to: 15.99, rate: 143.88 },
      { from: 16, to: 19.99, rate: 179.22 },
      { from: 20, to: null, rate: 224.00 }
    ]
  },
  italy: {
    based_on: "kilowatts and emissions standard",
    rate_per_kw: 2.58, // Base rate per kW
    surcharge: 3.87,   // Additional rate per kW over 100kW
    electric_discount: 0.75 // 75% reduction for electric vehicles
  },
  netherlands: {
    based_on: "weight and fuel type",
    petrol_rate: 25,    // Base rate per quarter
    diesel_rate: 115,   // Base rate per quarter
    weight_rate: 11.25  // Per 100kg
  },
  belgium: {
    based_on: "engine displacement",
    base_rate: 61.50,   // Minimum tax
    rate_per_hp: 25.00  // Additional per fiscal horsepower
  },
  sweden: {
    based_on: "CO2 emissions",
    base_rate: 360,     // Base annual tax
    co2_rate: 22        // Additional per g/km above 95g/km
  }
};

// EU Vehicle Tax rates and structures

// Council/Property Tax Rates

// UK Council Tax Bands and Rates (simplified/averaged for 2024-2025)
export interface CouncilTaxBand {
  band: string;
  valueFrom: number;
  valueTo: number | null;
  rate: number;
  description?: string;
}

export const ukCouncilTaxBands: CouncilTaxBand[] = [
  { band: "A", valueFrom: 0, valueTo: 40000, rate: 1250, description: "Up to £40,000" },
  { band: "B", valueFrom: 40001, valueTo: 52000, rate: 1458, description: "£40,001 to £52,000" },
  { band: "C", valueFrom: 52001, valueTo: 68000, rate: 1667, description: "£52,001 to £68,000" },
  { band: "D", valueFrom: 68001, valueTo: 88000, rate: 1875, description: "£68,001 to £88,000" },
  { band: "E", valueFrom: 88001, valueTo: 120000, rate: 2292, description: "£88,001 to £120,000" },
  { band: "F", valueFrom: 120001, valueTo: 160000, rate: 2708, description: "£120,001 to £160,000" },
  { band: "G", valueFrom: 160001, valueTo: 320000, rate: 3125, description: "£160,001 to £320,000" },
  { band: "H", valueFrom: 320001, valueTo: null, rate: 3750, description: "Over £320,000" }
];

// UK Council areas with different rates (average annual rates)
export const ukCouncilAreas: Record<string, number> = {
  "London": 1.05, // Multiplier for London boroughs
  "Metropolitan": 1.0, // Base rate
  "Shire": 0.95, // Slightly lower than average
  "Scotland": 0.9, // Scottish councils
  "Wales": 0.85, // Welsh councils
  "Northern Ireland": 0.8, // Northern Ireland
};

// US Property Tax Rates (as percentage of property value)
// These are annual rates as a percentage of assessed property value
export const usPropertyTaxRates: Record<string, number> = {
  "california": 0.76,
  "new_york": 1.72,
  "texas": 1.81,
  "florida": 0.89,
  "washington": 0.93,
  "colorado": 0.51,
  "illinois": 2.27,
  "new_jersey": 2.49,
  "hawaii": 0.28,
  "alabama": 0.41,
  "louisiana": 0.55,
  "massachusetts": 1.17
};

// EU Property Tax Rates (as percentage of property value or fixed amount)
// These rates are simplified and may not reflect the exact calculation methods in each country
export interface EUPropertyTaxInfo {
  type: "percentage" | "fixed" | "value_based";
  rate?: number; // For percentage-based taxes
  brackets?: Array<{min: number; max: number | null; rate: number}>; // For value-based taxes
  baseAmount?: number; // For fixed taxes
  description: string;
}

export const euPropertyTaxRates: Record<string, EUPropertyTaxInfo> = {
  "germany": {
    type: "percentage",
    rate: 0.35, // Average Grundsteuer rate
    description: "Property tax (Grundsteuer) based on property value"
  },
  "france": {
    type: "value_based",
    brackets: [
      { min: 0, max: 100000, rate: 800 },
      { min: 100001, max: 250000, rate: 1500 },
      { min: 250001, max: 500000, rate: 2500 },
      { min: 500001, max: 1000000, rate: 4000 },
      { min: 1000001, max: null, rate: 6000 }
    ],
    description: "Taxe foncière based on cadastral rental value"
  },
  "spain": {
    type: "percentage",
    rate: 0.58, // IBI (Impuesto sobre Bienes Inmuebles)
    description: "Municipal property tax (IBI) based on cadastral value"
  },
  "italy": {
    type: "percentage",
    rate: 0.4, // IMU (Imposta Municipale Propria) for primary residences
    description: "Municipal property tax (IMU) for primary residence"
  },
  "netherlands": {
    type: "value_based",
    brackets: [
      { min: 0, max: 50000, rate: 200 },
      { min: 50001, max: 150000, rate: 400 },
      { min: 150001, max: 300000, rate: 800 },
      { min: 300001, max: null, rate: 1200 }
    ],
    description: "OZB (Onroerende Zaak Belasting) based on property value"
  },
  "belgium": {
    type: "percentage",
    rate: 1.25, // Average précompte immobilier
    description: "Property tax (Précompte immobilier) based on indexed cadastral income"
  },
  "sweden": {
    type: "percentage",
    rate: 0.75, // Fastighetsskatt
    description: "Property tax (Fastighetsskatt) as percentage of assessed value"
  }
};

// Sole Trader Income Tax Rates (2024-2025)

// UK Sole Trader Tax Rates are based on income tax plus National Insurance
// For UK, we'll reuse the ukIncomeTaxBrackets for income tax part
// But we'll add self-employed National Insurance rates specifically

// UK Self-Employed National Insurance Rates (Class 2 and 4)
export interface SelfEmployedNI {
  class2Weekly: number;
  class2Threshold: number;
  class4LowerRate: number;
  class4LowerThreshold: number;
  class4UpperRate: number;
  class4UpperThreshold: number;
}

export const ukSelfEmployedNI: SelfEmployedNI = {
  class2Weekly: 3.45,      // £3.45 per week (if profits are over £12,570)
  class2Threshold: 12570,  // Small Profits Threshold
  class4LowerRate: 9,      // 9% on profits between lower and upper threshold
  class4LowerThreshold: 12570,
  class4UpperRate: 2,      // 2% on profits above upper threshold
  class4UpperThreshold: 50270
};

// US Sole Trader / Self-Employed Tax Rates
export interface USSelfEmployedTaxRates {
  incomeTaxBrackets: Record<string, TaxBracket[]>; // Regular income tax (same as for employed)
  selfEmploymentTaxRate: number;                  // Self-employment tax rate (Social Security + Medicare)
  medicareRate: number;                           // Medicare portion
  socialSecurityRate: number;                     // Social Security portion
  socialSecurityWageCap: number;                  // Social Security wage base cap
  selfEmploymentTaxDeduction: number;             // Deduction for self-employment tax (percentage)
}

export const usSelfEmployedTaxRates: USSelfEmployedTaxRates = {
  // Regular income tax brackets (same as for employed individuals)
  incomeTaxBrackets: {
    // Single filers
    single: [
      { min: 0, max: 11600, rate: 10, name: "10% Bracket" },
      { min: 11601, max: 47150, rate: 12, name: "12% Bracket" },
      { min: 47151, max: 100525, rate: 22, name: "22% Bracket" },
      { min: 100526, max: 191950, rate: 24, name: "24% Bracket" },
      { min: 191951, max: 243725, rate: 32, name: "32% Bracket" },
      { min: 243726, max: 609350, rate: 35, name: "35% Bracket" },
      { min: 609351, max: null, rate: 37, name: "37% Bracket" }
    ],
    // Married filing jointly
    married: [
      { min: 0, max: 23200, rate: 10, name: "10% Bracket" },
      { min: 23201, max: 94300, rate: 12, name: "12% Bracket" },
      { min: 94301, max: 201050, rate: 22, name: "22% Bracket" },
      { min: 201051, max: 383900, rate: 24, name: "24% Bracket" },
      { min: 383901, max: 487450, rate: 32, name: "32% Bracket" },
      { min: 487451, max: 731200, rate: 35, name: "35% Bracket" },
      { min: 731201, max: null, rate: 37, name: "37% Bracket" }
    ],
    // Head of household
    head: [
      { min: 0, max: 16550, rate: 10, name: "10% Bracket" },
      { min: 16551, max: 63100, rate: 12, name: "12% Bracket" },
      { min: 63101, max: 100500, rate: 22, name: "22% Bracket" },
      { min: 100501, max: 191950, rate: 24, name: "24% Bracket" },
      { min: 191951, max: 243700, rate: 32, name: "32% Bracket" },
      { min: 243701, max: 609350, rate: 35, name: "35% Bracket" },
      { min: 609351, max: null, rate: 37, name: "37% Bracket" }
    ]
  },
  selfEmploymentTaxRate: 15.3,        // 15.3% total self-employment tax
  medicareRate: 2.9,                  // 2.9% Medicare portion
  socialSecurityRate: 12.4,           // 12.4% Social Security portion
  socialSecurityWageCap: 168600,      // Social Security wage base for 2024
  selfEmploymentTaxDeduction: 50      // Can deduct 50% of self-employment tax
};

// EU Self-Employed Tax Structures
// Simplified - actual structures vary significantly by country
export interface EUSelfEmployedTaxInfo {
  incomeTaxRates: TaxBracket[];         // Progressive income tax rates
  socialSecurityRate: number;           // Social security contribution rate (as %)
  socialSecurityBase?: number;          // Fixed amount or cap on social security
  specialTreatment?: string;            // Any special treatment for self-employed
}

export const euSelfEmployedTaxRates: Record<string, EUSelfEmployedTaxInfo> = {
  "germany": {
    incomeTaxRates: [
      { min: 0, max: 10908, rate: 0, name: "Tax Free Allowance" },
      { min: 10909, max: 62809, rate: 14, name: "First Zone" },
      { min: 62810, max: 277825, rate: 42, name: "Second Zone" },
      { min: 277826, max: null, rate: 45, name: "Top Zone" }
    ],
    socialSecurityRate: 19.325,  // Approximate social security contributions
    specialTreatment: "Self-employed individuals can opt for voluntary state health and pension insurance."
  },
  "france": {
    incomeTaxRates: [
      { min: 0, max: 10777, rate: 0, name: "Tax Free" },
      { min: 10778, max: 27478, rate: 11, name: "First Bracket" },
      { min: 27479, max: 78570, rate: 30, name: "Second Bracket" },
      { min: 78571, max: 168994, rate: 41, name: "Third Bracket" },
      { min: 168995, max: null, rate: 45, name: "Top Bracket" }
    ],
    socialSecurityRate: 45,  // Very high social security contributions for self-employed
    specialTreatment: "There is a special micro-entrepreneur regime for businesses with turnover below certain thresholds."
  },
  "spain": {
    incomeTaxRates: [
      { min: 0, max: 12450, rate: 19, name: "First Bracket" },
      { min: 12451, max: 20200, rate: 24, name: "Second Bracket" },
      { min: 20201, max: 35200, rate: 30, name: "Third Bracket" },
      { min: 35201, max: 60000, rate: 37, name: "Fourth Bracket" },
      { min: 60001, max: null, rate: 45, name: "Top Bracket" }
    ],
    socialSecurityRate: 30.6,  // Flat rate social security contribution
    socialSecurityBase: 3000,  // Minimum contribution base
    specialTreatment: "Newly self-employed can qualify for a flat rate contribution for the first 2 years."
  },
  "italy": {
    incomeTaxRates: [
      { min: 0, max: 15000, rate: 23, name: "First Bracket" },
      { min: 15001, max: 28000, rate: 25, name: "Second Bracket" },
      { min: 28001, max: 50000, rate: 35, name: "Third Bracket" },
      { min: 50001, max: null, rate: 43, name: "Top Bracket" }
    ],
    socialSecurityRate: 24,  // General INPS rate
    specialTreatment: "There is a special flat tax regime (regime forfettario) for small businesses with turnover below €85,000."
  },
  "netherlands": {
    incomeTaxRates: [
      { min: 0, max: 73031, rate: 36.93, name: "First Bracket" },
      { min: 73032, max: null, rate: 49.50, name: "Second Bracket" }
    ],
    socialSecurityRate: 27.65,  // Health and social insurance
    specialTreatment: "Self-employed are entitled to specific deductions, including a standard deduction of €6,246."
  },
  "belgium": {
    incomeTaxRates: [
      { min: 0, max: 15200, rate: 25, name: "First Bracket" },
      { min: 15201, max: 26830, rate: 40, name: "Second Bracket" },
      { min: 26831, max: 46440, rate: 45, name: "Third Bracket" },
      { min: 46441, max: null, rate: 50, name: "Top Bracket" }
    ],
    socialSecurityRate: 20.5,  // Social security contribution
    specialTreatment: "Self-employed contributions are based on net professional income."
  },
  "sweden": {
    incomeTaxRates: [
      { min: 0, max: 46600, rate: 32, name: "Only Municipal Tax" }, // Typical municipal tax rate
      { min: 46601, max: 67900, rate: 52, name: "State Tax Level 1" }, // Municipal + 20% state tax
      { min: 67901, max: null, rate: 57, name: "State Tax Level 2" } // Municipal + 25% state tax
    ],
    socialSecurityRate: 28.97,  // Social insurance
    specialTreatment: "Social insurance contributions are fully deductible from income."
  }
};

// Insurance Premium Tax Rates (2024-2025)

// UK Insurance Premium Tax
export interface UKInsurancePremiumTaxRates {
  standardRate: number;
  higherRate: number;
  exemptions: string[];
}

export const ukInsurancePremiumTax: UKInsurancePremiumTaxRates = {
  standardRate: 12, // Standard rate for most general insurance
  higherRate: 20,   // Higher rate for travel insurance, some vehicle insurance
  exemptions: [
    "Life insurance",
    "Permanent health insurance",
    "Commercial ships and aircraft",
    "International railway rolling stock",
    "Goods in international transit",
    "Export credit insurance",
    "Reinsurance",
    "Insurance for risks located outside UK"
  ]
};

// US Insurance Premium Tax (varies by state)
export const usInsurancePremiumTax: Record<string, number> = {
  "california": 2.35,
  "new_york": 1.75,
  "texas": 1.6,
  "florida": 1.75,
  "washington": 2.0,
  "colorado": 2.0,
  "illinois": 0.5,
  "new_jersey": 2.1,
  "hawaii": 4.265, // Highest
  "oregon": 0,     // Exempt
  "wyoming": 0.75, // Lowest except for exempt states
  "nevada": 3.5
};

// EU Insurance Premium Tax (varies by country)
export interface EUInsurancePremiumTaxInfo {
  standardRate: number;
  specialRates?: Record<string, number>; // Special rates for specific types of insurance
  exemptions?: string[];                 // Types of insurance exempt from IPT
}

export const euInsurancePremiumTax: Record<string, EUInsurancePremiumTaxInfo> = {
  "germany": {
    standardRate: 19, // Equivalent to VAT rate
    specialRates: {
      "fire": 22,
      "residential": 19
    }
  },
  "france": {
    standardRate: 9,
    specialRates: {
      "auto": 18,
      "health": 3.5,
      "marine": 0
    }
  },
  "spain": {
    standardRate: 6,
    specialRates: {
      "vehicles": 8
    }
  },
  "italy": {
    standardRate: 21.25,
    specialRates: {
      "health": 2.5,
      "liability": 12.5
    }
  },
  "netherlands": {
    standardRate: 21, // Same as VAT rate
    exemptions: ["Life insurance", "Health insurance"]
  },
  "belgium": {
    standardRate: 9.25
  },
  "sweden": {
    standardRate: 27 // No specific IPT, the equivalent of standard VAT
  }
};

// Business Sale Capital Gains Tax Rates (2024-2025)

// UK Business Sale Capital Gains Tax
export interface UKBusinessSaleCGTRates {
  basicRate: number;          // Rate for basic rate taxpayers
  higherRate: number;         // Rate for higher/additional rate taxpayers
  baseAllowance: number;      // Annual exempt amount
  businessAssetDisposalRate: number; // Business Asset Disposal Relief (formerly Entrepreneurs' Relief)
  businessAssetDisposalLifetimelimit: number; // Lifetime limit for BADR
}

export const ukBusinessSaleCGT: UKBusinessSaleCGTRates = {
  basicRate: 10,
  higherRate: 20,
  baseAllowance: 6000,
  businessAssetDisposalRate: 10, // Reduced rate of 10% if qualify for Business Asset Disposal Relief
  businessAssetDisposalLifetimelimit: 1000000 // £1,000,000 lifetime limit
};

// US Business Sale Capital Gains
export interface USBusinessSaleCGTRates {
  shortTermRate: number; // Short term capital gains (< 1 year) taxed as ordinary income
  longTermRates: Record<string, number>; // Long term capital gains by income bracket
  qualifiedBusinessStockExclusion: number; // Section 1202 qualified small business stock exclusion
  section1031Exchange: boolean; // Like-kind exchanges
}

export const usBusinessSaleCGT: USBusinessSaleCGTRates = {
  shortTermRate: 37, // Maximum rate (taxed as ordinary income)
  longTermRates: {
    "low": 0,       // 0% for incomes below $44,625 (single)
    "medium": 15,   // 15% for incomes $44,625-$492,300 (single)
    "high": 20      // 20% for incomes above $492,300 (single)
  },
  qualifiedBusinessStockExclusion: 100, // 100% exclusion for qualified small business stock
  section1031Exchange: true // Tax-deferred like-kind exchanges available
};

// EU Business Sale Capital Gains (simplified)
export interface EUBusinessSaleCGTInfo {
  basicRate: number;       // Basic capital gains rate
  relief?: {               // Any special relief programs
    type: string;
    rate: number;
    requirements: string;
  }[];
  specialProvisions?: string;
}

export const euBusinessSaleCGT: Record<string, EUBusinessSaleCGTInfo> = {
  "germany": {
    basicRate: 26.375, // 25% plus solidarity surcharge
    relief: [
      {
        type: "Business assets",
        rate: 0,
        requirements: "40% exemption for business assets, plus tax-free allowance of €9,060"
      }
    ]
  },
  "france": {
    basicRate: 30, // Flat tax (prélèvement forfaitaire unique or PFU)
    relief: [
      {
        type: "Retirement relief",
        rate: 0,
        requirements: "Full exemption for small business owners retiring and selling after holding for 5+ years"
      }
    ]
  },
  "spain": {
    basicRate: 26, // Top rate from the scale
    relief: [
      {
        type: "Retirement relief",
        rate: 0,
        requirements: "Exemption for business owners over 65 who sell their business"
      }
    ]
  },
  "italy": {
    basicRate: 26,
    specialProvisions: "Participation exemption: 95% of capital gains exempt if specific requirements are met."
  },
  "netherlands": {
    basicRate: 26.9, // Combined rate for substantial holdings (>5%)
    specialProvisions: "Business transfer facility allows for deferral of tax if certain conditions are met."
  },
  "belgium": {
    basicRate: 0, // Capital gains on shares generally tax-exempt
    specialProvisions: "Capital gains on shares are generally exempt if held for more than one year."
  },
  "sweden": {
    basicRate: 30,
    relief: [
      {
        type: "Small business shares",
        rate: 25, // Reduced rate
        requirements: "For qualifying closely-held companies (fåmansföretag)"
      }
    ]
  }
};

// ... existing code ...
