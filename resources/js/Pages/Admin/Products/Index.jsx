import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';

export default function Index({ products, categories, subcategories, brands }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [lastEditedProductId, setLastEditedProductId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        serie: '',
        description: '',
        image: null,
        images: [],
        kept_images: [],
        category_id: '',
        subcategory_id: '',
        brand_id: '',
        seo_keywords: '',
        technical_sheet: null,
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
                    setGalleryPreviews([]);
                    reset();
                },
            });
        } else {
            post(route('admin.products.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    setImagePreview(null);
                    setGalleryPreviews([]);
                    reset();
                },
            });
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setLastEditedProductId(product.id);
        setData({
            name: product.name,
            serie: product.serie || '',
            description: product.description || '',
            image: null,
            images: [],
            kept_images: product.images || [],
            category_id: product.category_id || (product.subcategory?.category_id || ''),
            subcategory_id: product.subcategory_id || '',
            brand_id: product.brand_id || '',
            seo_keywords: product.seo_keywords || '',
            technical_sheet: null,
            is_active: !!product.is_active,
            _method: 'POST',
        });
        setImagePreview(product.image ? `${window.storageUrl}${product.image}` : null);
        setGalleryPreviews([]);
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
            label: 'Serie',
            key: 'serie',
            sortable: true,
            render: (product) => (
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">{product.serie || '---'}</span>
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
                <span className="text-xs font-bold text-gray-800">
                    {product.category?.name || product.subcategory?.category?.name || '---'}
                </span>
            )
        },
        {
            label: 'Subcategoría',
            key: 'subcategory.name',
            sortable: true,
            sortableKey: 'subcategory.name',
            render: (product) => (
                <span className="text-xs text-gray-600">
                    {product.subcategory?.name || '---'}
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
            label: 'Ficha Técnica',
            key: 'technical_sheet',
            sortable: false,
            render: (product) => (
                product.technical_sheet ? (
                    <span className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700 ring-1 ring-inset ring-green-600/20">
                        Sí
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        No
                    </span>
                )
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
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => {
                                if (confirm('¿Estás seguro de que deseas generar las series de todos los productos basándose en sus nombres? Esto sobrescribirá las series existentes.')) {
                                    router.post(route('admin.products.generate-series'), {}, {
                                        preserveScroll: true
                                    });
                                }
                            }}
                            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700"
                        >
                            Generar Series
                        </button>
                        <button
                            onClick={() => {
                                setEditingProduct(null);
                                setLastEditedProductId(null);
                                setImagePreview(null);
                                setGalleryPreviews([]);
                                reset();
                                setIsAdding(!isAdding);
                            }}
                            className="rounded-full bg-gray-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-black"
                        >
                            {isAdding ? 'Cancelar' : 'Nuevo Producto'}
                        </button>
                    </div>
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
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Serie</label>
                                            <input
                                                type="text"
                                                value={data.serie}
                                                onChange={(e) => setData('serie', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            />
                                            {errors.serie && <div className="text-red-500 text-xs mt-1">{errors.serie}</div>}
                                        </div>
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
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Keywords SEO (separadas por coma)</label>
                                            <input
                                                type="text"
                                                value={data.seo_keywords}
                                                onChange={(e) => setData('seo_keywords', e.target.value)}
                                                placeholder=""
                                                className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Estas palabras se agregarán automáticamente a la configuración global de SEO.</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Ficha Técnica (PDF)</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('technical_sheet', e.target.files[0])}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                                />
                                            </div>
                                            {editingProduct?.technical_sheet && (
                                                <a href={`${window.storageUrl}${editingProduct.technical_sheet}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                                                    Ver PDF actual
                                                </a>
                                            )}
                                            {errors.technical_sheet && <div className="text-red-500 text-xs mt-1">{errors.technical_sheet}</div>}
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
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Galería de Imágenes (Múltiples)</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    if (files.length > 0) {
                                                        setData('images', [...(data.images || []), ...files]);
                                                        setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
                                                        e.target.value = ''; // Reset UI input value
                                                    }
                                                }}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100 mb-4"
                                            />
                                            {(data.kept_images.length > 0 || galleryPreviews.length > 0) && (
                                                <div className="grid grid-cols-4 gap-4 mt-4">
                                                    {data.kept_images.map((img, idx) => (
                                                        <div key={`kept-${idx}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                                            <img src={`${window.storageUrl}${img}`} alt="Preview" className="h-full w-full object-contain" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('kept_images', data.kept_images.filter(i => i !== img))}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {galleryPreviews.map((preview, idx) => (
                                                        <div key={`new-${idx}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-blue-50">
                                                            <img src={preview} alt="New Preview" className="h-full w-full object-contain" />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    URL.revokeObjectURL(preview);
                                                                    const newImages = data.images.filter((_, i) => i !== idx);
                                                                    setData('images', newImages);
                                                                    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx));
                                                                }}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                            <span className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[8px] text-center py-0.5">NUEVA</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {errors.images && <div className="text-red-500 text-xs mt-1">{errors.images}</div>}
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
                        selectedRowId={lastEditedProductId}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
