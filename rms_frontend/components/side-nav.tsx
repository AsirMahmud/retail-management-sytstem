"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Calendar,
  DollarSign,
  Home,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Users,
  LineChart,
  CheckSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

const mainNavItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "POS",
    icon: ShoppingBag,
    href: "/pos",
  },
  {
    title: "Sales",
    icon: LineChart,
    href: "/sales",
    subItems: [
      { title: "Overview", href: "/sales" },
      { title: "Transactions", href: "/sales/transactions" },
      { title: "Returns", href: "/sales/returns" },
      { title: "Discounts", href: "/sales/discounts" },
    ],
  },
  {
    title: "Customers",
    icon: Users,
    href: "/customers",
    subItems: [
      { title: "All Customers", href: "/customers" },
      { title: "Add Customer", href: "/customers/add" },
      { title: "Loyalty Program", href: "/customers/loyalty" },
      { title: "Customer Groups", href: "/customers/groups" },
    ],
  },
  {
    title: "Inventory",
    icon: Package,
    href: "/inventory",
    subItems: [
      { title: "Dashboard", href: "/inventory" },
      { title: "Products", href: "/inventory/products" },
      { title: "Add Product", href: "/inventory/add-product" },
      { title: "Categories", href: "/inventory/categories" },
      { title: "Suppliers", href: "/inventory/suppliers" },
    ],
  },
  {
    title: "Staff",
    icon: Users,
    href: "/staff",
    subItems: [
      { title: "Directory", href: "/staff" },
      { title: "Schedule", href: "/staff/schedule" },
      { title: "Performance", href: "/staff/performance" },
      { title: "Time Tracking", href: "/staff/time-tracking" },
    ],
  },
  {
    title: "Finances",
    icon: DollarSign,
    href: "/finances",
    subItems: [
      { title: "Overview", href: "/finances" },
      { title: "Expenses", href: "/finances/expenses" },
      { title: "Budgeting", href: "/finances/budgeting" },
      { title: "Invoices", href: "/finances/invoices" },
    ],
  },
  {
    title: "Tasks & Notes",
    icon: CheckSquare,
    href: "/tasks",
    subItems: [
      { title: "Task Board", href: "/tasks" },
      { title: "My Tasks", href: "/tasks/my-tasks" },
      { title: "Notes", href: "/tasks/notes" },
    ],
  },
  {
    title: "Reports",
    icon: BarChart,
    href: "/reports",
    subItems: [
      { title: "Templates", href: "/reports" },
      { title: "Custom Reports", href: "/reports/custom" },
      { title: "Scheduled Reports", href: "/reports/scheduled" },
      { title: "Analytics", href: "/reports/analytics" },
    ],
  },
  {
    title: "Calendar",
    icon: Calendar,
    href: "/calendar",
  },
];

const utilityNavItems = [
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function SideNav() {
  const [open, setOpen] = useState(false);
  const [openCollapsibles, setOpenCollapsibles] = useState<
    Record<string, boolean>
  >({});
  const pathname = usePathname();
  const router = useRouter();

  const toggleCollapsible = (title: string) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isSubItemActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white p-0 sm:max-w-[280px]">
          <div className="flex flex-col h-full bg-white">
            <div className="flex h-14 items-center px-6 border-b">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-lg text-[#1E3A8A]"
              >
                <Store className="h-6 w-6" />
                <span>MenWear Pro</span>
              </Link>
            </div>
            <ScrollArea className="flex-1">
              <nav className="grid gap-2 p-4">
                {mainNavItems.map((item) =>
                  item.subItems ? (
                    <Collapsible
                      key={item.title}
                      open={openCollapsibles[item.title] || isActive(item.href)}
                      onOpenChange={() => toggleCollapsible(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F1F5F9] hover:text-[#1E3A8A]",
                            isActive(item.href)
                              ? "bg-[#F1F5F9] text-[#1E3A8A]"
                              : "text-muted-foreground"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            {item.title}
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn(
                              "h-4 w-4 transition-transform",
                              openCollapsibles[item.title] ||
                                isActive(item.href)
                                ? "rotate-180"
                                : ""
                            )}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-8 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F1F5F9] hover:text-[#1E3A8A]",
                                isSubItemActive(subItem.href)
                                  ? "bg-[#F1F5F9] text-[#1E3A8A]"
                                  : "text-muted-foreground"
                              )}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F1F5F9] hover:text-[#1E3A8A]",
                        isActive(item.href)
                          ? "bg-[#F1F5F9] text-[#1E3A8A]"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  )
                )}
              </nav>
              <Separator className="my-2 mx-4" />
              <nav className="grid gap-2 p-4">
                {utilityNavItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F1F5F9] hover:text-[#1E3A8A]",
                      isActive(item.href)
                        ? "bg-[#F1F5F9] text-[#1E3A8A]"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="p-4">
              <Separator className="my-2" />
              <div className="flex items-center gap-3 rounded-md px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]">
                  <span className="text-sm font-medium text-[#1E3A8A]">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Store Manager</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex flex-col w-64 border-r bg-white">
        <div className="flex h-14 items-center px-6 border-b">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg text-[#1E3A8A]"
          >
            <Store className="h-6 w-6" />
            <span>MenWear Pro</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-2 p-4">
            {mainNavItems.map((item) =>
              item.subItems ? (
                <Collapsible
                  key={item.title}
                  open={openCollapsibles[item.title] || isActive(item.href)}
                  onOpenChange={() => toggleCollapsible(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F1F5F9] hover:text-[#1E3A8A]",
                        isActive(item.href)
                          ? "bg-[#F1F5F9] text-[#1E3A8A]"
                          : "text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openCollapsibles[item.title] || isActive(item.href)
                            ? "rotate-180"
                            : ""
                        )}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F1F5F9] hover:text-[#1E3A8A]",
                            isSubItemActive(subItem.href)
                              ? "bg-[#F1F5F9] text-[#1E3A8A]"
                              : "text-muted-foreground"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F1F5F9] hover:text-[#1E3A8A]",
                    isActive(item.href)
                      ? "bg-[#F1F5F9] text-[#1E3A8A]"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            )}
          </nav>
          <Separator className="my-2 mx-4" />
          <nav className="grid gap-2 p-4">
            {utilityNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F1F5F9] hover:text-[#1E3A8A]",
                  isActive(item.href)
                    ? "bg-[#F1F5F9] text-[#1E3A8A]"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4">
          <Separator className="my-2" />
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]">
              <span className="text-sm font-medium text-[#1E3A8A]">JD</span>
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Store Manager</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
