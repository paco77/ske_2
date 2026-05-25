import { motion } from 'framer-motion';

export default function AboutSection({ about }) {
    if (!about) return null;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gray-900/5 rounded-3xl -z-10"></div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-900/5 rounded-3xl -z-10"></div>
                            <img
                                src={about.image ? `${window.storageUrl}${about.image}` : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'}
                                alt="Nuestra Empresa"
                                className="rounded-[2.5rem] shadow-2xl w-full aspect-[4/3] object-cover ring-1 ring-gray-200"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 space-y-12"
                    >
                        <div>
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 text-gray-900 text-sm font-bold mb-6">
                                <span className="mr-2">🚀</span> Nuestra Empresa
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 leading-tight mb-6">
                                Comprometidos con la <span className="text-gray-900 underline decoration-gray-200 underline-offset-8">Excelencia Industrial</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-gray-200">
                                    🎯
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Misión</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {about.mission}
                                </p>
                            </div>

                            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-gray-200">
                                    👁️
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Visión</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {about.vision}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
