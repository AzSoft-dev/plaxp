import React, { useEffect, useState } from 'react';
import { FaBuilding, FaExclamationTriangle, FaCheckSquare, FaSquare, FaInfoCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { obtenerTodasSucursalesApi } from '../api/sucursalesApi';
import type { Sucursal } from '../types/sucursal.types';

interface MultipleSucursalSelectProps {
  value: string[]; // Array de IDs de sucursales seleccionadas
  onChange: (value: string[]) => void;
  sucursalPrincipal: string; // ID de la sucursal principal
  error?: string;
  disabled?: boolean;
  label?: string;
  helpText?: string;
}

export const MultipleSucursalSelect: React.FC<MultipleSucursalSelectProps> = ({
  value,
  onChange,
  sucursalPrincipal,
  error,
  disabled = false,
  label = 'Sucursales Adicionales',
  helpText = 'Selecciona todas las sucursales donde el profesor puede trabajar. La sucursal principal se incluye automáticamente.',
}) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadSucursales();
  }, []);

  // Asegurar que la sucursal principal esté siempre incluida
  useEffect(() => {
    if (sucursalPrincipal && !value.includes(sucursalPrincipal)) {
      onChange([...value, sucursalPrincipal]);
    }
  }, [sucursalPrincipal, value, onChange]);

  const loadSucursales = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const response = await obtenerTodasSucursalesApi();
      if (response.success) {
        setSucursales(response.data);
      } else {
        setLoadError('Error al cargar las sucursales');
      }
    } catch (err: any) {
      console.error('Error al cargar sucursales:', err);
      setLoadError(err.message || 'Error al cargar las sucursales');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSucursal = (sucursalId: string) => {
    // No permitir deseleccionar la sucursal principal
    if (sucursalId === sucursalPrincipal) {
      return;
    }

    if (value.includes(sucursalId)) {
      onChange(value.filter(id => id !== sucursalId));
    } else {
      onChange([...value, sucursalId]);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
        <div className="w-full px-4 py-3 bg-neutral-50 dark:bg-dark-bg border border-neutral-300 dark:border-dark-border rounded-lg flex items-center justify-center gap-2">
          <CgSpinner className="w-4 h-4 animate-spin text-neutral-500" />
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Cargando sucursales...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
        <div className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg flex items-center gap-2">
          <FaExclamationTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-600 dark:text-red-400">{loadError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
        {label}
      </label>

      {helpText && (
        <div className="mb-3 flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5">
          <FaInfoCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
          <span>{helpText}</span>
        </div>
      )}

      <div className={`border ${
        error
          ? 'border-red-500 dark:border-red-500'
          : 'border-neutral-300 dark:border-dark-border'
      } rounded-lg bg-white dark:bg-dark-bg overflow-hidden`}>
        {sucursales.length === 0 ? (
          <div className="px-4 py-6 text-center text-neutral-500 dark:text-neutral-400 text-sm">
            No hay sucursales disponibles
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {sucursales.map((sucursal) => {
              const isSelected = value.includes(sucursal.id);
              const isPrincipal = sucursal.id === sucursalPrincipal;

              return (
                <div
                  key={sucursal.id}
                  onClick={() => !disabled && handleToggleSucursal(sucursal.id)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-neutral-100 dark:border-dark-border last:border-b-0 transition-all ${
                    disabled || isPrincipal
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-dark-hover'
                  } ${isSelected ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}
                >
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <FaCheckSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    ) : (
                      <FaSquare className="w-5 h-5 text-neutral-300 dark:text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <FaBuilding className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      isSelected
                        ? 'text-cyan-900 dark:text-cyan-100'
                        : 'text-neutral-900 dark:text-neutral-100'
                    }`}>
                      {sucursal.nombre}
                      {isPrincipal && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cyan-600 text-white">
                          Principal
                        </span>
                      )}
                    </p>
                    {sucursal.direccion && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                        {sucursal.direccion}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <FaExclamationTriangle className="w-3 h-3" />
          {error}
        </p>
      )}

      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        {value.length === 0 ? 'No hay sucursales seleccionadas' : `${value.length} sucursal${value.length > 1 ? 'es' : ''} seleccionada${value.length > 1 ? 's' : ''}`}
      </p>
    </div>
  );
};
