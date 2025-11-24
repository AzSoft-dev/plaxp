import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true, // Ocultar la barra de menú
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/icono.png'),
    title: 'Plaxp',
    backgroundColor: '#f5f5f5',
    show: false, // No mostrar hasta que esté listo
  });

  // Eliminar el menú completamente
  Menu.setApplicationMenu(null);

  // Mostrar la ventana cuando esté lista para evitar el flash blanco
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // En desarrollo, cargar desde el servidor de Vite
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Abrir DevTools en desarrollo
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargar el archivo index.html
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Crear la ventana cuando la app esté lista
app.whenReady().then(() => {
  createWindow();

  // En macOS, recrear la ventana cuando se hace clic en el dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Salir cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manejo de errores no capturadas
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
