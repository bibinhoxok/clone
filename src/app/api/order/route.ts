import { isValidObjectId, SortOrder } from "mongoose";
import { getOrdersFromDB } from "./util";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/order";
import { OrderSchema } from "@/schemas/orderSchema";
import { z } from "zod";


const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const id = searchParams.get('id') || undefined;
        const search = searchParams.get('name') || ''; // Use 'name' for search
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder;
        const customerId = searchParams.get('customerId') || undefined;
        const status = searchParams.get('status') || undefined; // Get the status filter
        const result = await getOrdersFromDB({ page, limit, id, search, sortBy, sortOrder, customerId, status }); // Pass the status to getOrdersFromDB


        if ("message" in result) {
            if (result.message === "Order not found") {
                return new Response(JSON.stringify(result), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(result), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        if (id) {
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify(result), {
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
const PUT = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('_id') || undefined;
        const bodyRaw = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ message: "Missing id" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        // Use .partial() to make all fields optional
        const partialOrderSchema = OrderSchema.partial();

        // Parse the body with the partial schema
        const parsedBody = partialOrderSchema.safeParse(bodyRaw);

        if (!parsedBody.success) {
            // If parsing fails, return the error
            return new Response(JSON.stringify({ message: "Invalid order data", error: parsedBody.error.flatten() }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const result = await updateOrderById(id, parsedBody.data);
        if ("message" in result) {
            if (result.message === "Order not found") {
                return new Response(JSON.stringify(result), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (result.message === "Invalid order ID") {
                return new Response(JSON.stringify(result), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (result.message === "Order updated successfully") {
                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(result), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify(result), {
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

const updateOrderById = async (id: string, body: Partial<z.infer<typeof OrderSchema>>) => {
    try {
        await connectDB();
        if (!isValidObjectId(id)) {
            return { message: "Invalid order ID" };
        }
        const order = await OrderModel.findByIdAndUpdate(id, body, { new: true });
        if (!order) {
            return { message: "Order not found" };
        }
        return { message: "Order updated successfully", data: order };
    } catch (e) {
        return { message: (e as Error).message };
    }
}
export { GET, PUT }
