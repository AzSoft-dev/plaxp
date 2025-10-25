import type { ValidationResult } from '../schemas/loginSchema';

/**
 * Validaciones para el formulario de Login
 */
export const LoginValidation = {
  /**
   * Valida el formato del correo electrónico
   */
  email: (value: string): string | null => {
    if (!value) {
      return "El correo electrónico es requerido.";
    }
    if (!value.includes('@') || !value.includes('.')) {
      return "El correo no es válido. Asegúrate de incluir @ y dominio.";
    }
    return null;
  },

  /**
   * Valida la contraseña
   */
  password: (value: string): string | null => {
    if (!value) {
      return "La contraseña es requerida.";
    }
    if (value.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
    return null;
  },

  /**
   * Valida todos los campos del formulario de login
   */
  validateAll: (email: string, password: string): ValidationResult => {
    const emailError = LoginValidation.email(email);
    const passwordError = LoginValidation.password(password);

    const error = emailError || passwordError;

    return {
      isValid: !error,
      error
    };
  }
};
