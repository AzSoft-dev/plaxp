import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

export const CTASection: React.FC = () => {
  const { ref: ctaRef, inView: ctaInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="contacto" className="section-padding bg-neutral-950 scroll-mt-16">
      <div className="container-custom px-4 sm:px-6">
        <div
          ref={ctaRef}
          className={`relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-purple-600 transition-all duration-1000 ${
            ctaInView
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-10 scale-95'
          }`}
        >

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 grid  gap-8 md:gap-12 p-6 sm:p-8 md:p-12 lg:p-16">
            
            {/* TEXT SIDE */}
            <div className="text-white flex flex-col justify-center">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 md:mb-6 w-fit">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Transforma tu institución hoy
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                Comienza tu transformación con Plaxp
              </h2>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed">
                Completa el formulario o reserva una demo para descubrir cómo Plaxp puede impulsar tu institución educativa.
              </p>

              {/* Reservar una demo — NUEVO */}
              {/* <button
                onClick={() => }
                className="w-full sm:w-auto bg-white text-primary font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-neutral-100 transition-all mb-6"
              >
                Reservar una demo
              </button> */}
              <div>
                <Link
                    to="/schedule-demo"
                    className="inline-flex items-center justify-center w-auto bg-white text-primary font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-neutral-100 transition-all mb-6"
                >
                    Reservar una demo
                    <span
                        className="ml-3 inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary via-purple-600 animate-fade-in text-white rounded-full font-bold"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={4} // ⬅️ ¡Aquí está la magia para hacerlo grueso!
                        stroke="currentColor" 
                        className="h-5 w-5"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" 
                        />
                      </svg>
                    </span>
                </Link>
            </div>

              {/* Trust Points */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-base">Sin compromiso</p>
                    <p className="text-sm text-white/70">Prueba gratuita sin tarjeta de crédito</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-base">Demo personalizada</p>
                    <p className="text-sm text-white/70">Ajustada a tus necesidades</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-base">Soporte incluido</p>
                    <p className="text-sm text-white/70">Te guiamos en todo el proceso</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Decorative */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

        </div>
      </div>
    </section>
  );
};
