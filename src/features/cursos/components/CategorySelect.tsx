import { useState, useEffect } from 'react';
import { listarCategoriasApi } from '../../categorias/api/categoriasApi';
import type { Categoria } from '../../categorias/types/categoria.types';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const CategorySelect = ({
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}: CategorySelectProps) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        // Obtener solo categorías activas y visibles que permiten cursos
        const response = await listarCategoriasApi({
          activo: true,
          esVisible: true,
          page: 1,
          limit: 1000, // Obtener todas las categorías
        });

        if (response.success) {
          // Filtrar solo las categorías que permiten cursos
          const categoriasPermitidas = response.data.filter(cat => cat.permiteCursos);
          setCategorias(categoriasPermitidas);
        } else {
          setErrorMsg(response.message || 'Error al cargar categorías');
        }
      } catch (err: any) {
        console.error('Error al cargar categorías:', err);
        setErrorMsg(err.message || 'Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <div className="form-group">
        <label htmlFor="categoria">
          Categoría {required && <span className="text-danger">*</span>}
        </label>
        <select className="form-control" disabled>
          <option>Cargando categorías...</option>
        </select>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="form-group">
        <label htmlFor="categoria">
          Categoría {required && <span className="text-danger">*</span>}
        </label>
        <select className="form-control" disabled>
          <option>Error al cargar categorías</option>
        </select>
        <small className="text-danger">{errorMsg}</small>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor="categoria">
        Categoría {required && <span className="text-danger">*</span>}
      </label>
      <select
        id="categoria"
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      >
        <option value="">-- Selecciona una categoría --</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nivel > 1 && '— '.repeat(categoria.nivel - 1)}
            {categoria.nombre}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
      {categorias.length === 0 && (
        <small className="text-muted">No hay categorías disponibles</small>
      )}
    </div>
  );
};
