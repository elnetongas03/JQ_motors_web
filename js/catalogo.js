const urlCatalogo = "catalogo/catalogo.json"; // JSON
const listaCatalogo = document.getElementById("lista-catalogo");

function mostrarProductos(productos) {
  listaCatalogo.innerHTML = "";
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

fetch(urlCatalogo)
  .then(res => res.json())
  .then(data => {
    mostrarProductos(data);

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
    console.warn("No se pudo cargar catalogo.json, usando datos internos", err);

    const dataInterna = [
      {"codigo":"001","descripcion":"Producto de ejemplo","imagen":""}
    ];
    mostrarProductos(dataInterna);

    const buscador = document.getElementById("buscador");
    buscador.addEventListener("input", () => {
      const texto = buscador.value.toLowerCase();
      const filtrados = dataInterna.filter(p =>
        p.codigo.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
      );
      mostrarProductos(filtrados);
    });
  });

