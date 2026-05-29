/**
 * Onboarding step 3b (business flow) — enter business name + logo.
 * Saves to OnboardingContext, then navigates to Interests.
 */
import React, { useState, useRef, useEffect, useContext } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, TextInput, Image, StatusBar, Alert } from 'react-native'
import { useAppNavigation } from '../navigation/types'
import { useTranslation } from 'react-i18next'
import { OnboardingContext } from '../onboarding/OnboardingContext'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

// Custom Aperture (Camera Lens) Shutter Icon using pure CSS Shapes
const ApertureIcon = () => {
  return (
    <View style={styles.apertureIconContainer}>
      <View style={styles.apertureRing}>
        {/* Shutter blades rotated and offset to form the aperture lens */}
        <View style={[styles.apertureBlade, { transform: [{ rotate: '0deg' }, { translateY: -6 }] }]} />
        <View style={[styles.apertureBlade, { transform: [{ rotate: '60deg' }, { translateY: -6 }] }]} />
        <View style={[styles.apertureBlade, { transform: [{ rotate: '120deg' }, { translateY: -6 }] }]} />
        <View style={[styles.apertureBlade, { transform: [{ rotate: '180deg' }, { translateY: -6 }] }]} />
        <View style={[styles.apertureBlade, { transform: [{ rotate: '240deg' }, { translateY: -6 }] }]} />
        <View style={[styles.apertureBlade, { transform: [{ rotate: '300deg' }, { translateY: -6 }] }]} />
        {/* Central lens opening */}
        <View style={styles.apertureCenter} />
      </View>
    </View>
  )
}

// Custom Photo/Gallery Icon using pure CSS Shapes
const GalleryIcon = () => {
  return (
    <View style={styles.galleryIconOuter}>
      {/* Sun/Dot */}
      <View style={styles.gallerySun} />
      {/* Mountain 1 (Left) */}
      <View style={styles.galleryMountainLeft} />
      {/* Mountain 2 (Right) */}
      <View style={styles.galleryMountainRight} />
    </View>
  )
}

