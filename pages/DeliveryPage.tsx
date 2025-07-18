
import React from 'react';

const DeliveryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="bg-black/20 backdrop-blur-2xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-white">Yetkazib Berish Shartlari</h1>
          <div className="space-y-8 text-gray-300">
            
            <div className="p-6 border-l-4 border-cyan-400 bg-cyan-900/20 rounded-r-lg">
              <h2 className="text-2xl font-bold mb-3 text-cyan-300">Toshkent shahri bo'ylab</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong>Standart yetkazib berish:</strong> Buyurtma qabul qilinganidan so'ng 24 soat ichida.</li>
                <li><strong>Yetkazib berish narxi:</strong> 200 000 so'mdan ortiq buyurtmalar uchun - <strong className="text-green-400">BEPUL</strong>.</li>
                <li>200 000 so'mgacha bo'lgan buyurtmalar uchun - 20 000 so'm.</li>
                <li><strong>Ish vaqti:</strong> Dushanba - Shanba, 09:00 dan 20:00 gacha.</li>
              </ul>
            </div>
            
            <div className="p-6 border-l-4 border-amber-400 bg-amber-900/20 rounded-r-lg">
              <h2 className="text-2xl font-bold mb-3 text-amber-300">O'zbekiston bo'ylab</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong>Pochta xizmati orqali:</strong> Buyurtmalar "O'zbekiston Pochtasi" yoki boshqa kelishilgan kuryerlik xizmatlari orqali yuboriladi.</li>
                <li><strong>Yetkazib berish muddati:</strong> 3-7 ish kuni (hududga qarab).</li>
                <li><strong>Yetkazib berish narxi:</strong> Kuryerlik xizmati tariflariga muvofiq alohida hisoblanadi. Operator siz bilan bog'lanib, narxni ma'lum qiladi.</li>
                <li>To'lov oldindan amalga oshiriladi (Click, Payme).</li>
              </ul>
            </div>
            
            <div className="p-6 border-l-4 border-gray-400 bg-gray-900/20 rounded-r-lg">
              <h2 className="text-2xl font-bold mb-3 text-gray-300">Muhim Ma'lumot</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Kuryer sizga qo'ng'iroq qilganda telefoningiz yonida bo'lishingizni so'raymiz.</li>
                <li>Manzilni va telefon raqamini to'g'ri kiritganingizga ishonch hosil qiling. Xato ma'lumotlar tufayli yetkazib berish kechikishi mumkin.</li>
                <li>Yakshanba va bayram kunlari yetkazib berish xizmati ishlamaydi. Bu kunlarda qilingan buyurtmalar keyingi ish kunida qayta ishlanadi.</li>
              </ul>
            </div>

          </div>
        </div>
    </div>
  );
};

export default DeliveryPage;