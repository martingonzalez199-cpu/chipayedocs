// Estado global - Ahora con sincronización backend
const State = (() => {
  let state = {
    orders: [],
    filter: 'all',
    showForm: false,
    confirmAction: null,
    loading: false
  };

  const observers = [];

  const notifyObservers = () => {
    observers.forEach(observer => observer({ ...state }));
  };

  // Cargar pedidos al iniciar
  const loadOrders = async () => {
    try {
      state.loading = true;
      state.orders = await Storage.getAll();
      notifyObservers();
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      state.loading = false;
    }
  };

  // Sincronizar cada 10 segundos (cuando la app está activa)
  setInterval(loadOrders, 10000);

  return {
    async init() {
      await loadOrders();
    },

    getState() {
      return { ...state };
    },

    getOrders() {
      return [...state.orders];
    },

    getFilteredOrders() {
      const orders = state.orders;

      switch (state.filter) {
        case 'pending-production':
          return orders.filter(o => !o.produced && !o.delivered);
        case 'pending-delivery':
          return orders.filter(o => !o.delivered);
        case 'pending-payment':
          return orders.filter(o => !o.paid);
        case 'all':
        default:
          return orders;
      }
    },

    getFilter() {
      return state.filter;
    },

    getSummary() {
      const total = state.orders.length;
      const pendingProduction = state.orders.filter(o => !o.produced && !o.delivered).length;
      const pendingDelivery = state.orders.filter(o => !o.delivered).length;
      const pendingPayment = state.orders.filter(o => !o.paid).length;

      return { total, pendingProduction, pendingDelivery, pendingPayment };
    },

    setFilter(filter) {
      state.filter = filter;
      notifyObservers();
    },

    setShowForm(show) {
      state.showForm = show;
      notifyObservers();
    },

    getShowForm() {
      return state.showForm;
    },

    async addOrder(orderData) {
      try {
        const newOrder = await Storage.add({
          ...orderData,
          produced: false,
          delivered: false,
          paid: false
        });

        state.orders.unshift(newOrder);
        notifyObservers();
        return newOrder;
      } catch (error) {
        console.error('Error agregando pedido:', error);
        throw error;
      }
    },

    async toggleProduced(orderId) {
      try {
        const id = parseInt(orderId);
        const order = state.orders.find(o => o.id === id);
        if (order) {
          const updated = await Storage.update(id, {
            produced: !order.produced
          });
          order.produced = updated.produced;
          notifyObservers();
        }
      } catch (error) {
        console.error('Error actualizando producción:', error);
        throw error;
      }
    },

    async toggleDelivered(orderId) {
      try {
        console.log('toggleDelivered llamado con:', orderId);
        const id = parseInt(orderId);
        console.log('ID parseado:', id);
        const order = state.orders.find(o => o.id === id);
        console.log('Orden encontrada:', order);
        if (order) {
          const updated = await Storage.update(id, {
            delivered: !order.delivered
          });
          order.delivered = updated.delivered;
          notifyObservers();
          console.log('Orden actualizada:', order);
        } else {
          console.warn('Orden no encontrada. state.orders:', state.orders);
        }
      } catch (error) {
        console.error('Error actualizando entrega:', error);
        throw error;
      }
    },

    async togglePaid(orderId) {
      try {
        const id = parseInt(orderId);
        const order = state.orders.find(o => o.id === id);
        if (order) {
          const updated = await Storage.update(id, {
            paid: !order.paid
          });
          order.paid = updated.paid;
          notifyObservers();
        }
      } catch (error) {
        console.error('Error actualizando pago:', error);
        throw error;
      }
    },

    setConfirmAction(orderId) {
      state.confirmAction = { orderId };
      return state.confirmAction;
    },

    getConfirmAction() {
      return state.confirmAction ? { ...state.confirmAction } : null;
    },

    clearConfirmAction() {
      state.confirmAction = null;
    },

    async deleteOrder(orderId) {
      try {
        const id = parseInt(orderId);
        await Storage.delete(id);
        state.orders = state.orders.filter(o => o.id !== id);
        state.confirmAction = null;
        notifyObservers();
      } catch (error) {
        console.error('Error borrando pedido:', error);
        throw error;
      }
    },

    subscribe(observer) {
      observers.push(observer);
      return () => {
        const index = observers.indexOf(observer);
        if (index > -1) observers.splice(index, 1);
      };
    }
  };
})();
