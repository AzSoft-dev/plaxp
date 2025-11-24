import React, { useState, useRef, useEffect } from 'react';
import { geminiService, type ChatMessage } from '../services/geminiService';

interface ChatBotProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Notificar cambios de estado
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Solicitar permiso para notificaciones al montar el componente
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Función para mostrar notificación del navegador
  const showBrowserNotification = (message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      // Solo mostrar si la pestaña no está activa
      if (document.hidden) {
        const notification = new Notification('Nuevo mensaje de Nox', {
          body: message.length > 100 ? message.substring(0, 100) + '...' : message,
          icon: '/mascota.jpg',
          badge: '/icono.png',
          tag: 'plaxp-chatbot',
          silent: false, // Permitir sonido del sistema
        });

        // Auto cerrar después de 5 segundos
        setTimeout(() => notification.close(), 5000);

        // Si hace clic en la notificación, enfocar la ventana
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }
  };

  // Función para reproducir sonido de notificación realista (estilo iOS/Android)
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
      masterGain.gain.setValueAtTime(0.5, audioContext.currentTime);

      const playTone = (
        frequency: number,
        startTime: number,
        duration: number,
        volume: number = 1,
        type: OscillatorType = 'sine'
      ) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);

        // Envelope ADSR
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.6, startTime + 0.005); // Attack rápido
        gainNode.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.02); // Decay
        gainNode.gain.linearRampToValueAtTime(volume * 0.3, startTime + duration * 0.7); // Sustain
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Release

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;

      // Sonido estilo iOS/WhatsApp: tres tonos ascendentes con reverberación
      // Primer tono - Nota más baja
      playTone(660, now, 0.08, 0.8); // E5

      // Segundo tono - Nota media (con ligero delay)
      playTone(880, now + 0.06, 0.08, 0.9); // A5

      // Tercer tono - Nota alta
      playTone(1046.5, now + 0.12, 0.12, 1); // C6

      // Agregar armónicos para mayor riqueza
      playTone(1320, now + 0.12, 0.08, 0.3); // E6 (armónico)
      playTone(1760, now + 0.12, 0.06, 0.2); // A6 (armónico sutil)

    } catch (error) {
      console.log('No se pudo reproducir el sonido:', error);
    }
  };

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar el chat cuando se abre por primera vez
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChat();
    }
  }, [isOpen]);

  // Focus en el input cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const initializeChat = () => {
    geminiService.initializeChat();
    setMessages([
      {
        role: 'assistant',
        content: '¡Hola! Soy Nox, el asistente virtual de PLAXP. Estoy aquí para ayudarte con cualquier pregunta sobre nuestra plataforma de gestión académica. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ]);
    setIsInitialized(true);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Agregar mensaje del usuario
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Obtener respuesta del bot
      const response = await geminiService.sendMessage(userMessage);

      // Agregar respuesta del bot
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Reproducir sonido de notificación (siempre)
      playNotificationSound();

      // Mostrar notificación del navegador (solo si la pestaña no está activa)
      showBrowserNotification(response);
    } catch (error) {
      // Mensaje de error
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    geminiService.resetConversation();
    initializeChat();
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-16 h-16 rounded-full
          bg-gradient-to-br from-primary to-purple-600
          hover:from-primary/90 hover:to-purple-700
          shadow-strong hover:shadow-xl
          transition-all duration-300
          flex items-center justify-center
          group
          ${isOpen ? 'scale-0' : 'scale-100'}
        `}
        aria-label="Abrir chat"
      >
        <svg
          className="w-8 h-8 text-white transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        {/* Indicador de notificación */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full border-2 border-white animate-pulse"></div>
      </button>

      {/* Ventana del chat */}
      <div
        className={`
          fixed z-50
          bg-white dark:bg-dark-card
          shadow-strong
          border border-neutral-200 dark:border-dark-border
          flex flex-col
          transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}

          /* Móvil: pantalla completa */
          inset-0 rounded-none

          /* Desktop: ventana flotante */
          md:bottom-6 md:right-6 md:top-auto md:left-auto
          md:w-[400px] md:h-[600px]
          md:rounded-2xl md:inset-auto
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-dark-border bg-gradient-to-r from-primary/10 to-purple-600/10 md:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-primary/20">
              <img
                src="/mascota.jpg"
                alt="Mascota PLAXP"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                Nox
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                En línea
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Botón reset */}
            <button
              onClick={handleReset}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Reiniciar conversación"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            {/* Botón cerrar */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              title="Cerrar chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-dark-bg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
                  ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                      : 'bg-white dark:bg-dark-card text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-dark-border'
                  }
                `}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user'
                      ? 'text-white/70'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Indicador de carga */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-card md:rounded-b-2xl">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              className="
                flex-1 px-4 py-3 rounded-xl
                bg-neutral-100 dark:bg-dark-bg
                border border-neutral-200 dark:border-dark-border
                text-neutral-900 dark:text-neutral-100
                placeholder-neutral-500 dark:placeholder-neutral-400
                focus:outline-none focus:ring-2 focus:ring-primary/50
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="
                px-4 py-3 rounded-xl
                bg-gradient-to-br from-primary to-purple-600
                hover:from-primary/90 hover:to-purple-700
                text-white font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all shadow-sm hover:shadow-md
                flex items-center justify-center
              "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
            Presiona Enter para enviar
          </p>
        </div>
      </div>
    </>
  );
};
