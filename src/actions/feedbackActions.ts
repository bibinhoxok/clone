'use server';

import { connectDB } from '@/lib/mongodb';
import { ActionReturn } from '@next-server-actions/types';
import FeedbackModel from "@/models/feedback";
import { FeedbackSchema, zFeedbackSchemaUdate } from '@/schemas/feedbackSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createFeedback(prevState: any, formData: FormData): Promise<ActionReturn> {
  try {
    const rawData = Object.fromEntries(formData);
    const convertedData = {
      ...rawData,
      rating: Number(rawData.rating),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const feedbackData = FeedbackSchema.parse(convertedData);

    await connectDB();
    await FeedbackModel.create(feedbackData);
    revalidatePath('/feedbacks');
    return { message: 'Feedback created successfully!', success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      const flattenedError = error.flatten().fieldErrors;
      const firstErrorKey = Object.keys(flattenedError)[0]; // Get the first key

      if (firstErrorKey) {
        const firstErrorMessage = flattenedError[firstErrorKey]?.[0];
        if (firstErrorMessage) {
          return {
            message: `${firstErrorKey}: ${firstErrorMessage}`,
            success: false,
            formData,
          };
        }
      }
      return { message: "Validation error occurred.", success: false, formData }; //fallback message
    }
    return { message: "Failed to create feedback.", success: false, formData };
  }
}

export async function updateFeedback(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const feedbackData = zFeedbackSchemaUdate.parse(rawData);
        const { _id, ...updateData } = feedbackData;

        await connectDB();
        const updatedFeedback = await FeedbackModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedFeedback) {
            return { error: 'Feedback not found' };
        }
        revalidatePath('/feedbacks'); // Or revalidate a specific feedback detail page
        revalidatePath(`/feedbacks/${_id}`);
        return { message: 'Feedback updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update feedback.' };
    }
}

export async function deleteFeedback(feedbackId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedFeedback = await FeedbackModel.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return { error: 'Feedback not found' };
    }

    revalidatePath('/feedbacks');
    return { message: 'Feedback deleted successfully!' };
} catch (error) {
  return { error: 'Failed to delete feedback.' };
}
}
