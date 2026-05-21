// filtroHamburguesa.js
// Crea un menú hamburguesa que filtra por categoria: "todas", "producto", "servicio"
// Requiere que exista en la página un elemento con id "productos-container"
// Debe cargarse después de productos.js

(function () {
  // Configuración
  const contenedorId = "productos-container";
  const categoriasPermitidas = ["todas", "producto", "servicio"];

  // Crear elementos del menú
  function crearMenu() {
    const cont = document.getElementById(contenedorId);
    if (!cont) {
      console.warn("No se encontró el contenedor de productos:", contenedorId);
      return null;
    }

    // Wrapper para el control (se insertará antes del contenedor)
    const wrapper = document.createElement("div");
    wrapper.className = "filtro-hamburguesa-wrapper";

    // Botón hamburguesa
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filtro-hamburguesa-btn";
    btn.id = "btn-filtro-hamburguesa";
    btn.setAttribute("aria-controls", "panel-filtro-hamburguesa");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Abrir filtros");
    btn.innerHTML = `<span class="hamburger-icon" aria-hidden="true">☰</span> Categoria`;

    // Panel deslizable
    const panel = document.createElement("div");
    panel.id = "panel-filtro-hamburguesa";
    panel.className = "panel-filtro-hamburguesa";
    panel.setAttribute("role", "menu");
    panel.setAttribute("aria-hidden", "true");

    // Opciones (radio buttons para accesibilidad)
    categoriasPermitidas.forEach(cat => {
      const item = document.createElement("div");
      item.className = "filtro-item";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "filtro-categoria";
      input.id = `filtro-${cat}`;
      input.value = cat;
      input.className = "filtro-radio";

      // Por defecto "todas" seleccionado
      if (cat === "todas") input.checked = true;

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      label.className = "filtro-label";

      item.appendChild(input);
      item.appendChild(label);
      panel.appendChild(item);
    });

    // Insertar wrapper antes del contenedor
    wrapper.appendChild(btn);
    wrapper.appendChild(panel);
    cont.parentNode.insertBefore(wrapper, cont);

    return { wrapper, btn, panel };
  }

  // Abrir / cerrar panel con gestión de foco y ARIA
  function setupToggle(btn, panel) {
    let lastFocused = null;

    function abrir() {
      panel.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      // Guardar foco y moverlo al primer control del panel
      lastFocused = document.activeElement;
      const primerControl = panel.querySelector("input, button, a, [tabindex]");
      if (primerControl) primerControl.focus();
      // Escuchar Escape para cerrar
      document.addEventListener("keydown", onKeyDown);
    }

    function cerrar() {
      panel.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      // Devolver foco al botón
      if (lastFocused) lastFocused.focus();
      document.removeEventListener("keydown", onKeyDown);
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        cerrar();
      }
    }

    btn.addEventListener("click", () => {
      const abierto = btn.getAttribute("aria-expanded") === "true";
      if (abierto) cerrar(); else abrir();
    });

    // Permitir abrir con Enter/Space cuando el botón tiene foco
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const abierto = btn.getAttribute("aria-expanded") === "true";
        if (abierto) cerrar(); else abrir();
      }
    });

    // Cerrar al hacer click fuera del panel
    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("open")) return;
      if (!panel.contains(e.target) && e.target !== btn) {
        cerrar();
      }
    });
  }

  // Aplicar filtro y re-renderizar
  function aplicarFiltro(valor) {
    // Normalizar valor
    const v = (valor || "todas").toLowerCase();
    let listaFiltrada;
    if (v === "todas") {
      listaFiltrada = productos.slice(); // usa arreglo global productos
    } else {
      listaFiltrada = productos.filter(p => (p.categoria || "").toLowerCase() === v);
    }

    // Si existe una función que acepte lista, usarla
    if (typeof renderizarTarjetasConLista === "function") {
      renderizarTarjetasConLista(contenedorId, listaFiltrada);
      return;
    }

    // Si existe renderizarTarjetas que usa el arreglo global, temporalmente renderizamos aquí
    const cont = document.getElementById(contenedorId);
    if (!cont) return;
    cont.innerHTML = "";
    listaFiltrada.forEach(prod => {
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

      // Mantener manejadores de selección si existen
      tarjeta.addEventListener("click", () => {
        if (typeof toggleSeleccion === "function") toggleSeleccion(prod.id);
      });
      tarjeta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (typeof toggleSeleccion === "function") toggleSeleccion(prod.id);
        }
      });

      cont.appendChild(tarjeta);
    });

    // Si no hay resultados, mostrar mensaje
    if (listaFiltrada.length === 0) {
      const cont = document.getElementById(contenedorId);
      const msg = document.createElement("p");
      msg.className = "sin-resultados";
      msg.textContent = "No se encontraron elementos para esta categoría.";
      cont.appendChild(msg);
    }
  }

  // Inicialización
  document.addEventListener("DOMContentLoaded", () => {
    const elems = crearMenu();
    if (!elems) return;
    const { btn, panel } = elems;
    setupToggle(btn, panel);

    // Escuchar cambios en los radios del panel
    panel.addEventListener("change", (e) => {
      const target = e.target;
      if (target && target.name === "filtro-categoria") {
        aplicarFiltro(target.value);
      }
    });

    // Inicializar mostrando todo
    aplicarFiltro("todas");
  });
})();
