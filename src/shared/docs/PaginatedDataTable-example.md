# PaginatedDataTable - Guía de Uso

Componente reutilizable para mostrar tablas paginadas con búsqueda, responsive (tabla en desktop, cards en móvil).

## Ejemplo de uso:

```tsx
import PaginatedDataTable, {
  PaginatedResponse,
  ColumnDefinition
} from '@/shared/components/PaginatedDataTable';
import { apiService } from '@/shared/services/apiService';

// 1. Define tu interfaz de datos
interface Student {
  id: string;
  nombre: string;
  correo: string;
  curso: string;
  estado: string;
}

// 2. Define las columnas que quieres mostrar
const columns: ColumnDefinition<Student>[] = [
  { key: 'nombre', header: 'Nombre' },
  { key: 'correo', header: 'Email' },
  { key: 'curso', header: 'Curso' },
  { key: 'estado', header: 'Estado' },
];

// 3. Crea la función para obtener datos
const fetchStudents = async (
  page: number,
  limit: number,
  query: string
): Promise<PaginatedResponse<Student>> => {
  const response = await apiService.get<PaginatedResponse<Student>>(
    'estudiantes',
    { page, limit, search: query }
  );
  return response;
};

// 4. Usa el componente
const StudentsPage = () => {
  const handleRowClick = (student: Student) => {
    console.log('Clicked student:', student);
    // Navegar a detalle, abrir modal, etc.
  };

  const handleCreateNew = () => {
    console.log('Create new student');
    // Abrir modal de creación, navegar a formulario, etc.
  };

  return (
    <PaginatedDataTable
      title="Estudiantes"
      columns={columns}
      fetchDataFunction={fetchStudents}
      onRowClick={handleRowClick}
      onCreateNew={handleCreateNew}
      refreshTrigger={0} // Opcional: cambia este número para forzar refresh
    />
  );
};
```

## Props:

| Prop | Tipo | Descripción |
|------|------|-------------|
| `title` | string | Título de la tabla |
| `columns` | ColumnDefinition[] | Columnas a mostrar |
| `fetchDataFunction` | función | Función async que obtiene los datos paginados |
| `onRowClick` | función | Callback cuando se hace click en una fila |
| `onCreateNew` | función | Callback para el botón "Crear Nuevo" |
| `refreshTrigger` | number (opcional) | Cambia este valor para forzar recarga de datos |

## Respuesta esperada del API:

```json
{
  "data": [
    { "id": "1", "nombre": "Juan", ... },
    { "id": "2", "nombre": "María", ... }
  ],
  "total": 100,
  "page": 1,
  "limit": 15
}
```

## Características:

✅ Paginación automática
✅ **Selector de items por página** (10, 15, 25, 50, 100)
✅ Búsqueda con Enter o botón
✅ Responsive (tabla en desktop, cards en móvil)
✅ Loading states con animaciones
✅ Manejo de errores con diseño moderno
✅ Totalmente tipado con TypeScript
✅ Diseño moderno con gradientes y animaciones
✅ Efectos hover y transiciones suaves
✅ Usa la paleta de colores de Plaxp

## Estilos Modernos:

🎨 Gradientes en botones y fondos
✨ Animaciones suaves en hover y carga
🌈 Efectos de glass morphism
💫 Transiciones fluidas
🎯 Diseño responsive mejorado
