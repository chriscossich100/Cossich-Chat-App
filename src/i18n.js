import i18n from 'i18next';
import eng from './public/locales/en/translation.json'
import esp from './public/locales/es/translation.json'
import { initReactI18next } from 'react-i18next';

console.log('the lang is: ', eng)

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'es',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
        en: {
            translation: eng
        },
        es: {
            translation: esp
        }
    }
  });


export default i18n;