export default function BusinessSetup({ route }: any) {
  const { t } = useTranslation()
  const navigation = useAppNavigation()
  const onboarding = useContext(OnboardingContext)
  const [businessName, setBusinessName] = useState('')
  const [logoSelected, setLogoSelected] = useState(false)

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
    if (businessName.trim() === '') {
      Alert.alert(t('businessSetup.requiredTitle'), t('businessSetup.requiredMessage'))
      return
    }
    onboarding?.setData(prev => ({ ...prev, businessInfo: { name: businessName, logoSelected } }));
    navigation.navigate('Interests', {
      language: route.params?.language || 'Hindi',
      purpose: route.params?.purpose || 'For Business',
      name: businessName
    })
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleAddLogo = () => {
    setLogoSelected(!logoSelected)
    Alert.alert(t('businessSetup.logoSelTitle'), t('businessSetup.logoSelMessage'))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('businessSetup.headerTitle')}</Text>
      </View>
      <View style={styles.headerLine} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Title & Subtitle */}
        <Text style={styles.mainHeading}>{t('businessSetup.heading')}</Text>
        <Text style={styles.subHeading}>{t('businessSetup.subtitle')}</Text>

        {/* Logo Upload Circle */}
        <View style={styles.logoWrapper}>
          <TouchableOpacity style={styles.logoContainer} activeOpacity={0.85} onPress={handleAddLogo}>
            <View style={styles.dottedOutline}>
              {logoSelected ? (
                <Image source={require('../../assets/images/user_avatar.png')} style={styles.selectedLogoImage} />
              ) : (
                <View style={styles.addLogoInner}>
                  <ApertureIcon />
                  <Text style={styles.addLogoText}>{t('businessSetup.addLogo')}</Text>
                </View>
              )}
              
              {/* Purple Plus Badge */}
              <View style={styles.purplePlusBadge}>
                <Text style={styles.purplePlusText}>+</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Business Name Input Block */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('businessSetup.nameLabel')}</Text>
          <TextInput 
            style={styles.textInput} 
            placeholder={t('businessSetup.namePlaceholder')} 
            placeholderTextColor="#484B68"
            value={businessName}
            onChangeText={setBusinessName}
            maxLength={30}
          />
        </View>

        {/* Trust Booster Recommendation Badge */}
        <View style={styles.trustBadge}>
          <View style={styles.orangeVerticalStrip} />
          <Text style={styles.fireIcon}>🔥</Text>
          <Text style={styles.trustText}>{t('businessSetup.trustTip')}</Text>
        </View>

        {/* Real-time Business Card Preview Block */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>{t('businessSetup.preview')}</Text>
          
          <View style={styles.previewCard}>
            <View style={styles.cardImageWrapper}>
              <Image 
                source={require('../../assets/images/business_preview_bg.png')} 
                style={styles.previewCardBg} 
              />
              <View style={styles.cardOverlay} />

              {/* Logo / Image Box Overlay */}
              <View style={styles.logoPreviewBlock}>
                {logoSelected ? (
                  <Image source={require('../../assets/images/user_avatar.png')} style={styles.previewLogoImage} />
                ) : (
                  <GalleryIcon />
                )}
              </View>

              {/* Business Name */}
              <View style={styles.businessTextWrapper}>
                {businessName.trim() !== '' ? (
                  <Text style={styles.previewNameText}>{businessName}</Text>
                ) : (
                  <View style={styles.skeletonContainer}>
                    <View style={styles.skeletonLineLong} />
                    <View style={styles.skeletonLineShort} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

      </Animated.View>

      {/* Bottom Button Panel */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8} onPress={handleContinue}>
          <Text style={styles.btnText}>{t('businessSetup.continue')}  →</Text>
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
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerLine: {
    height: 1,
    backgroundColor: '#1E1F35',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'stretch',
    paddingTop: 24,
  },
  mainHeading: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8,
  },
  subHeading: {
    color: '#8E8FCA',
    fontSize: 15,
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 28,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 28,
  },
  logoContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dottedOutline: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2.5,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(139, 92, 246, 0.04)',
  },
  addLogoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Custom Aperture Icon styles
  apertureIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  apertureRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  apertureBlade: {
    position: 'absolute',
    width: 2,
    height: 18,
    backgroundColor: '#A78BFA',
  },
  apertureCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0F1021',
    borderWidth: 1.5,
    borderColor: '#A78BFA',
  },
  addLogoText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  selectedLogoImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  purplePlusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#0A0A14',
  },
  purplePlusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#8E8FCA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 58,
    backgroundColor: '#131424',
    borderRadius: 20,
    paddingHorizontal: 18,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1.5,
    borderColor: '#1E1F35',
  },
  trustBadge: {
    flexDirection: 'row',
    backgroundColor: '#131424',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingRight: 16,
    marginBottom: 32,
    position: 'relative',
  },
  orangeVerticalStrip: {
    width: 4,
    height: '100%',
    backgroundColor: '#F59E0B',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  fireIcon: {
    marginLeft: 16,
    marginRight: 10,
    fontSize: 20,
  },
  trustText: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    flex: 1,
  },
  previewContainer: {
    width: '100%',
    marginBottom: 24,
  },
  previewLabel: {
    color: '#8E8FCA',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
  },
  previewCard: {
    width: '100%',
    backgroundColor: '#131424',
    borderRadius: 24,
    padding: 12,
  },
  cardImageWrapper: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  previewCardBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  logoPreviewBlock: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewLogoImage: {
    width: '100%',
    height: '100%',
  },
  // Custom gallery icon styles
  galleryIconOuter: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gallerySun: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  galleryMountainLeft: {
    position: 'absolute',
    bottom: 1,
    left: 2,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.65)',
  },
  galleryMountainRight: {
    position: 'absolute',
    bottom: 1,
    right: 1.5,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.65)',
  },
  businessTextWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  previewNameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  skeletonContainer: {
    justifyContent: 'center',
  },
  skeletonLineLong: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
    width: 100,
    marginBottom: 6,
  },
  skeletonLineShort: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    width: 60,
  },
  bottomPanel: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 10,
    backgroundColor: '#0A0A14',
  },
  continueBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
