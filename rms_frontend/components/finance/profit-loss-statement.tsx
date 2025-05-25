import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, Printer } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProfitLossStatement() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Profit & Loss Statement</CardTitle>
            <CardDescription>Comprehensive view of your business's financial performance</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="monthly">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Period</TabsTrigger>
              <TabsTrigger value="previous">Previous Period</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Item</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>% of Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="font-medium">
                      <TableCell>Revenue</TableCell>
                      <TableCell>$45,231.89</TableCell>
                      <TableCell>100.0%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Product Sales</TableCell>
                      <TableCell>$42,500.00</TableCell>
                      <TableCell>93.9%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Service Revenue</TableCell>
                      <TableCell>$2,731.89</TableCell>
                      <TableCell>6.1%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Cost of Goods Sold</TableCell>
                      <TableCell>$27,950.00</TableCell>
                      <TableCell>61.8%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Product Costs</TableCell>
                      <TableCell>$26,350.00</TableCell>
                      <TableCell>58.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Service Delivery Costs</TableCell>
                      <TableCell>$1,600.00</TableCell>
                      <TableCell>3.5%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Gross Profit</TableCell>
                      <TableCell>$17,281.89</TableCell>
                      <TableCell>38.2%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Operating Expenses</TableCell>
                      <TableCell>$5,047.30</TableCell>
                      <TableCell>11.2%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Salaries & Wages</TableCell>
                      <TableCell>$2,800.00</TableCell>
                      <TableCell>6.2%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Rent</TableCell>
                      <TableCell>$950.00</TableCell>
                      <TableCell>2.1%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Utilities</TableCell>
                      <TableCell>$320.00</TableCell>
                      <TableCell>0.7%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Marketing & Advertising</TableCell>
                      <TableCell>$650.00</TableCell>
                      <TableCell>1.4%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Other Expenses</TableCell>
                      <TableCell>$327.30</TableCell>
                      <TableCell>0.7%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Operating Income</TableCell>
                      <TableCell>$12,234.59</TableCell>
                      <TableCell>27.0%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Other Income & Expenses</TableCell>
                      <TableCell>$-350.00</TableCell>
                      <TableCell>-0.8%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Interest Income</TableCell>
                      <TableCell>$150.00</TableCell>
                      <TableCell>0.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Interest Expense</TableCell>
                      <TableCell>$-500.00</TableCell>
                      <TableCell>-1.1%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Income Before Taxes</TableCell>
                      <TableCell>$11,884.59</TableCell>
                      <TableCell>26.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Income Taxes</TableCell>
                      <TableCell>$2,971.15</TableCell>
                      <TableCell>6.6%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium text-lg bg-muted/50">
                      <TableCell>Net Income</TableCell>
                      <TableCell>$8,913.44</TableCell>
                      <TableCell>19.7%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="previous">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Item</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>% of Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="font-medium">
                      <TableCell>Revenue</TableCell>
                      <TableCell>$42,700.00</TableCell>
                      <TableCell>100.0%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Product Sales</TableCell>
                      <TableCell>$40,100.00</TableCell>
                      <TableCell>93.9%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Service Revenue</TableCell>
                      <TableCell>$2,600.00</TableCell>
                      <TableCell>6.1%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Cost of Goods Sold</TableCell>
                      <TableCell>$27,115.00</TableCell>
                      <TableCell>63.5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Product Costs</TableCell>
                      <TableCell>$25,665.00</TableCell>
                      <TableCell>60.1%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Service Delivery Costs</TableCell>
                      <TableCell>$1,450.00</TableCell>
                      <TableCell>3.4%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Gross Profit</TableCell>
                      <TableCell>$15,585.00</TableCell>
                      <TableCell>36.5%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Operating Expenses</TableCell>
                      <TableCell>$4,980.00</TableCell>
                      <TableCell>11.7%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Salaries & Wages</TableCell>
                      <TableCell>$2,750.00</TableCell>
                      <TableCell>6.4%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Rent</TableCell>
                      <TableCell>$950.00</TableCell>
                      <TableCell>2.2%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Utilities</TableCell>
                      <TableCell>$310.00</TableCell>
                      <TableCell>0.7%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Marketing & Advertising</TableCell>
                      <TableCell>$620.00</TableCell>
                      <TableCell>1.5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Other Expenses</TableCell>
                      <TableCell>$350.00</TableCell>
                      <TableCell>0.8%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Operating Income</TableCell>
                      <TableCell>$10,605.00</TableCell>
                      <TableCell>24.8%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Other Income & Expenses</TableCell>
                      <TableCell>$-380.00</TableCell>
                      <TableCell>-0.9%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Interest Income</TableCell>
                      <TableCell>$120.00</TableCell>
                      <TableCell>0.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Interest Expense</TableCell>
                      <TableCell>$-500.00</TableCell>
                      <TableCell>-1.2%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Income Before Taxes</TableCell>
                      <TableCell>$10,225.00</TableCell>
                      <TableCell>23.9%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Income Taxes</TableCell>
                      <TableCell>$2,556.25</TableCell>
                      <TableCell>6.0%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium text-lg bg-muted/50">
                      <TableCell>Net Income</TableCell>
                      <TableCell>$7,668.75</TableCell>
                      <TableCell>18.0%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="comparison">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Item</TableHead>
                      <TableHead>Current Period</TableHead>
                      <TableHead>Previous Period</TableHead>
                      <TableHead>Change ($)</TableHead>
                      <TableHead>Change (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="font-medium">
                      <TableCell>Revenue</TableCell>
                      <TableCell>$45,231.89</TableCell>
                      <TableCell>$42,700.00</TableCell>
                      <TableCell>$2,531.89</TableCell>
                      <TableCell className="text-green-600">+5.9%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Cost of Goods Sold</TableCell>
                      <TableCell>$27,950.00</TableCell>
                      <TableCell>$27,115.00</TableCell>
                      <TableCell>$835.00</TableCell>
                      <TableCell className="text-red-600">+3.1%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Gross Profit</TableCell>
                      <TableCell>$17,281.89</TableCell>
                      <TableCell>$15,585.00</TableCell>
                      <TableCell>$1,696.89</TableCell>
                      <TableCell className="text-green-600">+10.9%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Operating Expenses</TableCell>
                      <TableCell>$5,047.30</TableCell>
                      <TableCell>$4,980.00</TableCell>
                      <TableCell>$67.30</TableCell>
                      <TableCell className="text-red-600">+1.4%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Operating Income</TableCell>
                      <TableCell>$12,234.59</TableCell>
                      <TableCell>$10,605.00</TableCell>
                      <TableCell>$1,629.59</TableCell>
                      <TableCell className="text-green-600">+15.4%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Other Income & Expenses</TableCell>
                      <TableCell>$-350.00</TableCell>
                      <TableCell>$-380.00</TableCell>
                      <TableCell>$30.00</TableCell>
                      <TableCell className="text-green-600">-7.9%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/50">
                      <TableCell>Income Before Taxes</TableCell>
                      <TableCell>$11,884.59</TableCell>
                      <TableCell>$10,225.00</TableCell>
                      <TableCell>$1,659.59</TableCell>
                      <TableCell className="text-green-600">+16.2%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Income Taxes</TableCell>
                      <TableCell>$2,971.15</TableCell>
                      <TableCell>$2,556.25</TableCell>
                      <TableCell>$414.90</TableCell>
                      <TableCell className="text-red-600">+16.2%</TableCell>
                    </TableRow>
                    <TableRow className="font-medium text-lg bg-muted/50">
                      <TableCell>Net Income</TableCell>
                      <TableCell>$8,913.44</TableCell>
                      <TableCell>$7,668.75</TableCell>
                      <TableCell>$1,244.69</TableCell>
                      <TableCell className="text-green-600">+16.2%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Statement
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
