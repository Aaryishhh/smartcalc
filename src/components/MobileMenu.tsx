"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interface for our navigation items
interface NavItem {
  name: string;
  href: string;
  isExternal?: boolean;
}

// Interface for category that can contain sub-items
interface NavCategory {
  name: string;
  items: NavItem[];
}

// Our navigation structure
export const navigationItems: (NavItem | NavCategory)[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Calculators",
    items: [
      { name: "Income Tax", href: "/income-tax" },
      { name: "VAT", href: "/vat" },
      { name: "Capital Gains", href: "/capital-gains" },
      { name: "Basic Calculator", href: "/basic-calculator" },
      { name: "Dividend Tax", href: "/dividend-tax" },
      { name: "Stamp Duty", href: "/stamp-duty" },
      // These are placeholders for future implementation
      { name: "Council Tax", href: "#" },
      { name: "Vehicle Tax", href: "#" },
      { name: "NICs", href: "#" },
      { name: "Inheritance Tax", href: "#" },
    ],
  },
  {
    name: "About",
    href: "/about",
  },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Function to check if a path is active
  const isActivePath = (path: string) => pathname === path;

  // Toggle the menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the menu (for when a link is clicked)
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-foreground"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="container h-full pt-16 pb-8 overflow-y-auto">
            <button
              onClick={closeMenu}
              className="absolute top-4 right-4 p-2 text-foreground"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <nav className="flex flex-col gap-6">
              {navigationItems.map((item, i) => {
                // If it's a simple nav item
                if ('href' in item) {
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={closeMenu}
                      className={`text-xl font-medium py-2 ${
                        isActivePath(item.href)
                          ? "text-primary"
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                }

                // If it's a category with sub-items
                return (
                  <div key={i} className="space-y-3">
                    <div className="text-xl font-medium text-foreground flex items-center">
                      {item.name}
                      <ChevronDown size={20} className="ml-1" />
                    </div>
                    <div className="ml-4 space-y-3">
                      {item.items.map((subItem, j) => (
                        <Link
                          key={j}
                          href={subItem.href}
                          onClick={closeMenu}
                          className={`block py-1 ${
                            isActivePath(subItem.href)
                              ? "text-primary"
                              : "text-foreground/70 hover:text-foreground"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
