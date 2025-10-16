// Ruta del JSON
const urlCatalogo = "data/catalogo.json";

// Contenedor donde se mostrarán los productos
const listaCatalogo = document.getElementById("lista-catalogo");

// Función para mostrar productos
function mostrarProductos(productos) {
  listaCatalogo.innerHTML = ""; // Limpiar antes de mostrar
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "producto-card";
    card.innerHTML = `
      <img src="${prod.imagen ? prod.imagen : 'images/catalogo/placeholder.png'}" alt="${prod.descripcion}">
      <div class="info">
        <h3>${prod.codigo}</h3>
        <p>${prod.descripcion}</p>
      </div>
    `;
    listaCatalogo.appendChild(card);
  });
}

// Cargar JSON y mostrar productos
fetch(urlCatalogo)
  .then(res => res.json())
  .then(data => {
    mostrarProductos(data);

    // Activar buscador
    const buscador = document.getElementById("buscador");
    buscador.addEventListener("input", () => {
      const texto = buscador.value.toLowerCase();
      const filtrados = data.filter(p =>
        p.codigo.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
      );
      mostrarProductos(filtrados);
    });
  })
  .catch(err => {
    listaCatalogo.innerHTML = "<p>Error al cargar el catálogo.</p>";
    console.error(err);
  });

