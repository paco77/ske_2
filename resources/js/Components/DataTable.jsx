import { useState, useMemo } from 'react';

export default function DataTable({
    data,
    columns,
    searchPlaceholder = "Buscar...",
    emptyMessage = "No se encontraron resultados.",
    selectedRowId = null
}) {
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter data
    const filteredData = useMemo(() => {
        return data.filter(item => {
            return columns.some(col => {
                if (!col.searchable && col.searchable !== undefined) return false;
                const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
                return String(value || '').toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [data, search, columns]);

    // Sort data
    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
                const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full rounded-xl border-gray-200 pl-10 focus:ring-gray-800 focus:border-gray-800"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500 font-bold">
                    <span>Mostrar</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border-gray-200 py-1 text-sm focus:ring-gray-800"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span>por página</span>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50/80">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key || col.label}
                                        className={`px-6 py-4 text-left font-bold text-gray-700 ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                        onClick={() => col.sortable !== false && requestSort(col.sortableKey || col.key)}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{col.label}</span>
                                            {col.sortable !== false && (
                                                <div className="flex flex-col">
                                                    <svg className={`h-2.5 w-2.5 ${sortConfig.key === (col.sortableKey || col.key) && sortConfig.direction === 'asc' ? 'text-gray-900' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 5l-8 8h16l-8-8z" />
                                                    </svg>
                                                    <svg className={`h-2.5 w-2.5 ${sortConfig.key === (col.sortableKey || col.key) && sortConfig.direction === 'desc' ? 'text-gray-900' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 19l8-8H4l8 8z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.map((item, index) => (
                                <tr key={item.id || index} className={`transition-colors ${selectedRowId === item.id ? 'bg-green-50/50' : 'hover:bg-gray-50/50'}`}>
                                    {columns.map((col, colIndex) => (
                                        <td key={col.key || col.label} className={`px-6 py-4 ${selectedRowId === item.id && colIndex === 0 ? 'border-l-4 border-green-500' : ''}`}>
                                            <div className={selectedRowId === item.id && colIndex === 1 ? "flex items-center gap-2" : ""}>
                                                {selectedRowId === item.id && colIndex === 1 && (
                                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                )}
                                                <div className={selectedRowId === item.id && colIndex === 1 ? "flex-1" : ""}>
                                                    {col.render ? col.render(item) : col.key.split('.').reduce((obj, k) => obj?.[k], item)}
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="py-20 text-center text-gray-500 italic">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-700">
                        Mostrando <span className="font-black">{(currentPage - 1) * rowsPerPage + 1}</span> a <span className="font-black">{Math.min(currentPage * rowsPerPage, sortedData.length)}</span> de <span className="font-black">{sortedData.length}</span> resultados
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`h-10 w-10 rounded-lg text-sm font-black transition-all ${currentPage === i + 1
                                        ? 'bg-gray-900 text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
