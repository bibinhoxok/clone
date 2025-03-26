import { zOrderDetailSchemaUdate } from '@/schemas/orderDetailSchema';
import { zOrderSchemaUdate } from '@/schemas/orderSchema';
import crypto from 'crypto';
import moment from 'moment';
import mongoose from 'mongoose';

const config = {
    app_id: process.env.ZALOPAY_APP_ID || '2553',
    key1: process.env.ZALOPAY_KEY1 || 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: process.env.ZALOPAY_KEY2 || 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: process.env.ZALOPAY_ENDPOINT || "https://sb-openapi.zalopay.vn/v2/create",
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

        // Use VERCEL_PROJECT_PRODUCTION_URL for production
        const productionBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/` : null;
        // Use NEXT_PUBLIC_VERCEL_URL for development or preview
        const developmentBaseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/` : null;
        // Use NGROK_BASE_URL for local development
        const localBaseUrl = process.env.NGROK_BASE_URL;

        // Determine the base URL based on the environment
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

        // axios.post(config.endpoint, null, { params: order });
        // In axios, when you use `params`, it appends the data to the URL as query parameters.
        // In fetch, we need to do this manually.
        const queryParams = new URLSearchParams(order);
        const urlWithParams = `${url}?${queryParams.toString()}`;

        const res = await fetch(urlWithParams, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // if you want to send data in body, you can use this
            // body: JSON.stringify(order)
            // if you want to send data in params, you can use this
            body: null
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('ZaloPay API error:', res.status, res.statusText, text);
            return new Response(JSON.stringify({ error: 'ZaloPay API request failed', details: { status: res.status, statusText: res.statusText, response: text } }), { status: res.status });
        }

        const responseData = await res.json();
        return new Response(JSON.stringify(responseData), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: error }), { status: 500 });
    }
};

export { POST };
