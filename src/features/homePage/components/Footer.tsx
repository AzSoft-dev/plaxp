import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container-custom px-4 sm:px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <img src="home-page/icono.png" alt="Plaxp" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-xl md:text-2xl font-bold text-white">Plaxp</span>
            </div>

            {/* Tagline */}
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              La plataforma diseñada para transformar la experiencia educativa: gestiona matrículas, cursos, estudiantes y comunicación en un entorno tan intuitivo que todo fluye, permitiéndote enfocarte en lo más importante: enseñar, crecer y crear impacto.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4">
            <h3 className="font-bold text-white mb-3 md:mb-4 text-sm md:text-base">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <a href="#caracteristicas" className="text-sm md:text-base text-neutral-300 hover:text-primary transition-colors duration-200">
                  Características
                </a>
              </li>
              <li>
                <a href="#modulos" className="text-sm md:text-base text-neutral-300 hover:text-primary transition-colors duration-200">
                  Módulos
                </a>
              </li>
              <li>
                <a href="#beneficios" className="text-sm md:text-base text-neutral-300 hover:text-primary transition-colors duration-200">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-sm md:text-base text-neutral-300 hover:text-primary transition-colors duration-200">
                  Solicitar Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-white mb-3 md:mb-4 text-sm md:text-base">Síguenos</h3>
            <div className="flex gap-2 md:gap-3">
              <a
                href="#"
                className="w-9 h-9 md:w-10 md:h-10 bg-white/10 hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 text-neutral-300"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 md:w-10 md:h-10 bg-white/10 hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 text-neutral-300"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-6 md:mt-8 pt-4 md:pt-6">
          <div className="text-center space-y-2 md:space-y-3">
            <div className="text-neutral-300 text-xs md:text-sm">
              © {currentYear} Plaxp. Todos los derechos reservados.
            </div>

            {/* Powered by AzSoft */}
            <a
              href="https://azsoftcr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base group"
            >
              <span className="text-neutral-300 group-hover:text-white transition-colors">Powered by</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 group-hover:from-purple-500 group-hover:to-primary transition-all duration-300">
                AzSoft
              </span>
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-400 group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
