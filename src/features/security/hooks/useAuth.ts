import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook para manejar el formulario de login
 * Usa el AuthContext para gestión de estado global
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await context.login(email, password);
      // Redirigir o realizar otra acción después del login exitoso
    } catch (error) {
      console.error('Error en login:', error);
      // Mostrar mensaje de error al usuario
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    // Exponer estado y acciones del contexto
    isAuthenticated: context.isAuthenticated,
    user: context.user,
    isLoading: context.isLoading,
    logout: context.logout,
  };
};
