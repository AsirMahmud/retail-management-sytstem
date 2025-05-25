"use client"

import { useState } from "react"
import { Calculator, Copy, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FinancialEquations() {
  const [profitabilityInputs, setProfitabilityInputs] = useState({
    revenue: 100000,
    cogs: 60000,
    operatingExpenses: 20000,
    totalAssets: 150000,
    shareholderEquity: 80000,
    interestExpense: 5000,
    taxes: 3000,
  })

  const [liquidityInputs, setLiquidityInputs] = useState({
    currentAssets: 50000,
    inventory: 20000,
    currentLiabilities: 30000,
    cashAndEquivalents: 15000,
    accountsReceivable: 10000,
  })

  const [efficiencyInputs, setEfficiencyInputs] = useState({
    sales: 100000,
    averageInventory: 25000,
    accountsReceivable: 10000,
    accountsPayable: 15000,
    costOfGoodsSold: 60000,
    totalAssets: 150000,
    fixedAssets: 80000,
  })

  const [leverageInputs, setLeverageInputs] = useState({
    totalDebt: 70000,
    totalAssets: 150000,
    shareholderEquity: 80000,
    ebit: 20000,
    interestExpense: 5000,
  })

  const [valuationInputs, setValuationInputs] = useState({
    netIncome: 15000,
    outstandingShares: 10000,
    marketPricePerShare: 25,
    dividendsPerShare: 1.5,
    bookValue: 80000,
  })

  // Calculate profitability ratios
  const grossProfitMargin = ((profitabilityInputs.revenue - profitabilityInputs.cogs) / profitabilityInputs.revenue * 100).toFixed(2)
  const operatingProfitMargin = ((profitabilityInputs.revenue - profitabilityInputs.cogs - profitabilityInputs.operatingExpenses) / profitabilityInputs.revenue * 100).toFixed(2)
  const netProfitMargin = ((profitabilityInputs.revenue - profitabilityInputs.cogs - profitabilityInputs.operatingExpenses - profitabilityInputs.interestExpense - profitabilityInputs.taxes) / profitabilityInputs.revenue * 100).toFixed(2)
  const returnOnAssets = ((profitabilityInputs.revenue - profitabilityInputs.cogs - profitabilityInputs.operatingExpenses - profitabilityInputs.interestExpense - profitabilityInputs.taxes) / profitabilityInputs.totalAssets * 100).toFixed(2)
  const returnOnEquity = ((profitabilityInputs.revenue - profitabilityInputs.cogs - profitabilityInputs.operatingExpenses - profitabilityInputs.interestExpense - profitabilityInputs.taxes) / profitabilityInputs.shareholderEquity * 100).toFixed(2)
  
  // Calculate liquidity ratios
  const currentRatio = (liquidityInputs.currentAssets / liquidityInputs.currentLiabilities).toFixed(2)
  const quickRatio = ((liquidityInputs.currentAssets - liquidityInputs.inventory) / liquidityInputs.currentLiabilities).toFixed(2)
  const cashRatio = (liquidityInputs.cashAndEquivalents / liquidityInputs.currentLiabilities).toFixed(2)
  const workingCapital = (liquidityInputs.currentAssets - liquidityInputs.currentLiabilities).toFixed(2)
  
  // Calculate efficiency ratios
  const inventoryTurnover = (efficiencyInputs.costOfGoodsSold / efficiencyInputs.averageInventory).toFixed(2)
  const daysInventoryOutstanding = (365 / Number(inventoryTurnover)).toFixed(0)
  const receivablesTurnover = (efficiencyInputs.sales / efficiencyInputs.accountsReceivable).toFixed(2)
  const daysReceivablesOutstanding = (365 / Number(receivablesTurnover)).toFixed(0)
  const payablesTurnover = (efficiencyInputs.costOfGoodsSold / efficiencyInputs.accountsPayable).toFixed(2)
  const daysPayablesOutstanding = (365 / Number(payablesTurnover)).toFixed(0)
  const assetTurnover = (efficiencyInputs.sales / efficiencyInputs.totalAssets).toFixed(2)
  const fixedAssetTurnover = (efficiencyInputs.sales / efficiencyInputs.fixedAssets).toFixed(2)
  
  // Calculate leverage ratios
  const debtRatio = (leverageInputs.totalDebt / leverageInputs.totalAssets).toFixed(2)
  const debtToEquityRatio = (leverageInputs.totalDebt / leverageInputs.shareholderEquity).toFixed(2)
  const equityMultiplier = (leverageInputs.totalAssets / leverageInputs.shareholderEquity).toFixed(2)
  const interestCoverageRatio = (leverageInputs.ebit / leverageInputs.interestExpense).toFixed(2)
  
  // Calculate valuation ratios
  const earningsPerShare = (valuationInputs.netIncome / valuationInputs.outstandingShares).toFixed(2)
  const priceToEarningsRatio = (valuationInputs.marketPricePerShare / Number(earningsPerShare)).toFixed(2)
  const dividendYield = (valuationInputs.dividendsPerShare / valuationInputs.marketPricePerShare * 100).toFixed(2)
  const bookValuePerShare = (valuationInputs.bookValue / valuationInputs.outstandingShares).toFixed(2)
  const priceToBookRatio = (valuationInputs.marketPricePerShare / Number(bookValuePerShare)).toFixed(2)

  const handleProfitabilityChange = (field, value) => {
    setProfitabilityInputs({
      ...profitabilityInputs,
      [field]: Number(value),
    })
  }

  const handleLiquidityChange = (field, value) => {
    setLiquidityInputs({
      ...liquidityInputs,
      [field]: Number(value),
    })
  }

  const handleEfficiencyChange = (field, value) => {
    setEfficiencyInputs({
      ...efficiencyInputs,
      [field]: Number(value),
    })
  }

  const handleLeverageChange = (field, value) => {
    setLeverageInputs({
      ...leverageInputs,
      [field]: Number(value),
    })
  }

  const handleValuationChange = (field, value) => {
    setValuationInputs({
      ...valuationInputs,
      [field]: Number(value),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Equations</h2>
          <p className="text-muted-foreground">Calculate key financial metrics and ratios</p>
        </div>
        <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
          <Calculator className="mr-2 h-4 w-4" />
          Save Calculations
        </Button>
      </div>

      <Tabs defaultValue="profitability" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="leverage">Leverage</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
        </TabsList>

        <TabsContent value="profitability">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Ratios</CardTitle>
              <CardDescription>Measure the ability to generate profit relative to revenue, assets, and equity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Revenue ($)</Label>
                    <Input 
                      id="revenue" 
                      type="number" 
                      value={profitabilityInputs.revenue} 
                      onChange={(e) => handleProfitabilityChange('revenue', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cogs">Cost of Goods Sold ($)</Label>
                    <Input 
                      id="cogs" 
                      type="number" 
                      value={profitabilityInputs.cogs} 
                      onChange={(e) => handleProfitabilityChange('cogs', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatingExpenses">Operating Expenses ($)</Label>
                    <Input 
                      id="operatingExpenses" 
                      type="number" 
                      value={profitabilityInputs.operatingExpenses} 
                      onChange={(e) => handleProfitabilityChange('operatingExpenses', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestExpense">Interest Expense ($)</Label>
                    <Input 
                      id="interestExpense" 
                      type="number" 
                      value={profitabilityInputs.interestExpense} 
                      onChange={(e) => handleProfitabilityChange('interestExpense', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxes">Taxes ($)</Label>
                    <Input 
                      id="taxes" 
                      type="number" 
                      value={profitabilityInputs.taxes} 
                      onChange={(e) => handleProfitabilityChange('taxes', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalAssets">Total Assets ($)</Label>
                    <Input 
                      id="totalAssets" 
                      type="number" 
                      value={profitabilityInputs.totalAssets} 
                      onChange={(e) => handleProfitabilityChange('totalAssets', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shareholderEquity">Shareholder Equity ($)</Label>
                    <Input 
                      id="shareholderEquity" 
                      type="number" 
                      value={profitabilityInputs.shareholderEquity} 
                      onChange={(e) => handleProfitabilityChange('shareholderEquity', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-medium">
                        Gross Profit Margin: {grossProfitMargin}%
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Gross Profit Margin measures the percentage of revenue that exceeds the cost of goods sold.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              (Revenue - Cost of Goods Sold) / Revenue × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = (${profitabilityInputs.revenue.toLocaleString()} - ${profitabilityInputs.cogs.toLocaleString()}) / ${profitabilityInputs.revenue.toLocaleString()} × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {grossProfitMargin}%
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-medium">
                        Operating Profit Margin: {operatingProfitMargin}%
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Operating Profit Margin measures the percentage of revenue that remains after paying for costs of goods sold and operating expenses.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              (Revenue - COGS - Operating Expenses) / Revenue × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = (${profitabilityInputs.revenue.toLocaleString()} - ${profitabilityInputs.cogs.toLocaleString()} - ${profitabilityInputs.operatingExpenses.toLocaleString()}) / ${profitabilityInputs.revenue.toLocaleString()} × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {operatingProfitMargin}%
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-medium">
                        Net Profit Margin: {netProfitMargin}%
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Net Profit Margin measures the percentage of revenue that remains as profit after all expenses are deducted.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              (Revenue - COGS - Operating Expenses - Interest - Taxes) / Revenue × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = (${profitabilityInputs.revenue.toLocaleString()} - ${profitabilityInputs.cogs.toLocaleString()} - ${profitabilityInputs.operatingExpenses.toLocaleString()} - ${profitabilityInputs.interestExpense.toLocaleString()} - ${profitabilityInputs.taxes.toLocaleString()}) / ${profitabilityInputs.revenue.toLocaleString()} × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {netProfitMargin}%
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-medium">
                        Return on Assets (ROA): {returnOnAssets}%
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Return on Assets measures how efficiently a company is using its assets to generate profit.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Net Income / Total Assets × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${(profitabilityInputs.revenue - profitabilityInputs.cogs - profitabilityInputs.operatingExpenses - profitabilityInputs.interestExpense - profitabilityInputs.taxes).toLocaleString()} / ${profitabilityInputs.totalAssets.toLocaleString()} × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {returnOnAssets}%
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-lg font-medium">
                        Return on Equity (ROE): {returnOnEquity}%
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Return on Equity measures how efficiently a company is using its equity to generate profit.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Net Income / Shareholder Equity × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${(profitabilityInputs.revenue - profitabilityInputs.cogs - profitabilityInputs.operatingExpenses - profitabilityInputs.interestExpense - profitabilityInputs.taxes).toLocaleString()} / ${profitabilityInputs.shareholderEquity.toLocaleString()} × 100
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {returnOnEquity}%
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher profitability ratios generally indicate better financial performance.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                Industry benchmarks: Gross Margin 40-45%, Net Margin 15-20%, ROE 15-20%
              </div>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="liquidity">
          <Card>
            <CardHeader>
              <CardTitle>Liquidity Ratios</CardTitle>
              <CardDescription>Measure the ability to pay short-term obligations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAssets">Current Assets ($)</Label>
                    <Input 
                      id="currentAssets" 
                      type="number" 
                      value={liquidityInputs.currentAssets} 
                      onChange={(e) => handleLiquidityChange('currentAssets', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Inventory ($)</Label>
                    <Input 
                      id="inventory" 
                      type="number" 
                      value={liquidityInputs.inventory} 
                      onChange={(e) => handleLiquidityChange('inventory', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentLiabilities">Current Liabilities ($)</Label>
                    <Input 
                      id="currentLiabilities" 
                      type="number" 
                      value={liquidityInputs.currentLiabilities} 
                      onChange={(e) => handleLiquidityChange('currentLiabilities', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cashAndEquivalents">Cash and Cash Equivalents ($)</Label>
                    <Input 
                      id="cashAndEquivalents" 
                      type="number" 
                      value={liquidityInputs.cashAndEquivalents} 
                      onChange={(e) => handleLiquidityChange('cashAndEquivalents', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountsReceivable">Accounts Receivable ($)</Label>
                    <Input 
                      id="accountsReceivable" 
                      type="number" 
                      value={liquidityInputs.accountsReceivable} 
                      onChange={(e) => handleLiquidityChange('accountsReceivable', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-medium">
                        Current Ratio: {currentRatio}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Current Ratio measures a company's ability to pay short-term obligations with its current assets.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Current Assets / Current Liabilities
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${liquidityInputs.currentAssets.toLocaleString()} / ${liquidityInputs.currentLiabilities.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {currentRatio}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-medium">
                        Quick Ratio: {quickRatio}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Quick Ratio (Acid-Test Ratio) measures a company's ability to pay short-term obligations with its most liquid assets.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              (Current Assets - Inventory) / Current Liabilities
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = (${liquidityInputs.currentAssets.toLocaleString()} - ${liquidityInputs.inventory.toLocaleString()}) / ${liquidityInputs.currentLiabilities.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {quickRatio}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-medium">
                        Cash Ratio: {cashRatio}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Cash Ratio measures a company's ability to pay short-term obligations with only cash and cash equivalents.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Cash and Cash Equivalents / Current Liabilities
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${liquidityInputs.cashAndEquivalents.toLocaleString()} / ${liquidityInputs.currentLiabilities.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {cashRatio}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-medium">
                        Working Capital: ${workingCapital}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Working Capital is the difference between current assets and current liabilities, representing the capital available for daily operations.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Current Assets - Current Liabilities
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${liquidityInputs.currentAssets.toLocaleString()} - ${liquidityInputs.currentLiabilities.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${workingCapital}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher liquidity ratios indicate better short-term financial health.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                Industry benchmarks: Current Ratio &gt; 1.5, Quick Ratio &gt; 1.0, Cash Ratio &gt; 0.5
              </div>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Ratios</CardTitle>
              <CardDescription>Measure how efficiently a company uses its assets and manages its operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sales">Sales ($)</Label>
                    <Input 
                      id="sales" 
                      type="number" 
                      value={efficiencyInputs.sales} 
                      onChange={(e) => handleEfficiencyChange('sales', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="averageInventory">Average Inventory ($)</Label>
                    <Input 
                      id="averageInventory" 
                      type="number" 
                      value={efficiencyInputs.averageInventory} 
                      onChange={(e) => handleEfficiencyChange('averageInventory', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountsReceivable">Accounts Receivable ($)</Label>
                    <Input 
                      id="accountsReceivable" 
                      type="number" 
                      value={efficiencyInputs.accountsReceivable} 
                      onChange={(e) => handleEfficiencyChange('accountsReceivable', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountsPayable">Accounts Payable ($)</Label>
                    <Input 
                      id="accountsPayable" 
                      type="number" 
                      value={efficiencyInputs.accountsPayable} 
                      onChange={(e) => handleEfficiencyChange('accountsPayable', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costOfGoodsSold">Cost of Goods Sold ($)</Label>
                    <Input 
                      id="costOfGoodsSold" 
                      type="number" 
                      value={efficiencyInputs.costOfGoodsSold} 
                      onChange={(e) => handleEfficiencyChange('costOfGoodsSold', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalAssets">Total Assets ($)</Label>
                    <Input 
                      id="totalAssets" 
                      type="number" 
                      value={efficiencyInputs.totalAssets} 
                      onChange={(e) => handleEfficiencyChange('totalAssets', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fixedAssets">Fixed Assets ($)</Label>
                    <Input 
                      id="fixedAssets" 
                      type="number" 
                      value={efficiencyInputs.fixedAssets} 
                      onChange={(e) => handleEfficiencyChange('fixedAssets', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-medium">
                        Inventory Turnover: {inventoryTurnover}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Inventory Turnover measures how many times a company's inventory is sold and replaced over a period.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Cost of Goods Sold / Average Inventory
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${efficiencyInputs.costOfGoodsSold.toLocaleString()} / ${efficiencyInputs.averageInventory.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {inventoryTurnover} times per year
                            </p>
                          </div>
                          <p className="text-sm font-medium mt-2">Days Inventory Outstanding: {daysInventoryOutstanding} days</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-medium">
                        Receivables Turnover: {receivablesTurnover}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Receivables Turnover measures how efficiently a company collects revenue from its credit customers.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Sales / Accounts Receivable
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${efficiencyInputs.sales.toLocaleString()} / ${efficiencyInputs.accountsReceivable.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {receivablesTurnover} times per year
                            </p>
                          </div>
                          <p className="text-sm font-medium mt-2">Days Sales Outstanding: {daysReceivablesOutstanding} days</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-medium">
                        Payables Turnover: {payablesTurnover}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Payables Turnover measures how quickly a company pays its suppliers.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Cost of Goods Sold / Accounts Payable
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${efficiencyInputs.costOfGoodsSold.toLocaleString()} / ${efficiencyInputs.accountsPayable.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {payablesTurnover} times per year
                            </p>
                          </div>
                          <p className="text-sm font-medium mt-2">Days Payables Outstanding: {daysPayablesOutstanding} days</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-medium">
                        Asset Turnover: {assetTurnover}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Asset Turnover measures how efficiently a company uses its assets to generate sales.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Sales / Total Assets
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${efficiencyInputs.sales.toLocaleString()} / ${efficiencyInputs.totalAssets.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {assetTurnover}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-lg font-medium">
                        Fixed Asset Turnover: {fixedAssetTurnover}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Fixed Asset Turnover measures how efficiently a company uses its fixed assets to generate sales.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Sales / Fixed Assets
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${efficiencyInputs.sales.toLocaleString()} / ${efficiencyInputs.fixedAssets.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {fixedAssetTurnover}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher efficiency ratios generally indicate better operational performance.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                Industry benchmarks: Inventory Turnover > 6, Receivables Turnover > 8, Asset Turnover > 1
              </div>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="leverage">
          <Card>
            <CardHeader>
              <CardTitle>Leverage Ratios</CardTitle>
              <CardDescription>Measure the level of debt financing and ability to meet financial obligations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalDebt">Total Debt ($)</Label>
                    <Input 
                      id="totalDebt" 
                      type="number" 
                      value={leverageInputs.totalDebt} 
                      onChange={(e) => handleLeverageChange('totalDebt', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalAssets">Total Assets ($)</Label>
                    <Input 
                      id="totalAssets" 
                      type="number" 
                      value={leverageInputs.totalAssets} 
                      onChange={(e) => handleLeverageChange('totalAssets', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shareholderEquity">Shareholder Equity ($)</Label>
                    <Input 
                      id="shareholderEquity" 
                      type="number" 
                      value={leverageInputs.shareholderEquity} 
                      onChange={(e) => handleLeverageChange('shareholderEquity', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ebit">EBIT (Earnings Before Interest & Taxes) ($)</Label>
                    <Input 
                      id="ebit" 
                      type="number" 
                      value={leverageInputs.ebit} 
                      onChange={(e) => handleLeverageChange('ebit', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestExpense">Interest Expense ($)</Label>
                    <Input 
                      id="interestExpense" 
                      type="number" 
                      value={leverageInputs.interestExpense} 
                      onChange={(e) => handleLeverageChange('interestExpense', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-medium">
                        Debt Ratio: {debtRatio}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Debt Ratio measures the proportion of a company's assets that are financed by debt.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Total Debt / Total Assets
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${leverageInputs.totalDebt.toLocaleString()} / ${leverageInputs.totalAssets.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {debtRatio}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-medium">
                        Debt to Equity Ratio: {debtToEquityRatio}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Debt to Equity Ratio compares a company's total debt to its shareholder equity.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Total Debt / Shareholder Equity
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${leverageInputs.totalDebt.toLocaleString()} / ${leverageInputs.shareholderEquity.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {debtToEquityRatio}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-medium">
                        Equity Multiplier: {equityMultiplier}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Equity Multiplier measures the degree to which a company's assets are financed by equity.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Total Assets / Shareholder Equity
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${leverageInputs.totalAssets.toLocaleString()} / ${leverageInputs.shareholderEquity.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {equityMultiplier}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-medium">
                        Interest Coverage Ratio: {interestCoverageRatio}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Interest Coverage Ratio measures a company's ability to pay interest on its debt.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              EBIT / Interest Expense
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${leverageInputs.ebit.toLocaleString()} / ${leverageInputs.interestExpense.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = {interestCoverageRatio}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lower leverage ratios generally indicate less financial risk.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                Industry benchmarks: Debt Ratio < 0.5, Debt to Equity < 1.0, Interest Coverage > 3.0
              </div>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="valuation">
          <Card>
            <CardHeader>
              <CardTitle>Valuation Ratios</CardTitle>
              <CardDescription>Measure the relative value of a company's shares</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="netIncome">Net Income ($)</Label>
                    <Input 
                      id="netIncome" 
                      type="number" 
                      value={valuationInputs.netIncome} 
                      onChange={(e) => handleValuationChange('netIncome', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outstandingShares">Outstanding Shares</Label>
                    <Input 
                      id="outstandingShares" 
                      type="number" 
                      value={valuationInputs.outstandingShares} 
                      onChange={(e) => handleValuationChange('outstandingShares', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marketPricePerShare">Market Price Per Share ($)</Label>
                    <Input 
                      id="marketPricePerShare" 
                      type="number" 
                      value={valuationInputs.marketPricePerShare} 
                      onChange={(e) => handleValuationChange('marketPricePerShare', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dividendsPerShare">Dividends Per Share ($)</Label>
                    <Input 
                      id="dividendsPerShare" 
                      type="number" 
                      value={valuationInputs.dividendsPerShare} 
                      onChange={(e) => handleValuationChange('dividendsPerShare', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookValue">Book Value ($)</Label>
                    <Input 
                      id="bookValue" 
                      type="number" 
                      value={valuationInputs.bookValue} 
                      onChange={(e) => handleValuationChange('bookValue', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-medium">
                        Earnings Per Share (EPS): ${earningsPerShare}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Earnings Per Share measures the portion of a company's profit allocated to each outstanding share of common stock.
                          </p>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="font-mono text-sm">
                              Net Income / Outstanding Shares
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${valuationInputs.netIncome.toLocaleString()} / {valuationInputs.outstandingShares.toLocaleString()}
                            </p>
                            <p className="font-mono text-sm mt-1">
                              = ${earningsPerShare}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-medium">
                        Price to Earnings (P/E) Ratio: {priceToEarningsRatio}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
