/**
 * Schemas de respuesta de la API de Seguridad
 */

/**
 * Permiso del usuario
 */
export interface Permiso {
  id: string;
  codigo: string;
  modulo: string;
  descripcion: string;
}

/**
 * Usuario autenticado
 */
export interface User {
  id: string;
  idEmpresa: string;
  nombre: string;
  correo: string;
  estado: boolean | string;
  ultimoLogin?: string;
  creadoEn?: string;
  idRol?: string;
  nombreRol?: string;
  idSucursalPrincipal?: string;
  idSucursales?: string[];
  pathFoto?: string | null;
  permisos?: Permiso[];
}

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
}

/**
 * Respuesta del endpoint de solicitar recuperación de contraseña
 */
export interface RecuperacionResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  } | null;
}

/**
 * Respuesta del endpoint de verificar código de recuperación
 */
export interface VerificarCodigoResponse {
  success: boolean;
  message: string;
  data: {
    codigoValido: boolean;
  } | null;
}

/**
 * Respuesta del endpoint de restablecer contraseña
 */
export interface RestablecerContrasenaResponse {
  success: boolean;
  message: string;
  data: null;
}
