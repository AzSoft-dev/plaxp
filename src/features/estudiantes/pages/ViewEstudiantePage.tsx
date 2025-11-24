import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaClock, FaCheckCircle, FaTimesCircle, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt, FaGraduationCap, FaKey, FaEdit } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { obtenerEstudiantePorIdApi } from '../api/estudiantesApi';
import type { Estudiante } from '../types/estudiante.types';

export const ViewEstudiantePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEstudianteDetails();
    }
  }, [id]);

  const fetchEstudianteDetails = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerEstudiantePorIdApi(id);
      if (response.success) {
        setEstudiante(response.data);
      } else {
        setError('Error al cargar los detalles del estudiante');
      }
    } catch (err: any) {
      console.error('Error al obtener estudiante:', err);
      setError(err.message || 'Error al cargar los detalles del estudiante');
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <CgSpinner className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Cargando información del estudiante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex flex-col items-center">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-4">
            <FaTimesCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-neutral-900 dark:text-neutral-100 font-semibold mb-2">Error al cargar el estudiante</p>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mb-6">{error}</p>
          <button
            onClick={() => navigate('/estudiantes')}
            className="px-5 py-2 bg-neutral-600 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Volver a Estudiantes
          </button>
        </div>
      </div>
    );
  }

  if (!estudiante) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-dark-bg">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/estudiantes')}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors font-medium"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver a Estudiantes</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-500/30">
              <FaGraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">Detalles del Estudiante</h1>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">Información completa del estudiante</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/estudiantes/edit/${estudiante.id}`)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all w-full md:w-auto shadow-md"
          >
            <FaEdit className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>

      {/* Información básica */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-6 shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">ID:</span>
              <span className="text-sm font-mono text-neutral-700 dark:text-neutral-300">#{estudiante.id}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {estudiante.nombre} {estudiante.primerApellido} {estudiante.segundoApellido || ''}
            </h2>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium self-start ${
              estudiante.estado
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            {estudiante.estado ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
            {estudiante.estado ? 'Activo' : 'Inactivo'}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-dark-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
                Correo Electrónico
              </label>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <FaEnvelope className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                <span className="text-sm break-all">{estudiante.correo}</span>
              </div>
            </div>

            <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
                Teléfono
              </label>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <FaPhone className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                <span className="text-sm">{estudiante.telefono || 'N/A'}</span>
              </div>
            </div>

            <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
                Identificación
              </label>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <FaIdCard className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                <span className="text-sm">{estudiante.identificacion}</span>
              </div>
            </div>

            <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
                Fecha de Nacimiento
              </label>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <FaClock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                <span className="text-sm">{estudiante.fechaNacimiento || 'N/A'}</span>
              </div>
            </div>

            <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
                Creado En
              </label>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <FaClock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{formatDate(estudiante.creadoEn)}</span>
              </div>
            </div>

            <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
                Modificado En
              </label>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <FaClock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{formatDate(estudiante.modificadoEn)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información de Moodle */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-6 shadow-md mb-6">
        <div className="flex items-center gap-2 mb-5">
          <FaGraduationCap className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Información de Moodle</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
              Nombre de Usuario
            </label>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <FaUser className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
              <span className="text-sm">{estudiante.nombreUsuario || 'N/A'}</span>
            </div>
          </div>

          <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
              ID Moodle
            </label>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <FaIdCard className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
              <span className="text-sm">{estudiante.idMoodle || 'N/A'}</span>
            </div>
          </div>

          {estudiante.contrasenaTemporal && (
            <div className="pb-3 md:pb-0 border-b md:border-b-0 border-neutral-200 dark:border-dark-border">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide block mb-2">
                Contraseña Temporal
              </label>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <FaKey className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                <span className="text-sm font-mono">{estudiante.contrasenaTemporal}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dirección */}
      {estudiante.direccion && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-100 dark:border-dark-border p-4 md:p-6 shadow-md">
          <div className="flex items-center gap-2 mb-5">
            <FaMapMarkerAlt className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Dirección</h3>
          </div>

          <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
            <FaMapMarkerAlt className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
            <span className="text-sm">{estudiante.direccion}</span>
          </div>
        </div>
      )}
    </div>
  );
};
