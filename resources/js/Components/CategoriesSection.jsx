import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoriesSection({ categories }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <section id="categorias" className="bg-white py-24">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Categorías de Productos</h2>
                    <p className="mt-4 text-gray-600">Explora nuestra amplia gama de suministros y componentes</p>
                    <div className="h-1.5 w-24 bg-gray-900 mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            whileHover={{ y: -8 }}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-md"
                            onClick={() => setSelectedCategory(category)}
                        >
                            <div className="aspect-[4/3] w-full overflow-hidden">
                                <img
                                    src={`${window.storageUrl}${category.image}`}
                                    alt={category.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        if (!e.target.src.includes('via.placeholder.com')) {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=' + category.name;
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                                <h3 className="text-2xl font-bold">{category.name}</h3>
                                <p className="mt-2 text-sm text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
                                    {category.subcategories?.length || 0} subcategorías
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Subcategories Modal */}
            <AnimatePresence>
                {selectedCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCategory(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h3>
                                    <p className="text-sm text-gray-500">Selecciona una subcategoría para ver productos</p>
                                </div>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {selectedCategory.subcategories?.length > 0 ? (
                                        selectedCategory.subcategories.map((sub) => (
                                            <Link
                                                key={sub.id}
                                                href={route('products', sub.id)}
                                                className="group flex items-center p-4 rounded-xl border-2 border-gray-100 transition-all hover:border-gray-800 hover:bg-gray-50"
                                            >
                                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                                                    <img
                                                        src={`${window.storageUrl}${sub.image}`}
                                                        alt={sub.name}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                        onError={(e) => {
                                                            if (!e.target.src.includes('via.placeholder.com')) {
                                                                e.target.src = 'https://via.placeholder.com/100?text=' + sub.name;
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4 flex-grow">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-gray-900">{sub.name}</h4>
                                                    <p className="text-sm text-gray-500">Ver todos los productos</p>
                                                </div>
                                                <svg className="h-5 w-5 text-gray-300 transition-colors group-hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="col-span-full py-10 text-center text-gray-500">No hay subcategorías registradas.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
