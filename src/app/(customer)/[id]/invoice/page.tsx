
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Order } from "@/schemas/orderSchema"
import { Printer, Send } from "lucide-react"
import { getOrder } from "@/app/api/order/util"
import { formattedDate, formattedTime } from "@/lib/utils"
import { getOrderDetail } from "@/app/api/order/orderDetail/util"
import addressData from "@/data/address.json"
import { OrderDetail } from "@/schemas/orderDetailSchema"
import { getProductById } from "@/app/api/product/util"

export default async function SimpleInvoice({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order: Order = await getOrder({ id: id });
  const orderDetail = await getOrderDetail({ orderId: id })
  const province = addressData.province.find((item) => item.idProvince == order.shippingAddress.provinceId)
  const district = addressData.district.find((item) => item.idProvince == order.shippingAddress.provinceId && item.idDistrict == order.shippingAddress.districtId)
  const commune = addressData.commune.find((item) => item.idDistrict == order.shippingAddress.districtId && item.idCommune == order.shippingAddress.communeId)
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Thanh toán thành công</h2>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <div className="flex gap-4">
                <span className="">Date</span>
                <span>{`${formattedDate(order.createdAt)} at ${formattedTime(order.createdAt)}`}</span>
              </div>
              <div className="flex gap-4">
                <span className="">Transaction id:</span>
                <span>{order._id.toString()}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold">From:</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Skincare Shop</p>
                <p>S201 Vinhomes Grand park</p>
                <p>Quận 9, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</p>
                <p>Email: info@skincare.com</p>
                <p>Phone: 0369 666 333</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">To:</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shippingAddress.name || 'test'}</p>
                <p>{order.shippingAddress.detail}</p>
                <p>{commune?.name + "," + district?.name + "," + province?.name}</p>
                <p>Email: {order.shippingAddress.email}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 ">#</TableHead>
                <TableHead className="">ITEM</TableHead>
                <TableHead className="">DEESCRIPTION</TableHead>
                <TableHead className="text-right ">ITEM COST</TableHead>
                <TableHead className="text-right ">PRODUCTS ITEM</TableHead>
                <TableHead className="text-right ">TOTAL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                orderDetail.map(async (item: OrderDetail, index: number) => {
                  const product = await getProductById(item.product_id.toString())
                  return (
                    <TableRow key={index}>
                      <TableCell className="">{index + 1}</TableCell>
                      <TableCell className="">{product.name}</TableCell>
                      <TableCell className="">{product.description}</TableCell>
                      <TableCell className="text-right ">{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                      <TableCell className="text-right ">{item.quantity}</TableCell>
                      <TableCell className="text-right ">{(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                    </TableRow>
                  )
                }
                )
              }
            </TableBody>
          </Table>

          <div className="mt-8 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{order.total_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax(18%)</span>
              <span>{order.tax_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{order.final_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="font-semibold">Terms & Condition</h3>
            <p className="text-sm ">
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" className=" ">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button className="">
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
