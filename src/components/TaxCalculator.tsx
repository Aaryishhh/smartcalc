
"use client";

import { useState } from "react";
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Region } from "@/lib/tax-utils";
import Link from "next/link";
import IncomeTaxCalculator from "./tax-calculators/IncomeTaxCalculator";
import CapitalGainsTaxCalculator from "./tax-calculators/CapitalGainsTaxCalculator";
import NICCalculator from "./tax-calculators/NICCalculator";
import InheritanceTaxCalculator from "./tax-calculators/InheritanceTaxCalculator";
import VATCalculator from "./tax-calculators/VATCalculator";
import ExciseDutyCalculator from "./tax-calculators/ExciseDutyCalculator";
import StampDutyCalculator from "./tax-calculators/StampDutyCalculator";
import PrintButton from "./PrintButton";
import TaxComparison from "./TaxComparison";
import DividendTaxCalculator from "./tax-calculators/DividendTaxCalculator";
import VehicleTaxCalculator from "./tax-calculators/VehicleTaxCalculator";
import CouncilTaxCalculator from "./tax-calculators/CouncilTaxCalculator";
import InsurancePremiumTaxCalculator from "./tax-calculators/InsurancePremiumTaxCalculator";
import BusinessSaleCGTCalculator from "./tax-calculators/BusinessSaleCGTCalculator";
import SoleTraderIncomeTaxCalculator from "./tax-calculators/SoleTraderIncomeTaxCalculator";
import { trackRegionSelection } from "@/lib/gtag";

// Icons for the regions
const UkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" fill="#012169"/>
    <path d="M0 0L50 50M50 0L0 50" stroke="white" strokeWidth="6"/>
    <path d="M25 0V50M0 25H50" stroke="white" strokeWidth="10"/>
    <path d="M25 0V50M0 25H50" stroke="#C8102E" strokeWidth="6"/>
    <path d="M0 0L50 50M50 0L0 50" stroke="#C8102E" strokeWidth="4"/>
  </svg>
);

const EuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" fill="#039"/>
    <path d="M25 8L27 14H33L28 18L30 24L25 20L20 24L22 18L17 14H23L25 8Z" fill="#FC0"/>
    <path d="M25 11L26 14H30L27 16L28 20L25 17L22 20L23 16L20 14H24L25 11Z" fill="#FC0"/>
    <path d="M14 25L17 27V33L21 28L27 30L23 25L27 20L21 22L17 17V23L14 25Z" fill="#FC0"/>
    <path d="M36 25L33 27V33L29 28L23 30L27 25L23 20L29 22L33 17V23L36 25Z" fill="#FC0"/>
    <path d="M25 42L23 36H17L22 32L20 26L25 30L30 26L28 32L33 36H27L25 42Z" fill="#FC0"/>
  </svg>
);

const UsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" fill="#fff"/>
    <rect y="0" width="50" height="3.85" fill="#B22234"/>
    <rect y="7.69" width="50" height="3.85" fill="#B22234"/>
    <rect y="15.38" width="50" height="3.85" fill="#B22234"/>
    <rect y="23.08" width="50" height="3.85" fill="#B22234"/>
    <rect y="30.77" width="50" height="3.85" fill="#B22234"/>
    <rect y="38.46" width="50" height="3.85" fill="#B22234"/>
    <rect y="46.15" width="50" height="3.85" fill="#B22234"/>
    <rect width="20" height="26.92" fill="#3C3B6E"/>
    <circle cx="3.33" cy="3.37" r="1.3" fill="white"/>
    <circle cx="10" cy="3.37" r="1.3" fill="white"/>
    <circle cx="16.67" cy="3.37" r="1.3" fill="white"/>
    <circle cx="3.33" cy="10.1" r="1.3" fill="white"/>
    <circle cx="10" cy="10.1" r="1.3" fill="white"/>
    <circle cx="16.67" cy="10.1" r="1.3" fill="white"/>
    <circle cx="3.33" cy="16.83" r="1.3" fill="white"/>
    <circle cx="10" cy="16.83" r="1.3" fill="white"/>
    <circle cx="16.67" cy="16.83" r="1.3" fill="white"/>
    <circle cx="3.33" cy="23.56" r="1.3" fill="white"/>
    <circle cx="10" cy="23.56" r="1.3" fill="white"/>
    <circle cx="16.67" cy="23.56" r="1.3" fill="white"/>
  </svg>
);

// VSmart logo icon
const VSmartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1">
    <path d="M3 6.2L8 19.5H10.5L15.5 6.2H13L9 16.3L5 6.2H3Z" fill="currentColor" />
    <path d="M16.5 6.2L17.75 9.5H21L18.5 12.1L19.7 15.5L16.5 13.4L13.3 15.5L14.5 12.1L12 9.5H15.25L16.5 6.2Z" fill="currentColor" />
  </svg>
);

// Email icon for contact link
const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-1"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// Type definitions for tax categories and tabs
interface CategoryType {
  id: string;
  label: string;
  className: string;
  icon: string;
}

