"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

// Define interfaces for breadcrumb items
interface BreadcrumbItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  // If we're on the homepage, don't show breadcrumbs
  if (pathname === "/") {
    return null;
  }

  // Split the path and remove empty segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Create the breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={16} className="mr-1" />
    },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

      // Format the segment name for display (capitalize and replace hyphens with spaces)
      const name = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        name,
        path
      };
    })
  ];

  return (
    <nav className="text-sm py-3 px-4 mb-4 bg-muted/30 rounded-md" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight size={14} className="mx-2 text-muted-foreground" />
              )}

              {isLast ? (
                <span className="font-medium" aria-current="page">
                  {crumb.icon}{crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.icon}{crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
