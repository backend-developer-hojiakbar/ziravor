import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import TrashIcon from '../components/icons/TrashIcon';
import PlusIcon from '../components/icons/PlusIcon';
import MinusIcon from '../components/icons/MinusIcon';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, itemCount, totalPrice } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-20 bg-black/20 backdrop-blur-2xl rounded-2xl border border-white/10">
          <h2 className="text-4xl font-bold mb-4 text-white">Savatingiz bo'sh</h2>
          <p className="text-gray-400 mb-10">Hozircha siz hech narsa qo'shmadingiz.</p>
          <Link
            to="/catalog"
            className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-4 px-10 rounded-full text-lg hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
          >
            Xarid qilishni boshlash
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black/20 backdrop-blur-2xl p-4 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-8 text-white">Savat</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5 transition-all hover:border-cyan-400/50">
                  <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                    {/* `imageUrl` o'rniga `main_image` ishlatiladi */}
                    <img src={item.main_image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border border-white/10" />
                    <div>
                      <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                      <p className="text-gray-400">{item.price.toLocaleString('uz-UZ')} so'm / 100gr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                    <div className="flex items-center border border-white/20 rounded-full p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"><MinusIcon className="h-4 w-4" /></button>
                      <span className="w-12 text-center font-semibold text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"><PlusIcon className="h-4 w-4" /></button>
                    </div>
                    <p className="font-bold w-32 text-right text-white">
                      {(item.price * item.quantity).toLocaleString('uz-UZ')} so'm
                    </p>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 transition-colors">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 p-6 rounded-2xl sticky top-28 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-white">Buyurtma xulosasi</h2>
              <div className="space-y-3 mb-6 text-gray-300">
                <div className="flex justify-between">
                  <span>Mahsulotlar ({itemCount} dona):</span>
                  <span className="text-white">{totalPrice.toLocaleString('uz-UZ')} so'm</span>
                </div>
                <div className="flex justify-between">
                  <span>Yetkazib berish:</span>
                  <span className="text-cyan-400">Bepul (promo)</span>
                </div>
              </div>
              <div className="border-t border-white/20 pt-4 flex justify-between font-bold text-xl">
                <span className="text-white">Umumiy summa:</span>
                <span className="text-cyan-400">{totalPrice.toLocaleString('uz-UZ')} so'm</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-3 rounded-full text-lg hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
              >
                Rasmiylashtirish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;