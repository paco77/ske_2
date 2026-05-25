import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import ContactSection from '@/Components/ContactSection';
import { motion } from 'framer-motion';

export default function Products({ subcategory, products, contact }) {
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
                        <div className="bg-gray-100 text-black px-4 py-2 rounded-lg font-bold">
                            {products.length} Productos encontrados
                        </div>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-xl hover:ring-gray-900/10"
                                >
                                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                                        <img
                                            src={`${window.storageUrl}${product.image}`}
                                            alt={product.name}
                                            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/300?text=' + product.name)}
                                        />
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
                                            <a
                                                href={`https://wa.me/${contact.whatsapp}?text=Hola, me interesa el producto: ${product.name}`}
                                                target="_blank"
                                                className="flex w-full items-center justify-center rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-all hover:bg-gray-900 active:scale-95"
                                            >
                                                Solicitar Cotización
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
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
                            <p className="mt-2 text-gray-500">Estamos actualizando nuestro catálogo. Vuelve pronto o contáctanos.</p>
                            <Link href={route('home')} className="mt-8 text-gray-900 font-bold hover:underline">
                                Volver al inicio
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <ContactSection contact={contact} />
        </div>
    );
}
