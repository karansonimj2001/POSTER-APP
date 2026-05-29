/**
 * i18next setup — supports English (en) and Hindi (hi).
 * Language detected from AsyncStorage (@app_language key or user_data.language).
 * Fallback: English. Call changeLanguage() to switch at runtime.
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from './en.json'
import hi from './hi.json'

const LANG_KEY = '@app_language'

export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANG_KEY, lang)
  await i18n.changeLanguage(lang)
}

const detectLanguage = async () => {
  try {
    const saved = await AsyncStorage.getItem(LANG_KEY)
    if (saved) return saved
    const userData = await AsyncStorage.getItem('user_data')
    if (userData) {
      const parsed = JSON.parse(userData)
      if (parsed.language === 'Hindi') return 'hi'
      if (parsed.language === 'English') return 'en'
    }
  } catch {}
  return 'en'
}

detectLanguage().then(lng => {
  i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, hi: { translation: hi } },
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
})

export default i18n
