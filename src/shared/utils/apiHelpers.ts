/**
 * Utilidades para trabajar con respuestas de la API
 */

/**
 * Interface para parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Crear parámetros de paginación con valores por defecto
 */
export function createPaginationParams(
  params?: Partial<PaginationParams>
): Required<PaginationParams> {
  return {
    page: params?.page || 1,
    pageSize: params?.pageSize || 10,
    sortBy: params?.sortBy || 'id',
    sortOrder: params?.sortOrder || 'desc',
  };
}

/**
 * Información de paginación calculada
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Calcular información de paginación
 */
export function calculatePaginationInfo(
  page: number,
  totalPages: number,
  totalItems: number,
  pageSize: number
): PaginationInfo {
  return {
    currentPage: page,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    startIndex: (page - 1) * pageSize + 1,
    endIndex: Math.min(page * pageSize, totalItems),
  };
}

/**
 * Generar array de números de página para UI de paginación
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(currentPage - halfVisible, 1);
  let endPage = Math.min(startPage + maxVisible - 1, totalPages);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(endPage - maxVisible + 1, 1);
  }

  // Agregar primera página y ellipsis si es necesario
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push('...');
    }
  }

  // Agregar páginas del rango
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Agregar ellipsis y última página si es necesario
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return pages;
}
