"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import the navigation items from our mobile menu
import { navigationItems } from "./MobileMenu";

export function CalculatorsDropdown() {
  const pathname = usePathname();

  // Find the "Calculators" category from our navigation items
  const calculatorsCategory = navigationItems.find(
    item => 'items' in item && item.name === "Calculators"
  );

  if (!calculatorsCategory || !('items' in calculatorsCategory)) {
    return null;
  }

  const calculators = calculatorsCategory.items;

  // Check if current page is a calculator page
  const isCalculatorPage = calculators.some(
    calculator => calculator.href === pathname
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`text-sm font-medium flex items-center ${
            isCalculatorPage
              ? "text-foreground font-bold"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Calculators
          <ChevronDown size={16} className="ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {calculators.map((calculator, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              href={calculator.href}
              className={`w-full ${
                pathname === calculator.href ? "font-medium" : ""
              }`}
            >
              {calculator.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
