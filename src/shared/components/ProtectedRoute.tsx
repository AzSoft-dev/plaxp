import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirige al login
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('ProtectedRoute debe estar dentro de AuthProvider');
  }

  const { isAuthenticated, isLoading, isLoginInProgress } = authContext;

  // SOLO mostrar LoadingScreen si hay un login en progreso (exitoso)
  if (isLoginInProgress) {
    return <LoadingScreen />;
  }

  // Durante la verificación inicial, no mostrar nada (evita parpadeo)
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
