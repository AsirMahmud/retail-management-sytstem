import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const staff = [
  {
    name: "Rebecca Moore",
    position: "Senior Sales Associate",
    sales: "$12,345",
    units: 85,
    conversion: "48%",
    status: "above-target",
    initials: "RM",
  },
  {
    name: "James Wilson",
    position: "Sales Associate",
    sales: "$8,764",
    units: 64,
    conversion: "42%",
    status: "on-target",
    initials: "JW",
  },
  {
    name: "Sarah Johnson",
    position: "Sales Associate",
    sales: "$7,890",
    units: 58,
    conversion: "39%",
    status: "on-target",
    initials: "SJ",
  },
  {
    name: "David Martinez",
    position: "Junior Sales Associate",
    sales: "$5,430",
    units: 42,
    conversion: "32%",
    status: "below-target",
    initials: "DM",
  },
]

export function StaffPerformanceTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Staff Member</TableHead>
          <TableHead className="hidden md:table-cell">Position</TableHead>
          <TableHead>Sales</TableHead>
          <TableHead className="hidden sm:table-cell">Units</TableHead>
          <TableHead className="hidden lg:table-cell">Conversion</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((person) => (
          <TableRow key={person.name}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A] text-xs">{person.initials}</AvatarFallback>
                </Avatar>
                <span>{person.name}</span>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{person.position}</TableCell>
            <TableCell>{person.sales}</TableCell>
            <TableCell className="hidden sm:table-cell">{person.units}</TableCell>
            <TableCell className="hidden lg:table-cell">{person.conversion}</TableCell>
            <TableCell>
              <Badge
                variant={
                  person.status === "above-target"
                    ? "default"
                    : person.status === "on-target"
                      ? "outline"
                      : "destructive"
                }
                className={
                  person.status === "above-target"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : person.status === "on-target"
                      ? "border-amber-500 text-amber-500"
                      : ""
                }
              >
                {person.status === "above-target"
                  ? "Above Target"
                  : person.status === "on-target"
                    ? "On Target"
                    : "Below Target"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
