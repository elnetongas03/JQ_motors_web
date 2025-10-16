// ===========================================
//  Catálogo dinámico (solo vista - no editable)
// ===========================================

const API_CATALOGO = "data/catalogo.json"; // Ruta del JSON generado desde Excel

async function cargarCatalogo() {
  try {
    const res = await fetch(API_CATALOGO);
    const productos = await res.json();
    const lista = document.getElementById("lista-catalogo");
    lista.innerHTML = "";

    productos.forEach(p => {
      lista.innerHTML += `
        <div class="producto">
            <img src="images/productos/${p.Imagen}" alt="${p.Descripción}">
            <h3>${p.Descripción}</h3>
            <p><b>Código:</b> ${p.Código}</p>
            <p><b>Stock:</b> ${p.Stock}</p>
            <p class="precio">$${p.Precio}</p>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error cargando catálogo:", err);
  }
}

// 🔍 Buscador en tiempo real
document.getElementById("buscador").addEventListener("input", function() {
  const filtro = this.value.toLowerCase();
  document.querySelectorAll(".producto").forEach(card => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(filtro) ? "block" : "none";
  });
});

// ▶️ Inicializar catálogo al cargar
document.addEventListener("DOMContentLoaded", cargarCatalogo);
