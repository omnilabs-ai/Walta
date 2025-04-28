import { Timestamp, FieldValue } from "firebase-admin/firestore";
import db from "./config";
import { v4 as uuidv4 } from 'uuid';
import { Product } from "./types";

async function getProducts(userId: string, product_id?: string) {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();
  const productDict = data?.products || {};

  if (product_id) {
    if (!productDict[product_id]) {
      throw new Error(`Product with id ${product_id} not found`);
    }
    return productDict[product_id];
  }

  return productDict;
}

async function createProduct(userId: string, productData: Omit<Product, 'created_at' | 'user_id'>) {
  const product_id = uuidv4();

  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();

  const productRef = db.collection("products").doc(product_id);
  
  const newProduct: Product = {
    ...productData,
    user_id: userId,
    created_at: Timestamp.now(),
  };

  const productDict = data?.products || {};
  
  await userRef.update({
    products: {
      ...productDict,
      [product_id]: newProduct,
    },
  });

  await productRef.set(newProduct);

  return { newProduct, product_id };
}

async function updateProduct(product_id: string, updatedFields: Partial<Product>) {
  
  const productRef = db.collection("products").doc(product_id);
  const productDoc = await productRef.get();
  const productData = productDoc.data();

  if (!productData) {
    throw new Error(`Product with id ${product_id} not found`);
  }

  if (!productData.user_id) {
    throw new Error(`Product with id ${product_id} has no associated user_id`);
  }

 

  const userRef = db.collection("users").doc(productData.user_id);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  const productDict = userData?.products || {};

  console.log(productDict);

  if (updatedFields.user_id) {
    throw new Error("User ID cannot be modified");
  }

  if (!productDict[product_id]) {
    throw new Error(`Product with id ${product_id} not found`);
  }

  const updatedProduct = {
    ...productDict[product_id],
    ...updatedFields,
  };

  await userRef.update({
    [`products.${product_id}`]: updatedProduct
  });

  await productRef.set(updatedProduct);

  return { ...updatedProduct, product_id };
}

async function deleteProduct(userId: string, product_id: string) {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();
  const productDict = data?.products || {};

  if (!productDict[product_id]) {
    throw new Error(`Product with id ${product_id} not found`);
  }

  const deletedProduct = productDict[product_id];

  await userRef.update({
    [`products.${product_id}`]: FieldValue.delete(),
  });

  return deletedProduct;
}

export { getProducts, createProduct, updateProduct, deleteProduct };