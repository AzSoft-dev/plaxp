/**
 * Tipos para el feature de Roles
 */

/**
 * Rol - Entidad principal
 */
export interface Rol {
  id: string;
  empresaId: string;
  nombre: string;
  descripcion: string;
  esSuperadmin: boolean;
  estado: boolean;
  creadoEn: string;
}

/**
 * Información de paginación
 */
export interface RolPaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

/**
 * Respuesta de listar roles con paginación
 * GET /api/roles
 */
export interface ListarRolesResponse {
  success: boolean;
  message: string;
  data: Rol[];
  pagination: RolPaginationInfo;
}

/**
 * Parámetros para listar roles
 */
export interface ListarRolesParams {
  page?: number;
  pageSize?: number;
  q?: string;
  estado?: 'activo' | 'inactivo' | 'todos';
}

/**
 * Respuesta de obtener todos los roles (sin paginación)
 * GET /api/roles/todos
 */
export interface GetRolesResponse {
  success: boolean;
  data: Rol[];
  message: string;
}

/**
 * Datos para crear un nuevo rol
 * POST /api/roles
 */
export interface CrearRolData {
  nombre: string;
  descripcion: string;
  esSuperadmin: boolean;
  estado: boolean;
}

/**
 * Respuesta de crear rol
 */
export interface CrearRolResponse {
  success: boolean;
  data: Rol;
}

/**
 * Datos para actualizar un rol
 * PUT /api/roles/{id}
 */
export interface ActualizarRolData {
  nombre: string;
  descripcion: string;
  esSuperadmin: boolean;
  estado: boolean;
}

/**
 * Respuesta de actualizar rol
 */
export interface ActualizarRolResponse {
  success: boolean;
  data: Rol;
}

/**
 * Respuesta de obtener rol por ID
 * GET /api/roles/{id}
 */
export interface ObtenerRolResponse {
  success: boolean;
  data: Rol;
}

/**
 * Rol con permisos asignados
 */
export interface RolConPermisos extends Rol {
  permisos: Array<{
    id: string;
    codigo: string;
    modulo: string;
    descripcion: string;
    creadoEn: string;
  }>;
}

/**
 * Respuesta de obtener rol con permisos
 * GET /api/roles/{id}/permisos
 */
export interface ObtenerRolConPermisosResponse {
  success: boolean;
  data: RolConPermisos;
}

/**
 * Datos para asignar permisos a un rol
 * POST /api/roles/{id}/asignar-permisos
 */
export interface AsignarPermisosData {
  permisoIds: string[];
}

/**
 * Respuesta de asignar permisos
 */
export interface AsignarPermisosResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown>;
}
