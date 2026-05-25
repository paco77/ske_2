import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from '@/Components/DataTable';

export default function Index({ sliders }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        subtitle: '',
        button_text: '',
        button_url: '',
        image: null,
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSlider) {
            post(route('admin.sliders.update', editingSlider.id), {
                forceFormData: true,
                onSuccess: () => {
                    setEditingSlider(null);
                    reset();
                    setIsAdding(false);
                },
            });
        } else {
            post(route('admin.sliders.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (slider) => {
        setEditingSlider(slider);
        setData({
            title: slider.title || '',
            subtitle: slider.subtitle || '',
            button_text: slider.button_text || '',
            button_url: slider.button_url || '',
            image: null,
            order: slider.order,
            is_active: !!slider.is_active,
            _method: 'POST',
        });
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este slider?')) {
            destroy(route('admin.sliders.destroy', id));
        }
    };

    const columns = [
        {
            label: 'Imagen',
            key: 'image',
            sortable: false,
            render: (slider) => (
                <img
                    src={`${window.storageUrl}${slider.image}`}
                    className="h-12 w-20 object-cover rounded-lg shadow-sm"
                    alt=""
                />
            )
        },
        { label: 'Título', key: 'title', sortable: true },
        { label: 'Orden', key: 'order', sortable: true },
        {
            label: 'Estado',
            key: 'is_active',
            sortable: true,
            render: (slider) => (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${slider.is_active ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {slider.is_active ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            label: 'Acciones',
            key: 'actions',
            sortable: false,
            render: (slider) => (
                <div className="flex justify-end space-x-3 text-right">
                    <button
                        onClick={() => handleEdit(slider)}
                        className="text-gray-900 hover:text-black font-bold"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(slider.id)}
                        className="text-red-600 hover:text-red-900 font-bold"
                    >
                        Eliminar
                    </button>
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold leading-tight text-gray-800">
                        Gestionar Sliders
                    </h2>
                    <button
                        onClick={() => {
                            setEditingSlider(null);
                            reset();
                            setIsAdding(!isAdding);
                        }}
                        className="rounded-full bg-gray-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-black"
                    >
                        {isAdding ? 'Cancelar' : 'Agregar Slider'}
                    </button>
                </div>
            }
        >
            <Head title="Sliders - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isAdding && (
                        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
                            <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {editingSlider ? 'Editar Slider' : 'Nuevo Slider'}
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo</label>
                                        <input
                                            type="text"
                                            value={data.subtitle}
                                            onChange={(e) => setData('subtitle', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                        {errors.subtitle && <p className="mt-1 text-xs text-red-500">{errors.subtitle}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Texto Botón</label>
                                        <input
                                            type="text"
                                            value={data.button_text}
                                            onChange={(e) => setData('button_text', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">URL Botón</label>
                                        <input
                                            type="text"
                                            value={data.button_url}
                                            onChange={(e) => setData('button_url', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Imagen {editingSlider && '(Dejar vacío para no cambiar)'}</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('image', e.target.files[0])}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                        />
                                        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="w-1/2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Orden</label>
                                            <input
                                                type="number"
                                                value={data.order}
                                                onChange={(e) => setData('order', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            />
                                        </div>
                                        <div className="flex items-center pt-6">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                                            />
                                            <label className="ml-3 text-sm font-bold text-gray-700">Activo</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-gray-900 px-10 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {processing ? 'Procesando...' : (editingSlider ? 'Actualizar Slider' : 'Guardar Slider')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <DataTable
                        data={sliders}
                        columns={columns}
                        emptyMessage="No hay sliders registrados."
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
