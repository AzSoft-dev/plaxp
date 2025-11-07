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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col view-rol-modal-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 px-4 py-3 flex items-center justify-between border-b-2 border-neutral-300 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-md border border-neutral-300">
              <FaShieldAlt className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-700">Detalles del Rol</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content con scroll */}
        <div className="overflow-y-auto flex-1 bg-neutral-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <CgSpinner className="w-12 h-12 text-neutral-400 animate-spin mb-4" />
              <p className="text-neutral-600 font-medium">Cargando información...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="bg-red-50 rounded-full p-4 mb-4 shadow-sm">
                <FaTimesCircle className="w-12 h-12 text-red-500" />
              </div>
              <p className="text-neutral-900 font-bold mb-2">Error al cargar</p>
              <p className="text-neutral-600 text-sm text-center mb-6">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-neutral-700 to-neutral-600 text-white font-bold rounded-xl hover:shadow-lg transition-all shadow-md"
              >
                Cerrar
              </button>
            </div>
          ) : rol ? (
            <div className="p-4 space-y-3">
              {/* ID destacado */}
              <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 border-2 border-neutral-300 rounded-xl p-5 text-center shadow-lg">
                <p className="text-neutral-600 text-xs font-bold uppercase tracking-widest mb-2">
                  ID del Rol
                </p>
                <p className="text-neutral-800 font-mono font-black text-4xl tracking-wider">
                  #{rol.id}
                </p>
              </div>

              {/* Información del rol */}
              <div className="bg-white rounded-xl p-5 border-2 border-neutral-200 shadow-md">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{rol.nombre}</h3>
                  <p className="text-neutral-600 font-medium mb-4 text-sm leading-relaxed">
                    {rol.descripcion}
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-md ${
                      rol.esSuperadmin
                        ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-2 border-purple-300'
                        : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-2 border-blue-300'
                    }`}
                  >
                    {rol.esSuperadmin ? <FaCheckCircle className="w-4 h-4" /> : <FaShieldAlt className="w-4 h-4" />}
                    {rol.esSuperadmin ? 'Superadministrador' : 'Rol Estándar'}
                  </div>
                </div>
              </div>

              {/* Sección de fechas */}
              <div className="bg-white rounded-xl p-5 border-2 border-neutral-200 shadow-md">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-neutral-200">
                  <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 p-2.5 rounded-xl shadow-sm">
                    <FaClock className="w-5 h-5 text-neutral-700" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Información de Registro</h4>
                </div>

                <div className="space-y-4">
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-1.5">Fecha de Creación</p>
                    <p className="text-sm font-semibold text-neutral-900">{formatDate(rol.creadoEn)}</p>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-1.5">ID de Empresa</p>
                    <p className="text-sm font-semibold text-neutral-900 font-mono">#{rol.empresaId}</p>
                  </div>
                </div>
              </div>

              {/* Sección de permisos (solo si no es superadmin) */}
              {!rol.esSuperadmin && rol.permisos && rol.permisos.length > 0 && (
                <div className="bg-white rounded-xl p-5 border-2 border-neutral-200 shadow-md">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 p-2.5 rounded-xl shadow-sm">
                        <FaKey className="w-5 h-5 text-neutral-700" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Permisos Asignados</h4>
                    </div>
                    <span className="bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-neutral-300">
                      {rol.permisos.length}
                    </span>
                  </div>

                  <div className="space-y-4">
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
                        <div className="flex items-center gap-2 bg-gradient-to-r from-neutral-100 to-neutral-50 px-3 py-2 rounded-lg mb-2 shadow-sm border border-neutral-200">
                          <p className="text-xs font-bold text-neutral-800 uppercase flex-1">
                            {modulo}
                          </p>
                          <span className="text-xs font-bold text-neutral-600 bg-neutral-200 px-2 py-1 rounded-full">
                            {permisosDelModulo.length}
                          </span>
                        </div>
                        <ul className="pl-4 space-y-2">
                          {permisosDelModulo.map(permiso => (
                            <li key={permiso.id} className="text-sm text-neutral-700 flex items-center gap-2 bg-neutral-50 p-2 rounded-lg">
                              <FaCheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                              <span className="font-medium">{permiso.descripcion || permiso.codigo}</span>
                            </li>
                          ))}
                        </ul>
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
          <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 border-t-2 border-neutral-300 px-4 py-3 rounded-b-2xl">
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
                      creadoEn: rol.creadoEn,
                    };
                    onEdit(rolBasico);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <FaEdit className="w-4 h-4" />
                  Editar
                </button>
              )}
              <button
                onClick={onClose}
                className={`${onEdit && rol ? 'flex-1' : 'w-full'} px-4 py-2.5 border-2 border-neutral-300 bg-white text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 hover:shadow-md transition-all shadow-sm`}
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
