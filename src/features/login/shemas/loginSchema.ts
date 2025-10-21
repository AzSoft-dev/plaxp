/**
 * Esquema de Validación para Login
 * Simula una librería de validación como Joi o Yup
 */

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export const LoginSchema = {
  /**
   * Valida el formato del correo electrónico
   * @param value - Correo electrónico a validar
   * @returns Mensaje de error o null si es válido
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
   * @param value - Contraseña a validar
   * @returns Mensaje de error o null si es válido
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
   * @param email - Correo electrónico
   * @param password - Contraseña
   * @returns Objeto con el resultado de la validación
   */
  validateAll: (email: string, password: string): ValidationResult => {
    const emailError = LoginSchema.email(email);
    const passwordError = LoginSchema.password(password);

    const error = emailError || passwordError;

    return {
      isValid: !error,
      error
    };
  }
};
