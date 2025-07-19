import React, { useState } from 'react';
import { api } from '../services/api';

const ContactPage: React.FC = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');
        try {
            await api.createContactMessage(formState);
            setStatus('success');
            setFormState({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMessage('Xabar yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
        }
    };
  
    const formInputStyle = "mt-1 block w-full bg-white/5 border-white/20 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-3 transition";

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-black/20 backdrop-blur-2xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center text-white">Biz bilan bog'laning</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Aloqa ma'lumotlari</h2>
                        <p className="flex items-center text-lg mb-3 text-gray-300">
                            <svg className="w-6 h-6 mr-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            +998 (99) 123-45-67
                        </p>
                        <p className="flex items-center text-lg mb-3 text-gray-300">
                            <svg className="w-6 h-6 mr-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            info@ziravorlar.uz
                        </p>
                        <p className="flex items-start text-lg text-gray-300">
                            <svg className="w-6 h-6 mr-4 text-cyan-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Toshkent sh., Amir Temur ko'chasi, 1-uy
                        </p>
                        </div>
                        <div>
                        <h3 className="text-xl font-semibold text-cyan-400 mb-3">Ijtimoiy tarmoqlar</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Telegram</a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Instagram</a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Facebook</a>
                        </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Xabar yuborish</h2>
                        {status === 'success' ? (
                            <div className="bg-green-500/20 border border-green-400/30 text-green-300 p-4 rounded-lg text-center">
                                <h3 className="font-bold">Rahmat!</h3>
                                <p>Xabaringiz muvaffaqiyatli yuborildi. Tez orada javob beramiz.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Ismingiz</label>
                                    <input type="text" id="name" name="name" value={formState.name} onChange={handleChange} required className={formInputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                    <input type="email" id="email" name="email" value={formState.email} onChange={handleChange} required className={formInputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">Xabaringiz</label>
                                    <textarea id="message" name="message" rows={5} value={formState.message} onChange={handleChange} required className={formInputStyle}></textarea>
                                </div>
                                {status === 'error' && <p className="text-red-400 text-sm">{errorMessage}</p>}
                                <button type="submit" disabled={status === 'submitting'} className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-3 rounded-full text-lg hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {status === 'submitting' ? 'Yuborilmoqda...' : 'Yuborish'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;