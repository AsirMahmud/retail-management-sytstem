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
  LogOut,
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
import { useAuth } from "@/contexts/auth-context";

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
      { title: "Sales History", href: "/sales/sales-history" },
    ],
  },
  {
    title: "Customers",
    icon: Users,
    href: "/customers",
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
    title: "Expenses",
    icon: DollarSign,
    href: "/expenses",
  },
];

const utilityNavItems: {
  title: string;
  icon: any;
  href: string;
}[] = [
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
  const { logout } = useAuth();

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

  const handleLogout = () => {
    // Add your logout logic here
    logout();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          asChild
          className="md:hidden absolute h-screen top-4 left-4 z-50"
        >
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-gradient-to-b from-blue-50 to-white p-0 w-[280px] border-r border-blue-100"
        >
          <div className="flex flex-col h-full">
            <div className="flex h-16 items-center px-6 border-b border-blue-100 bg-white/50 backdrop-blur-sm">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-lg text-blue-900"
              >
                <Store className="h-6 w-6 text-blue-600" />
                <span>MenWear Pro</span>
              </Link>
            </div>
            <ScrollArea className="flex-1">
              <nav className="grid gap-1 p-4">
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
                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive(item.href)
                              ? "bg-blue-100 text-blue-900 shadow-sm"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-900"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "h-5 w-5 transition-colors",
                                isActive(item.href)
                                  ? "text-blue-600"
                                  : "text-gray-500"
                              )}
                            />
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
                              "h-4 w-4 transition-transform duration-200",
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
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                isSubItemActive(subItem.href)
                                  ? "bg-blue-50 text-blue-900"
                                  : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-900"
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
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-900 shadow-sm"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-900"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive(item.href)
                            ? "text-blue-600"
                            : "text-gray-500"
                        )}
                      />
                      {item.title}
                    </Link>
                  )
                )}
              </nav>
              <Separator className="my-2 mx-4 bg-blue-100" />
              <nav className="grid gap-1 p-4">
                {utilityNavItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-900 shadow-sm"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive(item.href) ? "text-blue-600" : "text-gray-500"
                      )}
                    />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-blue-100">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full p-2.5 text-gray-600 hover:text-blue-900 hover:bg-blue-50 border-blue-100 transition-all duration-200 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex flex-col w-[280px] h-screen fixed border-r bg-gradient-to-b from-blue-50 to-white">
        <div className="flex h-16 items-center px-6 border-b border-blue-100 bg-white/50 backdrop-blur-sm">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg text-blue-900"
          >
            <Store className="h-6 w-6 text-blue-600" />
            <span>MenWear Pro</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 p-4">
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
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-900 shadow-sm"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive(item.href)
                              ? "text-blue-600"
                              : "text-gray-500"
                          )}
                        />
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
                          "h-4 w-4 transition-transform duration-200",
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
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                            isSubItemActive(subItem.href)
                              ? "bg-blue-50 text-blue-900"
                              : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-900"
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-900 shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive(item.href) ? "text-blue-600" : "text-gray-500"
                    )}
                  />
                  {item.title}
                </Link>
              )
            )}
          </nav>
          <Separator className="my-2 mx-4 bg-blue-100" />
          <nav className="grid gap-1 p-4">
            {utilityNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-900 shadow-sm"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive(item.href) ? "text-blue-600" : "text-gray-500"
                  )}
                />
                {item.title}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-blue-100">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full p-2.5 text-gray-600 hover:text-blue-900 hover:bg-blue-50 border-blue-100 transition-all duration-200 rounded-lg flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
