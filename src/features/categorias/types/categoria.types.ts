/**
 * Tipos para el módulo de Categorías
 */

export interface CategoriaPadre {
  id: string;
  nombre: string;
  slug: string;
  nivel: number;
}

export interface CategoriaHijo {
  id: string;
  nombre: string;
  slug: string;
  nivel: number;
}

export interface Categoria {
  id: string;
  empresaId: string;
  parentId: string | null;
  idMoodle?: string | null;
  nombre: string;
  slug: string;
  descripcion?: string | null;
  orden: number;
  nivel: number;
  esVisible: boolean;
  permiteCursos: boolean;
  activo: boolean;
  sincronizadoMoodle: boolean;
  creadoEn: string;
  actualizadoEn: string;
  padre?: CategoriaPadre | null;
  hijos?: CategoriaHijo[];
}

export interface CategoriaConHijos extends Categoria {
  hijos: CategoriaConHijos[];
}

export interface CrearCategoriaData {
  nombre: string;
  slug?: string;
  descripcion?: string;
  parentId?: string | null;
  orden?: number;
  esVisible?: boolean;
  permiteCursos?: boolean;
  idMoodle?: string;
  sincronizadoMoodle?: boolean;
}

export interface ActualizarCategoriaData {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  parentId?: string | null;
  orden?: number;
  esVisible?: boolean;
  permiteCursos?: boolean;
  activo?: boolean;
  idMoodle?: string;
  sincronizadoMoodle?: boolean;
}

export interface ListarCategoriasParams {
  page?: number;
  limit?: number;
  parentId?: string;
  nivel?: number;
  activo?: boolean;
  esVisible?: boolean;
  nombre?: string;
  idMoodle?: string;
}

export interface ListarCategoriasResponse {
  success: boolean;
  data: Categoria[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
  message: string;
}

export interface CategoriaResponse {
  success: boolean;
  data: Categoria;
  message: string;
}

export interface ArbolCategoriasResponse {
  success: boolean;
  data: CategoriaConHijos[];
  message: string;
}
