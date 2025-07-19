import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '../types';
import { api } from '../services/api';

const CatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [sortOrder, setSortOrder] = useState<'price' | '-price' | 'default'>('default');
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params: { category?: string; ordering?: string; search?: string } = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (sortOrder !== 'default') params.ordering = sortOrder;
    if (searchQuery) params.search = searchQuery;

    api.getProducts(params)
      .then(setProducts)
      .catch(() => setError("Mahsulotlarni yuklashda xatolik ro'y berdi."))
      .finally(() => setLoading(false));
      
  }, [selectedCategory, sortOrder, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sticky top-28 border border-white/10">
            <h3 className="text-xl font-bold mb-6 text-white">Kategoriyalar</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${selectedCategory === 'all' ? 'bg-cyan-500/30 text-white font-semibold' : 'hover:bg-white/10 text-gray-300'}`}
                >
                  Barcha mahsulotlar
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${selectedCategory === cat.slug ? 'bg-cyan-500/30 text-white font-semibold' : 'hover:bg-white/10 text-gray-300'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">
              {searchQuery ? `"${searchQuery}" uchun natijalar` : 'Mahsulotlar Katalogi'}
            </h2>
            <div>
              <label htmlFor="sort" className="mr-2 text-gray-300">Saralash:</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'price' | '-price' | 'default')}
                className="border bg-white/10 border-white/20 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
              >
                <option value="default" className="bg-gray-800">Odatiy</option>
                <option value="price" className="bg-gray-800">Arzonidan qimmatiga</option>
                <option value="-price" className="bg-gray-800">Qimmatidan arzoniga</option>
              </select>
            </div>
          </div>

            {loading && <div className="text-center py-20 text-white">Yuklanmoqda...</div>}
            {error && <div className="text-center py-20 text-red-400">{error}</div>}
            {!loading && !error && (
                products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-semibold text-white">Mahsulotlar topilmadi</h3>
                        <p className="text-gray-400 mt-2">Qidiruv yoki filtrlarni o'zgartirib ko'ring.</p>
                    </div>
                )
            )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;