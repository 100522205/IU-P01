const RECENT_STORAGE_KEY = 'recent_by_user';

document.addEventListener('DOMContentLoaded', () => {
    const username = getLoggedUserFromSession();
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
    const date = new Date(dateString);
    const today = new Date();
    if (today.getFullYear() > date.getFullYear()) {
        return false;
    }
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