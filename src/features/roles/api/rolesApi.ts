import { apiService } from '../../../shared/services/apiService';
import type {
  ListarRolesResponse,
  ListarRolesParams,
  CrearRolData,
  CrearRolResponse,
  ActualizarRolData,
  ActualizarRolResponse,
  ObtenerRolResponse,
  ObtenerRolConPermisosResponse,
  AsignarPermisosData,
  AsignarPermisosResponse,
} from '../types/role.types';

/**
 * Listar roles con paginación
 * GET /api/roles
 */
export const listarRolesApi = async (
  params: ListarRolesParams
): Promise<ListarRolesResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.q) queryParams.append('q', params.q);

  const url = `roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  return await apiService.get<ListarRolesResponse>(url);
};

/**
 * Crear un nuevo rol
 * POST /api/roles
 */
export const crearRolApi = async (data: CrearRolData): Promise<CrearRolResponse> => {
  return await apiService.post<CrearRolResponse>('roles', data);
};

/**
 * Obtener un rol por ID
 * GET /api/roles/{id}
 */
export const obtenerRolPorIdApi = async (id: string): Promise<ObtenerRolResponse> => {
  return await apiService.get<ObtenerRolResponse>(`roles/${id}`);
};

/**
 * Obtener un rol con sus permisos asignados
 * GET /api/roles/{id}/permisos
 */
export const obtenerRolConPermisosApi = async (id: string): Promise<ObtenerRolConPermisosResponse> => {
  return await apiService.get<ObtenerRolConPermisosResponse>(`roles/${id}/permisos`);
};

/**
 * Actualizar un rol
 * PUT /api/roles/{id}
 */
export const actualizarRolApi = async (
  id: string,
  data: ActualizarRolData
): Promise<ActualizarRolResponse> => {
  return await apiService.put<ActualizarRolResponse>(`roles/${id}`, data);
};

/**
 * Asignar permisos a un rol
 * POST /api/roles/{id}/asignar-permisos
 */
export const asignarPermisosApi = async (
  id: string,
  data: AsignarPermisosData
): Promise<AsignarPermisosResponse> => {
  return await apiService.post<AsignarPermisosResponse>(
    `roles/${id}/asignar-permisos`,
    data
  );
};
