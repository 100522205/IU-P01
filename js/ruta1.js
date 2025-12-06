document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    
    // Función para actualizar la vista (Tarjeta + Mapa)
    function updateCarousel(index) {
        // 1. Quitar clase active de todo
        items.forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.map-marker').forEach(m => m.classList.remove('active-marker'));
        
        // 2. Activar elemento actual del carrusel
        const currentItem = items[index];
        currentItem.classList.add('active');
        
        // 3. Activar marcador correspondiente en el mapa
        const targetId = currentItem.getAttribute('data-target');
        const marker = document.getElementById(targetId);
        if(marker) {
            marker.classList.add('active-marker');
        }
    }

    // Event Listeners para las flechas
    document.getElementById('prevBtn').addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? totalItems - 1 : currentIndex - 1;
        updateCarousel(currentIndex);
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        currentIndex = (currentIndex === totalItems - 1) ? 0 : currentIndex + 1;
        updateCarousel(currentIndex);
    });

    // Inicializar estado (Valentine marcado)
    updateCarousel(0);
});
