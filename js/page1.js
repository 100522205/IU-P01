import { loginUser } from './modules/users.mjs';

const FAVORITES_STORAGE_KEY = 'favorites_by_user';


function handleLogin(event) {
    event.preventDefault(); 

    const data = new FormData(document.forms["login"]);

    const login_data = {
        "Usuario": data.get("Usuario"),
        "Contraseña": data.get("Contraseña")
    };

    if (loginUser(login_data)) {
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


function getLoggedUser() {
    try {
        return sessionStorage.getItem('logged_user');
    } catch (e) {
        console.warn('No se pudo leer logged_user de sessionStorage:', e);
        return null;
    }
}

function hideModal(modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}


function getFavoritesObject() {
    try {
        const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
        console.error('Error leyendo favoritos desde localStorage:', e);
        return {};
    }
}

function getFavoritesForUser(username) {
    if (!username) return [];
    const all = getFavoritesObject();
    const favs = all[username];
    return Array.isArray(favs) ? favs : [];
}

function saveFavoritesForUser(username, favorites) {
    if (!username) return;
    const all = getFavoritesObject();
    all[username] = favorites;
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
        console.error('Error guardando favoritos en localStorage:', e);
    }
}

function toggleFavoriteForUser(cityName, icon, username, currentFavorites) {
    let favorites = Array.isArray(currentFavorites) ? currentFavorites.slice() : [];
    const idx = favorites.indexOf(cityName);

    if (idx === -1) {
        favorites.push(cityName);
        icon.classList.add('favorite');
        icon.setAttribute('aria-pressed', 'true');
    } else {
        favorites.splice(idx, 1);
        icon.classList.remove('favorite');
        icon.setAttribute('aria-pressed', 'false');
    }

    saveFavoritesForUser(username, favorites);
    return favorites;
}

function initFavoriteHeartsWhenLogged(loggedUser) {
    const cards = document.querySelectorAll('.cuadricula .carrusel_content');
    if (!cards.length) return;

    let favorites = getFavoritesForUser(loggedUser);

    cards.forEach(card => {
        const nameEl = card.querySelector('.text.name');
        const heartIcon = card.querySelector('.heart i');

        if (!nameEl || !heartIcon) return;

        const cityName = nameEl.textContent.trim();
        if (!cityName) return;

        if (favorites.includes(cityName)) {
            heartIcon.classList.add('favorite');
            heartIcon.setAttribute('aria-pressed', 'true');
        } else {
            heartIcon.setAttribute('aria-pressed', 'false');
        }

        heartIcon.setAttribute('role', 'button');
        heartIcon.setAttribute('aria-label', 'Añadir o quitar de favoritos');

        heartIcon.addEventListener('click', () => {
            favorites = toggleFavoriteForUser(cityName, heartIcon, loggedUser, favorites);
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.forms["login"];
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const loggedUser = getLoggedUser();

    const modal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('modal-login-btn');
    const registerBtn = document.getElementById('modal-register-btn');
    const closeBtn = document.getElementById('modal-close-btn');

    const heartIcons = document.querySelectorAll('.cuadricula .heart i');

    if (loggedUser) {
        initFavoriteHeartsWhenLogged(loggedUser);
    } else {
        heartIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.setAttribute('aria-hidden', 'false');
                } else {
                    alert('Para añadir destinos a favoritos necesitas iniciar sesión o registrarte.');
                }
            });
        });
    }


    if (modal) {
        modal.addEventListener('click', (ev) => {
            if (ev.target === modal) {
                hideModal(modal);
            }
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => hideModal(modal));
    }

    if (loginBtn && modal) {
        loginBtn.addEventListener('click', () => {
            hideModal(modal);
            const userInput = document.getElementById('Usuario');
            if (userInput) {
                userInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                userInput.focus();
            }
        });
    }

    if (registerBtn && modal) {
        registerBtn.addEventListener('click', () => {
            window.location.href = 'page2.html';
        });
    }
});
