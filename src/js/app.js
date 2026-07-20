// Punto de entrada de la aplicación
document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar state desde backend
  await State.init();
  UI.render(State.getState());

  // Suscribirse a cambios en el estado
  State.subscribe(state => {
    UI.render(state);
  });

  // Registrar service worker para PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado:', registration);
      })
      .catch(error => {
        console.warn('Error al registrar Service Worker:', error);
      });
  }

  // Registrar PWA manifest
  if ('serviceWorker' in navigator) {
    // Preguntar por instalación (solo Safari)
    if (window.navigator.standalone !== true) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest.json';
      document.head.appendChild(link);
    }
  }

  // Prevenir zoom en inputs (para iOS)
  document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  }, { passive: false });
});

// Manejar cambios de visibilidad (cuando vuelve a activo)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Recargar datos en caso de que hayan cambios externos
    const freshOrders = Storage.getAll();
    if (freshOrders.length !== State.getOrders().length) {
      State.notify();
    }
  }
});
