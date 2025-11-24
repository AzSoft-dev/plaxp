import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaBuilding, FaCheckCircle, FaExclamationCircle, FaSave, FaTimesCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { crearSucursalApi, actualizarSucursalApi, obtenerSucursalPorIdApi } from '../api/sucursalesApi';
import type { CrearSucursalData } from '../types/sucursal.types';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';

export const CreateEditSucursalPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CrearSucursalData>({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    estado: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingSucursal, setLoadingSucursal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Guardando datos...');

  useEffect(() => {
    if (isEditMode && id) {
      loadSucursalData(id);
    }
  }, [isEditMode, id]);

  const loadSucursalData = async (sucursalId: string) => {
    setLoadingSucursal(true);
    try {
      const response = await obtenerSucursalPorIdApi(sucursalId);
      const sucursal = response.data;

      setFormData({
        nombre: sucursal.nombre,
        direccion: sucursal.direccion || '',
        telefono: sucursal.telefono || '',
        correo: sucursal.correo || '',
        estado: sucursal.estado,
      });
    } catch (error) {
      console.error('Error al cargar sucursal:', error);
      setApiError('Error al cargar la información de la sucursal');
    } finally {
      setLoadingSucursal(false);
    }
  };

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
    setLoadingMessage(isEditMode ? 'Actualizando sucursal...' : 'Creando sucursal...');

    try {
      let response;

      if (isEditMode && id) {
        response = await actualizarSucursalApi(id, formData);
      } else {
        response = await crearSucursalApi(formData);
      }

      if (response.success) {
        setShowSuccess(true);

        setTimeout(() => {
          navigate('/sucursales');
        }, 2000);
      } else {
        setApiError(`Error al ${isEditMode ? 'actualizar' : 'crear'} la sucursal`);
        setLoading(false);
      }
    } catch (error: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} sucursal:`, error);
      setApiError(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la sucursal. Por favor, intente nuevamente.`);
      setLoading(false);
    }
  };

  if (loadingSucursal) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <CgSpinner className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-3" />
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Cargando información de la sucursal...</p>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay
        isVisible={loading}
        message={loadingMessage}
        isSuccess={showSuccess}
        successMessage={isEditMode ? '¡Sucursal actualizada exitosamente!' : '¡Sucursal creada exitosamente!'}
      />

      <div className="w-full min-h-screen bg-gray-100 dark:bg-dark-bg">
        <div className="mb-4">
          <button
            onClick={() => navigate('/sucursales')}
            disabled={loading}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors disabled:opacity-50 font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a Sucursales</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/30">
              <FaBuilding className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {isEditMode ? 'Editar Sucursal' : 'Crear Nueva Sucursal'}
              </h1>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {isEditMode ? 'Modifica la información de la sucursal' : 'Completa los datos para crear una nueva sucursal en el sistema'}
              </p>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                {isEditMode ? 'Sucursal actualizada exitosamente' : 'Sucursal creada exitosamente'}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">Redirigiendo...</p>
            </div>
          </div>
        )}

        {apiError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <FaExclamationCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 dark:text-red-200">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-6 shadow-md">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Información Básica</h2>

            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 ${
                  errors.nombre
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50'
                    : 'border-neutral-300 dark:border-dark-border focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-100 dark:focus:ring-neutral-800'
                } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed`}
                placeholder="Ej: Sucursal Central"
              />
              {errors.nombre && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                  <FaExclamationCircle className="w-3 h-3" />
                  {errors.nombre}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="direccion" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Dirección
              </label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled={loading}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all resize-none bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-dark-border focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-100 dark:focus:ring-neutral-800 disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed"
                placeholder="Ej: Av. Principal 123"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 mt-5">
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 ${
                    errors.telefono
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50'
                      : 'border-neutral-300 dark:border-dark-border focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-100 dark:focus:ring-neutral-800'
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed`}
                  placeholder="Ej: +51987654321"
                />
                {errors.telefono && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.telefono}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 ${
                    errors.correo
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50'
                      : 'border-neutral-300 dark:border-dark-border focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-100 dark:focus:ring-neutral-800'
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed`}
                  placeholder="Ej: central@empresa.com"
                />
                {errors.correo && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.correo}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2.5">
                Estado
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => !loading && setFormData(prev => ({ ...prev, estado: 1 }))}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.estado === 1
                      ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border-green-400 dark:border-green-600 shadow-md'
                      : 'bg-white dark:bg-dark-bg border-neutral-300 dark:border-dark-border hover:border-green-300 dark:hover:border-green-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaCheckCircle className={`w-4 h-4 ${formData.estado === 1 ? 'text-green-600 dark:text-green-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                  <span className={`text-sm font-semibold ${formData.estado === 1 ? 'text-green-700 dark:text-green-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    Activo
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => !loading && setFormData(prev => ({ ...prev, estado: 0 }))}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.estado === 0
                      ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-red-400 dark:border-red-600 shadow-md'
                      : 'bg-white dark:bg-dark-bg border-neutral-300 dark:border-dark-border hover:border-red-300 dark:hover:border-red-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaTimesCircle className={`w-4 h-4 ${formData.estado === 0 ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                  <span className={`text-sm font-semibold ${formData.estado === 0 ? 'text-red-700 dark:text-red-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    Inactivo
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-neutral-200 dark:border-dark-border">
            <button
              type="button"
              onClick={() => navigate('/sucursales')}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors disabled:opacity-50 w-full sm:w-auto text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  {isEditMode ? 'Guardar Cambios' : 'Crear Sucursal'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
