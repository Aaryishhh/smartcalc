"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { trackFeatureUsage } from '@/lib/gtag';

// Calculator card data
interface CalculatorCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  isPopular: boolean;
  categories: string[];
  tags: string[];
}

export default function SiteGrid() {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCalculators, setActiveCalculators] = useState<CalculatorCard[]>([]);

  // Define calculator categories
  const categories = [
    { id: 'all', label: 'All Calculators' },
    { id: 'personal', label: 'Personal Tax' },
    { id: 'property', label: 'Property Tax' },
    { id: 'business', label: 'Business Tax' },
    { id: 'international', label: 'International' },
  ];

  // Define calculator cards
  const calculatorCards: CalculatorCard[] = [
    {
      id: 'income-tax',
      title: 'Income Tax Calculator',
      description: 'Calculate your income tax liability based on salary, dividends, and other income.',
      icon: <IncomeTaxIcon />,
      url: '/income-tax',
      isPopular: true,
      categories: ['personal'],
      tags: ['salary', 'paye', 'tax code', 'personal allowance']
    },
    {
      id: 'take-home-pay',
      title: 'Take Home Pay Calculator',
      description: 'Find out your net pay after tax, National Insurance, and pension contributions.',
      icon: <TakeHomeIcon />,
      url: '/take-home-pay',
      isPopular: true,
      categories: ['personal'],
      tags: ['net pay', 'salary', 'after tax', 'net income']
    },
    {
      id: 'capital-gains',
      title: 'Capital Gains Tax Calculator',
      description: 'Calculate capital gains tax on investments, property, and other assets.',
      icon: <CGTIcon />,
      url: '/capital-gains',
      isPopular: false,
      categories: ['personal', 'property'],
      tags: ['investments', 'shares', 'property sale', 'assets']
    },
    {
      id: 'vat',
      title: 'VAT Calculator',
      description: 'Calculate Value Added Tax (VAT) on purchases and sales (includes reverse VAT).',
      icon: <VATIcon />,
      url: '/vat',
      isPopular: true,
      categories: ['business'],
      tags: ['value added tax', 'business tax', 'sales tax']
    },
    {
      id: 'stamp-duty',
      title: 'Stamp Duty Calculator',
      description: 'Calculate stamp duty land tax (SDLT) on property purchases.',
      icon: <StampDutyIcon />,
      url: '/stamp-duty',
      isPopular: true,
      categories: ['property'],
      tags: ['sdlt', 'property tax', 'house purchase', 'real estate']
    },
    {
      id: 'dividend-tax',
      title: 'Dividend Tax Calculator',
      description: 'Calculate tax due on dividend income.',
      icon: <DividendIcon />,
      url: '/dividend-tax',
      isPopular: false,
      categories: ['personal', 'business'],
      tags: ['shares', 'stock dividends', 'investment income']
    },
    {
      id: 'inheritance-tax',
      title: 'Inheritance Tax Calculator',
      description: 'Calculate potential inheritance tax on estates.',
      icon: <InheritanceIcon />,
      url: '/inheritance-tax',
      isPopular: false,
      categories: ['personal'],
      tags: ['estate planning', 'death duties', 'iht']
    },
    {
      id: 'corporation-tax',
      title: 'Corporation Tax Calculator',
      description: 'Calculate corporation tax for limited companies.',
      icon: <CorporationTaxIcon />,
      url: '/corporation-tax',
      isPopular: false,
      categories: ['business'],
      tags: ['company tax', 'limited company', 'profit tax']
    },
    {
      id: 'national-insurance',
      title: 'National Insurance Calculator',
      description: 'Calculate National Insurance contributions for employees and self-employed.',
      icon: <NICIcon />,
      url: '/national-insurance',
      isPopular: false,
      categories: ['personal'],
      tags: ['nic', 'social security', 'employment tax']
    },
    {
      id: 'crypto-tax',
      title: 'Cryptocurrency Tax Calculator',
      description: 'Calculate tax on crypto transactions and trading.',
      icon: <CryptoIcon />,
      url: '/crypto-tax',
      isPopular: true,
      categories: ['personal'],
      tags: ['bitcoin', 'eth', 'crypto assets', 'digital currency']
    },
    {
      id: 'self-employed',
      title: 'Self-Employed Tax Calculator',
      description: 'Calculate income tax and National Insurance for self-employed people.',
      icon: <SelfEmployedIcon />,
      url: '/self-employed-tax',
      isPopular: true,
      categories: ['personal', 'business'],
      tags: ['freelancer', 'sole trader', 'contractor', 'business owner']
    },
    {
      id: 'tax-comparison',
      title: 'International Tax Comparison',
      description: 'Compare tax rates and obligations across different countries.',
      icon: <GlobalIcon />,
      url: '/tax-comparison',
      isPopular: false,
      categories: ['international'],
      tags: ['expat', 'global tax', 'relocation', 'tax residency']
    },
  ];

  // Filter calculators based on category and search query
  useEffect(() => {
    let filteredCalcs = calculatorCards;

    // Apply category filter
    if (filter !== 'all') {
      filteredCalcs = filteredCalcs.filter(calc =>
        calc.categories.includes(filter)
      );
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredCalcs = filteredCalcs.filter(calc =>
        calc.title.toLowerCase().includes(query) ||
        calc.description.toLowerCase().includes(query) ||
        calc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setActiveCalculators(filteredCalcs);
  }, [filter, searchQuery]);

  // Track calculator clicks
  const handleCalculatorClick = (calculatorId: string) => {
    trackFeatureUsage(calculatorId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">Tax Calculators</h2>
      <p className="text-muted-foreground mb-6">
        Free online tax calculators for 2025 with up-to-date rates and allowances
      </p>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search calculators..."
            className="w-full p-2 px-4 rounded-full border border-border bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
              onClick={() => setFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calculators grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCalculators.map(calculator => (
          <Link
            href={calculator.url}
            key={calculator.id}
            onClick={() => handleCalculatorClick(calculator.id)}
            className="group"
          >
            <div className="h-full flex flex-col bg-card rounded-lg shadow-sm border border-border/50 transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:translate-y-[-2px]">
              <div className="flex items-center gap-3 p-5 pb-3">
                <div className="rounded-full bg-primary/10 p-3">
                  {calculator.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                    {calculator.title}
                  </h3>
                  {calculator.isPopular && (
                    <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 pt-2 flex-1">
                <p className="text-muted-foreground text-sm">
                  {calculator.description}
                </p>
              </div>
              <div className="p-4 border-t border-border/50 flex justify-between">
                <span className="text-sm text-muted-foreground">2025/26 rates</span>
                <span className="text-sm font-medium text-primary">Use calculator →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {activeCalculators.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg border-muted-foreground/20">
          <p className="text-muted-foreground">No calculators match your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilter('all');
            }}
            className="mt-2 text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

// Icon components
function IncomeTaxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <path d="M2 20h20"/>
      <path d="M5 20v-8a7 7 0 0 1 14 0v8"/>
    </svg>
  );
}

function TakeHomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <circle cx="8" cy="21" r="1"/>
      <circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}

function CGTIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}

// Remaining icon components (added fewer for brevity)
function VATIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  );
}

function StampDutyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function DividendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" x2="12" y1="8" y2="16"/>
      <line x1="8" x2="16" y1="12" y2="12"/>
    </svg>
  );
}

function InheritanceIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <path d="M6 12h12"/>
      <path d="M12 6v12"/>
    </svg>
  );
}

function CorporationTaxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    </svg>
  );
}

function NICIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <path d="M20 16V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3l-1 2v1h6v-1l-1-2h3a2 2 0 0 0 2-2Z"/>
      <line x1="7" x2="17" y1="10" y2="10"/>
    </svg>
  );
}

function CryptoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <circle cx="14" cy="20" r="2"/>
      <circle cx="6" cy="20" r="2"/>
      <circle cx="10" cy="7" r="5"/>
      <path d="M10 12v8"/>
      <path d="m16 8-3-2"/>
      <path d="m2 8 3-2"/>
      <path d="m16 18-3.5-3.5"/>
      <path d="m3.5 14.5 2.5-2.5"/>
    </svg>
  );
}

function SelfEmployedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function GlobalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" x2="22" y1="12" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
