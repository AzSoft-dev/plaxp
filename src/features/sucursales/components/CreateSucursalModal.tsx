import React, { useState, useEffect } from 'react';
import { FaTimes, FaBuilding, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { crearSucursalApi, actualizarSucursalApi } from '../api/sucursalesApi';
import type { CrearSucursalData, Sucursal } from '../types/sucursal.types';
import '../styles/CreateSucursalModal.css';

interface CreateSucursalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sucursal?: Sucursal;
}

export const CreateSucursalModal: React.FC<CreateSucursalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  sucursal
}) => {
  const isEditMode = !!sucursal;

  const [formData, setFormData] = useState<CrearSucursalData>({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    estado: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && sucursal) {
      setFormData({
        nombre: sucursal.nombre,
        direccion: sucursal.direccion || '',
        telefono: sucursal.telefono,
        correo: sucursal.correo,
        estado: sucursal.estado,
      });
    } else if (!isOpen) {
      setFormData({
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        estado: 1,
      });
      setErrors({});
      setShowSuccess(false);
      setApiError(null);
    }
  }, [isOpen, sucursal]);

  const validateField = (name: string, value: string | number) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          error = 'El nombre es requerido';
        } else if (typeof value === 'string' && value.length > 120) {
          error = 'El nombre no debe exceder 120 caracteres';
        }
        break;
      case 'correo':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          error = 'El correo es requerido';
        } else if (typeof value === 'string') {
          if (value.length > 150) {
            error = 'El correo no debe exceder 150 caracteres';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Formato de correo inválido';
          }
        }
        break;
      case 'telefono':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          error = 'El teléfono es requerido';
        } else if (typeof value === 'string' && value.length > 20) {
          error = 'El teléfono no debe exceder 20 caracteres';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked ? 1 : 0 : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (errors[name] !== undefined) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const nombreValid = validateField('nombre', formData.nombre);
    const correoValid = validateField('correo', formData.correo);
    const telefonoValid = validateField('telefono', formData.telefono);

    if (!nombreValid || !correoValid || !telefonoValid) {
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isEditMode && sucursal) {
        response = await actualizarSucursalApi(sucursal.id, formData);
      } else {
        response = await crearSucursalApi(formData);
      }

      if (response.success) {
        setShowSuccess(true);

        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setApiError(`Error al ${isEditMode ? 'actualizar' : 'crear'} la sucursal`);
      }
    } catch (error: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} sucursal:`, error);
      setApiError(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la sucursal. Por favor, intente nuevamente.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 create-sucursal-modal-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative bg-white rounded-2xl shadow-md border border-neutral-100 max-w-3xl w-full max-h-[90vh] flex flex-col create-sucursal-modal-slide-up">
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-neutral-100 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/30">
              <FaBuilding className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              {isEditMode ? 'Editar Sucursal' : 'Crear Nueva Sucursal'}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-500 hover:text-danger hover:bg-danger/10 rounded-xl p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {showSuccess && (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white rounded-2xl flex flex-col items-center justify-center z-20 create-sucursal-modal-fade-in">
              <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full p-8 mb-6 animate-bounce shadow-xl">
                <FaCheckCircle className="w-20 h-20 text-neutral-700" />
              </div>
              <h3 className="text-3xl font-bold text-neutral-800 mb-3">
                {isEditMode ? 'Sucursal Actualizada' : 'Sucursal Creada'}
              </h3>
              <p className="text-neutral-600 text-lg">
                {isEditMode ? 'La sucursal se ha actualizado exitosamente' : 'La sucursal se ha creado exitosamente'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-3 space-y-2.5 overflow-y-auto flex-1">
            {apiError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 create-sucursal-modal-shake shadow-sm">
                <FaExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{apiError}</p>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="nombre" className="block text-sm font-bold text-neutral-700">
                Nombre <span className="text-neutral-400">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-3 py-2 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.nombre
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200'
                } disabled:bg-neutral-50 disabled:cursor-not-allowed`}
                placeholder="Ej: Sucursal Central"
              />
              {errors.nombre && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <FaExclamationCircle className="w-3 h-3" />
                  {errors.nombre}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="direccion" className="block text-sm font-bold text-neutral-700">
                Dirección
              </label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled={loading}
                rows={2}
                className="w-full px-3 py-2 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200 disabled:bg-neutral-50 disabled:cursor-not-allowed resize-none"
                placeholder="Ej: Av. Principal 123"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="telefono" className="block text-sm font-bold text-neutral-700">
                  Teléfono <span className="text-neutral-400">*</span>
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full px-3 py-2 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    errors.telefono
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200'
                  } disabled:bg-neutral-50 disabled:cursor-not-allowed`}
                  placeholder="Ej: +51987654321"
                />
                {errors.telefono && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.telefono}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="correo" className="block text-sm font-bold text-neutral-700">
                  Correo Electrónico <span className="text-neutral-400">*</span>
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full px-3 py-2 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    errors.correo
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200'
                  } disabled:bg-neutral-50 disabled:cursor-not-allowed`}
                  placeholder="Ej: central@empresa.com"
                />
                {errors.correo && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.correo}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700">
                Estado
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => !loading && setFormData(prev => ({ ...prev, estado: 1 }))}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                    formData.estado === 1
                      ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-400 shadow-md'
                      : 'bg-white border-neutral-200 hover:border-green-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaCheckCircle className={`w-4 h-4 ${formData.estado === 1 ? 'text-green-600' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-semibold ${formData.estado === 1 ? 'text-green-700' : 'text-neutral-600'}`}>
                    Activo
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => !loading && setFormData(prev => ({ ...prev, estado: 0 }))}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                    formData.estado === 0
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-400 shadow-md'
                      : 'bg-white border-neutral-200 hover:border-red-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaTimesCircle className={`w-4 h-4 ${formData.estado === 0 ? 'text-red-600' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-semibold ${formData.estado === 0 ? 'text-red-700' : 'text-neutral-600'}`}>
                    Inactivo
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white px-4 py-4 border-t border-neutral-100 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-neutral-200 bg-white text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-5 h-5 animate-spin" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditMode ? 'Actualizar Sucursal' : 'Crear Sucursal'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
