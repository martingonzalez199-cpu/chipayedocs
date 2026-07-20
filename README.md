# Chipayé - App de Pedidos de Chipas Artesanales

Una PWA (Progressive Web App) simple y liviana para tomar y gestionar pedidos de chipas artesanales. Funciona completamente offline, sin necesidad de backend ni conexión a internet.

## Características

✨ **Diseño móvil-first** optimizado para iPhone  
📲 **Instalable como PWA** (agregar a pantalla de inicio)  
🔌 **Funciona offline** (Service Worker)  
💾 **Datos locales persistentes** (localStorage)  
✅ **Gestión de dos estados independientes** (Entregado / Cobrado)  
📊 **Resumen en tiempo real** (Total, pendientes de entregar, pendientes de cobrar)  
🎨 **Interfaz cálida con identidad visual propia**  
⚡ **Ultra ligero** (~50KB sin comprimir, vanilla JS)

## Estructura de archivos

```
chipaye/
├── public/
│   └── logo.svg              # Logo circular de la marca
├── src/
│   ├── index.html            # HTML principal
│   ├── manifest.json         # Configuración PWA
│   ├── service-worker.js     # Caching offline
│   ├── css/
│   │   ├── reset.css         # Resets CSS
│   │   ├── variables.css     # Paleta y tipografía
│   │   └── styles.css        # Componentes
│   └── js/
│       ├── storage.js        # Abstracción localStorage
│       ├── state.js          # Estado global
│       ├── orders.js         # Lógica de negocio
│       ├── ui.js             # Renderizado DOM
│       └── app.js            # Punto de entrada
├── .gitignore
└── README.md
```

## Cómo usar

### En desarrollo (local)

1. Abre `src/index.html` en tu navegador
2. O sirve los archivos con un servidor simple:
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js
   npx http-server
   ```
3. Abre `http://localhost:8000/src/`

### En iPhone (PWA)

1. Abre la app en Safari desde tu iPhone
2. Toca el botón de **Compartir** (↑)
3. Selecciona **Añadir a la pantalla de inicio**
4. Dale un nombre (ej: "Chipayé") y toca **Añadir**

La app se agregará como un ícono en tu pantalla de inicio y funcionará en modo standalone (sin barra de Safari).

## Funcionalidad

### Nuevo pedido
- Nombre del cliente
- Cantidades de cada producto (Chipa común, Chipan 100g, Chipan 200g)
- Precio total pactado

### Gestión de pedidos
- Marcar como "Entregado" (independiente del pago)
- Marcar como "Cobrado" (independiente de la entrega)
- Borrar con confirmación
- Ver resumen visual con aro de chipa

### Filtros
- **Todos**: muestra todos los pedidos
- **Por entregar**: solo los no entregados
- **Por cobrar**: solo los no cobrados

### Aro de chipa (indicador visual)
- Vacío = Pedido pendiente
- 25% lleno (dorado) = Entregado
- 100% lleno (verde) = Entregado y cobrado

### Resumen
Muestra en tiempo real:
- Total de pedidos
- Cuántos faltan entregar
- Cuántos faltan cobrar

## Datos y privacidad

- **Todo se guarda localmente** en tu iPhone (localStorage)
- No hay backend ni servidor
- No se envía información a internet
- Los datos sobreviven a cerrar Safari y reiniciar el dispositivo
- Solo tú tienes acceso a tus datos

## Paleta de diseño

- **Fondo cálido**: #FBF3E7
- **Superficie**: #FFFCF6
- **Texto principal**: #2E2118
- **Texto secundario**: #8C7256
- **Acento (dorado)**: #C4813B
- **Éxito (verde)**: #5B7A4F

## Tipografía

- **Títulos**: Fraunces (serif, con carácter)
- **Texto**: Inter (limpio, legible)

## Tecnología

- **Vanilla JavaScript** (sin frameworks)
- **CSS3** con variables y media queries
- **Service Worker** para caching offline
- **localStorage** para persistencia
- **PWA Manifest** para instalación

## Navegadores soportados

- ✅ Safari en iOS (principal)
- ✅ Chrome/Edge en Android
- ✅ Chrome/Firefox/Safari en desktop

## Notas

- La app está optimizada para iPhone pero funciona en cualquier dispositivo
- Los datos se guardan automáticamente
- El formulario se puede expandir/contraer
- Los estilos se adaptan a notches y home bar de iPhone

## Futuras mejoras (opcional)

- Exportar datos (CSV/PDF)
- Búsqueda de pedidos
- Historial de cambios
- Sincronización entre dispositivos (con backend)
- Recordatorios de entregas/cobros
- Temas de color

---

**Hecho con 💛 para Chipayé - Chipá con magia**
