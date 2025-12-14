document.addEventListener('DOMContentLoaded', () => {
    const bcEl = document.querySelector('.breadcrumbs');
    if (bcEl) {
        let homeHref = 'page1.html';
        try {
            if (sessionStorage.getItem('logged_user')) {
                homeHref = 'page3.html';
            }
        } catch (e) {
            console.warn('No se pudo leer logged_user de sessionStorage:', e);
        }


        bcEl.innerHTML = `
            <a href="${homeHref}">Home</a> &gt;
            <a href="pack1.html">Packs</a> &gt;
            <span>Servicio Nocturno</span> &gt;
            <strong>Hoja de ruta</strong>
        `;
    }

    /* ---------- CARRUSEL + MAPA (código que ya tenías) ---------- */
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    
    function updateCarousel(index) {
        items.forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.map-marker').forEach(m => m.classList.remove('active-marker'));
        
        const currentItem = items[index];
        currentItem.classList.add('active');
        
        const targetId = currentItem.getAttribute('data-target');
        const marker = document.getElementById(targetId);
        if (marker) {
            marker.classList.add('active-marker');
        }
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? totalItems - 1 : currentIndex - 1;
            updateCarousel(currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === totalItems - 1) ? 0 : currentIndex + 1;
            updateCarousel(currentIndex);
        });
    }

    if (totalItems > 0) {
        updateCarousel(0);
    }
});
