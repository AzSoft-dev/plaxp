import { apiService } from '../../../shared/services/apiService';
import type {
  ListarEstudiantesResponse,
  ListarEstudiantesParams,
  CrearEstudianteData,
  CrearEstudianteResponse,
  ActualizarEstudianteData,
  ActualizarEstudianteResponse,
  ObtenerEstudianteResponse,
  EliminarEstudianteResponse,
  SincronizarMoodleData,
  SincronizarMoodleResponse,
} from '../types/estudiante.types';

/**
 * Listar estudiantes con filtros y paginación
 * GET /api/estudiantes
 *
 * Query Params:
 *   - page: número de página (default: 1)
 *   - limit: elementos por página (default: 10)
 *   - nombre: búsqueda por nombre o apellidos
 *   - correo: filtro por correo
 *   - identificacion: filtro por identificación
 *   - idMoodle: filtro por ID de Moodle
 *   - estado: filtro por estado (true/false)
 *   - requiereFacturaElectronica: filtro por facturación electrónica (true/false)
 */
export const listarEstudiantesApi = async (
  params?: ListarEstudiantesParams
): Promise<ListarEstudiantesResponse> => {
  // Construir los parámetros de la query
  const queryParams: Record<string, any> = {};

  if (params?.page) {
    queryParams.page = params.page;
  }

  if (params?.limit) {
    queryParams.limit = params.limit;
  }

  if (params?.nombre) {
    queryParams.nombre = params.nombre;
  }

  if (params?.correo) {
    queryParams.correo = params.correo;
  }

  if (params?.identificacion) {
    queryParams.identificacion = params.identificacion;
  }

  if (params?.idMoodle) {
    queryParams.idMoodle = params.idMoodle;
  }

  if (params?.estado !== undefined) {
    queryParams.estado = params.estado;
  }

  if (params?.requiereFacturaElectronica !== undefined) {
    queryParams.requiereFacturaElectronica = params.requiereFacturaElectronica;
  }

  return await apiService.get<ListarEstudiantesResponse>(
    'estudiantes',
    queryParams
  );
};

/**
 * Crear un nuevo estudiante
 * POST /api/estudiantes
 *
 * Integración automática con Moodle:
 * - El username se genera automáticamente si no se proporciona
 * - Se genera una contraseña temporal segura automáticamente
 * - El usuario se crea en Moodle automáticamente
 * - Se guarda el ID de Moodle en el registro del estudiante
 *
 * Campos de Hacienda CR:
 * Si requiereFacturaElectronica=true, los campos de identificación y ubicación son obligatorios.
 */
export const crearEstudianteApi = async (
  data: CrearEstudianteData
): Promise<CrearEstudianteResponse> => {
  return await apiService.post<CrearEstudianteResponse>(
    'estudiantes',
    data
  );
};

/**
 * Obtener un estudiante por ID
 * GET /api/estudiantes/{id}
 *
 * Retorna información detallada del estudiante incluyendo:
 * - Datos básicos (nombre, apellidos, correo, teléfono)
 * - Información de Moodle (ID, usuario, contraseña temporal)
 * - Datos de Hacienda CR (identificación, ubicación)
 * - Fechas (creación, modificación)
 */
export const obtenerEstudiantePorIdApi = async (
  id: string
): Promise<ObtenerEstudianteResponse> => {
  return await apiService.get<ObtenerEstudianteResponse>(`estudiantes/${id}`);
};

/**
 * Actualizar un estudiante existente
 * PUT /api/estudiantes/{id}
 *
 * Todos los campos son opcionales.
 * Solo se actualizan los campos proporcionados.
 */
export const actualizarEstudianteApi = async (
  id: string,
  data: ActualizarEstudianteData
): Promise<ActualizarEstudianteResponse> => {
  return await apiService.put<ActualizarEstudianteResponse>(
    `estudiantes/${id}`,
    data
  );
};

/**
 * Eliminar estudiante (soft delete)
 * DELETE /api/estudiantes/{id}
 *
 * Realiza una eliminación lógica del estudiante.
 * El estudiante no se elimina físicamente de la base de datos.
 */
export const eliminarEstudianteApi = async (
  id: string
): Promise<EliminarEstudianteResponse> => {
  return await apiService.delete<EliminarEstudianteResponse>(`estudiantes/${id}`);
};

/**
 * Sincronizar con Moodle
 * POST /api/estudiantes/{id}/sync-moodle
 *
 * Actualiza la fecha de sincronización y opcionalmente el ID de Moodle.
 */
export const sincronizarMoodleApi = async (
  id: string,
  data?: SincronizarMoodleData
): Promise<SincronizarMoodleResponse> => {
  return await apiService.post<SincronizarMoodleResponse>(
    `estudiantes/${id}/sync-moodle`,
    data
  );
};
