// Lógica de negocio para pedidos
const Orders = (() => {
  const PRODUCTS = [
    { id: 'qty1', name: 'Chipa común 1kg' },
    { id: 'qty2', name: 'Chipa común 1/2kg' },
    { id: 'qty3', name: 'Chipan común 1kg' },
    { id: 'qty4', name: 'Chipan común 1/2kg' },
    { id: 'qty5', name: 'Chipan 200gr x 1kg' }
  ];

  return {
    // Validar datos de un nuevo pedido
    validate(data) {
      const errors = [];

      if (!data.clientName || !data.clientName.trim()) {
        errors.push('El nombre del cliente es requerido');
      }

      if (!data.totalPrice || parseFloat(data.totalPrice) <= 0) {
        errors.push('El precio debe ser mayor a 0');
      }

      // Al menos un producto debe tener cantidad
      const hasProducts = [data.qty1, data.qty2, data.qty3, data.qty4, data.qty5].some(
        qty => qty && parseInt(qty) > 0
      );

      if (!hasProducts) {
        errors.push('Debe seleccionar al menos un producto');
      }

      return errors;
    },

    // Crear un nuevo pedido desde datos de formulario
    createFromForm(formData) {
      const items = [];

      if (parseInt(formData.qty1) > 0) {
        items.push(`${formData.qty1}x Chipa común 1kg`);
      }
      if (parseInt(formData.qty2) > 0) {
        items.push(`${formData.qty2}x Chipa común 1/2kg`);
      }
      if (parseInt(formData.qty3) > 0) {
        items.push(`${formData.qty3}x Chipan común 1kg`);
      }
      if (parseInt(formData.qty4) > 0) {
        items.push(`${formData.qty4}x Chipan común 1/2kg`);
      }
      if (parseInt(formData.qty5) > 0) {
        items.push(`${formData.qty5}x Chipan 200gr x 1kg`);
      }

      return {
        clientName: formData.clientName.trim(),
        items: items,
        totalPrice: parseFloat(formData.totalPrice),
        quantities: {
          qty1: parseInt(formData.qty1) || 0,
          qty2: parseInt(formData.qty2) || 0,
          qty3: parseInt(formData.qty3) || 0,
          qty4: parseInt(formData.qty4) || 0,
          qty5: parseInt(formData.qty5) || 0
        }
      };
    },

    // Formatear precio para mostrar
    formatPrice(price) {
      return `$${price.toFixed(2)}`.replace(/\.00$/, '');
    },

    // Obtener descripción de estado
    getStatusLabel(order) {
      if (order.delivered && order.paid) return 'Entregado y cobrado';
      if (order.delivered) return 'Entregado';
      if (order.paid) return 'Cobrado';
      return 'Pendiente';
    },

    // Obtener progreso del aro de chipa
    getChipaProgress(order) {
      if (order.delivered && order.paid) return 100; // Completamente tostado
      if (order.delivered) return 50; // Mitad tostado
      return 0; // Sin tostar
    }
  };
})();
