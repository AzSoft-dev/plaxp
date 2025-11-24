import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { loginApi, type User } from '../../features/security/api/SecurityApi';
import { apiService } from '../services/apiService';

/**
 * Interface del contexto de autenticación
 */
export interface AuthContextType {
  // Estado
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  isLoginInProgress: boolean; // Solo true durante el proceso de login

  // Acciones
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  finishLoading: () => void;
}

/**
 * Contexto de autenticación
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticación integrado con el API service
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Iniciar en true para verificar sesión
  const [isLoginInProgress, setIsLoginInProgress] = useState(false); // Solo true durante login

  /**
   * Función de logout (usar useCallback para que sea estable)
   */
  const logout = useCallback(() => {
    console.log('🚪 Cerrando sesión...');

    // Limpiar localStorage
    localStorage.removeItem('user');

    // Limpiar cookie (intentar eliminarla)
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Al iniciar la app, verificar si hay sesión guardada en localStorage
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error recuperando sesión:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false); // Terminar la carga inicial
  }, []);

  /**
   * Registrar callback de error de autenticación en el apiService
   */
  useEffect(() => {
    apiService.setAuthErrorCallback(() => {
      console.warn('🔒 Error de autenticación en API, cerrando sesión automáticamente');
      logout();
    });
  }, [logout]);

  /**
   * La verificación de sesión se hace principalmente a través de los errores del API
   * Solo cuando el servidor responda con 401/403, se cerrará la sesión automáticamente
   */

  /**
   * Función de login
   */
  const login = async (email: string, password: string) => {
    // NO poner isLoading = true aquí para evitar que PublicRoute oculte el formulario

    try {
      const response = await loginApi(email, password);

      if (response.success) {
        // Guardar usuario en localStorage para persistir la sesión
        localStorage.setItem('user', JSON.stringify(response.data));

        setUser(response.data);
        setIsAuthenticated(true);

        // Marcar que login fue exitoso para mostrar LoadingScreen
        setIsLoginInProgress(true);
      } else {
        throw new Error(response.message || 'Credenciales incorrectas');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      throw new Error(errorMessage);
    }
  };

  /**
   * Función para finalizar el estado de carga después de navegar
   */
  const finishLoading = useCallback(() => {
    setIsLoading(false);
    setIsLoginInProgress(false);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    isLoginInProgress,
    login,
    logout,
    finishLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
