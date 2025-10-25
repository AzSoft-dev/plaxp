import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../shared/contexts/AuthContext';

/**
 * Hook para manejar el formulario de login
 * Usa el AuthContext para gestión de estado global
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await context.login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error?.message || 'Error al iniciar sesión');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
    isAuthenticated: context.isAuthenticated,
    user: context.user,
    isLoading: context.isLoading,
    logout: context.logout,
  };
};
