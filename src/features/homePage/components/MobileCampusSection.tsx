import React from 'react';
import { useInView } from 'react-intersection-observer';

export const MobileCampusSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const steps = [
    {
      number: '1.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Optimizado para iOS y Android'
    },
    {
      number: '2.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Materiales claros y actividades interactivas'
    },
    {
      number: '3.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Aprende en cualquier momento y lugar'
    }
  ];

  return (
    <section className="section-padding bg-[#111111] px-4 sm:px-6 lg:px-12">
      <div className="w-full">
        <div ref={ref} className="max-w-[1400px] mx-auto">
          {/* Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Content */}
            <div className={`space-y-8 ${inView ? 'animate-slide-up' : 'opacity-0'}`}>
              {/* Title */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
                  Campus{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                    Virtual
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Lleva tu aprendizaje a donde estés. Nuestra plataforma ofrece contenido dinámico,
                  accesible y optimizado para dispositivos iOS y Android. Aprende de forma flexible,
                  con materiales claros, actividades interactivas y módulos diseñados para estudiar
                  en cualquier momento y lugar.
                </p>
              </div>

              {/* Steps */}
              <div className="hidden md:grid md:grid-cols-3 gap-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 ${inView ? 'animate-fade-in' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 text-white">
                      {step.icon}
                    </div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                      <span className="text-primary">{step.number}</span> {step.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Mockup Image */}
            <div className={`relative ${inView ? 'animate-slide-up' : 'opacity-0'} lg:order-last`} style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Image Container */}
                <div className="relative">
                  <img
                    src="home-page/mockup-moodle.png"
                    alt="Campus Virtual Móvil - Mockup"
                    className="w-full h-auto max-w-xlg mx-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
