import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DiscountsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Discount Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Discount
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Discounts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DiscountCard
              title="Summer Sale"
              code="SUMMER20"
              type="Percentage"
              value="20%"
              startDate="May 1, 2023"
              endDate="Aug 31, 2023"
              usageCount={245}
              usageLimit={500}
              status="active"
            />
            <DiscountCard
              title="New Customer"
              code="WELCOME10"
              type="Percentage"
              value="10%"
              startDate="Jan 1, 2023"
              endDate="Dec 31, 2023"
              usageCount={187}
              usageLimit={null}
              status="active"
            />
            <DiscountCard
              title="Free Shipping"
              code="FREESHIP"
              type="Free Shipping"
              value="Free Shipping"
              startDate="Apr 15, 2023"
              endDate="Jul 15, 2023"
              usageCount={98}
              usageLimit={200}
              status="active"
            />
          </div>
        </TabsContent>
        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DiscountCard
              title="Fall Collection"
              code="FALL2023"
              type="Percentage"
              value="15%"
              startDate="Sep 1, 2023"
              endDate="Nov 30, 2023"
              usageCount={0}
              usageLimit={300}
              status="scheduled"
            />
            <DiscountCard
              title="Black Friday"
              code="BF2023"
              type="Percentage"
              value="30%"
              startDate="Nov 24, 2023"
              endDate="Nov 27, 2023"
              usageCount={0}
              usageLimit={null}
              status="scheduled"
            />
          </div>
        </TabsContent>
        <TabsContent value="expired" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DiscountCard
              title="Spring Sale"
              code="SPRING15"
              type="Percentage"
              value="15%"
              startDate="Mar 1, 2023"
              endDate="Apr 30, 2023"
              usageCount={312}
              usageLimit={400}
              status="expired"
            />
            <DiscountCard
              title="Easter Special"
              code="EASTER10"
              type="Fixed Amount"
              value="$10 OFF"
              startDate="Apr 1, 2023"
              endDate="Apr 10, 2023"
              usageCount={156}
              usageLimit={200}
              status="expired"
            />
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Create New Discount</CardTitle>
          <CardDescription>Set up a new discount code or automatic discount</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discount-name">Discount Name</Label>
              <Input id="discount-name" placeholder="e.g. Summer Sale" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-code">Discount Code</Label>
              <Input id="discount-code" placeholder="e.g. SUMMER20" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  Percentage
                </Button>
                <Button variant="outline" className="justify-start">
                  Fixed Amount
                </Button>
                <Button variant="outline" className="justify-start">
                  Free Shipping
                </Button>
                <Button variant="outline" className="justify-start">
                  Buy X Get Y
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-value">Discount Value</Label>
              <Input id="discount-value" placeholder="e.g. 20" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Select date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Select date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usage-limit">Usage Limit</Label>
              <Input id="usage-limit" type="number" placeholder="Leave blank for unlimited" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimum-purchase">Minimum Purchase Amount</Label>
              <Input id="minimum-purchase" type="number" placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="customer-eligibility" />
              <Label htmlFor="customer-eligibility">Limit to specific customer groups</Label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="product-eligibility" />
              <Label htmlFor="product-eligibility">Limit to specific products or categories</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Create Discount</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discount Usage Report</CardTitle>
          <CardDescription>Track the performance of your discount codes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Discount Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Revenue Impact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">SUMMER20</TableCell>
                <TableCell>Percentage</TableCell>
                <TableCell>20%</TableCell>
                <TableCell>245/500</TableCell>
                <TableCell>-$4,890.50</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">WELCOME10</TableCell>
                <TableCell>Percentage</TableCell>
                <TableCell>10%</TableCell>
                <TableCell>187/∞</TableCell>
                <TableCell>-$1,245.75</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">SPRING15</TableCell>
                <TableCell>Percentage</TableCell>
                <TableCell>15%</TableCell>
                <TableCell>312/400</TableCell>
                <TableCell>-$3,560.25</TableCell>
                <TableCell>
                  <Badge variant="outline">Expired</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function DiscountCard({
  title,
  code,
  type,
  value,
  startDate,
  endDate,
  usageCount,
  usageLimit,
  status,
}: {
  title: string
  code: string
  type: string
  value: string
  startDate: string
  endDate: string
  usageCount: number
  usageLimit: number | null
  status: "active" | "scheduled" | "expired"
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {status === "active" && <Badge>Active</Badge>}
          {status === "scheduled" && (
            <Badge variant="outline" className="border-blue-500 text-blue-500">
              Scheduled
            </Badge>
          )}
          {status === "expired" && <Badge variant="outline">Expired</Badge>}
        </div>
        <CardDescription>{code}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Value:</span>
            <span className="font-medium">{value}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Period:</span>
            <span className="font-medium">
              {startDate} - {endDate}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Usage:</span>
            <span className="font-medium">
              {usageCount}/{usageLimit === null ? "∞" : usageLimit}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm">
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-red-500">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
