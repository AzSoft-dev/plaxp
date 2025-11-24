import React from 'react';
import { useInView } from 'react-intersection-observer';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: faqRef, inView: faqInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const faqs = [
    {
      question: '¿Qué es Plaxp?',
      answer: 'Plaxp es un sistema integral de gestión académica que unifica la administración, gestión académica y financiera de instituciones educativas en una sola plataforma. Incluye módulos para gestión de estudiantes, profesores, cursos, pagos, campus virtual y más.'
    },
    {
      question: '¿Cuánto tiempo toma implementar Plaxp?',
      answer: 'El tiempo de implementación varía según el tamaño de tu institución. Generalmente, una institución pequeña o mediana puede estar operativa en 2-4 semanas. Nuestro equipo te acompaña en todo el proceso de migración, capacitación y puesta en marcha.'
    },
    {
      question: '¿Plaxp funciona en dispositivos móviles?',
      answer: 'Sí, Plaxp está completamente optimizado para dispositivos móviles. Tanto estudiantes como profesores y administradores pueden acceder desde cualquier dispositivo con conexión a internet, incluyendo smartphones y tablets iOS y Android.'
    },
    {
      question: '¿Mis datos están seguros?',
      answer: 'Absolutamente. Utilizamos cifrado de nivel empresarial, respaldos automáticos diarios, y cumplimos con estándares internacionales de seguridad. Todos tus datos están alojados en servidores seguros con múltiples capas de protección.'
    },
    {
      question: '¿Puedo integrar Plaxp con otras herramientas?',
      answer: 'Sí, Plaxp ofrece integraciones con sistemas de pago, plataformas de videoconferencia, herramientas de email marketing y más. También contamos con API para integraciones personalizadas según las necesidades específicas de tu institución.'
    },
    {
      question: '¿Ofrecen soporte técnico?',
      answer: 'Sí, ofrecemos soporte técnico continuo. Tenemos un equipo dedicado disponible por chat, email y teléfono. Además, proporcionamos documentación completa, tutoriales en video y capacitaciones personalizadas para tu equipo.'
    },
    {
      question: '¿Cuál es el costo de Plaxp?',
      answer: 'Nuestros planes se ajustan al tamaño y necesidades de tu institución. Ofrecemos diferentes paquetes según el número de estudiantes y módulos que necesites. Contáctanos para recibir una cotización personalizada sin compromiso.'
    },
    {
      question: '¿Puedo probar Plaxp antes de comprometerse?',
      answer: 'Sí, ofrecemos una demo personalizada donde te mostramos todas las funcionalidades según las necesidades de tu institución. También tenemos un período de prueba para que puedas experimentar la plataforma en tu entorno real.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="preguntas" className="section-padding bg-neutral-900 scroll-mt-16 px-4 sm:px-6 lg:px-12">
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
            Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Frecuentes</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed">
            Resolvemos las dudas más comunes sobre Plaxp
          </p>
        </div>

        {/* FAQ Accordion */}
        <div ref={faqRef} className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/50"
              style={{
                transitionDelay: `${index * 80}ms`,
                opacity: faqInView ? 1 : 0,
                transform: faqInView
                  ? 'translateY(0)'
                  : 'translateY(20px)',
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-all duration-300"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white pr-4 group-hover:text-primary transition-colors duration-300">
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'rotate-180 bg-primary' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                  <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bottom */}
        <div className="max-w-2xl mx-auto text-center mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-base sm:text-lg text-neutral-300 mb-4">
            ¿Tienes más preguntas?
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 group"
          >
            Contáctanos
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
