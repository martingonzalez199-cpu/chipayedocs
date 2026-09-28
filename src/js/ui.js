// Renderizado y manejo del DOM
const UI = (() => {
  // Elementos del DOM
  const elements = {
    orderForm: document.getElementById('orderForm'),
    toggleFormBtn: document.getElementById('toggleFormBtn'),
    cancelFormBtn: document.getElementById('cancelFormBtn'),
    clientName: document.getElementById('clientName'),
    totalPrice: document.getElementById('totalPrice'),
    summary: document.getElementById('summary'),
    filters: document.getElementById('filters'),
    productionSummary: document.getElementById('productionSummary'),
    ordersList: document.getElementById('ordersList'),
    emptyState: document.getElementById('emptyState'),
    confirmModal: document.getElementById('confirmModal'),
    confirmBtn: document.getElementById('confirmBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    confirmMessage: document.getElementById('confirmMessage')
  };

  // Un input de cantidad por cada producto en Orders.PRODUCTS
  const qtyInputs = {};
  Orders.PRODUCTS.forEach(product => {
    qtyInputs[product.id] = document.getElementById(product.id);
  });

  // Evento: Toggle formulario
  elements.toggleFormBtn.addEventListener('click', () => {
    const show = !State.getShowForm();
    State.setShowForm(show);
    elements.orderForm.style.display = show ? 'block' : 'none';
    if (show) {
      elements.clientName.focus();
    }
  });

  // Evento: Cancelar formulario
  elements.cancelFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    State.setShowForm(false);
    elements.orderForm.style.display = 'none';
    elements.orderForm.reset();
  });

  // Evento: Enviar formulario
  elements.orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      clientName: elements.clientName.value,
      totalPrice: elements.totalPrice.value
    };
    Orders.PRODUCTS.forEach(product => {
      formData[product.id] = qtyInputs[product.id].value;
    });

    const errors = Orders.validate(formData);

    if (errors.length > 0) {
      alert('Error:\n' + errors.join('\n'));
      return;
    }

    const orderData = Orders.createFromForm(formData);
    State.addOrder(orderData);

    // Limpiar y cerrar formulario
    elements.orderForm.reset();
    State.setShowForm(false);
    elements.orderForm.style.display = 'none';
  });

  // Renderizar resumen
  function renderSummary(state) {
    const { total, pendingProduction, pendingDelivery, pendingPayment } = state.summary || State.getSummary();

    elements.summary.innerHTML = `
      <div class="summary-card">
        <div class="summary-card-label">Pedidos</div>
        <div class="summary-card-value">${total}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Por producir</div>
        <div class="summary-card-value">${pendingProduction}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Por entregar</div>
        <div class="summary-card-value">${pendingDelivery}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Por cobrar</div>
        <div class="summary-card-value">${pendingPayment}</div>
      </div>
    `;
  }

  // Renderizar filtros
  function renderFilters(state) {
    const currentFilter = state.filter || State.getFilter();

    elements.filters.innerHTML = `
      <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
        Todos
      </button>
      <button class="filter-btn ${currentFilter === 'pending-production' ? 'active' : ''}" data-filter="pending-production">
        Chipas a producir
      </button>
      <button class="filter-btn ${currentFilter === 'pending-delivery' ? 'active' : ''}" data-filter="pending-delivery">
        Por entregar
      </button>
      <button class="filter-btn ${currentFilter === 'pending-payment' ? 'active' : ''}" data-filter="pending-payment">
        Por cobrar
      </button>
    `;

    // Event listeners para filtros
    elements.filters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        State.setFilter(btn.dataset.filter);
      });
    });
  }

  // Crear SVG del aro de chipa
  function createChipaRingSvg(order) {
    const r = 30; // Radio del círculo
    const circumference = 2 * Math.PI * r;

    const produced = order.produced;
    const delivered = order.delivered;
    const paid = order.paid;

    // Determinar el color y el dashoffset
    let strokeColor = '#8C7256'; // Color por defecto (gris)
    let dashOffset = circumference; // Vacío por defecto

    if (paid) {
      strokeColor = '#5B7A4F'; // Verde (completamente cobrado)
      dashOffset = 0; // Lleno
    } else if (delivered) {
      strokeColor = '#C4813B'; // Dorado (entregado)
      dashOffset = circumference * 0.34; // ~66% lleno
    } else if (produced) {
      strokeColor = '#D9A05B'; // Ámbar claro (producido, falta entregar)
      dashOffset = circumference * 0.67; // ~33% lleno
    }

    return `
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="35" fill="none" stroke="#E7DAC5" stroke-width="2" opacity="0.5"/>
        <circle
          cx="40" cy="40" r="30"
          fill="none"
          stroke="${strokeColor}"
          stroke-width="10"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${dashOffset}"
          style="transition: all 250ms ease-in-out; transform: rotate(-90deg); transform-origin: 40px 40px;"
        />
      </svg>
    `;
  }

  // Resumen de cantidades a producir por producto (pestaña "Chipas a producir")
  function renderProductionSummary(orders) {
    const summary = Orders.getProductionSummary(orders);

    if (summary.length === 0) {
      return '';
    }

    return `
      <div class="production-summary">
        <h3 class="production-summary-title">Cantidades a producir</h3>
        <ul class="production-summary-list">
          ${summary.map(item => `
            <li class="production-summary-item">
              <span class="production-summary-name">${item.name}</span>
              <span class="production-summary-qty">${item.qty}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  // Renderizar lista de pedidos
  function renderOrders(state) {
    let orders = State.getOrders();
    const filter = State.getFilter();

    console.log('renderOrders - Órdenes totales:', orders.length);
    console.log('renderOrders - Filtro:', filter);

    // Aplicar filtro
    if (filter === 'pending-production') {
      // Si ya está entregado, ya se produjo en la práctica (aunque el flag
      // quedó en false por ser un pedido de antes de esta función).
      orders = orders.filter(o => !o.produced && !o.delivered);
    } else if (filter === 'pending-delivery') {
      orders = orders.filter(o => !o.delivered);
    } else if (filter === 'pending-payment') {
      orders = orders.filter(o => !o.paid);
    }

    console.log('renderOrders - Órdenes después de filtro:', orders.length);

    // En la pestaña "Chipas a producir", mostrar el resumen de cantidades por producto
    elements.productionSummary.innerHTML = filter === 'pending-production'
      ? renderProductionSummary(orders)
      : '';

    if (orders.length === 0) {
      console.log('No hay órdenes, mostrando empty state');
      elements.ordersList.innerHTML = '';
      elements.emptyState.style.display = 'block';
      return;
    }

    console.log('Renderizando', orders.length, 'órdenes');
    elements.emptyState.style.display = 'none';

    elements.ordersList.innerHTML = orders.map(order => {
      const statusLabel = Orders.getStatusLabel(order);
      const producedClass = order.produced ? 'active produced' : '';
      const deliveryClass = order.delivered ? 'active' : '';
      const paidClass = order.paid ? 'active paid' : '';

      return `
        <div class="order-card">
          <div class="order-card-content">
            <div class="order-card-header">
              <h2 class="order-card-name">${order.clientName}</h2>
              <span class="order-status-badge ${order.produced ? 'produced' : ''} ${order.delivered ? 'delivered' : ''} ${order.paid ? 'paid' : ''}">
                ${statusLabel}
              </span>
            </div>

            <div class="order-card-items">
              ${order.items.map(item => `<div>• ${item}</div>`).join('')}
            </div>

            <div class="order-card-price">
              ${Orders.formatPrice(order.totalPrice)}
            </div>
          </div>

          <div class="order-status-ring">
            <div class="chipa-ring ${order.produced ? 'produced' : ''} ${order.delivered ? 'delivered' : ''} ${order.paid ? 'paid' : ''}">
              ${createChipaRingSvg(order)}
            </div>

            <div class="order-actions">
              <button class="action-btn ${producedClass}" data-action="produced" data-order-id="${order.id}">
                ${order.produced ? '✓ Producido' : 'Producir'}
              </button>
              <button class="action-btn ${deliveryClass}" data-action="delivered" data-order-id="${order.id}" ${order.produced ? '' : 'disabled title="Primero hay que producir el pedido"'}>
                ${order.delivered ? '✓ Entregado' : 'Entregar'}
              </button>
              <button class="action-btn ${paidClass}" data-action="paid" data-order-id="${order.id}">
                ${order.paid ? '✓ Cobrado' : 'Cobrar'}
              </button>
              <button class="action-btn delete" data-action="delete" data-order-id="${order.id}">
                Borrar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Event listeners para botones de pedidos
    elements.ordersList.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        const action = btn.dataset.action;

        console.log('Botón clickeado:', { orderId, action });

        if (action === 'produced') {
          console.log('Ejecutando toggleProduced con ID:', orderId);
          State.toggleProduced(orderId);
        } else if (action === 'delivered') {
          console.log('Ejecutando toggleDelivered con ID:', orderId);
          State.toggleDelivered(orderId);
        } else if (action === 'paid') {
          console.log('Ejecutando togglePaid con ID:', orderId);
          State.togglePaid(orderId);
        } else if (action === 'delete') {
          console.log('Ejecutando showDeleteConfirmation con ID:', orderId);
          showDeleteConfirmation(orderId);
        }
      });
    });
  }

  // Modal de confirmación de borrado
  function showDeleteConfirmation(orderId) {
    State.setConfirmAction(orderId);
    elements.confirmModal.style.display = 'flex';
  }

  function hideDeleteConfirmation() {
    State.clearConfirmAction();
    elements.confirmModal.style.display = 'none';
  }

  elements.confirmBtn.addEventListener('click', () => {
    const action = State.getConfirmAction();
    if (action) {
      State.deleteOrder(action.orderId);
    }
    hideDeleteConfirmation();
  });

  elements.cancelBtn.addEventListener('click', hideDeleteConfirmation);

  // Cerrar modal al hacer click fuera
  elements.confirmModal.addEventListener('click', (e) => {
    if (e.target === elements.confirmModal) {
      hideDeleteConfirmation();
    }
  });

  // Renderizar todo
  function render(state) {
    renderSummary(state);
    renderFilters(state);
    renderOrders(state);
  }

  return {
    render,
    showDeleteConfirmation
  };
})();
