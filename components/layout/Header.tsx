"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Opportunity.ai</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/jobs"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Jobs
          </Link>
          <Link
            href="/applications"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Applications
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
