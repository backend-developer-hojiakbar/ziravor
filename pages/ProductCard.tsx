import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import CartIcon from './icons/CartIcon';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-xl backdrop-blur-lg transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-500/20">
      <div className="aspect-square overflow-hidden">
        <img
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          src={product.main_image}
          alt={product.name}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-cyan-400">{product.category}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-3 text-sm text-gray-400 line-clamp-2">{product.description}</p>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-2xl font-bold text-white">
            {product.price.toLocaleString('uz-UZ')}
            <span className="text-sm font-normal text-gray-400"> so'm</span>
          </p>
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="relative flex items-center justify-center rounded-full bg-cyan-500/20 p-3 text-white transition-colors hover:bg-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;