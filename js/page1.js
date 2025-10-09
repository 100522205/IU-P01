import { loginUser } from './modules/users.mjs';

function handleLogin(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del evento

    const data = new FormData(document.forms["login"]);

    const login_data = {
        "Usuario": data.get("Usuario"),
        "Contraseña": data.get("Contraseña")
    };

    if (loginUser(login_data)) {
        // Redirigir a la página de inicio
        window.location.href = "page3.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }

}

document.forms["login"].addEventListener("submit", handleLogin);