/**
 * Onboarding step 2 — choose "For Myself" or "For My Business".
 * Branches to Details (myself) or BusinessSetup (business).
 */
import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppNavigation } from '../navigation/types'
import { CheckIcon, BusinessIcon, FireIcon, ArrowRight, ArrowLeft } from '../components/Icons'
import { useTranslation } from 'react-i18next'
import { OnboardingContext } from '../onboarding/OnboardingContext'

export default function Usage({ route }: any) {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const [selectedUse, setSelectedUse] = useState<'myself' | 'business'>('myself')
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

  const handleContinue = () => {
    const lang = route.params?.language || 'Hindi';
    if (onboarding) {
      if (selectedUse === 'myself') {
        onboarding.setData(prev => ({
          ...prev,
          purpose: 'For Myself',
          businessInfo: undefined // clear business flow data
        }));
      } else {
        onboarding.setData(prev => ({
          ...prev,
          purpose: 'For Business',
          profileInfo: undefined // clear myself flow data
        }));
      }
    }

    if (selectedUse === 'myself') {
      navigation.navigate('Details', {
        language: lang,
        purpose: 'For Myself'
      })
    } else {
      navigation.navigate('BusinessSetup', {
        language: lang,
        purpose: 'For Business'
      })
    }
  }

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('usage.headerTitle')}</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>
      <View style={styles.headerLine} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          <View style={styles.inactiveProgress} />
          <View style={styles.activeProgress} />
          <View style={styles.inactiveProgress} />
          <View style={styles.inactiveProgress} />
          <View style={styles.inactiveProgress} />
        </View>

        {/* Heading */}
        <Text style={styles.mainHeading}>{t('usage.heading')}</Text>
        <Text style={styles.subHeading}>{t('usage.subtitle')}</Text>

        {/* Option Selection Block */}
        <View style={styles.optionsContainer}>
          
          {/* For Myself Option */}
          <TouchableOpacity 
            activeOpacity={0.85}
            onPress={() => setSelectedUse('myself')}
            style={[
              styles.optionCard,
              selectedUse === 'myself' ? styles.selectedCard : styles.unselectedCard
            ]}
          >
            <View style={styles.leftIconContainer}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={require('../../assets/images/user_avatar.png')} 
                  style={styles.avatarImage} 
                />
              </View>
              {/* Profile Badge */}
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>{t('usage.myselfBadge')}</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>{t('usage.myselfTitle')}</Text>
              <Text style={styles.optionDescription}>
                {t('usage.myselfDesc')}
              </Text>
            </View>

            {/* Checkmark indicator */}
            {selectedUse === 'myself' && (
              <View style={styles.checkWrapper}>
                <CheckIcon size={14} color="#000000" />
              </View>
            )}
          </TouchableOpacity>

          {/* For My Business Option */}
          <TouchableOpacity 
            activeOpacity={0.85}
            onPress={() => setSelectedUse('business')}
            style={[
              styles.optionCard,
              selectedUse === 'business' ? styles.selectedCard : styles.unselectedCard,
              { paddingBottom: 38 } // extra padding for bottom sub-label
            ]}
          >
            <View style={styles.leftIconContainer}>
              <View style={styles.storeIconWrapper}>
                <BusinessIcon size={28} color="#FFFFFF" />
              </View>
              {/* Est Badge */}
              <View style={styles.estBadge}>
                <Text style={styles.estBadgeText}>{t('usage.businessBadge')}</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>{t('usage.businessTitle')}</Text>
              <Text style={styles.optionDescription}>
                {t('usage.businessDesc')}
              </Text>
            </View>

            {/* Checkmark indicator */}
            {selectedUse === 'business' && (
              <View style={styles.checkWrapper}>
                <CheckIcon size={14} color="#000000" />
              </View>
            )}

            {/* Hot selection recommendation label */}
            <View style={styles.businessRecommendLabel}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FireIcon size={12} color="#F59E0B" />
                <Text style={[styles.recommendLabelText, {marginLeft: 4}]}>{t('usage.businessHint')}</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>

      </Animated.View>

      {/* Bottom Button Panel */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8} onPress={handleContinue}>
          <Text style={styles.btnText}>{t('usage.continue')}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: '#8B5CF6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backBtnPlaceholder: {
    width: 40,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerLine: {
    height: 1,
    backgroundColor: '#1E1E2F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  optionsContainer: {
    width: '100%',
  },
  optionCard: {
    width: '100%',
    backgroundColor: '#131424',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  leftIconContainer: {
    position: 'relative',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#2D304E',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileBadge: {
    backgroundColor: '#C084FC',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
  },
  profileBadgeText: {
    color: '#1E1B4B',
    fontSize: 7,
    fontWeight: 'bold',
  },
  storeIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#20243C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D304E',
  },
  storeEmoji: {
    fontSize: 28,
  },
  estBadge: {
    backgroundColor: '#1E1E2F',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
  },
  estBadgeText: {
    color: '#F59E0B',
    fontSize: 7,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  optionDescription: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  checkWrapper: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessRecommendLabel: {
    position: 'absolute',
    bottom: 12,
    left: 20,
  },
  recommendLabelText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
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
