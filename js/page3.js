const FAVORITES_STORAGE_KEY = 'favorites_by_user';
const RECENT_STORAGE_KEY = 'recent_by_user';

document.addEventListener('DOMContentLoaded', () => {
    const nameContainer = document.querySelector('.name_user h2');
    const avatarImg = document.querySelector('.avatar img');
    const cerrarBtn = document.getElementById('Cerrar');

    const loggedUser = getLoggedUser();

    if (nameContainer && loggedUser) {
        nameContainer.textContent = loggedUser;
    }

    loadUserAvatar(loggedUser, avatarImg);

    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', () => {
            try {
                sessionStorage.removeItem('logged_user');
            } catch (e) {
                console.warn('No se pudo eliminar logged_user de sessionStorage:', e);
            }
            window.location.href = 'page1.html';
        });
    }

    initConsejos();

    initFavoriteHearts(loggedUser);
    initRecentSection(loggedUser);
    initCityVisitTracking(loggedUser);
    
});



function getLoggedUser() {
    let logged = null;
    try {
        logged = sessionStorage.getItem('logged_user');
    } catch (e) {
        console.warn('No se pudo leer logged_user de sessionStorage:', e);
        logged = null;
    }
    return logged;
}

function loadUserAvatar(username, imgElement) {
    if (!username || !imgElement) return;

    try {
        const usersString = localStorage.getItem('registered_users');
        if (!usersString) return;

        const users = JSON.parse(usersString);
        if (!Array.isArray(users)) return;

        const user = users.find(u => u.Usuario === username);
        if (user && user.Imagen) {
            imgElement.src = user.Imagen;
        }
    } catch (e) {
        console.error('Error al cargar la imagen de usuario:', e);
    }
}


function initConsejos() {
    const form = document.forms['consejos_form'];
    if (!form) return;

    try {
        const existing = localStorage.getItem('registered_consejos');
        if (existing) {
            const consejos = JSON.parse(existing);
            if (Array.isArray(consejos)) {
                updateConsejosUI(consejos);
            }
        }
    } catch (e) {
        console.error('Error al cargar consejos:', e);
    }

    form.addEventListener('submit', handleConsejo);
}

function handleConsejo(event) {
    event.preventDefault();

    const form = event.target;
    const tituloInput = form['Título_consejo'];
    const consejoInput = form['Consejo'];

    const titulo = tituloInput.value.trim();
    const consejo = consejoInput.value.trim();

    if (titulo.length < 15) {
        alert('El título debe tener al menos 15 caracteres.');
        return;
    }
    if (consejo.length < 30) {
        alert('El consejo debe tener al menos 30 caracteres.');
        return;
    }

    const nuevoConsejo = {
        Título_consejo: titulo,
        Consejo: consejo,
        fecha: new Date().toISOString()
    };

    let lista = [];
    try {
        const existing = localStorage.getItem('registered_consejos');
        if (existing) {
            const parsed = JSON.parse(existing);
            if (Array.isArray(parsed)) {
                lista = parsed;
            }
        }
    } catch (e) {
        console.error('Error leyendo consejos existentes, se reinicia la lista:', e);
        lista = [];
    }

    lista.push(nuevoConsejo);

    try {
        localStorage.setItem('registered_consejos', JSON.stringify(lista));
    } catch (e) {
        console.error('Error guardando consejos en localStorage:', e);
    }

    form.reset();
    updateConsejosUI(lista);

    alert('¡Consejo publicado correctamente!');
}

function updateConsejosUI(consejos) {
    if (!Array.isArray(consejos) || consejos.length === 0) return;

    const primero = document.querySelector('.info4 .primero');
    const segundo = document.querySelector('.info4 .segundo');
    const tercero = document.querySelector('.info4 .tercero');

    const n = consejos.length;

    if (primero && consejos[n - 1]) {
        primero.textContent = consejos[n - 1].Título_consejo;
    }
    if (segundo && consejos[n - 2]) {
        segundo.textContent = consejos[n - 2].Título_consejo;
    }
    if (tercero && consejos[n - 3]) {
        tercero.textContent = consejos[n - 3].Título_consejo;
    }
}


function initFavoriteHearts(loggedUser) {
    if (!loggedUser) return;

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
        console.log('Favoritos guardados para', username, favorites);
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



function initRecentSection(loggedUser) {
    const container = document.querySelector('.recent-list');
    if (!container) return;

    if (!loggedUser) {
        container.innerHTML = '<p class="recent-empty">Inicia sesión para ver tus destinos recientes.</p>';
        return;
    }

    renderRecentForUser(loggedUser, container);
}

function getRecentObject() {
    try {
        const raw = localStorage.getItem(RECENT_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
        console.error('Error leyendo recientes desde localStorage:', e);
        return {};
    }
}

function getRecentForUser(username) {
    if (!username) return [];
    const all = getRecentObject();
    const list = all[username];
    return Array.isArray(list) ? list : [];
}

function saveRecentForUser(username, list) {
    if (!username) return;
    const all = getRecentObject();
    all[username] = list;
    try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
        console.error('Error guardando recientes en localStorage:', e);
    }
}

function addRecentVisitForUser(username, visit) {
    if (!username || !visit || !visit.id) return;

    let list = getRecentForUser(username);

    list = list.filter(item => item.id !== visit.id);
    list.unshift(visit);

    if (list.length > 3) {
        list = list.slice(0, 3);
    }

    saveRecentForUser(username, list);
}

function renderRecentForUser(username, container) {
    const recents = getRecentForUser(username);

    container.innerHTML = '';

    if (!recents.length) {
        const p = document.createElement('p');
        p.className = 'recent-empty';
        p.textContent = 'Todavía no has visitado ningún paquete.';
        container.appendChild(p);
        return;
    }

    recents.forEach(visit => {
        const a = document.createElement('a');
        a.className = 'recent-item';

        a.href = visit.url || '#';

        const img = document.createElement('img');
        img.src = visit.image;
        img.alt = visit.title || 'Destino reciente';
        a.appendChild(img);

        a.addEventListener('click', () => {
            addRecentVisitForUser(username, {
                id: visit.id,
                title: visit.title,
                image: visit.image,
                url: visit.url
            });
        });

        container.appendChild(a);
    });
}



function initCityVisitTracking(loggedUser) {
    if (!loggedUser) return; 

    const cards = document.querySelectorAll('.cuadricula .carrusel_content');
    if (!cards.length) return;

    cards.forEach(card => {
        const nameEl = card.querySelector('.text.name');
        const imgEl = card.querySelector('img');
        const actionEl = card.querySelector('.boton-ver-mas'); 

        if (!nameEl || !imgEl || !actionEl) return;

        const title = nameEl.textContent.trim();
        const imageSrc = imgEl.getAttribute('src') || '';
        const id = 'CITY_' + title.toUpperCase();
        const url = actionEl.getAttribute('href') || '';

        actionEl.addEventListener('click', () => {
            addRecentVisitForUser(loggedUser, {
                id: id,
                title: title,
                image: imageSrc,
                url: url
            });
        });
    });
}




