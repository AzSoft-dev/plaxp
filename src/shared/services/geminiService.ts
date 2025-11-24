import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = 'AIzaSyDpPgx_owDJZ0xme1Ld8CNiUQElqwA-398';

// Contexto de PLAXP para Gemini
const PLAXP_CONTEXT = `
Eres un asistente virtual para PLAXP, te llamas 'Nox', una plataforma integral de gestión académica. No agregues * asteriscos al textos ni intentes darle formatos como: negrita, cursiva o cualquier otro.

INFORMACIÓN SOBRE PLAXP:

Producto:
PLAXP es una plataforma integral de gestión académica para instituciones educativas privadas en Centro America. Combina gestión académica completa, facturación automatizada y herramientas administrativas en un solo sistema.

Empresa:
- Desarrollador: AzSoft S.R.L., empresa tecnológica costarricense
- Equipo: CEO Jose, CTO Yesler, CFO Donald (equipo de 6-7 personas, San José)
- Especialización: Implementaciones de Odoo ERP y Moodle LMS para instituciones educativas

José Guevara Ibarra: Más de 4 años uniendo diseño y funcionalidad. Certificado en redes y sistemas operativos, transforma ideas en productos modernos y eficientes. 
Yesler Lorio Pérez: Más de 4 años de experiencia. Especialista en despliegue de aplicaciones, servidores y Ciberseguridad. Garantiza la disponibilidad e integridad de tus datos.
Donald Ariel Benavides: Empresario, educador y visionario financiero. Dirige la estrategia económica de la empresa, potenciando su crecimiento inteligente y sostenido.
Dexter Franklin: Administrador de empresas y CEO experto en ventas y marketing. Lidera el crecimiento comercial y la captación de clientes con inteligencia estratégica.

Planes y Precios:
- Start: $35/mes + $0.30 por estudiante activo
- Pro: $45/mes + $0.20 por estudiante activo
- Business: $75/mes + $0.15 por estudiante activo
Todos incluyen gestión académica completa, facturación y automatización.

Estado Actual:
- En desarrollo activo (MVP)
- Hay leads esperando el lanzamiento
- Arquitectura: VPS simple para deployment rápido
- UI/UX: Diseño oscuro profesional inspirado en Linear y Stripe

Mercado Objetivo:
Instituciones educativas privadas de Centro America que necesitan:
- Gestión de estudiantes, calificaciones, asistencia
- Facturación automatizada
- Reportes y comunicación con padres
- Alternativa integrada vs. sistemas separados

Tu rol:
- Responde preguntas sobre PLAXP de manera amigable y profesional
- Ayuda a los usuarios a entender las funcionalidades
- Proporciona información sobre planes y precios
- Guía a los usuarios en el uso de la plataforma
- Sé conciso pero informativo
- Usa un tono profesional pero cercano

Recuerda: Eres parte del equipo de PLAXP y estás aquí para ayudar a las instituciones educativas a tener éxito.
`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class GeminiService {
  private ai: GoogleGenAI;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });
  }

  /**
   * Inicializa una nueva conversación agregando el mensaje de bienvenida
   */
  initializeChat() {
    this.conversationHistory = [
      {
        role: 'assistant',
        content: '¡Hola! Soy Nox el asistente virtual de PLAXP. Estoy aquí para ayudarte con cualquier pregunta sobre nuestra plataforma de gestión académica. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ];
  }

  /**
   * Construye el prompt completo con el contexto y el historial
   */
  private buildPrompt(userMessage: string): string {
    let prompt = PLAXP_CONTEXT + '\n\n';

    // Agregar historial de conversación
    for (const msg of this.conversationHistory) {
      if (msg.role === 'user') {
        prompt += `Usuario: ${msg.content}\n`;
      } else {
        prompt += `Asistente: ${msg.content}\n`;
      }
    }

    // Agregar el nuevo mensaje
    prompt += `Usuario: ${userMessage}\nAsistente:`;

    return prompt;
  }

  /**
   * Envía un mensaje al chatbot y obtiene la respuesta
   */
  async sendMessage(message: string): Promise<string> {
    try {
      console.log('Enviando mensaje a Gemini:', message);

      // Agregar mensaje del usuario al historial
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Construir el prompt con contexto e historial
      const prompt = this.buildPrompt(message);

      // Enviar a Gemini
      const response = await this.ai.models.generateContent({
        model: 'models/gemini-2.0-flash',
        contents: prompt,
      });

      const text = response.text || 'Lo siento, no pude generar una respuesta.';
      console.log('Respuesta recibida de Gemini:', text.substring(0, 100) + '...');

      // Agregar respuesta del asistente al historial
      this.conversationHistory.push({
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      });

      return text;
    } catch (error: any) {
      console.error('Error detallado al enviar mensaje a Gemini:', error);
      console.error('Error message:', error.message);

      // Verificar si es un error de API key
      if (error.message?.includes('API key') || error.message?.includes('API_KEY') || error.message?.includes('401')) {
        throw new Error('Error de configuración de API. Por favor, verifica la API key de Gemini.');
      }

      // Verificar si es un error de cuota
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        throw new Error('Se ha alcanzado el límite de la API. Por favor, intenta más tarde.');
      }

      // Verificar si es un error 404
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        throw new Error('Modelo de Gemini no encontrado. Por favor, verifica tu configuración.');
      }

      throw new Error('No pude procesar tu mensaje. Por favor, intenta de nuevo.');
    }
  }

  /**
   * Obtiene el historial de la conversación
   */
  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  /**
   * Reinicia la conversación
   */
  resetConversation() {
    this.conversationHistory = [];
    this.initializeChat();
  }

  /**
   * Verifica si hay una conversación activa
   */
  hasActiveConversation(): boolean {
    return this.conversationHistory.length > 0;
  }
}

// Exportar una instancia única del servicio
export const geminiService = new GeminiService();
