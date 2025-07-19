import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { api } from '../services/api';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

// Leaflet ikonkalari to'g'ri ishlashi uchun zarur bo'lgan tuzatish
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Xaritani avtomatik ravishda yangi pozitsiyaga yaqinlashtiradigan komponent
function RecenterAutomatically({ position }: { position: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15); // 15 - yaqinlashish darajasi
  }, [position, map]);
  return null;
}

// Xaritadagi marker va uning logikasi uchun komponent
const LocationMarker: React.FC<{ position: LatLngExpression; setPosition: (pos: LatLngExpression) => void; }> = ({ position, setPosition }) => {
    const markerRef = useRef<L.Marker>(null);
    useMapEvents({ click(e) { setPosition(e.latlng); } });
    const eventHandlers = useMemo(() => ({ dragend() { const marker = markerRef.current; if (marker) setPosition(marker.getLatLng()); }, }), [setPosition]);
    return (<Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}></Marker>);
};


const CheckoutPage: React.FC = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', paymentMethod: 'Naqd', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<LatLngExpression>([41.311081, 69.240562]); // Boshlang'ich joylashuv: Toshkent
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    
    const handleLocationChange = (newLocation: LatLngExpression) => { setLocation(newLocation); };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Sizning brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
            return;
        }
        
        setIsLocating(true);
        setLocationError(null);

        const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPosition: LatLngExpression = [position.coords.latitude, position.coords.longitude];
                setLocation(newPosition);
                setIsLocating(false);
            },
            () => {
                setLocationError("Joylashuvni aniqlab bo'lmadi. Brauzerda ruxsat berilganiga va qurilmada lokatsiya yoqilganiga ishonch hosil qiling.");
                setIsLocating(false);
            },
            options
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true); setError(null);
        const latLng = L.latLng(location as LatLngExpression);

        const orderData = {
            customer_name: formData.name, customer_phone: formData.phone, customer_address: formData.address,
            customer_notes: formData.notes, payment_method: formData.paymentMethod,
            location_lat: Number(latLng.lat.toFixed(6)), 
            location_lon: Number(latLng.lng.toFixed(6)), 
            items: cartItems.map(item => ({ product_id: Number(item.id), quantity: item.quantity }))
        };
        
        try {
            const newOrder = await api.createOrder(orderData);
            clearCart();
            navigate('/thank-you', { state: { orderId: `ORD-${newOrder.id}` } });
        } catch (err: any) {
            setError("Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
        } finally { setIsSubmitting(false); }
    };

    const formInputStyle = "mt-1 block w-full bg-white/5 border-white/20 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-3 transition";

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-10 text-center text-white">Buyurtmani rasmiylashtirish</h1>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 bg-black/20 backdrop-blur-2xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-white">Sizning ma'lumotlaringiz</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div><label htmlFor="name" className="block text-sm font-medium text-gray-300">Ism-sharifingiz</label><input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className={formInputStyle} /></div>
                        <div><label htmlFor="phone" className="block text-sm font-medium text-gray-300">Telefon raqamingiz</label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+998 XX XXX XX XX" required className={formInputStyle} /></div>
                        <div><label htmlFor="address" className="block text-sm font-medium text-gray-300">Yetkazib berish manzili</label><textarea id="address" name="address" rows={3} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Shahar, tuman, ko'cha, uy raqami" required className={formInputStyle}></textarea></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Lokatsiyani xaritadan belgilash</label>
                            <div className="h-72 w-full rounded-lg overflow-hidden border-2 border-dashed border-white/20">
                                <MapContainer center={location} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                    <LocationMarker position={location} setPosition={handleLocationChange} />
                                    <RecenterAutomatically position={location} />
                                </MapContainer>
                            </div>
                            <button type="button" onClick={handleGetCurrentLocation} disabled={isLocating} className="mt-3 w-full text-white bg-gray-700 hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all disabled:opacity-50 disabled:cursor-wait">
                                {isLocating ? 'Aniqlanmoqda...' : 'Joriy joylashuvni aniqlash'}
                            </button>
                            {locationError && <p className="text-red-400 text-sm mt-2">{locationError}</p>}
                        </div>
                        <div><label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300">To'lov turi</label><select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} required className={formInputStyle}><option className="bg-gray-800">Naqd</option><option className="bg-gray-800">Click</option><option className="bg-gray-800">Payme</option></select></div>
                        <div><label htmlFor="notes" className="block text-sm font-medium text-gray-300">Qo'shimcha izoh</label><textarea id="notes" name="notes" rows={2} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Masalan, soat 18:00 dan keyin qo'ng'iroq qiling" className={formInputStyle}></textarea></div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-4 rounded-full text-lg hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Yuborilmoqda...' : 'Buyurtmani tasdiqlash'}</button>
                    </form>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-black/20 backdrop-blur-2xl p-8 rounded-2xl h-fit sticky top-28 border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-white">Sizning buyurtmangiz</h2>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {cartItems.map(item => (<div key={item.id} className="flex justify-between items-start"><div className="flex gap-4"><img src={item.main_image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-white/10" /><div><p className="font-semibold text-white">{item.name}</p><p className="text-sm text-gray-400">Miqdor: {item.quantity}</p></div></div><p className="font-semibold text-white text-right">{(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</p></div>))}
                        </div>
                        <div className="border-t border-white/20 mt-6 pt-4 space-y-2">
                            <div className="flex justify-between text-lg text-gray-300"><span>Jami:</span><span className="font-semibold text-white">{totalPrice.toLocaleString('uz-UZ')} so'm</span></div>
                            <div className="flex justify-between text-lg text-gray-300"><span>Yetkazib berish:</span><span className="font-semibold text-white">Bepul</span></div>
                            <div className="flex justify-between text-xl font-bold text-white mt-2"><span>Umumiy:</span><span className="text-cyan-400">{totalPrice.toLocaleString('uz-UZ')} so'm</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;