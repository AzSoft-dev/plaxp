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

  const { isAuthenticated } = authContext;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
