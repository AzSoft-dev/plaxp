# 📅 Clon de Calendly - Documentación Completa

## 🎯 Resumen del Proyecto

Este proyecto implementa un **clon completo de la interfaz de Calendly** que se conecta directamente con tu evento real de Calendly mediante su API oficial. Mantienes toda la lógica interna de Calendly (disponibilidad, reglas, emails, notificaciones, timezone) pero con tu propia interfaz personalizada.

**URL del evento original:** `https://calendly.com/joseguev379/30min?locale=es&background_color=13161b&text_color=FAFAFA&primary_color=6a48bf`

**Ruta de la aplicación:** `/agendar`

---

## 🎨 Paleta de Colores

```css
background_color: #13161b
text_color: #FAFAFA
primary_color: #6a48bf
```

---

## 📁 Arquitectura del Proyecto

```
src/features/calendly/
├── api/
│   └── calendlyApi.ts              # Cliente de API de Calendly
├── components/
│   ├── CalendarPicker.tsx          # Selector de fecha personalizado
│   ├── TimeSlotPicker.tsx          # Selector de horarios disponibles
│   ├── BookingForm.tsx             # Formulario de captura de datos
│   └── ConfirmationScreen.tsx      # Pantalla de confirmación
├── hooks/
│   ├── useCalendlyAvailability.ts  # Hook para obtener disponibilidad
│   └── useCalendlyBooking.ts       # Hook para crear reservas
├── pages/
│   └── CalendlyBookingPage.tsx     # Página principal del flujo
├── types/
│   └── calendly.types.ts           # Tipos TypeScript
└── utils/
    └── timezoneUtils.ts            # Utilidades de timezone y formato
```

---

## 🔌 API de Calendly Utilizada

### Endpoints Principales

#### 1. Obtener Disponibilidad
```http
GET https://api.calendly.com/event_type_available_times
```

**Parámetros:**
- `event_type`: UUID del tipo de evento
- `start_time`: Fecha/hora de inicio (ISO 8601)
- `end_time`: Fecha/hora de fin (ISO 8601)
- `timezone`: Zona horaria del usuario

**Respuesta:**
```json
{
  "collection": [
    {
      "start_time": "2025-01-15T10:00:00Z",
      "status": "available",
      "invitees_remaining": 1
    }
  ]
}
```

#### 2. Crear Reserva
```http
POST https://api.calendly.com/scheduled_events
```

**Payload:**
```json
{
  "event_type": "event_type_uuid",
  "start_time": "2025-01-15T10:00:00Z",
  "end_time": "2025-01-15T10:30:00Z",
  "invitee": {
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "timezone": "America/Mexico_City",
    "guests": [],
    "questions_and_answers": []
  },
  "timezone": "America/Mexico_City",
  "additional_notes": "Notas adicionales"
}
```

**Respuesta:**
```json
{
  "resource": {
    "uri": "https://api.calendly.com/scheduled_events/XXX",
    "name": "Reunión de 30 minutos",
    "start_time": "2025-01-15T10:00:00Z",
    "end_time": "2025-01-15T10:30:00Z",
    "location": { "kind": "zoom" },
    "event_memberships": [...]
  }
}
```

---

## 🚀 Configuración e Instalación

### 1. Obtener Credenciales de Calendly

#### Personal Access Token
1. Ve a: https://calendly.com/integrations/api_webhooks
2. Crea un nuevo token personal
3. Copia el token (comienza con `eyJ...`)

#### Event Type UUID
**Opción A: Usando la API**
```bash
curl https://api.calendly.com/event_types \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Busca en la respuesta el evento que corresponde a `/30min` y copia su UUID.

**Opción B: Desde la URL del evento**
El UUID está en la estructura de la API. Necesitas hacer una llamada para obtenerlo del slug `joseguev379/30min`.

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita `.env` y agrega tus credenciales:
```env
# Calendly API Configuration
VITE_CALENDLY_API_TOKEN=tu_token_personal_aqui
VITE_CALENDLY_EVENT_TYPE_UUID=tu_event_type_uuid_aqui
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Visita: `http://localhost:5173/agendar`

---

## 🎯 Flujo de Usuario

