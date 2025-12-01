/**
 * Tipos para el feature de Matrículas
 */

/**
 * Estados de matrícula
 */
export const EstadoMatricula = {
  ACTIVA: 1,
  RETIRADA: 2,
  CONGELADA: 3,
  FINALIZADA: 4,
} as const;

export type EstadoMatricula = (typeof EstadoMatricula)[keyof typeof EstadoMatricula];

/**
 * Matrícula - Entidad principal
 */
export interface Matricula {
  id: string;
  empresaId: string;
  estudianteId: string;
  periodoLectivoId: string | null;
  planPagoId: string;
  fechaMatricula: string;
  fechaProximoPago: string;
  controlFinalizacion: boolean;
  estado: EstadoMatricula;
  creadoEn: string;
  actualizadoEn: string;
  estudianteNombre: string;
  estudianteApellidos: string;
  estudiantePathFoto: string | null;
  periodoLectivoNombre: string | null;
  planPagoNombre: string;
}

/**
 * Parámetros para listar matrículas
 */
export interface ListarMatriculasParams {
  page?: number;
  limit?: number;
  q?: string;
  estado?: EstadoMatricula;
  periodoLectivoId?: string;
  controlFinalizacion?: boolean;
}

/**
 * Respuesta de listar matrículas
 */
export interface ListarMatriculasResponse {
  success: boolean;
  message: string;
  data: {
    matriculas: Matricula[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Datos para crear una matrícula
 */
export interface CrearMatriculaData {
  estudianteId: string;
  planPagoId: string;
  fechaMatricula: string;
  fechaProximoPago: string;
  controlFinalizacion: boolean;
  periodoLectivoId?: string;
  estado?: EstadoMatricula;
}

/**
 * Datos para actualizar una matrícula
 */
export interface ActualizarMatriculaData {
  periodoLectivoId?: string | null;
  planPagoId?: string;
  fechaMatricula?: string;
  fechaProximoPago?: string;
  controlFinalizacion?: boolean;
  estado?: EstadoMatricula;
}

/**
 * Respuesta de obtener/crear/actualizar matrícula
 */
export interface MatriculaResponse {
  success: boolean;
  message: string;
  data: Matricula;
}

/**
 * Respuesta de eliminar matrícula
 */
export interface EliminarMatriculaResponse {
  success: boolean;
  message: string;
  data: null;
}
