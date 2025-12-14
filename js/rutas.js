document.addEventListener('DOMContentLoaded', () => {
    
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        
        item.addEventListener('mouseenter', () => {
            const targetId = item.getAttribute('data-target');
            
            const marker = document.getElementById(targetId);
            
            if(marker) {
                marker.classList.add('active-marker');
            }
        });

        item.addEventListener('mouseleave', () => {
            const targetId = item.getAttribute('data-target');
            const marker = document.getElementById(targetId);
            
            if(marker) {
                marker.classList.remove('active-marker');
            }
        });
    });
});