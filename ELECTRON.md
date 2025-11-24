# Plaxp - Aplicación Web y de Escritorio

Esta aplicación puede ejecutarse tanto como una aplicación web normal como una aplicación de escritorio usando Electron.

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🌐 Desarrollo Web (sin Electron)

Para ejecutar la aplicación en modo web normal:

```bash
npm run dev
```

Abre el navegador en `http://localhost:5173/`

Para generar el build web:

```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos para desplegar en cualquier servidor web.

## 🖥️ Desarrollo con Electron

Para ejecutar la aplicación en modo desarrollo con Electron:

```bash
npm run electron:dev
```

Esto iniciará:
1. El servidor de desarrollo de Vite
2. La aplicación Electron con hot-reload
3. DevTools abiertos automáticamente

## 📦 Empaquetado

### Para Windows (actual plataforma)

```bash
npm run electron:build:win
```

Genera un instalador `.exe` en la carpeta `release/`

### Para macOS

```bash
npm run electron:build:mac
```

Genera un archivo `.dmg` en la carpeta `release/`

### Para Linux

```bash
npm run electron:build:linux
```

Genera archivos `.AppImage` y `.deb` en la carpeta `release/`

### Para todas las plataformas

```bash
npm run electron:build
```

## 📁 Estructura del Proyecto

```
plaxp/
├── electron/
│   ├── main.ts          # Proceso principal de Electron
│   └── preload.ts       # Script de preload (puente seguro)
├── src/                 # Código fuente de React
├── public/              # Recursos estáticos
├── dist/                # Build de la aplicación web
├── dist-electron/       # Build de Electron
└── release/             # Aplicaciones empaquetadas
```

## 🔧 Configuración

### Personalización del Icono

Reemplaza el archivo `public/icono.png` con tu propio icono:
- Tamaño recomendado: 512x512px o 1024x1024px
- Formato: PNG con transparencia

### Configuración de electron-builder

Edita `electron-builder.json5` para personalizar:
- ID de la aplicación
- Nombre del producto
- Configuración de instaladores
- Categorías
- Y más...

## 🛠️ Scripts Disponibles

### Desarrollo Web
- `npm run dev` - Modo desarrollo web (navegador)
- `npm run build` - Build para web (genera carpeta `dist/`)
- `npm run preview` - Preview del build web

### Desarrollo Electron
- `npm run electron:dev` - Modo desarrollo con Electron
- `npm run electron:build` - Build para la plataforma actual
- `npm run electron:build:win` - Build para Windows
- `npm run electron:build:mac` - Build para macOS
- `npm run electron:build:linux` - Build para Linux

## 📝 Notas Importantes

1. **Diferencia entre Web y Electron**:
   - `npm run dev` / `npm run build` → Versión WEB (navegador) - NO incluye Electron
   - `npm run electron:dev` / `npm run electron:build` → Versión DESKTOP (aplicación nativa) - Incluye Electron

2. **Modo Desarrollo**: La aplicación Electron se ejecuta con DevTools abiertos para facilitar el debugging
3. **Hot Reload**: Los cambios en el código se reflejan automáticamente en ambos modos
4. **Seguridad**: Context Isolation está habilitado en Electron para mayor seguridad
5. **Icono**: Asegúrate de tener `icono.png` en la carpeta `public/`
6. **Build Web**: La carpeta `dist/` contiene archivos estáticos que pueden desplegarse en cualquier servidor web
7. **Build Electron**: La carpeta `release/` contiene los instaladores de la aplicación de escritorio

## 🐛 Troubleshooting

### La aplicación no inicia

1. Verifica que todas las dependencias estén instaladas:
   ```bash
   npm install
   ```

2. Limpia las carpetas de build:
   ```bash
   npm run clean
   ```

### Error en el empaquetado

1. Verifica que el icono exista en `public/icono.png`
2. Revisa la configuración en `electron-builder.json5`
3. Asegúrate de que la carpeta `dist/` tenga los archivos compilados

## 📚 Recursos

- [Documentación de Electron](https://www.electronjs.org/docs/latest)
- [Documentación de electron-builder](https://www.electron.build/)
- [Documentación de Vite](https://vitejs.dev/)
