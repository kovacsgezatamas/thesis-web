import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import localeEnUs from './locale.en-US.json';

i18n.use(initReactI18next).init({
    resources: {
        'en-US': {
            translation: localeEnUs,
        },
    },
    fallbackLng: 'en-US',
    lng: 'en-Us',
    keySeparator: false,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;