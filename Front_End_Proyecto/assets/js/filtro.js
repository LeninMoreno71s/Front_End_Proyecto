// filtros.js
// Asume que productos (arreglo) y renderizarTarjetas(containerId, lista) existen globalmente.
// Si tu renderizarTarjetas solo acepta containerId, puedes crear una versión que acepte lista.

document.addEventListener("DOMContentLoaded", () => {
  const contenedorId = "productos-container";
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) {
    console.error("No se encontró el contenedor de productos:", contenedorId);
    return;
  }

  // 1) Crear barra de filtros (select) y añadirla antes del contenedor
  const wrapper = document.createElement("div");
  wrapper.className = "filtros-wrapper";
  wrapper.setAttribute("role", "region");
  wrapper.setAttribute("aria-label", "Filtros de productos");

  const label = document.createElement("label");
  label.htmlFor = "select-categoria";
  label.textContent = "Filtrar por categoría: ";
  label.className = "filtro-label";

  const select = document.createElement("select");
  select.id = "select-categoria";
  select.name = "categoria";

  // Opción por defecto: mostrar todo
  const optAll = document.createElement("option");
  optAll.value = "todas";
  optAll.textContent = "Todas";
  select.appendChild(optAll);

  // 2) Obtener categorías únicas desde el arreglo productos
  const categorias = Array.from(new Set(productos.map(p => p.categoria || "sin-categoria")));
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    // capitalizar la etiqueta para mejor presentación
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  });

  // Insertar elementos en el DOM (antes del contenedor)
  wrapper.appendChild(label);
  wrapper.appendChild(select);
  contenedor.parentNode.insertBefore(wrapper, contenedor);

  // 3) Función que filtra y re-renderiza
  function aplicarFiltro() {
    const valor = select.value;
    let listaFiltrada;
    if (valor === "todas") {
      listaFiltrada = productos.slice(); // copia del arreglo completo
    } else {
      listaFiltrada = productos.filter(p => (p.categoria || "") === valor);
    }

    // Llamar a la función de render. Si tu renderizarTarjetas acepta solo containerId,
    // crea una función auxiliar en productos.js que acepte la lista.
    // Aquí asumimos que existe renderizarTarjetasConLista(containerId, lista)
    if (typeof renderizarTarjetasConLista === "function") {
      renderizarTarjetasConLista(contenedorId, listaFiltrada);
    } else if (typeof renderizarTarjetas === "function") {
      // Si tu renderizarTarjetas solo usa el arreglo global, temporalmente sustituimos productos
      // (no ideal) o re-renderizamos manualmente aquí:
      // Implementación segura: limpiar y crear tarjetas aquí mismo
      contenedor.innerHTML = "";
      listaFiltrada.forEach(prod => {
        // crear tarjeta similar a la que tienes en productos.js
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-producto";
        tarjeta.setAttribute("role", "button");
        tarjeta.setAttribute("tabindex", "0");
        tarjeta.setAttribute("data-id", prod.id);
        tarjeta.setAttribute("aria-pressed", "false");

        if (prod.imagen) {
          const imgWrap = document.createElement("div");
          imgWrap.className = "tarjeta-img";
          const img = document.createElement("img");
          img.src = prod.imagen;
          img.alt = prod.nombre;
          img.loading = "lazy";
          imgWrap.appendChild(img);
          tarjeta.appendChild(imgWrap);
        }

        const contenido = document.createElement("div");
        contenido.className = "tarjeta-contenido";
        const titulo = document.createElement("h3");
        titulo.className = "tarjeta-nombre";
        titulo.textContent = prod.nombre;
        contenido.appendChild(titulo);
        const precio = document.createElement("p");
        precio.className = "tarjeta-precio";
        precio.textContent = `$ ${prod.precio.toLocaleString('es-CL')}`;
        contenido.appendChild(precio);
        const desc = document.createElement("p");
        desc.className = "tarjeta-descripcion";
        desc.textContent = prod.descripcion;
        contenido.appendChild(desc);
        tarjeta.appendChild(contenido);

        // Mantener manejadores de selección si los necesitas
        tarjeta.addEventListener("click", () => {
          // reutiliza tu lógica de selección si existe
          if (typeof toggleSeleccion === "function") toggleSeleccion(prod.id);
        });
        tarjeta.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (typeof toggleSeleccion === "function") toggleSeleccion(prod.id);
          }
        });

        contenedor.appendChild(tarjeta);
      });
    } else {
      console.warn("No se encontró función de renderizar. Implementa renderizarTarjetasConLista o renderizarTarjetas.");
    }
  }

  // 4) Escuchar cambios en el select y aplicar filtro en tiempo real
  select.addEventListener("change", aplicarFiltro);

  // 5) Inicializar mostrando todo
  aplicarFiltro();
});
