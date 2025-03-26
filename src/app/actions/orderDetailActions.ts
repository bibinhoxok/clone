'use server';

import { connectDB } from '@/lib/mongodb';
import OrderDetailModel from "@/models/orderDetail";
import { OrderDetailSchema, zOrderDetailSchemaUdate } from '@/schemas/orderDetailSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createOrderDetail(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const orderDetailData = OrderDetailSchema.parse(rawData); // Zod validation

    await connectDB();
    await OrderDetailModel.create(orderDetailData);
    revalidatePath('/orderDetails'); // Revalidate the orderDetail list page
    return { message: 'Order detail created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create order detail.' }; // Generic error message
  }
}

export async function updateOrderDetail(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const orderDetailData = zOrderDetailSchemaUdate.parse(rawData);
        const { _id, ...updateData } = orderDetailData;

        await connectDB();
        const updatedOrderDetail = await OrderDetailModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedOrderDetail) {
            return { error: 'Order detail not found' };
        }
        revalidatePath('/orderDetails'); // Or revalidate a specific order detail page
        revalidatePath(`/orderDetails/${_id}`);
        return { message: 'Order detail updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update order detail.' };
    }
}

export async function deleteOrderDetail(orderDetailId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedOrderDetail = await OrderDetailModel.findByIdAndDelete(orderDetailId);

    if (!deletedOrderDetail) {
        return { error: 'Order detail not found' };
    }
    revalidatePath('/orderDetails');
    return { message: 'Order detail updated successfully!' };
} catch (error) {
    if (error instanceof ZodError) {
       return { error: error.flatten() };
    }
    return { error: 'Failed to delete order detail.' };
}
}
  