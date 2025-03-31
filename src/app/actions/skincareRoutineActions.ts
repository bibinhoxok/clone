'use server';

import { connectDB } from '@/lib/mongodb';
import SkincareRoutineModel from "@/models/skincareRoutine";
import { SkincareRoutineSchema, zSkincareRoutineSchemaUdate } from '@/schemas/skincareRoutineSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createSkincareRoutine(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const skincareRoutineData = SkincareRoutineSchema.parse(rawData); // Zod validation

    await connectDB();
    await SkincareRoutineModel.create(skincareRoutineData);
    revalidatePath('/skincareRoutines'); // Revalidate the skincareRoutine list page
    return { message: 'Skincare routine created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create skincare routine.' }; // Generic error message
  }
}

export async function updateSkincareRoutine(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const skincareRoutineData = zSkincareRoutineSchemaUdate.parse(rawData);
        const { _id, ...updateData } = skincareRoutineData;

        await connectDB();
        const updatedSkincareRoutine = await SkincareRoutineModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedSkincareRoutine) {
            return { error: 'Skincare routine not found' };
        }
        revalidatePath('/skincareRoutines'); // Or revalidate a specific skincareRoutine detail page
        revalidatePath(`/skincareRoutines/${_id}`);
        return { message: 'Skincare routine updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update skincare routine.' };
    }
}

export async function deleteSkincareRoutine(skincareRoutineId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedSkincareRoutine = await SkincareRoutineModel.findByIdAndDelete(skincareRoutineId);

    if (!deletedSkincareRoutine) {
        return { error: 'Skincare routine not found' };
    }
    revalidatePath('/skincareRoutines');
    return { message: 'Skincare routine deleted successfully!' };
} catch (error) {
    if (error instanceof ZodError) {
       return { error: error.flatten() };
    }
    return { error: 'Failed to delete skincare routine.' };
}
}
