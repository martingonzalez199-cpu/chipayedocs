// Storage API - Usa backend en lugar de localStorage
const Storage = (() => {
  const API_URL = CONFIG.BACKEND_URL + '/api/pedidos';
  const AUTH_HEADERS = { 'x-api-key': CONFIG.API_KEY };

  // Intentar cargar desde localStorage como fallback (offline)
  let localCache = [];
  try {
    const cached = localStorage.getItem('chipaye_orders_cache');
    if (cached) {
      localCache = JSON.parse(cached);
    }
  } catch (e) {
    console.warn('No se pudo leer cache local');
  }

  // Parsear items de string JSON a array
  const parseOrder = (order) => {
    try {
      const parsed = {
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      };
      console.log('Pedido parseado:', parsed);
      return parsed;
    } catch (e) {
      console.error('Error parseando order:', e, order);
      return order;
    }
  };

  return {
    // Obtener todos los pedidos (desde backend, con fallback a cache)
    async getAll() {
      try {
        const response = await fetch(API_URL, { headers: AUTH_HEADERS });
        if (!response.ok) throw new Error('Error en servidor');

        const data = await response.json();
        const parsed = data.map(parseOrder);

        // Guardar en cache local para offline
        localStorage.setItem('chipaye_orders_cache', JSON.stringify(parsed));
        return parsed;
      } catch (error) {
        console.warn('Usando cache local:', error);
        return localCache;
      }
    },

    // Obtener un pedido por ID
    async getById(id) {
      const orders = await this.getAll();
      return orders.find(order => order.id === parseInt(id));
    },

    // Agregar un nuevo pedido
    async add(order) {
      try {
        // Convertir items a JSON string si es array
        let itemsToSend = order.items;
        if (Array.isArray(order.items)) {
          itemsToSend = JSON.stringify(order.items);
        }

        const payload = {
          clientName: order.clientName,
          items: itemsToSend,
          totalPrice: parseFloat(order.totalPrice)
        };

        console.log('Enviando al backend:', payload);

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...AUTH_HEADERS },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error del servidor:', response.status, errorText);
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Pedido creado (sin parsear):', data);
        console.log('ID del pedido:', data.id);

        // Parsear items y retornar
        const parsed = parseOrder(data);
        console.log('Pedido creado (parseado):', parsed);
        return parsed;
      } catch (error) {
        console.error('Error al agregar pedido:', error);
        throw error;
      }
    },

    // Actualizar un pedido
    async update(id, updates) {
      try {
        console.log('UPDATE: Intentando actualizar pedido', id, 'con:', updates);
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...AUTH_HEADERS },
          body: JSON.stringify(updates)
        });

        console.log('UPDATE: Respuesta status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('UPDATE: Error del servidor:', response.status, errorText);
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('UPDATE: Pedido actualizado:', data);

        // Parsear items y retornar
        return parseOrder(data);
      } catch (error) {
        console.error('UPDATE: Error al actualizar:', error);
        throw error;
      }
    },

    // Eliminar un pedido
    async delete(id) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: AUTH_HEADERS
        });

        if (!response.ok) throw new Error('Error al eliminar');

        // Actualizar cache
        await this.getAll();
        return true;
      } catch (error) {
        console.error('Error al eliminar:', error);
        throw error;
      }
    },

    // Limpiar cache
    clear() {
      try {
        localStorage.removeItem('chipaye_orders_cache');
        return true;
      } catch (error) {
        console.error('Error limpiando cache:', error);
        return false;
      }
    }
  };
})();
