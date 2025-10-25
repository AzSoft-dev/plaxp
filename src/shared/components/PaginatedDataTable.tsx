import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import React from 'react';

// --- TIPOS DE DATOS GENÉRICOS ---
export interface BaseItem {
    id: number | string;
    [key: string]: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface ColumnDefinition<T> {
    key: keyof T;
    header: string;
}

interface PaginatedDataTableProps<T extends BaseItem> {
    fetchDataFunction: (page: number, limit: number, query: string) => Promise<PaginatedResponse<T>>;
    onRowClick: (item: T) => void;
    onCreateNew: () => void;
    columns: ColumnDefinition<T>[];
    title: string;
    refreshTrigger?: number;
}

const DEFAULT_PAGE_SIZE = 15;
const PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100];

// --- Subcomponente para la vista de TARJETAS (Móvil) ---
const PaginatedCardList = <T extends BaseItem>({ data, columns, onRowClick }: {
    data: T[];
    columns: ColumnDefinition<T>[];
    onRowClick: (item: T) => void;
}) => (
    <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">

        {data.map((item) => (
            <div
                key={item.id}
                className="group bg-gradient-to-br from-white to-neutral-50 rounded-xl shadow-md p-4 border border-neutral-200/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] cursor-pointer backdrop-blur-sm"
                onClick={() => onRowClick(item)}
            >
                <div className="space-y-2.5">
                    {columns.map((col) => (
                        <div key={String(col.key)} className="flex items-start space-x-2">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide min-w-[70px]">{col.header}:</span>
                            <span className="text-sm font-semibold text-neutral-900 group-hover:text-primary transition-colors duration-300">{item[col.key] as React.ReactNode}</span>
                        </div>
                    ))}
                    <div className="flex justify-end pt-2 space-x-2 border-t border-neutral-200/50">
                        <button className="text-primary hover:text-purple-700 transform hover:scale-110 transition-all duration-200 p-1" aria-label="View Details"><FaEye size={16} /></button>
                        <button className="text-info hover:text-blue-700 transform hover:scale-110 transition-all duration-200 p-1" aria-label="Edit"><FaEdit size={16} /></button>
                        <button className="text-danger hover:text-red-700 transform hover:scale-110 transition-all duration-200 p-1" aria-label="Delete"><FaTrash size={16} /></button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// --- Subcomponente para la vista de TABLA (Desktop) ---
const PaginatedTable = <T extends BaseItem>({ data, columns, onRowClick }: {
    data: T[];
    columns: ColumnDefinition<T>[];
    onRowClick: (item: T) => void;
}) => (
    <div className="hidden md:block overflow-hidden">
        {/* Contenedor con scroll interno */}
        <div className="overflow-auto rounded-xl" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            <table className="w-full table-auto border-separate border-spacing-y-1.5 border-spacing-x-0">
                <thead className="sticky top-0 z-10 shadow-lg">
                    <tr className="bg-gradient-to-r from-primary/90 to-primary text-white uppercase text-xs leading-normal tracking-wider">
                        {columns.map((col) => (
                            <th key={String(col.key)} className="py-2.5 px-4 text-left font-bold bg-gradient-to-r from-primary/90 to-primary">{col.header}</th>
                        ))}
                        <th className="py-2.5 px-4 text-center font-bold bg-gradient-to-r from-primary/90 to-primary">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-neutral-700 text-sm">
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onRowClick(item)}
                            className="group bg-gradient-to-r from-white to-neutral-50/50 cursor-pointer hover:from-primary/5 hover:to-primary/10 transition-all duration-300 ease-out shadow-sm hover:shadow-lg transform hover:scale-[1.005] rounded-xl"
                        >
                            {columns.map((col) => (
                                <td key={String(col.key)} className="py-2.5 px-4 text-left first:rounded-l-xl">
                                    <span className="font-medium text-neutral-800 group-hover:text-primary transition-colors duration-300">{item[col.key] as React.ReactNode}</span>
                                </td>
                            ))}
                            <td className="py-2.5 px-4 text-center rounded-r-xl" onClick={(e) => e.stopPropagation()}>
                                <div className="flex item-center justify-center space-x-2">
                                    <button className="text-primary hover:text-purple-700 transform hover:scale-110 transition-all duration-200 p-1.5 hover:bg-primary/10 rounded-lg" aria-label="View Details"><FaEye size={16} /></button>
                                    <button className="text-info hover:text-blue-700 transform hover:scale-110 transition-all duration-200 p-1.5 hover:bg-info/10 rounded-lg" aria-label="Edit"><FaEdit size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
const PaginatedDataTable = <T extends BaseItem>({
    fetchDataFunction,
    onRowClick,
    onCreateNew,
    columns,
    title,
    refreshTrigger = 0,
}: PaginatedDataTableProps<T>) => {
    // Estado de la Data y UI
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estado de Búsqueda
    const [inputTerm, setInputTerm] = useState("");
    const [activeSearchTerm, setActiveSearchTerm] = useState("");

    // Estado de Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    // Cálculo de páginas
    const totalPages = useMemo(() =>
        Math.max(1, Math.ceil(totalItems / pageSize)),
        [totalItems, pageSize]
    );

    // Hook para manejar la consulta al servidor
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchDataFunction(currentPage, pageSize, activeSearchTerm);
            if (!Array.isArray(result.data)) {
                throw new Error("La API no devolvió un array de datos válido.");
            }
            setData(result.data);
            setTotalItems(result.total);
            setCurrentPage(result.page || currentPage);
        } catch (err: any) {
            console.error("Error cargando datos:", err);
            const errorMessage = err.message || "Error al cargar datos del servidor.";
            setError(errorMessage);
            setData([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, activeSearchTerm, fetchDataFunction, refreshTrigger]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearchSubmit = () => {
        if (inputTerm !== activeSearchTerm) {
            setCurrentPage(1);
            setActiveSearchTerm(inputTerm);
        } else if (currentPage === 1) {
            loadData();
        }
    };

    const handleRowClickEvent = (item: T) => {
        onRowClick(item);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset a la primera página cuando cambia el tamaño
    };

    return (
        <div className="w-full font-sans px-2 md:px-0">
            <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-primary">
                {title}
            </h1>

            <div className="md:bg-white/80 md:backdrop-blur-xl md:rounded-2xl md:shadow-xl md:border md:border-neutral-200/50 overflow-hidden w-full">

                {/* Controles de Búsqueda y Creación - STICKY */}
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Búsqueda */}
                    <div className="flex w-full sm:w-auto space-x-2">
                        <div className="relative flex-1 sm:flex-initial">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="pl-3 pr-3 py-2 border-2 border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm hover:shadow-md transition-all w-full sm:w-64 bg-white/80 backdrop-blur-sm text-sm"
                                value={inputTerm}
                                onChange={(e) => setInputTerm(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                            />
                        </div>
                        <button
                            onClick={handleSearchSubmit}
                            className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Search"
                            disabled={loading}
                        >
                            <FaSearch className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Botón crear */}
                    <button
                        onClick={onCreateNew}
                        className="bg-gradient-to-r from-success to-green-600 hover:from-green-600 hover:to-success text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-success/50 disabled:opacity-50 w-full sm:w-auto text-sm"
                        disabled={loading}
                    >
                        <FaPlus className="inline-block mr-1.5" /> Crear Nuevo
                    </button>
                </div>

                {/* Contenedor de contenido con padding */}
                <div className="p-4 sm:p-5">
                    {/* Mensaje de Error */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 text-red-700 px-4 py-2.5 rounded-xl relative mb-4 shadow-md animate-fade-in">
                            <div className="flex items-center space-x-2">
                                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">!</span>
                                </div>
                                <p className="font-semibold text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loader y Contenido */}
                    {loading ? (
                    <div className="flex flex-col justify-center items-center h-48 space-y-3 animate-fade-in">
                        <CgSpinner className="animate-spin text-5xl text-primary drop-shadow-lg" />
                        <p className="text-lg text-primary font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Cargando...</p>
                    </div>
                ) : (
                    <>
                        {data.length === 0 && activeSearchTerm !== "" ? (
                            <div className="py-8 text-center animate-fade-in">
                                <div className="inline-block p-5 bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-lg border-2 border-yellow-200">
                                    <div className="text-4xl mb-2">🔍</div>
                                    <p className="text-lg font-bold text-neutral-700 mb-1">No se encontraron resultados</p>
                                    <p className="text-sm text-neutral-500">No hay datos que coincidan con: <span className="font-bold text-primary">"{activeSearchTerm}"</span></p>
                                    <p className="text-xs text-neutral-400 mt-1">Intenta con otro término de búsqueda</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Renderizado Condicional */}
                                <PaginatedTable data={data} columns={columns} onRowClick={handleRowClickEvent} />
                                <PaginatedCardList data={data} columns={columns} onRowClick={handleRowClickEvent} />
                            </>
                        )}
                    </>
                )}

                {/* Mensaje si no hay items después de cargar */}
                {!loading && totalItems === 0 && !error && activeSearchTerm === "" && (
                    <div className="py-10 text-center animate-fade-in">
                        <div className="inline-block p-6 bg-gradient-to-br from-neutral-50 to-white rounded-2xl shadow-lg border-2 border-neutral-200">
                            <div className="text-4xl mb-2">📋</div>
                            <p className="text-lg font-bold text-neutral-600 mb-1">No hay registros disponibles</p>
                            <p className="text-sm text-neutral-500">¡Comienza creando una nueva entrada!</p>
                        </div>
                    </div>
                )}
                </div>

                {/* Paginación - STICKY FOOTER */}
                {!loading && totalItems > 0 && (
                    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-xl border-t border-neutral-200/50 p-3 md:p-4 flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0 gap-3 w-full">
                        {/* Selector de tamaño de página */}
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-neutral-50 to-white px-3 py-1.5 rounded-lg border-2 border-neutral-300 shadow-sm order-1 lg:order-none">
                            <span className="text-xs font-semibold text-neutral-600 whitespace-nowrap">Mostrar:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="bg-white border-2 border-primary/30 rounded-lg px-2 py-1 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 hover:border-primary transition-all cursor-pointer"
                                disabled={loading}
                            >
                                {PAGE_SIZE_OPTIONS.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            <span className="text-xs font-semibold text-neutral-600">por página</span>
                        </div>

                        {/* Info de paginación */}
                        <p className="text-xs font-semibold text-neutral-700 text-center bg-gradient-to-r from-primary/10 to-purple-100 px-3 py-1.5 rounded-lg order-3 lg:order-none">
                            Mostrando <span className="text-primary font-bold">{data.length}</span> de <span className="text-primary font-bold">{totalItems}</span> | Página <span className="text-primary font-bold">{currentPage}</span> de <span className="text-primary font-bold">{totalPages}</span>
                        </p>

                        {/* Controles de paginación */}
                        <div className="flex space-x-2 order-2 lg:order-none">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 bg-gradient-to-r from-white to-neutral-50 border-2 border-primary/30 rounded-lg text-primary font-bold hover:from-primary hover:to-purple-600 hover:text-white hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-white disabled:hover:to-neutral-50 disabled:hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <FaAngleLeft className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-bold shadow-md flex items-center justify-center min-w-[50px] text-sm">
                                {currentPage}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 bg-gradient-to-r from-white to-neutral-50 border-2 border-primary/30 rounded-lg text-primary font-bold hover:from-primary hover:to-purple-600 hover:text-white hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-white disabled:hover:to-neutral-50 disabled:hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <FaAngleRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaginatedDataTable;
