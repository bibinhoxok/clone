// src/app/api/payment/zalopay/check-pending-orders/route.ts
import { getOrderStatus } from '../route';
import { NextResponse } from 'next/server';
import OrderModel from '@/models/order';
import { connectDB } from '@/lib/mongodb';
import moment from 'moment';

export async function GET(request: Request) {
    try {
        await connectDB();
        const pendingOrders = await OrderModel.find({ status: 'pending' });

        if (!pendingOrders || pendingOrders.length === 0) {
            return NextResponse.json({ message: 'No pending orders found' }, { status: 200 });
        }

        const checkPromises = pendingOrders.map(async (order) => {
            const app_trans_id = `${moment(order.createdAt).format('YYMMDD')}_${order._id.toString()}`;
            const orderStatus = await getOrderStatus(app_trans_id);

            if (orderStatus.error) {
                console.error(`Error checking status for order ${order._id}:`, orderStatus.error);
                return;
            }

            console.log(`Status for order ${order._id}:`, orderStatus);

            if (orderStatus.return_code === 1) {
                // Payment success
                order.status = 'delivering';
            } else if (orderStatus.return_code === 2 || orderStatus.return_code === 3) {
                // Payment fail
                order.status = 'canceled';
            } else {
                // Payment pending
                order.status = 'pending';
            }
            order.updatedAt = new Date();
            await order.save();
            console.log(`Order ${order._id} status updated to ${order.status}`);
        });

        await Promise.all(checkPromises);

        return NextResponse.json({ message: 'Pending orders checked and updated' }, { status: 200 });
    } catch (error) {
        console.error('Error checking pending orders:', error);
        return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
    }
}