### Paso 1: Selección de Fecha
- Calendario visual con días disponibles resaltados
- Navegación entre meses
- Indicadores de disponibilidad
- Detección automática del timezone del usuario

### Paso 2: Selección de Hora
- Lista de horarios disponibles para la fecha seleccionada
- Agrupación por periodo del día (mañana/tarde/noche)
- Indicador de cupos disponibles
- Botón "Ver más" si hay muchos horarios

### Paso 3: Formulario de Datos
- **Campos obligatorios:**
  - Nombre completo
  - Correo electrónico
- **Campos opcionales:**
  - Teléfono
  - Notas adicionales
  - Invitados adicionales
- Validación en tiempo real
- Resumen de la cita seleccionada

### Paso 4: Confirmación
- Pantalla de éxito con animación
- Detalles completos de la reunión
- Información del anfitrión
- Botón para agregar a Google Calendar
- Opción de agendar otra reunión

---

## 🌍 Manejo de Timezone

El sistema detecta automáticamente el timezone del usuario usando:

```typescript
getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
```

**Timezones soportados:**
- Detección automática del navegador
- Conversión correcta para API de Calendly (ISO 8601)
- Formato de visualización localizado en español

**Ejemplos:**
- `America/Mexico_City`
- `America/New_York`
- `Europe/Madrid`

---

## 📦 Componentes Principales

### CalendarPicker
Calendario personalizado con disponibilidad integrada.

**Props:**
```typescript
interface CalendarPickerProps {
  availableSlots: TimeSlot[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  isLoading?: boolean;
  minDate?: Date;
  maxDate?: Date;
}
```

**Características:**
- Grid de 7 columnas (días de la semana)
- Navegación entre meses
- Indicadores visuales de disponibilidad
- Responsive design

### TimeSlotPicker
Selector de horarios disponibles.

**Props:**
```typescript
interface TimeSlotPickerProps {
  selectedDate: Date | null;
  availableSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  isLoading?: boolean;
  eventDuration?: number;
}
```

**Características:**
- Grid responsive (2 columnas)
- Agrupación por periodo del día
- Botón "Ver más" para muchos slots
- Indicador de cupos restantes

### BookingForm
Formulario de captura de datos del usuario.

**Props:**
```typescript
interface BookingFormProps {
  selectedDate: Date;
  selectedSlot: TimeSlot;
  onSubmit: (formData: BookingFormData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
  eventName?: string;
  eventDuration?: number;
}
```

**Características:**
- Validación en tiempo real
- Soporte para invitados múltiples
- Resumen de la cita
- Estados de loading

### ConfirmationScreen
Pantalla de confirmación post-reserva.

**Props:**
```typescript
interface ConfirmationScreenProps {
  scheduledEvent: ScheduledEvent;
  eventDuration?: number;
  onNewBooking?: () => void;
}
```

**Características:**
- Animación de éxito
- Detalles completos del evento
- Botón de Google Calendar
- Opción de nueva reserva

---

## 🎣 Hooks Personalizados

### useCalendlyAvailability
Maneja la carga y gestión de disponibilidad.

```typescript
const {
  availableSlots,      // TimeSlot[]
  isLoading,          // boolean
  error,              // string | null
  refetch,            // () => Promise<void>
  getSlotsForDate     // (date: Date) => TimeSlot[]
} = useCalendlyAvailability({
  daysAhead: 60,
  autoLoad: true,
  timezone: getUserTimezone()
});
```

### useCalendlyBooking
Maneja la creación de reservas.

```typescript
const {
  isSubmitting,       // boolean
  error,              // string | null
  scheduledEvent,     // ScheduledEvent | null
  createBooking,      // (slot, formData, duration) => Promise<void>
  reset               // () => void
} = useCalendlyBooking({
  onSuccess: (event) => console.log('Reserva creada!'),
  onError: (error) => console.error(error),
  timezone: getUserTimezone()
});
```

---

## 🎨 Diseño y Estilos

### Paleta de Colores Aplicada
```css
/* Fondo principal */
background: #13161b;

/* Texto principal */
color: #FAFAFA;

/* Color primario (botones, selecciones) */
primary: #6a48bf;

/* Estados hover */
hover-primary: #6a48bf/90;

/* Bordes */
border: #FAFAFA/20;
```

