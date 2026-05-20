import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, TextInput, Image, StatusBar, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height

export default function BusinessSetup() {
  const navigation = useNavigation<any>()
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
      Alert.alert("Required", "Please enter your business name to continue.")
      return
    }
    Alert.alert("Business Setup Completed", `${businessName} setup completed successfully!`, [
      {
        text: "Finish",
        onPress: () => navigation.navigate('MainApp')
      }
    ])
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleAddLogo = () => {
    setLogoSelected(!logoSelected)
    Alert.alert("Logo Selected", "Brand logo has been linked successfully!")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Setup</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>
      <View style={styles.headerLine} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Title & Subtitle */}
        <Text style={styles.mainHeading}>Set Up Your Business</Text>
        <Text style={styles.subHeading}>Your brand logo and name will be added to your{"\n"}business posters</Text>

        {/* Logo Upload Circle */}
        <TouchableOpacity style={styles.logoContainer} activeOpacity={0.8} onPress={handleAddLogo}>
          <View style={styles.dottedOutline}>
            {logoSelected ? (
              <Image source={require('../../assets/images/user_avatar.png')} style={styles.selectedLogoImage} />
            ) : (
              <View style={styles.addLogoInner}>
                <Text style={styles.shutterIcon}>⚙️</Text>
                <Text style={styles.addLogoText}>ADD LOGO</Text>
              </View>
            )}
            
            {/* Purple Plus Badge */}
            <View style={styles.purplePlusBadge}>
              <Text style={styles.purplePlusText}>+</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Business Name Input Block */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Business Name</Text>
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter business name" 
            placeholderTextColor="#64748B"
            value={businessName}
            onChangeText={setBusinessName}
            maxLength={30}
          />
        </View>

        {/* Trust Booster Recommendation Badge */}
        <View style={styles.trustBadge}>
          <View style={styles.orangeVerticalStrip} />
          <Text style={styles.fireIcon}>🔥</Text>
          <Text style={styles.trustText}>Business posts with logo get 4x more{"\n"}customer trust</Text>
        </View>

        {/* Real-time Business Card Preview Block */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>BUSINESS PREVIEW</Text>
          
          <View style={styles.previewCard}>
            <View style={styles.cardImageWrapper}>
              <Image 
                source={require('../../assets/images/business_preview_bg.png')} 
                style={styles.previewCardBg} 
              />
              <View style={styles.cardOverlay} />

              {/* Logo Box */}
              <View style={styles.logoPreviewBlock}>
                {logoSelected ? (
                  <Image source={require('../../assets/images/user_avatar.png')} style={styles.previewLogoImage} />
                ) : (
                  <Text style={styles.placeholderLogoIcon}>🖼️</Text>
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
          <Text style={styles.btnText}>CONTINUE  →</Text>
        </TouchableOpacity>
      </View>

    </View>
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
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 24,
  },
  mainHeading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeading: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dottedOutline: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  addLogoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterIcon: {
    fontSize: 26,
    color: '#A78BFA',
    marginBottom: 6,
  },
  addLogoText: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: 'bold',
  },
  selectedLogoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  purplePlusBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0A0A14',
  },
  purplePlusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#131424',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1.5,
    borderColor: '#1E1F35',
  },
  trustBadge: {
    flexDirection: 'row',
    backgroundColor: '#131424',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingRight: 16,
    marginBottom: 24,
  },
  orangeVerticalStrip: {
    width: 4,
    height: '100%',
    backgroundColor: '#F59E0B',
    position: 'absolute',
    left: 0,
  },
  fireIcon: {
    marginLeft: 16,
    marginRight: 8,
    fontSize: 18,
  },
  trustText: {
    color: '#F59E0B',
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 18,
    flex: 1,
  },
  previewContainer: {
    width: '100%',
    marginBottom: 20,
  },
  previewLabel: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
    borderRadius: 16,
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
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  logoPreviewBlock: {
    position: 'absolute',
    top: 24,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  previewLogoImage: {
    width: '100%',
    height: '100%',
  },
  placeholderLogoIcon: {
    fontSize: 20,
    opacity: 0.8,
  },
  businessTextWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  previewNameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
  continueBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    height: 56,
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
