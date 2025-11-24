/**
 * API functions para Categorías
 */

import { apiService } from '../../../shared/services/apiService';
import type {
  ListarCategoriasParams,
  ListarCategoriasResponse,
  CategoriaResponse,
  ArbolCategoriasResponse,
  CrearCategoriaData,
  ActualizarCategoriaData,
} from '../types/categoria.types';

/**
 * Lista todas las categorías con paginación y filtros
 */
export const listarCategoriasApi = async (
  params: ListarCategoriasParams = {}
): Promise<ListarCategoriasResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.parentId !== undefined) queryParams.append('parentId', params.parentId);
  if (params.nivel) queryParams.append('nivel', params.nivel.toString());
  if (params.activo !== undefined) queryParams.append('activo', params.activo.toString());
  if (params.esVisible !== undefined) queryParams.append('esVisible', params.esVisible.toString());
  if (params.nombre) queryParams.append('q', params.nombre);
  if (params.idMoodle) queryParams.append('idMoodle', params.idMoodle);

  const url = `categorias${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiService.get<ListarCategoriasResponse>(url);
};

/**
 * Obtiene el árbol completo de categorías
 */
export const obtenerArbolCategoriasApi = async (
  activo?: boolean,
  esVisible?: boolean
): Promise<ArbolCategoriasResponse> => {
  const queryParams = new URLSearchParams();

  if (activo !== undefined) queryParams.append('activo', activo.toString());
  if (esVisible !== undefined) queryParams.append('esVisible', esVisible.toString());

  const url = `categorias/arbol${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiService.get<ArbolCategoriasResponse>(url);
};

/**
 * Obtiene una categoría por ID
 */
export const obtenerCategoriaPorIdApi = async (id: string): Promise<CategoriaResponse> => {
  return await apiService.get<CategoriaResponse>(`categorias/${id}`);
};

/**
 * Crea una nueva categoría
 */
export const crearCategoriaApi = async (data: CrearCategoriaData): Promise<CategoriaResponse> => {
  return await apiService.post<CategoriaResponse>('categorias', data);
};

/**
 * Actualiza una categoría existente
 */
export const actualizarCategoriaApi = async (
  id: string,
  data: ActualizarCategoriaData
): Promise<CategoriaResponse> => {
  return await apiService.put<CategoriaResponse>(`categorias/${id}`, data);
};

/**
 * Elimina una categoría (soft delete)
 */
export const eliminarCategoriaApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  return await apiService.delete<{ success: boolean; message: string }>(`categorias/${id}`);
};
