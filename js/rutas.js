document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split('/').pop().toLowerCase();
    const PACKS = {
        'ruta2.html': { packPage: 'pack2.html', packTitle: 'Servicio Maritimo' },
        'ruta3.html': { packPage: 'pack3.html', packTitle: 'Servicio Aereo' },
    };

    const info = PACKS[pageName];
    const bcEl = document.querySelector('.breadcrumbs');
    if (bcEl && info) {
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
            <span>Packs</span> &gt;
            <a href="${info.packPage}">${info.packTitle}</a> &gt;
            <strong>Hoja de ruta</strong>
        `;
    }

    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const targetId = item.getAttribute('data-target');
            const marker = document.getElementById(targetId);
            if (marker) {
                marker.classList.add('active-marker');
            }
        });

        item.addEventListener('mouseleave', () => {
            const targetId = item.getAttribute('data-target');
            const marker = document.getElementById(targetId);
            if (marker) {
                marker.classList.remove('active-marker');
            }
        });
    });
});