interface TabType {
  id: string;
  label: string;
  component: React.ReactNode; // Changed from JSX.Element
}


interface SubTabType {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface SubTabsType {
  personal: SubTabType[];
  indirect: SubTabType[];
  property: SubTabType[];
  business: SubTabType[];
  other: SubTabType[];
}

const InsuranceTaxCalculator = ({ region }: { region: Region }) => (
  <InsurancePremiumTaxCalculator region={region} />
);

const BusinessSaleTaxCalculator = ({ region }: { region: Region }) => (
  <BusinessSaleCGTCalculator region={region} />
);

const SoleTraderTaxCalculator = ({ region }: { region: Region }) => (
  <SoleTraderIncomeTaxCalculator region={region} />
);

export default function TaxCalculator() {
  const [region, setRegion] = useState<Region>("uk");
  const [showComparison, setShowComparison] = useState(false);
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);

  const mainCategories: CategoryType[] = [
    { id: "personal", label: "Personal Direct Taxes", className: "tax-card-personal", icon: "💼" },
    { id: "indirect", label: "Indirect Taxes & Duties", className: "tax-card-indirect", icon: "🛒" },
    { id: "property", label: "Stamp Duty & Property Taxes", className: "tax-card-property", icon: "🏠" },
    { id: "business", label: "Business Taxes", className: "tax-card-business", icon: "🏢" },
    { id: "other", label: "Other Taxes", className: "tax-card-other", icon: "📝" },
  ];

