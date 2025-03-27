"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";

export default function AdSenseExample() {
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Sample function to simulate calculation
  const handleCalculate = () => {
    setCalculationComplete(true);
    setShowResults(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="w-full lg:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Tax Calculator Example with AdSense</h1>

          {/* Top content break ad */}
          <AdBanner
            adSlot="1234567890"
            placement="content"
            testMode={true}
          />

          {/* Calculator inputs */}
          <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-1">Annual Income</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="£50,000"
                />
              </div>

              <div>
                <label className="block mb-1">Tax Year</label>
                <select className="w-full p-2 border rounded">
                  <option>2025/26</option>
                  <option>2024/25</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md"
            >
              Calculate
            </button>
          </div>

          {/* Results section with ad placement */}
          {showResults && (
            <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Tax Results</h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span>Gross Income:</span>
                  <span className="font-medium">£50,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Personal Allowance:</span>
                  <span className="font-medium">£12,570</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Taxable Income:</span>
                  <span className="font-medium">£37,430</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Basic Rate Tax (20%):</span>
                  <span className="font-medium">£7,486</span>
                </div>
                <div className="flex justify-between py-2 font-semibold">
                  <span>Total Tax Due:</span>
                  <span>£7,486</span>
                </div>
              </div>

              {/* High-CTR ad placement directly under results */}
              <AdBanner
                adSlot="2345678901"
                placement="results"
                testMode={true}
              />

              <div className="mt-4">
                <button className="bg-secondary px-4 py-2 rounded text-sm">
                  Save Results
                </button>
                <button className="ml-2 bg-secondary/20 px-4 py-2 rounded text-sm">
                  Print
                </button>
              </div>
            </div>
          )}

          {/* Detailed explanation content */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Understanding Income Tax</h2>
            <p className="mb-4">
              Income tax is calculated based on several tax bands with different rates. Your income is
              taxed progressively across these bands after deducting your tax-free Personal Allowance.
            </p>

            {/* In-content ad - optimal placement after 2nd paragraph */}
            <p className="mb-4">
              For the 2025/26 tax year, the Personal Allowance is £12,570. This means you don't pay any
              tax on income up to this amount. Income above your Personal Allowance is then taxed at
              increasingly higher rates as it falls into different bands.
            </p>

            {/* Native in-content ad placement */}
            <AdBanner
              adSlot="3456789012"
              placement="content"
              adFormat="rectangle"
              testMode={true}
            />

            <p className="mt-4">
              The Basic Rate band covers income from £12,571 to £50,270 and is taxed at 20%. If your income
              exceeds this, it enters the Higher Rate band (40%) up to £150,000, after which the Additional
              Rate (45%) applies.
            </p>
          </div>

          {/* Footer ad */}
          <AdBanner
            adSlot="4567890123"
            placement="footer"
            testMode={true}
          />
        </div>

        {/* Sidebar with ad */}
        <div className="w-full lg:w-1/3">
          {/* Sticky sidebar ad */}
          <AdBanner
            adSlot="5678901234"
            placement="sidebar"
            testMode={true}
          />

          {/* Related articles sidebar */}
          <div className="bg-card p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-3">Related Calculators</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary hover:underline">Capital Gains Tax Calculator</a></li>
              <li><a href="#" className="text-primary hover:underline">VAT Calculator</a></li>
              <li><a href="#" className="text-primary hover:underline">Inheritance Tax Calculator</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
