// === BASE DE DATOS LUGARES ===
const lugaresDB = [
    "New Hanover", "Tumbleweed", "Emerald Ranch", "Ambarino", "New Austin", 
    "Saint Denis", "Valentine", "Rhodes", "Blackwater", "Strawberry", "Van Horn", 
    "Annesburg", "Fort Wallace", "Flatneck", "Oil Fields", "Bayou Nwa"
];

// === LÓGICA BUSCADOR ===
const inputLugar = document.getElementById("input-lugar");
const listaResultados = document.getElementById("lista-autocompletado");

inputLugar.addEventListener("input", function() {
    let valor = this.value;
    cerrarLista();
    if (!valor) return false;

    lugaresDB.forEach(lugar => {
        if (lugar.substr(0, valor.length).toUpperCase() == valor.toUpperCase()) {
            let item = document.createElement("div");
            item.innerHTML = "<strong>" + lugar.substr(0, valor.length) + "</strong>";
            item.innerHTML += lugar.substr(valor.length);
            item.innerHTML += "<input type='hidden' value='" + lugar + "'>";
            item.addEventListener("click", function() {
                inputLugar.value = this.getElementsByTagName("input")[0].value;
                cerrarLista();
            });
            listaResultados.appendChild(item);
        }
    });
});

function cerrarLista() {
    listaResultados.innerHTML = "";
}

document.addEventListener("click", function (e) {
    if (e.target !== inputLugar) cerrarLista();
});

window.realizarBusqueda = function() {
    const inputLugar = document.getElementById("input-lugar");
    const inputFecha = document.getElementById("input-fecha");
    
    const lugar = inputLugar.value;
    const fecha = inputFecha.value;
    
    // Validar lugar
    if(lugar === "") {
        alert("¡Por favor, elige un destino forastero!");
        inputLugar.focus(); // Pone el cursor en el input
        return; // Detiene la función
    }
    
    // Validar fecha
    if(fecha === "") {
        alert("¡No puedes viajar sin saber cuándo! Elige una fecha.");
        inputFecha.focus();
        return;
    }
    
    // Si todo está bien, guardamos y navegamos
    localStorage.setItem("busquedaLugar", lugar);
    localStorage.setItem("busquedaFecha", fecha);
    
    console.log("Viajando a " + lugar + " en la fecha " + fecha);
    window.location.href = "resultados.html"; 
};


// === LÓGICA CARRUSEL ===
const track = document.querySelector('.carrusel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next'); 
const prevButton = document.querySelector('.prev'); 
let currentIndex = 0;

// Mover al slide
const moveToSlide = (index) => {
    // Calculamos cuánto mover: index * 100%
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    currentIndex = index;
}

// Botón Siguiente
nextButton.addEventListener('click', () => {
    if (currentIndex === slides.length - 1) {
        moveToSlide(0); // Volver al inicio
    } else {
        moveToSlide(currentIndex + 1);
    }
});

// Botón Anterior
prevButton.addEventListener('click', () => {
    if (currentIndex === 0) {
        moveToSlide(slides.length - 1); // Ir al final
    } else {
        moveToSlide(currentIndex - 1);
    }
});