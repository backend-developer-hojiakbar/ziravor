
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import { useCart } from '../hooks/useCart';

const Header: React.FC = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-gray-300 hover:text-white transition-colors duration-300 relative py-2 ${isActive ? 'font-bold text-cyan-400' : ''}`;


  return (
    <header className="bg-black/30 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <NavLink to="/" className="text-2xl font-bold text-white transition-all hover:text-cyan-300" style={{ textShadow: '0 0 10px rgba(0, 198, 255, 0.7)' }}>
            Ziravorlar
          </NavLink>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/catalog" className={navLinkClasses}>Katalog</NavLink>
            <NavLink to="/about" className={navLinkClasses}>Biz haqimizda</NavLink>
            <NavLink to="/delivery" className={navLinkClasses}>Yetkazib berish</NavLink>
            <NavLink to="/contact" className={navLinkClasses}>Aloqa</NavLink>
          </nav>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden sm:block">
              <input
                type="text"
                placeholder="Qidiruv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border bg-white/10 border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm text-white placeholder-gray-400 w-32 md:w-48"
              />
            </form>
            <NavLink to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <ShoppingCartIcon className="h-7 w-7"/>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-cyan-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;