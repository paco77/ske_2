import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ setting }) {
    const { data, setData, post, processing, errors } = useForm({
        keywords: setting.keywords || '',
        description: setting.description || '',
        _method: 'POST',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.seo.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800">
                    Configuración SEO
                </h2>
            }
        >
            <Head title="SEO - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Metadatos para Buscadores (Google)</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Palabras Clave (Keywords)</label>
                                        <input
                                            type="text"
                                            value={data.keywords}
                                            onChange={(e) => setData('keywords', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            placeholder="ej. tienda, zapatos, compras online (separadas por comas)"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Palabras separadas por comas que describan tu sitio.</p>
                                        {errors.keywords && <div className="text-red-500 text-xs mt-1">{errors.keywords}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Descripción del Sitio</label>
                                        <textarea
                                            rows="4"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            placeholder="Breve descripción de lo que ofrece tu sitio web."
                                        ></textarea>
                                        <p className="text-xs text-gray-500 mt-1">Esta descripción es la que suele aparecer debajo del título en los resultados de búsqueda de Google (se recomiendan unos 150-160 caracteres).</p>
                                        {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-full bg-gray-900 px-12 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400 active:scale-95 shadow-md shadow-gray-900/10"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Configuración'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
