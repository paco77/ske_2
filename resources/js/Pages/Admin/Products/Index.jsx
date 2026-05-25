import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from '@/Components/DataTable';

export default function Index({ products, subcategories, brands }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        description: '',
        image: null,
        subcategory_id: '',
        brand_id: '',
        is_active: true,
        _method: 'POST',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            post(route('admin.products.update', editingProduct.id), {
                forceFormData: true,
                onSuccess: () => {
                    setEditingProduct(null);
                    setIsAdding(false);
                    reset();
                },
            });
        } else {
            post(route('admin.products.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            description: product.description || '',
            image: null,
            subcategory_id: product.subcategory_id,
            brand_id: product.brand_id || '',
            is_active: !!product.is_active,
            _method: 'POST',
        });
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar este producto?')) {
            destroy(route('admin.products.destroy', id));
        }
    };

    const columns = [
        {
            label: 'Imagen',
            key: 'image',
            sortable: false,
            render: (product) => (
                <img
                    src={`${window.storageUrl}${product.image}`}
                    className="h-12 w-12 object-contain rounded-lg border bg-gray-50"
                    alt=""
                    onError={(e) => {
                        if (!e.target.src.includes('via.placeholder.com')) {
                            e.target.src = 'https://via.placeholder.com/50';
                        }
                    }}
                />
            )
        },
        {
            label: 'Producto',
            key: 'name',
            sortable: true,
            render: (product) => (
                <div>
                    <div className="font-bold text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                </div>
            )
        },
        {
            label: 'Categoría',
            key: 'subcategory.name',
            sortable: true,
            sortableKey: 'subcategory.category.name',
            render: (product) => (
                <span className="text-xs font-medium text-gray-600">
                    {product.subcategory?.category?.name} {'>'} {product.subcategory?.name}
                </span>
            )
        },
        {
            label: 'Marca',
            key: 'brand.name',
            sortable: true,
            render: (product) => (
                <span className="rounded bg-gray-50 px-2 py-1 text-[10px] font-black uppercase text-gray-900">
                    {product.brand?.name || '---'}
                </span>
            )
        },
        {
            label: 'Acciones',
            key: 'actions',
            sortable: false,
            render: (product) => (
                <div className="flex justify-end space-x-3 text-right">
                    <button onClick={() => handleEdit(product)} className="text-gray-900 font-bold hover:underline">Editar</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 font-bold hover:underline">Borrar</button>
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold leading-tight text-gray-800">
                        Gestionar Catálogo de Productos
                    </h2>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            reset();
                            setIsAdding(!isAdding);
                        }}
                        className="rounded-full bg-gray-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-black"
                    >
                        {isAdding ? 'Cancelar' : 'Nuevo Producto'}
                    </button>
                </div>
            }
        >
            <Head title="Productos - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isAdding && (
                        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                                            <textarea
                                                rows="4"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Subcategoría</label>
                                                <select
                                                    value={data.subcategory_id}
                                                    onChange={(e) => setData('subcategory_id', e.target.value)}
                                                    className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800 text-sm"
                                                    required
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {subcategories.map((sub) => (
                                                        <option key={sub.id} value={sub.id}>
                                                            {sub.category?.name} {'>'} {sub.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Marca (Opcional)</label>
                                                <select
                                                    value={data.brand_id}
                                                    onChange={(e) => setData('brand_id', e.target.value)}
                                                    className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800 text-sm"
                                                >
                                                    <option value="">Ninguna</option>
                                                    {brands.map((brand) => (
                                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Imagen</label>
                                            <input
                                                type="file"
                                                onChange={(e) => setData('image', e.target.files[0])}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex items-center pt-2">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                                            />
                                            <label className="ml-3 text-sm font-bold text-gray-700">Producto Activo</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-gray-900 px-12 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800"
                                    >
                                        {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <DataTable
                        data={products}
                        columns={columns}
                        emptyMessage="No hay productos registrados."
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
