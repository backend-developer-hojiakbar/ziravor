
import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const popularProducts = products.slice(0, 4);

  const AdvantageIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
      {children}
    </div>
  );

  return (
    <div className="space-y-20 md:space-y-32">
      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4 tracking-tight" style={{textShadow: "0 0 30px rgba(0,198,255,0.4)"}}>
            Tabiatning O'zi - Sog'liq Manbai
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Eng sara ziravorlar va dorivor giyohlarni biz bilan kashf eting. Kelajak texnologiyalari tabiat bilan uyg'unlikda.
          </p>
          <Link
            to="/catalog"
            className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-4 px-10 rounded-full text-lg hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
          >
            Katalogga o'tish
          </Link>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white" style={{textShadow: "0 0 15px rgba(255,255,255,0.2)"}}>Ommabop Mahsulotlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Advantages Section */}
      <section className="container mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">Nega Aynan Biz?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="flex flex-col items-center">
                <AdvantageIcon>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                </AdvantageIcon>
                <h3 className="text-2xl font-bold mb-2 text-white">100% Tabiiy</h3>
                <p className="text-gray-400">Barcha mahsulotlarimiz ekologik toza hududlardan yig'ib olingan va kimyoviy qo'shimchalarsiz.</p>
              </div>
              <div className="flex flex-col items-center">
                <AdvantageIcon>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </AdvantageIcon>
                <h3 className="text-2xl font-bold mb-2 text-white">Oson Buyurtma</h3>
                <p className="text-gray-400">Ro'yxatdan o'tmasdan, bir necha qadamda osonlik bilan buyurtma bering.</p>
              </div>
              <div className="flex flex-col items-center">
                <AdvantageIcon>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10"></path></svg>
                </AdvantageIcon>
                <h3 className="text-2xl font-bold mb-2 text-white">Tez Yetkazib Berish</h3>
                <p className="text-gray-400">Buyurtmangizni Toshkent shahri bo'ylab eng qisqa muddatlarda yetkazib beramiz.</p>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;