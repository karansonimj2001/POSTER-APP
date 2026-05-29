import React, { useRef, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Animated, Dimensions, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CommonActions } from '@react-navigation/native'
import { useAppNavigation } from '../navigation/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SvgIcon } from '../components/SvgIcon'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'

// Height of screen — used to slide form in from below
const screenHeight = Dimensions.get('window').height

export default function LoginContainer() {
  const { t } = useTranslation()

  const navigation = useAppNavigation()
  const { setUser } = useUser()
  // Starts at screenHeight (offscreen), animates to 0 (onscreen)
  const slideAnim = useRef(new Animated.Value(screenHeight)).current

  // ── State variables ──
  const [ph, setPh] = useState('')      // Phone number entered by user
  const [isOtp, setIsOtp] = useState(false)  // false → phone screen, true → OTP screen
  const [err, setErr] = useState(false)      // Phone number validation error
  const [timer, setTimer] = useState(45)      // Countdown for OTP resend
  const [otpErr, setOtpErr] = useState(false) // Wrong OTP error flag
  const shakeAnim = useRef(new Animated.Value(0)).current  // Shake offset for wrong OTP

  // Shakes the OTP input boxes horizontally when wrong OTP entered
  const triggerShake = () => {
    shakeAnim.setValue(0)
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start()
  }

  const clearOtpErr = () => {
    setOtpErr(false)
  }

  // 4 individual OTP digit values — one per input box
  const [otp1, setOtp1] = useState('')
  const [otp2, setOtp2] = useState('')
  const [otp3, setOtp3] = useState('')
  const [otp4, setOtp4] = useState('')

  // Refs for auto-focusing between OTP input boxes
  const ref1 = useRef<TextInput>(null)
  const ref2 = useRef<TextInput>(null)
  const ref3 = useRef<TextInput>(null)
  const ref4 = useRef<TextInput>(null)

  // Slide entire form content up from bottom on mount
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  // Countdown timer for OTP resend
  // Runs every 1 second, decrements timer. Stops at 0.
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isOtp, timer])

  const handleSubmit = () => {
    if (!isOtp) {
      // ── STEP 1: Send OTP ──
      // Validate phone number: must be exactly 10 digits
      if (ph.length === 10) {
        setErr(false)
        setTimer(45)         // Reset resend countdown to 45s
        setIsOtp(true)       // Switch to OTP screen
      } else {
        setErr(true)         // Show validation error
      }
    } else {
      // ── STEP 2: Verify OTP ──
      const enteredOtp = otp1 + otp2 + otp3 + otp4
      if (enteredOtp === '1234') {  // HARDCODED: any 1234 works (mock auth)
        setOtpErr(false)
        Alert.alert(t('login.successTitle'), t('login.successMessage'), [
          {
            text: "OK",
            onPress: async () => {
              try {
                // Save phone number to UserContext (persisted via AsyncStorage)
                await setUser({ phone: ph })
                // Check if onboarding is already done
                const done = await AsyncStorage.getItem('onboardingDone')
                if (done === 'true') {
                  // Existing user → go directly to MainApp
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'MainApp' }],
                    })
                  )
                } else {
                  // New user → start onboarding flow
                  navigation.navigate('Language')
                }
              } catch (_e) {
                navigation.navigate('Language')
              }
            }
          }
        ])
      } else {
        // Wrong OTP → show error, shake boxes, clear for retry
        setOtpErr(true)
        triggerShake()
        Alert.alert(t('login.errorTitle'), t('login.errorOtpMessage'))
        setOtp1('')
        setOtp2('')
        setOtp3('')
        setOtp4('')
        if (ref1.current) ref1.current.focus()
      }
    }
  }

  // Resend OTP: reset countdown, clear inputs, focus first box
  const handleResend = () => {
    setTimer(45)
    setOtp1('')
    setOtp2('')
    setOtp3('')
    setOtp4('')
    if (ref1.current) ref1.current.focus()
    Alert.alert(t('login.otpSentTitle'), t('login.otpSentMessage', { phone: ph }))
  }

  return (
    <SafeAreaView style={[mystyles.mainWrapper]} edges={['top', 'bottom']}>
      {/* Entire content slides up from bottom on mount */}
      <Animated.View style={[mystyles.contentDiv, { transform: [{ translateY: slideAnim }] }]}>

        {/* ── Logo + Title ── */}
        <View style={{ display: 'flex', alignItems: 'center', marginBottom: 50 }}>
          <View style={mystyles.logo_container}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: '100%', height: '100%', borderRadius: 16 }}
            />
          </View>
          <Text style={mystyles.purpleText}>{t('login.welcome')}</Text>
        </View>

        <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 12 }}>{t('login.enterPhone')}</Text>
        <Text style={{ color: '#94A3B8', fontSize: 15, marginBottom: 20 }}>{t('login.phoneSubtitle')}</Text>

        {/* Secure badge shown only on phone step (not OTP step) */}
        {!isOtp && (
          <View style={mystyles.badge}>
            <Text style={{ color: '#22C55E', fontSize: 10, fontWeight: 'bold' }}>
              <SvgIcon name="lock" size={16} color="#22C55E" /> {t('login.secureBadge')}
            </Text>
          </View>
        )}

        {/* Error / Success messages */}
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1 }} />
          {err && !isOtp && <Text style={{ color: 'red', fontWeight: 'bold' }}>{t('login.incorrectNumber')}</Text>}
          {isOtp && <Text style={{ color: '#A855F7', fontWeight: 'bold' }}><SvgIcon name="check" size={12} color="#A855F7" /> {t('login.otpSent')}</Text>}
        </View>

        {/* ── Phone Input ── */}
        <View style={mystyles.formControl}>
          {ph.length === 10 && !err && <SvgIcon name="indiaFlag" size={16} color="#94A3B8" />}

          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', marginRight: 12 }}>{t('login.countryCode')}</Text>
          <View style={{ width: 1, height: 24, backgroundColor: 'gray', marginRight: 12 }} />
          <TextInput
            style={[mystyles.textInp, err && !isOtp ? { color: 'red' } : undefined]}
            placeholder={t('login.enterNumber')}
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={ph}
            editable={!isOtp}    // Lock phone input once OTP is sent
            maxLength={10}
            onChangeText={(text) => {
              setPh(text)
              setErr(false)     // Clear error when user starts typing
            }}
          />
        </View>

        {/* ── OTP Input (shown after phone is submitted) ── */}
        {isOtp && (
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            {/* shakeAnim causes boxes to shake left-right on wrong OTP */}
            <Animated.View style={{
              flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16,
              transform: [{ translateX: shakeAnim }]
            }}>
              {/* 4 individual digit boxes with auto-focus to next box on typing */}
              <TextInput
                ref={ref1} style={[mystyles.otpBox, otpErr ? { borderColor: '#EF4444', color: '#EF4444' } : undefined]}
                value={otp1} maxLength={1} keyboardType="numeric" textAlign="center" placeholder="-" placeholderTextColor="gray"
                onChangeText={(text) => {
                  setOtp1(text)
                  clearOtpErr()
                  if (text !== '' && ref2.current) ref2.current.focus()  // Auto-advance to next box
                }}
              />
              <TextInput
                ref={ref2} style={[mystyles.otpBox, otpErr ? { borderColor: '#EF4444', color: '#EF4444' } : undefined]}
                value={otp2} maxLength={1} keyboardType="numeric" textAlign="center" placeholder="-" placeholderTextColor="gray"
                onChangeText={(text) => {
                  setOtp2(text)
                  clearOtpErr()
                  if (text !== '' && ref3.current) ref3.current.focus()
                }}
                onKeyPress={({ nativeEvent }) => { if (nativeEvent.key === 'Backspace' && otp2 === '' && ref1.current) ref1.current.focus() }}
              />
              <TextInput
                ref={ref3} style={[mystyles.otpBox, otpErr ? { borderColor: '#EF4444', color: '#EF4444' } : undefined]}
                value={otp3} maxLength={1} keyboardType="numeric" textAlign="center" placeholder="-" placeholderTextColor="gray"
                onChangeText={(text) => {
                  setOtp3(text)
                  clearOtpErr()
                  if (text !== '' && ref4.current) ref4.current.focus()
                }}
                onKeyPress={({ nativeEvent }) => { if (nativeEvent.key === 'Backspace' && otp3 === '' && ref2.current) ref2.current.focus() }}
              />
              <TextInput
                ref={ref4} style={[mystyles.otpBox, otpErr ? { borderColor: '#EF4444', color: '#EF4444' } : undefined]}
                value={otp4} maxLength={1} keyboardType="numeric" textAlign="center" placeholder="-" placeholderTextColor="gray"
                onChangeText={(text) => {
                  setOtp4(text)
                  clearOtpErr()
                }}
                onKeyPress={({ nativeEvent }) => { if (nativeEvent.key === 'Backspace' && otp4 === '' && ref3.current) ref3.current.focus() }}
              />
            </Animated.View>
            {/* Placeholder badge — simulates auto-detecting OTP */}
            <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }}>
              <Text style={{ color: '#22C55E', fontWeight: 'bold' }}>{t('login.otpAutoDetected')}</Text>
            </View>
          </View>
        )}

        {/* ── Submit Button ── */}
        <TouchableOpacity style={mystyles.submitBtn} onPress={handleSubmit}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {isOtp ? t('login.continueBtn') : t('login.sendOtpBtn')}
          </Text>
        </TouchableOpacity>

        {/* ── Footer: Resend OTP or Terms ── */}
        {isOtp ? (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {timer > 0 ? (
              <Text style={{ color: 'gray', fontSize: 13, textAlign: 'center' }}>
                {t('login.resendTimer', { timer: timer < 10 ? `0${timer}` : timer })}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={{ color: '#A855F7', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                  {t('login.resendOtp')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={{ color: 'gray', fontSize: 10, textAlign: 'center' }}>
            {t('login.termsPrefix')}
            <Text style={{ color: '#8B5CF6' }}>{t('login.termsOfService')}</Text> · <Text style={{ color: '#8B5CF6' }}>{t('login.privacyPolicy')}</Text>
          </Text>
        )}

      </Animated.View>
    </SafeAreaView>
  )
}

const mystyles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0F0F13',
  },
  contentDiv: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  logo_container: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#1E1E2E',
    shadowColor: '#A855F7',
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },
  purpleText: {
    color: '#A855F7',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  badge: {
    backgroundColor: '#131A20',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 8,
    marginBottom: 40,
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 16,
    height: 60,
    marginBottom: 24,
  },
  textInp: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  otpBox: {
    width: 60,
    height: 60,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2E1F6E',
    borderRadius: 12,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
})
