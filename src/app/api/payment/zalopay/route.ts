// src/app/api/payment/zalopay/route.ts
import { zOrderDetailSchemaUdate } from '@/schemas/orderDetailSchema';
import { zOrderSchemaUdate } from '@/schemas/orderSchema';
import crypto from 'crypto';
import moment from 'moment';
import mongoose from 'mongoose';
import OrderModel from '@/models/order'; // Import OrderModel
import { connectDB } from '@/lib/mongodb';

const config = {
    app_id: process.env.ZALOPAY_APP_ID || '2553',
    key1: process.env.ZALOPAY_KEY1 || 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: process.env.ZALOPAY_KEY2 || 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: process.env.ZALOPAY_ENDPOINT || "https://sb-openapi.zalopay.vn/v2/create",
    get_status_endpoint: process.env.ZALOPAY_GET_STATUS_ENDPOINT || "https://sb-openapi.zalopay.vn/v2/query"
};

const checkOrderStatusAfterDelay = async (app_trans_id: string, orderId: string) => {
    console.log(`Scheduled check for order ${orderId} (app_trans_id: ${app_trans_id}) in 15 minutes...`);

    setTimeout(async () => {
        console.log(`Checking status for order ${orderId} (app_trans_id: ${app_trans_id})...`);
        try {
            const orderStatus = await getOrderStatus(app_trans_id);

            if (orderStatus.error) {
                console.error(`Error checking status for order ${orderId}:`, orderStatus.error);
                return;
            }

            console.log(`Status for order ${orderId}:`, orderStatus);

            // Update order status in your database based on ZaloPay's response
            await connectDB();
            const order = await OrderModel.findById(orderId);
            if (!order) {
                console.error(`Order ${orderId} not found.`);
                return;
            }
            if (orderStatus.return_code === 1) {
                // Payment success
                order.status = 'delivering';
            } else if (orderStatus.return_code === 2 || orderStatus.return_code === 3) {
                // Payment fail
                order.status = 'canceled';
            } else {
                // Payment pending
                order.status = 'pending';
            }
            order.updatedAt = new Date();
            await order.save();
            console.log(`Order ${orderId} status updated to ${order.status}`);
        } catch (error) {
            console.error(`Error updating status for order ${orderId}:`, error);
        }
    }, 29 * 1000);
};

const POST = async (request: Request) => {
    try {
        const reqData = await request.json();
        const orderId = reqData.orderId;
        const orderParsed = zOrderSchemaUdate.parse({ ...reqData.order, _id: new mongoose.Types.ObjectId(orderId) });
        const orderDetailParsed = reqData.orderDetail.map((item: any) => {
            return zOrderDetailSchemaUdate.parse({
                ...item,
                _id: new mongoose.Types.ObjectId(item._id),
                order_id: new mongoose.Types.ObjectId(item.orderId),
                product_id: new mongoose.Types.ObjectId(item.product_id),
            });
        });

        const items = orderDetailParsed;
        const transID = orderParsed._id.toString();
        const productionBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/` : null;
        const developmentBaseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/` : null;
        const localBaseUrl = process.env.NGROK_BASE_URL;
        const baseUrl = productionBaseUrl || developmentBaseUrl || localBaseUrl || `https://23f1-14-226-225-128.ngrok-free.app/`;
        const redirectUrl = baseUrl + orderParsed._id.toString() + "/invoice";
        const callbackUrl = baseUrl + 'api/payment/callback?orderId=' + orderParsed._id;

        const embed_data = {
            redirecturl: redirectUrl,
        };

        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: orderParsed.customer_id.toString(),
            app_time: Date.now().toString(),
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: (orderParsed.final_amount).toString(),
            description: `Skincare - Payment for the order #${transID}`,
            callback_url: callbackUrl,
            bank_code: '',
            mac: '',
        };

        const data =
            config.app_id +
            '|' +
            order.app_trans_id +
            '|' +
            order.app_user +
            '|' +
            order.amount +
            '|' +
            order.app_time +
            '|' +
            order.embed_data +
            '|' +
            order.item;
        order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

        const url = config.endpoint;
        const queryParams = new URLSearchParams(order);
        const urlWithParams = `${url}?${queryParams.toString()}`;

        const res = await fetch(urlWithParams, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: null
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('ZaloPay API error:', res.status, res.statusText, text);
            return new Response(JSON.stringify({ error: 'ZaloPay API request failed', details: { status: res.status, statusText: res.statusText, response: text } }), { status: res.status });
        }

        const responseData = await res.json();

        // Schedule the order status check after 15 minutes
        checkOrderStatusAfterDelay(order.app_trans_id, orderId);

        return new Response(JSON.stringify(responseData), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: error }), { status: 500 });
    }
};
// New function to get order status
const getOrderStatus = async (app_trans_id: string) => {
    try {
        const data = config.app_id + "|" + app_trans_id + "|" + config.key1;
        const mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

        const order = {
            app_id: config.app_id,
            app_trans_id: app_trans_id,
            mac: mac
        };

        const queryParams = new URLSearchParams(order);
        const urlWithParams = `${config.get_status_endpoint}?${queryParams.toString()}`;

        const res = await fetch(urlWithParams, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: null
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('ZaloPay Get Status API error:', res.status, res.statusText, text);
            return { error: 'ZaloPay Get Status API request failed', details: { status: res.status, statusText: res.statusText, response: text } };
        }

        const responseData = await res.json();
        return responseData;
    } catch (error) {
        console.error('Error getting order status:', error);
        return { error: 'Internal server error', details: error };
    }
};

export { POST, getOrderStatus };