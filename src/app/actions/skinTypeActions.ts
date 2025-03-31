'use server';

import { connectDB } from '@/lib/mongodb';
import SkinTypeModel from "@/models/skinType";
import { SkinTypeSchema, zSkinTypeSchemaUdate } from '@/schemas/skinTypeSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createSkinType(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const skinTypeData = SkinTypeSchema.parse(rawData); // Zod validation

    await connectDB();
    await SkinTypeModel.create(skinTypeData);
    revalidatePath('/skinTypes'); // Revalidate the skinType list page
    return { message: 'Skin type created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create skin type.' }; // Generic error message
  }
}

export async function updateSkinType(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const skinTypeData = zSkinTypeSchemaUdate.parse(rawData);
        const { _id, ...updateData } = skinTypeData;

        await connectDB();
        const updatedSkinType = await SkinTypeModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedSkinType) {
            return { error: 'Skin type not found' };
        }
        revalidatePath('/skinTypes'); // Or revalidate a specific skinType detail page
        revalidatePath(`/skinTypes/${_id}`);
        return { message: 'Skin type updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update skin type.' };
    }
}

export async function deleteSkinType(skinTypeId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedSkinType = await SkinTypeModel.findByIdAndDelete(skinTypeId);

    if (!deletedSkinType) {
        return { error: 'Skin type not found' };    }
    revalidatePath('/skinTypes');
    return { message: 'Skin type deleted successfully!' };
} catch (error) {
    if (error instanceof ZodError) {
       return { error: error.flatten() };
    }
    return { error: 'Failed to delete skin type.' };
}
}
