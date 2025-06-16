"use client";

import { useBismillah } from "@/contexts/bismillah-context";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UpperNav() {
  const { showBismillah } = useBismillah();
  const { setTheme, theme } = useTheme();

  return <div className="w-full bg-white border-b"></div>;
}
