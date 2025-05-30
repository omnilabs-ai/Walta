import { getUserId, getProductData } from "@/app/firebase/firestore/misc";
import { addTransaction } from "@/app/firebase/firestore/transactions";
import { getUser } from "@/app/firebase/firestore/user";
import { getCustomerPaymentMethod } from "@/app/stripe/get";
import { processPayment } from "@/app/stripe/payment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Get API key from header
        const apikey = req.headers.get('x-api-key');
        if (!apikey) {
            return NextResponse.json({ error: "API key is required" }, { status: 401 });
        }

        // Check if API key is valid
        const {userId, agentId} = await getUserId(apikey);

        // Get user data
        const userData = await getUser(userId, ["stripe_id"]);
        if (!userData.stripe_id) {
            throw new Error("User has no stripe id");
        }

        // Get product id and quantity from request body
        const { productId, quantity, metadata } = await req.json();

        // Get product data
        const productData = await getProductData(productId);
        if (!productData) {
            throw new Error(`Product with id ${productId} not found`);
        }
        
        const vendorData = await getUser(productData.user_id, ["stripe_vendor_id"]);
        if (!vendorData.stripe_vendor_id) {
            throw new Error(`Vendor with id ${productData.user_id} not found`);
        }

        // Get payment method id
        const paymentMethodId = await getCustomerPaymentMethod(userData.stripe_id);

        // Calculate payment amount
        const paymentAmount = productData.price * quantity;

        // Create metadata with product data
        const metadataWithProduct = {
            ...metadata,
            productId: productId,
            productName: productData.name,
            productDescription: productData.description,
            productPrice: productData.price,
            productQuantity: quantity
        };

        // Process payment
        const paymentIntent = await processPayment(userData.stripe_id, paymentAmount, paymentMethodId, vendorData.stripe_vendor_id, metadataWithProduct);

        const transaction = {
            amount: paymentAmount,
            status: "success",
            metadata: metadata,
            from_user_id: userId,
            to_user_id: productData.user_id,
            from_agent_id: agentId,
        }
        
        addTransaction(userId, transaction);
        addTransaction(productData.user_id, transaction);
        
        // Return payment intent
        return NextResponse.json({ paymentIntent });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: "Error sending payment", error: errorMessage }, { status: 500 });
    }
}
