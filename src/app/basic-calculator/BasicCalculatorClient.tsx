"use client";

import BasicCalculator from "@/components/BasicCalculator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BasicCalculatorClient() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Basic Calculator
        </h1>
        <Link href="/" passHref>
          <Button variant="outline" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Tax Calculators
          </Button>
        </Link>
      </div>

      <BasicCalculator />

      <div className="copyright-notice">
        <p>
          © {new Date().getFullYear()} VSmart. All rights reserved.
          <span className="contact-container">
            <a
              href="mailto:learningtechnology2@gmail.com"
              className="contact-link"
              aria-label="Contact VSmart at info@vsmart.com"
            >
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
              Contact: info@vsmart.com
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
