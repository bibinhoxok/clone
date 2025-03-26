import { connectDB } from '@/lib/mongodb';
import CustomerModel from "@/models/customer";
import { CustomerSchema } from '@/schemas/customers/customerSchema';


// Path: api/customer/[id]
//get customer by id
const GET = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
        return middleware(request, {params})
    } catch (e) {
        console.error(e);
    }
}

//update customer by id
const PUT = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const response = await middleware(request, { params });

    if (response.status !== 200) {  // Check if middleware found the customer
      return response; // Return the 404 if not found
    }

    try {
        const customer = await response.json(); // Get the customer from middleware response
        const updatedData = await request.json(); // Get update data from request
        const updatedCustomer = await CustomerModel.findByIdAndUpdate(
            customer._id,
            updatedData,
            { new: true }
        );
        return new Response(JSON.stringify(updatedCustomer), { status: 200 });
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
};

//delete customer by id
const DELETE = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Use params instead of query string
) => {
    const response = await middleware(request, { params });

    if (response.status !== 200) {
        return response; // Return 404 if not found
    }

    try {
        const customer = await response.json();  // Not strictly needed, but good practice
        await CustomerModel.findByIdAndDelete(customer._id); // Delete the customer

        return new Response(null, { status: 204 }); // 204 No Content for successful delete

    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
};


//middleware get customer by id
const middleware = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
        const id = (await params).id
        await connectDB();
        const customer = await CustomerModel.findOne({_id: id}); //ref: https://www.youtube.com/watch?v=DZBGEVgL2eE Mongoose Crash Course - Beginner Through Advanced
        if (!customer) {
            return new Response("Customer not found", { status: 404 })
        }
        return new Response(JSON.stringify(customer))
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
}


export { GET, PUT, DELETE }