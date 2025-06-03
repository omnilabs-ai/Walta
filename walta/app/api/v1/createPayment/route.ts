import { getCustomerPaymentMethod } from "@/app/service/stripe/get";
import { processPayment } from "@/app/service/stripe/payment";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/app/service/supabase/lib/validate";
import { getAgentByKey } from "@/app/service/supabase/payments";
import { getUser } from "@/app/service/supabase/user";
import { getProducts } from "@/app/service/supabase/products";
import { addTransaction } from "@/app/service/supabase/transactions";

export async function POST(req: NextRequest) {
    try {
        const userId = await validateApiKey(req.headers.get('authorization') ?? '')
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get API key from header
        const apikey = req.headers.get('x-agent-key');
        if (!apikey) {
            return NextResponse.json({ error: "API key is required" }, { status: 401 });
        }

        // Check if API key is valid
        const agent = await getAgentByKey(apikey);
        if (!agent) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
        }

        // Get user data
        const userData = await getUser(userId);
        if (!userData.stripe_customer_id) {
            throw new Error("User has no stripe customer id");
        }

        // Get product id and quantity from request body
        const { productId, quantity, metadata } = await req.json();

        // Get product data
        const productData = (await getProducts(productId))[0];
        if (!productData) {
            throw new Error(`Product with id ${productId} not found`);
        }
        if (!productData.stripe_vendor_id) {
            throw new Error(`Product with id ${productId} has no stripe vendor id`);
        }

        // Get payment method id
        const paymentMethodId = await getCustomerPaymentMethod(userData.stripe_customer_id);

        // Calculate payment amount
        const paymentAmount = productData.price_cents * quantity;

        // Create metadata with product data
        const metadataWithProduct = {
            ...metadata,
            productId: productId,
            productName: productData.name,
            productDescription: productData.description,
            productPrice: productData.price_cents,
            productQuantity: quantity
        };

        // Process payment
        const paymentIntent = await processPayment(userData.stripe_customer_id, paymentAmount, paymentMethodId, productData.stripe_vendor_id, metadataWithProduct);

        const transaction = {
            amount_cents: paymentAmount,
            status: "success",
            metadata: metadataWithProduct,
            customer_id: userData.stripe_customer_id,
            vendor_id: productData.stripe_vendor_id,
            agent_id: agent.id,
            product_id: productId
        }

        console.log(transaction);
        
        addTransaction(transaction);

        return NextResponse.json({ paymentIntent });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: "Error sending payment", error: errorMessage }, { status: 500 });
    }
}
