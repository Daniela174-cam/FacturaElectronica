class FacturaContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = /*html*/`
        <style>
          :host {
          display: flex;
          justify-content: center;

          min-height: 100vh;
          background-color: rgb(255, 243, 253); /* Fondo claro */
          margin: 0;
        }

        .mainContainer {
          max-width: 500px;
          width: 100%;
          background-color: beige;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
        }

        .card-title {
          font-size: 2rem;
          color: #2d3748;
          text-align: center;
        }

        .form-label, .form-control, .form-select {
          margin-bottom: 15px;
        }

        .btn {
          font-size: 1rem;
          padding: 10px 20px;
          border-radius: 8px;
          transition: background-color 0.3s;
        }

        .btn-primary:hover {
          background-color: rgb(87, 39, 151);
        }

        .table th, .table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .fw-bold {
          font-weight: 600;
        }

        .text-end {
          text-align: right;
        }

        .d-grid {
          display: grid;
        }
              @media (max-width: 768px) {
          .mainContainer {
            max-width: 90%; /* Reducir ancho en dispositivos más pequeños */
            padding: 15px;
          }

          .card-title {
            font-size: 1.5rem; /* Reducir tamaño del título */
          }

          .form-label, .form-control, .form-select {
            font-size: 0.9rem; /* Ajustar tamaños de texto */
          }

          .btn {
            font-size: 0.9rem;
            padding: 8px 15px; /* Reducir tamaño de botones */
          }

          .table th, .table td {
            font-size: 0.8rem; /* Ajustar fuente en tablas */
            padding: 8px; /* Reducir espacio entre celdas */
          }
        }

        @media (max-width: 480px) {
          .card-title {
            font-size: 1.25rem;
          }

          .btn {
            padding: 6px 10px; /* Botones aún más compactos */
          }

          .form-label, .form-control, .form-select {
            font-size: 0.8rem; /* Ajuste más agresivo del texto */
          }
        }
  </style>
</head>
<body>
  <div class="mainContainer">
    <h1 class="card-title">Factura</h1>
    <div class="mb-4">
      <h4>Información del Cliente</h4>
      <div class="row g-3">
        <label for="id-factura" class="form-label">ID Factura</label>
        <input type="text" id="id-factura" class="form-control" readonly>
        <label for="nombre" class="form-label">Nombres</label>
        <input type="text" id="nombre" class="form-control" placeholder="Nombres">
        <label for="apellido" class="form-label">Apellidos</label>
        <input type="text" id="apellido" class="form-control" placeholder="Apellidos">
        <label for="direccion" class="form-label">Dirección</label>
        <input type="text" id="direccion" class="form-control" placeholder="Dirección">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" class="form-control" placeholder="Correo Electrónico">
      </div>
    </div>
    <hr>
    <div class="mb-4">
      <h4>Productos</h4>
      <label for="producto-select" class="form-label">Seleccionar Producto</label>
      <select id="producto-select" class="form-select">
        <option value="" disabled selected>Elige un producto</option>
        <option value="1">Pizza - $10.00</option>
        <option value="2">Hamburguesa - $5.00</option>
        <option value="3">Ensalada - $7.00</option>
        <option value="4">Tacos - $4.50</option>
      </select>
      <label for="cantidad" class="form-label">Cantidad</label>
      <input type="number" id="cantidad" class="form-control" placeholder="Cantidad">
      <div class="d-grid mt-3">
        <button id="agregar-producto" class="btn btn-primary">Agregar Producto</button>
      </div>
    </div>
    <hr>
    <div class="mb-4">
      <h4>Resumen de Compra</h4>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Valor Unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="productos-lista"></tbody>
        </table>
      </div>
    </div>
    <div class="mb-4 text-end">
      <div class="fw-bold">Subtotal: $<span id="subtotal">0.00</span></div>
      <div class="fw-bold">IVA (19%): $<span id="iva">0.00</span></div>
      <div class="fw-bold">Total: $<span id="total">0.00</span></div>
    </div>
    <div class="d-grid">
      <button id="pagar" class="btn btn-success btn-lg">Pagar</button>
    </div>
  </div>

    `;

    this.productos = [];
    this.productosOpciones = [
      { id: 1, nombre: 'Pizza', precio: 10.00 },
      { id: 2, nombre: 'Hamburguesa', precio: 5.00 },
      { id: 3, nombre: 'Ensalada', precio: 7.00 },
      { id: 4, nombre: 'Tacos', precio: 4.50 }
    ];
    this.agregarProducto = this.agregarProducto.bind(this);
    this.pagar = this.pagar.bind(this);
    this.idFactura = this.generarIdFactura();
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#id-factura').value = this.idFactura;
    this.shadowRoot.querySelector('#agregar-producto').addEventListener('click', this.agregarProducto);
    this.shadowRoot.querySelector('#pagar').addEventListener('click', this.pagar);
  }

  generarIdFactura() {
    return 'FAC-' + Math.floor(Math.random() * 1000000);
  }

  agregarProducto() {
    const productoSelect = parseInt(this.shadowRoot.querySelector('#producto-select').value);
    const cantidad = parseInt(this.shadowRoot.querySelector('#cantidad').value);

    if (productoSelect && cantidad > 0) {
      const productoSeleccionado = this.productosOpciones.find(p => p.id === productoSelect);
      const productoExistente = this.productos.find(p => p.id === productoSelect);

      if (productoExistente) {
        productoExistente.cantidad += cantidad;
        productoExistente.subtotal = productoExistente.valorUnitario * productoExistente.cantidad;
      } else {
        this.productos.push({
          id: productoSeleccionado.id,
          nombre: productoSeleccionado.nombre,
          valorUnitario: productoSeleccionado.precio,
          cantidad: cantidad,
          subtotal: productoSeleccionado.precio * cantidad
        });
      }

      this.actualizarTabla();
      this.actualizarResumen();
    } else {
      alert('Por favor, selecciona un producto y una cantidad válida.');
    }
  }

  actualizarTabla() {
    const tbody = this.shadowRoot.querySelector('#productos-lista');
    tbody.innerHTML = '';
    this.productos.forEach((producto, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td>$${producto.valorUnitario.toFixed(2)}</td>
        <td>${producto.cantidad}</td>
        <td>$${producto.subtotal.toFixed(2)}</td>
        <td><button data-index="${index}" class="btn btn-sm btn-danger eliminar">Eliminar</button></td>
      `;
      row.querySelector('.eliminar').addEventListener('click', () => this.eliminarProducto(index));
      tbody.appendChild(row);
    });
  }

  actualizarResumen() {
    const subtotal = this.productos.reduce((acc, p) => acc + p.subtotal, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    this.shadowRoot.querySelector('#subtotal').textContent = subtotal.toFixed(2);
    this.shadowRoot.querySelector('#iva').textContent = iva.toFixed(2);
    this.shadowRoot.querySelector('#total').textContent = total.toFixed(2);
  }

  eliminarProducto(index) {
    this.productos.splice(index, 1);
    this.actualizarTabla();
    this.actualizarResumen();
  }

  pagar() {
    const total = parseFloat(this.shadowRoot.querySelector('#total').textContent);

    if (total > 0) {

      alert(`¡Gracias por tu compra! El total de tu factura es: $${total.toFixed(2)}`);


      this.productos = [];
      this.shadowRoot.querySelector('#producto-select').value = '';
      this.shadowRoot.querySelector('#cantidad').value = '';
      this.shadowRoot.querySelector('#subtotal').textContent = '0.00';
      this.shadowRoot.querySelector('#iva').textContent = '0.00';
      this.shadowRoot.querySelector('#total').textContent = '0.00';
      this.actualizarTabla();
    } else {
      alert('No hay productos en la factura para pagar.');
    }
  }

}

customElements.define('factura-container', FacturaContainer);
