import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
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

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
