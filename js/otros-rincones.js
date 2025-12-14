const DATA_URL = 'ciudades-del-mundo.json';

document.addEventListener('DOMContentLoaded', async () => {
    const titleEl = document.getElementById('otros-title');
    const contentEl = document.getElementById('otros-content');
    const breadcrumbsEl = document.querySelector('.otros-breadcrumbs');

    if (!titleEl || !contentEl || !breadcrumbsEl) return;

    let data;
    try {
        const resp = await fetch(DATA_URL);
        if (!resp.ok) throw new Error('No se pudo cargar el archivo de ciudades');
        data = await resp.json();
    } catch (e) {
        console.error(e);
        contentEl.innerHTML = '<p class="otros-message">Ha ocurrido un error al cargar los datos de las ciudades.</p>';
        return;
    }

    const continents = data && Array.isArray(data.continents) ? data.continents : [];

    const params = new URLSearchParams(window.location.search);
    const continentName = params.get('continent');
    const countryName = params.get('country');
    const cityName = params.get('city');

    if (!continentName) {
        showContinents(continents, titleEl, contentEl, breadcrumbsEl);
        return;
    }

    const continent = continents.find(c => c.name === continentName);
    if (!continent) {
        contentEl.innerHTML = '<p class="otros-message">No se ha encontrado el continente solicitado.</p>';
        buildBreadcrumbs(breadcrumbsEl, { continent: null });
        titleEl.textContent = 'Otros Rincones';
        return;
    }

    if (!countryName) {
        showCountries(continent, titleEl, contentEl, breadcrumbsEl);
        return;
    }

    const country = (continent.countries || []).find(p => p.name === countryName);
    if (!country) {
        contentEl.innerHTML = '<p class="otros-message">No se ha encontrado el país solicitado.</p>';
        buildBreadcrumbs(breadcrumbsEl, { continent: continent.name });
        titleEl.textContent = continent.name;
        return;
    }

    const cities = Array.isArray(country.cities) ? country.cities : [];

    if (!cityName) {
        if (cities.length === 1) {
            showCityDetail(continent, country, cities[0], titleEl, contentEl, breadcrumbsEl);
        } else {
            showCitiesList(continent, country, cities, titleEl, contentEl, breadcrumbsEl);
        }
        return;
    }

    const city = cities.find(ci => ci.name === cityName);
    if (!city) {
        contentEl.innerHTML = '<p class="otros-message">No se ha encontrado la ciudad solicitada.</p>';
        buildBreadcrumbs(breadcrumbsEl, {
            continent: continent.name,
            country: country.name
        });
        titleEl.textContent = country.name;
        return;
    }

    showCityDetail(continent, country, city, titleEl, contentEl, breadcrumbsEl);
});


function showContinents(continents, titleEl, contentEl, breadcrumbsEl) {
    titleEl.textContent = 'Otros Rincones';

    buildBreadcrumbs(breadcrumbsEl, {});

    const grid = document.createElement('div');
    grid.className = 'otros-grid';

    continents.forEach(cont => {
        const card = document.createElement('div');
        card.className = 'otros-card';

        const link = document.createElement('a');
        link.href = `otros-rincones.html?continent=${encodeURIComponent(cont.name)}`;
        link.textContent = cont.name;

        card.appendChild(link);
        grid.appendChild(card);
    });

    contentEl.innerHTML = '';
    contentEl.appendChild(grid);
}

