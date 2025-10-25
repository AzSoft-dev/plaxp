import { apiService } from '../../../shared/services/apiService';

/**
 * Tipos de respuesta de la API
 */
export interface User {
  id: string;
  idEmpresa: string;
  nombre: string;
  correo: string;
  estado: boolean;
  ultimoLogin: string;
  creadoEn: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
}

/**
 * Login
 * POST /seguridad/login
 */
export const loginApi = async (correo: string, contrasena: string): Promise<LoginResponse> => {
  return await apiService.post<LoginResponse>(
    'seguridad/login',
    { correo, contrasena },
    { skipAuth: true }
  );
};
