/**
 * Exportaciones del módulo Profesores
 */

// Types
export type {
  Profesor,
  CrearProfesorData,
  ActualizarProfesorData,
  ListarProfesoresParams,
  ListarProfesoresResponse,
  CrearProfesorResponse,
  ActualizarProfesorResponse,
  ObtenerProfesorResponse,
  EliminarProfesorResponse,
} from './types/profesor.types';

// API
export {
  listarProfesoresApi,
  crearProfesorApi,
  obtenerProfesorPorIdApi,
  actualizarProfesorApi,
  eliminarProfesorApi,
} from './api/profesoresApi';

// Components
export { CredentialsScreen } from './components/CredentialsScreen';

// Pages
export { ProfesoresPage } from './pages/ProfesoresPage';
export { CreateEditProfesorPage } from './pages/CreateEditProfesorPage';
export { ViewProfesorPage } from './pages/ViewProfesorPage';
