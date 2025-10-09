import { registerUser } from "./modules/users.mjs";

function handleRegister(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del evento

    const data = new FormData(document.forms["register"]);

    const register_data = [
        {
            "Nombre": data.get("Nombre"),
            "Apellidos": data.get("Apellidos"),
            "Correo": data.get("Correo"),
            "Birthday": data.get("Birthday"),
            "Usuario": data.get("Usuario"),
            "Contraseña": data.get("Contraseña")
        }
    ];

    registerUser(register_data);

    console.log(register_data);

    window.location.href = "page3.html";

}

document.forms["register"].addEventListener("submit", handleRegister);