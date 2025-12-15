const RECENT_STORAGE_KEY = 'recent_by_user';

document.addEventListener('DOMContentLoaded', () => {
    const username = getLoggedUserFromSession();
    initAutoFillUser(username);
    const pageName = window.location.pathname.split('/').pop(); 

    const PACKS_CONFIG = {
        'pack1.html': {
            id: 'PACK1',
            title: 'Servicio nocturno',
            image: 'images/carrusel1.jpg',
        },
        'pack2.html': {
            id: 'PACK2',
            title: 'Servicio marítimo',
            image: 'images/carrusel2.jpg',
        },
        'pack3.html': {
            id: 'PACK3',
            title: 'Servicio aéreo',
            image: 'images/carrusel3.jpg',
        }
    };

    const cfg = PACKS_CONFIG[pageName] || null;

    const bcEl = document.getElementById('packs-breadcrumbs');
    if (bcEl) {
        let homeHref = 'page1.html';
        if (username) {
            homeHref = 'page3.html';
        }

        let html = `<a href="${homeHref}">Home</a> &gt; <span>Packs</span>`;
        if (cfg && cfg.title) {
            html += ` &gt; <strong>${cfg.title}</strong>`;
        }

        bcEl.innerHTML = html;
    }

    if (!username || !cfg) return;

    const visit = {
        id: cfg.id,
        title: cfg.title,
        image: cfg.image,
        url: pageName
    };

    addRecentVisitForUserFromPacks(username, visit);
});



function getLoggedUserFromSession() {
    try {
        return sessionStorage.getItem('logged_user');
    } catch (e) {
        console.warn('No se pudo leer logged_user de sessionStorage:', e);
        return null;
    }
}

function getRecentObjectFromPacks() {
    try {
        const raw = localStorage.getItem(RECENT_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
        console.error('Error leyendo recientes desde localStorage (packs):', e);
        return {};
    }
}

function getRecentForUserFromPacks(username) {
    if (!username) return [];
    const all = getRecentObjectFromPacks();
    const list = all[username];
    return Array.isArray(list) ? list : [];
}

function saveRecentForUserFromPacks(username, list) {
    if (!username) return;
    const all = getRecentObjectFromPacks();
    all[username] = list;
    try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
        console.error('Error guardando recientes en localStorage (packs):', e);
    }
}


function addRecentVisitForUserFromPacks(username, visit) {
    if (!username || !visit || !visit.id) return;

    let list = getRecentForUserFromPacks(username);

    list = list.filter(item => item.id !== visit.id);

    list.unshift(visit);

    if (list.length > 3) {
        list = list.slice(0, 3);
    }

    saveRecentForUserFromPacks(username, list);
}



function parseCaducidad(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return false;

    const hoy = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();      
    const yh = hoy.getFullYear();
    const mh = hoy.getMonth();

    if (y < yh) return false;
    if (y === yh && m < mh) return false;
    return true;
}

const regexCard = /^(visa|mastercard|amex)$/i;
const regexTarjeta = /^(\d{13}|\d{15}|\d{16}|\d{19})$/;

