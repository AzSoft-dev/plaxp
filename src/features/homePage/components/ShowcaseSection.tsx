import React from 'react';
import { useInView } from 'react-intersection-observer';

export const ShowcaseSection: React.FC = () => {
  const { ref: imgRef1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: imgRef2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: imgRef3, inView: inView3 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const features = [
    {
      ref: imgRef1,
      inView: inView1,
      src: '/home-page/estadisticas.png',
      alt: 'Estadísticas y Análisis',
      title: 'Analiza y controla las',
      highlightedWord: 'estadísticas',
      description: 'Utiliza las estadísticas para analizar el desempeño de tu equipo, estudiar la mejor estrategia y mantener el control de todas las comunicaciones',
      imagePosition: 'left' as const,
      fadeEdges: true
    },
    {
      ref: imgRef2,
      inView: inView2,
      src: '/home-page/pagos.png',
      alt: 'Gestión de Pagos',
      title: 'Gestiona los pagos de manera',
      highlightedWord: 'eficiente',
      description: 'Controla todos los pagos de tu institución en un solo lugar. Genera reportes, envía recordatorios automáticos y mantén un registro completo de transacciones',
      imagePosition: 'right' as const,
      fadeEdges: true
    },
    {
      ref: imgRef3,
      inView: inView3,
      src: '/home-page/modulos-centralizados.jpg',
      alt: 'Módulos Centralizados',
      title: 'Todos tus módulos',
      highlightedWord: 'centralizados',
      description: 'Accede a todas las funcionalidades de tu institución desde un solo lugar. Gestiona estudiantes, profesores, cursos, pagos y más desde una plataforma unificada',
      imagePosition: 'left' as const,
      fadeEdges: true
    }
  ];

  return (
    <section className="section-padding bg-neutral-950 scroll-mt-16">
      <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 sm:mb-24 md:mb-32 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Descubre cómo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Plaxp{' '}
            </span>
            potencia tu institución
          </h2>

        </div>

        {/* Features */}
        <div className="space-y-20 md:space-y-32 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-8 md:gap-16 items-center animate-fade-in ${
                feature.imagePosition === 'right' ? 'lg:grid-flow-dense' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Image */}
              <div
                ref={feature.ref}
                className={`relative order-2 lg:order-none ${
                  feature.imagePosition === 'right' ? 'lg:col-start-2' : ''
                }`}
              >
                {!feature.inView ? (
                  // Skeleton loader
                  <div className="w-full aspect-[4/3] bg-neutral-800/50 animate-pulse rounded-2xl"></div>
                ) : (
                  <div className="relative">
                    <img
                      src={feature.src}
                      alt={feature.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto transition-opacity duration-500"
                      style={{ opacity: 0 }}
                      onLoad={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    />
                    {feature.fadeEdges && (
                      <>
                        {/* Gradiente superior - más sutil en móvil */}
                        <div className="absolute top-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-b from-neutral-950/60 md:from-neutral-950 to-transparent pointer-events-none"></div>
                        {/* Gradiente inferior - más sutil en móvil */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-t from-neutral-950/60 md:from-neutral-950 to-transparent pointer-events-none"></div>
                        {/* Gradiente izquierdo - más sutil en móvil */}
                        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-neutral-950/60 md:from-neutral-950 to-transparent pointer-events-none"></div>
                        {/* Gradiente derecho - más sutil en móvil */}
                        <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-neutral-950/60 md:from-neutral-950 to-transparent pointer-events-none"></div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className={`space-y-6 order-1 lg:order-none ${
                  feature.imagePosition === 'right' ? 'lg:col-start-1 lg:row-start-1 text-left' : 'text-right'
                }`}
              >
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  {feature.title}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                    {feature.highlightedWord}
                  </span>
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed">
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
