import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  MinusCircle,
  History,
  Download,
  Filter,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface CustomerCreditProps {
  customerId?: string;
  customerName?: string;
}

export function CustomerCredit({
  customerId,
  customerName = "John Doe",
}: CustomerCreditProps) {
  // Mock data - in a real app, this would be fetched based on customerId
  const creditBalance = 150.0;
  const creditLimit = 1000.0;
  const creditHistory = [
    {
      date: "2023-05-01",
      type: "Purchase",
      amount: -75.0,
      balance: 150.0,
      note: "Partial payment for order #1234",
      status: "completed",
    },
    {
      date: "2023-04-25",
      type: "Payment",
      amount: 100.0,
      balance: 225.0,
      note: "Cash payment",
      status: "completed",
    },
    {
      date: "2023-04-20",
      type: "Purchase",
      amount: -150.0,
      balance: 125.0,
      note: "Store credit for order #1189",
      status: "completed",
    },
    {
      date: "2023-04-15",
      type: "Payment",
      amount: 125.0,
      balance: 275.0,
      note: "Bank transfer",
      status: "completed",
    },
  ];

  const creditUtilization = (creditBalance / creditLimit) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Customer Credit</CardTitle>
            <CardDescription>
              Manage credit balance and payment history for {customerName}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export History
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${creditBalance.toFixed(2)}
                  <Badge
                    variant={creditBalance > 0 ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {creditBalance > 0 ? "Credit" : "Due"}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Credit Limit</span>
                    <span>${creditLimit.toFixed(2)}</span>
                  </div>
                  <Progress value={creditUtilization} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Payment Due
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-sm text-muted-foreground mt-1">
                  No payment due
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(creditLimit - creditBalance).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Remaining credit limit
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Credit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Credit</DialogTitle>
                    <DialogDescription>
                      Add credit to customer account. This will increase their
                      available balance.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="note">Note</Label>
                      <Input id="note" placeholder="Payment details" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Credit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MinusCircle className="mr-2 h-4 w-4" />
                    Apply Charge
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply Charge</DialogTitle>
                    <DialogDescription>
                      Apply a charge to the customer account. This will decrease
                      their available balance.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="charge-amount">Amount</Label>
                      <Input
                        id="charge-amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="charge-type">Charge Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select charge type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="charge-note">Note</Label>
                      <Input id="charge-note" placeholder="Charge details" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Apply Charge</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <History className="mr-2 h-4 w-4" />
                Full History
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Payment Schedule
              </Button>
            </div>
          </div>

          <Tabs defaultValue="recent" className="w-full">
            <TabsList>
              <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
              <TabsTrigger value="all">All History</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="charges">Charges</TabsTrigger>
            </TabsList>

            <TabsContent value="recent">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditHistory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.type === "Payment" ? "default" : "secondary"
                            }
                          >
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={
                            item.amount < 0 ? "text-red-500" : "text-green-500"
                          }
                        >
                          {item.amount < 0 ? "-" : "+"}$
                          {Math.abs(item.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>${item.balance.toFixed(2)}</TableCell>
                        <TableCell>{item.note}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
