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

interface ProductFilters {
    productId?: string | null;
    name?: string | null;
    type?: string | null;
    price?: number;
    vendorName?: string | null;
    metadata?: Record<string, string> | null;
}

async function queryProductData(filters: ProductFilters = {}) {
    const products = await db.collection("products").get();
    
    return products.docs
        .filter(doc => {
            const data = doc.data();
            if (filters.productId && doc.id !== filters.productId) return false;
            if (filters.name && data.name !== filters.name) return false;
            if (filters.type && data.type !== filters.type) return false;
            if (filters.price && data.price !== filters.price) return false;
            if (filters.vendorName && data.vendorName !== filters.vendorName) return false;
            if (filters.metadata && data.metadata) {
                // Check if all metadata key-value pairs match
                for (const [key, value] of Object.entries(filters.metadata)) {
                    if (!data.metadata || data.metadata[key] !== value) {
                        return false;
                    }
                }
            }
            return true;
        })
        .map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
}

async function getAllVendors() {
    const products = await db.collection("products").get();
    const vendors = new Set(
        products.docs.map(doc => doc.data().vendorName).filter(Boolean)
    );
    return Array.from(vendors);
}

async function getAllTypes() {
    const products = await db.collection("products").get();
    const types = new Set(
        products.docs.map(doc => doc.data().type).filter(Boolean)
    );
    return Array.from(types);
}

export { getUserId, getProductData, queryProductData, getAllVendors, getAllTypes };