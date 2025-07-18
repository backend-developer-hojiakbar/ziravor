
import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockOrders, products } from '../data/mockData';
import { Order } from '../types';

const salesData = [
  { name: 'Dushanba', Savdo: 400000 },
  { name: 'Seshanba', Savdo: 300000 },
  { name: 'Chorshanba', Savdo: 500000 },
  { name: 'Payshanba', Savdo: 450000 },
  { name: 'Juma', Savdo: 600000 },
  { name: 'Shanba', Savdo: 800000 },
  { name: 'Yakshanba', Savdo: 350000 },
];

const statusColors: { [key: string]: string } = {
  'Yangi': 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
  'Qayta ishlanmoqda': 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30',
  'Yetkazilmoqda': 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30',
  'Tugallangan': 'bg-green-500/20 text-green-300 border border-green-400/30',
  'Bekor qilingan': 'bg-red-500/20 text-red-300 border border-red-400/30',
};

const topProducts = products.slice(0, 5).map((p, i) => ({...p, sold: 100 - i * 15}));

const AdminDashboard: React.FC = () => {
    const totalRevenue = mockOrders.reduce((acc, order) => acc + order.total, 0);
    const newOrdersCount = mockOrders.filter(o => o.status === 'Yangi').length;

  return (
    <div className="bg-gray-900/50 p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-white">Administrator Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
          <h3 className="text-gray-400">Umumiy Savdo</h3>
          <p className="text-3xl font-bold text-green-400">{totalRevenue.toLocaleString('uz-UZ')} so'm</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
          <h3 className="text-gray-400">Buyurtmalar Soni</h3>
          <p className="text-3xl font-bold text-white">{mockOrders.length}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
          <h3 className="text-gray-400">Yangi Buyurtmalar</h3>
          <p className="text-3xl font-bold text-blue-400">{newOrdersCount}</p>
        </div>
         <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
          <h3 className="text-gray-400">Mahsulotlar Soni</h3>
          <p className="text-3xl font-bold text-white">{products.length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
          <h3 className="font-bold mb-4 text-white">Haftalik Sotuvlar Statistikasi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis tickFormatter={(value) => `${Number(value)/1000}k`} stroke="#A0AEC0" />
              <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
              <Legend wrapperStyle={{ color: '#E2E8F0' }} />
              <Line type="monotone" dataKey="Savdo" stroke="#38b2ac" strokeWidth={2} activeDot={{ r: 8 }} dot={{ fill: '#38b2ac' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
           <h3 className="font-bold mb-4 text-white">Eng Ko'p Sotilayotgan Mahsulotlar</h3>
            <div className="space-y-4">
              {topProducts.map(p => (
                 <div key={p.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">{p.name}</span>
                      <span className="text-sm font-medium text-gray-400">{p.sold} dona</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div className="bg-cyan-500 h-2.5 rounded-full" style={{width: `${p.sold}%`}}></div>
                    </div>
                </div>
              ))}
            </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
        <h3 className="font-bold mb-4 text-white">So'nggi Buyurtmalar</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900/70">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Mijoz</th>
                <th scope="col" className="px-6 py-3">Sana</th>
                <th scope="col" className="px-6 py-3">Summa</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order: Order) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4">{order.customer.name}</td>
                  <td className="px-6 py-4">{order.date.toLocaleDateString()}</td>
                  <td className="px-6 py-4">{order.total.toLocaleString('uz-UZ')} so'm</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <button className="font-medium text-cyan-400 hover:underline">Ko'rish</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const correctPassword = "admin"; 

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError("Noto'g'ri parol. Iltimos, qayta urinib ko'ring.");
        }
    };
    
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
                    <h2 className="text-2xl font-bold text-center text-white">Administrator Kirishi</h2>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="password-admin" className="block mb-2 text-sm font-medium text-gray-300">Parol</label>
                            <input
                                type="password"
                                name="password"
                                id="password-admin"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-900/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <button type="submit" className="w-full text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all">
                            Kirish
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <AdminDashboard />;
};

export default AdminDashboardPage;
