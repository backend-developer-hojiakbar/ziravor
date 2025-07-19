import React, { useState, useEffect, FormEvent } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Order, Category, Product } from '../types';
import { api } from '../services/api';

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && /defaultProps/.test(args[0])) return;
  originalError.apply(console, args);
};

const inputStyle = "mt-1 block w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5 transition";
const formSectionStyle = "bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10";
const formTitleStyle = "text-xl font-bold mb-4 text-white";
const submitButtonStyle = "w-full text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all disabled:opacity-50";
const modalOverlayStyle = "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4";
const modalContentStyle = "bg-gray-800 border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto";

const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const statusColors: { [key: string]: string } = {
  'Yangi': 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
  'Qayta ishlanmoqda': 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30',
  'Yetkazilmoqda': 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30',
  'Tugallangan': 'bg-green-500/20 text-green-300 border border-green-400/30',
  'Bekor qilingan': 'bg-red-500/20 text-red-300 border border-red-400/30',
};

const ManagementSection: React.FC<{ token: string, onUpdate: () => void }> = ({ token, onUpdate }) => {
    const [categoryName, setCategoryName] = useState('');
    const [productData, setProductData] = useState({ name: '', price: '', category: '', description: '', properties: '', usage: '', composition: '' });
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [galleryImageFiles, setGalleryImageFiles] = useState<FileList | null>(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchData = () => {
        api.getCategories().then(setAllCategories).catch(() => setFormError('Kategoriyalarni yuklab bo`lmadi'));
        api.getProducts().then(setAllProducts).catch(() => setFormError('Mahsulotlarni yuklab bo`lmadi'));
    };

    useEffect(fetchData, [onUpdate]);

    const handleCategorySubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting('create-category'); setFormError(''); setFormSuccess('');
        try {
            await api.createCategory({ name: categoryName, slug: slugify(categoryName) }, token);
            setFormSuccess(`'${categoryName}' kategoriyasi qo'shildi!`); setCategoryName(''); onUpdate();
        } catch (error: any) { setFormError(error.message || 'Kategoriya qo\'shishda xatolik.'); } 
        finally { setSubmitting(null); }
    };
    
    const handleCategoryUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        setSubmitting(`edit-category-${editingCategory.id}`); setFormError(''); setFormSuccess('');
        try {
            await api.updateCategory(editingCategory.id, { name: editingCategory.name, slug: slugify(editingCategory.name) }, token);
            setFormSuccess(`'${editingCategory.name}' kategoriyasi yangilandi!`); setEditingCategory(null); onUpdate();
        } catch (error: any) { setFormError(error.message || 'Kategoriyani yangilashda xatolik.'); } 
        finally { setSubmitting(null); }
    };
    
    const handleProductSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!mainImageFile) { setFormError("Iltimos, mahsulot uchun asosiy rasmni yuklang."); return; }
        setSubmitting('create-product'); setFormError(''); setFormSuccess('');
        
        const formData = new FormData();
        Object.keys(productData).forEach(key => formData.append(key, (productData as any)[key]));
        formData.append('in_stock', 'true');
        formData.append('main_image', mainImageFile);
        if (galleryImageFiles) {
            for (let i = 0; i < galleryImageFiles.length; i++) { formData.append('images', galleryImageFiles[i]); }
        }

        try {
            await api.createProduct(formData, token);
            setFormSuccess(`'${productData.name}' mahsuloti qo'shildi!`);
            setProductData({ name: '', price: '', category: '', description: '', properties: '', usage: '', composition: '' });
            setMainImageFile(null); setGalleryImageFiles(null);
            (e.target as HTMLFormElement).reset(); onUpdate();
        } catch (error: any) { setFormError(error.message || 'Mahsulot qo\'shishda xatolik.'); } 
        finally { setSubmitting(null); }
    };

    const handleProductUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setSubmitting(`edit-product-${editingProduct.id}`); setFormError(''); setFormSuccess('');

        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('price', editingProduct.price.toString());
        formData.append('description', editingProduct.description);
        formData.append('properties', editingProduct.properties);
        formData.append('usage', editingProduct.usage);
        formData.append('composition', editingProduct.composition);
        
        const categoryId = allCategories.find(c => c.name === editingProduct.category)?.id;
        if(categoryId) formData.append('category', categoryId);
        
        if (mainImageFile) formData.append('main_image', mainImageFile);
        if (galleryImageFiles) {
            for (let i = 0; i < galleryImageFiles.length; i++) { formData.append('images', galleryImageFiles[i]); }
        }

        try {
            await api.updateProduct(editingProduct.id, formData, token);
            setFormSuccess(`'${editingProduct.name}' mahsuloti yangilandi!`);
            setEditingProduct(null); setMainImageFile(null); setGalleryImageFiles(null); onUpdate();
        } catch(error: any) { setFormError(error.message || 'Mahsulotni yangilashda xatolik.'); } 
        finally { setSubmitting(null); }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className={formSectionStyle}>
                    <h3 className={formTitleStyle}>Yangi Kategoriya Qo'shish</h3>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div><label htmlFor="cat-name" className="block mb-2 text-sm font-medium text-gray-300">Kategoriya Nomi</label><input type="text" id="cat-name" value={categoryName} onChange={e => setCategoryName(e.target.value)} required className={inputStyle} /></div>
                        <button type="submit" disabled={!!submitting} className={submitButtonStyle}>Qo'shish</button>
                    </form>
                </div>
                <div className={`${formSectionStyle} lg:row-span-3`}>
                    <h3 className={formTitleStyle}>Yangi Mahsulot Qo'shish</h3>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-sm text-gray-300">Nomi</label><input type="text" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} required className={inputStyle} /></div>
                            <div><label className="text-sm text-gray-300">Narxi (100gr)</label><input type="number" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} required className={inputStyle} /></div>
                        </div>
                        <div><label className="text-sm text-gray-300">Kategoriyasi</label><select value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} required className={inputStyle}><option value="" disabled>Tanlang...</option>{allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
                        <div><label className="text-sm text-gray-300">Tavsifi</label><textarea rows={2} value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} required className={inputStyle}></textarea></div>
                        <div><label className="text-sm text-gray-300">Xususiyatlari</label><textarea rows={2} value={productData.properties} onChange={e => setProductData({...productData, properties: e.target.value})} required className={inputStyle}></textarea></div>
                        <div><label className="text-sm text-gray-300">Qo'llanilishi</label><textarea rows={2} value={productData.usage} onChange={e => setProductData({...productData, usage: e.target.value})} required className={inputStyle}></textarea></div>
                        <div><label className="text-sm text-gray-300">Tarkibi</label><textarea rows={2} value={productData.composition} onChange={e => setProductData({...productData, composition: e.target.value})} required className={inputStyle}></textarea></div>
                        <div><label className="text-sm text-gray-300">Asosiy Rasm</label><input type="file" onChange={e => setMainImageFile(e.target.files ? e.target.files[0] : null)} required className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30`}/></div>
                        <div><label className="text-sm text-gray-300">Galereya Rasmlari</label><input type="file" multiple onChange={e => setGalleryImageFiles(e.target.files)} className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30`}/></div>
                        <button type="submit" disabled={!!submitting} className={submitButtonStyle}>Qo'shish</button>
                    </form>
                </div>
                <div className={formSectionStyle}>
                    <h3 className={formTitleStyle}>Mavjud Kategoriyalar</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">{allCategories.map(cat => <li key={cat.id} className="flex justify-between items-center bg-gray-900/50 p-2 rounded-md"><span>{cat.name}</span><button onClick={() => setEditingCategory(cat)} className="text-cyan-400 text-sm hover:underline">Tahrirlash</button></li>)}</ul>
                </div>
                <div className={formSectionStyle}>
                    <h3 className={formTitleStyle}>Mavjud Mahsulotlar</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">{allProducts.map(prod => <li key={prod.id} className="flex justify-between items-center bg-gray-900/50 p-2 rounded-md"><span>{prod.name}</span><button onClick={() => setEditingProduct(prod)} className="text-cyan-400 text-sm hover:underline">Tahrirlash</button></li>)}</ul>
                </div>

                {formError && <p className="text-red-400 text-center col-span-full lg:col-span-2">{formError}</p>}
                {formSuccess && <p className="text-green-400 text-center col-span-full lg:col-span-2">{formSuccess}</p>}
            </div>

            {editingCategory && (
                <div className={modalOverlayStyle} onClick={() => setEditingCategory(null)}>
                    <div className={modalContentStyle} onClick={e => e.stopPropagation()}>
                        <h3 className={formTitleStyle}>Kategoriyani Tahrirlash</h3>
                        <form onSubmit={handleCategoryUpdate} className="space-y-4">
                             <div><label>Kategoriya Nomi</label><input type="text" value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} required className={inputStyle} /></div>
                            <button type="submit" disabled={!!submitting} className={submitButtonStyle}>Yangilash</button>
                        </form>
                    </div>
                </div>
            )}

            {editingProduct && (
                <div className={modalOverlayStyle} onClick={() => setEditingProduct(null)}>
                     <div className={modalContentStyle} onClick={e => e.stopPropagation()}>
                        <h3 className={formTitleStyle}>Mahsulotni Tahrirlash</h3>
                        <form onSubmit={handleProductUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label>Nomi</label><input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required className={inputStyle} /></div>
                                <div><label>Narxi</label><input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} required className={inputStyle} /></div>
                            </div>
                            <div><label>Kategoriyasi</label><select value={allCategories.find(c => c.name === editingProduct.category)?.id} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} required className={inputStyle}>{allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
                            <div><label>Tavsifi</label><textarea rows={2} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} required className={inputStyle}></textarea></div>
                            <div><label>Xususiyatlari</label><textarea rows={2} value={editingProduct.properties} onChange={e => setEditingProduct({...editingProduct, properties: e.target.value})} required className={inputStyle}></textarea></div>
                            <div><label>Qo'llanilishi</label><textarea rows={2} value={editingProduct.usage} onChange={e => setEditingProduct({...editingProduct, usage: e.target.value})} required className={inputStyle}></textarea></div>
                            <div><label>Tarkibi</label><textarea rows={2} value={editingProduct.composition} onChange={e => setEditingProduct({...editingProduct, composition: e.target.value})} required className={inputStyle}></textarea></div>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1"><label>Yangi Asosiy Rasm (ixtiyoriy)</label><input type="file" onChange={e => setMainImageFile(e.target.files ? e.target.files[0] : null)} className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30`}/></div>
                                <img src={editingProduct.main_image} alt="Asosiy rasm" className="h-20 w-20 rounded-lg object-cover border border-white/10" />
                            </div>
                            <div><label>Yangi Galereya Rasmlari (mavjudlarga qo'shiladi)</label><input type="file" multiple onChange={e => setGalleryImageFiles(e.target.files)} className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30`}/></div>
                            <div className="flex flex-wrap gap-2 p-2 bg-black/20 rounded-lg">{editingProduct.images.length > 0 ? editingProduct.images.map(img => <img key={img.id} src={img.image} alt="Galereya rasmi" className="h-16 w-16 rounded-md object-cover" />) : <p className="text-gray-400 text-sm">Galereya rasmlari yo'q.</p>}</div>
                            <button type="submit" disabled={!!submitting} className={submitButtonStyle}>Yangilash</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

const AdminDashboard: React.FC<{ token: string; onLogout: () => void }> = ({ token, onLogout }) => {
    const [stats, setStats] = useState<any | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const forceUpdate = () => setUpdateTrigger(v => v + 1);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const [statsData, ordersData, weeklySalesData, topProductsData] = await Promise.all([
                    api.getAdminProtectedData('stats', token),
                    api.getAdminOrders(token),
                    api.getAdminProtectedData('sales-weekly', token),
                    api.getAdminProtectedData('top-products', token)
                ]);
                setStats(statsData);
                setOrders(ordersData);
                setSalesData(weeklySalesData);
                setTopProducts(topProductsData);
            } catch (error: any) {
                console.error("Admin data fetch error:", error);
                setError("Ma'lumotlarni yuklashda xatolik.");
                if (error.message.includes('401') || error.message.includes('403')) onLogout();
            } 
            finally { setLoading(false); }
        };
        fetchData();
    }, [token, onLogout, updateTrigger]);
    
    if (loading) return <div className="text-center text-white py-20">Admin panel ma'lumotlari yuklanmoqda...</div>;
    if (error || !stats) return <div className="text-center text-red-400 py-20">{error || "Ma'lumotlarni yuklab bo'lmadi."}</div>;

    return (
        <div className="bg-gray-900/50 p-8 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Administrator Paneli</h1>
            <button onClick={onLogout} className="text-gray-400 hover:text-white transition">Chiqish</button>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Ma'lumotlarni Boshqarish</h2>
          <ManagementSection token={token} onUpdate={forceUpdate} />
          
          <div className="border-t border-white/10 my-8"></div>

          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Umumiy Holat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className={formSectionStyle}><h3 className="text-gray-400">Umumiy Savdo</h3><p className="text-3xl font-bold text-green-400">{stats.total_revenue.toLocaleString('uz-UZ')} so'm</p></div>
            <div className={formSectionStyle}><h3 className="text-gray-400">Buyurtmalar Soni</h3><p className="text-3xl font-bold text-white">{stats.total_orders}</p></div>
            <div className={formSectionStyle}><h3 className="text-gray-400">Yangi Buyurtmalar</h3><p className="text-3xl font-bold text-blue-400">{stats.new_orders_count}</p></div>
            <div className={formSectionStyle}><h3 className="text-gray-400">Mahsulotlar Soni</h3><p className="text-3xl font-bold text-white">{stats.product_count}</p></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
              <h3 className="font-bold mb-4 text-white">Haftalik Sotuvlar Statistikasi</h3>
              <ResponsiveContainer width="100%" height={300}><LineChart data={salesData}><CartesianGrid strokeDasharray="3 3" stroke="#4A5568" /><XAxis dataKey="name" stroke="#A0AEC0" /><YAxis tickFormatter={(value) => `${Number(value)/1000}k`} stroke="#A0AEC0" /><Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} /><Legend wrapperStyle={{ color: '#E2E8F0' }} /><Line type="monotone" dataKey="Savdo" stroke="#38b2ac" strokeWidth={2} activeDot={{ r: 8 }} dot={{ fill: '#38b2ac' }} /></LineChart></ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow border border-white/10">
               <h3 className="font-bold mb-4 text-white">Eng Ko'p Sotilayotgan Mahsulotlar</h3>
                <div className="space-y-4">{topProducts.map((p: any) => (<div key={p.id}><div className="flex justify-between mb-1"><span className="text-sm font-medium text-gray-300">{p.name}</span><span className="text-sm font-medium text-gray-400">{p.sold} dona</span></div><div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-cyan-500 h-2.5 rounded-full" style={{width: `${p.sold}%`}}></div></div></div>))}</div>
            </div>
          </div>
          <div className={formSectionStyle}>
            <h3 className={formTitleStyle}>So'nggi Buyurtmalar</h3>
            <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-300"><thead className="text-xs text-gray-400 uppercase bg-gray-900/70"><tr><th scope="col" className="px-6 py-3">ID</th><th scope="col" className="px-6 py-3">Mijoz</th><th scope="col" className="px-6 py-3">Sana</th><th scope="col" className="px-6 py-3">Summa</th><th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3">Amallar</th></tr></thead><tbody>{orders.map((order: any) => (<tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50"><td className="px-6 py-4 font-medium text-white">ORD-{order.id}</td><td className="px-6 py-4">{order.customer_name}</td><td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td><td className="px-6 py-4">{order.total_price.toLocaleString('uz-UZ')} so'm</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>{order.status}</span></td><td className="px-6 py-4"><button className="font-medium text-cyan-400 hover:underline">Ko'rish</button></td></tr>))}</tbody></table></div>
          </div>
        </div>
      );
};

const AdminDashboardPage: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const response = await api.adminLogin(password);
            localStorage.setItem('authToken', response.token);
            setToken(response.token);
        } catch (err: any) { setError("Parol xato yoki server bilan bog'lanishda muammo."); } 
        finally { setLoading(false); }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
    }

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
                    <h2 className="text-2xl font-bold text-center text-white">Administrator Kirishi</h2>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div><label htmlFor="password-admin" className="block mb-2 text-sm font-medium text-gray-300">Parol</label><input type="password" name="password" id="password-admin" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyle} placeholder="••••••••" required/></div>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <button type="submit" disabled={loading} className={submitButtonStyle}>{loading ? 'Tekshirilmoqda...' : 'Kirish'}</button>
                    </form>
                </div>
            </div>
        );
    }

    return <AdminDashboard token={token} onLogout={handleLogout} />;
};

export default AdminDashboardPage;