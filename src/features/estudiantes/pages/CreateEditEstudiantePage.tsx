import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaExclamationCircle, FaSave, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { crearEstudianteApi, actualizarEstudianteApi, obtenerEstudiantePorIdApi } from '../api/estudiantesApi';
import type { CrearEstudianteData, Estudiante } from '../types/estudiante.types';
import { CredentialsScreen } from '../components';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';

export const CreateEditEstudiantePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CrearEstudianteData>({
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingEstudiante, setLoadingEstudiante] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<Estudiante | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Guardando datos...');

  // Cargar estudiante si es modo edición
  useEffect(() => {
    if (isEditMode && id) {
      loadEstudianteData(id);
    }
  }, [isEditMode, id]);

  const loadEstudianteData = async (estudianteId: string) => {
    setLoadingEstudiante(true);
    try {
      const response = await obtenerEstudiantePorIdApi(estudianteId);
      const estudiante = response.data;

      setFormData({
        nombre: estudiante.nombre,
        primerApellido: estudiante.primerApellido,
        segundoApellido: estudiante.segundoApellido || '',
        correo: estudiante.correo,
        telefono: estudiante.telefono || '',
        fechaNacimiento: estudiante.fechaNacimiento || '',
        nombreUsuario: estudiante.nombreUsuario || '',
        contrasenaTemporal: estudiante.contrasenaTemporal || '',
        identificacion: estudiante.identificacion || '',
        direccion: estudiante.direccion || '',
      });
    } catch (error) {
      console.error('Error al cargar estudiante:', error);
      setApiError('Error al cargar la información del estudiante');
    } finally {
      setLoadingEstudiante(false);
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
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (errors[name] !== undefined) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const allValid = nombreValid && primerApellidoValid && correoValid && identificacionValid;

    if (!allValid) {
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isEditMode && id) {
        setLoadingMessage('Actualizando estudiante...');

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
        };

        response = await actualizarEstudianteApi(id, updateData);
      } else {
        setLoadingMessage('Creando estudiante...');

        const createData: CrearEstudianteData = {
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
        };

        response = await crearEstudianteApi(createData);
      }

      if (response.success) {
        if (isEditMode) {
          setShowSuccess(true);
          setTimeout(() => {
            navigate('/estudiantes');
          }, 2000);
        } else {
          // Para modo creación, ocultar loading y mostrar credenciales
          setLoading(false);
          setCreatedStudent(response.data);
          setShowCredentials(true);
        }
      } else {
        setApiError(response.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el estudiante`);
        setLoading(false);
      }
    } catch (error: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} estudiante:`, error);
      setApiError(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el estudiante. Por favor, intente nuevamente.`);
      setLoading(false);
    }
  };

  if (loadingEstudiante) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <CgSpinner className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Cargando información del estudiante...</p>
      </div>
    );
  }

  return (
    <>
      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={loading}
        message={loadingMessage}
        isSuccess={showSuccess}
        successMessage={isEditMode ? '¡Estudiante actualizado exitosamente!' : '¡Estudiante creado exitosamente!'}
      />

      <div className="w-full min-h-screen bg-gray-100 dark:bg-dark-bg">
        {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/estudiantes')}
          disabled={loading}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors disabled:opacity-50 font-medium"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver a Estudiantes</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-500/30">
            <FaGraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {isEditMode ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {isEditMode ? 'Modifica la información del estudiante' : 'Completa los datos para crear un nuevo estudiante'}
            </p>
          </div>
        </div>
      </div>

      {/* Success Message (Edit Mode) */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-200">Estudiante actualizado exitosamente</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">Redirigiendo...</p>
          </div>
        </div>
      )}

      {/* Credentials Screen (Create Mode) */}
      {showCredentials && createdStudent && <CredentialsScreen student={createdStudent} />}

      {/* Form (hidden when showing credentials) */}
      {!showCredentials && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {apiError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <FaExclamationCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900 dark:text-red-200">{apiError}</p>
            </div>
          )}

          {/* Datos Personales */}
          
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-6 shadow-md">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Datos Personales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
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
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed`}
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
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed`}
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
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-100 dark:focus:ring-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed"
                  placeholder="Ej: García"
                />
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
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-100 dark:focus:ring-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Identificación */}
              <div>
                <label htmlFor="identificacion" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Número de Identificación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="identificacion"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 ${
                    errors.identificacion
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50'
                      : 'border-neutral-300 dark:border-dark-border focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-100 dark:focus:ring-neutral-800'
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed`}
                  placeholder="Ej: 123456789"
                />
                {errors.identificacion && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.identificacion}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Datos de Contacto */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-6 shadow-md">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Datos de Contacto</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed`}
                  placeholder="estudiante@ejemplo.com"
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
                  } disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed`}
                  placeholder="88888888"
                />
                {errors.telefono && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.telefono}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-6 shadow-md">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Dirección</h2>

            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Dirección Completa
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-100 dark:focus:ring-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 disabled:bg-neutral-50 dark:disabled:bg-neutral-700/50 disabled:cursor-not-allowed"
                placeholder="Ej: San José, Barrio Amón, 100m norte del Parque Morazán"
              />
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-neutral-200 dark:border-dark-border">
            <button
              type="button"
              onClick={() => navigate('/estudiantes')}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors disabled:opacity-50 w-full sm:w-auto text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-500/30 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  {isEditMode ? 'Guardar Cambios' : 'Crear Estudiante'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
    </>
  );
};
