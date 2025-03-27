import { Metadata } from "next";
import { DividendTaxClient } from "./DividendTaxClient";

export const metadata: Metadata = {
  title: "Dividend Tax Calculator - Smart Tax Calculator",
  description: "Calculate UK dividend tax based on your income and dividend amounts",
};

export default function DividendTaxPage() {
  return <DividendTaxClient />;
}
