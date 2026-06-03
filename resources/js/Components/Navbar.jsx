import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Navbar() {
    const { global_brands, global_categories } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredDropdown, setHoveredDropdown] = useState(null);
    const [expandedMenu, setExpandedMenu] = useState(null);

    const toggleMobileMenu = (name) => {
        if (expandedMenu === name) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(name);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: '/#inicio' },
        { name: 'Marcas', href: '/#marcas', hasDropdown: true, dropdownItems: global_brands, routeName: 'brand.products', emptyMessage: 'No hay marcas' },
        { name: 'Categorías', href: '/#categorias', hasDropdown: true, dropdownItems: global_categories, routeName: 'category.products', emptyMessage: 'No hay categorías' },
        { name: 'Contacto', href: '/#contacto' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 py-3 shadow-lg backdrop-blur-md' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href={route('home')} className="flex items-center space-x-2">
                    <ApplicationLogo className="h-[100px] w-[100px] object-contain" />
                </Link>

                <div className="hidden md:flex items-center space-x-8 relative">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => link.hasDropdown && setHoveredDropdown(link.name)}
                            onMouseLeave={() => link.hasDropdown && setHoveredDropdown(null)}
                        >
                            <a
                                href={link.href}
                                className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-gray-800 ${isScrolled ? 'text-gray-700' : 'text-white/90'
                                    }`}
                            >
                                {link.name}
                                {link.hasDropdown && (
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${hoveredDropdown === link.name ? '-rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </a>

                            {link.hasDropdown && (
                                <AnimatePresence>
                                    {hoveredDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 py-2"
                                        >
                                            <div className="max-h-[350px] overflow-y-auto">
                                                {link.dropdownItems && link.dropdownItems.length > 0 ? (
                                                    link.dropdownItems.map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            href={route(link.routeName, item.id)}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <span className="block px-4 py-2 text-sm text-gray-400">{link.emptyMessage}</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                        }`}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-6 py-6 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <div key={link.name} className="flex flex-col">
                                    {link.hasDropdown ? (
                                        <button
                                            onClick={() => toggleMobileMenu(link.name)}
                                            className="text-lg font-semibold text-gray-800 hover:text-gray-900 flex justify-between items-center w-full text-left"
                                        >
                                            {link.name}
                                            <svg className={`w-5 h-5 transition-transform ${expandedMenu === link.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <a
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-lg font-semibold text-gray-800 hover:text-gray-900 flex justify-between items-center"
                                        >
                                            {link.name}
                                        </a>
                                    )}
                                    {link.hasDropdown && expandedMenu === link.name && (
                                        <div className="mt-2 ml-4 flex flex-col space-y-2 border-l-2 border-gray-100 pl-4 max-h-56 overflow-y-auto">
                                            <a
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-gray-900 font-bold text-sm py-2 mb-1 border-b border-gray-100"
                                            >
                                                Ver {link.name.toLowerCase()}
                                            </a>
                                            {link.dropdownItems && link.dropdownItems.length > 0 ? (
                                                link.dropdownItems.map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        href={route(link.routeName, item.id)}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="text-gray-600 hover:text-gray-900 text-sm py-1"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm py-1">{link.emptyMessage}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
