/**
 * Onboarding step 1 — pick Hindi or English. Saves to OnboardingContext + i18n.
 */
import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppNavigation } from '../navigation/types'
import { CheckIcon, MapPinIcon, ArrowRight } from '../components/Icons'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../i18n'

import { OnboardingContext } from '../onboarding/OnboardingContext'

export default function Language() {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const [selectedLang, setSelectedLang] = useState<'hindi' | 'english'>('hindi')
  const onboarding = React.useContext(OnboardingContext)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleContinue = async () => {
    const lang = selectedLang === 'hindi' ? 'Hindi' : 'English';
    const i18nLang = selectedLang === 'hindi' ? 'hi' : 'en';
    await changeLanguage(i18nLang)
    if (onboarding) {
      onboarding.setData(prev => ({ ...prev, language: lang }));
    }
    navigation.navigate('Usage', {
      language: lang
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>{t('language.headerTitle')}</Text>
      </View>
      <View style={styles.headerLine} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          <View style={styles.activeProgress} />
          <View style={styles.inactiveProgress} />
          <View style={styles.inactiveProgress} />
          <View style={styles.inactiveProgress} />
          <View style={styles.inactiveProgress} />
        </View>

        {/* Heading */}
        <Text style={styles.mainHeading}>{t('language.title')}</Text>
        <Text style={styles.subHeading}>{t('language.subtitle')}</Text>

        {/* Language Cards Row */}
        <View style={styles.cardsRow}>
          
          {/* Hindi Card */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setSelectedLang('hindi')}
            style={[
              styles.card,
              selectedLang === 'hindi' ? styles.selectedCard : styles.unselectedCard
            ]}
          >
            {/* Selected Checkmark in top-right */}
            {selectedLang === 'hindi' && (
              <View style={styles.checkWrapper}>
                <CheckIcon size={12} color="#000000" />
              </View>
            )}
            
            {/* Popular Badge in top-left */}
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>{t('language.popular')}</Text>
            </View>

            <Text style={[styles.langTextNative, selectedLang === 'hindi' ? styles.selectedText : styles.unselectedText]}>हिंदी</Text>
            <Text style={styles.langTextSub}>{t('language.hindiSub')}</Text>
          </TouchableOpacity>

          {/* English Card */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setSelectedLang('english')}
            style={[
              styles.card,
              selectedLang === 'english' ? styles.selectedCard : styles.unselectedCard
            ]}
          >
            {/* Selected Checkmark in top-right */}
            {selectedLang === 'english' && (
              <View style={styles.checkWrapper}>
                <CheckIcon size={12} color="#000000" />
              </View>
            )}

            <Text style={[styles.langTextNative, selectedLang === 'english' ? styles.selectedText : styles.unselectedText]}>English</Text>
            <Text style={styles.langTextSub}>{t('language.englishSub')}</Text>
          </TouchableOpacity>

        </View>

        {/* Location Recommendation Badge */}
        <View style={styles.recommendationBadge}>
          <MapPinIcon size={14} color="#A78BFA" />
          <Text style={[styles.recommendationText, {marginLeft: 8}]}>{t('language.areaHint')}</Text>
        </View>

      </Animated.View>

      {/* Bottom Button Panel */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8} onPress={handleContinue}>
          <Text style={styles.btnText}>{t('language.continue')}</Text>
          <ArrowRight size={18} color="#FFFFFF" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  headerBar: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerLine: {
    height: 1,
    backgroundColor: '#1E1E2F',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
  },
  activeProgress: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginHorizontal: 3,
  },
  inactiveProgress: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
    marginHorizontal: 3,
  },
  mainHeading: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeading: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 35,
  },
  card: {
    width: '47%',
    height: 120,
    backgroundColor: '#131424',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  unselectedCard: {
    borderColor: '#1E1F35',
  },
  checkWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 12,
    backgroundColor: '#F59E0B',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  popularText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: 'bold',
  },
  langTextNative: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  unselectedText: {
    color: '#FFFFFF',
  },
  langTextSub: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '500',
  },
  recommendationBadge: {
    flexDirection: 'row',
    backgroundColor: '#1E2034',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  recommendationText: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomPanel: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
  continueBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
})
