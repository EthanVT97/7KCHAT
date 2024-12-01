document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Language toggle
    const languageToggle = document.querySelector('.language-toggle');
    let currentLang = 'my';

    languageToggle.addEventListener('click', () => {
        currentLang = currentLang === 'my' ? 'en' : 'my';
        updateLanguage(currentLang);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

function updateLanguage(lang) {
    // Implementation for language switching will be added later
    console.log(`Switching to ${lang}`);
} 