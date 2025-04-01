import { connectDB } from '@/lib/mongodb';
import ProductModel from '@/models/product';
import FeedbackModel from '@/models/feedback';
import CategoryModel from '@/models/category';
import SkinTypeModel from '@/models/skinType';
import { Product } from '@/schemas/productSchema';
import { Feedback } from '@/schemas/feedbackSchema';
import { Category } from '@/schemas/categorySchema';
import { SkinType } from '@/schemas/skinTypeSchema';
import { isValidObjectId } from 'mongoose';

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

export async function getProductDetail(productId: string) {
    try {
        await connectDB();

        if (!isValidObjectId(productId)) {
            return { message: "Invalid product ID" };
        }

        const product: Product | null = (await ProductModel.findById(productId).lean())as Product | null;

        if (!product) {
            return { message: "Product not found" };
        }

        // Fetch feedbacks for the product
        const feedbacks: Feedback[] = (await FeedbackModel.find({ product_id: productId }).lean()) as Feedback[];

        // Fetch category details
        const category: Category | null =( await CategoryModel.findById(product.category_id).lean())as Category | null;

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