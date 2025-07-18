
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const CheckoutPage: React.FC = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Naqd',
    notes: ''
  });

  if (cartItems.length === 0 && process.env.NODE_ENV !== 'development') {
    navigate('/cart');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderId = `ZIRAVOR-${Date.now()}`;
    console.log("Yangi buyurtma:", {
      id: orderId,
      customer: formData,
      items: cartItems,
      total: totalPrice
    });
    
    clearCart();
    navigate('/thank-you', { state: { orderId } });
  };

  const formInputStyle = "mt-1 block w-full bg-white/5 border-white/20 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-3 transition";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Buyurtmani rasmiylashtirish</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Checkout Form */}
        <div className="lg:col-span-3 bg-black/20 backdrop-blur-2xl p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Sizning ma'lumotlaringiz</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Ism-sharifingiz</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Telefon raqamingiz</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+998 XX XXX XX XX" required className={formInputStyle} />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300">Yetkazib berish manzili</label>
              <textarea id="address" name="address" rows={3} value={formData.address} onChange={handleChange} placeholder="Shahar, tuman, ko'cha, uy raqami" required className={formInputStyle}></textarea>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">Lokatsiyani xaritadan belgilash</label>
              <div className="mt-1 h-48 bg-black/20 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
                 <p className="text-gray-400">Xarita integratsiyasi (kelajakda)</p>
              </div>
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300">To'lov turi</label>
              <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className={formInputStyle}>
                <option className="bg-gray-800 text-white">Naqd</option>
                <option className="bg-gray-800 text-white">Click</option>
                <option className="bg-gray-800 text-white">Payme</option>
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Qo'shimcha izoh</label>
              <textarea id="notes" name="notes" rows={2} value={formData.notes} onChange={handleChange} placeholder="Masalan, soat 18:00 dan keyin qo'ng'iroq qiling" className={formInputStyle}></textarea>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-4 rounded-full text-lg hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50">
              Buyurtmani tasdiqlash
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
            <div className="bg-black/20 backdrop-blur-2xl p-8 rounded-2xl h-fit sticky top-28 border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-white">Sizning buyurtmangiz</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-white/10" />
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">Miqdor: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-white text-right">{(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/20 mt-6 pt-4 space-y-2">
                <div className="flex justify-between text-lg text-gray-300">
                  <span>Jami:</span>
                  <span className="font-semibold text-white">{totalPrice.toLocaleString('uz-UZ')} so'm</span>
                </div>
                <div className="flex justify-between text-lg text-gray-300">
                  <span>Yetkazib berish:</span>
                  <span className="font-semibold text-white">Bepul</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white mt-2">
                  <span>Umumiy:</span>
                  <span className="text-cyan-400">{totalPrice.toLocaleString('uz-UZ')} so'm</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;