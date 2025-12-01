/**
 * Tipos para el feature de CRM Pipeline
 */

/**
 * Tipos de sistema para etapas
 */
export const TipoSistema = {
  PROCESO: 'PROCESO',
  GANADO: 'GANADO',
  PERDIDO: 'PERDIDO',
} as const;

export type TipoSistema = (typeof TipoSistema)[keyof typeof TipoSistema];

/**
 * Etapa del pipeline CRM
 */
export interface CrmEtapa {
  id: string;
  nombre: string;
  color: string;
  orden: number;
  tipoSistema: TipoSistema;
  activo: boolean;
  empresaId?: string;
  fechaCreacion?: string;
  ultimaModificacion?: string;
}

/**
 * Relaciones de contacto
 * PROPIO: El contacto es el mismo estudiante
 * PADRE: El contacto es el padre
 * MADRE: El contacto es la madre
 * OTRO: Tutor legal, abuelo, etc.
 */
export const RelacionContacto = {
  PROPIO: 'PROPIO',
  PADRE: 'PADRE',
  MADRE: 'MADRE',
  OTRO: 'OTRO',
} as const;

export type RelacionContacto = (typeof RelacionContacto)[keyof typeof RelacionContacto];

/**
 * Contacto del lead (respuesta del API)
 */
export interface CrmLeadContacto {
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  relacion: RelacionContacto;
}

/**
 * Alumno del lead (respuesta del API)
 */
export interface CrmLeadAlumno {
  nombre: string;
  apellido: string;
  fechaNacimiento: string | null;
}

/**
 * Negociación del lead (respuesta del API)
 */
export interface CrmLeadNegociacion {
  cursoId: string | null;
  etapaId: string;
  etapa?: CrmEtapa;
  origen: string | null;
  montoEstimado: number | null;
  fechaUltimoContacto: string | null;
}

/**
 * Lead/Prospecto en el CRM (respuesta del API)
 */
export interface CrmLead {
  id: string;
  contacto: CrmLeadContacto;
  alumno: CrmLeadAlumno;
  negociacion: CrmLeadNegociacion;
  asignaciones: any[];
  fechaCreacion: string;
  ultimoCambio: string;
}

/**
 * Columna del tablero Kanban (respuesta del API)
 */
export interface CrmTableroColumna {
  etapa: CrmEtapa;
  leads: CrmLead[];
  total: number;
}

/**
 * Respuesta del tablero completo
 * GET /api/crm/tablero
 */
export interface ObtenerTableroResponse {
  success: boolean;
  message?: string;
  data: CrmTableroColumna[];
}

/**
 * Respuesta de listar etapas
 * GET /api/crm/etapas
 */
export interface ListarEtapasResponse {
  success: boolean;
  message: string;
  data: CrmEtapa[];
}

/**
 * Datos para crear una etapa
 * POST /api/crm/etapas
 */
export interface CrearEtapaData {
  nombre: string;
  color: string;
  orden?: number;
  tipoSistema: TipoSistema;
  activo?: boolean;
}

/**
 * Respuesta de crear etapa
 */
export interface CrearEtapaResponse {
  success: boolean;
  message: string;
  data: CrmEtapa;
}

/**
 * Datos para actualizar una etapa
 * PUT /api/crm/etapas/{id}
 */
export interface ActualizarEtapaData {
  nombre?: string;
  color?: string;
  orden?: number;
  tipoSistema?: TipoSistema;
  activo?: boolean;
}

/**
 * Respuesta de actualizar etapa
 */
export interface ActualizarEtapaResponse {
  success: boolean;
  message: string;
  data: CrmEtapa;
}

/**
 * Respuesta de obtener etapa por ID
 * GET /api/crm/etapas/{id}
 */
export interface ObtenerEtapaResponse {
  success: boolean;
  message: string;
  data: CrmEtapa;
}

/**
 * Respuesta de eliminar etapa
 * DELETE /api/crm/etapas/{id}
 */
export interface EliminarEtapaResponse {
  success: boolean;
  message: string;
  data: null;
}

/**
 * Datos para mover un lead entre etapas
 * PATCH /api/crm/leads/{id}/mover
 */
export interface MoverLeadData {
  etapaId: string;
}

/**
 * Respuesta de mover lead
 */
export interface MoverLeadResponse {
  success: boolean;
  message: string;
  data: CrmLead;
}

/**
 * Contacto para crear/actualizar lead
 */
export interface LeadContactoInput {
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  relacion: RelacionContacto;
}

/**
 * Alumno para crear/actualizar lead
 */
export interface LeadAlumnoInput {
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
}

/**
 * Negociación para crear lead
 */
export interface LeadNegociacionInput {
  cursoId?: string;
  origen?: string;
  etapaId: string;
  montoEstimado?: number;
}

/**
 * Negociación para actualizar lead (sin etapaId)
 */
export interface LeadNegociacionUpdateInput {
  cursoId?: string;
  origen?: string;
  montoEstimado?: number;
}

/**
 * Datos para crear un lead
 * POST /api/crm/leads
 */
export interface CrearLeadData {
  contacto: LeadContactoInput;
  alumno: LeadAlumnoInput;
  negociacion: LeadNegociacionInput;
}

/**
 * Respuesta de crear lead
 */
export interface CrearLeadResponse {
  success: boolean;
  message: string;
  data: CrmLead;
}

/**
 * Datos para actualizar un lead
 * PUT /api/crm/leads/{id}
 */
export interface ActualizarLeadData {
  contacto?: Partial<LeadContactoInput>;
  alumno?: Partial<LeadAlumnoInput>;
  negociacion?: LeadNegociacionUpdateInput;
}

/**
 * Respuesta de actualizar lead
 */
export interface ActualizarLeadResponse {
  success: boolean;
  message: string;
  data: CrmLead;
}

/**
 * Respuesta de eliminar lead
 * DELETE /api/crm/leads/{id}
 */
export interface EliminarLeadResponse {
  success: boolean;
  message: string;
  data: null;
}

/**
 * Colores predefinidos para etapas
 */
export const COLORES_ETAPA = [
  { value: '#3B82F6', label: 'Azul', class: 'bg-blue-500' },
  { value: '#8B5CF6', label: 'Violeta', class: 'bg-violet-500' },
  { value: '#EC4899', label: 'Rosa', class: 'bg-pink-500' },
  { value: '#EF4444', label: 'Rojo', class: 'bg-red-500' },
  { value: '#F97316', label: 'Naranja', class: 'bg-orange-500' },
  { value: '#EAB308', label: 'Amarillo', class: 'bg-yellow-500' },
  { value: '#22C55E', label: 'Verde', class: 'bg-green-500' },
  { value: '#14B8A6', label: 'Teal', class: 'bg-teal-500' },
  { value: '#06B6D4', label: 'Cyan', class: 'bg-cyan-500' },
  { value: '#6366F1', label: 'Indigo', class: 'bg-indigo-500' },
];
