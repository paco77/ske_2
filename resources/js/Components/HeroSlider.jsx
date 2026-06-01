import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSlider({ sliders }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (sliders.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % sliders.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [sliders.length]);

    if (!sliders || sliders.length === 0) return null;

    const nextSlide = () => setCurrent((prev) => (prev + 1) % sliders.length);
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));

    return (
        <section id="inicio" className="relative h-screen w-full overflow-hidden bg-gray-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 bg-center bg-no-repeat bg-[size:100%_100%]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${window.storageUrl}${sliders[current].image})`,
                        }}
                    >
                        <div className="flex h-full items-center justify-center px-6 text-center">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="max-w-4xl"
                            >
                                <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                                    {sliders[current].title}
                                </h1>
                                <p className="mb-8 text-lg text-gray-200 md:text-xl">
                                    {sliders[current].subtitle}
                                </p>
                                {sliders[current].button_text && (
                                    <a
                                        href={sliders[current].button_url}
                                        className="inline-block rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-black hover:scale-105 active:scale-95"
                                    >
                                        {sliders[current].button_text}
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {sliders.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 space-x-3">
                        {sliders.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-1 transition-all ${index === current ? 'w-8 bg-gray-800' : 'w-4 bg-white/50 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
