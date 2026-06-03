import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ about }) {
    const [logoPreview, setLogoPreview] = useState(about?.logo ? `${window.storageUrl}${about.logo}` : null);
    const [imagePreview, setImagePreview] = useState(about?.image ? `${window.storageUrl}${about.image}` : null);
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        mission: about?.mission || '',
        vision: about?.vision || '',
        image: null,
        logo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use post with _method=PATCH for multipart forms if needed, 
        // but here we use a standard POST to the update route as defined.
        post(route('admin.about.update'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800">
                    Ajustes Generales (Logo, Misión y Visión)
                </h2>
            }
        >
            <Head title="Ajustes Generales - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
                        <div className="p-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Logo de la Página (Recomendado png con fondo transparente)</label>
                                    <div className="flex items-center gap-4">
                                        {logoPreview && (
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1">
                                                <img src={logoPreview} alt="Preview" className="h-full w-full object-contain" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setData('logo', file);
                                                if (file) {
                                                    setLogoPreview(URL.createObjectURL(file));
                                                } else {
                                                    setLogoPreview(about?.logo ? `${window.storageUrl}${about.logo}` : null);
                                                }
                                            }}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                        />
                                    </div>
                                    {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
                                </div>
                                
                                <hr className="border-gray-100" />

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Misión</label>
                                    <textarea
                                        rows="5"
                                        value={data.mission}
                                        onChange={(e) => setData('mission', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        placeholder="Escribe la misión de la empresa..."
                                    ></textarea>
                                    {errors.mission && <p className="mt-1 text-xs text-red-500">{errors.mission}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Visión</label>
                                    <textarea
                                        rows="5"
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        placeholder="Escribe la visión de la empresa..."
                                    ></textarea>
                                    {errors.vision && <p className="mt-1 text-xs text-red-500">{errors.vision}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Imagen de la Sección About</label>
                                    <div className="flex items-center gap-4">
                                        {imagePreview && (
                                            <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setData('image', file);
                                                if (file) {
                                                    setImagePreview(URL.createObjectURL(file));
                                                } else {
                                                    setImagePreview(about?.image ? `${window.storageUrl}${about.image}` : null);
                                                }
                                            }}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                        />
                                    </div>
                                    {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
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
