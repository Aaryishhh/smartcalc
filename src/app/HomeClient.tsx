"use client";

import TaxCalculator from "@/components/TaxCalculator";

export function HomeClient() {
  return (
    <main className="tax-layout">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="tax-title">Global Tax Calculator 2025</h1>
        <p className="tax-subtitle">
          Free and accurate tax calculators for income tax, VAT, capital gains, inheritance tax,
          stamp duty, and more. Updated for 2025 tax rates.
        </p>

        <TaxCalculator />
      </div>
    </main>
  );
}
