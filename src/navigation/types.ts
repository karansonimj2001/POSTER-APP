import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

/**
 * Navigation route param types for the entire app.
 * Replaces `useNavigation<any>()` throughout the codebase.
 */
export type RootStackParamList = {
  Splash: undefined
  Landing: undefined
  Login: undefined
  Language: undefined
  Usage: { language: string }
  BusinessSetup: { language: string; purpose: string }
  Details: { language: string; purpose: string }
  Interests: { language: string; purpose: string; name: string }
  StateSelection: { language: string; purpose: string; name: string }
  OnboardingComplete: { language?: string; purpose?: string; name?: string; state?: string } | undefined
  MainApp: undefined
  Notifications: undefined
  AllTemplates: undefined
  EditProfile: undefined
  DownloadHistory: undefined
  ContactUs: undefined
  HelpCenter: undefined
  PosterDetail: { poster: { type?: 'highlight'; title: string; color?: string; image?: any; category?: string } }
  PosterEditor: { template?: string } | undefined
}

/** Typed navigation hook — use in place of `useNavigation<any>()` */
export function useAppNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>()
}
