import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/security/hooks/useAuth';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Número 404 con gradiente */}
        <div className="relative mb-8">
          <h1 className="text-[180px] md:text-[240px] font-bold leading-none bg-gradient-to-br from-primary via-purple-500 to-primary bg-clip-text text-transparent opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-fade-in">
              <svg
                className="w-24 h-24 md:w-32 md:h-32 text-primary opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="animate-slide-up space-y-6 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            Página no encontrada
          </h2>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isAuthenticated ? 'Ir al Dashboard' : 'Volver al Inicio'}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-neutral-300 dark:border-dark-border hover:border-primary dark:hover:border-primary text-neutral-700 dark:text-neutral-300 font-medium rounded-xl transition-all duration-200"
            >
              Volver atrás
            </button>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-5 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};
