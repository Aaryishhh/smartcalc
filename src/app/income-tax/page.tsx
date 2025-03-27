import { Metadata } from 'next';
import { IncomeTaxClient } from './IncomeTaxClient';

export const metadata: Metadata = {
  title: 'Income Tax Calculator 2025 | Smart Tax Calculator',
  description: 'Calculate your income tax for 2025/26 tax year with our free online calculator. Accurate calculations using the latest rates and allowances.',
  keywords: 'income tax calculator, income tax 2025, UK tax calculator, PAYE calculator, tax bands, personal allowance',
};

export default function IncomeTaxPage() {
  return <IncomeTaxClient />;
}
