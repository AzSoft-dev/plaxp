import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id: string;
  disabled?: boolean;
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
  id,
  disabled = false
}) => (
  <div className="relative">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2"
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
      disabled={disabled}
      className="w-full px-4 py-3.5 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary dark:focus:border-primary focus:ring-4 focus:ring-primary focus:ring-opacity-10 outline-none transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-100 dark:disabled:bg-neutral-900"
      required
    />
  </div>
);
