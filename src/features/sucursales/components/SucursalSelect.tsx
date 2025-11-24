import React, { useEffect, useState } from 'react';
import { FaBuilding, FaExclamationTriangle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { obtenerTodasSucursalesApi } from '../api/sucursalesApi';
import type { Sucursal } from '../types/sucursal.types';

interface SucursalSelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

export const SucursalSelect: React.FC<SucursalSelectProps> = ({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  label = 'Sucursal Principal',
  placeholder = 'Seleccionar sucursal principal',
}) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadSucursales();
  }, []);

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

  if (loading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
          {required && <span className="text-red-500 ml-1">*</span>}
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
      <label htmlFor="sucursal-select" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaBuilding className="w-4 h-4 text-neutral-400" />
        </div>
        <select
          id="sucursal-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-dark-bg border ${
            error
              ? 'border-red-500 dark:border-red-500 focus:ring-red-500/30 focus:border-red-500'
              : 'border-neutral-300 dark:border-dark-border focus:ring-cyan-500/30 focus:border-cyan-500'
          } rounded-lg focus:outline-none focus:ring-2 transition-all text-neutral-900 dark:text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed appearance-none`}
        >
          <option value="">{placeholder}</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.nombre}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <FaExclamationTriangle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};
