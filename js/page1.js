import { loginUser } from './modules/users.mjs';

function handleLogin(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del evento

    const data = new FormData(document.forms["login"]);

    const login_data = {
        "Usuario": data.get("Usuario"),
        "Contraseña": data.get("Contraseña")
    };

    if (loginUser(login_data)) {
        // Guardar usuario logueado en sessionStorage para que page3 lo muestre
        try {
            sessionStorage.setItem('logged_user', login_data.Usuario);
            window.location.href = "page3.html";
        } catch (e) {
            console.warn('No se pudo guardar en sessionStorage:', e);
        }
    } else {
        alert("Usuario o contraseña incorrectos");
    }

}

document.forms["login"].addEventListener("submit", handleLogin);