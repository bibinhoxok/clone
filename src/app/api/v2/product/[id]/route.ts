import { getProductDetail } from '../util';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const productId = params.id;
        const productDetail = await getProductDetail(productId);

        if ("message" in productDetail) {
            if (productDetail.message === "Product not found") {
                return new NextResponse(JSON.stringify(productDetail), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new NextResponse(JSON.stringify(productDetail), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return NextResponse.json(productDetail);
    } catch (error) {
        console.error('Error fetching product detail:', error);
        return NextResponse.json({ message: 'Error fetching product detail' }, { status: 500 });
    }
}