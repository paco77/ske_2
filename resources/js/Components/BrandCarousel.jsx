import { motion } from 'framer-motion';

export default function BrandCarousel({ brands }) {
    if (!brands || brands.length === 0) return null;

    // Duplicate brands to create a seamless infinite loop
    const displayBrands = [...brands, ...brands, ...brands];

    return (
        <section id="marcas" className="bg-gray-50 py-16 overflow-hidden border-y border-gray-100">
            <div className="container mx-auto px-6 mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    Nuestras Marcas Aliadas
                </h2>
                <div className="h-1 w-20 bg-gray-800 mx-auto mt-4 rounded-full" />
            </div>

            <div className="relative flex whitespace-nowrap">
                <motion.div
                    animate={{
                        x: [0, -100 * brands.length],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: brands.length * 5, // Adjust speed based on brand count
                            ease: "linear",
                        },
                    }}
                    className="flex space-x-12 items-center"
                >
                    {displayBrands.map((brand, index) => (
                        <div
                            key={`${brand.id}-${index}`}
                            className="flex h-24 w-48 shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0"
                        >
                            <img
                                src={`${window.storageUrl}${brand.logo}`}
                                alt={brand.name}
                                className="max-h-16 max-w-full object-contain"
                                onError={(e) => {
                                    if (!e.target.src.includes('via.placeholder.com')) {
                                        e.target.src = 'https://via.placeholder.com/150?text=' + brand.name;
                                    }
                                }}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
