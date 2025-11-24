import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type DemoSection = 'dashboard' | 'estudiantes' | 'cursos' | 'profesores' | 'reportes';

interface DemoFeature {
  id: DemoSection;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const demoFeatures: DemoFeature[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Inteligente',
    description: 'Visualiza métricas clave, estadísticas en tiempo real y accede rápidamente a todas las funcionalidades del sistema.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    image: 'home-page/dashboard.png'
  },
  {
    id: 'estudiantes',
    title: 'Gestión de Estudiantes',
    description: 'Administra perfiles completos, seguimiento académico, asistencia y comunicación directa con estudiantes y padres.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    image: 'home-page/dashboard.png'
  },
  {
    id: 'cursos',
    title: 'Cursos y Programas',
    description: 'Crea y gestiona programas académicos, asigna profesores, define horarios y organiza el contenido educativo.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    image: 'home-page/dashboard.png'
  },
  {
    id: 'profesores',
    title: 'Personal Docente',
    description: 'Gestiona información del personal, asignaciones de curso, horarios y evaluación del desempeño académico.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    image: 'home-page/dashboard.png'
  },
  {
    id: 'reportes',
    title: 'Reportes y Analytics',
    description: 'Genera reportes detallados, analiza tendencias y toma decisiones informadas con datos en tiempo real.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    image: 'home-page/dashboard.png'
  }
];

export const DemoPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DemoSection>('dashboard');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const activeFeature = demoFeatures.find(f => f.id === activeSection) || demoFeatures[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-custom px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <img src="home-page/logo.png" alt="Plaxp" className="h-7 sm:h-8 object-contain" />
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors"
              >
                Volver al Inicio
              </Link>
              <Link
                to="/login"
                className="btn-primary text-sm px-6 py-2"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container-custom px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 dark:from-primary/20 dark:via-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm border border-primary/20 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 font-semibold text-sm">
                Demo Interactiva
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white">
                Explora Plaxp en Acción
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Descubre cómo nuestra plataforma puede transformar la gestión de tu institución educativa
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="pb-20">
        <div className="container-custom px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Feature Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-12">
              {demoFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => {
                    setActiveSection(feature.id);
                    setIsImageLoaded(false);
                  }}
                  className={`relative group p-4 md:p-6 rounded-2xl transition-all duration-300 ${
                    activeSection === feature.id
                      ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-xl scale-105'
                      : 'bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary dark:hover:border-primary text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeSection === feature.id
                        ? 'bg-white/20'
                        : 'bg-primary/10 group-hover:bg-primary/20'
                    }`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-sm md:text-base">
                      {feature.title}
                    </h3>
                  </div>

                  {activeSection === feature.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 -z-10"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Feature Display */}
            <div className="relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-10"></div>

              <div className="relative p-6 md:p-10">
                {/* Content */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white">
                      {activeFeature.title}
                    </span>
                  </h2>
                  <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl">
                    {activeFeature.description}
                  </p>
                </div>

                {/* Screenshot Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 aspect-video">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={activeFeature.image}
                    alt={activeFeature.title}
                    onLoad={() => setIsImageLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      isImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Overlay with features */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <p className="text-sm font-medium mb-2">Funcionalidades incluidas:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">Vista en tiempo real</span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">Filtros avanzados</span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">Exportación de datos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link
                    to="/login"
                    className="flex-1 btn-primary text-center justify-center group"
                  >
                    Probar Gratis
                    <svg className="w-5 h-5 ml-2 inline-block transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    to="/agendar"
                    className="flex-1 btn-secondary text-center group"
                  >
                    Agendar Demo Personalizada
                  </Link>
                </div>
              </div>

              {/* Decorative gradient line */}
              <div className="h-1 bg-gradient-to-r from-primary/60 via-purple-500/60 to-pink-500/60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-neutral-100 dark:bg-neutral-950">
        <div className="container-custom px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white">
                  Todo lo que necesitas en un solo lugar
                </span>
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Características diseñadas para optimizar cada aspecto de tu institución
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '📊', title: 'Reportes Personalizables', desc: 'Crea reportes a medida de tus necesidades' },
                { icon: '🔔', title: 'Notificaciones Inteligentes', desc: 'Mantén a todos informados en tiempo real' },
                { icon: '📱', title: 'App Móvil', desc: 'Accede desde cualquier dispositivo' },
                { icon: '🔒', title: 'Seguridad Avanzada', desc: 'Protección de datos de nivel empresarial' },
                { icon: '☁️', title: 'Cloud Storage', desc: 'Almacenamiento seguro en la nube' },
                { icon: '🤝', title: 'Soporte 24/7', desc: 'Asistencia cuando la necesites' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-xl"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">{item.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  ¿Listo para transformar tu institución?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Únete a las instituciones que ya confían en Plaxp
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Comenzar Ahora
                  </Link>
                  <Link
                    to="/"
                    className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    Ver Más Información
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
