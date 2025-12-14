const citiesStaticData = {
    "valentine": {
        name: "Valentine",
        image: "images/foto1.jpg", 
        description: "Valentine es una bulliciosa ciudad ganadera donde el polvo y el ruido de los establos se mezclan con el bullicio de los viajeros. Entre su feria de caballos, las tabernas repletas de forasteros y los salones de apuestas, cada rincón de Valentine respira el espíritu salvaje del Oeste."
    },
    "rhodes": {
        name: "Rhodes",
        image: "images/foto2.jpg",
        description: "En el corazón de Lemoyne, Rhodes parece atrapada en el tiempo. Rodeada de tierra roja y plantaciones de tabaco, esta ciudad sureña esconde viejas rivalidades familiares bajo una fachada de caballerosidad."
    },
    "strawberry": {
        name: "Strawberry",
        image: "images/foto3.jpg",
        description: "Un pequeño asentamiento maderero en Big Valley que intenta transformarse en un destino turístico de lujo. Con su arquitectura de madera y el río cruzando el centro del pueblo, Strawberry ofrece una estética alpina única."
    },
    "blackwater": {
        name: "Blackwater",
        image: "images/foto4.jpg",
        description: "La joya del progreso en West Elizabeth. Blackwater es una moderna ciudad portuaria con calles pavimentadas, edificios de ladrillo y luz eléctrica. Es el punto de encuentro entre la civilización moderna y la frontera salvaje."
    },
    "saint-denis": {
        name: "Saint-Denis",
        image: "images/foto5.jpg",
        description: "La gran metrópolis del sur. Saint-Denis es un crisol de culturas, industria y comercio en el bayou. Desde sus mansiones lujosas hasta sus fábricas humeantes, la ciudad ofrece tranvías, teatros y sastrerías de alta gama."
    },
    "annesburg": {
        name: "Annesburg",
        image: "images/foto6.jpg",
        description: "Una ciudad minera oscura y cubierta de hollín a orillas del Lannahechee. La vida aquí gira en torno a la mina de carbón, y el aire es denso y difícil de respirar. Una mirada cruda a la industrialización."
    },
    "van-horn": {
        name: "Van Horn",
        image: "images/foto7.jpg",
        description: "Un puesto comercial decrépito donde la ley brilla por su ausencia. Van Horn es refugio de forajidos, contrabandistas y aquellos que no quieren ser encontrados. Entra bajo tu propio riesgo."
    },
    "tumbleweed": {
        name: "Tumbleweed",
        image: "images/foto8.jpg",
        description: "En medio del desierto de New Austin se alza Tumbleweed. Antiguamente próspera, ahora lucha contra el abandono y el clima extremo. Su sheriff es famoso por su mano dura."
    }
};

