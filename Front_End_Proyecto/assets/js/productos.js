// productos.js (prueba mínima)
console.log("productos.js cargado"); // confirma que el archivo se ejecuta
// products.js
const productos = [
  {
    id: "p1",
    nombre: "Traje de Oso Mistico",
    precio: 45000,
    descripcion: "Traje completo de Oso, ademas de cabeza hecha de metal",
    imagen: "assets/img/oso_traje.webp",
    categoria: "producto"
  },
  {
    id: "p2",
    nombre: "Traje de saya boys",
    precio: 15000,
    descripcion: "Disfraz completo, mas sombrero, de la pelicula Huntrx demon hunter",
    imagen: "assets/img/saya-boy.webp",
    categoria: "producto"
  },
  {
    id: "p3",
    nombre: "Vestido para niña",
    precio: 45000,
    descripcion: "Botas a medida para espectáculos, con suela reforzada y acabado profesional.",
    imagen: "assets/img/vestido_algo.jpg",
    categoria: "producto"    
  },
  {
    id: "p4",
    nombre: "Modificaciones",
    precio: 12000,
    descripcion: "Ajustes y cambios estructurales para que tus prendas queden a la perfección.",
    imagen: "assets/img/serv-modificacion.png",
    categoria: "servicio"
  },
  {
    id: "p5",
    nombre: "Creacion",
    precio: 12000,
    descripcion: "Confección de prendas desde cero, diseños únicos y personalizados para cada cliente.",
    imagen: "assets/img/serv-creacion.png",
    categoria: "servicio"

  },
  {
    id: "p6",
    nombre: "Reparacion",
    precio: 12000,
    descripcion: "Arreglos, composturas y renovaciones para dar nueva vida a su ropa favorita.",
    imagen: "assets/img/serv-reparacion.png",
    categoria: "servicio"
  }
];

// Estado de selección (id del producto seleccionado, null si ninguno)
let seleccionadoId = null;

// Función para formatear precio (opcional)
function formatearPrecio(valor) {
  return `$ ${valor.toLocaleString('es-CL')}`;
}

// Renderiza las tarjetas dentro del contenedor con id dado
function renderizarTarjetas(containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;

  // Limpiar contenedor
  cont.innerHTML = "";

  // Crear una tarjeta por producto
  productos.forEach(prod => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-producto";
    tarjeta.setAttribute("role", "button");
    tarjeta.setAttribute("tabindex", "0");
    tarjeta.setAttribute("data-id", prod.id);
    tarjeta.setAttribute("aria-pressed", "false");

    // Imagen (si existe)
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

    // Contenido: nombre, precio, descripcion
    const contenido = document.createElement("div");
    contenido.className = "tarjeta-contenido";

    const titulo = document.createElement("h3");
    titulo.className = "tarjeta-nombre";
    titulo.textContent = prod.nombre;
    contenido.appendChild(titulo);

    const precio = document.createElement("p");
    precio.className = "tarjeta-precio";
    precio.textContent = formatearPrecio(prod.precio);
    contenido.appendChild(precio);

    const desc = document.createElement("p");
    desc.className = "tarjeta-descripcion";
    desc.textContent = prod.descripcion;
    contenido.appendChild(desc);

    tarjeta.appendChild(contenido);

    // Manejador de selección por click
    tarjeta.addEventListener("click", () => {
      toggleSeleccion(prod.id);
    });

    // Manejador de teclado (Enter / Space)
    tarjeta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleSeleccion(prod.id);
      }
    });

    cont.appendChild(tarjeta);
  });
}

// Alterna selección (selección única)
function toggleSeleccion(id) {
  // Si ya está seleccionado, deseleccionar
  if (seleccionadoId === id) {
    actualizarSeleccion(null);
    return;
  }
  // Seleccionar nuevo
  actualizarSeleccion(id);
}

// Actualiza DOM y estado según id seleccionado
function actualizarSeleccion(id) {
  const cont = document.getElementById("productos-container");
  if (!cont) return;

  // Actualizar estado
  seleccionadoId = id;

  // Recorrer tarjetas y aplicar clase/atributos
  const tarjetas = cont.querySelectorAll(".tarjeta-producto");
  tarjetas.forEach(t => {
    const tid = t.getAttribute("data-id");
    const esSeleccionada = (tid === id);
    if (esSeleccionada) {
      t.classList.add("seleccionada");
      t.setAttribute("aria-pressed", "true");
      // Opcional: mover foco a la tarjeta seleccionada
      t.focus();
    } else {
      t.classList.remove("seleccionada");
      t.setAttribute("aria-pressed", "false");
    }
  });

  // Opcional: mostrar mensaje en consola o actualizar otro elemento de la UI
  console.log("Producto seleccionado:", id);
}

// Ejecutar render al cargar el módulo
document.addEventListener("DOMContentLoaded", () => {
  renderizarTarjetas("productos-container");
});

// Ajusta la altura de las imágenes de las tarjetas usando variable CSS
function ajustarAlturaTarjetas(px) {
  // px puede ser número (ej. 300) o string con unidad (ej. "300px")
  const valor = (typeof px === "number") ? `${px}px` : px;
  document.documentElement.style.setProperty('--card-img-height', valor);
}
