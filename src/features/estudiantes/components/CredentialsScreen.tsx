import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaGraduationCap, FaUser, FaKey, FaCopy, FaExclamationCircle } from 'react-icons/fa';
import type { Estudiante } from '../types/estudiante.types';

interface CredentialsScreenProps {
  student: Estudiante;
}

export const CredentialsScreen: React.FC<CredentialsScreenProps> = ({ student }) => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Success & Email Notification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-900">Estudiante creado exitosamente</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <FaEnvelope className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-900">
                Credenciales enviadas a <span className="font-bold">{student.correo}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Card */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-md">
        {/* Header */}
        <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaGraduationCap className="w-5 h-5 text-neutral-600" />
              <h2 className="text-base font-bold text-neutral-900">
                {student.nombre} {student.primerApellido} {student.segundoApellido || ''}
              </h2>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Usuario */}
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FaUser className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-500 mb-0.5">Usuario</p>
                    <p className="text-sm font-mono font-bold text-neutral-900 truncate">
                      {student.nombreUsuario}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(student.nombreUsuario || '', 'nombreUsuario')}
                  className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors flex-shrink-0"
                  title="Copiar"
                >
                  {copiedField === 'nombreUsuario' ? (
                    <FaCheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <FaCopy className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Contraseña */}
            {student.contrasenaTemporal && (
              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FaKey className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-neutral-500 mb-0.5">Contraseña</p>
                      <p className="text-sm font-mono font-bold text-neutral-900 truncate">
                        {student.contrasenaTemporal}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(student.contrasenaTemporal || '', 'contrasenaTemporal')}
                    className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors flex-shrink-0"
                    title="Copiar"
                  >
                    {copiedField === 'contrasenaTemporal' ? (
                      <FaCheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <FaCopy className="w-4 h-4 text-neutral-500" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Correo */}
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FaEnvelope className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-500 mb-0.5">Correo</p>
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {student.correo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(student.correo, 'correo')}
                  className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors flex-shrink-0"
                  title="Copiar"
                >
                  {copiedField === 'correo' ? (
                    <FaCheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <FaCopy className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-3 bg-amber-50 border-l-4 border-amber-400 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <FaExclamationCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                El estudiante debe cambiar su contraseña en el primer acceso.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 rounded-b-xl flex justify-end">
          <button
            onClick={() => navigate('/estudiantes')}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
