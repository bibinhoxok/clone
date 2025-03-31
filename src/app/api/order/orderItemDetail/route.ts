import { connectDB } from '@/lib/mongodb';
import { z } from "zod";
import { zOrderDetailSchemaUdate } from "@/schemas/orderDetailSchema";
import { zProductSchemaUdate } from "@/schemas/productSchema";
import { zCategorySchemaUdate } from "@/schemas/categorySchema";
import { zOrderSchemaUdate } from "@/schemas/orderSchema";
import OrderModel from '@/models/order';
import OrderDetailModel from '@/models/orderDetail';
import ProductModel from '@/models/product';
import CategoryModel from '@/models/category';

interface OrderItemDetail {
  order_detail_id: string; // ID of the OrderDetail
  product_id: string; // ID of the Product
  product_name: string;
  product_image_url: string;
  product_category_id: string;
  product_category_name: string;
  quantity: number;
  price: number;
  total_price: number; // price * quantity
  discounted_amount: number;
}

interface OrderItemDetailResponse {
  order_id: string;
  order_details: OrderItemDetail[];
  status: string;
  payment_method: string;
  total_amount: number;
  final_amount: number;
}

const GET = async (req: Request) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return new Response(JSON.stringify({ message: "orderId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const parsedOrder = zOrderSchemaUdate.safeParse(order);
    if (!parsedOrder.success) {
      console.error("Error parsing order:", parsedOrder.error);
      return new Response(JSON.stringify({ message: "Error parsing order" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const orderDetails = await OrderDetailModel.find({ order_id: orderId });
    if (!orderDetails) {
      return new Response(JSON.stringify({ message: "Order details not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const parsedOrderDetails = z.array(zOrderDetailSchemaUdate).safeParse(orderDetails);
    if (!parsedOrderDetails.success) {
      console.error("Error parsing order details:", parsedOrderDetails.error);
      return new Response(JSON.stringify({ message: "Error parsing order details" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const productIds = orderDetails.map((item) => item.product_id);
    const products = await ProductModel.find({ _id: { $in: productIds } });
    if (!products) {
      return new Response(JSON.stringify({ message: "Products not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const parsedProducts = z.array(zProductSchemaUdate).safeParse(products);
    if (!parsedProducts.success) {
      console.error("Error parsing products:", parsedProducts.error);
      return new Response(JSON.stringify({ message: "Error parsing products" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const categoryIds = products.map((product) => product.category_id);
    const categories = await CategoryModel.find({ _id: { $in: categoryIds } });
    if (!categories) {
      return new Response(JSON.stringify({ message: "Categories not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const parsedCategories = z.array(zCategorySchemaUdate).safeParse(categories);
    if (!parsedCategories.success) {
      console.error("Error parsing categories:", parsedCategories.error);
      return new Response(JSON.stringify({ message: "Error parsing categories" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const orderItemDetails: OrderItemDetail[] = orderDetails.map((orderDetail) => {
      const product = products.find((p) => p._id.toString() === orderDetail.product_id.toString());
      const category = categories.find((c) => c._id.toString() === product?.category_id.toString());
      return {
        order_detail_id: orderDetail._id.toString(),
        product_id: product?._id.toString() || "",
        product_name: product?.name || "",
        product_image_url: product?.image_url || "",
        product_category_id: category?._id.toString() || "",
        product_category_name: category?.name || "",
        quantity: orderDetail.quantity,
        price: orderDetail.price,
        total_price: orderDetail.price * orderDetail.quantity,
        discounted_amount: parsedOrder.data.discounted_amount,
      };
    });

    const response: OrderItemDetailResponse = {
      order_id: parsedOrder.data._id.toString(),
      order_details: orderItemDetails,
      status: parsedOrder.data.status,
      payment_method: parsedOrder.data.payment_method,
      total_amount: parsedOrder.data.total_amount,
      final_amount: parsedOrder.data.final_amount,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching order item details:", error);
    return new Response(JSON.stringify({ message: "Error fetching order item details" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export { GET };
