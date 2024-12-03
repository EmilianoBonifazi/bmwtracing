import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      <nav className="bg-primary h-16 flex items-center px-6 shadow-md">
        <h1 className="text-white text-xl font-semibold">Diagnostic Analysis Tool</h1>
      </nav>
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
};