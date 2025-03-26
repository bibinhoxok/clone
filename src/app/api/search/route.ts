import { connectDB } from '@/lib/mongodb';
import CustomerModel from "@/models/customer";

const GET = async (req: Request) => { 
    try {
        await connectDB();
        const customers = await CustomerModel.find(); 
        return new Response(JSON.stringify(customers))
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
}
export { GET }