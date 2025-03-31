import { connectDB } from '@/lib/mongodb';
import PromotionModel from "@/models/promotion";
import { FilterQuery, SortOrder } from 'mongoose';

const GET = async (req: Request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);        
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const nameFilter = searchParams.get('name');
        const isActiveFilter = searchParams.get('is_active');
        const code = searchParams.get('code');
        const filter: FilterQuery<typeof PromotionModel> = {};
        if (nameFilter) {
            filter.name = { $regex: nameFilter, $options: 'i' };
        }
        if (isActiveFilter) {
            filter.is_active = isActiveFilter === 'true';
        }
        const id = searchParams.get('id');

        const skip = (page - 1) * limit;

        if (id) {
            const promotion = await PromotionModel.findById(id);
            if (!promotion) {
                return new Response(JSON.stringify({ message: "Promotion not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(promotion), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const sort: { [key: string]: SortOrder } = {
            [sortBy]: sortOrder as SortOrder,
            _id: 1 as SortOrder,
        };

        if (code) {
            const promotion = await PromotionModel.findOne({ code });
            if (!promotion) {
                return new Response(JSON.stringify({ message: "Promotion not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(promotion), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const totalDocs = await PromotionModel.countDocuments(filter);
        const promotions = await PromotionModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return new Response(JSON.stringify({
            data: promotions,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            sortBy,
            sortOrder,
            totalDocs,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (e) {
        return new Response(JSON.stringify({ message: (e as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export { GET }
