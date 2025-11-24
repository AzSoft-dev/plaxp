import React, { type JSX } from 'react';

interface FeatureCard {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export const InfiniteCarouselSection: React.FC = () => {
  // Gestión Académica
  const academicFeatures: FeatureCard[] = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Estudiantes',
      description: 'Gestión completa del ciclo de vida del estudiante',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      title: 'Profesores',
      description: 'Gestión de docentes, horarios y evaluaciones',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Cursos y Secciones',
      description: 'Organización de planes de estudio',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Campus Virtual Integrado',
      description: 'Plataforma educativa digital completa',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-violet-500/20 to-violet-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Calificaciones',
      description: 'Sistema integral de notas y reportes',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Asistencia',
      description: 'Seguimiento digital en tiempo real',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10',
    },
  ];

  // Gestión Financiera
  const financialFeatures: FeatureCard[] = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Pagos en Línea',
      description: 'Múltiples pasarelas de pago integradas',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-pink-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      ),
      title: 'Facturación',
      description: 'Generación automática de comprobantes',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Control de Pensiones',
      description: 'Gestión automatizada de cuotas',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Reportes Financieros',
      description: 'Análisis detallado de ingresos',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      title: 'Gestión de Becas',
      description: 'Administración de descuentos y beneficios',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-teal-500/20 to-teal-600/10',
    },
  ];

  // CRM
  const crmFeatures: FeatureCard[] = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Comunicaciones',
      description: 'Centro multicanal de notificaciones',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Seguimiento de Leads',
      description: 'Pipeline de ventas y conversión',
      color: 'from-fuchsia-500 to-fuchsia-600',
      bgColor: 'bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Matrículas',
      description: 'Proceso de inscripción automatizado',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Análisis',
      description: 'Dashboards y métricas clave',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Documentos',
      description: 'Gestión centralizada de archivos',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Tareas y Seguimiento',
      description: 'Gestión de actividades y recordatorios',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/10',
    },
  ];

  const FeatureCard: React.FC<{ feature: FeatureCard }> = ({ feature }) => (
    <div className="flex-shrink-0 w-64 sm:w-72 md:w-80 mx-2 sm:mx-3 md:mx-4">
      <div className={`${feature.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10 h-full backdrop-blur-sm hover:border-white/20 transition-all duration-300`}>
        <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-r ${feature.color} rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 shadow-lg`}>
          {feature.icon}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">
          {feature.title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );

  return (
    <section id="modulos" className="section-padding bg-neutral-950 scroll-mt-16 overflow-hidden">
      <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Todos los <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 mt-1 sm:mt-2">módulos </span> que tu institución necesita.
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative py-4 sm:py-6 md:py-8">
          {/* Left Fade Gradient - extends beyond container padding */}
          <div className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-32 sm:w-40 md:w-48 lg:w-56 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10 pointer-events-none" />

          {/* Right Fade Gradient - extends beyond container padding */}
          <div className="absolute -right-4 sm:-right-6 top-0 bottom-0 w-32 sm:w-40 md:w-48 lg:w-56 bg-gradient-to-l from-neutral-950 via-neutral-950/80 to-transparent z-10 pointer-events-none" />

          {/* Track 1 - Gestión Académica */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="carousel-track-container group">
              <div className="carousel-track">
                {/* Primera copia */}
                {academicFeatures.map((feature, index) => (
                  <FeatureCard key={`academic-1-${index}`} feature={feature} />
                ))}
                {/* Segunda copia para loop infinito */}
                {academicFeatures.map((feature, index) => (
                  <FeatureCard key={`academic-2-${index}`} feature={feature} />
                ))}
              </div>
            </div>
          </div>

          {/* Track 2 - Gestión Financiera */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="carousel-track-container group">
              <div className="carousel-track carousel-track-reverse">
                {/* Primera copia */}
                {financialFeatures.map((feature, index) => (
                  <FeatureCard key={`financial-1-${index}`} feature={feature} />
                ))}
                {/* Segunda copia para loop infinito */}
                {financialFeatures.map((feature, index) => (
                  <FeatureCard key={`financial-2-${index}`} feature={feature} />
                ))}
              </div>
            </div>
          </div>

          {/* Track 3 - CRM */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="carousel-track-container group">
              <div className="carousel-track">
                {/* Primera copia */}
                {crmFeatures.map((feature, index) => (
                  <FeatureCard key={`crm-1-${index}`} feature={feature} />
                ))}
                {/* Segunda copia para loop infinito */}
                {crmFeatures.map((feature, index) => (
                  <FeatureCard key={`crm-2-${index}`} feature={feature} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <p className="text-neutral-300 mb-3 md:mb-4 text-sm sm:text-base md:text-lg">¿Quieres ver todos los módulos en acción?</p>
          <a href="#contacto" className="btn-primary inline-block">
            Agenda una demo
          </a>
        </div>
      </div>

      <style>{`
        .carousel-track-container {
          overflow: hidden;
          position: relative;
        }

        .carousel-track {
          display: flex;
          width: fit-content;
          animation: scroll 35s linear infinite;
        }

        .carousel-track-reverse {
          animation: scroll-reverse 35s linear infinite;
        }

        .carousel-track-container:hover .carousel-track {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .carousel-track {
            animation-duration: 25s;
          }
          .carousel-track-reverse {
            animation-duration: 25s;
          }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .carousel-track {
            animation-duration: 35s;
          }
          .carousel-track-reverse {
            animation-duration: 35s;
          }
        }

        @media (min-width: 1024px) {
          .carousel-track {
            animation-duration: 45s;
          }
          .carousel-track-reverse {
            animation-duration: 45s;
          }
        }
      `}</style>
    </section>
  );
};
