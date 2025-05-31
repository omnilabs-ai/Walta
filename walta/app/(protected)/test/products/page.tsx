'use client'

import { useState } from 'react'

interface ProductData {
  id: string;
  name: string;
  vendor_id: string;
  price_cents: number;
  created_at: string;
}

interface ErrorResponse {
  message: string;
  error: string;
}

export default function TestPage() {
    const [data, setData] = useState<ProductData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [newProduct, setNewProduct] = useState({
        name: '',
        vendor_id: '',
        price_cents: '',
        id: ''
    })

    const createNewProduct = async () => {
        if (!newProduct.name || !newProduct.vendor_id || !newProduct.price_cents) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true)
        try {
            const response = await fetch('/api/products/createProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newProduct.name,
                    vendor_id: newProduct.vendor_id,
                    price_cents: parseInt(newProduct.price_cents)
                })
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                const errorData = result as ErrorResponse;
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            setData(result)
            setNewProduct({ name: '', vendor_id: '', price_cents: '', id: '' })
            setError(null)
        } catch (err) {
            console.error('Error caught:', err)
            setError(err instanceof Error ? err.message : 'An unknown error occurred')
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const getProducts = async (productId?: string) => {
        setLoading(true)
        try {
            let response;
            if (productId) {
                response = await fetch(`/api/products/getProduct?productId=${productId}`)
            } else {
                response = await fetch('/api/products/getProduct')
            }
            const result = await response.json()
            
            if (!response.ok) {
                const errorData = result as ErrorResponse;
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            setData(result)
            setError(null)
        } catch (err) {
            console.error('Error caught:', err)
            setError(err instanceof Error ? err.message : 'An unknown error occurred')
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const updateProduct = async () => {
        if (!newProduct.id.trim()) {
            setError('Please enter a product ID');
            return;
        }
        if (!newProduct.name.trim()) {
            setError('Please enter a new name');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/products/updateProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: newProduct.id,
                    updateData: { 
                        name: newProduct.name,
                        price_cents: parseInt(newProduct.price_cents)
                    }
                })
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                const errorData = result as ErrorResponse;
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            setData(result);
            setNewProduct({ name: '', vendor_id: '', price_cents: '', id: '' });
            setError(null);
        } catch (err) {
            console.error('Error caught:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

    const deleteProduct = async () => {
        if (!newProduct.id.trim()) {
            setError('Please enter a product ID');
            return;
        }

        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/products/deleteProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: newProduct.id })
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                const errorData = result as ErrorResponse;
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            setData(null);
            setNewProduct({ name: '', vendor_id: '', price_cents: '', id: '' });
            setError(null);
        } catch (err) {
            console.error('Error caught:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Products Test Page</h1>
            
            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Product name"
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        value={newProduct.vendor_id}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, vendor_id: e.target.value }))}
                        placeholder="Vendor ID"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        value={newProduct.price_cents}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price_cents: e.target.value }))}
                        placeholder="Price in cents"
                        className="border p-2 rounded"
                    />
                </div>

                <div className="space-x-4">
                    <button 
                        onClick={createNewProduct}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create New Product'}
                    </button>

                    <button 
                        onClick={() => getProducts()}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Get Products'}
                    </button>
                </div>
            </div>

            {data && (
                <div className="mt-4">
                    <div className="flex flex-col space-y-2">
                        <input
                            type="text"
                            value={newProduct.id}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, id: e.target.value }))}
                            placeholder="Product ID"
                            className="border p-2 rounded"
                        />
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={updateProduct}
                                disabled={loading}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Product'}
                            </button>
                            <button
                                onClick={deleteProduct}
                                disabled={loading}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {error ? (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            ) : data && (
                <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <p className="font-bold">Success!</p>
                    <pre className="mt-2 whitespace-pre-wrap">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}
