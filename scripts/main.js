// Slider simple
let index = 0;
carousel();
function carousel() {
  const slides = document.getElementsByClassName("slide");
  for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
  index++;
  if (index > slides.length) index = 1;
  if (slides.length) slides[index - 1].style.display = "block";
  setTimeout(carousel, 4000);
}

// Cargar catálogo y habilitar buscador
const listaCatalogo = document.getElementById("lista-catalogo");
const buscador = document.getElementById("buscador");
let productos = [];

async function cargarCatalogo() {
  try {
    const res = await fetch("catalogo/catalogo.json");
    productos = await res.json();
    renderProductos(productos);
  } catch (err) {
    listaCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Verifica catalogo/catalogo.json</p>";
    console.error(err);
  }
}

function renderProductos(items) {
  if (!Array.isArray(items)) items = [];
  listaCatalogo.innerHTML = "";
  items.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${p.imagen || 'images/recuerdos/foto1.jpg'}" alt="${p.descripcion || ''}">
      <h3>${p.codigo || ''} - ${p.descripcion || ''}</h3>
      <p class="precio">$ ${p.precio || ''}</p>
    `;
    listaCatalogo.appendChild(div);
  });
}

buscador.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  const filtrados = productos.filter(p =>
    (p.codigo || "").toLowerCase().includes(q) ||
    (p.descripcion || "").toLowerCase().includes(q)
  );
  renderProductos(filtrados);
});

// Iniciar
cargarCatalogo();

