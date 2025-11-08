// =========================
// catalogo.js
// =========================

const urlCatalogo = "catalogo/catalogo.json";
const listaCatalogo = document.getElementById("lista-catalogo");
let productosData = [];

// Imágenes por categoría
const imagenCategoria = {
  "tornilleria": "images/categorias/tornilleria.png",
  "balatas": "images/categorias/balatas.png",
  "retenes": "images/categorias/retenes.png",
  "filtro-aceite": "images/categorias/filtro-aceite.png",
  "filtro-aire": "images/categorias/filtro-aire.png",
  "filtro-gasolina": "images/categorias/filtro-gasolina.png",
  "juntas": "images/categorias/juntas.png",
  "manijas": "images/categorias/manijas.png",
  "otros": "images/catalogo/placeholder.png"
};

// Función para descripción automática
function obtenerDescripcion(prod) {
  const desc = prod.descripcion || "";
  const extras = {
    "BALATA": "Juego de balatas con alto rendimiento y durabilidad.",
    "FILTRO": "Filtro de alto flujo para motores Bajaj.",
    "BUJIA": "Bujía optimizada para mejor combustión.",
    "CADENA": "Cadena reforzada para uso continuo."
  };
  for (const key in extras) {
    if (desc.toUpperCase().includes(key)) return desc + " | " + extras[key];
  }
  return desc + " | Refacción original o compatible para motocicletas JQ Motors.";
}

// Función para obtener ruta de imagen de un producto
function getImagenProducto(codigo) {
  if (!codigo) return imagenCategoria["otros"];
  return [
    `images/catalogo/${codigo}.jpg`,
    `images/catalogo/${codigo}.png`
  ][0]; // Devuelve la primera; <img onerror> manejará placeholder
}

// =========================
// Mostrar productos en la lista principal
// =========================
function mostrarProductos(productos) {
  listaCatalogo.innerHTML = "";
  const fragment = document.createDocumentFragment();

  productos.forEach(prod => {
    const rutaImagen = getImagenProducto(prod.codigo);

    const card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
      <img src="${rutaImagen}" alt="${prod.descripcion}" onerror="this.src='images/catalogo/placeholder.png'">
      <div class="info">
        <h3>${prod.codigo}</h3>
        <p>${obtenerDescripcion(prod)}</p>
      </div>
    `;
    fragment.appendChild(card);
  });

  listaCatalogo.appendChild(fragment);
}

// =========================
// Modal de categoría
// =========================
const modal = document.getElementById("modalCatalogo");
const modalCerrar = document.getElementById("modalCerrar");
const modalTitulo = document.getElementById("modalTitulo");
const modalProductos = document.getElementById("modalProductos");

modalCerrar.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target === modal) modal.style.display = "none"; }

function abrirCatalogo(categoria) {
  modalTitulo.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
  modalProductos.innerHTML = "";

  const productosCat = categoria === "todos" 
    ? productosData 
    : productosData.filter(p => (p.categoria || "otros") === categoria);

  productosCat.forEach(prod => {
    const rutaImagen = getImagenProducto(prod.codigo);

    const card = document.createElement("div");
    card.className = "modal-producto";
    card.innerHTML = `
      <img src="${rutaImagen}" alt="${prod.descripcion}" onerror="this.src='images/catalogo/placeholder.png'">
      <h4>${prod.codigo}</h4>
      <p>${prod.descripcion}</p>
    `;
    modalProductos.appendChild(card);
  });

  modal.style.display = "flex";
}

// =========================
// Eventos de botones de categoría
// =========================
const botones = document.querySelectorAll(".sidebar li");
botones.forEach(btn => {
  btn.addEventListener("click", () => {
    botones.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const cat = btn.dataset.cat;
    abrirCatalogo(cat);
    mostrarProductos(cat === "todos" 
      ? productosData 
      : productosData.filter(p => (p.categoria || "otros") === cat)
    );
  });
});

// =========================
// Cargar JSON al iniciar
// =========================
fetch(urlCatalogo)
  .then(res => res.json())
  .then(data => {
    productosData = data;
    mostrarProductos(productosData); // Mostrar todos al inicio
  })
  .catch(err => console.warn("No se pudo cargar catalogo.json", err));