### Componentes Estilizados

**Botón Primario:**
```css
bg-[#6a48bf]
text-white
hover:bg-[#6a48bf]/90
shadow-lg shadow-[#6a48bf]/30
```

**Botón Secundario:**
```css
bg-transparent
border-2 border-[#FAFAFA]/20
text-[#FAFAFA]
hover:border-[#FAFAFA]/40
hover:bg-[#FAFAFA]/5
```

**Input Field:**
```css
bg-[#13161b]
border-2 border-[#FAFAFA]/20
text-[#FAFAFA]
focus:border-[#6a48bf]
focus:ring-2 focus:ring-[#6a48bf]
```

---

## ⚠️ Manejo de Errores

### Errores de API

```typescript
// 401 - Token inválido
"Token de autenticación inválido"

// 403 - Sin permisos
"No tienes permiso para realizar esta acción"

// 404 - Evento no encontrado
"El evento no fue encontrado"

// 429 - Rate limit
"Demasiadas solicitudes. Intenta de nuevo en unos momentos"

// 500 - Error del servidor
"Error del servidor de Calendly"
```

### Errores de Validación

```typescript
// Nombre inválido
"El nombre debe tener al menos 2 caracteres"

// Email inválido
"Por favor ingresa un email válido"

// Sin disponibilidad
"No hay horarios disponibles para esta fecha"
```

### Manejo en la UI

- Banner de error visible en la parte superior
- Botón de "Intentar de nuevo" para errores de carga
- Mensajes de error específicos por campo en formularios
- Estados de loading para feedback visual

---

## 🔒 Seguridad

### Token de API
- **Almacenamiento:** Variable de entorno (`VITE_CALENDLY_API_TOKEN`)
- **Exposición:** El token se expone en el cliente (limitación de Vite)
- **Recomendación:** Para producción, considera un proxy server

### Proxy Server (Opcional - Producción)

Si quieres ocultar el token, crea un backend intermedio:

```javascript
// backend/server.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/api/calendly/availability', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.calendly.com/event_type_available_times',
      {
        headers: {
          'Authorization': `Bearer ${process.env.CALENDLY_TOKEN}`
        },
        params: req.body
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001);
```

Actualiza `calendlyApi.ts`:
```typescript
baseURL: import.meta.env.PROD
  ? 'https://tu-backend.com/api/calendly'
  : 'https://api.calendly.com'
```

---

## 📊 Características Técnicas

### Tecnologías Utilizadas
- **React 19.1.1** - UI Framework
- **TypeScript 5.9.3** - Type safety
- **Tailwind CSS 3.4.17** - Estilos
- **Axios 1.13.2** - Cliente HTTP
- **date-fns 4.1.0** - Manejo de fechas
- **React Router DOM 7.9.4** - Navegación

### Performance
- ✅ Componentes memoizados con `useMemo`
- ✅ Callbacks estables con `useCallback`
- ✅ Carga lazy de datos
- ✅ Debouncing en búsquedas
- ✅ Estados de loading optimizados

### Accesibilidad
- ✅ ARIA labels en elementos interactivos
- ✅ Navegación por teclado
- ✅ Contraste de colores WCAG AA
- ✅ Focus indicators visibles
- ✅ Mensajes de error descriptivos

### Responsive Design
- ✅ Mobile first approach
- ✅ Breakpoints: `sm`, `md`, `lg`, `xl`
- ✅ Grid adaptativo
- ✅ Touch-friendly (botones > 44px)

---

## 🧪 Testing (Recomendado)

### Tests Unitarios
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

Ejemplo de test:
```typescript
// CalendarPicker.test.tsx
import { render, screen } from '@testing-library/react';
import CalendarPicker from './CalendarPicker';

test('muestra el mes actual', () => {
  render(<CalendarPicker
    availableSlots={[]}
    selectedDate={null}
    onDateSelect={() => {}}
  />);

  const monthName = new Date().toLocaleDateString('es', { month: 'long' });
  expect(screen.getByText(new RegExp(monthName, 'i'))).toBeInTheDocument();
});
```

### Tests de Integración
```typescript
test('flujo completo de reserva', async () => {
  // 1. Renderizar página
  // 2. Seleccionar fecha
  // 3. Seleccionar hora
  // 4. Llenar formulario
  // 5. Verificar confirmación
});
```

