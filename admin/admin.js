function login() {
    const clave = document.getElementById("clave").value;
    const mensaje = document.getElementById("mensaje");

    // Cambia "1234" por la clave que quieras
    if (clave === "neto30") {
        // Redirige al dashboard
        window.location.href = "dashboard.html";
    } else {
        mensaje.textContent = "Clave incorrecta";
        mensaje.style.color = "red";
    }
}
