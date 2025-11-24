import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaExclamationCircle, FaSave, FaChalkboardTeacher, FaCheckCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { crearProfesorApi, actualizarProfesorApi, obtenerProfesorPorIdApi } from '../api/profesoresApi';
import type { CrearProfesorData, Profesor } from '../types/profesor.types';
import { CredentialsScreen } from '../components/CredentialsScreen';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';
import { SucursalSelect, MultipleSucursalSelect } from '../../sucursales';

export const CreateEditProfesorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CrearProfesorData>({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    nombreUsuario: '',
    contrasenaTemporal: '',
    identificacion: '',
    direccion: '',
    idSucursalPrincipal: '',
    idSucursales: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingProfesor, setLoadingProfesor] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdTeacher, setCreatedTeacher] = useState<Profesor | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Guardando datos...');

  // Cargar profesor si es modo edición
  useEffect(() => {
    if (isEditMode && id) {
      loadProfesorData(id);
    }
  }, [isEditMode, id]);

  const loadProfesorData = async (profesorId: string) => {
    setLoadingProfesor(true);
    try {
      const response = await obtenerProfesorPorIdApi(profesorId);
      const profesor = response.data;

      setFormData({
        nombre: profesor.nombre,
        primerApellido: profesor.primerApellido,
        segundoApellido: profesor.segundoApellido || '',
        correo: profesor.correo,
        telefono: profesor.telefono || '',
        fechaNacimiento: profesor.fechaNacimiento || '',
        nombreUsuario: profesor.nombreUsuario || '',
        contrasenaTemporal: profesor.contrasenaTemporal || '',
        identificacion: profesor.identificacion || '',
        direccion: profesor.direccion || '',
        idSucursalPrincipal: profesor.idSucursalPrincipal || '',
        idSucursales: profesor.idSucursales || [],
      });
    } catch (error) {
      console.error('Error al cargar profesor:', error);
      setApiError('Error al cargar la información del profesor');
    } finally {
      setLoadingProfesor(false);
    }
  };

  // Validación en tiempo real
  const validateField = (name: string, value: string | boolean) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value || (typeof value === 'string' && value.trim().length < 2)) {
          error = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
      case 'primerApellido':
        if (!value || (typeof value === 'string' && value.trim().length < 2)) {
          error = 'El primer apellido debe tener al menos 2 caracteres';
        }
        break;
      case 'correo':
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value || !emailRegex.test(value)) {
            error = 'Ingrese un correo electrónico válido';
          }
        }
        break;
      case 'telefono':
        if (typeof value === 'string' && value && value.length < 8) {
          error = 'El teléfono debe tener al menos 8 dígitos';
        }
        break;
      case 'identificacion':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          error = 'La identificación es obligatoria';
        }
        break;
      case 'idSucursalPrincipal':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          error = 'Debe seleccionar una sucursal principal';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      validateField(name, value);
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
    const primerApellidoValid = validateField('primerApellido', formData.primerApellido);
    const correoValid = validateField('correo', formData.correo);
    const identificacionValid = validateField('identificacion', formData.identificacion);
    const sucursalPrincipalValid = validateField('idSucursalPrincipal', formData.idSucursalPrincipal);

    const allValid = nombreValid && primerApellidoValid && correoValid && identificacionValid && sucursalPrincipalValid;

    if (!allValid) {
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isEditMode && id) {
        setLoadingMessage('Actualizando profesor...');

        const updateData: any = {
          nombre: formData.nombre,
          primerApellido: formData.primerApellido,
          segundoApellido: formData.segundoApellido || undefined,
          correo: formData.correo,
          telefono: formData.telefono || undefined,
          fechaNacimiento: formData.fechaNacimiento || undefined,
          nombreUsuario: formData.nombreUsuario || undefined,
          identificacion: formData.identificacion,
          direccion: formData.direccion || undefined,
          idSucursalPrincipal: formData.idSucursalPrincipal,
          idSucursales: formData.idSucursales && formData.idSucursales.length > 0 ? formData.idSucursales : undefined,
        };

        response = await actualizarProfesorApi(id, updateData);
      } else {
        setLoadingMessage('Creando profesor y sincronizando con Moodle...');

        const createData: CrearProfesorData = {
          nombre: formData.nombre,
          primerApellido: formData.primerApellido,
          segundoApellido: formData.segundoApellido || undefined,
          correo: formData.correo,
          telefono: formData.telefono || undefined,
          fechaNacimiento: formData.fechaNacimiento || undefined,
          nombreUsuario: formData.nombreUsuario || undefined,
          contrasenaTemporal: formData.contrasenaTemporal || undefined,
          identificacion: formData.identificacion,
          direccion: formData.direccion || undefined,
          idSucursalPrincipal: formData.idSucursalPrincipal,
          idSucursales: formData.idSucursales && formData.idSucursales.length > 0 ? formData.idSucursales : undefined,
        };

        response = await crearProfesorApi(createData);
      }

      if (response.success) {
        if (isEditMode) {
          setShowSuccess(true);
          setTimeout(() => {
            navigate('/profesores');
          }, 2000);
        } else {
          // Para modo creación, ocultar loading y mostrar credenciales
          setLoading(false);
          setCreatedTeacher(response.data);
          setShowCredentials(true);
        }
      } else {
        setApiError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el profesor`);
        setLoading(false);
      }
    } catch (error: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} profesor:`, error);
      setApiError(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el profesor. Por favor, intente nuevamente.`);
      setLoading(false);
    }
  };

  if (loadingProfesor) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <CgSpinner className="w-12 h-12 text-cyan-600 dark:text-cyan-400 animate-spin mb-3" />
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Cargando información del profesor...</p>
      </div>
    );
  }

  // Mostrar pantalla de credenciales después de crear
  if (showCredentials && createdTeacher) {
    return <CredentialsScreen profesor={createdTeacher} />;
  }

  return (
    <>
      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={loading}
        message={loadingMessage}
        isSuccess={showSuccess}
        successMessage={isEditMode ? '¡Profesor actualizado exitosamente!' : '¡Profesor creado exitosamente!'}
      />

      <div className="w-full min-h-screen bg-gray-100 dark:bg-dark-bg">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/profesores')}
            disabled={loading}
            className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 mb-4 transition-colors disabled:opacity-50 font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a Gestión de Profesores</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-md shadow-cyan-500/30">
              <FaChalkboardTeacher className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {isEditMode ? 'Editar Profesor' : 'Crear Nuevo Profesor'}
              </h1>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {isEditMode ? 'Modifica la información del profesor' : 'Completa los datos para registrar un nuevo profesor en Moodle'}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && !isEditMode && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
            <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                {isEditMode ? 'Profesor actualizado exitosamente' : 'Profesor creado exitosamente'}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">Redirigiendo...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <FaExclamationCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 dark:text-red-200">{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información Personal */}
          <div className="bg-white dark:bg-dark-card rounded-lg border border-neutral-200 dark:border-dark-border p-4 md:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Información Personal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
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
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50`}
                  placeholder="Ej: Juan"
                />
                {errors.nombre && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Primer Apellido */}
              <div>
                <label htmlFor="primerApellido" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Primer Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="primerApellido"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 ${
                    errors.primerApellido
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50'
                      : 'border-neutral-300 dark:border-dark-border focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-100 dark:focus:ring-neutral-800'
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50`}
                  placeholder="Ej: Pérez"
                />
                {errors.primerApellido && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.primerApellido}
                  </p>
                )}
              </div>

              {/* Segundo Apellido */}
              <div>
                <label htmlFor="segundoApellido" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  id="segundoApellido"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-100 dark:focus:ring-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50"
                  placeholder="Ej: González"
                />
              </div>

              {/* Identificación */}
              <div>
                <label htmlFor="identificacion" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Identificación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="identificacion"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading || isEditMode}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 ${
                    errors.identificacion
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50'
                      : 'border-neutral-300 dark:border-dark-border focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-100 dark:focus:ring-neutral-800'
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50`}
                  placeholder="Ej: 123456789"
                />
                {errors.identificacion && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.identificacion}
                  </p>
                )}
                {!isEditMode && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Se usa para generar el usuario de Moodle automáticamente</p>
                )}
                {isEditMode && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">La identificación no puede ser modificada</p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-100 dark:focus:ring-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50"
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white dark:bg-dark-card rounded-lg border border-neutral-200 dark:border-dark-border p-4 md:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Información de Contacto</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Correo */}
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
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50`}
                  placeholder="profesor@ejemplo.com"
                />
                {errors.correo && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.correo}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
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
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50`}
                  placeholder="88888888"
                />
                {errors.telefono && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.telefono}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
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
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-100 dark:focus:ring-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 resize-none"
                  placeholder="Dirección completa..."
                />
              </div>
            </div>
          </div>

          {/* Asignación de Sucursales */}
          <div className="bg-white dark:bg-dark-card rounded-lg border border-neutral-200 dark:border-dark-border p-4 md:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Asignación de Sucursales</h2>

            <div className="space-y-4">
              {/* Sucursal Principal */}
              <div>
                <SucursalSelect
                  value={formData.idSucursalPrincipal}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, idSucursalPrincipal: value }));
                    if (errors.idSucursalPrincipal) {
                      validateField('idSucursalPrincipal', value);
                    }
                  }}
                  onBlur={() => validateField('idSucursalPrincipal', formData.idSucursalPrincipal)}
                  error={errors.idSucursalPrincipal}
                  disabled={loading}
                  required
                  label="Sucursal Principal"
                  placeholder="Seleccionar sucursal principal"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                  Esta será la sucursal por defecto del profesor
                </p>
              </div>

              {/* Sucursales Adicionales */}
              <div>
                <MultipleSucursalSelect
                  value={formData.idSucursales || []}
                  onChange={(value) => setFormData(prev => ({ ...prev, idSucursales: value }))}
                  sucursalPrincipal={formData.idSucursalPrincipal}
                  disabled={loading || !formData.idSucursalPrincipal}
                  label="Sucursales Adicionales"
                  helpText="Selecciona todas las sucursales donde el profesor puede trabajar. La sucursal principal se incluye automáticamente."
                />
                {!formData.idSucursalPrincipal && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    Primero selecciona la sucursal principal
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-neutral-200 dark:border-dark-border">
            <button
              type="button"
              onClick={() => navigate('/profesores')}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors disabled:opacity-50 w-full sm:w-auto text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  {isEditMode ? 'Guardar Cambios' : 'Crear Profesor'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
