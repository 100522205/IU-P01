const track = document.querySelector('.carrusel-track');
const items = document.querySelectorAll('.carrusel-item');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;
let autoIntervalId = null;

function showSlide(n) {
    if (n < 0) {
        index = items.length - 1;
    } else if (n >= items.length) {
        index = 0;
    } else {
        index = n;
    }

    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
}

function moveSlide() {
    // Evita múltiples intervalos si ya está corriendo
    if (autoIntervalId) return;

    autoIntervalId = setInterval(() => {
        showSlide(index + 1);
    }, 2000);
}

function stopSlide() {
    if (autoIntervalId) {
        clearInterval(autoIntervalId);
        autoIntervalId = null;
    }
}

prevBtn.addEventListener('click', () => {
    showSlide(index - 1);
    // Reiniciar el temporizador si el modo automático está activo
    if (autoIntervalId) {
        stopSlide();
        moveSlide();
    }
});

nextBtn.addEventListener('click', () => {
    showSlide(index + 1);
    if (autoIntervalId) {
        stopSlide();
        moveSlide();
    }
});

// Iniciar el movimiento automático al cargar el script
moveSlide();