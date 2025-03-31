import { Suspense } from "react";
import CustomerList from "./components/CustomerList";
import SearchBar from "./components/SearchBar";

export default function CustomersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <SearchBar />
      <Suspense fallback={<div>Loading customers...</div>}>
        <CustomerList />
      </Suspense>
    </div>
  );
}
