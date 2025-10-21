import React, { createContext, useContext, type ReactNode } from 'react';

/**
 * Tipos para el contexto de autenticación
 */
export interface User {
  id: string;
  email: string;
  name: string;
  // Agregar más campos según necesidades futuras
}

export interface AuthContextType {
  // Estados
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Acciones (a implementar cuando se integre el backend)
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación
 *
 * TODO: Integrar con el backend real
 * - Implementar login con API
 * - Implementar logout
 * - Manejar tokens JWT
 * - Persistencia en localStorage
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estado inicial - sin autenticación
  const user = null;
  const token = null;
  const isAuthenticated = false;

  // Funciones stub - a implementar
  const login = async (email: string, password: string) => {
    // TODO: Implementar llamada a API de login
    console.log('Login llamado con:', { email, password });
  };

  const logout = () => {
    // TODO: Implementar logout
    console.log('Logout llamado');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
};
