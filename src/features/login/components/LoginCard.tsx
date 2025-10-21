import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { InputField } from '../../../shared/components/InputField';

/**
 * Componente principal que contiene la tarjeta de login
 */
export const LoginCard: React.FC = () => {
  const { email, setEmail, password, setPassword, handleLogin } = useAuth();

  return (
    // Contenedor Principal: Tarjeta de Login (Responsive)
    <div className="flex w-full max-w-5xl h-auto md:min-h-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
      {/* Columna de Arte/Mensaje (Identidad de Marca - Oculta en Móvil) */}
      <div className="hidden md:flex md:w-1/2 primary-gradient flex-col justify-center items-center p-12 text-white text-center">
        {/* Icono que representa la eficiencia */}
        <svg
          className="w-16 h-16 mb-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-3xl font-extrabold mb-3 leading-tight">
          Plaxp: La Eficiencia Centralizada.
        </h2>
        <p className="text-white opacity-80 text-lg">
          Accede a tu cuenta para gestionar todos tus módulos (Ventas, Inventario, Facturación)
          desde un solo lugar.
        </p>
      </div>

      {/* Columna del Formulario de Login */}
      <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
        {/* Logo de Marca (Plaxp) */}
        <div className="mb-6 md:text-left text-center">
          <img
            src="/logo.png"
            alt="Plaxp Logo"
            className="h-12 inline-block"
          />
        </div>

        {/* Encabezado del Formulario */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-neutral-900 mb-1">Iniciar Sesión</h1>
          <p className="text-neutral-500">Ingresa tus datos para acceder a la plataforma.</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
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
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-neutral-700">
                Recordarme
              </label>
            </div>
            <a
              href="#"
              className="font-medium text-primary hover:opacity-80 transition-opacity"
            >
              ¿Olvidaste tu Contraseña?
            </a>
          </div>

          {/* Botón Principal */}
          <button
            type="submit"
            className="w-full py-3 bg-primary hover:opacity-90 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 transition-all duration-150"
          >
            Acceder a Plaxp
          </button>
        </form>

        {/* Sección de Acceso Alternativo / Footer */}
        <div className="mt-10 text-center border-t border-neutral-300 pt-6">
          <p className="text-sm text-neutral-500">
            ¿Aún no eres cliente?{' '}
            <a
              href="#"
              className="font-medium text-primary hover:opacity-80 transition-opacity"
            >
              Solicita tu Demo GRATIS
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
