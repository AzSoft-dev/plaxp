import React, { useState, useEffect } from 'react';
import { FaTimes, FaShieldAlt, FaCheckCircle, FaExclamationCircle, FaFilter, FaListUl } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { crearRolApi, actualizarRolApi, asignarPermisosApi, obtenerRolConPermisosApi } from '../api/rolesApi';
import { obtenerPermisosEmpresaApi } from '../../permisos';
import type { CrearRolData, Rol } from '../types/role.types';
import type { Permiso } from '../../permisos';
import '../styles/CreateRolModal.css';

interface CreateRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rol?: Rol; // Rol a editar (opcional - si no hay, es modo crear)
}

export const CreateRolModal: React.FC<CreateRolModalProps> = ({ isOpen, onClose, onSuccess, rol }) => {
  const isEditMode = !!rol; // Determinar si está en modo edición

  const [formData, setFormData] = useState<CrearRolData>({
    nombre: '',
    descripcion: '',
    esSuperadmin: false,
    estado: true,
  });

  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [selectedPermisos, setSelectedPermisos] = useState<string[]>([]);
  const [loadingPermisos, setLoadingPermisos] = useState(false);
  const [selectedModuloFilter, setSelectedModuloFilter] = useState<string>('todos');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset o pre-llenar form cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen && rol) {
      // Modo edición: Pre-llenar con datos del rol
      setFormData({
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        esSuperadmin: rol.esSuperadmin,
        estado: rol.estado,
      });
      // Cargar permisos asignados al rol
      loadRolPermisos(rol.id);
    } else if (!isOpen) {
      // Reset cuando se cierra
      setFormData({ nombre: '', descripcion: '', esSuperadmin: false, estado: true });
      setSelectedPermisos([]);
      setSelectedModuloFilter('todos');
      setErrors({});
      setShowSuccess(false);
      setApiError(null);
    }
  }, [isOpen, rol]);

  // Función para cargar permisos del rol
  const loadRolPermisos = async (rolId: string) => {
    try {
      const response = await obtenerRolConPermisosApi(rolId);
      if (response.data.permisos && response.data.permisos.length > 0) {
        const permisosIds = response.data.permisos.map(p => p.id);
        setSelectedPermisos(permisosIds);
      }
    } catch (error) {
      console.error('Error al cargar permisos del rol:', error);
    }
  };

  // Cargar permisos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchPermisos();
    }
  }, [isOpen]);

  const fetchPermisos = async () => {
    setLoadingPermisos(true);
    try {
      const response = await obtenerPermisosEmpresaApi();
      if (response.success) {
        setPermisos(response.data.filter(p => p.habilitado));
      }
    } catch (error) {
      console.error('Error al cargar permisos:', error);
    } finally {
      setLoadingPermisos(false);
    }
  };

  // Agrupar permisos por módulo
  const permisosPorModulo = permisos.reduce((acc, permiso) => {
    if (!acc[permiso.modulo]) {
      acc[permiso.modulo] = [];
    }
    acc[permiso.modulo].push(permiso);
    return acc;
  }, {} as Record<string, Permiso[]>);

  // Obtener lista de módulos únicos
  const modulos = Object.keys(permisosPorModulo);

  // Filtrar permisos según el módulo seleccionado
  const permisosFiltrados = selectedModuloFilter === 'todos'
    ? permisosPorModulo
    : { [selectedModuloFilter]: permisosPorModulo[selectedModuloFilter] };

  // Contar permisos seleccionados
  const totalPermisosSeleccionados = selectedPermisos.length;
  const totalPermisos = permisos.length;

  // Validación en tiempo real
  const validateField = (name: string, value: string | boolean) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'descripcion':
        if (!value || (typeof value === 'string' && value.trim().length < 10)) {
          error = 'La descripción debe tener al menos 10 caracteres';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    console.log(`🔄 Campo cambiado (modal): ${name} = ${fieldValue} (tipo: ${type})`);
    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Validar solo si el campo ya fue tocado
    if (errors[name] !== undefined) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handlePermisoToggle = (permisoId: string) => {
    setSelectedPermisos(prev =>
      prev.includes(permisoId)
        ? prev.filter(id => id !== permisoId)
        : [...prev, permisoId]
    );
  };

  const handleModuloToggle = (modulo: string) => {
    const permisosDelModulo = permisosPorModulo[modulo].map(p => p.id);
    const todosSeleccionados = permisosDelModulo.every(id => selectedPermisos.includes(id));

    if (todosSeleccionados) {
      // Deseleccionar todos del módulo
      setSelectedPermisos(prev => prev.filter(id => !permisosDelModulo.includes(id)));
    } else {
      // Seleccionar todos del módulo
      setSelectedPermisos(prev => [...new Set([...prev, ...permisosDelModulo])]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Validar todos los campos
    const nombreValid = validateField('nombre', formData.nombre);
    const descripcionValid = validateField('descripcion', formData.descripcion);

    if (!nombreValid || !descripcionValid) {
      return;
    }

    setLoading(true);

    try {
      let response;
      let rolId: string;

      console.log('📤 Enviando datos del rol (modal):', formData);

      if (isEditMode && rol) {
        // Modo edición: actualizar rol
        response = await actualizarRolApi(rol.id, formData);
        rolId = rol.id;
      } else {
        // Modo crear: crear nuevo rol
        response = await crearRolApi(formData);
        rolId = response.data.id;
      }

      if (response.success) {
        // Asignar permisos si hay seleccionados
        if (selectedPermisos.length > 0) {
          await asignarPermisosApi(rolId, { permisoIds: selectedPermisos });
        }

        setShowSuccess(true);

        // Esperar un momento para mostrar el mensaje de éxito
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setApiError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el rol`);
      }
    } catch (error: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} rol:`, error);
      setApiError(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el rol. Por favor, intente nuevamente.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 create-rol-modal-fade-in">
      {/* Overlay con blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-md border border-neutral-100 max-w-4xl w-full max-h-[90vh] flex flex-col create-rol-modal-slide-up">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-neutral-100 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-md shadow-teal-500/30">
              <FaShieldAlt className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              {isEditMode ? 'Editar Rol' : 'Crear Nuevo Rol'}
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

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">

        {/* Pantalla de éxito */}
        {showSuccess && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white rounded-2xl flex flex-col items-center justify-center z-20 create-rol-modal-fade-in">
            <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full p-8 mb-6 animate-bounce shadow-xl">
              <FaCheckCircle className="w-20 h-20 text-neutral-700" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 mb-3">
              {isEditMode ? 'Rol Actualizado' : 'Rol Creado'}
            </h3>
            <p className="text-neutral-600 text-lg">
              {isEditMode ? 'El rol se ha actualizado exitosamente' : 'El rol se ha creado exitosamente'}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 space-y-2.5 overflow-y-auto flex-1">
          {/* Error de API */}
          {apiError && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 create-rol-modal-shake shadow-sm">
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{apiError}</p>
            </div>
          )}

          {/* Grid de 2 columnas para campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Campo: Nombre */}
            <div className="space-y-1">
              <label htmlFor="nombre" className="block text-sm font-bold text-neutral-700">
                Nombre del Rol <span className="text-neutral-400">*</span>
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
                placeholder="Ej: Administrador"
              />
              {errors.nombre && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <FaExclamationCircle className="w-3 h-3" />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Campo: Superadmin y Estado */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-neutral-700 mb-1">
                Configuración
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <input
                    type="checkbox"
                    id="esSuperadmin"
                    name="esSuperadmin"
                    checked={formData.esSuperadmin}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-5 h-5 accent-teal-600 border-neutral-300 rounded focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="esSuperadmin" className="text-sm font-bold text-neutral-700 cursor-pointer">
                    Superadministrador
                  </label>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <input
                    type="checkbox"
                    id="estado"
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-5 h-5 accent-green-600 border-neutral-300 rounded focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="estado" className="text-sm font-bold text-neutral-700 cursor-pointer">
                    Activo
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Campo: Descripción - full width */}
          <div className="space-y-1">
            <label htmlFor="descripcion" className="block text-sm font-bold text-neutral-700">
              Descripción <span className="text-neutral-400">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              rows={2}
              className={`w-full px-3 py-2 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.descripcion
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200'
              } disabled:bg-neutral-50 disabled:cursor-not-allowed resize-none`}
              placeholder="Describe las responsabilidades de este rol..."
            />
            {errors.descripcion && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <FaExclamationCircle className="w-3 h-3" />
                {errors.descripcion}
              </p>
            )}
          </div>

          {/* Selector de Permisos */}
          {!formData.esSuperadmin && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-neutral-700">
                  Permisos Asignados
                </label>
                {!loadingPermisos && totalPermisos > 0 && (
                  <div className="bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-neutral-300">
                    {totalPermisosSeleccionados} / {totalPermisos} seleccionados
                  </div>
                )}
              </div>

              {loadingPermisos ? (
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border-2 border-neutral-200 shadow-sm">
                  <CgSpinner className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  {/* Filtro por módulo */}
                  {modulos.length > 0 && (
                    <div className="bg-white p-3 rounded-xl border-2 border-neutral-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <FaFilter className="text-neutral-500" />
                        <label htmlFor="moduloFilter" className="text-sm font-bold text-neutral-700">
                          Filtrar por módulo:
                        </label>
                        <select
                          id="moduloFilter"
                          value={selectedModuloFilter}
                          onChange={(e) => setSelectedModuloFilter(e.target.value)}
                          className="flex-1 px-3 py-2 bg-neutral-50 border-2 border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 text-sm font-medium text-neutral-700 transition-all"
                        >
                          <option value="todos">Todos los módulos ({modulos.length})</option>
                          {modulos.map(modulo => {
                            const permisosEnModulo = permisosPorModulo[modulo].length;
                            const seleccionadosEnModulo = permisosPorModulo[modulo].filter(p => selectedPermisos.includes(p.id)).length;
                            return (
                              <option key={modulo} value={modulo}>
                                {modulo} ({seleccionadosEnModulo}/{permisosEnModulo})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Lista de permisos */}
                  <div className="bg-white border-2 border-neutral-200 rounded-xl p-3 space-y-3 shadow-sm">
                    {Object.keys(permisosFiltrados).length === 0 ? (
                      <p className="text-neutral-500 text-center py-8 text-sm">No hay permisos disponibles</p>
                    ) : (
                      Object.entries(permisosFiltrados).map(([modulo, permisosDelModulo]) => {
                        const todosSeleccionados = permisosDelModulo.every(p => selectedPermisos.includes(p.id));
                        const algunoSeleccionado = permisosDelModulo.some(p => selectedPermisos.includes(p.id));
                        const countSeleccionados = permisosDelModulo.filter(p => selectedPermisos.includes(p.id)).length;

                        return (
                          <div key={modulo} className="space-y-2">
                            <div className="flex items-center gap-3 bg-gradient-to-r from-neutral-100 to-neutral-50 p-2.5 rounded-lg shadow-sm border border-neutral-200">
                              <input
                                type="checkbox"
                                checked={todosSeleccionados}
                                ref={(input) => {
                                  if (input) input.indeterminate = algunoSeleccionado && !todosSeleccionados;
                                }}
                                onChange={() => handleModuloToggle(modulo)}
                                className="w-5 h-5 accent-teal-600 border-neutral-300 rounded focus:ring-2 focus:ring-teal-200"
                              />
                              <FaListUl className="text-neutral-600" />
                              <span className="font-bold text-neutral-800 text-sm flex-1">{modulo}</span>
                              <span className="text-xs font-bold text-neutral-600 bg-neutral-200 px-2 py-1 rounded-full">
                                {countSeleccionados}/{permisosDelModulo.length}
                              </span>
                            </div>
                            <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
                              {permisosDelModulo.map(permiso => (
                                <div key={permiso.id} className="flex items-center gap-3 p-1 rounded-lg hover:bg-neutral-50 transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={selectedPermisos.includes(permiso.id)}
                                    onChange={() => handlePermisoToggle(permiso.id)}
                                    className="w-4 h-4 accent-teal-600 border-neutral-300 rounded focus:ring-2 focus:ring-teal-200"
                                  />
                                  <label className="text-sm text-neutral-700 cursor-pointer flex-1">
                                    {permiso.descripcion || permiso.codigo}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </form>
        </div>

        {/* Footer con botones fijos */}
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
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-5 h-5 animate-spin" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditMode ? 'Actualizar Rol' : 'Crear Rol'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
