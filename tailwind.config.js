/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color principal de Plaxp
        primary: '#6a48bf',
        // Colores neutros (grises actualizados)
        neutral: {
          100: '#FAFAFA',        // Fondo muy claro
          200: '#EAEAEA',        // Bordes suaves
          300: '#CFCFCF',        // Bordes normales
          500: '#7A7A7A',        // Texto secundario
          600: '#5C5C5C',        // Texto terciario
          700: '#3C3C3C',        // Texto normal
          900: '#1A1A1A',        // Texto principal/títulos
        },
        // Colores de estado
        success: '#10B981',      // Verde (éxito)
        warning: '#F59E0B',      // Amarillo/Naranja (advertencia)
        danger: '#EF4444',       // Rojo (error/peligro)
        info: '#3B82F6',         // Azul (información)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

