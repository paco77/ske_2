import { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import ContactSection from '@/Components/ContactSection';
import Modal from '@/Components/Modal';
import { motion } from 'framer-motion';

const ProductCard = ({ product, index, contact, openModal }) => {
    const images = [product.image, ...(product.images || [])].filter(Boolean);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <Link
            href={route('product.show', product.slug || product.id)}
            className="group relative flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-xl hover:ring-gray-900/10 cursor-pointer"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                    src={`${window.storageUrl}${images[currentImageIndex]}`}
                    alt={product.name}
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300?text=' + product.name)}
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 shadow-md"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 shadow-md"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
                            {images.map((_, idx) => (
                                <div key={idx} className={`h-1.5 w-1.5 rounded-full ${idx === currentImageIndex ? 'bg-gray-800' : 'bg-gray-300/50'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="mt-6 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 bg-gray-50 px-2 py-0.5 rounded">
                        {product.brand?.name || 'SKE'}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-900 line-clamp-2">
                    {product.name}
                </h3>
                <p className="mt-3 text-sm text-gray-500 line-clamp-3">
                    {product.description}
                </p>

                {product.technical_sheet && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openModal(product); // Assuming you want them to open the modal which now has the PDF logic, OR we can implement an inline PDF viewer. 
                        }}
                        className="mt-4 flex w-full items-center justify-center rounded-xl bg-gray-900 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Abrir Detalles y PDF
                    </button>
                )}

                <div className="mt-auto pt-4">
                    <span
                        className="flex w-full items-center justify-center rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-all hover:bg-gray-900 active:scale-95"
                    >
                        Ver Detalles
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default function Products({ subcategory, products, contact }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const itemsPerPage = 16;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const activePage = currentPage > totalPages ? 1 : currentPage;
    const startIndex = (activePage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 250, behavior: 'smooth' });
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalImageIndex(0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 200);
    };

    const relatedScrollRef = useRef(null);
    const slideRelatedLeft = () => {
        if (relatedScrollRef.current) {
            relatedScrollRef.current.scrollBy({ left: -relatedScrollRef.current.clientWidth, behavior: 'smooth' });
        }
    };
    const slideRelatedRight = () => {
        if (relatedScrollRef.current) {
            relatedScrollRef.current.scrollBy({ left: relatedScrollRef.current.clientWidth, behavior: 'smooth' });
        }
    };

    const closePdf = () => {
        setShowPdf(false);
    };
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": route('home')
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": subcategory.category?.name || "Catálogo",
                "item": route('allProducts')
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": subcategory.name,
                "item": window.location.href
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
            <Head>
                <title>{subcategory.meta_title || `${subcategory.name} | SKE Componentes`}</title>
                <meta name="description" content={subcategory.meta_description || `Catálogo de productos para ${subcategory.name}`} head-key="description" />
                <meta property="og:title" content={subcategory.meta_title || subcategory.name} />
                <meta property="og:description" content={subcategory.meta_description || `Explora nuestros productos de ${subcategory.name}`} />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Head>

            <Navbar />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Breadcrumbs */}
                    <nav className="mb-8 flex space-x-2 text-sm text-gray-500">
                        <Link href={route('home')} className="hover:text-gray-900">Inicio</Link>
                        <span>/</span>
                        <span className="text-gray-400">{subcategory.category?.name}</span>
                        <span>/</span>
                        <span className="font-bold text-gray-900">{subcategory.name}</span>
                    </nav>

                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900">{subcategory.name}</h1>
                            <p className="mt-2 text-xl text-gray-600">Listado de productos disponibles</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative w-full sm:w-64 md:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar producto por nombre..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:text-sm"
                                />
                            </div>
                            <div className="bg-gray-100 text-black px-4 py-2 rounded-lg font-bold whitespace-nowrap">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'Producto encontrado' : 'Productos encontrados'}
                            </div>
                        </div>
                    </div>

                    {paginatedProducts.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-4">
                                {paginatedProducts.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} contact={contact} openModal={openModal} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-16 flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => changePage(Math.max(activePage - 1, 1))}
                                        disabled={activePage === 1}
                                        className={`rounded-xl px-4 py-2 text-sm font-semibold border transition-all ${
                                            activePage === 1
                                                ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 active:scale-95'
                                        }`}
                                    >
                                        Anterior
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => changePage(page)}
                                            className={`h-10 w-10 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                                                activePage === page
                                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-950/10'
                                                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => changePage(Math.min(activePage + 1, totalPages))}
                                        disabled={activePage === totalPages}
                                        className={`rounded-xl px-4 py-2 text-sm font-semibold border transition-all ${
                                            activePage === totalPages
                                                ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 active:scale-95'
                                        }`}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="bg-gray-100 p-8 rounded-full mb-6 text-gray-400">
                                <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">No hay productos disponibles</h3>
                            <p className="mt-2 text-gray-500">
                                {searchQuery 
                                    ? `No se encontraron resultados para "${searchQuery}".` 
                                    : 'Estamos actualizando nuestro catálogo. Vuelve pronto o contáctanos.'}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setCurrentPage(1);
                                    }}
                                    className="mt-4 text-gray-900 font-bold hover:underline"
                                >
                                    Limpiar búsqueda
                                </button>
                            )}
                            <Link href={route('home')} className="mt-8 text-gray-900 font-bold hover:underline">
                                Volver al inicio
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="3xl">
                {selectedProduct && (() => {
                    const relatedProducts = selectedProduct.serie 
                        ? products.filter(p => p.serie === selectedProduct.serie && p.id !== selectedProduct.id)
                        : [];
                    return (
                    <div className="relative p-6 sm:p-10 bg-white min-h-[600px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2 flex items-center justify-center bg-gray-50 rounded-2xl p-6 relative group">
                            {(() => {
                                const modalImages = [selectedProduct.image, ...(selectedProduct.images || [])].filter(Boolean);
                                return (
                                    <>
                                        <img
                                            src={`${window.storageUrl}${modalImages[modalImageIndex]}`}
                                            alt={selectedProduct.name}
                                            className="max-h-[500px] w-auto object-contain transition-all"
                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/600?text=' + selectedProduct.name)}
                                        />
                                        {modalImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setModalImageIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1)); }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 shadow-md"
                                                >
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setModalImageIndex((prev) => (prev + 1) % modalImages.length); }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 shadow-md"
                                                >
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                </button>
                                                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-1">
                                                    {modalImages.map((_, idx) => (
                                                        <div key={idx} className={`h-2 w-2 rounded-full ${idx === modalImageIndex ? 'bg-gray-800' : 'bg-gray-300'}`} />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                        <div className="md:w-1/2 flex flex-col justify-center">
                            <div className="mb-2 inline-block">
                                <span className="text-xs font-black uppercase tracking-widest text-white bg-gray-900 px-3 py-1 rounded-full">
                                    {selectedProduct.brand?.name || 'SKE'}
                                </span>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">{selectedProduct.name}</h2>
                            <div className="prose prose-sm text-gray-600 mb-8 whitespace-pre-wrap">
                                {selectedProduct.description}
                            </div>
                            
                            {selectedProduct.technical_sheet && (
                                <div className="mb-6">
                                    <button
                                        onClick={() => setShowPdf(true)}
                                        className="inline-flex items-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Ver Ficha Técnica
                                    </button>
                                </div>
                            )}

                            <div className="mt-auto">
                                <a
                                    href={`https://wa.me/${contact.whatsapp}?text=Hola, me interesa el producto: ${selectedProduct.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-green-500 px-8 py-4 text-base font-bold text-white transition-all hover:bg-green-600 active:scale-95 shadow-lg shadow-green-500/30"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Solicitar Cotización por WhatsApp
                                </a>
                            </div>
                        </div>
                        </div>

                        {relatedProducts.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-gray-100 relative group">
                                <h4 className="text-lg font-bold text-gray-900 mb-6 text-center">Más productos de la Serie {selectedProduct.serie}</h4>
                                <button onClick={slideRelatedLeft} className="absolute left-0 top-[60%] z-10 p-2 bg-white/90 rounded-full shadow-lg border border-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white opacity-0 group-hover:opacity-100 transition-all -translate-y-1/2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button onClick={slideRelatedRight} className="absolute right-0 top-[60%] z-10 p-2 bg-white/90 rounded-full shadow-lg border border-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white opacity-0 group-hover:opacity-100 transition-all -translate-y-1/2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                
                                <div ref={relatedScrollRef} className="flex space-x-4 overflow-x-hidden py-2 px-1" style={{ scrollBehavior: 'smooth' }}>
                                    {relatedProducts.map(related => (
                                        <button
                                            key={related.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedProduct(related);
                                                setModalImageIndex(0);
                                                if (relatedScrollRef.current) relatedScrollRef.current.scrollTo({ left: 0 });
                                            }}
                                            className="flex flex-col items-center justify-center w-40 p-3 border border-gray-100 rounded-2xl shadow-sm bg-white shrink-0 hover:shadow-lg transition-all"
                                        >
                                            <div className="h-24 w-full mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                                                <img src={`${window.storageUrl}${related.image}`} className="max-h-full max-w-full object-contain" onError={(e) => (e.target.src = 'https://via.placeholder.com/150')} />
                                            </div>
                                            <h5 className="text-xs font-bold text-gray-900 truncate w-full text-center">{related.name}</h5>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )})}
            </Modal>

            {showPdf && selectedProduct?.technical_sheet && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={closePdf}>
                    <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900">Ficha Técnica - {selectedProduct.name}</h3>
                            <button onClick={closePdf} className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-100 relative">
                            <iframe 
                                src={`${window.storageUrl}${selectedProduct.technical_sheet}#view=FitH`} 
                                className="w-full h-full border-none"
                                title={`Ficha Técnica ${selectedProduct.name}`}
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            <ContactSection contact={contact} />
        </div>
    );
}
