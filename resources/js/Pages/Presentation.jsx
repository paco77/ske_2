import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Presentation({ setting }) {
    const {
        profile_image,
        logo,
        name,
        title,
        email,
        whatsapp,
        phone,
        about_title,
        about_text,
        contact_title,
        contact_email,
        contact_phone,
        contact_address,
        brands_images,
        website_link,
        website_button_text,
    } = setting;

    // Helper to generate and download vCard file
    const downloadVCard = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:SKE Componentes y Suministros
TITLE:${title || ''}
TEL;TYPE=CELL:${whatsapp || ''}
TEL;TYPE=WORK,VOICE:${phone || ''}
EMAIL;TYPE=PREF,INTERNET:${email || ''}
ADR;TYPE=WORK,POSTAL:;;${contact_address || ''};;;;
URL:${website_link || 'https://skecomponent.mx/'}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name.replace(/\s+/g, '_')}.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex justify-center items-start py-8 px-4 font-sans text-slate-800 antialiased">
            <Head title={`${name} | Presentación Digital`} />

            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative mt-4">
                
                {/* Top Banner Gradient */}
                <div className="h-44 w-full bg-gradient-to-r from-blue-700 via-blue-900 to-slate-800 relative">
                    {logo && (
                        <div className="absolute top-4 right-4 bg-white/90 p-1.5 rounded-xl border border-white/20 shadow-md">
                            <img
                                src={`${window.storageUrl}${logo}`}
                                alt="Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                    )}
                </div>

                {/* Profile Header Block */}
                <div className="px-6 pb-6 relative flex flex-col items-center text-center">
                    
                    {/* Avatar Portait */}
                    <div className="relative -mt-16 mb-4">
                        <img
                            src={profile_image ? `${window.storageUrl}${profile_image}` : 'https://via.placeholder.com/300x300?text=Foto'}
                            alt={name}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-slate-100"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x300?text=' + name;
                            }}
                        />
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{name}</h1>
                    <p className="text-sm font-semibold text-blue-700 mt-1 uppercase tracking-wider">{title}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">SKE Componentes y Suministros</p>

                    {/* vCard Action Button */}
                    <button
                        onClick={downloadVCard}
                        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold px-8 py-3 text-sm shadow-lg shadow-blue-500/20 transition-all w-full"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Guardar en Contactos
                    </button>

                    {/* Quick Contacts Circular Icons Grid */}
                    <div className="grid grid-cols-3 gap-6 mt-6 w-full max-w-[280px]">
                        {phone && (
                            <a
                                href={`tel:${phone}`}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 flex items-center justify-center text-slate-600 transition-all border border-slate-200/50 shadow-sm active:scale-90">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.099.281L8.5 7.72a11.955 11.955 0 01-5.718-5.719L2.8 1.58a1 1 0 00-.281-.099l-2.2-.547a1 1 0 00-.725.941C.5 18.5 5.5 23.5 22.059 23.5a1 1 0 00.94-.725l.548-2.2a1 1 0 00-.099-.281l-.5-1.12-1.353-.61a11.952 11.952 0 01-5.719-5.719l1.12-.5.61-1.353a1 1 0 00.099-.281l-.548-2.2a1 1 0 00-.725-.941L15.5 3.5a2 2 0 00-2 2v3.28a1 1 0 00.725.94l2.2.548a1 1 0 01.281.099l1.12-.5" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">Llamar</span>
                            </a>
                        )}

                        {whatsapp && (
                            <a
                                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-green-50 group-hover:text-green-600 flex items-center justify-center text-slate-600 transition-all border border-slate-200/50 shadow-sm active:scale-90">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">WhatsApp</span>
                            </a>
                        )}

                        {email && (
                            <a
                                href={`mailto:${email}`}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 flex items-center justify-center text-slate-600 transition-all border border-slate-200/50 shadow-sm active:scale-90">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">Correo</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* About Us Block */}
                {about_text && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-1 h-5 bg-blue-700 rounded-full" />
                            <h2 className="text-base font-bold text-slate-900">{about_title || 'Acerca de Nosotros'}</h2>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed text-justify whitespace-pre-wrap">
                            {about_text}
                        </p>
                    </div>
                )}

                {/* Contact Information Details Block */}
                <div className="border-t border-slate-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-1 h-5 bg-blue-700 rounded-full" />
                        <h2 className="text-base font-bold text-slate-900">{contact_title || 'Información de Contacto'}</h2>
                    </div>
                    <div className="space-y-4">
                        {contact_email && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Correo de contacto</span>
                                    <a href={`mailto:${contact_email}`} className="text-sm font-semibold text-slate-700 hover:text-blue-700 break-all">{contact_email}</a>
                                </div>
                            </div>
                        )}

                        {contact_phone && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.099.281L8.5 7.72a11.955 11.955 0 01-5.718-5.719L2.8 1.58a1 1 0 00-.281-.099l-2.2-.547a1 1 0 00-.725.941C.5 18.5 5.5 23.5 22.059 23.5a1 1 0 00.94-.725l.548-2.2a1 1 0 00-.099-.281l-.5-1.12-1.353-.61a11.952 11.952 0 01-5.719-5.719l1.12-.5.61-1.353a1 1 0 00.099-.281l-.548-2.2a1 1 0 00-.725-.941L15.5 3.5a2 2 0 00-2 2v3.28a1 1 0 00.725.94l2.2.548a1 1 0 01.281.099l1.12-.5" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Teléfono</span>
                                    <a href={`tel:${contact_phone}`} className="text-sm font-semibold text-slate-700 hover:text-blue-700">{contact_phone}</a>
                                </div>
                            </div>
                        )}

                        {contact_address && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Ubicación</span>
                                    <span className="text-sm font-semibold text-slate-700 leading-relaxed">{contact_address}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Brands Block */}
                {brands_images && brands_images.length > 0 && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1 h-5 bg-blue-700 rounded-full" />
                            <h2 className="text-base font-bold text-slate-900">Marcas que manejamos</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {brands_images.map((image, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-slate-200/60 rounded-xl p-2.5 flex items-center justify-center h-16 shadow-sm group hover:shadow-md transition-shadow"
                                >
                                    <img
                                        src={`${window.storageUrl}${image}`}
                                        alt={`Marca ${idx}`}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Website Link Button */}
                {website_link && (
                    <div className="p-6 border-t border-slate-100 flex justify-center">
                        <a
                            href={website_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold px-8 py-4 w-full shadow-lg transition-all text-sm active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {website_button_text || 'Visitar Sitio Oficial'}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
