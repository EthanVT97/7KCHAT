const translations = {
    my: {
        home: 'ပင်မစာမျက်နှာ',
        features: 'အင်္ဂါရပ်များ',
        marketplace: 'ဈေးကွက်',
        support: 'အကူအညီ',
        contact: 'ဆက်သွယ်ရန်',
        getStarted: 'စတင်မည်',
        watchDemo: 'သရုပ်ပြ ကြည့်ရှုရန်',
        // Add more translations
    },
    en: {
        home: 'Home',
        features: 'Features',
        marketplace: 'Marketplace',
        support: 'Support',
        contact: 'Contact',
        getStarted: 'Get Started',
        watchDemo: 'Watch Demo',
        // Add more translations
    }
};

function translatePage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
} 