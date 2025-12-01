export interface DashboardFilters {
  periodo?: 'hoy' | 'semana' | 'mes' | 'trimestre' | 'anio' | 'todo';
  fechaInicio?: string;
  fechaFin?: string;
}

export interface EmpresaInfo {
  id: string;
  nombre: string;
  identificacion: string;
  correo: string;
  estado: boolean;
}

export interface FiltrosInfo {
  fechaInicio: string;
  fechaFin: string;
  periodoDescripcion: string;
}

export interface MetodoPago {
  metodo: string;
  total: number;
  cantidad: number;
}

export interface TendenciaRecaudacion {
  periodo: string;
  total: number;
}

export interface FinancieroData {
  totalRecaudado: number;
  pagosCompletados: number;
  montoPendiente: number;
  cantidadPendientes: number;
  montoVencido: number;
  cantidadVencidos: number;
  porMetodoPago: MetodoPago[];
  tendenciaRecaudacion: TendenciaRecaudacion[];
}

export interface EstudiantesData {
  total: number;
  activos: number;
  inactivos: number;
  nuevosEnPeriodo: number;
  sincronizadosMoodle: number;
}

export interface MatriculasData {
  total: number;
  activas: number;
  retiradas: number;
  congeladas: number;
  finalizadas: number;
  nuevasEnPeriodo: number;
}

export interface CursosData {
  total: number;
  activos: number;
  sincronizadosMoodle: number;
}

export interface ProfesoresData {
  total: number;
  activos: number;
  conCursosAsignados: number;
}

export interface CategoriasData {
  total: number;
  activas: number;
}

export interface AcademicoData {
  estudiantes: EstudiantesData;
  matriculas: MatriculasData;
  cursos: CursosData;
  profesores: ProfesoresData;
  categorias: CategoriasData;
}

export interface UsuariosData {
  total: number;
  activos: number;
  inactivos: number;
  conRolAsignado: number;
  nuevosEnPeriodo: number;
}

export interface KPIsData {
  tasaConversion: number;
  tasaMorosidad: number;
  ticketPromedio: number;
  tasaDesercion: number;
}

export interface UltimaMatricula {
  id: string;
  estudianteNombre: string;
  planPagoNombre: string;
  estado: number;
  fechaMatricula: string;
}

export interface UltimoPago {
  id: string;
  estudianteNombre: string;
  monto: number;
  metodoPago: string;
  fechaAbono: string;
}

export interface UltimoEstudiante {
  id: string;
  nombreCompleto: string;
  correo: string;
  estado: boolean;
  fechaCreacion: string;
}

export interface ActividadReciente {
  ultimasMatriculas: UltimaMatricula[];
  ultimosPagos: UltimoPago[];
  ultimosEstudiantes: UltimoEstudiante[];
}

export interface DashboardData {
  empresa: EmpresaInfo;
  filtros: FiltrosInfo;
  financiero: FinancieroData;
  academico: AcademicoData;
  usuarios: UsuariosData;
  kpis: KPIsData;
  actividadReciente: ActividadReciente;
  fechaGeneracion: string;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message: string;
}
