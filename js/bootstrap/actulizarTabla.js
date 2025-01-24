actualizarTabla(); {
    const tbody = this.shadowRoot.querySelector('#productos-lista');
    tbody.innerHTML = '';
    this.productos.forEach((producto, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${producto.codigo}</td>
        <td>${producto.nombre}</td>
        <td>$${producto.valorUnitario.toFixed(2)}</td>
        <td>${producto.cantidad}</td>
        <td>$${producto.subtotal.toFixed(2)}</td>
        <td><button data-index="${index}" class="btn btn-sm btn-danger eliminar">Eliminar</button></td>
      `;
        row.querySelector('.eliminar').addEventListener('click', () => this.eliminarProducto(index));
        tbody.appendChild(row);
    });
};

actualizarResumen() ;{
    const subtotal = this.productos.reduce((acc, p) => acc + p.subtotal, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    this.shadowRoot.querySelector('#subtotal').textContent = subtotal.toFixed(2);
    this.shadowRoot.querySelector('#iva').textContent = iva.toFixed(2);
    this.shadowRoot.querySelector('#total').textContent = total.toFixed(2);
};

eliminarProducto(index) ;{
    this.productos.splice(index, 1);
    this.actualizarTabla();
    this.actualizarResumen();
};

customElements.define('actualizarTabla', actualizarTabla);
