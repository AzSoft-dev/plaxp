import React, { useState, useRef } from 'react';

export const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="section-padding bg-neutral-900 px-4 sm:px-6 lg:px-12">
      <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            La Gestión Educativa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Nunca Fue Tan Simple</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed">
            Descubre cómo miles de instituciones están revolucionando su administración académica.
          </p>
        </div>

        {/* Video Container */}
        <div className="max-w-5xl mx-auto">
          <div className="relative group cursor-pointer">
            {/* Animated gradient border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-2xl opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-500 animate-pulse"></div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

            {/* Video wrapper */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-neutral-800/80 shadow-2xl bg-black">
              {/* Custom play overlay */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-black/30"
                  onClick={handlePlayClick}
                >
                  <div className="relative">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>

                    {/* Play button */}
                    <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-10 h-10 md:w-12 md:h-12 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Watch text */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-semibold text-lg md:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Ver Video
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                className="w-full h-auto"
                controls={isPlaying}
                preload="metadata"
                poster="home-page/video-thumbnail.png"
                onClick={handleVideoClick}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src="home-page/video_promocional.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>

              {/* Gradient overlay on edges */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
