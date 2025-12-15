// 1. LA BASE DE DATOS UNIFICADA
// Aquí están mezcladas las activas y las "Próximamente".
// Solo saldrán si la ciudad buscada está en su lista de 'ubicaciones'.
const experienciasDB = [
    // --- ACTIVAS ---
    {
        titulo: "Servicio Nocturno",
        descripcion: "Descubre New Hanover bajo las estrellas",
        precio: "30$",
        img: "images/carrusel1.jpg", 
        ubicaciones: ["Valentine", "Annesburg", "Van Horn", "Fort Wallace", "Oil Fields", "Emerald Ranch"],
        categoria: "naturaleza", 
        cancelacion: true,
        url: "pack1.html"
    },
    {
        titulo: "Servicio Marítimo",
        descripcion: "La inmensidad de Flat Iron Lake",
        precio: "30$",
        img: "images/carrusel2.jpg",
        ubicaciones: ["Blackwater", "Rhodes", "Flatneck"],
        categoria: "naturaleza",
        cancelacion: true,
        url: "pack2.html"
    },
    {
        titulo: "Servicio Aéreo",
        descripcion: "Lemoyne desde las alturas",
        precio: "150$",
        img: "images/carrusel3.jpg", 
        ubicaciones: ["Bayou Nwa", "Saint Denis", "Rhodes"],
        categoria: "naturaleza",
        cancelacion: false,
        url: "pack3.html"
    },
    
    // --- PRÓXIMAMENTE (Placeholders reales) ---
    {
        titulo: "Saint Denis Tour",
        descripcion: "Lujo y civilización en la gran ciudad",
        precio: "Próximamente",
        img: "images/tour.jpg",
        ubicaciones: ["Saint Denis"],
        categoria: "ciudad",
        cancelacion: true
    },
    {
        titulo: "Caza Mayor",
        descripcion: "Rastrea bestias en el norte salvaje",
        precio: "Próximamente",
        img: "images/caza.jpg",
        ubicaciones: ["Ambarino", "New Austin", "Tumbleweed", "Strawberry", "Valentine"],
        categoria: "naturaleza",
        cancelacion: false
    },
    {
        titulo: "Pesca Legendaria",
        descripcion: "Eventos especiales de pesca",
        precio: "Próximamente",
        img: "images/pesca.jpg",
        ubicaciones: ["Blackwater", "Rhodes", "Flatneck", "Van Horn"],
        categoria: "naturaleza",
        cancelacion: true
    },
    {
        titulo: "Ruta en Tren",
        descripcion: "Increíbles paisajes desde la comodidad del tren",
        precio: "Próximamente",
        img: "images/tren.jpg",
        ubicaciones: ["Blackwater", "Rhodes", "Flatneck", "Saint Denis", "Annesburg", "Valentine"],
        categoria: "ciudad",
        cancelacion: true
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. VARIABLES GLOBALES Y DOM
    const lugarBuscado = localStorage.getItem("busquedaLugar");
    const fechaBuscada = localStorage.getItem("busquedaFecha");
    const titulo = document.getElementById("titulo-busqueda");
    const contenedor = document.getElementById("contenedor-resultados");

    // Inputs Filtros
    const radiosEntorno = document.getElementsByName("filtroEntorno");
    const checkCancelacion = document.getElementById("filtroCancelacion");
    
    // NUEVO: Elementos del Slider
    const sliderMin = document.getElementById("slider-min");
    const sliderMax = document.getElementById("slider-max");
    const txtMin = document.getElementById("precio-min-txt");
    const txtMax = document.getElementById("precio-max-txt");
    const track = document.querySelector(".slider-track");

    // Configuración inicial
    if (!lugarBuscado) {
        titulo.textContent = "No has seleccionado ningún destino.";
        return;
    }
    titulo.textContent = `Experiencias encontradas en: ${lugarBuscado} (${fechaBuscada})`;

    // === LÓGICA DEL SLIDER VISUAL ===
    function actualizarSlider() {
        let valMin = parseInt(sliderMin.value);
        let valMax = parseInt(sliderMax.value);

        // Evitar que se crucen (Mínimo gap de 10$)
        if (valMax - valMin < 10) {
            if (this === sliderMin) {
                sliderMin.value = valMax - 10;
            } else {
                sliderMax.value = valMin + 10;
            }
        }
        
        // Actualizar variables tras la corrección
        valMin = parseInt(sliderMin.value);
        valMax = parseInt(sliderMax.value);

        // Actualizar textos
        txtMin.textContent = valMin;
        txtMax.textContent = valMax + " $";

        // Pintar la barra de color entre los dos puntos
        // Calculamos porcentaje para CSS
        const percentMin = (valMin / sliderMin.max) * 100;
        const percentMax = (valMax / sliderMax.max) * 100;
        
        // Usamos un gradiente lineal para simular el relleno
        track.style.background = `linear-gradient(to right, #d5d5d5 ${percentMin}%, #cb0101 ${percentMin}%, #cb0101 ${percentMax}%, #d5d5d5 ${percentMax}%)`;

        // Llamamos al filtro general
        filtrarYRenderizar();
    }

    // === FUNCIÓN HELPER: EXTRAER PRECIO ===
    function obtenerPrecioNumerico(precioString) {
        // Si es "Próximamente", devolvemos null o un valor especial
        if (precioString === "Próximamente") return null;
        // Quitamos el $ y convertimos a número ("30$" -> 30)
        return parseInt(precioString.replace("$", ""));
    }

    // === FUNCIÓN PRINCIPAL DE FILTRADO ===
    function filtrarYRenderizar() {
        contenedor.innerHTML = "";

        // Valores actuales de filtros
        // 1. Entorno
        let entornoSeleccionado = "todos";
        for (const radio of radiosEntorno) {
            if (radio.checked) entornoSeleccionado = radio.value;
        }
        // 2. Cancelación
        const soloCancelacionGratis = checkCancelacion.checked;
        // 3. Precio (NUEVO)
        const precioMinimo = parseInt(sliderMin.value);
        const precioMaximo = parseInt(sliderMax.value);

        const resultadosFiltrados = experienciasDB.filter(exp => {
            // A. LUGAR
            const coincideLugar = exp.ubicaciones.map(u => u.toUpperCase()).includes(lugarBuscado.toUpperCase());
            if (!coincideLugar) return false;

            // B. ENTORNO
            const coincideEntorno = (entornoSeleccionado === "todos") || (exp.categoria === entornoSeleccionado);

            // C. CANCELACIÓN
            const coincideCancelacion = !soloCancelacionGratis || (exp.cancelacion === true);

            // D. PRECIO (NUEVO)
            const precioNum = obtenerPrecioNumerico(exp.precio);
            let coincidePrecio = false;

            if (precioNum === null) {
                // Es "Próximamente". Decisión: ¿Lo mostramos siempre o solo si el filtro está abierto?
                // Opción A: Solo mostrar si el filtro cubre casi todo el rango (ej. hasta 200)
                // Opción B (Elegida): Ocultar "Próximamente" si estamos filtrando por precio estricto
                // Para que salgan, vamos a asumir que solo salen si NO hemos tocado mucho el filtro
                // O mejor: simplemente los ocultamos si filtramos precio, ya que no tienen precio.
                coincidePrecio = false; 
                
                // Excepción: Si el usuario pone el máximo al tope (200), asumimos que quiere ver todo
                if (precioMaximo === 200) coincidePrecio = true;
            } else {
                coincidePrecio = (precioNum >= precioMinimo && precioNum <= precioMaximo);
            }

            return coincideEntorno && coincideCancelacion && coincidePrecio;
        });

        if (resultadosFiltrados.length > 0) {
            resultadosFiltrados.forEach(exp => {
                const esPlaceholder = exp.precio === "Próximamente";
                crearTarjeta(exp, contenedor, esPlaceholder);
            });
        } else {
            contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; margin-top: 50px;">
                No hay resultados con estos filtros. <br> Intenta ampliar el rango de precio.
            </p>`;
        }
    }

    // LISTENERS
    radiosEntorno.forEach(r => r.addEventListener('change', filtrarYRenderizar));
    checkCancelacion.addEventListener('change', filtrarYRenderizar);
    
    // Listeners del Slider
    sliderMin.addEventListener('input', actualizarSlider);
    sliderMax.addEventListener('input', actualizarSlider);

    // Inicializar visualmente el slider
    actualizarSlider();
});

// Función crearTarjeta se mantiene igual...
function crearTarjeta(datos, padre, esPlaceholder) {
    const card = document.createElement("div");
    card.classList.add("card-horizontal");

    const colorPrecio = esPlaceholder ? "#777" : "#cb0101";

    // LÓGICA DEL BOTÓN:
    let botonHTML;
    
    if (esPlaceholder) {
        // Si es "Próximamente", usamos un botón gris sin enlace
        botonHTML = `<button class="boton-ver-mas" style="background-color: #555; cursor: default;">AVISADME</button>`;
    } else {
        // Si es real, usamos un enlace <a> con la misma clase para que parezca botón
        botonHTML = `<a href="${datos.url}" class="boton-ver-mas">RESERVAR</a>`;
    }

    card.innerHTML = `
        <div class="card-img-side" style="background-image: url('${datos.img}');"></div>
        <div class="card-info-side">
            <div class="card-header-row">
                <h3>${datos.titulo}</h3>
                <span class="precio-tag" style="color: ${colorPrecio}">${datos.precio}</span>
            </div>
            <p class="card-desc">${datos.descripcion}</p>
            <div class="acciones-card">
                ${botonHTML} 
            </div>
        </div>
    `;
    padre.appendChild(card);
}