import React, { useEffect } from "react";

declare global {
  interface Window {
    Calendly: any;
  }
}

export const DemoSchedulePage: React.FC = () => {
  useEffect(() => {
    // Si el script ya existe, no lo vuelvas a agregar
    const existingScript = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );

    const existingCSS = document.querySelector(
      'link[href="https://assets.calendly.com/assets/external/widget.css"]'
    );

    if (!existingCSS) {
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    const init = () => {
      const parent = document.getElementById("calendly-container");

      // ⛔ Evitar reinicializar si ya hay un iframe dentro
      if (parent && parent.childElementCount === 0 && window.Calendly) {
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/joseguev379/30min?locale=es&background_color=13161b&text_color=FAFAFA&primary_color=6a48bf&hide_gdpr_banner=1&month=2025-11",
          parentElement: parent,
        });
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
    } else {
      // Si ya estaba cargado, solo inicializar
      init();
    }
  }, []);

  return (
    <div className="min-h-screen h-screen w-screen overflow-hidden bg-[#13161b]">
      <div
        id="calendly-container"
        className="h-full w-full"
        style={{ minHeight: "100vh" }}
      ></div>
    </div>
  );
};
