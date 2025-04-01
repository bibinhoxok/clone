import { connectDB } from '@/lib/mongodb';
import ProductModel from '@/models/product';
import FeedbackModel from '@/models/feedback';
import CategoryModel from '@/models/category';
import SkinTypeModel from '@/models/skinType';
import { Product, zProductSchemaUdate } from '@/schemas/productSchema';
import { Feedback, zFeedbackSchemaUdate } from '@/schemas/feedbackSchema';
import { Category, zCategorySchemaUdate } from '@/schemas/categorySchema';
import { SkinType, zSkinTypeSchemaUdate } from '@/schemas/skinTypeSchema';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export async function getProductById(id: string): Promise<Product | any> {
    try {
        await connectDB();
        if (!isValidObjectId(id)) {
            return { message: "Invalid product ID" };
        }
        const product = await ProductModel.findById(id);
        if (!product) {
            return { message: "Product not found" };
        }
        return product;
    } catch (error) {
        return { message: (error as Error).message };
    }
}

// Define a Zod schema for the feedback object
const zFeedbackObject = z.object({
    name: z.string(),
    time: z.string(),
    rating: z.number(),
    title: z.string(),
    comment: z.string(),
});

// Define a Zod schema for the category object
const zCategoryObject = zCategorySchemaUdate.omit({
    createdAt: true,
    updatedAt: true,
});

// Define a Zod schema for the skin type object
const zSkinTypeObject = zSkinTypeSchemaUdate.omit({
    createdAt: true,
    updatedAt: true,
});

// Define the ProductData type using Zod
export const zProductData = zProductSchemaUdate.omit({
    createdAt: true,
    updatedAt: true,
}).extend({
    feedbacks: z.array(zFeedbackObject).optional(),
    category: zCategoryObject.nullable(),
    skinType: zSkinTypeObject.nullable(),
    relatedProducts: z.array(zProductSchemaUdate.omit({
        createdAt: true,
        updatedAt: true,
    })).optional(),
});

// Infer the TypeScript type from the Zod schema
type ProductData = z.infer<typeof zProductData>;

export async function getProductDetail(productId: string): Promise<ProductData | { message: string }> {
    try {
        await connectDB();

        if (!isValidObjectId(productId)) {
            return { message: "Invalid product ID" };
        }

        const product: Product | null = (await ProductModel.findById(productId).lean()) as Product | null;

        if (!product) {
            return { message: "Product not found" };
        }

        // Fetch feedbacks for the product
        const feedbacksRaw: Feedback[] = (await FeedbackModel.find({ product_id: productId }).lean()) as Feedback[];
        const feedbacks: ProductData['feedbacks'] = feedbacksRaw.map((feedback) => ({
            name: feedback.customer_id.toString(),
            time: feedback.createdAt.toLocaleString(),
            rating: feedback.rating,
            title: feedback.comment,
            comment: feedback.comment,
        }));

        // Fetch category details
        const category: Category | null = (await CategoryModel.findById(product.category_id).lean()) as Category | null;

        // Fetch skin type recommendation details (if available)
        let skinType: SkinType | null = null;
        if (product.skintype_recomendation) {
            skinType = (await SkinTypeModel.findById(product.skintype_recomendation).lean()) as SkinType | null;
        }

        // Fetch products with the same skin type recommendation
        let relatedProducts: Product[] = [];
        if (product.skintype_recomendation) {
            relatedProducts = (await ProductModel.find({
                skintype_recomendation: product.skintype_recomendation,
                _id: { $ne: productId }, // Exclude the current product
            }).lean()) as Product[];
        }

        return {
            ...product,
            feedbacks,
            category: category || null,
            skinType: skinType || null,
            relatedProducts,
        };
    } catch (error) {
        return { message: (error as Error).message };
    }
}

export async function getProductsByCategory(categoryId: string) {
    try {
        await connectDB();
        if (!isValidObjectId(categoryId)) {
            return { message: "Invalid category ID" };
        }
        const products = await ProductModel.find({ category_id: categoryId }).lean();
        return products;
    } catch (error) {
        return { message: (error as Error).message };
    }
}

export async function getProductsBySkinType(skinTypeId: string) {
    try {
        await connectDB();
        if (!isValidObjectId(skinTypeId)) {
            return { message: "Invalid skin type ID" };
        }
        const products = await ProductModel.find({ skintype_recomendation: skinTypeId }).lean();
        return products;
    } catch (error) {
        return { message: (error as Error).message };
    }
}

export async function getProductsByPriceRange(minPrice: number, maxPrice: number) {
    try {
        await connectDB();
        const products = await ProductModel.find({
            price: { $gte: minPrice, $lte: maxPrice },
        }).lean();
        return products;
    } catch (error) {
        return { message: (error as Error).message };
    }
}

export async function getProductsByName(name: string) {
    try {
        await connectDB();
        const products = await ProductModel.find({
            name: { $regex: name, $options: 'i' },
        }).lean();
        return products;
    } catch (error) {
        return { message: (error as Error).message };
    }
}
