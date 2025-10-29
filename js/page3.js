// page3.js -- muestra el usuario logueado guardado en localStorage y gestiona cierre de sesión
document.addEventListener('DOMContentLoaded', () => {
    const nameContainer = document.querySelector('.name_user h2');
    const cerrarBtn = document.getElementById('Cerrar');

    // Try localStorage first, fall back to sessionStorage
    let logged = null;
    try { logged = sessionStorage.getItem('logged_user'); } catch (e) { logged = null; }

    if (nameContainer) {
        if (logged) {
            nameContainer.textContent = logged;
        } else {
            // leave fallback text or set a default
            // nameContainer.textContent = 'Usuario';
        }
    }

    // Load user image from registered_users if present (with onerror fallback)
    try {
        if (logged) {
            const raw = localStorage.getItem('registered_users');
            if (raw) {
                const users = JSON.parse(raw);
                if (Array.isArray(users)) {
                    const me = users.find(u => u && u.Usuario === logged);
                    const imgEl = document.querySelector('.user_logo');
                    if (imgEl) {
                        // Ensure fallback to default image if custom image not valid
                        imgEl.onerror = () => { imgEl.src = 'images/User.png'; };
                        if (me && me.Imagen) {
                            console.log('page3: attempting to load user image for', logged, me.Imagen);
                            // Try loading the stored value. It may be a data URL, an absolute/relative URL
                            // or an invalid local path (e.g. C:\fakepath\file.jpg) which won't load in browser.
                            const tryLoad = (src) => {
                                const tester = new Image();
                                tester.onload = () => { imgEl.src = src; };
                                tester.onerror = () => { console.warn('page3: image failed to load:', src); };
                                // Start loading
                                tester.src = src;
                            };

                            // First try the stored value directly
                            tryLoad(me.Imagen);

                            // If it looks like a relative path without leading slash, also try resolving it against the current page
                            try {
                                if (!/^(data:|https?:|\/)/i.test(me.Imagen)) {
                                    const resolved = new URL(me.Imagen, window.location.href).href;
                                    // if resolved is different, try it too
                                    if (resolved && resolved !== me.Imagen) tryLoad(resolved);
                                }
                            } catch (e) {
                                // ignore URL resolution errors
                            }
                        } else {
                            // keep default already in HTML or explicitly set it
                            imgEl.src = imgEl.src || 'images/User.png';
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.warn('No se pudo cargar imagen de usuario desde registered_users:', e);
    }

    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', (ev) => {
            if (confirm('¿Desea cerrar sesión?')) {
                ev.preventDefault();
                try { sessionStorage.removeItem('logged_user'); } catch (e) { /* ignore */ }
                // Opcional: también redirigir al inicio
                window.location.href = 'page1.html';
            }
        });
    }
});

function registerConsejo(consejo) {
    const existingConsejosString = localStorage.getItem('registered_consejos');
    let consejos = [];
    if (existingConsejosString) {
        consejos = JSON.parse(existingConsejosString);
    }
    consejos.push(consejo);
    localStorage.setItem('registered_consejos', JSON.stringify(consejos));
}

function handleConsejo(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del evento
    const data = new FormData(document.forms["consejos_form"]);
    
    const consejo_data = 
        {
            "Título_consejo": data.get("Título_consejo"),
            "Consejo": data.get("Consejo")
        };
    let esValido = true; // Una variable para saber si todo está correcto
    
    let fallos = [];

    const regexTitle = /^.{15,}$/;
    if (!regexTitle.test(consejo_data.Título_consejo)) {
            esValido = false;
            fallos.push("Título del consejo (mín 15 caracteres)");
        }

    const regexConsejo = /^.{30,}$/;
    if (!regexConsejo.test(consejo_data.Consejo)) {
            esValido = false;
            fallos.push("Consejo (mín 30 caracteres)");
        }

    if (!esValido) {
        alert("Errores encontrados:\n- " + fallos.join("\n- "));
    } else {
        registerConsejo(consejo_data);
        window.location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const consejosContainer = document.querySelector('.info4 .primero');
    const consejosContainer2 = document.querySelector('.info4 .segundo');
    const consejosContainer3 = document.querySelector('.info4 .tercero');
    // Load and display registered consejos
    try {
        const existingConsejosString = localStorage.getItem('registered_consejos');
        let consejos = [];
        if (existingConsejosString) {
            consejos = JSON.parse(existingConsejosString);
        }
        if (consejos.length > 0) {
            if (consejosContainer && consejos[consejos.length - 1]) {
                consejosContainer.textContent = consejos[consejos.length - 1].Título_consejo;
            }
            if (consejosContainer2 && consejos[consejos.length - 2]) {
                consejosContainer2.textContent = consejos[consejos.length - 2].Título_consejo;
            }
            if (consejosContainer3 && consejos[consejos.length - 3]) {
                consejosContainer3.textContent = consejos[consejos.length - 3].Título_consejo;
            }
        }
    } catch (e) {
        console.error('Error al cargar consejos:', e);
    }
});

document.forms["consejos_form"].addEventListener("submit", handleConsejo);
