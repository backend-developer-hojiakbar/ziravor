
export interface Product {
  id: string;
  name: string;
  price: number; // per 100gr
  category: string;
  imageUrl: string;
  images: string[];
  description: string;
  properties: string;
  usage: string;
  composition: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem extends Product {
  quantity: number; // represents units of 100gr
}

export interface Order {
    id: string;
    customer: {
        name: string;
        phone: string;
        address: string;
        location?: { lat: number, lng: number };
        notes: string;
    };
    items: CartItem[];
    total: number;
    paymentMethod: 'Naqd' | 'Click' | 'Payme';
    status: 'Yangi' | 'Qayta ishlanmoqda' | 'Yetkazilmoqda' | 'Tugallangan' | 'Bekor qilingan';
    date: Date;
}
