import { useState } from 'react';
import PaginatedDataTable, {
  type PaginatedResponse,
  type ColumnDefinition,
  type BaseItem,
} from '../../../shared/components/PaginatedDataTable';
import { listarRolesApi } from '../api/rolesApi';
import type { Rol } from '../types/role.types';
import { CreateRolModal } from '../components/CreateRolModal';
import { ViewRolModal } from '../components/ViewRolModal';

// Interfaz de Rol extendida para el componente
interface RolItem extends BaseItem {
  id: string;
  nombre: string;
  descripcion: string;
  esSuperadmin: string;
  creadoEn: string;
}

// Definir columnas
const columns: ColumnDefinition<RolItem>[] = [
  { key: 'nombre', header: 'Nombre del Rol' },
  { key: 'descripcion', header: 'Descripción' },
  { key: 'esSuperadmin', header: 'Superadmin' },
  { key: 'creadoEn', header: 'Fecha de Creación' },
];

/**
 * Función para obtener roles desde la API
 * Transforma la respuesta de la API al formato esperado por PaginatedDataTable
 */
const fetchRoles = async (
  page: number,
  limit: number,
  query: string
): Promise<PaginatedResponse<RolItem>> => {
  try {
    const response = await listarRolesApi({
      page,
      pageSize: limit,
      q: query || undefined,
    });

    if (!response.success) {
      throw new Error('Error al obtener roles');
    }

    // Transformar los datos de la API al formato de RolItem
    const transformedData: RolItem[] = response.data.map((rol: Rol) => {
      // Formatear fecha
      const fechaFormateada = rol.creadoEn
        ? new Date(rol.creadoEn).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'N/A';

      return {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        esSuperadmin: rol.esSuperadmin ? 'Sí' : 'No',
        creadoEn: fechaFormateada,
      };
    });

    // Transformar la respuesta al formato esperado por PaginatedDataTable
    return {
      data: transformedData,
      total: response.pagination.totalRecords,
      page: response.pagination.page,
      limit: response.pagination.pageSize,
    };
  } catch (error: any) {
    console.error('Error al obtener roles:', error);
    throw new Error(error.message || 'Error al cargar los roles');
  }
};

// Componente principal
export const RolesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedRol, setSelectedRol] = useState<Rol | undefined>(undefined);

  // Estado para el modal de vista
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRolId, setViewRolId] = useState<string | null>(null);

  const handleRowClick = (rol: RolItem) => {
    setViewRolId(rol.id);
    setIsViewModalOpen(true);
  };

  const handleView = (rol: RolItem) => {
    setViewRolId(rol.id);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewRolId(null);
  };

  const handleCreateNew = () => {
    setSelectedRol(undefined); // Resetear rol seleccionado
    setIsModalOpen(true);
  };

  const handleEdit = (rol: RolItem) => {
    // Aquí deberíamos cargar el rol completo con sus permisos
    // Por ahora solo pasamos los datos básicos
    const rolToEdit: Rol = {
      id: rol.id,
      empresaId: '', // Se llenará desde la API
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      esSuperadmin: rol.esSuperadmin === 'Sí',
      creadoEn: '', // Se llenará desde la API
    };
    setSelectedRol(rolToEdit);
    setIsModalOpen(true);
  };

  const handleEditFromView = (rol: Rol) => {
    // Cerrar el modal de vista
    setIsViewModalOpen(false);
    setViewRolId(null);

    // Abrir el modal de edición con los datos del rol
    setSelectedRol(rol);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRol(undefined); // Resetear rol seleccionado al cerrar
  };

  const handleRolCreated = () => {
    // Incrementar el trigger para refrescar la tabla
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <PaginatedDataTable
        title="Gestión de Roles"
        columns={columns}
        fetchDataFunction={fetchRoles}
        onRowClick={handleRowClick}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onView={handleView}
        refreshTrigger={refreshTrigger}
      />

      <CreateRolModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleRolCreated}
        rol={selectedRol}
      />

      <ViewRolModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        rolId={viewRolId}
        onEdit={handleEditFromView}
      />
    </>
  );
};
