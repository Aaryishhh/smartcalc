import { Metadata } from "next";
import { StampDutyClient } from "./StampDutyClient";

export const metadata: Metadata = {
  title: "Stamp Duty Calculator - Smart Tax Calculator",
  description: "Calculate UK Stamp Duty Land Tax (SDLT) on property purchases",
};

export default function StampDutyPage() {
  return <StampDutyClient />;
}
