import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

// https://vite.dev/config/
export default defineConfig(() => {
  // Solo usar Electron cuando la variable de entorno ELECTRON esté definida
  const isElectron = process.env.ELECTRON === 'true';

  const plugins = [react()];

  // Agregar plugin de Electron solo si está habilitado
  if (isElectron) {
    plugins.push(
      electron({
        main: {
          // Archivo principal de Electron
          entry: 'electron/main.ts',
        },
        preload: {
          // Archivo preload de Electron
          input: 'electron/preload.ts',
        },
        // Opciones del renderer (opcional)
        renderer: {},
      }) as any
    );
  }

  return {
    plugins,
    // Configuración para el servidor de desarrollo
    server: {
      port: 5173,
    },
    // Configuración para el build
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
})
