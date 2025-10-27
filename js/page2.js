import { registerUser } from "./modules/users.mjs";

function handleRegister(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del evento

    const data = new FormData(document.forms["register"]);

    const register_data = 
        {
            "Nombre": data.get("Nombre"),
            "Apellidos": data.get("Apellidos"),
            "Correo": data.get("Correo"),
            "Confirmar": data.get("Confirmar"),
            "Birthday": data.get("Birthday"),
            "Usuario": data.get("Usuario"),
            "Contraseña": data.get("Contraseña")
        }
    ;
    let esValido = true; // Una variable para saber si todo está correcto
    
    let fallos = [];

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(register_data.Correo)) {
        esValido = false;
        fallos.push("correo");
    }
    if (register_data.Correo !== register_data.Confirmar) {
        esValido = false;
        fallos.push("correo");
    }

    const regexName = /^.{3,}$/;
    if (!regexName.test(register_data.Nombre)) {
            esValido = false;
            fallos.push("name");
        }

    const regexSurnames = /^.{3,}\s+.{3,}$/;
    if (!regexSurnames.test(register_data.Apellidos)) {
            esValido = false;
            fallos.push("apellidos");
        }

    const regexUser = /^.{5,}$/;
    if (!regexUser.test(register_data.Usuario)) {
            esValido = false;
            fallos.push("user");
        }

    const regexPsswrd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!regexPsswrd.test(register_data.Contraseña)) {
            esValido = false;
            fallos.push("psswrd");
        }

    if(esValido){
            registerUser(register_data);
        console.log(register_data);
        window.location.href = "page3.html";
    }
    else{
            console.log('El formulario contiene errores en: '+ fallos);
        }

}

document.forms["register"].addEventListener("submit", handleRegister);