import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  isSuccess?: boolean;
  successMessage?: string;
}

/**
 * Componente de overlay de carga que bloquea toda la pantalla
 * Muestra un spinner mientras está cargando y un checkmark cuando es exitoso
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Guardando datos...',
  isSuccess = false,
  successMessage = '¡Guardado exitosamente!',
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md animate-fadeIn">
      <div className="relative">
        {/* Círculo de fondo con pulsación */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>

        {/* Card principal - Transparente con glassmorphism */}
        <div className="relative bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 max-w-md mx-4 transform animate-scaleIn border border-white/20 dark:border-dark-border/30">
          {/* Contenedor del ícono */}
          <div className="flex flex-col items-center">
            {!isSuccess ? (
              /* Estado de carga */
              <>
                {/* Spinner con anillos animados */}
                <div className="relative mb-6">
                  {/* Anillo exterior */}
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 w-24 h-24 animate-ping opacity-40"></div>

                  {/* Anillo medio */}
                  <div className="absolute inset-2 rounded-full border-4 border-purple-200/50 dark:border-purple-400/30 w-20 h-20 animate-pulse"></div>

                  {/* Spinner central */}
                  <div className="relative flex items-center justify-center w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-600 opacity-15 animate-pulse"></div>
                    <CgSpinner className="w-12 h-12 text-primary animate-spin relative z-10" style={{ animationDuration: '1s' }} />
                  </div>
                </div>

                {/* Mensaje de carga */}
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 text-center">
                  {message}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                  Por favor espera un momento...
                </p>

                {/* Barra de progreso animada */}
                <div className="mt-6 w-full bg-neutral-200/50 dark:bg-dark-border/50 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary via-purple-600 to-primary rounded-full animate-progressBar bg-[length:200%_100%]"></div>
                </div>
              </>
            ) : (
              /* Estado de éxito */
              <>
                {/* Checkmark animado */}
                <div className="relative mb-6">
                  {/* Ondas de éxito */}
                  <div className="absolute inset-0 rounded-full border-4 border-success/30 w-24 h-24 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-success/20 w-20 h-20 animate-pulse delay-75"></div>

                  {/* Círculo de fondo */}
                  <div className="relative flex items-center justify-center w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-success to-emerald-600 animate-scaleIn"></div>

                    {/* Checkmark con animación de dibujo */}
                    <div className="relative z-10 animate-checkmarkBounce">
                      <FaCheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Mensaje de éxito */}
                <h3 className="text-xl font-bold text-success mb-2 text-center animate-slideUp">
                  {successMessage}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center animate-slideUp delay-100">
                  Redirigiendo...
                </p>

                {/* Confetti animation con colores de la paleta */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full animate-confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10%',
                        backgroundColor: ['#6a48bf', '#a855f7', '#10B981', '#3B82F6', '#F59E0B'][i % 5],
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${1 + Math.random()}s`,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkmarkBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes progressBar {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .animate-checkmarkBounce {
          animation: checkmarkBounce 0.6s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }

        .animate-progressBar {
          animation: progressBar 2s linear infinite;
        }

        .animate-confetti {
          animation: confetti forwards;
        }

        .delay-75 {
          animation-delay: 75ms;
        }

        .delay-100 {
          animation-delay: 100ms;
        }
      `}</style>
    </div>
  );
};
