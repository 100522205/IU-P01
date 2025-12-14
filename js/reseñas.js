document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = sessionStorage.getItem('logged_user');
    const params = new URLSearchParams(window.location.search);
    const cityId = params.get('city');

    if (!loggedUser) {
        alert("Debes iniciar sesión para escribir una reseña.");
        window.location.href = 'page1.html';
        return;
    }

    if (!cityId) {
        alert("Error: No se ha especificado la ciudad.");
        window.location.href = 'page3.html'; 
        return;
    }

    const cityNames = {
        "valentine": "Valentine",
        "rhodes": "Rhodes",
        "strawberry": "Strawberry",
        "blackwater": "Blackwater",
        "saint-denis": "Saint-Denis",
        "annesburg": "Annesburg",
        "van-horn": "Van Horn",
        "tumbleweed": "Tumbleweed"
    };

    const cityDisplayName = cityNames[cityId] || cityId;

    const cityNameEl = document.getElementById('city-target-name');
    if (cityNameEl) {
        cityNameEl.textContent = cityDisplayName;
    }

    const bcEl = document.getElementById('review-breadcrumbs');
    if (bcEl) {
        let homeHref = 'page1.html';
        if (loggedUser) {
            homeHref = 'page3.html';
        }

        bcEl.innerHTML = `
            <a href="${homeHref}">Home</a> &gt;
            <span>Descubriendo ciudades</span> &gt;
            <a href="cities.html?id=${encodeURIComponent(cityId)}">${cityDisplayName}</a> &gt;
            <strong>Nueva reseña</strong>
        `;  
    }


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
                star.classList.add('fa-star'); 
                star.style.color = '#d4e157';
            } else {
                star.classList.remove('fa-star');
                star.classList.add('fa-star-o'); 
                star.style.color = '#ccc';
            }
        });
    }

    const btnSubmit = document.getElementById('btn-submit');
    if (btnSubmit) {
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

            const newReview = {
                user: loggedUser,
                stars: currentRating,
                text: text,
                date: new Date().toISOString()
            };

            let allReviews = {};
            try {
                const storedReviews = localStorage.getItem('db_reviews');
                if (storedReviews) {
                    allReviews = JSON.parse(storedReviews);
                }
            } catch (e) {
                console.error("Error leyendo reseñas", e);
                allReviews = {};
            }

            if (!allReviews[cityId]) {
                allReviews[cityId] = [];
            }

            allReviews[cityId].push(newReview);

            localStorage.setItem('db_reviews', JSON.stringify(allReviews));

            alert("¡Reseña publicada con éxito!");
            window.location.href = `cities.html?id=${cityId}`;
        });
    }

    const btnCancel = document.getElementById('btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            window.location.href = `cities.html?id=${cityId}`;
        });
    }
});
