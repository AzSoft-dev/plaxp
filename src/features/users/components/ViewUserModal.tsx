import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaShieldAlt, FaClock, FaEdit, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { obtenerUsuarioPorIdApi } from '../api/UsersApi';
import type { UsuarioDetalle } from '../types/user.types';
import '../styles/ViewUserModal.css';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onEdit?: (usuario: UsuarioDetalle) => void;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  onEdit,
}) => {
  const [usuario, setUsuario] = useState<UsuarioDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUsuarioDetails();
    }
  }, [isOpen, userId]);

  const fetchUsuarioDetails = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerUsuarioPorIdApi(userId);
      if (response.success) {
        setUsuario(response.data);
      } else {
        setError('Error al cargar los detalles del usuario');
      }
    } catch (err: any) {
      console.error('Error al obtener usuario:', err);
      setError(err.message || 'Error al cargar los detalles del usuario');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 view-user-modal-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-md border border-neutral-100 dark:border-dark-border w-full max-w-2xl max-h-[90vh] flex flex-col view-user-modal-slide-up">
        {/* Header */}
        <div className="bg-white dark:bg-dark-card px-4 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-dark-border rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md shadow-purple-500/30">
              <FaUser className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Detalles del Usuario</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-500 dark:text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-xl p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 bg-neutral-50 dark:bg-dark-bg">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <CgSpinner className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mb-3" />
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Cargando información...</p>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex flex-col items-center">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-4">
                  <FaTimesCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-neutral-900 dark:text-neutral-100 font-semibold mb-2">Error al cargar usuario</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center">{error}</p>
              </div>
            </div>
          ) : usuario ? (
            <div className="p-4 md:p-6 space-y-4">
              {/* Información Principal */}
              <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-5 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">{usuario.nombre}</h3>
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
                      <FaEnvelope className="w-4 h-4" />
                      <span>{usuario.correo}</span>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      usuario.estado === 'activo' || usuario.estado === '1'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    {usuario.estado === 'activo' || usuario.estado === '1' ? (
                      <FaCheckCircle className="w-3 h-3" />
                    ) : (
                      <FaTimesCircle className="w-3 h-3" />
                    )}
                    {usuario.estado === 'activo' || usuario.estado === '1' ? 'Activo' : 'Inactivo'}
                  </div>
                </div>

                {/* ID */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/30 rounded-lg px-3 py-2 w-fit">
                  <span className="font-medium">ID:</span>
                  <span className="font-mono">{usuario.id}</span>
                </div>
              </div>

              {/* Rol */}
              <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30">
                    <FaShieldAlt className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Rol y Permisos</h4>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/20 border border-teal-200 dark:border-teal-800 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Rol asignado:</span>
                    <span className="text-sm font-bold text-teal-700 dark:text-teal-400">{usuario.nombreRol}</span>
                  </div>
                </div>
              </div>

              {/* Información de Acceso */}
              <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                    <FaClock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Información de Acceso</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <FaCalendarAlt className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                      <span>Creado en:</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-200">{formatDate(usuario.creadoEn)}</span>
                  </div>

                  <div className="h-px bg-neutral-100 dark:bg-dark-border"></div>

                  <div className="flex items-start justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <FaClock className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                      <span>Último acceso:</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-200">{formatDate(usuario.ultimoLogin)}</span>
                  </div>

                  <div className="h-px bg-neutral-100 dark:bg-dark-border"></div>

                  <div className="flex items-start justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <FaEdit className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                      <span>Modificado:</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-200">{formatDate(usuario.fechaModificacion)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!loading && !error && usuario && (
          <div className="bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-border px-4 py-4 rounded-b-2xl">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`${onEdit ? 'flex-1' : 'w-full'} px-4 py-2.5 border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-all`}
              >
                Cerrar
              </button>
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(usuario);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <FaEdit className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
