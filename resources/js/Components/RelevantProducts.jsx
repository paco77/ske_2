import { useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function RelevantProducts({ products }) {
    const scrollRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        if (!products || products.length === 0) return;
        
        const scrollContainer = scrollRef.current;
        let animationFrameId;

        const scroll = () => {
            if (scrollContainer) {
                scrollContainer.scrollLeft += 1;
                // Reset scroll if we reached the end (approx) to create infinite effect
                if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
                    scrollContainer.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        // Pause on hover
        const handleMouseEnter = () => cancelAnimationFrame(animationFrameId);
        const handleMouseLeave = () => { animationFrameId = requestAnimationFrame(scroll); };

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (scrollContainer) {
                scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
                scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [products]);

    if (!products || products.length === 0) return null;

    // Duplicate products to ensure enough content for infinite scrolling illusion
    const displayProducts = [...products, ...products, ...products, ...products];

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

            <div 
                ref={scrollRef}
                className="flex space-x-6 px-4 overflow-x-hidden whitespace-nowrap py-4"
                style={{ scrollBehavior: 'auto' }} // smooth handled by scrollBy
            >
                {displayProducts.map((product, index) => (
                    <Link
                        key={`${product.id}-${index}`}
                        href={`/producto/${product.slug}`}
                        className="flex flex-col items-center justify-center w-64 p-4 border border-gray-100 rounded-2xl shadow-sm bg-white shrink-0 cursor-pointer transition-all hover:shadow-lg hover:border-gray-300"
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
        </section>
    );
}
