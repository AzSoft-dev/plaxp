import { apiService } from '../../../shared/services/apiService';
import type { GetRolesResponse } from '../types/role.types';

/**
 * Obtener todos los roles
 * GET /api/roles/todos
 *
 * Requiere autenticación con cookie token
 *
 * Respuesta:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "1",
 *       "empresaId": "1",
 *       "nombre": "Administrador",
 *       "descripcion": "Rol con acceso completo",
 *       "esSuperadmin": false,
 *       "creadoEn": "2025-11-07T07:06:29.851Z"
 *     }
 *   ],
 *   "message": "string"
 * }
 */
export const getRoles = async (): Promise<GetRolesResponse> => {
  return await apiService.get<GetRolesResponse>('roles/todos');
};
