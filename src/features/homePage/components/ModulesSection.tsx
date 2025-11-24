import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export const ModulesSection: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: true,
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  const modules = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-students" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-students)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Estudiantes',
      description: 'Gestión completa del ciclo de vida del estudiante desde la inscripción hasta la graduación.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-500/5',
      iconColor: 'text-blue-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-professors" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-professors)" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path stroke="url(#gradient-professors)" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path stroke="url(#gradient-professors)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      title: 'Profesores',
      description: 'Administra perfiles de docentes, horarios, evaluaciones y seguimiento de desempeño.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-500/5',
      iconColor: 'text-purple-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-roles" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-roles)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Roles y Permisos',
      description: 'Control de acceso granular con roles y permisos personalizables.',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-500/10 to-teal-500/5',
      iconColor: 'text-teal-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-courses" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-courses)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Cursos y Secciones',
      description: 'Organiza cursos, secciones, planes de estudio y rutas de aprendizaje.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-500/10 to-indigo-500/5',
      iconColor: 'text-indigo-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-enrollment" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-enrollment)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Matrículas',
      description: 'Proceso de inscripción simplificado con flujos de trabajo automatizados.',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-500/5',
      iconColor: 'text-green-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-grades" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-grades)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Calificaciones y Reportes',
      description: 'Sistema integral de calificaciones con análisis detallado de rendimiento.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-500/10 to-orange-500/5',
      iconColor: 'text-orange-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-payments" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#db2777', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-payments)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Pagos',
      description: 'Sistema integrado de facturación con soporte para múltiples pasarelas de pago.',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-500/10 to-pink-500/5',
      iconColor: 'text-pink-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-attendance" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ca8a04', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-attendance)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Asistencia',
      description: 'Seguimiento digital de asistencia con monitoreo en tiempo real y alertas.',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-500/10 to-yellow-500/5',
      iconColor: 'text-yellow-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-communications" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-communications)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Comunicaciones',
      description: 'Centro de comunicación multicanal para anuncios y notificaciones.',
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-500/10 to-red-500/5',
      iconColor: 'text-red-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-analytics" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-analytics)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Análisis',
      description: 'Análisis avanzado con dashboards personalizables e insights.',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'from-cyan-500/10 to-cyan-500/5',
      iconColor: 'text-cyan-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-documents" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-documents)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Documentos',
      description: 'Gestión centralizada de documentos con control de versiones.',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'from-violet-500/10 to-violet-500/5',
      iconColor: 'text-violet-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gradient-settings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#6b7280', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#4b5563', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient-settings)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke="url(#gradient-settings)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Configuración',
      description: 'Configuración flexible del sistema y opciones de personalización.',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'from-gray-500/10 to-gray-500/5',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <section id="modulos" className="section-padding bg-white scroll-mt-16  px-4 sm:px-6 lg:px-12">
      <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4 md:mb-6">
            Módulos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Potentes</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed">
            Todo lo que necesitas para gestionar tu institución educativa, en una plataforma integrada.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full shadow-medium items-center justify-center hover:bg-white/20 transition-all duration-200"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full shadow-medium items-center justify-center hover:bg-white/20 transition-all duration-200"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                >
                  <div className="group bg-gradient-to-br from-neutral-50 to-white rounded-2xl md:rounded-3xl p-6 md:p-8 hover:shadow-strong transition-all duration-300 cursor-pointer border border-neutral-200 hover:border-primary/50 h-full">
                    {/* Icon */}
                    <div className="mb-4 md:mb-6">
                      <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${module.bgColor} rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${module.iconColor}`}>
                        <div className="scale-110 md:scale-125">
                          {module.icon}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2 md:mb-3">
                      {module.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-3 md:mb-4">
                      {module.description}
                    </p>

                    {/* Decorative Bar */}
                    <div className={`h-1 w-0 bg-gradient-to-r ${module.color} rounded-full group-hover:w-full transition-all duration-500`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-neutral-600 mb-3 md:mb-4 text-base md:text-lg">¿Quieres ver todos los módulos en acción?</p>
          <a href="#contacto" className="btn-primary inline-block">
            Agenda una demo
          </a>
        </div>
      </div>
    </section>
  );
};
