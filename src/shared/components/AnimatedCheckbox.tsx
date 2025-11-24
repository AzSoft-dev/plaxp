import React from 'react';
import './AnimatedCheckbox.css';

interface AnimatedCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Checkbox animado con el estilo de PLAXP
 */
export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`checkbox-wrapper-plaxp ${disabled ? 'disabled' : ''}`}>
      <div className={`check check-${size}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <label htmlFor={id}></label>
      </div>
      {label && (
        <span className="checkbox-label" onClick={() => !disabled && onChange(!checked)}>
          {label}
        </span>
      )}
    </div>
  );
};
