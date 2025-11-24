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
  upload: 60000,       // 60 segundos para uploads (imágenes máx 1MB)
  download: 120000,    // 2 minutos para downloads
} as const;

/**
 * Headers comunes
 */
export const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;
