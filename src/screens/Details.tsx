import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, TextInput, Image, StatusBar, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height

export default function Details({ route }: any) {
  const navigation = useNavigation<any>()
  const [name, setName] = useState('')
  const [photoSelected, setPhotoSelected] = useState(false)

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
    if (name.trim() === '') {
      Alert.alert("Required", "Please enter your name to continue.")
      return
    }
    navigation.navigate('Interests', {
      language: route.params?.language || 'Hindi',
      purpose: route.params?.purpose || 'For Myself',
      name: name
    })
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleAddPhoto = () => {
    // Mock photo upload
    setPhotoSelected(!photoSelected)
    Alert.alert("Photo Selected", "Profile photo has been linked to your identity card!")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1C" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Details</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>
      <View style={styles.headerLine} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Title & Subtitle */}
        <Text style={styles.mainHeading}>Design Your Identity</Text>
        <Text style={styles.subHeading}>Your photo and name appear on every post{"\n"}you share</Text>

        {/* Photo Upload Circle */}
        <TouchableOpacity style={styles.photoContainer} activeOpacity={0.8} onPress={handleAddPhoto}>
          <View style={styles.dottedOutline}>
            {photoSelected ? (
              <Image source={require('../../assets/images/user_avatar.png')} style={styles.selectedUserImage} />
            ) : (
              <View style={styles.addPhotoInner}>
                <Text style={styles.cameraIcon}>📷</Text>
                <Text style={styles.addPhotoText}>ADD PHOTO</Text>
              </View>
            )}
            
            {/* Orange Plus Badge */}
            <View style={styles.orangePlusBadge}>
              <Text style={styles.orangePlusText}>+</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Name Input Block */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>YOUR NAME</Text>
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter your name" 
            placeholderTextColor="#64748B"
            value={name}
            onChangeText={setName}
            maxLength={25}
          />
        </View>

        {/* Real-time Card Preview Block */}
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewLabel}>PREVIEW</Text>
            <View style={styles.previewUnderline} />
          </View>

          <View style={styles.previewCard}>
            <Image 
              source={require('../../assets/images/bokeh_preview.png')} 
              style={styles.previewCardBg} 
            />
            {/* Dark overlay for readability */}
            <View style={styles.cardOverlay} />

            {/* Star Icon in top-right */}
            <Text style={styles.starIcon}>★</Text>

            {/* User Info inside card (Bottom Left) */}
            <View style={styles.userInfoRow}>
              <View style={styles.userIconCircle}>
                {photoSelected ? (
                  <Image source={require('../../assets/images/user_avatar.png')} style={styles.previewAvatar} />
                ) : (
                  <Text style={styles.userIconChar}>👤</Text>
                )}
              </View>
              <View style={styles.userTextLines}>
                {name.trim() !== '' ? (
                  <Text style={styles.previewNameText}>{name}</Text>
                ) : (
                  <>
                    <View style={styles.skeletonLineLong} />
                    <View style={styles.skeletonLineShort} />
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Engagement Booster Recommendation Badge */}
        <View style={styles.engagementBadge}>
          <Text style={styles.sparkleIcon}>✨</Text>
          <Text style={styles.engagementText}>Posts with your photo get 3x more engagement</Text>
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
    marginBottom: 24,
  },
  photoContainer: {
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
    borderColor: '#7C3AED',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
  },
  addPhotoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 26,
    color: '#A78BFA',
    marginBottom: 6,
  },
  addPhotoText: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: 'bold',
  },
  selectedUserImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  orangePlusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0A0A14',
  },
  orangePlusText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#1E2034',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#2D304E',
  },
  previewContainer: {
    width: '100%',
    marginBottom: 24,
  },
  previewHeader: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  previewLabel: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  previewUnderline: {
    height: 2,
    backgroundColor: '#F59E0B',
    width: '100%',
    marginTop: 4,
  },
  previewCard: {
    width: '100%',
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 16,
  },
  previewCardBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  starIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 20,
    color: '#F59E0B',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    overflow: 'hidden',
  },
  userIconChar: {
    fontSize: 20,
  },
  previewAvatar: {
    width: '100%',
    height: '100%',
  },
  userTextLines: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonLineLong: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
    width: 80,
    marginBottom: 6,
  },
  skeletonLineShort: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    width: 50,
  },
  previewNameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  engagementBadge: {
    flexDirection: 'row',
    backgroundColor: '#1C1917',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  sparkleIcon: {
    marginRight: 8,
    fontSize: 14,
    color: '#F59E0B',
  },
  engagementText: {
    color: '#F59E0B',
    fontSize: 12,
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
