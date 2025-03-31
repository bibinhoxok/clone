"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  registerDay: string;
  email: string;
  phone: string;
  country: string;
  totalOrder: number;
  status: "active" | "inactive";
};

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    registerDay: "2023-01-15",
    email: "john@example.com",
    phone: "+1234567890",
    country: "USA",
    totalOrder: 5,
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    registerDay: "2023-02-20",
    email: "jane@example.com",
    phone: "+1987654321",
    country: "Canada",
    totalOrder: 3,
    status: "inactive",
  },
  {
    id: "3",
    name: "Bob Johnson",
    registerDay: "2023-03-10",
    email: "bob@example.com",
    phone: "+1122334455",
    country: "UK",
    totalOrder: 7,
    status: "active",
  },
  {
    id: "4",
    name: "Alice Brown",
    registerDay: "2023-04-05",
    email: "alice@example.com",
    phone: "+1555666777",
    country: "Australia",
    totalOrder: 2,
    status: "active",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    registerDay: "2023-05-01",
    email: "charlie@example.com",
    phone: "+1999888777",
    country: "Germany",
    totalOrder: 4,
    status: "inactive",
  },
];

export function CustomerTable() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    const sortedCustomers = [...customers].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setCustomers(sortedCustomers);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log("Edit customer with id:", id);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("id")}>
                ID {sortField === "id" && (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("name")}>
                Name{" "}
                {sortField === "name" && (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("registerDay")}>
                Register Day{" "}
                {sortField === "registerDay" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("email")}>
                Email{" "}
                {sortField === "email" && (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("phone")}>
                Phone{" "}
                {sortField === "phone" && (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("country")}>
                Country{" "}
                {sortField === "country" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("totalOrder")}>
                Total Order{" "}
                {sortField === "totalOrder" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("status")}>
                Status{" "}
                {sortField === "status" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.registerDay}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.country}</TableCell>
              <TableCell>{customer.totalOrder}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    customer.status === "active"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {customer.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(customer.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(customer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
