"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order } from "@/schemas/orderSchema";
import { Product } from "@/schemas/productSchema";
import { RatingDialog } from "../rating-dialog";

interface OrderItemDetail {
  order_detail_id: string;
  product_id: string;
  product_name: string;
  product_image_url: string;
  product_category_id: string;
  product_category_name: string;
  quantity: number;
  price: number;
}

interface OrderItemDetailResponse {
  order_id: string;
  order_details: OrderItemDetail[];
  status: string;
  payment_method: string;
  total_amount: number;
  final_amount: number;
  discount_amount: number;
  shipping_fee: number;
}

interface OrderItemProps extends Order { customerId: string }

export function OrderItem({ _id, customerId, payment_method, status }: OrderItemProps) {
  const [orderItemDetails, setOrderItemDetails] = useState<
    OrderItemDetailResponse | null
  >(null);

  useEffect(() => {
    const fetchOrderItemDetails = async () => {
      try {
        const response = await fetch(
          `/api/order/orderItemDetail?orderId=${_id}`
        );
        const data = await response.json();
        setOrderItemDetails(data);
      } catch (error) {
        console.error("Error fetching order item details:", error);
      }
    };

    fetchOrderItemDetails();
  }, [_id]);
  const handleRatingSubmit = ()=>{}
  return (
    <>
      {orderItemDetails && orderItemDetails.order_details.length > 0 ? (
        <>
          {orderItemDetails.order_details.map((item) => (
            <div className="flex gap-4" key={item.order_detail_id}>
              <Image
                src={item.product_image_url || "/placeholder.svg"}
                alt={item.product_name}
                width={80}
                height={80}
                className="rounded-md object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2">
                  {item.product_name}
                </h3>
                <p className="text-sm text-muted-foreground">Danh mục: #{item.product_category_name}
                </p>
                <p className="text-sm">Số lượng: {item.quantity}</p>

                <p className="text-sm">
                  Price:{" "}
                  {item.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">
                  {(item.price * item.quantity).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <RatingDialog customerId={customerId} productName="test" productId={item.product_id.toString()} onSubmit={handleRatingSubmit} />
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-muted-foreground">
          Đang tải
        </p>
      )}
    </>
  );
}
