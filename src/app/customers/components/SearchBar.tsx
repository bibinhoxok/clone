"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    // In a real application, you would trigger a search here
    console.log("Searching for:", event.target.value);
  };

  return (
    <div className="mb-6">
      <Input
        type="text"
        placeholder="Search customers..."
        value={search}
        onChange={handleSearch}
        className="max-w-sm"
      />
    </div>
  );
}
