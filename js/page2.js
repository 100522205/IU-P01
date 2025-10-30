import { registerUser } from "./modules/users.mjs";

function parseBirthday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
    }
    return 100 >= age && age>= 16;
}


function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

async function handleRegister(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del evento

    const data = new FormData(document.forms["register"]);

    // read file if provided and convert to data URL so it can be JSON.stringified
    const file = (document.getElementById('myfile') || {}).files ? document.getElementById('myfile').files[0] : null;
    let imageData = null;
    if (file) {
        try {
            imageData = await readFileAsDataURL(file);
        } catch (e) {
            console.warn('No se pudo leer la imagen seleccionada:', e);
            imageData = null;
        }
    }

    const register_data = 
        {
            "Nombre": data.get("Nombre"),
            "Apellidos": data.get("Apellidos"),
            "Correo": data.get("Correo"),
            "Confirmar": data.get("Confirmar"),
            "Birthday": data.get("Birthday"),
            "Usuario": data.get("Usuario"),
            "Contraseña": data.get("Contraseña"),
            // store data URL (string) or null
            "Imagen": imageData
        };
    let esValido = true; // Una variable para saber si todo está correcto
    
    let fallos = [];

    const regexName = /^.{3,}$/;
    if (!regexName.test(register_data.Nombre)) {
            esValido = false;
            fallos.push("Nombre (mín 3 caracteres)");
        }

    const regexSurnames = /^.{3,}\s+.{3,}$/;
    if (!regexSurnames.test(register_data.Apellidos)) {
            esValido = false;
            fallos.push("Apellidos (mín 3 caracteres por apellido)");
        }

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(register_data.Correo)) {
        esValido = false;
        fallos.push("Correo electrónico (nombre@dominio.extensión)");
    }
    if (register_data.Correo !== register_data.Confirmar) {
        esValido = false;
        fallos.push("Confirmar correo (no coincide)");
    }

    if (!parseBirthday(register_data.Birthday)) {
            esValido = false;
            fallos.push("Fecha de nacimiento (edad entre 16 y 100 años)");

        }

        const regexUser = /^.{5,}$/;
    if (!regexUser.test(register_data.Usuario)) {
            esValido = false;
            fallos.push("Usuario (mín 5 caracteres)");
        }

    const regexPsswrd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!regexPsswrd.test(register_data.Contraseña)) {
            esValido = false;
            fallos.push("Contraseña (mín 8 caracteres, mayúsculas, minúsculas, 2 números y 1 símbolo)");
        }
    
    if (!register_data.Imagen) {
            esValido = false;
            fallos.push("Imagen de perfil");
        }

    if(esValido){
        if (!data.get("Política")) {
            alert('Debe aceptar la política de privacidad');
        }
        else {
            registerUser(register_data);
            alert('Registro completado con éxito');
            // Guardar usuario logueado en sessionStorage para que page3 lo muestre
            try {
                sessionStorage.setItem('logged_user', register_data.Usuario);
                window.location.href = "page3.html";
            } catch (e) {
                console.warn('No se pudo guardar en sessionStorage:', e);
            }
        }
    }
    else{
            alert('El formulario contiene errores en: '+ ' \n * ' + fallos.join('\n- '));
        }


}

async function disableRegisterButton() {
    if(this.checked){
        document.getElementById("Guardar").disabled = false;
    }
    else{
        document.getElementById("Guardar").disabled = true;
    }
}

document.forms["register"].addEventListener("submit", handleRegister);


document.addEventListener('DOMContentLoaded', disableRegisterButton);

const PolCheckbox = document.getElementById('Política');
PolCheckbox.addEventListener("change", disableRegisterButton);