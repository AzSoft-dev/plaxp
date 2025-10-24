import React, { createContext, useState, type ReactNode } from 'react';

/**
 * Interface del contexto de recuperación de contraseña
 */
export interface PasswordRecoveryContextType {
  // Estado
  emailSent: boolean;
  waitingForCode: boolean;
  email: string;
  isLoading: boolean;

  // Acciones
  sendRecoveryEmail: (email: string) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<void>;
  resetFlow: () => void;
}

/**
 * Contexto de recuperación de contraseña
 */
export const PasswordRecoveryContext = createContext<PasswordRecoveryContextType | undefined>(
  undefined
);

/**
 * Provider de recuperación de contraseña
 *
 * NOTA: Este provider tiene lógica simulada (mock).
 * Para integrar con API real, reemplazar las funciones
 * con llamadas a tu backend.
 */
export const PasswordRecoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [waitingForCode, setWaitingForCode] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Enviar correo de recuperación (MOCK)
   *
   * Para integrar con API real:
   * 1. Hacer POST a /api/auth/forgot-password con { email }
   * 2. Manejar respuesta del servidor
   * 3. Mostrar mensaje de éxito/error
   */
  const sendRecoveryEmail = async (email: string) => {
    setIsLoading(true);

    try {
      // MOCK: Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Reemplazar con llamada real a API
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Error al enviar correo');
      // }

      setEmail(email);
      setEmailSent(true);
      setWaitingForCode(true);

      console.log('Correo de recuperación enviado (MOCK):', email);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verificar código de recuperación (MOCK)
   *
   * Para integrar con API real:
   * 1. Hacer POST a /api/auth/verify-code con { email, code }
   * 2. Retornar true si el código es válido
   * 3. Retornar false si el código es inválido
   */
  const verifyCode = async (code: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // MOCK: Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Reemplazar con llamada real a API
      // const response = await fetch('/api/auth/verify-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, code })
      // });
      //
      // const data = await response.json();
      // return data.valid;

      // MOCK: Aceptar código "123456" como válido
      const isValid = code === '123456';

      if (isValid) {
        setWaitingForCode(false);
      }

      console.log('Código verificado (MOCK):', { code, isValid });
      return isValid;
    } catch (error) {
      console.error('Error al verificar código:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resetear contraseña (MOCK)
   *
   * Para integrar con API real:
   * 1. Hacer POST a /api/auth/reset-password con { email, code, newPassword }
   * 2. Manejar respuesta del servidor
   */
  const resetPassword = async (newPassword: string) => {
    setIsLoading(true);

    try {
      // MOCK: Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Reemplazar con llamada real a API
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, newPassword })
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Error al resetear contraseña');
      // }

      console.log('Contraseña reseteada (MOCK):', { email, newPassword });

      // Resetear el flujo después de éxito
      resetFlow();
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resetear el flujo de recuperación
   */
  const resetFlow = () => {
    setEmailSent(false);
    setWaitingForCode(false);
    setEmail('');
  };

  const value: PasswordRecoveryContextType = {
    emailSent,
    waitingForCode,
    email,
    isLoading,
    sendRecoveryEmail,
    verifyCode,
    resetPassword,
    resetFlow,
  };

  return (
    <PasswordRecoveryContext.Provider value={value}>
      {children}
    </PasswordRecoveryContext.Provider>
  );
};
