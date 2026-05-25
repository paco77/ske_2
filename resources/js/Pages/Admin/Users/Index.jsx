import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from '@/Components/DataTable';

export default function Index({ users }) {
    const [isAdding, setIsAdding] = useState(false);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setIsAdding(false);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            destroy(route('admin.users.destroy', id));
        }
    };

    const columns = [
        { label: 'Nombre', key: 'name', sortable: true },
        { label: 'Correo Electrónico', key: 'email', sortable: true },
        {
            label: 'Acciones',
            key: 'actions',
            sortable: false,
            render: (user) => (
                <div className="flex justify-end space-x-3 text-right">
                    <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 font-bold disabled:opacity-50"
                        title="Eliminar usuario"
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
                        Gestionar Usuarios (Administradores)
                    </h2>
                    <button
                        onClick={() => {
                            reset();
                            setIsAdding(!isAdding);
                        }}
                        className="rounded-full bg-gray-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-black"
                    >
                        {isAdding ? 'Cancelar' : 'Nuevo Usuario'}
                    </button>
                </div>
            }
        >
            <Head title="Usuarios - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isAdding && (
                        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
                            <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Registrar Nuevo Administrador
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
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
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            required
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            required
                                        />
                                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-gray-800 focus:border-gray-800"
                                            required
                                        />
                                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-gray-900 px-10 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {processing ? 'Procesando...' : 'Guardar Usuario'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <DataTable
                        data={users}
                        columns={columns}
                        emptyMessage="No hay usuarios registrados."
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
