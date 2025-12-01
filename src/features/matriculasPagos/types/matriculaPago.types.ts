/**
 * Tipos para el feature de Pagos de Matrículas
 */

/**
 * Estados de pago
 */
export const EstadoPago = {
  PENDIENTE: 1,
  PAGADO: 2,
  VENCIDO: 3,
  ANULADO: 4,
} as const;

export type EstadoPago = (typeof EstadoPago)[keyof typeof EstadoPago];

/**
 * Pago de matrícula - Entidad principal
 */
export interface MatriculaPago {
  id: string;
  matriculaId: string;
  empresaId: string;
  numeroPago: number;
  fechaGenerado: string;
  fechaVencimiento: string;
  subtotal: number;
  total: number;
  estado: EstadoPago;
  fechaPago: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  estudianteNombre: string;
  estudianteApellidos: string;
  planPagoNombre: string;
}

/**
 * Parámetros para listar pagos
 */
export interface ListarMatriculasPagosParams {
  page?: number;
  limit?: number;
  q?: string;
  matriculaId?: string;
  estado?: EstadoPago;
  fechaVencimientoDesde?: string;
  fechaVencimientoHasta?: string;
}

/**
 * Respuesta de listar pagos
 */
export interface ListarMatriculasPagosResponse {
  success: boolean;
  message: string;
  data: {
    pagos: MatriculaPago[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Abono - Pago parcial o completo
 */
export interface Abono {
  id: string;
  matriculaPagoId: string;
  usuarioId: string;
  metodoPago: string;
  fechaAbono: string;
  monto: number;
  referencia: string | null;
  nota: string | null;
  usuarioNombre: string;
}

/**
 * Datos para crear un pago de matrícula
 */
export interface CrearMatriculaPagoData {
  matriculaId: string;
  numeroPago: number;
  subtotal: number;
  total: number;
  fechaVencimiento?: string;
  fechaGenerado?: string;
  estado?: EstadoPago;
}

/**
 * Respuesta de crear pago de matrícula
 */
export interface CrearMatriculaPagoResponse {
  success: boolean;
  message: string;
  data: MatriculaPago;
}

/**
 * Datos para crear un abono
 */
export interface CrearAbonoData {
  matriculaPagoId: string;
  metodoPago: string;
  monto: number;
  fechaAbono?: string;
  referencia?: string;
  nota?: string;
}

/**
 * Respuesta de crear abono
 */
export interface CrearAbonoResponse {
  success: boolean;
  data: Abono;
}

/**
 * Resumen de abonos de un pago
 */
export interface ResumenAbonos {
  matriculaPagoId: string;
  totalPago: number;
  totalAbonado: number;
  saldoPendiente: number;
  abonos: Abono[];
}

/**
 * Respuesta de resumen de abonos
 */
export interface ResumenAbonosResponse {
  success: boolean;
  data: ResumenAbonos;
}
