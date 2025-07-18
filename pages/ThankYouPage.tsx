
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="text-center py-20 bg-black/20 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
            <div className="mx-auto flex items-center justify-center h-28 w-28 rounded-full bg-green-500/20 mb-8 border-2 border-green-400/50" style={{boxShadow: '0 0 30px rgba(42, 235, 139, 0.4)'}}>
                <svg className="h-20 w-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
          <h1 className="text-5xl font-bold mb-4 text-white">Rahmat!</h1>
          <p className="text-xl text-gray-300 mb-2">Buyurtmangiz qabul qilindi!</p>
          <p className="text-lg text-gray-400 mb-8">Tez orada operatorimiz siz bilan bog'lanadi.</p>
          {orderId && (
            <div className="text-lg font-semibold bg-white/10 inline-block px-6 py-3 rounded-lg border border-white/20">
              <span className="text-gray-300">Buyurtma raqamingiz: </span>
              <span className="text-cyan-400">{orderId}</span>
            </div>
          )}
          <div className="mt-12">
            <Link
              to="/"
              className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-4 px-10 rounded-full text-lg hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
            >
              Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
    </div>
  );
};

export default ThankYouPage;