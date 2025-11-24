import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  const isDemo = location.pathname === '/demo';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src="home-page/logo.png" alt="Plaxp" className="h-7 sm:h-8 object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {!isDemo ? (
              <>
                <a href="#beneficios" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                  Beneficios
                </a>
                <a href="#caracteristicas" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                  Características
                </a>
                <a href="#modulos" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                  Módulos
                </a>
                <a href="#precios" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                  Precios
                </a>
                <a href="#preguntas" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                  FAQ
                </a>
                <a href="#contacto" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                  Contacto
                </a>
              </>
            ) : (
              <Link to="/" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                Volver al inicio
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {!isDemo && (
              <Link to="/login" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                Iniciar sesión
              </Link>
            )}
            <Link to="/schedule-demo" className="btn-primary text-sm px-6 py-2">
              Reservar una Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-neutral-700 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white/80 backdrop-blur-md">
            <nav className="px-4 py-4 space-y-3">
              {!isDemo ? (
                <>
                  <a
                    href="#beneficios"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-primary transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    Beneficios
                  </a>
                  <a
                    href="#caracteristicas"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-primary transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    Características
                  </a>
                  <a
                    href="#modulos"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-primary transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    Módulos
                  </a>
                  <a
                    href="#precios"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-primary transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    Precios
                  </a>
                  <a
                    href="#preguntas"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-primary transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    FAQ
                  </a>
                  <a
                    href="#contacto"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-primary transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    Contacto
                  </a>
                  <div className="pt-3 border-t border-neutral-200 space-y-3">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block w-full text-left py-2 text-base font-medium text-neutral-700 hover:text-primary transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/schedule-demo"
                      onClick={closeMobileMenu}
                      className="block w-full text-center btn-primary text-base px-6 py-3"
                    >
                      Reservar una Demo
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-primary transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    Volver al inicio
                  </Link>
                  <Link
                    to="/demo"
                    onClick={closeMobileMenu}
                    className="block w-full text-center btn-primary text-base px-6 py-3 mt-3"
                  >
                    Explorar Demo
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
