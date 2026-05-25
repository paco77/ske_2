import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ contact }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        whatsapp: contact?.whatsapp || '',
        email: contact?.email || '',
        phone: contact?.phone || '',
        address: contact?.address || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.contact.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800">
                    Información de Contacto
                </h2>
            }
        >
            <Head title="Contacto - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
                        <div className="p-10">
                            <h3 className="text-lg font-black text-gray-900 mb-6">Detalles de Contacto Público</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp (Solo números con código de país, ej: 524443751823)</label>
                                    <input
                                        type="text"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        placeholder="524443751823"
                                    />
                                    {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono de Oficina (Para mostrar)</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        placeholder="+52 4443751823"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Dirección Física</label>
                                    <textarea
                                        rows="3"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-between pt-6">
                                    {recentlySuccessful && (
                                        <p className="text-sm font-bold text-black">¡Guardado correctamente!</p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-gray-900 px-12 py-3 text-sm font-bold text-white transition-all hover:bg-black shadow-lg shadow-gray-900/10 disabled:opacity-50 ml-auto"
                                    >
                                        {processing ? 'Guardando...' : 'Actualizar Información'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
