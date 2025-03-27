"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export default function PrintButton() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  // Make sure we're on the client before trying to use browser APIs
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current calculator data
  const getCurrentCalculatorData = () => {
    // In a real implementation, this would get data from the current calculator's state
    // For now, we'll use placeholder data
    return [
      {
        region: "UK",
        taxType: "Income Tax",
        income: 50000,
        taxAmount: 7486,
        effectiveRate: 14.97,
        currency: "£"
      },
      {
        region: "EU",
        taxType: "Income Tax",
        income: 50000,
        taxAmount: 12000,
        effectiveRate: 24.00,
        currency: "€"
      },
      {
        region: "US",
        taxType: "Income Tax",
        income: 50000,
        taxAmount: 9000,
        effectiveRate: 18.00,
        currency: "$"
      }
    ];
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!isClient) return;

    try {
      setLoading(true);

      // Use browser's print to PDF functionality
      window.print();

      // In a production app, we would use jsPDF and html2canvas here
      // but for simplicity, we'll just use print to PDF

      alert('Use the browser Print dialog to save as PDF');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      // Get data from current calculator
      const taxResults = getCurrentCalculatorData();

      // Create CSV header
      let csvContent = "data:text/csv;charset=utf-8,Region,Tax Type,Income,Tax Amount,Effective Rate\n";

      // Add rows for each tax result
      taxResults.forEach(result => {
        const row = [
          result.region,
          result.taxType,
          result.income.toLocaleString(),
          `${result.currency}${result.taxAmount.toLocaleString()}`,
          `${result.effectiveRate.toFixed(2)}%`
        ].join(',');

        csvContent += row + "\n";
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `tax_calculation_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('CSV file downloaded successfully');
    } catch (error) {
      console.error('CSV generation error:', error);
      alert('Error generating CSV file. Please try again.');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handlePrint}>
          Print Results
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadPDF} disabled={loading}>
          {loading ? "Generating PDF..." : "Export as PDF"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
