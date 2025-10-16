function login() {
  const clave = document.getElementById('clave').value;
  const mensaje = document.getElementById('mensaje');
  
  if (clave === "neto30") {
    window.location.href = "dashboard.html";
  } else {
    mensaje.textContent = "❌ Clave incorrecta";
    mensaje.style.color = "red";
  }
}