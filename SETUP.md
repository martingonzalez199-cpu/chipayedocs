# Setup de Chipayé

Instrucciones detalladas para configurar y ejecutar la app.

## Paso 1: Generar los iconos PNG

Los iconos son necesarios para que la PWA funcione correctamente en iOS y otros dispositivos.

### Opción A: Con Node.js (automático)

1. Abre la terminal en la carpeta `chipayedocs`
2. Instala `sharp`:
   ```bash
   npm init -y
   npm install --save-dev sharp
   ```
3. Ejecuta el script:
   ```bash
   node scripts/generate-icons.js
   ```
4. Los iconos se generarán en `public/` (192x192, 512x512, apple-touch-icon)

### Opción B: Herramienta online (manual)

Si no tienes Node.js, usa una herramienta online:

1. Ve a: https://www.favicon-generator.org/
2. Carga el archivo `public/logo.svg`
3. Descarga estos tamaños:
   - 192x192 → guarda como `logo-192x192.png` en `public/`
   - 512x512 → guarda como `logo-512x512.png` en `public/`
   - 180x180 → guarda como `apple-touch-icon.png` en `public/`

4. Coloca los 3 archivos en la carpeta `public/`

## Paso 2: Servir la app localmente

Necesitas un servidor HTTP simple para que funcione correctamente (los service workers requieren HTTPS o localhost).

### Con Python 3:
```bash
cd D:\Documents\chipayedocs\src
python -m http.server 8000
```

### Con Node.js:
```bash
npm install -g http-server
cd D:\Documents\chipayedocs\src
http-server
```

### Con Python 2:
```bash
cd D:\Documents\chipayedocs\src
python -m SimpleHTTPServer 8000
```

Luego abre: **http://localhost:8000/**

## Paso 3: Instalar en iPhone

1. En tu iPhone, abre **Safari**
2. Ve a: **http://[tu-ip-local]:8000**
   - Reemplaza `[tu-ip-local]` con la IP de tu computadora (ej: 192.168.1.100)
   - Para saber tu IP, abre terminal y ejecuta: `ipconfig` (Windows) o `ifconfig` (Mac)

3. Una vez que se cargue la app:
   - Toca el botón **Compartir** (ícono con flecha ↑)
   - Desplázate y toca **Añadir a la pantalla de inicio**
   - Dale un nombre (ej: "Chipayé") y toca **Añadir**

4. ¡Listo! La app ya aparecerá en tu pantalla de inicio como un ícono 🎉

## Paso 4: Usar la app

Desde tu iPhone:
- Abre la app desde tu pantalla de inicio
- Funcionará en modo "standalone" (sin barra de Safari)
- Funciona completamente offline
- Los datos se guardan automáticamente en tu iPhone

## Estructura de carpetas

```
chipayedocs/
├── public/
│   ├── logo.svg
│   ├── logo-192x192.png          (generado)
│   ├── logo-512x512.png          (generado)
│   └── apple-touch-icon.png      (generado)
├── src/
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   ├── css/
│   ├── js/
│   └── ...
├── scripts/
│   └── generate-icons.js
├── SETUP.md (este archivo)
└── README.md
```

## Troubleshooting

### "Service Worker no se registró"
- Asegúrate de usar `http://localhost` o HTTPS (no `file://`)
- Abre la consola del navegador (F12) para ver errores

### "Los iconos no aparecen"
- Verifica que los archivos PNG estén en `public/`
- Borra el caché de Safari: Ajustes > Safari > Borrar historial y datos del sitio web

### "La app no se instala"
- Debe estar servida por HTTP/HTTPS (no file://)
- Abre en Safari (no en Chrome o Firefox)
- Busca "Añadir a pantalla de inicio" en las opciones de compartir

### "Los datos no se guardan"
- Revisa que localStorage esté habilitado en Safari
- Ajustes > Safari > Privacidad > Bloquear cookies y datos > Nunca

## Desarrollo

La app está escrita en **vanilla JavaScript puro**:
- `storage.js` - Manejo de localStorage
- `state.js` - Estado global y observadores
- `orders.js` - Lógica de negocio
- `ui.js` - Renderizado del DOM
- `app.js` - Inicialización

No tiene dependencias externas (excepto las fuentes de Google Fonts).

## Notas

- La app funciona completamente offline una vez que se carga
- Los datos se guardan localmente en tu iPhone (no en un servidor)
- Cada dispositivo tiene sus propios datos
- Los datos persisten aunque cierres Safari o reinicies el iPhone

---

¿Preguntas? Revisa el `README.md` para más información.
