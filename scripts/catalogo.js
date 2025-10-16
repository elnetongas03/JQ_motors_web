// Datos del catálogo (aunque no haya imágenes aún)
const data = [
    {"codigo":"001","descripcion":"Freno delantero","imagen":"images/catalogo/placeholder.png"},
    {"codigo":"002","descripcion":"Filtro de aceite","imagen":"images/catalogo/placeholder.png"},
    {"codigo":"003","descripcion":"Bujía","imagen":"images/catalogo/placeholder.png"}
];

// Contenedor
const listaCatalogo = document.getElementById("lista-catalogo");

// Función para mostrar productos
function mostrarProductos(productos) {
  listaCatalogo.innerHTML = "";
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "producto-card";
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.descripcion}">
      <div class="info">
        <h3>${prod.codigo}</h3>
        <p>${prod.descripcion}</p>
      </div>
    `;
    listaCatalogo.appendChild(card);
  });
}

// Mostrar todos los productos al cargar
mostrarProductos(data);

// Buscador en tiempo real
const buscador = document.getElementById("buscador");
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  const filtrados = data.filter(p =>
    p.codigo.toLowerCase().includes(texto) ||
    p.descripcion.toLowerCase().includes(texto)
  );
  mostrarProductos(filtrados);
});
