import { apiService } from '../../../shared/services/apiService';
import type {
  ListarMatriculasParams,
  ListarMatriculasResponse,
  Matricula,
  CrearMatriculaData,
  ActualizarMatriculaData,
  MatriculaResponse,
  EliminarMatriculaResponse,
} from '../types/matricula.types';
import type { MatriculaPago } from '../../matriculasPagos/types/matriculaPago.types';

/**
 * Listar matrículas con filtros opcionales
 * GET /api/matriculas
 *
 * Filtros disponibles:
 *   - q: Búsqueda por nombre/apellido del estudiante
 *   - estado: 1=ACTIVA, 2=RETIRADA, 3=CONGELADA, 4=FINALIZADA
 *   - periodoLectivoId: Filtrar por período lectivo
 *   - controlFinalizacion: boolean
 *   - page: Número de página
 *   - limit: Elementos por página (max 100)
 */
export const listarMatriculasApi = async (
  params?: ListarMatriculasParams
): Promise<ListarMatriculasResponse> => {
  const queryParams: Record<string, any> = {};

  if (params?.page) {
    queryParams.page = params.page;
  }

  if (params?.limit) {
    queryParams.limit = params.limit;
  }

  if (params?.q) {
    queryParams.q = params.q;
  }

  if (params?.estado) {
    queryParams.estado = params.estado;
  }

  if (params?.periodoLectivoId) {
    queryParams.periodoLectivoId = params.periodoLectivoId;
  }

  if (params?.controlFinalizacion !== undefined) {
    queryParams.controlFinalizacion = params.controlFinalizacion;
  }

  return await apiService.get<ListarMatriculasResponse>('matriculas', queryParams);
};

/**
 * Obtener una matrícula por ID
 * GET /api/matriculas/{id}
 */
export const obtenerMatriculaPorIdApi = async (
  id: string
): Promise<MatriculaResponse> => {
  return await apiService.get<MatriculaResponse>(`matriculas/${id}`);
};

/**
 * Crear una matrícula
 * POST /api/matriculas
 *
 * Reglas:
 *   - planPagoId: Siempre requerido
 *   - periodoLectivoId: Requerido si controlFinalizacion=true
 */
export const crearMatriculaApi = async (
  data: CrearMatriculaData
): Promise<MatriculaResponse> => {
  return await apiService.post<MatriculaResponse>('matriculas', data);
};

/**
 * Actualizar una matrícula
 * PUT /api/matriculas/{id}
 *
 * Nota: Las matrículas generalmente no se editan,
 * pero se puede usar para actualizar fechaProximoPago
 */
export const actualizarMatriculaApi = async (
  id: string,
  data: ActualizarMatriculaData
): Promise<MatriculaResponse> => {
  return await apiService.put<MatriculaResponse>(`matriculas/${id}`, data);
};

/**
 * Eliminar una matrícula
 * DELETE /api/matriculas/{id}
 */
export const eliminarMatriculaApi = async (
  id: string
): Promise<EliminarMatriculaResponse> => {
  return await apiService.delete<EliminarMatriculaResponse>(`matriculas/${id}`);
};

/**
 * Validar si existe matrícula duplicada
 * GET /api/matriculas?estudianteId=X&periodoLectivoId=Y
 */
export const validarMatriculaDuplicadaApi = async (
  estudianteId: string,
  periodoLectivoId?: string
): Promise<boolean> => {
  const params: Record<string, any> = {
    estudianteId,
    limit: 1,
  };

  if (periodoLectivoId) {
    params.periodoLectivoId = periodoLectivoId;
  }

  const response = await apiService.get<ListarMatriculasResponse>('matriculas', params);
  return response.data.matriculas.length > 0;
};

/**
 * Obtener pagos de una matrícula
 * GET /api/matriculas/{id}/pagos
 */
export const obtenerPagosDeMatriculaApi = async (
  matriculaId: string
): Promise<{ success: boolean; data: MatriculaPago[] }> => {
  return await apiService.get<{ success: boolean; data: MatriculaPago[] }>(
    `matriculas/${matriculaId}/pagos`
  );
};

// Re-exportar tipos útiles
export type { Matricula };
