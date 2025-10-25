/**
 * Configuración centralizada de la API
 */

/**
 * URL base de la API
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Configuración de timeouts
 */
export const API_TIMEOUTS = {
  default: 30000,      // 30 segundos
  upload: 300000,      // 5 minutos para uploads
  download: 300000,    // 5 minutos para downloads
} as const;

/**
 * Headers comunes
 */
export const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;
