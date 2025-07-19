// src/types.ts

// ProductImage'ni alohida tur sifatida belgilaymiz
export interface ProductImage {
  id: number;
  image: string; // Bu to'liq URL bo'ladi
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  main_image: string;
  images: ProductImage[];
  description: string;
  properties: string;
  usage: string;
  composition: string;
  in_stock: boolean;
}
// Qolgan interfeyslar o'zgarishsiz qoladi
export interface Category {
  id: string;
  name: string;
  slug: string; // slug qo'shildi
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
    id: string;
    customer: {
        name: string;
        phone: string;
        address: string;
        notes: string;
    };
    items: CartItem[];
    total: number;
    paymentMethod: 'Naqd' | 'Click' | 'Payme';
    status: 'Yangi' | 'Qayta ishlanmoqda' | 'Yetkazilmoqda' | 'Tugallangan' | 'Bekor qilingan';
    date: Date;
}