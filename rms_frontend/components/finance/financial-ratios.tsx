import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart } from "@/components/ui/chart"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FinancialRatios() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Financial Ratios Analysis</CardTitle>
          <CardDescription>Key financial ratios to evaluate business performance and financial health</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="liquidity" className="space-y-4">
            <TabsList className="grid grid-cols-4 gap-4">
              <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
              <TabsTrigger value="profitability">Profitability</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="solvency">Solvency</TabsTrigger>
            </TabsList>

            <TabsContent value="liquidity" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Liquidity Ratios</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Liquidity ratios measure your business's ability to pay off short-term debts as they come
                              due.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ratio</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Industry Avg</TableHead>
                          <TableHead>Formula</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Current Ratio</TableCell>
                          <TableCell>2.4</TableCell>
                          <TableCell>2.0</TableCell>
                          <TableCell>
                            <code className="text-xs">Current Assets / Current Liabilities</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Quick Ratio</TableCell>
                          <TableCell>1.8</TableCell>
                          <TableCell>1.5</TableCell>
                          <TableCell>
                            <code className="text-xs">(Current Assets - Inventory) / Current Liabilities</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Cash Ratio</TableCell>
                          <TableCell>0.9</TableCell>
                          <TableCell>0.8</TableCell>
                          <TableCell>
                            <code className="text-xs">Cash / Current Liabilities</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Working Capital</TableCell>
                          <TableCell>$124,500</TableCell>
                          <TableCell>$100,000</TableCell>
                          <TableCell>
                            <code className="text-xs">Current Assets - Current Liabilities</code>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Liquidity Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={[
                        { month: "Jan", "Current Ratio": 2.1, "Quick Ratio": 1.5, "Cash Ratio": 0.7 },
                        { month: "Feb", "Current Ratio": 2.2, "Quick Ratio": 1.6, "Cash Ratio": 0.8 },
                        { month: "Mar", "Current Ratio": 2.3, "Quick Ratio": 1.7, "Cash Ratio": 0.8 },
                        { month: "Apr", "Current Ratio": 2.3, "Quick Ratio": 1.7, "Cash Ratio": 0.8 },
                        { month: "May", "Current Ratio": 2.4, "Quick Ratio": 1.8, "Cash Ratio": 0.9 },
                        { month: "Jun", "Current Ratio": 2.4, "Quick Ratio": 1.8, "Cash Ratio": 0.9 },
                      ]}
                      index="month"
                      categories={["Current Ratio", "Quick Ratio", "Cash Ratio"]}
                      colors={["emerald", "blue", "amber"]}
                      valueFormatter={(value) => value.toFixed(1)}
                      yAxisWidth={30}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profitability" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Profitability Ratios</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Profitability ratios measure your business's ability to generate earnings relative to
                              revenue, assets, and equity.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ratio</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Industry Avg</TableHead>
                          <TableHead>Formula</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Gross Profit Margin</TableCell>
                          <TableCell>38.2%</TableCell>
                          <TableCell>35.0%</TableCell>
                          <TableCell>
                            <code className="text-xs">(Revenue - COGS) / Revenue</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Net Profit Margin</TableCell>
                          <TableCell>27.1%</TableCell>
                          <TableCell>25.0%</TableCell>
                          <TableCell>
                            <code className="text-xs">Net Income / Revenue</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Return on Assets (ROA)</TableCell>
                          <TableCell>18.4%</TableCell>
                          <TableCell>15.0%</TableCell>
                          <TableCell>
                            <code className="text-xs">Net Income / Total Assets</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Return on Equity (ROE)</TableCell>
                          <TableCell>24.6%</TableCell>
                          <TableCell>20.0%</TableCell>
                          <TableCell>
                            <code className="text-xs">Net Income / Shareholders' Equity</code>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Profitability Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={[
                        { month: "Jan", "Gross Margin": 36.5, "Net Margin": 24.8 },
                        { month: "Feb", "Gross Margin": 36.8, "Net Margin": 25.2 },
                        { month: "Mar", "Gross Margin": 37.1, "Net Margin": 25.7 },
                        { month: "Apr", "Gross Margin": 37.5, "Net Margin": 26.1 },
                        { month: "May", "Gross Margin": 37.9, "Net Margin": 26.5 },
                        { month: "Jun", "Gross Margin": 38.2, "Net Margin": 27.1 },
                      ]}
                      index="month"
                      categories={["Gross Margin", "Net Margin"]}
                      colors={["emerald", "blue"]}
                      valueFormatter={(value) => `${value}%`}
                      yAxisWidth={40}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="efficiency" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Efficiency Ratios</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Efficiency ratios measure how effectively your business uses its assets and manages its
                              operations.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ratio</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Industry Avg</TableHead>
                          <TableHead>Formula</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Inventory Turnover</TableCell>
                          <TableCell>5.2</TableCell>
                          <TableCell>6.0</TableCell>
                          <TableCell>
                            <code className="text-xs">COGS / Average Inventory</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Days Inventory Outstanding</TableCell>
                          <TableCell>70.2 days</TableCell>
                          <TableCell>60.0 days</TableCell>
                          <TableCell>
                            <code className="text-xs">365 / Inventory Turnover</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Accounts Receivable Turnover</TableCell>
                          <TableCell>8.4</TableCell>
                          <TableCell>8.0</TableCell>
                          <TableCell>
                            <code className="text-xs">Net Credit Sales / Average Accounts Receivable</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Days Sales Outstanding</TableCell>
                          <TableCell>43.5 days</TableCell>
                          <TableCell>45.0 days</TableCell>
                          <TableCell>
                            <code className="text-xs">365 / Accounts Receivable Turnover</code>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Efficiency Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={[
                        { month: "Jan", "Inventory Turnover": 4.8, "AR Turnover": 7.9 },
                        { month: "Feb", "Inventory Turnover": 4.9, "AR Turnover": 8.0 },
                        { month: "Mar", "Inventory Turnover": 5.0, "AR Turnover": 8.1 },
                        { month: "Apr", "Inventory Turnover": 5.0, "AR Turnover": 8.2 },
                        { month: "May", "Inventory Turnover": 5.1, "AR Turnover": 8.3 },
                        { month: "Jun", "Inventory Turnover": 5.2, "AR Turnover": 8.4 },
                      ]}
                      index="month"
                      categories={["Inventory Turnover", "AR Turnover"]}
                      colors={["emerald", "blue"]}
                      valueFormatter={(value) => value.toFixed(1)}
                      yAxisWidth={30}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="solvency" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Solvency Ratios</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Solvency ratios measure your business's ability to meet long-term obligations and assess
                              financial stability.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ratio</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Industry Avg</TableHead>
                          <TableHead>Formula</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Debt to Equity</TableCell>
                          <TableCell>0.65</TableCell>
                          <TableCell>0.80</TableCell>
                          <TableCell>
                            <code className="text-xs">Total Debt / Shareholders' Equity</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Debt Ratio</TableCell>
                          <TableCell>0.39</TableCell>
                          <TableCell>0.45</TableCell>
                          <TableCell>
                            <code className="text-xs">Total Debt / Total Assets</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Interest Coverage</TableCell>
                          <TableCell>8.2</TableCell>
                          <TableCell>6.0</TableCell>
                          <TableCell>
                            <code className="text-xs">EBIT / Interest Expense</code>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Equity Multiplier</TableCell>
                          <TableCell>1.65</TableCell>
                          <TableCell>1.80</TableCell>
                          <TableCell>
                            <code className="text-xs">Total Assets / Shareholders' Equity</code>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Solvency Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={[
                        { month: "Jan", "Debt to Equity": 0.7, "Debt Ratio": 0.42 },
                        { month: "Feb", "Debt to Equity": 0.69, "Debt Ratio": 0.41 },
                        { month: "Mar", "Debt to Equity": 0.68, "Debt Ratio": 0.41 },
                        { month: "Apr", "Debt to Equity": 0.67, "Debt Ratio": 0.4 },
                        { month: "May", "Debt to Equity": 0.66, "Debt Ratio": 0.4 },
                        { month: "Jun", "Debt to Equity": 0.65, "Debt Ratio": 0.39 },
                      ]}
                      index="month"
                      categories={["Debt to Equity", "Debt Ratio"]}
                      colors={["emerald", "blue"]}
                      valueFormatter={(value) => value.toFixed(2)}
                      yAxisWidth={30}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
