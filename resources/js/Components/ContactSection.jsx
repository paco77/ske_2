import { motion } from 'framer-motion';

export default function ContactSection({ contact }) {
    if (!contact) return null;

    const whatsappUrl = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;

    return (
        <section id="contacto" className="bg-gray-900 py-24 text-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold mb-6">Contáctanos</h2>
                            <p className="text-gray-400 text-lg mb-10">
                                ¿Necesitas un presupuesto o información sobre algún componente?
                                Estamos listos para ayudarte con las mejores soluciones industriales.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-gray-900/20 p-4 rounded-xl">
                                        <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <h4 className="text-xl font-bold">Dirección</h4>
                                        <p className="text-gray-400 mt-1">{contact.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-black/20 p-4 rounded-xl">
                                        <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <h4 className="text-xl font-bold">WhatsApp</h4>
                                        <p className="text-gray-400 mt-1">{contact.phone}</p>
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center mt-3 text-gray-900 font-bold hover:underline"
                                        >
                                            Chatear ahora
                                            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-purple-600/20 p-4 rounded-xl">
                                        <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <h4 className="text-xl font-bold">Correo Electrónico</h4>
                                        <p className="text-gray-400 mt-1">{contact.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/5 backdrop-blur-3xl p-10 rounded-3xl border border-white/10"
                        >
                            <h3 className="text-2xl font-bold mb-8 text-gray-400">Solicita una Cotización</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-gray-800 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp / Teléfono</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-gray-800 outline-none transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Asunto</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-gray-800 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
                                    <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-gray-800 outline-none transition-all"></textarea>
                                </div>
                                <button className="w-full bg-gray-900 hover:bg-black py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-gray-900/20">
                                    Enviar Mensaje
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-white/10 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} SKE Componentes y Suministros. Todos los derechos reservados.
                </div>
            </div>
        </section>
    );
}
