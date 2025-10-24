import React, { createContext, useState, ReactNode } from 'react';

/**
 * Tipos para el usuario autenticado
 * Fácilmente extensible con más propiedades según la API real
 */
export interface User {
  id: string;
  email: string;
  name?: string;
}

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
 * Provider de autenticación
 *
 * NOTA: Este provider tiene lógica simulada (mock).
 * Para integrar con API real, reemplazar las funciones login/logout
 * con llamadas a tu backend.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Función de login (MOCK)
   *
   * Para integrar con API real:
   * 1. Hacer POST a /api/auth/login con { email, password }
   * 2. Guardar el token en localStorage o cookies
   * 3. Setear el usuario con los datos de la respuesta
   * 4. Manejar errores y mostrar mensajes apropiados
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // MOCK: Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // MOCK: Usuario simulado
      const mockUser: User = {
        id: '1',
        email: email,
        name: 'Usuario Demo'
      };

      // TODO: Reemplazar con llamada real a API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // localStorage.setItem('token', data.token);
      // setUser(data.user);

      setUser(mockUser);
      setIsAuthenticated(true);

      console.log('Login exitoso (MOCK):', { email, password });
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función de logout
   *
   * Para integrar con API real:
   * 1. Hacer POST a /api/auth/logout (opcional)
   * 2. Eliminar token de localStorage o cookies
   * 3. Limpiar estado del usuario
   */
  const logout = () => {
    // TODO: Reemplazar con lógica real
    // localStorage.removeItem('token');
    // await fetch('/api/auth/logout', { method: 'POST' });

    setUser(null);
    setIsAuthenticated(false);
    console.log('Logout exitoso');
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
