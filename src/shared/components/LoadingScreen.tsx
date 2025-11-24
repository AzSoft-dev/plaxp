import { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-dark-bg dark:to-gray-800">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-200 dark:bg-pink-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 md:px-8 max-w-2xl w-full">
        {/* Logo/Animation Container */}
        <div className="mb-8 md:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-full blur-2xl opacity-20 dark:opacity-30 animate-pulse"></div>
          <img
            src="/waiting-animate.svg"
            alt="Loading animation"
            className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 relative z-10 drop-shadow-2xl dark:brightness-90"
          />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4 md:space-y-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
            Bienvenido a PLAXP
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 font-medium px-4">
            Iniciando tu entorno académico inteligente{dots}
          </p>

          {/* Loading bar */}
          <div className="w-full max-w-md mx-auto mt-8">
            <div className="h-1.5 md:h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 rounded-full animate-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
