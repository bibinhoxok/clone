'use server';

import { connectDB } from '@/lib/mongodb';
import FeedbackModel from "@/models/feedback";
import { FeedbackSchema, zFeedbackSchemaUdate } from '@/schemas/feedbackSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createFeedback(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const feedbackData = FeedbackSchema.parse(rawData); // Zod validation

    await connectDB();
    await FeedbackModel.create(feedbackData);
    revalidatePath('/feedbacks'); // Revalidate the feedback list page
    return { message: 'Feedback created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create feedback.' }; // Generic error message
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
