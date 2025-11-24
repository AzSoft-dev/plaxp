import React from 'react';
import { useInView } from 'react-intersection-observer';

export const FeaturesSection: React.FC = () => {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: gridRef, inView: gridInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Gestión Académica',
      description: 'Organiza cursos, horarios, calificaciones y registros de estudiantes.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: 'Campus Virtual',
      description: 'Entorno de aprendizaje en línea completo con aulas virtuales.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Pagos y Facturación',
      description: 'Facturación automatizada y pagos en línea integrados.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Reportes y Análisis',
      description: 'Dashboards personalizables con insights poderosos.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Seguridad',
      description: 'Datos centralizados protegidos con seguridad empresarial.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Rendimiento',
      description: 'Velocidad, confiabilidad y escalabilidad garantizadas.'
    }
  ];

  return (
    <section className="section-padding bg-neutral-800 scroll-mt-16">
      <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-12 md:mb-16 transition-all duration-1000 ${
            headerInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Todo lo que necesitas en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              una sola plataforma
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed">
            Herramientas poderosas diseñadas para simplificar la gestión educativa.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center transition-all duration-700"
              style={{
                transitionDelay: `${index * 100}ms`,
                opacity: gridInView ? 1 : 0,
                transform: gridInView
                  ? 'translateY(0) scale(1)'
                  : 'translateY(20px) scale(0.9)',
              }}
            >
              {/* Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
