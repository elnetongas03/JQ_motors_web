// =============================
// PANEL ADMIN SEGURO - JQ MOTORS
// =============================

// 🔐 Contraseña del panel
const PASSWORD = "neto30";

// Elementos del DOM
const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");
const tableBody = document.querySelector("#catalogo-table tbody");

// Datos del catálogo
let catalogo = [];

// =============================
// LOGIN
// =============================
loginBtn.addEventListener("click", () => {
  const pass = document.getElementById("password").value;
  if (pass === PASSWORD) {
    loginSection.classList.add("hidden");
    adminPanel.classList.remove("hidden");
  } else {
    loginMsg.textContent = "Contraseña incorrecta ❌";
  }
});

// =============================
// CARGAR CATÁLOGO
// =============================
document.getElementById("load-btn").addEventListener("click", async () => {
  try {
    const res = await fetch("../catalogo/catalogo.json");
    catalogo = await res.json();
    renderTabla();
    alert("Catálogo cargado correctamente ✅");
  } catch (err) {
    alert("Error al cargar catálogo: " + err);
  }
});

// =============================
// GUARDAR CON RESPALDO
// =============================
document.getElementById("save-btn").addEventListener("click", () => {
  try {
    // Fecha y hora actual
    const fecha = new Date();
    const nombreBackup = `catalogo_${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,"0")}-${String(fecha.getDate()).padStart(2,"0")}_${String(fecha.getHours()).padStart(2,"0")}-${String(fecha.getMinutes()).padStart(2,"0")}.json`;

    // 1️⃣ Crear archivo de respaldo
    const backupBlob = new Blob([JSON.stringify(catalogo, null, 2)], { type: "application/json" });
    const backupUrl = URL.createObjectURL(backupBlob);
    const backupLink = document.createElement("a");
    backupLink.href = backupUrl;
    backupLink.download = nombreBackup;
    backupLink.click();
    URL.revokeObjectURL(backupUrl);

    // 2️⃣ Crear archivo actualizado principal
    const mainBlob = new Blob([JSON.stringify(catalogo, null, 2)], { type: "application/json" });
    const mainUrl = URL.createObjectURL(mainBlob);
    const mainLink = document.createElement("a");
    mainLink.href = mainUrl;
    mainLink.download = "catalogo.json";
    mainLink.click();
    URL.revokeObjectURL(mainUrl);

    alert("✅ Catálogo exportado correctamente.\nSe descargó también una copia de seguridad con la fecha actual.");
  } catch (error) {
    alert("❌ Error al guardar el catálogo: " + error);
  }
});

// =============================
// AGREGAR NUEVO PRODUCTO
// =============================
document.getElementById("add-btn").addEventListener("click", () => {
  catalogo.push({ codigo: "", descripcion: "", precio: "", imagen: "" });
  renderTabla();
});

// =============================
// MOSTRAR TABLA
// =============================
function renderTabla() {
  tableBody.innerHTML = "";
  catalogo.forEach((item, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input value="${item.codigo || ''}" onchange="updateCampo(${i}, 'codigo', this.value)"></td>
      <td><input value="${item.descripcion || ''}" onchange="updateCampo(${i}, 'descripcion', this.value)"></td>
      <td><input value="${item.precio || ''}" onchange="updateCampo(${i}, 'precio', this.value)"></td>
      <td><input value="${item.imagen || ''}" onchange="updateCampo(${i}, 'imagen', this.value)"></td>
      <td><button class="delete-btn" onclick="deleteFila(${i})">🗑</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// =============================
// FUNCIONES GLOBALES
// =============================
window.updateCampo = function (i, campo, valor) {
  catalogo[i][campo] = valor;
};

window.deleteFila = function (i) {
  if (confirm("¿Eliminar este producto?")) {
    catalogo.splice(i, 1);
    renderTabla();
  }
};

