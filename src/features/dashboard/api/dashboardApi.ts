import { apiService } from '../../../shared/services/apiService';
import type { DashboardFilters, DashboardResponse } from '../types/dashboard.types';

export const obtenerDashboardApi = async (filters?: DashboardFilters): Promise<DashboardResponse> => {
  const params = new URLSearchParams();

  if (filters?.periodo) {
    params.append('periodo', filters.periodo);
  }
  if (filters?.fechaInicio) {
    params.append('fechaInicio', filters.fechaInicio);
  }
  if (filters?.fechaFin) {
    params.append('fechaFin', filters.fechaFin);
  }

  const queryString = params.toString();
  const url = queryString ? `dashboard?${queryString}` : 'dashboard';

  return apiService.get<DashboardResponse>(url);
};
