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

    const errorEmail = document.getElementById('email-error');
    const errorConfirmEmail = document.getElementById('confirm-email-error');
    console.log('Valor leído del input:', register_data.Correo);
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Reiniciamos los mensajes de error
    errorEmail.textContent = '';
    errorConfirmEmail.textContent = '';
    
    let esValido = true; // Una variable para saber si todo está correcto

    if (!regexEmail.test(register_data.Correo)) {
        errorEmail.textContent = 'El formato del email no es válido (ej: nombre@dominio.ext)';
        esValido = false;
    }

    if (register_data.Correo !== register_data.Confirmar) {
        errorConfirmEmail.textContent = 'Los correos electrónicos no coinciden';
        esValido = false;
    }

    if(esValido){
            registerUser(register_data);
        console.log(register_data);
        window.location.href = "page3.html";
    }
    else{
            console.log('El formulario contiene errores.');
        }

}

document.forms["register"].addEventListener("submit", handleRegister);