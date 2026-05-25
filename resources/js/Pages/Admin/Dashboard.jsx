import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const cardData = [
        { name: 'Sliders', count: stats.sliders, href: route('admin.sliders.index'), color: 'bg-gray-800' },
        { name: 'Marcas', count: stats.brands, href: route('admin.brands.index'), color: 'bg-gray-900' },
        { name: 'Categorías', count: stats.categories, href: route('admin.categories.index'), color: 'bg-purple-500' },
        { name: 'Productos', count: stats.products, href: route('admin.products.index'), color: 'bg-orange-500' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800">
                    Panel de Administración
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {cardData.map((card) => (
                            <Link
                                key={card.name}
                                href={card.href}
                                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:ring-gray-900/10"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.name}</p>
                                            <p className="mt-2 text-3xl font-bold text-gray-900">{card.count}</p>
                                        </div>
                                        <div className={`rounded-xl ${card.color} p-3 text-white`}>
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center text-sm font-bold text-gray-900">
                                        Gestionar {card.name}
                                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                        <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                            <h3 className="text-lg font-bold text-gray-900">Bienvenido al Panel de SKE</h3>
                        </div>
                        <div className="p-10 text-center">
                            <div className="mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-gray-100 text-gray-900">
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900">Todo listo para gestionar tu contenido</h4>
                            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
                                Desde este panel puedes actualizar los banners principales, agregar marcas,
                                gestionar categorías y subcategorías, y mantener al día tu catálogo de productos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