function initAutoFillUser(username) {
    console.log("--- DEBUG START: Intentando autorellenar ---");
    console.log("1. Usuario logueado recibido:", username);

    if (!username) {
        console.warn("❌ No hay usuario logueado, cancelando.");
        return;
    }

    try {
        // 1. Recuperamos la lista de todos los usuarios
        const usersRaw = localStorage.getItem('registered_users');
        console.log("2. String en localStorage (registered_users):", usersRaw);

        if (!usersRaw) {
            console.warn("No se encontró 'registered_users' en localStorage.");
            return;
        }

        const users = JSON.parse(usersRaw);
        console.log("3. Usuarios parseados (Array):", users);

        if (!Array.isArray(users)) {
            console.warn("La data recuperada no es un array.");
            return;
        }

        // 2. Buscamos el objeto del usuario actual
        // IMPORTANTE: Aquí veremos si las claves coinciden
        const user = users.find(u => u.Usuario === username);
        console.log("4. Usuario encontrado en la BBDD:", user);

        if (user) {
            const form = document.forms['compra'];
            console.log("5. Formulario 'compra' encontrado:", form);

            if (!form) {
                console.warn("No se encontró el formulario con name='compra' en el HTML.");
                return;
            }

            // 3. Rellenamos el campo Nombre
            if (form['Nombre']) {
                // Chequeamos qué propiedades tiene el objeto user realmente
                console.log("   -> Propiedad .Nombre:", user.Nombre);
                console.log("   -> Propiedad .Apellidos:", user.Apellidos);

                const nombreCompleto = user.Apellidos ? `${user.Nombre} ${user.Apellidos}` : user.Nombre;
                form['Nombre'].value = nombreCompleto;
                console.log("Campo Nombre rellenado con:", nombreCompleto);
            } else {
                console.warn("No se encontró el input name='Nombre'");
            }

            // 4. Rellenamos el campo Correo
            if (form['Correo']) {
                console.log("   -> Propiedad .Correo:", user.Correo);
                if (user.Correo) {
                    form['Correo'].value = user.Correo;
                    console.log("Campo Correo rellenado con:", user.Correo);
                } else {
                    console.warn("El usuario encontrado no tiene propiedad .Correo");
                }
            } else {
                console.warn("No se encontró el input name='Correo'");
            }
        } else {
            console.warn("No se encontró ningún usuario que coincida con:", username);
            console.log(" -> Revisa si 'Usuario' es la clave correcta en el array del paso 3.");
        }
    } catch (e) {
        console.error("CRASH: Error al intentar autorellenar:", e);
    }
    console.log("--- DEBUG END ---");
}
async function handleCompra(event) {
    event.preventDefault(); 

    const data = new FormData(document.forms["compra"]);

    let esValido = true; 
    
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

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.forms['compra'];
    if (!formulario) return; 

    const inputCantidadAcompanantes = formulario.querySelector('#cantidad_acompanantes');
    const contenedorAcompanantes    = document.getElementById('contenedor_acompanantes');

    const casillaMascota   = formulario.querySelector('#viajo_con_mascota');
    const inputTipoMascota = formulario.querySelector('#tipo_mascota');
    const inputTamanoMascota = formulario.querySelector('#tamano_mascota');

    const casillaAlergias       = formulario.querySelector('#tiene_alergias');
    const textareaDetallesAlergias = formulario.querySelector('#detalles_alergias');

    function pintarAcompanantes() {
        if (!inputCantidadAcompanantes || !contenedorAcompanantes) return;

        let cantidad = parseInt(inputCantidadAcompanantes.value, 10);
        if (isNaN(cantidad) || cantidad < 0) cantidad = 0;

        if (cantidad > 8) cantidad = 8;

        inputCantidadAcompanantes.value = cantidad;
        contenedorAcompanantes.innerHTML = '';

        for (let i = 1; i <= cantidad; i++) {
            const fila = document.createElement('div');
            fila.className = 'fila-acompanante';

            const etiqueta = document.createElement('span');
            etiqueta.textContent = `Acompañante ${i}:`;

            const inputNombre = document.createElement('input');
            inputNombre.type = 'text';
            inputNombre.name = `nombre_acompanante_${i}`;
            inputNombre.placeholder = 'Nombre';
            inputNombre.required = true;

            const inputCorreo = document.createElement('input');
            inputCorreo.type = 'email';
            inputCorreo.name = `correo_acompanante_${i}`;
            inputCorreo.placeholder = 'Correo electrónico';
            inputCorreo.required = true;

            fila.appendChild(etiqueta);
            fila.appendChild(inputNombre);
            fila.appendChild(inputCorreo);
            contenedorAcompanantes.appendChild(fila);
        }
    }

    if (inputCantidadAcompanantes) {
        inputCantidadAcompanantes.addEventListener('input', pintarAcompanantes);
        pintarAcompanantes(); 
    }

    function sincronizarMascota() {
        if (!casillaMascota || !inputTipoMascota || !inputTamanoMascota) return;
        const habilitado = casillaMascota.checked;
        inputTipoMascota.disabled   = !habilitado;
        inputTamanoMascota.disabled = !habilitado;
        if (!habilitado) {
            inputTipoMascota.value = '';
            inputTamanoMascota.value = '';
        }
    }

    if (casillaMascota) {
        casillaMascota.addEventListener('change', sincronizarMascota);
        sincronizarMascota();
    }

    function sincronizarAlergias() {
        if (!casillaAlergias || !textareaDetallesAlergias) return;
        const habilitado = casillaAlergias.checked;
        textareaDetallesAlergias.disabled = !habilitado;
        if (!habilitado) {
            textareaDetallesAlergias.value = '';
        }
    }

    if (casillaAlergias) {
        casillaAlergias.addEventListener('change', sincronizarAlergias);
        sincronizarAlergias();
    }

    formulario.addEventListener('submit', (evento) => {
        let cantidad = 0;
        if (inputCantidadAcompanantes) {
            cantidad = parseInt(inputCantidadAcompanantes.value, 10);
            if (isNaN(cantidad) || cantidad < 0) cantidad = 0;
        }

        if (cantidad > 0 && contenedorAcompanantes) {
            const filas = contenedorAcompanantes.querySelectorAll('.fila-acompanante');
            for (let i = 0; i < cantidad && i < filas.length; i++) {
                const fila = filas[i];
                const inputNombre = fila.querySelector('input[type="text"]');
                const inputCorreo = fila.querySelector('input[type="email"]');

                if (!inputNombre.value.trim() || !inputCorreo.value.trim()) {
                    alert('Por favor, completa el nombre y el correo de todos los acompañantes.');
                    inputNombre.focus();
                    evento.preventDefault();
                    return;
                }
            }
        }

        if (casillaMascota && casillaMascota.checked) {
            if (!inputTipoMascota.value.trim() || !inputTamanoMascota.value.trim()) {
                alert('Indica el tipo y el tamaño de la mascota.');
                inputTipoMascota.focus();
                evento.preventDefault();
                return;
            }
        }

        if (casillaAlergias && casillaAlergias.checked) {
            if (!textareaDetallesAlergias.value.trim()) {
                alert('Describe las intolerancias o alergias de los pasajeros.');
                textareaDetallesAlergias.focus();
                evento.preventDefault();
                return;
            }
        }
    });
    
});
