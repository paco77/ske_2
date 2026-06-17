import { Head } from '@inertiajs/react';

export default function Presentation({ setting }) {
    const {
        profile_image,
        logo,
        cover_image,
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
        <div className="min-h-screen bg-[#5a5856] flex justify-center items-start py-8 px-4 font-sans text-slate-800 antialiased">
            <Head title={`${name} | Tarjeta de Presentación`} />

            <div className="w-full max-w-md flex flex-col gap-6">
                
                {/* CARD 1: Profile Card */}
                <div className="bg-[#273549] rounded-[28px] shadow-xl overflow-hidden relative flex flex-col">
                    
                    {/* Cover Banner */}
                    <div className="relative h-64 w-full overflow-hidden bg-slate-800">
                        <img
                            src={cover_image ? `${window.storageUrl}${cover_image}` : 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=1200&q=80'}
                            alt="Cover"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=1200&q=80';
                            }}
                        />
                        {/* Semi-transparent dark overlay */}
                        <div className="absolute inset-0 bg-slate-950/20" />

                        {/* Top-Right Mascot/Brand Hexagon Logo */}
                        {logo && (
                            <div 
                                className="absolute top-6 right-6 w-12 h-14 bg-white flex items-center justify-center p-1.5 shadow-md"
                                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                            >
                                <img
                                    src={`${window.storageUrl}${logo}`}
                                    alt="Logo Small"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        )}

                        {/* Parallel diagonal SKE Blue lines */}
                        <div className="absolute right-0 bottom-12 flex flex-col gap-1 transform rotate-[20deg] translate-x-4">
                            <div className="w-24 h-2.5 bg-blue-500 rounded-full opacity-60" />
                            <div className="w-32 h-2.5 bg-blue-500 rounded-full" />
                            <div className="w-28 h-2.5 bg-blue-500 rounded-full opacity-80" />
                        </div>

                        {/* Diagonal bottom-border cover divider */}
                        <div 
                            className="absolute bottom-0 left-0 w-full h-16 bg-[#273549] border-t-4 border-blue-600 transform origin-bottom-left -skew-y-6 translate-y-6"
                        />
                    </div>

                    {/* Overlapping Hexagon Profile Photo */}
                    <div className="relative px-6">
                        <div 
                            className="absolute -top-14 left-6 w-32 h-36 bg-white flex items-center justify-center p-1 shadow-xl z-20"
                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                        >
                            <div 
                                className="w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden p-1.5"
                                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                            >
                                <img
                                    src={profile_image ? `${window.storageUrl}${profile_image}` : 'https://via.placeholder.com/300x300?text=SKE'}
                                    alt={name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x300?text=SKE';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Name and Job Description */}
                    <div className="pt-24 px-6 text-left">
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">{name}</h1>
                        <p className="text-sm font-semibold text-slate-300 mt-1">{title}</p>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">SKE Componentes</p>
                    </div>

                    {/* Circular Actions Buttons Row */}
                    <div className="flex items-center justify-start gap-4 px-6 mt-6 pb-8">
                        {/* Button 1: Download Contact */}
                        <button
                            onClick={downloadVCard}
                            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-90"
                            title="Guardar Contacto"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </button>

                        {/* Button 2: Email */}
                        {email && (
                            <a
                                href={`mailto:${email}`}
                                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-90"
                                title="Enviar Correo"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                        )}

                        {/* Button 3: WhatsApp */}
                        {whatsapp && (
                            <a
                                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-90"
                                title="WhatsApp"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                            </a>
                        )}

                        {/* Button 4: Phone Direct Call */}
                        {phone && (
                            <a
                                href={`tel:${phone}`}
                                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-90"
                                title="Llamar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.099.281L8.5 7.72a11.955 11.955 0 01-5.718-5.719L2.8 1.58a1 1 0 00-.281-.099l-2.2-.547a1 1 0 00-.725.941C.5 18.5 5.5 23.5 22.059 23.5a1 1 0 00.94-.725l.548-2.2a1 1 0 00-.099-.281l-.5-1.12-1.353-.61a11.952 11.952 0 01-5.719-5.719l1.12-.5.61-1.353a1 1 0 00.099-.281l-.548-2.2a1 1 0 00-.725-.941L15.5 3.5a2 2 0 00-2 2v3.28a1 1 0 00.725.94l2.2.548a1 1 0 01.281.099l1.12-.5" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* CARD 2: Acerca de Nosotros */}
                {about_text && (
                    <div className="bg-white rounded-[28px] p-6 shadow-md text-center">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">
                            {about_title || 'Acerca de Nosotros'}
                        </h2>
                        <p className="text-sm font-semibold text-blue-600 leading-relaxed text-center px-4">
                            {about_text}
                        </p>
                    </div>
                )}

                {/* CARD 3: Contact Us Details */}
                <div className="bg-white rounded-[28px] p-6 shadow-md">
                    
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.099.281L8.5 7.72a11.955 11.955 0 01-5.718-5.719L2.8 1.58a1 1 0 00-.281-.099l-2.2-.547a1 1 0 00-.725.941C.5 18.5 5.5 23.5 22.059 23.5a1 1 0 00.94-.725l.548-2.2a1 1 0 00-.099-.281l-.5-1.12-1.353-.61a11.952 11.952 0 01-5.719-5.719l1.12-.5.61-1.353a1 1 0 00.099-.281l-.548-2.2a1 1 0 00-.725-.941L15.5 3.5a2 2 0 00-2 2v3.28a1 1 0 00.725.94l2.2.548a1 1 0 01.281.099l1.12-.5" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-extrabold text-slate-900">{contact_title || 'Contact Us'}</h2>
                    </div>

                    <div className="border-b border-dashed border-slate-200 my-4" />

                    {/* Fields List */}
                    <div className="space-y-4">
                        {contact_phone && (
                            <div>
                                <h3 className="text-slate-800 font-extrabold text-sm">Llámanos</h3>
                                <a href={`tel:${contact_phone}`} className="block text-blue-600 font-semibold text-xs mt-0.5 hover:underline">
                                    {contact_phone}
                                </a>
                            </div>
                        )}

                        {contact_email && (
                            <div>
                                <h3 className="text-slate-800 font-extrabold text-sm">Email</h3>
                                <a href={`mailto:${contact_email}`} className="block text-blue-600 font-semibold text-xs mt-0.5 hover:underline break-all">
                                    {contact_email}
                                </a>
                            </div>
                        )}

                        {contact_address && (
                            <div>
                                <h3 className="text-slate-800 font-extrabold text-sm">Dirección</h3>
                                <span className="block text-blue-600 font-semibold text-xs mt-0.5 leading-relaxed">
                                    {contact_address}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Brands Block */}
                {brands_images && brands_images.length > 0 && (
                    <div className="bg-white rounded-[28px] p-6 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
                            <h2 className="text-base font-extrabold text-slate-950">Marcas que manejamos</h2>
                        </div>
                        <div className="max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                            <div className="grid grid-cols-2 gap-4">
                                {brands_images.map((image, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-center h-28 shadow-sm hover:shadow-md transition-shadow"
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
                    </div>
                )}

                {/* Main Website Link Button */}
                {website_link && (
                    <div className="flex justify-center">
                        <a
                            href={website_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold px-8 py-4 w-full shadow-lg transition-all text-sm active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {website_button_text || 'Visitar Sitio Oficial'}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
