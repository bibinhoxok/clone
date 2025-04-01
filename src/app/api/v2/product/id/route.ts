import { NextRequest, NextResponse } from 'next/server';
import { getProductDetail } from '../util'; // Assuming you have this function
import { z } from 'zod';
import { zProductData } from '../util';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id')
        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const productDetail = await getProductDetail(productId);

        if ("message" in productDetail) {
            return NextResponse.json({ message: productDetail.message }, { status: 404 });
        }
        const parsedData = zProductData.safeParse(productDetail);
        if (!parsedData.success) {
            throw new Error(`Failed to parse product data: ${parsedData.error.message}`);
        }

        return NextResponse.json(parsedData.data);
    } catch (error) {
        console.error("Error fetching product detail:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
