const urlCatalogo = "catalogo/catalogo.json"; // JSON
const listaCatalogo = document.getElementById("lista-catalogo");

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

// Función para mostrar productos
function mostrarProductos(productos) {
  listaCatalogo.innerHTML = "";
  productos.forEach(prod => {
    const rutaImagen = prod.imagen 
      ? prod.imagen 
      : (imagenCategoria[prod.categoria] || imagenCategoria["otros"]);

    const card = document.createElement("div");
    card.className = "producto-card";
    card.innerHTML = `
      <img src="${rutaImagen}" alt="${prod.descripcion}">
      <div class="info">
        <h3>${prod.codigo}</h3>
        <p>${prod.descripcion}</p>
      </div>
    `;
    listaCatalogo.appendChild(card);
  });
}

// Cargar datos desde JSON
fetch(urlCatalogo)
  .then(res => res.json())
  .then(data => {
    mostrarProductos(data);

    // Buscador
    const buscador = document.getElementById("buscador");
    if(buscador){
      buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase();
        const filtrados = data.filter(p =>
          p.codigo.toLowerCase().includes(texto) ||
          p.descripcion.toLowerCase().includes(texto)
        );
        mostrarProductos(filtrados);
      });
    }
  })
  .catch(err => {
    console.warn("No se pudo cargar catalogo.json, usando datos internos", err);

    const dataInterna = [
      {"codigo":"001","descripcion":"Producto de ejemplo","categoria":"otros","imagen":""}
    ];
    mostrarProductos(dataInterna);

    // Buscador con datos internos
    const buscador = document.getElementById("buscador");
    if(buscador){
      buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase();
        const filtrados = dataInterna.filter(p =>
          p.codigo.toLowerCase().includes(texto) ||
          p.descripcion.toLowerCase().includes(texto)
        );
        mostrarProductos(filtrados);
      });
    }
  });
