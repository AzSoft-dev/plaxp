import React from 'react';

export const AboutSection: React.FC = () => {
  const stats = [
    { value: '10x', label: 'Más rápido' },
    { value: '100%', label: 'Seguro' },
    { value: '24/7', label: 'Disponible' }
  ];

  return (
    <section id="caracteristicas" className="section-padding bg-[#121212] scroll-mt-16 px-4 sm:px-6 lg:px-20">
      <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            La plataforma que{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              transforma
            </span>
            {' '}tu institución
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-400 leading-relaxed">
            Centraliza tu gestión académica, administrativa y financiera en un solo lugar.
            Elimina hojas de cálculo y procesos manuales.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 mb-2">
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-neutral-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
