import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaExclamationCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { getRoles, type Rol } from '../../roles';

interface RoleSelectProps {
  value: string;
  onChange: (roleId: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

/**
 * Componente para seleccionar un rol
 * Carga automáticamente los roles disponibles desde la API
 */
export const RoleSelect: React.FC<RoleSelectProps> = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  error = '',
  required = false,
}) => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const response = await getRoles();

        if (response.success) {
          setRoles(response.data);
        } else {
          setLoadError(response.message || 'Error al cargar los roles');
        }
      } catch (err: any) {
        console.error('Error al cargar roles:', err);
        setLoadError(err.message || 'Error al cargar los roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="idRol" className="block text-sm font-bold text-neutral-700">
        Rol {required && <span className="text-neutral-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <CgSpinner className="text-neutral-400 w-4 h-4 animate-spin" />
          ) : (
            <FaShieldAlt className="text-neutral-400 w-4 h-4" />
          )}
        </div>
        <select
          id="idRol"
          name="idRol"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled || loading || !!loadError}
          className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all appearance-none ${
            error
              ? 'border-neutral-400 focus:border-neutral-600 focus:ring-neutral-200'
              : 'border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200'
          } disabled:bg-neutral-100 disabled:cursor-not-allowed`}
        >
          <option value="">
            {loading ? 'Cargando roles...' : loadError ? 'Error al cargar' : 'Seleccione un rol'}
          </option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Mostrar error de validación o de carga */}
      {(error || loadError) && (
        <p className="text-xs text-neutral-600 font-medium flex items-center gap-1">
          <FaExclamationCircle className="w-3 h-3" />
          {error || loadError}
        </p>
      )}
    </div>
  );
};
