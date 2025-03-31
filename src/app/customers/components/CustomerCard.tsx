import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
}

export default function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{customer.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{customer.email}</p>
        <Badge variant={customer.status === "active" ? "default" : "secondary"}>
          {customer.status}
        </Badge>
      </CardContent>
    </Card>
  );
}
