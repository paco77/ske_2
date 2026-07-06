import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ProductModal({ isOpen, onClose, product }) {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    useEffect(() => {
        if (isOpen && product?.serie) {
            setLoadingRelated(true);
            axios.get(`/api/productos/serie/${encodeURIComponent(product.serie)}`)
                .then(res => {
                    // Filter out the current product from related
                    setRelatedProducts(res.data.filter(p => p.id !== product.id));
                })
                .catch(err => console.error("Error fetching related products:", err))
                .finally(() => setLoadingRelated(false));
        } else {
            setRelatedProducts([]);
        }
    }, [isOpen, product]);

    if (!product) return null;

    const displayRelated = [...relatedProducts, ...relatedProducts, ...relatedProducts];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all">
                                <div className="absolute right-4 top-4 z-10">
                                    <button
                                        onClick={onClose}
                                        className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                    <div className="bg-gray-50 p-8 flex items-center justify-center min-h-[300px]">
                                        <img
                                            src={`${window.storageUrl}${product.image}`}
                                            alt={product.name}
                                            className="max-h-80 w-auto object-contain mix-blend-multiply"
                                            onError={(e) => {
                                                if (!e.target.src.includes('via.placeholder.com')) {
                                                    e.target.src = 'https://via.placeholder.com/400?text=' + encodeURIComponent(product.name);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                                        {product.serie && (
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4 w-fit">
                                                Serie: {product.serie}
                                            </span>
                                        )}
                                        <Dialog.Title as="h3" className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 leading-tight">
                                            {product.name}
                                        </Dialog.Title>
                                        
                                        <div className="prose prose-sm text-gray-600 mb-8">
                                            <p>{product.description || 'Sin descripción detallada.'}</p>
                                        </div>

                                        <div className="mt-auto">
                                            <a 
                                                href={`/producto/${product.slug}`}
                                                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-black hover:scale-105 active:scale-95 w-full sm:w-auto"
                                            >
                                                Ver Detalles Completos
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Related Products Slider */}
                                {product.serie && relatedProducts.length > 0 && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-8 overflow-hidden">
                                        <h4 className="text-lg font-bold text-gray-900 mb-6 text-center">
                                            Otros productos de la Serie {product.serie}
                                        </h4>
                                        <div className="relative flex whitespace-nowrap overflow-hidden">
                                            <motion.div
                                                animate={{
                                                    x: [0, -100 * relatedProducts.length],
                                                }}
                                                transition={{
                                                    x: {
                                                        repeat: Infinity,
                                                        repeatType: "loop",
                                                        duration: Math.max(10, relatedProducts.length * 5),
                                                        ease: "linear",
                                                    },
                                                }}
                                                className="flex space-x-6 items-center px-4"
                                            >
                                                {displayRelated.map((related, idx) => (
                                                    <a
                                                        key={`${related.id}-${idx}`}
                                                        href={`/producto/${related.slug}`}
                                                        className="flex flex-col items-center justify-center w-48 p-4 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0 hover:shadow-md transition-all group"
                                                    >
                                                        <div className="h-24 w-full mb-3 flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={`${window.storageUrl}${related.image}`}
                                                                alt={related.name}
                                                                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                                                                onError={(e) => {
                                                                    if (!e.target.src.includes('via.placeholder.com')) {
                                                                        e.target.src = 'https://via.placeholder.com/150?text=' + encodeURIComponent(related.name);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 truncate w-full text-center">
                                                            {related.name}
                                                        </span>
                                                    </a>
                                                ))}
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
