"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface StaffSalesData {
  id: number;
  name: string;
  initials: string;
  position: string;
  transactions: number;
  revenue: number;
  avgTicket: number;
  conversion: number;
  target: number;
}

interface SalesByStaffTableProps {
  data: StaffSalesData[] | null;
  isLoading: boolean;
}

export function SalesByStaffTable({ data, isLoading }: SalesByStaffTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Avg. Ticket</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead>Target Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Avg. Ticket</TableHead>
            <TableHead>Conversion Rate</TableHead>
            <TableHead>Target Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">
                      {staff.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{staff.name}</span>
                </div>
              </TableCell>
              <TableCell>{staff.position}</TableCell>
              <TableCell>{staff.transactions}</TableCell>
              <TableCell>${staff.revenue.toFixed(2)}</TableCell>
              <TableCell>${staff.avgTicket.toFixed(2)}</TableCell>
              <TableCell>{staff.conversion}%</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-full max-w-32">
                    <Progress
                      value={(staff.conversion / staff.target) * 100}
                      className="h-2"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {staff.conversion}/{staff.target}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
