import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';
import { useCart } from '../hooks/useCart';
import PlusIcon from '../components/icons/PlusIcon';
import MinusIcon from '../components/icons/MinusIcon';
import ProductCard from '../components/ProductCard';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'props' | 'usage' | 'comp'>('desc');
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    api.getProductById(id)
      .then(fetchedProduct => {
        setProduct(fetchedProduct);
        setMainImage(fetchedProduct.main_image);
        api.getProducts({ category: fetchedProduct.category })
          .then(allProducts => {
            setRelatedProducts(allProducts.filter(p => p.id !== fetchedProduct.id).slice(0, 4));
          });
      })
      .catch(() => setError("Mahsulotni yuklashda xatolik ro'y berdi."))
      .finally(() => setLoading(false));

    setQuantity(1);
    setActiveTab('desc');

  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-white">Yuklanmoqda...</div>;
  }
  
  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-white">{error || 'Mahsulot topilmadi'}</h2>
        <Link to="/catalog" className="text-cyan-400 hover:underline mt-4 inline-block">Katalogga qaytish</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black/20 backdrop-blur-2xl p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square bg-black/20 rounded-xl overflow-hidden mb-4 border border-white/10">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((imgObj, index) => (
                <button
                  key={imgObj.id}
                  onClick={() => setMainImage(imgObj.image)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition duration-200 ${mainImage === imgObj.image ? 'border-cyan-400 shadow-md shadow-cyan-500/50' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={imgObj.image} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-cyan-400 font-semibold mb-2">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{product.name}</h1>
            <p className="text-5xl font-bold text-cyan-400 mb-8" style={{ textShadow: '0 0 15px rgba(0,198,255,0.4)' }}>
              {product.price.toLocaleString('uz-UZ')} so'm 
              <span className="text-xl font-normal text-gray-400"> / 100gr</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="flex items-center border border-white/20 rounded-full p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"><MinusIcon /></button>
                <input type="text" value={`${quantity}`} readOnly className="w-16 bg-transparent text-center font-semibold text-white text-lg focus:outline-none" />
                <span className="text-gray-400 text-sm mr-2">x100gr</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"><PlusIcon /></button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="w-full sm:w-auto flex-grow bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {product.in_stock ? "Savatga qo'shish" : "Mavjud emas"}
              </button>
            </div>
            
            <div className="mt-8">
              <div className="border-b border-white/10">
                <nav className="-mb-px flex space-x-6">
                  <button onClick={() => setActiveTab('desc')} className={`py-4 px-1 border-b-2 font-medium text-base transition ${activeTab === 'desc' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>Tavsif</button>
                  <button onClick={() => setActiveTab('props')} className={`py-4 px-1 border-b-2 font-medium text-base transition ${activeTab === 'props' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>Xususiyatlari</button>
                  <button onClick={() => setActiveTab('usage')} className={`py-4 px-1 border-b-2 font-medium text-base transition ${activeTab === 'usage' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>Qo'llanilishi</button>
                  <button onClick={() => setActiveTab('comp')} className={`py-4 px-1 border-b-2 font-medium text-base transition ${activeTab === 'comp' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>Tarkibi</button>
                </nav>
              </div>
              <div className="py-6 text-gray-300 leading-relaxed min-h-[100px]">
                {activeTab === 'desc' && <p>{product.description}</p>}
                {activeTab === 'props' && <p>{product.properties}</p>}
                {activeTab === 'usage' && <p>{product.usage}</p>}
                {activeTab === 'comp' && <p>{product.composition}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

       {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">O'xshash mahsulotlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;