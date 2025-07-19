import { Product, Category, Order } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.detail || JSON.stringify(errorJson));
        } catch (e) {
            throw new Error(`HTTP ${response.status} xatolik! Server javobi JSON formatida emas.`);
        }
    }
    // No-content javobini to'g'ri handle qilish (masalan, DELETE uchun)
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

export const api = {
    getProducts: (params: { category?: string; ordering?: string; search?: string } = {}): Promise<Product[]> => {
        const query = new URLSearchParams();
        if (params.category && params.category !== 'all') query.append('category', params.category);
        if (params.ordering && params.ordering !== 'default') query.append('ordering', params.ordering);
        if (params.search) query.append('search', params.search);
        return fetch(`${API_BASE_URL}/products/?${query.toString()}`).then(handleResponse);
    },

    getProductById: (id: string): Promise<Product> => {
        return fetch(`${API_BASE_URL}/products/${id}/`).then(handleResponse);
    },

    getCategories: (): Promise<Category[]> => {
        return fetch(`${API_BASE_URL}/categories/`).then(handleResponse);
    },

    createCategory: (data: { name: string; slug: string }, token: string): Promise<Category> => {
        return fetch(`${API_BASE_URL}/categories/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            body: JSON.stringify(data)
        }).then(handleResponse);
    },

    updateCategory: (id: string, data: { name: string; slug: string }, token: string): Promise<Category> => {
        return fetch(`${API_BASE_URL}/categories/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            body: JSON.stringify(data)
        }).then(handleResponse);
    },

    createProduct: (formData: FormData, token: string): Promise<Product> => {
        return fetch(`${API_BASE_URL}/products/`, {
            method: 'POST',
            headers: { 'Authorization': `Token ${token}` },
            body: formData
        }).then(handleResponse);
    },

    updateProduct: (id: string, formData: FormData, token: string): Promise<Product> => {
        return fetch(`${API_BASE_URL}/products/${id}/`, {
            method: 'PATCH',
            headers: { 'Authorization': `Token ${token}` },
            body: formData
        }).then(handleResponse);
    },

    createOrder: (orderData: { customer_name: string; customer_phone: string; customer_address: string; customer_notes: string; payment_method: string; items: { product_id: number; quantity: number }[]; }): Promise<Order> => {
        return fetch(`${API_BASE_URL}/orders/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) }).then(handleResponse);
    },

    createContactMessage: (messageData: { name: string; email: string; message: string }): Promise<any> => {
         return fetch(`${API_BASE_URL}/contact/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(messageData) }).then(handleResponse);
    },

    adminLogin: async (password: string, username: string = 'admin'): Promise<{ token: string }> => {
        const response = await fetch(`${API_BASE_URL}/admin/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
        return handleResponse(response);
    },
    
    getAdminProtectedData: (endpoint: string, token: string): Promise<any> => {
        return fetch(`${API_BASE_URL}/admin/${endpoint}/`, { headers: { 'Authorization': `Token ${token}` } }).then(handleResponse);
    },

    getAdminOrders: (token: string): Promise<Order[]> => {
        return fetch(`${API_BASE_URL}/orders/`, { headers: { 'Authorization': `Token ${token}` } }).then(handleResponse);
    }
};