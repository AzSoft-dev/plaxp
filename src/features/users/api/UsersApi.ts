import { apiService } from '../../../shared/services/apiService';
import type {
  ListarUsuariosResponse,
  ListarUsuariosParams,
  CrearUsuarioData,
  CrearUsuarioResponse,
  ActualizarUsuarioData,
  ActualizarUsuarioResponse,
  ObtenerUsuarioResponse,
} from '../types/user.types';

/**
 * Listar usuarios con filtros y búsqueda
 * GET /api/usuarios
 *
 * Query Params:
 *   - page: número de página (default: 1)
 *   - pageSize: elementos por página (default: 10, max: 100)
 *   - estado: 'activo' | 'inactivo' | 'todos' (default: 'activo')
 *   - q: búsqueda en nombre y correo
 *
 * BÚSQUEDA INTELIGENTE:
 *   1. Primero busca EXACTO (nombre = q OR correo = q)
 *   2. Si encuentra SOLO 1 resultado → Lo retorna
 *   3. Si NO encuentra 1 exacto → Busca LIKE (nombre LIKE %q% OR correo LIKE %q%)
 */
export const listarUsuariosApi = async (
  params?: ListarUsuariosParams
): Promise<ListarUsuariosResponse> => {
  // Construir los parámetros de la query
  const queryParams: Record<string, any> = {};

  if (params?.page) {
    queryParams.page = params.page;
  }

  if (params?.pageSize) {
    queryParams.pageSize = params.pageSize;
  }

  if (params?.estado) {
    queryParams.estado = params.estado;
  }

  if (params?.q) {
    queryParams.q = params.q;
  }

  return await apiService.get<ListarUsuariosResponse>(
    'usuarios',
    queryParams
  );
};

/**
 * Crear un nuevo usuario
 * POST /api/usuarios
 *
 * Body (el frontend convierte estado boolean a número antes de enviar):
 * {
 *   "nombre": "Juan Pérez",
 *   "correo": "juan@example.com",
 *   "contrasena": "Password123!",
 *   "estado": 1,  // 1 = activo, 0 = inactivo
 *   "idRol": "2"
 * }
 */
export const crearUsuarioApi = async (
  data: CrearUsuarioData
): Promise<CrearUsuarioResponse> => {
  return await apiService.post<CrearUsuarioResponse>(
    'usuarios',
    data
  );
};

/**
 * Obtener un usuario por ID
 * GET /api/usuarios/{id}
 *
 * Retorna información detallada del usuario incluyendo:
 * - Datos básicos (nombre, correo, estado)
 * - Información del rol
 * - Fechas (creación, último login, modificación)
 */
export const obtenerUsuarioPorIdApi = async (
  id: string
): Promise<ObtenerUsuarioResponse> => {
  return await apiService.get<ObtenerUsuarioResponse>(`usuarios/${id}`);
};

/**
 * Actualizar un usuario existente
 * PUT /api/usuarios/{id}
 *
 * Body (el frontend convierte estado boolean a número antes de enviar):
 * {
 *   "nombre": "Juan Pérez",
 *   "correo": "juan@example.com",
 *   "contrasena": "Password123!", // Opcional
 *   "estado": 1,  // 1 = activo, 0 = inactivo
 *   "idRol": "2"
 * }
 */
export const actualizarUsuarioApi = async (
  id: string,
  data: ActualizarUsuarioData
): Promise<ActualizarUsuarioResponse> => {
  return await apiService.put<ActualizarUsuarioResponse>(
    `usuarios/${id}`,
    data
  );
};
