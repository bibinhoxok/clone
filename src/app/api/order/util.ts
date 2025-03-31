import { connectDB } from '@/lib/mongodb';
import OrderModel from "@/models/order";
import { SortOrder } from 'mongoose';
import { OrderSchema } from '@/schemas/orderSchema';
import { PaginationedData } from '@next-server-actions/types';
export async function getOrdersFromDB({
    page = 1,
    limit = 10,
    id,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    customerId = '',
    status
    
}:{
    page?: number,
    limit?: number,
    id?: string,
    search?: string,
    sortBy?: string,
    sortOrder?: SortOrder
    customerId?: string;
    status?: string;
}): Promise<PaginationedData<any> | any> {
    try {
        await connectDB();

        const skip = (page - 1) * limit;

        // Validate sortField
        const validSortFields = Object.keys(OrderSchema.keyof().Values);
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

        if (id) {
            const order = await OrderModel.findById(id);
            if (!order) {
                return { message: "Order not found" };
            }
            return order;
        }
        if (customerId) {
            const orders = await OrderModel.find({ customer_id: customerId });
            return orders;
        }

        const query: any = {};
        if (search) {
            query.$or = [
                { customer_id: { $regex: search, $options: 'i' } },
            ];
        }
        if (status) {
            if (search) {
                query.status = status;
            } else {
                query.status = status;
            }
        }
        const totalDocs = await OrderModel.countDocuments(query);
        const orders = await OrderModel.find(query)
            .sort({
                [sortField]: sortOrder,
            })
            .skip(skip)
            .limit(limit);

        return {
            data: orders,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            totalDocs,
        };
    } catch (e) {
        return { message: (e as Error).message };
    }
}

export async function getOrder({ id }: { id?: string }) {
    return getOrdersFromDB({id: id});
}
