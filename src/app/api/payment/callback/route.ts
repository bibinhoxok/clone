import { type NextRequest } from 'next/server';
import { zOrderSchemaUdate } from '@/schemas/orderSchema';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import OrderModel from '@/models/order';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, {
        status: 400,
      });
    }

    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid orderId format' }, {
        status: 400,
      });
    }

    // Connect to the database
    await connectDB();

    // Find the order by ID
    const order = await OrderModel.findOne({ _id: new mongoose.Types.ObjectId(orderId) });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, {
        status: 404,
      });
    }

    // Validate the order data against the schema
    const parsedOrder = zOrderSchemaUdate.safeParse({ ...order.toObject(), _id: new mongoose.Types.ObjectId(orderId) });
    if (!parsedOrder.success) {
      console.error('Order data validation error:', parsedOrder.error);
      return NextResponse.json({ error: 'Invalid order data', details: parsedOrder.error.format() }, {
        status: 500,
      });
    }

    // Check if the current status is 'pending'
    if (parsedOrder.data.status !== 'pending') {
      return NextResponse.json(
        {
          message: `Order status is not 'pending'. Current status: ${parsedOrder.data.status}`,
        },
        { status: 400 }
      );
    }

    // Update the order status to 'delivering'
    const updateResult = await OrderModel.updateOne(
      { _id: new mongoose.Types.ObjectId(orderId) },
      { $set: { status: 'processing', updatedAt: new Date() } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update order status' }, {
        status: 500,
      });
    }

    return NextResponse.json(
      { message: 'Order status updated to delivering', orderId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, {
      status: 500,
    });
  }
}
