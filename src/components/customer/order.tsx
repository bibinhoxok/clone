"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { Customer } from "@/schemas/customerSchema";
import { ReactNode, useEffect, useState } from "react";
import { Order } from "@/schemas/orderSchema";
import { OrderItem } from "./order/order-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RatingDialog } from "./rating-dialog"
import { RefundDialog } from "./refund-dialog"

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

export function CustomerOrders() {
	const { status, data: session } = useSession();
	const [orders, setOrders] = useState<Order[]>([]);
	const [orderItemDetails, setOrderItemDetails] = useState<
		Record<string, OrderItemDetailResponse>
	>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const user = session?.user as Customer;
	const [activeTab, setActiveTab] = useState<string>("all");
	const statusMap = {
		pending: { label: "Chờ thanh toán", color: "bg-yellow-500" },
		processing: { label: "Đang xử lý", color: "bg-blue-500" },
		delivering: { label: "Đang giao hàng", color: "bg-purple-500" },
		completed: { label: "Đã hoàn thành", color: "bg-green-500" },
		cancelled: { label: "Đã hủy", color: "bg-red-500" },
		refunded: { label: "Đã hoàn tiền", color: "bg-gray-500" },
	};
	const fetchOrders = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/order?customerId=" + user._id);
			const data = await response.json();
			setOrders(data);
			return data;
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchOrderItemDetails = async (orderId: string) => {
		try {
			const response = await fetch(
				`/api/order/orderItemDetail?orderId=${orderId}`
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error fetching order item details:", error);
			return null;
		}
	};

	useEffect(() => {
		fetchOrders().then((orders) => {
			if (orders) {
				const detailsPromises = orders.map((order: Order) =>
					fetchOrderItemDetails(order._id as string)
				);
				Promise.all(detailsPromises).then((details) => {
					const detailsMap: Record<string, OrderItemDetailResponse> = {};
					details.forEach((detail) => {
						if (detail) {
							detailsMap[detail.order_id] = detail;
						}
					});
					setOrderItemDetails(detailsMap);
				});
			}
		});
	}, []);

	// Filter orders based on the active tab
	const filteredOrders = orders.filter((order) => {
		if (activeTab === "all") {
			return true;
		}
		return order.status === activeTab;
	});
	// Mock function to handle rating submission
	const handleRatingSubmit = (values: any) => {
		console.log("Rating submitted:", values)
		// Here you would typically send this data to your API
	}

	// Mock function to handle refund request submission
	const handleRefundSubmit = (values: any) => {
		console.log("Refund requested:", values)
		// Here you would typically send this data to your API
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Đơn hàng</CardTitle>
				<CardDescription>Xem và quản lý đơn hàng của bạn</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 ">

				<Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid grid-cols-7 w-full">
						<TabsTrigger value="all">Tất cả</TabsTrigger>
						<TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
						<TabsTrigger value="processing">Đang xử lý</TabsTrigger>
						<TabsTrigger value="delivering">Đang giao hàng</TabsTrigger>
						<TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
						<TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
						<TabsTrigger value="refunded">Đã hoàn tiền</TabsTrigger>
					</TabsList>

					{isLoading ? (
						<TabsContent value={activeTab} className="pt-4">
							<div className="space-y-2">
								<Skeleton className="h-40 w-full rounded-md" />
								<Skeleton className="h-40 w-full rounded-md" />
								<Skeleton className="h-40 w-full rounded-md" />
							</div>
						</TabsContent>
					) : !orders || orders.length === 0 ? (
						<TabsContent value={activeTab} className="pt-4">
							<div className="text-center py-10 text-muted-foreground">
								Không tìm thấy đơn hàng nào
							</div>
						</TabsContent>
					) : (
						<TabsContent value={activeTab} className="space-y-4 pt-4">
							{filteredOrders.map((order, key) => {
								const orderIdString = order._id as string;
								const orderDetail = orderItemDetails[orderIdString];
								return (
									<div key={key}>
										<div className="border rounded-lg p-4 space-y-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Badge variant="outline" className="font-bold">
														{order.payment_method}
													</Badge>
													<Button variant="outline" size="sm">
														Xem hóa đơn
													</Button>
												</div>
												<Badge className={statusMap[order.status].color}>
													{statusMap[order.status].label}
												</Badge>
											</div>

											<OrderItem customerId={user._id.toString()} {...order} />
											{order ? (
												<div className="pt-4 border-t space-y-2">
													<div className="flex justify-between">
														<p className="text-sm">Tổng tiền sản phẩm:</p>
														<p className="text-sm font-medium">
															{order.total_amount.toLocaleString("vi-VN", {
																style: "currency",
																currency: "VND",
															})}
														</p>
													</div>
													<div className="flex justify-between">
														<p className="text-sm">Giảm giá:</p>
														<p className="text-sm text-red-500">
															-
															{order.discounted_amount.toLocaleString(
																"vi-VN",
																{
																	style: "currency",
																	currency: "VND",
																}
															)}
														</p>
													</div>
													<div className="flex justify-between">
														<p className="text-sm">Phí vận chuyển:</p>
														<p className="text-sm">
															{order.delivery_amount.toLocaleString("vi-VN", {
																style: "currency",
																currency: "VND",
															})}
														</p>
													</div>
													<div className="flex justify-between">
														<p className="text-sm font-bold">Tổng cộng:</p>
														<p className="text-sm font-bold text-primary">
															{order.final_amount.toLocaleString("vi-VN", {
																style: "currency",
																currency: "VND",
															})}
														</p>
													</div>
												</div>
											) : (
												<div className="pt-4 border-t space-y-2">
													<p className="text-muted-foreground">
														Không thể lấy chi tiết đơn hàng
													</p>
												</div>
											)}

											<div className="flex justify-between items-center pt-2 border-t">
												<div className="text-sm text-muted-foreground">
													Rate product before 24-04-2025
												</div>
												<div className="flex gap-2">
													<RefundDialog orderId={order._id.toString()} onSubmit={handleRefundSubmit} />
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</TabsContent>
					)}
				</Tabs>
			</CardContent>
		</Card>
	);
}
