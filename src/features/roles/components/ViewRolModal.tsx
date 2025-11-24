import React, { useState, useEffect } from 'react';
import { FaTimes, FaShieldAlt, FaClock, FaCheckCircle, FaTimesCircle, FaKey, FaEdit } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { obtenerRolConPermisosApi } from '../api/rolesApi';
import type { Rol, RolConPermisos } from '../types/role.types';
import '../styles/ViewRolModal.css';

interface ViewRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  rolId: string | null;
  onEdit?: (rol: Rol) => void;
}

/**
 * Modal profesional para ver detalles de un rol
 * Diseño formal y minimalista siguiendo estándares empresariales
 */
export const ViewRolModal: React.FC<ViewRolModalProps> = ({ isOpen, onClose, rolId, onEdit }) => {
  const [rol, setRol] = useState<RolConPermisos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && rolId) {
      fetchRolDetails();
    } else if (!isOpen) {
      setRol(null);
      setError(null);
    }
  }, [isOpen, rolId]);

  const fetchRolDetails = async () => {
    if (!rolId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerRolConPermisosApi(rolId);
      setRol(response.data);
    } catch (err: any) {
      console.error('Error al obtener rol:', err);
      setError(err.message || 'Error al cargar los detalles del rol');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 view-rol-modal-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-md border border-neutral-100 dark:border-dark-border max-w-4xl w-full max-h-[90vh] flex flex-col view-rol-modal-slide-up">
        {/* Header */}
        <div className="bg-white dark:bg-dark-card px-4 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-dark-border rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-md shadow-teal-500/30">
              <FaShieldAlt className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Detalles del Rol</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-500 dark:text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-xl p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content con scroll */}
        <div className="overflow-y-auto flex-1 bg-neutral-50 dark:bg-dark-bg">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <CgSpinner className="w-12 h-12 text-primary dark:text-teal-400 animate-spin mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400 font-medium">Cargando información...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-4 mb-4 shadow-sm">
                <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
              </div>
              <p className="text-neutral-900 dark:text-neutral-100 font-bold mb-2">Error al cargar</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mb-6">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-neutral-700 to-neutral-600 text-white font-bold rounded-xl hover:shadow-lg transition-all shadow-md"
              >
                Cerrar
              </button>
            </div>
          ) : rol ? (
            <div className="p-4 space-y-3">
              {/* Card principal con toda la info básica */}
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border-2 border-neutral-200 dark:border-dark-border shadow-md">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">ID:</span>
                      <span className="text-lg font-mono font-black text-neutral-800 dark:text-neutral-200">#{rol.id}</span>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs shadow-sm ${
                          rol.esSuperadmin
                            ? 'bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-700'
                            : 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                        }`}
                      >
                        {rol.esSuperadmin ? <FaCheckCircle className="w-3 h-3" /> : <FaShieldAlt className="w-3 h-3" />}
                        {rol.esSuperadmin ? 'Superadmin' : 'Estándar'}
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs shadow-sm ${
                          rol.estado
                            ? 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                            : 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'
                        }`}
                      >
                        {rol.estado ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
                        {rol.estado ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{rol.nombre}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{rol.descripcion}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-200 dark:border-dark-border">
                  <div className="flex items-center gap-2">
                    <div className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-lg">
                      <FaClock className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Creado</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatDate(rol.creadoEn)}</p>
                    </div>
                  </div>

                  {!rol.esSuperadmin && rol.permisos && rol.permisos.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-lg">
                        <FaKey className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Permisos</p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{rol.permisos.length} asignados</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección de permisos (solo si no es superadmin) */}
              {!rol.esSuperadmin && rol.permisos && rol.permisos.length > 0 && (
                <div className="bg-white dark:bg-dark-card rounded-xl p-4 border-2 border-neutral-200 dark:border-dark-border shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <FaKey className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase">Permisos Asignados</h4>
                  </div>

                  <div className="space-y-2.5">
                    {/* Agrupar permisos por módulo */}
                    {Object.entries(
                      rol.permisos.reduce((acc, permiso) => {
                        if (!acc[permiso.modulo]) {
                          acc[permiso.modulo] = [];
                        }
                        acc[permiso.modulo].push(permiso);
                        return acc;
                      }, {} as Record<string, typeof rol.permisos>)
                    ).map(([modulo, permisosDelModulo]) => (
                      <div key={modulo}>
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/30 px-2.5 py-1.5 rounded-lg mb-1.5">
                          <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase flex-1">
                            {modulo}
                          </p>
                          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                            {permisosDelModulo.length}
                          </span>
                        </div>
                        <div className="pl-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
                          {permisosDelModulo.map(permiso => (
                            <div key={permiso.id} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800/20 px-2 py-1.5 rounded">
                              <FaCheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                              <span className="font-medium">{permiso.descripcion || permiso.codigo}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer fijo */}
        {!loading && !error && (
          <div className="bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-border px-4 py-4 rounded-b-2xl">
            <div className="flex gap-3">
              {onEdit && rol && (
                <button
                  onClick={() => {
                    const rolBasico: Rol = {
                      id: rol.id,
                      empresaId: rol.empresaId,
                      nombre: rol.nombre,
                      descripcion: rol.descripcion,
                      esSuperadmin: rol.esSuperadmin,
                      estado: rol.estado,
                      creadoEn: rol.creadoEn,
                    };
                    onEdit(rolBasico);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <FaEdit className="w-4 h-4" />
                  Editar
                </button>
              )}
              <button
                onClick={onClose}
                className={`${onEdit && rol ? 'flex-1' : 'w-full'} px-4 py-2.5 border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-all`}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
