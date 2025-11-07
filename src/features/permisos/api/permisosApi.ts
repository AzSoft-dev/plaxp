import { apiService } from '../../../shared/services/apiService';
import type { ObtenerPermisosEmpresaResponse } from '../types/permiso.types';

/**
 * Obtener todos los permisos de la empresa
 * GET /api/permisos/empresa
 */
export const obtenerPermisosEmpresaApi = async (): Promise<ObtenerPermisosEmpresaResponse> => {
  return await apiService.get<ObtenerPermisosEmpresaResponse>('permisos/empresa');
};
