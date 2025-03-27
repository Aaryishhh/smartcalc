"use client";

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { usePathname } from 'next/navigation';
import { MobileMenu } from './MobileMenu';
import { CalculatorsDropdown } from './CalculatorsDropdown';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <Link href="/" className="flex items-center" aria-label="Smart Tax Calculator">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
              <path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16" />
              <path d="M8 7h.01" />
              <path d="M16 7h.01" />
              <path d="M12 7h.01" />
              <path d="M12 11h.01" />
              <path d="M16 11h.01" />
              <path d="M8 11h.01" />
              <path d="M10 22v-6.5m4 0V22" />
            </svg>
            <span className="hidden sm:inline-block">Smart Tax Calculator</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4" aria-label="Main Navigation">
          <Link
            href="/"
            className={`text-sm font-medium ${isActive('/') ? 'text-foreground font-bold' : 'text-foreground/60 hover:text-foreground'}`}
          >
            Home
          </Link>

          {/* Calculators Dropdown */}
          <CalculatorsDropdown />

          <Link
            href="/about"
            className={`text-sm font-medium ${isActive('/about') ? 'text-foreground font-bold' : 'text-foreground/60 hover:text-foreground'}`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
