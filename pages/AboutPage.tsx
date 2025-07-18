
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black/20 backdrop-blur-2xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Biz Haqimizda</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <img src="https://picsum.photos/seed/aboutus/800/300" alt="Brand" className="w-full h-64 object-cover rounded-lg border border-white/10"/>
          <p>
            <strong className="text-cyan-400">Ziravorlar Dunyosi</strong> - bu shunchaki onlayn-do'kon emas. Bu sog'lom turmush tarziga bo'lgan ishtiyoqimiz, tabiatga bo'lgan muhabbatimiz va mijozlarimizga eng yaxshisini ulashish istagimizning mujassamidir. Biz O'zbekistonning turli burchaklaridan, ekologik toza hududlardan eng sifatli dorivor giyohlar va xushbo'y ziravorlarni yig'ib, sizning dasturxoningizga yetkazamiz.
          </p>
          <p>
            Bizning asosiy maqsadimiz - odamlarga tabiat ne'matlaridan unumli foydalanish orqali o'z salomatliklarini mustahkamlashga yordam berish. Har bir mahsulotimiz sinchkovlik bilan tanlab olinadi, to'g'ri sharoitlarda quritiladi va saqlanadi. Bu ularning barcha foydali xususiyatlari va betakror ta'mini saqlab qolish imkonini beradi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-400/20">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-2">Bizning Missiyamiz</h3>
                  <p className="text-gray-400">Mijozlarimizni yuqori sifatli, 100% tabiiy mahsulotlar bilan ta'minlash orqali ularning hayot sifatini yaxshilash va sog'lom turmush tarzini targ'ib qilish.</p>
              </div>
               <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-400/20">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-2">Bizning Qadriyatlarimiz</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                      <li>Sifat</li>
                      <li>Tabiiylik</li>
                      <li>Halollik</li>
                      <li>Mijozlarga g'amxo'rlik</li>
                  </ul>
              </div>
          </div>
          <p className="text-center pt-4">
            Biz bilan bo'lganingiz uchun tashakkur! Savollaringiz bo'lsa, <Link to="/contact" className="text-cyan-400 hover:underline font-semibold">biz bilan bog'laning</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;