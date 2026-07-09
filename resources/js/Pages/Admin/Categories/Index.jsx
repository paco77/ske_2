import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [lastEditedCategoryId, setLastEditedCategoryId] = useState(null);
    const [isAddingSub, setIsAddingSub] = useState(false);
    const [selectedCatForSub, setSelectedCatForSub] = useState(null);
    const [catImagePreview, setCatImagePreview] = useState(null);
    const [subImagePreview, setSubImagePreview] = useState(null);

    const categoryForm = useForm({
        name: '',
        image: null,
        order: 0,
        seo_keywords: '',
        is_active: true,
        _method: 'POST',
    });

    const subcategoryForm = useForm({
        name: '',
        image: null,
        order: 0,
        seo_keywords: '',
        is_active: true,
        _method: 'POST',
    });

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.post(route('admin.categories.update', editingCategory.id), {
                forceFormData: true,
                onSuccess: () => {
                    setEditingCategory(null);
                    setIsAdding(false);
                    setCatImagePreview(null);
                    categoryForm.reset();
                },
            });
        } else {
            categoryForm.post(route('admin.categories.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    setCatImagePreview(null);
                    categoryForm.reset();
                },
            });
        }
    };

    const handleSubcategorySubmit = (e) => {
        e.preventDefault();
        subcategoryForm.post(route('admin.subcategories.store', selectedCatForSub.id), {
            onSuccess: () => {
                setIsAddingSub(false);
                setSubImagePreview(null);
                subcategoryForm.reset();
            },
        });
    };

    const handleDeleteCategory = (id) => {
        if (confirm('¿Eliminar categoría y todas sus subcategorías?')) {
            categoryForm.delete(route('admin.categories.destroy', id));
        }
    };

    const handleDeleteSubcategory = (id) => {
        if (confirm('¿Eliminar esta subcategoría?')) {
            subcategoryForm.delete(route('admin.subcategories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold leading-tight text-gray-800">
                        Categorías y Subcategorías
                    </h2>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setLastEditedCategoryId(null);
                            setCatImagePreview(null);
                            categoryForm.reset();
                            setIsAdding(!isAdding);
                        }}
                        className="rounded-full bg-gray-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-black"
                    >
                        {isAdding ? 'Cancelar' : 'Nueva Categoría'}
                    </button>
                </div>
            }
        >
            <Head title="Categorías - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isAdding && (
                        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
                            <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                                </h3>
                            </div>
                            <form onSubmit={handleCategorySubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                                        <input
                                            type="text"
                                            value={categoryForm.data.name}
                                            onChange={(e) => categoryForm.setData('name', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Imagen</label>
                                        <div className="flex items-center gap-4">
                                            {catImagePreview && (
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                                    <img src={catImagePreview} alt="Preview" className="h-full w-full object-contain" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    categoryForm.setData('image', file);
                                                    if (file) {
                                                        setCatImagePreview(URL.createObjectURL(file));
                                                    } else {
                                                        setCatImagePreview(editingCategory?.image ? `${window.storageUrl}${editingCategory.image}` : null);
                                                    }
                                                }}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-black hover:file:bg-gray-100"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Orden</label>
                                        <input
                                            type="number"
                                            value={categoryForm.data.order}
                                            onChange={(e) => categoryForm.setData('order', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Keywords SEO (separadas por coma)</label>
                                        <input
                                            type="text"
                                            value={categoryForm.data.seo_keywords}
                                            onChange={(e) => categoryForm.setData('seo_keywords', e.target.value)}
                                            placeholder=""
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                    </div>
                                    <div className="flex items-center pt-8">
                                        <input
                                            type="checkbox"
                                            checked={categoryForm.data.is_active}
                                            onChange={(e) => categoryForm.setData('is_active', e.target.checked)}
                                            className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                                        />
                                        <label className="ml-3 text-sm font-bold text-gray-700">Activa</label>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={categoryForm.processing}
                                        className="rounded-full bg-gray-900 px-10 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {categoryForm.processing ? 'Procesando...' : 'Guardar Categoría'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {isAddingSub && (
                        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 border-2 border-gray-900">
                            <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Nueva Subcategoría en: {selectedCatForSub.name}
                                </h3>
                            </div>
                            <form onSubmit={handleSubcategorySubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                                        <input
                                            type="text"
                                            value={subcategoryForm.data.name}
                                            onChange={(e) => subcategoryForm.setData('name', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-900 focus:border-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Imagen</label>
                                        <div className="flex items-center gap-4">
                                            {subImagePreview && (
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                                    <img src={subImagePreview} alt="Preview" className="h-full w-full object-contain" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    subcategoryForm.setData('image', file);
                                                    if (file) {
                                                        setSubImagePreview(URL.createObjectURL(file));
                                                    } else {
                                                        setSubImagePreview(null);
                                                    }
                                                }}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Keywords SEO (separadas por coma)</label>
                                        <input
                                            type="text"
                                            value={subcategoryForm.data.seo_keywords}
                                            onChange={(e) => subcategoryForm.setData('seo_keywords', e.target.value)}
                                            placeholder=""
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-900 focus:border-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingSub(false);
                                            setSubImagePreview(null);
                                        }}
                                        className="rounded-full bg-gray-100 px-8 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={subcategoryForm.processing}
                                        className="rounded-full bg-black px-10 py-3 text-sm font-bold text-white transition-all hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        Guardar Subcategoría
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-6">
                        {categories.map((category) => (
                            <div key={category.id} className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ${lastEditedCategoryId === category.id ? 'ring-green-500 border-2 border-green-500' : 'ring-gray-200'}`}>
                                <div className={`flex items-center justify-between p-6 border-b border-gray-100 ${lastEditedCategoryId === category.id ? 'bg-green-50/30' : 'bg-gray-50/50'}`}>
                                    <div className="flex items-center space-x-4">
                                        <img src={`${window.storageUrl}${category.image}`} className="h-12 w-16 object-cover rounded-lg" alt="" />
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                                {category.name}
                                                {lastEditedCategoryId === category.id && (
                                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                )}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <p className="text-xs text-gray-500">{category.subcategories?.length || 0} subcategorías</p>
                                                {category.seo_keywords ? (
                                                    <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-inset ring-green-600/20">SEO ✓</span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-600 ring-1 ring-inset ring-gray-500/10">Sin SEO</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => {
                                                setSelectedCatForSub(category);
                                                setIsAddingSub(true);
                                                setSubImagePreview(null);
                                                subcategoryForm.reset();
                                            }}
                                            className="text-black hover:text-gray-800 text-sm font-bold"
                                        >
                                            + Subcategoría
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCategory(category);
                                                setLastEditedCategoryId(category.id);
                                                categoryForm.setData({
                                                    name: category.name,
                                                    image: null,
                                                    order: category.order,
                                                    seo_keywords: category.seo_keywords || '',
                                                    is_active: !!category.is_active,
                                                    _method: 'POST',
                                                });
                                                setCatImagePreview(category.image ? `${window.storageUrl}${category.image}` : null);
                                                setIsAdding(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="text-gray-900 hover:text-black text-sm font-bold"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-bold"
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {category.subcategories?.map((sub) => (
                                            <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/30 group">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                                        {sub.image && <img src={`${window.storageUrl}${sub.image}`} className="object-contain h-full w-full" />}
                                                    </div>
                                                    <span className="font-bold text-gray-700">{sub.name}</span>
                                                    {sub.seo_keywords && (
                                                        <span className="ml-2 inline-flex items-center rounded bg-green-50 px-1.5 py-0.5 text-[9px] font-bold text-green-700 ring-1 ring-inset ring-green-600/20">SEO ✓</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteSubcategory(sub.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        {(!category.subcategories || category.subcategories.length === 0) && (
                                            <p className="text-sm text-gray-400 italic">No hay subcategorías</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
