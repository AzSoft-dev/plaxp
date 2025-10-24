/**
 * Exportaciones del módulo Security
 * Punto de entrada principal para el feature de Seguridad (Login y Recuperación)
 */

// Páginas
export { LoginPage } from './pages/LoginPage';
export { PasswordRecoveryPage } from './pages/PasswordRecoveryPage';

// Componentes
export { LoginCard } from './components/LoginCard';
export { InputField } from '../../shared/components/InputField';

// Hooks
export { useAuth } from './hooks/useAuth';
export { usePasswordRecovery } from './hooks/usePasswordRecovery';

// Context
export { AuthProvider, AuthContext } from './context/AuthContext';
export type { User, AuthContextType } from './context/AuthContext';
export { PasswordRecoveryProvider, PasswordRecoveryContext } from './context/PasswordRecoveryContext';
export type { PasswordRecoveryContextType } from './context/PasswordRecoveryContext';

// Schemas (Interfaces y Tipos)
export type { ValidationResult, LoginFormData } from './schemas/loginSchema';

// Validaciones
export { LoginValidation } from './validations/loginValidation';
