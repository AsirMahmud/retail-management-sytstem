import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CashFlowForecast() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Cash Flow Analysis</CardTitle>
            <CardDescription>Track and forecast your business cash flow</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="6months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Next 3 Months</SelectItem>
                <SelectItem value="6months">Next 6 Months</SelectItem>
                <SelectItem value="12months">Next 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <LineChart
            data={[
              { month: "Jul", "Cash In": 45231, "Cash Out": 33700, "Net Cash Flow": 11531 },
              { month: "Aug", "Cash In": 47500, "Cash Out": 34500, "Net Cash Flow": 13000 },
              { month: "Sep", "Cash In": 49800, "Cash Out": 35200, "Net Cash Flow": 14600 },
              { month: "Oct", "Cash In": 52100, "Cash Out": 36800, "Net Cash Flow": 15300 },
              { month: "Nov", "Cash In": 54500, "Cash Out": 38400, "Net Cash Flow": 16100 },
              { month: "Dec", "Cash In": 57000, "Cash Out": 40000, "Net Cash Flow": 17000 },
            ]}
            index="month"
            categories={["Cash In", "Cash Out", "Net Cash Flow"]}
            colors={["emerald", "rose", "blue"]}
            valueFormatter={(value) => `$${value.toLocaleString()}`}
            yAxisWidth={65}
            height={350}
          />

          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="annual">Annual</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Month</TableHead>
                      <TableHead>Cash In</TableHead>
                      <TableHead>Cash Out</TableHead>
                      <TableHead>Net Cash Flow</TableHead>
                      <TableHead>Cumulative Cash Flow</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Jul</TableCell>
                      <TableCell>$45,231</TableCell>
                      <TableCell>$33,700</TableCell>
                      <TableCell>$11,531</TableCell>
                      <TableCell>$11,531</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Aug</TableCell>
                      <TableCell>$47,500</TableCell>
                      <TableCell>$34,500</TableCell>
                      <TableCell>$13,000</TableCell>
                      <TableCell>$24,531</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sep</TableCell>
                      <TableCell>$49,800</TableCell>
                      <TableCell>$35,200</TableCell>
                      <TableCell>$14,600</TableCell>
                      <TableCell>$39,131</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Oct</TableCell>
                      <TableCell>$52,100</TableCell>
                      <TableCell>$36,800</TableCell>
                      <TableCell>$15,300</TableCell>
                      <TableCell>$54,431</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Nov</TableCell>
                      <TableCell>$54,500</TableCell>
                      <TableCell>$38,400</TableCell>
                      <TableCell>$16,100</TableCell>
                      <TableCell>$70,531</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Dec</TableCell>
                      <TableCell>$57,000</TableCell>
                      <TableCell>$40,000</TableCell>
                      <TableCell>$17,000</TableCell>
                      <TableCell>$87,531</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="quarterly">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Quarter</TableHead>
                      <TableHead>Cash In</TableHead>
                      <TableHead>Cash Out</TableHead>
                      <TableHead>Net Cash Flow</TableHead>
                      <TableHead>Cumulative Cash Flow</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Q3 2023</TableCell>
                      <TableCell>$142,531</TableCell>
                      <TableCell>$103,400</TableCell>
                      <TableCell>$39,131</TableCell>
                      <TableCell>$39,131</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Q4 2023</TableCell>
                      <TableCell>$163,600</TableCell>
                      <TableCell>$115,200</TableCell>
                      <TableCell>$48,400</TableCell>
                      <TableCell>$87,531</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Q1 2024</TableCell>
                      <TableCell>$178,500</TableCell>
                      <TableCell>$124,800</TableCell>
                      <TableCell>$53,700</TableCell>
                      <TableCell>$141,231</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Q2 2024</TableCell>
                      <TableCell>$192,600</TableCell>
                      <TableCell>$133,900</TableCell>
                      <TableCell>$58,700</TableCell>
                      <TableCell>$199,931</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="annual">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Year</TableHead>
                      <TableHead>Cash In</TableHead>
                      <TableHead>Cash Out</TableHead>
                      <TableHead>Net Cash Flow</TableHead>
                      <TableHead>Cumulative Cash Flow</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">2023</TableCell>
                      <TableCell>$542,400</TableCell>
                      <TableCell>$398,600</TableCell>
                      <TableCell>$143,800</TableCell>
                      <TableCell>$143,800</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2024 (Forecast)</TableCell>
                      <TableCell>$650,900</TableCell>
                      <TableCell>$458,400</TableCell>
                      <TableCell>$192,500</TableCell>
                      <TableCell>$336,300</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2025 (Forecast)</TableCell>
                      <TableCell>$781,100</TableCell>
                      <TableCell>$527,200</TableCell>
                      <TableCell>$253,900</TableCell>
                      <TableCell>$590,200</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Adjust Forecast
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Components</CardTitle>
          <CardDescription>Breakdown of cash inflows and outflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Cash Inflows</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Sales Revenue</TableCell>
                      <TableCell>$42,500</TableCell>
                      <TableCell>89.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Service Fees</TableCell>
                      <TableCell>$2,800</TableCell>
                      <TableCell>5.9%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Interest Income</TableCell>
                      <TableCell>$850</TableCell>
                      <TableCell>1.8%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Other Income</TableCell>
                      <TableCell>$1,450</TableCell>
                      <TableCell>3.0%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Cash Outflows</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Inventory Purchases</TableCell>
                      <TableCell>$18,400</TableCell>
                      <TableCell>54.6%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Payroll</TableCell>
                      <TableCell>$9,800</TableCell>
                      <TableCell>29.1%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Rent & Utilities</TableCell>
                      <TableCell>$3,200</TableCell>
                      <TableCell>9.5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Marketing</TableCell>
                      <TableCell>$1,500</TableCell>
                      <TableCell>4.5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Other Expenses</TableCell>
                      <TableCell>$800</TableCell>
                      <TableCell>2.3%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
