import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CustomerOrders from "../components/CustomerOrder";

interface Address {
  blockNumber: string;
  address: string;
  pincode: string;
  phone: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  phone: string;
  address: string;
  deliveryAddress: Address;
  billingAddress: Address;
}

async function getCustomer(id: string): Promise<Customer | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  const customers = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "active" as "active",
      phone: "123-456-7890",
      address: "123 Main St, Anytown, USA",
      deliveryAddress: {
        blockNumber: "A-510",
        address: "81 Fulton London",
        pincode: "385467",
        phone: "202-458-4568",
      },
      billingAddress: {
        blockNumber: "A-510",
        address: "81 Fulton London",
        pincode: "385467",
        phone: "202-458-4568",
      },
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      status: "inactive" as "inactive",
      phone: "098-765-4321",
      address: "456 Oak Ave, Somewhere, USA",
      deliveryAddress: {
        blockNumber: "B-320",
        address: "21 Elm St, Gotham City",
        pincode: "982345",
        phone: "404-789-1234",
      },
      billingAddress: {
        blockNumber: "B-320",
        address: "21 Elm St, Gotham City",
        pincode: "982345",
        phone: "404-789-1234",
      },
    },
  ];
  return customers.find((c) => c.id === id);
}

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const customer = await getCustomer(params.id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/customers" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </Link>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{customer.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p>{customer.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p>{customer.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p>{customer.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge
                variant={customer.status === "active" ? "default" : "secondary"}
              >
                {customer.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery and Billing Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Delivery Address */}
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Block Number:</strong>{" "}
              {customer.deliveryAddress.blockNumber}
            </p>
            <p>
              <strong>Address:</strong> {customer.deliveryAddress.address}
            </p>
            <p>
              <strong>Pincode:</strong> {customer.deliveryAddress.pincode}
            </p>
            <p>
              <strong>Phone:</strong> {customer.deliveryAddress.phone}
            </p>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Billing Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Block Number:</strong>{" "}
              {customer.billingAddress.blockNumber}
            </p>
            <p>
              <strong>Address:</strong> {customer.billingAddress.address}
            </p>
            <p>
              <strong>Pincode:</strong> {customer.billingAddress.pincode}
            </p>
            <p>
              <strong>Phone:</strong> {customer.billingAddress.phone}
            </p>
          </CardContent>
        </Card>
      </div>

      <CustomerOrders customerId={customer.id} />
    </div>
  );
}