---

## 🚀 Deployment

### Opción 1: Vercel (Recomendado)

1. **Conecta tu repositorio:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configura variables de entorno en Vercel:**
   - Ve a: Settings → Environment Variables
   - Agrega:
     - `VITE_CALENDLY_API_TOKEN`
     - `VITE_CALENDLY_EVENT_TYPE_UUID`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Opción 2: Netlify

1. **Build command:**
   ```bash
   npm run build
   ```

2. **Publish directory:**
   ```
   dist
   ```

3. **Environment variables:**
   - `VITE_CALENDLY_API_TOKEN`
   - `VITE_CALENDLY_EVENT_TYPE_UUID`

### Opción 3: GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar a package.json
"homepage": "https://tuusuario.github.io/plaxp",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

---

## 📝 Notas Importantes

### Lo que SÍ hace este clon:
✅ Interfaz personalizada completamente
✅ Selector de fecha y hora custom
✅ Formulario de captura de datos
✅ Conexión directa con API de Calendly
✅ Detección automática de timezone
✅ Pantalla de confirmación branded
✅ Diseño responsive y accesible

### Lo que NO hace (lo hace Calendly):
❌ Motor de disponibilidad
❌ Envío de emails
❌ Recordatorios
❌ Integración con Google Calendar
❌ Gestión de reuniones
❌ Cancelaciones/Reagendamiento

**Importante:** Calendly se encarga de:
- Enviar correos de confirmación
- Enviar recordatorios
- Sincronizar con calendarios
- Gestionar buffers entre eventos
- Aplicar reglas de disponibilidad
- Manejar timezones internos

---

## 🐛 Troubleshooting

### Error: "Token de autenticación inválido"
- Verifica que el token en `.env` sea correcto
- Asegúrate de que el token no haya expirado
- Regenera el token en Calendly si es necesario

### Error: "El evento no fue encontrado"
- Verifica que el `EVENT_TYPE_UUID` sea correcto
- Usa la API para obtener el UUID correcto
- Verifica que el evento esté activo en Calendly

### No aparecen slots disponibles
- Verifica que tu evento de Calendly tenga disponibilidad configurada
- Revisa los horarios de trabajo en Calendly
- Verifica que no haya conflictos con otros eventos
- Checa la zona horaria configurada

### Error de CORS
- Si usas un proxy, configura CORS correctamente
- Verifica que la API de Calendly permite solicitudes desde tu dominio
- Para desarrollo local, usa el token directamente (sin proxy)

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Calendly API Docs](https://developer.calendly.com/api-docs)
- [Calendly API Reference](https://developer.calendly.com/api-docs/reference)
- [Rate Limits](https://developer.calendly.com/api-docs/reference#rate-limits)

### Endpoints Útiles
- List Event Types: `GET /event_types`
- Get User: `GET /users/me`
- Get Scheduled Events: `GET /scheduled_events`
- Cancel Event: `POST /scheduled_events/{uuid}/cancellation`

### Límites de la API
- **Rate Limit:** 100,000 requests/24 horas por token
- **Concurrent Requests:** 10 requests simultáneas
- **Timeout:** 30 segundos

---

## 🎉 Resultado Final

Tienes un sistema de agendamiento completo que:
1. Se ve y funciona como Calendly
2. Usa tu propia marca y colores
3. Se conecta a tu evento real de Calendly
4. Mantiene toda la lógica interna de Calendly
5. Está listo para producción

**Ruta de acceso:** `/agendar`

**Ejemplo de uso:**
```
https://tu-dominio.com/agendar
```

---

## 👨‍💻 Mantenimiento

### Actualizar disponibilidad
- Los cambios en Calendly se reflejan automáticamente
- No necesitas actualizar código

### Cambiar diseño
- Edita los componentes en `src/features/calendly/components/`
- Los colores están centralizados en las clases de Tailwind

### Agregar campos al formulario
1. Actualiza `BookingFormData` en `calendly.types.ts`
2. Agrega el campo en `BookingForm.tsx`
3. Incluye en el payload de `createScheduledEvent`

---

**Creado con ❤️ para Plaxp**
