"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash, Pencil } from "lucide-react";

interface CartItem {
  id: number;
  image: string;
  name: string;
  preOrder: string;
  quantity: number;
  price: number;
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, image: "/placeholder.svg", name: "Oculus VR", preOrder: "Pr-1204", quantity: 1, price: 149.0 },
    { id: 2, image: "/placeholder.svg", name: "Wall Clock", preOrder: "Pr-1004", quantity: 1, price: 399.0 },
    { id: 3, image: "/placeholder.svg", name: "Note Diaries", preOrder: "Pr-1224", quantity: 1, price: 149.0 },
    { id: 4, image: "/placeholder.svg", name: "Flower Pot", preOrder: "Pr-1414", quantity: 1, price: 399.0 },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 12.0;
  const discount = 10.0;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost - discount + tax;

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-semibold mb-4">Cart Detail</h2>

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium">Order Summary</h3>
          <Separator className="my-4" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>PRODUCT IMAGE</TableCell>
                <TableCell>PRODUCT NAME</TableCell>
                <TableCell>PRE-ORDER</TableCell>
                <TableCell>QUANTITY</TableCell>
                <TableCell>PRICE</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-[50px] h-[50px] rounded-lg bg-gray-300 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.opacity = "0")}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.preOrder}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = Number.parseInt(e.target.value);
                        if (newQuantity > 0) {
                          setCartItems(cartItems.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem)));
                        }
                      }}
                      className="w-16"
                    />
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" className="mr-2">
                      <Pencil size={16} />
                    </Button>
                    <Button variant="destructive" size="icon">
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <div>
              <p>Apply Coupon to get discount!</p>
              <div className="flex items-center mt-2">
                <Input placeholder="Coupon Code" className="mr-2" />
                <Button>Apply</Button>
              </div>
            </div>
            <div>
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Shipping: ${shippingCost.toFixed(2)}</p>
              <p>Discount: -${discount.toFixed(2)}</p>
              <p>Tax (18%): ${tax.toFixed(2)}</p>
              <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={() => (window.location.href = "/guest/skinstore-page")}>Continue Shopping</Button>
            <Button onClick={() => (window.location.href = "/guest/checkout")}>Proceed to Checkout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
