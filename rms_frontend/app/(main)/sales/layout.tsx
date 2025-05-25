import { SalesProvider } from "@/context/sales-context";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SalesProvider>{children}</SalesProvider>;
}
