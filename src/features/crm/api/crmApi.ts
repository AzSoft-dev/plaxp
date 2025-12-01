import { apiService } from '../../../shared/services/apiService';
import type {
  ListarEtapasResponse,
  CrearEtapaData,
  CrearEtapaResponse,
  ActualizarEtapaData,
  ActualizarEtapaResponse,
  ObtenerEtapaResponse,
  EliminarEtapaResponse,
  ObtenerTableroResponse,
  CrearLeadData,
  CrearLeadResponse,
  ActualizarLeadData,
  ActualizarLeadResponse,
  EliminarLeadResponse,
  MoverLeadData,
  MoverLeadResponse,
} from '../types/crm.types';

// ==================== ETAPAS ====================

/**
 * Listar todas las etapas del pipeline
 * GET /api/crm/etapas
 */
export const listarEtapasApi = async (): Promise<ListarEtapasResponse> => {
  return await apiService.get<ListarEtapasResponse>('crm/etapas');
};

/**
 * Obtener una etapa por ID
 * GET /api/crm/etapas/{id}
 */
export const obtenerEtapaPorIdApi = async (
  id: string
): Promise<ObtenerEtapaResponse> => {
  return await apiService.get<ObtenerEtapaResponse>(`crm/etapas/${id}`);
};

/**
 * Crear una nueva etapa
 * POST /api/crm/etapas
 */
export const crearEtapaApi = async (
  data: CrearEtapaData
): Promise<CrearEtapaResponse> => {
  return await apiService.post<CrearEtapaResponse>('crm/etapas', data);
};

/**
 * Actualizar una etapa
 * PUT /api/crm/etapas/{id}
 */
export const actualizarEtapaApi = async (
  id: string,
  data: ActualizarEtapaData
): Promise<ActualizarEtapaResponse> => {
  return await apiService.put<ActualizarEtapaResponse>(`crm/etapas/${id}`, data);
};

/**
 * Eliminar una etapa
 * DELETE /api/crm/etapas/{id}
 */
export const eliminarEtapaApi = async (
  id: string
): Promise<EliminarEtapaResponse> => {
  return await apiService.delete<EliminarEtapaResponse>(`crm/etapas/${id}`);
};

// ==================== TABLERO ====================

/**
 * Obtener el tablero completo (Kanban)
 * GET /api/crm/tablero
 */
export const obtenerTableroApi = async (): Promise<ObtenerTableroResponse> => {
  return await apiService.get<ObtenerTableroResponse>('crm/tablero');
};

// ==================== LEADS ====================

/**
 * Crear un nuevo lead
 * POST /api/crm/leads
 */
export const crearLeadApi = async (
  data: CrearLeadData
): Promise<CrearLeadResponse> => {
  return await apiService.post<CrearLeadResponse>('crm/leads', data);
};

/**
 * Actualizar un lead
 * PUT /api/crm/leads/{id}
 */
export const actualizarLeadApi = async (
  id: string,
  data: ActualizarLeadData
): Promise<ActualizarLeadResponse> => {
  return await apiService.put<ActualizarLeadResponse>(`crm/leads/${id}`, data);
};

/**
 * Eliminar un lead
 * DELETE /api/crm/leads/{id}
 */
export const eliminarLeadApi = async (
  id: string
): Promise<EliminarLeadResponse> => {
  return await apiService.delete<EliminarLeadResponse>(`crm/leads/${id}`);
};

/**
 * Mover un lead a otra etapa
 * PATCH /api/crm/leads/{id}/mover
 */
export const moverLeadApi = async (
  id: string,
  data: MoverLeadData
): Promise<MoverLeadResponse> => {
  return await apiService.patch<MoverLeadResponse>(`crm/leads/${id}/mover`, data);
};