  // Sub-tabs mapping
  const subTabs: SubTabsType = {
    personal: [
      { id: "income", label: "Income Tax", component: <IncomeTaxCalculator region={region} /> },
      { id: "capital-gains", label: "Capital Gains", component: <CapitalGainsTaxCalculator region={region} /> },
      { id: "nic", label: "NICs", component: <NICCalculator region={region} /> },
      { id: "inheritance", label: "Inheritance Tax", component: <InheritanceTaxCalculator region={region} /> },
    ],
    indirect: [
      { id: "vat", label: "VAT", component: <VATCalculator region={region} /> },
      { id: "insurance", label: "Insurance Premium Tax", component: <InsurancePremiumTaxCalculator region={region} /> },
      { id: "excise", label: "Excise Duties", component: <ExciseDutyCalculator region={region} /> },
    ],
    property: [
      { id: "stamp-duty", label: "Stamp Duty & Land Taxes", component: <StampDutyCalculator region={region} /> },
    ],
    business: [
      { id: "sole-trader", label: "Sole Trader Income Tax", component: <SoleTraderIncomeTaxCalculator region={region} /> },
      { id: "dividends", label: "Dividend Taxes", component: <DividendTaxCalculator region={region} /> },
      { id: "business-sale", label: "Business Sale CGT", component: <BusinessSaleCGTCalculator region={region} /> },
    ],
    other: [
      { id: "council", label: "Council Tax", component: <CouncilTaxCalculator region={region} /> },
      { id: "vehicle", label: "Vehicle Tax", component: <VehicleTaxCalculator region={region} /> },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState<keyof SubTabsType>("personal");
  const [selectedSubTab, setSelectedSubTab] = useState("income");

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    // Track region selection in Google Analytics
    trackRegionSelection(newRegion);
  };

  const headerClass = (categoryId: string) => {
    const mapping: Record<string, string> = {
      personal: "tax-category-header-personal",
      indirect: "tax-category-header-indirect",
      property: "tax-category-header-property",
      business: "tax-category-header-business",
      other: "tax-category-header-other",
    };
    return `tax-category-header ${mapping[categoryId] || ""}`;
  };

  const getStructuredDataForCalculator = (type: string) => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": `UK ${type} Calculator`,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GBP"
      }
    };

    // Add specific descriptions based on calculator type
    switch(type) {
      case "Income Tax":
        return {
          ...baseData,
          "description": "Calculate your UK income tax for 2025. Free and accurate income tax calculator with the latest rates and allowances."
        };
      case "Capital Gains Tax":
        return {
          ...baseData,
          "description": "Calculate your UK capital gains tax for 2025. Free CGT calculator with the latest rates and exemptions."
        };
      case "VAT":
        return {
          ...baseData,
          "description": "Calculate UK VAT for business transactions. Free VAT calculator with standard, reduced, and zero rates."
        };
      case "Inheritance Tax":
        return {
          ...baseData,
          "description": "Calculate UK inheritance tax for 2025. Free calculator with the latest thresholds and exemptions."
        };
      case "Stamp Duty":
        return {
          ...baseData,
          "description": "Calculate UK stamp duty land tax for 2025. Free SDLT calculator for residential and non-residential properties."
        };
      default:
        return {
          ...baseData,
          "description": `Calculate UK ${type} with our free calculator. Updated for 2025 with the latest rates and thresholds.`
        };
    }
  };

  if (showComparison) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tax Comparison
          </h2>
          <Button
            onClick={() => setShowComparison(false)}
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Calculator
          </Button>
        </div>
        <TaxComparison />

        <div className="copyright-notice">
          <p className="mb-2">
            <VSmartIcon /> © {new Date().getFullYear()} VSmart. All rights reserved.
          </p>
          <p>
            <span className="hidden sm:inline">Created by VSmart.</span>
            <span className="contact-container">
              <a
                href="mailto:learningtechnology2@gmail.com"
                className="contact-link"
                aria-label="Contact VSmart at info@vsmart.com"
              >
                <EmailIcon />Contact: info@vsmart.com
              </a>
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {selectedCalculator && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getStructuredDataForCalculator(selectedCalculator))
          }}
        />
      )}
      <div className="space-y-6">
        <Card className="glass-card overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardHeader>
            <CardTitle>Region Selection</CardTitle>
            <CardDescription>Select the region for tax calculation</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex flex-col xs:flex-row flex-wrap gap-3">
              <button
                onClick={() => handleRegionChange("uk")}
                className={`region-button w-full xs:w-auto ${region === "uk" ? "region-button-active" : "region-button-inactive"}`}
                aria-label="Select United Kingdom"
              >
                <UkIcon />
                United Kingdom
              </button>
              <button
                onClick={() => handleRegionChange("eu")}
                className={`region-button w-full xs:w-auto ${region === "eu" ? "region-button-active" : "region-button-inactive"}`}
                aria-label="Select European Union"
              >
                <EuIcon />
                European Union
              </button>
              <button
                onClick={() => handleRegionChange("us")}
                className={`region-button w-full xs:w-auto ${region === "us" ? "region-button-active" : "region-button-inactive"}`}
                aria-label="Select United States"
              >
                <UsIcon />
                United States
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowComparison(true)}
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 shadow hover:shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><line x1="5" y1="7" x2="18" y2="17"/><line x1="9" y1="17" x2="18" y2="7"/></svg>
                  <span className="whitespace-nowrap">Compare Taxes</span>
                </Button>
                <Link href="/basic-calculator" passHref>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 shadow hover:shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 14h6" />
                      <path d="M9 10h6" />
                    </svg>
                    <span className="whitespace-nowrap">Basic Calculator</span>
                  </Button>
                </Link>
                <Link href="/about" passHref>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 shadow hover:shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    <span className="whitespace-nowrap">About VSmart</span>
                  </Button>
                </Link>
              </div>
              <PrintButton />
            </div>
          </CardContent>
        </Card>

        <div className="main-tabs-navigation">
          <div className="main-tabs-grid" role="tablist" aria-label="Tax Categories">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id as keyof SubTabsType);
                  setSelectedSubTab(subTabs[category.id as keyof SubTabsType][0].id);
                  setSelectedCalculator(category.label); // Set selected calculator type
                }}
                className={`main-tab-button ${selectedCategory === category.id ? `active ${category.className}` : ""}`}
                role="tab"
                aria-selected={selectedCategory === category.id}
                id={`tab-${category.id}`}
                aria-controls={`panel-${category.id}`}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {Object.entries(subTabs).map(([category, tabs]) => (
          category === selectedCategory && (
            <Card key={category} className={`tax-card ${mainCategories.find(c => c.id === category)?.className || ""}`} id={`panel-${category}`} role="tabpanel" aria-labelledby={`tab-${category}`}>
              <CardHeader>
                <CardTitle className={headerClass(category)}>
                  <span className="mr-2">{mainCategories.find(c => c.id === category)?.icon}</span>
                  {mainCategories.find(c => c.id === category)?.label}
                </CardTitle>
                <CardDescription>Select a tax type to calculate</CardDescription>

                <div className="subtabs-navigation">
                  <div className="subtabs-flex" role="tablist" aria-label="Tax Types">
                    {tabs.map((tab: SubTabType) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setSelectedSubTab(tab.id);
                          setSelectedCalculator(tab.label); // Set selected calculator type
                        }}
                        className={`subtab-button ${selectedSubTab === tab.id ? "active" : ""}`}
                        role="tab"
                        aria-selected={selectedSubTab === tab.id}
                        id={`subtab-${tab.id}`}
                        aria-controls={`subpanel-${tab.id}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-6">
                    {tabs.map((tab: SubTabType) => (
                      tab.id === selectedSubTab && (
                        <div key={tab.id} className="subtab-content animate-in fade-in-50 duration-200" id={`subpanel-${tab.id}`} role="tabpanel" aria-labelledby={`subtab-${tab.id}`}>
                          {tab.component}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        ))}

        <div className="copyright-notice">
          <p className="mb-2">
            <VSmartIcon /> © {new Date().getFullYear()} VSmart. All rights reserved.
          </p>
          <p>
            <span className="hidden sm:inline">Created by VSmart.</span>
            <span className="contact-container">
              <a
                href="mailto:learningtechnology2@gmail.com"
                className="contact-link"
                aria-label="Contact VSmart at info@vsmart.com"
              >
                <EmailIcon />Contact: info@vsmart.com
              </a>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
