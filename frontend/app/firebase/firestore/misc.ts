import db from "./config";

async function getUserId(apikey: string) {
    const user = await db.collection("apikeys").doc(apikey).get();
    if (!user.exists) {
        throw new Error("API key not found", { cause: user.data() });
    }
    return {userId: user.data()?.userId, agentId: user.data()?.agentId};
}

async function getProductData(productId: string) {
    const product = await db.collection("products").doc(productId).get();
    if (!product.exists) {
        throw new Error("Product not found");   
    }
    return product.data();
}

async function queryProductData(productId?: string) {
    const products = await db.collection("products").get();
    if (productId) {
        const product = products.docs.find((doc) => doc.id === productId);
        if (!product) {
            throw new Error("Product not found");
        }
        return product.data();
    }
    return products.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));
}

export { getUserId, getProductData, queryProductData };