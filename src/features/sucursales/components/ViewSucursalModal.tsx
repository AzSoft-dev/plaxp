import React, { useState, useEffect } from 'react';
import { FaTimes, FaBuilding, FaClock, FaCheckCircle, FaTimesCircle, FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { obtenerSucursalPorIdApi } from '../api/sucursalesApi';
import type { Sucursal } from '../types/sucursal.types';
import '../styles/ViewSucursalModal.css';

interface ViewSucursalModalProps {
  isOpen: boolean;
  onClose: () => void;
  sucursalId: string | null;
  onEdit?: (sucursal: Sucursal) => void;
}

export const ViewSucursalModal: React.FC<ViewSucursalModalProps> = ({
  isOpen,
  onClose,
  sucursalId,
  onEdit
}) => {
  const [sucursal, setSucursal] = useState<Sucursal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && sucursalId) {
      fetchSucursalDetails();
    } else if (!isOpen) {
      setSucursal(null);
      setError(null);
    }
  }, [isOpen, sucursalId]);

  const fetchSucursalDetails = async () => {
    if (!sucursalId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerSucursalPorIdApi(sucursalId);
      setSucursal(response.data);
    } catch (err: any) {
      console.error('Error al obtener sucursal:', err);
      setError(err.message || 'Error al cargar los detalles de la sucursal');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 view-sucursal-modal-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-md border border-neutral-100 dark:border-dark-border max-w-3xl w-full max-h-[90vh] flex flex-col view-sucursal-modal-slide-up">
        <div className="bg-white dark:bg-dark-card px-4 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-dark-border rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/30">
              <FaBuilding className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Detalles de la Sucursal</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-500 dark:text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-xl p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 bg-neutral-50 dark:bg-dark-bg">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <CgSpinner className="w-12 h-12 text-primary dark:text-blue-400 animate-spin mb-4" />
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
          ) : sucursal ? (
            <div className="p-4 space-y-3">
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border-2 border-neutral-200 dark:border-dark-border shadow-md">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{sucursal.nombre}</h3>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs shadow-sm ${
                          sucursal.estado === 1
                            ? 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                            : 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'
                        }`}
                      >
                        {sucursal.estado === 1 ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
                        {sucursal.estado === 1 ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-3 border-t border-neutral-200 dark:border-dark-border">
                  {sucursal.direccion && (
                    <div className="flex items-start gap-2">
                      <div className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-lg">
                        <FaMapMarkerAlt className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Dirección</p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{sucursal.direccion}</p>
                      </div>
                    </div>
                  )}

                  {sucursal.telefono && (
                    <div className="flex items-center gap-2">
                      <div className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-lg">
                        <FaPhone className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Teléfono</p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{sucursal.telefono}</p>
                      </div>
                    </div>
                  )}

                  {sucursal.correo && (
                    <div className="flex items-center gap-2">
                      <div className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-lg">
                        <FaEnvelope className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Correo</p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{sucursal.correo}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-lg">
                      <FaClock className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Creado</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatDate(sucursal.creadoEn)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {!loading && !error && (
          <div className="bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-border px-4 py-4 rounded-b-2xl">
            <div className="flex gap-3">
              {onEdit && sucursal && (
                <button
                  onClick={() => {
                    onEdit(sucursal);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <FaEdit className="w-4 h-4" />
                  Editar
                </button>
              )}
              <button
                onClick={onClose}
                className={`${onEdit && sucursal ? 'flex-1' : 'w-full'} px-4 py-2.5 border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-all`}
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
