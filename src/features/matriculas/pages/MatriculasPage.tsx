import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaSignOutAlt,
  FaPause,
  FaFlagCheckered,
} from 'react-icons/fa';
import PaginatedDataTable, {
  type PaginatedResponse,
  type ColumnDefinition,
  type BaseItem,
  type StatusOption,
} from '../../../shared/components/PaginatedDataTable';
import { listarMatriculasApi } from '../api/matriculasApi';
import type { Matricula } from '../types/matricula.types';
import { EstadoMatricula } from '../types/matricula.types';

interface MatriculaItem extends BaseItem {
  id: string;
  estudiante: JSX.Element;
  planPago: string;
  periodoLectivo: JSX.Element;
  fechaMatricula: string;
  fechaProximoPago: JSX.Element;
  estado: JSX.Element;
}

const columns: ColumnDefinition<MatriculaItem>[] = [
  { key: 'estudiante', header: 'Estudiante' },
  { key: 'planPago', header: 'Plan de Pago' },
  { key: 'periodoLectivo', header: 'Período Lectivo' },
  { key: 'fechaMatricula', header: 'Fecha Matrícula' },
  { key: 'fechaProximoPago', header: 'Próximo Pago' },
  { key: 'estado', header: 'Estado' },
];

const statusOptions: StatusOption[] = [
  { label: 'Activas', value: '1', color: 'green' },
  { label: 'Retiradas', value: '2', color: 'red' },
  { label: 'Congeladas', value: '3', color: 'yellow' },
  { label: 'Finalizadas', value: '4', color: 'blue' },
  { label: 'Todas', value: '', color: 'gray' },
];

const getEstadoBadge = (estado: EstadoMatricula): JSX.Element => {
  switch (estado) {
    case EstadoMatricula.ACTIVA:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 shadow-sm">
          <FaCheckCircle className="w-3 h-3" />
          Activa
        </span>
      );
    case EstadoMatricula.RETIRADA:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 shadow-sm">
          <FaSignOutAlt className="w-3 h-3" />
          Retirada
        </span>
      );
    case EstadoMatricula.CONGELADA:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 shadow-sm">
          <FaPause className="w-3 h-3" />
          Congelada
        </span>
      );
    case EstadoMatricula.FINALIZADA:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700 shadow-sm">
          <FaFlagCheckered className="w-3 h-3" />
          Finalizada
        </span>
      );
    default:
      return <span>-</span>;
  }
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  // Extraer solo la parte de fecha para evitar problemas de zona horaria
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const isProximoPagoProximo = (fechaProximoPago: string | null | undefined): boolean => {
  if (!fechaProximoPago) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Extraer solo la parte de fecha para evitar problemas de zona horaria
  const [year, month, day] = fechaProximoPago.split('T')[0].split('-');
  const proximoPago = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const diffDays = Math.ceil((proximoPago.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays >= 0;
};

const isProximoPagoVencido = (fechaProximoPago: string | null | undefined): boolean => {
  if (!fechaProximoPago) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Extraer solo la parte de fecha para evitar problemas de zona horaria
  const [year, month, day] = fechaProximoPago.split('T')[0].split('-');
  const proximoPago = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return proximoPago < today;
};

const fetchMatriculas = async (
  page: number,
  limit: number,
  query: string,
  status?: string
): Promise<PaginatedResponse<MatriculaItem>> => {
  try {
    const response = await listarMatriculasApi({
      page,
      limit,
      q: query || undefined,
      estado: status && status !== '' ? (parseInt(status) as EstadoMatricula) : undefined,
    });

    if (!response.success) {
      throw new Error('Error al obtener matrículas');
    }

    const transformedData: MatriculaItem[] = response.data.matriculas.map(
      (matricula: Matricula) => {
        const estudianteElement = (
          <div className="flex flex-col">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {matricula.estudianteNombre} {matricula.estudianteApellidos}
            </span>
          </div>
        );

        const periodoLectivoElement = matricula.periodoLectivoNombre ? (
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {matricula.periodoLectivoNombre}
          </span>
        ) : (
          <span className="text-sm text-neutral-400 dark:text-neutral-500 italic">
            Sin período
          </span>
        );

        const vencido = isProximoPagoVencido(matricula.fechaProximoPago);
        const proximo = isProximoPagoProximo(matricula.fechaProximoPago);
        const fechaProximoPagoElement = (
          <span className={`text-sm font-medium ${
            vencido
              ? 'text-red-600 dark:text-red-400'
              : proximo
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-neutral-700 dark:text-neutral-300'
          }`}>
            {formatDate(matricula.fechaProximoPago)}
          </span>
        );

        return {
          id: matricula.id,
          estudiante: estudianteElement,
          planPago: matricula.planPagoNombre,
          periodoLectivo: periodoLectivoElement,
          fechaMatricula: formatDate(matricula.fechaMatricula),
          fechaProximoPago: fechaProximoPagoElement,
          estado: getEstadoBadge(matricula.estado),
        };
      }
    );

    return {
      data: transformedData,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
    };
  } catch (error: any) {
    console.error('Error al obtener matrículas:', error);
    throw new Error(error.message || 'Error al cargar las matrículas');
  }
};

export const MatriculasPage = () => {
  const navigate = useNavigate();
  const [refreshTrigger] = useState(0);

  const handleRowClick = (matricula: MatriculaItem) => {
    navigate(`/matriculas/view/${matricula.id}`);
  };

  const handleView = (matricula: MatriculaItem) => {
    navigate(`/matriculas/view/${matricula.id}`);
  };

  const handleCreate = () => {
    navigate('/matriculas/create');
  };

  return (
    <PaginatedDataTable
      title="Matrículas"
      columns={columns}
      fetchDataFunction={fetchMatriculas}
      onRowClick={handleRowClick}
      onView={handleView}
      onCreateNew={handleCreate}
      statusOptions={statusOptions}
      refreshTrigger={refreshTrigger}
    />
  );
};
