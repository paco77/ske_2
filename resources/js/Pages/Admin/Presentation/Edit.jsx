import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ setting }) {
    const [profilePreview, setProfilePreview] = useState(
        setting.profile_image ? `${window.storageUrl}${setting.profile_image}` : null
    );
    const [logoPreview, setLogoPreview] = useState(
        setting.logo ? `${window.storageUrl}${setting.logo}` : null
    );
    const [brandPreviews, setBrandPreviews] = useState([]);

    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        name: setting.name || '',
        title: setting.title || '',
        email: setting.email || '',
        whatsapp: setting.whatsapp || '',
        phone: setting.phone || '',
        
        about_title: setting.about_title || '',
        about_text: setting.about_text || '',
        
        contact_title: setting.contact_title || '',
        contact_email: setting.contact_email || '',
        contact_phone: setting.contact_phone || '',
        contact_address: setting.contact_address || '',
        
        website_link: setting.website_link || '',
        website_button_text: setting.website_button_text || '',
        
        profile_image: null,
        logo: null,
        
        new_brands_images: [],
        kept_brands_images: setting.brands_images || [],
        _method: 'POST',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.presentation.update'), {
            forceFormData: true,
            onSuccess: () => {
                // Clear file state and new preview objects
                setData('profile_image', null);
                setData('logo', null);
                setData('new_brands_images', []);
                setBrandPreviews([]);
                alert('¡Tarjeta de presentación guardada con éxito!');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800">
                    Editar Tarjeta de Presentación Digital
                </h2>
            }
        >
            <Head title="Editar Presentación - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Section 1: Basic Info and Portrait/Logo */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">1. Información del Perfil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-6 md:col-span-2">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                                required
                                            />
                                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Puesto o Cargo</label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                                placeholder="Ej. Agente de Ventas y Proyectos"
                                            />
                                            {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                                        </div>
                                    </div>

                                    {/* Upload Images Side block */}
                                    <div className="space-y-6">
                                        {/* Profile Portrait */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Foto de Perfil (Retrato)</label>
                                            <div className="flex items-center gap-4">
                                                {profilePreview && (
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                                                        <img src={profilePreview} alt="Profile" className="h-full w-full object-cover" />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setData('profile_image', file);
                                                        if (file) {
                                                            setProfilePreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                                />
                                            </div>
                                            {errors.profile_image && <div className="text-red-500 text-xs mt-1">{errors.profile_image}</div>}
                                        </div>

                                        {/* Logo Photo */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Logotipo de la Tarjeta</label>
                                            <div className="flex items-center gap-4">
                                                {logoPreview && (
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1">
                                                        <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setData('logo', file);
                                                        if (file) {
                                                            setLogoPreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                                />
                                            </div>
                                            {errors.logo && <div className="text-red-500 text-xs mt-1">{errors.logo}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact Shortcuts */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">2. Accesos Rápidos de Contacto</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp (Ej: 526182779868)</label>
                                        <input
                                            type="text"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            placeholder="Solo dígitos con clave de país"
                                        />
                                        {errors.whatsapp && <div className="text-red-500 text-xs mt-1">{errors.whatsapp}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono de Llamada Directa</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                        {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico (Contacto rápido)</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: About Us */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">3. Acerca de Nosotros</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Título de la Sección</label>
                                        <input
                                            type="text"
                                            value={data.about_title}
                                            onChange={(e) => setData('about_title', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            required
                                        />
                                        {errors.about_title && <div className="text-red-500 text-xs mt-1">{errors.about_title}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Texto Largo (Información de la empresa)</label>
                                        <textarea
                                            rows="5"
                                            value={data.about_text}
                                            onChange={(e) => setData('about_text', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        ></textarea>
                                        {errors.about_text && <div className="text-red-500 text-xs mt-1">{errors.about_text}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Contact Information Block */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">4. Información Detallada de Contacto</h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Título del Bloque</label>
                                            <input
                                                type="text"
                                                value={data.contact_title}
                                                onChange={(e) => setData('contact_title', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                                required
                                            />
                                            {errors.contact_title && <div className="text-red-500 text-xs mt-1">{errors.contact_title}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Correo Oficial</label>
                                            <input
                                                type="email"
                                                value={data.contact_email}
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            />
                                            {errors.contact_email && <div className="text-red-500 text-xs mt-1">{errors.contact_email}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono de Oficina</label>
                                            <input
                                                type="text"
                                                value={data.contact_phone}
                                                onChange={(e) => setData('contact_phone', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            />
                                            {errors.contact_phone && <div className="text-red-500 text-xs mt-1">{errors.contact_phone}</div>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Dirección Física Completa</label>
                                        <input
                                            type="text"
                                            value={data.contact_address}
                                            onChange={(e) => setData('contact_address', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            placeholder="Av. Industrial #123, Col. Centro, Durango"
                                        />
                                        {errors.contact_address && <div className="text-red-500 text-xs mt-1">{errors.contact_address}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Brands handled */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">5. Marcas que Manejamos</h3>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Agregar logotipos de marcas</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            if (files.length > 0) {
                                                setData('new_brands_images', [...(data.new_brands_images || []), ...files]);
                                                setBrandPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100 mb-4"
                                    />
                                    {(data.kept_brands_images.length > 0 || brandPreviews.length > 0) && (
                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                                            {data.kept_brands_images.map((img, idx) => (
                                                <div key={`kept-${idx}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1 flex items-center justify-center">
                                                    <img src={`${window.storageUrl}${img}`} alt="Preview" className="max-h-full max-w-full object-contain" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setData('kept_brands_images', data.kept_brands_images.filter(i => i !== img))}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {brandPreviews.map((preview, idx) => (
                                                <div key={`new-${idx}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-blue-50 p-1 flex items-center justify-center">
                                                    <img src={preview} alt="New Preview" className="max-h-full max-w-full object-contain" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            URL.revokeObjectURL(preview);
                                                            setData('new_brands_images', data.new_brands_images.filter((_, i) => i !== idx));
                                                            setBrandPreviews(brandPreviews.filter((_, i) => i !== idx));
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm z-10"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                    <span className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[8px] text-center py-0.5 font-bold">NUEVA</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.new_brands_images && <div className="text-red-500 text-xs mt-1">{errors.new_brands_images}</div>}
                                </div>
                            </div>

                            {/* Section 6: Primary CTA Link */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">6. Enlace de Destino Principal (Página Web)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Enlace de Página Principal</label>
                                        <input
                                            type="url"
                                            value={data.website_link}
                                            onChange={(e) => setData('website_link', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            placeholder="https://skecomponent.mx/"
                                        />
                                        {errors.website_link && <div className="text-red-500 text-xs mt-1">{errors.website_link}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Texto del Botón</label>
                                        <input
                                            type="text"
                                            value={data.website_button_text}
                                            onChange={(e) => setData('website_button_text', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            placeholder="Ej. Visitar Sitio Oficial"
                                        />
                                        {errors.website_button_text && <div className="text-red-500 text-xs mt-1">{errors.website_button_text}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Form Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-full bg-gray-900 px-12 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400 active:scale-95 shadow-md shadow-gray-900/10"
                                >
                                    {processing ? 'Guardando Cambios...' : 'Guardar Todos los Cambios'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
