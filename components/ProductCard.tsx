
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg hover:border-cyan-400/50 hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden flex flex-col h-full relative p-1">
        <div className="relative rounded-xl overflow-hidden">
          <img src={product.imageUrl} alt={product.name} className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110" />
           {!product.inStock && (
            <div className="absolute top-2 left-2 bg-red-900/50 backdrop-blur-sm text-red-200 text-xs font-semibold px-3 py-1 rounded-full border border-red-300/30">Mavjud emas</div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-cyan-400 mb-1">{product.category}</p>
          <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-cyan-300 transition-colors">{product.name}</h3>
          <p className="text-cyan-400 font-bold text-2xl mb-4 flex-grow">
            {product.price.toLocaleString('uz-UZ')} so'm
            <span className="text-sm font-normal text-gray-400"> / 100gr</span>
          </p>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full mt-auto flex items-center justify-center bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white font-semibold py-3 px-4 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:opacity-50 shadow-md hover:shadow-lg hover:shadow-cyan-500/40"
          >
            <ShoppingCartIcon className="w-5 h-5 mr-2" />
            Savatga qo'shish
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;