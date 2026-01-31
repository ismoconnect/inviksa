import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { auth } from './firebase/config';

i18n
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'fr', // Default language if detection fails or translation missing
        debug: false, // Set to false in production

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        // Backend options
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
            // Custom request to implement simple localStorage caching
            request: async (options, url, payload, callback) => {
                try {
                    // Check localStorage first
                    const I18N_CACHE_VERSION = 'v1.5'; // Bump version to invalidate cache
                    const cacheKey = `i18n_res_${url}`;
                    const cached = localStorage.getItem(cacheKey);

                    if (cached) {
                        try {
                            const { version, data } = JSON.parse(cached);
                            if (version === I18N_CACHE_VERSION) {
                                callback(null, { status: 200, data });
                                return;
                            }
                        } catch (e) {
                            localStorage.removeItem(cacheKey);
                        }
                    }

                    // Fetch from network if not in cache
                    const response = await fetch(url);
                    if (!response.ok) {
                        return callback(new Error(`Failed to load ${url}`), { status: response.status });
                    }
                    const data = await response.json();

                    // Save to cache for next time
                    localStorage.setItem(cacheKey, JSON.stringify({
                        version: I18N_CACHE_VERSION,
                        data
                    }));
                    callback(null, { status: 200, data });
                } catch (error) {
                    console.error('i18n cache error:', error);
                    callback(error, { status: 500 });
                }
            }
        },

        // Detection options
        detection: {
            order: ['path', 'queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'subdomain'],
            lookupQuerystring: 'lang',
            lookupFromPathIndex: 0,
            caches: ['localStorage', 'cookie'],
        },

        // Supported languages
        supportedLngs: ['fr', 'en', 'es', 'it', 'pt', 'de'],
        preload: ['fr'], // Preload default language
        load: 'currentOnly', // Optimized for current language only
    });

// Keep Firebase Auth language in sync with i18next
i18n.on('languageChanged', (lng) => {
    if (auth) {
        auth.languageCode = lng;
        console.log(`Firebase Auth language set to: ${lng}`);
    }
    // Update HTML lang attribute for accessibility and browser detection
    document.documentElement.lang = lng;
});

export default i18n;
