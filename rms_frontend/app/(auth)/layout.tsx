import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { MainNav } from "@/components/main-nav";
import { SideNav } from "@/components/side-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { TaskProvider } from "@/context/task-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MenWear Pro - Retail Management System",
  description: "Comprehensive retail management system for men's wear stores",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <main className="">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
