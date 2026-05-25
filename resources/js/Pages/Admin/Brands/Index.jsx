import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from '@/Components/DataTable';

export default function Index({ brands }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        logo: null,
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBrand) {
            post(route('admin.brands.update', editingBrand.id), {
                forceFormData: true,
                onSuccess: () => {
                    setEditingBrand(null);
                    reset();
                    setIsAdding(false);
                },
            });
        } else {
            post(route('admin.brands.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (brand) => {
        setEditingBrand(brand);
        setData({
            name: brand.name,
            logo: null,
            order: brand.order,
            is_active: !!brand.is_active,
            _method: 'POST',
        });
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar esta marca?')) {
            destroy(route('admin.brands.destroy', id));
        }
    };

    const columns = [
        {
            label: 'Logo',
            key: 'logo',
            sortable: false,
            render: (brand) => (
                <div className="h-10 w-24 flex items-center justify-center rounded bg-gray-50 border p-1">
                    <img
                        src={`${window.storageUrl}${brand.logo}`}
                        className="max-h-full max-w-full object-contain"
                        alt={brand.name}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/80?text=' + brand.name)}
                    />
                </div>
            )
        },
        { label: 'Nombre', key: 'name', sortable: true },
        { label: 'Orden', key: 'order', sortable: true },
        {
            label: 'Estado',
            key: 'is_active',
            sortable: true,
            render: (brand) => (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${brand.is_active ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {brand.is_active ? 'Activa' : 'Inactiva'}
                </span>
            )
        },
        {
            label: 'Acciones',
            key: 'actions',
            sortable: false,
            render: (brand) => (
                <div className="flex justify-end space-x-3 text-right">
                    <button
                        onClick={() => handleEdit(brand)}
                        className="text-gray-900 hover:text-black font-bold"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(brand.id)}
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
                        Gestionar Marcas
                    </h2>
                    <button
                        onClick={() => {
                            setEditingBrand(null);
                            reset();
                            setIsAdding(!isAdding);
                        }}
                        className="rounded-full bg-gray-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-black"
                    >
                        {isAdding ? 'Cancelar' : 'Agregar Marca'}
                    </button>
                </div>
            }
        >
            <Head title="Marcas - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isAdding && (
                        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
                            <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {editingBrand ? 'Editar Marca' : 'Nueva Marca'}
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Marca</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Logo</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('logo', e.target.files[0])}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                        />
                                        {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Orden</label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={(e) => setData('order', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                    </div>
                                    <div className="flex items-center pt-8">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                                        />
                                        <label className="ml-3 text-sm font-bold text-gray-700">Activa</label>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-gray-900 px-10 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {processing ? 'Procesando...' : (editingBrand ? 'Actualizar Marca' : 'Guardar Marca')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <DataTable
                        data={brands}
                        columns={columns}
                        emptyMessage="No hay marcas registradas."
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
