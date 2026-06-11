import { useState } from 'react';
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-xl hover:ring-gray-900/10 cursor-pointer"
            onClick={() => openModal(product)}
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

                <div className="mt-auto pt-6">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://wa.me/${contact.whatsapp}?text=Hola, me interesa el producto: ${product.name}`, '_blank');
                        }}
                        className="flex w-full items-center justify-center rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-all hover:bg-gray-900 active:scale-95"
                    >
                        Solicitar Cotización
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default function Products({ subcategory, products, contact }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalImageIndex(0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 200);
    };
    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
            <Head title={`${subcategory.name} | SKE Componentes`} />

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
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:text-sm"
                                />
                            </div>
                            <div className="bg-gray-100 text-black px-4 py-2 rounded-lg font-bold whitespace-nowrap">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'Producto encontrado' : 'Productos encontrados'}
                            </div>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} contact={contact} openModal={openModal} />
                            ))}
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
                                    onClick={() => setSearchQuery('')}
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
                {selectedProduct && (
                    <div className="relative p-6 sm:p-10 flex flex-col md:flex-row gap-8 bg-white min-h-[600px]">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
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
                )}
            </Modal>

            <ContactSection contact={contact} />
        </div>
    );
}
