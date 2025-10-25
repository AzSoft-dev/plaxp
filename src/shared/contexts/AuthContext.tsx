import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { loginApi, type User } from '../../features/security/api/SecurityApi/';

/**
 * Interface del contexto de autenticación
 */
export interface AuthContextType {
  // Estado
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  // Acciones
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

  /**
   * Función de login
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await loginApi(email, password);

      if (response.success) {
        // Guardar usuario en localStorage para persistir la sesión
        localStorage.setItem('user', JSON.stringify(response.data));

        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'Credenciales incorrectas');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función de logout
   */
  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
