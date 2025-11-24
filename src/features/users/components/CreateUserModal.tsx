import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaSave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { crearUsuarioApi, actualizarUsuarioApi } from '../api/UsersApi';
import { RoleSelect } from './RoleSelect';
import { SucursalSelect, MultipleSucursalSelect } from '../../sucursales';
import type { Usuario } from '../types/user.types';
import '../styles/CreateUserModal.css';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: Usuario;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const isEditMode = !!user;

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    idRol: '',
    estado: true,
    idSucursalPrincipal: '',
    idSucursales: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        contrasena: '',
        idRol: user.idRol || '',
        estado: user.estado === 'activo' || user.estado === '1' || user.estado === 1,
        idSucursalPrincipal: user.idSucursalPrincipal || '',
        idSucursales: user.idSucursales || [],
      });
    } else if (isOpen && !user) {
      setFormData({
        nombre: '',
        correo: '',
        contrasena: '',
        idRol: '',
        estado: true,
        idSucursalPrincipal: '',
        idSucursales: [],
      });
    }
    setErrors({});
    setApiError(null);
    setShowSuccess(false);
  }, [isOpen, user]);

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre es requerido';
        } else if (value.trim().length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'correo':
        if (!value.trim()) {
          error = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'El correo no es válido';
        }
        break;
      case 'contrasena':
        // En modo edición, la contraseña es opcional
        if (isEditMode) {
          if (value && value.length < 6) {
            error = 'La contraseña debe tener al menos 6 caracteres';
          }
        } else {
          // En modo crear, la contraseña es obligatoria
          if (!value || value.length < 6) {
            error = 'La contraseña debe tener al menos 6 caracteres';
          }
        }
        break;
      case 'idRol':
        if (!value) {
          error = 'Debes seleccionar un rol';
        }
        break;
      case 'idSucursalPrincipal':
        if (!value) {
          error = 'Debes seleccionar una sucursal principal';
        }
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    setApiError(null);
  };

  const handleRoleChange = (roleId: string) => {
    setFormData(prev => ({ ...prev, idRol: roleId }));
    const error = validateField('idRol', roleId);
    setErrors(prev => ({ ...prev, idRol: error }));
    setApiError(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach(key => {
      // Skip estado field as it's a boolean and doesn't need validation
      if (key === 'estado') return;

      const error = validateField(key, formData[key as keyof typeof formData] as string);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      let response;

      if (isEditMode && user) {
        const updateData: any = {
          nombre: formData.nombre,
          correo: formData.correo,
          idRol: formData.idRol,
          estado: formData.estado ? 1 : 0,
          idSucursalPrincipal: formData.idSucursalPrincipal,
          idSucursales: formData.idSucursales && formData.idSucursales.length > 0 ? formData.idSucursales : undefined,
        };

        // Solo incluir contraseña si se proporcionó una nueva
        if (formData.contrasena) {
          updateData.contrasena = formData.contrasena;
        }

        response = await actualizarUsuarioApi(user.id, updateData);
      } else {
        response = await crearUsuarioApi({
          nombre: formData.nombre,
          correo: formData.correo,
          idRol: formData.idRol,
          contrasena: formData.contrasena,
          estado: formData.estado ? 1 : 0,
          idSucursalPrincipal: formData.idSucursalPrincipal,
          idSucursales: formData.idSucursales && formData.idSucursales.length > 0 ? formData.idSucursales : undefined,
        });
      }

      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setApiError(response.message || 'Error al guardar el usuario');
      }
    } catch (error: any) {
      console.error('Error al guardar usuario:', error);
      setApiError(error.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 create-user-modal-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-md border border-neutral-100 dark:border-dark-border max-w-md w-full max-h-[90vh] flex flex-col create-user-modal-slide-up">
        {/* Header */}
        <div className="bg-white dark:bg-dark-card px-4 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-dark-border rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md shadow-purple-500/30">
              <FaUser className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-500 dark:text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-xl p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content scrollable */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">
                    {isEditMode ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente'}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">Cerrando...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {apiError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                <FaExclamationCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900 dark:text-red-200">{apiError}</p>
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Nombre completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-600/50 dark:focus:ring-purple-600/30 focus:border-purple-600 dark:focus:border-purple-500 transition-all disabled:bg-neutral-100 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed ${
                  errors.nombre ? 'border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-900/50' : 'border-neutral-200 dark:border-dark-border'
                }`}
                placeholder="Ej: Juan Pérez"
              />
              {errors.nombre && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.nombre}</p>
              )}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Correo electrónico <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                disabled={loading || isEditMode}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-600/50 dark:focus:ring-purple-600/30 focus:border-purple-600 dark:focus:border-purple-500 transition-all disabled:bg-neutral-100 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed ${
                  errors.correo ? 'border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-900/50' : 'border-neutral-200 dark:border-dark-border'
                }`}
                placeholder="Ej: juan@empresa.com"
              />
              {errors.correo && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.correo}</p>
              )}
              {isEditMode && (
                <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  El correo no puede ser modificado
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Contraseña {!isEditMode && <span className="text-danger">*</span>}
                {isEditMode && <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal ml-1">(opcional - dejar vacío para mantener la actual)</span>}
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-purple-600/50 dark:focus:ring-purple-600/30 focus:border-purple-600 dark:focus:border-purple-500 transition-all disabled:bg-neutral-100 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed ${
                  errors.contrasena ? 'border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-900/50' : 'border-neutral-200 dark:border-dark-border'
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.contrasena && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.contrasena}</p>
              )}
            </div>

            {/* Rol */}
            <RoleSelect
              value={formData.idRol}
              onChange={handleRoleChange}
              disabled={loading}
              error={errors.idRol}
              required={true}
            />

            {/* Sucursal Principal */}
            <div>
              <SucursalSelect
                value={formData.idSucursalPrincipal}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, idSucursalPrincipal: value }));
                  const error = validateField('idSucursalPrincipal', value);
                  setErrors(prev => ({ ...prev, idSucursalPrincipal: error }));
                }}
                error={errors.idSucursalPrincipal}
                disabled={loading}
                required
                label="Sucursal Principal"
                placeholder="Seleccionar sucursal principal"
              />
            </div>

            {/* Sucursales Adicionales */}
            <div>
              <MultipleSucursalSelect
                value={formData.idSucursales}
                onChange={(value) => setFormData(prev => ({ ...prev, idSucursales: value }))}
                sucursalPrincipal={formData.idSucursalPrincipal}
                disabled={loading || !formData.idSucursalPrincipal}
                label="Sucursales Adicionales"
                helpText="Selecciona todas las sucursales donde el usuario puede trabajar. La sucursal principal se incluye automáticamente."
              />
              {!formData.idSucursalPrincipal && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                  <FaExclamationCircle className="w-3 h-3" />
                  Primero selecciona la sucursal principal
                </p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Estado
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, estado: true }))}
                  disabled={loading}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:cursor-not-allowed ${
                    formData.estado
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500 dark:border-green-600'
                      : 'bg-neutral-100 dark:bg-neutral-800/30 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-dark-border hover:bg-neutral-200 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  Activo
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, estado: false }))}
                  disabled={loading}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:cursor-not-allowed ${
                    !formData.estado
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-500 dark:border-red-600'
                      : 'bg-neutral-100 dark:bg-neutral-800/30 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-dark-border hover:bg-neutral-200 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  Inactivo
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer con botones fijos */}
        <div className="bg-white dark:bg-dark-card px-4 py-4 border-t border-neutral-100 dark:border-dark-border rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  {isEditMode ? 'Actualizar' : 'Crear Usuario'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
