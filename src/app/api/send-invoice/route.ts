import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getOrder } from '@/app/api/order/util';
import { getOrderDetail } from '@/app/api/order/orderDetail/util';
import { Order } from '@/schemas/orderSchema';
import { OrderDetail } from '@/schemas/orderDetailSchema';
import { getProductById } from '@/app/api/product/util';

export async function POST(request: Request) {
  try {
    const { orderId, customerEmail } = await request.json();
    const order: Order = await getOrder({ id: orderId });
    const orderDetail: OrderDetail[] = await getOrderDetail({ orderId: orderId });
    const productPromises = orderDetail.map(async (item) => {
      const product = await getProductById(item.product_id.toString());
      return { ...item, product };
    });
    const products = await Promise.all(productPromises);
    // 1. Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Configure your email service here (e.g., Gmail, SendGrid)
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_app_password',
      },
    });

    // 2. Define the email content
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: customerEmail,
      subject: `Invoice for Order ${orderId}`,
      html: `
        <h1>Invoice for Order ${orderId}</h1>
        <p>Thank you for your order!</p>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((item) => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p>Total: ${order.final_amount}</p>
      `,
      // attachments: [
      //   {
      //     filename: 'invoice.pdf',
      //     content: pdfBuffer, // If you generate a PDF
      //   },
      // ],
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json({ message: 'Error sending invoice' }, { status: 500 });
  }
}
