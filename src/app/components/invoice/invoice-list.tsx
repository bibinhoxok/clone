import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Download, Send, Trash2 } from "lucide-react";

const invoices = [
  {
    id: 1,
    name: "Ryan MacLeod",
    product: "Ke Arrow Silicon",
    address: "2211 Jones Avenue, Winston Salem FL 27107",
    amount: "$5500",
    date: "23 Feb, 2021",
  },
  {
    id: 2,
    name: "Penelope Stewart",
    product: "Kronos Minimalist",
    address: "3154 Sampson Street, Aurora CT 80014",
    amount: "$433",
    date: "14 Apr, 2021",
  },
  {
    id: 3,
    name: "Diane Slater",
    product: "Mechanical Watch",
    address: "49 Stamford Road, West Chicago, IL 60185",
    amount: "$255",
    date: "16 Mar, 2021",
  },
  {
    id: 4,
    name: "Amy Mills",
    product: "Engraved Black Alloy",
    address: "2698 Northumberland, Melbourne, FL 32904",
    amount: "$555",
    date: "17 Mar, 2021",
  },
];

export default function InvoiceList() {
  return (
    <div className="space-y-4 bg-black p-6 min-h-screen">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border border-gray-700 bg-gray-800 flex items-center justify-center">
                <span className="text-lg font-semibold text-white">{invoice.name[0]}</span>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{invoice.name}</h3>
                <p className="text-sm text-gray-300">{invoice.product}</p>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-300">{invoice.address}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">{invoice.amount}</p>
              <p className="text-sm text-gray-300">Date on: {invoice.date}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-white border-gray-700 text-black hover:bg-gray-800 hover:text-white">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white border-gray-700 text-black hover:bg-gray-800 hover:text-blue-500">
                <Send className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white border-gray-700 text-black hover:bg-red-900/20 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
