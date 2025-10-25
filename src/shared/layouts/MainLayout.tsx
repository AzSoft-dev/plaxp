import React, { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/security/hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de la aplicación
 * Se muestra después del login exitoso
 * Incluye sidebar, header y área de contenido
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Cerrado por defecto en móvil
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Para desktop
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen bg-neutral-100 flex overflow-hidden">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64 h-screen bg-gradient-to-b from-white to-neutral-50 shadow-strong transition-all duration-300 flex flex-col border-r border-neutral-200
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-neutral-200 px-4 bg-white/50 backdrop-blur-sm">
          {sidebarCollapsed ? (
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-md transform hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">P</span>
            </div>
          ) : (
            <img src="/logo.png" alt="Plaxp Logo" className="h-10" />
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-2">
            {/* Dashboard */}
            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300"></div>
              <div className="relative z-10 p-1.5 rounded-lg bg-neutral-100 group-hover:bg-primary/10 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              {!sidebarCollapsed && (
                <span className="relative z-10 font-semibold text-sm">Dashboard</span>
              )}
            </Link>

            {/* Usuarios */}
            <Link
              to="/usuarios"
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300"></div>
              <div className="relative z-10 p-1.5 rounded-lg bg-neutral-100 group-hover:bg-primary/10 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              {!sidebarCollapsed && (
                <span className="relative z-10 font-semibold text-sm">Usuarios</span>
              )}
            </Link>
          </div>
        </nav>

        {/* Toggle Sidebar Button (solo desktop) */}
        <div className="hidden lg:block border-t border-neutral-200 p-3 bg-white/50">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary text-neutral-600 transition-all duration-200 group"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                sidebarCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md shadow-soft flex items-center justify-between px-4 lg:px-6 border-b border-neutral-200/50 flex-shrink-0">
          {/* Botón menú hamburguesa (solo móvil) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2.5 text-neutral-600 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Plaxp</h1>

          {/* User Menu */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-neutral-900">
                  {user?.nombre || 'Usuario'}
                </p>
                <p className="text-xs text-neutral-500">{user?.correo}</p>
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-primary/20 ring-offset-2">
                <span className="text-white font-bold text-sm">
                  {user?.nombre?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 text-neutral-600 hover:text-danger hover:bg-danger/10 rounded-xl transition-all duration-200"
              title="Cerrar sesión"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 bg-neutral-100">{children}</main>
      </div>
    </div>
  );
};
