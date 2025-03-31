"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react"
import { useCart } from "@/lib/custom-hooks";
import Image from "next/image";
import { z } from "zod";
import { zCategorySchemaUdate } from "@/schemas/categorySchema";
import { Promotion } from "@/schemas/promotionSchema";


export default function ShoppingCart() {
	const { items, setQuantity, removeItem, setPromottion, promotion } = useCart()
	const [categories, setCategories] = useState<z.infer<typeof zCategorySchemaUdate>[]>([])
	const [promotionId, setPromottionId] = useState<string>('')
	const [promtionMessage, setPromtionMessage] = useState<string>('')
	const subtotal = items.reduce(
		(total, { product, quantity }) => total + product.price * quantity,
		0
	)
	const discountValueCaulated = promotion?.discount_type === 'percentage' ? subtotal * (promotion?.discount_value || 0) / 100 : (promotion?.discount_value || 0)
	const total = subtotal - discountValueCaulated


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

	const handlePromotion = () => {
		if (!promotionId) {
			setPromottion(undefined)
			setPromtionMessage('')
			return
		}
		fetch(`/api/promotion?code=${promotionId}`)
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setPromottion(data)
				} else {
					setPromottion(data)
					setPromtionMessage(data.message)
				}
			})
			.catch((err) => {
				console.error(err)
			})
			.finally(() => {
				setPromottionId('')
			})
	}
	return (
		<div className="mt-10">
			<h2 className="text-2xl font-semibold mb-4">Chi Tiết Giỏ Hàng</h2>

			<Card>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell>ẢNH SẢN PHẨM</TableCell>
								<TableCell>TÊN SẢN PHẨM</TableCell>
								<TableCell>DANH MỤC</TableCell>
								<TableCell>SỐ LƯƠNG</TableCell>
								<TableCell>ĐƠN GIÁ</TableCell>
								<TableCell>THÀNH TIỀN</TableCell>
								<TableCell>XÓA</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((item, key) => (
								<TableRow key={key}>
									<TableCell>
										<div className="w-[50px] h-[50px] rounded-lg bg-gray-300 flex items-center justify-center overflow-hidden">
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
									<TableCell>
										<Input
											type="number"
											value={item.quantity}
											onChange={(e) => {
												const newQuantity = Number.parseInt(e.target.value);
												setQuantity(item.product._id as string, newQuantity)
											}}
											className="w-16"
										/>
									</TableCell>
									<TableCell>{item.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
									<TableCell>{(item.product.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
									<TableCell>
										<Button variant="destructive" onClick={() => removeItem(item.product._id as string)} size="icon">
											<Trash size={16} />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
							{!items.length && <div className="w-full flex items-center justify-center h-40"><p className=" my-auto text-center text-lg">Không có sản phẩm nào trong giỏ hàng</p></div>}

					<Separator className="my-4" />

					<div className="flex justify-between items-center">
						<div>
							<p>Áp dụng mã giảm giá!</p>
							<div className="flex items-center mt-2">
								<Input placeholder="Mã giảm giá" className="mr-2 max-w-60" value={promotionId} onChange={(e) => setPromottionId(e.target.value)} />
								<Button onClick={handlePromotion}>Áp dụng</Button>
							</div>
							{promtionMessage && <p className="text-red-500 ml-5">{promtionMessage}</p>}
							{promotion && <p className="text-green-500 ml-5">đã áp dụng mã giảm giá: {promotion.name}</p>}
						</div>
						<div>
							<p>Tổng tiền hàng: {subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
							<p>Giảm giá: -{discountValueCaulated.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
							<p className="text-lg font-bold">Tổng cộng: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
						</div>
					</div>

					<div className="flex justify-between mt-6">
						<Button onClick={() => (window.location.href = "/skinstore-page")}>Tiếp tục mua sắm</Button>
						<Button disabled={!items.length} onClick={() => (window.location.href = "/checkout")}>Tiến hành thanh toán</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
