import { useState } from 'react';
import PaginatedDataTable, {
  type PaginatedResponse,
  type ColumnDefinition,
  type BaseItem,
  type StatusOption
} from '../../../shared/components/PaginatedDataTable';
import { listarUsuariosApi } from '../api/UsersApi';
import type { Usuario, UsuarioDetalle } from '../types/user.types';
import { CreateUserModal } from '../components/CreateUserModal';
import { ViewUserModal } from '../components/ViewUserModal';

// Interfaz de Usuario extendida para el componente
interface User extends BaseItem {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
  ultimoAcceso: string;
  idRol?: string; // ID del rol
}

// Definir columnas
const columns: ColumnDefinition<User>[] = [
  { key: 'nombre', header: 'Nombre' },
  { key: 'correo', header: 'Correo Electrónico' },
  { key: 'rol', header: 'Rol' },
  { key: 'estado', header: 'Estado' },
  { key: 'ultimoAcceso', header: 'Último Acceso' },
];

// Definir opciones de estado según la API
const statusOptions: StatusOption[] = [
  { label: 'Activo', value: 'activo', color: 'green' },
  { label: 'Inactivo', value: 'inactivo', color: 'red' },
  { label: 'Todos', value: 'todos', color: 'gray' },
];

/**
 * Función para obtener usuarios desde la API
 * Transforma la respuesta de la API al formato esperado por PaginatedDataTable
 */
const fetchUsers = async (
  page: number,
  limit: number,
  query: string,
  status?: string
): Promise<PaginatedResponse<User>> => {
  try {
    const response = await listarUsuariosApi({
      page,
      pageSize: limit,
      estado: status as 'activo' | 'inactivo' | 'todos' | undefined,
      q: query || undefined,
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener usuarios');
    }

    // Transformar los datos de la API al formato de User
    const transformedData: User[] = response.data.map((usuario: Usuario) => {
      // El estado puede venir como '1' (activo) o '0' (inactivo), o como string 'activo'/'inactivo'
      const estadoNormalizado = usuario.estado === '1' || usuario.estado === 1 ||
                                usuario.estado?.toLowerCase() === 'activo'
                                  ? 'Activo'
                                  : 'Inactivo';

      return {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.nombreRol,
        estado: estadoNormalizado,
        ultimoAcceso: usuario.ultimoAcceso || 'N/A',
        idRol: usuario.idRol, // Incluir idRol
      };
    });

    // Transformar la respuesta al formato esperado por PaginatedDataTable
    return {
      data: transformedData,
      total: response.pagination.totalItems,
      page: response.pagination.page,
      limit: response.pagination.pageSize,
    };
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    throw new Error(error.message || 'Error al cargar los usuarios');
  }
};

// Componente principal
export const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState<Usuario | undefined>(undefined);

  // Estado para el modal de vista
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);

  const handleView = (user: User) => {
    setViewUserId(user.id);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewUserId(null);
  };

  const handleCreateNew = () => {
    setSelectedUser(undefined); // Resetear usuario seleccionado
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    // Mapear User a Usuario para pasarlo al modal
    const usuarioToEdit: Usuario = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      estado: user.estado === 'Activo' ? 'activo' : 'inactivo',
      ultimoAcceso: user.ultimoAcceso,
      nombreRol: user.rol,
      idRol: user.idRol,
    };
    setSelectedUser(usuarioToEdit);
    setIsModalOpen(true);
  };

  const handleEditFromView = (usuarioDetalle: UsuarioDetalle) => {
    // Convertir UsuarioDetalle a Usuario para el modal de edición
    const usuarioToEdit: Usuario = {
      id: usuarioDetalle.id,
      nombre: usuarioDetalle.nombre,
      correo: usuarioDetalle.correo,
      estado: usuarioDetalle.estado,
      ultimoAcceso: usuarioDetalle.ultimoLogin,
      nombreRol: usuarioDetalle.nombreRol,
      idRol: usuarioDetalle.idRol,
    };

    // Cerrar el modal de vista
    setIsViewModalOpen(false);
    setViewUserId(null);

    // Abrir el modal de edición con los datos del usuario
    setSelectedUser(usuarioToEdit);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined); // Resetear usuario seleccionado al cerrar
  };

  const handleUserCreated = () => {
    // Incrementar el trigger para refrescar la tabla
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <PaginatedDataTable
        title="Gestión de Usuarios"
        columns={columns}
        fetchDataFunction={fetchUsers}
        onRowClick={handleView}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onView={handleView}
        statusOptions={statusOptions}
        refreshTrigger={refreshTrigger}
      />

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleUserCreated}
        user={selectedUser}
      />

      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        userId={viewUserId}
        onEdit={handleEditFromView}
      />
    </>
  );
};
