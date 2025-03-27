import { Metadata } from "next";
import { VATClient } from "./VATClient";

export const metadata: Metadata = {
  title: "VAT Calculator - Smart Tax Calculator",
  description: "Calculate Value Added Tax for UK, EU, and US purchases",
};

export default function VATPage() {
  return <VATClient />;
}
