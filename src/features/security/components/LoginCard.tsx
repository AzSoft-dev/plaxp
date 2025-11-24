import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { InputField, AnimatedCheckbox } from '../../../shared/components';

/**
 * Componente principal que contiene la tarjeta de login
 */
export const LoginCard: React.FC = () => {
  const { email, setEmail, password, setPassword, error, isLoading, handleLogin } = useAuth();
  const [animationKey, setAnimationKey] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Reinicia la animación cada vez que se monta el componente
    setAnimationKey(Date.now());
  }, []);

  return (
    // Contenedor Principal: Tarjeta de Login (Responsive)
    <div className="flex w-full max-w-5xl h-auto md:min-h-[550px] bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 animate-fadeInUp">
      {/* Columna de Arte/Mensaje (Identidad de Marca - Oculta en Móvil) */}
      <div className="hidden md:flex md:w-1/2 bg-white dark:bg-dark-card flex-col justify-center items-center p-8 animate-fadeInLeft">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-primary dark:text-primary mb-2 text-center leading-tight">
            Bienvenido a Plaxp
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8 leading-relaxed">
            La plataforma integral para gestionar tu negocio de forma eficiente
          </p>
        </div>
        <img
          key={animationKey}
          src="/Login/privacy-policy-animate.svg"
          alt="Personajes Plaxp"
          className="w-full max-w-lg object-contain"
        />
      </div>

      {/* Columna del Formulario de Login */}
      <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center animate-fadeInRight">
        {/* Logo de Marca (Plaxp) */}
        <div className="mb-6 md:text-left text-center">
          <img
            src="/logo_claro.png"
            alt="Plaxp Logo"
            className="h-12 inline-block dark:hidden"
          />
          <img
            src="/logo_oscuro.png"
            alt="Plaxp Logo"
            className="h-12 inline-block hidden dark:inline-block"
          />
        </div>

        {/* Encabezado del Formulario */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">Iniciar Sesión</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Ingresa tus datos para acceder a la plataforma.</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <InputField
            id="email"
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="ejemplo@tuempresa.com"
          />

          <InputField
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />

          {/* Opciones (Recordarme y Olvidó Contraseña) */}
          <div className="flex justify-between items-center text-sm">
            <AnimatedCheckbox
              id="remember-me"
              checked={rememberMe}
              onChange={setRememberMe}
              label="Recordarme"
              size="sm"
            />
            <Link
              to="/password-recovery"
              className="font-medium text-primary dark:text-primary hover:opacity-80 transition-opacity"
            >
              ¿Olvidaste tu Contraseña?
            </Link>
          </div>

          {/* Botón Principal */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:opacity-90 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Acceder a Plaxp'}
          </button>
        </form>

        {/* Sección de Acceso Alternativo / Footer */}
        <div className="mt-10 text-center border-t border-neutral-300 dark:border-neutral-700 pt-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            ¿Aún no eres cliente?{' '}
            <a
              href="#"
              className="font-medium text-primary dark:text-primary hover:opacity-80 transition-opacity"
            >
              Solicita tu Demo GRATIS
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
