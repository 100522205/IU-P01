/* =========================================
   LÓGICA NUEVA RESEÑA (CORREGIDO V2)
   Archivo: js/nueva_resena.js (o el nombre que le hayas puesto)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. VERIFICAR SESIÓN Y PARÁMETROS
    const loggedUser = sessionStorage.getItem('logged_user'); // "joseballs"
    const params = new URLSearchParams(window.location.search);
    const cityId = params.get('city');

    // ERROR 1: No hay usuario -> Ir a login (Page 1)
    if (!loggedUser) {
        alert("Debes iniciar sesión para escribir una reseña.");
        window.location.href = 'page1.html';
        return;
    }

    // ERROR 2: No hay ciudad -> Volver a tu perfil (Page 3)
    // CAMBIO AQUÍ: Antes te mandaba a page1, ahora a page3.
    if (!cityId) {
        alert("Error: No se ha especificado la ciudad.");
        window.location.href = 'page3.html'; 
        return;
    }

    // Mostrar nombre de la ciudad
    const cityNames = {
        "valentine": "Valentine", "rhodes": "Rhodes", "strawberry": "Strawberry",
        "blackwater": "Blackwater", "saint-denis": "Saint-Denis", "annesburg": "Annesburg",
        "van-horn": "Van Horn", "tumbleweed": "Tumbleweed"
    };
    
    const cityNameEl = document.getElementById('city-target-name');
    if(cityNameEl) {
        cityNameEl.textContent = cityNames[cityId] || cityId;
    }


    // 2. LÓGICA DE ESTRELLAS
    const stars = document.querySelectorAll('.star');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const value = parseInt(star.getAttribute('data-value'));
            highlightStars(value);
        });

        star.addEventListener('mouseleave', () => {
            highlightStars(currentRating);
        });

        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-value'));
            highlightStars(currentRating);
        });
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            const value = parseInt(star.getAttribute('data-value'));
            if (value <= rating) {
                star.classList.remove('fa-star-o');
                star.classList.add('fa-star'); // Llena
                star.style.color = '#d4e157';
            } else {
                star.classList.remove('fa-star');
                star.classList.add('fa-star-o'); // Vacía
                star.style.color = '#ccc';
            }
        });
    }


    // 3. LÓGICA DE ENVÍO
    const btnSubmit = document.getElementById('btn-submit');
    if(btnSubmit) {
        btnSubmit.addEventListener('click', () => {
            const text = document.getElementById('review-text').value.trim();

            if (currentRating === 0) {
                alert("Por favor, selecciona una puntuación de estrellas.");
                return;
            }
            if (text === "") {
                alert("Por favor, escribe tu opinión.");
                return;
            }

            // Crear objeto reseña
            const newReview = {
                user: loggedUser, // "joseballs"
                stars: currentRating,
                text: text,
                date: new Date().toISOString()
            };

            // Recuperar DB del LocalStorage
            let allReviews = {};
            try {
                const storedReviews = localStorage.getItem('db_reviews');
                if (storedReviews) {
                    allReviews = JSON.parse(storedReviews);
                }
            } catch(e) {
                console.error("Error leyendo reseñas", e);
                allReviews = {};
            }
            
            // Inicializar array si no existe
            if (!allReviews[cityId]) {
                allReviews[cityId] = [];
            }

            // Añadir reseña
            allReviews[cityId].push(newReview);

            // Guardar cambios
            localStorage.setItem('db_reviews', JSON.stringify(allReviews));

            // ÉXITO: Volver a la página de la ciudad para ver tu reseña
            alert("¡Reseña publicada con éxito!");
            window.location.href = `cities.html?id=${cityId}`;
        });
    }


    // 4. BOTÓN CANCELAR
    const btnCancel = document.getElementById('btn-cancel');
    if(btnCancel) {
        btnCancel.addEventListener('click', () => {
            // Cancelar: Volver a la página de la ciudad
            window.location.href = `cities.html?id=${cityId}`;
        });
    }

});