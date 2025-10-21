import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id: string;
}

/**
 * Componente reutilizable para campos de formulario
 *
 * @param label - Etiqueta del campo
 * @param type - Tipo de input (email, password, text, etc.)
 * @param value - Valor actual del input
 * @param onChange - Función para manejar cambios
 * @param placeholder - Texto de placeholder
 * @param id - ID único del campo
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  id
}) => (
  <div className="relative">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-neutral-900 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3.5 bg-white border-2 border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-4 focus:ring-primary focus:ring-opacity-10 outline-none transition-all duration-200 hover:border-neutral-300"
      required
    />
  </div>
);
