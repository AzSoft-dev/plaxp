import { apiService } from '../../../shared/services/apiService';
import type {
  ListarSucursalesResponse,
  ListarSucursalesParams,
  CrearSucursalData,
  CrearSucursalResponse,
  ActualizarSucursalData,
  ActualizarSucursalResponse,
  ObtenerSucursalResponse,
  EliminarSucursalResponse,
  ObtenerTodasSucursalesResponse,
} from '../types/sucursal.types';

/**
 * Listar sucursales con paginación
 * GET /api/sucursales
 */
export const listarSucursalesApi = async (
  params: ListarSucursalesParams
): Promise<ListarSucursalesResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.nombre) queryParams.append('nombre', params.nombre);
  if (params.estado !== undefined) queryParams.append('estado', params.estado.toString());

  const url = `sucursales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  return await apiService.get<ListarSucursalesResponse>(url);
};

/**
 * Crear una nueva sucursal
 * POST /api/sucursales
 */
export const crearSucursalApi = async (data: CrearSucursalData): Promise<CrearSucursalResponse> => {
  return await apiService.post<CrearSucursalResponse>('sucursales', data);
};

/**
 * Obtener una sucursal por ID
 * GET /api/sucursales/{id}
 */
export const obtenerSucursalPorIdApi = async (id: string): Promise<ObtenerSucursalResponse> => {
  return await apiService.get<ObtenerSucursalResponse>(`sucursales/${id}`);
};

/**
 * Actualizar una sucursal
 * PATCH /api/sucursales/{id}
 */
export const actualizarSucursalApi = async (
  id: string,
  data: ActualizarSucursalData
): Promise<ActualizarSucursalResponse> => {
  return await apiService.patch<ActualizarSucursalResponse>(`sucursales/${id}`, data);
};

/**
 * Eliminar una sucursal (soft delete)
 * DELETE /api/sucursales/{id}
 */
export const eliminarSucursalApi = async (id: string): Promise<EliminarSucursalResponse> => {
  return await apiService.delete<EliminarSucursalResponse>(`sucursales/${id}`);
};

/**
 * Obtener todas las sucursales activas (sin paginación)
 * GET /api/sucursales/todas
 * Útil para dropdowns, selectores y filtros
 */
export const obtenerTodasSucursalesApi = async (): Promise<ObtenerTodasSucursalesResponse> => {
  return await apiService.get<ObtenerTodasSucursalesResponse>('sucursales/todas');
};
