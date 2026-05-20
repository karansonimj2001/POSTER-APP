import React, { useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image, StatusBar } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height

export default function OnboardingComplete() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()

  const params = route.params || {}
  const name = params.name || 'User1'
  const language = params.language || 'Hindi'
  const state = params.state || 'Bihar'
  const purpose = params.purpose || 'For Myself'
  const isBusiness = purpose === 'For Business'

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
    navigation.navigate('MainApp')
  }

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Onboarding Complete</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>
      <View style={styles.headerLine} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Progress Dots: Hidden for Business flow as per screenshots */}
        {!isBusiness && (
          <View style={styles.progressContainer}>
            <View style={styles.inactiveProgress} />
            <View style={styles.inactiveProgress} />
            <View style={styles.inactiveProgress} />
            <View style={styles.inactiveProgress} />
            <View style={styles.activeProgress} />
          </View>
        )}

        {/* User Profile Avatar with Glow */}
        <View style={[styles.avatarGlowContainer, isBusiness && { marginTop: 40 }]}>
          <View style={styles.avatarGlowOuter}>
            <View style={[styles.avatarBorder, isBusiness ? styles.businessBorder : styles.myselfBorder]}>
              <Image 
                source={
                  isBusiness 
                    ? require('../../assets/images/business_preview_bg.png') // Fallback logo for boutique
                    : require('../../assets/images/user_avatar.png')
                } 
                style={styles.avatarImage} 
              />
            </View>
            
            {/* Verified Gold Badge (Only for Business Flow) */}
            {isBusiness && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>You're all set, {name}!</Text>

        {/* Choices Summary Card */}
        <View style={styles.summaryCard}>
          {/* Name/Business Name Row */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{isBusiness ? 'Business Name:' : 'Name:'}</Text>
            <Text style={styles.rowValue}>{name}</Text>
          </View>
          
          {/* Language Row */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Language:</Text>
            <Text style={styles.rowValue}>{language}</Text>
          </View>

          {/* State Row */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>State:</Text>
            <Text style={styles.rowValue}>{state}</Text>
          </View>

          {/* Purpose Row */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Purpose:</Text>
            <Text style={styles.rowValue}>{purpose}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backBtnPlaceholder: {
    width: 40,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#1E1F35',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
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
  avatarGlowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarGlowOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderWidth: 4,
    borderColor: '#8B5CF6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myselfBorder: {
    borderRadius: 60,
  },
  businessBorder: {
    borderRadius: 24,
    padding: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#0A0A14',
  },
  verifiedText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 36,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#131424',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderColor: '#1E1F35',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowLabel: {
    color: '#8E8FCA',
    fontSize: 15,
    fontWeight: '500',
  },
  rowValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
})