/**
 * Tipos para el feature de Permisos
 */

/**
 * Permiso - Entidad principal
 */
export interface Permiso {
  id: string;
  codigo: string;
  modulo: string;
  descripcion: string;
  habilitado: boolean;
  creadoEn: string;
}

/**
 * Respuesta de obtener permisos de empresa
 */
export interface ObtenerPermisosEmpresaResponse {
  success: boolean;
  data: Permiso[];
  message: string;
}
