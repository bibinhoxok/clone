import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  item: string;
  paymentInfo: string;
  orderDate: string;
  price: number;
  status: "pending" | "shipped" | "delivered";
}

async function getCustomerOrders(customerId: string): Promise<Order[]> {
  // Giả lập dữ liệu đơn hàng
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
  return [
    {
      id: "1",
      item: "Wireless Headphones",
      paymentInfo: "Credit Card",
      orderDate: "2023-12-01",
      price: 125.0,
      status: "delivered",
    },
    {
      id: "2",
      item: "Smartwatch",
      paymentInfo: "PayPal",
      orderDate: "2023-12-10",
      price: 75.5,
      status: "shipped",
    },
    {
      id: "3",
      item: "Gaming Mouse",
      paymentInfo: "Debit Card",
      orderDate: "2023-12-20",
      price: 50.0,
      status: "pending",
    },
  ];
}

export default async function CustomerOrders({
  customerId,
}: {
  customerId: string;
}) {
  const orders = await getCustomerOrders(customerId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Payment Info</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.item}</TableCell>
                <TableCell>{order.paymentInfo}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>${order.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "default"
                        : order.status === "shipped"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
