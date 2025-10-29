function parseCaducidad(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    if (today.getFullYear() > date.getFullYear()) {
        return false;
    }
}

async function handleCompra(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del evento

    const data = new FormData(document.forms["compra"]);

    let esValido = true; // Una variable para saber si todo está correcto
    
    let fallos = [];

    const regexName = /^.{3,}$/;
    if (!regexName.test(data.get("Nombre"))) {
            esValido = false;
            fallos.push("Nombre completo (mín 3 caracteres)");
        }

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(data.get("Correo"))) {
        esValido = false;
        fallos.push("Correo electrónico (nombre@dominio.extensión)");
    }

    const regexCard = /^[visa|mastercard|amex]+$/;
    if (!regexCard.test(data.get("card"))) {
            esValido = false;
            fallos.push("Tipo de tarjeta (sin respuesta)");
        }

    const regexTarjeta = /^\d{13,15,16,19}$/;
    if (!regexTarjeta.test(data.get("tarjeta"))) {
            esValido = false;
            fallos.push("Número de tarjeta (13, 15, 16 o 19 dígitos)");
        }

    const regexTitular = /^.{3,}$/;
    if (!regexTitular.test(data.get("titular"))) {
            esValido = false;
            fallos.push("Nombre del titular (mín 3 caracteres)");
        }

    if (!parseCaducidad(data.get("caducidad"))) {
            esValido = false;
            fallos.push("Fecha de caducidad (tarjeta caducada)");

        }

    const regexCVV = /^\d{3}$/;
    if (!regexCVV.test(data.get("CVV"))) {
            esValido = false;
            fallos.push("CVV (mín 3 dígitos)");
        }

    if(esValido){
        alert('Compra realizada con éxito. ¡Gracias por su compra!');
        window.location.href = "page3.html";
    }
    else{
            alert('El formulario contiene errores en: '+ ' \n * ' + fallos.join('\n * '));
        }


}

document.forms["compra"].addEventListener("submit", handleCompra);

document.forms["compra"].addEventListener("reset", () => {
    document.forms["compra"].reset();
});

// Ensure the 'Inicio' link in the navbar redirects based on session login state.
// If sessionStorage.logged_user exists -> page3.html, otherwise -> page1.html
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(a => {
        if (a.textContent && a.textContent.trim().toLowerCase() === 'inicio') {
            a.addEventListener('click', (ev) => {
                ev.preventDefault();
                const logged = (() => {
                    try { return sessionStorage.getItem('logged_user'); } catch (e) { return null; }
                })();
                if (logged) {
                    window.location.href = 'page3.html';
                } else {
                    window.location.href = 'page1.html';
                }
            });
        }
    });
});