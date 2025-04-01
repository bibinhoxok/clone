'use server';

import { connectDB } from '@/lib/mongodb';
import { ActionReturn } from '@next-server-actions/types';
import SkinTypeModel from "@/models/skinType";
import { SkinTypeSchema, zSkinTypeSchemaUdate } from '@/schemas/skinTypeSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createSkinType(prevState: any, formData: FormData): Promise<ActionReturn> {
  try {
    const rawData = Object.fromEntries(formData);
    const skinTypeData = SkinTypeSchema.parse(rawData);

    await connectDB();
    await SkinTypeModel.create(skinTypeData);
    revalidatePath('/skinTypes');
    return { message: 'Skin type created successfully!', success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      const flattenedError = error.flatten().fieldErrors;
      const firstErrorKey = Object.keys(flattenedError)[0]; // Get the first key

      if (firstErrorKey) {
        const firstErrorMessage = flattenedError[firstErrorKey]?.[0];
        return { message: `${firstErrorKey}: ${firstErrorMessage}`, success: false, formData };
      }
      return { message: "Validation error occurred.", success: false, formData }; //fallback message
    }
    return { message: "Failed to create skin type.", success: false, formData };
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
            return { message: 'Skin type not found', success: false, formData };
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
        return { message: 'Skin type not found', success: false };    
    }
    revalidatePath('/skinTypes');
    return { message: 'Skin type deleted successfully!' };
} catch (error) {
    if (error instanceof ZodError) {
       return { message: JSON.stringify(error.flatten().fieldErrors), success: false };
    }
    return { message: 'Failed to delete skin type.', success: false };
}
}
