const FAVORITES_STORAGE_KEY = 'favorites_by_user';

const CITY_DATA = {
    'VALENTINE':   { image: 'images/foto1.jpg' },
    'RHODES':      { image: 'images/foto2.jpg' },
    'STRAWBERRY':  { image: 'images/foto3.jpg' },
    'BLACKWATER':  { image: 'images/foto4.jpg' },
    'SAINT-DENIS': { image: 'images/foto5.jpg' },
    'ANNESBURG':   { image: 'images/foto6.jpg' },
    'VAN HORN':    { image: 'images/foto7.jpg' },
    'TUMBLEWEED':  { image: 'images/foto8.jpg' }
};

document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = getLoggedUser();

    if (!loggedUser) {
        window.location.href = 'page1.html';
        return;
    }

    const grid = document.querySelector('.favorites-grid');
    const emptyMsg = document.querySelector('.favorites-empty');

    let favorites = getFavoritesForUser(loggedUser);

    if (!favorites.length) {
        showEmptyState(grid, emptyMsg);
        return;
    }

    favorites.forEach(cityName => {
        const card = createFavoriteCard(cityName, loggedUser);
        grid.appendChild(card);
    });

    if (!grid.children.length) {
        showEmptyState(grid, emptyMsg);
    }
});


function getLoggedUser() {
    try {
        return sessionStorage.getItem('logged_user');
    } catch (e) {
        console.warn('No se pudo leer logged_user de sessionStorage:', e);
        return null;
    }
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


function createFavoriteCard(cityName, username) {
    const data = CITY_DATA[cityName] || {};
    const imgSrc = data.image || 'images/foto1.jpg'; 

    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.dataset.cityName = cityName;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = cityName;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'favorite-name';
    nameDiv.textContent = cityName;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'favorite-remove';
    removeBtn.setAttribute('aria-label', `Quitar ${cityName} de favoritos`);
    removeBtn.innerHTML = '<i class="fa fa-heart"></i>';

    removeBtn.addEventListener('click', () => {
        let favorites = getFavoritesForUser(username);
        favorites = favorites.filter(c => c !== cityName);
        saveFavoritesForUser(username, favorites);

        card.remove();

        const grid = document.querySelector('.favorites-grid');
        const emptyMsg = document.querySelector('.favorites-empty');
        if (grid && grid.children.length === 0) {
            showEmptyState(grid, emptyMsg);
        }
    });

    card.appendChild(img);
    card.appendChild(nameDiv);
    card.appendChild(removeBtn);

    return card;
}

function showEmptyState(grid, emptyMsg) {
    if (grid) {
        grid.innerHTML = '';
    }
    if (emptyMsg) {
        emptyMsg.classList.remove('hidden');
    }
}
