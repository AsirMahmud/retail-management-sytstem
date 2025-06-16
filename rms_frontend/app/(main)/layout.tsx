"use client";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { MainNav } from "@/components/main-nav";
import { SideNav } from "@/components/side-nav";
import { UpperNav } from "@/components/upper-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { TaskProvider } from "@/context/task-context";
import { AuthProvider } from "@/contexts/auth-context";
import { BismillahProvider } from "@/contexts/bismillah-context";
import { Toaster } from "@/components/ui/toaster";
import { BismillahLogo } from "@/components/bismillah-logo";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={inter.className}>
        <AuthProvider>
          <TaskProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              <BismillahProvider>
                <div className="flex min-h-screen bg-[#F1F5F9]">
                  <SideNav />
                  <div className="flex-1 mx-auto md:ml-[280px] flex flex-col">
                    <UpperNav />
                    <BismillahLogo />
                    <main className="flex-1 p-4 md:p-6 overflow-auto">
                      {children}
                    </main>
                    <Toaster />
                  </div>
                </div>
              </BismillahProvider>
            </ThemeProvider>
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
