import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { crearUsuarioApi, actualizarUsuarioApi } from '../api/UsersApi';
import type { CrearUsuarioData, Usuario } from '../types/user.types';
import { RoleSelect } from './RoleSelect';
import '../styles/CreateUserModal.css';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: Usuario; // Usuario a editar (opcional - si no hay, es modo crear)
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess, user }) => {
  const isEditMode = !!user; // Determinar si está en modo edición

  const [formData, setFormData] = useState<CrearUsuarioData>({
    nombre: '',
    correo: '',
    contrasena: '',
    estado: true,
    idRol: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset o pre-llenar form cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen && user) {
      // Modo edición: Pre-llenar con datos del usuario
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        contrasena: '', // Vacío por defecto en edición
        estado: user.estado === 'activo' || user.estado === '1' || user.estado === 1,
        idRol: user.idRol || '',
      });
    } else if (!isOpen) {
      // Reset cuando se cierra
      setFormData({ nombre: '', correo: '', contrasena: '', estado: true, idRol: '' });
      setErrors({});
      setShowSuccess(false);
      setApiError(null);
    }
  }, [isOpen, user]);

  // Validación en tiempo real
  const validateField = (name: string, value: string | boolean) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          error = 'El nombre debe tener al menos 3 caracteres';
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
      case 'contrasena':
        if (typeof value === 'string') {
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
        }
        break;
      case 'idRol':
        if (typeof value === 'string') {
          if (!value || value.trim() === '') {
            error = 'Debe seleccionar un rol';
          }
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Validar solo si el campo ya fue tocado
    if (errors[name] !== undefined) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleRoleChange = (roleId: string) => {
    setFormData(prev => ({ ...prev, idRol: roleId }));
    // Validar solo si el campo ya fue tocado
    if (errors.idRol !== undefined) {
      validateField('idRol', roleId);
    }
  };

  const handleRoleBlur = () => {
    validateField('idRol', formData.idRol);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Validar todos los campos
    const nombreValid = validateField('nombre', formData.nombre);
    const correoValid = validateField('correo', formData.correo);
    const contrasenaValid = validateField('contrasena', formData.contrasena);
    const rolValid = validateField('idRol', formData.idRol);

    if (!nombreValid || !correoValid || !contrasenaValid || !rolValid) {
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isEditMode && user) {
        // Modo edición: actualizar usuario
        const updateData: any = {
          nombre: formData.nombre,
          correo: formData.correo,
          estado: formData.estado ? 1 : 0, // Convertir boolean a número
          idRol: formData.idRol,
        };

        // Solo incluir contraseña si se proporcionó una nueva
        if (formData.contrasena && formData.contrasena.trim() !== '') {
          updateData.contrasena = formData.contrasena;
        }

        response = await actualizarUsuarioApi(user.id, updateData);
      } else {
        // Modo crear: crear nuevo usuario
        // Convertir estado de boolean a número para la API
        const createData = {
          ...formData,
          estado: formData.estado ? 1 : 0,
        };
        response = await crearUsuarioApi(createData as any);
      }

      if (response.success) {
        setShowSuccess(true);

        // Esperar un momento para mostrar el mensaje de éxito
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setApiError(response.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el usuario`);
      }
    } catch (error: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} usuario:`, error);
      setApiError(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el usuario. Por favor, intente nuevamente.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 create-user-modal-fade-in">
      {/* Overlay con blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col create-user-modal-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 px-4 py-3 flex items-center justify-between border-b-2 border-neutral-300 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-md border border-neutral-300">
              <FaUser className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-700">
              {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content scrollable */}
        <div className="overflow-y-auto flex-1">

        {/* Pantalla de éxito */}
        {showSuccess && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white rounded-2xl flex flex-col items-center justify-center z-20 create-user-modal-fade-in">
            <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full p-8 mb-6 animate-bounce shadow-xl">
              <FaCheckCircle className="w-20 h-20 text-neutral-700" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 mb-3">
              {isEditMode ? 'Usuario Actualizado' : 'Usuario Creado'}
            </h3>
            <p className="text-neutral-600 text-lg">
              {isEditMode ? 'El usuario se ha actualizado exitosamente' : 'El usuario se ha creado exitosamente'}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Error de API */}
          {apiError && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 create-user-modal-shake shadow-sm">
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{apiError}</p>
            </div>
          )}

          {/* Campo: Nombre */}
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-bold text-neutral-700">
              Nombre completo <span className="text-neutral-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-neutral-400 w-4 h-4" />
              </div>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-2 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.nombre
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200'
                } disabled:bg-neutral-50 disabled:cursor-not-allowed`}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            {errors.nombre && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <FaExclamationCircle className="w-3 h-3" />
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Campo: Correo */}
          <div className="space-y-2">
            <label htmlFor="correo" className="block text-sm font-bold text-neutral-700">
              Correo electrónico <span className="text-neutral-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-neutral-400 w-4 h-4" />
              </div>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-2 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.correo
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200'
                } disabled:bg-neutral-50 disabled:cursor-not-allowed`}
                placeholder="usuario@ejemplo.com"
              />
            </div>
            {errors.correo && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <FaExclamationCircle className="w-3 h-3" />
                {errors.correo}
              </p>
            )}
          </div>

          {/* Campo: Rol */}
          <RoleSelect
            value={formData.idRol}
            onChange={handleRoleChange}
            onBlur={handleRoleBlur}
            disabled={loading}
            error={errors.idRol}
            required
          />

          {/* Campo: Contraseña */}
          <div className="space-y-2">
            <label htmlFor="contrasena" className="block text-sm font-bold text-neutral-700">
              Contraseña {!isEditMode && <span className="text-neutral-400">*</span>}
              {isEditMode && <span className="text-neutral-500 text-xs font-normal">(opcional - dejar vacío para mantener la actual)</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-neutral-400 w-4 h-4" />
              </div>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-2 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  errors.contrasena
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200'
                } disabled:bg-neutral-50 disabled:cursor-not-allowed`}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {errors.contrasena && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <FaExclamationCircle className="w-3 h-3" />
                {errors.contrasena}
              </p>
            )}
          </div>

          {/* Campo: Estado */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <input
              type="checkbox"
              id="estado"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
              disabled={loading}
              className="w-5 h-5 text-neutral-700 border-neutral-300 rounded focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed"
            />
            <label htmlFor="estado" className="text-sm font-bold text-neutral-700 cursor-pointer">
              Usuario activo
            </label>
          </div>
        </form>
        </div>

        {/* Footer con botones fijos */}
        <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 px-4 py-3 border-t-2 border-neutral-300 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border-2 border-neutral-300 bg-white text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-5 h-5 animate-spin" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
