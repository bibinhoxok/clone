import CustomerCard from "./CustomerCard";

async function getCustomers() {
  // This is a placeholder for actual data fetching
  // In a real application, you would fetch this data from an API or database
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  return [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "active" as "active",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      status: "inactive" as "inactive",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      status: "active" as "active",
    },
  ];
}

export default async function CustomerList() {
  const customers = await getCustomers();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </div>
  );
}
