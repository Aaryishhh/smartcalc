import { Metadata } from "next";
import { CapitalGainsClient } from "./CapitalGainsClient";

export const metadata: Metadata = {
  title: "Capital Gains Tax Calculator - Smart Tax Calculator",
  description: "Calculate capital gains tax for UK, EU, and US residents",
};

export default function CapitalGainsPage() {
  return <CapitalGainsClient />;
}
