import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import PaginatedDataTable, {
  type PaginatedResponse,
  type ColumnDefinition,
  type BaseItem,
  type StatusOption
} from '../../../shared/components/PaginatedDataTable';
import { listarEstudiantesApi } from '../api/estudiantesApi';
import type { Estudiante } from '../types/estudiante.types';

// Interfaz de Estudiante extendida para el componente
interface Student extends BaseItem {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  identificacion: string;
  idMoodle: string;
  estado: JSX.Element;
}

// Definir columnas
const columns: ColumnDefinition<Student>[] = [
  { key: 'nombreCompleto', header: 'Nombre Completo' },
  { key: 'correo', header: 'Correo Electrónico' },
  { key: 'telefono', header: 'Teléfono' },
  { key: 'identificacion', header: 'Identificación' },
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
 * Función para obtener estudiantes desde la API
 * Transforma la respuesta de la API al formato esperado por PaginatedDataTable
 */
const fetchStudents = async (
  page: number,
  limit: number,
  query: string,
  status?: string
): Promise<PaginatedResponse<Student>> => {
  try {
    const response = await listarEstudiantesApi({
      page,
      limit,
      estado: status === 'todos' ? undefined : status === 'true',
      nombre: query || undefined, // Búsqueda por nombre o apellidos
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener estudiantes');
    }

    // Transformar los datos de la API al formato de Student
    const transformedData: Student[] = response.data.estudiantes.map((estudiante: Estudiante) => {
      const nombreCompleto = `${estudiante.nombre} ${estudiante.primerApellido} ${estudiante.segundoApellido || ''}`.trim();

      const estadoBadge = estudiante.estado ? (
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
        id: estudiante.id,
        nombreCompleto,
        correo: estudiante.correo,
        telefono: estudiante.telefono || 'N/A',
        identificacion: estudiante.identificacion,
        idMoodle: estudiante.idMoodle || 'N/A',
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
    console.error('Error al obtener estudiantes:', error);
    throw new Error(error.message || 'Error al cargar los estudiantes');
  }
};

// Componente principal
export const EstudiantesPage = () => {
  const navigate = useNavigate();
  const [refreshTrigger] = useState(0);

  const handleView = (student: Student) => {
    navigate(`/estudiantes/view/${student.id}`);
  };

  const handleCreateNew = () => {
    navigate('/estudiantes/create');
  };

  const handleEdit = (student: Student) => {
    navigate(`/estudiantes/edit/${student.id}`);
  };

  return (
    <PaginatedDataTable
      title="Gestión de Estudiantes"
      columns={columns}
      fetchDataFunction={fetchStudents}
      onRowClick={handleView}
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onView={handleView}
      statusOptions={statusOptions}
      refreshTrigger={refreshTrigger}
    />
  );
};
