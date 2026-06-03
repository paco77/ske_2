import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';

export default function Index({ products, categories, subcategories, brands }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        description: '',
        image: null,
        category_id: '',
        subcategory_id: '',
        brand_id: '',
        is_active: true,
        _method: 'POST',
    });

    const filteredSubcategories = useMemo(() => {
        if (!data.category_id) return [];
        return subcategories.filter(sub => sub.category_id === parseInt(data.category_id));
    }, [data.category_id, subcategories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            post(route('admin.products.update', editingProduct.id), {
                forceFormData: true,
                onSuccess: () => {
                    setEditingProduct(null);
                    setIsAdding(false);
                    setImagePreview(null);
                    reset();
                },
            });
        } else {
            post(route('admin.products.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    setImagePreview(null);
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
            category_id: product.category_id || (product.subcategory?.category_id || ''),
            subcategory_id: product.subcategory_id || '',
            brand_id: product.brand_id || '',
            is_active: !!product.is_active,
            _method: 'POST',
        });
        setImagePreview(product.image ? `${window.storageUrl}${product.image}` : null);
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
            key: 'category.name',
            sortable: true,
            sortableKey: 'category.name',
            render: (product) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800">
                        {product.category?.name || product.subcategory?.category?.name || '---'}
                    </span>
                    {product.subcategory && (
                        <span className="text-[10px] text-gray-500">
                            ↳ {product.subcategory.name}
                        </span>
                    )}
                </div>
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
                            setImagePreview(null);
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
                                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                                            <textarea
                                                rows="4"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            ></textarea>
                                            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                                                <select
                                                    value={data.category_id}
                                                    onChange={(e) => {
                                                        setData('category_id', e.target.value);
                                                        setData('subcategory_id', ''); // Reset subcategory when category changes
                                                    }}
                                                    className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800 text-sm"
                                                    required
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Subcategoría (Opcional)</label>
                                                <select
                                                    value={data.subcategory_id}
                                                    onChange={(e) => setData('subcategory_id', e.target.value)}
                                                    className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800 text-sm"
                                                    disabled={!data.category_id || filteredSubcategories.length === 0}
                                                >
                                                    <option value="">Ninguna</option>
                                                    {filteredSubcategories.map((sub) => (
                                                        <option key={sub.id} value={sub.id}>
                                                            {sub.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.subcategory_id && <div className="text-red-500 text-xs mt-1">{errors.subcategory_id}</div>}
                                            </div>
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
                                            {errors.brand_id && <div className="text-red-500 text-xs mt-1">{errors.brand_id}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Imagen</label>
                                            <div className="flex items-center gap-4">
                                                {imagePreview && (
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
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
                                                            setImagePreview(editingProduct?.image ? `${window.storageUrl}${editingProduct.image}` : null);
                                                        }
                                                    }}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                                />
                                            </div>
                                            {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
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
