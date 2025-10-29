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
            ev.preventDefault();
            try { sessionStorage.removeItem('logged_user'); } catch (e) { /* ignore */ }
            // Opcional: también redirigir al inicio
            window.location.href = 'page1.html';
        });
    }
});
