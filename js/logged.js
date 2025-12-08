// Ensure the 'Inicio' link in the navbar redirects based on session login state.
// If sessionStorage.logged_user exists -> page3.html, otherwise -> page1.html
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(a => {
        if (a.textContent && a.textContent.trim().toLowerCase() === 'inicio') {
            a.addEventListener('click', (ev) => {
                ev.preventDefault();
                const logged = (() => {
                    try { return sessionStorage.getItem('logged_user'); } catch (e) { return null; }
                })();
                if (logged) {
                    window.location.href = 'page3.html';
                } else {
                    window.location.href = 'page1.html';
                }
            });
        }
    });
});