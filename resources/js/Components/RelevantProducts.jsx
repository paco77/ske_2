import { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

export default function RelevantProducts({ products }) {
    const scrollRef = useRef(null);
    const [selectedPdf, setSelectedPdf] = useState(null);

    if (!products || products.length === 0) return null;

    const slideLeft = () => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth;
            scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const slideRight = () => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="productos-relevantes" className="bg-white py-16 border-b border-gray-100 relative group">
            <div className="container mx-auto px-6 mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    Productos Relevantes
                </h2>
                <div className="h-1 w-20 bg-gray-800 mx-auto mt-4 rounded-full" />
            </div>

            {/* Left Button */}
            <button
                onClick={slideLeft}
                className="absolute left-4 top-1/2 mt-10 z-10 p-3 bg-white/80 backdrop-blur rounded-full shadow-lg border border-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Right Button */}
            <button
                onClick={slideRight}
                className="absolute right-4 top-1/2 mt-10 z-10 p-3 bg-white/80 backdrop-blur rounded-full shadow-lg border border-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            <div className="container mx-auto px-6">
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-hidden py-4 snap-x snap-mandatory"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/producto/${product.slug}`}
                            className="flex flex-col items-center justify-center w-full sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)] p-4 border border-gray-100 rounded-2xl shadow-sm bg-white shrink-0 cursor-pointer transition-all hover:shadow-lg hover:border-gray-300 snap-start"
                        >
                            <div className="h-40 w-full mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                                <img
                                    src={`${window.storageUrl}${product.image}`}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain transition-transform hover:scale-110"
                                    onError={(e) => {
                                        if (!e.target.src.includes('via.placeholder.com')) {
                                            e.target.src = 'https://via.placeholder.com/300?text=' + encodeURIComponent(product.name);
                                        }
                                    }}
                                />
                            </div>
                            <h3 className="text-sm font-black text-gray-900 truncate w-full text-center">
                                {product.name}
                            </h3>
                            {product.serie && (
                                <span className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                                    Serie: {product.serie}
                                </span>
                            )}


                        </Link>
                    ))}
                </div>
            </div>

            {selectedPdf && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={() => setSelectedPdf(null)}>
                    <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900">Ficha Técnica - {selectedPdf.name}</h3>
                            <button onClick={() => setSelectedPdf(null)} className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-100 relative">
                            <iframe
                                src={`/pdfjs/web/viewer.html?file=${encodeURIComponent('/storage/' + selectedPdf.technical_sheet)}#zoom=page-fit`}
                                className="w-full h-full border-none"
                                title={`Ficha Técnica ${selectedPdf.name}`}
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
