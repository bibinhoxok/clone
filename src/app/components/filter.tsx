"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const filters = [
  { id: "categories", label: "Categories", options: ["Electronics", "Clothing", "Home", "Books"] },
  { id: "size", label: "Select Size", options: ["S", "M", "L", "XL"] },
  { id: "color", label: "Select Color", options: ["Red", "Blue", "Green", "Black"] },
  { id: "price", label: "Pricing Range", options: ["$0 - $50", "$50 - $100", "$100 - $200", "$200+"] },
  { id: "rating", label: "Select Rating", options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"] },
];

export default function FilterSection() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<{ [key: string]: string }>({});

  const toggleFilter = (id: string) => {
    setOpenFilter((prev) => (prev === id ? null : id)); // Toggle visibility of options
  };

  const handleSelectOption = (filterId: string, option: string) => {
    setSelectedOption((prev) => ({ ...prev, [filterId]: option }));
    setOpenFilter(null); // Close the dropdown after selection
  };

  return (
    <div className="w-64 space-y-4">
      <div className="flex justify-between items-center bg-[#2a2a2a] p-4 rounded-lg">
        <span className="font-medium">Filter</span>
        <Button variant="secondary" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          Reset
        </Button>
      </div>

      {filters.map((filter) => (
        <div key={filter.id} className="w-full bg-[#2a2a2a] rounded-lg">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleFilter(filter.id)}
          >
            <span className="block">{filter.label}</span>
            <ChevronDown className="w-4 h-4" />
          </div>

          {openFilter === filter.id && (
            <div className="p-4">
              <div className="space-y-2">
                {filter.options.map((option, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 bg-[#3a3a3a] rounded text-white hover:bg-[#4a4a4a] transition-colors"
                    onClick={() => handleSelectOption(filter.id, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedOption[filter.id] && (
            <div className="p-4 text-gray-400">
              <strong>Selected:</strong> {selectedOption[filter.id]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