const initialReviewsSeed = {
    "valentine": [
        { user: "cowboy_joe", stars: 5, date: "2025-04-10", text: "¡El mejor estofado del estado está aquí!" },
        { user: "mary_l", stars: 3, date: "2025-03-12", text: "Demasiado barro en las calles, mis botas se arruinaron." }
    ],
    "rhodes": [
        { user: "gray_fan", stars: 4, text: "Un lugar tranquilo si no te metes en líos de familias." },
        { user: "braithwaite_hater", stars: 2, text: "El calor es insoportable y la gente muy desconfiada." }
    ],
    "strawberry": [
        { user: "tourist_1", stars: 5, text: "Un pueblo de cuento, el río es precioso." },
        { user: "mayor_fan", stars: 1, text: "Todo es muy caro y el alcalde es un pesado." }
    ],
    "blackwater": [
        { user: "dutch_v", stars: 1, text: "Tuvimos un malentendido en el barco. No recomiendo volver pronto." },
        { user: "civilized_man", stars: 5, text: "¡Por fin una ciudad con calles pavimentadas y luz!" }
    ],
    "saint-denis": [
        { user: "swamp_folk", stars: 2, text: "Demasiada gente, demasiados ruidos, prefiero el pantano." },
        { user: "artist_gal", stars: 5, text: "La arquitectura y los teatros son sublimes." }
    ],
    "annesburg": [
        { user: "miner_49", stars: 2, text: "El trabajo es duro y el aire te mata." },
        { user: "arthur_m", stars: 3, text: "Un lugar honesto, aunque deprimente." }
    ],
    "van-horn": [
        { user: "outlaw_king", stars: 5, text: "Aquí nadie hace preguntas. Perfecto para esconderse." },
        { user: "peaceful_guy", stars: 1, text: "Me robaron el caballo nada más llegar. Evitar a toda costa." }
    ],
    "tumbleweed": [
        { user: "sheriff_fan", stars: 5, text: "La ley se respeta aquí. Muy seguro." },
        { user: "desert_rat", stars: 4, text: "Hace calor, pero los atardeceres son increíbles." }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    
    if (!localStorage.getItem('db_reviews')) {
        localStorage.setItem('db_reviews', JSON.stringify(initialReviewsSeed));
    }

    const params = new URLSearchParams(window.location.search);
    const cityId = params.get('id');
    
    const staticInfo = citiesStaticData[cityId];

    const breadcrumbsEl = document.getElementById('cities-breadcrumbs');
    if (breadcrumbsEl) {
        let homeHref = 'page1.html';
        try {
            const loggedUser = sessionStorage.getItem('logged_user');
            if (loggedUser) {
                homeHref = 'page3.html';
            }
        } catch (e) {
            console.warn('No se pudo leer logged_user desde sessionStorage:', e);
        }

        let html = `<a href="${homeHref}">Home</a> &gt; `;

        if (staticInfo && staticInfo.name) {
            html += `<span>Descubriendo ciudades</span> &gt; <strong>${staticInfo.name}</strong>`;
        } else {
            html += `<strong>Descubriendo ciudades</strong>`;
        }

        breadcrumbsEl.innerHTML = html;
    }


    if (staticInfo) {
        document.title = staticInfo.name + " - Mochileros por el Oeste";
        document.getElementById('city-name').textContent = staticInfo.name;
        document.getElementById('city-desc').textContent = staticInfo.description;
        
        const imgEl = document.getElementById('city-image');
        imgEl.src = staticInfo.image; 
        imgEl.onerror = function() { this.src = 'images/cities/default.jpg'; };

        const allReviews = JSON.parse(localStorage.getItem('db_reviews')) || {};
        const cityReviews = allReviews[cityId] || []; 

        const reviewsList = [...cityReviews].reverse();
        
        let currentReviewIndex = 0;
        const container = document.getElementById('single-review-container');
        const prevBtn = document.getElementById('prev-review-btn');
        const nextBtn = document.getElementById('next-review-btn');

        function showReview(index) {
            if (reviewsList.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center; padding: 2rem;">
                        <p style="color:#666;">No hay reseñas todavía.</p>
                        <p style="font-weight:bold;">¡Sé el primero en opinar!</p>
                    </div>
                `;
                if(prevBtn) prevBtn.disabled = true;
                if(nextBtn) nextBtn.disabled = true;
                return;
            }

            const review = reviewsList[index];
            const dateStr = review.date ? new Date(review.date).toLocaleDateString() : '';

            container.innerHTML = `
                <div class="review-header">
                    <span class="review-user">${review.user}</span>
                    <div class="review-stars">${generateStars(review.stars)}</div>
                </div>
                ${dateStr ? `<span class="review-date">${dateStr}</span>` : ''}
                <p class="review-text">"${review.text}"</p>
            `;
            
            if(prevBtn) prevBtn.disabled = false;
            if(nextBtn) nextBtn.disabled = false;
        }

        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (reviewsList.length > 0) {
                    currentReviewIndex--;
                    if (currentReviewIndex < 0) {
                        currentReviewIndex = reviewsList.length - 1; 
                    }
                    showReview(currentReviewIndex);
                }
            });
        }

        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (reviewsList.length > 0) {
                    currentReviewIndex++;
                    if (currentReviewIndex >= reviewsList.length) {
                        currentReviewIndex = 0; 
                    }
                    showReview(currentReviewIndex);
                }
            });
        }

        showReview(0);

    } else {
        const content = document.querySelector('.city-content');
        if(content) content.innerHTML = '<h2>Destino no encontrado</h2><p>Vuelve al inicio para seleccionar una ciudad válida.</p>';
    }

    const loggedUser = sessionStorage.getItem('logged_user');
    
    const btnReview = document.getElementById('btn-add-review');
    const likeBtn = document.getElementById('like-btn');

    if (loggedUser && btnReview) {
        btnReview.classList.remove('hidden');
        
        btnReview.addEventListener('click', () => {
            window.location.href = `reseñas.html?city=${cityId}`; 
        });

        if(likeBtn) {
            likeBtn.addEventListener('click', () => {
                if (likeBtn.classList.contains('fa-heart-o')) {
                    likeBtn.classList.remove('fa-heart-o');
                    likeBtn.classList.add('fa-heart');
                } else {
                    likeBtn.classList.add('fa-heart-o');
                    likeBtn.classList.remove('fa-heart');
                }
            });
        }
    }
});

function generateStars(count) {
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        starsHTML += (i < count) 
            ? '<i class="fa fa-star"></i>' 
            : '<i class="fa fa-star-o" style="color:#ccc;"></i>';
    }
    return starsHTML;
}