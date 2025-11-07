import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaShieldAlt, FaClock, FaCheckCircle, FaTimesCircle, FaEnvelope } from 'react-icons/fa';
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

/**
 * Modal profesional para ver detalles de un usuario
 * Diseño formal y minimalista siguiendo estándares empresariales
 */
export const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, userId, onEdit }) => {
  const [usuario, setUsuario] = useState<UsuarioDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    } else if (!isOpen) {
      setUsuario(null);
      setError(null);
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerUsuarioPorIdApi(userId);
      if (response.success) {
        setUsuario(response.data);
      } else {
        setError(response.message || 'Error al cargar los detalles del usuario');
      }
    } catch (err: any) {
      console.error('Error al obtener usuario:', err);
      setError(err.message || 'Error al cargar los detalles del usuario');
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

  const estadoActivo = usuario?.estado === '1' || usuario?.estado?.toLowerCase() === 'activo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 view-user-modal-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col view-user-modal-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 px-4 py-3 flex items-center justify-between border-b-2 border-neutral-300 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-md border border-neutral-300">
              <FaUser className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-700">Detalles del Usuario</h2>
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
                className="px-6 py-2.5 bg-neutral-600 text-white font-bold rounded-lg hover:bg-neutral-700 hover:shadow-md transition-all shadow-sm"
              >
                Cerrar
              </button>
            </div>
          ) : usuario ? (
            <div className="p-4 space-y-3">
              {/* ID destacado */}
              <div className="bg-neutral-200 border-2 border-neutral-300 rounded-xl p-4 text-center shadow-md">
                <p className="text-neutral-600 text-xs font-bold uppercase tracking-widest mb-2">
                  ID de Usuario
                </p>
                <p className="text-neutral-800 font-mono font-black text-3xl tracking-wider">
                  #{usuario.id}
                </p>
              </div>

              {/* Información del usuario */}
              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{usuario.nombre}</h3>
                  <p className="text-neutral-600 font-medium flex items-center justify-center gap-2 mb-4">
                    <FaEnvelope className="w-4 h-4" />
                    {usuario.correo}
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-sm ${
                      estadoActivo
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-red-100 text-red-700 border-2 border-red-300'
                    }`}
                  >
                    {estadoActivo ? <FaCheckCircle className="w-4 h-4" /> : <FaTimesCircle className="w-4 h-4" />}
                    {estadoActivo ? 'Usuario Activo' : 'Usuario Inactivo'}
                  </div>
                </div>
              </div>

              {/* Rol */}
              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-300 p-2 rounded-lg shadow-sm">
                    <FaShieldAlt className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Rol del Sistema</p>
                    <p className="text-lg font-bold text-neutral-900">{usuario.nombreRol}</p>
                  </div>
                </div>
              </div>

              {/* Sección de fechas */}
              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-200">
                  <div className="bg-neutral-300 p-2 rounded-lg shadow-sm">
                    <FaClock className="w-5 h-5 text-neutral-700" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Registro de Actividad</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-1">Fecha de Registro</p>
                    <p className="text-sm font-semibold text-neutral-900">{formatDate(usuario.creadoEn)}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200">
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-1">Último Acceso</p>
                    <p className="text-sm font-semibold text-neutral-900">{formatDate(usuario.ultimoLogin)}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200">
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-1">Última Modificación</p>
                    <p className="text-sm font-semibold text-neutral-900">{formatDate(usuario.fechaModificacion)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer fijo */}
        {!loading && !error && (
          <div className="bg-gradient-to-r from-neutral-100 to-neutral-200 border-t-2 border-neutral-300 px-4 py-3 rounded-b-2xl">
            <div className="flex gap-3">
              {onEdit && usuario && (
                <button
                  onClick={() => {
                    onEdit(usuario);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Editar
                </button>
              )}
              <button
                onClick={onClose}
                className={`${onEdit && usuario ? 'flex-1' : 'w-full'} px-4 py-2.5 border-2 border-neutral-300 bg-white text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 hover:shadow-md transition-all shadow-sm`}
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
