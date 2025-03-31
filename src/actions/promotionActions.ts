'use server';

import { connectDB } from '@/lib/mongodb';
import PromotionModel from "@/models/promotion";
import { PromotionSchema, zPromotionSchemaUdate } from '@/schemas/promotionSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { ActionReturn } from '@next-server-actions/types';

export async function createPromotion(prevState: any, formData: FormData): Promise<ActionReturn> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const convertedData = {
        ...rawData,
        discount_value: parseInt(rawData.discount_value as string),
        start_date: new Date(rawData.start_date as string),
        end_date: new Date(rawData.end_date as string),
        min_order_value: parseInt(rawData.min_order_value as string),
        max_discount_amount: parseInt(rawData.max_discount_amount as string),
        usage_limit: parseInt(rawData.usage_limit as string),
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    console.log(rawData.min_order_value);
    const promotionData = PromotionSchema.parse(convertedData); // Zod validation
    await connectDB();
    await PromotionModel.create(promotionData);
    revalidatePath('/staff/promotion-management'); // Revalidate the promotion list page
    return { message: 'Promotion created successfully!', success: true, formData };
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error);
      const errorMessages = error.issues.map((issue) => issue.path[0]+": " + issue.message );
      return { message: errorMessages.join(', '), success: false, formData };
    }
    return { message: 'Failed to create promotion.', success: false, formData };
  }
}

export async function toggleActiveStatus(promotionId: string): Promise<ActionReturn>  {
  try {
    await connectDB();
    const promotion = await PromotionModel.findById(promotionId);
    if (!promotion) {
      return { message: 'Promotion not found', success: false };
    } 
    promotion.is_active = !promotion.is_active;
    await promotion.save();
    revalidatePath('/staff/promotion-management');
    return { message: 'Promotion status updated successfully!', success: true };
  } catch (error) {
    return { message: 'Failed to update promotion status.', success: false };
  }
}

export async function updatePromotion(formData: FormData): Promise<ActionReturn>  {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const promotionData = zPromotionSchemaUdate.parse(rawData);
    const { _id, ...updateData } = promotionData;

    await connectDB();
    const updatedPromotion = await PromotionModel.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedPromotion) {
      return { message: 'Promotion not found', success: false, formData };
    }
    revalidatePath('/staff/promotion-management');
    return { message: 'Promotion updated successfully!', success: true, formData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message);
      return { message: errorMessages.join(', '), success: false, formData };
    }
    return { message: 'Failed to update promotion.', success: false, formData };
  }
}

export async function deletePromotion(promotionId: string): Promise<ActionReturn>  { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedPromotion = await PromotionModel.findByIdAndDelete(promotionId);

    if (!deletedPromotion) {
      return { message: 'Promotion not found', success: false };
    }

    revalidatePath('/staff/promotion-management');
    return { message: 'Promotion deleted successfully!', success: true };
  } catch (error) {
    return { message: 'Failed to delete promotion.', success: false };
  }
}