function showCountries(continent, titleEl, contentEl, breadcrumbsEl) {
    titleEl.textContent = continent.name;

    buildBreadcrumbs(breadcrumbsEl, {
        continent: continent.name
    });

    const grid = document.createElement('div');
    grid.className = 'otros-grid';

    (continent.countries || []).forEach(country => {
        const card = document.createElement('div');
        card.className = 'otros-card';

        const cities = Array.isArray(country.cities) ? country.cities : [];

        const link = document.createElement('a');

        if (cities.length === 1) {
            const onlyCity = cities[0];
            link.href = `otros-rincones.html?continent=${encodeURIComponent(continent.name)}&country=${encodeURIComponent(country.name)}&city=${encodeURIComponent(onlyCity.name)}`;
        } else {
            link.href = `otros-rincones.html?continent=${encodeURIComponent(continent.name)}&country=${encodeURIComponent(country.name)}`;
        }

        link.textContent = country.name;

        card.appendChild(link);
        grid.appendChild(card);
    });

    contentEl.innerHTML = '';
    contentEl.appendChild(grid);
}

function showCitiesList(continent, country, cities, titleEl, contentEl, breadcrumbsEl) {
    titleEl.textContent = country.name;

    buildBreadcrumbs(breadcrumbsEl, {
        continent: continent.name,
        country: country.name
    });

    const grid = document.createElement('div');
    grid.className = 'otros-grid';

    cities.forEach(city => {
        const card = document.createElement('div');
        card.className = 'otros-card';

        const link = document.createElement('a');
        link.href = `otros-rincones.html?continent=${encodeURIComponent(continent.name)}&country=${encodeURIComponent(country.name)}&city=${encodeURIComponent(city.name)}`;
        link.textContent = city.name;

        card.appendChild(link);
        grid.appendChild(card);
    });

    contentEl.innerHTML = '';
    contentEl.appendChild(grid);
}

function showCityDetail(continent, country, city, titleEl, contentEl, breadcrumbsEl) {
    titleEl.textContent = city.name;

    buildBreadcrumbs(breadcrumbsEl, {
        continent: continent.name,
        country: country.name,
        city: city.name
    });

    const layout = document.createElement('div');
    layout.className = 'otros-city-layout';

    const desc = document.createElement('div');
    desc.className = 'otros-city-description';
    desc.textContent = city.description || '';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'otros-city-image';

    const img = document.createElement('img');
    img.src = city.image && city.image.url ? city.image.url : '';
    img.alt = city.image && city.image.alt ? city.image.alt : city.name;

    imgWrap.appendChild(img);

    layout.appendChild(desc);
    layout.appendChild(imgWrap);

    contentEl.innerHTML = '';
    contentEl.appendChild(layout);
}

function buildBreadcrumbs(container, levels) {
    container.innerHTML = '';

    const frag = document.createDocumentFragment();

    let homeHref = 'page1.html';
    try {
        const loggedUser = sessionStorage.getItem('logged_user');
        if (loggedUser) {
            homeHref = 'page3.html';
        }
    } catch (e) {
        console.warn('No se pudo comprobar logged_user en sessionStorage:', e);
    }

    const homeLink = document.createElement('a');
    homeLink.href = homeHref;
    homeLink.textContent = 'Home';
    frag.appendChild(homeLink);

    const sep1 = document.createTextNode(' > ');
    frag.appendChild(sep1);

    const rootLink = document.createElement('a');
    rootLink.href = 'otros-rincones.html';
    rootLink.textContent = 'Otros Rincones - Continentes';
    frag.appendChild(rootLink);

    if (!levels || !levels.continent) {
        container.appendChild(frag);
        return;
    }

    const sep2 = document.createTextNode(' > ');
    frag.appendChild(sep2);

    const contSpan = document.createElement('span');
    contSpan.textContent = levels.continent;
    frag.appendChild(contSpan);

    if (!levels.country) {
        container.appendChild(frag);
        return;
    }

    const sep3 = document.createTextNode(' > ');
    frag.appendChild(sep3);

    const countrySpan = document.createElement('span');
    countrySpan.textContent = levels.country;
    frag.appendChild(countrySpan);

    if (!levels.city) {
        container.appendChild(frag);
        return;
    }

    const sep4 = document.createTextNode(' > ');
    frag.appendChild(sep4);

    const citySpan = document.createElement('span');
    citySpan.textContent = levels.city;
    frag.appendChild(citySpan);

    container.appendChild(frag);
}

