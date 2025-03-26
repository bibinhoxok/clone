import { CustomerTable } from "./customer-table";
import { AddCustomerForm } from "./add-customer-form";

export default function CustomersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      <AddCustomerForm />
      <CustomerTable />
    </div>
  );
}
