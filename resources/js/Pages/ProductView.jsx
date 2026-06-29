import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import ContactSection from '@/Components/ContactSection';

export default function ProductView({ product, contact }) {
    const images = [product.image, ...(product.images || [])].filter(Boolean);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const schemaOrgJSONLD = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.meta_title || product.name,
        "image": images.map(img => `${window.storageUrl}${img}`),
        "description": product.meta_description || product.description,
        "brand": {
            "@type": "Brand",
            "name": product.brand?.name || "SKE Componentes"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "availability": product.is_active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
            <Head>
                <title>{product.meta_title || `${product.name} | SKE Componentes`}</title>
                <meta name="description" content={product.meta_description || product.description} head-key="description" />
                <meta property="og:title" content={product.meta_title || product.name} />
                <meta property="og:description" content={product.meta_description || product.description} />
                {images.length > 0 && (
                    <meta property="og:image" content={`${window.storageUrl}${images[0]}`} />
                )}
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <script type="application/ld+json">
                    {JSON.stringify(schemaOrgJSONLD)}
                </script>
            </Head>

            <Navbar />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Breadcrumbs */}
                    <nav className="mb-8 flex space-x-2 text-sm text-gray-500">
                        <Link href={route('home')} className="hover:text-gray-900">Inicio</Link>
                        <span>/</span>
                        {product.category && (
                            <>
                                <Link href={route('category.products', product.category.slug || product.category.id)} className="hover:text-gray-900">{product.category.name}</Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="font-bold text-gray-900">{product.name}</span>
                    </nav>

                    <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-10 flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/2 flex items-center justify-center bg-gray-50 rounded-2xl p-6 relative group">
                            {images.length > 0 && (
                                <img
                                    src={`${window.storageUrl}${images[currentImageIndex]}`}
                                    alt={product.name}
                                    className="max-h-[500px] w-auto object-contain transition-all"
                                    onError={(e) => (e.target.src = 'https://via.placeholder.com/600?text=' + product.name)}
                                />
                            )}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 shadow-md"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % images.length); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 shadow-md"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                                        {images.map((_, idx) => (
                                            <div key={idx} className={`h-2 w-2 rounded-full ${idx === currentImageIndex ? 'bg-gray-800' : 'bg-gray-300'}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="md:w-1/2 flex flex-col justify-center">
                            <div className="mb-4 inline-block">
                                <span className="text-sm font-black uppercase tracking-widest text-white bg-gray-900 px-4 py-1.5 rounded-full">
                                    {product.brand?.name || 'SKE Componentes'}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 mb-6">{product.name}</h1>
                            
                            <div className="prose prose-lg text-gray-600 mb-10 whitespace-pre-wrap">
                                {product.description}
                            </div>
                            
                            <div className="mt-auto">
                                {contact && (
                                    <a
                                        href={`https://wa.me/${contact.whatsapp}?text=Hola, me interesa el producto: ${product.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-green-500 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-green-600 active:scale-95 shadow-lg shadow-green-500/30"
                                    >
                                        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        Solicitar Cotización por WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ContactSection contact={contact} />
        </div>
    );
}
