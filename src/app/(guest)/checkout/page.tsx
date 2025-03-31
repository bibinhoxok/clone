"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { useCart, useToast } from "@/lib/custom-hooks";
import { zCategorySchemaUdate } from "@/schemas/categorySchema";
import { z } from "zod";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { Address, AddressSchema, Customer, zCustomerSchemaUdate } from "@/schemas/customerSchema";
import { checkOutOrder } from "@/actions/orderActions";
import addressData from "@/data/address.json";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { redirect, useRouter } from "next/navigation";

function AddressSelection({ addresses, selectedAddress, onSelectAddress }: { addresses: Address[], selectedAddress?: Address, onSelectAddress: (address: Address) => void }) {
	return (
		<div className="max-w-2xl mx-auto p-4">
			<RadioGroup
				value={selectedAddress ? JSON.stringify(selectedAddress) : ""}
				onValueChange={(value) => {
					if (value) {
						const address = JSON.parse(value) as Address;
						onSelectAddress(address)
					}
				}}
				className="space-y-4"
			>
				{addresses.map((address, index) => (
					<Card key={index} className="border rounded-md overflow-hidden">
						<CardContent className="p-0">
							<div className="flex items-start p-4 gap-3">
								<RadioGroupItem value={JSON.stringify(address)} id={`address-${index}`} className="mt-1" />
								<div className="flex-1">
									<div className="flex justify-between items-start">
										<div>
											<div className="font-medium">{address.name}</div>
											<div className="text-sm text-muted-foreground">{address.phone}</div>
										</div>
									</div>
									<div className="text-sm text-muted-foreground mt-1">
										{addressData.commune.find(c => c.idCommune === address.communeId)?.name},
										{addressData.district.find(d => d.idDistrict === address.districtId)?.name},
										{addressData.province.find(p => p.idProvince === address.provinceId)?.name}
										<br />
										{address.detail}
									</div>
									<div className="mt-2">
										{address.isDefault && (
											<Button
												variant="outline"
												size="sm"
												className="h-7 text-xs border-red-500 text-red-500 hover:text-red-600 hover:bg-red-50"
											>
												Mặc định
											</Button>
										)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</RadioGroup>
		</div>
	);
}

export default function CheckoutPage() {
	const { status, data: session } = useSession();
	const { items, clearCart, promotion } = useCart()
	const [categories, setCategories] = useState<z.infer<typeof zCategorySchemaUdate>[]>([])
	const [shippingAddress, setShippingAddress] = useState<z.infer<typeof AddressSchema> | null>()
	const router = useRouter();
	const subtotal = items.reduce(
		(total, { product, quantity }) => total + product.price * quantity,
		0
	)
	const discountValueCaulated = promotion?.discount_type === 'percentage' ? subtotal * (promotion?.discount_value || 0) / 100 : (promotion?.discount_value || 0)
	const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
	const [shippingCost, setShippingCost] = useState(12000);
	const taxRate = 0.18;
	const total = subtotal + shippingCost - discountValueCaulated + subtotal * taxRate;

	const AddressComponent = useMemo(() => {
		if (status === "authenticated") {
			if (session?.user) {
				const addresses = (session.user as Customer).addresses;
				if (addresses && addresses.length > 0) {
					setShippingAddress(addresses.find((address) => address.isDefault) || addresses[0])
					return (
						<AddressSelection
							addresses={addresses}
							onSelectAddress={(address) => setShippingAddress(address)}
							selectedAddress={addresses.find((address) => address.isDefault) || addresses[0]}
						/>
					);
				}

			}
		}
		return (
			<Alert>
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>
					You don't have any address. Please login or create an account to add an address.
				</AlertDescription>
			</Alert>
		)
	}, [status, (session?.user as Customer)?.addresses]);

	useEffect(() => {
		fetch("/api/category")
			.then((res) => res.json())
			.then((data) => {
				setCategories(data.data)
			})
			.catch((err) => {
				console.error(err)
			})

	}, [])



	const handleCheckout = async () => {
		const formData = new FormData();
		const newOrder = {
			shippingAddress: shippingAddress,
			promotion_id:promotion?._id,
			status: "pending",
			total_amount: subtotal,
			final_amount: total,
			payment_method: paymentMethod,
			discounted_amount: discountValueCaulated,
			delivery_amount: shippingCost,
			tax_amount: subtotal * taxRate,
			customer_id: (session?.user as z.infer<typeof zCustomerSchemaUdate>)?._id
		}
		const newOrderDetail = items.map((item) => {
			return {
				product_id: item.product._id,
				quantity: item.quantity,
				price: item.product.price
			}
		})
		formData.append("order", JSON.stringify(newOrder));
		formData.append("orderDetail", JSON.stringify(newOrderDetail));
		const result = await checkOutOrder(formData)
		if (result.message) useToast(result.message)
		if (result.success) {
			const orderString = result.formData?.get("order") as string;
			const orderDetailString = result.formData?.get("orderDetail") as string;
			const orderId = result.formData?.get("orderId") as string;
			const reqBody = {
				order: orderString ? JSON.parse(orderString) : null,
				orderDetail: orderDetailString ? JSON.parse(orderDetailString) : null,
				orderId: orderId
			};
			if (newOrder.payment_method == "zalopay") {
				try {
					const res = await fetch("/api/payment/zalopay", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(reqBody)
					});
					const data = await res.json();
					console.log(data)
					if (data.return_code == 1) {
						window.location.href = data.order_url;
					} else {
						useToast(data.return_message)
						return
					}
				} catch (error) {
					console.log(error)
					useToast("Đặt hàng thất bại")
					return
				}
			}
			clearCart()
			router.push(`/${orderId}/invoice`);
		}
	}

	return (
		<>
			<div className="mt-10">
				<h2 className="text-2xl font-semibold mb-4">Chi tiết sản phẩm</h2>
				<Card className="mb-6">
					<CardContent>
						<Table className="text-center">
							<TableHeader>
								<TableRow>
									<TableCell>ẢNH SẢN PHẨM</TableCell>
									<TableCell>TÊN SẢN PHẨM</TableCell>
									<TableCell>DANH MỤC</TableCell>
									<TableCell>SỐ LƯƠNG</TableCell>
									<TableCell>GIÁ</TableCell>
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.map((item, key) => (
									<TableRow key={key}>
										<TableCell>
											<div className="w-[50px] h-[50px] rounded-lg bg-gray-300 flex items-center justify-center overflow-hidden mx-auto">
												<Image
													src={item.product.image_url || "/placeholder.svg"}
													alt={item.product.name}
													className="rounded-lg object-cover w-full aspect-square mb-8 cursor-pointer"
													width={150}
													height={150}
													onError={(e) => {
														e.currentTarget.src = "/placeholder.svg";
													}}
												/>
											</div>
										</TableCell>
										<TableCell>{item.product.name}</TableCell>
										<TableCell>{categories.find((category) => category._id === item.product.category_id)?.name}</TableCell>
										<TableCell>{item.quantity}</TableCell>
										<TableCell>{item.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card>
						<CardContent>
							<div className="flex border-b pb-3 my-4">
								<h2 className="text-xl font-medium">Địa Chỉ Của Tôi</h2>
								<span className="text-blue-500 text-sm mr-0 ml-auto my-auto">Cập nhật</span>
							</div>
							{AddressComponent}
						</CardContent>
					</Card>

					<Card>
						<CardContent>
							<div className="border-b pb-3 my-4">
								<h2 className="text-xl font-medium">Thanh toán</h2>
							</div>
							<div className="flex justify-between"><span>Tổng giá trị đơn hàng:</span> <span>{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
							<div className="flex justify-between text-red-500"><span>Phí vận chuyển:</span> <span>{shippingCost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
							<div className="flex justify-between text-green-500"><span>Giảm giá:</span> <span>-{discountValueCaulated.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
							<div className="flex justify-between"><span>Thuế (18%):</span> <span>{(subtotal * taxRate).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
							<div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Tổng thanh toán:</span> <span>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
						</CardContent>
					</Card>
				</div>

				<Card className="mt-6">
					<CardContent>
						<h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
						<RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
							<Label className="flex items-center gap-2">
								<RadioGroupItem value="cash_on_delivery" /> Thanh toán khi nhận hàng
							</Label>
							<Label className="flex items-center gap-2">
								<RadioGroupItem value="zalopay" />Zalo Pay
							</Label>
						</RadioGroup>
						<div className="flex">
							<Button className="mt-4 ml-auto mr-2 border-2" variant="ghost" onClick={() => redirect('/shopping-cart')}>Trở lại giỏ hàng</Button>
							<Button className="mt-4 ml-2 mr-2" onClick={handleCheckout}>Thanh toán ngay</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
