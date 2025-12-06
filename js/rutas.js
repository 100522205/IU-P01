/* =========================================
   LÓGICA DE INTERACCIÓN: RUTA Y MAPA
   Archivo: js/rutas.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // Seleccionamos todos los ítems de la línea de tiempo
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Añadimos los eventos de ratón a cada ítem
    timelineItems.forEach(item => {
        
        // Cuando el ratón entra en un paso del timeline
        item.addEventListener('mouseenter', () => {
            // 1. Obtenemos el ID del marcador objetivo (definido en data-target)
            const targetId = item.getAttribute('data-target');
            
            // 2. Buscamos el elemento marcador en el DOM
            const marker = document.getElementById(targetId);
            
            // 3. Si existe, le añadimos la clase que lo resalta
            if(marker) {
                marker.classList.add('active-marker');
            }
        });

        // Cuando el ratón sale del paso del timeline
        item.addEventListener('mouseleave', () => {
            const targetId = item.getAttribute('data-target');
            const marker = document.getElementById(targetId);
            
            if(marker) {
                marker.classList.remove('active-marker');
            }
        });
    });
});