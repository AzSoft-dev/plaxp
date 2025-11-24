import React from 'react';
import { useInView } from 'react-intersection-observer';

export const IllustrationsSection: React.FC = () => {
  const { ref: svgRef1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.1, // Reducido para cargar antes
  });

  const { ref: svgRef2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: svgRef3, inView: inView3 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const illustrations = [
    {
      ref: svgRef1,
      inView: inView1,
      src: 'home-page/professor-animate.svg',
      alt: 'Gestión de Profesores',
      title: 'Gestión de Profesores',
      description: 'Administra el personal docente de tu institución de manera eficiente. Controla horarios, asignaciones de cursos y evaluaciones de desempeño en un solo lugar.'
    },
    {
      ref: svgRef2,
      inView: inView2,
      src: 'home-page/progress-overview-animate.svg',
      alt: 'Análisis y Progreso',
      title: 'Análisis y Progreso Académico',
      description: 'Visualiza el rendimiento académico con reportes detallados y análisis en tiempo real. Toma decisiones informadas basadas en datos precisos y actualizados.'
    },
    {
      ref: svgRef3,
      inView: inView3,
      src: 'home-page/course-app-animate.svg',
      alt: 'Gestión de Cursos',
      title: 'Gestión Integral de Cursos',
      description: 'Organiza y administra todos tus cursos desde una plataforma centralizada. Crea programas académicos, asigna recursos y gestiona contenidos de manera intuitiva.'
    }
  ];

  return (
    <section className="section-padding bg-[#050505] scroll-mt-16">
      <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Hecho para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              tu realidad
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed">
            Herramientas diseñadas específicamente para las necesidades de tu institución educativa.
          </p>
        </div>

        {/* Illustrations Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
          {illustrations.map((illustration, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* SVG Illustration */}
              <div ref={illustration.ref} className="relative w-full mb-6 md:mb-8">
                <div className="relative aspect-square">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl blur-3xl opacity-50"></div>

                  {/* SVG Container */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {!illustration.inView ? (
                      // Skeleton loader
                      <div className="w-full h-full bg-neutral-800/30 animate-pulse rounded-3xl"></div>
                    ) : (
                      <img
                        src={illustration.src}
                        alt={illustration.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto transition-opacity duration-700"
                        style={{ opacity: 0 }}
                        onLoad={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {illustration.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                  {illustration.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
