# 📘 Documentación del Proyecto `Venta Lotes IDRA`

## 🧩 Descripción General
`Venta Lotes IDRA` es una aplicación web de reservas de lotes interactiva, desarrollada con **React + Vite** para el frontend y **Google Sheets** como base de datos en el backend, utilizando funciones **Serverless en Vercel**.

El proyecto permite visualizar una cancha 3D con lotes disponibles o reservados, gestionar reservas con información del usuario y reflejar los cambios en tiempo real sincronizados con una hoja de cálculo de Google.

---

## 🗂️ Estructura del Proyecto

```
/
├── api/
│   ├── reservations.js        # Endpoint principal para obtener y registrar reservas
│   └── sheets.js              # Manejo de autenticación y conexión con Google Sheets
├── src/
│   ├── api/
│   │   └── client.js          # Cliente que interactúa con las funciones backend
│   ├── components/
│   │   ├── Cancha3D.jsx       # Escena principal 3D
│   │   ├── Lote.jsx           # Lógica visual e interactiva de los lotes
│   │   ├── LoteTooltipCard.jsx# Popup de información del lote
│   │   ├── LoteMobileOverlay.jsx # Popup optimizado para móviles
│   │   ├── PopupReserva.jsx   # Formulario de reserva
│   │   └── otros componentes de UI
│   ├── hooks/                 # Custom hooks (por ejemplo, detección de mobile)
│   ├── models/                # Configuración de lotes (oro, plata, bronce)
│   ├── utils/                 # Funciones utilitarias (colores, helpers)
│   ├── App.jsx                # Componente raíz con la lógica principal
│   └── main.jsx               # Punto de entrada de React
├── public/                    # Recursos estáticos (logos, texturas, imágenes)
├── .gitignore                 # Archivos y carpetas ignoradas por git
├── package.json               # Dependencias y scripts
├── vite.config.js             # Configuración de Vite
└── README.md                  # (Puede reemplazarse por este documento)
```

---

## ⚙️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MatiasBordon1/testProduccion.git
   cd testProduccion
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear el archivo `.env.local` en la raíz del proyecto:
   ```env
   VITE_API_BASE=/api
   GOOGLE_CLIENT_EMAIL=tu-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTUCLAVEAQUI\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_ID=ID_DE_TU_HOJA
   GOOGLE_SHEETS_TAB=Reservas
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. Acceder desde el navegador:
   ```
   http://localhost:5173
   ```

---

## 🌍 Variables de Entorno (Producción en Vercel)

| Variable | Descripción | Ejemplo |
|-----------|-------------|----------|
| `VITE_API_BASE` | Base de la API del cliente | `/api` |
| `GOOGLE_CLIENT_EMAIL` | Email del service account | `sheet-bot@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Clave privada del service account (PEM) | Formato con `\\n` en Vercel |
| `GOOGLE_SHEETS_ID` | ID de la hoja de Google Sheets | `1J0iN0sK0kAdw...` |
| `GOOGLE_SHEETS_TAB` | Nombre de la pestaña usada | `Reservas` |

📌 **Importante:** En Vercel, los saltos de línea del `PRIVATE_KEY` deben escaparse (`\\n`) para evitar errores `ERR_OSSL_UNSUPPORTED`.

---

## 🚀 Backend (Funciones Serverless)

### `/api/reservations.js`
Administra la lectura y escritura de reservas en Google Sheets.

#### Métodos:

##### `GET /api/reservations`
Obtiene todas las reservas.

```json
{
  "ok": true,
  "rows": [
    { "lote": "1", "nombre": "Juan", "correo": "juan@mail.com", "telefono": "123456", "mostrarComo": "Familia Pérez", "timestamp": "2025-10-15 10:23" }
  ]
}
```

##### `POST /api/reservations`
Agrega una nueva reserva.

```json
{
  "lotId": "5",
  "firstName": "Matías",
  "email": "matzaia2001@gmail.com",
  "phone": "2236042814",
  "displayName": "Familia Bordón",
  "anonymous": false
}
```

**Respuesta exitosa:**
```json
{ "ok": true }
```

**Errores comunes:**
- `500`: Falla de autenticación o permisos.
- `405`: Método HTTP no permitido.

---

## 🎨 Frontend (Interfaz React 3D)

### `Cancha3D.jsx`
Renderiza la cancha 3D usando **React Three Fiber**, administra la cámara, luces y la proyección de sombras. Controla también el popup contextual de cada lote.

### `Lote.jsx`
Componente que representa cada parcela:
- Cambia color según tier o estado de reserva.
- Muestra corazón si está reservado.
- Abre popup al click o hover.

### `LoteTooltipCard.jsx`
Tarjeta flotante con información del lote:
- Si está disponible → muestra precio (oro: 1000, plata: 600, bronce: 300) y botón **Comprar**.
- Si está reservado → mensaje de agradecimiento o "Anónimo".

### `PopupReserva.jsx`
Formulario que permite ingresar datos para reservar un lote.

### `client.js`
Envía y recibe datos de la API (`/api/reservations`). Maneja errores HTTP y respuestas JSON.

---

## 📊 Modelos y Lógica de Lotes

### `/src/models/lote.js`
Define los grupos de lotes según categoría:
- `oroLotes`
- `plataLotes`
- `bronceLotes`

Cada uno tiene color y precio asociados, y son usados para diferenciar visualmente los lotes.

### `/src/utils/colores.js`
Genera los colores según el tipo de lote y estado (reservado o disponible).

---

## 🧱 Tecnologías Utilizadas

| Categoría | Tecnología |
|------------|-------------|
| **Frontend** | React, Vite, React Three Fiber, Drei, React Spring |
| **Backend** | Google Sheets API, Vercel Serverless Functions |
| **Autenticación** | Google Service Account (JWT) |
| **Despliegue** | Vercel |
| **Diseño** | CSS, Tailwind opcional, assets personalizados |

---

## 🧭 Flujo General de la Aplicación

```text
1️⃣ Al cargar la app → se ejecuta GET /api/reservations → carga lotes reservados.
2️⃣ El usuario selecciona un lote → abre popup con precio y botón.
3️⃣ Al confirmar → se envía POST /api/reservations → guarda la reserva.
4️⃣ El lote pasa a estado reservado (color rojo / corazón visible).
```

---

## 🧪 Testing y Debug

- Para depurar funciones en Vercel: revisar pestaña **Logs** en el dashboard.
- En local, usar `console.log()` dentro de `/api/reservations.js` para confirmar la carga de variables (`process.env.GOOGLE_...`).
- Si aparece el error `ERR_OSSL_UNSUPPORTED`, revisar formato de la `GOOGLE_PRIVATE_KEY`.

---

## 🪄 Mejores Prácticas Recomendadas

- Usar `.env.local` solo para entorno de desarrollo.
- No subir nunca claves o archivos de credenciales a Git.
- Mantener entornos separados (staging y producción).
- Definir dominio custom en Vercel para mayor profesionalismo.
- Documentar IDs de lote y estructura de la hoja para futuros mantenimientos.

---

## 🏁 Créditos

**Autor:** Matías Bordón  
**Email:** matzaia2001@gmail.com  
**GitHub:** [MatiasBordon1](https://github.com/MatiasBordon1)  
**Instituto:** IDRA (Tecnicatura en Desarrollo de Software)

**Versión actual:** v1.0.0 — Octubre 2025  
**Licencia:** -

---


