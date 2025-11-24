import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rutas públicas (login, registro)
 * Si el usuario ya está autenticado, redirige al dashboard
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('PublicRoute debe estar dentro de AuthProvider');
  }

  const { isAuthenticated, isLoading, isLoginInProgress } = authContext;

  // Si el login fue exitoso, navegar al dashboard
  if (isLoginInProgress) {
    return <Navigate to="/dashboard" replace />;
  }

  // Mientras se verifica la sesión INICIAL (sin login en progreso), no mostrar nada
  if (isLoading && !isLoginInProgress) {
    return null;
  }

  // Si ya está autenticado (sin estar en proceso de login), navegar al dashboard
  if (isAuthenticated && !isLoginInProgress) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
