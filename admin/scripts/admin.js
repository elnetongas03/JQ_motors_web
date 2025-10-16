// ===============================
// 🔐 Login básico
// ===============================
const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password");
const loginMsg = document.getElementById("login-msg");

// Contraseña del panel
const CLAVE = "neto30"; // Cambia aquí si quieres otra clave

loginBtn.addEventListener("click", () => {
  const pass = passwordInput.value.trim();
  if (pass === CLAVE) {
    loginSection.style.display = "none";
    adminPanel.classList.remove("hidden");
  } else {
    loginMsg.textContent = "❌ Contraseña incorrecta";
    loginMsg.style.color = "red";
  }
});

// ===============================
// 📦 Funcionalidad del catálogo
// ===============================
const loadBtn = document.getElementById("load-btn");
const saveBtn = document.getElementById("save-btn");
const addBtn = document.getElementById("add-btn");
const tableBody = document.querySelector("#catalogo-table tbody");

let catalogo = [];

async function cargarCatalogo() {
  try {
    const res = await fetch("../data/catalogo.json");
    catalogo = await res.json();
    renderTabla();
  } catch (err) {
    alert("⚠️ No se pudo cargar catalogo.json");
    console.error(err);
  }
}

function renderTabla() {
  tableBody.innerHTML = "";
  catalogo.forEach((item, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.codigo}</td>
      <td>${item.descripcion}</td>
      <td>$${item.precio}</td>
      <td><img src="${item.imagen || ''}" width="60"></td>
      <td>
        <button onclick="editar(${i})">✏️</button>
        <button onclick="eliminar(${i})">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

addBtn.addEventListener("click", () => {
  const codigo = prompt("Código del producto:");
  const descripcion = prompt("Descripción:");
  const precio = prompt("Precio:");
  const imagen = prompt("Ruta de imagen (ej: images/recuerdos/foto1.jpg):");
  if (codigo && descripcion && precio) {
    catalogo.push({ codigo, descripcion, precio, imagen });
    renderTabla();
  }
});

window.editar = (i) => {
  const p = catalogo[i];
  const nuevoCodigo = prompt("Nuevo código:", p.codigo);
  const nuevaDesc = prompt("Nueva descripción:", p.descripcion);
  const nuevoPrecio = prompt("Nuevo precio:", p.precio);
  const nuevaImg = prompt("Nueva imagen:", p.imagen);
  catalogo[i] = { codigo: nuevoCodigo, descripcion: nuevaDesc, precio: nuevoPrecio, imagen: nuevaImg };
  renderTabla();
};

window.eliminar = (i) => {
  if (confirm("¿Eliminar este producto?")) {
    catalogo.splice(i, 1);
    renderTabla();
  }
};

saveBtn.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(catalogo, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", "catalogo.json");
  link.click();
});

loadBtn.addEventListener("click", cargarCatalogo);

