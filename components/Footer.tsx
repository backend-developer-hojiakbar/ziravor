
import React from 'react';
import { Link } from 'react-router-dom';
import TelegramIcon from './icons/TelegramIcon';
import InstagramIcon from './icons/InstagramIcon';
import FacebookIcon from './icons/FacebookIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/20 backdrop-blur-lg mt-16 border-t border-white/10 text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={{ textShadow: '0 0 8px rgba(0, 198, 255, 0.5)' }}>Ziravorlar Dunyosi</h3>
            <p className="text-sm">Tabiatning shifobaxsh ne'matlari siz uchun.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Sahifalar</h3>
            <ul className="space-y-2">
              <li><Link to="/catalog" className="hover:text-cyan-400 transition-colors">Katalog</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">Biz haqimizda</Link></li>
              <li><Link to="/delivery" className="hover:text-cyan-400 transition-colors">Yetkazib berish</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Aloqa</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Biz bilan aloqa</h3>
            <p>+998 (99) 123-45-67</p>
            <p>info@ziravorlar.uz</p>
            <div className="flex justify-center md:justify-start space-x-5 mt-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Telegram">
                  <TelegramIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Instagram">
                  <InstagramIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Facebook">
                  <FacebookIcon />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-sm mt-12 border-t border-white/10 pt-6">
          <p>&copy; {new Date().getFullYear()} Ziravorlar Dunyosi. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;