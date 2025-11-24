import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import PaginatedDataTable, {
  type PaginatedResponse,
  type ColumnDefinition,
  type BaseItem,
  type StatusOption
} from '../../../shared/components/PaginatedDataTable';
import { listarProfesoresApi } from '../api/profesoresApi';
import type { Profesor } from '../types/profesor.types';
import { obtenerTodasSucursalesApi } from '../../sucursales/api/sucursalesApi';
import type { Sucursal } from '../../sucursales/types/sucursal.types';

// Interfaz de Profesor extendida para el componente
interface Teacher extends BaseItem {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  identificacion: string;
  sucursalPrincipal: string;
  idMoodle: string;
  estado: JSX.Element;
}

// Definir columnas
const columns: ColumnDefinition<Teacher>[] = [
  { key: 'nombreCompleto', header: 'Nombre Completo' },
  { key: 'correo', header: 'Correo Electrónico' },
  { key: 'telefono', header: 'Teléfono' },
  { key: 'identificacion', header: 'Identificación' },
  { key: 'sucursalPrincipal', header: 'Sucursal Principal' },
  { key: 'idMoodle', header: 'ID Moodle' },
  { key: 'estado', header: 'Estado' },
];

// Definir opciones de estado
const statusOptions: StatusOption[] = [
  { label: 'Activo', value: 'true', color: 'green' },
  { label: 'Inactivo', value: 'false', color: 'red' },
  { label: 'Todos', value: 'todos', color: 'gray' },
];

/**
 * Función para obtener profesores desde la API
 * Transforma la respuesta de la API al formato esperado por PaginatedDataTable
 */
const fetchTeachers = async (
  page: number,
  limit: number,
  query: string,
  status?: string,
  getSucursalNombre?: (id?: string) => string
): Promise<PaginatedResponse<Teacher>> => {
  try {
    const response = await listarProfesoresApi({
      page,
      limit,
      estado: status === 'todos' ? undefined : status === 'true',
      nombre: query || undefined, // Búsqueda por nombre o apellidos
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener profesores');
    }

    // Transformar los datos de la API al formato de Teacher
    const transformedData: Teacher[] = response.data.profesores.map((profesor: Profesor) => {
      const nombreCompleto = `${profesor.nombre} ${profesor.primerApellido} ${profesor.segundoApellido || ''}`.trim();

      const estadoBadge = profesor.estado ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 shadow-sm">
          <FaCheckCircle className="w-3 h-3" />
          Activo
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 shadow-sm">
          <FaTimesCircle className="w-3 h-3" />
          Inactivo
        </span>
      );

      return {
        id: profesor.id,
        nombreCompleto,
        correo: profesor.correo,
        telefono: profesor.telefono || 'N/A',
        identificacion: profesor.identificacion,
        sucursalPrincipal: getSucursalNombre ? getSucursalNombre(profesor.idSucursalPrincipal) : 'N/A',
        idMoodle: profesor.idMoodle || 'N/A',
        estado: estadoBadge,
      };
    });

    // Transformar la respuesta al formato esperado por PaginatedDataTable
    return {
      data: transformedData,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
    };
  } catch (error: any) {
    console.error('Error al obtener profesores:', error);
    throw new Error(error.message || 'Error al cargar los profesores');
  }
};

// Componente principal
export const ProfesoresPage = () => {
  const navigate = useNavigate();
  const [refreshTrigger] = useState(0);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  // Cargar sucursales al montar el componente
  useEffect(() => {
    const loadSucursales = async () => {
      try {
        const response = await obtenerTodasSucursalesApi();
        if (response.success) {
          setSucursales(response.data);
        }
      } catch (error) {
        console.error('Error al cargar sucursales:', error);
      }
    };

    loadSucursales();
  }, []);

  // Función para obtener el nombre de la sucursal por ID
  const getSucursalNombre = (sucursalId?: string): string => {
    if (!sucursalId) return 'N/A';
    const sucursal = sucursales.find(s => s.id === sucursalId);
    return sucursal?.nombre || 'N/A';
  };

  // Crear función de fetch que use las sucursales cargadas
  const fetchTeachersWithSucursales = async (
    page: number,
    limit: number,
    query: string,
    status?: string
  ): Promise<PaginatedResponse<Teacher>> => {
    const response = await fetchTeachers(page, limit, query, status, getSucursalNombre);
    return response;
  };

  const handleView = (teacher: Teacher) => {
    navigate(`/profesores/view/${teacher.id}`);
  };

  const handleCreateNew = () => {
    navigate('/profesores/create');
  };

  const handleEdit = (teacher: Teacher) => {
    navigate(`/profesores/edit/${teacher.id}`);
  };

  return (
    <PaginatedDataTable
      title="Gestión de Profesores"
      columns={columns}
      fetchDataFunction={fetchTeachersWithSucursales}
      onRowClick={handleView}
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onView={handleView}
      statusOptions={statusOptions}
      refreshTrigger={refreshTrigger}
    />
  );
};
